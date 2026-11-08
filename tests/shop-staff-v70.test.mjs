import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import * as E from '../dist/engine.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
import {collectionProducts} from '../dist/collection-guide.js';
import {interiorPlan,displayPoint} from '../dist/shop-interiors.js';
import {freeRoute,walkable} from '../dist/free-navigation.js';
import {associateTrip,checkRequest} from '../dist/associate-service.js';
import {filterShoppingItems} from '../dist/shopping-filters.js';
import {GAME_NIGHT_STORE,PHONE_COUNTER_STORE,phoneCounterPicks} from '../dist/shop-staff.js';

test('the AT&T counter retains exact carrier selections, prior model identities and licensed photographs',()=>{
 const st=E.storeById(PHONE_COUNTER_STORE),items=collectionProducts(st);
 assert.deepEqual(items.map(p=>[p.referenceSKU,p.sizes[0],p.price]),[['6586E','128GB',72999],['6065F','256GB',92999],['6846E','256GB',129999]]);
 assert.deepEqual(filterShoppingItems(E.PRODUCTS,E.createState(),{availability:'new'},E),items);
 for(const p of items){
  const earlier=E.PRODUCTS.find(other=>other.modelId===p.modelId&&other.store!==st.id);
  assert.ok(earlier);
  assert.equal(PRODUCT_PHOTOS[p.id],PRODUCT_PHOTOS[earlier.id]);
  assert.ok(existsSync(new URL('../dist/'+PRODUCT_PHOTOS[p.id].path,import.meta.url)));
  assert.equal(p.associationEvidence.kind,'retailer-product');
  assert.match(p.source,/^https:\/\/www\.att\.com\/buy\/phones\//);
 }
 assert.match(items[0].sourceOfferNote,/unavailable/);
 assert.deepEqual(phoneCounterPicks(st,'storage').map(p=>p.referenceSKU),['6065F','6846E']);
 assert.deepEqual(phoneCounterPicks(st,'pen').map(p=>p.referenceSKU),['6846E']);
 assert.equal(phoneCounterPicks(st,'grip')[0].referenceSKU,'6065F');
});

test('the two new counters keep walkable approaches and staff checks use the exact shop selection',()=>{
 const phone=E.storeById(PHONE_COUNTER_STORE),game=E.storeById(GAME_NIGHT_STORE);
 assert.equal(game.catalogStatus,'pending');
 assert.equal(game.count,0);
 for(const st of [phone,game]){
  const l=interiorPlan(st,E.FLOORPLANS[st.mallId]);
  const counter=st===phone?{x:600,y:210}:l.services.fitting;
  for(const point of [counter,l.services.associate,l.exit,displayPoint(l.displays[1])]){
   assert.ok(walkable(point,l.nav),st.id);
   assert.ok(freeRoute(l.spawn,point,l.nav).length>=2,st.id);
  }
  if(st===game)assert.equal(walkable({x:l.fitting.x+43,y:l.fitting.y+18},l.nav),false);
  else{
   const s=Object.assign(E.createState(),{sandbox:true}),p=st.products[1],before=structuredClone(s);
   const request=checkRequest(s,st.id,{},p.id,p.sizes[0]);
   const trip=associateTrip(l,request,{displayIndex:1});
   assert.equal(trip.product.id,p.id);
   assert.deepEqual(trip.displayPoint,displayPoint(l.displays[1]));
   assert.deepEqual(s,before);
  }
 }
});
