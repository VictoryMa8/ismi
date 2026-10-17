import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'
import type { AlphabetDetail, AlphabetDraftPack, AlphabetEvidence, AlphabetPack } from '../src/alphabet'
import type { CourseId } from '../src/courses'

// Test fixtures never enter a normal/hosted database. Synthetic review and silence only exercise gates/transport.
const pack = (course = 'levantine'): AlphabetDraftPack => ({ ...JSON.parse(readFileSync(new URL(`../../i-tests/Fixtures/alphabet-${course}.json`, import.meta.url), 'utf8')), engineeringFixture: false })
function wave(seed = 0) {
  const b = Buffer.alloc(1644); b.write('RIFF'); b.writeUInt32LE(1636,4); b.write('WAVEfmt ',8); b.writeUInt32LE(16,16); b.writeUInt16LE(1,20); b.writeUInt16LE(1,22); b.writeUInt32LE(8000,24); b.writeUInt32LE(16000,28); b.writeUInt16LE(2,32); b.writeUInt16LE(16,34); b.write('data',36); b.writeUInt32LE(1600,40); b.writeInt16LE(seed,44); return b
}
async function post(request: APIRequestContext, path: string, data: unknown) { const token = await (await request.get('/api/auth/csrf')).json(); return request.post(path, { headers: { 'X-CSRF-TOKEN': token.token }, data }) }
async function owner(request: APIRequestContext) { const credentials = { email: 'preview-owner@example.test', password: 'test-only-long-password' }; const r = await post(request,'/api/auth/register',{displayName:'Owner',...credentials}); if (r.status()===400) expect((await post(request,'/api/auth/login',credentials)).ok()).toBeTruthy(); else expect(r.ok()).toBeTruthy() }
async function audio(request: APIRequestContext, seed=0) { const token=await (await request.get('/api/auth/csrf')).json(); const r=await request.post('/api/admin/curriculum/recordings',{headers:{'X-CSRF-TOKEN':token.token,'Content-Type':'audio/wav'},data:wave(seed)}); expect(r.ok(),await r.text()).toBeTruthy(); return (await r.json()).audioUrl as string }
async function command(request: APIRequestContext, d: AlphabetDetail, action: string, version = d.state.versions.at(-1)!.number) { const r=await post(request,`/api/admin/alphabet/packs/${d.id}/${action}`,{expectedRevision:d.revision,version,reason:'Synthetic browser test'}); expect(r.ok(),await r.text()).toBeTruthy(); return await r.json() as AlphabetDetail }
async function reset(request: APIRequestContext, course = 'levantine') {
  const id=`${course}-test-alphabet`, existing=await request.get(`/api/admin/alphabet/packs/${id}`)
  if (existing.ok()) { let d=await existing.json() as AlphabetDetail; if (d.state.publishedVersion!==1) d=await command(request,d,'rollback',1); return d }
  const url=await audio(request); const content=JSON.parse(JSON.stringify(pack(course)).replaceAll(`/api/recordings/${'0'.repeat(64)}.wav`,url))
  content.entries[0].note += ' Unicode: بَ កា é 👋 & < >.'
  const r=await post(request,'/api/admin/alphabet/drafts',{pack:content}); expect(r.ok(),await r.text()).toBeTruthy(); let d=await r.json() as AlphabetDetail
  d=await command(request,d,'approve'); return command(request,d,'publish')
}
async function snapshots(page: Page) { return page.evaluate(() => new Promise<{key:string;value:unknown}[]>((resolve,reject)=>{const r=indexedDB.open('ismi-offline',3);r.onsuccess=()=>{const db=r.result; const q=db.transaction('snapshots').objectStore('snapshots').getAll();q.onsuccess=()=>{db.close();resolve(q.result)};q.onerror=()=>reject(q.error)};r.onerror=()=>reject(r.error)})) }
async function evidence(page: Page, scope='guest', course='levantine') { return (await snapshots(page)).find(s=>s.key===`alphabet-evidence-v1:${scope}:${course}`)?.value as AlphabetEvidence[] | undefined }
async function openLetter(page:Page,id='letter-1') { await page.goto('/#/practice/alphabet'); await expect(page.getByRole('heading',{name:'Alphabet',exact:true})).toBeVisible(); const back=page.getByRole('button',{name:'Back to letters',exact:true}); if(await back.isVisible()) await back.click(); await page.locator('.alphabet-letter').nth(id==='letter-1'?0:1).click() }
async function checkShape(page:Page, wrong=false) { const dialog=page.getByRole('dialog'); if(wrong) { await dialog.locator('.alphabet-choices button').nth(1).click(); await expect(dialog.getByRole('status')).toContainText('Try again.') } await dialog.locator('.alphabet-choices button').first().click(); await expect(dialog.getByRole('status')).toContainText('Accepted.') }

