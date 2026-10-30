import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import * as T from '../dist/vendor/three.module.js';
import {STUDY_PALETTES,studyFor,studioGroup} from '../dist/studio-study.js';
import {studioStudyHTML} from '../dist/studio-study-ui.js';
import {buildStudyStation,buildPlanningDetails,updateStudioStudy} from '../dist/studio-details.js';
import {buildMosaicStudy,mosaicTurns,updateMosaicStudy} from '../dist/mosaic-details.js';
import {curtainWidth} from '../dist/fitting-motion.js';
import {MallWorld3D} from '../dist/world-3d.js';
import {interiorPlan,displayPoint} from '../dist/shop-interiors.js';
import {freeRoute,walkable} from '../dist/free-navigation.js';
import {brandDesign} from '../dist/brand-designs.js';
import {themeFor} from '../dist/mall-design.js';
import {shopRows,shoppingGuide,shopFinderShortcuts} from '../dist/play-ui.js';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const planning=E.STORES.filter(E.isPlanningStore);
function fixture(){const s=E.createState();s.sandbox=true;const st=planning.find(st=>st.mallId===s.mallId);return {s,st,draft:studyFor(s,st.id)};}
function owner(s=E.createState()){const w={state:s,scene:new T.Scene(),resources:new Set(),textures:new Map(),canvas:{dataset:{}},frameDt:1/60};for(const name of ['mat','mesh','box','cyl','ball'])w[name]=MallWorld3D.prototype[name];return w;}
function release(w){MallWorld3D.prototype.clearScene.call(w);}

