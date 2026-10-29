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
 if((x*13+y*7)%11===0){rect(ctx,sx+21,sy+17,2,3,'#e6b6dd');rect(ctx,sx+23,sy+16,2,3,'#f7e9c6')}
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
  rect(ctx,sx+10+Math.sin(time/260)*2,sy+8,9,3,'#8addf3');
 }
 if(t==='#')rect(ctx,sx,sy,T,T,'#4a665d');
}
var buildings=[
 {name:'Gasthaus',x:7,y:5,w:11,h:7,roof:'#ab5840',trim:'#613c32'},
 {name:'Laden',x:32,y:5,w:10,h:7,roof:'#4e667d',trim:'#344558'},
 {name:'Wohnhaus',x:7,y:21,w:10,h:6,roof:'#b56343',trim:'#654036'},
 {name:'Wohnhaus',x:32,y:21,w:10,h:6,roof:'#b56343',trim:'#654036'}
];
function drawBuilding(ctx,b,camX,camY,time){
 var sx=b.x*T-camX,sy=b.y*T-camY,w=b.w*T,h=b.h*T;
 if(sx+w<0||sy+h<0||sx>512||sy>384)return;
 // Plinth, rendered above the game tile but below the facade.
 rect(ctx,sx+3,sy+h-22,w-6,18,'#928475');
 rect(ctx,sx+9,sy+53,w-18,h-59,'#d5bf9c');
 rect(ctx,sx+13,sy+56,w-26,7,'#ead5b0');
 for(var floor=68;floor<h-35;floor+=27){
   rect(ctx,sx+9,sy+floor,w-18,2,'#b29c7d');
 }
 // Timber framework with readable geometry at mobile scale.
 for(var beam=12;beam<w-8;beam+=85){
  rect(ctx,sx+beam,sy+55,7,h-68,'#795940');
  rect(ctx,sx+beam+14,sy+87,35,5,'#9c7450');
 }
 // Raised pitched roof with hand-shaded tiles.
 ctx.fillStyle=b.roof;ctx.beginPath();
 ctx.moveTo(sx-10,sy+59);ctx.lineTo(sx+w/2,sy+1);
 ctx.lineTo(sx+w+10,sy+59);ctx.closePath();ctx.fill();
 ctx.strokeStyle=b.trim;ctx.lineWidth=7;ctx.stroke();
 ctx.save();ctx.beginPath();ctx.moveTo(sx-10,sy+59);ctx.lineTo(sx+w/2,sy+1);ctx.lineTo(sx+w+10,sy+59);ctx.closePath();ctx.clip();
 for(var ry=18;ry<67;ry+=10){
  ctx.strokeStyle=(ry%20)?'#ffffff22':'#27202d33';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(sx-12,sy+ry);ctx.lineTo(sx+w+12,sy+ry);ctx.stroke();
  for(var rx=0;rx<w+12;rx+=25){rect(ctx,sx+rx+(ry%20),sy+ry,2,8,'#f2d3b021')}
 }
 ctx.restore();
 // Illuminated windows, shutters and porch.
 var windowY=sy+Math.min(h-76,103),dist=Math.min(80,w/3);
 for(var wi=-1;wi<=1;wi+=2){
  var wx=sx+w/2+wi*dist-12;
  rect(ctx,wx-5,windowY-5,34,39,'#6a4e42');
  rect(ctx,wx,windowY,24,26,'#f9d69b');
  rect(ctx,wx+11,windowY,3,26,'#775b46');
  rect(ctx,wx,windowY+12,24,3,'#775b46');
  rect(ctx,wx-7,windowY+29,38,5,'#e6c0a2');
 }
 rect(ctx,sx+w/2-22,sy+h-69,44,69,'#744c37');
 rect(ctx,sx+w/2-15,sy+h-59,30,59,'#44372d');
 rect(ctx,sx+w/2+10,sy+h-24,4,4,'#f6d68b');
 rect(ctx,sx+w/2-31,sy+h-4,62,7,'#b1a39a');
 // Label sits over door and deliberately stays readable at small zoom.
 rect(ctx,sx+w/2-60,sy+h-94,120,25,'#293946');
 rect(ctx,sx+w/2-59,sy+h-93,118,2,'#d2ab6b');
 ctx.fillStyle='#f7e6c2';ctx.textAlign='center';ctx.font='bold 14px system-ui';
 ctx.fillText(b.name,sx+w/2,sy+h-76);ctx.textAlign='left';
}
function drawScenery(ctx,camX,camY,time){
 buildings.forEach(function(b){drawBuilding(ctx,b,camX,camY,time)});
 // Small glowing door markers at accessible entry points.
 [[12,12],[37,12],[12,27],[37,27]].forEach(function(p){var x=p[0]*T-camX,y=p[1]*T-camY;rect(ctx,x+11,y+7,10,5,'#ffdb94');rect(ctx,x+13,y+9,6,2,'#77552e')});
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
 // Flowerbeds and lampposts reinforce the pedestrian scale.
 [[19,22],[29,22],[19,12],[29,12]].forEach(function(p){
  var lx=p[0]*T-camX,ly=p[1]*T-camY;
  rect(ctx,lx+14,ly-23,5,52,'#454f5b');rect(ctx,lx+8,ly-30,17,14,'#b27b3d');
  rect(ctx,lx+11,ly-27,11,8,Math.sin(time/350)>0?'#ffdc8a':'#f7c977');
 });
}
window.ETARIUM_TOWN={W:W,H:H,T:T,spawn:spawn,world:terrain,
 solid:function(x,y){return x<0||x>=W||y<0||y>=H||'HFWGT#'.indexOf(terrain[y][x])>=0},
 drawTile:paintTile,drawScenery:drawScenery};
})();