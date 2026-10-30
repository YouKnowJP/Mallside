import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import * as T from '../dist/vendor/three.module.js';
import {ARCHIVED_PRODUCTS} from '../dist/catalog.js';
import {shoppingPlanHTML,shoppingPlanNotebook} from '../dist/shopping-plan-ui.js';
import {pendingCollection} from '../dist/shop-options-ui.js';
import {shopperPlan} from '../dist/mall-neighborhood.js';
import {mallLayouts} from './campus-assertions.mjs';
import {interiorPlan} from '../dist/shop-interiors.js';
import {walkable,clearWalk,freeRoute} from '../dist/free-navigation.js';
import {ambientStrideSpeed,crowdStep,smoothSeatBlend,benchSeatTarget} from '../dist/ambient-motion.js';
import {createShopper,applyCharacterPose} from '../dist/character-rig.js';
const esc=v=>String(v).replaceAll('<','&lt;').replaceAll('"','&quot;'),picture=p=>`<span>${esc(p.name)}</span>`;
function fixture(){const s=E.createState(),st=E.STORES.find(st=>st.mallId===s.mallId&&E.isPlanningStore(st));return {s,st,plan:E.shoppingPlanDraft(s,st.id)};}
function owner(){return {scene:new T.Scene(),resources:new Set(),mat(color,opts={}){const m=new T.MeshStandardMaterial({color,...opts});this.resources.add(m);return m;},mesh(geo,mat,parent=this.scene){const m=new T.Mesh(geo,mat);this.resources.add(geo);parent.add(m);return m;}};}

