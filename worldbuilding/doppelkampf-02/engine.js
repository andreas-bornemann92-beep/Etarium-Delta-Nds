/* ETARIUM WORLDBUILDING – DOUBLE BATTLE, experimental */
(function(){'use strict';
function create(options){
 options=options||{};var random=options.random||Math.random,maxRounds=options.maxRounds||12;
 var ids=['playerSpirit1','playerSpirit2','playerMage','enemySpirit1','enemySpirit2','enemyMage'];
 var names={playerSpirit1:'Dein Geist I',playerSpirit2:'Dein Geist II',playerMage:'Dein Magier',enemySpirit1:'Kaels Geist I',enemySpirit2:'Kaels Geist II',enemyMage:'Magier Kael'};
 var hpMax={playerSpirit1:100,playerSpirit2:95,playerMage:70,enemySpirit1:100,enemySpirit2:95,enemyMage:70};
 var manaMax={playerSpirit1:60,playerSpirit2:60,playerMage:80,enemySpirit1:60,enemySpirit2:60,enemyMage:80};
 var speed=Object.assign({playerSpirit1:91,playerSpirit2:75,playerMage:64,enemySpirit1:91,enemySpirit2:82,enemyMage:72},options.speed||{});
 var moves={
  playerSpirit1:[{key:'attack',name:'Angriff',damage:16,cost:0},{key:'magic',name:'Lichtfunken',damage:22,cost:12},{key:'guard',name:'Schutz',shield:12,cost:8},{key:'focus',name:'Äther sammeln',restore:16,cost:0}],
  playerSpirit2:[{key:'attack',name:'Angriff',damage:16,cost:0},{key:'magic',name:'Windstoß',damage:22,cost:12},{key:'guard',name:'Schutz',shield:12,cost:8},{key:'focus',name:'Äther sammeln',restore:16,cost:0}],
  enemySpirit1:[{key:'attack',name:'Steinschlag',damage:16,cost:0},{key:'magic',name:'Funkenschauer',damage:22,cost:12},{key:'guard',name:'Abwehr',shield:12,cost:8},{key:'focus',name:'Äther sammeln',restore:16,cost:0}],
  enemySpirit2:[{key:'attack',name:'Hieb',damage:16,cost:0},{key:'magic',name:'Frostfunken',damage:22,cost:12},{key:'guard',name:'Abwehr',shield:12,cost:8},{key:'focus',name:'Äther sammeln',restore:16,cost:0}],
  playerMage:[{key:'spark',name:'Funkenstoß',damage:14,cost:10},{key:'heal',name:'Heillicht',heal:16,cost:14},{key:'ward',name:'Schutzkreis',shield:12,cost:9},{key:'focus',name:'Äther sammeln',restore:16,cost:0}],
  enemyMage:[{key:'spark',name:'Arkanstoß',damage:14,cost:10},{key:'heal',name:'Genesung',heal:16,cost:14},{key:'ward',name:'Barriere',shield:12,cost:9},{key:'focus',name:'Äther sammeln',restore:16,cost:0}]
 };
 var state;
 function team(id){return id.slice(0,6)==='player'?'player':'enemy'}
 function roll(n){return Math.max(0,Math.min(n-1,Math.floor(random()*n)))}
 function order(){var sorted=ids.slice().sort(function(a,b){return speed[b]-speed[a]});for(var i=0;i<sorted.length;){var j=i+1;while(j<sorted.length&&speed[sorted[i]]===speed[sorted[j]])j++;for(var x=j-1;x>i;x--){var y=i+roll(x-i+1),tmp=sorted[x];sorted[x]=sorted[y];sorted[y]=tmp}i=j}return sorted}
 function clone(){return {round:state.round,turn:state.turn,phase:state.phase,order:state.order.slice(),acted:state.acted.slice(),hp:Object.assign({},state.hp),mana:Object.assign({},state.mana),shield:Object.assign({},state.shield),speed:Object.assign({},speed),lastMessage:state.lastMessage,history:state.history.slice(),winner:state.winner,maxRounds:maxRounds}}
 function alive(id){return state.hp[id]>0}
 function available(id){return (moves[id]||[]).map(function(m){return Object.assign({},m)})}
 function targets(id,key){
  if(!id||!alive(id))return [];
  var m=(moves[id]||[]).find(function(x){return x.key===key});
  if(!m||state.mana[id]<m.cost)return [];
  if(m.restore)return [id];
  if(m.damage)return ids.filter(function(t){return alive(t)&&team(t)!==team(id)});
  if(m.heal)return ids.filter(function(t){return alive(t)&&team(t)===team(id)&&state.hp[t]<hpMax[t]});
  if(m.shield)return (id.endsWith('Mage')?ids.filter(function(t){return team(t)===team(id)}):[id]).filter(alive);
  return [];
 }
 function winner(){var p=ids.some(function(id){return team(id)==='player'&&alive(id)}),e=ids.some(function(id){return team(id)==='enemy'&&alive(id)});return p&&!e?'player':e&&!p?'enemy':null}
 function progress(){
  while(state.phase==='running'){
   if(state.acted.length===state.order.length){
    if(state.round>=maxRounds){var scores={player:0,enemy:0};ids.forEach(function(id){scores[team(id)]+=state.hp[id]});state.winner=scores.player===scores.enemy?'draw':scores.player>scores.enemy?'player':'enemy';state.turn=null;state.phase='finished';return}
    state.round++;state.acted=[];state.order=order();
   }
   var id=state.order[state.acted.length];if(alive(id)){state.turn=id;return}state.acted.push(id);
  }
 }
 function start(){state={round:1,turn:null,phase:'running',order:order(),acted:[],hp:Object.assign({},hpMax),mana:Object.assign({},manaMax),shield:Object.fromEntries(ids.map(function(x){return [x,0]})),lastMessage:'Doppelkampf beginnt! Sechs Kämpfer treten an.',history:[],winner:null};progress();return clone()}
 function execute(actor,key,target){
  if(state.phase!=='running'||state.turn!==actor||!targets(actor,key).includes(target))return null;
  var m=moves[actor].find(function(x){return x.key===key}),value=0;
  state.mana[actor]-=m.cost;
  if(m.restore){value=Math.min(m.restore,manaMax[actor]-state.mana[actor]);state.mana[actor]+=value}
  else if(m.damage){value=Math.max(1,m.damage-state.shield[target]);state.shield[target]=0;state.hp[target]=Math.max(0,state.hp[target]-value)}
  else if(m.heal){value=Math.min(m.heal,hpMax[target]-state.hp[target]);state.hp[target]+=value}
  else if(m.shield){value=m.shield;state.shield[target]=Math.max(state.shield[target],m.shield)}
  var kind=m.restore?'restore':m.damage?'damage':m.heal?'heal':'shield';
  state.lastMessage=names[actor]+' nutzt '+m.name+' auf '+names[target]+' ('+(kind==='damage'?'-'+value+' LP':kind==='heal'?'+'+value+' LP':kind==='restore'?'+'+value+' Äther':'Schutz '+value)+').';
  var entry={round:state.round,actor:actor,move:key,target:target,kind:kind,value:value,cost:m.cost,text:state.lastMessage};state.history.push(entry);state.acted.push(actor);
  state.winner=winner();if(state.winner){state.phase='finished';state.turn=null}else progress();
  return {entry:entry,state:clone()}
 }
 function player(key,target){return state.turn&&team(state.turn)==='player'?execute(state.turn,key,target):null}
 function enemy(){
  if(!state.turn||team(state.turn)!=='enemy')return null;
  var actor=state.turn,options=moves[actor].flatMap(function(m){return targets(actor,m.key).map(function(id){return {key:m.key,target:id}})});
  if(!options.length)return null;
  var healing=options.filter(function(x){return x.key==='heal'&&state.hp[x.target]/hpMax[x.target]<.55});
  var attack=options.filter(function(x){return x.key==='attack'||x.key==='magic'||x.key==='spark'});
  var picked=healing.length&&roll(3)!==0?healing[roll(healing.length)]:attack.length&&roll(5)!==0?attack[roll(attack.length)]:options[roll(options.length)];
  return execute(actor,picked.key,picked.target)
 }
 start();
 return {start:start,player:player,enemy:enemy,getState:clone,available:available,targets:targets,names:names,hpMax:hpMax,manaMax:manaMax,speed:speed};
}
window.ETARIUM_DOUBLE_BATTLE={create:create};
})();