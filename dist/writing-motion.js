import * as T from './vendor/three.module.js';
const ease=t=>{const x=Math.max(0,Math.min(1,t));return x*x*x*(x*(x*6-15)+10);};
// One supported notebook, one pencil; no new inventory or save fields.
export function writingPose(time,reduced=false,rest){
 const t=Number.isFinite(time)?Math.max(0,time):0,reach=reduced?1:ease(t/.75)*(1-ease((t-3.5)/.85));
 const u=reduced?0:Math.max(0,Math.min(1,(t-.85)/2.5)),stroke=Math.sin(u*Math.PI*6)*Math.sin(u*Math.PI)**2,slide=ease(u);
 const targets=[{x:-5,y:31.2,z:11.2},{x:1+stroke*.75,y:33.7,z:10.5+slide*2.4}];
 const hands=targets.map((p,i)=>{const a=rest?.[i]||{x:(i?1:-1)*6.5,y:27,z:2};return{x:a.x+(p.x-a.x)*reach,y:a.y+(p.y-a.y)*reach,z:a.z+(p.z-a.z)*reach};});
 return {reach,hands,notebook:{x:hands[0].x+5,y:hands[0].y-31.2,z:hands[0].z-11.2},pencil:{x:hands[1].x,y:hands[1].y-2.1,z:hands[1].z},visible:reduced||reach>.02};
}
export function createWritingProp(w){
 const root=new T.Group();w.player.add(root);w.box(-1,31,12,10,.5,7,'#927657',root);w.box(-1,31.35,12,8,.15,5.5,'#f6f0db',root);
 for(let i=0;i<4;i++)w.box(-1,31.46,10.5+i,6,.04,.06,'#a1ad9c',root);
 for(let i=0;i<5;i++)w.cyl(-5.7,31.3,9.6+i*1.2,.25,.8,'#75847c',root);
 const pencil=new T.Group();root.add(pencil);w.cyl(0,1.5,0,.16,2.8,'#b68c52',pencil);w.cyl(0,.05,0,.16,.6,'#cab28e',pencil,.01);w.cyl(0,-.28,0,.04,.12,'#444a42',pencil);
 root.userData.pencil=pencil;return root;
}
export function updateWritingProp(root,pose){root.visible=pose.visible;const n=pose.notebook;root.position.set(n.x,n.y,n.z);root.userData.pencil.position.set(pose.pencil.x-n.x,pose.pencil.y-n.y,pose.pencil.z-n.z);}
