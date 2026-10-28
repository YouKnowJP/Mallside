import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import {CENTER_DIRECTORIES} from '../dist/full-center-data.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
import {MallWorld} from '../dist/world.js';
import {mallLayouts} from './campus-assertions.mjs';
import {walkable} from '../dist/free-navigation.js';
const rich=mallId=>Object.assign(E.createState(),{sandbox:true,cash:1000000000,mallId:mallId||'orange'});

test('every source storefront has a playable shop or service interior with a reachable entrance',()=>{
 let count=0;for(const mall of E.MALLS){const layouts=mallLayouts(mall),physical=new Map(layouts.flatMap((l,floor)=>[...l.rects,...l.units].map(r=>[r.key,{r,l,floor}])));for(const tenant of CENTER_DIRECTORIES[mall.id].tenants){const found=physical.get(tenant.key);assert.ok(found,mall.id+' '+tenant.name);const st=E.storeById(found.r.id);assert.ok(st,found.r.id);assert.ok(walkable(found.r.door,found.l.nav));assert.ok(mall.sections.some(d=>d.stores.includes(st.id)));if(E.isServiceStore(st))assert.ok(E.serviceMenu(st).length>=2);else assert.ok(st.products.length>0||st.catalogStatus==='pending',st.name);count++;}}
 assert.equal(count,1598);
});
test('every added retail branch supports browse, fitting or demo, checkout, eligible refund and save reload',()=>{
 for(const st of E.STORES.filter(st=>st.branch&&st.catalogStatus==='verified')){const s=rich(st.mallId),p=st.products[0],size=E.idealSize(s,p),cash=s.cash;E.visit(s,st.id);E.inspect(s,p.id);if(E.canTry(p))assert.ok(E.fit(s,p.id,size).fits);else E.demo(s,p.id);const order=E.checkout(s,st.id,[{id:p.id,size}]),item=s.purchases.at(-1);assert.equal(order.total,item.total);assert.equal(item.store,st.id);assert.equal(s.cash,cash-item.total);const copy=E.validateImport(JSON.stringify(s));assert.equal(copy.purchases[0].productId,p.id);assert.equal(copy.cash,s.cash);if(p.finalSale){const before=structuredClone(s);assert.throws(()=>E.returnItem(s,item.id,st.id));assert.deepEqual(s,before);}else{E.returnItem(s,item.id,st.id);assert.equal(s.cash,cash);assert.equal(s.metrics.returns,1);}assert.ok(PRODUCT_PHOTOS[p.id]);}
});
test('branch receipts and unpaid bags cannot be checked out or returned at another branch of the same brand',()=>{
 const first=E.STORES.find(s=>s.branch&&!E.isServiceStore(s)&&s.products.some(p=>!p.finalSale)),p=first.products.find(p=>!p.finalSale),other=E.STORES.find(s=>s.id!==first.id&&s.name===first.name);assert.ok(other);const s=rich(first.mallId),cart=[{id:p.id,size:p.sizes[0]}],before=structuredClone(s);assert.throws(()=>E.checkout(s,other.id,cart),/own checkout/);assert.deepEqual(s,before);E.checkout(s,first.id,cart);const item=s.purchases.at(-1),paid=structuredClone(s);assert.throws(()=>E.returnItem(s,item.id,other.id),/Return this/);assert.deepEqual(s,paid);E.returnItem(s,item.id,first.id);assert.equal(s.cash,before.cash);
});
test('directory travel resolves former reference units as store entries on their actual floor',()=>{
 const state=rich('southcoast'),layouts=mallLayouts(E.mallById(state.mallId)),unit=layouts[0].units.find(u=>u.name==='Anthropologie'),w={state,layout:layouts[0],travelTo(point,action,floor){this.last={point,action,floor};}};assert.ok(unit);MallWorld.prototype.goToCenterUnit.call(w,unit.id);assert.deepEqual(w.last.action,{store:unit.id});assert.equal(w.last.floor,0);assert.equal(E.storeById(unit.id).name,'Anthropologie');
});
test('all branch listings keep the actual manufacturer identity and a source-matched photograph',()=>{
 for(const p of E.PRODUCTS){assert.ok(PRODUCT_PHOTOS[p.id],p.id);assert.ok(Number.isSafeInteger(p.price)&&p.price>0,p.id);assert.equal(new URL(p.source).protocol,'https:');assert.notEqual(p.assortmentBasis,'guest-capsule');assert.ok(p.associationEvidence?.source,p.id);}
});
test('prepared food is final sale and consumption recovers needs exactly once, including after reload',()=>{
 const p=E.PRODUCTS.find(p=>p.type==='food'),s=rich(E.storeById(p.store).mallId);s.hunger=20;s.energy=30;E.checkout(s,p.store,[{id:p.id,size:p.sizes[0]}]);const item=s.purchases.at(-1);assert.equal(E.returnEligibility(s,item).ok,false);E.useProduct(s,item.id);assert.ok(s.hunger>35);assert.equal(s.metrics.meals,1);const before=structuredClone(s);E.useProduct(s,item.id);assert.deepEqual(s,before);const copy=E.validateImport(JSON.stringify(s));E.useProduct(copy,item.id);assert.equal(copy.hunger,before.hunger);assert.equal(copy.metrics.meals,1);
});
test('every service branch supports an atomic booking, full unused refund and a once-only activity',()=>{
 for(const st of E.STORES.filter(E.isServiceStore)){const s=rich(st.mallId),offer=E.serviceMenu(st)[0],cash=s.cash,b=E.bookStoreService(s,st.id,offer.id);assert.equal(s.cash,cash-offer.price);E.refundStoreService(s,b.id,st.id);assert.equal(s.cash,cash);const refunded=structuredClone(s);assert.throws(()=>E.refundStoreService(s,b.id,st.id));assert.deepEqual(s,refunded);const fresh=E.bookStoreService(s,st.id,offer.id);s.energy=30;E.useStoreService(s,fresh.id,st.id);assert.ok(s.energy>30);const used=structuredClone(s);assert.throws(()=>E.useStoreService(s,fresh.id,st.id));assert.throws(()=>E.refundStoreService(s,fresh.id,st.id));assert.deepEqual(s,used);const copy=E.validateImport(JSON.stringify(s));assert.equal(copy.serviceBookings.at(-1).used,true);assert.equal(copy.cash,s.cash);}
});
test('service bookings reject wrong branches, locked destinations, invalid choices and closing-time actions without mutation',()=>{
 const st=E.STORES.find(E.isServiceStore),s=rich(st.mallId),offer=E.serviceMenu(st)[0],before=structuredClone(s);assert.throws(()=>E.bookStoreService(s,st.id,'missing'));assert.deepEqual(s,before);const b=E.bookStoreService(s,st.id,offer.id),saved=structuredClone(s);assert.throws(()=>E.refundStoreService(s,b.id,'ross'));assert.deepEqual(s,saved);s.minutes=E.CLOSE;const late=structuredClone(s);assert.throws(()=>E.useStoreService(s,b.id,st.id));assert.deepEqual(s,late);const locked=E.STORES.find(st=>E.isServiceStore(st)&&st.tier>0),career=E.createState(),lockedBefore=structuredClone(career);assert.throws(()=>E.bookStoreService(career,locked.id,E.serviceMenu(locked)[0].id),/Unlock/);assert.deepEqual(career,lockedBefore);
});
test('malformed imported service bookings are removed without affecting the existing wallet or purchases',()=>{
 const s=rich(),cash=s.cash;s.serviceBookings=[null,{}, {id:'bad',store:'ross',offer:'made-up',paid:100,day:1}];s.serviceSerial=-4;const copy=E.loadState(JSON.stringify(s));assert.deepEqual(copy.serviceBookings,[]);assert.equal(copy.serviceSerial,0);assert.equal(copy.cash,cash);
});
test('real sunglasses support fitting and persistent visible equipment with tags removed',()=>{
 const p=E.PRODUCTS.find(p=>p.type==='sunglasses'),s=rich();assert.ok(E.canTry(p));assert.equal(E.slotForProduct(p),'jewelry');E.checkout(s,p.store,[{id:p.id,size:p.sizes[0]}]);const item=s.purchases.at(-1);E.wear(s,item.id);assert.equal(E.equippedLook(s).jewelry.id,p.id);assert.equal(E.loadState(JSON.stringify(s)).equipment.jewelry,item.id);assert.equal(E.returnEligibility(s,item).ok,false);
});

test('real numeric size labels with petite or length suffixes match the saved waist',()=>{const s=rich(),p=E.PRODUCTS.find(p=>p.name.includes('Maeve Colette')&&p.sizes.includes('32 P'));s.waist='32';assert.ok(p);assert.equal(E.idealSize(s,p),'32 P');assert.equal(E.fit(s,p.id,'32 P').fits,true);});
