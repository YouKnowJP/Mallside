const ease=t=>{const x=Math.max(0,Math.min(1,t));return x*x*x*(x*(x*6-15)+10);};
// Quintic joins settle each fold before the next hand moves; finish at the resting pose.
export function wrappingPose(time,reduced=false,rest){
 const t=Number.isFinite(time)?Math.max(0,time):0,reach=reduced?1:ease(t/.65)*(1-ease((t-7.2)/.7));
 const fold=reduced?0:ease((t-.7)/1.1)*(1-ease((t-5.7)/1.1)),left=reduced?0:ease((t-1)/1.1)*(1-ease((t-2.3)/1.1)),right=reduced?0:ease((t-3.5)/1.1)*(1-ease((t-4.8)/1.1)),hands=[{x:-6.4+5*left,y:31+3*left,z:12},{x:6.4-5*right,y:31+3*right,z:12}].map((h,i)=>{const a=rest?.[i]||{x:i?10:-10,y:22,z:1.5};return {x:a.x+(h.x-a.x)*reach,y:a.y+(h.y-a.y)*reach,z:a.z+(h.z-a.z)*reach};});return {fold,reach,baseY:22+9*reach,z:1.5+10.5*reach,hands};
}
export function createWrappingProp(w,color){const root=w.box(0,31,12,12.5,5,7,color,w.player),ribbon=w.box(0,2.6,0,1,.2,7.2,'#e8d8ab',root);w.box(0,2.7,0,12.7,.2,1,'#e8d8ab',root);const tails=[-1,1].map(s=>w.box(s*3,2.8,0,5,.22,1,'#e8d8ab',root));root.userData.tails=tails;root.userData.ribbon=ribbon;return root;}
export function updateWrappingProp(root,time,reduced=false,rest){const p=wrappingPose(time,reduced,rest);root.position.set(0,p.baseY,p.z);for(const [i,o]of root.userData.tails.entries()){o.rotation.z=(i?1:-1)*p.fold*.4;o.position.y=2.8+p.fold*.6;}return p;}
