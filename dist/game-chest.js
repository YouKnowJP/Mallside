import {chestCard,chestCover,loreTrack,resourceTray,terrainArt} from './game-chest-art.js';
import {moveTableChallenge,tableChallengeOutcome,tableChallengeView} from './game-chest-challenges.js';
import {catanMatchView,moveCatanMatch,startCatanMatch,restoreCatanMatch} from './game-chest-catan.js';
import {lorcanaMatchView,moveLorcanaMatch,startLorcanaMatch,restoreLorcanaMatch} from './game-chest-lorcana.js';

const demos={
 catan:{title:'CATAN',edition:'Base game · 6th Edition rules',format:'3–4 players in the base game',
  description:'Build a road, trade for a settlement, and see how a city changes your harvest.',
  challenge:'Settlement challenge',strategy:'City harvest',final:'Harbor finish',match:'Play an island match',resume:'Resume island match',
  rules:'https://www.catan.com/understand-catan/game-rules',
  evidence:'https://www.catanstudio.com/return-to-catan-store-locator/',evidenceLabel:'Torrance demo program'},
 lorcana:{title:'Disney Lorcana',edition:'Trading card game',format:'Two players',
  description:'Learn to ink, play and quest, then stop an opponent who is one lore from winning.',
  challenge:'Quest or challenge',strategy:'Race to 20',final:'Rush rescue',match:'Play a lore match',resume:'Resume lore match',
  rules:'https://disneylorcana.com/en/how-to-play/',
  evidence:'https://tcg.ravensburgerplay.com/events/712268',evidenceLabel:'Attack of the Vine prerelease record'}
};

const modes=['sample','challenge','strategy','final','match'];
const modeLabels={sample:'Guided turn',challenge:'First challenge',strategy:'Strategy',final:'Endgame',match:'Solo match'};
const matchGames={catan:{start:startCatanMatch,move:moveCatanMatch,view:catanMatchView,restore:restoreCatanMatch,round:'Round'},
 lorcana:{start:startLorcanaMatch,move:moveLorcanaMatch,view:lorcanaMatchView,restore:restoreLorcanaMatch,round:'Turn'}};
const matchSaveVersion=1;
const practiceKey=({id,mode})=>id+'/'+mode;
const practiceKeys=Object.keys(demos).flatMap(id=>modes.map(mode=>practiceKey({id,mode})));

export function normalizeGameChestProgress(progress){
 return Array.isArray(progress)?practiceKeys.filter(key=>progress.includes(key)):[];
}

export function normalizeGameChestMatches(matches){
 const active={};
 for(const [id,game] of Object.entries(matchGames)){
  const entry=matches?.[id];
  const match=entry?.version===matchSaveVersion?game.restore(entry.match):null;
  if(match)active[id]={version:matchSaveVersion,match};
 }
 return active;
}

export function checkpointGameChestMatch(state,sample){
 if(sample.mode!=='match')return false;
 if(gameChestOutcome(sample))delete state.gameChestMatches[sample.id];
 else state.gameChestMatches[sample.id]={version:matchSaveVersion,match:sample.match};
 return true;
}

export function resumeGameChestMatch(matches,id){
 if(!Object.hasOwn(matchGames,id)||!matches?.[id])return null;
 // Moves copy the match before editing it, so resuming never mutates its checkpoint.
 return {id,step:0,retry:false,mode:'match',match:matches[id].match};
}

export function recordGameChestCompletion(state,sample){
 if(gameChestOutcome(sample)!=='won')return false;
 const key=practiceKey(sample);
 if(state.gameChestProgress.includes(key))return false;
 state.gameChestProgress.push(key);
 return true;
}

