import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as T from '../dist/vendor/three.module.js';
import * as E from '../dist/engine.js';
import {VERIFIED_STUDIO_ADDITIONS as additions} from '../dist/store-product-additions-v39.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
import {createFrameModel,placeFrame} from '../dist/eyewear-model.js';
import {frameGesture,frameFactsHTML} from '../dist/eyewear-tools.js';
import {createShopper,applyCharacterPose} from '../dist/character-rig.js';
import {buildGardenStudy,updateGardenStudies} from '../dist/garden-details.js';
import {collectionProducts,hasCollectionDesk,collectionGuideHTML} from '../dist/collection-guide.js';
import {interiorPlan} from '../dist/shop-interiors.js';
import {clearWalk,freeRoute,walkable} from '../dist/free-navigation.js';
import {MallWorld3D} from '../dist/world-3d.js';
import {releasePersonResources} from '../dist/merchandise-fit.js';
import {shoppingGuide} from '../dist/play-ui.js';
const facts=JSON.parse(readFileSync(new URL('../docs/research-v39/catalog-evidence.json',import.meta.url))),shops=E.STORES.filter(s=>s.collectionEdition===39),frames=additions.filter(p=>p.frameProfile),esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'),picture=p=>'<span>'+esc(p.name)+'</span>';
function state(){return Object.assign(E.createState(),{sandbox:true,cash:10000000});}
function owner(){return {scene:new T.Scene(),resources:new Set(),textures:new Map(),state:state(),t:0,mat(c,o={}){const m=new T.MeshStandardMaterial({color:c,...o});this.resources.add(m);return m;},mesh(geo,mat,parent=this.scene){const m=new T.Mesh(geo,mat);parent.add(m);this.resources.add(geo);return m;},box(x,y,z,a,b,c,mat,parent=this.scene){const m=this.mesh(new T.BoxGeometry(a,b,c),typeof mat==='string'?this.mat(mat):mat,parent);m.position.set(x,y,z);return m;}};}
function dispose(w){for(const r of w.resources)r.dispose?.();}