test.beforeAll(async({request})=>{await owner(request); for(const course of ['levantine','khmer','french']) await reset(request,course)})

test('unavailable packs and direct routes are honest and accessible',async({page})=>{
  await page.route('**/api/alphabet',r=>r.fulfill({json:{schemaVersion:1,courses:['levantine','msa','quranic','french','khmer'].map(courseId=>({courseId,packId:null,version:null,contentHash:null})),withdrawnIds:[]}}))
  await page.goto('/#/practice/alphabet'); await expect(page.getByRole('heading',{name:'No alphabet pack published yet'})).toBeVisible(); await expect(page.getByLabel('Language / course')).toBeVisible()
  await page.getByLabel('Language / course').selectOption('quranic'); await expect(page.locator('.alphabet-course')).toHaveText('Quranic Arabic')
  await page.getByRole('link',{name:'Back to Practice',exact:true}).click(); await expect(page.locator('.tile-alphabet')).toBeVisible()
  await page.getByRole('link',{name:'Courses',exact:true}).last().click(); await expect(page.getByRole('link',{name:/Alphabet · Quranic Arabic/})).toBeVisible()
})

test('real API pack renders exact forms and words, search and first-help-retry evidence',async({page})=>{
  await page.goto('/#/practice/alphabet'); await expect(page.locator('.alphabet-letter')).toHaveCount(2)
  await page.getByLabel('Find a letter').fill('Test letter 2'); await expect(page.locator('.alphabet-letter')).toHaveCount(1); await page.getByLabel('Find a letter').fill('')
  await page.locator('.alphabet-letter').first().click(); await expect(page.locator('.alphabet-hero')).toHaveText('ب'); await expect(page.locator('.alphabet-word')).toHaveText(['ب','بب'])
  await expect(page.getByRole('button',{name:'Play name',exact:true})).toBeVisible(); await expect(page.getByRole('button',{name:'Play sound',exact:true})).toBeVisible()
  await page.getByRole('button',{name:'Practice this letter'}).click(); await page.getByRole('dialog').getByRole('button',{name:'Show explanation'}).click(); await checkShape(page,true)
  await expect.poll(async()=> (await evidence(page))?.filter(e=>e.kind==='shape').length).toBe(1)
  const recorded=(await evidence(page))!.find(e=>e.kind==='shape')!; expect(recorded).toMatchObject({firstAnswer:'other',answers:['other','match'],help:true,correct:true,courseId:'levantine',version:1})
  await page.getByRole('dialog').getByRole('button',{name:'Close practice'}).click(); await expect(page.getByRole('button',{name:'Practice this letter'})).toBeFocused()
})

test('complete download supports offline reload, model audio and four activities',async({page,context})=>{
  await openLetter(page); await page.getByRole('button',{name:'Download alphabet',exact:true}).click(); await expect(page.getByRole('button',{name:'Downloaded',exact:true})).toBeDisabled()
  await page.evaluate(async()=>{await navigator.serviceWorker.ready}); await context.setOffline(true); await page.reload(); await expect(page.locator('.alphabet-hero')).toHaveText('ب')
  await page.getByRole('button',{name:'Practice this letter'}).click(); await checkShape(page); const d=page.getByRole('dialog'); await d.getByRole('button',{name:'Continue',exact:true}).click()
  await expect(d.getByRole('heading')).toHaveText('Listening recognition'); await expect(d.locator('.alphabet-choices button').first()).toBeDisabled(); await d.getByRole('button',{name:'Play model'}).click(); await expect(d.locator('.alphabet-choices button').first()).toBeEnabled(); await checkShape(page)
  await d.getByRole('button',{name:'Continue',exact:true}).click(); await expect(d.getByRole('heading')).toHaveText('Word spotting'); await checkShape(page); await d.getByRole('button',{name:'Continue',exact:true}).click()
  await expect(d.getByRole('heading')).toHaveText('Listen and repeat'); await expect(d.getByRole('button',{name:'I compared my sound'})).toBeDisabled(); await d.getByRole('button',{name:'Play model'}).click(); await d.getByRole('button',{name:'I compared my sound'}).click(); await d.getByRole('button',{name:'Continue',exact:true}).click()
  await expect(d.getByRole('heading')).toHaveText('Practice complete'); await expect(d).toContainText('1 sound self-checks · unscored.')
  const h=(await evidence(page))!; expect(h.filter(e=>e.kind!=='viewed')).toHaveLength(4); expect(h.find(e=>e.kind==='repeat')).toMatchObject({correct:null,selfChecked:true}); await context.setOffline(false)
})

