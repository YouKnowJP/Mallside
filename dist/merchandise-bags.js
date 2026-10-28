import * as T from './vendor/three.module.js';
import {addReferenceDetails,addChainLinks} from './merchandise-details.js?v=23.0.0';

export function buildBagModel(b,p,a,{bodyOnly=false}={}){
 const {mesh,box,panel,tube,ring,band,g,main,trim,seam,metal}=b,B=a.bag,w=a.width,h=a.height,d=a.depth,style=B.silhouette,s=new T.Shape(),half=w/2,top=h/2,bottom=-h/2,base=a.baseWidth||w,soft=B.construction!=='structured';
 if(style==='crescent'||style==='hobo'){
  s.moveTo(-half,top);s.quadraticCurveTo(0,top-h*(B.topDip||.30),half,top);s.bezierCurveTo(half*1.04,-h*.18,half*.58,bottom,0,bottom);s.bezierCurveTo(-half*.58,bottom,-half*1.04,-h*.18,-half,top);
 }else if(style==='saddle'){
  s.moveTo(-half,top);s.lineTo(half*.86,top*.93);s.quadraticCurveTo(half*1.12,0,half*.48,bottom*.95);s.quadraticCurveTo(-half*.25,bottom*1.14,-half,bottom*.28);s.lineTo(-half,top);
 }else if(style==='bucket'){
  s.moveTo(-half,top);s.quadraticCurveTo(0,top-h*.08,half,top);s.lineTo(base*.43,bottom+2);s.quadraticCurveTo(0,bottom-2,-base*.43,bottom+2);s.closePath();
 }else if(style==='pouch'){
  s.moveTo(-half*.72,top);s.quadraticCurveTo(0,top+h*.08,half*.72,top);s.bezierCurveTo(half*1.07,top*.5,half*1.07,bottom*.9,half*.72,bottom);s.quadraticCurveTo(0,bottom*1.08,-half*.72,bottom);s.bezierCurveTo(-half*1.07,bottom*.9,-half*1.07,top*.5,-half*.72,top);
 }else if(style==='triangle')s.moveTo(-half,bottom),s.lineTo(half,bottom),s.lineTo(w*.15,top),s.closePath();
 else if(style==='tote'){
  s.moveTo(-base/2,bottom+1);s.lineTo(base/2,bottom+1);s.quadraticCurveTo(half,0,half,top);s.lineTo(-half,top);s.quadraticCurveTo(-half,0,-base/2,bottom+1);
 }else if(style==='satchel'){
  const r=h*B.roundness;s.moveTo(-half,bottom+r);s.quadraticCurveTo(-half,bottom,-half+r,bottom);s.lineTo(half-r,bottom);s.quadraticCurveTo(half,bottom,half,bottom+r);s.lineTo(half*B.taper,top-r);s.quadraticCurveTo(half*B.taper,top,half*B.taper-r,top);s.lineTo(-half*B.taper+r,top);s.quadraticCurveTo(-half*B.taper,top,-half*B.taper,top-r);s.closePath();
 }else{
  const r=Math.min(w,h)*Math.min(.43,B.roundness);s.moveTo(-half+r,bottom);s.lineTo(half-r,bottom);s.quadraticCurveTo(half,bottom,half,bottom+r);s.lineTo(half,top-r);s.quadraticCurveTo(half,top,half-r,top);s.lineTo(-half+r,top);s.quadraticCurveTo(-half,top,-half,top-r);s.lineTo(-half,bottom+r);s.quadraticCurveTo(-half,bottom,-half+r,bottom);
 }
 s.closePath();const body=mesh(new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSize:soft?.38:.18,bevelThickness:soft?.5:.2,bevelSegments:3,curveSegments:16}));body.position.z=-d/2;
 // Edge piping follows the actual silhouette; it is separate from the photographed surface pattern.
 const points=s.getPoints(45).map(v=>[v.x,v.y,d/2+.22]);tube(points,.16,seam,true);
 if(style!=='crescent'&&style!=='hobo'&&style!=='pouch')panel(0,bottom+1.2,0,Math.min(base,w)-1.5,2.2,d+.25,1,trim);
 if(B.closure==='flap'||B.closure==='turnlock'){
  if(style==='saddle'){const f=new T.Shape();f.moveTo(-half+1,top-1);f.lineTo(half*.76,top-1);f.quadraticCurveTo(half*.70,-h*.2,0,-h*.16);f.lineTo(-half+1,0);f.closePath();const flap=mesh(new T.ExtrudeGeometry(f,{depth:.55,bevelEnabled:true,bevelSize:.15,bevelThickness:.15,bevelSegments:2}),trim);flap.position.z=d/2+.3;}
  else panel(0,h*.17,d/2+.4,w-2,h*(B.envelope?.58:.64),.5,Math.min(2,h*.1),trim);
 }
 if(B.closure==='zip'){
  const y=top-(style==='crescent'||style==='hobo'?h*.19:.8);tube([[-w*.42,y,d/2*.6],[0,y-(style==='crescent'?h*.16:0),d/2*.7],[w*.42,y,d/2*.6]],.18,metal);box(w*.38,y-1,d/2*.8,1.8,.6,.5,metal);
 }
 if(B.closure==='drawstring'){
  for(let i=0;i<7;i++){const x=-w*.38+i*w*.125;ring(x,top-1.8,d/2+.4,.6,.18,metal);}tube([[-w*.38,top-2,d/2+.8],[0,top-4,d/2+1],[w*.38,top-2,d/2+.8]],.22,trim);for(const dx of [-1.1,1.1])tube([[dx,top-3,d/2+1],[dx*1.7,-h*.15,d/2+1]],.28,trim);
 }
 if(style==='backpack'){
  panel(0,-h*.18,d/2+.7,w*.72,h*.32,Math.max(1,d*.14),2,trim);box(0,-h*.02,d/2+2,w*.58,.35,.4,metal);
  if(!bodyOnly)for(const sign of [-1,1])band([[sign*w*.25,top-2,-d/2],[sign*w*.32,-h*.1,-d/2-7],[sign*w*.24,bottom+2,-d/2]],2.1);
 }
 if(!bodyOnly&&B.handles!=='none'){
  const drop=a.handleDrop||(B.carry==='hand'?9:22),double=B.handles==='double';
  for(const z of double?[-d/2+.7,d/2-.7]:[0]){const pts=[[-w*.29,top-1,z],[-w*.22,top+drop*.92,z],[w*.22,top+drop*.92,z],[w*.29,top-1,z]];band(pts,B.detail==='bamboo-handle'?2.1:1.6);if(B.detail==='bamboo-handle')for(let i=1;i<8;i++){const x=-w*.23+i*w*.055;ring(x,top+drop*.96,z,.8,.22,metal);}}
 }else if(!bodyOnly&&B.handles==='none'&&B.carry!=='hand'){
  const pts=[[-w*.43,top-2,0],[-w*.35,top+26,0],[w*.35,top+26,0],[w*.43,top-2,0]];band(pts,B.chain?1:1.5);if(B.chain)addChainLinks(g,pts,metal,{radius:.75,wire:.16});
 }
 addReferenceDetails(g,a,{width:w,height:h,depth:d},metal,trim);
 if(B.detail==='woven-knot'){const knot=ring(w*.23,top+1,d*.1,Math.min(3,w*.10),1.15,trim);knot.rotation.y=.45;}
 if(B.detail==='jackie-piston'||B.detail==='roseau-toggle'){box(0,h*.05,d/2+.8,B.detail==='roseau-toggle'?w*.34:1.4,B.detail==='roseau-toggle'?1.1:h*.4,.7,metal);ring(0,h*.16,d/2+1,.9,.24,metal);}
 if(B.detail==='horsebit'){for(const x of [-w*.12,w*.12])ring(x,0,d/2+.9,1.4,.28,metal);box(0,0,d/2+1,w*.15,.5,.4,metal);}
 if(['city-studs','belted-lock'].includes(B.detail))for(const sign of [-1,1])for(let i=0;i<4;i++){const stud=mesh(new T.SphereGeometry(.45,8,5),metal);stud.position.set(sign*(w*.37-i*.8),bottom+2+i*1.2,d/2+.6);}
 if(['dior-saddle','dior-charm'].includes(B.detail)){const charm=ring(w*.28,-h*.05,d/2+1,1.5,.35,metal);charm.scale.x=.7;box(w*.28,-h*.05,d/2+1,.4,3,.4,metal);}
 if(B.detail==='dior-saddle')tube([[-w*.32,top-1,d/2+.6],[-w*.15,-h*.19,d/2+.7]],.38,trim);
 if(B.detail==='spinner'){for(const x of [-w*.33,w*.33])for(const z of [-d*.3,d*.3]){const wheel=mesh(new T.CylinderGeometry(2,2,1.8,12),trim);wheel.rotation.z=Math.PI/2;wheel.position.set(x,bottom-1.5,z);}if(!bodyOnly){for(const x of [-w*.18,w*.18])box(x,top+8,-d*.3,.7,17,.7,metal);box(0,top+16,-d*.3,w*.4,1.7,1.7,trim);}for(let i=-3;i<=3;i++)box(i*w*.10,0,d/2+.4,.5,h*.8,.6,seam);}
 if(B.detail==='bow-charm'){for(const sign of [-1,1]){const bow=panel(sign*w*.27,0,0,w*.55,h*.8,d,1,trim);bow.rotation.z=sign*.25;}panel(0,0,d*.2,w*.18,h*.4,d,1,trim);ring(0,h*.8,0,1.2,.25,metal);}
 if(B.detail==='passport-set')for(const dx of [-w*.28,w*.28])panel(dx,0,d/2+.3,w*.35,h*.72,.4,.5,trim);
 if(B.detail==='evelyne-h')for(const x of [-1.5,1.5])for(const y of [-2,-1,0,1,2]){const hole=mesh(new T.SphereGeometry(.18,5,4),seam);hole.position.set(x,y,d/2+.3);}
 if(B.construction==='padded'&&a.pattern==='woven')for(let i=-2;i<=2;i++)tube([[i*w*.17,bottom+1,d/2+.4],[i*w*.17,0,d/2+.8],[i*w*.17,top-1,d/2+.4]],.28,trim);
 return {width:w,height:h,depth:d};
}
