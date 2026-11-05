import * as T from './vendor/three.module.js';

// These are presentation bounds only. Physical interaction targets never move.
const point=new T.Vector3(),scale=new T.Vector3();
export function spriteBounds(sprite,camera,width,height){
 sprite.getWorldPosition(point);point.applyMatrix4(camera.matrixWorldInverse);
 const depth=-point.z;if(depth<=camera.near||depth>=camera.far)return null;
 const pixels=height*camera.projectionMatrix.elements[5]/(2*depth);
 sprite.getWorldScale(scale);const w=Math.abs(scale.x)*pixels,h=Math.abs(scale.y)*pixels;
 point.applyMatrix4(camera.projectionMatrix);
 return {x:(point.x+1)*width/2-sprite.center.x*w,y:(1-point.y)*height/2-(1-sprite.center.y)*h,width:w,height:h};
}
export const overlaps=(a,b,gap=8)=>a.x<b.width+b.x+gap&&a.x+a.width+gap>b.x&&a.y<b.y+b.height+gap&&a.y+a.height+gap>b.y;
export function chooseLabels(candidates,{width,height,blocked=[],limit=6,padding=10}={}){
 const selected=[],ids=new Set();if(!(limit>0))return selected;
 for(const c of [...candidates].sort((a,b)=>b.priority-a.priority||a.order-b.order)){
  const r=c.bounds;if(!r||![r.x,r.y,r.width,r.height].every(Number.isFinite)||r.height<13||r.width<24||r.x<padding||r.y<padding||r.x+r.width>width-padding||r.y+r.height>height-padding)continue;
  if(c.id&&ids.has(c.id)||blocked.some(b=>overlaps(r,b))||selected.some(s=>overlaps(r,s.bounds)))continue;
  selected.push(c);if(c.id)ids.add(c.id);if(selected.length>=limit)break;
 }return selected;
}
export function restoreFloatingLabels(w){for(const r of w.floatingLabels||[])if(r.layoutHidden){r.object.visible=true;r.layoutHidden=false;}}
export function layoutFloatingLabels(w){
 if(!w.camera||!w.width||!w.height)return;w.camera.updateMatrixWorld(true);
 const candidates=[],blocked=[],destination=w.destination?.interaction,root=w.canvas.getBoundingClientRect();
 for(const selector of ['#map-nearby','#route-status']){const el=w.canvas.ownerDocument?.querySelector(selector);if(!el||!el.textContent)continue;const r=el.getBoundingClientRect();if(r.width&&r.height)blocked.push({x:r.left-root.left,y:r.top-root.top,width:r.width,height:r.height});}
 if(!w.overview){const head=w.player.position.clone().add(new T.Vector3(0,55,0)).project(w.camera),feet=w.player.position.clone().project(w.camera),top=(1-head.y)*w.height/2,bottom=(1-feet.y)*w.height/2,h=Math.abs(bottom-top);blocked.push({x:(head.x+1)*w.width/2-Math.max(12,h*.19),y:Math.min(top,bottom),width:Math.max(24,h*.38),height:h});}
 for(const [order,r]of(w.floatingLabels||[]).entries()){
  const o=r.object;if(!o.parent||!o.visible)continue;let visible=true;for(let p=o.parent;p;p=p.parent)if(!p.visible)visible=false;if(!visible)continue;
  const id=o.userData.interaction,d=Math.hypot(o.position.x-w.avatar.x,o.position.z-w.avatar.y),price=/^\$/.test(r.text),priority=(id&&id===destination?10000:0)+(id?500:0)+(r.selected?18:0)-d-(price?120:0);
  candidates.push({record:r,id,priority,order,bounds:spriteBounds(o,w.camera,w.width,w.height)});
 }
 const selected=w.action?[]:chooseLabels(candidates,{width:w.width,height:w.height,blocked,limit:w.width<700?3:6}),kept=new Set(selected.map(c=>c.record));
 for(const c of candidates){const r=c.record;r.selected=kept.has(r);if(!r.selected){r.object.visible=false;r.layoutHidden=true;}}
 w.canvas.dataset.labelLayoutRevision='57';w.canvas.dataset.visibleSceneLabels=String(selected.length);if((w.renderedFrames||0)%12===0||Number(w.canvas.dataset.labelLayoutWidth)!==w.width||Number(w.canvas.dataset.labelLayoutHeight)!==w.height){w.canvas.dataset.labelLayoutWidth=String(w.width);w.canvas.dataset.labelLayoutHeight=String(w.height);w.canvas.dataset.sceneLabelBounds=JSON.stringify(selected.map(c=>({id:c.id||'',...Object.fromEntries(Object.entries(c.bounds).map(([k,v])=>[k,Number(v.toFixed(2))]))})));}
}