test('nine source variants preserve exact colors, widths/sizes, USD offers and source photographs, including the $175 wide frame',()=>{
 assert.equal(additions.length,9);for(const p of additions){const f=facts.products.find(f=>f.id===p.id);assert.ok(f);assert.equal(p.source,f.source);assert.equal(p.referenceAmount,f.priceUSD);assert.equal(p.colorName,f.color);assert.deepEqual(p.sizes,f.sizes);assert.equal(p.photo.imageUrl,f.imageUrl);assert.equal(p.referenceCheckedOn,facts.checkedOn);assert.equal(p.merchantOnly,true);const raw=readFileSync(new URL('../dist/'+p.photo.path,import.meta.url));assert.equal(createHash('sha256').update(raw).digest('hex'),f.photoSHA256);assert.equal(raw.toString('ascii',0,4),'RIFF');assert.equal(raw.toString('ascii',8,12),'WEBP');if(p.frameProfile){assert.equal(p.optionLabel,'WIDTH');assert.ok(p.referencePriceQualifier.includes('starting offer'));}}
 const premium=frames.find(p=>p.colorName==='Jet Black with Polished Gold');assert.equal(premium.priceUSD,175);assert.deepEqual(premium.sizes,['Wide']);
});
test('seven formerly pending studios gain only their own merchant stock and all 8665 earlier active product IDs remain intact',()=>{
 assert.equal(shops.length,7);assert.equal(shops.reduce((n,s)=>n+s.count,0),33);assert.equal(E.STORES.filter(s=>s.catalogStatus==='verified').length,1039);assert.equal(E.STORES.filter(s=>s.catalogStatus==='pending').length,426);assert.equal(E.STORES.filter(E.isPlanningStore).length,335);assert.equal(E.STORES.filter(hasCollectionDesk).length,25);
 const older=E.PRODUCTS.filter(p=>!p.modelId?.startsWith('v39-real-')).map(p=>p.id).sort();assert.equal(older.length,facts.previousCatalog.count);assert.equal(createHash('sha256').update(older.join('\n')).digest('hex'),facts.previousCatalog.sortedProductIdsSHA256);
 for(const st of shops){assert.ok(hasCollectionDesk(st));assert.equal(collectionProducts(st).length,st.count);for(const p of st.products){assert.equal(p.brand,st.name);assert.equal(p.store,st.id);assert.ok(p.modelId.startsWith('v39-real-'));}}
 assert.ok(E.PRODUCTS.filter(p=>p.modelId?.startsWith('v39-real-')).every(p=>shops.some(st=>st.id===p.store)));
});
test('every new color supports its exact default fit, tagged purchase, compatible reload and one exact tax-inclusive refund',()=>{
 for(const a of additions){const p=E.PRODUCTS.find(p=>p.modelId===a.id),s=state(),size=E.idealSize(s,p),cash=s.cash,qty=E.stock(s,p.id,size);assert.ok(p.sizes.includes(size));E.inspect(s,p.id);const fit=E.fit(s,p.id,size);assert.equal(fit.fits,true);if(p.frameProfile){assert.match(fit.text,/Virtual styling/);assert.equal(size,p.sizes.includes('Medium')?'Medium':p.sizes[0]);}assert.equal(s.cash,cash);assert.equal(E.stock(s,p.id,size),qty);const receipt=E.checkout(s,p.store,[{id:p.id,size}]),loaded=E.validateImport(JSON.stringify(s)),item=loaded.purchases[0];assert.equal(item.size,size);assert.equal(item.tags,true);assert.equal(item.worn,false);assert.equal(E.returnItem(loaded,item.id,p.store),receipt.total);assert.equal(loaded.cash,cash);assert.equal(E.stock(loaded,p.id,size),qty);assert.throws(()=>E.returnItem(loaded,item.id,p.store),/Already/);}
});
test('old pending-shop notes survive stocking and frame comparisons clearly separate width and starting-price references',()=>{
 const st=shops.find(s=>s.businessKind==='eyewear'),s=state(),old=E.PRODUCTS.find(p=>p.store!==st.id&&E.mallForStore(s,p.store).id===st.mallId&&!p.modelId?.startsWith('v39-real-'));s.mallId=st.mallId;s.shoppingPlans=[{store:st.id,category:'all',budget:15000,items:[old.id],day:1}];const loaded=E.validateImport(JSON.stringify(s));assert.deepEqual(loaded.shoppingPlans,s.shoppingPlans);const before=structuredClone(loaded),html=collectionGuideHTML(loaded,st,st.products.slice(0,2).map(p=>p.id),{E,esc,picture});assert.match(html,/Source widths/);assert.match(html,/Inspect \/ choose width/);assert.match(html,/starting offer/);assert.match(frameFactsHTML(st.products[0],esc),/Prescription and lens ordering are outside this game/);assert.match(shoppingGuide(s,st.id,{E,esc}),/Choose a frame width/);assert.deepEqual(loaded,before);
});
test('frame models have open lens contours, actual temple depth and distinct geometry; worn frames follow the anatomical head',()=>{
 const w=owner(),shapes=new Set();for(const p of frames){const g=createFrameModel(w,p),b=new T.Box3().setFromObject(g),size=b.getSize(new T.Vector3());assert.ok(size.x>4&&size.y>1&&size.z>3);assert.equal(g.userData.source,p.source);assert.equal(g.userData.frameColor,p.colorName);assert.equal(g.children.filter(m=>m.geometry?.type==='TubeGeometry').length,3);g.traverse(o=>{if(o.geometry)assert.ok(o.geometry.attributes.position.array.every(Number.isFinite));});shapes.add(g.userData.frameShape);}
 assert.equal(shapes.size,3);const p=E.PRODUCTS.find(p=>p.modelId===frames[0].id),person=createShopper(w,'#809481',{}, {jewelry:p});assert.equal(person.userData.eyewear.parent,person.userData.rig.headGroup);assert.equal(person.userData.eyewear.userData.productId,p.id);person.position.set(30,0,20);person.rotation.y=.8;applyCharacterPose(person,{kind:'framefit',time:1.8});person.updateMatrixWorld(true);const relative=person.userData.rig.headGroup.worldToLocal(person.userData.eyewear.getWorldPosition(new T.Vector3()));assert.ok(relative.distanceTo(new T.Vector3(0,.97,3.6))<1e-6);const display=placeFrame(w,p,0,30,0,25,25);assert.ok(new T.Box3().setFromObject(display).getSize(new T.Vector3()).x<=25.001);dispose(w);
});
test('frame adjustment eases to the temples, stays bounded and completely freezes with reduced motion',()=>{
 for(let t=-1;t<9;t+=1/60){const r=frameGesture(t);assert.ok(r>=0&&r<=1);assert.equal(frameGesture(t,true),0);}assert.equal(frameGesture(NaN),0);assert.equal(frameGesture(0),0);assert.equal(frameGesture(4),0);assert.equal(frameGesture(1.8),1);assert.ok(frameGesture(.4501)<1e-6);
 const w=owner(),g=createShopper(w,'#839084');applyCharacterPose(g,{kind:'framefit',time:1.8});g.updateMatrixWorld(true);for(const [i,arm]of g.userData.limbs.slice(0,2).entries()){const target=g.worldToLocal(arm.userData.grip.getWorldPosition(new T.Vector3()));assert.ok(target.distanceTo(new T.Vector3((i?1:-1)*3.4,44.9,3.7))<.2);}for(let i=0;i<90;i++){applyCharacterPose(g,{kind:'framefit',time:i/20,delta:1/20});g.updateMatrixWorld(true);g.traverse(o=>assert.ok(o.matrixWorld.elements.every(Number.isFinite)));}applyCharacterPose(g,{kind:'framefit',time:0,reducedMotion:true});const pose=g.userData.limbs.map(l=>l.quaternion.toArray());applyCharacterPose(g,{kind:'framefit',time:9,reducedMotion:true});assert.deepEqual(g.userData.limbs.map(l=>l.quaternion.toArray()),pose);dispose(w);
});
test('all new studios retain reachable collection desks, frame/style stations, displays, checkout, returns, benches and exits',()=>{
 for(const st of shops){const l=interiorPlan(st,E.FLOORPLANS[st.mallId],6);for(const p of [{x:600,y:210},{x:600,y:675},l.exit,...Object.values(l.services),...l.stockFixtures.map(f=>f.approach)]){assert.ok(walkable(p,l.nav),st.id);const path=freeRoute(l.spawn,p,l.nav);assert.ok(path.length>=2);for(let i=1;i<path.length;i++)assert.ok(clearWalk(path[i-1],path[i],l.nav),st.id);}}
});
test('garden detail remains within the existing fixture and its gentle sway resets to static reduced motion',()=>{
 const w=owner(),g=buildGardenStudy(w,100,200,{plant:'#72916d',flowers:'#c58b80'});assert.equal(w.gardenSprigs.length,4);for(const time of [0,1,5,20]){w.t=time;updateGardenStudies(w);g.updateMatrixWorld(true);const b=new T.Box3().setFromObject(g);assert.ok(b.min.x>=85&&b.max.x<=115&&b.min.z>=185&&b.max.z<=215);assert.ok(w.gardenSprigs.every(s=>Math.abs(s.rotation.z)<=.035));}w.state.preferences.reducedMotion=true;updateGardenStudies(w);assert.ok(w.gardenSprigs.every(s=>s.rotation.z===0));dispose(w);
});
test('removing a dressed shopper releases its new frame geometry and textures without disposing another frame display',()=>{
 const w=owner(),p=E.PRODUCTS.find(p=>p.modelId===frames[0].id),display=createFrameModel(w,p);w.scene.add(display);const person=createShopper(w,'#829983',{}, {jewelry:p}),gone=person.userData.eyewear.children[0].geometry,kept=display.children[0].geometry;let disposedGone=0,disposedKept=0;gone.addEventListener('dispose',()=>disposedGone++);kept.addEventListener('dispose',()=>disposedKept++);releasePersonResources(w,person);assert.equal(disposedGone,1);assert.equal(disposedKept,0);assert.ok(w.resources.has(kept));dispose(w);
});

