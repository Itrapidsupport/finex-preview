// JS disabled: every route must show its content (prerendered HTML, no hidden reveal targets).
const { chromium } = require('playwright'); const fs=require('fs')
const base=process.argv[2]; const routes=JSON.parse(fs.readFileSync(__dirname+'/../dist/routes.json','utf8'))
;(async()=>{const b=await chromium.launch();const c=await b.newContext({javaScriptEnabled:false,viewport:{width:1440,height:900}});let bad=0
for(const r of routes){const p=await c.newPage();await p.goto(base+r.replace(/^\//,''),{waitUntil:'load'})
const res=await p.evaluate(()=>({h1:document.querySelector('h1')?.textContent?.trim().slice(0,50),words:document.querySelector('main')?.innerText.split(/\s+/).length,hidden:[...document.querySelectorAll('main h1,main h2,main h3,main p,main img')].filter(e=>{const cs=getComputedStyle(e);const r=e.getBoundingClientRect();return r.width>0&&(cs.visibility==='hidden'||+cs.opacity<0.05)&&!e.closest('.sr-only,.mk-sr-only,[aria-hidden=true]')}).length}))
if(!res.h1||res.hidden||res.words<40){bad++}console.log(r.padEnd(40),JSON.stringify(res))
if(r==='/')await p.screenshot({path:'qa/out/nojs-home.png',fullPage:true});await p.close()}
console.log('nojs failures',bad);await b.close()})()
