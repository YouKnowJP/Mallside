import * as T from './vendor/three.module.js';
import {facadeFrame} from './mall-design.js?v=35.0.0';
import {surfaceTexture} from './scene-finish.js?v=57.0.0';
import {displayPoint} from './shop-interiors.js?v=67.0.0';
import {diningMealIds} from './district-life.js?v=35.0.0';
import {buildMealSample} from './cafe-props.js?v=65.0.0';
import {DINING_SEATS,diningSeat} from './dining-presentation.js?v=65.0.0';

// The tray and place setting sit on the existing furniture and leave its approach open.
function placeSetting(w,parent,x,y,z,id) {
 w.box(x,y+.35,z,27,.7,19,'#a4805c',parent);
 w.cyl(x-1,y+1,z,7,.65,'#f7ebd4',parent);
 w.cyl(x-1,y+1.35,z,5.6,.22,'#dddcca',parent);
 w.box(x+10,y+1,z+4,4,.34,7,'#ced7bc',parent);
 w.box(x+10,y+1.2,z-2,.6,.45,6,'#b8c3b8',parent);
 buildMealSample(w,id,parent,x-1,y+1.5,z,2.1);
}

export function buildDiningGallery(w,store,style,layout) {
 const timber=w.mat(style.fixture,{map:surfaceTexture(w,'timber'),roughness:.78});
 const tableEdge=w.mat(style.trim,{roughness:.56});
 const meals=diningMealIds(store);
 for(const [i,r] of layout.displays.entries()){
  const x=r.x+r.width/2,z=r.y+r.height/2,point=displayPoint(r),key='dining:'+store.id;
  const table=new T.Group();
  table.position.set(x,0,z);
  w.scene.add(table);
  w.tag(w.box(0,27,0,r.width-10,4,r.height-10,timber,table),key,point);
  w.box(0,24.3,0,r.width-14,1.5,r.height-14,tableEdge,table);
  for(const dx of [-33,33])w.box(dx,13,0,4,26,35,tableEdge,table);
  for(const dx of [-27,27]){
   w.box(dx,16,19,24,3,22,style.accent,table);
   w.box(dx,27,25,24,23,3,tableEdge,table);
   for(const sx of [-9,9])w.box(dx+sx,8,19,2,16,18,tableEdge,table);
  }
  placeSetting(w,table,-25,29,-9,meals[i%meals.length]);
  w.box(23,29.8,-9,13,1.6,12,'#ded6b8',table);
  w.box(23,33,-12,12,8,1,style.accent,table);
  w.cyl(0,32,-16,3,6,tableEdge,table);
  for(const [dx,dz] of [[-2,-1],[2,-1],[0,2]])w.ball(dx,37,-16+dz,2.4,'#729477',table);
  if(i===1)w.tag(w.label('Original game menu ↗',x,65,z,120,style.accent),key,point);
  w.interiorStops.push({point,id:key,name:'Dining menu',label:'Original Mallside meals · review first'});
 }
 for(const choice of DINING_SEATS){
  const seat=diningSeat(layout,choice.id);
  if(seat)w.box(seat.x,15.7,seat.y,37,1.4,17,style.accent);
 }
 w.canvas.dataset.diningTables=String(layout.displays.length);
 w.canvas.dataset.diningRoomRevision='65';
}

export function foodHallSeat(venue) {
 const frame=facadeFrame(venue);
 const offset=frame.depth/2-18;
 const x=frame.x+frame.front.x*offset,y=frame.z+frame.front.y*offset;
 const cameraDistance=Math.max(104,Math.min(142,Math.hypot(venue.door.x-x,venue.door.y-y)+18));
 return {x,y,rotation:frame.turn,bench:true,height:15,cameraDistance};
}

export function buildFoodHallCounter(w,venue) {
 const frame=facadeFrame(venue);
 const root=new T.Group();
 root.position.set(frame.x,0,frame.z);
 root.rotation.y=frame.turn;
 w.scene.add(root);
 const deskDepth=Math.min(38,frame.depth*.48);
 const desk=-frame.depth/2+deskDepth/2+2,front=desk+deskDepth/2+.35;
 const span=frame.width-12;
 w.box(0,19,desk,span,38,deskDepth,'#b58363',root);
 w.box(0,40,desk,span+3,5,deskDepth+3,'#f9efd9',root);
 w.box(0,19,front,span,26,.7,'#7b6151',root);
 for(let dx=-span/2+3;dx<span/2;dx+=5)w.box(dx,19,front+.55,1.8,24,.7,'#af8262',root);
 w.box(0,6,front+.8,span,2,.9,'#524d42',root);
 w.box(0,31,front+.8,span,1.2,1,'#d8b38b',root);
 const stand=Math.min(frame.width*.25,23);
 placeSetting(w,root,-stand,42.5,desk+5,'sandwich');
 placeSetting(w,root,stand,42.5,desk+5,'bowl');
 for(const dx of [-stand,stand]){
  w.box(dx,48,desk-10,2,11,2,'#81735d',root);
  w.box(dx,54,desk-10,26,8,1.3,'#e4d8b7',root);
  w.box(dx,54,desk-9.2,19,1.1,.4,'#718773',root);
 }
 const seat=frame.depth/2-18;
 w.bench(0,seat,root);
 for(const dx of [-21,21])w.box(dx,15.7,seat,37,1.4,17,'#879f83',root);
 w.canvas.dataset.foodHallRevision='65';
 return root;
}
