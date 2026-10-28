// Shared, deterministic movement and animation math; positions use logical pixels.
export function stepToward(position,target,speed,dt){
 const dx=target.x-position.x,dy=target.y-position.y,distance=Math.hypot(dx,dy),step=Math.max(0,speed)*Math.max(0,Math.min(dt,.05));
 if(distance<=step||distance<.001)return {x:target.x,y:target.y,arrived:true,moved:distance};
 return {x:position.x+dx/distance*step,y:position.y+dy/distance*step,arrived:false,moved:step};
}
export function directionalStep(position,x,y,speed,dt){const length=Math.hypot(x,y);if(!length)return {...position,moved:0};const step=speed*Math.max(0,Math.min(dt,.05));return {x:position.x+x/length*step,y:position.y+y/length*step,moved:step};}
export function facingFor(dx,dy,previous='down'){if(!dx&&!dy)return previous;return Math.abs(dx)>Math.abs(dy)?dx<0?'left':'right':dy<0?'up':'down';}
export function gaitPose(distance,moving,reduced=false){const phase=moving&&!reduced?distance/8:0;return {step:Math.sin(phase)*7,bob:moving&&!reduced?Math.abs(Math.sin(phase))*2:0,arm:Math.sin(phase)*6};}
export function nightFrame(elapsed){
 if(elapsed<2.8)return {stage:'street',progress:Math.max(0,elapsed/2.8),label:'Walking home through the evening lights…'};
 if(elapsed<5.2)return {stage:'home',progress:(elapsed-2.8)/2.4,label:'Home at last. Put the shopping bags down…'};
 if(elapsed<7.5)return {stage:'sleep',progress:(elapsed-5.2)/2.3,label:'Lights out. A little rest for tomorrow…'};
 return {stage:'morning',progress:1,label:'A new shopping day is ready.'};
}
