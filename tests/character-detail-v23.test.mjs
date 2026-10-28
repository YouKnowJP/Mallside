import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import * as E from '../dist/engine.js';
import {MallWorld3D} from '../dist/world-3d.js';
import {updateOutfitPose,releasePersonResources} from '../dist/merchandise-fit.js';
import {poseHumanHands,updateHumanFace} from '../dist/human-anatomy.js';
const named=n=>E.PRODUCTS.find(p=>p.name===n);
function fixture(equipment={},appearance={}){const w={scene:new T.Scene(),resources:new Set(),state:E.createState()};for(const n of ['mat','mesh','box','ball','cyl'])w[n]=MallWorld3D.prototype[n];w.player=MallWorld3D.prototype.person.call(w,'#7e938a',appearance,equipment);return w;}
const release=w=>{releasePersonResources(w,w.player);for(const r of w.resources)r.dispose?.();};
const at=o=>o.getWorldPosition(new T.Vector3());

test('the rendered head and hands are anatomical weighted surfaces with independent finger chains',()=>{
 const w=fixture(),g=w.player,a=g.userData.anatomy;assert.ok(g.userData.head.isSkinnedMesh);assert.ok(g.userData.head.geometry.attributes.position.count>1000);assert.equal(a.skeleton.bones.length,53);assert.equal(a.fingers.length,30);g.updateMatrixWorld(true);const collarSkin=new T.Box3().setFromObject(a.meshes.get('neckline'),true);assert.ok(collarSkin.min.x< -5&&collarSkin.max.x>5,'shirt masking leaves missing shoulder skin around the collar');
 assert.ok((g.userData.rig.upperArm+g.userData.rig.forearm)/g.userData.rig.height<.34,'arms retain the old knee-length proportions');
 const hand=g.userData.limbs[1].userData.handMesh;g.updateMatrixWorld(true);const positions=[];for(let i=0;i<hand.geometry.attributes.position.count;i++)positions.push(hand.getVertexPosition(i,new T.Vector3()));
 const lengths=new Map(a.fingers.map(f=>[f.bone,at(f.bone).distanceTo(at(f.bone.parent))]));poseHumanHands(g,[1,1]);g.updateMatrixWorld(true);let motion=0;for(let i=0;i<positions.length;i++)motion=Math.max(motion,positions[i].distanceTo(hand.getVertexPosition(i,new T.Vector3())));assert.ok(motion>.25,'fingers never close around a grip');for(const [b,length]of lengths)assert.ok(Math.abs(at(b).distanceTo(at(b.parent))-length)<1e-5,'grasp changes a finger bone length');release(w);
});

test('blinking closes actual eyelid vertices and respects reduced motion',()=>{const w=fixture(),g=w.player,a=g.userData.anatomy,head=a.meshes.get('head');const t=(5.8-a.seed*.13%5.8+.085)%5.8;updateHumanFace(g,t,false);assert.ok(head.morphTargetInfluences[0]>.95);assert.equal(a.meshes.get('eyes').visible,false);updateHumanFace(g,t,true);assert.equal(head.morphTargetInfluences[0],0);assert.equal(a.meshes.get('eyes').visible,true);release(w);});

test('walking fabric has bounded motion and a long skirt naturally shortens the stride',()=>{
 const p=named('Madewell Smocked Waist Midi Dress'),w=fixture({top:p}),g=w.player;assert.ok(g.userData.rig.stepReach<10);updateOutfitPose(g,{});const records=(g.userData.poseCloth||[]).filter(r=>r.object.geometry&&!r.limbFloor),before=records.map(r=>new Float32Array(r.object.geometry.attributes.position.array));let movement=0;
 for(const distance of [2,7,13,19]){updateOutfitPose(g,{walking:true,distance});records.forEach((r,n)=>r.object.geometry.attributes.position.array.forEach((x,i)=>movement=Math.max(movement,Math.abs(x-before[n][i]))));}assert.ok(movement>.02&&movement<1,'hem stays rigid or stretches excessively');updateOutfitPose(g,{});records.forEach((r,n)=>assert.deepEqual(r.object.geometry.attributes.position.array,before[n]));release(w);
});

test('swaying shoulder straps remain attached to the actual bag lugs',()=>{
 for(const name of ['Round Mini Shoulder Bag','Tabby Shoulder Bag 26']){const w=fixture({bag:named(name)}),g=w.player,fit=g.userData.bagFit;assert.ok(fit);let angle=0;for(let distance=0;distance<80;distance+=3.7){updateOutfitPose(g,{walking:true,distance});angle=Math.max(angle,Math.abs(fit.model.rotation.z));for(const [i,strap]of fit.straps.entries())for(const end of [0,32]){const p=strap.mesh.geometry.attributes.position,center=new T.Vector3();for(let k=0;k<4;k++)center.add(new T.Vector3(p.getX(end*4+k),p.getY(end*4+k),p.getZ(end*4+k)));center.divideScalar(4);const source=fit.restStraps[i].points[end].clone().sub(fit.basePosition),expected=source.applyQuaternion(fit.model.quaternion).add(fit.model.position);assert.ok(center.distanceTo(expected)<.03,name+' strap loses contact during a step');}}assert.ok(angle>.005);release(w);}
});

test('hair and face styles survive save backups and saved looks without changing money',()=>{
 const s=E.createState();s.sandbox=true;s.cash=9000000;const p=E.byId('ross::nike-x9');E.checkout(s,p.store,[{id:p.id,size:E.idealSize(s,p)}]);E.useProduct(s,s.purchases.at(-1).id);s.appearance.hairStyle='bob';s.appearance.faceStyle='defined';const look=E.saveLook(s,'Bob and a tee'),cash=s.cash;s.appearance.hairStyle='short';s.appearance.faceStyle='natural';const copy=E.validateImport(JSON.stringify(s));E.applyLook(copy,look.id);assert.equal(copy.appearance.hairStyle,'bob');assert.equal(copy.appearance.faceStyle,'defined');assert.equal(copy.cash,cash);assert.deepEqual(copy.purchases,s.purchases);copy.appearance.hairStyle='missing';copy.appearance.faceStyle=null;const normalized=E.loadState(JSON.stringify(copy));assert.equal(normalized.appearance.hairStyle,'short');assert.equal(normalized.appearance.faceStyle,'natural');
});
