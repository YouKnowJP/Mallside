import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as E from '../dist/engine.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
import {filterShoppingItems, oneListingPerModel, usualShoppingSize} from '../dist/shopping-filters.js';

const added = E.PRODUCTS.filter(p => p.collectionReference === 66);

test('27 branch listings extend verified shelves with reusable exact model photos', () => {
 assert.equal(E.PRODUCTS.filter(p=>(p.collectionReference??0)<67).length, 8890);
 assert.equal(added.length, 27);
 assert.equal(new Set(added.map(p => p.id)).size, 27);
 assert.equal(new Set(added.map(p => p.store)).size, 7);
 assert.equal(new Set(added.map(p => p.name)).size, 6);
 for (const p of added) {
  assert.ok(E.storeById(p.store).products.includes(p));
  assert.ok(p.associationEvidence && p.merchantEvidence.retailerAssociationSource);
  assert.ok(p.referencePriceVerified && p.sourceOfferNote.includes('simulated'));
  const photo = PRODUCT_PHOTOS[p.id];
  assert.match(photo.license, /^(?:CC-BY-SA-4\.0|CC-BY-3\.0|CC0-1\.0)$/);
  assert.ok(readFileSync(new URL('../dist/' + photo.path, import.meta.url)).length > 5000);
 }
});

test('filters combine exact sizes, game tax, wishlist, and stock before choosing a branch', () => {
 const s = E.createState();
 const a = added.find(p => p.id === 'apple::v66-apple-iphone16-pink');
 const b = added.find(p => p.store.startsWith('spectrum') && p.modelId === a.modelId);
 s.wishlist = [b.id];
 s.cash = a.price + Math.round(a.price * E.TAX) - 1;
 s.inventory = {[a.id + ':128GB']:0,[b.id + ':128GB']:1};
 const stub = {...E, stock:(_s,id,size) => s.inventory[id + ':' + size] ?? 0};
 assert.deepEqual(filterShoppingItems([a,b], s, {size:'256GB'}, stub), []);
 assert.deepEqual(filterShoppingItems([a,b], s, {price:'800'}, stub), []);
 assert.deepEqual(filterShoppingItems([a,b], s, {availability:'saved'}, stub), [b]);
 const available = filterShoppingItems([a,b], s, {size:'128GB',availability:'stock'}, stub);
 assert.deepEqual(oneListingPerModel(available, p => p === a ? 0 : 1), [b]);
 assert.deepEqual(filterShoppingItems([a,b], s, {}, stub, true), []);
 s.cash++;
 assert.deepEqual(filterShoppingItems([a,b], s, {}, stub, true), [a,b]);
});

test('usual size uses saved measurements and excludes fallback and children’s sizes', () => {
 const s = {size:'XXL', shoeSize:'9', waist:'32', ringSize:'7'};
 assert.equal(usualShoppingSize(s,{type:'shirt',sizingSystem:'alpha',sizes:['L','2XL']}),'2XL');
 assert.equal(usualShoppingSize(s,{type:'shoes',sizes:['7','9']}),'9');
 assert.equal(usualShoppingSize(s,{type:'pants',sizingSystem:'waist-inseam',sizes:['W30L32','W32L30']}),'W32L30');
 assert.equal(usualShoppingSize(s,{type:'pants',sizingSystem:'waist-inseam',sizes:['W30L32']}),null);
 assert.equal(usualShoppingSize(s,{type:'shirt',audience:'child',sizes:['XXL']}),null);
 assert.equal(usualShoppingSize(s,{type:'phone',sizes:['128GB']}),null);
});
