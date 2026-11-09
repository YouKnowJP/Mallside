import {illustratedCard,loreTrack} from './game-chest-art.js';

const cards = {
 scout:{name:'Hill Scout',art:'scout',cost:1,strength:1,willpower:2,lore:1,inkable:true},
 courier:{name:'Wind Courier',art:'courier',cost:2,strength:2,willpower:2,lore:1,inkable:true,rush:true},
 guide:{name:'Lantern Guide',art:'guide',cost:2,strength:1,willpower:3,lore:2,inkable:true},
 ranger:{name:'Dusk Ranger',art:'scout',cost:3,strength:3,willpower:3,lore:2,inkable:true},
 keeper:{name:'Gate Keeper',art:'rival',cost:4,strength:4,willpower:5,lore:2,inkable:true},
 beacon:{name:'Beacon Bearer',art:'guide',cost:5,strength:4,willpower:4,lore:3,inkable:false},
 spark:{name:'Falling Spark',art:'ink',cost:2,damage:2,inkable:false}
};
const deckList=['scout','guide','courier','ranger','keeper','beacon','spark'];
const copies=[4,4,4,4,4,4,4];
const canQuest=card=>!card.drying&&!card.exerted;
const canChallenge=card=>!card.exerted&&(!card.drying||cards[card.kind].rush);
const find=(zone,id)=>zone.find(card=>card.id===id);
const remove=(zone,id)=>zone.splice(zone.findIndex(card=>card.id===id),1)[0];
const inkLeft=seat=>seat.ink-seat.spent;
const affordable=(seat,card)=>!!card&&cards[card.kind].cost<=inkLeft(seat);
const labels=['You','Taylor'];

function shuffledDeck(seed,seat){
 const deck=deckList.flatMap((kind,i)=>Array.from({length:copies[i]},(_,n)=>({kind,id:seat+'-'+i+'-'+n})));
 for(let i=deck.length-1;i>0;i--){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  const j=seed%(i+1);
  [deck[i],deck[j]]=[deck[j],deck[i]];
 }
 return deck;
}

function startTurn(seat){
 seat.spent=0;
 seat.inked=false;
 for(const card of seat.board){card.drying=false;card.exerted=false;}
 if(seat.deck.length)seat.hand.push(seat.deck.pop());
}

export function startLorcanaMatch(seed){
 const seats=[0,1].map(index=>{
  const deck=shuffledDeck((seed^(index?0x85ebca6b:0))>>>0,index);
  return {deck,hand:deck.splice(-7),board:[],discard:[],ink:0,spent:0,lore:0,inked:false};
 });
 return {seats,turn:1,selected:null,winner:null,effect:null,log:'',note:'Choose a card from your hand to ink or play. You can add one ink each turn.'};
}

export function restoreLorcanaMatch(saved){
 if(!saved||saved.winner!==null)return null;
 const {seats,turn,selected,effect,log,note}=saved;
 const int=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
 const bool=value=>typeof value==='boolean';
 if(!Array.isArray(seats)||seats.length!==2||!int(turn,1,28)||
  typeof log!=='string'||log.length>900||typeof note!=='string'||note.length>300)return null;
 const zones=['deck','hand','board','discard'];
 const restored=[];
 for(const [index,seat] of seats.entries()){
  if(!seat)return null;
  const {ink,spent,lore,inked}=seat;
  if(!int(ink,0,28)||!int(spent,0,ink)||!int(lore,0,19)||!bool(inked))return null;
  const known=new Map(shuffledDeck(0,index).map(card=>[card.id,card.kind]));
  const copy={};
  for(const zone of zones){
   if(!Array.isArray(seat[zone])||seat[zone].length>known.size)return null;
   copy[zone]=[];
   for(const card of seat[zone]){
    if(!card||!known.has(card.id)||known.get(card.id)!==card.kind)return null;
    known.delete(card.id);
    const {kind,id,drying,exerted,damage}=card,stat=cards[kind];
    if(zone==='board'||zone==='discard'&&!stat.damage){
     if(stat.damage||!bool(drying)||!bool(exerted)||
      !int(damage,zone==='board'?0:stat.willpower,zone==='board'?stat.willpower-1:stat.willpower+4))return null;
     copy[zone].push({kind,id,drying,exerted,damage});
    }else copy[zone].push({kind,id});
   }
  }
  if(known.size!==ink)return null;
  restored.push({...copy,ink,spent,lore,inked});
 }
 const selection=['hand','board'].includes(selected?.zone)&&find(restored[0][selected.zone],selected.id)
  ?{zone:selected.zone,id:selected.id}:null;
 let animation=null;
 if(effect?.kind==='ink'||effect?.kind==='ready')animation={kind:effect.kind};
 else if(['play','quest','hit'].includes(effect?.kind)&&typeof effect.id==='string'&&/^[01]-[0-6]-[0-3]$/.test(effect.id))
  animation={kind:effect.kind,id:effect.id};
 return {seats:restored,turn,selected:selection,winner:null,effect:animation,log,note};
}

