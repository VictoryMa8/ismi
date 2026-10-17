import { expect,test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { canonical,type AlphabetPack } from '../src/alphabet'
import { chooseCourse } from './courseSwitcher'
// Exact authored text with synthetic public transport; API tests independently prove
// the pinned publication/audit gates. Offline requests must fail and use real IDB/font bytes.
const notice={id:'alphabet-inventory-text-preview-2026-10-16',title:'Unreviewed · text-only preview',detail:'Character shapes and Unicode technical names only. Linguistic review, pronunciation, word examples and exercises are pending. No human audio. Not reviewed course completion or beta content.'}
const license=readFileSync(new URL('../../content/alphabet/sources/UNICODE-LICENSE-V3.txt',import.meta.url),'utf8')
const packs=['levantine','msa','quranic','khmer','french'].map(course=>{
 const p=JSON.parse(readFileSync(new URL(`../../content/alphabet/inventory-preview/${course}.pack.json`,import.meta.url),'utf8'))
 const clip=(c:{url:string;transcript:string})=>({url:c.url,transcript:c.transcript})
 const value={id:p.id,courseId:p.courseId,version:1,contentHash:'',title:p.title,variety:p.variety,helpConvention:p.helpConvention,inventoryId:p.inventory.id,inventoryVersion:p.inventory.version,basicEntryIds:p.inventory.basicEntryIds,scriptEntries:p.inventory.entries,entries:p.entries.map((e:Record<string,unknown>)=>({id:e.id,name:e.name,help:e.help,note:e.note,soundContext:e.soundContext,sourceIds:e.sourceIds,nameAudio:clip(e.nameAudio as {url:string;transcript:string}),soundAudio:clip(e.soundAudio as {url:string;transcript:string}),examples:[],activities:[]})),sources:p.sources.map((s:Record<string,string>)=>({id:s.id,citation:s.citation,locator:s.locator,version:s.version})),fonts:p.fonts,publicationNotice:notice,licenseText:license}
 value.contentHash=createHash('sha256').update(canonical(value)).digest('hex');return value as AlphabetPack
})
const catalog={schemaVersion:1,courses:packs.map(p=>({courseId:p.courseId,packId:p.id,version:1,contentHash:p.contentHash})),withdrawnIds:[]}
test.beforeEach(async({page})=>{
 await page.addInitScript(({catalog,packs})=>{
  const original=window.fetch.bind(window)
  window.fetch=async(input,options)=>{
   const url=new URL(typeof input==='string'?input:input instanceof URL?input.href:input.url,location.href)
   if(url.pathname==='/api/alphabet'||url.pathname.startsWith('/api/alphabet/packs/')){
    if(!navigator.onLine)throw new TypeError('Offline test transport')
    const data=url.pathname==='/api/alphabet'?catalog:packs.find(p=>url.pathname.endsWith('/'+p.id))
    return new Response(JSON.stringify(data),{status:data?200:404,headers:{'Content-Type':'application/json'}})
   }
   return original(input,options)
  }
 },{catalog,packs})
})
for(const [course,count,basic] of [['levantine',28,28],['msa',28,28],['quranic',28,28],['khmer',35,33],['french',26,26]] as const)test(`${course} shows exact text-only inventory without audio or graded practice`,async({page})=>{
 await page.goto('/#/practice/alphabet');await chooseCourse(page, course);await expect(page.locator('.alphabet-letter')).toHaveCount(count)
 await expect(page.locator('.alphabet-notice')).toContainText('Unreviewed · text-only preview');await expect(page.locator('.alphabet-notice')).toContainText('No human audio')
 await expect(page.getByRole('button',{name:'Mixed practice',exact:true})).toHaveCount(0);await page.locator('.alphabet-letter').first().click();await expect(page.locator('.alphabet-forms')).toBeVisible()
 await expect(page.getByRole('button',{name:'Play name',exact:true})).toHaveCount(0);await expect(page.getByRole('button',{name:'Play sound',exact:true})).toHaveCount(0);await expect(page.getByRole('button',{name:'Practice this letter',exact:true})).toHaveCount(0)
 await page.getByText('Sources and version',{exact:true}).click();await page.getByText('Unicode license',{exact:true}).click();await expect(page.locator('.alphabet-license')).toContainText('UNICODE LICENSE V3')
 const p=await page.evaluate(async id=>(await fetch(`/api/alphabet/packs/${id}`)).json(),`${course}-alphabet`) as AlphabetPack;expect(p.basicEntryIds).toHaveLength(basic);expect(p.entries.every(e=>!e.nameAudio.url&&!e.activities.length&&!e.examples.length)).toBeTruthy()
})
test('Khmer text and local font download reload offline with honest notice',async({page,context})=>{
 await page.goto('/#/practice/alphabet');await chooseCourse(page, 'khmer');await expect(page.locator('.alphabet-letter')).toHaveCount(35)
 await page.getByRole('button',{name:'Download alphabet',exact:true}).click();await expect(page.getByRole('button',{name:'Downloaded',exact:true})).toBeDisabled();await page.evaluate(async()=>navigator.serviceWorker.ready)
 await context.setOffline(true);await page.reload();await expect(page.locator('.alphabet-letter')).toHaveCount(35);await expect(page.locator('.alphabet-notice')).toContainText('Unreviewed');await page.locator('.alphabet-letter').first().click();await expect(page.locator('.alphabet-hero')).toHaveText('ក')
 await context.setOffline(false)
})
