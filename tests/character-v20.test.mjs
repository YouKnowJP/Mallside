import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import * as E from '../dist/engine.js';
import {MallWorld3D} from '../dist/world-3d.js';
import {applyCharacterPose} from '../dist/character-rig.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
import {physicalProduct} from '../dist/merchandise-3d.js';
import {attachHeldProduct,updateAttachmentFrames,updateOutfitPose} from '../dist/merchandise-fit.js';
import {garmentProfile} from '../dist/garment-reference-rules.js';

const physical=[...new Map(E.PRODUCTS.filter(physicalProduct).map(p=>[PRODUCT_PHOTOS[p.id]?.path,p])).values()];
const bags=physical.filter(p=>['bag','crossbody','backpack','duffel','wallet'].includes(p.type));
const apparel=[...new Map(physical.filter(p=>['shirt','hoodie','jacket','cardigan','pants','shorts'].includes(p.type)).map(p=>{
 const cut=garmentProfile(p);return [[cut.kind,cut.sleeve,cut.length,cut.fit].join(':'),p];
})).values()];

function fixture(equipment={}){
 const w={scene:new T.Scene(),resources:new Set(),state:E.createState()};
 for(const method of ['box','ball','cyl','mat','mesh'])w[method]=MallWorld3D.prototype[method];
 w.player=MallWorld3D.prototype.person.call(w,'#bda581',{},equipment);
 return w;
}
function release(w){for(const r of w.resources)r.dispose?.();}
const at=object=>object.getWorldPosition(new T.Vector3());
function level(object,label){const up=new T.Vector3(0,1,0).applyQuaternion(object.getWorldQuaternion(new T.Quaternion()));assert.ok(up.distanceTo(new T.Vector3(0,1,0))<1e-5,label+' is not level');}
function near(actual,expected,tolerance,label){assert.ok(Math.abs(actual-expected)<=tolerance,`${label}: ${actual}, expected ${expected} ±${tolerance}`);}
function checkBones(g,label){
 g.updateMatrixWorld(true);
 for(const [i,arm]of g.userData.limbs.slice(0,2).entries()){
  const {elbow,hand,grip,upperLength,lowerLength}=arm.userData;
  assert.ok(elbow&&hand&&grip,label+' has no articulated hand');
  near(at(arm).distanceTo(at(elbow)),upperLength,1e-5,label+' upper arm '+i);
  near(at(elbow).distanceTo(at(hand)),lowerLength,1e-5,label+' forearm '+i);
  const palm=new T.Box3().setFromObject(arm.userData.handMesh,true).expandByScalar(.6);assert.ok(palm.containsPoint(at(grip)),label+' grip floats away from the anatomical hand');
 }
 for(const [i,leg]of g.userData.limbs.slice(2).entries()){
  const {knee,foot,upperLength,lowerLength}=leg.userData;
  near(at(leg).distanceTo(at(knee)),upperLength,1e-5,label+' thigh '+i);
  near(at(knee).distanceTo(at(foot)),lowerLength,1e-5,label+' shin '+i);
  level(foot,label+' foot '+i);
 }
 g.traverse(o=>assert.ok(o.matrixWorld.elements.every(Number.isFinite),label+' contains an invalid transform'));
}
function modelMeshes(g,id){const meshes=[];g.traverse(o=>{if(!o.isMesh)return;for(let p=o;p&&p!==g;p=p.parent)if(p.userData.productId===id){meshes.push(o);break;}});return meshes;}
function missesLegInterior(bounds,leg){
 const hip=at(leg),knee=at(leg.userData.knee),ankle=at(leg.userData.foot);
 for(const [a,b]of [[hip,knee],[knee,ankle]])for(let i=1;i<16;i++){
  const point=a.clone().lerp(b,i/16),closest=bounds.clampPoint(point,new T.Vector3());
  if(point.distanceTo(closest)<.8)return false;
 }
 return true;
}
function strapLength(mesh){
 // Measure the center of each rectangular cross-section in the generated solid.
 const p=mesh.geometry.attributes.position;let previous,total=0;
 for(let i=0;i+3<p.count;i+=4){
  const center=new T.Vector3();for(let j=0;j<4;j++)center.add(new T.Vector3(p.getX(i+j),p.getY(i+j),p.getZ(i+j)));
  center.divideScalar(4).applyMatrix4(mesh.matrixWorld);if(previous)total+=previous.distanceTo(center);previous=center;
 }
 return total;
}
function maxEdgeStretch(mesh,rest){
 const p=mesh.geometry.attributes.position,index=mesh.geometry.index;let worst=1;
 for(let i=0;i<(index?.count??p.count);i+=3){
  const ids=[0,1,2].map(k=>index?index.getX(i+k):i+k);
  for(let j=0;j<3;j++){
   const a=ids[j],b=ids[(j+1)%3],before=Math.hypot(rest[a*3]-rest[b*3],rest[a*3+1]-rest[b*3+1],rest[a*3+2]-rest[b*3+2]);
   if(before<.1)continue;
   const after=Math.hypot(p.getX(a)-p.getX(b),p.getY(a)-p.getY(b),p.getZ(a)-p.getZ(b));worst=Math.max(worst,after/before);
  }
 }
 return worst;
}

