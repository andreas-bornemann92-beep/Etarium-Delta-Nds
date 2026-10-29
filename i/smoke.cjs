const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch({headless:true,args:['--no-sandbox']});
 const p=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8787/i/',{waitUntil:'load'});
 await p.waitForFunction(()=>window.etariumDiagnostics&&window.etariumDiagnostics.getState().animationFrames===12,{timeout:10000});
 const initial=await p.evaluate(()=>window.etariumDiagnostics.getState());
 await p.getByRole('button',{name:'Neues Spiel'}).click();
 const dirs=[['Nach rechts','right'],['Nach links','left'],['Nach oben','up'],['Nach unten','down']];
 let results=[];
 for (const [label,direction] of dirs){
   await p.getByRole('button',{name:label}).click();
   await p.waitForTimeout(250);
   const state=await p.evaluate(()=>window.etariumDiagnostics.getState());
   if(state.facing!==direction)throw Error('Wrong facing: '+direction+' -> '+state.facing);
   results.push(state);
 }
 if(errors.length)throw Error(errors.join('; '));
 if(results[0].x<=initial.x)throw Error('Right movement failed');
 await p.screenshot({path:'mobile-i-browser.png',fullPage:true});
 console.log(JSON.stringify({PASS:true,frameCount:initial.animationFrames,results},null,2));
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
