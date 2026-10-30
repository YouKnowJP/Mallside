import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import * as E from '../dist/engine.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
import {PHOTO_SURFACES} from '../dist/photo-surfaces.js';
import {garmentProfile} from '../dist/garment-reference-rules.js';
import {bagProfile} from '../dist/bag-reference-rules.js';
import {productAppearance} from '../dist/product-appearance.js';
import {referenceMaterial,photoRegionForAspect} from '../dist/merchandise-materials.js';
import * as T from '../dist/vendor/three.module.js';
import {MallWorld3D} from '../dist/world-3d.js';
import {releasePersonResources} from '../dist/merchandise-fit.js';
import {physicalProduct} from '../dist/merchandise-3d.js';
const physical=E.PRODUCTS.filter(physicalProduct),unique=[...new Map(physical.map(p=>[PRODUCT_PHOTOS[p.id].path,p])).values()];

test('every clothing and bag photograph has checksum-bound surface and proportion evidence',()=>{
 assert.equal(unique.length,766);assert.equal(physical.length,3017);
 for(const p of unique){const path=PRODUCT_PHOTOS[p.id].path,s=PHOTO_SURFACES[path];assert.ok(s,p.id);assert.equal(s.sha256,createHash('sha256').update(readFileSync(new URL('../dist/'+path,import.meta.url))).digest('hex').slice(0,16));assert.ok(s.aspect>.2&&s.aspect<3.5);assert.equal(s.grid.length,s.size[0]*s.size[1]);assert.ok(s.colors.every(c=>/^#[0-9a-f]{6}$/.test(c)));assert.ok([...s.grid].every(c=>'0123456789abcdefghijklmnopqrstuv'.indexOf(c)<s.colors.length));assert.ok(s.region[0]<s.region[2]&&s.region[1]<s.region[3]);assert.ok(s.region.every(n=>n>0&&n<1));}
});
test('all clothing has actual construction profiles, including dresses, skirts, swimwear and jumpsuits formerly typed as shirts',()=>{
 const kinds=new Set();let reviewed=0;for(const p of unique.filter(p=>!bagProfile(p))){const g=garmentProfile(p);kinds.add(g.kind);assert.ok(['none','short','long','puff'].includes(g.sleeve));assert.ok(g.coverage&&g.fabric&&g.neckline&&g.fit);if(g.evidence==='photo-reviewed')reviewed++;}
 assert.ok(kinds.size>=17);assert.ok(reviewed>=35);
 const named=name=>physical.find(p=>p.name.includes(name));assert.equal(garmentProfile(named('Camas Dress')).kind,'dress');assert.equal(garmentProfile(named('Regular Fit Oxford Shirt')).kind,'shirt');assert.equal(garmentProfile(named('Energy Bra')).kind,'bra');assert.equal(garmentProfile(named('Puffer Pack Strap')).special,'bag-strap');
});
test('all bag photos have named construction rules and more than the former six researched models',()=>{
 const families=new Set(),shapes=new Set();let count=0;for(const p of unique){const b=bagProfile(p);if(!b)continue;count++;families.add(b.modelFamily);shapes.add(b.silhouette);assert.notEqual(b.modelFamily,'shoulder',p.name);assert.ok(b.aspect>.4&&b.aspect<3);assert.ok(['hand','shoulder','crossbody','backpack'].includes(b.carry));const a=productAppearance(p);assert.ok(a.width>5&&a.height>3&&a.depth>.5);}
 assert.equal(count,184);assert.ok(families.size>60);assert.ok(shapes.size>=12);
});
test('photo color and print samples wrap real mesh surfaces with upright texture coordinates',()=>{
 const alphabet='0123456789abcdefghijklmnopqrstuv';for(const p of unique.filter((_,i)=>i%17===0)){const a=productAppearance(p),m=referenceMaterial(a);if(['back','detail'].includes(a.garment?.photoView)){assert.equal(m.map.image.width,128);}else{assert.deepEqual([m.map.image.width,m.map.image.height],a.surface.size);const first=parseInt(a.surface.colors[alphabet.indexOf(a.surface.grid[0])].slice(1),16),i=(a.surface.size[1]-1)*a.surface.size[0]*4;assert.deepEqual(Array.from(m.map.image.data.slice(i,i+3)),[first>>16&255,first>>8&255,first&255]);assert.equal(m.map.repeat.x,1);assert.equal(m.map.repeat.y,1);}m.map.dispose();m.bumpMap.dispose();m.dispose();}
});

test('repeated prints retain their aspect on different garment panels without leaving the reviewed cloth region',()=>{
 const a={pattern:'graphic',garment:{motif:'dots'},surface:{region:[.42,.18,.58,.71]}};
 for(const aspect of [.4,.9,2.2,3.5]){const r=photoRegionForAspect(a,aspect,.8);assert.ok(r[0]>=.42-1e-8&&r[2]<=.58+1e-8);assert.ok(r[1]>=.18-1e-8&&r[3]<=.71+1e-8);assert.ok(Math.abs((r[2]-r[0])*.8/(r[3]-r[1])-aspect)<1e-6);}
 const graphic={...a,garment:{},pattern:'graphic'};assert.deepEqual(photoRegionForAspect(graphic,2,.8),a.surface.region);
});

test('repeated fitting releases owned rig resources while keeping shared catalog templates usable',()=>{
 const w={scene:new T.Scene(),resources:new Set(),state:E.createState()};for(const method of ['box','ball','cyl','mat','mesh'])w[method]=MallWorld3D.prototype[method];const p=physical.find(p=>p.type==='shirt'),bag=physical.find(p=>p.type==='bag');let afterFirst;
 for(let i=0;i<12;i++){const person=MallWorld3D.prototype.person.call(w,'#bda581',{}, {top:p,bag});const own=person.userData.torso.material;let disposed=0;own.addEventListener('dispose',()=>disposed++);person.removeFromParent();releasePersonResources(w,person);assert.equal(disposed,1);assert.ok(!w.resources.has(own));if(i===0)afterFirst=w.resources.size;else assert.equal(w.resources.size,afterFirst,'preview resources accumulate');}
 assert.ok(w.merchandiseCache.size);for(const template of w.merchandiseCache.values())template.traverse(o=>{if(o.isMesh){assert.ok(w.resources.has(o.geometry));assert.ok(o.geometry.attributes.position.array.every(Number.isFinite));}});for(const r of w.resources)r.dispose();
});
