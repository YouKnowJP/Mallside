// Manual movement belongs to the focused map, never to page reading or form editing.
export const canUseMapKeys=(event,canvas)=>event.target===canvas&&!event.defaultPrevented&&!event.isComposing&&!event.altKey&&!event.ctrlKey&&!event.metaKey;
export function bindWalkPad(root,{start,stop,step,allowed,schedule=setTimeout,unschedule=clearTimeout,holdDelay=120}){
 const doc=root.ownerDocument,win=doc.defaultView,listeners=[];let active=null;
 const listen=(target,name,handler)=>{target.addEventListener(name,handler);listeners.push(()=>target.removeEventListener(name,handler));};
 const buttonFor=event=>{const b=event.target.closest?.('[data-dir]');return b&&root.contains(b)&&!b.disabled?b:null;};
 function finish(tap=false){if(!active)return;const p=active;active=null;unschedule(p.timer);p.button.classList.remove('is-held');stop();if(tap&&!p.walking&&allowed())step(p.direction);if(p.pointer!==undefined&&p.button.hasPointerCapture?.(p.pointer))p.button.releasePointerCapture(p.pointer);}
 function press(button,kind,id){if(active||!allowed())return false;button.focus({preventScroll:true});const p={button,direction:button.dataset.dir,[kind]:id,walking:false};active=p;button.classList.add('is-held');p.timer=schedule(()=>{if(active!==p)return;if(!allowed()){finish();return;}p.walking=true;start(p.direction);},holdDelay);return true;}
 listen(root,'pointerdown',event=>{const b=buttonFor(event);if(!b||event.isPrimary===false||event.button!==0)return;event.preventDefault();if(press(b,'pointer',event.pointerId))try{b.setPointerCapture(event.pointerId);}catch{finish();}});
 listen(root,'pointerup',event=>{if(active?.pointer===event.pointerId)finish(true);});
 for(const name of ['pointercancel','lostpointercapture'])listen(root,name,event=>{if(active?.pointer===event.pointerId)finish();});
 listen(root,'pointermove',event=>{if(active?.pointer!==event.pointerId)return;const r=active.button.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)finish();});
 listen(root,'keydown',event=>{const b=buttonFor(event);if(!b||![' ','Enter'].includes(event.key)||event.altKey||event.ctrlKey||event.metaKey)return;event.preventDefault();if(!event.repeat)press(b,'key',event.key);});
 listen(root,'keyup',event=>{if(active?.key===event.key){event.preventDefault();finish(true);}});
 listen(root,'click',event=>{const b=buttonFor(event);if(b&&event.detail===0&&!active&&allowed())step(b.dataset.dir);});
 listen(root,'focusout',()=>finish());listen(win,'blur',()=>finish());listen(doc,'visibilitychange',()=>{if(doc.hidden)finish();});
 return {cancel:()=>finish(),dispose(){finish();listeners.splice(0).forEach(remove=>remove());}};
}
