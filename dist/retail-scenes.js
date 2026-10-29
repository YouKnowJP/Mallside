import {retailIdentity,windowAssortment} from './retail-identity.js?v=23.0.0';
import {facadeFrame} from './mall-design.js?v=35.0.0';
import * as T from './vendor/three.module.js';

export function buildWindowDisplay(w,store,products,photos){
 const identity=retailIdentity(store),style=identity.design,f=facadeFrame(store),group=new T.Group();group.position.set(f.x,0,f.z);group.rotation.y=f.turn;w.scene.add(group);w.cutawayAssets.get(store.id)?.objects.push(group);
 const items=windowAssortment(products,store.id,w.state.day,photos),width=Math.min(27,f.width*.28);
 for(const [i,p]of items.entries()){
  const x=(i?1:-1)*f.width*.29,z=f.depth/2-9,wearable=['shirt','hoodie','cardigan','jacket','pants','shorts'].includes(p.type),jewelry=['ring','bracelet','watch','necklace','earrings'].includes(p.type);
  w.box(x,5,z,width,10,14,style.fixture,group);w.box(x,10.5,z,width+1,1,15,style.trim,group);
  if(wearable){const mannequin=new T.Group();mannequin.position.set(x-6,11,z);group.add(mannequin);w.cyl(0,17,0,1,34,'#b7afa0',mannequin);w.box(0,22,0,9,16,5,p.color||style.accent,mannequin);w.ball(0,34,0,4,'#ddd9cd',mannequin);for(const dx of [-3,3])w.box(dx,8,0,3,16,4,'#ded9cb',mannequin);w.photo(p,x+6,30,z+3,width*.58,27,group);}
  else{if(jewelry)w.box(x,14,z,18,5,12,style.accent,group);w.photo(p,x,32,z+3,width-2,34,group);}
  const glass=w.box(x,33,z+5,width+2,43,1,w.mat('#c7e2dc',{transparent:true,opacity:.075,depthWrite:false}),group);glass.castShadow=false;
  w.box(x,57,z+3,width,2,4,'#ead8b1',group);
 }
 group.userData.models=items.map(p=>p.id);group.userData.store=store.id;return group;
}

export function buildSignatureInterior(w,profile,layout,products){
 const own=products.filter(p=>p.store===layout.store.id),rail=layout.rail,cx=rail.x+rail.width/2,back=layout.rail.x<500?640:530;
 // All added vertical features stay inside the existing rail/decor footprints.
 if(['nike','adidas','newbalance','puma','vans'].includes(profile.key)){
  for(let i=0;i<6;i++){const x=rail.x+32+i%3*72,y=24+Math.floor(i/3)*40;w.box(x,y-6,rail.y+22,64,3,25,profile.fixture);const p=own[i%Math.max(1,own.length)];if(p)w.photo(p,x,y+10,rail.y+27,42,26);}
  for(const x of [530,670]){w.box(x,.25,480,3,.3,340,profile.key==='nike'?'#f1e6c8':'#ebece4');}
 }else if(profile.key==='uniqlo'||profile.key==='muji'){
  for(let x=rail.x+21,j=0;x<rail.x+rail.width;x+=37,j++)for(let row=0;row<3;row++){w.box(x,14+row*20,rail.y+22,31,2,26,profile.fixture);const p=own[j%Math.max(1,own.length)];for(let n=0;n<3;n++)w.box(x,18+row*20+n*3,rail.y+22,24,2.5,19,p?.color||['#b08676','#aeb7a8','#c9bb8e'][j%3]);}
 }else if(profile.key==='sephora'||profile.kind==='beauty'){
  for(const x of [back-95,back,back+95]){w.box(x,48,122,65,70,2,'#252a27');w.box(x,48,125,56,61,2,w.mat('#abc1bb',{metalness:.7,roughness:.2}));for(const sign of [-1,1])w.box(x+sign*32,48,127,2,66,2,'#f8f2e2');}
  for(let i=0;i<8;i++)w.cyl(rail.x+16+i*26,32,rail.y+24,5,23,own[i%Math.max(1,own.length)]?.color||profile.accent);
 }else if(profile.key==='apple'){
  w.box(cx,43,rail.y+18,210,72,5,'#e9ece4');own.slice(0,3).forEach((p,i)=>w.photo(p,rail.x+37+i*72,49,rail.y+23,49,51));
  for(const x of [315,885]){w.box(x,132,360,5,4,420,profile.fixture);}
 }else if(profile.key==='allsaints'){
  for(let i=0;i<6;i++){const x=rail.x+19+i*36;w.box(x,31,rail.y+22,29,4,20,profile.fixture);w.box(x-6,40,rail.y+22,7,17,8,'#363a35');w.box(x+3,47,rail.y+22,21,5,8,'#363a35');const wheel=w.cyl(x-9,47,rail.y+22,6,3,profile.trim);wheel.rotation.z=Math.PI/2;}
 }else if(['hermes','louisvuitton','coach','bottegaveneta','longchamp'].includes(profile.key)||profile.kind==='boutique'||profile.kind==='jewelry'){
  for(let i=0;i<3;i++){const x=rail.x+36+i*74;w.box(x,37,rail.y+20,65,70,7,profile.fixture);w.box(x,38,rail.y+25,57,61,3,profile.wall);w.box(x,14,rail.y+33,62,4,28,profile.trim);const p=own[i%Math.max(1,own.length)];if(p)w.photo(p,x,43,rail.y+29,40,46);w.box(x,72,rail.y+32,61,2,4,'#e9d1a5');}
 }else{
  own.slice(0,4).forEach((p,i)=>w.photo(p,rail.x+26+i*55,46,rail.y+23,42,48));
 }
 if(profile.key==='prada'){for(const x of [430,600,770]){w.box(x,103,118,120,3,6,'#e6e9dc');w.box(x,43,120,110,65,3,'#b2c9ae');}}
 if(profile.key==='miumiu'){for(let x=215;x<1000;x+=30)for(const y of [20,45,70]){const tile=w.box(x,y,119,12,12,1,profile.trim);tile.rotation.z=Math.PI/4;}}
 // A distinct overhead lighting scheme gives each room a different silhouette.
 const warm=['atelier','salon','jewelry','coastal','home','arcade'].includes(profile.layout);
 for(const x of [340,600,860]){
  if(warm){w.cyl(x,116,335,1,32,profile.trim);w.cyl(x,98,335,17,12,profile.fixture);w.cyl(x,91,335,15,2,'#f7e4b6');}
  else{w.box(x,117,340,140,3,9,profile.trim);w.box(x,114,340,132,2,6,'#f6ecd1');}
 }
}