test('material studies are optional schema-6 data and older saves preserve their existing progress',()=>{
 const {s}=fixture();delete s.materialStudies;s.cash=32109;s.artNotes=[{mallId:s.mallId,floor:0,detail:'shadow',day:1}];const out=E.validateImport(JSON.stringify(s));assert.equal(out.version,6);assert.equal(out.mapRevision,10);assert.deepEqual(out.materialStudies,[]);assert.equal(out.cash,32109);assert.deepEqual(out.purchases,s.purchases);assert.deepEqual(out.shoppingPlans,s.shoppingPlans);assert.deepEqual(out.commonsNotes,s.commonsNotes);
});
test('saving a study changes only that notebook, copies its input and replaces the same shop atomically',()=>{
 const {s,st,draft}=fixture(),before=structuredClone(s);draft.palette='coast';draft.finish='smooth';E.saveMaterialStudy(s,draft);assert.deepEqual(s.materialStudies,[{store:st.id,palette:'coast',finish:'smooth',day:1}]);draft.palette='berry';assert.equal(s.materialStudies[0].palette,'coast');E.saveMaterialStudy(s,draft);assert.equal(s.materialStudies.length,1);const after=structuredClone(s);delete after.materialStudies;delete before.materialStudies;assert.deepEqual(after,before);assert.deepEqual(E.validateImport(JSON.stringify(s)).materialStudies,s.materialStudies);
});
test('foreign, stocked, service and malformed studies fail without changing any game state',()=>{
 const {s,draft}=fixture(),foreign=planning.find(st=>st.mallId!==s.mallId),stocked=E.STORES.find(st=>st.count),service=E.STORES.find(E.isServiceStore);
 for(const bad of [null,{}, {...draft,store:foreign.id},{...draft,store:stocked.id},{...draft,store:service.id},{...draft,palette:'__proto__'},{...draft,finish:'missing'},{...draft,store:'missing'}]){const before=structuredClone(s);assert.throws(()=>E.saveMaterialStudy(s,bad));assert.deepEqual(s,before);}
});
test('malformed optional notes are filtered, duplicates use the last valid choice and the notebook is bounded by real planning shops',()=>{
 const {s,st,draft}=fixture();s.materialStudies=[null,{}, {...draft,day:999},{...draft,day:0},{...draft,finish:'missing'},{...draft},{...draft,palette:'berry'}];let out=E.validateImport(JSON.stringify(s));assert.deepEqual(out.materialStudies,[{store:st.id,palette:'berry',finish:'textured',day:1}]);s.materialStudies=planning.map(st=>({...draft,store:st.id}));out=E.validateImport(JSON.stringify(s));assert.equal(out.materialStudies.length,planning.length);assert.equal(new Set(out.materialStudies.map(n=>n.store)).size,planning.length);assert.equal(out.cash,s.cash);
});
test('study controls identify original props, costs and named choices without depending on color alone',()=>{
 const {s,st,draft}=fixture(),html=studioStudyHTML(s,{...st,name:'<script>"'},draft,{esc});assert.match(html,/not merchandise/);assert.match(html,/saving spends no money or game time/);assert.equal((html.match(/data-action="studio-palette"/g)||[]).length,3);assert.equal((html.match(/data-action="studio-finish"/g)||[]).length,2);assert.equal((html.match(/aria-pressed="true"/g)||[]).length,2);assert.match(html,/role="status"/);for(const p of STUDY_PALETTES)for(const name of p.labels)if(p.id===draft.palette)assert.ok(html.includes(name));assert.ok(!html.includes('<script>'));
});
test('every unfinished studio retains real routes to its study desk, rest, help and exits',()=>{
 const groups=new Set();for(const st of planning){groups.add(studioGroup(st));const l=interiorPlan(st,E.FLOORPLANS[st.mallId],6);for(const target of [displayPoint(l.displays[1]),l.services.fitting,l.services.associate,{x:600,y:675},l.exit]){assert.ok(walkable(target,l.nav),st.id);assert.ok(freeRoute(l.spawn,target,l.nav).length>=1,st.id);}assert.equal(st.catalogStatus,'pending');assert.equal(st.count,0);}assert.deepEqual(groups,new Set(['textile','light','workshop']));
});
test('the studios finder exposes planning shops without mixing them into the stocked collection filter',()=>{
 const {s,st}=fixture(),ids=new Set(E.mallOf(s).sections.flatMap(d=>d.stores)),local=planning.filter(st=>ids.has(st.id)),html=shopRows(s,{E,esc},'','all','studios');assert.equal((html.match(/class="shop-destination"/g)||[]).length,local.length);for(const shop of local)assert.ok(html.includes('data-id="'+shop.id+'"'));assert.ok(!shopRows(s,{E,esc},'','all','ready').includes('data-id="'+st.id+'"'));assert.match(shopFinderShortcuts(s,'studios',{E}),/data-id="studios" aria-pressed="true"/);const guide=shoppingGuide(s,st.id,{E,esc});assert.match(guide,/data-action="studio-open"/);assert.match(guide,/data-action="shop-plan-open"/);assert.match(guide,/data-action="leave-shop"/);assert.match(guide,/still being researched/);
});
test('planning interaction signs use proximity labels while stock shop labels keep their existing behavior',()=>{
 const {st}=fixture(),w={inside:st.id,layout:{store:st},clickables:[],nearLabels:[]},sprite=new T.Sprite(new T.SpriteMaterial()),point={x:300,y:450};MallWorld3D.prototype.tag.call(w,sprite,'study:'+st.id,point);assert.equal(w.nearLabels.length,1);assert.equal(w.nearLabels[0].radius,220);assert.equal(w.nearLabels[0].x,point.x);w.layout.store=E.STORES.find(st=>st.count);MallWorld3D.prototype.tag.call(w,new T.Sprite(sprite.material),'rack:test',point);assert.equal(w.nearLabels.length,1);sprite.material.dispose();
});
test('all three physical study types show the actual draft, restore saved materials and reuse their resources',()=>{
 for(const kind of ['textile','light','workshop']){const st=planning.find(st=>studioGroup(st)===kind),s=E.createState(),w=owner(s),r={x:100,y:200,width:100,height:65};buildStudyStation(w,st,brandDesign(st),r);const count=w.resources.size;w.studioPreview={store:st.id,palette:'coast',finish:'smooth'};updateStudioStudy(w);assert.equal(w.canvas.dataset.materialStudy,'coast:smooth');assert.equal(w.canvas.dataset.materialStudyGroup,kind);for(const [i,m]of w.studioStudy.samples.entries()){assert.equal(m.color.getHexString(),STUDY_PALETTES[1].colors[i].slice(1));assert.equal(m.roughness,.24);assert.equal(m.bumpScale,0);}w.studioPreview=null;updateStudioStudy(w);assert.equal(w.canvas.dataset.materialStudy,'earth:textured');assert.equal(w.resources.size,count);const b=new T.Box3().setFromObject(w.scene);assert.ok(b.min.x>=r.x&&b.max.x<=r.x+r.width);assert.ok(b.min.z>=r.y&&b.max.z<=r.y+r.height);release(w);assert.equal(w.studioStudy,null);assert.equal(w.studioPreview,null);}
});
test('new joinery and galleries remain inside reserved fixtures across every distinct studio layout',()=>{
 const seen=new Set();for(const st of planning){const l=interiorPlan(st,E.FLOORPLANS[st.mallId],6),key=l.design.layout+':'+l.design.variation+':'+studioGroup(st);if(seen.has(key))continue;seen.add(key);const w=owner();buildPlanningDetails(w,st,brandDesign(st),l);w.scene.updateMatrixWorld(true);for(const mesh of w.scene.children){const b=new T.Box3().setFromObject(mesh);assert.ok([...l.displays,l.rail].some(r=>b.min.x>=r.x-.01&&b.max.x<=r.x+r.width+.01&&b.min.z>=r.y-.01&&b.max.z<=r.y+r.height+.01),st.id+' '+mesh.position.toArray());}assert.equal(w.canvas.dataset.planningDetailRevision,'41');release(w);}assert.ok(seen.size>=10);
});
test('courtyard tiles turn with the preview, point in the stated direction and fit the existing collision footprint',()=>{
 const w=owner(),theme=themeFor('orange');buildMosaicStudy(w,0,0,theme);assert.deepEqual(mosaicTurns(w),[1,2,3]);w.commonsPreview={mallId:w.state.mallId,floor:0,turns:[0,1,2]};for(let i=0;i<90;i++)updateMosaicStudy(w);const turns=w.mosaicStudy.tiles.map(t=>new T.Vector3(0,0,-1).applyQuaternion(t.quaternion));assert.ok(turns[0].z<-.9999);assert.ok(turns[1].x>.9999);assert.ok(turns[2].z>.9999);const bounds=new T.Box3().setFromObject(w.scene);assert.ok(bounds.min.x>=-15&&bounds.max.x<=15&&bounds.min.z>=-15&&bounds.max.z<=15);assert.equal(w.canvas.dataset.mosaicDetailRevision,'41');assert.deepEqual(JSON.parse(w.canvas.dataset.mosaicTurns),[0,1,2]);release(w);assert.equal(w.mosaicStudy,null);
});
test('mosaic draft and saved arrangements are scoped to the actual mall floor and discard cleanly',()=>{
 const w=owner();delete w.state.commonsNotes;assert.deepEqual(mosaicTurns(w),[1,2,3]);w.state.commonsNotes=[{kind:'mosaic',mallId:w.state.mallId,floor:1,choice:'aligned',day:1}];assert.deepEqual(mosaicTurns(w),[1,2,3]);w.commonsPreview={mallId:w.state.mallId,floor:0,turns:[3,0,1]};assert.deepEqual(mosaicTurns(w),[3,0,1]);w.commonsPreview=null;assert.deepEqual(mosaicTurns(w),[1,2,3]);w.state.commonsNotes.push({kind:'mosaic',mallId:w.state.mallId,floor:0,choice:'aligned',day:1});assert.deepEqual(mosaicTurns(w),[0,1,2]);w.state.floor=1;assert.deepEqual(mosaicTurns(w),[0,1,2]);w.state.mallId='brea';assert.deepEqual(mosaicTurns(w),[1,2,3]);release(w);
});
test('reduced-motion tiles apply the chosen orientation immediately without ambient turning',()=>{
 const w=owner();w.state.preferences.reducedMotion=true;buildMosaicStudy(w,0,0,themeFor('orange'));w.commonsPreview={mallId:w.state.mallId,floor:0,turns:[0,1,2]};updateMosaicStudy(w);const before=w.mosaicStudy.tiles.map(t=>t.rotation.y);assert.deepEqual(before,[0,-Math.PI/2,-Math.PI]);for(let i=0;i<50;i++)updateMosaicStudy(w);assert.deepEqual(w.mosaicStudy.tiles.map(t=>t.rotation.y),before);release(w);
});
test('curtains ease consistently across frame rates, retain their width while paused and snap under reduced motion',()=>{
 const sample=hz=>{let width=10;for(let i=0;i<hz/2;i++)width=curtainWidth(width,true,1/hz);return width;};assert.ok(Math.abs(sample(30)-sample(60))<1e-10);assert.ok(Math.abs(sample(60)-sample(144))<1e-10);assert.ok(Math.abs(sample(120)-sample(144))<1e-10);assert.equal(curtainWidth(25,true,0),25);assert.equal(curtainWidth(25,false,0),25);assert.equal(curtainWidth(10,true,0,true),43);assert.equal(curtainWidth(43,false,.1,true),10);for(let i=-1;i<50;i++)for(const closed of [true,false]){const v=curtainWidth(i,closed,1/60);assert.ok(v>=10&&v<=43);}
});

test('leaving a room releases its procedural finish cache before new fixtures are built',()=>{
 const {st}=fixture(),w=owner(),l=interiorPlan(st,E.FLOORPLANS[st.mallId],6);buildPlanningDetails(w,st,brandDesign(st),l);const old=w.finishTextures.get('timber-color');let disposed=0;old.addEventListener('dispose',()=>disposed++);release(w);assert.equal(disposed,1);assert.equal(w.finishTextures.size,0);w.scene=new T.Scene();buildPlanningDetails(w,st,brandDesign(st),l);const fresh=w.finishTextures.get('timber-color');assert.notEqual(fresh,old);assert.ok(w.resources.has(fresh));release(w);
});
