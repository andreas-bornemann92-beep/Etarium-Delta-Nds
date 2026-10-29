const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8787/l/',{waitUntil:'load'});
 await page.waitForFunction(()=>window.etariumDiagnostics&&window.ETARIUM_TOWN);
 await page.locator('#j-new').click();
 await page.locator('#j-name').fill('Lina');
 await page.locator('#j-confirm').click();
 const initial=await page.evaluate(()=>window.etariumDiagnostics.getState());
 if(initial.stage!=='world'||initial.x!==24||initial.y!==32)throw Error('Start point changed');
 for(let i=0;i<6;i++){
  const result=await page.evaluate(()=>window.etariumDiagnostics.move('up'));
  if(!result)throw Error('Town entry blocked at step '+i);
  await page.waitForTimeout(230);
 }
 const now=await page.evaluate(()=>window.etariumDiagnostics.getState());
 if(now.y!==26||now.x!==24)throw Error('Movement incorrect: '+JSON.stringify(now));
 if(!(await page.evaluate(()=>window.ETARIUM_TOWN.solid(9,7))))throw Error('Building not solid');
 await page.screenshot({path:'etarium-l-city.png',fullPage:true});
 await page.getByRole('button',{name:'Zurück zum Start'}).click();
 await page.locator('#j-continue').click();
 const resumed=await page.evaluate(()=>window.etariumDiagnostics.getState());
 if(resumed.y!==26||resumed.character.name!=='Lina')throw Error('Save/continue failed');
 if(errors.length)throw Error(errors.join(' | '));
 console.log(JSON.stringify({PASS:true,initial,now,resumed},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
