import * as T from './vendor/three.module.js';
import {productAppearance} from './product-appearance.js?v=23.0.0';
import {slotForProduct,money,price} from './engine.js?v=24.0.0';
import {addInstancedMerchandise,finishMerchandiseInstances} from './merchandise-3d.js?v=23.0.0';

const clothes=new Set(['shirt','hoodie','cardigan','jacket','pants','shorts']);
const bags=new Set(['bag','crossbody','backpack','duffel','wallet']);

// Repeated stock uses instancing; photographs retain the exact researched product identity.
function stockBatch(w){
 const shirt=new T.Shape();shirt.moveTo(-5,0);for(const [x,y]of [[5,0],[13,-7],[10,-13],[7,-10],[7,-28],[-7,-28],[-7,-10],[-10,-13],[-13,-7],[-5,0]])shirt.lineTo(x,y);
 const pants=new T.Shape();pants.moveTo(-8,0);for(const [x,y]of [[8,0],[7,-29],[1,-29],[0,-10],[-1,-29],[-7,-29],[-8,0]])pants.lineTo(x,y);
 const geometry={box:new T.BoxGeometry(1,1,1),shirt:new T.ExtrudeGeometry(shirt,{depth:8,bevelEnabled:false}),pants:new T.ExtrudeGeometry(pants,{depth:8,bevelEnabled:false})},batches=new Map(),models=new Map(),dummy=new T.Object3D();let count=0;
 return {model(p,x,y,z,h,turn){addInstancedMerchandise(w,models,p,x,y,z,h,turn);count++;},add(kind,color,x,y,z,sx=1,sy=1,sz=1,turn=0){const key=kind+color;if(!batches.has(key))batches.set(key,{kind,color,items:[]});batches.get(key).items.push({x,y,z,sx,sy,sz,turn});count++;},finish(){for(const g of Object.values(geometry))w.resources.add(g);for(const b of batches.values()){const mesh=new T.InstancedMesh(geometry[b.kind],w.mat(b.color),b.items.length);mesh.castShadow=true;mesh.receiveShadow=true;b.items.forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(0,p.turn,0);dummy.scale.set(p.sx,p.sy,p.sz);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});mesh.instanceMatrix.needsUpdate=true;w.scene.add(mesh);}finishMerchandiseInstances(w,models);return count;}};
}
function localStock(batch,cx,cz,turn){return (kind,color,x,y,z,sx=1,sy=1,sz=1)=>batch.add(kind,color,cx+x*Math.cos(turn)+z*Math.sin(turn),y,cz-x*Math.sin(turn)+z*Math.cos(turn),sx,sy,sz,turn);}
function rail(w,batch,cx,cz,width,depth,p,profile,turn=0,structure=true){
 const add=localStock(batch,cx,cz,turn),color=productAppearance(p).color||profile.accent;
 if(structure){add('box',profile.fixture,0,3,0,width,5,depth);for(const x of [-width/2+5,width/2-5])add('box',profile.trim,x,39,0,3,74,depth-6);for(const z of [-depth/2+8,depth/2-8])add('box',profile.trim,0,76,z,width-6,3,3);}
 const n=Math.max(5,Math.floor(width/11));
 for(const z of [-depth/2+9,depth/2-9])for(let i=0;i<n;i++){const x=-width/2+9+i*(width-18)/(n-1);batch.model(p,cx+x*Math.cos(turn)+z*Math.sin(turn),41,cz-x*Math.sin(turn)+z*Math.cos(turn),34,turn+Math.PI/2);}
 for(let i=0;i<5;i++)for(let layer=0;layer<3;layer++)add('box',color,-width/2+13+i*(width-26)/4,9+layer*2.5,0,18,2,depth*.56);
}
function shelfGoods(batch,cx,cz,turn,p,profile,width=84,heights=[19,44,69]){
 const add=localStock(batch,cx,cz,turn),color=productAppearance(p).color||profile.accent;
 for(const y of heights)for(const x of [-width*.3,0,width*.3]){
  if(clothes.has(p.type)){for(let layer=0;layer<4;layer++)add('box',color,x,y+layer*2.5,0,20,2,19);}
  else if(['shoes','sandals'].includes(p.type)){for(const dx of [-5,5]){add('box','#eee8da',x+dx,y-2,0,7,2,21);add('box',color,x+dx,y+2,-2,7,7,17);}}
  else if(bags.has(p.type)){batch.model(p,cx+x*Math.cos(turn),y-5,cz-x*Math.sin(turn),p.type==='wallet'?14:22,turn);}
  else{add('box',color,x,y+4,0,12,15,11);add('box',profile.trim,x,y+13,0,8,3,8);}
 }
}
function shelfStock(batch,cx,cz,turn,p,profile,width=84){
 const add=localStock(batch,cx,cz,turn);add('box',profile.fixture,0,45,-10,width,88,5);for(const y of [12,37,62,86])add('box',profile.trim,0,y,0,width+2,3,25);shelfGoods(batch,cx,cz,turn,p,profile,width);
}

