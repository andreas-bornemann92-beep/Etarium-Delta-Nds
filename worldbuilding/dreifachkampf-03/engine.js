/* ETARIUM WORLDBUILDING – TRIPLE BATTLE, experimental */
(function(){'use strict';
function create(options){
 options=options||{};var random=options.random||Math.random;
 var ids=['playerSpirit1','playerSpirit2','playerSpirit3','playerMage','enemySpirit1','enemySpirit2','enemySpirit3','enemyMage'];
 var names={playerSpirit1:'Dein Geist I',playerSpirit2:'Dein Geist II',playerSpirit3:'Dein Geist III',playerMage:'Dein Magier',enemySpirit1:'Kaels Geist I',enemySpirit2:'Kaels Geist II',enemySpirit3:'Kaels Geist III',enemyMage:'Magier Kael'};
 var hpMax={playerSpirit1:100,playerSpirit2:95,playerSpirit3:90,playerMage:70,enemySpirit1:100,enemySpirit2:95,enemySpirit3:90,enemyMage:70};
 var manaMax={playerSpirit1:60,playerSpirit2:60,playerSpirit3:65,playerMage:80,enemySpirit1:60,enemySpirit2:60,enemySpirit3:65,enemyMage:80};
 var speed=Object.assign({playerSpirit1:91,playerSpirit2:75,playerSpirit3:86,playerMage:64,enemySpirit1:91,enemySpirit2:82,enemySpirit3:79,enemyMage:72},options.speed||{});
 var moves={
  playerSpirit1:[{key:'attack',name:'Angriff',damage:16,cost:0},{key:'magic',name:'Lichtfunken',damage:22,cost:12},{key:'guard',name:'Schutz',shield:12,cost:8},{key:'focus',name:'Äther sammeln',restore:16,cost:0}],
  playerSpirit2:[{key:'attack',name:'Angriff',damage:16,cost:0},{key:'magic',name:'Windstoß',damage:22,cost:12},{key:'guard',name:'Schutz',shield:12,cost:8},{key:'focus',name:'Äther sammeln',restore:16,cost:0}],
  playerSpirit3:[{key:'attack',name:'Angriff',damage:16,cost:0},{key:'magic',name:'Donnerfunken',damage:22,cost:12},{key:'guard',name:'Schutz',shield:12,cost:8},{key:'focus',name:'Äther sammeln',restore:16,cost:0}],
  enemySpirit3:[{key:'attack',name:'Krallenhieb',damage:16,cost:0},{key:'magic',name:'Eislicht',damage:22,cost:12},{key:'guard',name:'Abwehr',shield:12,cost:8},{key:'focus',name:'Äther sammeln',restore:16,cost:0}],
  enemySpirit1:[{key:'attack',name:'Steinschlag',damage:16,cost:0},{key:'magic',name:'Funkenschauer',damage:22,cost:12},{key:'guard',name:'Abwehr',shield:12,cost:8},{key:'focus',name:'Äther sammeln',restore:16,cost:0}],
  enemySpirit2:[{key:'attack',name:'Hieb',damage:16,cost:0},{key:'magic',name:'Frostfunken',damage:22,cost:12},{key:'guard',name:'Abwehr',shield:12,cost:8},{key:'focus',name:'Äther sammeln',restore:16,cost:0}],
  playerMage:[{key:'spark',name:'Funkenstoß',damage:14,cost:10},{key:'heal',name:'Heillicht',heal:16,cost:14},{key:'ward',name:'Schutzkreis',shield:12,cost:9},{key:'focus',name:'Äther sammeln',restore:16,cost:0}],
  enemyMage:[{key:'spark',name:'Arkanstoß',damage:14,cost:10},{key:'heal',name:'Genesung',heal:16,cost:14},{key:'ward',name:'Barriere',shield:12,cost:9},{key:'focus',name:'Äther sammeln',restore:16,cost:0}]
 };
 // Active mages can be targeted. Passive mages may only support living allied spirits.
 // Mode change consumes the mage's entire main action, no more than once per round.
 moves.playerMage.push({key:'bind',name:'Fesselzauber',weak:6,cost:12});
 moves.enemyMage.push({key:'bind',name:'Fesselzauber',weak:6,cost:12});
 var passiveMoves={
  playerMage:[{key:'command',name:'Angriffsbefehl',buff:6,cost:8},{key:'heal',name:'Heillicht',heal:16,cost:14},{key:'ward',name:'Schutzbefehl',shield:12,cost:9},{key:'focus',name:'Äther sammeln',restore:16,cost:0}],
  enemyMage:[{key:'command',name:'Angriffsbefehl',buff:6,cost:8},{key:'heal',name:'Genesung',heal:16,cost:14},{key:'ward',name:'Schutzbefehl',shield:12,cost:9},{key:'focus',name:'Äther sammeln',restore:16,cost:0}]
 };
 var state;
 function isMage(id){return id.endsWith('Mage')}
 function modeMoves(id){return isMage(id)&&state.mageMode[id]==='passive'?passiveMoves[id]:moves[id]}
 function team(id){return id.slice(0,6)==='player'?'player':'enemy'}
 function roll(n){return Math.max(0,Math.min(n-1,Math.floor(random()*n)))}
 function order(){var sorted=ids.slice().sort(function(a,b){return speed[b]-speed[a]});for(var i=0;i<sorted.length;){var j=i+1;while(j<sorted.length&&speed[sorted[i]]===speed[sorted[j]])j++;for(var x=j-1;x>i;x--){var y=i+roll(x-i+1),tmp=sorted[x];sorted[x]=sorted[y];sorted[y]=tmp}i=j}return sorted}
 function clone(){return {round:state.round,turn:state.turn,phase:state.phase,order:state.order.slice(),acted:state.acted.slice(),hp:Object.assign({},state.hp),mana:Object.assign({},state.mana),shield:Object.assign({},state.shield),buff:Object.assign({},state.buff),weak:Object.assign({},state.weak),mageMode:Object.assign({},state.mageMode),lastSwitchRound:Object.assign({},state.lastSwitchRound),speed:Object.assign({},speed),lastMessage:state.lastMessage,history:state.history.slice(),winner:state.winner,defeatReason:state.defeatReason}}
 function alive(id){return state.hp[id]>0}
 function available(id){
  var set=(modeMoves(id)||[]).map(function(m){return Object.assign({},m)});
  if(isMage(id)&&alive(id)&&state.lastSwitchRound[id]!==state.round)
   set.push({key:'switch',name:state.mageMode[id]==='active'?'Passiv werden':'Aktiv werden',cost:0,switch:true});
  return set
 }
 function targets(id,key){
  if(!id||!alive(id))return [];
  var m=available(id).find(function(x){return x.key===key});
  if(!m||state.mana[id]<m.cost)return [];
  if(m.switch)return [id];
  if(m.restore)return [id];
  if(m.buff)return ids.filter(function(t){return alive(t)&&team(t)===team(id)&&!isMage(t)});
  if(m.weak)return ids.filter(function(t){return alive(t)&&team(t)!==team(id)&&!(isMage(t)&&state.mageMode[t]==='passive')});
  if(m.damage)return ids.filter(function(t){return alive(t)&&team(t)!==team(id)&&!(isMage(t)&&state.mageMode[t]==='passive')});
  if(m.heal)return ids.filter(function(t){return alive(t)&&team(t)===team(id)&&state.hp[t]<hpMax[t]&&!(isMage(id)&&state.mageMode[id]==='passive'&&isMage(t))});
  if(m.shield)return (isMage(id)?ids.filter(function(t){return team(t)===team(id)&&!(state.mageMode[id]==='passive'&&isMage(t))}):[id]).filter(alive);
  return [];
 }
 function defeatReason(side){
  if(!alive(side+'Mage'))return 'mage';
  if(![1,2,3].some(function(n){return alive(side+'Spirit'+n)}))return 'spirits';
  return null;
 }
 function winner(){
  var playerDefeated=defeatReason('player'),enemyDefeated=defeatReason('enemy');
  if(playerDefeated&&enemyDefeated)return 'draw';
  return playerDefeated?'enemy':enemyDefeated?'player':null;
 }
 function progress(){
  while(state.phase==='running'){
   if(state.acted.length===state.order.length){
    state.round++;state.acted=[];state.order=order();
   }
   var id=state.order[state.acted.length];if(alive(id)){state.turn=id;return}state.acted.push(id);
  }
 }
 function start(){state={round:1,turn:null,phase:'running',order:order(),acted:[],hp:Object.assign({},hpMax),mana:Object.assign({},manaMax),shield:Object.fromEntries(ids.map(function(x){return [x,0]})),buff:Object.fromEntries(ids.map(function(x){return [x,0]})),weak:Object.fromEntries(ids.map(function(x){return [x,0]})),mageMode:{playerMage:'active',enemyMage:'active'},lastSwitchRound:{playerMage:0,enemyMage:0},lastMessage:'Dreifachkampf beginnt! Acht Kämpfer treten an.',history:[],winner:null,defeatReason:null};progress();return clone()}
 function execute(actor,key,target){
  if(state.phase!=='running'||state.turn!==actor||!targets(actor,key).includes(target))return null;
  var m=available(actor).find(function(x){return x.key===key}),value=0;
  state.mana[actor]-=m.cost;
  if(m.switch){
   state.mageMode[actor]=state.mageMode[actor]==='active'?'passive':'active';
   state.lastSwitchRound[actor]=state.round;
  }
  else if(m.restore){value=Math.min(m.restore,manaMax[actor]-state.mana[actor]);state.mana[actor]+=value}
  else if(m.buff){state.buff[target]=Math.max(state.buff[target],m.buff);value=m.buff}
  else if(m.weak){state.weak[target]=Math.max(state.weak[target],m.weak);value=m.weak}
  else if(m.damage){value=Math.max(1,m.damage+state.buff[actor]-state.weak[actor]-state.shield[target]);state.buff[actor]=0;state.weak[actor]=0;state.shield[target]=0;state.hp[target]=Math.max(0,state.hp[target]-value)}
  else if(m.heal){value=Math.min(m.heal,hpMax[target]-state.hp[target]);state.hp[target]+=value}
  else if(m.shield){value=m.shield;state.shield[target]=Math.max(state.shield[target],m.shield)}
  var kind=m.switch?'switch':m.buff?'buff':m.weak?'control':m.restore?'restore':m.damage?'damage':m.heal?'heal':'shield';
  state.lastMessage=names[actor]+' nutzt '+m.name+' auf '+names[target]+' ('+(kind==='damage'?'-'+value+' LP':kind==='heal'?'+'+value+' LP':kind==='restore'?'+'+value+' Äther':kind==='switch'?'Modus: '+state.mageMode[actor]:kind==='buff'?'Nächster Angriff +'+value:kind==='control'?'Nächster Angriff −'+value:'Schutz '+value)+').';
  var entry={round:state.round,actor:actor,move:key,target:target,kind:kind,value:value,cost:m.cost,text:state.lastMessage};state.history.push(entry);state.acted.push(actor);
  state.winner=winner();if(state.winner){
   state.defeatReason=state.winner==='player'?defeatReason('enemy'):state.winner==='enemy'?defeatReason('player'):'both';
   state.lastMessage+=' '+(state.winner==='player'?'Kaels Team':state.winner==='enemy'?'Dein Team':'Beide Teams')+
      (state.defeatReason==='mage'?' verliert: Magier K. o.!':state.defeatReason==='spirits'?' verliert: alle drei Geister K. o.!':' sind besiegt.');
   state.phase='finished';state.turn=null
  }else progress();
  return {entry:entry,state:clone()}
 }
 function player(key,target){return state.turn&&team(state.turn)==='player'?execute(state.turn,key,target):null}
 function enemy(){
  if(!state.turn||team(state.turn)!=='enemy')return null;
  var actor=state.turn;
  var options=available(actor).flatMap(function(m){return targets(actor,m.key).map(function(id){return {key:m.key,target:id}})});
  // Switch tactically to passive when endangered, return active when safe.
  if(isMage(actor)){
   var currently=state.mageMode[actor],mageHp=state.hp[actor],spiritAlive=[1,2,3].filter(function(n){return alive('enemySpirit'+n)}).length;
   var canSwitch=targets(actor,'switch').length>0;
   if(canSwitch&&currently==='active'&&mageHp<=42&&spiritAlive>0)return execute(actor,'switch',actor);
   if(canSwitch&&currently==='passive'&&mageHp>=55&&spiritAlive>=2&&roll(5)===0)return execute(actor,'switch',actor);
  }
  if(!options.length)return null;
  var healing=options.filter(function(x){return x.key==='heal'&&state.hp[x.target]/hpMax[x.target]<.55});
  var attack=options.filter(function(x){return x.key==='attack'||x.key==='magic'||x.key==='spark'||x.key==='bind'||x.key==='command'});
  var picked=healing.length&&roll(3)!==0?healing[roll(healing.length)]:attack.length&&roll(5)!==0?attack[roll(attack.length)]:options[roll(options.length)];
  return execute(actor,picked.key,picked.target)
 }
 start();
 return {start:start,player:player,enemy:enemy,getState:clone,available:available,targets:targets,names:names,hpMax:hpMax,manaMax:manaMax,speed:speed};
}
window.ETARIUM_TRIPLE_BATTLE={create:create};
})();