import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import {walkingStep,cameraBlend} from '../dist/motion.js';
import {MallWorld} from '../dist/world.js';
import {MallWorld3D} from '../dist/world-3d.js';
import {spatialLayout} from '../dist/spatial-layout.js';
import {walkable} from '../dist/free-navigation.js';
import {shopRows,shoppingGuide,campusMapSVG} from '../dist/play-ui.js';
import {observeCanvasSize} from '../dist/canvas-size.js';
const ctx={E,esc:v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')};

test('canvas resize notifications coalesce outside the observer delivery loop',()=>{
 let notify,frame,resizes=0,scheduled=0;class Observer{constructor(fn){notify=fn;}observe(){}disconnect(){}}
 const watch=observeCanvasSize({},()=>resizes++,{Observer,schedule:fn=>{scheduled++;frame=fn;return scheduled;},cancel(){}});notify();notify();notify();assert.equal(resizes,0);assert.equal(scheduled,1);frame();assert.equal(resizes,1);notify();assert.equal(scheduled,2);frame();assert.equal(resizes,2);watch.disconnect();
});
test('destroyed canvas observers cancel pending work and ignore later notifications',()=>{
 let notify,frame,cancelled,disconnected=0,resizes=0;class Observer{constructor(fn){notify=fn;}observe(){}disconnect(){disconnected++;}}
 const watch=observeCanvasSize({},()=>resizes++,{Observer,schedule:fn=>{frame=fn;return 41;},cancel:id=>cancelled=id});notify();watch.disconnect();frame();notify();assert.equal(cancelled,41);assert.equal(disconnected,1);assert.equal(resizes,0);
});

test('accelerated walking is consistent at 15, 30, 60 and 144 Hz and normalizes diagonal intent',()=>{
 const walk=(fps,x=1,y=0)=>{let p={x:0,y:0},velocity={x:0,y:0};for(let i=0;i<fps;i++){const step=walkingStep(p,x,y,velocity,220,1/fps);p=step;velocity=step.velocity;}return p;};
 const base=walk(60);for(const fps of [15,30,144])assert.ok(Math.abs(walk(fps).x-base.x)<1e-7);assert.ok(Math.abs(Math.hypot(walk(60,1,1).x,walk(60,1,1).y)-base.x)<1e-7);assert.ok(base.x<220&&base.x>200);
});
test('release stops immediately and a long hidden frame cannot cause an unbounded move',()=>{
 const stopped=walkingStep({x:20,y:30},0,0,{x:220,y:20},220,1/60);assert.equal(stopped.x,20);assert.equal(stopped.y,30);assert.deepEqual(stopped.velocity,{x:0,y:0});const long=walkingStep({x:0,y:0},1,0,{x:220,y:0},220,900);assert.ok(long.x<=22);assert.equal(walkingStep({x:0,y:0},1,0,null,220,-1).x,0);
});
test('camera damping has the same one-second response at different frame rates',()=>{
 const run=fps=>{let x=0;for(let i=0;i<fps;i++)x+=(100-x)*cameraBlend(1/fps);return x;};for(const fps of [15,30,144])assert.ok(Math.abs(run(fps)-run(60))<1e-8);assert.equal(cameraBlend(0),0);assert.ok(cameraBlend(900)<1);
});
test('manual stop clears remaining floor transfers as well as the visible walking path',()=>{
 const w=Object.assign(Object.create(MallWorld.prototype),{keys:new Set(['w']),touchDirection:'up',path:[{}],destination:{store:'ross'},tripSteps:[{}],pendingTrip:[{}],pendingLanding:{},velocity:{x:10,y:10}});w.stopWalking();assert.deepEqual(w.path,[]);assert.equal(w.destination,null);assert.deepEqual(w.tripSteps,[]);assert.deepEqual(w.pendingTrip,[]);assert.equal(w.pendingLanding,null);assert.equal(w.keys.size,0);assert.deepEqual(w.velocity,{x:0,y:0});
});
test('shop exit cancels interior movement, restores mall coordinates and emits one scene update',()=>{
 const old=globalThis.document;try{const ui={hidden:false,innerHTML:'shop controls'};globalThis.document={querySelector:s=>s==='#scene-location'?ui:{classList:{remove(){}}}};const s=E.createState(),l=spatialLayout(E.mallOf(s),0,E.STORES);let changes=0;
 const w=Object.assign(Object.create(MallWorld3D.prototype),{state:s,inside:'ross',keys:new Set(['d']),velocity:{x:20,y:0},path:[{x:800,y:500}],destination:{interaction:'checkout:ross'},tripSteps:[{}],pendingTrip:[{}],mallPosition:{...l.spawn},canvas:{dataset:{}},clearScene(){},buildMall(){},flashStoreTransition(){},onSceneChange(){changes++;},fittingPending:{},fittingExitPending:{}});w.leaveInterior();assert.equal(w.inside,null);assert.deepEqual(w.path,[]);assert.equal(w.destination,null);assert.equal(w.canvas.dataset.scene,'mall-3d');assert.ok(walkable(w.avatar,w.layout.nav));assert.equal(w.fittingPending,null);assert.equal(w.fittingExitPending,null);assert.equal(ui.hidden,true);assert.equal(ui.innerHTML,'');assert.equal(changes,1);
 }finally{globalThis.document=old;}
});
test('a portal transition does not record the distance or heading between two unrelated scenes',()=>{
 const oldDoc=globalThis.document,oldRAF=globalThis.requestAnimationFrame;try{globalThis.document={hidden:false,querySelector:()=>null};globalThis.requestAnimationFrame=()=>{};const first={nav:{bounds:{left:0,top:0,right:900,bottom:900},obstacles:[]}},second={...first};
 const w=Object.assign(Object.create(MallWorld.prototype),{alive:true,state:{preferences:{},minutes:600,paused:false},last:1000,t:0,keys:new Set(),avatar:{x:100,y:100},layout:first,path:[{x:100,y:100}],distance:0,canvas:{dataset:{}},draw(){},onMove(){assert.fail('Portal counted as walking');},arrive(){this.layout=second;this.avatar={x:700,y:700};}});w.frame(1016);assert.equal(w.distance,0);assert.equal(w.moving,false);assert.deepEqual(w.avatar,{x:700,y:700});
 }finally{globalThis.document=oldDoc;globalThis.requestAnimationFrame=oldRAF;}
});
test('shop finder shows stocked/services first, filters by name/floor, and marks unfinished collections',()=>{
 const s=E.createState(),ready=shopRows(s,ctx,'Ross');assert.match(ready,/data-id="ross"/);assert.match(ready,/Walk here &amp; enter|Walk here & enter/);assert.match(shopRows(s,ctx,'unlikely shop 54321'),/No shops match/);const all=shopRows(s,ctx,'','all','all');assert.match(all,/collection in research/i);assert.ok(shopRows(s,ctx).length<all.length);assert.match(shoppingGuide(s,'ross',ctx,2),/Only checkout spends/);assert.match(shoppingGuide(s,'ross',ctx,2),/Review bag · 2 items/);assert.match(shoppingGuide(s,null,ctx),/Find a shop/);
});
test('all mall floors expose real shop/court map actions and current position without inventing stores',()=>{
 for(const mall of E.MALLS){const s=E.createState();s.sandbox=true;s.mallId=mall.id;for(let floor=0;floor<E.planFor(s).levels.length;floor++){const l=spatialLayout(mall,floor,E.STORES),svg=campusMapSVG(l,l.spawn,floor,ctx);assert.match(svg,/Interactive center map/);assert.match(svg,/>YOU</);for(const match of svg.matchAll(/data-action="center-unit" data-id="([^"]+)"/g))assert.ok(E.storeById(match[1]));assert.equal([...svg.matchAll(/data-action="center-zone"/g)].length,l.campus.nodes.length);assert.ok(!svg.includes('undefined'));}}
});
