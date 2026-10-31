import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as T from '../dist/vendor/three.module.js';
import * as E from '../dist/engine.js';
import {VERIFIED_TEXTILE_ADDITIONS as additions} from '../dist/store-product-additions-v40.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
import {productAppearance} from '../dist/product-appearance.js';
import {fitScaleForSize} from '../dist/merchandise-fit.js';
import {hasCollectionDesk,collectionProducts,collectionGuideHTML} from '../dist/collection-guide.js';
import {apparelFactsHTML} from '../dist/apparel-facts.js';
import {nearbyDiscoveries,nearbyDiscoveryHTML} from '../dist/waystation-guide.js';
import {buildWaystationDetails} from '../dist/waystation-details.js';
import {buildTextileStudio} from '../dist/textile-studio.js';
import {fittingTurn,checkoutGesture} from '../dist/fitting-motion.js';
import {createShopper,applyCharacterPose} from '../dist/character-rig.js';
import {MallWorld3D} from '../dist/world-3d.js';
import {interiorPlan} from '../dist/shop-interiors.js';
import {spatialLayout} from '../dist/spatial-layout.js';
import {freeRoute,clearWalk,walkable} from '../dist/free-navigation.js';
import {mallLayouts,assertCampusTrip} from './campus-assertions.mjs';

const evidence=JSON.parse(readFileSync(new URL('../docs/research-v40/catalog-evidence.json',import.meta.url))),shops=E.STORES.filter(s=>s.collectionEdition===40),esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const fresh=()=>Object.assign(E.createState(),{sandbox:true,cash:10000000});
function owner(){const w={scene:new T.Scene(),resources:new Set(),state:fresh(),canvas:{dataset:{}}};for(const m of ['box','ball','cyl','mat','mesh'])w[m]=MallWorld3D.prototype[m];return w;}
function release(w){for(const r of w.resources)r.dispose?.();}

test('eight official selected-color records keep their exact price, source labels, photo hashes and dated availability',()=>{
 assert.equal(additions.length,8);
 for(const a of additions){const f=evidence.products.find(f=>f.id===a.id);assert.ok(f);assert.equal(a.source,f.source);assert.equal(a.referenceCheckedOn,'2026-10-30');assert.equal(a.referenceAmount,f.priceUSD);assert.equal(a.colorName,f.color);assert.deepEqual(a.sizes,f.sizes);assert.equal(a.photo.imageUrl,f.imageUrl);assert.equal(a.referenceSKU,f.sku);assert.equal(a.merchantOnly,true);assert.equal(a.referencePriceVerified,true);assert.equal(createHash('sha256').update(readFileSync(new URL('../dist/'+a.photo.path,import.meta.url))).digest('hex'),f.photoSHA256);assert.match(new URL(a.source).hostname,/^(?:www\.)?(?:cottonon\.com|aritzia\.com)$/);assert.equal(a.priceBasis,f.sourceOfferNote+' Game prices, quantities and return terms are simulated.');}
 const cotton=additions.filter(a=>a.brand==='Cotton On');assert.equal(cotton.find(a=>a.colorName==='River Blue').priceUSD,25);assert.equal(cotton.find(a=>a.colorName==='Roan Black').priceUSD,69.99);assert.ok(cotton.filter(a=>a.type==='shirt').every(a=>a.priceUSD===20));
 assert.ok(additions.filter(a=>a.name.includes('Longsleeve')).every(a=>a.sourceAvailability==='OutOfStock'&&/out of stock/.test(apparelFactsHTML(a,esc))));
});

test('eight unfinished shops gain their own four models while every earlier active product ID remains compatible',()=>{
 assert.equal(shops.length,8);assert.equal(shops.reduce((n,s)=>n+s.count,0),32);assert.equal(E.PRODUCTS.length,8794);assert.equal(E.STORES.filter(s=>s.catalogStatus==='verified').length,1064);assert.equal(E.STORES.filter(s=>s.catalogStatus==='pending').length,401);assert.equal(E.STORES.filter(E.isPlanningStore).length,310);assert.equal(E.STORES.filter(hasCollectionDesk).length,50);
 const old=E.PRODUCTS.filter(p=>!/^v(?:40|42|43|44|45)-real-/.test(p.modelId||'')).map(p=>p.id).sort();assert.equal(old.length,evidence.previousCatalog.count);assert.equal(createHash('sha256').update(old.join('\n')).digest('hex'),evidence.previousCatalog.sortedProductIdsSHA256);
 for(const s of shops){assert.equal(s.businessKind,'apparel');assert.equal(collectionProducts(s).length,4);assert.ok(s.products.every(p=>p.brand===s.name&&p.store===s.id&&p.modelId.startsWith('v40-real-')));}
 assert.ok(E.PRODUCTS.filter(p=>p.modelId?.startsWith('v40-real-')).every(p=>shops.some(s=>s.id===p.store)));
});

