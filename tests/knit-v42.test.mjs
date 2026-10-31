import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as E from '../dist/engine.js';
import * as T from '../dist/vendor/three.module.js';
import {VERIFIED_KNIT_ADDITIONS as additions} from '../dist/store-product-additions-v42.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
import {productAppearance} from '../dist/product-appearance.js';
import {collectionGuideHTML,collectionProducts} from '../dist/collection-guide.js';
import {studioStudyHTML} from '../dist/studio-study-ui.js';
import {studyFor} from '../dist/studio-study.js';
import {buildKnitStudio} from '../dist/knit-studio.js';
import {updateStudioStudy} from '../dist/studio-details.js';
import {buildReadingDetails,updateReadingDetails} from '../dist/reading-details.js';
import {footArc,gaitHeight} from '../dist/gait-motion.js';
import {createShopper,applyCharacterPose} from '../dist/character-rig.js';
import {MallWorld3D} from '../dist/world-3d.js';
import {interiorPlan} from '../dist/shop-interiors.js';
import {freeRoute,walkable,clearWalk} from '../dist/free-navigation.js';
import {brandDesign} from '../dist/brand-designs.js';
import {themeFor} from '../dist/mall-design.js';
const evidence=JSON.parse(readFileSync(new URL('../docs/research-v42/catalog-evidence.json',import.meta.url))),shops=E.STORES.filter(st=>st.collectionEdition===42),hash=b=>createHash('sha256').update(b).digest('hex'),esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function fresh(st=shops[0]){const s=E.createState();Object.assign(s,{sandbox:true,cash:7500000,mallId:st.mallId});return s;}
function owner(s=fresh()){const w={state:s,scene:new T.Scene(),resources:new Set(),textures:new Map(),canvas:{dataset:{}}};for(const key of ['mat','mesh','box','cyl'])w[key]=MallWorld3D.prototype[key];return w;}
const release=w=>MallWorld3D.prototype.clearScene.call(w);