test('adult shoppers have separate elbows, wrists, knees and ankles with invariant bone lengths',()=>{
 const w=fixture(),g=w.player,rig=g.userData.rig;
 assert.equal(rig.profile,'adult-v23');
 const headBounds=new T.Box3().setFromObject(g.userData.head,true),bodyBounds=new T.Box3().setFromObject(g,true);
 const headFraction=(headBounds.max.y-headBounds.min.y)/(bodyBounds.max.y-bodyBounds.min.y);
 assert.ok(headFraction>.12&&headFraction<.20,'head occupies an implausible fraction of the adult silhouette');
 assert.ok(rig.shoulderHeight>rig.hipHeight+12,'torso is compressed');
 for(const angle of [0,.7,-2.4])for(const state of [{},{walking:true,distance:2.3},{walking:true,distance:13.4},{walking:true,distance:29.8},{seated:true,blend:.25,kind:'rest'},{seated:true,blend:.75,kind:'rest'},{seated:true,kind:'rest'},{kind:'try'}]){
  g.rotation.y=angle;applyCharacterPose(g,state);checkBones(g,JSON.stringify(state));
 }
 release(w);
});

test('standing and reduced-motion shoppers place both complete soles on the floor',()=>{
 const w=fixture(),g=w.player;
 for(const state of [{},{walking:true,distance:17,reducedMotion:true},{seated:true,blend:0,kind:'rest'}]){
  applyCharacterPose(g,state);g.updateMatrixWorld(true);
  for(const leg of g.userData.limbs.slice(2)){
   const sole=new T.Box3().setFromObject(leg.userData.foot,true);
   near(sole.min.y,0,.12,'standing sole contact');level(leg.userData.foot,'standing sole');
  }
 }
 release(w);
});

test('stance footprints remain fixed in the world as the shopper advances',()=>{
 const w=fixture(),g=w.player;
 // Observe each stance interval, rather than trusting the pose contact flag.
 for(const [index,start]of [[0,0],[1,20],[0,40],[1,60]]){
  let footprint;
  for(let distance=start+.25;distance<start+20;distance+=.5){
   g.position.z=distance;applyCharacterPose(g,{walking:true,distance});g.updateMatrixWorld(true);
   const foot=g.userData.limbs[index+2].userData.foot,point=at(foot),sole=new T.Box3().setFromObject(foot,true);
   footprint??=point.clone();
   near(point.x,footprint.x,.02,'stance footprint x');near(point.z,footprint.z,.02,'stance footprint z');
   near(sole.min.y,0,.12,'stance sole contact');
  }
 }
 release(w);
});

test('walking has a clear swing phase without floor penetration or changing leg lengths',()=>{
 const w=fixture(),g=w.player,maxLift=[0,0];
 for(let distance=0;distance<=80;distance+=.5){
  g.position.z=distance;applyCharacterPose(g,{walking:true,distance});checkBones(g,'walk '+distance);
  for(const [i,leg]of g.userData.limbs.slice(2).entries()){
   const sole=new T.Box3().setFromObject(leg.userData.foot,true).min.y;
   assert.ok(sole>=-.06,'swing sole enters floor at '+distance);maxLift[i]=Math.max(maxLift[i],sole);
  }
 }
 assert.ok(maxLift.every(lift=>lift>1.5),'feet never lift clear of the floor');
 release(w);
});

