/* Etarium K: playable Eichenbrunn prototype. All measurements are tile-based. */
(function(){
'use strict';
var W=48,H=36,T=32,spawn={x:24,y:32};
var terrain=Array.from({length:H},function(_,y){return Array.from({length:W},function(_,x){
 return x===0||x===W-1||y===0||y===H-1?'#':'.';
})});
function fill(x0,y0,w,h,t){for(var y=y0;y<y0+h;y++)for(var x=x0;x<x0+w;x++)if(x>=0&&x<W&&y>=0&&y<H)terrain[y][x]=t}
function house(x,y,w,h){fill(x,y,w,h,'H');fill(x+1,y+h-1,w-2,1,'H')}
fill(21,2,7,32,':');             // main north-south cobblestone road
fill(7,14,35,7,'p');            // town square around fountain
fill(9,24,32,3,':');            // southern east-west street
fill(19,7,11,3,':');            // northern approach
house(7,5,11,7);               // inn, north-west
house(32,5,10,7);              // shop, north-east
house(7,21,10,6);              // home, south-west
house(32,21,10,6);             // home, south-east
fill(22,15,4,3,'F');           // round fountain footprint
for(var x=0;x<W;x++)if(x<21||x>27)terrain[29][x]='W'; // city wall
fill(21,29,7,1,':');
terrain[29][21]='G';terrain[29][27]='G'; // gate towers
// trees outside navigable roads
var trees=[[4,3],[4,12],[44,4],[45,12],[3,22],[45,23],[7,30],[40,31],[13,31],[35,32],[5,17],[44,17]];
trees.forEach(function(p){fill(p[0],p[1],2,2,'T')});
var flowers=[[19,13],[30,13],[19,20],[30,20],[10,13],[38,13],[17,25],[31,25]];
flowers.forEach(function(p){terrain[p[1]][p[0]]='b'});
function rect(ctx,x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h)}
function paintTile(ctx,t,sx,sy,x,y,time){
 var alt=(x*19+y*23)%5;
 rect(ctx,sx,sy,T,T,alt%2?'#7db65d':'#70a950');
 rect(ctx,sx+3,sy+6,4,2,'#91c875');
 if(t===':'||t==='p'){
  rect(ctx,sx,sy,T,T,t==='p'?'#c7c3b5':'#b8afa0');
  rect(ctx,sx+1,sy+1,30,1,'#e2dacf');
  rect(ctx,sx+((x%2)*10),sy+16,20,1,'#898b87');
  rect(ctx,sx+16,sy,1,16,'#a2a096');
 }
 if(t==='H'){
  rect(ctx,sx,sy,T,T,'#c7b696');
  rect(ctx,sx+1,sy+1,30,30,'#c6ae87');
  rect(ctx,sx+3,sy+4,27,3,'#d8c7a0');
 }
 if(t==='W'||t==='G'){
  rect(ctx,sx,sy,T,T,t==='G'?'#7c8594':'#92959b');
  rect(ctx,sx+2,sy+3,28,5,'#b3b8be');
  rect(ctx,sx+1,sy+19,28,2,'#656e79');
 }
 if(t==='T'){
  rect(ctx,sx+13,sy+14,7,18,'#72553c');rect(ctx,sx+3,sy+4,26,22,'#246c49');
  rect(ctx,sx+9,sy+2,18,16,'#3e8b56');rect(ctx,sx+8,sy+8,8,7,'#65ab69');
 }
 if(t==='b'){
  rect(ctx,sx+7,sy+7,3,3,'#f2d8f2');
  rect(ctx,sx+19,sy+17,4,4,'#f3ce71');
  rect(ctx,sx+14,sy+24,4,4,'#f6eef1');
 }
 if(t==='F'){
  rect(ctx,sx,sy,T,T,'#afb3aa');
  rect(ctx,sx+2,sy+2,28,28,'#879899');
  rect(ctx,sx+6,sy+6,20,20,'#3f9fc4');
  rect(ctx,sx+10,sy+8,9,3,'#8addf3');
 }
 if(t==='#')rect(ctx,sx,sy,T,T,'#4a665d');
}
var buildings=[
 {name:'Gasthaus',x:7,y:5,w:11,h:7,roof:'#ab5840',trim:'#613c32'},
 {name:'Laden',x:32,y:5,w:10,h:7,roof:'#4e667d',trim:'#344558'},
 {name:'Wohnhaus',x:7,y:21,w:10,h:6,roof:'#b56343',trim:'#654036'},
 {name:'Wohnhaus',x:32,y:21,w:10,h:6,roof:'#b56343',trim:'#654036'}
];
function drawBuilding(ctx,b,camX,camY){
 var sx=b.x*T-camX,sy=b.y*T-camY,w=b.w*T,h=b.h*T;
 rect(ctx,sx+5,sy+45,w-10,h-47,'#d2bd9c');
 rect(ctx,sx+8,sy+54,w-16,5,'#8c684c');
 rect(ctx,sx+14,sy+74,18,23,'#5a708a');
 rect(ctx,sx+w-36,sy+74,18,23,'#5a708a');
 rect(ctx,sx+15,sy+76,12,12,'#e5c682');
 rect(ctx,sx+w-33,sy+76,12,12,'#e5c682');
 var roofHeight=57;
 // Two roof planes, drawn as clean trapezoids
 ctx.fillStyle=b.roof;
 ctx.beginPath();ctx.moveTo(sx-7,sy+roofHeight);ctx.lineTo(sx+w/2,sy+4);
 ctx.lineTo(sx+w+7,sy+roofHeight);ctx.closePath();ctx.fill();
 ctx.strokeStyle=b.trim;ctx.lineWidth=5;ctx.stroke();
 rect(ctx,sx+w/2-17,sy+h-44,34,44,'#654739');
 rect(ctx,sx+w/2-8,sy+h-35,16,34,'#44352e');
 rect(ctx,sx+w/2+6,sy+h-18,3,3,'#e1ba68');
 ctx.font='bold 13px system-ui';ctx.textAlign='center';
 rect(ctx,sx+w/2-55,sy+h-67,110,20,'#3d4e56');
 ctx.fillStyle='#f2debb';ctx.fillText(b.name,sx+w/2,sy+h-52);
 ctx.textAlign='left';
}
function drawScenery(ctx,camX,camY,time){
 buildings.forEach(function(b){drawBuilding(ctx,b,camX,camY)});
 // Fountain is larger than a character but smaller than town-square buildings
 var fx=24*T-camX,fy=16*T-camY;
 ctx.fillStyle='#d9e4df';ctx.beginPath();ctx.ellipse(fx,fy,53,33,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#4a9fc2';ctx.beginPath();ctx.ellipse(fx,fy,43,25,0,0,Math.PI*2);ctx.fill();
 rect(ctx,fx-10,fy-24,20,27,'#c2d1cb');
 rect(ctx,fx-4,fy-34,8,21,'#d2e0df');
 var sparkle=Math.sin(time/250)*3;
 rect(ctx,fx-21+sparkle,fy-5,10,2,'#b7edf2');
 // Gate entrance and city banner
 var gateY=29*T-camY;
 rect(ctx,21*T-camX,gateY-30,30,62,'#8b929e');
 rect(ctx,27*T-camX,gateY-30,30,62,'#8b929e');
 rect(ctx,21*T+5-camX,gateY-24,20,16,'#5b719b');
 rect(ctx,27*T+5-camX,gateY-24,20,16,'#5b719b');
 // Ground tile sign just inside the town gate
 var sx=24*T-camX,sy=27*T-camY;
 rect(ctx,sx-33,sy,65,12,'#725540');
 rect(ctx,sx-28,sy+3,55,8,'#a98d60');
}
window.ETARIUM_TOWN={W:W,H:H,T:T,spawn:spawn,world:terrain,
 solid:function(x,y){return x<0||x>=W||y<0||y>=H||'HFWGT#'.indexOf(terrain[y][x])>=0},
 drawTile:paintTile,drawScenery:drawScenery};
})();