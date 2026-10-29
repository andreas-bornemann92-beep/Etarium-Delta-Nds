/* Etarium O: three independent NPC roles and simple animated avatars. */
(function(){
'use strict';
var actors=[
 {id:'mara',name:'Mara',role:'dialog',x:26,y:27,face:'down',coat:'#926547',hair:'#4e302b',skin:'#e4af8b',line:'Willkommen in Eichenbrunn! Am Brunnenplatz findest du Händler und Reisende.'},
 {id:'toren',name:'Toren',role:'routine',x:30,y:18,face:'right',coat:'#406a83',hair:'#44332b',skin:'#dbad87',route:[[30,18],[31,18],[31,19],[30,19],[29,19],[29,18]],routeStep:0,phase:0,fromX:30,fromY:18,toX:30,toY:18,moving:false,start:0,waitUntil:0},
 {id:'elis',name:'Elis',role:'query',x:29,y:25,face:'left',coat:'#7172a0',hair:'#b48a51',skin:'#edc09f'}
];
var result={checked:false,value:null,at:null};
function solid(x,y){return window.ETARIUM_TOWN.solid(x,y)}
function occupied(x,y){return actors.some(function(a){return a.x===x&&a.y===y})}
function reset(){actors[1].x=30;actors[1].y=18;actors[1].routeStep=0;actors[1].moving=false;actors[1].waitUntil=0;actors[1].face='right';result={checked:false,value:null,at:null}}
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
 var progress=a.moving?a.phase:0,wx=a.moving?a.fromX+(a.toX-a.fromX)*progress:a.x,wy=a.moving?a.fromY+(a.toY-a.fromY)*progress:a.y;
 var sx=Math.round(wx*32-cam.x+16),sy=Math.round(wy*32-cam.y+25),walk=a.moving?Math.sin(progress*Math.PI*4):0,bob=Math.abs(walk)*2;
 // NPC sprites have a stable 31px footprint with a ~65px standing silhouette.
 ctx.fillStyle='#283e3455';ctx.beginPath();ctx.ellipse(sx,sy+4,12,5,0,0,Math.PI*2);ctx.fill();
 ctx.save();ctx.translate(sx,sy-bob);
 ctx.fillStyle='#413b3b';ctx.fillRect(-10+walk*3,-17,8,18);ctx.fillRect(3-walk*3,-17,8,18);
 ctx.fillStyle='#4a3529';ctx.fillRect(-11+walk*3,-3,9,7);ctx.fillRect(3-walk*3,-3,9,7);
 ctx.fillStyle=a.coat;ctx.fillRect(-13,-47,26,32);
 ctx.fillStyle='#b8a17b';ctx.fillRect(-13,-19,26,4);
 ctx.fillStyle=a.skin;ctx.fillRect(-19-walk*2,-44,6,23);ctx.fillRect(13+walk*2,-44,6,23);
 ctx.fillStyle=a.skin;ctx.fillRect(-11,-68,22,23);
 ctx.fillStyle=a.hair;ctx.fillRect(-13,-71,26,12);ctx.fillRect(-12,-61,6,10);
 if(a.face==='down'){ctx.fillStyle='#30252c';ctx.fillRect(-6,-54,3,3);ctx.fillRect(4,-54,3,3)}
 if(a.face==='right'){ctx.fillStyle='#30252c';ctx.fillRect(8,-55,3,3)}
 if(a.face==='left'){ctx.fillStyle='#30252c';ctx.fillRect(-11,-55,3,3)}
 ctx.restore();
 ctx.fillStyle='#192630cc';ctx.fillRect(sx-23,sy-84,46,13);
 ctx.font='bold 10px system-ui';ctx.fillStyle='#f8e5be';ctx.textAlign='center';ctx.fillText(a.name,sx,sy-74);
 ctx.textAlign='left';
 if(a.role==='dialog'||a.role==='query'){ctx.fillStyle=a.role==='query'?'#bfe2ff':'#ffe8a8';ctx.font='bold 13px system-ui';ctx.fillText(a.role==='query'?'?':'!',sx+16,sy-63)}
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