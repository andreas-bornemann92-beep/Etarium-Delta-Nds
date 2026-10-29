const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8787/t/',{waitUntil:'load'});
 await page.waitForFunction(()=>window.etariumDiagnostics&&window.ETARIUM_DIALOGS);
 const valid=await page.evaluate(()=>window.ETARIUM_DIALOGS.validate());
 if(!valid.ok||valid.count!==100||valid.byNPC.some(a=>a.count!==25))throw Error(JSON.stringify(valid));
 await page.locator('#j-new').click();await page.locator('#j-confirm').click();
 await page.waitForFunction(()=>window.etariumDiagnostics.getState().stage==='world');
 const state=()=>page.evaluate(()=>window.etariumDiagnostics.getState());
 if((await state()).bootErrors.length)throw Error('Startfehler');
 // A at the southern gate near Kael after three northbound moves
 for(let i=0;i<3;i++){if(!(await page.evaluate(()=>window.etariumDiagnostics.move('up'))))throw Error('Weg blockiert');await page.waitForTimeout(235)}
 await page.locator('#action-a').click();
 if((await page.locator('#panel-title').innerText())!=='Kael')throw Error('Kael-dialog missing');
 const choices=await page.locator('#panel-actions button').allInnerTexts();
 if(!choices.includes('Trainingskampf?'))throw Error('Options not rendered: '+choices);
 await page.getByRole('button',{name:'Trainingskampf?'}).click();
 await page.getByRole('button',{name:'Kampf beginnen'}).click();
 if(!(await state()).battle.active)throw Error('Battle effect missing');
 await page.locator('#action-b').click();
 if((await state()).battle.active)throw Error('Return to town broken');
 if(errors.length)throw Error(errors.join(' | '));
 console.log('PASS Etarium T: 100 nodes, editor, Kael branch, battle and return');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
