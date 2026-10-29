import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import * as E from '../dist/engine.js';
import {environmentPixels,beveledBox,cameraComposition,sampleRoute,palmFrondGeometry,surfaceTexture,buildSceneAccents,updateSceneAccents} from '../dist/scene-finish.js';
import {releasePersonResources} from '../dist/merchandise-fit.js';

test('original reflection panoramas contain deterministic linear HDR light and finite texels',()=>{
 for(const indoor of [false,true]){const a=environmentPixels(indoor,64,32),b=environmentPixels(indoor,64,32);assert.deepEqual(a,b);assert.equal(a.data.length,64*32*4);let peak=0;for(let i=0;i<a.data.length;i+=4){for(const c of a.data.slice(i,i+3)){assert.ok(Number.isFinite(c)&&c>=0&&c<9);peak=Math.max(peak,c);}assert.equal(a.data[i+3],1);}assert.ok(peak>1,'light panels preserve HDR radiance');}
 assert.notDeepEqual(environmentPixels(true,16,8).data,environmentPixels(false,16,8).data);
 const sky=environmentPixels(false,64,32);assert.ok(sky.data[(31*64)*4+2]>sky.data[2],'equirectangular positive-Y sky occupies the upper texture rows');
});
test('beveled architecture keeps its exact collision envelope and unit outward normals',()=>{
 for(const dims of [[1,1,1],[240,108,148],[150,44,60],[3,74,20]]){const g=beveledBox(...dims);for(let axis=0;axis<3;axis++){const key=['x','y','z'][axis];assert.ok(Math.abs(g.boundingBox.min[key]+dims[axis]/2)<1e-5);assert.ok(Math.abs(g.boundingBox.max[key]-dims[axis]/2)<1e-5);}const p=g.attributes.position,n=g.attributes.normal;for(let i=0;i<p.count;i++){const length=Math.hypot(n.getX(i),n.getY(i),n.getZ(i));assert.ok(Math.abs(length-1)<1e-5);assert.ok(p.getX(i)*n.getX(i)+p.getY(i)*n.getY(i)+p.getZ(i)*n.getZ(i)>0);}assert.ok(g.index.count<400);g.dispose();}
});
test('closer camera views retain a positive raised option and stable zoom scaling',()=>{
 for(const inside of [false,true])for(const zoom of [.5,1,2]){const close=cameraComposition('promenade',inside,zoom),raised=cameraComposition('raised',inside,zoom);assert.ok(close.altitude<raised.altitude);assert.ok(close.lookHeight>raised.lookHeight);assert.ok(close.distance>0&&close.altitude>0);}
 assert.deepEqual(cameraComposition('promenade',false,NaN),cameraComposition('promenade',false,1));assert.equal(cameraComposition('raised',false,2).distance*2,cameraComposition('raised',false,1).distance);
});
test('route beads follow the actual polyline through turns without shortcutting obstacles',()=>{
 const a={x:0,y:0},path=[a,{x:100,y:0},{x:100,y:100}],dots=sampleRoute(a,path,{spacing:25});assert.deepEqual(dots,[{x:25,y:0},{x:50,y:0},{x:75,y:0},{x:100,y:0},{x:100,y:25},{x:100,y:50},{x:100,y:75},{x:100,y:100}]);assert.deepEqual(sampleRoute(a,[]),[]);assert.deepEqual(sampleRoute(a,[a,a]),[]);assert.equal(sampleRoute(a,[{x:10000,y:0}]).length,27);assert.equal(sampleRoute(a,[{x:10000,y:0}],{max:5}).length,5);
});
test('shared finish textures keep color and bump data in their appropriate color spaces',()=>{
 const w={resources:new Set(),finishTextures:new Map()};for(const kind of ['stone','timber','fabric']){const color=surfaceTexture(w,kind),bump=surfaceTexture(w,kind,true);assert.equal(color.colorSpace,T.SRGBColorSpace);assert.equal(bump.colorSpace,T.NoColorSpace);assert.equal(surfaceTexture(w,kind),color);assert.notEqual(color,bump);assert.equal(color.wrapS,T.RepeatWrapping);assert.ok(color.image.data.some(v=>v!==255));}assert.equal(w.resources.size,6);for(const t of w.resources)t.dispose();
});
test('palm fronds have separated leaflet silhouettes and finite smooth geometry',()=>{
 const g=palmFrondGeometry();assert.ok(g.attributes.position.count>=60&&g.attributes.position.count<150);assert.ok(g.boundingSphere.radius>0);for(const name of ['position','normal','uv'])for(const v of g.attributes[name].array)assert.ok(Number.isFinite(v));g.dispose();
});
test('changing outfits releases actor resources while retaining shared fabric finishes',()=>{
 const texture=new T.Texture(),material=new T.MeshStandardMaterial({bumpMap:texture}),geometry=new T.BoxGeometry(),person=new T.Group();person.add(new T.Mesh(geometry,material));const w={resources:new Set([texture,material,geometry]),finishTextures:new Map([['fabric',texture]])};let textureDisposed=false,materialDisposed=false;texture.addEventListener('dispose',()=>textureDisposed=true);material.addEventListener('dispose',()=>materialDisposed=true);releasePersonResources(w,person);assert.equal(textureDisposed,false);assert.equal(materialDisposed,true);assert.ok(w.resources.has(texture));assert.ok(!w.resources.has(material));texture.dispose();
});
test('legacy camera settings migrate safely and the guide preference persists without affecting purchases',()=>{
 const s=E.createState();delete s.preferences.cameraMode;delete s.preferences.showGuide;const old=E.loadState(JSON.stringify(s));assert.equal(old.preferences.cameraMode,'promenade');assert.equal(old.preferences.showGuide,true);s.preferences.cameraMode='raised';s.preferences.showGuide=false;const copy=E.validateImport(JSON.stringify(s));assert.equal(copy.preferences.cameraMode,'raised');assert.equal(copy.preferences.showGuide,false);assert.equal(copy.cash,s.cash);assert.deepEqual(copy.purchases,s.purchases);s.preferences.cameraMode='invalid';assert.equal(E.loadState(JSON.stringify(s)).preferences.cameraMode,'promenade');
});

test('contact shadows forget removed shoppers instead of retaining disposed outfit rigs',()=>{const scene=new T.Scene(),live=new T.Group(),removed=new T.Group();scene.add(live);const w={scene,resources:new Set(),contactActors:[live,removed],canvas:{dataset:{}},state:{preferences:{}},player:live,avatar:{x:0,y:0},path:[],sceneLabels:[]};buildSceneAccents(w);updateSceneAccents(w);assert.deepEqual(w.contactActors,[live]);assert.equal(w.contactShadows.count,1);for(const r of w.resources)r.dispose?.();});