test('six selected-color references retain official USD offers, exact source labels and photograph checksums',()=>{
 assert.equal(additions.length,6);for(const p of additions){const r=evidence.products.find(r=>r.id===p.id);assert.ok(r);assert.equal(p.referenceAmount,r.priceUSD);assert.equal(p.referenceCurrency,'USD');assert.equal(p.referenceSKU,r.sku);assert.equal(p.colorName,r.color);assert.deepEqual(p.sizes,r.sizes);assert.equal(p.photo.imageUrl,r.imageUrl);assert.equal(hash(readFileSync(new URL('../dist/'+p.photo.path,import.meta.url))),r.photoSHA256);assert.equal(p.merchantNames.length,1);assert.ok(new URL(p.source).hostname.endsWith(p.brand==='COS'?'cos.com':'mango.com'));if(p.brand==='Mango')assert.match(p.sourceOfferNote,/No conditional discount is applied/);else assert.match(p.sourceOfferNote,/excludes this item/);}
});
test('all 8730 prior active product identities remain intact while only five pending branches gain sixteen listings',()=>{
 const prior=E.PRODUCTS.filter(p=>!/^v(?:42|43|44|45)-real-/.test(p.modelId||''));assert.equal(prior.length,evidence.previousCatalog.count);assert.equal(hash(prior.map(p=>p.id).sort().join('\n')),evidence.previousCatalog.sortedProductIdsSHA256);assert.equal(shops.length,5);assert.equal(E.PRODUCTS.filter(p=>p.modelId?.startsWith('v42-real-')).length,16);for(const st of shops){assert.equal(st.catalogStatus,'verified');assert.equal(st.count,st.name==='COS'?2:4);assert.equal(collectionProducts(st).length,st.count);for(const p of st.products){assert.equal(p.brand,st.name);assert.equal(PRODUCT_PHOTOS[p.id].source,p.source);assert.ok(p.modelId.startsWith('v42-real-'));}}
});
test('source photographs drive reviewed garment shape, colors and material surfaces without sharing another color variant',()=>{
 for(const p of E.PRODUCTS.filter(p=>p.modelId?.startsWith('v42-real-'))){const a=productAppearance(p);assert.equal(a.garment.evidence,'photo-reviewed');assert.equal(a.colorEvidence,'reviewed-photograph');assert.equal(a.garment.sleeve,'short');assert.equal(a.garment.neckline,'crew');assert.equal(a.garment.length,'hip');assert.equal(a.surface.regionReviewed,true);assert.equal(a.photo,PRODUCT_PHOTOS[p.id].path);assert.equal(a.color,p.color);assert.equal(a.garment.fabric,p.name.includes('Ribbed')?'knit':'cotton');}
});
test('v41 material notes at newly stocked branches survive schema-6 imports, with economy and earlier shortlists retained',()=>{
 for(const st of shops){const s=fresh(st);s.materialStudies=[{store:st.id,palette:'coast',finish:'smooth',day:1}];const other=E.PRODUCTS.find(p=>p.store!==st.id&&E.mallForStore(s,p.store).id===s.mallId);s.shoppingPlans=[{store:st.id,category:'all',budget:15000,items:[other.id],day:1}];const loaded=E.validateImport(JSON.stringify(s));assert.deepEqual(loaded.materialStudies,s.materialStudies);assert.deepEqual(loaded.shoppingPlans,s.shoppingPlans);assert.equal(loaded.version,6);assert.equal(loaded.mapRevision,10);assert.equal(loaded.cash,s.cash);assert.deepEqual(loaded.purchases,s.purchases);}
});
test('stocked-shop study saves remain atomic and free, reject foreign branches and retain the creative/merchant distinction',()=>{
 const st=shops[0],s=fresh(st),before=structuredClone(s),draft={store:st.id,palette:'berry',finish:'textured'};E.saveMaterialStudy(s,draft);const after=structuredClone(s);delete after.materialStudies;delete before.materialStudies;assert.deepEqual(after,before);const saved=JSON.stringify(s);assert.throws(()=>E.saveMaterialStudy(s,{...draft,store:shops.find(q=>q.mallId!==st.mallId).id}));assert.equal(JSON.stringify(s),saved);const html=studioStudyHTML(s,st,studyFor(s,st.id),{esc});assert.match(html,/separately from the verified collection/);assert.ok(!html.includes('still being researched'));assert.match(html,/not merchandise/);
});
test('new collection guides retain comparisons, official prices, saved studies and direct product routes',()=>{
 for(const st of shops){const s=fresh(st);s.materialStudies=[{store:st.id,palette:'coast',finish:'smooth',day:1}];const before=JSON.stringify(s),html=collectionGuideHTML(s,st,st.products.slice(0,2).map(p=>p.id),{E,esc,picture:()=>'<span>photo</span>'});assert.match(html,/Material study · saved ✓/);assert.match(html,/data-action="studio-open"/);assert.match(html,/id="collection-comparison"/);assert.match(html,/Source size labels/);for(const p of st.products)assert.ok(html.includes(p.sourceOfferNote));assert.equal(JSON.stringify(s),before);}
});
test('all new product references complete fitting, payment, reload and a single exact refund',()=>{
 for(const a of additions){const p=E.PRODUCTS.find(p=>p.modelId===a.id),s=fresh(E.storeById(p.store)),size=E.idealSize(s,p),cash=s.cash,stock=E.stock(s,p.id,size);assert.equal(E.fit(s,p.id,size).fits,true);const bill=E.checkout(s,p.store,[{id:p.id,size}]),loaded=E.validateImport(JSON.stringify(s)),item=loaded.purchases.at(-1);assert.equal(item.size,size);assert.equal(E.returnItem(loaded,item.id,p.store),bill.total);assert.equal(loaded.cash,cash);assert.equal(E.stock(loaded,p.id,size),stock);assert.throws(()=>E.returnItem(loaded,item.id,p.store));}
});
test('every new showroom keeps reachable desks, fitting, rest, checkout, refunds and exits',()=>{
 for(const st of shops){const l=interiorPlan(st,E.FLOORPLANS[st.mallId],st.count);for(const target of [{x:600,y:210},{x:600,y:675},l.exit,...Object.values(l.services),...l.stockFixtures.map(r=>r.approach)]){assert.ok(walkable(target,l.nav),st.id);const route=freeRoute(l.spawn,target,l.nav);assert.ok(route.length);for(let i=1;i<route.length;i++)assert.ok(clearWalk(route[i-1],route[i],l.nav),st.id);}}
});
test('knit showroom detail stays on existing fixtures and saved/draft samples update without allocating new resources',()=>{
 for(const st of shops){const w=owner(fresh(st));w.layout=interiorPlan(st,E.FLOORPLANS[st.mallId],st.count);buildKnitStudio(w,st,brandDesign(st));const count=w.resources.size;for(const mesh of w.scene.children){const b=new T.Box3().setFromObject(mesh);assert.ok([{x:540,y:125,width:120,height:45},w.layout.rail].some(r=>b.min.x>=r.x-.01&&b.max.x<=r.x+r.width+.01&&b.min.z>=r.y-.01&&b.max.z<=r.y+r.height+.01),st.id+' '+mesh.position.toArray());}w.studioPreview={store:st.id,palette:'coast',finish:'smooth'};updateStudioStudy(w);assert.equal(w.canvas.dataset.materialStudy,'coast:smooth');w.studioPreview=null;updateStudioStudy(w);assert.equal(w.canvas.dataset.materialStudy,'earth:textured');assert.equal(w.resources.size,count);release(w);}
});
test('detailed reading shelves stay inside the collider and bookmarks follow only the current mall/floor saved story',()=>{
 for(const family of ['orange','century','southcoast']){const w=owner(),parts=[],b={box(x,y,z,sx,sy,sz){parts.push({x,z,sx,sz});}};buildReadingDetails(w,b,100,200,themeFor(family));assert.ok(parts.length>30);for(const p of parts)assert.ok(p.x-p.sx/2>=85&&p.x+p.sx/2<=115&&p.z-p.sz/2>=185&&p.z+p.sz/2<=215);assert.equal(w.canvas.dataset.readingBookmark,'unread');const marker=w.readingStudies[0].marker,initial=marker.position.x;w.state.commonsNotes=[{mallId:w.state.mallId,floor:1,kind:'reading',choice:'bench',day:1}];updateReadingDetails(w);assert.equal(marker.position.x,initial);w.state.commonsNotes.push({mallId:w.state.mallId,floor:0,kind:'reading',choice:'bench',day:1});updateReadingDetails(w);assert.equal(w.canvas.dataset.readingBookmark,'bench');assert.equal(marker.position.x,initial+3);for(let i=0;i<90;i++)updateReadingDetails(w);assert.equal(marker.position.x,initial+3);w.state.floor=1;w.state.commonsNotes=[];updateReadingDetails(w);assert.equal(marker.position.x,initial);release(w);assert.deepEqual(w.readingStudies,[]);}
});
test('walking feet and pelvis keep continuous position and velocity across toe-off, touchdown and cycle boundaries',()=>{
 const rig={upperLeg:12,lowerLeg:11,ankleHeight:1.6,hipHeight:25},h=1e-5;
 for(const p of [0,.5,1]){for(const prop of ['z','lift']){const left=footArc(p-h,10)[prop],at=footArc(p,10)[prop],right=footArc(p+h,10)[prop];assert.ok(Math.abs(right-left)<.002);assert.ok(Math.abs((at-left)/h-(right-at)/h)<.025);}const a=gaitHeight(p-h,10,rig),b=gaitHeight(p,10,rig),c=gaitHeight(p+h,10,rig);assert.ok(Math.abs((b-a)/h-(c-b)/h)<.01);}
 for(let t=0;t<1;t+=1/480){const a=footArc(t,10);assert.ok(a.lift>=0&&a.lift<=3.2);assert.ok(Math.abs(a.z)<11);if(a.contact)assert.equal(a.lift,0);assert.ok(Number.isFinite(gaitHeight(t,10,rig)));}
});
test('rendered walking contacts remain grounded, transitions stay finite and reduced motion holds a static pose',()=>{
 const w=owner(),g=createShopper(w,'#718676');w.scene.add(g);for(let i=0;i<240;i++){applyCharacterPose(g,{walking:true,distance:i/240*40,time:i/60,delta:1/60});g.updateMatrixWorld(true);for(const leg of g.userData.limbs.slice(2)){assert.ok(leg.userData.foot.matrixWorld.elements.every(Number.isFinite));if(leg.userData.contact){const actual=new T.Vector3();leg.userData.foot.getWorldPosition(actual);assert.ok(Math.abs(actual.y-1.6)<.035,'ground contact '+actual.y);}}}applyCharacterPose(g,{reducedMotion:true,time:1,delta:1/60});g.updateMatrixWorld(true);const before=g.userData.limbs.map(l=>l.quaternion.toArray());applyCharacterPose(g,{reducedMotion:true,time:100,delta:1/60});assert.deepEqual(g.userData.limbs.map(l=>l.quaternion.toArray()),before);release(w);
});
