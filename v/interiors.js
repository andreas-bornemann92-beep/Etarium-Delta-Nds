/* Etarium R – small, enterable interiors. Town exterior remains the canonical scene. */
(function(){
'use strict';
var doors=[
 {id:'inn',name:'Gasthaus',x:12,y:12,tint:'#b77d5b'},
 {id:'shop',name:'Laden',x:37,y:12,tint:'#728eac'},
 {id:'west',name:'Wohnhaus West',x:12,y:27,tint:'#b98d65'},
 {id:'east',name:'Wohnhaus Ost',x:37,y:27,tint:'#b98d65'}
];
var state={active:false,id:null,name:'',returnX:24,returnY:32,entryCount:0};
function entrance(x,y,dir){if(dir!=='up')return null;return doors.find(function(d){return x===d.x&&y===d.y})||null}
function enter(d,x,y){state.active=true;state.id=d.id;state.name=d.name;state.returnX=x;state.returnY=y;state.entryCount++}
function exit(){state.active=false;return {x:state.returnX,y:state.returnY}}
function solid(x,y){
 if(x<2||x>13||y<2||y>10)return true;
 if((x===2||x===13)||(y===2)||y===10&&x!==8)return true;
 // tables and cabinets are solid; central passage remains walkable
 if((x>=3&&x<=5&&y>=4&&y<=6)||(x>=10&&x<=12&&y>=4&&y<=6))return true;
 return false;
}
function shouldExit(x,y,dir){return state.active&&x===8&&y===9&&dir==='down'}
function rect(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h)}
function draw(c,time){
 var base=state.id==='shop'?'#d7c3a5':state.id==='inn'?'#bd9873':'#c8b39b';
 rect(c,0,0,512,384,'#192534');
 rect(c,64,64,384,288,'#705f52');
 rect(c,71,71,370,274,base);
 for(var y=3;y<=10;y++)for(var x=3;x<=12;x++){
  rect(c,x*32,y*32,30,30,(x+y)%2?'#b79c7d':'#c4a98b');
  rect(c,x*32+3,y*32+24,20,2,'#997f65');
 }
 rect(c,64,64,384,19,'#644738');rect(c,64,64,19,288,'#644738');rect(c,429,64,19,288,'#644738');
 rect(c,64,335,224,17,'#644738');rect(c,305,335,143,17,'#644738');
 rect(c,288,335,18,17,'#d4bd96'); // Exit threshold
 // furniture: two low tables and window wall
 for(var xx of [96,320]){
  rect(c,xx,125,96,80,'#6c4935');rect(c,xx+7,131,82,62,'#a77952');
  rect(c,xx+17,146,50,8,'#d6ab71');
  rect(c,xx+10,201,13,17,'#74543c');rect(c,xx+71,201,13,17,'#74543c');
 }
 for(var xx2 of [174,300]){
  rect(c,xx2,80,45,8,'#9a6c4c');rect(c,xx2+4,88,37,20,'#648b95');
  rect(c,xx2+20,88,3,20,'#d5c3a4');
 }
 if(state.id==='inn'){
  rect(c,212,105,88,26,'#704534');rect(c,220,108,72,21,'#b78352');
  rect(c,228,111,9,14,'#dec589');rect(c,247,111,9,14,'#dec589');
 }else if(state.id==='shop'){
  for(var j=0;j<4;j++){rect(c,208+j*25,108,14,21,['#82a86b','#cf866c','#d9b477','#6f97c4'][j])}
 }else{
  rect(c,218,115,78,24,'#7c5640');rect(c,228,109,56,12,'#ddd3ba');
 }
 // Exit marker and room label
 rect(c,279,345,48,3,'#d9c49a');rect(c,8,8,205,30,'#142536dc');
 c.fillStyle='#f4e6cd';c.font='bold 14px system-ui';c.fillText(state.name,20,28);
 c.font='12px system-ui';c.fillText('↓ Ausgang',338,371);
}
window.ETARIUM_INTERIORS={state:state,doors:doors,entrance:entrance,enter:enter,exit:exit,solid:solid,shouldExit:shouldExit,draw:draw};
})();