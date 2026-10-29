// Shared, deterministic movement and animation math; positions use logical pixels.
export function stepToward(position,target,speed,dt){
 const dx=target.x-position.x,dy=target.y-position.y,distance=Math.hypot(dx,dy),step=Math.max(0,speed)*Math.max(0,Math.min(dt,.05));
 if(distance<=step||distance<.001)return {x:target.x,y:target.y,arrived:true,moved:distance};
 return {x:position.x+dx/distance*step,y:position.y+dy/distance*step,arrived:false,moved:step};
}
export function directionalStep(position,x,y,speed,dt){const length=Math.hypot(x,y);if(!length)return {...position,moved:0};const step=speed*Math.max(0,Math.min(dt,.05));return {x:position.x+x/length*step,y:position.y+y/length*step,moved:step};}
// Exponential acceleration is independent of display refresh rate. Release stops
// immediately; we never coast into a doorway after a key or pointer is released.
export function walkingStep(position,x,y,velocity,speed,dt){
 const length=Math.hypot(x,y),time=Math.max(0,Math.min(.1,dt||0));
 if(!length)return {...position,velocity:{x:0,y:0}};
 const target={x:x/length*speed,y:y/length*speed},decay=Math.exp(-18*time),before=velocity||{x:0,y:0};
 const next={x:target.x+(before.x-target.x)*decay,y:target.y+(before.y-target.y)*decay};
 return {x:position.x+target.x*time+(before.x-target.x)*(1-decay)/18,y:position.y+target.y*time+(before.y-target.y)*(1-decay)/18,velocity:next};
}
export const cameraBlend=dt=>1-Math.exp(-10*Math.max(0,Math.min(.1,dt||0)));
export function facingFor(dx,dy,previous='down'){if(!dx&&!dy)return previous;return Math.abs(dx)>Math.abs(dy)?dx<0?'left':'right':dy<0?'up':'down';}
export function headingFor(dx,dy,previous=0){return Number.isFinite(dx)&&Number.isFinite(dy)&&Math.hypot(dx,dy)>.001?Math.atan2(dx,dy):previous;}
export function turnToward(current,target,dt,reduced=false){if(!Number.isFinite(current)||!Number.isFinite(target))return Number.isFinite(target)?target:0;const delta=Math.atan2(Math.sin(target-current),Math.cos(target-current));return current+delta*(reduced?1:1-Math.exp(-12*Math.max(0,Math.min(.1,dt||0))));}
export function gaitPose(distance,moving,reduced=false){const phase=moving&&!reduced?distance/8:0;return {step:Math.sin(phase)*7,bob:moving&&!reduced?Math.abs(Math.sin(phase))*2:0,arm:Math.sin(phase)*6};}
export function nightFrame(elapsed){
 if(elapsed<2.8)return {stage:'street',progress:Math.max(0,elapsed/2.8),label:'Walking home through the evening lights…'};
 if(elapsed<5.2)return {stage:'home',progress:(elapsed-2.8)/2.4,label:'Home at last. Put the shopping bags down…'};
 if(elapsed<7.5)return {stage:'sleep',progress:(elapsed-5.2)/2.3,label:'Lights out. A little rest for tomorrow…'};
 return {stage:'morning',progress:1,label:'A new shopping day is ready.'};
}

export function yieldToPlayer(from,next,player,radius=25){const before=Math.hypot(from.x-player.x,from.y-player.y),after=Math.hypot(next.x-player.x,next.y-player.y);return after<radius&&after<=before?{...from}:next;}

// Pose easing is separate from locomotion: releasing input still stops the avatar immediately.
export function locomotionWeight(previous,walking,dt,reduced=false){if(reduced)return 0;const target=walking?1:0;if(!(dt>0))return target;const value=target+(Math.max(0,Math.min(1,Number.isFinite(previous)?previous:0))-target)*Math.exp(-12*Math.min(.1,dt));return Math.abs(value-target)<.001?target:value;}
