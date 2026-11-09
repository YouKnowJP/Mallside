import {hexCorners,resourceTray,terrainArt} from './game-chest-art.js';

const players = ['You','Rowan','Mina'];
const colors = ['#ffc879','#f78e9c','#9fdaf0'];
const resources = ['brick','lumber','grain','wool','ore'];
const labels = {brick:'Brick',lumber:'Lumber',grain:'Grain',wool:'Wool',ore:'Ore'};
const terrainResource = {hills:'brick',forest:'lumber',fields:'grain',pasture:'wool',mountains:'ore'};
const costs = {road:{brick:1,lumber:1},settlement:{brick:1,lumber:1,grain:1,wool:1},city:{ore:3,grain:2}};
const pieceLimits = {road:15,settlement:5,city:4};
const buildLabels = {road:'Road',settlement:'Settlement',city:'City'};
const terrainOrder = ['forest','fields','pasture','hills','mountains','pasture','forest','fields','desert','hills','fields','forest','pasture','mountains','hills','mountains','fields','pasture','forest'];
const numbers = [5,2,6,3,8,10,9,12,null,11,4,8,10,9,4,5,6,3,11];
const vertices = [],edges = [],neighbors = [],incident = [],tileVertices = [];
const vertexIds = new Map(),edgeIds = new Map();
const board = [];
const width = 510,height = 566;
for(let column=-2;column<=2;column++){
 for(let row=Math.max(-2,-column-2);row<=Math.min(2,2-column);row++){
  const x=width/2+column*90,y=height/2+column*52+row*104;
  board.push([x,y,terrainOrder[board.length],numbers[board.length]]);
  const corners=hexCorners.map(([dx,dy])=>{
   const key=[x+dx,y+dy].join(',');
   if(!vertexIds.has(key)){
    vertexIds.set(key,vertices.length);
    vertices.push([x+dx,y+dy]);neighbors.push([]);incident.push([]);
   }
   return vertexIds.get(key);
  });
  for(const [i,a] of corners.entries()){
   const b=corners[(i+1)%corners.length],key=[Math.min(a,b),Math.max(a,b)].join(':');
   if(edgeIds.has(key))continue;
   edgeIds.set(key,edges.length);
   incident[a].push(edges.length);incident[b].push(edges.length);
   neighbors[a].push(b);neighbors[b].push(a);edges.push([a,b]);
  }
  tileVertices.push(corners);
 }
}
const harborVertices=tileVertices[1].slice(0,2);
const vertexTiles=vertices.map((_,id)=>tileVertices.flatMap((corners,tile)=>corners.includes(id)?[tile]:[]));
const blank=()=>Object.fromEntries(resources.map(kind=>[kind,0]));
const pays=(hand,cost)=>Object.entries(cost).every(([kind,n])=>hand[kind]>=n);
const pay=(hand,cost)=>{for(const [kind,n] of Object.entries(cost))hand[kind]-=n;};
const freeSite=(match,id)=>!match.buildings[id]&&neighbors[id].every(other=>!match.buildings[other]);
const numberWeight=n=>n?6-Math.abs(7-n):0;
const vertexValue=id=>vertexTiles[id].reduce((total,tile)=>total+numberWeight(board[tile][3]),0);
const owned=(match,seat,type)=>type==='road'?Object.values(match.roads).filter(owner=>owner===seat).length:Object.values(match.buildings).filter(piece=>piece.owner===seat&&piece.type===type).length;
const points=(match,seat)=>owned(match,seat,'settlement')+2*owned(match,seat,'city')+2*Number(match.longest===seat);

function random(match,max){
 match.seed=(Math.imul(match.seed,1664525)+1013904223)>>>0;
 return Math.floor(match.seed/4294967296*max);
}
const roll=match=>[1+random(match,6),1+random(match,6)];
const otherEnd=(edge,vertex)=>edges[edge].find(id=>id!==vertex);
const connected=(match,vertex,seat)=>{
 const building=match.buildings[vertex];
 return building?building.owner===seat:incident[vertex].some(edge=>match.roads[edge]===seat);
};

