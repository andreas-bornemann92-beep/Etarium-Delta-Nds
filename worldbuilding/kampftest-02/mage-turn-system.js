/* Etarium Worldbuilding Kampftest 02: 2 Geister + 2 Magier.
   Independent prototype; canonical mechanics unchanged. */
(function(){
'use strict';
function create(options){
 options=options||{};var random=options.random||Math.random,maxRounds=options.maxRounds||10;
 var actors=['playerSpirit','enemySpirit','playerMage','enemyMage'];
 var hpMax={playerSpirit:100,enemySpirit:100,playerMage:70,enemyMage:70};
 var names={playerSpirit:'Dein Geist',enemySpirit:'Kaels Geist',playerMage:'Dein Magier',enemyMage:'Magier Kael'};
 var moves={
 playerSpirit:[{key:'attack',name:'Angriff',damage:16},{key:'magic',name:'Lichtfunken',damage:22},{key:'guard',name:'Schutz',shield:12}],
 enemySpirit:[{key:'attack',name:'Steinschlag',damage:16},{key:'magic',name:'Funkenschauer',damage:22},{key:'guard',name:'Abwehr',shield:12}],
 playerMage:[{key:'spark',name:'Funkenstoß',damage:14},{key:'heal',name:'Heillicht',heal:16},{key:'ward',name:'Schutzkreis',shield:12}],
 enemyMage:[{key:'spark',name:'Arkanstoß',damage:14},{key:'heal',name:'Genesung',heal:16},{key:'ward',name:'Barriere',shield:12}]
 };
 var state;
 function side(id){return id.startsWith('player')?'player':'enemy'}
 function roll(n){return Math.min(n-1,Math.max(0,Math.floor(random()*n)))}
 function snapshot(){return {phase:state.phase,round:state.round,turn:state.turn,starter:state.starter,order:state.order.slice(),acted:state.acted.slice(),hp:Object.assign({},state.hp),shield:Object.assign({},state.shield),history:state.history.slice(),lastMessage:state.lastMessage,winner:state.winner,maxRounds:maxRounds}}
 function alive(id){return state.hp[id]>0}
 function target(actor){var opponent=side(actor)==='player'?'enemy':'player';return alive(opponent+'Spirit')?opponent+'Spirit':opponent+'Mage'}
 function teammate(actor){var team=side(actor);return team+'Spirit'}
 function winner(){if(!alive('playerSpirit')&&!alive('playerMage'))return 'enemy';if(!alive('enemySpirit')&&!alive('enemyMage'))return 'player';return null}
 function start(){
  var first=roll(2)===0?'player':'enemy',other=first==='player'?'enemy':'player';
  state={phase:'running',round:1,starter:first,order:[first+'Spirit',other+'Spirit',first+'Mage',other+'Mage'],turn:null,acted:[],
  hp:Object.assign({},hpMax),shield:{playerSpirit:0,enemySpirit:0,playerMage:0,enemyMage:0},history:[],lastMessage:(first==='player'?'Dein Team':'Kaels Team')+' beginnt!',winner:null};
  state.turn=state.order[0];return snapshot()
 }
 function available(id){return moves[id].map(x=>Object.assign({},x))}
 function skipDead(){
  while(state.phase==='running'){
   if(state.acted.length>=state.order.length){
    if(state.round>=maxRounds){
     var a=state.hp.playerSpirit+state.hp.playerMage,b=state.hp.enemySpirit+state.hp.enemyMage;
     state.winner=a===b?'draw':a>b?'player':'enemy';state.phase='finished';state.turn=null;return
    }
    state.round++;state.acted=[];
   }
   var id=state.order[state.acted.length];
   if(alive(id)){state.turn=id;return}
   state.acted.push(id);
  }
 }
 function perform(id,key){
  if(state.phase!=='running'||state.turn!==id)return null;
  var move=moves[id].find(x=>x.key===key);if(!move)return null;
  var victim=null,value=0,verb='';
  if(move.damage){
   victim=target(id);value=Math.max(1,move.damage-state.shield[victim]);state.shield[victim]=0;
   state.hp[victim]=Math.max(0,state.hp[victim]-value);
   verb=' trifft '+names[victim]+' für '+value+' Schaden.';
  }else if(move.heal){
   victim=teammate(id);if(!alive(victim))victim=id;
   value=Math.min(move.heal,hpMax[victim]-state.hp[victim]);state.hp[victim]+=value;
   verb=' heilt '+names[victim]+' um '+value+' LP.';
  }else{
   victim=id==='playerMage'?'playerSpirit':id==='enemyMage'?'enemySpirit':id;
   if(!alive(victim))victim=id;
   state.shield[victim]=Math.max(state.shield[victim],move.shield);
   value=move.shield;verb=' schützt '+names[victim]+' vor '+value+' Schaden des nächsten Treffers.';
  }
  var line=names[id]+' nutzt '+move.name+' und'+verb;
  var event={round:state.round,actor:id,move:key,target:victim,value:value,kind:move.damage?'damage':move.heal?'heal':'shield',hp:Object.assign({},state.hp),text:line};
  state.history.push(event);state.acted.push(id);state.lastMessage=line;
  state.winner=winner();
  if(state.winner){state.phase='finished';state.turn=null}
  else skipDead();
  return {entry:event,state:snapshot()}
 }
 function enemy(){
  if(!state.turn||side(state.turn)!=='enemy'||state.phase!=='running')return null;
  var id=state.turn,mv=moves[id],pool;
  if(id==='enemyMage'){
   var need=state.hp.enemySpirit<hpMax.enemySpirit-20;
   pool=need?['heal','heal','spark','ward']:['spark','spark','ward','heal'];
  }else pool=['attack','attack','magic','guard'];
  return perform(id,pool[roll(pool.length)])
 }
 function player(key){if(!state.turn||side(state.turn)!=='player')return null;return perform(state.turn,key)}
 function getState(){return snapshot()}
 start();
 return {start:start,getState:getState,player:player,enemy:enemy,available:available,names:names,hpMax:hpMax};
}
window.ETARIUM_MAGE_BATTLE={create:create};
})();