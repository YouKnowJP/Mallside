// Changing a canvas backing store inside ResizeObserver can trigger another
// layout notification in Safari. Coalesce the work into the next paint frame.
export function observeCanvasSize(element,resize,{Observer=ResizeObserver,schedule=requestAnimationFrame,cancel=cancelAnimationFrame}={}){
 let frame=null,alive=true;
 const observer=new Observer(()=>{if(alive&&frame===null)frame=schedule(()=>{frame=null;if(alive)resize();});});
 observer.observe(element);
 return {disconnect(){alive=false;observer.disconnect();if(frame!==null)cancel(frame);frame=null;}};
}
