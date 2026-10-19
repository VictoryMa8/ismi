import { createHash } from 'node:crypto'
import { canonical } from '../src/alphabet'
import { readFileSync } from 'node:fs'
import { expect,test,request,type APIRequestContext,type Page } from '@playwright/test'
import type { StoryDetail,StoryPack } from '../src/stories'
import type { LessonResponse } from '../src/types'
let owner:APIRequestContext
const id='synthetic-browser-story'
async function post(c:APIRequestContext,path:string,data:unknown){const csrf=await(await c.get('/api/auth/csrf')).json();return c.post(path,{data,headers:{'X-CSRF-TOKEN':csrf.token}})}
async function detail(){return await(await owner.get(`/api/admin/stories/packs/${id}`)).json() as StoryDetail}
async function command(d:StoryDetail,action:string,version=d.state.versions.at(-1)!.number){const r=await post(owner,`/api/admin/stories/packs/${id}/${action}`,{expectedRevision:d.revision,version,reason:'Synthetic browser test'});expect(r.ok(),await r.text()).toBeTruthy();return await r.json() as StoryDetail}
async function saved(page:Page){return page.evaluate(()=>new Promise<{key:string;value:any}[]>(resolve=>{const r=indexedDB.open('ismi-offline');r.onsuccess=()=>{const db=r.result;const q=db.transaction('snapshots').objectStore('snapshots').getAll();q.onsuccess=()=>{db.close();resolve(q.result)}}}))}
async function open(page:Page){await page.goto('/#/practice/stories');await page.getByRole('button',{name:'Read or resume'}).click();await expect(page.locator('.story-frame')).toBeVisible()}
test.beforeAll(async()=>{
 owner=await request.newContext({baseURL:'http://127.0.0.1:4173'});const credentials={email:'preview-owner@example.test',password:'test-only-long-password'}
 if(!(await post(owner,'/api/auth/register',{displayName:'Owner',...credentials})).ok())expect((await post(owner,'/api/auth/login',credentials)).ok()).toBeTruthy()
 if ((await owner.get(`/api/admin/stories/packs/${id}`)).ok()) return
 const l=await(await owner.get('/api/lessons/levantine-day-01')).json() as LessonResponse
 const choices=[{id:'yes',text:'A check-in',rationale:'The friend asks about the day.'},{id:'no',text:'A plan',rationale:'No future plan is made.'}]
 const p:StoryPack={id,courseId:'levantine',unitId:l.unitId,arcId:'synthetic-test',episode:1,title:'Synthetic browser story',summary:'Synthetic test data, not real curriculum.',sources:[{lessonId:l.id,version:l.version}],scenes:[0,1,2].map(n=>({title:`Scene ${n+1}`,situation:'Read the check-in.',lines:[{speakerId:'fattoush',text:{...l.steps[0]!.prompt,audioUrl:null},sourceIndex:0}]})),checks:[0,1].map(n=>({id:`check-${n}`,kind:'comprehension',prompt:`Understand the check-in ${n+1}`,choices,acceptedId:'yes',explanation:'The question asks about the day.',sourceIndex:0,target:l.steps[0]!.id})),reviewer:'SYNTHETIC TEST',reviewEvidence:'SYNTHETIC TEST ONLY',rightsEvidence:'SYNTHETIC TEST ONLY'}
 p.checks.push({id:'response',kind:'response',prompt:'Choose the taught response.',choices:l.steps[0]!.answers.map(a=>({id:a.id,text:a.arabic,rationale:'Synthetic choice rationale.',help:a.arabizi,meaning:a.meaning})),acceptedId:l.steps[0]!.evaluation.correctAnswerId,explanation:'Practice with choices.',sourceIndex:0,target:l.steps[0]!.id})
 const r=await post(owner,'/api/admin/stories/drafts',{pack:p});expect(r.ok(),await r.text()).toBeTruthy();await command(await command(await r.json(),'approve'),'publish')
})
test.afterAll(async()=>owner?.dispose())
test.beforeEach(async()=>{const d=await detail();if(d.state.publishedVersion!==1)await command(d,'rollback',1)})
for(const width of [320,1280])test(`fixed frame, keyboard focus and application version at ${width}px`,async({page},info)=>{
 await page.setViewportSize({width,height:844});await page.goto('/#/about');await expect(page.getByText('Beta 0.0.4',{exact:true}).first()).toBeVisible();await open(page)
 const frame=page.locator('.story-frame'),height=(await frame.boundingBox())!.height
 await expect(frame.getByRole('heading',{name:'Scene 1'})).toBeFocused();await page.getByRole('button',{name:'Show help'}).focus();await page.keyboard.press('Enter');await expect(page.getByRole('button',{name:'Hide help'})).toHaveAttribute('aria-expanded','true')
 await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(frame.getByRole('heading',{name:'Scene 2'})).toBeFocused();expect((await frame.boundingBox())!.height).toBe(height)
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await page.screenshot({path:info.outputPath(`story-${width}.png`),animations:'disabled'})
})
test('help/retry/replay retain first results and add no core credit',async({page})=>{
 const before=await(await page.request.get('/api/dashboard')).json();await open(page)
 for(let i=0;i<3;i++)await page.getByRole('button',{name:'Continue',exact:true}).click()
 await page.getByLabel('A plan',{exact:true}).check();await page.getByRole('button',{name:'Check response'}).click();await expect(page.locator('.story-frame [role=status]')).toContainText('Try again.')
 await page.getByRole('button',{name:'Show help'}).click();await page.getByLabel('A check-in',{exact:true}).check();await page.getByRole('button',{name:'Check response'}).click();await page.getByRole('button',{name:'Continue',exact:true}).click()
 await page.getByLabel('A check-in',{exact:true}).check();await page.getByRole('button',{name:'Check response'}).click();await page.getByRole('button',{name:'Continue',exact:true}).click()
 await page.locator('.story-choice input').first().check();await page.getByRole('button',{name:'Check response'}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByRole('heading',{name:'Story complete'})).toBeFocused()
 const progress=(await saved(page)).find(s=>s.key.startsWith('story-progress-v1:guest:'))!.value;expect(progress.completed).toBeTruthy();expect(progress.results['check-0']).toMatchObject({first:'no',helped:false,attempts:2})
 await page.getByRole('button',{name:'Read again'}).click();expect((await saved(page)).find(s=>s.key.startsWith('story-progress-v1:guest:'))!.value.results).toEqual(progress.results)
 const after=await(await page.request.get('/api/dashboard')).json();expect(after.dailyPlan.completedMinutes).toBe(before.dailyPlan.completedMinutes);expect(after.dailyPlan.lessons.filter((l:any)=>l.isCompleted)).toEqual(before.dailyPlan.lessons.filter((l:any)=>l.isCompleted))
})
test('real API download and resume survive offline app reload',async({page,context})=>{
 await page.goto('/#/practice/stories');await page.getByRole('button',{name:'Download story',exact:true}).click();await expect(page.getByText('Text and checks downloaded.',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Read or resume'}).click();await page.getByRole('button',{name:'Continue',exact:true}).click()
 await expect.poll(async()=>(await saved(page)).find(s=>s.key.startsWith('story-progress-v1:guest:'))?.value.position).toBe(1);await page.evaluate(async()=>navigator.serviceWorker.ready);await context.setOffline(true);await page.reload();await page.getByRole('button',{name:'Read or resume'}).click();await expect(page.getByRole('heading',{name:'Scene 2'})).toBeVisible();await expect(page.getByText(/downloaded text only/)).toBeVisible();await context.setOffline(false)
})
test('withdrawal purges downloaded access on reconnect and preserves history',async({page,context})=>{
 await page.goto('/#/practice/stories');await page.getByRole('button',{name:'Download story',exact:true}).click();await expect(page.getByText('Text and checks downloaded.',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Read or resume'}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();await context.setOffline(true)
 await command(await detail(),'withdraw',1);await context.setOffline(false);await expect(page.getByText('No published stories for this course yet.')).toBeVisible();expect((await saved(page)).find(s=>s.key==='story-downloads-v1')!.value).toEqual([]);expect((await saved(page)).some(s=>s.key.startsWith('story-progress-v1:guest:'))).toBeTruthy()
})
test('account history stays separate from guest resume',async({page})=>{
 await open(page);await page.getByRole('button',{name:'Continue',exact:true}).click();expect((await post(page.request,'/api/auth/register',{displayName:'Story learner',email:`story-${Date.now()}@example.test`,password:'test-only-long-password'})).ok()).toBeTruthy()
 await page.reload();await page.getByRole('button',{name:'Read or resume'}).click();await expect(page.getByRole('heading',{name:'Scene 1'})).toBeVisible();await page.getByRole('button',{name:'Continue',exact:true}).click();expect((await saved(page)).filter(s=>s.key.startsWith('story-progress-v1:')).length).toBe(2)
})
test('changed publication invalidates download/current resume while preserving history',async({page})=>{
 await page.goto('/#/practice/stories');await page.getByRole('button',{name:'Download story',exact:true}).click();await expect(page.getByText('Text and checks downloaded.',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Read or resume'}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByRole('heading',{name:'Scene 2'})).toBeFocused();await page.getByRole('button',{name:'Close story'}).click()
 const d=await detail();const r=await post(owner,'/api/admin/stories/drafts',{pack:{...d.state.versions[0]!.pack,title:'Revised synthetic browser story'},expectedRevision:d.revision});expect(r.ok(),await r.text()).toBeTruthy();await command(await command(await r.json(),'approve'),'publish')
 await page.getByRole('button',{name:'Refresh stories'}).click();await expect(page.getByRole('heading',{name:'Revised synthetic browser story'})).toBeVisible();expect((await saved(page)).find(s=>s.key==='story-downloads-v1')!.value).toEqual([])
 await page.getByRole('button',{name:'Read or resume'}).click();await expect(page.getByRole('heading',{name:'Scene 1'})).toBeVisible();await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByRole('heading',{name:'Scene 2'})).toBeFocused();expect((await saved(page)).filter(s=>s.key.startsWith('story-progress-v1:guest:'))).toHaveLength(2)
})
test('console saves/validates and privately previews the real unreviewed candidate',async({page})=>{
 expect((await post(page.request,'/api/auth/login',{email:'preview-owner@example.test',password:'test-only-long-password'})).ok()).toBeTruthy();await page.goto('/#/account');await page.getByRole('button',{name:'Open curriculum console'}).click();await page.getByRole('button',{name:'Stories',exact:true}).click()
 await expect(page.getByLabel('Story pack JSON')).toBeEditable();const pack=JSON.parse(readFileSync(new URL('../../content/stories/after-a-long-day/01.pack.json',import.meta.url),'utf8'));pack.id='unreviewed-browser-draft';await page.getByLabel('Import stories JSON').setInputFiles({name:'candidate.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(pack))});await expect(page.getByLabel('Story pack JSON')).toBeEditable();await page.getByRole('button',{name:'Save story draft'}).click();await expect(page.getByText('Story draft saved privately.',{exact:true})).toBeVisible()
 await page.getByRole('button',{name:'Preview stories'}).click();const dialog=page.getByRole('dialog');await expect(dialog.getByText('Private draft · unreviewed · text only')).toBeVisible();await expect(dialog.getByRole('heading',{name:'A quick hello'})).toBeVisible();await dialog.getByRole('button',{name:'Continue',exact:true}).click();await expect(dialog.getByRole('heading',{name:'Both need a pause'})).toBeFocused();await page.keyboard.press('Escape')
 await page.getByRole('button',{name:'Validate stories'}).click();await expect(page.getByText(/Record exact human linguistic/)).toBeVisible();await expect(page.getByRole('button',{name:'Approve story version'})).toBeDisabled();expect((await page.request.get('/api/stories/packs/unreviewed-browser-draft')).status()).toBe(404);expect((await saved(page)).filter(s=>s.key.includes('unreviewed-browser-draft'))).toEqual([])
})

test('unreviewed text-only publication label remains visible in catalog and reader',async({page})=>{
 const catalog=await(await owner.get('/api/stories')).json();const s=catalog.episodes.find((p:any)=>p.id===id)
 s.publicationNotice={releaseId:'story-text-preview-2026-10-18',label:'Unreviewed · text-only preview',details:'Linguistic review and source-rights acceptance are pending. No story audio. Not beta content.'}
 s.contentHash=createHash('sha256').update(canonical({...s,contentHash:''})).digest('hex')
 await page.route('**/api/stories',r=>r.fulfill({json:{episodes:[s]}}));await page.goto('/#/practice/stories');await expect(page.locator('.story-notice')).toContainText('Unreviewed · text-only preview');await page.getByRole('button',{name:'Read or resume'}).click();await expect(page.getByRole('dialog').locator('.story-notice')).toContainText('source-rights acceptance are pending')
})