export function catanTargets(match,seat,type){
 if(owned(match,seat,type)>=pieceLimits[type])return [];
 if(type==='road')return edges.flatMap(([a,b],id)=>match.roads[id]===undefined&&(connected(match,a,seat)||connected(match,b,seat))?[id]:[]);
 if(type==='settlement')return vertices.flatMap((_,id)=>freeSite(match,id)&&incident[id].some(edge=>match.roads[edge]===seat)?[id]:[]);
 return vertices.flatMap((_,id)=>match.buildings[id]?.owner===seat&&match.buildings[id].type==='settlement'?[id]:[]);
}

function longestRoad(match,seat){
 const visit=(vertex,used)=>{
  if(used.size&&match.buildings[vertex]&&match.buildings[vertex].owner!==seat)return used.size;
  let best=used.size;
  for(const edge of incident[vertex]){
   if(match.roads[edge]!==seat||used.has(edge))continue;
   used.add(edge);
   best=Math.max(best,visit(otherEnd(edge,vertex),used));
   used.delete(edge);
  }
  return best;
 };
 return Math.max(...vertices.map((_,id)=>visit(id,new Set())));
}

function place(match,seat,type,id){
 pay(match.hands[seat],costs[type]);
 if(type==='road')match.roads[id]=seat;
 else match.buildings[id]={owner:seat,type};
 const lengths=players.map((_,player)=>longestRoad(match,player));
 const longest=Math.max(...lengths);
 const contenders=lengths.flatMap((length,player)=>length===longest?[player]:[]);
 match.longest=longest<5?null:contenders.length===1?contenders[0]:contenders.includes(match.longest)?match.longest:null;
 if(points(match,seat)>=10)match.winner=seat;
}

function produce(match,total){
 for(const [tile,corners] of tileVertices.entries()){
  if(board[tile][3]!==total||tile===match.robber)continue;
  const kind=terrainResource[board[tile][2]];
  for(const vertex of corners){
   const piece=match.buildings[vertex];
   if(piece)match.hands[piece.owner][kind]+=piece.type==='city'?2:1;
  }
 }
}

function takeRandom(match,hand){
 const total=resources.reduce((sum,kind)=>sum+hand[kind],0);
 if(!total)return null;
 let pick=random(match,total);
 for(const kind of resources){
  if(pick<hand[kind]){hand[kind]--;return kind;}
  pick-=hand[kind];
 }
 return null;
}

function discard(match){
 for(const hand of match.hands){
  const total=resources.reduce((sum,kind)=>sum+hand[kind],0);
  if(total>7)for(let count=0;count<Math.floor(total/2);count++)takeRandom(match,hand);
 }
}

const handSize=hand=>resources.reduce((sum,kind)=>sum+hand[kind],0);
function moveRobber(match,seat,tile){
 match.robber=tile;
 const rivals=[...new Set(tileVertices[tile].map(id=>match.buildings[id]?.owner))]
  .filter(owner=>owner!==undefined&&owner!==seat&&handSize(match.hands[owner]));
 if(seat!==0)rivals.sort((a,b)=>points(match,b)-points(match,a)||handSize(match.hands[b])-handSize(match.hands[a]));
 const victim=rivals[0];
 const stolen=victim===undefined?null:takeRandom(match,match.hands[victim]);
 if(stolen)match.hands[seat][stolen]++;
 return stolen;
}

function tradeRate(match,seat,kind){
 return kind==='brick'&&harborVertices.some(id=>match.buildings[id]?.owner===seat)?2:4;
}

function bankOffer(match,seat,cost,production){
 const hand=match.hands[seat],missing=resources.filter(kind=>hand[kind]<(cost[kind]||0));
 if(missing.length!==1||cost[missing[0]]-hand[missing[0]]!==1)return null;
 const [take]=missing,score=kind=>Math.min(12,production[kind])/3+hand[kind]-(cost[kind]||0)-tradeRate(match,seat,kind)*2;
 const give=resources.filter(kind=>kind!==take&&hand[kind]-(cost[kind]||0)>=tradeRate(match,seat,kind))
  .sort((a,b)=>score(b)-score(a))[0];
 return give?{give,take,rate:tradeRate(match,seat,give)}:null;
}

