import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import * as T from '../dist/vendor/three.module.js';
import * as E from '../dist/engine.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
import {PHOTO_PALETTES} from '../dist/photo-palettes.js';
import {productAppearance} from '../dist/product-appearance.js';
import {strapGeometry,addChainLinks} from '../dist/merchandise-details.js';
import {referenceMaterial} from '../dist/merchandise-materials.js';
import {createMerchandise,physicalProduct} from '../dist/merchandise-3d.js';
import {attachHeldProduct,updateAttachmentFrames,fitScaleForSize} from '../dist/merchandise-fit.js';
import {interiorPlan,shopProfile} from '../dist/shop-interiors.js';
import {buildStoreFitout} from '../dist/store-fitout.js';
import {MallWorld3D} from '../dist/world-3d.js';

const named=name=>E.PRODUCTS.find(p=>p.name===name)||E.PRODUCTS.find(p=>p.name.startsWith(name));
function fixture(equipment={}){const w={scene:new T.Scene(),resources:new Set(),state:E.createState()};for(const method of ['box','ball','cyl','mat','mesh'])w[method]=MallWorld3D.prototype[method];w.player=MallWorld3D.prototype.person.call(w,'#cca780',{},equipment);return w;}
function release(w){for(const r of w.resources)r.dispose?.();}
function all(g,role){const found=[];g.traverse(o=>{if(o.userData.role===role)found.push(o);});return found;}

