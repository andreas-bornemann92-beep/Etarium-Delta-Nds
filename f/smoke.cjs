const { chromium } = require('playwright');
(async () => {
 const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
 const page = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8787/f/',{waitUntil:'load'});
 await page.waitForFunction(()=>typeof window.etariumDiagnostics==='object');
 const canvas=await page.locator('canvas').evaluate(el=>{const data=el.getContext('2d').getImageData(200,150,1,1).data;return [...data]});
 if(canvas[3]===0)throw Error('Canvas is transparent, render failed');
 await page.getByRole('button',{name:'Neues Spiel'}).click();
 const initial=await page.evaluate(()=>window.etariumDiagnostics.getState());
 if(!initial.running)throw Error('Start failed');
 const right=page.getByRole('button',{name:'Nach rechts'});
 for(let i=0;i<8;i++){await right.click();await page.waitForTimeout(180)}
 const after=await page.evaluate(()=>window.etariumDiagnostics.getState());
 if(after.x<=initial.x)throw Error('Character did not move to right');
 for(let i=0;i<12;i++){await right.click();await page.waitForTimeout(180)}
 const later=await page.evaluate(()=>window.etariumDiagnostics.getState());
 if(later.cameraX<=initial.cameraX)throw Error('Camera did not follow movement');
 if(errors.length)throw Error('Browser errors: '+errors.join('; '));
 await page.screenshot({path:'mobile-f-smoke.png',fullPage:true});
 console.log(JSON.stringify({PASS:true,initial,after,later,errors},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
