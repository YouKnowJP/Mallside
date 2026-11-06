import * as T from './vendor/three.module.js';
// Unbranded original cups and pastry, without merchant packaging or food imagery.
export function createCafeProp(w,kind,preview,parent){
 const root=new T.Group();parent.add(root);root.position.set(0,w.player?.userData.rig?0:-18,.3);
 if(kind==='eat'){
  if(preview?.id==='sb-croissant'){
   for(let i=0;i<7;i++){const t=(i-3)/3,a=t*.95,segment=w.mesh(new T.ConeGeometry(.75*(1-.4*Math.abs(t)),1.8,10),w.mat(i%2?'#c59454':'#d4a265'),root);segment.position.set(Math.sin(a)*1.8,Math.cos(a)*.65,0);segment.rotation.z=-a+Math.PI/2;}
  }else w.cyl(0,0,0,2.2,1.5,'#d5a56e',root);
 }else if(kind==='icecream'){w.cyl(0,-2.2,0,1.2,3.5,'#c9a573',root,.45);w.ball(0,1.1,0,1.4,'#fff0d2',root);}
 else {
  const cold=preview?.id==='sb-cold',material=w.mat(cold?'#c2d9d3':'#eee9da',{transparent:cold,opacity:cold?.65:1,roughness:cold?.18:.72}),profile=[[0,-2],[1,-2],[1.3,2.1],[1.12,2.1],[.84,-1.8],[0,-1.8]].map(p=>new T.Vector2(...p));w.mesh(new T.LatheGeometry(profile,20),material,root);
  w.cyl(0,1.9,0,1.1,.2,preview?.water?'#a2cbd0':({green:'#8a9b65',black:'#98734d',herbal:'#b4837d'}[preview?.memory?.choice?.base]||'#806043'),root);
  if(cold){for(const [x,z]of[[-.5,-.4],[.5,.3]]){const ice=w.mesh(new T.BoxGeometry(.75,.55,.7),w.mat('#d6e5de',{transparent:true,opacity:.7,roughness:.25}),root);ice.position.set(x,2.05,z);ice.rotation.y=x;}}
  else{const handle=w.mesh(new T.TorusGeometry(.75,.16,6,18),w.mat('#eee9da'),root);handle.position.set(1.35,.2,0);}
 }
 root.userData.cafeProp=kind==='eat'&&preview?.id==='sb-croissant'?'croissant':kind==='drink'&&preview?.id==='sb-cold'?'cold-cup':kind==='eat'?'food':kind==='icecream'?'icecream':'mug';return root;
}
