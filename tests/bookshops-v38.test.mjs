import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from '../dist/vendor/three.module.js';
import * as E from '../dist/engine.js';
import {VERIFIED_BOOK_ADDITIONS as editions} from '../dist/store-product-additions-v38.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
import {isBookProduct,validISBN,readingGesture,bookFactsHTML,bookshopGuideHTML,verifiedBookshops} from '../dist/book-tools.js';
import {placeBook,createReadingProp,updateReadingProp} from '../dist/book-model.js';
import {createShopper,applyCharacterPose} from '../dist/character-rig.js';
import {hasCollectionDesk,collectionProducts,collectionGuideHTML} from '../dist/collection-guide.js';
import {shoppingPlanHTML} from '../dist/shopping-plan-ui.js';
import {MallWorld3D,portraitOffset} from '../dist/world-3d.js';
import {shoppingGuide} from '../dist/play-ui.js';
import {interiorPlan} from '../dist/shop-interiors.js';
import {walkable,freeRoute,clearWalk} from '../dist/free-navigation.js';
const shops=E.STORES.filter(s=>s.collectionEdition===38),esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'),picture=p=>`<span>${esc(p.name)}</span>`;
function state(){return Object.assign(E.createState(),{sandbox:true,cash:10000000});}
function owner(){return {scene:new T.Scene(),resources:new Set(),textures:new Map(Object.values(PRODUCT_PHOTOS).map(p=>[p.path,new T.Texture()])),mat(c,o={}){const m=new T.MeshStandardMaterial({color:c,...o});this.resources.add(m);return m;},mesh(geo,mat,parent=this.scene){const m=new T.Mesh(geo,mat);parent.add(m);this.resources.add(geo);return m;},box(x,y,z,a,b,c,mat,parent=this.scene){const m=this.mesh(new T.BoxGeometry(a,b,c),typeof mat==='string'?this.mat(mat):mat,parent);m.position.set(x,y,z);return m;}};}
function dispose(w){for(const r of w.resources)r.dispose?.();}

