import { test, expect, type APIRequestContext } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { canonical, type AlphabetDetail, type AlphabetPack } from '../src/alphabet'
import { createHash } from 'node:crypto'

async function post(request: APIRequestContext, path: string, data: unknown) {
  const csrf=await (await request.get('/api/auth/csrf')).json()
  return request.post(path,{headers:{'X-CSRF-TOKEN':csrf.token},data})
}
async function owner(request: APIRequestContext) {
  const credentials={email:'preview-owner@example.test',password:'test-only-long-password'}
  const r=await post(request,'/api/auth/register',{displayName:'Owner',...credentials})
  if(r.status()===400) expect((await post(request,'/api/auth/login',credentials)).ok()).toBeTruthy()
  else expect(r.ok()).toBeTruthy()
}
async function save(request: APIRequestContext, pack: Record<string,unknown>) {
  const r=await request.get(`/api/admin/alphabet/packs/${pack.id}`)
  const existing=r.ok()?await r.json() as AlphabetDetail:null
  const response=await post(request,'/api/admin/alphabet/drafts',{pack,expectedRevision:existing?.revision})
  expect(response.ok(),await response.text()).toBeTruthy()
  return await response.json() as AlphabetDetail
}
async function cmd(request: APIRequestContext,d:AlphabetDetail,action:string,version=d.state.versions.at(-1)!.number) {
  const r=await post(request,`/api/admin/alphabet/packs/${d.id}/${action}`,{expectedRevision:d.revision,version,reason:'Synthetic text-only transport test'})
  expect(r.ok(),await r.text()).toBeTruthy(); return await r.json() as AlphabetDetail
}
const empty=(transcript='')=>({url:'',transcript,speaker:'',variety:'',reviewer:'',reviewEvidence:'',rightsEvidence:'',humanRecording:false,offlineCleared:false})

test('text-only visual practice downloads, resumes and records offline without audio',async({page,request,context})=>{
  await owner(request)
  // Only the existing disposable synthetic fixture receives synthetic review.
  const fixture=JSON.parse(readFileSync(new URL('../../i-tests/Fixtures/alphabet-levantine.json',import.meta.url),'utf8'))
  fixture.textOnly=true; fixture.engineeringFixture=false
  for(const e of fixture.entries) {
    e.nameAudio=empty(e.name);e.soundAudio=empty()
    for(const w of e.examples) w.audio=empty(w.text)
    e.activities=e.activities.filter((a:{kind:string})=>['shape','spot'].includes(a.kind)).map((a:object)=>({...a,audioUrl:null}))
  }
  let d=await save(request,fixture), original=d.state.publishedVersion
  d=await cmd(request,d,'approve');d=await cmd(request,d,'publish')
  try {
    const pack=await (await request.get(`/api/alphabet/packs/${d.id}`)).json() as AlphabetPack
    expect(pack.textOnly).toBe(true)
    expect(createHash('sha256').update(canonical({...pack,contentHash:''})).digest('hex')).toBe(pack.contentHash)
    await page.goto('/#/practice/alphabet');await expect(page.locator('.alphabet-notice')).toContainText('Text only · no recordings')
    await page.locator('.alphabet-letter').first().click()
    await expect(page.getByRole('button',{name:/Play (name|sound|word)/})).toHaveCount(0)
    await page.getByRole('button',{name:'Download alphabet',exact:true}).click()
    await expect(page.getByRole('status')).toContainText('text, forms and visual practice')
    await page.evaluate(async()=>{await navigator.serviceWorker.ready});await context.setOffline(true);await page.reload()
    await expect(page.locator('.alphabet-hero')).toBeVisible()
    await page.getByRole('button',{name:'Practice this letter'}).click()
    const dialog=page.getByRole('dialog');await expect(dialog.getByRole('heading')).toHaveText('Shape recognition')
    await dialog.locator('.alphabet-choices button').first().click();await expect(dialog.getByRole('status')).toContainText('Accepted.')
    await expect.poll(()=>page.evaluate(()=>new Promise<string|null>(resolve=>{const r=indexedDB.open('ismi-offline',3);r.onsuccess=()=>{const db=r.result;const q=db.transaction('snapshots').objectStore('snapshots').get('alphabet-session-v1:guest:levantine');q.onsuccess=()=>{db.close();resolve(q.result?.value?.feedback??null)}}}))).toBe('Synthetic reviewed explanation.')
    await page.reload();await page.getByRole('button',{name:'Resume alphabet practice'}).click()
    await expect(page.getByRole('dialog').getByRole('status')).toContainText('Accepted.')
    await dialog.getByRole('button',{name:'Continue',exact:true}).click();await expect(dialog.getByRole('heading')).toHaveText('Word spotting')
    await dialog.locator('.alphabet-choices button').first().click();await dialog.getByRole('button',{name:'Continue',exact:true}).click()
    await expect(dialog.getByRole('heading')).toHaveText('Practice complete');await expect(dialog).toContainText('2 activities tried.')
    await expect(dialog).not.toContainText('sound self-checks')
  } finally {
    await context.setOffline(false)
    if(original) await cmd(request,d,'rollback',original)
    else await cmd(request,d,'withdraw')
  }
})

