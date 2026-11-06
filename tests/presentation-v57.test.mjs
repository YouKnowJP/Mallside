import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import * as E from '../dist/engine.js';
import {MallWorld3D} from '../dist/world-3d.js';
import {updateOutfitPose,releasePersonResources} from '../dist/merchandise-fit.js';
import {chooseLabels,overlaps,spriteBounds,restoreFloatingLabels,layoutFloatingLabels} from '../dist/scene-labels.js';
import {shopSurface} from '../dist/shop-surfaces.js';

function owner(equipment={}){const w={scene:new T.Scene(),resources:new Set(),finishTextures:new Map(),state:E.createState()};for(const k of ['mat','mesh','box','ball','cyl'])w[k]=MallWorld3D.prototype[k];w.player=MallWorld3D.prototype.person.call(w,'#a47c56',{},equipment);return w;}
const release=w=>{releasePersonResources(w,w.player);for(const r of w.resources)r.dispose?.();};
const candidate=(id,x,y,width=90,height=24,priority=0,order=0)=>({id,bounds:{x,y,width,height},priority,order});
test('floating scene labels fit compact and wide viewports without overlap or obscuring reserved controls',()=>{
 for(const width of [280,390,768,1400]){const blocked=[{x:width-110,y:10,width:100,height:90}],c=[];for(let i=0;i<100;i++)c.push(candidate('p'+i,(i%10)*40,Math.floor(i/10)*26,90,24,i%7,i));const chosen=chooseLabels(c,{width,height:400,blocked,limit:6});assert.ok(chosen.length>0&&chosen.length<=6);for(const [i,a]of chosen.entries()){assert.ok(a.bounds.x>=10&&a.bounds.x+a.bounds.width<=width-10);assert.ok(!blocked.some(b=>overlaps(a.bounds,b)));for(const b of chosen.slice(i+1))assert.ok(!overlaps(a.bounds,b.bounds));}}
});
test('destination priority wins conflicting labels, duplicate name/price targets collapse, and invalid bounds are rejected',()=>{
 const target=candidate('checkout',20,20,120,24,1000),c=[candidate('product',20,20,120,24,10),target,candidate('checkout',20,90,100,24,20),candidate('bad',NaN,20),candidate('tiny',200,20,20,2)];const chosen=chooseLabels(c,{width:600,height:300});assert.deepEqual(chosen,[target]);assert.equal(chooseLabels(c,{width:600,height:300,limit:0}).length,0);
});
test('label projection agrees with perspective scale and hides behind-camera and near-plane sprites',()=>{
 const camera=new T.PerspectiveCamera(45,2,1,1000);camera.updateMatrixWorld(true);const sprite=new T.Sprite();sprite.position.set(0,0,-100);sprite.scale.set(20,5,1);const a=spriteBounds(sprite,camera,800,400);assert.ok(Math.abs(a.x+a.width/2-400)<1e-6);assert.ok(Math.abs(a.y+a.height/2-200)<1e-6);sprite.position.z=-200;assert.ok(Math.abs(spriteBounds(sprite,camera,800,400).width*2-a.width)<1e-6);for(const z of [10,-.5,-1200]){sprite.position.z=z;assert.equal(spriteBounds(sprite,camera,800,400),null);}
});
test('presentation culling restores semantic visibility and never changes physical targets or positions',()=>{
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(45,2,1,1000),player=new T.Group();scene.add(player);const labels=[0,1].map(i=>{const s=new T.Sprite();s.position.set(30,20,-100);s.scale.set(20,5,1);if(i)s.userData.interaction='p'+i;scene.add(s);return {object:s,text:'A shop',selected:false};});const w={scene,camera,player,avatar:{x:0,y:0},width:800,height:400,floatingLabels:labels,overview:true,canvas:{dataset:{},getBoundingClientRect:()=>({left:0,top:0}),ownerDocument:{querySelector:()=>null}}};const before=labels.map(r=>r.object.position.toArray());layoutFloatingLabels(w);assert.deepEqual(labels.filter(r=>r.object.visible).map(r=>r.object.userData.interaction),['p1'],'untagged decoration must not inherit an absent route priority');restoreFloatingLabels(w);assert.ok(labels.every(r=>r.object.visible));w.action={kind:'try'};layoutFloatingLabels(w);assert.ok(labels.every(r=>!r.object.visible));restoreFloatingLabels(w);assert.deepEqual(labels.map(r=>r.object.position.toArray()),before);assert.deepEqual(labels.map(r=>r.object.userData.interaction),[undefined,'p1']);
});
test('original starter trousers replace body-painted anatomy with separate rig-bound shells and visible stitching',()=>{
 const w=owner(),g=w.player,group=g.userData.starterTrousers;assert.equal(group.userData.role,'original-starter-trousers');const shells=group.children.filter(o=>o.isSkinnedMesh);assert.equal(shells.length,5);for(const s of shells){assert.equal(s.skeleton,g.userData.anatomy.skeleton);assert.notEqual(s.geometry,g.userData.anatomy.meshes.get(s.name.split(':')[1]).geometry);assert.ok(s.geometry.attributes.position.array.every(Number.isFinite));}assert.ok(group.getObjectByName('starter-trouser-stitching').geometry.attributes.position.count>500);assert.equal(g.userData.pelvis.visible,false);assert.equal(w.state.purchases.length,0);release(w);
});
test('starter trouser shells follow walking and sitting bones with finite bounds and no new per-frame resources',()=>{
 const w=owner(),g=w.player,s=g.userData.starterTrousers.getObjectByName('starter-trousers:calf_r'),n=w.resources.size;updateOutfitPose(g,{});g.updateMatrixWorld(true);const before=s.getVertexPosition(0,new T.Vector3());let moved=0;for(let i=0;i<180;i++){updateOutfitPose(g,{walking:i<120,distance:i*.65,seated:i>=120,blend:i>=120?(i-120)/59:0,delta:1/60,time:i/60});g.updateMatrixWorld(true);const p=s.getVertexPosition(0,new T.Vector3());assert.ok(p.toArray().every(Number.isFinite));moved=Math.max(moved,p.distanceTo(before));}assert.ok(moved>1);assert.equal(w.resources.size,n);release(w);
});
test('real catalog bottoms and full outfits replace starter trousers while cropped tops retain them',()=>{
 const bottom=E.PRODUCTS.find(p=>p.type==='pants'),dress=E.PRODUCTS.find(p=>p.name==='Madewell Smocked Waist Midi Dress'),crop=E.PRODUCTS.find(p=>p.name==='HomeStretch™ Smooth Solo Longsleeve — Bright White');
 const a=owner({bottom});assert.ok(!a.player.userData.starterTrousers);release(a);const b=owner({top:dress});assert.equal(b.player.userData.starterTrousers.visible,false);release(b);assert.ok(crop);{const c=owner({top:crop}),g=c.player;assert.equal(g.userData.starterTrousers.visible,true);g.updateMatrixWorld(true);const visible=[];g.traverse(o=>{if(!o.isMesh)return;for(let p=o;p;p=p.parent)if(!p.visible)return;visible.push(o);});for(const sign of [-1,1])for(const x of [-3,-2,0,2,3]){const hits=new T.Raycaster(new T.Vector3(x,28+g.position.y,sign*20),new T.Vector3(0,0,-sign)).intersectObjects(visible,false);assert.ok(['starter-waistband','starter-trouser-stitching'].includes(hits[0]?.object.name),'continuous waist covers the anatomical triangle cut');}release(c);}
});
test('starter geometry is shared per scene and survives releasing one actor without retaining dead actors',()=>{
 const w=owner(),first=w.player,second=MallWorld3D.prototype.person.call(w,'#789283');const a=first.userData.starterTrousers.children[0].geometry,b=second.userData.starterTrousers.children[0].geometry;assert.equal(a,b);let disposed=0;a.addEventListener('dispose',()=>disposed++);releasePersonResources(w,first);assert.equal(disposed,0);assert.ok(w.resources.has(b));w.player=second;release(w);assert.equal(disposed,1);
});
test('shared casework materials distinguish wood, paint and metal without changing fixture envelopes',()=>{
 const w=owner(),timber=shopSurface(w,'#ac9372','timber'),paint=shopSurface(w,'#ac9372'),metal=shopSurface(w,'#ac9372','metal');assert.equal(shopSurface(w,'#ac9372','timber'),timber);assert.ok(timber.bumpMap&&paint.bumpMap);assert.ok(metal.metalness>paint.metalness);assert.ok(metal.roughness<timber.roughness);const group=new T.Group(),m=w.box(0,0,0,80,30,40,timber,group);m.geometry.computeBoundingBox();assert.deepEqual(m.geometry.boundingBox.getSize(new T.Vector3()).toArray(),[80,30,40]);assert.ok(m.geometry.attributes.position.count>24);release(w);
});

test('all complete v56 product records, shop identities and save/economy versions remain compatible',()=>{const prior=JSON.parse(readFileSync(new URL('../docs/research-v57/compatibility.json',import.meta.url))),hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');assert.equal(E.PRODUCTS.filter(p=>p.collectionReference!==60).length,prior.productCount);assert.equal(hash(E.PRODUCTS.filter(p=>p.collectionReference!==60)),prior.productRecordsSHA256);assert.equal(hash(E.STORES.map(s=>s.id)),prior.shopIdsSHA256);const state=E.createState(),copy=E.validateImport(JSON.stringify(state));assert.equal(copy.version,prior.saveSchema);assert.equal(copy.mapRevision,prior.mapRevision);assert.equal(copy.cash,state.cash);});
