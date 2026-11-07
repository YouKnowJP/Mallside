import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import {swapFittingSize} from '../dist/shopping-selection.js';
import {curtainWidth,fittingGesture} from '../dist/fitting-motion.js';

const product=E.storeById('ross').products.find(item=>item.name==='Elia Blouse');
const selection=size=>({id:product.id,size});

test('fitting size swaps preserve bag order, money and stock, even with a full bag',()=>{
 const state=E.createState(true),[oldSize,newSize]=product.sizes;
 const extra=Array.from({length:7},()=>selection(oldSize));
 const bags={ross:[selection(oldSize),...extra]};
 const baseline=structuredClone(state);
 assert.deepEqual(swapFittingSize(state,'ross',bags,0,product.id,newSize),selection(newSize));
 assert.deepEqual(bags.ross,[selection(newSize),...extra]);
 assert.deepEqual(state,baseline);
});

test('an exhausted size or changed selection leaves the bag untouched',()=>{
 const state=E.createState(true),[oldSize,newSize]=product.sizes;
 const bags={ross:[selection(oldSize),...Array.from({length:E.stock(state,product.id,newSize)},()=>selection(newSize))]};
 const baseline=structuredClone(bags);
 assert.throws(()=>swapFittingSize(state,'ross',bags,0,product.id,newSize),/game stock/);
 assert.throws(()=>swapFittingSize(state,'ross',bags,0,'stale-product',newSize),/changed/);
 assert.deepEqual(bags,baseline);
});

test('fitting curtains meet in the center and the preview gesture settles in reduced motion',()=>{
 const range=[7,31];
 const width=Array.from({length:60}).reduce(previous=>curtainWidth(previous,true,1/60,false,range),7);
 assert.ok(width>30.99&&width<=31);
 assert.equal(curtainWidth(25,true,0,false,range),25);
 assert.equal(curtainWidth(width,false,0,true,range),7);
 assert.equal(fittingGesture(0),0);
 assert.equal(fittingGesture(.5),1);
 assert.equal(fittingGesture(.5,true),0);
 assert.equal(fittingGesture(1),0);
});
