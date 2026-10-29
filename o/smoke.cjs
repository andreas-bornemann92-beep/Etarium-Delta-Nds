const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8787/o/',{waitUntil:'load'});
 await page.waitForFunction(()=>window.etariumDiagnostics&&window.ETARIUM_NPCS);
 await page.locator('#j-new').click();
 await page.locator('#j-name').fill('Eira');
 await page.locator('#j-confirm').click();
 let s=await page.evaluate(()=>window.etariumDiagnostics.getState());
 if(s.stage!=='world'||s.x!==24||s.y!==32)throw Error('Spawn failed');
 await page.waitForFunction(()=>window.etariumDiagnostics.getState().animationFrames===18,null,{timeout:12000});
 const initialNPCs=await page.evaluate(()=>window.etariumDiagnostics.getState().npcs);
 if(initialNPCs.length!==3)throw Error('NPC roster mismatch');
 await page.waitForTimeout(2400);
 const afterNPCs=await page.evaluate(()=>window.etariumDiagnostics.getState().npcs);
 if(afterNPCs[1].x===initialNPCs[1].x&&afterNPCs[1].y===initialNPCs[1].y&&!afterNPCs[1].moving)throw Error('Toren routine not progressing');
 async function move(dir,count){for(let i=0;i<count;i++){
  let ok=await page.evaluate(d=>window.etariumDiagnostics.move(d),dir);
  if(!ok)throw Error('Movement blocked '+dir+' '+i);
  await page.waitForTimeout(245);
 }}
 await move('up',5); // (24,27)
 await move('right',1); // (25,27) near Mara at (26,27)
 await page.locator('#action-a').click();
 if((await page.locator('#panel-title').innerText())!=='Mara')throw Error('Mara interaction missing');
 await page.locator('#action-a').click();
 if(!(await page.locator('#panel-body').innerText()).includes('Hauptstraße'))throw Error('Mara dialogue sequence missing');
 await page.locator('#action-b').click();
 await move('up',2); // (25,25)
 await move('right',2); // (27,25) near Elis (29,25)
 await page.locator('#action-a').click();
 if((await page.locator('#panel-title').innerText())!=='Elis')throw Error('Elis query not reachable');
 await page.locator('#action-a').click();
 if((await page.locator('#panel-title').innerText())!=='Brunnenprüfung')throw Error('Elis result not returned');
 if(!(await page.evaluate(()=>window.etariumDiagnostics.getState())).npcResult.checked)throw Error('Passive query result missing');
 await page.locator('#action-b').click();
 await page.locator('#select').click();
 await page.locator('#action-b').click();
 await page.locator('#start').click();
 await page.locator('#action-b').click();
 if(errors.length)throw Error(errors.join(' | '));
 await page.screenshot({path:'etarium-o-npcs.png',fullPage:true});
 console.log(JSON.stringify({PASS:true,npcs:afterNPCs,result:await page.evaluate(()=>window.etariumDiagnostics.getState().npcResult)},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