function productionAt(id){
 return vertexTiles[id].flatMap(tile=>{
  const kind=terrainResource[board[tile][2]];
  return kind?[[kind,numberWeight(board[tile][3])]]:[];
 });
}

function productionFor(match,seat){
 const production=blank();
 for(const [id,piece] of Object.entries(match.buildings))if(piece.owner===seat)
  for(const [kind,pips] of productionAt(id))production[kind]+=pips*(piece.type==='city'?2:1);
 return production;
}

function siteValue(id,production){
 return productionAt(id).reduce((total,[kind,pips])=>total+pips*(1+4/(4+production[kind])),0);
}

function roadPlan(match,seat,targets,production){
 const open=owned(match,seat,'settlement')<pieceLimits.settlement
  ?vertices.map((_,id)=>freeSite(match,id)&&!connected(match,id,seat)?siteValue(id,production):0):[];
 const before=longestRoad(match,seat);
 const rivals=Math.max(4,...players.map((_,id)=>id===seat?0:longestRoad(match,id)));
 const budget=Math.min(4,pieceLimits.road-owned(match,seat,'road'));
 return targets.map(edge=>{
  // Walk only through unclaimed edges from this new connection. A rival building ends the route.
  const front=edges[edge].filter(id=>!connected(match,id,seat)&&!match.buildings[id]).map(id=>[id,1]);
  const visited=new Set(edges[edge]);
  let expansion=0;
  for(const [vertex,steps] of front){
   expansion=Math.max(expansion,(open[vertex]||0)/(1+(steps-1)*.65));
   if(steps===budget)continue;
   for(const next of incident[vertex]){
    const dest=otherEnd(next,vertex);
    if(match.roads[next]===undefined&&!visited.has(dest)&&!match.buildings[dest]){
     visited.add(dest);front.push([dest,steps+1]);
    }
   }
  }
  match.roads[edge]=seat;
  const length=longestRoad(match,seat);
  delete match.roads[edge];
  const claims=length>rivals&&match.longest!==seat;
  return {id:edge,value:expansion+(length-before)*1.5+(claims?15:0),winning:claims&&points(match,seat)>=8};
 }).sort((a,b)=>Number(b.winning)-Number(a.winning)||b.value-a.value)[0];
}

function robberChoice(match,seat){
 const score=tile=>tileVertices[tile].reduce((sum,id)=>{
  const piece=match.buildings[id];
  if(!piece)return sum;
  const weight=piece.owner===seat?-3:1+points(match,piece.owner)/5;
  const production=numberWeight(board[tile][3])*(piece.type==='city'?2:1);
  return sum+weight*production+(piece.owner!==seat&&handSize(match.hands[piece.owner]) ? .5 : 0);
 },0);
 return board.map((_,id)=>id).filter(id=>id!==match.robber).sort((a,b)=>score(b)-score(a))[0];
}

function opponentTurn(match,seat){
 if(points(match,seat)>=10){match.winner=seat;return players[seat]+' began the turn with ten victory points.';}
 const dice=roll(match),total=dice[0]+dice[1];
 if(total===7){
  discard(match);
  moveRobber(match,seat,robberChoice(match,seat));
 }else produce(match,total);
 const moves=[];
 let traded=false;
 for(let builds=0;builds<4&&match.winner===null;builds++){
  const production=productionFor(match,seat);
  const options=Object.entries(costs).flatMap(([type,cost])=>{
   const trade=pays(match.hands[seat],cost)?null:!traded&&bankOffer(match,seat,cost,production);
   if(!trade&&!pays(match.hands[seat],cost))return [];
   const targets=catanTargets(match,seat,type);
   if(!targets.length)return [];
   const plan=type==='road'?roadPlan(match,seat,targets,production):{
    id:targets.sort((a,b)=>siteValue(b,production)-siteValue(a,production))[0],winning:points(match,seat)>=9
   };
   const score=type==='road'?plan.value:20+siteValue(plan.id,production)+(type==='settlement'?2:0);
   return [{type,trade,score:score-(trade?trade.rate*3:0),...plan}];
  });
  const plan=options.sort((a,b)=>Number(b.winning)-Number(a.winning)||b.score-a.score)[0];
  if(!plan||(!plan.winning&&plan.type==='road'&&plan.score<1))break;
  const {id,type,trade}=plan;
  if(trade){
   match.hands[seat][trade.give]-=trade.rate;
   match.hands[seat][trade.take]++;
   traded=true;
  }
  place(match,seat,type,id);
  moves.push(buildLabels[type].toLowerCase());
 }
 return players[seat]+' rolled '+total+(moves.length?' and built '+moves.join(', '):' and passed')+'.';
}