function inkCard(seat,card){
 remove(seat.hand,card.id);
 seat.ink++;seat.inked=true;
}

function playCharacter(seat,card){
 seat.spent+=cards[card.kind].cost;
 seat.board.push({...remove(seat.hand,card.id),drying:true,exerted:false,damage:0});
}

function quest(match,index,card){
 card.exerted=true;
 match.seats[index].lore+=cards[card.kind].lore;
 if(match.seats[index].lore>=20)match.winner=index;
}

function banish(seat,card){
 if(card.damage>=cards[card.kind].willpower)seat.discard.push(remove(seat.board,card.id));
}

function challenge(seat,enemy,attacker,target){
 attacker.exerted=true;
 attacker.damage+=cards[target.kind].strength;
 target.damage+=cards[attacker.kind].strength;
 banish(seat,attacker);banish(enemy,target);
}

function cast(seat,enemy,spell,target){
 seat.spent+=cards[spell.kind].cost;
 seat.discard.push(remove(seat.hand,spell.id));
 target.damage+=cards[spell.kind].damage;
 banish(enemy,target);
}

const remaining=card=>cards[card.kind].willpower-card.damage;
const fieldValue=card=>{
 const {strength,lore}=cards[card.kind];
 return lore*3+strength+remaining(card)*.5;
};
const questTotal=board=>board.reduce((total,card)=>total+cards[card.kind].lore,0);

// A small knapsack: choose the strongest whole group that fits the ink, rather than the highest cost card.
function playPlan(hand,budget){
 const best=Array.from({length:budget+1},()=>({value:0,group:[]}));
 for(const card of hand){
  const stat=cards[card.kind];
  if(stat.damage)continue;
  for(let ink=budget;ink>=stat.cost;ink--){
   const previous=best[ink-stat.cost];
   const value=previous.value+stat.lore*3+stat.strength+stat.willpower*.5+(stat.rush?1:0);
   if(value>best[ink].value)best[ink]={value,group:[...previous.group,card]};
  }
 }
 return best[budget];
}

function chooseInk(seat){
 if(seat.ink>=7)return null;
 const value=card=>{
  const hand=seat.hand.filter(other=>other!==card);
  const now=playPlan(hand,inkLeft(seat)+1).value;
  const later=playPlan(hand,seat.ink+2).value;
  return now*3+later-cards[card.kind].lore*.4-cards[card.kind].strength*.2
   +seat.hand.filter(other=>other.kind===card.kind).length*.6;
 };
 return seat.hand.filter(card=>cards[card.kind].inkable).sort((a,b)=>value(b)-value(a))[0];
}

function combatPlan(taylor,you){
 const attackers=taylor.board.filter(canChallenge);
 const spell=taylor.hand.find(card=>cards[card.kind].damage&&affordable(taylor,card));
 const danger=you.lore+questTotal(you.board)>=20;
 let best=null;
 for(const target of you.board){
  const rival=cards[target.kind],usable=target.exerted?attackers:[];
  const worth=fieldValue(target)+(danger?18+rival.lore*3:0);
  const attackCost=card=>(canQuest(card)?cards[card.kind].lore*(taylor.lore>=15?3:2):0)
   +(rival.strength>=remaining(card)?fieldValue(card)*.75:rival.strength*.65);
  const options=usable.map(card=>[card]);
  for(const [i,a] of usable.entries())for(const b of usable.slice(i+1))options.push([a,b]);
  for(const sparking of spell?[false,true]:[false]){
   for(const group of sparking?[[],...options]:options){
    const damage=(sparking?cards[spell.kind].damage:0)+group.reduce((sum,card)=>sum+cards[card.kind].strength,0);
    if(damage<remaining(target))continue;
    const score=worth-group.reduce((sum,card)=>sum+attackCost(card),sparking?4:0)-Math.max(0,damage-remaining(target))*.3;
    if(score>(best?.score??0))best={target,group,spell:sparking?spell:null,score};
   }
  }
 }
 return best;
}

