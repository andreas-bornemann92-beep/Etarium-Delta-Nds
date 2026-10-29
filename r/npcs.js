/* Etarium Q: four NPC roles, 42px detailed sprites and combat challenger. */
(function(){
'use strict';
var actors=[
 {id:'mara',name:'Mara',role:'dialog',x:20,y:24,face:'down',coat:'#926547',hair:'#4e302b',skin:'#e4af8b',line:'Willkommen in Eichenbrunn! Am Brunnenplatz findest du Händler und Reisende.'},
 {id:'toren',name:'Toren',role:'routine',x:30,y:17,face:'right',coat:'#406a83',hair:'#44332b',skin:'#dbad87',route:[[30,17],[31,17],[31,18],[30,18],[29,18],[29,17]],routeStep:0,phase:0,fromX:30,fromY:18,toX:30,toY:18,moving:false,start:0,waitUntil:0},
 {id:'elis',name:'Elis',role:'query',x:31,y:23,face:'left',coat:'#7172a0',hair:'#b48a51',skin:'#edc09f'},
 {id:'kael',name:'Kael',role:'battle',x:26,y:27,face:'left',coat:'#844a57',hair:'#302a33',skin:'#ddb495'}
];
var result={checked:false,value:null,at:null};
var idlePatterns={mara:0,elis:0,kael:0};
var errors=0;
function solid(x,y){return window.ETARIUM_TOWN.solid(x,y)}
function occupied(x,y){return actors.some(function(a){return a.x===x&&a.y===y})}
function reset(){actors[0].face='down';actors[2].face='left';actors[3].face='left';actors[1].x=30;actors[1].y=17;actors[1].fromX=30;actors[1].fromY=17;actors[1].toX=30;actors[1].toY=17;actors[1].routeStep=0;actors[1].moving=false;actors[1].waitUntil=0;actors[1].face='right';result={checked:false,value:null,at:null}}
function update(time,paused,px,py){
 var a=actors[1];if(paused)return;
 if(a.moving){
  var p=Math.min(1,(time-a.start)/360);
  a.phase=p;
  if(p>=1){a.moving=false;a.x=a.toX;a.y=a.toY;a.waitUntil=time+650;a.phase=0}
  return;
 }
 if(time<a.waitUntil)return;
 var step=(a.routeStep+1)%a.route.length,target=a.route[step];
 if(solid(target[0],target[1])||(target[0]===px&&target[1]===py)){
  a.waitUntil=time+450;return;
 }
 a.fromX=a.x;a.fromY=a.y;a.toX=target[0];a.toY=target[1];
 a.face=target[0]>a.x?'right':target[0]<a.x?'left':target[1]>a.y?'down':'up';
 a.routeStep=step;a.moving=true;a.start=time;
}
function drawOne(ctx,a,cam,time){
 if(!a.moving){var faces=['down','left','up','right'];var offset=a.id==='mara'?0:a.id==='elis'?1:2;a.face=faces[(Math.floor(time/2400)+offset)%4]}
 var phase=a.moving?a.phase:0;
 var wx=a.moving?a.fromX+(a.toX-a.fromX)*phase:a.x;
 var wy=a.moving?a.fromY+(a.toY-a.fromY)*phase:a.y;
 var x=Math.round(wx*32-cam.x+16),y=Math.round(wy*32-cam.y+27);
 var stride=a.moving?Math.sin(phase*Math.PI*4):0,hop=a.moving?Math.abs(stride)*1.2:0;
 // Detailed 42px figures, roughly one third shorter than previous 70px NPC silhouettes.
 ctx.fillStyle='#233f355a';ctx.beginPath();ctx.ellipse(x,y+1,10,3.5,0,0,Math.PI*2);ctx.fill();
 ctx.save();ctx.translate(x,y-hop);
 function part(px,py,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(px),Math.round(py),w,h)}
 part(-7+stride*2,-13,6,12,'#4f4850');part(2-stride*2,-13,6,12,'#4f4850');
 part(-8+stride*2,-3,7,5,'#41332d');part(2-stride*2,-3,7,5,'#41332d');
 part(-11,-31,22,19,a.coat);
 part(-11,-30,2,16,'#cdb88b');part(9,-30,2,16,'#273d47');
 part(-11,-15,22,3,'#9e805c');
 part(-14-stride,-27,4,14,a.skin);part(10+stride,-27,4,14,a.skin);
 part(-8,-46,16,17,a.skin);
 part(-9,-48,18,7,a.hair);part(-9,-42,3,8,a.hair);
 // Shading, collar, seams, satchel and clasp.
 part(-6,-32,12,3,'#b9b3a2');
 part(-1,-30,2,12,'#c4aa83');
 part(6,-21,6,9,'#524439');
 part(9,-20,2,4,'#e3b774');
 if(a.face==='down'){part(-5,-37,2,2,'#262635');part(4,-37,2,2,'#262635')}
 else if(a.face==='left')part(-7,-37,2,2,'#262635');
 else if(a.face==='right')part(6,-37,2,2,'#262635');
 if(a.role==='battle'){
  part(-12,-39,5,13,'#d5aa64');
  part(-13,-27,6,3,'#d7bf81');
 }
 ctx.restore();
 ctx.fillStyle='#172537e8';ctx.fillRect(x-20,y-62,40,13);
 ctx.font='bold 9px system-ui';ctx.fillStyle='#f8e8cd';ctx.textAlign='center';ctx.fillText(a.name,x,y-52);ctx.textAlign='left';
 if(a.role!=='routine'){
  ctx.fillStyle=a.role==='battle'?'#f6b1ad':a.role==='query'?'#b5dfff':'#ffe1a2';
  ctx.font='bold 13px system-ui';ctx.fillText(a.role==='query'?'?':a.role==='battle'?'⚔':'!',x+11,y-39);
 }
}
function draw(ctx,cam,time){actors.slice().sort(function(a,b){return a.y-b.y}).forEach(function(a){drawOne(ctx,a,cam,time)})}
function nearby(x,y,range){
 var candidates=actors.map(function(a){
  var ax=a.moving?a.fromX+(a.toX-a.fromX)*a.phase:a.x;
  var ay=a.moving?a.fromY+(a.toY-a.fromY)*a.phase:a.y;
  return {actor:a,distance:Math.abs(x-ax)+Math.abs(y-ay)};
 }).sort(function(a,b){return a.distance-b.distance});
 return candidates[0]&&candidates[0].distance<=range?candidates[0].actor:null;
}
function query(){
 if(!result.checked){
  result.checked=true;result.value='Der Marktbrunnen ist intakt. Das Wasser ist klar, und es gibt heute keine gemeldeten Störungen.';result.at='Eichenbrunn';
 }
 return result.value;
}
window.ETARIUM_NPCS={actors:actors,reset:reset,update:update,draw:draw,occupied:occupied,nearby:nearby,query:query,getResult:function(){return Object.assign({},result)},getState:function(){return actors.map(function(a){return {id:a.id,x:a.x,y:a.y,role:a.role,moving:!!a.moving,routeStep:a.routeStep||0}})}};
})();