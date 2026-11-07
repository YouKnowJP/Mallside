import * as T from './vendor/three.module.js';
// Unbranded original cups and pastry, without merchant packaging or food imagery.
export function createCafeProp(w,kind,preview,parent){
 const root=new T.Group();parent.add(root);root.position.set(0,w.player?.userData.rig?0:-18,.3);
 if(kind==='eat'){
  if(preview?.id==='sandwich') {
   sandwich(w,root);
   root.userData.cafeProp='sandwich';
   return root;
  }
  if(preview?.id==='snack') {
   banana(w,root);
   root.userData.cafeProp='banana';
   return root;
  }
  if(preview?.id==='bowl') {
   w.box(0,.6,0,.24,3.5,.32,'#b4bdb5',root);
   const spoon=w.ball(0,2.6,0,.68,'#c2ccc2',root);
   spoon.scale.set(.65,1,.28);
   w.ball(0,2.65,.14,.39,'#ebd1a2',root);
   root.userData.cafeProp='bowl-spoon';
   return root;
  }
  if(preview?.id==='sb-croissant'){
   for(let i=0;i<7;i++){const t=(i-3)/3,a=t*.95,segment=w.mesh(new T.ConeGeometry(.75*(1-.4*Math.abs(t)),1.8,10),w.mat(i%2?'#c59454':'#d4a265'),root);segment.position.set(Math.sin(a)*1.8,Math.cos(a)*.65,0);segment.rotation.z=-a+Math.PI/2;}
  }else w.cyl(0,0,0,2.2,1.5,'#d5a56e',root);
 }else if(kind==='icecream'){w.cyl(0,-2.2,0,1.2,3.5,'#c9a573',root,.45);w.ball(0,1.1,0,1.4,'#fff0d2',root);}
 else {
  const cold=preview?.id==='sb-cold',material=w.mat(cold?'#c2d9d3':'#eee9da',{transparent:cold,opacity:cold?.65:1,roughness:cold?.18:.72}),profile=[[0,-2],[1,-2],[1.3,2.1],[1.12,2.1],[.84,-1.8],[0,-1.8]].map(p=>new T.Vector2(...p));w.mesh(new T.LatheGeometry(profile,20),material,root);
  w.cyl(0,1.9,0,1.1,.2,(preview?.water||preview?.id==='water')?'#a2cbd0':({green:'#8a9b65',black:'#98734d',herbal:'#b4837d'}[preview?.memory?.choice?.base]||'#806043'),root);
  if(cold){for(const [x,z]of[[-.5,-.4],[.5,.3]]){const ice=w.mesh(new T.BoxGeometry(.75,.55,.7),w.mat('#d6e5de',{transparent:true,opacity:.7,roughness:.25}),root);ice.position.set(x,2.05,z);ice.rotation.y=x;}}
  else{const handle=w.mesh(new T.TorusGeometry(.75,.16,6,18),w.mat('#eee9da'),root);handle.position.set(1.35,.2,0);}
 }
 root.userData.cafeProp=kind==='eat'&&preview?.id==='sb-croissant'?'croissant':kind==='drink'&&preview?.id==='sb-cold'?'cold-cup':kind==='eat'?'food':kind==='icecream'?'icecream':'mug';return root;
}


function sandwich(w,root) {
 const layers=[[-.62,.58,'#b57949'],[-.19,.28,'#78956b'],[.05,.19,'#c87450'],[.44,.58,'#dda46c']];
 for(const [y,height,color] of layers){
  const slice=w.mesh(new T.CylinderGeometry(2.2,2.2,height,3),w.mat(color,{roughness:.82}),root);
  slice.position.y=y;
 }
 for(const x of [-.55,0,.55])w.box(x,.74,.13,.12,.03,1.2,'#aa693d',root);
}

function banana(w,root) {
 const arc=w.mesh(new T.TorusGeometry(1.42,.36,7,18,Math.PI*1.08),w.mat('#dcb057'),root);
 arc.rotation.z=.15;
 w.box(-1.45,.03,0,.45,.23,.28,'#827244',root).rotation.z=.45;
}

export function buildMealSample(w,id,parent,x,y,z,scale=1) {
 const sample=new T.Group();
 sample.position.set(x,y,z);
 sample.scale.setScalar(scale);
 parent.add(sample);
 if(id==='bowl'){
  const profile=[[0,.05],[1.75,.05],[2.2,.48],[2.6,1.72],[2.45,1.72],[1.95,.52],[0,.52]];
  w.mesh(new T.LatheGeometry(profile.map(p=>new T.Vector2(...p)),20),w.mat('#80a298',{roughness:.56}),sample);
  w.cyl(0,1.45,0,2.25,.27,'#e7d1a6',sample);
  for(const [dx,dz,color] of [[-.9,.6,'#6f8e62'],[1.1,.3,'#cf8757'],[.5,-1.1,'#86a473'],[-1,-.8,'#d99555']]){
   w.box(dx,1.66,dz,.77,.28,.65,color,sample).rotation.y=dx;
  }
 }else if(id==='snack'){
  const fruit=new T.Group();
  sample.add(fruit);
  fruit.rotation.x=-Math.PI/2;
  fruit.position.set(-.7,.5,.65);
  banana(w,fruit);
  w.cyl(1.35,.73,-.48,1,1.4,'#d7afa0',sample,1.18);
  w.cyl(1.35,1.46,-.48,1.08,.08,'#f7ead8',sample);
 }else if(id==='sandwich'){
  sandwich(w,sample);
  sample.position.y+=scale;
 }else if(id==='icecream'){
  w.cyl(0,1.05,0,.36,2.1,'#bc8a53',sample,.8);
  w.ball(0,2.4,0,.93,'#fbebc8',sample);
 }else if(id==='coffee'){
  w.cyl(0,.8,0,1.1,1.5,'#efe0c4',sample,1.26);
  w.cyl(0,1.58,0,1.06,.08,'#876245',sample);
  const handle=w.mesh(new T.TorusGeometry(.53,.12,6,14),w.mat('#efe0c4'),sample);
  handle.position.set(1.26,.88,0);
 }
 return sample;
}
