const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8787/k/',{waitUntil:'load'});
 await page.waitForFunction(()=>window.etariumDiagnostics && window.ETARIUM_TOWN);
 await page.locator('#j-new').click();
 await page.locator('#j-name').fill('Eira');
 await page.locator('#j-confirm').click();
 const start=await page.evaluate(()=>window.etariumDiagnostics.getState());
 if(start.stage!=='world'||!start.running||start.x!==24||start.y!==32)throw Error('Spawn not at south gate: '+JSON.stringify(start));
 // Advance into Eichenbrunn while preserving cardinal movement and animations.
 for(let i=0;i<11;i++){
  await page.evaluate(()=>window.etariumDiagnostics.move('up'));
  await page.waitForTimeout(225);
 }
 const inside=await page.evaluate(()=>window.etariumDiagnostics.getState());
 if(inside.y>=29||inside.x!==24)throw Error('South gate inaccessible: '+JSON.stringify(inside));
 const collision=await page.evaluate(()=>({
  wall:window.ETARIUM_TOWN.solid(2,29),
  inn:window.ETARIUM_TOWN.solid(9,7),
  fountain:window.ETARIUM_TOWN.solid(23,16),
  gate:window.ETARIUM_TOWN.solid(24,29),
  camera:window.etariumDiagnostics.getState().cameraY
 }));
 if(!collision.wall||!collision.inn||!collision.fountain||collision.gate)throw Error('Town collision: '+JSON.stringify(collision));
 await page.getByRole('button',{name:'Zurück zum Start'}).click();
 await page.locator('#j-continue').click();
 const resumed=await page.evaluate(()=>window.etariumDiagnostics.getState());
 if(resumed.y!==inside.y||resumed.character.name!=='Eira')throw Error('Save/load failed');
 if(errors.length)throw Error('JS exceptions: '+errors.join(' | '));
 await page.screenshot({path:'etarium-k-city.png',fullPage:true});
 console.log(JSON.stringify({PASS:true,start,inside,resumed,collision},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
