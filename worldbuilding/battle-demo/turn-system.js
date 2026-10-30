/* Etarium Worldbuilding – isolated turn-based fight prototype.
   Each actor acts exactly once per round. Initiative is rolled at battle start.
   Not part of the canonical combat balancing. */
(function(){
'use strict';
function create(options){
 options=options||{};
 var random=options.random||Math.random;
 var maxRounds=options.maxRounds||8;
 var state={active:false,phase:'idle',round:1,starter:'player',turn:'player',order:[],acted:[],playerHP:100,enemyHP:100,
 playerGuard:false,enemyGuard:false,winner:null,history:[],lastMessage:'',maxRounds:maxRounds};
 function roll(n){return Math.max(0,Math.min(n-1,Math.floor(random()*n)))}
 function getState(){return {active:state.active,phase:state.phase,round:state.round,starter:state.starter,turn:state.turn,
  order:state.order.slice(),acted:state.acted.slice(),playerHP:state.playerHP,enemyHP:state.enemyHP,
  playerGuard:state.playerGuard,enemyGuard:state.enemyGuard,winner:state.winner,history:state.history.slice(),
  lastMessage:state.lastMessage,maxRounds:state.maxRounds}}
 function start(){
  state.active=true;state.phase='running';state.round=1;
  state.starter=roll(2)===0?'player':'enemy';
  state.order=state.starter==='player'?['player','enemy']:['enemy','player'];
  state.turn=state.order[0];state.acted=[];
  state.playerHP=100;state.enemyHP=100;state.playerGuard=false;state.enemyGuard=false;
  state.winner=null;state.history=[];state.lastMessage=(state.starter==='player'?'Dein Geist':'Kaels Geist')+' beginnt per Zufall!';
  return getState()
 }
 function execute(actor,move){
  if(!state.active||state.phase!=='running'||state.turn!==actor)return null;
  var names=actor==='player'?{attack:'Angriff',magic:'Lichtfunken',guard:'Schutz'}:{attack:'Steinschlag',magic:'Funkenschauer',guard:'Abwehr'};
  if(!Object.prototype.hasOwnProperty.call(names,move))return null;
  var victim=actor==='player'?'enemy':'player';
  var damage=0,guarded=false;
  if(move==='guard')state[actor+'Guard']=true;
  else {
   damage=move==='magic'?22:16;
   if(state[victim+'Guard']){damage=Math.max(1,damage-12);guarded=true;state[victim+'Guard']=false}
   state[victim+'HP']=Math.max(0,state[victim+'HP']-damage);
  }
  var who=actor==='player'?'Dein Geist':'Kaels Geist';
  var line=who+' nutzt '+names[move]+(move==='guard'?' und schützt sich vor dem nächsten Treffer.':' – '+damage+' Schaden'+(guarded?' (abgewehrt).':'.'));
  var entry={round:state.round,actor:actor,move:move,damage:damage,playerHP:state.playerHP,enemyHP:state.enemyHP,text:line};
  state.history.push(entry);state.acted.push(actor);state.lastMessage=line;
  if(state.playerHP===0||state.enemyHP===0){
   state.phase='finished';state.active=false;state.winner=state.playerHP===0?'enemy':'player';state.turn=null;
  }else if(state.acted.length===2){
   if(state.round>=state.maxRounds){
    state.phase='finished';state.active=false;
    state.winner=state.playerHP===state.enemyHP?'draw':state.playerHP>state.enemyHP?'player':'enemy';state.turn=null;
   }else{
    state.round++;state.acted=[];
    state.turn=state.order[0];
   }
  }else state.turn=state.order[1];
  return {entry:entry,state:getState()}
 }
 function player(move){return execute('player',move)}
 function enemy(){
  if(state.turn!=='enemy')return null;
  var moves=['attack','attack','magic','guard'];
  return execute('enemy',moves[roll(moves.length)])
 }
 return {state:state,start:start,player:player,enemy:enemy,getState:getState};
}
window.ETARIUM_TURN_SYSTEM={create:create};
})();