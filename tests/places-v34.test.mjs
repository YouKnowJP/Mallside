import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import * as T from '../dist/vendor/three.module.js';
import {mallLayouts,assertCampusTrip} from './campus-assertions.mjs';
import {fixtureStop} from '../dist/mall-neighborhood.js';
import {pendingCollection,savedShopButton} from '../dist/shop-options-ui.js';
import {shopRows,campusMapSVG,shopFinderShortcuts} from '../dist/play-ui.js';
import {publicStops} from '../dist/commons-ui.js';
import {locomotionWeight} from '../dist/motion.js';
import {createShopper,applyCharacterPose} from '../dist/character-rig.js';
import {buildCourtLife,updateCourtLife} from '../dist/court-life.js';
import {MallWorld3D} from '../dist/world-3d.js';
const esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
function owner(){return {scene:new T.Scene(),resources:new Set(),mat(color,opts={}){const m=new T.MeshStandardMaterial({color,...opts});this.resources.add(m);return m;},mesh(geo,mat,parent=this.scene){this.resources.add(geo);const m=new T.Mesh(geo,mat);parent.add(m);return m;},box(x,y,z,a,b,c,color,parent=this.scene){const m=this.mesh(new T.BoxGeometry(a,b,c),this.mat(color),parent);m.position.set(x,y,z);return m;}};}

