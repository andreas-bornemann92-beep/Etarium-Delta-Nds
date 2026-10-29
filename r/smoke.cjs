const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8787/r/',{waitUntil:'load'});
 await page.waitForFunction(()=>window.etariumDiagnostics&&window.ETARIUM_INTERIORS,{timeout:12000});
 const state=()=>page.evaluate(()=>window.etariumDiagnostics.getState());
 const move=async(dir)=>{const ok=await page.evaluate(d=>window.etariumDiagnostics.move(d),dir);if(!ok)throw Error('Movement blocked '+dir+' '+JSON.stringify(await state()));await page.waitForTimeout(215)};
 if((await state()).stage!=='title')throw Error('Title unavailable');
 let count=0;
 for(const gender of ['male','female'])for(const body of ['slim','normal','strong'])for(const height of ['small','medium','tall']){
  await page.locator('#j-new').click();
  await page.locator('#j-name').fill('Test '+count);
  await page.locator('#j-gender').selectOption(gender);
  await page.locator('#j-body').selectOption(body);
  await page.locator('#j-height').selectOption(height);
  await page.locator('#j-hair').selectOption(String(count%3));
  await page.locator('#j-haircolor').selectOption(['#60402d','#28232b','#c5a16c'][count%3]);
  await page.locator('#j-confirm').click();
  const s=await state();
  if(!s.running||s.stage!=='world'||s.character.gender!==gender||s.character.body!==body||s.character.height!==height)throw Error('Variant '+count+' failed');
  if(s.bootErrors.length)throw Error('Startup error variant '+count);
  await page.locator('#start').click();
  await page.getByRole('button',{name:'Zum Titelbildschirm'}).click();
  count++;
 }
 await page.locator('#j-new').click();await page.locator('#j-confirm').click();
 if((await state()).npcs.length!==4)throw Error('NPC roster wrong');
 const entrances=await page.evaluate(()=>window.ETARIUM_INTERIORS.doors.map(d=>[d.id,d.x,d.y]));
 if(entrances.length!==4)throw Error('Not all houses have mapped doors');
 // Travel from south gate to south-west residence and enter in the real game state.
 for(let i=0;i<5;i++)await move('up');
 for(let i=0;i<12;i++)await move('left');
 let s=await state();if(s.x!==12||s.y!==27)throw Error('Door approach '+JSON.stringify(s));
 await move('up');s=await state();
 if(!s.interior.active||s.interior.id!=='west')throw Error('Room entry failed');
 await page.screenshot({path:'etarium-r-interior.png',fullPage:true});
 await move('up');await move('down');await move('down');
 s=await state();if(s.interior.active||s.x!==12||s.y!==27)throw Error('Return outdoors failed');
 // Character & spirit overview and city NPC still accessible after returning.
 await page.locator('#select').click();
 if((await state()).panel!=='select')throw Error('Select menu failed');
 await page.locator('#action-b').click();
 if(errors.length||(await state()).bootErrors.length)throw Error('JS exceptions: '+JSON.stringify(errors));
 console.log(JSON.stringify({PASS:true,variants:count,interiors:entrances,npcs:s.npcs.length,stage:s.stage},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
