import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import * as E from '../dist/engine.js';
import {windowAssortment,windowEdit} from '../dist/retail-identity.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
import {retailLight} from '../dist/retail-light.js';

test('window browsing starts with the exact pieces in the physical display at every branch',()=>{
 for(const shop of E.STORES.filter(s=>s.count)){
  for(const day of [1,7]){
   const {featured,extra}=windowEdit(shop.products,shop.id,day,PRODUCT_PHOTOS);
   assert.deepEqual(featured,windowAssortment(shop.products,shop.id,day,PRODUCT_PHOTOS));
   assert.ok(featured.length>=1&&featured.length<=2);
   const all=extra?[...featured,extra]:featured;
   assert.equal(new Set(all.map(p=>p.id)).size,all.length);
   assert.ok(all.every(p=>p.store===shop.id&&PRODUCT_PHOTOS[p.id]&&!p.archived));
  }
 }
});

test('the checkout quote and saved receipt agree without spending or consuming a coupon before payment',()=>{
 const s=E.createState(),store='ross',products=E.productsForStore(store);
 const bag=products.slice(0,2).map(p=>({id:p.id,size:p.sizes[0]}));
 s.cash=1000000;s.minutes=900;s.coupon={store,day:s.day};
 const before=JSON.stringify(s),quote=E.quoteCheckout(s,store,bag);
 assert.deepEqual(E.basketTotals(s,bag),{subtotal:quote.subtotal,tax:quote.tax,total:quote.total});
 assert.equal(quote.duration,20);
 assert.equal(JSON.stringify(s),before);
 const receipt=E.checkout(s,store,bag);
 assert.deepEqual([receipt.subtotal,receipt.tax,receipt.total],[quote.subtotal,quote.tax,quote.total]);
 assert.deepEqual(s.purchases.map(({productId,size,price,tax,total})=>({productId,size,price,tax,total})),quote.lines);
 assert.equal(s.cash,1000000-quote.total);
 assert.equal(s.coupon,null);
});

test('insufficient funds and duplicate stock fail during preview and payment without changing the save',()=>{
 const s=E.createState(),st=E.storeById('ross'),p=st.products[0],size=p.sizes[0],item={id:p.id,size};
 s.cash=0;
 const before=JSON.stringify(s);
 for(const fn of [E.quoteCheckout,E.checkout])assert.throws(()=>fn(s,st.id,[item]),/including tax/);
 assert.equal(JSON.stringify(s),before);
 s.cash=1000000;s.stock[`${s.day}:${p.id}:${size}`]=1;
 const stockBefore=JSON.stringify(s);
 for(const fn of [E.quoteCheckout,E.checkout])assert.throws(()=>fn(s,st.id,[item,item]),/sold out/);
 assert.equal(JSON.stringify(s),stockBefore);
});

test('window and till light patches share a single cached texture without adding lights or shadows',()=>{
 const root=new T.Group(),resources=new Set();
 const w={resources,mesh(geometry,material,parent){resources.add(geometry);const mesh=new T.Mesh(geometry,material);parent.add(mesh);return mesh;}};
 const back=retailLight(w,root,1,2,3,20,30),counter=retailLight(w,root,2,4,6,70,40,true);
 assert.equal(back.geometry,counter.geometry);
 assert.equal(back.material,counter.material);
 assert.equal(resources.size,3);
 assert.ok(resources.has(back.material.map));
 assert.equal(root.children.some(m=>m.isLight||m.castShadow),false);
 assert.equal(counter.rotation.x,-Math.PI/2);
 assert.equal(back.material.depthWrite,false);
});