export function gameChestLibrary(recommended,esc,progress=[],matches={}){
 return `<section class="game-chest-library" aria-label="Game demo library">
 <div class="chest-progress"><p><strong>${progress.length} of ${practiceKeys.length} completed</strong> <span>Replay any table</span></p>
  <div class="chest-progress-track" aria-hidden="true">${practiceKeys.map(key=>`<i class="${progress.includes(key)?'is-complete':''}"></i>`).join('')}</div>
 </div>
 ${Object.entries(demos).map(([id,game])=>`<article class="chest-edition" data-game="${id}">
  <div class="chest-edition-art">${chestCover(id)}<div class="chest-edition-name">
   <small>${id===recommended?'Taylor’s pick · ':''}${esc(game.format)}</small><h3>${esc(game.title)}</h3></div></div>
  <p class="chest-edition-intro">${esc(game.description)}</p>
  <div class="chest-library-actions">${['match',...modes.slice(0,-1)].map((mode,index)=>{
   const saved=mode==='match'?matches[id]?.match:null;
   const label=saved?game.resume:mode==='sample'?'Try '+game.title+' sample':game[mode];
   const detail=saved?matchGames[id].round+' '+saved.turn+' · In progress':modeLabels[mode];
   const completed=progress.includes(practiceKey({id,mode}));
   return `<button class="button secondary" data-action="game-chest-open" data-id="${id}"${mode==='sample'?'':' data-mode="'+mode+'"'}><span class="chest-table-number" aria-hidden="true">${mode==='match'?'◆':'0'+index}</span><span class="chest-table-name"><small>${detail}</small>${esc(label)}</span><span class="chest-table-arrow">${completed&&!saved?'<span class="sr-only">Completed</span>✓':'<span aria-hidden="true">→</span>'}</span></button>`;
  }).join('')}</div>
 </article>`).join('')}</section>`;
}

export function startGameChest(id,mode,seed){
 if(!Object.hasOwn(demos,id))return null;
 const sample={id,step:0,retry:false,mode:modes.includes(mode)?mode:'sample'};
 if(mode==='match')sample.match=matchGames[id].start(seed??Math.floor(Math.random()*4294967296));
 return sample;
}

const catanSteps=[['roll','Roll the practice dice'],['road','Build beside your settlement']];
const lorcanaSteps=[['ink','Add a card to the inkwell'],['play','Spend ink and play the character'],['turn','Start the next turn'],['quest','Quest for 1 lore']];
const stepsFor=id=>id==='catan'?catanSteps:lorcanaSteps;

export function gameChestOutcome(sample){
 if(sample.mode==='match')return sample.match.winner===null?null:sample.match.winner===0?'won':'lost';
 if(sample.mode!=='sample')return tableChallengeOutcome(sample);
 return sample.step===stepsFor(sample.id).length?'won':null;
}

export function moveGameChest(sample,action,matches){
 if(!sample)return null;
 if(action==='reset')return startGameChest(sample.id,sample.mode);
 const nextMode=modes[modes.indexOf(sample.mode)+1];
 if(action==='continue'&&nextMode&&gameChestOutcome(sample)==='won')return (nextMode==='match'&&resumeGameChestMatch(matches,sample.id))||startGameChest(sample.id,nextMode);
 if(sample.mode==='match'){
  const match=matchGames[sample.id].move(sample.match,action);
  return match===sample.match?sample:{...sample,match};
 }
 if(sample.mode!=='sample')return moveTableChallenge(sample,action);
 const next=stepsFor(sample.id)[sample.step];
 if(!next&&action==='challenge')return startGameChest(sample.id,'challenge');
 if(next?.[0]===action)return {...sample,step:sample.step+1,retry:false};
 if(sample.id==='catan'&&sample.step===1&&action==='far-road')return {...sample,retry:true};
 return sample;
}

const catanNotes=[
 'You already have one brick and a settlement beside the forest. Roll the practice dice to see which terrain produces.',
 'An 8 activates the forest next to your settlement. Take one lumber. A road costs that lumber and the brick you started with.',
 'You connected the road and spent one brick and one lumber. That is the end of this practice turn.'
];
const lorcanaNotes=[
 'Reveal the card with the inkwell symbol, then put it face down in your inkwell.',
 'Exert your one ready ink to play the one-cost character from your hand.',
 'The character’s ink is still drying, so it cannot quest this turn. Skip ahead to your next turn.',
 'The ink has dried. Turn the character sideways to quest and gain its one lore.',
 'You gained one lore. That is the end of this practice turn.'
];

function catanBoard(step){
 const route=step===2?[[186,126],[246,126]]:[];
 return `<div class="chest-map" aria-label="Practice terrain and resources">${terrainArt({active:step===1?8:null,route,pieces:[[186,126,'home']]})}
  ${resourceTray({Brick:step===2?0:1,Lumber:step===1?1:0,'Roads built':step===2?1:0})}</div>`;
}