test('source W/L and alpha aliases retain the exact purchase label and produce meaningful game sizing',()=>{
 const s=fresh();s.waist='32';s.size='XXL';
 for(const a of additions){const p=E.PRODUCTS.find(p=>p.modelId===a.id);if(p.sizingSystem==='waist-inseam')assert.equal(E.idealSize(s,p),'W32L32');else if(p.brand==='Aritzia')assert.equal(E.idealSize(s,p),'2XL');}
 const p=E.PRODUCTS.find(p=>p.modelId?.startsWith('v40-real-')&&p.colorName==='River Blue');s.waist='28';assert.equal(E.idealSize(s,p),'W28L32');assert.equal(fitScaleForSize('W32L32','32'),1);assert.equal(fitScaleForSize('2XL','XXL'),1);assert.equal(fitScaleForSize('2XS','XXS'),1);assert.ok(fitScaleForSize('W28L32','W32L32')<1);assert.ok(fitScaleForSize('2XL','M')>1);
 const old=E.PRODUCTS.find(p=>p.sizingSystem==='waist-inseam'&&!p.modelId.startsWith('v40-real-'));s.waist='32';assert.equal(E.idealSize(s,old),'32 X 32');
});

test('each new variant can be fitted, paid for, reloaded and refunded exactly once with source labels intact',()=>{
 for(const a of additions){const s=fresh(),p=E.PRODUCTS.find(p=>p.modelId===a.id),cash=s.cash,size=E.idealSize(s,p),stock=E.stock(s,p.id,size);assert.equal(E.fit(s,p.id,size).fits,true);const bill=E.checkout(s,p.store,[{id:p.id,size}]);assert.equal(s.cash,cash-bill.total);const loaded=E.validateImport(JSON.stringify(s)),item=loaded.purchases.at(-1);assert.equal(item.size,size);assert.ok(item.tags&&!item.worn);assert.equal(E.returnItem(loaded,item.id,p.store),bill.total);assert.equal(loaded.cash,cash);assert.equal(E.stock(loaded,p.id,size),stock);assert.throws(()=>E.returnItem(loaded,item.id,p.store),/Already/);assert.equal(loaded.version,6);assert.equal(loaded.mapRevision,10);}
});

test('old pending-shop plans survive stocking and free comparisons expose promotion and source sizing details',()=>{
 for(const st of shops){const s=fresh();s.mallId=st.mallId;const old=E.PRODUCTS.find(p=>p.store!==st.id&&!p.modelId?.startsWith('v40-real-')&&E.mallForStore(s,p.store).id===s.mallId);s.shoppingPlans=[{store:st.id,category:'all',budget:15000,items:[old.id],day:1}];const loaded=E.validateImport(JSON.stringify(s));assert.deepEqual(loaded.shoppingPlans,s.shoppingPlans);const before=JSON.stringify(loaded),html=collectionGuideHTML(loaded,st,st.products.slice(0,2).map(p=>p.id),{E,esc,picture:p=>'<span>'+esc(p.name)+'</span>'});assert.match(html,/Source size labels/);assert.ok(html.includes(st.products[0].sourceOfferNote));assert.match(apparelFactsHTML(st.products[0],esc),/Source sizing/);assert.equal(JSON.stringify(loaded),before);}
});

test('reviewed textile profiles distinguish relaxed denim, short tees and fitted cropped long sleeves',()=>{
 for(const a of additions){const p=E.PRODUCTS.find(p=>p.modelId===a.id),look=productAppearance(p);assert.equal(look.photo,PRODUCT_PHOTOS[p.id].path);assert.equal(look.colorEvidence,'reviewed-photograph');assert.equal(look.garment.evidence,'photo-reviewed');assert.ok(look.surface.regionReviewed);if(p.type==='pants'){assert.equal(look.garment.leg,'straight');assert.equal(look.garment.pockets,5);assert.equal(look.garment.fabric,'denim');}else if(p.name.includes('Longsleeve')){assert.equal(look.longSleeve,true);assert.equal(look.garment.length,'cropped');assert.equal(look.garment.fit,'slim');}else assert.equal(look.longSleeve,false);}
});