for(const course of ['levantine','msa','quranic','khmer','french'] as const) test(`${course} full draft preview: exact text, visual exercises and no public replacement`,async({page,request})=>{
  await owner(page.request)
  const p=JSON.parse(readFileSync(new URL(`../../content/alphabet/text-only/${course}.pack.json`,import.meta.url),'utf8'))
  const catalog=await (await request.get('/api/alphabet')).json()
  const published=catalog.courses.find((c:{courseId:string})=>c.courseId===course)?.packId
  // Reuse a course's disposable DB row if another suite already created one.
  const summaries=await (await page.request.get('/api/admin/alphabet/packs')).json()
  p.id=summaries.find((s:{courseId:string})=>s.courseId===course)?.id??p.id
  const d=await save(page.request,p)
  const validation=await post(page.request,`/api/admin/alphabet/packs/${p.id}/validate`,{version:d.state.versions.at(-1)!.number,expectedRevision:d.revision})
  expect((await validation.json()).isValid).toBe(false)
  await page.goto('/#/account');await page.getByRole('button',{name:/Open curriculum console/}).click()
  await page.getByRole('navigation',{name:'Console sections'}).getByRole('button',{name:'Alphabet',exact:true}).click()
  await page.getByRole('button',{name:`Alphabet — unreviewed text-only draft · ${course} · draft · v${d.state.versions.at(-1)!.number}`,exact:true}).click()
  await page.getByRole('button',{name:'Preview alphabet',exact:true}).click()
  const region=page.getByRole('region',{name:'Private alphabet preview'})
  await expect(region.locator('.alphabet-letter')).toHaveCount(p.entries.length)
  await page.setViewportSize({width:320,height:800});await page.addStyleTag({content:'html { font-size: 24px !important; }'})
  const first=region.locator('.alphabet-letter').first();await first.focus();await page.keyboard.press('Enter')
  await expect(region.locator('.alphabet-detail h2')).toBeFocused()
  await expect(region.locator('.alphabet-word')).toHaveText(p.entries[0].examples.map((w:{text:string})=>w.text))
  await expect(region.getByRole('button',{name:/Play (word|name|sound)/})).toHaveCount(0)
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  await region.getByRole('button',{name:'Practice this letter'}).click();const dialog=region.getByRole('dialog')
  await expect(dialog.getByRole('heading')).toHaveText('Shape recognition');await dialog.locator('.alphabet-choices button').first().click()
  await dialog.getByRole('button',{name:'Continue',exact:true}).click();await expect(dialog.getByRole('heading')).toHaveText('Word spotting')
  await dialog.getByRole('button',{name:'Show explanation'}).click();await expect(dialog.locator('.alphabet-target-mark')).not.toHaveCount(0)
  await page.screenshot({path:`/tmp/ismi-alphabet-text-${course}.png`});await page.keyboard.press('Escape')
  await expect(region.getByRole('button',{name:'Practice this letter'})).toBeFocused()
  const after=await (await request.get('/api/alphabet')).json()
  expect(after.courses.find((c:{courseId:string})=>c.courseId===course)?.packId).toBe(published)
})
