// Viewport frames while wheel-scrolling (Lenis active): node qa/frames.cjs <url> <outdir> [width] [step]
const { chromium } = require('playwright'); const fs=require('fs'); const path=require('path')
const [url,out='qa/out/frames',w='1440',step='700']=process.argv.slice(2); fs.mkdirSync(out,{recursive:true})
;(async()=>{const b=await chromium.launch({args:['--use-mock-keychain','--password-store=basic']});const c=await b.newContext({viewport:{width:+w,height:900}});const p=await c.newPage()
await p.goto(url,{waitUntil:'networkidle'});await p.waitForTimeout(1500);await p.screenshot({path:path.join(out,'f00.png')})
await p.mouse.move(+w/2,450);let i=1;const H=await p.evaluate(()=>document.documentElement.scrollHeight)
for(let y=0;y<H;y+=+step){for(let k=0;k<+step/100;k++){await p.mouse.wheel(0,100);await p.waitForTimeout(25)}await p.waitForTimeout(900);await p.screenshot({path:path.join(out,'f'+String(i++).padStart(2,'0')+'.png')})}
await b.close()})()
