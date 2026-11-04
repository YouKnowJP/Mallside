import {canUseMapKeys,bindWalkPad} from './input-controls.js?v=29.0.0';
const directions={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};
// All listeners and pointer state belong to this one studio; destroy never leaves input behind.
export function bindHomeControls(canvas,{allowed,start,stop,step,tap,use}){
 const doc=canvas.ownerDocument,win=doc.defaultView,listeners=[];let pointer=null;
 const listen=(target,name,fn)=>{target.addEventListener(name,fn);listeners.push(()=>target.removeEventListener(name,fn));};
 const cancel=()=>{pointer=null;pad?.cancel();stop();};
 const padRoot=doc.querySelector('#home-walk-pad');
 const pad=padRoot?bindWalkPad(padRoot,{allowed,start,stop,step}):null;
 listen(canvas,'keydown',e=>{if(!canUseMapKeys(e,canvas)||!allowed())return;const direction=directions[e.key]||directions[e.key.toLowerCase()];if(direction){e.preventDefault();start(direction,true);}else if(e.key==='Escape'){e.preventDefault();cancel();}else if(['e','E','Enter'].includes(e.key)){e.preventDefault();if(!e.repeat)use();}});
 listen(canvas,'keyup',e=>{const direction=directions[e.key]||directions[e.key.toLowerCase()];if(direction&&e.target===canvas){e.preventDefault();stop(direction);} });
 listen(canvas,'pointerdown',e=>{if(!allowed()||e.button!==0||e.isPrimary===false||pointer)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY};});
 listen(canvas,'pointerup',e=>{const p=pointer;if(!p||p.id!==e.pointerId)return;pointer=null;if(!allowed()||Math.hypot(e.clientX-p.x,e.clientY-p.y)>10)return;canvas.focus({preventScroll:true});tap(e.clientX,e.clientY);});
 for(const name of ['pointercancel','lostpointercapture'])listen(canvas,name,()=>{pointer=null;});
 listen(canvas,'blur',cancel);
 listen(win,'blur',cancel);listen(doc,'visibilitychange',()=>{if(doc.hidden)cancel();});
 // Opening any existing game dialog stops queued walking before its background becomes inert.
 listen(doc,'focusin',e=>{if(e.target.closest?.('.modal-overlay'))cancel();});
 return {cancel,dispose(){cancel();pad?.dispose();listeners.splice(0).forEach(remove=>remove());}};
}
