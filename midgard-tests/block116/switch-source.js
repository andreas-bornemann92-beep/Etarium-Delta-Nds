// Excerpts extracted unchanged from Block116: handleKnockout and switchMonsterCore.
function handleKnockout(){
   const current=team[active],next=team.findIndex((x,j)=>j!==active&&x.hp>0);
   busy=false;cinematic=null;
   if(next<0){end('Niederlage! Dein Team ist kampfunfähig.');return}
   selected=next;page='forced';stack=[];mm116Broadcast('faint');note(`${current.name} ist kampfunfähig. Wähle ein anderes Monster.`);render();
 }
function switchMonsterCore(target){
 clearSequence();const forced=team[active].hp<=0;busy=true;
 const outgoing=team[active].name;active=target;selected=target;battleParticipants.add(target);mm116Broadcast('switch');
 phase(`${outgoing} wird zurückgerufen. ${team[active].name}, du bist dran!`,'ᛟ');
 scene('switch','↺',650);
 waitPhase(650,()=>{
  if(finished)return;
  if(forced){busy=false;cinematic=null;home();return}
  phase(`${team[active].name} ist eingewechselt!`,'ᛉ');
  waitPhase(450,()=>{busy=false;cinematic=null;home();opponentTurn(250)});
 });
 return true;
}