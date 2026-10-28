import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as E from '../dist/engine.js';
import {ARCHIVED_PRODUCTS} from '../dist/catalog.js';
import {associationFor,businessKind} from '../dist/playable-stores.js';
import {brandDesign,BRAND_DESIGNS} from '../dist/brand-designs.js';
import {merchantIdentity} from '../dist/merchant-identity.js';
import {STORE_PRODUCT_ADDITIONS} from '../dist/store-product-additions-v12.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
import {interiorPlan} from '../dist/shop-interiors.js';
import {walkable} from '../dist/free-navigation.js';
const rich=()=>Object.assign(E.createState(),{sandbox:true,cash:100000000});

test('every active listing has an explicit own-brand, exact merchant or documented carried-brand association',()=>{
 for(const p of E.PRODUCTS){assert.ok(!p.archived);assert.ok(p.associationEvidence,p.id);assert.equal(new URL(p.associationEvidence.source).protocol,'https:');assert.ok(associationFor(E.storeById(p.store),p),p.id);assert.ok(!['guest-capsule','multibrand-game'].includes(p.assortmentBasis));}
 assert.ok(E.STORES.filter(s=>s.catalogStatus==='verified').length>=950);
});
test('a manufacturer cannot inherit products from another brand or from a general merchandise category',()=>{
 const nike=E.storeById('nike'),gucci=E.storeById('gucci');assert.equal(associationFor(nike,{brand:'Gucci',name:'A real bag',type:'bag',source:'https://www.gucci.com/'}),null);assert.equal(associationFor(gucci,{brand:'Nike',name:'Real sneakers',type:'shoes',source:'https://www.nike.com/'}),null);
 for(const id of ['nike','gucci','prada','lv','hermes','coach'])for(const p of E.productsForStore(id))assert.equal(merchantIdentity(p.brand),merchantIdentity(E.storeById(id).name));
});
test('published retailer brand proof retains category and condition restrictions',()=>{
 const sephora=E.storeById('sephora'),vacuum=E.PRODUCTS.find(p=>p.brand==='Dyson'&&p.type==='vacuum');if(vacuum)assert.equal(associationFor(sephora,vacuum),null);
 for(const st of E.STORES.filter(s=>/Kevin Jewelers/i.test(s.name)))assert.ok(!st.products.some(p=>/rolex/i.test(p.brand)&&!/pre.?owned|used/i.test(p.condition||'')));
});
test('shops awaiting research keep a real entrance and return desk without pretending to offer services or invented goods',()=>{
 for(const st of E.STORES){assert.ok(['service','verified','pending'].includes(st.catalogStatus));assert.equal(st.products.length,st.count);if(st.catalogStatus==='pending'){assert.equal(st.count,0);assert.equal(E.isServiceStore(st),false);assert.match(st.greeting,/researched/);}const l=interiorPlan(st,E.planFor(rich()),Math.min(6,st.count));assert.ok(walkable(l.spawn,l.nav),st.id);assert.ok(walkable(l.services.returns,l.nav),st.id);}
});
test('retired guest purchases survive backup import, preserve real identity and refund the exact original paid amount',()=>{
 const p=ARCHIVED_PRODUCTS.find(p=>p.assortmentBasis==='guest-capsule'&&!p.finalSale&&E.canTry(p));assert.ok(p);const s=rich(),cash=s.cash,tax=Math.round(p.price*E.TAX),item={id:'legacy-line-1',orderId:'legacy-order-1',productId:p.id,store:p.store,size:p.sizes[0],price:p.price,tax,total:p.price+tax,day:1,returned:false,worn:false,tags:true};s.purchases=[item];
 const copy=E.validateImport(JSON.stringify(s));assert.equal(copy.cash,cash);assert.equal(E.byId(copy.purchases[0].productId).name,p.name);assert.equal(E.returnEligibility(copy,copy.purchases[0]).ok,true);assert.equal(E.returnItem(copy,item.id,p.store),item.total);assert.equal(copy.cash,cash+item.total);assert.throws(()=>E.returnItem(copy,item.id,p.store),/Already/);
});
test('retired purchases can still be equipped while retired unpaid selections cannot be checked out',()=>{
 const p=ARCHIVED_PRODUCTS.find(p=>!p.finalSale&&E.slotForProduct(p));const s=rich(),item={id:'legacy-wear',productId:p.id,store:p.store,size:p.sizes[0],total:p.price,price:p.price,tax:0,day:1,tags:true,worn:false,returned:false};s.purchases=[item];E.wear(s,item.id);const copy=E.validateImport(JSON.stringify(s));assert.equal(E.equippedLook(copy)[E.slotForProduct(p)].id,p.id);const before=structuredClone(copy);assert.throws(()=>E.checkout(copy,p.store,[{id:p.id,size:p.sizes[0]}]));assert.deepEqual(copy,before);s.shoppingBags={day:s.day,mallId:s.mallId,bags:{[p.store]:[{id:p.id,size:p.sizes[0]}]}};assert.deepEqual(E.savedBags(s),{});
});
test('foreign published prices preserve currency and dated official FX instead of being relabeled USD',()=>{
 const foreign=STORE_PRODUCT_ADDITIONS.filter(p=>p.referenceCurrency!=='USD');assert.ok(foreign.length>=70);for(const p of foreign){assert.ok(p.referenceAmount>0);assert.match(p.conversion.source,/ecb\.europa\.eu/);assert.match(p.conversion.date,/^\d{4}-\d{2}-\d{2}$/);assert.ok(Math.abs(p.priceUSD-p.referenceAmount*Number(p.conversion.usdPerUnit))<.011,p.id);}
});
test('new photos are bundled genuine rasters with exact named product provenance',()=>{
 assert.ok(STORE_PRODUCT_ADDITIONS.length>=900);for(const p of STORE_PRODUCT_ADDITIONS){assert.ok(p.brand&&p.name&&p.photo.description);assert.ok(p.photo.imageUrl,p.id);const bytes=readFileSync(new URL('../dist/'+p.photo.path,import.meta.url));assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');assert.ok(PRODUCT_PHOTOS[p.id]);}
});
test('brand rooms use distinct floor materials, layouts and fixture families with cited references',()=>{
 assert.ok(Object.keys(BRAND_DESIGNS).length>=45);const rooms=['nike','uniqlo','apple','sephora','hermes','prada','lv','coach'].map(id=>brandDesign(E.storeById(id)));assert.ok(new Set(rooms.map(r=>JSON.stringify([r.layout,r.pattern,r.floor,r.feature]))).size>=7);for(const room of rooms){assert.equal(new URL(room.source).protocol,'https:');assert.equal(room.referenceKind,'brand-reference');}
 assert.equal(businessKind('Brioni at Neiman Marcus'),'apparel');assert.equal(businessKind('Alo Yoga'),'apparel');assert.equal(businessKind('Voluspa'),'beauty');assert.equal(businessKind('Pottery Barn'),'home');assert.equal(businessKind('Nespresso'),'food');
});
test('child-size catalog items never produce adult fitting or wardrobe equipment',()=>{
 for(const st of E.STORES.filter(st=>/\b(?:kids|children|baby|gapkids)\b/i.test(st.name)))for(const p of st.products){assert.equal(p.audience,'child',p.id);assert.equal(E.canTry(p),false);}
});
test('coffee beans and capsules with zero immediate recovery do not act as prepared drinks',()=>{
 const p=E.PRODUCTS.find(p=>['food','drink'].includes(p.type)&&p.fullness===0&&p.recovery===0);assert.ok(p);const s=rich();E.checkout(s,p.store,[{id:p.id,size:p.sizes[0]}]);s.energy=30;s.hunger=40;E.useProduct(s,s.purchases[0].id);assert.ok(s.energy<=30&&s.hunger<=40);
});
