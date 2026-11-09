import {chestCard,loreTrack,resourceTray,terrainArt} from './game-chest-art.js';

const settlement = [
 {note:'Your road reaches a legal building site. You have five lumber, one brick and one grain. Trade with the bank for the missing wool.',
  moves:[['trade','Trade 4 lumber for 1 wool',1]]},
 {note:'You have one of each resource. Choose an intersection connected to your road and at least two edges away from your existing settlement.',
  retryNote:'That intersection is one edge from your settlement. Try the far end of the road.',
  moves:[['settle','Build at the far end of your road',2],['near','Build one edge away',1]]},
 {note:'You spent one brick, lumber, grain and wool. Your second settlement adds one victory point.',moves:[]}
];

const lore = [
 {note:'You have 19 lore and one ready character. Quest to finish, or challenge the exerted character and see how damage works.',
  moves:[['finish','Quest for the last lore',3],['duel','Challenge the exerted character',1]]},
 {note:'Both characters dealt two damage. The opposing character was banished, and yours survived with two damage. Challenging earns no lore here.',
  moves:[['ready','Ready your character next turn',2]]},
 {note:'Your character is ready again, with its two damage still marked. Quest for the last lore.',
  moves:[['finish','Quest for the last lore',3]]},
 {note:'You reached 20 lore and won the practice match.',moves:[]}
];

const city = [
 {note:'Spend three ore and two grain to upgrade one of your settlements. Your goal is to harvest two grain on the next roll. Taylor has set that roll to 6.',
  moves:[['city-six','Upgrade beside the 6 field',1],['city-eleven','Upgrade beside the 11 field',2]]},
 {note:'Your city borders the 6 field. See what that number produces.',moves:[['harvest','Roll the practice dice',3]]},
 {note:'Your city borders the 11 field. See what a 6 produces instead.',moves:[['harvest','Roll the practice dice',4]]},
 {note:'The 6 field produced two grain for your city. The city replaced its settlement and is worth two victory points.',moves:[],won:true},
 {note:'The 11 field stayed quiet. Your settlement by the 6 collected one grain. Reset and upgrade that settlement for a harvest of two.',moves:[],won:false}
];

const race = [
 {note:'You have 18 lore. Your opponent has 19 and an exerted character that quests for one. Your Scout can act now. Your Guide is still drying.',
  moves:[['stop','Challenge with your Scout',1],['race-quest','Quest with your Scout',2]]},
 {note:'The opposing character was banished. Your Scout survived with one damage. Finish your turn to give the Guide time to dry.',moves:[['race-pass','End your turn',3]]},
 {note:'Your Scout gained one lore. Your opponent can still win on their turn.',moves:[['race-pass','End your turn',7]]},
 {note:'Your opponent had no character able to quest. Both of your characters are ready now. Each quests for one lore.',
  moves:[['race-quest','Quest with your Scout',4],['guide','Quest with your Guide',5]]},
 {note:'Your Scout brought you to 19. Quest with your Guide for the last lore.',moves:[['guide','Quest with your Guide',6]]},
 {note:'Your Guide brought you to 19. Quest with your Scout for the last lore.',moves:[['race-quest','Quest with your Scout',6]]},
 {note:'Both characters quested and you reached 20 lore. You won the practice match.',moves:[],won:true},
 {note:'Your opponent readied their character and quested to reach 20 lore. Reset and try taking that character out first.',moves:[],won:false}
];

const harbor = [
 {note:'You have nine points and four brick, one lumber and one grain. You need wool to build the last settlement. Your coastal settlement is on a 2:1 brick harbor.',
  moves:[['harbor-trade','Trade 2 brick at the harbor',1],['bank-trade','Trade 4 brick with the bank',3]]},
 {note:'You have two brick left and enough to build. Pick a legal site at the end of your road.',
  retryNote:'That site is only one edge from your settlement. Building there would break the distance rule.',
  moves:[['harbor-build','Build at the far site',2],['harbor-near','Try the nearer site',1]]},
 {note:'You paid one brick, lumber, grain and wool. Your new settlement puts you at ten points and wins the match.',moves:[]},
 {note:'The bank took all four brick. You have wool but no brick left for the settlement. Reset and use your harbor.',moves:[],won:false}
];

const rush = [
 {note:'You have 19 lore and two ready ink. Your opponent also has 19 and an exerted character. Choose which two-cost card to play.',
  moves:[['rush-play','Play the Courier with Rush',1],['guide-play','Play the Guide',2]]},
 {note:'The Courier can challenge on the turn it enters play. It still has to wait until next turn to quest.',
  retryNote:'Rush only lets the Courier challenge while drying. Try a challenge now and quest next turn.',
  moves:[['rush-duel','Challenge with the Courier',3],['rush-quest','Try to quest now',1]]},
 {note:'The Guide is still drying. Without a ready character, you have to end your turn.',
  moves:[['rush-pass','End your turn',6]]},
 {note:'The Courier banished the opponent’s character and took one damage. End your turn to let its ink dry.',
  moves:[['rush-pass','End your turn',4]]},
 {note:'Your opponent had no character that could quest. Your Courier is ready and can now quest for the final lore.',
  moves:[['rush-win','Quest with the Courier',5]]},
 {note:'Your Courier quested and brought you to twenty lore. You won the match.',moves:[]},
 {note:'The opponent readied their character and reached twenty lore. Reset and try the Courier’s Rush ability.',moves:[],won:false}
];

