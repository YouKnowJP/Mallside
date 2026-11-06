import {freeRoute,freeMove,closestFloor,walkable,clearWalk} from './free-navigation.js?v=25.0.0';
import {crowdStep} from './ambient-motion.js?v=36.0.0';
import {stepToward} from './motion.js?v=34.0.0';
import {slotForProduct} from './malls.js?v=56.0.0';

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
// A stalled actor must first escape a neighbor's padded planning square along a
// genuinely clear segment. Snapping to closestFloor could route through a body.
function detour(sim,a,neighbors){
 const nav={bounds:sim.layout.nav.bounds,obstacles:[...sim.layout.nav.obstacles,...neighbors.map(b=>({x:b.x-17,y:b.y-17,width:34,height:34}))]};
 if(!walkable(a.target,nav))return null;
 const safe=p=>clearWalk(a,p,sim.layout.nav)&&neighbors.every(b=>{const dx=p.x-a.x,dy=p.y-a.y,k=Math.max(0,Math.min(1,((b.x-a.x)*dx+(b.y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(a.x+dx*k-b.x,a.y+dy*k-b.y)>=24.999;});
 const points=walkable(a,nav)?[{x:a.x,y:a.y}]:[];for(const radius of [36,72])for(let i=0;i<12;i++){const p={x:a.x+Math.cos(i*Math.PI/6)*radius,y:a.y+Math.sin(i*Math.PI/6)*radius};if(walkable(p,nav)&&safe(p))points.push(p);}
 points.sort((p,q)=>Math.hypot(p.x-a.target.x,p.y-a.target.y)-Math.hypot(q.x-a.target.x,q.y-a.target.y));
 for(const p of points){const route=freeRoute(p,a.target,nav);if(route.length&&Math.hypot(route[0].x-p.x,route[0].y-p.y)<.1)return [{x:a.x,y:a.y},...route];}return null;
}
function waitingPoint(sim,a){const f=sim.layout.fitting,right=f.x<500;for(let i=0;i<8;i++){const p={x:right?f.x+f.width+44+i*38:f.x-44-i*38,y:246};if(walkable(p,sim.layout.nav)&&!sim.actors.some(b=>b!==a&&b.waitingRoom&&b.target&&Math.hypot(p.x-b.target.x,p.y-b.target.y)<32))return p;}return sim.layout.services.fitting;}
function begin(sim,a,stage){
 if(a.room!==null){sim.rooms[a.room]=null;a.room=null;}
 if(sim.register===a.id)sim.register=null;
 sim.queue=sim.queue.filter(id=>id!==a.id);
 a.stage=stage;a.time=0;a.moving=false;a.waitingRoom=false;
 if(stage==='browse'||stage==='compare'){target(sim,a,browseTarget(sim,a,a.id+a.visits*2+(stage==='compare'?3:0)));}
 else if(stage==='try'){
  if(!sim.wearable){a.stage='demo';target(sim,a,browseTarget(sim,a,a.id+2));return;}
  const room=sim.rooms.findIndex(id=>id===null);if(room>=0){a.room=room;sim.rooms[room]=a.id;target(sim,a,sim.layout.fittingRooms[room]);}
  else{a.waitingRoom=true;target(sim,a,waitingPoint(sim,a));}
 }
 else if(stage==='queue'){if(sim.queue.length>=sim.layout.queue.length){begin(sim,a,'compare');return;}sim.queue.push(a.id);a.queueIndex=sim.queue.length-1;target(sim,a,sim.layout.queue[a.queueIndex]);}
 else if(stage==='pay'){if(sim.register!==null){begin(sim,a,'queue');return;}sim.register=a.id;target(sim,a,sim.layout.services.checkout);}
 else if(stage==='leave'){if(a.bag)a.hasItem=false;target(sim,a,sim.layout.exit);}
 else if(stage==='arrive'){a.hasItem=false;a.bag=false;a.visible=false;a.route=[];a.phase='act';a.target={...sim.layout.spawn};}
}
export function updateStoreCustomers(sim,seconds,{paused=false,reducedMotion=false,player=null,staff=[]}={}){
 if(paused||reducedMotion)return;
 const dt=Math.max(0,Math.min(.05,seconds));sim.clock+=dt;
 for(const a of sim.actors){
  a.visible=a.stage!=='arrive';a.moving=false;
  if(a.stage==='try'&&a.waitingRoom){const room=sim.rooms.findIndex(id=>id===null);if(room>=0){a.waitingRoom=false;a.room=room;sim.rooms[room]=a.id;target(sim,a,sim.layout.fittingRooms[room]);}}
  if(a.stage==='queue'){
   const index=sim.queue.indexOf(a.id);
   if(index===0&&sim.register===null&&!a.route.length){begin(sim,a,'pay');}
   else if(index!==a.queueIndex&&index>=0){a.queueIndex=index;target(sim,a,sim.layout.queue[index]);}
  }
  if(a.route.length){
   const next=stepToward(a,a.route[0],a.speed,dt),dist=player?Math.hypot(next.x-player.x,next.y-player.y):Infinity,old=player?Math.hypot(a.x-player.x,a.y-player.y):Infinity;
   if(dist<25&&dist<old){a.yielding=true;continue;}a.yielding=false;
   const neighbors=[...sim.actors.filter(b=>b.visible!==false&&b!==a),...staff,...player?[player]:[]],p=crowdStep(a,freeMove(a,next,sim.layout.nav),neighbors,-1,sim.layout.nav),dx=p.x-a.x,dy=p.y-a.y;a.moving=Math.hypot(dx,dy)>.001;if(a.moving)a.rotation=Math.atan2(dx,dy);const remaining=Math.hypot(a.route[0].x-p.x,a.route[0].y-p.y);if(a.progressPoint!==a.route[0]){a.progressPoint=a.route[0];a.bestRemaining=Infinity;}if(remaining<a.bestRemaining-.1){a.bestRemaining=remaining;a.stalled=0;}else a.stalled=(a.stalled||0)+dt;a.x=p.x;a.y=p.y;if(a.stalled>.8&&sim.clock>=(a.replanAt||0)){const route=detour(sim,a,neighbors);if(route)a.route=route;a.stalled=0;a.replanAt=sim.clock+1;continue;}
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
  else if(a.stage==='arrive'&&a.time>=2.5&&!sim.actors.some(b=>b!==a&&b.visible!==false&&Math.hypot(b.x-sim.layout.spawn.x,b.y-sim.layout.spawn.y)<30)){a.x=sim.layout.spawn.x;a.y=sim.layout.spawn.y;a.visits++;a.visible=true;begin(sim,a,'browse');}
 }
}
export function customerActivity(a){return a.yielding?'Making room':a.stage==='try'?a.waitingRoom?'Waiting for a room':a.phase==='walk'?'To the fitting room':'Trying on':a.stage==='demo'?'Testing an item':a.stage==='queue'?'Waiting to pay':a.stage==='pay'?a.phase==='walk'?'To the register':'Paying':a.stage==='leave'?'Purchase in hand':a.stage==='arrive'?'Entering':'Browsing';}