test('opaque cropped sleeves cover the real torso and shoulders while leaving skin below the intended hem',()=>{
 for(const a of additions.filter(a=>a.name.includes('Longsleeve'))){const p=E.PRODUCTS.find(p=>p.modelId===a.id),w=owner(),g=MallWorld3D.prototype.person.call(w,'#bda079',{}, {top:p});g.updateMatrixWorld(true);g.userData.anatomy.skeleton.update();assert.equal(g.userData.torso.visible,true);const visible=[];g.traverse(o=>{if(!o.isMesh)return;let n=o;while(n&&n.visible)n=n.parent;if(!n)visible.push(o);});
  for(const sign of [-1,1])for(const y of [32.5,34,36,38,40,40.8,41.2])for(const x of [-4,-2,0,2,4]){const hits=new T.Raycaster(new T.Vector3(x,y+g.position.y,sign*20),new T.Vector3(0,0,-sign)).intersectObjects(visible,false);assert.ok(hits.length);assert.ok(!['human:torso','human:neckline'].includes(hits[0].object.name),p.name+' exposed skin at '+x+','+y+','+sign);}
  const under=new T.Raycaster(new T.Vector3(0,28+g.position.y,20),new T.Vector3(0,0,-1)).intersectObjects(visible,false);assert.equal(under[0].object.name,'human:torso','cropped hem should preserve the exposed waist');release(w);
 }
});

test('the starter shirt overlaps the new denim waistband without small front or back poke-throughs',()=>{
 const p=E.PRODUCTS.find(p=>p.modelId?.startsWith('v40-real-')&&p.colorName==='River Blue'),w=owner(),g=MallWorld3D.prototype.person.call(w,'#c2a36e',{}, {bottom:p});g.updateMatrixWorld(true);g.userData.anatomy.skeleton.update();const meshes=[];g.traverse(o=>{if(!o.isMesh)return;let n=o;while(n&&n.visible)n=n.parent;if(!n)meshes.push(o);});
 for(const sign of [-1,1])for(let y=27.1;y<29.1;y+=.2)for(let x=-4;x<=4;x+=.25){const hits=new T.Raycaster(new T.Vector3(x,y+g.position.y,sign*20),new T.Vector3(0,0,-sign)).intersectObjects(meshes,false);assert.equal(hits[0]?.object.name,'starter-shirt','waistband crosses shirt at '+x+','+y+','+sign);}release(w);
});

test('new studios retain clear routes to displays, comparisons, fitting, payment, returns and rest; added props stay on fixtures',()=>{
 for(const st of shops){const l=interiorPlan(st,E.FLOORPLANS[st.mallId],6);for(const p of [{x:600,y:210},{x:600,y:675},l.exit,...Object.values(l.services),...l.stockFixtures.map(r=>r.approach)]){assert.ok(walkable(p,l.nav),st.id);const route=freeRoute(l.spawn,p,l.nav);assert.ok(route.length>1,st.id);for(let i=1;i<route.length;i++)assert.ok(clearWalk(route[i-1],route[i],l.nav),st.id);}
  const w=owner();w.layout=l;buildTextileStudio(w,st,{trim:'#786a57',accent:'#6c7c77',wall:'#e7dfcf'});assert.equal(w.canvas.dataset.textileStudio,st.name==='Cotton On'?'denim':'jersey');assert.ok(w.scene.children.length>30);
  for(const m of w.scene.children){const b=new T.Box3().setFromObject(m),regions=[{x:540,y:125,width:120,height:45},{x:554,y:615,width:92,height:30},l.fitting];assert.ok(regions.some(r=>b.min.x>=r.x-.001&&b.max.x<=r.x+r.width+.001&&b.min.z>=r.y-.001&&b.max.z<=r.y+r.height+.001),'prop crosses fixture at '+JSON.stringify(b));}release(w);
 }
});

test('detailed water and notice furniture stays inside the existing collider instead of protruding into the approach',()=>{
 for(const amenity of ['water','notice']){const parts=[],b={box(x,y,z,w,h,d){parts.push({x,y,z,w,h,d});},cylinder(x,y,z,r,h){parts.push({x,y,z,w:r*2,h,d:r*2});}};buildWaystationDetails(b,100,200,amenity,{trim:'#7b6b56',stone:'#d4cfbf'});assert.ok(parts.length>20);for(const p of parts){assert.ok(p.x-p.w/2>=89-1e-6&&p.x+p.w/2<=111+1e-6);assert.ok(p.z-p.d/2>=190-1e-6&&p.z+p.d/2<=210+1e-6);}}
});