test('opaque new tees and polos cover the back/hip envelope continuously between their fitted shell rings',()=>{
 for(const a of additions.filter(p=>p.type==='shirt')){const p=E.PRODUCTS.find(p=>p.modelId===a.id),w={scene:new T.Scene(),resources:new Set(),state:state()};for(const key of ['box','ball','cyl','mat','mesh'])w[key]=MallWorld3D.prototype[key];const g=MallWorld3D.prototype.person.call(w,'#c9aa83',{}, {top:p});g.updateMatrixWorld(true);const group=g.children.find(o=>o.userData.role==='worn-top'),body=group.children.find(o=>o.userData.role==='shirt-shell');assert.ok(body.geometry.attributes.position.count>1000);for(const y of [25,26,28,34,39,40.5,41.2])for(const x of [0,-3.5,3.5]){const env=g.userData.anatomy.envelope[Math.round((y-20)*2)];if(Math.abs(x)>=env[0])continue;const ray=new T.Raycaster(new T.Vector3(x,y+g.position.y,-20),new T.Vector3(0,0,1)),hit=ray.intersectObject(body)[0],back=env[2]*Math.sqrt(1-(x/env[0])**2);assert.ok(hit&&hit.point.z<=-back-.05,p.name+' back coverage at '+x+','+y);}dispose(w);}
});

test('the real neckline and shoulder skin stays behind opaque fitted polo fabric from both sides',()=>{
 const p=E.PRODUCTS.find(p=>p.modelId==='v39-real-c678c7554f7339197f9a'),w={scene:new T.Scene(),resources:new Set(),state:state()};for(const key of ['box','ball','cyl','mat','mesh'])w[key]=MallWorld3D.prototype[key];const g=MallWorld3D.prototype.person.call(w,'#c9aa83',{}, {top:p});g.updateMatrixWorld(true);g.userData.anatomy.skeleton.update();const visible=[];g.traverse(o=>{if(!o.isMesh)return;let a=o;while(a&&a.visible)a=a.parent;if(!a)visible.push(o);});for(const sign of [-1,1])for(const y of [40,40.4,40.8,41.2,41.6])for(const x of [5.2,5.5,5.8]){const hits=new T.Raycaster(new T.Vector3(sign*x,y+g.position.y,-20),new T.Vector3(0,0,1)).intersectObjects(visible,false);assert.notEqual(hits[0]?.object.name,'human:neckline','exposed shoulder at '+sign*x+','+y);}dispose(w);
});