export function startCatanMatch(seed){
 const match={seed,turn:1,phase:'roll',hands:players.map(blank),buildings:{},roads:{},longest:null,winner:null,
  robber:numbers.indexOf(null),dice:[],tool:null,trade:null,effect:null,log:[],note:'Roll the dice. All settlements beside the matching terrain collect resources.'};
 const order=[0,1,2,2,1,0];
 for(const [i,seat] of order.entries()){
  const occupiedTiles=new Set(Object.keys(match.buildings).filter(id=>match.buildings[id].owner===seat).flatMap(id=>vertexTiles[id]));
  const candidates=vertices.flatMap((_,id)=>freeSite(match,id)?[id]:[]);
  const rank=id=>vertexValue(id)*2+new Set(vertexTiles[id].map(tile=>board[tile][2])).size*2-vertexTiles[id].filter(tile=>occupiedTiles.has(tile)).length*4;
  const vertex=candidates.sort((a,b)=>rank(b)-rank(a))[0];
  match.buildings[vertex]={owner:seat,type:'settlement'};
  const edge=incident[vertex].find(id=>match.roads[id]===undefined);
  match.roads[edge]=seat;
  if(i>=3)for(const tile of vertexTiles[vertex]){
   const kind=terrainResource[board[tile][2]];
   if(kind)match.hands[seat][kind]++;
  }
 }
 return match;
}

export function restoreCatanMatch(saved){
 if(!saved||saved.winner!==null)return null;
 const {seed,turn,phase,hands,buildings,roads,longest,robber,dice,tool,trade,effect,log,note}=saved;
 const int=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
 const map=(obj,limit,valid)=>obj&&typeof obj==='object'&&!Array.isArray(obj)&&
  Object.entries(obj).every(([id,value])=>String(Number(id))===id&&int(Number(id),0,limit-1)&&valid(value));
 const seat=n=>int(n,0,players.length-1);
 if(!int(seed,0,0xffffffff)||!int(turn,1,Number.MAX_SAFE_INTEGER)||!['roll','robber','build'].includes(phase)||
  !Array.isArray(hands)||hands.length!==players.length||!hands.every(hand=>hand&&resources.every(kind=>int(hand[kind],0,4096)))||
  !map(buildings,vertices.length,piece=>piece&&seat(piece.owner)&&['settlement','city'].includes(piece.type))||
  !map(roads,edges.length,seat)||!(longest===null||seat(longest))||!int(robber,0,board.length-1)||
  !Array.isArray(dice)||dice.length!==(phase==='roll'?0:2)||!dice.every(n=>int(n,1,6))||
  (phase==='robber'&&dice[0]+dice[1]!==7)||
  !(tool===null||(phase==='build'&&Object.hasOwn(costs,tool)))||
  !(trade===null||(phase==='build'&&tool===null&&resources.includes(trade)))||
  !Array.isArray(log)||log.length>2||!log.every(line=>typeof line==='string'&&line.length<=300)||
  typeof note!=='string'||note.length>300)return null;
 const sizes={robber:board.length,road:edges.length,settlement:vertices.length,city:vertices.length};
 let animation=null;
 if(effect?.kind==='dice'||effect?.kind==='trade')animation={kind:effect.kind};
 else if(effect&&Object.hasOwn(sizes,effect.kind)&&int(effect.id,0,sizes[effect.kind]-1))animation={kind:effect.kind,id:effect.id};
 const match={seed,turn,phase,hands:hands.map(hand=>Object.fromEntries(resources.map(kind=>[kind,hand[kind]]))),
  buildings:Object.fromEntries(Object.entries(buildings).map(([id,{owner,type}])=>[id,{owner,type}])),roads:{...roads},
  longest,winner:null,robber,dice:[...dice],tool,trade,effect:animation,log:[...log],note};
 if(players.some((_,id)=>Object.entries(pieceLimits).some(([type,limit])=>owned(match,id,type)>limit)))return null;
 if(tool&&(!pays(match.hands[0],costs[tool])||!catanTargets(match,0,tool).length))return null;
 if(trade&&match.hands[0][trade]<tradeRate(match,0,trade))return null;
 return match;
}