function opponentTurn(match){
 const [you,taylor]=match.seats;
 const tally={inked:false,played:[],removed:[],lore:0};
 startTurn(taylor);
 const ready=taylor.board.filter(canQuest);
 if(taylor.lore+questTotal(ready)<20){
  const toInk=chooseInk(taylor);
  if(toInk){inkCard(taylor,toInk);tally.inked=true;}
  const fight=()=>{
   for(let plan=combatPlan(taylor,you);plan;plan=combatPlan(taylor,you)){
    const {target,group,spell}=plan;
    if(spell)cast(taylor,you,spell,target);
    for(const attacker of group){
     if(remaining(target)<=0)break;
     challenge(taylor,you,attacker,target);
    }
    tally.removed.push(cards[target.kind].name);
   }
  };
  fight();
  for(const card of playPlan(taylor.hand,inkLeft(taylor)).group){
   playCharacter(taylor,card);tally.played.push(cards[card.kind].name);
  }
  fight(); // A Courier played this turn can join the attack with Rush.
 }
 for(const character of taylor.board.filter(canQuest).sort((a,b)=>cards[b.kind].lore-cards[a.kind].lore)){
  quest(match,1,character);tally.lore+=cards[character.kind].lore;
  if(match.winner!==null)break;
 }
 if(match.winner===null&&!taylor.deck.length)match.winner=0;
 const actions=[];
 if(tally.inked)actions.push('added ink');
 if(tally.played.length)actions.push('played '+tally.played.join(', '));
 if(tally.removed.length)actions.push('banished '+tally.removed.join(', '));
 if(tally.lore)actions.push('gained '+tally.lore+' lore');
 match.log=actions.length?actions.join(' · '):'No moves';
}

function selectedCard(match,zone){
 return match.selected?.zone===zone?find(match.seats[0][zone],match.selected.id):null;
}

export function moveLorcanaMatch(match,action){
 if(match.winner!==null)return match;
 const next=structuredClone(match),[you,taylor]=next.seats;
 const hand=selectedCard(next,'hand'),own=selectedCard(next,'board');
 next.effect=null;
 if(action.startsWith('hand-')||action.startsWith('own-')){
  const prefix=action.startsWith('hand-')?'hand-':'own-',zone=prefix==='hand-'?'hand':'board';
  const id=action.slice(prefix.length),card=find(you[zone],id);
  if(!card)return match;
  next.selected=next.selected?.id===id?null:{zone,id};
  const stat=cards[card.kind];
  if(!next.selected)next.note='Choose a card to inspect your moves.';
  else if(zone==='hand')next.note=stat.damage?'Choose a rival character to deal two damage if you can pay the ink.':'Choose whether to play this character or put it in your inkwell.';
  else next.note=card.exerted?'This character has already acted this turn.':card.drying&&!stat.rush?'This character is still drying.':canQuest(card)?'Quest for lore or choose an exerted rival to challenge.':'Rush lets this character challenge now. Questing waits until your next turn.';
 }else if(action==='ink'&&hand&&!you.inked&&cards[hand.kind].inkable){
  inkCard(you,hand);next.selected=null;next.effect={kind:'ink'};
  next.note=cards[hand.kind].name+' went into your inkwell. You have '+inkLeft(you)+' ready ink.';
 }else if(action==='play'&&affordable(you,hand)&&!cards[hand.kind].damage){
  playCharacter(you,hand);
  next.selected={zone:'board',id:hand.id};next.effect={kind:'play',id:hand.id};
  next.note=cards[hand.kind].name+' entered play. '+(cards[hand.kind].rush?'It can challenge with Rush.':'It can act next turn.');
 }else if(action==='quest'&&own&&canQuest(own)){
  quest(next,0,own);next.effect={kind:'quest',id:own.id};
  next.note=cards[own.kind].name+' gained '+cards[own.kind].lore+' lore.';
 }else if(action.startsWith('enemy-')){
  const target=find(taylor.board,action.slice(6));
  if(!target)return match;
  if(own&&canChallenge(own)&&target.exerted){
   challenge(you,taylor,own,target);
   next.effect={kind:'hit',id:target.id};
   next.note=cards[own.kind].name+' challenged '+cards[target.kind].name+'. Both characters dealt damage.';
  }else if(affordable(you,hand)&&cards[hand.kind].damage){
   cast(you,taylor,hand,target);next.effect={kind:'hit',id:target.id};
   next.note=cards[hand.kind].name+' dealt two damage to '+cards[target.kind].name+'.';
  }else return match;
  next.selected=null;
 }else if(action==='pass'){
  next.selected=null;
  if(!you.deck.length){next.winner=1;next.note='You ended the turn with an empty deck. Taylor won.';return next;}
  opponentTurn(next);
  if(next.winner===0){next.note='Taylor ended the turn with an empty deck. You won.';return next;}
  if(next.winner===null){startTurn(you);next.turn++;next.effect={kind:'ready'};}
  next.note='Your characters and ink are ready. Choose your next move.';
 }else return match;
 if(next.winner!==null)next.note=labels[next.winner]+(next.winner===0?' reached 20 lore and won.':' reached 20 lore and won the match.');
 return next;
}

