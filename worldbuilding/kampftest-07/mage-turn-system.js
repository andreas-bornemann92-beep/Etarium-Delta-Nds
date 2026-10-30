/* Etarium Worldbuilding Kampftest 02: 2 Geister + 2 Magier.
   Independent prototype; canonical mechanics unchanged. */
(function(){
'use strict';
function create(options){
 options=options||{};var random=options.random||Math.random,maxRounds=options.maxRounds||10;
 var actors=['playerSpirit','enemySpirit','playerMage','enemyMage'];
 var hpMax={playerSpirit:100,enemySpirit:100,playerMage:70,enemyMage:70};
 var manaMax={playerSpirit:60,enemySpirit:60,playerMage:80,enemyMage:80};
 var manaCosts={attack:0,magic:12,guard:8,spark:10,heal:14,ward:9,focus:0};
 var speed=Object.assign({playerSpirit:91,enemySpirit:91,playerMage:64,enemyMage:72},options.speed||{});
 function initiativeOrder(){
  var ordered=actors.slice().sort(function(a,b){return speed[b]-speed[a]});
  for(var first=0;first<ordered.length;){
   var last=first+1;
   while(last<ordered.length&&speed[ordered[last]]===speed[ordered[first]])last++;
   for(var i=last-1;i>first;i--){
    var j=first+roll(i-first+1),temp=ordered[i];
    ordered[i]=ordered[j];ordered[j]=temp;
   }
   first=last;
  }
  return ordered
 }
 var names={playerSpirit:'Dein Geist',enemySpirit:'Kaels Geist',playerMage:'Dein Magier',enemyMage:'Magier Kael'};
 var moves={
 playerSpirit:[{key:'attack',name:'Angriff',damage:16},{key:'magic',name:'Lichtfunken',damage:22},{key:'guard',name:'Schutz',shield:12}],
 enemySpirit:[{key:'attack',name:'Steinschlag',damage:16},{key:'magic',name:'Funkenschauer',damage:22},{key:'guard',name:'Abwehr',shield:12}],
 playerMage:[{key:'spark',name:'Funkenstoß',damage:14},{key:'heal',name:'Heillicht',heal:16},{key:'ward',name:'Schutzkreis',shield:12}],
 enemyMage:[{key:'spark',name:'Arkanstoß',damage:14},{key:'heal',name:'Genesung',heal:16},{key:'ward',name:'Barriere',shield:12}]
 };
 Object.keys(moves).forEach(function(id){moves[id].push({key:'focus',name:'Äther sammeln',restore:16})});
 var state;
 function side(id){return id.startsWith('player')?'player':'enemy'}
 function roll(n){return Math.min(n-1,Math.max(0,Math.floor(random()*n)))}
 function snapshot(){return {phase:state.phase,round:state.round,turn:state.turn,starter:state.starter,order:state.order.slice(),acted:state.acted.slice(),speed:Object.assign({},speed),hp:Object.assign({},state.hp),mana:Object.assign({},state.mana),shield:Object.assign({},state.shield),history:state.history.slice(),lastMessage:state.lastMessage,winner:state.winner,maxRounds:maxRounds}}
 function alive(id){return state.hp[id]>0}
 function availableTargets(actor,key){
  var move=(moves[actor]||[]).find(function(m){return m.key===key});
  if(!move||state.mana[actor]<manaCosts[key])return [];
  if(move.restore)return alive(actor)?[actor]:[];
  if(move.damage)return actors.filter(function(id){return side(id)!==side(actor)&&alive(id)});
  if(move.heal)return actors.filter(function(id){return side(id)===side(actor)&&alive(id)&&state.hp[id]<hpMax[id]});
  if(move.shield)return (actor.endsWith('Spirit')?[actor]:actors.filter(function(id){return side(id)===side(actor)})).filter(alive);
  return [];
 }
 function winner(){if(!alive('playerSpirit')&&!alive('playerMage'))return 'enemy';if(!alive('enemySpirit')&&!alive('enemyMage'))return 'player';return null}
 function start(){
  var order=initiativeOrder(),first=side(order[0]);
  state={phase:'running',round:1,starter:first,order:order,turn:null,acted:[],
  hp:Object.assign({},hpMax),mana:Object.assign({},manaMax),shield:{playerSpirit:0,enemySpirit:0,playerMage:0,enemyMage:0},history:[],lastMessage:(first==='player'?'Dein Team':'Kaels Team')+' beginnt dank der höchsten Geschwindigkeit!',winner:null};
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
    state.round++;state.acted=[];state.order=initiativeOrder();
   }
   var id=state.order[state.acted.length];
   if(alive(id)){state.turn=id;return}
   state.acted.push(id);
  }
 }
 function perform(id,key,targetId){
  if(state.phase!=='running'||state.turn!==id)return null;
  var move=moves[id].find(x=>x.key===key);if(!move)return null;
  var candidates=availableTargets(id,key);
  if(!candidates.includes(targetId))return null;
  var cost=manaCosts[key];
  if(state.mana[id]<cost)return null;
  state.mana[id]-=cost;
  var victim=targetId,value=0,verb='';
  if(move.restore){
   value=Math.min(move.restore,manaMax[id]-state.mana[id]);state.mana[id]+=value;
   verb=' sammelt '+value+' Äther.';
  }else
  if(move.damage){
   value=Math.max(1,move.damage-state.shield[victim]);state.shield[victim]=0;
   state.hp[victim]=Math.max(0,state.hp[victim]-value);
   verb=' trifft '+names[victim]+' für '+value+' Schaden.';
  }else if(move.heal){
   value=Math.min(move.heal,hpMax[victim]-state.hp[victim]);state.hp[victim]+=value;
   verb=' heilt '+names[victim]+' um '+value+' LP.';
  }else{
   state.shield[victim]=Math.max(state.shield[victim],move.shield);
   value=move.shield;verb=' schützt '+names[victim]+' vor '+value+' Schaden des nächsten Treffers.';
  }
  var line=names[id]+' nutzt '+move.name+' und'+verb;
  var event={round:state.round,actor:id,move:key,target:victim,preferred:targetId,value:value,cost:cost,kind:move.restore?'restore':move.damage?'damage':move.heal?'heal':'shield',hp:Object.assign({},state.hp),text:line};
  state.history.push(event);state.acted.push(id);state.lastMessage=line;
  state.winner=winner();
  if(state.winner){state.phase='finished';state.turn=null}
  else skipDead();
  return {entry:event,state:snapshot()}
 }
 function enemy(){
  if(!state.turn||side(state.turn)!=='enemy'||state.phase!=='running')return null;
  var id=state.turn;
  var pool=id==='enemyMage'?
    (state.hp.enemySpirit<80||state.hp.enemyMage<53?['heal','heal','spark','ward','focus']:['spark','spark','ward','heal','focus']):
    ['attack','attack','magic','guard','focus'];
  var possible=pool.map(function(key){return {key:key,targets:availableTargets(id,key)}}).filter(function(x){return x.targets.length>0});
  if(!possible.length)return null;
  var action=possible[roll(possible.length)],targets=action.targets;
  var pick=targets[roll(targets.length)];
  if(action.key==='heal')pick=targets.reduce(function(best,n){return state.hp[n]/hpMax[n]<state.hp[best]/hpMax[best]?n:best},targets[0]);
  return perform(id,action.key,pick)
 }
 function player(key,targetId){
  if(!state.turn||side(state.turn)!=='player')return null;
  return perform(state.turn,key,targetId)
 }
 function getState(){return snapshot()}
 start();
 return {start:start,getState:getState,player:player,enemy:enemy,available:available,availableTargets:availableTargets,names:names,hpMax:hpMax,manaMax:manaMax,manaCosts:manaCosts,speed:Object.assign({},speed)};
}
window.ETARIUM_MAGE_BATTLE={create:create};
})();