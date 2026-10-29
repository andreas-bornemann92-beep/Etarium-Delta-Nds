const { chromium } = require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const problems=[];page.on('pageerror',e=>problems.push(e.message));
 await page.goto('http://127.0.0.1:8787/g/',{waitUntil:'load'});
 await page.waitForFunction(()=>window.etariumDiagnostics && window.ETARIUM_CHARACTER_ASSETS);
 const loaded=await page.evaluate(async()=>{
  let results={};
  for(const name of ['down','up','right']) {
   results[name]=await new Promise(resolve=>{
    let im=new Image();im.onload=()=>resolve(im.naturalWidth===40&&im.naturalHeight===104);im.onerror=()=>resolve(false);
    im.src=window.ETARIUM_CHARACTER_ASSETS[name];
   });
  }
  return results;
 });
 if(Object.values(loaded).some(x=>!x))throw Error('Approved character view did not load: '+JSON.stringify(loaded));
 await page.getByRole('button',{name:'Neues Spiel'}).click();
 const start=await page.evaluate(()=>window.etariumDiagnostics.getState());
 if(!start.running)throw Error('Start did not work');
 for(let i=0;i<10;i++){await page.getByRole('button',{name:'Nach rechts'}).click();await page.waitForTimeout(180);}
 const after=await page.evaluate(()=>window.etariumDiagnostics.getState());
 if(after.x<=start.x||after.cameraX<=start.cameraX)throw Error('Character/camera movement failed');
 await page.getByRole('button',{name:'Nach oben'}).click();
 await page.waitForTimeout(200);
 if(problems.length)throw Error('JS errors: '+problems.join(' | '));
 await page.screenshot({path:'mobile-h-browser.png',fullPage:true});
 console.log(JSON.stringify({pass:true,characterViews:loaded,start,after},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