test('eight verified physical editions keep their exact ISBN, format, USD offer and matching source cover',()=>{
 const facts=JSON.parse(readFileSync(new URL('../docs/research-v38/book-evidence.json',import.meta.url))).editions;assert.equal(editions.length,8);assert.equal(facts.length,8);
 for(const p of editions){const f=facts.find(f=>f.isbn===p.bookISBN);assert.ok(validISBN(p.bookISBN));assert.ok(isBookProduct(p));assert.equal(p.source,f.source);assert.equal(new URL(p.source).searchParams.get('ean'),p.bookISBN);assert.equal(new URL(p.source).hostname,'www.barnesandnoble.com');assert.equal(p.priceUSD,f.priceUSD);assert.equal(p.referenceAmount,f.priceUSD);assert.equal(p.referenceCurrency,'USD');assert.equal(p.bookFormat,f.format);assert.deepEqual(p.sizes,[f.format]);assert.equal(p.photo.imageUrl,f.imageUrl);assert.equal(p.bookPublisher,f.publisher);assert.equal(p.bookAuthor,f.author);assert.equal(p.optionLabel,'EDITION');assert.ok(!/EBook|Audio/.test(p.bookFormat));const data=readFileSync(new URL('../dist/'+p.photo.path,import.meta.url));assert.equal(data.toString('ascii',0,4),'RIFF');assert.equal(data.toString('ascii',8,12),'WEBP');}
 assert.equal(validISBN('9781984898457'),false);assert.equal(validISBN('2940176764017'),false);assert.equal(isBookProduct({...editions[0],bookFormat:'EBook'}),false);
});
test('six formerly pending bookshops receive only their own documented editions; existing collections remain available',()=>{
 assert.equal(shops.length,6);assert.equal(E.STORES.filter(s=>s.catalogStatus==='verified').length,1057);assert.equal(E.STORES.filter(s=>s.catalogStatus==='pending').length,408);assert.equal(E.STORES.filter(E.isPlanningStore).length,317);assert.equal(E.STORES.filter(hasCollectionDesk).length,43);
 for(const st of shops){assert.equal(st.count,8);assert.equal(st.businessKind,'books');assert.ok(hasCollectionDesk(st));assert.equal(collectionProducts(st).length,8);for(const p of st.products){assert.ok(isBookProduct(p));assert.equal(p.store,st.id);assert.equal(p.associationEvidence.kind,'retailer-product');assert.equal(p.associationEvidence.source,p.source);}}
 assert.ok(E.PRODUCTS.filter(p=>p.bookISBN).every(p=>shops.some(st=>st.id===p.store)));
});
test('book volumes have a real page block, boards, depth and exact cover identity, including wide art books',()=>{
 const w=owner();for(const p of shops[0].products){const g=placeBook(w,p,0,0,0,40,50),box=new T.Box3().setFromObject(g),size=box.getSize(new T.Vector3());assert.ok(size.x>10&&size.y>10&&size.z>1);assert.equal(g.userData.bookISBN,p.bookISBN);assert.equal(g.userData.source,p.source);assert.ok(g.children.filter(m=>m.geometry?.type==='BoxGeometry').length>=5);assert.ok(g.children.some(m=>m.geometry?.type==='PlaneGeometry'&&m.material.map));assert.ok(Math.abs(size.x/size.y-p.bookAspect)<.04);g.traverse(o=>{if(o.geometry)assert.ok(o.geometry.attributes.position.array.every(Number.isFinite));});}dispose(w);
});
test('every new edition can be inspected, previewed, bought, reloaded and refunded without being treated as clothing',()=>{
 for(const a of editions){const p=E.PRODUCTS.find(p=>p.modelId===a.id),s=state(),cash=s.cash,size=p.bookFormat,qty=E.stock(s,p.id,size);assert.equal(E.canTry(p),false);assert.equal(E.slotForProduct(p),null);assert.throws(()=>E.fit(s,p.id,size),/demo/);E.inspect(s,p.id);const demo=E.demo(s,p.id);assert.match(demo.text,/Full book text is not included/);assert.equal(s.cash,cash);assert.equal(E.stock(s,p.id,size),qty);const receipt=E.checkout(s,p.store,[{id:p.id,size}]);const loaded=E.validateImport(JSON.stringify(s)),item=loaded.purchases[0];assert.equal(item.size,p.bookFormat);assert.ok(item.tags&&!item.worn);assert.equal(E.returnItem(loaded,item.id,p.store),receipt.total);assert.equal(loaded.cash,cash);assert.equal(E.stock(loaded,p.id,size),qty);assert.throws(()=>E.returnItem(loaded,item.id,p.store),/Already/);}
});
test('preview rewards are once per ISBN across branches, while repeat browsing still pays its time and stamina costs',()=>{
 const s=state(),p=shops[0].products[0],other=E.PRODUCTS.find(q=>q.id!==p.id&&q.bookISBN===p.bookISBN),qty=E.stock(s,p.id,p.bookFormat),cash=s.cash;let xp=s.xp;E.demo(s,p.id);assert.equal(s.xp-xp,10);xp=s.xp;const time=s.minutes;E.demo(s,p.id);E.demo(s,other.id);assert.equal(s.xp,xp);assert.equal(s.minutes-time,12);assert.equal(s.cash,cash);assert.equal(E.stock(s,p.id,p.bookFormat),qty);assert.ok(s.demos.includes(other.id));assert.equal(s.metrics.demos,1);const restored=E.validateImport(JSON.stringify(s));E.demo(restored,other.id);assert.equal(restored.xp,xp);
});
test('old bookshop shortlists remain compatible after stocking; comparison uses edition terminology and factual identifiers',()=>{
 const s=state(),st=shops.find(st=>st.mallId==='orange'),old=E.productsForStore('ross')[0];s.shoppingPlans=[{store:st.id,category:'all',budget:15000,items:[old.id],day:1}];const restored=E.validateImport(JSON.stringify(s));assert.deepEqual(restored.shoppingPlans,s.shoppingPlans);const draft=E.shoppingPlanDraft(restored,st.id);draft.items.push(st.products[0].id);E.saveShoppingPlan(restored,draft);assert.match(shoppingPlanHTML(restored,draft,'',12,{E,esc,picture}),/now has verified merchandise/);const html=collectionGuideHTML(s,st,st.products.slice(0,2).map(p=>p.id),{E,esc,picture});assert.match(html,/Official edition & ISBN/);assert.match(html,/Physical edition/);assert.match(html,/Publication notes/);assert.ok(!html.includes('Official product & selected color'));assert.match(bookFactsHTML(st.products[0],esc),/ISBN-13/);assert.equal(bookFactsHTML(old,esc),'');
});
test('all bookshop desks, preserved benches, displays, counters and exits stay physically reachable',()=>{
 for(const st of shops){const l=interiorPlan(st,E.FLOORPLANS[st.mallId],6);assert.equal(l.seating.length,1);for(const p of [{x:600,y:210},{x:600,y:675},l.exit,l.services.returns,l.services.checkout,...l.stockFixtures.map(r=>r.approach)]){assert.ok(walkable(p,l.nav),st.id);const route=freeRoute(l.spawn,p,l.nav);assert.ok(route.length>=2);for(let i=1;i<route.length;i++)assert.ok(clearWalk(route[i-1],route[i],l.nav),st.id);}}
});
test('public reading guides list verified bookshops in this center first and make no changes to saved progress',()=>{
 const s=state(),before=structuredClone(s),list=verifiedBookshops(s,E),html=bookshopGuideHTML(s,{E,esc});assert.ok(list.length);let away=false;for(const st of list){assert.ok(st.count>0&&st.businessKind==='books');if(E.mallForStore(s,st.id).id!==s.mallId)away=true;else assert.equal(away,false);}assert.match(html,/public reading shelf contains original Mallside stories/);assert.match(html,/data-action="visit"/);assert.deepEqual(s,before);
});
test('page turns ease at both ends, keep hands bounded, and remain completely still under reduced motion',()=>{
 for(let t=0;t<12;t+=1/60){const p=readingGesture(t);assert.ok(p.page>=-Math.PI&&p.page<=0);assert.ok(p.reach>=0&&p.reach<=1);assert.deepEqual(readingGesture(t,true),{page:0,reach:0});}assert.deepEqual(readingGesture(NaN),{page:0,reach:0});assert.ok(readingGesture(1.6201).reach<.0001);assert.ok(readingGesture(3.5999).reach<.0001);
 const w=owner(),g=createShopper(w,'#75928b');w.player=g;const prop=createReadingProp(w);assert.equal(prop.userData.originalPages,true);for(let i=0;i<120;i++){applyCharacterPose(g,{kind:'read',time:i/30,delta:1/30});updateReadingProp(prop,i/30,false);g.updateMatrixWorld(true);g.traverse(o=>assert.ok(o.matrixWorld.elements.every(Number.isFinite)));}applyCharacterPose(g,{kind:'read',time:0,reducedMotion:true});const pose=g.userData.limbs.map(l=>l.quaternion.toArray());applyCharacterPose(g,{kind:'read',time:8,reducedMotion:true});assert.deepEqual(g.userData.limbs.map(l=>l.quaternion.toArray()),pose);updateReadingProp(prop,9,true);assert.equal(prop.userData.leaf.rotation.z,0);dispose(w);
});

