import assert from 'node:assert/strict';
import test from 'node:test';
import * as E from '../dist/engine.js';
import {startGameChest,moveGameChest,gameChestDemoHTML,gameChestOutcome,recordGameChestCompletion,gameChestLibrary} from '../dist/game-chest.js';
import {shopRows} from '../dist/play-ui.js';
import {catanTargets} from '../dist/game-chest-catan.js';


test('Game Chest appears in the default activity search and both challenges handle alternate moves', () => {
 const s = {...E.createState(),mallId:'delamo'};
 assert.match(shopRows(s,{E,esc:String},'The Game Chest'),/Free tabletop demos/);
 const html = sample => gameChestDemoHTML(sample,'Taylor',String);
 const catan = startGameChest('catan','challenge');
 assert.equal(moveGameChest(catan,'settle'),catan);
 const traded = moveGameChest(catan,'trade');
 const rejected = moveGameChest(traded,'near');
 assert.equal(rejected.step,traded.step);
 assert.match(html(rejected),/one edge from your settlement/);
 const built = moveGameChest(rejected,'settle');
 assert.match(html(built),/Settlements <strong>2/);
 assert.deepEqual(moveGameChest(built,'reset'),catan);
 const lorcana = startGameChest('lorcana','challenge');
 assert.match(html(moveGameChest(lorcana,'finish')),/Lore <strong>20/);
 const duel = moveGameChest(lorcana,'duel');
 assert.equal(moveGameChest(duel,'finish'),duel);
 assert.match(html(duel),/Banished/);
 assert.match(html(duel),/Lore <strong>19/);
 const ready = moveGameChest(duel,'ready');
 assert.match(html(ready),/Ready · 2 damage/);
 assert.match(html(moveGameChest(ready,'finish')),/Lore <strong>20/);
});

test('strategy tables have losing and winning routes, and only first wins are saved', () => {
 const state=E.createState();
 const play=(id,...moves)=>moves.reduce(moveGameChest,startGameChest(id,'strategy'));
 const finish=sample=>recordGameChestCompletion(state,sample);
 const cityMiss=play('catan','city-eleven','harvest');
 assert.match(gameChestDemoHTML(cityMiss,'Taylor',String),/Grain <strong>1/);
 assert.equal(finish(cityMiss),false);
 const cityWin=play('catan','city-six','harvest');
 assert.match(gameChestDemoHTML(cityWin,'Taylor',String),/Grain <strong>2/);
 assert.equal(finish(cityWin),true);
 assert.equal(finish(cityWin),false);
 const loreLoss=play('lorcana','race-quest','race-pass');
 assert.match(gameChestDemoHTML(loreLoss,'Taylor',String),/Opposing lore <strong>20/);
 assert.equal(finish(loreLoss),false);
 for(const quests of [['guide','race-quest'],['race-quest','guide']]){
  const loreWin=play('lorcana','stop','race-pass',...quests);
  assert.match(gameChestDemoHTML(loreWin,'Taylor',String),/Your lore <strong>20/);
  finish(loreWin);
 }
 assert.deepEqual(state.gameChestProgress,['catan/strategy','lorcana/strategy']);
 const restored=E.validateImport(JSON.stringify({...state,gameChestProgress:[...state.gameChestProgress,'lorcana/strategy','made-up']}));
 assert.deepEqual(restored.gameChestProgress,state.gameChestProgress);
 assert.match(gameChestLibrary('catan',String,restored.gameChestProgress),/2 of 10 completed/);
 delete state.gameChestProgress;
 assert.deepEqual(E.validateImport(JSON.stringify(state)).gameChestProgress,[]);
});

test('endgame tables enforce the harbor rate and the Rush restriction, with saved wins', () => {
 const state=E.createState(),html=sample=>gameChestDemoHTML(sample,'Taylor',String);
 const run=(sample,...moves)=>moves.reduce(moveGameChest,sample);
 const catan=startGameChest('catan','final');
 const bank=run(catan,'bank-trade');
 assert.equal(gameChestOutcome(bank),'lost');
 assert.equal(recordGameChestCompletion(state,bank),false);
 const traded=run(catan,'harbor-trade','harbor-near');
 assert.equal(traded.step,1);
 assert.match(html(traded),/Brick <strong>2/);
 assert.match(html(traded),/distance rule/);
 const built=run(traded,'harbor-build');
 assert.match(html(built),/Victory points <strong>10/);
 assert.equal(recordGameChestCompletion(state,built),true);

 const lorcana=startGameChest('lorcana','final');
 assert.equal(gameChestOutcome(run(lorcana,'guide-play','rush-pass')),'lost');
 const courier=run(lorcana,'rush-play','rush-quest');
 assert.equal(courier.step,1);
 assert.match(html(courier),/challenge while drying/);
 assert.equal(run(courier,'rush-win'),courier);
 const won=run(courier,'rush-duel','rush-pass','rush-win');
 assert.equal(gameChestOutcome(won),'won');
 assert.equal(recordGameChestCompletion(state,won),true);
 assert.deepEqual(E.validateImport(JSON.stringify(state)).gameChestProgress,['catan/final','lorcana/final']);
 assert.equal(moveGameChest(run(startGameChest('catan','strategy'),'city-six','harvest'),'continue').mode,'final');
});