export function moveCatanMatch(match,action){
 if(match.winner!==null)return match;
 const next=structuredClone(match);
 next.effect=null;
 if(action==='roll'&&next.phase==='roll'){
  next.dice=roll(next);
  const total=next.dice[0]+next.dice[1];
  next.effect={kind:'dice'};
  if(total===7){
   discard(next);next.phase='robber';next.note='A seven blocks production. Hands above seven discarded half. Choose a new tile for the robber.';
  }else{
   produce(next,total);next.phase='build';next.note='You rolled '+total+'. Build, trade, or pass to the other players.';
  }
 }else if(action.startsWith('tile-')&&next.phase==='robber'){
  const tile=Number(action.slice(5));
  if(!Number.isInteger(tile)||!board[tile]||tile===next.robber)return match;
  const stolen=moveRobber(next,0,tile);
  next.phase='build';next.effect={kind:'robber',id:tile};
  next.note=stolen?'The robber moved. You stole '+stolen+'.':'The robber moved. That tile stops producing until the robber leaves.';
 }else if(next.phase!=='build')return match;
 else if(action==='pass'){
  next.log=[opponentTurn(next,1)];
  if(next.winner===null)next.log.push(opponentTurn(next,2));
  if(next.winner===null){
   next.turn++;next.phase='roll';next.dice=[];
   if(points(next,0)>=10)next.winner=0;
  }
  next.tool=null;next.trade=null;next.note='Your turn. Roll when you’re ready.';
 }else if(action.startsWith('tool-')){
  const type=action.slice(5);
  if(!Object.hasOwn(costs,type)||!pays(next.hands[0],costs[type])||!catanTargets(next,0,type).length)return match;
  next.tool=next.tool===type?null:type;next.trade=null;
  next.note=next.tool?'Choose a highlighted '+(type==='road'?'edge.':type==='city'?'settlement to upgrade.':'intersection.'):'Choose a move.';
 }else if(action.startsWith('place-')&&next.tool){
  const id=Number(action.slice(6)),type=next.tool;
  if(!pays(next.hands[0],costs[type])||!catanTargets(next,0,type).includes(id))return match;
  place(next,0,type,id);next.tool=null;next.effect={kind:type,id};
  next.note='You built a '+type+'. You have '+points(next,0)+' victory points.';
 }else if(action.startsWith('offer-')){
  const kind=action.slice(6);
  if(!resources.includes(kind)||next.hands[0][kind]<tradeRate(next,0,kind))return match;
  next.trade=next.trade===kind?null:kind;next.tool=null;
  next.note=next.trade?'Choose the resource you want to receive.':'Choose a move.';
 }else if(action.startsWith('take-')&&next.trade){
  const kind=action.slice(5),rate=tradeRate(next,0,next.trade);
  if(!resources.includes(kind)||kind===next.trade||next.hands[0][next.trade]<rate)return match;
  next.hands[0][next.trade]-=rate;next.hands[0][kind]++;next.trade=null;next.effect={kind:'trade'};
  next.note='You received one '+kind+'.';
 }else return match;
 if(next.winner!==null)next.note=players[next.winner]+(next.winner===0?' reached ten victory points and won.':' reached ten victory points and won the table.');
 return next;
}