test('course switching preserves separate browsing and unfinished practice without changing allocation',async({page})=>{
  await openLetter(page); const before=(await snapshots(page)).filter(s=>s.key.includes('study-settings')||s.key.includes('started-lesson'))
  await page.getByRole('button',{name:'Practice this letter'}).click(); await checkShape(page); await expect.poll(async()=>((await snapshots(page)).find(s=>s.key==='alphabet-session-v1:guest:levantine')?.value as {feedback?:string})?.feedback).toBe('Synthetic reviewed explanation.'); await page.reload(); await expect(page.getByRole('button',{name:'Resume alphabet practice'})).toBeVisible()
  await page.getByLabel('Language / course').selectOption('khmer'); await expect(page.locator('.alphabet-letter')).toHaveCount(2); await page.locator('.alphabet-letter').nth(1).click(); await expect(page.locator('.alphabet-hero')).toHaveText('ខ')
  await page.getByLabel('Language / course').selectOption('levantine'); await expect(page.locator('.alphabet-hero')).toHaveText('ب'); await page.getByRole('button',{name:'Resume alphabet practice'}).click(); await expect(page.getByRole('dialog').getByRole('status')).toContainText('Accepted.'); await page.getByRole('dialog').getByRole('button',{name:'Close practice'}).click()
  await page.getByLabel('Language / course').selectOption('khmer'); await expect(page.locator('.alphabet-hero')).toHaveText('ខ')
  expect((await snapshots(page)).filter(s=>s.key.includes('study-settings')||s.key.includes('started-lesson'))).toEqual(before)
})

test('guest and account practice histories are isolated',async({page})=>{
  await openLetter(page); await page.getByRole('button',{name:'Practice this letter'}).click(); await checkShape(page); await page.getByRole('dialog').getByRole('button',{name:'Close practice'}).click()
  const r=await post(page.request,'/api/auth/register',{displayName:'Alphabet learner',email:`alphabet-${Date.now()}@example.test`,password:'Test-password-123!'}); expect(r.ok()).toBeTruthy(); const session=await r.json()
  await page.reload(); await expect(page.locator('.alphabet-hero')).toHaveText('ب'); await page.getByRole('button',{name:'Back to letters',exact:true}).click(); await expect(page.locator('.alphabet-letter')).toHaveCount(2); expect(await evidence(page,`user:${session.userId}`)).toBeUndefined()
  await page.locator('.alphabet-letter').nth(1).click(); await page.getByRole('button',{name:'Practice this letter'}).click(); await checkShape(page); await page.getByRole('dialog').getByRole('button',{name:'Close practice'}).click()
  await expect.poll(async()=> (await evidence(page,`user:${session.userId}`))?.filter(e=>e.kind==='shape').length).toBe(1)
  expect((await evidence(page))!.find(e=>e.kind==='shape')!.entryId).toBe('letter-1'); expect((await evidence(page,`user:${session.userId}`))!.find(e=>e.kind==='shape')!.entryId).toBe('letter-2')
})

test('failed version update retains the prior complete pack and old evidence',async({page,request,context})=>{
  await owner(request)
  await openLetter(page); await page.getByRole('button',{name:'Download alphabet',exact:true}).click(); await expect(page.getByRole('button',{name:'Downloaded',exact:true})).toBeDisabled()
  let d=await reset(request); const url=await audio(request,1); const oldUrl=(d.state.versions[0]!.pack.entries as {nameAudio:{url:string}}[])[0]!.nameAudio.url
  const content=JSON.parse(JSON.stringify(d.state.versions[0]!.pack).replaceAll(oldUrl,url)); content.title='Synthetic corrected alphabet'; const response=await post(request,'/api/admin/alphabet/drafts',{pack:content,expectedRevision:d.revision}); expect(response.ok(),await response.text()).toBeTruthy(); d=await response.json(); d=await command(request,d,'approve'); d=await command(request,d,'publish')
  try {
    await page.getByRole('button',{name:'Refresh alphabet',exact:true}).click(); await expect(page.locator('.alphabet-toolbar')).toContainText('Version 2')
    await page.route(`**${url}`,r=>r.abort()); await page.getByRole('button',{name:'Download alphabet',exact:true}).click(); await expect(page.getByRole('alert')).toContainText('download')
    await context.setOffline(true); await page.reload(); await expect(page.locator('.alphabet-toolbar')).toContainText('Version 1')
  } finally { await context.setOffline(false); await command(request,d,'rollback',1) }
})

