import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import * as E from '../dist/engine.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
import {physicalProduct} from '../dist/merchandise-3d.js';
import {attachHeldProduct,updateAttachmentFrames,updateOutfitPose} from '../dist/merchandise-fit.js';
import {garmentProfile} from '../dist/garment-reference-rules.js';
import {MallWorld3D} from '../dist/world-3d.js';

const clothTypes=new Set(['shirt','hoodie','jacket','cardigan','pants','shorts']);
const bagTypes=new Set(['bag','crossbody','backpack','duffel','wallet']);
const physical=[...new Map(E.PRODUCTS.filter(physicalProduct).map(p=>[PRODUCT_PHOTOS[p.id]?.path,p])).values()];
const bags=physical.filter(p=>bagTypes.has(p.type));
const apparel=[...new Map(physical.filter(p=>clothTypes.has(p.type)).map(p=>{const a=garmentProfile(p);return [[a.kind,a.sleeve,a.length,a.fit].join(':'),p];})).values()];
function fixture(equipment={}){const w={scene:new T.Scene(),resources:new Set(),state:E.createState()};for(const method of ['box','ball','cyl','mat','mesh'])w[method]=MallWorld3D.prototype[method];w.player=MallWorld3D.prototype.person.call(w,'#bda581',{},equipment);return w;}
function release(w){for(const r of w.resources)r.dispose?.();}
function pose(g,{seated=false,phase=0,kind=''}={}){
 const [left,right,a,b]=g.userData.limbs;left.rotation.x=Math.sin(phase)*.65;right.rotation.x=-Math.sin(phase)*.65;a.rotation.x=seated?-.8:Math.sin(phase)*.65;b.rotation.x=seated?-.8:-Math.sin(phase)*.65;g.position.y=seated?1:3;
 updateOutfitPose(g,{seated,walking:!seated&&phase!==0,distance:phase*40/(2*Math.PI),kind,time:phase,reducedMotion:false});updateAttachmentFrames(g);g.updateMatrixWorld(true);
}
function productMeshes(g,id){const found=[];g.traverse(o=>{if(!o.isMesh)return;let at=o;while(at&&at!==g){if(at.userData.productId===id){found.push(o);break;}at=at.parent;}});return found;}
function assertFinite(g,label){g.traverse(o=>{if(o.isMesh){assert.ok(o.geometry.attributes.position.array.every(Number.isFinite),label);if(o.geometry.attributes.normal)assert.ok(o.geometry.attributes.normal.array.every(Number.isFinite),label+' normals');assert.ok(o.matrixWorld.elements.every(Number.isFinite),label);if(Array.isArray(o.material))assert.ok(o.geometry.groups.length<=8,label+' splits material draw calls per triangle');}});}
function intersectsLegInterior(bounds,leg){
 const hip=leg.getWorldPosition(new T.Vector3()),knee=leg.userData.knee?.getWorldPosition(new T.Vector3())||leg.localToWorld(new T.Vector3(0,-8,0)),ankle=leg.userData.knee?leg.userData.knee.localToWorld(new T.Vector3(0,-9,0)):leg.localToWorld(new T.Vector3(0,-17,0));
 // Sample the two actual bone segments with the base leg's inner radius. Whole-leg
 // axis-aligned boxes exaggerate diagonal gait bounds and report false collisions.
 for(const [a,b]of [[hip,knee],[knee,ankle]])for(let i=0;i<=12;i++){const at=a.clone().lerp(b,i/12),closest=bounds.clampPoint(at,new T.Vector3());if(at.distanceTo(closest)<2.7)return true;}return false;
}
function assertLevel(object,label){const up=new T.Vector3(0,1,0).applyQuaternion(object.getWorldQuaternion(new T.Quaternion()));assert.ok(up.distanceTo(new T.Vector3(0,1,0))<1e-5,label+' tilts away from gravity');}

// Every unique photograph is exercised; branch copies share the same physical geometry.
test('all physical product models keep a wrist grip, stay upright and clear the floor across loaded arm poses',()=>{
 assert.ok(physical.length>100);
 for(const p of physical){const w=fixture(),g=w.player,{holder,model}=attachHeldProduct(w,g,p,1),limb=g.userData.limbs[1];
  for(const angle of [-1.45,-.9,-.2]){limb.rotation.x=angle;updateAttachmentFrames(g);g.updateMatrixWorld(true);const grip=holder.getWorldPosition(new T.Vector3()),bounds=new T.Box3().setFromObject(model);assertLevel(holder,p.name);assert.ok(Math.abs(bounds.max.y-grip.y)<1e-3,p.name+' is not held at its handle/hanger');assert.ok(bounds.min.y>=.9,p.name+' reaches the floor');assertFinite(model,p.name);}
  release(w);
 }
});