function cardTile(card,action,selected,effect,target=false){
 const {name,art,cost,strength,willpower,lore,rush,inkable,damage}=cards[card.kind];
 const hand=card.drying===undefined;
 const status=hand?(inkable?'Inkable':'Uninkable'):card.exerted?'Exerted':card.drying?'Drying':'Ready';
 const info=damage?'Deal '+damage+' damage':strength+' strength · '+willpower+' willpower · '+lore+' lore';
 const tile=`<span class="chest-match-card-art" aria-hidden="true">${illustratedCard(art)}<i>${cost}</i></span>
  <strong>${name}</strong><small>${info}</small><small>${status}${rush?' · Rush':''}${card.damage?' · '+card.damage+' damage':''}</small>`;
 const classes=['chest-match-card',card.exerted?'is-exerted':'',effect?.id===card.id?'match-card-'+effect.kind:'',target?'is-target':''].join(' ');
 return action?`<button class="${classes}" type="button" data-action="game-chest-move" data-id="${action}" ${target?'aria-label="Target '+name+'"':'aria-pressed="'+selected+'"'}>${tile}</button>`:`<div class="${classes}">${tile}</div>`;
}

export function lorcanaMatchView(match,esc){
 const [you,taylor]=match.seats,active=match.winner===null;
 const hand=selectedCard(match,'hand'),own=selectedCard(match,'board'),canCast=affordable(you,hand)&&cards[hand.kind].damage;
 const moves=[];
 if(active&&hand&&!you.inked&&cards[hand.kind].inkable)moves.push(['ink','Put in inkwell']);
 if(active&&affordable(you,hand)&&!cards[hand.kind].damage)moves.push(['play','Play for '+cards[hand.kind].cost+' ink']);
 if(active&&own&&canQuest(own))moves.push(['quest','Quest for '+cards[own.kind].lore+' lore']);
 if(active)moves.push(['pass','End turn']);
 const lane=(title,note,tiles,extra='')=>`<section class="chest-card-lane ${extra}"><h4>${title} <small>${note}</small></h4><div class="chest-card-row">${tiles||'<span class="chest-empty-lane">No cards here</span>'}</div></section>`;
 const ink=`<div class="chest-match-ink ${match.effect?.kind==='ink'?'match-ink-new':''}"><strong>${inkLeft(you)} / ${you.ink} ink ready</strong><small>${you.inked?'Ink placed this turn':'One ink available to place'}</small></div>`;
 const rivalCards=taylor.board.map(card=>{
  const target=active&&(canCast||(own&&canChallenge(own)&&card.exerted));
  return cardTile(card,target?'enemy-'+card.id:null,false,match.effect,target);
 }).join('');
 const ourCards=you.board.map(card=>cardTile(card,active?'own-'+card.id:null,own?.id===card.id,match.effect)).join('');
 const handCards=you.hand.map(card=>cardTile(card,active?'hand-'+card.id:null,hand?.id===card.id,match.effect)).join('');
 const deckInfo=seat=>seat.deck.length+' in deck · '+seat.discard.length+' discarded';
 return {turn:'Turn '+match.turn,note:match.note,moves,extra:match.log?`<p class="chest-match-log"><strong>Taylor’s turn</strong> · ${esc(match.log)}</p>`:'',
  board:controls=>`<div class="chest-lorcana-match ${match.effect?.kind==='ready'?'match-turn-new':''}" data-effect="${match.effect?.kind||''}" aria-label="Lorcana match board">
   ${loreTrack(you.lore,taylor.lore)}
   ${lane('Your hand',you.hand.length+' cards',handCards)}
   ${ink}${controls}
   ${lane('Your field',deckInfo(you),ourCards)}
   ${lane('Taylor’s field',deckInfo(taylor)+' · '+taylor.hand.length+' in hand',rivalCards,'chest-rival-lane')}
  </div>`};
}
