import {test} from 'node:test';
import assert from 'node:assert/strict';
import {STORES,PRODUCTS,createState,slotForProduct} from '../dist/engine.js';
import {retailIdentity,signContrast,windowAssortment,SIGN_STYLES} from '../dist/retail-identity.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
import {brandDesign} from '../dist/brand-designs.js';
import {MallWorld3D} from '../dist/world-3d.js';
import {interiorPlan} from '../dist/shop-interiors.js';
import {FLOORPLANS} from '../dist/engine.js';

test('every real storefront gets readable contrasting signage, including every documented brand',()=>{
 const brands=new Set();for(const st of STORES){const identity=retailIdentity(st);brands.add(identity.key);assert.ok(signContrast(identity.ink,identity.background)>=4.5,st.name+' invisible signage');assert.equal(identity.branchName,st.name);assert.ok(identity.name.trim());assert.ok(identity.source);}
 assert.ok(brands.size>900);
});
test('branches of a known brand share sign identity, while budget, sport, beauty and luxury treatments differ',()=>{
 const known=new Map();for(const st of STORES){const i=retailIdentity(st);if(!SIGN_STYLES[i.key])continue;const value=JSON.stringify([i.background,i.ink,i.font,i.facade]);if(known.has(i.key))assert.equal(value,known.get(i.key));known.set(i.key,value);}
 assert.notDeepEqual(SIGN_STYLES.ross,SIGN_STYLES.nike);assert.notDeepEqual(SIGN_STYLES.sephora,SIGN_STYLES.hermes);assert.notDeepEqual(SIGN_STYLES.apple,SIGN_STYLES.prada);
});
test('window assortments use only the store’s own active photographed models, and leave unverified windows empty',()=>{
 for(const st of STORES){const items=windowAssortment(PRODUCTS,st.id,1,PRODUCT_PHOTOS);assert.ok(items.length<=2);assert.equal(new Set(items.map(p=>p.id)).size,items.length);for(const p of items){assert.equal(p.store,st.id);assert.ok(PRODUCT_PHOTOS[p.id]);assert.ok(p.source.startsWith('https:'));}if(!st.count)assert.deepEqual(items,[]);}
 const st=STORES.find(s=>s.count>4);assert.deepEqual(windowAssortment(PRODUCTS,st.id,1,{}),[]);assert.notDeepEqual(windowAssortment(PRODUCTS,st.id,1,PRODUCT_PHOTOS),windowAssortment(PRODUCTS,st.id,2,PRODUCT_PHOTOS));
});
test('documented signature interiors preserve distinct retail features rather than just recoloring one room',()=>{
 const features={apple:'screen',nike:'sneaker-wall',uniqlo:'fold-wall',prada:'green-niches',sephora:'stripes',hermes:'silk-wall',allsaints:'sewing-wall',miumiu:'damask-wall'};
 for(const [key,feature]of Object.entries(features)){const st=STORES.find(s=>brandDesign(s).key===key);assert.ok(st,key);const d=brandDesign(st);assert.equal(d.feature,feature);assert.equal(d.referenceKind,'brand-reference');assert.ok(d.source.startsWith('https:'));}
});
test('shop toolbar services route to the actual fitting, checkout and return stations before interacting',()=>{
 for(const id of ['nike','apple','hermes','lego']){const st=STORES.find(s=>s.id===id);assert.ok(st);const layout=interiorPlan(st,FLOORPLANS.orange),world={inside:id,layout,navigate(point,action){this.last={point,action};}};
  for(const kind of ['fitting','checkout','returns']){assert.equal(MallWorld3D.prototype.goToShopService.call(world,kind),true);assert.deepEqual(world.last.point,layout.services[kind]);const prefix=kind==='fitting'&&!st.products.some(p=>slotForProduct(p))?'rack':kind;assert.deepEqual(world.last.action,{interaction:prefix+':'+id});}
  assert.equal(MallWorld3D.prototype.goToShopService.call(world,'missing'),false);
 }
 assert.equal(MallWorld3D.prototype.goToShopService.call({inside:null},'checkout'),false);
});
