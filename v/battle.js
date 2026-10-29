/* Etarium Q – experimental, non-canonical combat presentation. No game-balance or damage logic yet. */
(function(){
'use strict';
var combat={active:false,opponent:'',phase:'choice',enteredAt:0,round:1,maxRounds:2,playerHP:100,enemyHP:100,log:[],lastAction:'',lastCounter:''};
function enter(opponent,time){combat.active=true;combat.opponent=opponent||'Kael';combat.phase='choice';combat.enteredAt=time||0;combat.round=1;combat.playerHP=100;combat.enemyHP=100;combat.log=[];combat.lastAction='';combat.lastCounter=''}
function leave(){combat.active=false;combat.phase='choice'}
function act(key){
 if(!combat.active||combat.phase!=='choice')return null;
 var moves={
  'angriff':{label:'Angriff',damage:18},
  'magie':{label:'Magie',damage:24},
  'schutz':{label:'Schutz',damage:0}
 };
 var action=moves[key];if(!action)return null;
 var defended=key==='schutz';
 combat.enemyHP=Math.max(0,combat.enemyHP-action.damage);
 var counter=defended?5:combat.round===1?13:16;
 if(combat.enemyHP===0)counter=0;
 combat.playerHP=Math.max(0,combat.playerHP-counter);
 combat.lastAction=defended?'Du schützt deinen Geist.':key==='magie'?'Dein Geist setzt einen Lichtfunken ein (24 Schaden).':'Dein Geist greift an (18 Schaden).';
 combat.lastCounter=counter?'Kaels Geist kontert ('+counter+' Schaden).':'Kaels Geist kann nicht mehr kontern.';
 combat.log.push({round:combat.round,move:key,damage:action.damage,counter:counter,playerHP:combat.playerHP,enemyHP:combat.enemyHP});
 combat.phase=(combat.round===combat.maxRounds||combat.playerHP===0||combat.enemyHP===0)?'finished':'result';
 return {action:combat.lastAction,counter:combat.lastCounter,finished:combat.phase==='finished'};
}
function next(){if(combat.active&&combat.phase==='result'){combat.round++;combat.phase='choice';return true}return false}

function path(ctx,fill,points){ctx.fillStyle=fill;ctx.beginPath();points.forEach(function(p,i){if(!i)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1])});ctx.closePath();ctx.fill()}
function ellipse(ctx,x,y,rx,ry,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()}
function text(ctx,s,x,y,size,color,bold){ctx.fillStyle=color;ctx.font=(bold?'bold ':'')+size+'px system-ui';ctx.fillText(s,x,y)}
function label(ctx,x,y,w,name,hp,enemy){
 ctx.fillStyle='#182839e7';ctx.fillRect(x,y,w,40);
 ctx.fillStyle='#e8d5b5';ctx.fillRect(x,y,w,2);
 text(ctx,name,x+12,y+18,13,'#fff2da',true);
 text(ctx,'LP',x+12,y+33,10,'#c3d1d2',true);
 ctx.fillStyle='#35485a';ctx.fillRect(x+36,y+27,w-49,7);
 ctx.fillStyle=enemy?'#bb615b':'#72af8a';ctx.fillRect(x+36,y+27,Math.max(0,(w-49)*hp/100),7);
}
function ghost(ctx,x,y,scale,back,time,enemy){
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
 ellipse(ctx,0,0,67,20,'#1e293f55');
 var bob=Math.sin(time/450+(enemy?1:0))*3;ctx.translate(0,bob);
 if(enemy){
  // Opponent is visually separate: forward-facing stone-light elemental placeholder.
  path(ctx,'#4f749a',[[-48,-30],[-34,-75],[-17,-67],[-5,-105],[23,-93],[48,-49],[31,-21],[-25,-18]]);
  path(ctx,'#86b8cb',[[-26,-48],[-9,-92],[15,-82],[31,-48],[16,-25],[-14,-23]]);
  path(ctx,'#bde8df',[[-8,-70],[10,-82],[18,-63],[7,-42],[-11,-45]]);
  ctx.fillStyle='#253c5a';ctx.fillRect(-6,-60,6,5);ctx.fillRect(13,-60,6,5);
  path(ctx,'#f1c78c',[[-34,-42],[-58,-18],[-30,-27]]);
  path(ctx,'#f1c78c',[[29,-39],[53,-15],[22,-25]]);
 }else{
  // Player-side spirit shown from behind in classic angled RPG combat framing.
  path(ctx,'#855f44',[[-55,-23],[-35,-66],[-8,-82],[24,-72],[53,-23],[32,2],[-39,2]]);
  path(ctx,'#c2a67f',[[-31,-59],[-5,-94],[24,-66],[28,-28],[-25,-27]]);
  path(ctx,'#ddc6a0',[[-24,-55],[-2,-80],[22,-56],[23,-36],[-22,-35]]);
  path(ctx,'#6b4b3a',[[-24,-34],[-37,5],[-5,-9],[13,-8],[37,5],[25,-35]]);
  path(ctx,'#a17f5c',[[-13,-77],[-19,-94],[-5,-85]]);
  path(ctx,'#e8d7bd',[[5,-84],[19,-100],[22,-78]]);
 }
 ctx.restore();
}
function draw(ctx,w,h,time){
 ctx.save();
 var bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#7fb9bc');bg.addColorStop(.62,'#cbe4c4');bg.addColorStop(1,'#537f70');
 ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 // Distinct depth planes: distant hills, battle ground and cinematic vignette.
 path(ctx,'#79a99c',[[0,171],[76,126],[143,159],[230,107],[327,149],[414,114],[512,160],[512,250],[0,250]]);
 path(ctx,'#517d73',[[0,216],[97,155],[204,196],[335,149],[456,182],[512,153],[512,279],[0,279]]);
 ellipse(ctx,365,212,118,30,'#b6d3b2');ellipse(ctx,144,315,145,38,'#adc6a5');
 ellipse(ctx,365,210,110,23,'#d4ddbb');ellipse(ctx,144,312,132,31,'#cbd6ad');
 ghost(ctx,368,206,.87,false,time,true);
 ghost(ctx,141,304,1.09,true,time,false);
 label(ctx,19,14,194,combat.opponent+' · Testgeist',combat.enemyHP,true);
 label(ctx,296,263,200,'Eigener Geist · Demo',combat.playerHP,false);
 ctx.fillStyle='#132536ee';ctx.fillRect(0,333,512,51);
 ctx.fillStyle='#dcb58b';ctx.fillRect(0,333,512,2);
 text(ctx,'TRAININGSKAMPF · RUNDE '+combat.round+' / 2',16,353,13,'#f6dabb',true);
 text(ctx,'A: Aktion wählen   ·   B: Zurück zur Stadt',16,371,12,'#ced7da',false);
 ctx.restore();
}
window.ETARIUM_BATTLE={state:combat,enter:enter,leave:leave,act:act,next:next,draw:draw,getState:function(){return {active:combat.active,opponent:combat.opponent,phase:combat.phase,round:combat.round,playerHP:combat.playerHP,enemyHP:combat.enemyHP,log:combat.log.slice()}}};
})();