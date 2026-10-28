import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import * as E from '../dist/engine.js';
import {createMerchandise,physicalProduct,merchandiseStyle} from '../dist/merchandise-3d.js';
import {validatePickup,putBackSelection,carriedSelections} from '../dist/shopping-selection.js';
import {createStoreCustomers,updateStoreCustomers} from '../dist/store-customers.js';
import {interiorPlan} from '../dist/shop-interiors.js';
import {MallWorld3D} from '../dist/world-3d.js';

test('clothing and bag families are actual solid meshes with collars, straps or construction details, never image planes',()=>{
 const samples=new Map();for(const p of E.PRODUCTS)if(physicalProduct(p)&&!samples.has(merchandiseStyle(p)))samples.set(merchandiseStyle(p),p);
 assert.ok(samples.size>=10);
 for(const [style,p]of samples){const g=createMerchandise(p,{hanger:true}),size=new T.Box3().setFromObject(g).getSize(new T.Vector3());assert.ok(size.x>5&&size.y>5&&size.z>3,style);assert.equal(g.userData.productId,p.id);assert.equal(g.userData.source,p.source);let meshes=0;g.traverse(o=>{assert.ok(!o.isSprite);if(o.isMesh){meshes++;assert.ok(!['PlaneGeometry'].includes(o.geometry.type));for(const m of Array.isArray(o.material)?o.material:[o.material])assert.ok(!m.map||m.map.isTexture);assert.ok(o.geometry.attributes.position.array.every(Number.isFinite));}});assert.ok(meshes>=4,style);g.traverse(o=>{o.geometry?.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m?.dispose();});}
});
test('documented real model names receive different bag silhouettes',()=>{
 const checks=[['Round Mini Shoulder Bag','crescent'],['Neverfull MM','tote'],['Speedy Bandoulière 25','duffel'],['Classic Flap','flap'],['Birkin 25','satchel']];
 for(const [name,style]of checks)assert.equal(merchandiseStyle({name,type:'bag'}),style);
 assert.equal(merchandiseStyle({name:'City backpack',type:'backpack'}),'backpack');
});
test('pickup and put-back preserve money and stock, validate size/store/capacity, and reload the exact unpaid selection',()=>{
 const s=E.createState();s.sandbox=true;s.cash=100000000;const p=E.PRODUCTS.find(p=>p.store==='uniqlo'&&p.type==='shirt'),size=E.idealSize(s,p),bags={},before=JSON.stringify(s),qty=E.stock(s,p.id,size);
 const entry=validatePickup(s,p.store,bags,p.id,size);assert.equal(JSON.stringify(s),before);bags[p.store]=[entry];E.rememberBags(s,bags);const loaded=E.loadState(JSON.stringify(s));assert.deepEqual(carriedSelections(loaded).map(i=>[i.id,i.size]),[[p.id,size]]);assert.equal(s.cash,100000000);assert.equal(E.stock(s,p.id,size),qty);
 for(const [store,sz]of [['nike',size],[p.store,'invalid']]){const unchanged=JSON.stringify(bags);assert.throws(()=>validatePickup(s,store,bags,p.id,sz));assert.equal(JSON.stringify(bags),unchanged);}
 assert.deepEqual(putBackSelection(bags,p.store,0),entry);assert.equal(bags[p.store].length,0);assert.equal(E.stock(s,p.id,size),qty);assert.equal(s.purchases.length,0);assert.throws(()=>putBackSelection(bags,p.store,0));
 const full={fake:Array.from({length:8},()=>entry)};assert.throws(()=>validatePickup(s,p.store,full,p.id,size),/hands are full/);
});
test('held clothing can be fitted, paid for exactly once, and returned with original tags and tax intact',()=>{
 const s=E.createState();s.sandbox=true;s.cash=100000000;const p=E.PRODUCTS.find(p=>p.store==='uniqlo'&&p.type==='shirt'&&!p.finalSale),size=E.idealSize(s,p),bags={[p.store]:[]},initial=s.cash,qty=E.stock(s,p.id,size);
 bags[p.store].push(validatePickup(s,p.store,bags,p.id,size));E.rememberBags(s,bags);E.fit(s,p.id,size);assert.equal(s.cash,initial);assert.equal(E.stock(s,p.id,size),qty);assert.equal(s.purchases.length,0);
 const receipt=E.checkout(s,p.store,bags[p.store]);bags[p.store]=[];E.rememberBags(s,bags);assert.equal(carriedSelections(s).length,0);const item=s.purchases.at(-1);assert.ok(item.tags&&!item.worn);assert.equal(initial-s.cash,receipt.total);assert.equal(E.returnItem(s,item.id,p.store),receipt.total);assert.equal(s.cash,initial);assert.throws(()=>E.returnItem(s,item.id,p.store));
});
test('the player cubicle is reserved while ambient shoppers use the other room',()=>{
 const st=E.STORES.find(s=>s.id==='uniqlo'),layout=interiorPlan(st,E.FLOORPLANS.orange),sim=createStoreCustomers(layout,E.PRODUCTS,8,{reservedRoom:0});for(let i=0;i<3000;i++){updateStoreCustomers(sim,.05);assert.equal(sim.rooms[0],'player');assert.ok(sim.actors.every(a=>a.room!==0));}
 let called=0;const w={layout,avatar:{...layout.spawn},navigate(point,action){this.target={point,action};},hint(){}};MallWorld3D.prototype.startFitting.call(w,st.products[0],()=>called++);assert.deepEqual(w.target.point,{x:layout.fittingRooms[0].x,y:layout.fittingRooms[0].y});assert.equal(w.playerFittingRoom,0);MallWorld3D.prototype.finishFitting.call(w);assert.equal(called,1);assert.deepEqual(w.avatar,layout.services.fitting);
});
test('a fitting preview stays open for inspection and supports turning until the player finishes',()=>{
 let finished=0;const w={action:{kind:'try',hold:true,startTime:performance.now()-10000},state:{preferences:{reducedMotion:false}},player:{rotation:{y:0},userData:{limbs:[]}},finishAnimation(){finished++;}};
 MallWorld3D.prototype.animatePose.call(w);assert.equal(finished,0);const initial=w.player.rotation.y;MallWorld3D.prototype.turnFitting.call(w);MallWorld3D.prototype.animatePose.call(w);assert.ok(w.player.rotation.y>initial);assert.equal(finished,0);w.action.hold=false;MallWorld3D.prototype.animatePose.call(w);assert.equal(finished,1);
});
