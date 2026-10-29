const { chromium }=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8787/q/',{waitUntil:'load'});
 await page.waitForFunction(()=>window.etariumDiagnostics && window.ETARIUM_BATTLE,{timeout:12000});
 await page.locator('#j-new').click();
 await page.locator('#j-name').fill('Kampfprobe');
 await page.locator('#j-confirm').click();
 await page.waitForFunction(()=>window.etariumDiagnostics.getState().stage==='world');
 const get=()=>page.evaluate(()=>window.etariumDiagnostics.getState());
 let state=await get();
 if(!state.running||state.npcs.length!==4||state.x!==24||state.y!==32)throw Error('Editor or NPC initialization failed');
 await page.waitForFunction(()=>window.etariumDiagnostics.getState().animationFrames===18);
 for(let i=0;i<3;i++){
  const moved=await page.evaluate(()=>window.etariumDiagnostics.move('up'));
  if(!moved)throw Error('Movement blocked at step '+i);
  await page.waitForTimeout(235);
 }
 await page.locator('#action-a').click();
 if((await page.locator('#panel-title').innerText())!=='Kael · Herausforderung')throw Error('Challenge missing');
 await page.locator('#action-a').click();
 state=await get();
 if(!state.battle.active||state.battle.opponent!=='Kael')throw Error('Battle scene not entered');
 if(await page.evaluate(()=>window.etariumDiagnostics.move('up')))throw Error('Player can move during battle');
 await page.screenshot({path:'etarium-q-battle.png',fullPage:true});
 await page.locator('#action-b').click();
 state=await get();
 if(state.battle.active||state.stage!=='world')throw Error('B did not return to city');
 await page.locator('#start').click();
 if(state.panel==='start')throw Error('Stale state');
 await page.getByRole('button',{name:'Speichern'}).click();
 if(errors.length||(await get()).bootErrors.length)throw Error('Runtime errors '+JSON.stringify(errors));
 console.log(JSON.stringify({PASS:true,npcs:state.npcs.length,battleReturn:!state.battle.active,frameCount:state.animationFrames},null,2));
 await browser.close();
})().catch(err=>{console.error(err);process.exit(1)});