const tables = {challenge:{catan:settlement,lorcana:lore}, strategy:{catan:city,lorcana:race}, final:{catan:harbor,lorcana:rush}};
const stages = sample => tables[sample.mode][sample.id][sample.step];

export function tableChallengeOutcome(sample) {
 const stage = stages(sample);
 return stage.moves.length ? null : stage.won === false ? 'lost' : 'won';
}

export function moveTableChallenge(sample, action) {
 const stage = stages(sample),move = stage.moves.find(([id]) => id === action);
 if (!move) return sample;
 return {...sample,step:move[2],retry:move[2]===sample.step,challenged:sample.challenged || action === 'duel'};
}

const settlementRoute=[[186,126],[246,126],[276,74]];

function settlementBoard(step) {
 const pieces=[[186,126,'home'],[246,126,'site'],[276,74,step===2?'home':'site']];
 return `<div class="chest-map" aria-label="Settlement route and resources">${terrainArt({route:settlementRoute,pieces})}
  ${resourceTray({Brick:step<2?1:0,Lumber:step===0?5:step===1?1:0,Grain:step<2?1:0,Wool:step===1?1:0,Settlements:step===2?2:1})}</div>`;
}

function loreBoard({step,challenged}) {
 const exerted=step===1||step===3;
 return `<div class="chest-card-mat chest-duel" aria-label="Characters and lore">
  ${chestCard('scout','Your character','2 strength · 3 willpower',`${exerted?'Exerted':'Ready'} · ${challenged?2:0} damage`,exerted?'turned':'')}
  ${chestCard('rival','Opposing character','2 strength · 1 willpower',challenged?'Banished':'Exerted',challenged?'empty':'turned')}
  ${loreTrack(step===3?20:19)}</div>`;
}

function cityBoard(step) {
 const sixCity=step===1||step===3,elevenCity=step===2||step===4;
 const pieces=[[276,178,sixCity?'city':'home'],[426,230,elevenCity?'city':'home']];
 return `<div class="chest-map" aria-label="Fields and harvest">${terrainArt({active:step>=3?6:null,pieces})}
  <div class="chest-fields"><span>6 field <strong>${sixCity?'City':'Settlement'}</strong></span><span>11 field <strong>${elevenCity?'City':'Settlement'}</strong></span></div>
  ${resourceTray({Ore:step===0?3:0,Grain:step===0||step===3?2:step===4?1:0,'Victory points':step===0?2:3})}</div>`;
}

function raceBoard(step) {
 const opponentGone=step===1||(step>=3&&step<=6);
 const scoutExerted=[1,2,4,6,7].includes(step),guideExerted=step===5||step===6;
 const lore=step===6?20:[2,4,5,7].includes(step)?19:18;
 return `<div class="chest-card-mat" aria-label="Lore race and characters">
  ${chestCard('scout','Scout','2 strength · 3 willpower',`${scoutExerted?'Exerted':'Ready'} · ${opponentGone?1:0} damage`,scoutExerted?'turned':'')}
  ${chestCard('guide','Guide','1 lore',step<3||step===7?'Drying':guideExerted?'Exerted':'Ready',guideExerted?'turned':'')}
  ${chestCard('rival','Opponent','1 strength · 2 willpower',opponentGone?'Banished':'Exerted',opponentGone?'empty':'turned')}
  ${loreTrack(lore,step===7?20:19)}</div>`;
}

function harborBoard(step) {
 const route=[[96,178],[156,178],[186,126]];
 const pieces=[[96,178,'home'],[156,178,'site'],[186,126,step===2?'home':'site']];
 return `<div class="chest-map" aria-label="Brick harbor, road and building sites">${terrainArt({route,pieces,harbor:true})}
  ${resourceTray({Brick:[4,2,1,0][step],Lumber:step===2?0:1,Grain:step===2?0:1,Wool:step===1||step===3?1:0,'Victory points':step===2?10:9})}</div>`;
}

function rushBoard(step) {
 const guide=step===2||step===6,courierWon=step===3||step===4||step===5;
 const status=['In hand','Drying · Rush','Drying','Exerted · 1 damage','Ready · 1 damage','Exerted · 1 damage','Drying'][step];
 return `<div class="chest-card-mat" aria-label="Rush challenge and lore">
  ${step===0?'<div class="chest-board-note">Your hand · 2 ready ink</div>':''}
  ${chestCard(guide?'guide':'courier',guide?'Guide':'Courier',guide?'2 ink · 1 lore':'2 ink · 2 strength · 3 willpower',status,step===3||step===5?'turned':'')}
  ${step===0?chestCard('guide','Guide','2 ink · 1 lore','In hand'):chestCard('ink','Inkwell',step===4||step===5?'2 ready ink':'2 spent ink','2 ink capacity',step===1||step===2||step===3||step===6?'turned':'')}
  ${chestCard('rival','Opponent','1 strength · 2 willpower',courierWon?'Banished':'Exerted',courierWon?'empty':'turned')}
  ${loreTrack(step===5?20:19,step===6?20:19)}</div>`;
}

const boards={
 challenge:{catan:sample=>settlementBoard(sample.step),lorcana:loreBoard},
 strategy:{catan:sample=>cityBoard(sample.step),lorcana:sample=>raceBoard(sample.step)},
 final:{catan:sample=>harborBoard(sample.step),lorcana:sample=>rushBoard(sample.step)}
};

export function tableChallengeView(sample) {
 const stage=stages(sample);
 return {board:boards[sample.mode][sample.id](sample),moves:stage.moves,note:sample.retry?stage.retryNote:stage.note};
}
