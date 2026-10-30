import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as E from '../dist/engine.js';
import * as T from '../dist/vendor/three.module.js';
import {VERIFIED_PRODUCT_ADDITIONS as additions} from '../dist/store-product-additions-v37.js';
import {garmentProfile} from '../dist/garment-reference-rules.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
import {hasCollectionDesk,collectionProducts,collectionSelection,collectionGuideHTML} from '../dist/collection-guide.js';
import {shoppingPlanHTML} from '../dist/shopping-plan-ui.js';
import {interiorPlan} from '../dist/shop-interiors.js';
import {walkable,freeRoute,clearWalk} from '../dist/free-navigation.js';
import {createStoreCustomers,updateStoreCustomers} from '../dist/store-customers.js';
import {createShopper,applyCharacterPose} from '../dist/character-rig.js';
import {staffGesture,staffTarget} from '../dist/staff-motion.js';
const esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'),picture=p=>`<span>${esc(p.name)}</span>`,shops=E.STORES.filter(st=>st.collectionEdition===37&&hasCollectionDesk(st));
const state=()=>Object.assign(E.createState(),{sandbox:true,cash:10000000});

test('14 actual official products retain exact selected-color USD offers, size labels and matching photographs',()=>{
 const facts=JSON.parse(readFileSync(new URL('../docs/research-v37/catalog-evidence.json',import.meta.url))).products;assert.equal(additions.length,14);assert.equal(facts.length,14);assert.deepEqual([...new Set(additions.map(p=>p.brand))].sort(),['American Eagle','BYLT Basics','SKIMS']);
 for(const p of additions){const f=facts.find(f=>f.id===p.id);assert.equal(p.source,f.source);assert.equal(p.priceUSD,f.priceUSD);assert.equal(p.referenceAmount,f.priceUSD);assert.equal(p.referenceCurrency,'USD');assert.equal(p.referenceCheckedOn,'2026-10-29');assert.equal(p.colorName,f.colorName);assert.deepEqual(p.sizes,f.sizes);assert.equal(p.photo.imageUrl,f.imageUrl);assert.equal(p.photo.source,p.source);assert.match(p.priceBasis,/live branch inventory is not asserted/);assert.ok(p.referencePriceVerified);assert.match(new URL(p.source).hostname,/^(?:www\.)?(?:ae\.com|byltbasics\.com|skims\.com)$/);const data=readFileSync(new URL('../dist/'+p.photo.path,import.meta.url));assert.equal(data.toString('ascii',0,4),'RIFF');assert.equal(data.toString('ascii',8,12),'WEBP');assert.ok(data.length>5000);}
});
test('11 formerly empty shops gain real stock; 12 collection desks keep every item at its actual merchant',()=>{
 assert.equal(shops.length,12);assert.equal(E.STORES.filter(s=>s.catalogStatus==='verified').length,1052);assert.equal(E.STORES.filter(s=>s.catalogStatus==='pending').length,413);assert.equal(E.STORES.filter(E.isPlanningStore).length,322);
 for(const st of shops){const products=collectionProducts(st);assert.ok(products.length>=3);for(const p of products){assert.equal(p.store,st.id);assert.ok(p.associationEvidence);assert.equal(p.source,additions.find(a=>a.id===p.modelId).source);assert.equal(PRODUCT_PHOTOS[p.id].source,p.source);}}
 assert.ok(E.STORES.filter(s=>/Cotton On|Warby Parker/.test(s.name)).every(s=>s.collectionEdition!==37));assert.deepEqual(collectionProducts(E.storeById('nike')),[]);
});
test('every new collection desk, preserved bench, stock display, fitting room and exit has an unobstructed route',()=>{
 for(const st of shops){const l=interiorPlan(st,E.FLOORPLANS[st.mallId],Math.min(6,st.count));assert.equal(l.seating.length,1);assert.ok(l.fixtures.some(r=>r.x===540&&r.y===125&&r.width===120));assert.ok(!l.stockFixtures.some(r=>r.id==='front-edit'));
  for(const p of [{x:600,y:210},{x:600,y:675},l.exit,l.services.checkout,l.services.returns,...l.fittingRooms,...l.stockFixtures.map(r=>r.approach)]){assert.ok(walkable(p,l.nav),st.id+' '+JSON.stringify(p));const route=freeRoute(l.spawn,p,l.nav);assert.ok(route.length>=2,st.id);for(let i=1;i<route.length;i++)assert.ok(clearWalk(route[i-1],route[i],l.nav),st.id);}
 }
});
test('pre-update shortlists survive a shop gaining merchandise and can be edited and routed without spending',()=>{
 const s=state(),st=shops.find(s=>s.mallId==='orange'),p=E.productsForStore('ross')[0];s.shoppingPlans=[{store:st.id,category:'all',budget:15000,items:[p.id],day:1}];const loaded=E.validateImport(JSON.stringify(s));assert.deepEqual(loaded.shoppingPlans,s.shoppingPlans);const plan=E.shoppingPlanDraft(loaded,st.id),before=structuredClone(loaded);plan.items.push(collectionProducts(st)[0].id);const html=shoppingPlanHTML(loaded,plan,'',12,{E,esc,picture});assert.match(html,/now has verified merchandise/);assert.ok(!html.includes('own collection is still in research'));E.saveShoppingPlan(loaded,plan);assert.equal(loaded.cash,before.cash);assert.equal(loaded.minutes,before.minutes);assert.equal(loaded.xp,before.xp);assert.equal(loaded.shoppingPlans[0].items.length,2);assert.equal(E.shoppingPlanSummary(loaded,plan).lines[1].p.store,st.id);
});
test('each new model supports exact-size fitting, atomic checkout, compatible reload and exact original-price refund',()=>{
 for(const a of additions){const p=E.PRODUCTS.find(p=>p.modelId===a.id),s=state(),cash=s.cash,size=E.idealSize(s,p),qty=E.stock(s,p.id,size);assert.ok(p.sizes.includes(size));assert.equal(E.canTry(p),true);assert.ok(E.fit(s,p.id,size).fits);assert.equal(s.cash,cash);const receipt=E.checkout(s,p.store,[{id:p.id,size}]);assert.equal(cash-s.cash,receipt.total);assert.equal(E.stock(s,p.id,size),qty-1);const restored=E.validateImport(JSON.stringify(s)),item=restored.purchases.at(-1);assert.equal(item.productId,p.id);assert.equal(E.returnItem(restored,item.id,p.store),receipt.total);assert.equal(restored.cash,cash);assert.equal(E.stock(restored,p.id,size),qty);assert.throws(()=>E.returnItem(restored,item.id,p.store),/Already/);}
});
test('new alpha pants, numeric shorts and waist/inseam jeans match their explicit source sizing systems',()=>{
 const s=state();s.size='M';s.waist='32';const p=brand=>E.PRODUCTS.find(p=>p.brand===brand&&p.sizingSystem==='alpha'&&p.type==='pants');assert.equal(E.idealSize(s,p('SKIMS')),'M');const shorts=E.PRODUCTS.find(p=>p.brand==='BYLT Basics'&&p.type==='shorts');assert.equal(E.idealSize(s,shorts),'32');const jeans=E.PRODUCTS.find(p=>p.sizingSystem==='waist-inseam');assert.equal(E.idealSize(s,jeans),'32 X 32');s.size='XXL';assert.equal(E.idealSize(s,p('SKIMS')),'2X');const legacy=E.PRODUCTS.find(p=>!p.sizingSystem&&p.type==='pants'&&p.sizes.includes('32'));assert.equal(E.idealSize(s,legacy),'32');
});
test('free source comparison is bounded to this collection and exposes real prices, photos, sizes and accessible actions',()=>{
 const s=state(),st=shops[0],products=collectionProducts(st),before=structuredClone(s);let selected=[];selected=collectionSelection(st,selected,products[0].id);selected=collectionSelection(st,selected,products[1].id);assert.equal(selected.length,2);assert.deepEqual(collectionSelection(st,selected,products[2].id),selected);assert.deepEqual(collectionSelection(st,selected,E.productsForStore('nike')[0].id),selected);const html=collectionGuideHTML(s,st,selected,{E,esc,picture});assert.match(html,/2\/2 products selected/);assert.match(html,/role="status"/);assert.match(html,/aria-pressed="true"/);assert.match(html,/Official product & selected color/);assert.match(html,/spends no stamina and reserves no stock/);assert.match(html,/with tax/);assert.deepEqual(s,before);assert.deepEqual(collectionSelection(st,selected,products[0].id),[products[1].id]);
});
test('shopping actors retain their product while walking between fixtures and transfer it to a bag only at payment',()=>{
 const st=shops.find(s=>s.mallId==='orange'),l=interiorPlan(st,E.FLOORPLANS.orange),sim=createStoreCustomers(l,st.products,8),seen=new Set();
 for(let frame=0;frame<6000;frame++){const previous=sim.actors.map(a=>({id:a.id,hasItem:a.hasItem,bag:a.bag,stage:a.stage}));updateStoreCustomers(sim,.05);for(const a of sim.actors){if(a.moving&&a.hasItem)seen.add(a.stage);if(a.bag)assert.equal(a.hasItem,false);if(previous[a.id].hasItem&&!a.hasItem)assert.ok(a.bag||a.stage==='arrive');if(a.stage==='arrive')assert.equal(a.hasItem,false);}}
 assert.ok(sim.purchases>0);assert.ok(seen.has('compare')&&seen.has('try')&&seen.has('queue')&&seen.has('pay'));
});
test('staff greet a fresh approach, avoid repeated waves, freeze while paused and attend to nearby shoppers',()=>{
 let g=staffGesture({},200,.05);g=staffGesture(g,80,.05);assert.equal(g.greet,1.6);const frozen=staffGesture(g,80,0);assert.deepEqual(frozen,g);for(let i=0;i<180;i++)g=staffGesture(g,80,.05);assert.equal(g.greet,0);assert.ok(g.near);g=staffGesture(g,200,.05);g=staffGesture(g,80,.05);assert.equal(g.greet,1.6);assert.equal(staffTarget({x:0,y:0},{x:500,y:500},[{x:50,y:0}]),Math.PI/2);assert.equal(staffTarget({x:0,y:0},{x:0,y:50},[{x:20,y:0,visible:false}]),0);
});
test('carried-item walking keeps the grip steady and greeting wrists ease back to a static reduced-motion pose',()=>{
 const w={scene:new T.Scene(),resources:new Set(),mat(color,options={}){const m=new T.MeshStandardMaterial({color,...options});this.resources.add(m);return m;},mesh(geo,mat,parent=this.scene){const m=new T.Mesh(geo,mat);this.resources.add(geo);parent.add(m);return m;}},g=createShopper(w,'#75928b'),arm=g.userData.limbs[1];
 for(let i=0;i<30;i++)applyCharacterPose(g,{walking:true,carrying:true,distance:i*2,time:i/60,delta:1/60});g.updateMatrixWorld(true);const first=g.worldToLocal(arm.userData.grip.getWorldPosition(new T.Vector3()));applyCharacterPose(g,{walking:true,carrying:true,distance:100,time:1,delta:1/60});g.updateMatrixWorld(true);const next=g.worldToLocal(arm.userData.grip.getWorldPosition(new T.Vector3()));assert.ok(first.distanceTo(next)<.03);assert.ok(Math.abs(next.y-28.5)<.15);for(let i=0;i<30;i++)applyCharacterPose(g,{kind:'greet',time:i/60,delta:1/60});assert.ok(Math.abs(arm.userData.hand.rotation.z)>.01);applyCharacterPose(g,{kind:'greet',time:4,delta:1/60,reducedMotion:true});assert.equal(arm.userData.hand.rotation.z,0);for(const r of w.resources)r.dispose?.();
});

test('reviewed construction keeps the short Henley, ribbed tank, flared pants and cotton tee faithful to their photographs',()=>{
 const profile=name=>garmentProfile(E.PRODUCTS.find(p=>p.modelId?.startsWith('v37-real-')&&p.name===name));assert.equal(profile('Henley Drop-Cut: LUX').sleeve,'short');assert.equal(profile('Henley Drop-Cut: LUX').neckline,'crew');assert.equal(profile('Cotton Rib Tank').straps,'wide');assert.equal(profile('Cotton Jersey Foldover Pant').leg,'flare');assert.equal(profile('AE Boxy Fit Sueded Jersey T-Shirt').fabric,'cotton');assert.equal(profile('AE Denim Trucker Jacket').pockets,2);for(const a of additions){const p=E.PRODUCTS.find(p=>p.modelId===a.id),g=garmentProfile(p);assert.ok(g.reviewed&&g.photoRegion);assert.equal(typeof g.onModel,'boolean');}
});