test('an island match uses legal board placements across rounds and can end at ten points', () => {
 const first=startGameChest('catan','match',5);
 const seven=moveGameChest(first,'roll');
 assert.equal(seven.match.phase,'robber');
 assert.equal(moveGameChest(seven,'pass'),seven);
 assert.equal(moveGameChest(seven,'tile-'+seven.match.robber),seven);
 const relocated=moveGameChest(seven,'tile-'+((seven.match.robber+1)%19));
 assert.equal(relocated.match.phase,'build');
 assert.notEqual(relocated.match.robber,seven.match.robber);
 let session=startGameChest('catan','match',42),placed=0;
 while(!gameChestOutcome(session)&&session.match.turn<=100){
  session=moveGameChest(session,'roll');
  if(session.match.phase==='robber')session=moveGameChest(session,'tile-'+((session.match.robber+1)%19));
  for(const type of ['city','settlement','road','settlement']){
   session=moveGameChest(session,'tool-'+type);
   if(session.match.tool!==type)continue;
   const [target]=catanTargets(session.match,0,type);
   assert.equal(moveGameChest(session,'place-1000'),session);
   session=moveGameChest(session,'place-'+target);
   placed++;
  }
  session=moveGameChest(session,'pass');
 }
 assert.ok(placed>=5&&session.match.turn>10);
 assert.equal(gameChestOutcome(session),'won');
 const state=E.createState();
 assert.equal(recordGameChestCompletion(state,session),true);
 assert.equal(recordGameChestCompletion(state,session),false);
 assert.deepEqual(E.validateImport(JSON.stringify(state)).gameChestProgress,['catan/match']);
});

test('a lore match uses hands, ink, drying and draws through a twenty-lore win', () => {
 const duel=startGameChest('lorcana','match',1);
 duel.match.seats[0].board=[{id:'courier',kind:'courier',drying:true,exerted:false,damage:0}];
 duel.match.seats[1].board=[{id:'scout',kind:'scout',drying:false,exerted:false,damage:0}];
 const selected=moveGameChest(duel,'own-courier');
 assert.equal(moveGameChest(selected,'quest'),selected);
 assert.equal(moveGameChest(selected,'enemy-scout'),selected);
 selected.match.seats[1].board[0].exerted=true;
 assert.match(gameChestDemoHTML(selected,'Taylor',String),/data-id="enemy-scout" aria-label="Target Hill Scout"/);
 const challenged=moveGameChest(selected,'enemy-scout');
 assert.equal(challenged.match.seats[1].discard[0].id,'scout');
 assert.equal(challenged.match.seats[0].board[0].damage,1);
 assert.equal(challenged.match.seats[0].board[0].exerted,true);

 let session=startGameChest('lorcana','match',1),quests=0;
 assert.equal(session.match.seats[0].hand.length,7);
 while(!gameChestOutcome(session)&&session.match.turn<=28){
  for(const card of [...session.match.seats[0].hand].reverse()){
   session=moveGameChest(session,'hand-'+card.id);
   const inked=moveGameChest(session,'ink');
   if(inked===session)continue;
   session=inked;
   assert.equal(moveGameChest(session,'ink'),session);
   break;
  }
  for(const card of [...session.match.seats[0].hand]){
   session=moveGameChest(session,'hand-'+card.id);
   const played=moveGameChest(session,'play');
   if(played!==session)assert.equal(moveGameChest(played,'quest'),played);
   session=played;
  }
  for(const card of [...session.match.seats[0].board]){
   if(session.match.selected?.id!==card.id)session=moveGameChest(session,'own-'+card.id);
   const quested=moveGameChest(session,'quest');
   if(quested!==session)quests++;
   session=quested;
  }
  session=moveGameChest(session,'pass');
 }
 assert.ok(quests>=8&&session.match.turn>=5);
 assert.equal(gameChestOutcome(session),'won');
 assert.ok(session.match.seats[1].lore>0);
});