test('every physical listing uses an existing-photo palette whose checksum matches its local reference',()=>{
 const photos=new Set();let listings=0;
 for(const p of E.PRODUCTS.filter(physicalProduct)){const path=PRODUCT_PHOTOS[p.id]?.path,a=productAppearance(p);assert.ok(PHOTO_PALETTES[path],p.id);assert.match(a.color,/^#[0-9a-f]{6}$/);assert.ok(['reviewed-photograph','photo-sample'].includes(a.colorEvidence));photos.add(path);listings++;}
 assert.equal(listings,3025);assert.equal(photos.size,770);
 for(const path of photos){const sha=createHash('sha256').update(readFileSync(new URL('../dist/'+path,import.meta.url))).digest('hex').slice(0,16);assert.equal(PHOTO_PALETTES[path].sha256,sha,path);}
});
test('reviewed photographed variants replace generic category colors',()=>{
 for(const [name,color]of [['SUPIMA Cotton Crew Neck T-Shirt','#646d6c'],['Round Mini Shoulder Bag','#59364f'],['Tabby Shoulder Bag 26','#542037'],['Neverfull MM','#e3d2b9'],['Le Pliage Original L tote bag','#263c48']]){const a=productAppearance(named(name));assert.equal(a.color,color,name);assert.equal(a.colorEvidence,'reviewed-photograph');}
});
test('model-specific measurements and finishes follow the pictured variant, including CFQ88 glazed leather',()=>{
 for(const [name,dimensions,finish]of [['Round Mini Shoulder Bag',[28,17,10],'nylon'],['Tabby Shoulder Bag 26',[25.4,13.97,6.985],'glazed'],['Speedy Bandoulière 25',[25,19,15],'canvas'],['Neverfull MM',[47,28,14],'canvas'],['Le Pliage Original L tote bag',[47,30,19],'nylon']]){const p=named(name),a=productAppearance(p),model=createMerchandise(p,{bodyOnly:true});assert.deepEqual([a.width,a.height,a.depth],dimensions,name);assert.equal(a.finish,finish);assert.ok(a.source.startsWith('https://'));assert.deepEqual(Object.values(model.userData.bodyDimensions),dimensions);assert.ok(model.userData.size.y<a.height+3,name);}
 assert.equal(productAppearance(named('Neverfull MM')).baseWidth,31);assert.equal(productAppearance(named('Tabby Shoulder Bag 26')).handleDrop,24.13);
 const other=productAppearance({...named('Tabby Shoulder Bag 26'),source:'https://example.com/other-tabby'});assert.equal(other.dimensionsVerified,false);
});
test('curved solid surfaces use deterministic grain, quilt and monogram textures with distinct material responses',()=>{
 const textures=new Set();for(const [finish,pattern]of [['cotton',''],['denim',''],['nylon',''],['canvas','lv'],['pebble','diamond'],['leather','woven'],['glazed','']]){const m=referenceMaterial({color:'#542037',trim:'#332222',hardware:'#cab787',finish,pattern});assert.ok(m.map.isDataTexture&&m.bumpMap.isDataTexture);assert.equal(m.map.colorSpace,T.SRGBColorSpace);assert.equal(m.bumpMap.colorSpace,T.NoColorSpace);assert.equal(m.map.image.width,128);textures.add(createHash('sha256').update(m.map.image.data).digest('hex'));if(finish==='glazed')assert.ok(m.clearcoat>.4&&m.roughness<.4);m.map.dispose();m.bumpMap.dispose();m.dispose();}assert.equal(textures.size,7);const quilt=referenceMaterial({...productAppearance(named('Tabby Shoulder Bag 26')),surface:null,width:25.5,height:15.5,pattern:'diamond'});assert.equal(quilt.map.repeat.x,25.5/24);assert.equal(quilt.map.repeat.y,15.5/24);quilt.map.dispose();quilt.bumpMap.dispose();quilt.dispose();
});
test('sleeves and trouser legs articulate with the actual arm and leg pivots',()=>{
 const top=E.PRODUCTS.find(p=>p.type==='hoodie'),bottom=E.PRODUCTS.find(p=>p.type==='pants'),w=fixture({top,bottom}),g=w.player,sleeves=all(g,'sleeve'),legs=all(g,'trouser-leg');assert.equal(sleeves.length,2);assert.equal(legs.length,2);assert.equal(g.userData.torso.visible,false);
 for(const [i,sleeve]of sleeves.entries()){const limb=g.userData.limbs[i];assert.equal(sleeve.parent,limb);g.updateMatrixWorld(true);const mesh=sleeve.children[0],before=mesh.getWorldPosition(new T.Vector3());limb.rotation.x=.65;g.updateMatrixWorld(true);assert.ok(mesh.getWorldPosition(new T.Vector3()).distanceTo(before)>limb.userData.upperLength*.2);assert.equal(limb.userData.upper.visible,false);}
 for(const [i,leg]of legs.entries())assert.equal(leg.parent,g.userData.limbs[i+2]);release(w);
});
test('the worn shirt shell faces outward and its sleeves cover the base arm without a floating torso',()=>{
 const w=fixture({top:named('SUPIMA Cotton Crew Neck T-Shirt')}),body=all(w.player,'worn-top')[0].children[0],pos=body.geometry.attributes.position,n=body.geometry.attributes.normal;let outward=0;for(let i=0;i<pos.count;i++)outward+=pos.getX(i)*n.getX(i)+pos.getZ(i)*n.getZ(i);assert.ok(outward>0);body.geometry.computeBoundingBox();assert.ok(body.geometry.boundingBox.min.y<w.player.userData.rig.hipHeight+2);assert.ok(body.geometry.boundingBox.max.y>w.player.userData.rig.shoulderHeight);
 for(const sleeve of all(w.player,'sleeve')){assert.equal(sleeve.children[0].geometry.parameters.openEnded,false);assert.ok(sleeve.children[0].geometry.parameters.radiusBottom>1.5);}release(w);
});
test('held products grip at a wrist, stay upright through arm poses, and clear the floor',()=>{
 for(const name of ['SUPIMA Cotton Crew Neck T-Shirt','Round Mini Shoulder Bag','Neverfull MM']){const w=fixture(),g=w.player,{holder,model}=attachHeldProduct(w,g,named(name),1),limb=g.userData.limbs[1];assert.equal(holder.parent,limb.userData.grip);assert.deepEqual(holder.position.toArray(),[0,0,0]);
  for(const angle of [-1.45,-1.22,-.9]){limb.rotation.x=angle;updateAttachmentFrames(g);g.updateMatrixWorld(true);const grip=holder.getWorldPosition(new T.Vector3()),up=new T.Vector3(0,1,0).applyQuaternion(holder.getWorldQuaternion(new T.Quaternion())),bounds=new T.Box3().setFromObject(model);assert.ok(up.distanceTo(new T.Vector3(0,1,0))<1e-6);assert.ok(Math.abs(bounds.max.y-grip.y)<1e-4);assert.ok(bounds.min.y>0,name+' touches floor');}release(w);}
});
test('crossbody and shoulder bags sit outside the torso with connected 3D straps',()=>{
 for(const name of ['Round Mini Shoulder Bag','Tabby Shoulder Bag 26','Neverfull MM','Le Pliage Original L tote bag']){const w=fixture({bag:named(name)}),group=all(w.player,'worn-bag')[0],model=group.children[0],bounds=new T.Box3().setFromObject(model);assert.ok(bounds.min.y>0);assert.ok(bounds.max.y< w.player.userData.rig.shoulderHeight);assert.ok(group.children.length>=2);if(group.userData.carry==='shoulder')assert.ok(bounds.min.x>=8.9);else assert.ok(bounds.min.z>3.5);release(w);}
});
test('preview and purchase sizes apply controlled ease without mutating catalog identity',()=>{
 assert.ok(fitScaleForSize('L','M')>1);assert.ok(fitScaleForSize('S','M')<1);assert.ok(fitScaleForSize('36','32')>1);assert.equal(fitScaleForSize('bad','M'),1);
 const p=named('SUPIMA Cotton Crew Neck T-Shirt'),small=fixture({top:{...p,gameSize:'S'}}),large=fixture({top:{...p,gameSize:'L'}}),body=w=>all(w.player,'worn-top')[0].children[0];body(small).geometry.computeBoundingBox();body(large).geometry.computeBoundingBox();assert.ok(body(large).geometry.boundingBox.max.x>body(small).geometry.boundingBox.max.x);assert.equal(p.gameSize,undefined);release(small);release(large);
});

test('straps have solid side walls and end caps, while chain handles instance their metal links',()=>{
 const points=[[-6,0,0],[-4,12,0],[4,12,0],[6,0,0]],geometry=strapGeometry(points,1.6,.25),p=geometry.attributes.position;assert.ok(p.array.every(Number.isFinite));assert.ok(geometry.index.count>700);geometry.computeBoundingBox();assert.ok(geometry.boundingBox.max.z-geometry.boundingBox.min.z>=.25);
 const parent=new T.Group(),material=new T.MeshStandardMaterial(),links=addChainLinks(parent,points,material);assert.ok(links.isInstancedMesh);assert.ok(links.count>20);assert.equal(parent.children.length,1);geometry.dispose();links.geometry.dispose();material.dispose();
});

test('styling counters leave the actual fitting position and worn bag unobstructed',()=>{
 for(const brand of ['coach','apple']){const store=E.storeById(brand),w=fixture(),layout=interiorPlan(store,E.FLOORPLANS.orange),profile=shopProfile(store,E.PRODUCTS);w.canvas={dataset:{}};w.interiorStops=[];w.storeStaff=[];w.clickables=[];w.person=(...args)=>MallWorld3D.prototype.person.call(w,...args);w.photo=w.label=()=>new T.Group();w.tag=MallWorld3D.prototype.tag;
  buildStoreFitout(w,store,profile,layout,store.products.slice(0,6));let counters=0;w.scene.traverse(o=>{const p=o.geometry?.parameters;if(p?.width===59&&p?.height===2&&p?.depth===78)assert.ok(new T.Box3().setFromObject(o).max.y<=0,'fitting inlay covers the shoes');if(p?.width===42&&p?.height===5&&p?.depth===25){counters++;for(const room of layout.fittingRooms)if(o.position.x===room.x){const b=new T.Box3().setFromObject(o);assert.ok(b.max.z<room.y-12,store.name+' counter obstructs fitting position');}}});assert.equal(counters,2);release(w);
 }
});
