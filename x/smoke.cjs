const { chromium } = require('playwright');
(async () => {
 const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
 const page = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errs=[];page.on('pageerror',e=>errs.push(e.message));
 await page.goto('http://127.0.0.1:8787/x/',{waitUntil:'load'});
 await page.waitForFunction(()=>window.etariumDiagnostics&&window.ETARIUM_DIALOGS&&window.ETARIUM_INTERIORS);
 const status=()=>page.evaluate(()=>window.etariumDiagnostics.getState());
 const valid=await page.evaluate(()=>window.ETARIUM_DIALOGS.validate());
 if(!valid.ok||valid.count!==100)throw Error('Dialog validation: '+JSON.stringify(valid));
 let variants=0;
 for (const gender of ['male','female'])for(const body of ['slim','normal','strong'])for(const height of ['small','medium','tall']){
  await page.locator('#j-new').click();
  await page.locator('#j-gender').selectOption(gender);
  await page.locator('#j-body').selectOption(body);
  await page.locator('#j-height').selectOption(height);
  await page.locator('#j-confirm').click();
  const s=await status();
  if(s.stage!=='world'||s.character.gender!==gender||s.character.body!==body||s.character.height!==height||s.bootErrors.length)throw Error('Variant failed '+variants+' '+JSON.stringify(s));
  await page.locator('#start').click();await page.getByRole('button',{name:'Zum Titelbildschirm'}).click();variants++;
 }
 await page.locator('#j-new').click();await page.locator('#j-confirm').click();
 const roles=await status();if(roles.npcs.length!==4)throw Error('NPC count '+roles.npcs.length);
 // NPC challenger is reachable from south entrance.
 for(let i=0;i<5;i++){
   if(!(await page.evaluate(()=>window.etariumDiagnostics.move('up'))))throw Error('Walking blocked '+i);
   await page.waitForTimeout(245);
 }
 await page.locator('#action-a').click();
 const title=await page.locator('#panel-title').innerText();
 if(title!=='Kael')throw Error('Kael dialogue expected, got '+title);
 await page.getByRole('button',{name:'Trainingskampf?'}).click();
 await page.getByRole('button',{name:'Kampf beginnen'}).click();
 await page.getByRole('button',{name:'Angriff'}).click();
 await page.getByRole('button',{name:'Weiter zu Runde 2'}).click();
 await page.getByRole('button',{name:'Magie'}).click();
 if((await page.locator('#panel-title').innerText())!=='Sieg!')throw Error('No victory overlay');
 if((await status()).battle.active)throw Error('Battle should end on win');
 await page.getByRole('button',{name:'Zurück nach Eichenbrunn'}).click();
 if((await status()).panel!==null)throw Error('Victory panel remains open');
 // All four buildings expose a merchant/resident with reachable passive interaction.
 const interiors=await page.evaluate(()=>{
   const room=window.ETARIUM_INTERIORS,out=[];
   for(const door of room.doors){room.enter(door,door.x,door.y);const npc=room.nearNPC(8,7);out.push({id:door.id,npc:npc&&npc.name,solid:room.solid(8,5)});room.exit()}
   return out;
 });
 if(interiors.length!==4||interiors.some(x=>!x.npc||!x.solid))throw Error('Interior NPC validation failed');
 const state=await status();
 if(state.bootErrors.length||errs.length)throw Error('Browser errors: '+JSON.stringify({runtime:state.bootErrors,js:errs}));
 console.log('PASS version X',JSON.stringify({variants,dialogs:valid.count,interiors,rounds:2}));
 await page.screenshot({path:'etarium-x-browser-proof.png',fullPage:true});
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
