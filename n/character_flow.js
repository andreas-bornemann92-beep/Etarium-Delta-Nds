/* Etarium Mobile J character-flow module. Integrated by initCharacterFlow(bridge). */
window.initCharacterFlow=function(bridge){
'use strict';
var saveKey='etarium_mobile_n_save_v1';
var character={name:'Abenteurer',gender:'male',body:'normal',height:'medium',hair:'0',haircolor:'#60402d'};
var stage='title';
var overlay=document.createElement('section');overlay.id='etarium-flow';
overlay.innerHTML='<div class="flow-card" id="j-title"><h2>ETARIUM</h2><p>Dein Abenteuer beginnt hier</p><button id="j-new" class="primary">Neues Spiel</button><button id="j-continue">Spiel fortsetzen</button><p id="j-save-info"></p></div>'+
'<div class="flow-card" id="j-editor" hidden><h2>Charakterwahl</h2><canvas id="j-preview" width="80" height="120"></canvas><div class="character-grid">'+
'<label>Name<input id="j-name" maxlength="16" value="Abenteurer"></label>'+
'<label>Geschlecht<select id="j-gender"><option value="male">Männlich</option><option value="female">Weiblich</option></select></label>'+
'<label>Körperbau<select id="j-body"><option value="slim">Schlank</option><option value="normal" selected>Normal</option><option value="strong">Kräftig</option><option value="full">Füllig</option></select></label>'+
'<label>Größe<select id="j-height"><option value="small">Klein</option><option value="medium" selected>Mittel</option><option value="tall">Groß</option></select></label>'+
'<label>Haarform (Vorschau)<select id="j-hair"><option value="0">Kurz</option><option value="1">Mittellang</option><option value="2">Wuschelig</option><option value="3">Lang</option></select></label>'+
'<label>Haarfarbe<select id="j-haircolor"><option value="#60402d">Braun</option><option value="#28232b">Schwarz</option><option value="#c5a16c">Blond</option><option value="#a84e39">Rot</option></select></label>'+
'</div><p class="notice">Vorschau-Grundmodelle. Weitere Gesichter, Bart, Haut-/Augenfarben und Klassenkleidung folgen als separate Module.</p>'+
'<button id="j-back">Zurück</button><button id="j-confirm" class="primary">Abenteuer beginnen</button></div>';
var style=document.createElement('style');style.textContent='#viewport{position:relative}#etarium-flow{position:absolute;inset:0;z-index:10;background:#151a25ee;display:flex;align-items:center;justify-content:center;padding:8px;overflow:auto}#etarium-flow[hidden]{display:none}.flow-card{width:min(100%,410px);max-height:100%;overflow:auto;background:#252e42;border:1px solid #ad556b;padding:12px;border-radius:12px;text-align:center}.flow-card[hidden]{display:none}.flow-card h2{font-size:21px;color:#f1aabd;margin:2px 0 8px}.flow-card p{font-size:12px;color:#e1d5cf}.flow-card button{font-size:13px;padding:9px;margin:4px}.flow-card .primary{background:#98445b}.character-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px;text-align:left}.character-grid label{color:#c9d3de;font-size:12px}.character-grid input,.character-grid select{width:100%;padding:7px;background:#151d2d;color:#fff;border:1px solid #7c8a9c;border-radius:6px;font-size:13px}#j-preview{display:block;width:75px;height:112px;background:#496b5b;margin:0 auto 5px;image-rendering:pixelated}#etarium-flow .notice{color:#eac29e;font-size:10px}';
document.head.appendChild(style);document.getElementById('viewport').appendChild(overlay);
var get=function(id){return document.getElementById('j-'+id)};
function readSave(){try{var s=localStorage.getItem(saveKey);return s?JSON.parse(s):null}catch(e){return null}}
function save(){try{var pos=bridge.getPosition();localStorage.setItem(saveKey,JSON.stringify({version:1,character:character,x:pos.x,y:pos.y,steps:pos.steps}))}catch(e){}}
function show(next){stage=next;overlay.hidden=next==='world';get('title').hidden=next!=='title';get('editor').hidden=next!=='editor';if(next==='title'){var s=readSave();get('continue').disabled=!s;get('save-info').textContent=s?'Spielstand: '+(s.character.name||'Abenteurer'):'Noch kein Spielstand';}}
function preview(){
var c=get('preview').getContext('2d');c.clearRect(0,0,80,120);
var w={slim:26,normal:32,strong:39,full:43}[character.body],height={small:77,medium:91,tall:101}[character.height],base=112,top=base-height;
function r(x,y,ww,hh,color){c.fillStyle=color;c.fillRect(x,y,ww,hh)}
r(26,base-22,10,21,'#433b34');r(43,base-22,10,21,'#433b34');
r(40-w/2,top+33,w,43,'#d9d1bd');r(40-w/2,top+72,w,6,'#7f6548');
r(30,top+12,20,24,'#e4b990');
r(28,top+8,24,12,character.haircolor);
if(character.hair==='1')r(28,top+17,5,19,character.haircolor);
if(character.hair==='2'){r(26,top+5,28,9,character.haircolor);r(36,top+2,11,9,character.haircolor)}
if(character.hair==='3'){r(27,top+16,5,29,character.haircolor);r(48,top+16,5,29,character.haircolor)}
if(character.gender==='female')r(31,top+11,4,17,character.haircolor);
r(40-w/2-5,top+37,5,27,'#e4b990');r(40+w/2,top+37,5,27,'#e4b990');
}
function sync(){['name','gender','body','height','hair','haircolor'].forEach(function(k){get(k).value=character[k]});preview()}
function update(){['name','gender','body','height','hair','haircolor'].forEach(function(k){character[k]=get(k).value});character.name=character.name.trim()||'Abenteurer';preview()}
get('new').addEventListener('click',function(){sync();show('editor')});
get('back').addEventListener('click',function(){show('title')});
get('confirm').addEventListener('click',function(){update();bridge.startFresh();show('world');save()});
get('continue').addEventListener('click',function(){var s=readSave();if(!s)return;character=s.character;bridge.startFresh();bridge.restore(s);show('world')});
['name','gender','body','height','hair','haircolor'].forEach(function(k){get(k).addEventListener('change',update);get(k).addEventListener('input',update)});
show('title');
return {openEditor:function(){sync();show('editor')},openMenu:function(){save();bridge.stop();show('title')},save:save,getCharacter:function(){return character},getStage:function(){return stage}};
};
