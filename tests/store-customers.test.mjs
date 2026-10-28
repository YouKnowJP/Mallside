import {test} from 'node:test';
import assert from 'node:assert/strict';
import {STORES,PRODUCTS,FLOORPLANS,createState} from '../dist/engine.js';
import {interiorPlan} from '../dist/shop-interiors.js';
import {walkable,freeRoute,clearWalk} from '../dist/free-navigation.js';
import {createStoreCustomers,updateStoreCustomers} from '../dist/store-customers.js';
import {interiorSamples} from './interior-fixtures.mjs';

test('stocked wall bays and fitting cubicles remain reachable in every different shop layout',()=>{
 for(const {st,l}of interiorSamples()){
  if(st.count)assert.ok(l.stockFixtures.length>=6,st.id);
  for(const p of [...l.stockFixtures.map(r=>r.approach),...l.fittingRooms,...l.queue]){
   assert.ok(walkable(p,l.nav),st.id+' '+JSON.stringify(p));const route=freeRoute(l.spawn,p,l.nav);assert.ok(route.length>=2,st.id);for(let i=1;i<route.length;i++)assert.ok(clearWalk(route[i-1],route[i],l.nav),st.id);
  }
 }
});
test('customers complete physical browsing, fitting, payment and exit cycles without touching player money or stock',()=>{
 const st=STORES.find(s=>s.id==='nike'),l=interiorPlan(st,FLOORPLANS.orange),state=createState(),before=JSON.stringify(state),products=JSON.stringify(st.products),sim=createStoreCustomers(l,PRODUCTS,8),seen=new Set();
 for(let frame=0;frame<7000;frame++){
  updateStoreCustomers(sim,.05);
  const roomOwners=sim.rooms.filter(id=>id!==null);assert.equal(new Set(roomOwners).size,roomOwners.length);assert.equal(sim.actors.filter(a=>a.stage==='pay').length,sim.register===null?0:1);
  assert.equal(new Set(sim.queue).size,sim.queue.length);assert.ok(sim.queue.length<=l.queue.length);
  for(const a of sim.actors){seen.add(a.stage);assert.equal(a.product.store,st.id);assert.ok(walkable(a,l.nav),a.id+' '+a.stage);if(a.bag)assert.ok(['leave','arrive'].includes(a.stage));}
 }
 assert.ok(sim.purchases>=8,sim.purchases+' completed purchases');assert.ok(sim.actors.every(a=>a.purchases>0));for(const stage of ['browse','compare','try','queue','pay','leave','arrive'])assert.ok(seen.has(stage),stage);
 assert.equal(JSON.stringify(state),before);assert.equal(JSON.stringify(st.products),products);
});
test('technology customers use demos, pending inventories have no fake buyers, and crowd limits are honored',()=>{
 const st=STORES.find(s=>s.id==='apple'),sim=createStoreCustomers(interiorPlan(st,FLOORPLANS.orange),PRODUCTS,5),seen=new Set();
 assert.equal(sim.actors.length,5);for(let i=0;i<2500;i++){updateStoreCustomers(sim,.05);sim.actors.forEach(a=>seen.add(a.stage));}assert.ok(seen.has('demo'));assert.ok(!seen.has('try'));
 const desktop=createStoreCustomers(interiorPlan(st,FLOORPLANS.orange),PRODUCTS,8);for(const a of desktop.actors)for(const b of desktop.actors)if(a.id<b.id)assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>=25,'customers start at separate displays');
 const pending=STORES.find(s=>!s.count);assert.equal(createStoreCustomers(interiorPlan(pending,FLOORPLANS.orange),PRODUCTS,8).actors.length,0);
 assert.equal(createStoreCustomers(interiorPlan(st,FLOORPLANS.orange),PRODUCTS,0).actors.length,0);
});
test('paused and reduced-motion customers freeze, and a walking customer yields to the player',()=>{
 const st=STORES.find(s=>s.id==='nike'),sim=createStoreCustomers(interiorPlan(st,FLOORPLANS.orange),PRODUCTS,8),before=JSON.stringify(sim.actors);
 updateStoreCustomers(sim,.05,{paused:true});updateStoreCustomers(sim,.05,{reducedMotion:true});assert.equal(JSON.stringify(sim.actors),before);
 for(let i=0;i<180;i++)updateStoreCustomers(sim,.05);const a=sim.actors.find(a=>a.route.length>1);assert.ok(a);const next=a.route[0],dx=next.x-a.x,dy=next.y-a.y,d=Math.hypot(dx,dy);const player={x:a.x+dx/d*20,y:a.y+dy/d*20},old={x:a.x,y:a.y};updateStoreCustomers(sim,.05,{player});assert.deepEqual({x:a.x,y:a.y},old);assert.equal(a.yielding,true);
});