test('every bag photo fits while walking and seated without entering the thighs or bench back',()=>{
 assert.ok(bags.length>50);
 const benchBack=new T.Box3(new T.Vector3(-44,15.5,-12),new T.Vector3(44,38.5,-8));
 for(const p of bags){const w=fixture({bag:p}),g=w.player;
  for(const state of [{phase:0},{phase:1.2},{seated:true,phase:1.7,kind:'rest'},{seated:true,phase:2.3,kind:'eat'}]){pose(g,state);const fit=g.userData.bagFit;
   if(fit){const body=new T.Box3().setFromObject(fit.model);assert.ok(body.min.y>=.8,p.name+' reaches floor');for(const leg of g.userData.limbs.slice(2)){assert.ok(!intersectsLegInterior(body,leg),p.name+' intersects leg while '+(state.seated?'seated':'walking'));}if(state.seated)assert.ok(!body.intersectsBox(benchBack),p.name+' enters bench back');}
   for(const {holder}of g.userData.gravityAttachments||[])if(holder.visible)assertLevel(holder,p.name);assertFinite(g,p.name);
  }
  release(w);
 }
});

test('diverse garment cuts retain finite fitted geometry through walking, sitting and standing again',()=>{
 assert.ok(apparel.length>12);
 for(const p of apparel){const slot=['pants','shorts'].includes(p.type)?'bottom':'top',w=fixture({[slot]:p}),g=w.player;pose(g,{phase:0});const garment=productMeshes(g,p.id);assert.ok(garment.length,p.name+' has no worn geometry');const rest=new Map(garment.map(mesh=>[mesh,Array.from(mesh.geometry.attributes.position.array)]));
  pose(g,{phase:.8});pose(g,{seated:true,phase:1.1,kind:'rest'});assertFinite(g,p.name);
  let drape=0;for(const [mesh,positions]of rest){const after=mesh.geometry.attributes.position.array;for(let i=0;i<after.length;i++)drape=Math.max(drape,Math.abs(after[i]-positions[i]));assert.ok(new T.Box3().setFromObject(mesh,true).min.y>=-.1,p.name+' reaches below the floor');}
  const profile=garmentProfile(p);if(['dress','skirt'].includes(profile.kind)&&['midi','maxi'].includes(profile.length))assert.ok(drape>.05,p.name+' remains rigid over the seated legs');pose(g,{phase:0});
  for(const [mesh,positions]of rest){const after=mesh.geometry.attributes.position.array;assert.equal(after.length,positions.length,p.name);let delta=0;for(let i=0;i<after.length;i++)delta=Math.max(delta,Math.abs(after[i]-positions[i]));assert.ok(delta<1e-4,p.name+' does not restore its standing shape');}
  release(w);
 }
});

test('seated knee bends keep the soles level and above the floor, and reset after standing',()=>{
 const p=physical.find(p=>p.type==='pants'),w=fixture({bottom:p}),g=w.player;
 for(const state of [{phase:0},{phase:1.2},{seated:true,phase:2,kind:'rest'},{phase:0}]){pose(g,state);for(const leg of g.userData.limbs.slice(2)){const {knee,shoe}=leg.userData;assert.ok(knee&&shoe,'two-segment leg references are missing');assert.ok(new T.Box3().setFromObject(shoe).min.y>=-.05,'shoe enters floor');if(leg.userData.contact)assertLevel(shoe,'planted shoe');else {const up=new T.Vector3(0,1,0).applyQuaternion(shoe.getWorldQuaternion(new T.Quaternion()));assert.ok(up.angleTo(new T.Vector3(0,1,0))<=.131,'swing shoe exceeds bounded ankle roll');}if(state.seated)assert.ok(knee.rotation.x>.5,'seated knee remains straight');else if(!state.phase)assert.ok(Math.abs(knee.rotation.x)<.01,'standing knee remains bent');else assert.ok(knee.rotation.x>=0&&knee.rotation.x<2,'walk knee exceeds natural range');}}
 release(w);
});

test('consumable props attach to a real hand and are removed after their activity',()=>{
 for(const kind of ['eat','drink','icecream','tea']){const w=fixture(),g=w.player;w.avatar={x:0,y:0};w.layout={venues:[]};w.canvas={dataset:{animation:kind}};w.action={kind,startTime:performance.now()-1000,seat:{x:0,y:0},done(){}};w.finishAnimation=()=>MallWorld3D.prototype.finishAnimation.call(w);
  MallWorld3D.prototype.animatePose.call(w);updateOutfitPose(g,{seated:true,kind,time:1});g.updateMatrixWorld(true);const prop=w.prop;assert.ok(prop,kind+' prop missing');let ancestor=prop.parent;while(ancestor&&!g.userData.limbs.slice(0,2).includes(ancestor))ancestor=ancestor.parent;assert.ok(ancestor,kind+' floats independently of the hand');const wrist=ancestor.userData.grip.getWorldPosition(new T.Vector3());assert.ok(prop.getWorldPosition(new T.Vector3()).distanceTo(wrist)<1,kind+' misses the hand');w.finishAnimation();assert.equal(prop.parent,null,kind+' prop remains attached after completion');release(w);
 }
});
