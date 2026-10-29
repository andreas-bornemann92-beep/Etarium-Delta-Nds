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
 if(sx+w< -30||sx>550||sy+h< -30||sy>425)return;
 function R(x,y,ww,hh,col){rect(ctx,x,y,ww,hh,col)}
 function line(x1,y1,x2,y2,col,weight){ctx.strokeStyle=col;ctx.lineWidth=weight||2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
 // Human-scale facade: stone base, timber frame, shaded stucco and half-timber diagonals.
 R(sx+5,sy+55,w-10,h-56,'#b5a58f');
 R(sx+10,sy+61,w-20,h-67,'#e0ccaa');
 R(sx+10,sy+h-29,w-20,25,'#a68c71');
 for(var yy=sy+67;yy<sy+h-30;yy+=38)R(sx+10,yy,w-20,3,'#bda284');
 for(var xx=sx+17;xx<sx+w-10;xx+=58){
  R(xx,sy+56,7,h-66,'#73503a');
  for(var by=sy+72;by<sy+h-51;by+=50)line(xx+6,by,xx+42,by+27,'#946f4c',4);
 }
 // Roof with rafters, ridgeline, shaded shingles, and a small chimney.
 ctx.save();ctx.beginPath();ctx.moveTo(sx-12,sy+63);ctx.lineTo(sx+w/2,sy-5);ctx.lineTo(sx+w+12,sy+63);ctx.closePath();ctx.fillStyle=b.roof;ctx.fill();ctx.clip();
 for(var row=sy+9;row<sy+70;row+=9){
  line(sx-25,row,sx+w+25,row,'#32272b4b',2);
  for(var sh=sx-20+(Math.floor(row)%2)*10;sh<sx+w+25;sh+=25)R(sh,row+2,2,6,'#eac7a231');
 }
 ctx.restore();
 ctx.strokeStyle=b.trim;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(sx-12,sy+63);ctx.lineTo(sx+w/2,sy-5);ctx.lineTo(sx+w+12,sy+63);ctx.stroke();
 R(sx+w*.72,sy+7,22,31,'#b59a7c');R(sx+w*.72-3,sy+4,28,7,'#6e5d57');
 R(sx+w*.72+3,sy+12,4,16,'#e1c6a5');
 // Lit, mullioned windows with timber shutters and flowerboxes.
 var winY=sy+Math.min(110,h-96);
 for(var side of [-1,1]){
  var wx=sx+w/2+side*Math.min(84,w/3)-15;
  R(wx-7,winY-5,45,44,'#77533c');
  R(wx,winY,30,28,'#ecd39f');
  R(wx+3,winY+3,24,22,'#7aaab2');
  R(wx+5,winY+5,20,6,'#c8e6d5');
  R(wx+13,winY+2,3,26,'#624f40');R(wx+1,winY+12,28,3,'#624f40');
  R(wx-8,winY+29,47,7,'#b59a75');R(wx-4,winY+25,38,5,'#655642');
  for(var f=0;f<4;f++){R(wx-1+f*9,winY+22-(f%2)*4,5,5,f%2?'#e8a5bb':'#f3d379')}
 }
 // Accessible-looking doorway, hanging sign and threshold.
 R(sx+w/2-23,sy+h-72,46,73,'#8b6247');
 R(sx+w/2-17,sy+h-64,34,64,'#3c3835');
 R(sx+w/2-14,sy+h-60,27,55,'#684d39');
 R(sx+w/2+8,sy+h-31,5,5,'#e8c477');
 R(sx+w/2-32,sy+h-2,64,7,'#b2a496');
 R(sx+w/2-57,sy+h-102,114,26,'#283d49');
 R(sx+w/2-54,sy+h-99,108,2,'#d7b888');
 ctx.font='bold 14px system-ui';ctx.fillStyle='#ffe9c4';ctx.textAlign='center';ctx.fillText(b.name,sx+w/2,sy+h-83);ctx.textAlign='left';
 // Distinctive details for each building type.
 if(b.name==='Gasthaus'){
  R(sx+27,sy+25,13,35,'#70513d');R(sx+24,sy+22,19,5,'#bba287');
  R(sx+w-83,sy+h-45,33,8,'#7b5033');R(sx+w-79,sy+h-58,7,13,'#457e5d');
 }else if(b.name==='Laden'){
  R(sx+w-74,sy+h-49,52,27,'#567d87');
  for(var c=0;c<4;c++)R(sx+w-69+c*12,sy+h-42,8,16,['#cb9c69','#e0ca92','#8ba76c','#cd8a83'][c]);
 }else{
  R(sx+34,sy+h-55,29,26,'#78614a');R(sx+38,sy+h-51,21,18,'#a2bf96');
 }
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