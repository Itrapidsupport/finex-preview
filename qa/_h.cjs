const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1440,height:900}});const p=await c.newPage();
await p.goto('https://itrapidsupport.github.io/finex-preview/services/integrated-facilities-management/',{waitUntil:'networkidle'});await p.waitForTimeout(2500);
const st=()=>p.evaluate(()=>{const w=[...document.querySelectorAll('h1 .wi')];return w.map(e=>getComputedStyle(e).transform+' '+e.getAnimations().map(a=>a.playState+':'+Math.round(a.currentTime)).join(',')).slice(0,3)})
console.log('after load', await st()); await p.screenshot({path:'qa/out/h1.png'})
await p.mouse.move(700,400); for(let i=0;i<30;i++){await p.mouse.wheel(0,300);await p.waitForTimeout(50)} await p.waitForTimeout(800)
console.log('after scroll', await st()); await p.evaluate(()=>scrollTo(0,0)); await p.waitForTimeout(800); console.log('back', await st(), await p.evaluate(()=>scrollY)); await p.screenshot({path:'qa/out/h2.png'}); await b.close()})()