test('327 remaining planning lounges keep research catalogs intact and recommend only real local products at their actual shops',()=>{
 const lounges=E.STORES.filter(E.isPlanningStore);assert.equal(lounges.length,327);const shapes=new Set();for(const st of lounges){assert.equal(st.catalogStatus,'pending');assert.equal(st.count,0);assert.equal(E.isServiceStore(st),false);const l=interiorPlan(st,E.FLOORPLANS[st.mallId],6),key=l.design.layout+':'+l.design.variation;assert.equal(l.seating.length,1);if(!shapes.has(key)){shapes.add(key);assert.ok(walkable({x:600,y:675},l.nav));assert.ok(freeRoute(l.spawn,{x:600,y:675},l.nav).length>=2,st.id+' lounge bench');}}
 for(const mall of E.MALLS){const st=lounges.find(st=>st.mallId===mall.id);if(!st)continue;const s=E.createState();Object.assign(s,{mallId:mall.id,sandbox:true});const ids=new Set(mall.sections.flatMap(d=>d.stores)),list=E.shoppingPlanCandidates(s,st.id);assert.ok(list.length);assert.equal(new Set(list.map(E.modelKey)).size,list.length);for(const p of list){assert.ok(!p.archived&&p.source);assert.ok(ids.has(p.store));assert.ok(E.storeById(p.store).count>0);assert.notEqual(p.store,st.id);}}
 const {s,st}=fixture(),snapshot=structuredClone(s);E.shoppingPlanCandidates(s,st.id);E.shoppingPlanDraft(s,st.id);assert.deepEqual(s,snapshot);
});
test('planning saves three verified picks without changing cash, time, stock, purchases or rewards',()=>{
 const {s,st,plan}=fixture(),before=structuredClone(s),picks=E.shoppingPlanCandidates(s,st.id,{category:'all'}).slice(0,3);plan.items=picks.map(p=>p.id);E.saveShoppingPlan(s,plan);assert.deepEqual(s.shoppingPlans[0].items,plan.items);const after=structuredClone(s);delete after.shoppingPlans;delete before.shoppingPlans;assert.deepEqual(after,before);plan.items.pop();assert.equal(s.shoppingPlans[0].items.length,3);assert.deepEqual(E.validateImport(JSON.stringify(s)).shoppingPlans,s.shoppingPlans);
});
test('invalid, foreign, duplicate, archived and oversized plans are atomic; the 16-plan cap allows editing existing notes',()=>{
 const {s,st,plan}=fixture(),valid=E.shoppingPlanCandidates(s,st.id)[0].id,foreign=E.PRODUCTS.find(p=>E.mallForStore(s,p.store).id!==s.mallId).id,archived=ARCHIVED_PRODUCTS[0].id;
 for(const bad of [{...plan,budget:1},{...plan,category:'missing'},{...plan,items:[foreign]},{...plan,items:[archived]},{...plan,items:[valid,valid]},{...plan,items:['missing']},{...plan,items:[valid,valid,valid,valid]},{...plan,store:E.STORES.find(E.isServiceStore).id}]){const before=structuredClone(s);assert.throws(()=>E.saveShoppingPlan(s,bad));assert.deepEqual(s,before);}
 const shops=E.STORES.filter(st=>st.mallId===s.mallId&&!E.isServiceStore(st)&&st.businessKind!=='food').slice(0,17);assert.equal(shops.length,17);for(const shop of shops.slice(0,16))E.saveShoppingPlan(s,E.shoppingPlanDraft(s,shop.id));const before=structuredClone(s);assert.throws(()=>E.saveShoppingPlan(s,E.shoppingPlanDraft(s,shops[16].id)),/16/);assert.deepEqual(s,before);E.saveShoppingPlan(s,{...s.shoppingPlans[0],budget:30000});assert.equal(s.shoppingPlans.length,16);assert.equal(s.shoppingPlans[0].budget,30000);E.removeShoppingPlan(s,shops[0].id);assert.equal(s.shoppingPlans.length,15);
});
test('older saves receive an empty notebook and malformed optional notes cannot damage existing progress',()=>{
 const {s,st,plan}=fixture();delete s.shoppingPlans;assert.deepEqual(E.loadState(JSON.stringify(s)).shoppingPlans,[]);plan.items=E.shoppingPlanCandidates(s,st.id).slice(0,2).map(p=>p.id);const bad={...plan,items:[plan.items[0],plan.items[0],null,{},'missing']};s.shoppingPlans=[null,{}, {...plan,budget:-1},{...plan,day:999},bad];const out=E.loadState(JSON.stringify(s));assert.equal(out.cash,s.cash);assert.deepEqual(out.shoppingPlans,[{...plan,items:[plan.items[0]]}]);assert.deepEqual(out.diningVisits,s.diningVisits);assert.deepEqual(out.artNotes,s.artNotes);
});
test('shortlist estimates use current game prices and per-line tax; drafts and routes clearly distinguish saving from checkout',()=>{
 const {s,st,plan}=fixture();plan.budget=5000;plan.items=E.shoppingPlanCandidates(s,st.id,{category:'all'}).slice(0,3).map(p=>p.id);const sum=E.shoppingPlanSummary(s,plan);assert.equal(sum.total,plan.items.reduce((n,id)=>{const p=E.byId(id),amount=E.price(s,p);return n+amount+Math.round(amount*E.TAX);},0));let html=shoppingPlanHTML(s,plan,'',12,{E,esc,picture});assert.match(html,/Saving spends no money and reserves no stock/);assert.ok(!html.includes('data-action="plan-walk"'));E.saveShoppingPlan(s,plan);html=shoppingPlanHTML(s,plan,'',12,{E,esc,picture});assert.equal((html.match(/data-action="plan-walk"/g)||[]).length,3);assert.match(html,/AVAILABLE AT/);assert.match(html,/including tax/);assert.match(html,/data-action="plan-save" disabled/);plan.budget=15000;assert.ok(!shoppingPlanHTML(s,plan,'',12,{E,esc,picture}).includes('data-action="plan-walk"'));assert.match(pendingCollection(s,st,{E,esc}),/Build a shopping shortlist/);assert.match(shoppingPlanNotebook(s,{E,esc}),/Open shortlist/);
});
test('planner category, search and result limits remain useful and deterministic',()=>{
 const {s,st}=fixture(),cat=E.shoppingPlanCategories(st.id).find(c=>c!=='all');const rows=E.shoppingPlanCandidates(s,st.id,{category:cat,limit:8});assert.ok(rows.length>0&&rows.length<=8);assert.ok(rows.every(p=>E.categoryOf(p)===cat));const p=rows[0];assert.ok(E.shoppingPlanCandidates(s,st.id,{category:cat,query:p.name}).some(q=>q.name===p.name));assert.deepEqual(E.shoppingPlanCandidates(s,st.id,{query:'impossible missing item zzzz'}),[]);assert.deepEqual(E.shoppingPlanCandidates(s,st.id,{category:cat,limit:8}).map(p=>p.id),rows.map(p=>p.id));
});
test('all 23 floors start spaced crowds outside the player bubble with reachable local browsing targets',()=>{
 let floors=0;for(const mall of E.MALLS)for(const l of mallLayouts(mall)){for(const spawn of [l.spawn,l.environment.fixtures.find(f=>f.kind==='art').approach]){const w={...l,spawn},actors=shopperPlan(w,36);assert.equal(actors.length,36,mall.id+' '+floors);for(const [i,a]of actors.entries()){assert.ok(walkable(a,l.nav));assert.ok(Math.hypot(a.x-spawn.x,a.y-spawn.y)>=48-.001);for(const b of actors.slice(i+1))assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>=34-.001);assert.ok(a.targets.length);for(const t of a.targets)assert.ok(clearWalk(a,t,l.nav));}}floors++;}assert.equal(floors,23);
});
test('ambient avoidance takes a bounded walkable side step and never deepens an overlap',()=>{
 const nav={bounds:{left:0,top:0,right:300,bottom:300},obstacles:[]},from={x:100,y:100},next={x:103,y:100},others=[from,{x:126,y:100}],p=crowdStep(from,next,others,0,nav);assert.ok(walkable(p,nav));assert.ok(Math.hypot(p.x-126,p.y-100)>=25);assert.ok(Math.hypot(p.x-from.x,p.y-from.y)<=3.001);assert.notDeepEqual(p,next);assert.deepEqual(crowdStep(from,next,[from,{x:200,y:100}],0,nav),next);assert.ok(ambientStrideSpeed(50,5)<ambientStrideSpeed(50,40));assert.equal(ambientStrideSpeed(50,100),50);
});
test('sitting transitions ease at both ends and stay bounded through the full moment',()=>{
 const w=owner(),g=createShopper(w,'#75928b');applyCharacterPose(g,{seated:true,seatHeight:15});const target=benchSeatTarget({x:0,y:0,rotation:0});g.position.z=target.y;g.updateMatrixWorld(true);for(const leg of g.userData.limbs.slice(2))assert.ok(leg.userData.knee.getWorldPosition(new T.Vector3()).z>15,'knees clear the bench front');for(const r of w.resources)r.dispose?.();assert.deepEqual(benchSeatTarget({x:10,y:20,rotation:Math.PI/2}),{x:18,y:20,rotation:Math.PI/2});
 assert.equal(smoothSeatBlend(0),0);assert.equal(smoothSeatBlend(.65),1);assert.equal(smoothSeatBlend(7.5),1);assert.equal(smoothSeatBlend(8),0);assert.equal(smoothSeatBlend(NaN),0);assert.ok(smoothSeatBlend(.01)<.001);assert.ok(smoothSeatBlend(7.99)<.002);for(let t=-1;t<10;t+=.03){const v=smoothSeatBlend(t);assert.ok(v>=0&&v<=1);}
});
test('head glances ease consistently across refresh rates and remain static with reduced motion',()=>{
 const w=owner(),g=createShopper(w,'#75928b'),rig=g.userData.rig;applyCharacterPose(g,{time:0,attention:0});const initial=rig.headGroup.quaternion.clone();applyCharacterPose(g,{time:0,attention:.28,delta:1/60});const first=rig.headGroup.quaternion.clone();applyCharacterPose(g,{time:0,attention:.28});const target=rig.headGroup.quaternion.clone();assert.ok(first.angleTo(initial)>0&&first.angleTo(initial)<target.angleTo(initial));const sample=hz=>{rig.headGroup.quaternion.copy(initial);for(let i=0;i<hz/2;i++)applyCharacterPose(g,{time:0,attention:.28,delta:1/hz});return rig.headGroup.quaternion.clone();};assert.ok(sample(30).angleTo(sample(60))<1e-6);applyCharacterPose(g,{time:9,attention:.28,delta:1/60,reducedMotion:true});assert.ok(rig.headGroup.quaternion.angleTo(new T.Quaternion())<1e-7);for(const r of w.resources)r.dispose?.();
});
