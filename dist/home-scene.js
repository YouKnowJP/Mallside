import * as T from './vendor/three.module.js';
import {ROOM_STYLES} from './home-life.js?v=26.0.0';
import {owned,byId} from './engine.js?v=44.0.0';
import {placeMerchandise} from './merchandise-3d.js?v=44.0.0';
// A small original room; every displayed product is an owned catalog purchase.
export function buildCollectionRoom(w,state){
 const style=ROOM_STYLES.find(v=>v.id===state.roomStyle)||ROOM_STYLES[0],materials=new Map();
 const mat=(color,roughness=.8)=>{const k=color+':'+roughness;if(!materials.has(k))materials.set(k,w.mat(color,{roughness}));return materials.get(k);};
 const box=(x,y,z,sx,sy,sz,color,roughness=.8)=>{const m=w.mesh(new T.BoxGeometry(sx,sy,sz),mat(color,roughness));m.position.set(x,y,z);return m;};
 w.scene.background=new T.Color(style.wall);box(0,-.5,0,208,1,140,style.wood);
 for(let i=0;i<17;i++)box(-98+i*12,.025,0,.18,.01,140,'#88725b');
 box(0,47,-48,208,94,3,style.wall);box(-103,47,-4,3,94,90,style.wall);
 box(-26,.035,12,77,.05,49,'#c9c8b3');for(let i=0;i<7;i++){box(-59+i*11,.07,-11,1,.02,3,'#eee8d8');box(-59+i*11,.07,35,1,.02,3,'#eee8d8');}box(0,2,-45,208,4,1.2,'#f0eadc');box(-100,2,-4,1.2,4,90,'#f0eadc');
 box(55,81,-45,31,20,2,style.wood);box(55,81,-43.8,27,16,.3,'#f5efdf');box(51,79,-43.5,9,9,.2,style.accent);box(60,82,-43.4,7,8,.2,'#c49c7a');
 // Window has a deep reveal, layered frame and a quiet original garden view.
 box(-50,56,-45,71,58,3,style.wood);box(-50,56,-43,65,52,1,'#b8cfcb');
 box(-50,56,-41,1.2,52,1.4,'#f7f1e4');box(-50,55,-41,65,1.2,1.4,'#f7f1e4');box(-50,27,-40,76,3,8,'#f7f1e4');
 for(const x of [-88,-12])box(x,57,-39,9,63,3,'#e8decd');
 for(const y of [13,39,66])box(57,y,-20,78,2,24,style.wood,.6);
 for(const x of [17,97])box(x,39,-20,2,56,24,style.wood,.6);
 box(57,39,-32,78,55,2,style.accent);for(const x of [44,70])box(x,39,-20,1.2,52,23,style.wood,.6);
 const purchases=state.displayItems.map(id=>owned(state).find(i=>i.id===id&&!i.checked)).filter(Boolean);
 purchases.forEach((item,i)=>{const p=byId(item.productId),row=Math.floor(i/3),x=31+i%3*26,base=14+row*26,obj=placeMerchandise(w,p,x,base+10,-16,20,22,w.scene,{hanger:['shirt','hoodie','cardigan','jacket','pants','shorts'].includes(p.type),stock:false});obj.position.y=base;obj.rotation.y=-.12;obj.userData.roomPurchase=item.id;});
 box(-72,28,-9,36,2,22,style.wood,.6);for(const x of [-86,-58])box(x,13,-9,2,27,19,'#59655e');
 const pot=w.mesh(new T.CylinderGeometry(4.3,3.5,7,16),mat('#c5a180'));pot.position.set(-72,32,-10);
 for(const [x,y,z,scale]of [[-72,43,-10,1],[-78,40,-9,.7],[-66,42,-10,.8]]){const leaf=w.mesh(new T.SphereGeometry(1,12,8),mat('#6b8c70'));leaf.scale.set(6*scale,9*scale,2*scale);leaf.position.set(x,y,z);leaf.rotation.z=(x+72)*.08;}
 box(76,2,43,33,4,33,style.wood,.6);box(76,13,43,3,24,3,'#5f675f',.4);
 const shade=w.mesh(new T.CylinderGeometry(9,14,18,24,1,true),mat('#f2e5c8'));shade.position.set(76,33,43);
 const bulb=w.mesh(new T.SphereGeometry(3,12,8),w.mat('#fff0c3',{emissive:'#d6ad67',emissiveIntensity:.35}));bulb.position.set(76,25,43);
 w.roomStyle=style.id;w.roomProductCount=purchases.length;w.player.position.x=-28;w.bench.position.x=-28;
 return {style:style.id,products:purchases.map(i=>i.productId)};
}

// Fit the room bounds at every aspect ratio and keep them inside the depth range.
export function collectionRoomCamera(aspect=1){
 const ratio=Math.max(.25,Number.isFinite(aspect)&&aspect>0?aspect:1),target=new T.Vector3(2,30,-4),direction=new T.Vector3(114,87,202).sub(target).normalize(),right=new T.Vector3().crossVectors(new T.Vector3(0,1,0),direction).normalize(),up=new T.Vector3().crossVectors(direction,right),tan=Math.tan(31*Math.PI/360);let distance=230;
 for(const x of [-105,105])for(const y of [0,94])for(const z of [-50,70]){const v=new T.Vector3(x,y,z).sub(target),depth=v.dot(direction);distance=Math.max(distance,depth+Math.abs(v.dot(right))/(tan*ratio)*1.08,depth+Math.abs(v.dot(up))/tan*1.08);}
 const position=target.clone().addScaledVector(direction,distance);return {position:position.toArray(),target:target.toArray(),near:2,far:position.length()+250};
}

// Furniture-safe paths share the open rug, rather than cutting through the desk or shelves.
export const HOME_STOPS={window:{x:-48,z:-27,label:'At the window'},shelf:{x:34,z:10,label:'Beside your kept finds'},door:{x:-28,z:48,label:'At the doorway'},center:{x:-28,z:8,label:'Back on the rug'}};
export function homeWalkRoute(id){const p=HOME_STOPS[id];return p?[{...HOME_STOPS.center},{...p}]:[];}
