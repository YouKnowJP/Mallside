import {freeRoute,freeMove,closestFloor} from './free-navigation.js?v=25.0.0';
import {stepToward} from './motion.js?v=34.0.0';
import {slotForProduct} from './malls.js?v=23.0.0';

const initial=['browse','try','queue','pay','compare','try','browse','leave'];
export function createStoreCustomers(layout,products,count=8,{reservedRoom=null}={}){
 const own=products.filter(p=>p.store===layout.store.id),sim={layout,actors:[],queue:[],rooms:[null,null],register:null,clock:0,purchases:0};
 if(!own.length)return sim;
 if(reservedRoom!==null)sim.rooms[reservedRoom]='player';
 sim.products=own;sim.tryProducts=own.filter(p=>slotForProduct(p));sim.wearable=!!sim.tryProducts.length;
 sim.browse=[...layout.displays.slice(0,Math.min(6,own.length)).map(r=>({x:r.x+r.width/2,y:r.y+r.height+20})),...layout.stockFixtures.map(r=>r.approach)];
 for(let i=0;i<Math.min(8,Math.max(0,count));i++){
  const choice=sim.wearable?sim.tryProducts:own,actor={id:i,x:layout.spawn.x,y:layout.spawn.y,stage:'browse',phase:'act',route:[],time:0,visits:0,purchases:0,room:null,bag:false,product:choice[i*3%choice.length],speed:60+i%3*5,rotation:0,moving:false};
  sim.actors.push(actor);begin(sim,actor,initial[i]);
  // A newly entered store is already busy. Later transitions always follow a physical route.
  actor.x=actor.target.x;actor.y=actor.target.y;actor.route=[];actor.phase=['queue'].includes(actor.stage)?'wait':'act';actor.time=i*.3;actor.bag=actor.stage==='leave';actor.hasItem=!['arrive','leave'].includes(actor.stage);
 }
 return sim;
}
function target(sim,a,p){const q=closestFloor(p,sim.layout.nav);a.target=q;a.route=freeRoute(a,q,sim.layout.nav);a.phase=a.route.length?'walk':'act';a.time=0;}
function browseTarget(sim,a,start){for(let i=0;i<sim.browse.length;i++){const p=sim.browse[(start+i)%sim.browse.length];if(!sim.actors.some(b=>b!==a&&['browse','compare','demo'].includes(b.stage)&&b.target&&Math.hypot(p.x-b.target.x,p.y-b.target.y)<30))return p;}return sim.browse[start%sim.browse.length];}
function begin(sim,a,stage){
 if(a.room!==null){sim.rooms[a.room]=null;a.room=null;}
 if(sim.register===a.id)sim.register=null;
 sim.queue=sim.queue.filter(id=>id!==a.id);
 a.stage=stage;a.time=0;a.moving=false;a.waitingRoom=false;
 if(stage==='browse'||stage==='compare'){target(sim,a,browseTarget(sim,a,a.id+a.visits*2+(stage==='compare'?3:0)));}
 else if(stage==='try'){
  if(!sim.wearable){a.stage='demo';target(sim,a,browseTarget(sim,a,a.id+2));return;}
  const room=sim.rooms.findIndex(id=>id===null);if(room>=0){a.room=room;sim.rooms[room]=a.id;target(sim,a,sim.layout.fittingRooms[room]);}
  else{const waiting=sim.layout.fittingRooms.find(r=>sim.rooms[r.id]!=='player')||sim.layout.fittingRooms[0];target(sim,a,waiting.wait);a.waitingRoom=true;}
 }
 else if(stage==='queue'){if(sim.queue.length>=sim.layout.queue.length){begin(sim,a,'compare');return;}sim.queue.push(a.id);a.queueIndex=sim.queue.length-1;target(sim,a,sim.layout.queue[a.queueIndex]);}
 else if(stage==='pay'){if(sim.register!==null){begin(sim,a,'queue');return;}sim.register=a.id;target(sim,a,sim.layout.services.checkout);}
 else if(stage==='leave'){if(a.bag)a.hasItem=false;target(sim,a,sim.layout.exit);}
 else if(stage==='arrive'){a.hasItem=false;a.bag=false;a.visible=false;a.route=[];a.phase='act';a.target={...sim.layout.spawn};}
}
export function updateStoreCustomers(sim,seconds,{paused=false,reducedMotion=false,player=null}={}){
 if(paused||reducedMotion)return;
 const dt=Math.max(0,Math.min(.05,seconds));sim.clock+=dt;
 for(const a of sim.actors){
  a.visible=a.stage!=='arrive';a.moving=false;
  if(a.stage==='try'&&a.waitingRoom){const room=sim.rooms.findIndex(id=>id===null);if(room>=0){a.waitingRoom=false;a.room=room;sim.rooms[room]=a.id;target(sim,a,sim.layout.fittingRooms[room]);}}
  if(a.stage==='queue'){
   const index=sim.queue.indexOf(a.id);
   if(index===0&&sim.register===null){begin(sim,a,'pay');}
   else if(index!==a.queueIndex&&index>=0){a.queueIndex=index;target(sim,a,sim.layout.queue[index]);}
  }
  if(a.route.length){
   const next=stepToward(a,a.route[0],a.speed,dt),dist=player?Math.hypot(next.x-player.x,next.y-player.y):Infinity,old=player?Math.hypot(a.x-player.x,a.y-player.y):Infinity;
   if(dist<25&&dist<old){a.yielding=true;continue;}a.yielding=false;
   const p=freeMove(a,next,sim.layout.nav),dx=p.x-a.x,dy=p.y-a.y;a.moving=Math.hypot(dx,dy)>.001;if(a.moving)a.rotation=Math.atan2(dx,dy);a.x=p.x;a.y=p.y;
   if(next.arrived&&Math.hypot(a.x-next.x,a.y-next.y)<.1){a.route.shift();if(!a.route.length){a.phase=a.stage==='queue'?'wait':'act';a.time=0;}}
   continue;
  }
  if(a.stage==='try'&&a.waitingRoom||a.stage==='queue')continue;
  if(a.stage==='browse'&&a.phase==='act')a.hasItem=true;
  if(a.bag)a.hasItem=false;
  a.time+=dt;
  if(a.stage==='browse'&&a.time>=6+a.id%4)begin(sim,a,'compare');
  else if(a.stage==='compare'&&a.time>=4+a.id%3)begin(sim,a,'try');
  else if((a.stage==='try'||a.stage==='demo')&&a.time>=7)begin(sim,a,'queue');
  else if(a.stage==='pay'&&a.time>=5){a.bag=true;a.purchases++;sim.purchases++;begin(sim,a,'leave');}
  else if(a.stage==='leave'&&a.time>=1.2){begin(sim,a,'arrive');}
  else if(a.stage==='arrive'&&a.time>=2.5){a.x=sim.layout.spawn.x;a.y=sim.layout.spawn.y;a.visits++;a.visible=true;begin(sim,a,'browse');}
 }
}
export function customerActivity(a){return a.yielding?'Making room':a.stage==='try'?a.waitingRoom?'Waiting for a room':a.phase==='walk'?'To the fitting room':'Trying on':a.stage==='demo'?'Testing an item':a.stage==='queue'?'Waiting to pay':a.stage==='pay'?a.phase==='walk'?'To the register':'Paying':a.stage==='leave'?'Purchase in hand':a.stage==='arrive'?'Entering':'Browsing';}
