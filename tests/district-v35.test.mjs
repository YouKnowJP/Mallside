import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import * as T from '../dist/vendor/three.module.js';
import {ARCHIVED_PRODUCTS} from '../dist/catalog.js';
import {mallLayouts,assertCampusTrip} from './campus-assertions.mjs';
import {fixtureStop} from '../dist/mall-neighborhood.js';
import {interiorPlan,displayPoint} from '../dist/shop-interiors.js';
import {freeRoute,walkable} from '../dist/free-navigation.js';
import {diningRoom,sculptureAlcove,artNotebook} from '../dist/district-ui.js';
import {savedShopButton} from '../dist/shop-options-ui.js';
import {createShopper,solveArmToGrip,applyCharacterPose} from '../dist/character-rig.js';
import {MallWorld3D} from '../dist/world-3d.js';
import {updateCourtLife} from '../dist/court-life.js';
const esc=s=>String(s).replaceAll('<','&lt;').replaceAll('"','&quot;');
function diningState(){const st=E.STORES.find(st=>st.businessKind==='food'&&!st.count),s=E.createState();Object.assign(s,{sandbox:true,xp:999999,cash:100000,mallId:st.mallId,floor:E.storeFloor(E.mallById(st.mallId),st.id),hunger:20,energy:40});return {s,st};}
function owner(){return {scene:new T.Scene(),resources:new Set(),mat(color,opts={}){const m=new T.MeshStandardMaterial({color,...opts});this.resources.add(m);return m;},mesh(geo,mat,parent=this.scene){const m=new T.Mesh(geo,mat);this.resources.add(geo);parent.add(m);return m;}};}
test('all 249 food branches have honest game meals, leaving 91 research catalogs untouched',()=>{
 const food=E.STORES.filter(st=>st.businessKind==='food');assert.equal(food.length,249);assert.equal(food.filter(st=>!st.count).length,91);for(const st of food){assert.equal(E.diningMenu(st).length,3);assert.ok(E.diningMenu(st).every(f=>E.FOOD.includes(f)&&f.price>0));if(!st.count){assert.equal(st.catalogStatus,'pending');assert.equal(E.isServiceStore(st),false);}}
 const {s,st}=diningState(),before=structuredClone(s),html=diningRoom(s,st,{E,esc,savedShopButton});assert.match(html,/original Mallside game menu/i);assert.match(html,/do not describe this restaurant/);assert.equal((html.match(/data-action="dining-review"/g)||[]).length,3);assert.deepEqual(s,before);assert.deepEqual(E.diningMenu(E.STORES.find(st=>st.businessKind==='apparel')),[]);
});
test('dining is atomic, validates location and menu, charges once, and persists bounded clean history',()=>{
 const {s,st}=diningState(),meal=E.diningMenu(st)[0],before=structuredClone(s);for(const id of ['water','missing']){assert.throws(()=>E.dineAtStore(s,st.id,id));assert.deepEqual(s,before);}s.floor=999;const wrong=structuredClone(s);assert.throws(()=>E.dineAtStore(s,st.id,meal.id));assert.deepEqual(s,wrong);s.floor=before.floor;s.mallId=E.MALLS.find(m=>m.id!==before.mallId).id;const away=structuredClone(s);assert.throws(()=>E.dineAtStore(s,st.id,meal.id));assert.deepEqual(s,away);s.mallId=before.mallId;s.cash=0;const poor=structuredClone(s);assert.throws(()=>E.dineAtStore(s,st.id,meal.id),/money/);assert.deepEqual(s,poor);s.cash=before.cash;s.minutes=E.CLOSE;const late=structuredClone(s);assert.throws(()=>E.dineAtStore(s,st.id,meal.id));assert.deepEqual(s,late);s.minutes=before.minutes;
 const expected=structuredClone(before);E.eat(expected,meal.id);E.dineAtStore(s,st.id,meal.id);assert.equal(s.cash,before.cash-meal.price);assert.equal(s.minutes,before.minutes+meal.minutes);assert.equal(s.hunger,expected.hunger);assert.equal(s.diningVisits.length,1);assert.deepEqual(E.validateImport(JSON.stringify(s)).diningVisits,s.diningVisits);
 const valid=s.diningVisits[0];s.diningVisits=[null,{},...Array.from({length:125},()=>({...valid})),{...valid,paid:-1}];assert.equal(E.loadState(JSON.stringify(s)).diningVisits.length,120);delete s.diningVisits;delete s.artNotes;const legacy=E.loadState(JSON.stringify(s));assert.deepEqual(legacy.diningVisits,[]);assert.deepEqual(legacy.artNotes,[]);
});
test('23 sculpture alcoves retain reachable public routes and all existing floor activities',()=>{
 let count=0;for(const mall of E.MALLS){const layouts=mallLayouts(mall);for(const [floor,l]of layouts.entries()){const art=l.environment.fixtures.filter(f=>f.kind==='art');assert.equal(art.length,1,mall.id+' '+floor);assert.equal(l.environment.fixtures.filter(f=>f.activity).length,3);assert.equal(l.environment.fixtures.filter(f=>f.amenity).length,2);assert.ok(l.environment.seating.length);assertCampusTrip(mall,layouts,floor,l.spawn,floor,art[0].approach);assert.equal(fixtureStop(art[0]).id,'art:art-alcove');count++;}}assert.equal(count,23);
});
test('sketches save once per day, award first-visit XP once per floor and normalize imports',()=>{
 const s=E.createState();s.energy=40;s.floor=999;const invalid=structuredClone(s);assert.throws(()=>E.sketchAlcove(s,'curve'));assert.deepEqual(s,invalid);s.floor=0;const xp=s.xp;E.sketchAlcove(s,'curve');assert.equal(s.artNotes.length,1);assert.equal(s.energy,43.82);assert.equal(s.minutes,E.OPEN+3);assert.equal(s.xp,xp+5);const snapshot=structuredClone(s);assert.throws(()=>E.sketchAlcove(s,'shadow'));assert.deepEqual(s,snapshot);assert.throws(()=>E.sketchAlcove(s,'invalid'));assert.deepEqual(s,snapshot);s.day++;E.sketchAlcove(s,'shadow');assert.equal(s.xp,xp+5);assert.equal(s.artNotes.length,1);assert.equal(s.artNotes[0].detail,'shadow');const note=s.artNotes[0];s.artNotes=[null,{...note,floor:999},{...note,day:999},{...note,detail:'missing'},note,note];const loaded=E.loadState(JSON.stringify(s));assert.deepEqual(loaded.artNotes,[note]);assert.match(sculptureAlcove(loaded,{E,esc}),/Sketch saved here today/);assert.match(artNotebook(loaded,{E,esc}),/Trace the shadows/);
});
test('research-only furniture is solid and every dining seat, table, desk and exit stays reachable',()=>{
 for(const st of E.STORES.filter(s=>!s.count))assert.equal(interiorPlan(st,E.FLOORPLANS[st.mallId],6).stockFixtures.length,0,st.id+' has no invisible product fixtures');
 const samples=new Map();for(const st of E.STORES.filter(s=>!s.count&&!E.isServiceStore(s))){const l=interiorPlan(st,E.FLOORPLANS[st.mallId],6),key=l.design.layout+':'+l.design.variation+':'+st.businessKind;samples.set(key,{st,l});}
 for(const {st,l}of samples.values()){assert.equal(l.stockFixtures.length,0,st.id+' has no invisible stock fixtures');for(const r of l.displays){assert.ok(l.nav.obstacles.includes(r));assert.ok(freeRoute(l.spawn,displayPoint(r),l.nav).length>=2,st.id+' table');}for(const p of [l.exit,l.services.returns,l.services.associate,...(st.businessKind==='food'?[{x:600,y:675}]:[])]){assert.ok(walkable(p,l.nav),st.id);assert.ok(freeRoute(l.spawn,p,l.nav).length>=2,st.id+' route');}}
});
test('archived purchases remain refundable at their original research-only shop',()=>{
 const p=ARCHIVED_PRODUCTS.find(p=>!p.finalSale&&!E.storeById(p.store).count&&!E.isServiceStore(E.storeById(p.store)));assert.ok(p);const s=E.createState(),tax=Math.round(p.price*E.TAX);s.purchases=[{id:'legacy-v35',productId:p.id,store:p.store,size:p.sizes[0],price:p.price,tax,total:p.price+tax,day:1,tags:true,worn:false,returned:false}];const loaded=E.validateImport(JSON.stringify(s)),w={inside:p.store,layout:{services:{returns:{x:1,y:2}}},navigate(p,a){this.action=a;}};MallWorld3D.prototype.goToShopService.call(w,'returns');assert.equal(w.action.interaction,'returns:'+p.store);const cash=loaded.cash;E.returnItem(loaded,'legacy-v35',p.store);assert.equal(loaded.cash,cash+p.price+tax);assert.equal(loaded.purchases[0].returned,true);
});
test('cached hand solves restore exact poses, follow root transforms, and invalidate changed hands',()=>{
 const w=owner(),g=createShopper(w,'#709384'),arm=g.userData.limbs[0];solveArmToGrip(g,0,31,10);g.updateMatrixWorld(true);const expected=g.worldToLocal(arm.userData.grip.getWorldPosition(new T.Vector3())),q=arm.quaternion.clone();assert.ok(expected.distanceTo(new T.Vector3(arm.position.x,31,10))<.1);
 arm.rotation.set(.7,.2,.1);g.position.set(50,7,-80);g.rotation.y=1.2;solveArmToGrip(g,0,31,10);assert.equal(arm.userData.gripCacheHits,1);assert.ok(arm.quaternion.angleTo(q)<1e-7);g.updateMatrixWorld(true);assert.ok(g.worldToLocal(arm.userData.grip.getWorldPosition(new T.Vector3())).distanceTo(expected)<1e-7);arm.userData.hand.rotation.x=.4;solveArmToGrip(g,0,31,10);assert.equal(arm.userData.gripCacheHits,1);assert.ok(arm.quaternion.angleTo(q)>.001);
 for(const r of w.resources)r.dispose?.();
});
test('gesture transitions ease toward the target and reduced motion changes immediately',()=>{
 const w=owner(),g=createShopper(w,'#709384');applyCharacterPose(g,{kind:'rest'});const before=g.userData.limbs[1].quaternion.clone();applyCharacterPose(g,{kind:'greet',time:0,delta:1/60});const first=g.userData.limbs[1].quaternion.clone();const target=createShopper(w,'#709384');applyCharacterPose(target,{kind:'greet',time:0});const q=target.userData.limbs[1].quaternion;assert.ok(before.angleTo(first)>0);assert.ok(before.angleTo(first)<before.angleTo(q)*.1);for(let i=0;i<25;i++)applyCharacterPose(g,{kind:'greet',time:0,delta:1/60});assert.ok(g.userData.limbs[1].quaternion.angleTo(q)<1e-7);applyCharacterPose(g,{kind:'pay',time:0,delta:1/60,reducedMotion:true});assert.equal(g.userData.rig.gestureFrom,null);for(const r of w.resources)r.dispose?.();
});
test('visible court visitors keep their seats when the ambient region updates',()=>{
 const seat={x:510,y:0,rotation:0},far={x:1500,y:0,rotation:0},near={x:600,y:50,rotation:0},g=new T.Group();g.userData={};const w={courtLifeCenter:{x:0,y:0},avatar:{x:501,y:0},courtVisitors:[{g,seat,reading:false}],layout:{environment:{seating:[{seat:near},{seat:far},{seat}]}},state:{preferences:{reducedMotion:true}},canvas:{dataset:{}}};updateCourtLife(w,.02);assert.equal(w.courtVisitors[0].seat,seat);assert.equal(g.visible,true);
});