test('known withdrawal removes downloaded text and audio but retains historical evidence',async({page,request})=>{
  await owner(request)
  await openLetter(page); await page.getByRole('button',{name:'Practice this letter'}).click(); await checkShape(page); await page.getByRole('dialog').getByRole('button',{name:'Close practice'}).click()
  await page.getByRole('button',{name:'Download alphabet',exact:true}).click(); await expect(page.getByRole('button',{name:'Downloaded',exact:true})).toBeDisabled()
  let d=await reset(request); d=await command(request,d,'withdraw',1)
  try { await page.getByRole('button',{name:'Refresh alphabet',exact:true}).click(); await expect(page.getByRole('heading',{name:'No alphabet pack published yet'})).toBeVisible(); expect((await evidence(page))!.some(e=>e.kind==='shape')).toBeTruthy()
    const downloaded=await page.evaluate(()=>new Promise<unknown>(resolve=>{const r=indexedDB.open('ismi-alphabet-v1',1);r.onsuccess=()=>{const db=r.result; const q=db.transaction('packs').objectStore('packs').get('levantine');q.onsuccess=()=>{db.close();resolve(q.result)}}})); expect(downloaded).toBeUndefined()
  } finally { await command(request,d,'rollback',1) }
})

for(const course of ['levantine','khmer','french'] as CourseId[]) test(`${course} exact text, mobile enlarged layout, keyboard and dialog scroll`,async({page})=>{
  await page.setViewportSize({width:320,height:700}); await page.goto('/#/practice/alphabet'); await page.getByLabel('Language / course').selectOption(course); await expect(page.locator('.alphabet-letter')).toHaveCount(2)
  await page.addStyleTag({content:'html { font-size: 24px !important; }'}); const first=page.locator('.alphabet-letter').first(); await first.focus(); await page.keyboard.press('Enter'); await expect(page.locator('.alphabet-hero')).toBeVisible(); await expect(page.locator('.alphabet-detail h2')).toBeFocused()
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy(); await page.getByRole('button',{name:'Practice this letter'}).click(); const d=page.getByRole('dialog'); const height=await d.evaluate(e=>e.getBoundingClientRect().height); await d.getByRole('button',{name:'Show explanation'}).click(); expect(await d.evaluate(e=>e.getBoundingClientRect().height)).toBe(height)
  await page.screenshot({path:`/tmp/ismi-alphabet-${course}-320.png`}); await page.keyboard.press('Escape'); await expect(page.getByRole('button',{name:'Practice this letter'})).toBeFocused()
})

test('mixed practice includes all activities and target overlays preserve copying',async({page})=>{
  await page.goto('/#/practice/alphabet'); await expect(page.locator('.alphabet-letter')).toHaveCount(2)
  await page.locator('.alphabet-letter').first().click(); await expect(page.locator('.alphabet-target-mark')).toHaveCount(3)
  expect(await page.locator('.alphabet-word').first().evaluate(e=>e.textContent)).toBe('ب')
  await page.getByRole('button',{name:'Back to letters',exact:true}).click(); await page.getByRole('button',{name:'Mixed practice',exact:true}).click()
  const kinds=[]; for(let i=0;i<8;i++) { kinds.push(await page.getByRole('dialog').getByRole('heading').textContent()); await page.getByRole('dialog').getByRole('button',{name:'Skip',exact:true}).click() }
  expect(new Set(kinds).size).toBe(4); await expect(page.getByRole('dialog').getByRole('heading')).toHaveText('Practice complete')
})

test('owner console validates and previews drafts without publishing fixtures',async({page})=>{
  await owner(page.request); await page.goto('/#/account'); await page.getByRole('button',{name:/Open curriculum console/}).click(); await page.getByRole('navigation',{name:'Console sections'}).getByRole('button',{name:'Alphabet',exact:true}).click()
  const p=pack('french'); p.engineeringFixture=true
  const s=await (await page.request.get('/api/admin/alphabet/packs/french-test-alphabet')).json() as AlphabetDetail
  await page.getByRole('button',{name:/Synthetic alphabet fixture · french/}).click(); await page.getByLabel('Alphabet pack JSON', {exact:true}).fill(JSON.stringify(p)); await page.getByRole('button',{name:'Save alphabet draft'}).click(); await expect(page.locator('.alphabet-console').getByRole('status')).toContainText('saved privately')
  await page.getByRole('button',{name:'Validate alphabet',exact:true}).click(); await expect(page.getByLabel('Alphabet validation')).toContainText('Engineering fixtures cannot be approved or published.')
  await expect(page.getByRole('button',{name:'Approve alphabet version',exact:true})).toBeDisabled(); await page.getByRole('button',{name:'Preview alphabet',exact:true}).click(); await expect(page.getByRole('region',{name:'Private alphabet preview'}).locator('.alphabet-letter')).toHaveCount(2)
  const publicPack=await (await page.request.get('/api/alphabet/packs/french-test-alphabet')).json() as AlphabetPack; expect(publicPack.version).toBe(s.state.publishedVersion)
})
