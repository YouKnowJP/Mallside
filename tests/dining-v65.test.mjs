import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import {interiorLayout,spatialLayout} from '../dist/spatial-layout.js';
import {clearWalk,walkable} from '../dist/free-navigation.js';
import {DINING_SEATS,diningSeat} from '../dist/dining-presentation.js';
import {mealHandPose} from '../dist/consumption-motion.js';
import {foodHallSeat,buildFoodHallCounter} from '../dist/dining-interior.js';
import {MallWorld3D} from '../dist/world-3d.js';
import * as T from '../dist/vendor/three.module.js';

test('both dining seat approaches remain reachable from every unfinished dining room entrance',()=>{
 const stores=E.STORES.filter(store=>store.catalogStatus==='pending'&&store.businessKind==='food');
 assert.ok(stores.length>=90);
 for(const store of stores){
  const layout=interiorLayout(store,E.FLOORPLANS[store.mallId],6);
  const [left,right]=DINING_SEATS.map(choice=>diningSeat(layout,choice.id));
  assert.ok(left.x<right.x);
  for(const seat of [left,right]){
   assert.equal(walkable(seat.approach,layout.nav),true,store.id);
   assert.equal(clearWalk(layout.spawn,seat.approach,layout.nav),true,store.id);
  }
  assert.equal(diningSeat(layout,'invalid'),null);
 }
});

test('a full meal waits for seating and returns the hand before standing',()=>{
 const rest=[{x:-9,y:21,z:2},{x:9,y:21,z:2}];
 for(const kind of ['eat','drink','icecream']){
  const start=mealHandPose(kind,.59,false,rest);
  const middle=mealHandPose(kind,1.9,false,rest);
  const end=mealHandPose(kind,7.41,false,rest);
  assert.deepEqual(start.right,rest[1]);
  assert.deepEqual(end.right,rest[1]);
  assert.equal(start.visible,false);
  assert.equal(end.visible,false);
  assert.ok(middle.lift>.5&&middle.visible);
  assert.deepEqual(mealHandPose(kind,0,true,rest),mealHandPose(kind,8,true,rest));
 }
});


test('food hall diners face the public approach and the counter leaves their seated pose visible',()=>{
 let checked=0;
 for(const mall of E.MALLS)for(let floor=0;floor<E.FLOORPLANS[mall.id].levels.length;floor++){
  const l=spatialLayout(mall,floor,E.STORES),venue=l.venues.find(v=>v.id==='food');
  if(!venue)continue;
  const w={scene:new T.Scene(),resources:new Set(),canvas:{dataset:{}}};
  for(const name of ['mat','mesh','box','cyl','ball','bench'])w[name]=MallWorld3D.prototype[name].bind(w);
  const counter=buildFoodHallCounter(w,venue),seat=foodHallSeat(venue);
  const front=new T.Vector3(Math.sin(seat.rotation),0,Math.cos(seat.rotation));
  const door=new T.Vector3(venue.door.x-seat.x,0,venue.door.y-seat.y);
  assert.ok(door.dot(front)>0,mall.id);
  const body=new T.Vector3(seat.x,26,seat.y).addScaledVector(front,8);
  const camera=body.clone().addScaledVector(front,seat.cameraDistance).setY(77);
  assert.equal(walkable({x:camera.x,y:camera.z},l.nav),true,mall.id+' camera approach');
  const toBody=body.clone().sub(camera);
  w.scene.updateMatrixWorld(true);
  const ray=new T.Raycaster(camera,toBody.clone().normalize(),0,toBody.length()-.5);
  assert.deepEqual(ray.intersectObject(counter,true),[],mall.id+' food hall sightline');
  checked++;
 }
 assert.equal(checked,E.MALLS.length);
});