test('46 water and notice waystations retain reachable approaches, discovery stops and resting places on all floors',()=>{
 let total=0;for(const mall of E.MALLS){const layouts=mallLayouts(mall);for(const [floor,l]of layouts.entries()){
  const stops=l.environment.fixtures.filter(f=>f.amenity);assert.deepEqual(stops.map(f=>f.amenity),['water','notice'],mall.id+' '+floor);assert.equal(l.environment.fixtures.filter(f=>f.activity).length,3);assert.ok(l.seating.length);
  for(const stop of stops){assert.ok(l.nav.obstacles.includes(stop));assertCampusTrip(mall,layouts,floor,l.spawn,floor,stop.approach);assert.equal(fixtureStop(stop).id,'amenity:'+stop.amenity);total++;}
 }}assert.equal(total,46);
});
test('waystation map markers and public-stop lists name useful actions on the selected floor',()=>{
 const s=E.createState(),l=mallLayouts(E.mallOf(s))[0],list=publicStops(l,0,{E,esc,s}),svg=campusMapSVG(l,null,0,{E,esc});
 for(const id of ['water','notice']){assert.ok(list.includes('data-id="waystation-'+id+'"'));assert.ok(svg.includes('data-id="waystation-'+id+'"'));}assert.ok(list.includes('Water refill station'));assert.ok(list.includes('Community noticeboard'));
});
test('saved shops migrate, deduplicate, validate and persist without changing progress or money',()=>{
 const s=E.createState();delete s.savedShops;const legacy=E.loadState(JSON.stringify(s));assert.deepEqual(legacy.savedShops,[]);const id=E.STORES[0].id,before=[legacy.cash,legacy.xp,legacy.minutes];assert.equal(E.toggleSavedShop(legacy,id),true);assert.equal(E.toggleSavedShop(legacy,id),false);E.toggleSavedShop(legacy,id);assert.deepEqual([legacy.cash,legacy.xp,legacy.minutes],before);assert.deepEqual(E.validateImport(JSON.stringify(legacy)).savedShops,[id]);
 const valid=E.STORES.slice(0,85).map(st=>st.id);s.savedShops=[null,{},'missing',...valid,valid[0]];assert.deepEqual(E.loadState(JSON.stringify(s)).savedShops,valid.slice(0,80));const snapshot=structuredClone(legacy);assert.throws(()=>E.toggleSavedShop(legacy,'missing'));assert.deepEqual(legacy,snapshot);legacy.savedShops=valid.slice(0,80);const full=structuredClone(legacy);assert.throws(()=>E.toggleSavedShop(legacy,valid[80]),/80 shops/);assert.deepEqual(legacy,full);
});
test('research-only guides offer real alternatives, bookmarks and an associate instead of empty fitting actions',()=>{
 const s=E.createState(),st=E.STORES.find(st=>st.mallId===s.mallId&&!st.count&&!E.isServiceStore(st));const html=pendingCollection(s,st,{E,esc});for(const action of ['toggle-saved-shop','collection-associate','shop-stocked','visit','leave-shop'])assert.ok(html.includes('data-action="'+action+'"'));assert.ok(!html.includes('data-action="fitting-open"'));assert.ok(!html.includes('data-action="pay"'));assert.ok(html.includes('still being researched'));E.toggleSavedShop(s,st.id);assert.ok(savedShopButton(s,st.id,{esc}).includes('aria-pressed="true"'));
 const rows=shopRows(s,{E,esc},'','all','saved');assert.ok(rows.includes('data-id="'+st.id+'"'));assert.equal((rows.match(/class="shop-destination"/g)||[]).length,1);assert.ok(shopFinderShortcuts(s,'saved',{E}).includes('Saved shops · 1'));assert.ok(shopFinderShortcuts(s,'saved',{E}).includes('aria-pressed="true"'));assert.ok(shopRows(s,{E,esc},'no matching shop','all','saved').includes('No shops match'));
});
test('associate and pending fitting routes resolve to actual shop interactions',()=>{
 const st=E.STORES.find(st=>!st.count&&!E.isServiceStore(st)),w={inside:st.id,layout:{services:{associate:{x:4,y:5},fitting:{x:8,y:9}}},navigate(point,action){this.point=point;this.action=action;}};
 assert.equal(MallWorld3D.prototype.goToShopService.call(w,'associate'),true);assert.deepEqual(w.action,{interaction:'associate:'+st.id});assert.equal(MallWorld3D.prototype.goToShopService.call(w,'fitting'),true);assert.deepEqual(w.action,{interaction:'rack:'+st.id});w.layout.services.checkout={x:10,y:11};w.layout.services.returns={x:12,y:13};MallWorld3D.prototype.goToShopService.call(w,'checkout');assert.deepEqual(w.action,{interaction:'rack:'+st.id});MallWorld3D.prototype.goToShopService.call(w,'returns');assert.deepEqual(w.action,{interaction:'associate:'+st.id});
});
test('gait transitions are refresh-rate independent, bounded and immediate for reduced motion',()=>{
 const ramp=hz=>{let v=0;for(let i=0;i<hz/2;i++)v=locomotionWeight(v,true,1/hz);return v;};assert.ok(Math.abs(ramp(30)-ramp(60))<1e-8);let v=locomotionWeight(0,true,1/60);assert.ok(v>0&&v<1);v=locomotionWeight(v,false,1/60);assert.ok(v>0&&v<.2);for(let i=0;i<90;i++)v=locomotionWeight(v,false,1/60);assert.equal(v,0);assert.equal(locomotionWeight(1,true,.05,true),0);assert.equal(locomotionWeight(NaN,true,0),1);
});
test('context poses and eased walking keep the rig finite and reduced motion static',()=>{
 const w=owner(),g=createShopper(w,'#7b9284');for(const kind of ['browse','compare','pay','talk','greet'])for(const time of [0,.5,1,3]){applyCharacterPose(g,{kind,time,delta:1/60});g.updateMatrixWorld(true);g.traverse(o=>{for(const n of o.matrixWorld.elements)assert.ok(Number.isFinite(n));});}
 applyCharacterPose(g,{walking:true,distance:10,delta:1/60});const weight=g.userData.rig.gaitWeight;assert.ok(weight>0&&weight<1);applyCharacterPose(g,{walking:false,distance:10,delta:1/60});assert.ok(g.userData.rig.gaitWeight<weight);applyCharacterPose(g,{kind:'pay',time:0,reducedMotion:true});const pose=g.userData.limbs.map(l=>l.quaternion.toArray());applyCharacterPose(g,{kind:'pay',time:3,reducedMotion:true});assert.deepEqual(g.userData.limbs.map(l=>l.quaternion.toArray()),pose);
});
test('ambient court visitors use bounded seating groups and respect quiet-crowd preferences',()=>{
 const s=E.createState(),l=mallLayouts(E.mallOf(s))[0],w=Object.assign(owner(),{state:s,layout:l,avatar:{...l.spawn},width:1400,canvas:{dataset:{}},t:0});w.person=(c,a)=>createShopper(w,c,a);buildCourtLife(w);assert.ok(w.courtVisitors.length>0&&w.courtVisitors.length<=3);assert.ok(w.courtVisitors.every(v=>v.seat));w.overview=true;updateCourtLife(w,.02);assert.ok(w.courtVisitors.every(v=>!v.g.visible));s.preferences.crowds=false;const quiet={...w,courtVisitors:[]};buildCourtLife(quiet);assert.deepEqual(quiet.courtVisitors,[]);
});
