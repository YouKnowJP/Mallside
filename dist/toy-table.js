const TOWER_MOVES = ['Slide the middle block', 'Lift it clear of the tower', 'Set it on top'];
const TOWER_TEXT = ['Start with one block in a supported middle layer.', 'The block is clear of its neighbors.', 'Keep the block level as you lift it.', 'Sample complete. The block is now on top.'];
const COLORS = ['orange','red','green','blue'];
const RACK = ['S','L','A','M','L'];
const WORD = 'MALL';

export function toyTableMove(session, move) {
 if (move === 'reset') return {...session,step:0,tiles:[],message:''};
 if (session.kind === 'tower' && move === 'next' && session.step < TOWER_MOVES.length) {
  return {...session,step:session.step+1};
 }
 if (session.kind === 'cube' && (move === 'left' || move === 'right')) {
  return {...session,step:(session.step+(move==='right'?1:3))%4};
 }
 if (session.kind === 'letters' && /^tile-[0-4]$/.test(move)) {
  const index = Number(move.at(-1)), letter=RACK[index];
  if (session.tiles.length < WORD.length && !session.tiles.includes(index)) {
   const wanted=WORD[session.tiles.length];
   return letter === wanted ? {...session,tiles:[...session.tiles,index],message:''}
    : {...session,message:'The next letter in MALL is '+wanted+'. Try another tile.'};
  }
 }
 return session;
}

function towerHTML(step) {
 const layers=Array.from({length:8},(_,row)=>`<span class="toy-layer">${[0,1,2].map(i=>`<i class="${row===4&&i===1?'toy-moving-block':''}"></i>`).join('')}</span>`).join('');
 return {
  preview:`<div class="toy-illustration toy-tower" data-step="${step}" aria-hidden="true"><span class="toy-top-block"></span>${layers}</div>`,
  status:TOWER_TEXT[step], actions:step<TOWER_MOVES.length?`<button class="button orange" data-action="toy-table-move" data-id="next">${TOWER_MOVES[step]}</button>`:''
 };
}

function cubeHTML(step) {
 const face=(base,top,name)=>`<div class="toy-cube-face ${name}">${Array.from({length:9},(_,i)=>`<i class="tile-${i<3?top:base}"></i>`).join('')}</div>`;
 const front=COLORS[(2+step)%4],right=COLORS[(1+step)%4];
 return {
  preview:`<div class="toy-illustration toy-cube" aria-hidden="true"><div class="toy-cube-assembly">${face('white','white','top')}${face('green',front,'front')}${face('red',right,'right')}</div></div>`,
  status:step===0?'All visible faces are aligned.':`The top row of the green face is now ${front}. Turn it back or keep experimenting.`,
  actions:'<button class="button secondary" data-action="toy-table-move" data-id="left">Turn top left</button><button class="button orange" data-action="toy-table-move" data-id="right">Turn top right</button>'
 };
}

function lettersHTML(session) {
 const slots=Array.from(WORD,(_,i)=>`<i>${RACK[session.tiles[i]]||''}</i>`).join('');
 const actions=RACK.map((letter,i)=>`<button class="button secondary toy-letter" data-action="toy-table-move" data-id="tile-${i}" aria-label="Place tile ${i+1}, letter ${letter}" ${session.tiles.includes(i)||session.tiles.length===WORD.length?'disabled':''}>${letter}</button>`).join('');
 const status=session.tiles.length===WORD.length?'MALL scores 6 points before board bonuses.':session.message||'Build MALL from left to right.';
 return {preview:`<div class="toy-illustration toy-word" aria-hidden="true">${slots}</div>`,status,actions};
}

export function toyTableHTML(session, reducedMotion) {
 const sample=session.kind==='tower'?towerHTML(session.step):session.kind==='cube'?cubeHTML(session.step):lettersHTML(session);
 return `<div class="modal-body toy-table${reducedMotion?' quiet':''}">
 <span class="eyebrow">PLAY TABLE · FREE TO TRY</span>
 ${sample.preview}
 <p class="toy-table-status" role="status">${sample.status}</p>
 <div class="toy-table-actions">${sample.actions}<button class="button secondary" data-action="toy-table-move" data-id="reset">Reset sample</button></div>
 <p class="hint">A small playable sample. Your bag, budget, and game clock stay as they are.</p>
 </div>`;
}
