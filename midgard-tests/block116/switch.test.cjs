const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const code=fs.readFileSync(__dirname+'/switch-source.js','utf8');
function run(hps,force){
 const events=[],notes=[]; let ended=false,turns=0;
 const c={team:[{name:'Klabuni',hp:hps[0]},{name:'Eikel',hp:hps[1]}],active:0,selected:0,page:'home',stack:[],busy:false,cinematic:null,finished:false,
 battleParticipants:new Set(),clearSequence(){},mm116Broadcast(t){events.push(t)},phase(t){notes.push(t)},scene(){},waitPhase(ms,fn){fn()},home(){c.page='home'},opponentTurn(){turns++},note(t){notes.push(t)},render(){},end(){ended=true}};
 vm.createContext(c);vm.runInContext(code,c);
 if(force)c.handleKnockout();
 return {c,events,notes,get ended(){return ended},get turns(){return turns}};
}
{
 const r=run([20,10],false);
 assert.equal(r.c.switchMonsterCore(1),true);
 assert.equal(r.c.active,1);assert.equal(r.c.page,'home');
 assert.deepEqual(r.events,['switch']);assert.equal(r.turns,1);
}
{
 const r=run([0,10],true);
 assert.equal(r.c.page,'forced');assert.equal(r.c.selected,1);
 assert.deepEqual(r.events,['faint']);
 r.c.switchMonsterCore(1);
 assert.equal(r.c.active,1);assert.equal(r.c.page,'home');
 assert.deepEqual(r.events,['faint','switch']);
 assert.equal(r.turns,0,'No opponent attack immediately after forced switch');
}
{
 const r=run([0,0],true);
 assert.equal(r.ended,true);assert.equal(r.c.page,'home');
}
console.log('3 Midgard Block116 switch / KO cases passed (isolated extracted functions, NOT a browser test).');