export function buildStoreFitout(w,store,profile,layout,selection){
 const own=store.products||[],batch=stockBatch(w),wearable=own.some(p=>slotForProduct(p)),apparel=own.filter(p=>clothes.has(p.type)),changing=apparel.length>0;
 selection.forEach((p,i)=>{const r=layout.displays[i];if(clothes.has(p.type))rail(w,batch,r.x+r.width/2,r.y+r.height/2,r.width-4,r.height-7,p,profile,0,false);const hit=w.box(r.x+r.width/2,35,r.y+r.height/2,r.width,70,r.height,w.mat('#ffffff',{transparent:true,opacity:0,depthWrite:false}));hit.castShadow=false;w.tag(hit,'product:'+p.id,{x:r.x+r.width/2,y:r.y+r.height+20});});
 for(const [i,r]of layout.stockFixtures.entries()){
  const p=r.kind==='island'&&apparel.length?apparel[i%apparel.length]:r.kind==='feature'&&apparel.length?apparel[(i+w.state.day)%apparel.length]:own[(i*3+w.state.day)%Math.max(1,own.length)];if(!p)continue;
  const cx=r.x+r.width/2,cz=r.y+r.height/2,turn=r.kind==='wall'?(r.side<0?Math.PI/2:-Math.PI/2):0;
  if(r.kind==='feature'){
   w.box(cx,27,cz,r.width,6,r.height,profile.fixture);for(const dx of [-r.width/2+10,r.width/2-10])w.box(cx+dx,13,cz,4,26,r.height-8,profile.trim);
   if(clothes.has(p.type)){for(const dx of [-48,-16,16,48])for(let n=0;n<4;n++)batch.add('box',productAppearance(p).color||profile.accent,cx+dx,32+n*3,cz,25,2.5,30);}
   else if(bags.has(p.type)){for(const dx of [-45,0,45])batch.model(p,cx+dx,31,cz,31,0);}
   else{for(const dx of [-45,45])w.photo(p,cx+dx,49,cz,25,30);}
   w.photo(p,cx,67,cz,30,34);
  }
  else if(r.kind==='wall')shelfStock(batch,cx,cz,turn,p,profile,r.height-6);
  else if(apparel.length)rail(w,batch,cx,cz,r.height-8,r.width-6,apparel[i%apparel.length],profile,Math.PI/2);
  else{w.box(cx,20,cz,r.width,40,r.height,profile.fixture);for(const z of [cz-48,cz+48]){w.photo(p,cx,59,z,34,39);}}
  const group=new T.Group();group.position.set(cx,0,cz);group.rotation.y=turn;w.scene.add(group);
  if(r.kind==='wall')w.photo(p,0,108,8,38,37,group);
  const key='product:'+p.id;w.tag(group,key,r.approach);const hit=w.box(cx,45,cz,r.width,90,r.height,w.mat('#ffffff',{transparent:true,opacity:0,depthWrite:false}));hit.castShadow=false;w.tag(hit,key,r.approach);const label=w.label(money(price(w.state,p)),r.approach.x,28,r.approach.y,52);w.tag(label,key,r.approach);
  w.interiorStops.push({point:r.approach,id:key,name:p.name,label:'Browse stocked display · '+money(price(w.state,p))});
 }
 // The collection rail is stocked from this merchant only, never from guest assortments.
 if(apparel.length&&!/shoe|sneaker|fold|sewing/.test(profile.feature)){const r=layout.rail;rail(w,batch,r.x+r.width/2,r.y+28,r.width-10,38,apparel[0],profile);}
 if(/shoe|sneaker|travel|shelf|fold|book|rack/.test(profile.feature)&&own.length){const center=layout.rail.x<500?640:530,pool=/shoe|sneaker/.test(profile.feature)?own.filter(p=>['shoes','sandals'].includes(p.type)):/fold/.test(profile.feature)?apparel:own;for(const [i,x]of [center-95,center,center+95].entries()){const p=(pool.length?pool:own)[i%(pool.length||own.length)];shelfGoods(batch,x,134,0,p,profile,78,[32,58,84]);}}
 const fitting=layout.fitting,fitX=fitting.x+70;
 w.fittingCurtains=[];
 for(const room of layout.fittingRooms){
  w.box(room.x,-1,room.y,59,2,78,w.mat(profile.accent,{polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-2}));
  w.box(room.x,43,fitting.y+2,62,86,4,profile.wall);
  w.box(room.x,42,fitting.y+7,32,65,2,w.mat('#b4ceca',{metalness:.75,roughness:.16}));
  w.box(room.x,13,fitting.y+20,32,6,18,profile.fixture);
  if(changing){const curtain=new T.Group();curtain.position.set(room.x-23,0,fitting.y+88);w.scene.add(curtain);const shade='#'+new T.Color(profile.fixture).multiplyScalar(.88).getHexString();for(let i=0;i<8;i++)w.box(-4.4+i*1.25,42,i%2?.8:0,1.3,77,1.5,i%2?profile.fixture:shade,curtain);w.fittingCurtains.push({mesh:curtain,room:room.id,x:room.x});for(let dx=-28;dx<=28;dx+=7)w.cyl(room.x+dx,84,fitting.y+87,.7,5,profile.trim);}
  else{w.box(room.x,27,fitting.y+23,42,5,25,profile.fixture);}
  w.label(changing?'ROOM '+(room.id+1):(wearable?'STYLE ':'CONSULT ')+(room.id+1),room.x,94,fitting.y+20,60,profile.accent,profile.wall);
 }
 for(const dx of [0,68,136])w.box(fitting.x+dx+2,changing?42:19,fitting.y+45,4,changing?84:38,90,profile.wall);
 if(changing)w.box(fitX,87,fitting.y+87,140,3,4,profile.trim);
 // A fully dressed payment area: register, card terminal, scanner, bags and receipt roll.
 for(const [kind,r]of [['checkout',layout.checkout],['returns',layout.returns]]){
  const cx=r.x+r.width/2,cz=r.y+r.height/2;
  w.box(cx,48,cz,r.width+3,4,r.height+3,profile.trim);
  w.box(cx+20,61,cz-7,26,22,3,'#263e39');w.box(cx+20,62,cz-4.9,22,16,1,'#86aba3');
  w.box(cx+20,50,cz,19,3,13,'#424a44');w.box(cx-20,55,cz+13,13,10,10,'#374e48');
  w.box(cx-20,61,cz+14,9,5,1,'#b8cec1');w.cyl(cx+45,54,cz-2,4,8,'#eee9dc');
  for(const dx of [-r.width/2+14,-r.width/2+32]){w.box(cx+dx,59,cz-11,15,20,8,profile.wall);const handle=w.mesh(new T.TorusGeometry(4,1,4,10,Math.PI),w.mat(profile.trim));handle.position.set(cx+dx,70,cz-11);}
  const cashier=w.person(profile.accent,{hair:kind==='checkout'?'#4c3930':'#8b6c4d'});cashier.position.set(cx,0,r.y-28);cashier.rotation.y=0;w.storeStaff.push({mesh:cashier,kind});
 }
 for(const [i,p]of layout.queue.entries()){w.box(p.x,.2,p.y,24,.3,3,profile.trim);if(i===0){w.cyl(p.x+20,17,p.y-12,2,34,profile.trim);w.cyl(p.x+20,2,p.y-12,8,3,profile.trim);}}
 w.label('CHECKOUT QUEUE',layout.queue[1].x,13,layout.queue[1].y+8,75,profile.accent,profile.wall);
 w.canvas.dataset.stockedFixtureCount=String(selection.length+layout.stockFixtures.length);
 w.canvas.dataset.stockPieceCount=String(batch.finish());
}
