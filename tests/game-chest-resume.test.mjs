import assert from 'node:assert/strict';
import test from 'node:test';
import {createState,validateImport} from '../dist/engine.js';
import {checkpointGameChestMatch,gameChestDemoHTML,gameChestLibrary,moveGameChest,recordGameChestCompletion,resumeGameChestMatch,startGameChest} from '../dist/game-chest.js';

const roundTrip=state=>validateImport(JSON.stringify(state));
const play=(sample,...actions)=>actions.reduce((next,action)=>moveGameChest(next,action),sample);

test('both games resume the exact pending move and continue the same match',()=>{
 const state=createState();
 const catan=play(startGameChest('catan','match',5),'roll');
 assert.equal(catan.match.phase,'robber');
 const lore=startGameChest('lorcana','match',5);
 const keeper=lore.match.seats[0].hand.find(card=>card.kind==='keeper');
 const scout=lore.match.seats[0].hand.find(card=>card.kind==='scout');
 const lorcana=play(lore,'hand-'+keeper.id,'ink','hand-'+scout.id,'play');
 assert.equal(lorcana.match.seats[0].board[0].drying,true);
 assert.equal(lorcana.match.seats[0].spent,1);
 for(const sample of [catan,lorcana])assert.equal(checkpointGameChestMatch(state,sample),true);
 const loaded=roundTrip(state);
 const library=gameChestLibrary('catan',String,loaded.gameChestProgress,loaded.gameChestMatches);
 assert.match(library,/Round 1 · In progress<\/small>Resume island match/);
 assert.match(library,/Turn 1 · In progress<\/small>Resume lore match/);
 const restoredCatan=resumeGameChestMatch(loaded.gameChestMatches,'catan');
 const restoredLore=resumeGameChestMatch(loaded.gameChestMatches,'lorcana');
 assert.deepEqual(restoredCatan,catan);
 assert.deepEqual(restoredLore,lorcana);
 assert.deepEqual(play(restoredCatan,'tile-0','pass'),play(catan,'tile-0','pass'));
 assert.deepEqual(play(restoredLore,'pass','own-'+scout.id,'quest'),play(lorcana,'pass','own-'+scout.id,'quest'));

 const final=play(startGameChest('lorcana','final'),'rush-play','rush-duel','rush-pass','rush-win');
 assert.match(gameChestDemoHTML(final,'Taylor',String,loaded.gameChestMatches),/Next: Resume lore match/);
 assert.deepEqual(moveGameChest(final,'continue',loaded.gameChestMatches),lorcana);
});

test('malformed or unsupported checkpoints leave the mall save and the other match intact',()=>{
 const state=createState();
 const catan=startGameChest('catan','match',5),lore=startGameChest('lorcana','match',5);
 for(const sample of [catan,lore])checkpointGameChestMatch(state,sample);
 state.gameChestProgress=['catan/final'];
 state.gameChestMatches.catan.version=999;
 let loaded=roundTrip(state);
 assert.deepEqual(Object.keys(loaded.gameChestMatches),['lorcana']);
 assert.deepEqual(loaded.gameChestProgress,state.gameChestProgress);
 assert.equal(loaded.cash,state.cash);
 checkpointGameChestMatch(state,catan);
 state.gameChestMatches.lorcana.match.seats[0].hand[0].id='bad id';
 loaded=roundTrip(state);
 assert.deepEqual(Object.keys(loaded.gameChestMatches),['catan']);
 delete state.gameChestMatches;
 assert.deepEqual(roundTrip(state).gameChestMatches,{});
});

test('a completed rematch clears only its own checkpoint even if the win was already recorded',()=>{
 const state=createState();
 const catan=startGameChest('catan','match',5),lore=startGameChest('lorcana','match',5);
 for(const sample of [catan,lore])checkpointGameChestMatch(state,sample);
 state.gameChestProgress=['lorcana/match'];
 const finished={...lore,match:{...lore.match,winner:0}};
 assert.equal(recordGameChestCompletion(state,finished),false);
 assert.equal(checkpointGameChestMatch(state,finished),true);
 const loaded=roundTrip(state);
 assert.deepEqual(loaded.gameChestProgress,['lorcana/match']);
 assert.equal(resumeGameChestMatch(loaded.gameChestMatches,'lorcana'),null);
 assert.deepEqual(resumeGameChestMatch(loaded.gameChestMatches,'catan'),catan);
});

test('Rowan blocks productive pasture when Mina is the stronger robber target',()=>{
 const game=play(startGameChest('catan','match',2),'roll');
 // Mina has upgraded the settlement beside the six on pasture.
 game.match.buildings[11].type='city';
 const next=play(game,'pass');
 assert.match(next.match.log[0],/Rowan rolled 7/);
 assert.equal(next.match.robber,2);
});

test('Taylor combines damage to remove a threat to win next turn and takes a win when available',()=>{
 const game=startGameChest('lorcana','match',1);
 const [you,taylor]=game.match.seats;
 const card=(id,kind,exerted=false)=>({id,kind,drying:false,exerted,damage:0});
 you.lore=17;
 you.board=[card('low','scout',true),card('threat','beacon',true)];
 taylor.ink=2;
 taylor.hand=[{id:'spell',kind:'spark'}];
 taylor.deck=[{id:'a',kind:'beacon'},{id:'b',kind:'beacon'}];
 taylor.board=[card('attacker','courier')];
 const defended=play(game,'pass');
 assert.deepEqual(defended.match.seats[0].board.map(c=>c.id),['low']);
 assert.match(defended.match.log,/banished Beacon Bearer/);
 assert.equal(defended.match.seats[1].discard.some(c=>c.id==='spell'),true);
 taylor.lore=19;
 const won=play(game,'pass');
 assert.equal(won.match.winner,1);
 assert.equal(won.match.seats[0].board.length,2);
 assert.equal(won.match.seats[1].lore,20);
});

test('Taylor inks and plays to put two lore characters on the field instead of one expensive card',()=>{
 const game=startGameChest('lorcana','match',1),taylor=game.match.seats[1];
 taylor.ink=3;
 taylor.hand=[{id:'keeper',kind:'keeper'},{id:'guide-a',kind:'guide'},{id:'guide-b',kind:'guide'}];
 taylor.deck=[{id:'a',kind:'beacon'},{id:'b',kind:'beacon'}];
 const next=play(game,'pass').match.seats[1];
 assert.equal(next.ink,4);
 assert.equal(next.spent,4);
 assert.deepEqual(next.board.map(c=>c.kind),['guide','guide']);
});
