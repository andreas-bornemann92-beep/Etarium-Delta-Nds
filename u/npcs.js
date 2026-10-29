/* Etarium Q: four NPC roles, 42px detailed sprites and combat challenger. */
(function(){
'use strict';
var actors=[
 {id:'mara',name:'Mara',role:'dialog',x:20,y:24,face:'down',coat:'#926547',hair:'#4e302b',skin:'#e4af8b',scale:.94,style:'apron',accent:'#eed4ac',line:'Willkommen in Eichenbrunn! Am Brunnenplatz findest du Händler und Reisende.'},
 {id:'toren',name:'Toren',role:'routine',x:30,y:17,face:'right',coat:'#406a83',hair:'#44332b',skin:'#dbad87',scale:1.11,style:'guard',accent:'#b7ccd2',route:[[30,17],[31,17],[31,18],[30,18],[29,18],[29,17]],routeStep:0,phase:0,fromX:30,fromY:17,toX:30,toY:17,moving:false,start:0,waitUntil:0},
 {id:'elis',name:'Elis',role:'query',x:31,y:23,face:'left',coat:'#7172a0',hair:'#b48a51',skin:'#edc09f',scale:.88,style:'scholar',accent:'#d5beeb'},
 {id:'kael',name:'Kael',role:'battle',x:26,y:27,face:'left',coat:'#844a57',hair:'#302a33',skin:'#ddb495',scale:1.05,style:'trainer',accent:'#edc486'}
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
 ctx.save();ctx.translate(x,y-hop);ctx.scale(a.scale||1,a.scale||1);
 function part(px,py,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(px),Math.round(py),w,h)}
 part(-7+stride*2,-13,6,12,'#4f4850');part(2-stride*2,-13,6,12,'#4f4850');
 part(-8+stride*2,-3,7,5,'#41332d');part(2-stride*2,-3,7,5,'#41332d');
 part(-11,-31,22,19,a.coat);
 part(-11,-30,2,16,'#cdb88b');part(9,-30,2,16,'#273d47');
 part(-11,-15,22,3,'#9e805c');
 part(-14-stride,-27,4,14,a.skin);part(10+stride,-27,4,14,a.skin);
 part(-8,-46,16,17,a.skin);
 part(-9,-48,18,7,a.hair);part(-9,-42,3,8,a.hair);
 // Character-specific hairstyles rather than uniformly cropped heads.
 if(a.style==='apron'){part(-11,-42,4,13,a.hair);part(7,-43,5,12,a.hair);part(-7,-48,6,3,'#bc8b61')}
 if(a.style==='guard'){part(-12,-49,24,5,'#334f63');part(-9,-52,18,6,'#516d7e')}
 if(a.style==='scholar'){part(-10,-43,4,17,a.hair);part(7,-43,4,17,a.hair);part(0,-51,7,5,'#d9bd7d')}
 if(a.style==='trainer'){part(-12,-49,21,7,'#302a33');part(6,-54,5,8,'#302a33')}
 // Shading, collar, seams, satchel and clasp.
 part(-6,-32,12,3,'#b9b3a2');
 // Layered cuffs, footwear soles and clothing seams keep miniature sprites readable.
 part(-8,-3,8,2,'#a18b71');part(2,-3,8,2,'#a18b71');
 part(-13,-26,2,7,'#e5c59d');part(11,-26,2,7,'#e5c59d');
 part(-8,-28,3,12,'#b49a78');part(6,-28,3,12,'#b49a78');
 part(-1,-30,2,12,'#c4aa83');
 part(6,-21,6,9,'#524439');
 part(9,-20,2,4,'#e3b774');
 // Occupation silhouettes: apron, shoulder guards, book strap, trainer scarf.
 if(a.style==='apron'){part(-14,-33,7,8,'#92785c');part(-8,-23,16,15,'#d9c9ac');part(-7,-14,14,2,'#ad987f');part(-5,-22,10,4,a.accent)}
 if(a.style==='guard'){part(-15,-45,30,4,'#526b75');part(-13,-30,7,7,'#a1aeb0');part(6,-30,7,7,'#a1aeb0');part(-9,-16,18,4,'#c4c5b6');part(-2,-17,4,4,'#9c7341')}
 if(a.style==='scholar'){part(-11,-46,22,5,'#c3a4a0');part(-10,-27,4,18,'#d0b6d8');part(5,-29,3,16,'#c6a6d5');part(9,-24,9,12,'#786d59');part(10,-23,7,9,'#e1d6b0')}
 if(a.style==='trainer'){part(-12,-37,4,12,'#cc9962');part(-10,-32,21,5,a.accent);part(-13,-24,6,15,'#493f45');part(-11,-35,4,7,'#e4c197')}
 if(a.face==='down'){part(-5,-37,2,2,'#262635');part(4,-37,2,2,'#262635')}
 else if(a.face==='left')part(-7,-37,2,2,'#262635');
 else if(a.face==='right')part(6,-37,2,2,'#262635');
 if(a.role==='battle'){
  part(-12,-39,5,13,'#d5aa64');
  part(-13,-27,6,3,'#d7bf81');
 }
 ctx.restore();
 ctx.fillStyle='#172537e8';ctx.fillRect(x-20,y-60*(a.scale||1)-4,40,13);
 ctx.font='bold 9px system-ui';ctx.fillStyle='#f8e8cd';ctx.textAlign='center';ctx.fillText(a.name,x,y-60*(a.scale||1)+6);ctx.textAlign='left';
 if(a.role!=='routine'){
  ctx.fillStyle=a.role==='battle'?'#f6b1ad':a.role==='query'?'#b5dfff':'#ffe1a2';
  ctx.font='bold 13px system-ui';ctx.fillText(a.role==='query'?'?':a.role==='battle'?'⚔':'!',x+11,y-49*(a.scale||1));
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
window.ETARIUM_NPCS={actors:actors,reset:reset,update:update,draw:draw,occupied:occupied,nearby:nearby,query:query,getResult:function(){return Object.assign({},result)},getState:function(){return actors.map(function(a){return {id:a.id,x:a.x,y:a.y,role:a.role,scale:a.scale,style:a.style,moving:!!a.moving,routeStep:a.routeStep||0}})}};
})();