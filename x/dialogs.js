/* Etarium T – Sprache & Dialog: original 100-node branching dialogue matrix.
   Inspiration: structural techniques (knots/diverts, gating, barks), never copied dialogue lines. */
(function(){
'use strict';
const actors={
 mara:{name:'Mara',start:'mara_00',mode:'conversation'},
 toren:{name:'Toren',start:'toren_00',mode:'bark+routine'},
 elis:{name:'Elis',start:'elis_00',mode:'query'},
 kael:{name:'Kael',start:'kael_00',mode:'challenge'}
};
const source={
 mara:[
 'Willkommen in Eichenbrunn! Du siehst aus, als hättest du eine weite Reise hinter dir.',
 'Die Stadt liegt zwischen Wald und Fluss. Am Südtor beginnt der alte Handelsweg.',
 'Im Gasthaus duftet es früh nach Brot. Dort treffen sich die Reisenden.',
 'Das Pflaster am Brunnen ist älter als die meisten Häuser.',
 'Die Menschen hier grüßen Fremde zuerst und stellen Fragen später.',
 'Der Laden hat Seile, Laternen und ein paar Landkarten.',
 'Wenn du dich verläufst, folge den blauen Bannern zum Stadttor.',
 'Die Brücke im Osten ist nach starkem Regen manchmal rutschig.',
 'Hinter dem nördlichen Hügel wachsen die ersten Nebelblumen.',
 'Die Wälder sind freundlich, solange man ihre Wege respektiert.',
 'Früher führte eine Karawane jede Woche durch das Südtor.',
 'Der Brunnen wird jeden Morgen kontrolliert.',
 'Elis bemerkt selbst kleinste Veränderungen im Wasser.',
 'Toren macht seine Runde, auch wenn der Platz leer ist.',
 'Kael trainiert lieber im Freien als in einem Lehrsaal.',
 'Manche Reisende sprechen von Geistern, die sich im Sonnenlicht zeigen.',
 'Wer geduldig beobachtet, entdeckt mehr als jemand, der nur rennt.',
 'Am Morgen wirkt der Markt noch verschlafen.',
 'Mittags wird es rund um den Brunnen lebendig.',
 'Abends leuchten die Fenster bis zum Fluss hinunter.',
 'Die Leute unterscheiden Gäste nicht nach ihrer Herkunft.',
 'Ein freundliches Wort öffnet manchmal mehr Türen als ein Schlüssel.',
 'Du kannst gern wiederkommen. Ich kenne noch viele Geschichten.',
 'Dein Weg beginnt erst. Nimm dir Zeit, die Stadt kennenzulernen.',
 'Dann wünsche ich dir einen guten Anfang und einen sicheren Weg.'
 ],
 toren:[
 'Alles ruhig am Platz. Ich halte meine Runde ein.',
 'Zuerst kontrolliere ich den Weg östlich des Brunnens.',
 'Danach sehe ich an den kleinen Blumenbeeten nach.',
 'Die Pflastersteine hier sind uneben. Man muss aufpassen.',
 'Eine Wache beobachtet nicht nur Gefahren, sondern auch Veränderungen.',
 'Wenn jemand den Weg versperrt, bleibe ich kurz stehen.',
 'Meine Runde beginnt immer an derselben Stelle.',
 'Bei Regen prüfe ich zuerst die Brücken.',
 'Bei Sonnenschein kommen die Händler früher.',
 'Die Laternen bleiben nach Einbruch der Dunkelheit an.',
 'Manchmal sehe ich Fußspuren, die am Brunnen enden.',
 'Der Wind trägt Stimmen vom Gasthaus bis hierher.',
 'Ich kenne fast jedes Gesicht in Eichenbrunn.',
 'Neue Gäste fallen auf, doch nicht jeder ist verdächtig.',
 'Das Südtor bleibt tagsüber offen.',
 'Nur die Nordstraße wird selten benutzt.',
 'Ich zähle keine Schritte, nur die Stellen, die ich prüfen muss.',
 'Die Ruhe einer Stadt kommt nicht von allein.',
 'Wenn ich stehen bleibe, prüfe ich meinen nächsten Wegpunkt.',
 'Ein gleichmäßiger Ablauf erspart unnötige Eile.',
 'Der Brunnen ist mein Orientierungspunkt.',
 'Die Stadtmauer wurde mehrfach ausgebessert.',
 'Heute gibt es keine Warnmeldung.',
 'Danke für die Nachfrage. Ich muss weiter.',
 'Nächste Runde, derselbe Platz.'
 ],
 elis:[
 'Ich untersuche den Marktbrunnen. Möchtest du den Bericht hören?',
 'Das Wasser ist heute klar und ohne auffälligen Geruch.',
 'Meine erste Probe stammt aus dem frühen Morgen.',
 'Die zweite Probe nehme ich nach dem größten Marktandrang.',
 'Zwischen den Proben vergleiche ich Farbe und Temperatur.',
 'Die Steinränder sind trocken und weitgehend unbeschädigt.',
 'An der Nordseite wächst ein wenig Moos.',
 'Das Moos ist für sich genommen noch kein Warnzeichen.',
 'Die Zuflussrinne ist frei von Blättern.',
 'Der Abfluss führt überschüssiges Wasser nach Osten.',
 'Manchmal verändert ein Gewitter die Trübung.',
 'Nach starkem Regen wiederhole ich die Untersuchung.',
 'Ich notiere jede Auffälligkeit, selbst wenn sie klein ist.',
 'Bisher gab es heute keine neue Störung.',
 'Die Bewohner können das Wasser weiterhin nutzen.',
 'Ein einzelner Blick reicht für eine Prüfung nicht aus.',
 'Man vergleicht Beobachtungen, bevor man ein Urteil fällt.',
 'Wenn du wiederkommst, kann ich dir den Bericht erneut erklären.',
 'Die letzte Kontrolle war unauffällig.',
 'Die Brunnenpflege wird von mehreren Bewohnern übernommen.',
 'Eine verschlossene Rinne wäre ein Anlass, sofort zu handeln.',
 'Zum Glück trifft das heute nicht zu.',
 'Der Status lautet: keine gemeldeten Schäden.',
 'Ergebnis gespeichert. Du kannst den Bericht jederzeit erneut erfragen.',
 'Damit ist meine Prüfung für den Moment abgeschlossen.'
 ],
 kael:[
 'Du siehst aus, als könntest du eine Herausforderung gebrauchen.',
 'Ein guter Kampf beginnt mit einer klaren Entscheidung.',
 'Ich trete nur an, wenn mein Gegenüber zustimmt.',
 'Im Training geht es zuerst um Haltung, nicht um Stärke.',
 'Eine ruhige Bewegung kann wichtiger sein als Tempo.',
 'Beobachte die Distanz, bevor du einen Befehl gibst.',
 'Magier und Geist müssen einander verstehen.',
 'Ein ungeübter Geist braucht vor allem Geduld.',
 'Manchmal ist Abwarten die beste Aktion.',
 'Wer immer nur angreift, übersieht seine Möglichkeiten.',
 'Hier in Eichenbrunn trainiere ich ohne Zuschauer.',
 'Das Südtor bietet ausreichend Platz für einfache Übungen.',
 'Später werden Fähigkeiten und Initiative eine Rolle spielen.',
 'Für heute sehen wir uns nur die Kampfumgebung an.',
 'Die obere Position gehört deinem Gegner.',
 'Dein Geist steht unten und wird von hinten dargestellt.',
 'Beide Lebensanzeigen sind zunächst nur eine Vorschau.',
 'Es gibt noch keinen Schaden und keine Siegbedingung.',
 'Du kannst mit B jederzeit in die Stadt zurückkehren.',
 'Einen Kampf abzulehnen ist keine Niederlage.',
 'Bereit? Dann zeige ich dir den Übungsbildschirm.',
 'Wir können auch später trainieren.',
 'Das Training soll dich auf deine Reise vorbereiten.',
 'Entscheide selbst, wann es losgeht.',
 'Bis zum nächsten Training.'
 ]
};
const nodes={};
Object.keys(source).forEach(function(id){
 source[id].forEach(function(line,index){
  const key=id+'_'+String(index).padStart(2,'0');
  const next=id+'_'+String((index+1)%25).padStart(2,'0');
  nodes[key]={id:key,npc:id,text:line,type:'linear',choices:[],next:next,once:false};
 });
});
function choices(id,index,arr){
 const node=nodes[id+'_'+String(index).padStart(2,'0')];
 node.type='choice';node.next=null;
 node.choices=arr.map(function(v){return {label:v[0],next:id+'_'+String(v[1]).padStart(2,'0'),effect:v[2]||null}});
}
choices('mara',0,[['Wo bin ich?',1],['Was gibt es zu sehen?',5],['Erzähl mir von Geistern.',15],['Auf Wiedersehen.',24]]);
choices('mara',1,[['Was ist beim Gasthaus?',2],['Und der Marktplatz?',3],['Zurück zum Anfang',0]]);
choices('mara',5,[['Was verkauft der Laden?',6],['Worauf muss ich achten?',7],['Andere Bewohner?',12],['Zurück',0]]);
choices('mara',15,[['Worauf kommt es an?',16],['Danke.',23]]);
choices('mara',22,[['Noch eine Geschichte',8],['Bis bald',24]]);
choices('toren',0,[['Wie verläuft deine Runde?',1],['Gibt es Neuigkeiten?',22],['Ich störe nicht weiter.',24]]);
choices('toren',1,[['Beschreibe deine Runde',2],['Warum so regelmäßig?',16],['Wie sicher ist die Stadt?',14],['Verstanden.',23]]);
choices('toren',14,[['Und die Nordstraße?',15],['Danke.',23]]);
choices('toren',22,[['Worauf muss ich achten?',20],['Viel Erfolg.',23]]);
choices('elis',0,[['Prüfbericht ansehen',1,'brunnen_geprueft'],['Erzähl von den Wasserproben',2],['Wie prüfst du den Brunnen?',3],['Später.',24]]);
choices('elis',1,[['Wie sicher ist das Ergebnis?',14],['Was beobachtest du?',5],['Bericht speichern',23,'brunnen_geprueft']]);
choices('elis',3,[['Was passiert bei Regen?',10],['Wie oft prüfst du?',4],['Zurück',0]]);
choices('elis',14,[['Warum reicht ein Blick nicht?',15],['Ist das Wasser nutzbar?',18],['Ergebnis übernehmen',23,'brunnen_geprueft']]);
choices('elis',23,[['Noch einmal ansehen',1],['Fertig',24]]);
choices('kael',0,[['Trainingskampf?',20],['Gib mir Trainingstipps',1],['Wie funktioniert der Kampf?',13],['Nicht jetzt',19]]);
choices('kael',13,[['Wie stehen die Geister?',14],['Was ist schon spielbar?',16],['Zum Training',20]]);
choices('kael',20,[['Kampf beginnen',23,'kampf_starten'],['Lieber später',21]]);
choices('kael',21,[['Doch kämpfen',20],['Noch ein Rat',22],['Bis bald',24]]);
choices('kael',23,[['Starten',23,'kampf_starten'],['Abbrechen',24]]);
// Dialog matrix counts are exact, including optional branch destinations and barks.
const seen={},flags={},visitCount={};
function resolve(npc){return nodes[npc+'_00']}
function mark(id){seen[id]=true;visitCount[id]=(visitCount[id]||0)+1}
function choose(node,label){
 if(!node||node.type!=='choice')return null;
 const choice=node.choices.find(c=>c.label===label);
 if(!choice)return null;
 if(choice.effect&&choice.effect!=='kampf_starten')flags[choice.effect]=true;
 return {node:nodes[choice.next],effect:choice.effect||null};
}
function chain(node){return node&&node.next?nodes[node.next]:null}
function validate(){
 const errors=[];
 Object.keys(nodes).forEach(function(id){const n=nodes[id];if(n.next&&!nodes[n.next])errors.push(id+': next fehlt');n.choices.forEach(function(c){if(!nodes[c.next])errors.push(id+': Ziel fehlt')})});
 Object.keys(actors).forEach(function(k){
  if(!nodes[actors[k].start]){errors.push(k+': Einstieg fehlt');return}
  var reached={},stack=[actors[k].start];
  while(stack.length){var id=stack.pop();if(reached[id]||!nodes[id])continue;reached[id]=true;var node=nodes[id];if(node.next)stack.push(node.next);node.choices.forEach(function(c){stack.push(c.next)})}
  source[k].forEach(function(_,i){var id=k+'_'+String(i).padStart(2,'0');if(!reached[id])errors.push(id+': Dialog nicht erreichbar')});
 });
 return {ok:errors.length===0,count:Object.keys(nodes).length,byNPC:Object.keys(source).map(n=>({id:n,count:source[n].length})),errors:errors};
}
window.ETARIUM_DIALOGS={actors:actors,nodes:nodes,root:resolve,mark:mark,choose:choose,next:chain,flags:flags,seen:seen,visits:visitCount,validate:validate};
})();