test('all 23 floors offer three real nearby discovery routes with correct saved-note status and no extra charges',()=>{
 let floors=0;for(const mall of E.MALLS){const layouts=mallLayouts(mall);for(const [floor,l]of layouts.entries()){const s=fresh();s.mallId=mall.id;s.floor=floor;const water=l.environment.fixtures.find(f=>f.amenity==='water'),before=JSON.stringify(s);for(const amenity of ['water','notice']){const rows=nearbyDiscoveries(s,l,amenity);assert.equal(rows.length,3);assert.equal(new Set(rows.map(r=>r.fixture.activity)).size,3);const html=nearbyDiscoveryHTML(s,l,amenity,esc);assert.match(html,new RegExp('data-floor="'+floor+'"'));assert.equal((html.match(/data-action="center-stop"/g)||[]).length,3);for(const r of rows)assert.ok(l.environment.fixtures.includes(r.fixture));}assert.equal(JSON.stringify(s),before);
  for(const r of nearbyDiscoveries(s,l,'water'))assertCampusTrip(mall,layouts,floor,water.approach,floor,r.fixture.approach);
  s.commonsNotes=[{mallId:mall.id,floor,kind:'garden',choice:'color',day:1}];assert.equal(nearbyDiscoveries(s,l,'notice').find(r=>r.fixture.activity==='garden').discovered,true);assert.match(nearbyDiscoveryHTML(s,l,'notice',esc),/Discovered on this floor/);floors++;
 }}assert.equal(floors,23);
});

test('fitting turns and terminal gestures ease at each boundary, stay bounded and freeze under reduced motion',()=>{
 for(let t=-.2;t<5;t+=1/120){assert.ok(Math.abs(fittingTurn(t))<=.550001);assert.equal(fittingTurn(t,true),0);assert.ok(checkoutGesture(t)>=0&&checkoutGesture(t)<=1);assert.equal(checkoutGesture(t,true),0);}
 assert.equal(fittingTurn(NaN),0);assert.equal(fittingTurn(0),0);assert.equal(fittingTurn(1),0);
 for(const t of [0,.18,.35,.65,.8,1])assert.ok(Math.abs(fittingTurn(t+1e-5)-fittingTurn(t-1e-5))<1e-6);
 for(const t of [0,.7,1.1,1.9,3.6])assert.ok(Math.abs(checkoutGesture(t+1e-5)-checkoutGesture(t-1e-5))<1e-6);
 const w=owner(),g=createShopper(w,'#8e927b');for(let i=0;i<300;i++){applyCharacterPose(g,{kind:'pay',time:i/60,delta:1/60});g.updateMatrixWorld(true);g.traverse(o=>assert.ok(o.matrixWorld.elements.every(Number.isFinite)));assert.ok(Math.abs(g.position.x)+Math.abs(g.position.z)<1e-8);}release(w);
});

test('actual fitting and reading camera positions and look targets converge identically across refresh rates and retain continuity on exit',()=>{
 for(const action of [{kind:'try',previewProduct:additions[0]},{kind:'read',readCameraOffset:[40,100]}]){
  const run=fps=>{const w=Object.create(MallWorld3D.prototype);Object.assign(w,{camera:new T.PerspectiveCamera(45,1.4,1,5000),cameraLook:new T.Vector3(0,20,0),player:new T.Group(),action,frameDt:1/fps,playerFittingRoom:0,avatar:{x:0,y:0},layout:{width:1200,height:900},state:fresh(),zoom:1,angle:0});w.camera.position.set(100,200,400);w.player.position.set(50,0,30);for(let i=0;i<fps;i++)w.setCamera();const out=[w.camera.position.clone(),w.cameraLook.clone()],before=w.camera.quaternion.clone();w.action=null;w.setCamera();assert.ok(before.angleTo(w.camera.quaternion)<.2,'camera snapped after action');return out;};
  const base=run(60);for(const fps of [15,30,120]){const out=run(fps);assert.ok(base[0].distanceTo(out[0])<1e-7);assert.ok(base[1].distanceTo(out[1])<1e-7);}
 }
});
