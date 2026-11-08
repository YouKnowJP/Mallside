const demos={
 catan:{title:'CATAN',edition:'Base game · 6th Edition rules',format:'3–4 players in the base game',
  description:'Roll for resources and spend brick and lumber to connect a road.',
  rules:'https://www.catan.com/understand-catan/game-rules',
  evidence:'https://www.catanstudio.com/return-to-catan-store-locator/',evidenceLabel:'Torrance demo program'},
 lorcana:{title:'Disney Lorcana',edition:'Trading card game',format:'Two players',
  description:'Set aside ink, play a practice character, and send it questing on the next turn.',
  rules:'https://disneylorcana.com/en/how-to-play/',
  evidence:'https://tcg.ravensburgerplay.com/events/712268',evidenceLabel:'Attack of the Vine prerelease record'}
};

export function gameChestLibrary(recommended,esc){
 return `<section class="game-chest-library" aria-label="Game demo library">${Object.entries(demos).map(([id,game])=>`<article>
  <span class="chest-cover ${id}" aria-hidden="true"><i></i><i></i><i></i></span>
  <div><small>${id===recommended?'Taylor’s pick · ':''}${esc(game.format)}</small><h3>${esc(game.title)}</h3>
  <p>${esc(game.edition)}</p><p>${esc(game.description)}</p></div>
  <button class="button secondary" data-action="game-chest-open" data-id="${id}">Try ${esc(game.title)} sample</button>
  </article>`).join('')}</section>`;
}

export function startGameChest(id){return Object.hasOwn(demos,id)?{id,step:0,retry:false}:null;}

const catanSteps=[['roll','Roll the practice dice'],['road','Build beside your settlement']];
const lorcanaSteps=[['ink','Add a card to the inkwell'],['play','Spend ink and play the character'],['turn','Start the next turn'],['quest','Quest for 1 lore']];
const stepsFor=id=>id==='catan'?catanSteps:lorcanaSteps;

export function moveGameChest(sample,action){
 if(!sample)return null;
 if(action==='reset')return startGameChest(sample.id);
 const next=stepsFor(sample.id)[sample.step];
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
 return `<div class="chest-map" aria-label="Practice terrain and resources">
  <svg viewBox="0 0 260 132" aria-hidden="true" focusable="false">
  <path d="M15 49 54 27 93 49 93 93 54 115 15 93Z" fill="#b47857" stroke="#e8d8b7" stroke-width="2"/>
  <path d="M93 49 132 27 171 49 171 93 132 115 93 93Z" fill="${step===1?'#72a479':'#518268'}" stroke="#e8d8b7" stroke-width="2"/>
  <path d="M171 49 210 27 249 49 249 93 210 115 171 93Z" fill="#a59d68" stroke="#e8d8b7" stroke-width="2"/>
  <g fill="#fff8e6" font-size="16" text-anchor="middle"><text x="54" y="76">5</text><text x="132" y="76">8</text><text x="210" y="76">10</text></g>
  ${step===2?'<path d="M93 92 132 115" fill="none" stroke="#f8c381" stroke-width="8" stroke-linecap="round"/>':''}
  <path d="M84 92 93 83 102 92V102H84Z" fill="#f8c381" stroke="#433829" stroke-width="2"/>
  </svg><div class="chest-pieces"><span>Brick <strong>${step===2?0:1}</strong></span><span>Lumber <strong>${step===1?1:0}</strong></span><span>Roads built <strong>${step===2?1:0}</strong></span></div></div>`;
}

function lorcanaBoard(step){
 return `<div class="chest-card-mat" aria-label="Practice cards and lore">
  <div><span class="chest-card ${step>=2?'empty':''}" aria-hidden="true">${step===0?'◇ ✦':'✦'}</span><strong>Hand</strong><small>${step===0?'Inkable card and character':step===1?'One-cost character':'Practice cards played'}</small></div>
  <div><span class="chest-card ${step===0?'empty':''} ${step===2?'turned':''}" aria-hidden="true">◆</span><strong>Inkwell</strong><small>${step===0?'Empty':step===2?'1 spent ink':'1 ready ink'}</small></div>
  <div><span class="chest-card ${step<2?'empty':''} ${step===4?'turned':''}" aria-hidden="true">✦</span><strong>Play area</strong><small>${step<2?'Empty':step===2?'Character drying':step===3?'Character ready':'Character quested'}</small></div>
  <div class="chest-lore">Lore <strong>${step===4?1:0}</strong></div>
 </div>`;
}

export function gameChestDemoHTML(sample,associate,esc){
 const game=demos[sample.id],isCatan=sample.id==='catan',next=stepsFor(sample.id)[sample.step];
 const note=sample.retry?'That edge is disconnected. Start this road at your own settlement.':(isCatan?catanNotes:lorcanaNotes)[sample.step];
 return `<div class="modal-body game-chest-demo"><span class="eyebrow">${esc(game.edition)} · FREE PRACTICE</span>
  ${isCatan?catanBoard(sample.step):lorcanaBoard(sample.step)}
  <div class="staff-reply" role="status" tabindex="-1"><strong>${esc(associate)} · ${next?'Show me a turn':'Practice complete'}</strong><p>${esc(note)}</p></div>
  <div class="staff-topics">${next?`<button class="button orange" data-action="game-chest-move" data-id="${next[0]}">${next[1]}</button>`:''}
  ${isCatan&&sample.step===1?'<button class="button secondary" data-action="game-chest-move" data-id="far-road">Try the far edge</button>':''}
  <button class="button secondary" data-action="game-chest-move" data-id="reset">Reset practice</button></div>
  <p class="hint">This guided sample uses original pieces and a short, fixed turn.</p>
  <div class="chest-sources"><a href="${game.rules}" target="_blank" rel="noopener noreferrer">Publisher rules ↗</a><a href="${game.evidence}" target="_blank" rel="noopener noreferrer">${game.evidenceLabel} ↗</a></div>
 </div>`;
}

export function gameChestDemoTitle(sample){return demos[sample.id].title+' · Practice table';}