function lorcanaBoard(step){
 const stage=['Empty','Empty','Character drying','Character ready','Character quested'][step];
 return `<div class="chest-card-mat" aria-label="Practice cards and lore">
  ${chestCard('scout','Hand',step===0?'Two cards':step===1?'One card':'No cards',step===0?'Inkable card and character':step===1?'One-cost character':'Cards played',step>=2?'empty':'')}
  ${chestCard('ink','Inkwell',step===0?'Empty':step===2?'1 spent ink':'1 ready ink','',step===0?'empty':step===2?'turned':'')}
  ${chestCard('guide','Play area',stage,'',step<2?'empty':step===4?'turned':'')}
  ${loreTrack(step===4?1:0)}</div>`;
}

export function gameChestDemoHTML(sample,associate,esc,matches){
 const game=demos[sample.id],isCatan=sample.id==='catan',next=stepsFor(sample.id)[sample.step];
 const match=sample.mode==='match',challenge=sample.mode!=='sample',outcome=gameChestOutcome(sample);
 const view=match?matchGames[sample.id].view(sample.match,esc):challenge?tableChallengeView(sample):{
  board:isCatan?catanBoard(sample.step):lorcanaBoard(sample.step),
  moves:next?[next,...(isCatan&&sample.step===1?[['far-road','Try the far edge']]:[])]:[['challenge','Try the table challenge']],
  note:sample.retry?'That edge is disconnected. Start this road at your own settlement.':(isCatan?catanNotes:lorcanaNotes)[sample.step]
 };
 const label=match?(outcome==='won'?'Match won':outcome==='lost'?'Match lost':view.turn):outcome==='lost'?'Try a different move':outcome==='won'?'Practice complete':challenge?'Table challenge':'Show me a turn';
 const nextMode=modes[modes.indexOf(sample.mode)+1];
 const nextLabel=nextMode==='match'&&matches?.[sample.id]?game.resume:game[nextMode];
 const moves=outcome==='won'&&sample.mode!=='sample'&&nextMode?[['continue','Next: '+nextLabel]]:view.moves;
 const format=match?(isCatan?'Compact CATAN rules · Three players':'Lorcana practice rules · Original cards'):esc(game.edition);
 const reset=`<button class="button ${outcome==='lost'?'orange':'secondary'}" data-action="game-chest-move" data-id="reset">${match?'Start a new match':'Reset practice'}</button>`;
 const controls=`<div class="staff-topics">${moves.map(([action,label,selected],index)=>`<button class="button ${index?'secondary':'orange'}" data-action="game-chest-move" data-id="${action}"${selected===undefined?'':' aria-pressed="'+selected+'"'}>${label}</button>`).join('')}
  ${!match||outcome?reset:''}</div>`;
 const inlineControls=typeof view.board==='function';
 return `<div class="modal-body game-chest-demo" data-game="${sample.id}" data-mode="${sample.mode}" data-result="${outcome||'playing'}">
  <div class="chest-table-strip"><span>${format} · ${modeLabels[sample.mode]}</span><span>${match?view.turn:'Free practice'}</span></div>
  <div class="chest-surface">${inlineControls?view.board(controls):view.board}</div>
  <div class="chest-instructions">
   <div class="staff-reply" role="status" tabindex="-1"><span class="chest-taylor" aria-hidden="true">T</span><div><strong>${esc(associate)} · ${label}</strong><p>${esc(view.note)}</p></div></div>
   ${inlineControls?'':controls}
   ${view.extra||''}
  </div>
  ${match&&!outcome?`<details class="chest-trade"><summary>Match options</summary><p class="hint">Your match saves as you play. Starting a new match replaces this one.</p>${reset}</details>`:''}
  <div class="chest-sources"><span>Original Mallside table pieces</span><a href="${game.rules}" target="_blank" rel="noopener noreferrer">Publisher rules ↗</a><a href="${game.evidence}" target="_blank" rel="noopener noreferrer">${game.evidenceLabel} ↗</a></div>
 </div>`;
}

export function gameChestDemoTitle(sample){const game=demos[sample.id];return game.title+' · '+(sample.mode==='sample'?'Practice table':game[sample.mode]);}