export function catanMatchView(match,esc){
 const active=match.winner===null,building=active&&match.phase==='build';
 const roads=Object.entries(match.roads).map(([id,seat])=>[...edges[id].map(vertex=>vertices[vertex]),colors[seat],match.effect?.kind==='road'&&match.effect.id===Number(id)]);
 const pieces=Object.entries(match.buildings).map(([id,piece])=>[...vertices[id],piece.type,colors[piece.owner],match.effect?.kind===piece.type&&match.effect.id===Number(id)]);
 const marker=(x,y,id,label,text)=>`<button class="chest-board-hit" style="--x:${x/width*100}%;--y:${y/height*100}%" data-action="game-chest-move" data-id="${id}" aria-label="${label}">${text}</button>`;
 const targets=building&&match.tool?catanTargets(match,0,match.tool):[];
 const buildTargets=targets.map((id,index)=>{
  const [x,y]=match.tool==='road'?edges[id].map(vertex=>vertices[vertex]).reduce(([x,y],[a,b])=>[x+a/2,y+b/2],[0,0]):vertices[id];
  return marker(x,y,'place-'+id,'Build '+match.tool+' at site '+(index+1),index+1);
 }).join('');
 const robberTargets=active&&match.phase==='robber'?board.map(([x,y,kind,n],id)=>id===match.robber?'':marker(x,y,'tile-'+id,'Move robber to '+kind+(n?' '+n:' desert'),n||'•')).join(''):'';
 const scores=players.map((name,seat)=>`<span><i style="--player:${colors[seat]}"></i>${name} <strong>${points(match,seat)} / 10</strong>${match.longest===seat?' · longest road':''}</span>`).join('');
 const buildMoves=Object.keys(costs).filter(type=>pays(match.hands[0],costs[type])&&catanTargets(match,0,type).length)
  .map(type=>['tool-'+type,'Build '+type,match.tool===type]);
 const trade=building?`<details class="chest-trade"${match.trade?' open':''}><summary>Trade with the bank</summary><div class="chest-trade-options">
  ${(match.trade?resources.filter(kind=>kind!==match.trade).map(kind=>['take-'+kind,'Get 1 '+kind]):resources.filter(kind=>match.hands[0][kind]>=tradeRate(match,0,kind)).map(kind=>['offer-'+kind,'Offer '+tradeRate(match,0,kind)+' '+kind]))
   .map(([id,label])=>`<button class="button secondary" data-action="game-chest-move" data-id="${id}">${label}</button>`).join('')||'<small>Collect four of one resource to trade, or two brick at your harbor.</small>'}
  ${match.trade?`<button class="button secondary" data-action="game-chest-move" data-id="offer-${match.trade}">Cancel trade</button>`:''}</div></details>`:'';
 const [harborX,harborY]=vertices[harborVertices[0]];
 return {note:match.note,turn:'Round '+match.turn,moves:!active?[]:match.phase==='roll'?[['roll','Roll two dice']]:building?[...buildMoves,['pass','End turn']]:[],
  extra:trade+`<ul class="chest-match-log">${match.log.map(line=>'<li>'+esc(line)+'</li>').join('')}</ul>`,
  board:`<div class="chest-map chest-catan-match" aria-label="CATAN match board"><div class="chest-match-scores">${scores}</div>
  ${resourceTray(Object.fromEntries(resources.map(kind=>[labels[kind],match.hands[0][kind]])))}
  <div class="chest-board-scroll"><div class="chest-match-island">
   ${terrainArt({board,width,height,roads,pieces,robber:match.robber,harbor:[harborX+5,harborY+28],active:match.dice.length?match.dice[0]+match.dice[1]:null})}
   ${buildTargets}${robberTargets}
   ${match.dice.length?`<div class="chest-match-dice ${match.effect?.kind==='dice'?'match-dice-new':''}" aria-label="Dice rolled ${match.dice.join(' and ')}">${match.dice.map(n=>`<span>${n}</span>`).join('')}</div>`:''}
  </div></div></div>`};
}