test('sitting and standing transitions keep feet grounded and end with the pelvis on the seat',()=>{
 const w=fixture(),g=w.player;
 for(const seatHeight of [15,17]){
  const forward=Array.from({length:21},(_,i)=>i/20),roundTrip=[...forward,...forward.toReversed()];
  for(const blend of roundTrip){
   applyCharacterPose(g,{seated:true,kind:'rest',blend,seatHeight});checkBones(g,'sit '+blend);
   for(const leg of g.userData.limbs.slice(2))near(new T.Box3().setFromObject(leg.userData.foot,true).min.y,0,.12,'transition sole contact');
   if(blend===1){
    near(new T.Box3().setFromObject(g.userData.pelvis,true).min.y,seatHeight,.12,'pelvis rests on seat');
    assert.ok(g.userData.limbs.slice(2).every(leg=>leg.userData.knee.rotation.x>.5),'seated knees remain straight');
   }
  }
 }
 release(w);
});

test('walk, sit, try and idle pose round trips do not accumulate transform drift',()=>{
 const w=fixture(),g=w.player;
 applyCharacterPose(g,{});g.updateMatrixWorld(true);
 const references=new Map();g.traverse(o=>references.set(o,o.matrixWorld.clone()));
 for(let i=0;i<12;i++){
  applyCharacterPose(g,{walking:true,distance:i*7.3,time:i});applyCharacterPose(g,{seated:true,kind:'rest',blend:i%3/2});applyCharacterPose(g,{kind:'try',time:i});
 }
 applyCharacterPose(g,{});g.updateMatrixWorld(true);
 for(const [object,matrix]of references)for(let i=0;i<16;i++)near(object.matrixWorld.elements[i],matrix.elements[i],1e-6,'pose round-trip transform');
 release(w);
});

test('real products remain at the articulated grip and upright after elbow bends and root turns',()=>{
 assert.ok(physical.length>100,'catalog sample unexpectedly shrank');
 // Every unique reference model is checked; copied branch stock uses the same model.
 for(const p of physical){
  const w=fixture(),g=w.player,{holder,model}=attachHeldProduct(w,g,p,1);
  for(const [index,state]of [{},{walking:true,distance:11.2},{seated:true,kind:'rest'},{seated:true,kind:'drink'}].entries()){
   g.rotation.y=index*.63;updateOutfitPose(g,state);updateAttachmentFrames(g);g.updateMatrixWorld(true);
   const limb=g.userData.limbs[holder.userData.limbIndex??1],grip=at(limb.userData.grip),bounds=new T.Box3().setFromObject(model,true);
   if(holder.userData.parked)near(bounds.min.y,15,.16,p.name+' parked product rests on seat');
   else assert.ok(at(holder).distanceTo(grip)<.03,p.name+' misses the actual hand grip');
   level(holder,p.name+' product');near(bounds.max.y,at(holder).y,.03,p.name+' handle contact');
   assert.ok(bounds.min.y>=-.06,p.name+' penetrates the floor');checkBones(g,p.name);
  }
  release(w);
 }
});

test('every carried bag clears leg interiors and the bench back while walking and seated',()=>{
 assert.ok(bags.length>50,'bag sample unexpectedly shrank');
 const benchBack=new T.Box3(new T.Vector3(-44,15.5,-12),new T.Vector3(44,38.5,-8));
 for(const p of bags){
  const w=fixture({bag:p}),g=w.player;
  for(const state of [{},{walking:true,distance:3.2},{walking:true,distance:14.6},{seated:true,kind:'rest'},{seated:true,kind:'eat'}]){
   updateOutfitPose(g,state);g.updateMatrixWorld(true);
   const fit=g.userData.bagFit,held=(g.userData.gravityAttachments||[]).find(a=>a.holder.userData.productId===p.id),model=fit?.model||held?.holder.userData.model;
   assert.ok(model,p.name+' has no visible equipped model');const bounds=new T.Box3().setFromObject(model,true);
   assert.ok(bounds.min.y>=-.06,p.name+' enters floor');
   for(const leg of g.userData.limbs.slice(2))assert.ok(missesLegInterior(bounds,leg),p.name+' enters leg interior during '+JSON.stringify(state));
   if(state.seated){
    assert.ok(!bounds.intersectsBox(benchBack),p.name+' enters bench back');
    if(fit)near(bounds.min.y,15,.16,p.name+' rests on seat instead of floating');
   }
  }
  release(w);
 }
});

