import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as E from '../dist/engine.js';
import {checkRequest,associateTrip,returnAssociateTrip,updateAssociateTrip,requestStatus} from '../dist/associate-service.js';
import {displayCard} from '../dist/retail-details.js';
import {interiorPlan} from '../dist/shop-interiors.js';
import {walkable,clearWalk} from '../dist/free-navigation.js';
import {createStoreCustomers,updateStoreCustomers} from '../dist/store-customers.js';
import {validatePickup} from '../dist/shopping-selection.js';
import {interiorSamples} from './interior-fixtures.mjs';
const state=()=>Object.assign(E.createState(),{sandbox:true,cash:7500000});
test('associate checks preserve exact product/size, account for unpaid picks and never change the save or reserve stock',()=>{
 const s=state(),st=E.storeById('nike'),p=st.products[0],size=p.sizes[0],before=JSON.stringify(s),qty=E.stock(s,p.id,size),bags={[st.id]:[{id:p.id,size}]};
 const q=checkRequest(s,st.id,bags,p.id,size);assert.equal(q.product,p);assert.equal(q.available,Math.max(0,qty-1));assert.equal(q.size,size);assert.equal(JSON.stringify(s),before);assert.equal(E.stock(s,p.id,size),qty);
 bags[st.id]=Array.from({length:8},()=>({id:p.id,size}));assert.equal(checkRequest(s,st.id,bags,p.id,size).available,0,'a full bag can still ask for information');
 assert.throws(()=>checkRequest(s,'apple',{},p.id,size),/this shop/);assert.throws(()=>checkRequest(s,st.id,{},p.id,'invented'),/listed sizes/);s.minutes=E.CLOSE;assert.throws(()=>checkRequest(s,st.id,{},p.id,size),/closed/);
});
test('every distinct stocked layout gives associates a clear round trip to each actual visible display',()=>{
 for(const {st,l}of interiorSamples().filter(x=>x.st.count)){const p=st.products[0],q=checkRequest(state(),st.id,{},p.id,p.sizes[0]);for(let displayIndex=0;displayIndex<Math.min(6,st.count);displayIndex++){const trip=associateTrip(l,q,{displayIndex}),r=l.displays[displayIndex];assert.deepEqual(trip.displayPoint,{x:r.x+r.width/2,y:r.y+r.height+20});assert.ok(Math.hypot(trip.stop.x-trip.displayPoint.x,trip.stop.y-trip.displayPoint.y)>=31.99);for(const route of [trip.route,trip.back]){assert.ok(route.length>=2,st.id);for(let i=0;i<route.length;i++){assert.ok(walkable(route[i],l.nav),st.id);if(i)assert.ok(clearWalk(route[i-1],route[i],l.nav),st.id);}}}}
});
test('associate checks walk continuously, inspect, return and stop, with real elapsed time and no transaction',()=>{
 const s=state(),st=E.storeById('nike'),p=st.products[0],l=interiorPlan(st,E.FLOORPLANS.orange),q=checkRequest(s,st.id,{},p.id,p.sizes[0]),trip=associateTrip(l,q),seen=new Set(),before=JSON.stringify(s);
 for(let frame=0;frame<2000&&trip.stage!=='ready';frame++){const old={x:trip.x,y:trip.y};updateAssociateTrip(trip,.05);seen.add(trip.stage);assert.ok(Math.hypot(trip.x-old.x,trip.y-old.y)<=5.001);assert.ok(walkable(trip,l.nav));}
 for(const stage of ['walking','checking','returning','ready'])assert.ok(seen.has(stage),stage);assert.equal(trip.x,trip.home.x);assert.equal(trip.y,trip.home.y);assert.equal(JSON.stringify(s),before);assert.match(requestStatus(trip,'Sam'),/Sam is ready/);const done=JSON.stringify(trip);updateAssociateTrip(trip,2);assert.equal(JSON.stringify(trip),done);
});
test('paused checks freeze, reduced motion provides a stationary equivalent, and pickup still validates current stock',()=>{
 const s=state(),st=E.storeById('nike'),p=st.products[0],size=p.sizes[0],trip=associateTrip(interiorPlan(st,E.FLOORPLANS.orange),checkRequest(s,st.id,{},p.id,size)),before=JSON.stringify(trip);updateAssociateTrip(trip,.05,{paused:true,reducedMotion:true});assert.equal(JSON.stringify(trip),before);updateAssociateTrip(trip,.05,{reducedMotion:true});assert.equal(trip.stage,'ready');assert.equal(trip.distance,0);assert.equal(trip.x,trip.home.x);
 const bags={[st.id]:Array.from({length:E.stock(s,p.id,size)},()=>({id:p.id,size}))};assert.throws(()=>validatePickup(s,st.id,bags,p.id,size),/all the game stock|hands are full/);assert.equal(checkRequest(s,st.id,bags,p.id,size).available,0);
});
test('an associate completes a full check beside a player already standing at the located product',()=>{const st=E.storeById('nike'),p=st.products[7],l=interiorPlan(st,E.FLOORPLANS.orange),q=associateTrip(l,checkRequest(state(),st.id,{},p.id,p.sizes[0]),{displayIndex:1}),player={...q.displayPoint},sim=createStoreCustomers(l,st.products,8,{reservedRoom:0});for(let i=0;i<2400&&q.stage!=='ready';i++){updateStoreCustomers(sim,.05,{player,staff:[q]});const before={x:q.x,y:q.y};updateAssociateTrip(q,.05,{nav:l.nav,neighbors:[player,...sim.actors.filter(a=>a.visible!==false)]});assert.ok(Math.hypot(q.x-player.x,q.y-player.y)>=24.99);assert.ok(Math.hypot(q.x-before.x,q.y-before.y)<=5.001);}assert.equal(q.stage,'ready','the product approach belongs to the player, so help must stop beside it');});
test('cancelled associate checks return from the current position without a visual jump',()=>{const st=E.storeById('nike'),p=st.products[0],l=interiorPlan(st,E.FLOORPLANS.orange),q=associateTrip(l,checkRequest(state(),st.id,{},p.id,p.sizes[0]));for(let i=0;i<70;i++)updateAssociateTrip(q,.05);const back=returnAssociateTrip(q,l);assert.equal(back.x,q.x);assert.equal(back.y,q.y);assert.equal(back.distance,q.distance);for(let i=0;i<1500&&back.stage!=='ready';i++){const old={x:back.x,y:back.y};updateAssociateTrip(back,.05);assert.ok(Math.hypot(back.x-old.x,back.y-old.y)<=5.001);}assert.equal(back.stage,'ready');assert.equal(back.x,back.home.x);assert.equal(back.y,back.home.y);});
test('shopper spacing preserves personal space and forward progress through fitting, queues and payment',()=>{
 for(const id of ['nike','apple','ross','target','lego']){const st=E.storeById(id),l=interiorPlan(st,E.FLOORPLANS.orange),sim=createStoreCustomers(l,st.products,8,{reservedRoom:0});for(let frame=0;frame<7500;frame++){updateStoreCustomers(sim,.05);for(const a of sim.actors)for(const b of sim.actors)if(a.id<b.id&&a.visible!==false&&b.visible!==false)assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>=24.99,id+' '+a.id+'/'+b.id);}assert.ok(sim.actors.every(a=>a.purchases>0),id+' every shopper completes a payment');assert.ok(sim.purchases>=12,id+' repeated completed cycles');}
});
test('physical display cards use the exact catalog identity and existing game price without inventing merchandise',()=>{
 const s=state();for(const st of E.STORES.filter(s=>s.count).slice(0,25))for(const [i,p]of st.products.slice(0,6).entries()){const card=displayCard(s,p,i);assert.equal(card.name,p.name);assert.equal(card.price,E.money(E.price(s,p)));assert.equal(card.number,String(i+1).padStart(2,'0'));assert.match(card.note,/Game price/);}
});
test('v58 retains all complete published catalog records, shop identities and save/economy versions',()=>{
 const prior=JSON.parse(readFileSync(new URL('../docs/research-v57/compatibility.json',import.meta.url))),hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');assert.equal(E.PRODUCTS.filter(p=>![60,61,62].includes(p.collectionReference)).length,prior.productCount);assert.equal(hash(E.PRODUCTS.filter(p=>![60,61,62].includes(p.collectionReference))),prior.productRecordsSHA256);assert.equal(hash(E.STORES.map(s=>s.id)),prior.shopIdsSHA256);const s=state(),loaded=E.validateImport(JSON.stringify(s));assert.equal(loaded.version,prior.saveSchema);assert.equal(loaded.mapRevision,prior.mapRevision);assert.equal(loaded.cash,s.cash);
});