test('reading cameras stay on clear floor at every edition desk; book browsing routes to the comparison desk',()=>{
 for(const st of shops){const layout=interiorPlan(st,E.FLOORPLANS[st.mallId],6),spawn={x:600,y:210},offset=portraitOffset({...layout,spawn});assert.ok(Math.hypot(...offset)>0);assert.ok(clearWalk(spawn,{x:spawn.x+offset[0],y:spawn.y+offset[1]},layout.nav));const w={inside:st.id,layout,navigate(point,options){this.route={point,options};}};assert.equal(MallWorld3D.prototype.goToShopService.call(w,'fitting'),true);assert.deepEqual(w.route,{point:spawn,options:{interaction:'collection:'+st.id}});const camera=new T.PerspectiveCamera(42,1.5,1,1000),player=new T.Group();player.position.set(spawn.x,0,spawn.y);camera.position.set(spawn.x+offset[0],88,spawn.y+offset[1]);MallWorld3D.prototype.setCamera.call({camera,player,layout,action:{kind:'read',readCameraOffset:offset}});assert.ok(clearWalk(spawn,{x:camera.position.x,y:camera.position.z},layout.nav));const screen=new T.Vector3(spawn.x,30,spawn.y).project(camera);assert.ok(Math.abs(screen.x)<.1&&Math.abs(screen.y)<.1&&screen.z<1);assert.match(shoppingGuide(state(),st.id,{E,esc}),/Check the format and ISBN/);}
});