test('diverse fitted garments stay finite, above the floor and restore their shape after seating',()=>{
 assert.ok(apparel.length>12,'garment sample unexpectedly shrank');
 for(const p of apparel){
  const slot=['pants','shorts'].includes(p.type)?'bottom':'top',w=fixture({[slot]:p}),g=w.player;
  updateOutfitPose(g,{});g.updateMatrixWorld(true);const meshes=modelMeshes(g,p.id);
  assert.ok(meshes.length,p.name+' has no fitted geometry');
  const rest=new Map(meshes.map(m=>[m,new Float32Array(m.geometry.attributes.position.array)]));
  for(const state of [{walking:true,distance:6.7},{walking:true,distance:25.1},{seated:true,blend:.4,kind:'rest'},{seated:true,kind:'rest'},{seated:true,blend:.4,kind:'rest'},{}]){
   updateOutfitPose(g,state);g.updateMatrixWorld(true);
   for(const mesh of meshes){
    assert.ok(mesh.geometry.attributes.position.array.every(Number.isFinite),p.name+' has invalid garment coordinates');
    assert.ok(mesh.geometry.attributes.normal?.array.every(Number.isFinite),p.name+' has invalid garment normals');
    assert.ok(new T.Box3().setFromObject(mesh,true).min.y>=-.15,p.name+' passes through floor');
   }
  }
  for(const [mesh,positions]of rest){const after=mesh.geometry.attributes.position.array;assert.equal(after.length,positions.length);for(let i=0;i<after.length;i++)near(after[i],positions[i],1e-4,p.name+' standing cloth restoration');}
  release(w);
 }
});

test('bag straps do not lengthen as the shopper lowers the bag onto the bench',()=>{
 for(const p of bags){
  const w=fixture({bag:p}),g=w.player,fit=g.userData.bagFit;
  if(fit){
   updateOutfitPose(g,{});g.updateMatrixWorld(true);const rest=fit.straps.reduce((sum,s)=>sum+strapLength(s.mesh),0);
   assert.ok(rest>1,p.name+' has no measurable strap');
   for(const blend of [.1,.25,.4,.5,.6,.7,.75,.9,1,.7,.4,0]){
    updateOutfitPose(g,{seated:true,blend,kind:'rest'});g.updateMatrixWorld(true);
    const length=fit.straps.reduce((sum,s)=>sum+strapLength(s.mesh),0);
    assert.ok(length<=rest*1.10+.01,`${p.name} strap stretches ${(length/rest).toFixed(3)}× while seating blend=${blend}`);
   }
  }
  release(w);
 }
});

test('seated cloth deformation does not multiply the length of fabric edges',()=>{
 for(const p of apparel){
  const slot=['pants','shorts'].includes(p.type)?'bottom':'top',w=fixture({[slot]:p}),g=w.player;
  updateOutfitPose(g,{});const rest=new Map((g.userData.poseCloth||[]).filter(({object,limbFloor})=>object.geometry&&!limbFloor).map(({object})=>[object,new Float32Array(object.geometry.attributes.position.array)]));
  for(const blend of [.2,.4,.6,.8,1,.6,.2,0]){
   updateOutfitPose(g,{seated:true,blend,kind:'rest'});
   for(const [mesh,positions]of rest){const stretch=maxEdgeStretch(mesh,positions);assert.ok(stretch<=2,`${p.name} stretches a fabric edge ${stretch.toFixed(3)}× at seat blend=${blend}`);}
  }
  release(w);
 }
});
