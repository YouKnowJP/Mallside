import * as T from './vendor/three.module.js';
const colors=['#b38860','#8195a0','#5e8b80'];
export const sculptureChoiceIndex=choice=>['curve','shadow','color'].indexOf(choice);
// Joinery, inset stone and a small sketch remain within the original 30×30 art collider.
export function buildSculptureDetails(w,b,x,z,theme){
 for(const side of [-1,1]){b.box(x+side*13.2,3,z,.7,5,26,theme.trim);b.box(x,3,z+side*13.2,26,5,.7,theme.trim);}
 for(const dx of [-8,0,8])b.box(x+dx,6.2,z, .3,.3,23,theme.wall);
 b.box(x,9,z+10,19,3,5,'#d8cfbc');b.box(x,10.7,z+10,17,.3,4,'#eee4d2');
 for(let i=0;i<3;i++)b.box(x-6+i*6,10.95,z+10,3,.15,.35,theme.accent);
 b.box(x-7,9,z-10,8,2,5,'#7a8d7c');b.box(x-7,10.2,z-10,7,.4,4,'#eee6d5');
 const studies=[];
 for(const sign of[-1,1]){b.box(x+sign*10.8,11.4,z+10,.6,1.2,5.5,theme.trim);b.box(x,11.4,z+10+sign*2.65,22.2,1.2,.6,theme.trim);}
 for(const dx of[-11,11])for(const dz of[-11,11]){b.box(x+dx,7.5,z+dz,1.1,.3,1.1,'#a9a18b');}
 for(let mode=0;mode<3;mode++){
  const g=new T.Group();w.scene.add(g);studies.push(g);
  if(mode===0){for(const dx of[-2.3,2.3]){const o=w.mesh(new T.TorusGeometry(2,.15,4,20),w.mat(colors[mode]),g);o.rotation.x=Math.PI/2;o.scale.y=.7;o.position.set(x+dx,11.05,z+10);}}
  else for(let i=0;i<3;i++)w.box(x-5+i*5,11.05,z+10,mode===1?5:3,.12,mode===1?1.1:2.4,mode===1?'#758477':colors[i],g);
 }
 const marker=w.box(x-7,10.6,z-10,3,.3,2,w.mat(colors[0],{roughness:.75}));w.sculptureStudies??=[];w.sculptureStudies.push({marker,baseX:x-7,signature:null,studies});updateSculptureDetails(w);w.canvas.dataset.sculptureDetailRevision='55';
}
export function updateSculptureDetails(w){
 const choice=w.state.artNotes?.find(n=>n.mallId===w.state.mallId&&n.floor===(w.state.floor||0))?.detail,index=sculptureChoiceIndex(choice);
 for(const s of w.sculptureStudies||[]){if(s.signature===choice)continue;s.marker.material.color.set(colors[Math.max(0,index)]);s.marker.position.x=s.baseX+(index<0?0:index-1);s.signature=choice;for(const [i,g]of(s.studies||[]).entries())g.visible=i===index;}
 if(w.sculptureStudies?.length)w.canvas.dataset.sculptureSketch=choice||'unsketched';
}
