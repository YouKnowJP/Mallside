import {cameraBlend} from './motion.js?v=34.0.0';
const ease=t=>{const x=Math.max(0,Math.min(1,t));return x*x*(3-2*x);};
// Position and focal point share the same damping; bound angular speed on close-up exits.
export function focusCamera(w,target,look,immediate=false){
 const dt=Number.isFinite(w.frameDt)?Math.max(0,Math.min(.1,w.frameDt)):1/60,snap=immediate||!w.cameraLook,blend=snap?1:cameraBlend(dt),rotation=w.camera.quaternion.clone();
 w.camera.position.lerp(target,blend);if(snap)w.cameraLook=look.clone();else w.cameraLook.lerp(look,blend);
 w.camera.lookAt(w.cameraLook);
 if(!snap&&!w.state?.preferences.reducedMotion){const desired=w.camera.quaternion.clone();w.camera.quaternion.copy(rotation).rotateTowards(desired,2.5*dt);}
 w.camera.updateMatrixWorld();
}
// A slow, bounded look to either side replaces repeated full spins. Manual turns remain available.
export function fittingTurn(progress,reduced=false){
 if(reduced||!Number.isFinite(progress))return 0;
 const t=Math.max(0,Math.min(1,progress)),keys=[[0,0],[.18,.55],[.35,.55],[.65,-.45],[.80,-.45],[1,0]];
 for(let i=1;i<keys.length;i++)if(t<=keys[i][0]){const [a,x]=keys[i-1],[b,y]=keys[i];return x+(y-x)*ease((t-a)/(b-a));}
 return 0;
}
// A held reach and gentle withdrawal, with zero velocity at the cycle boundary.
export function checkoutGesture(time,reduced=false){
 if(reduced||!Number.isFinite(time)||time<0)return 0;
 const t=time%3.6;
 return t<.7?ease(t/.7):t<1.1?1:t<1.9?1-ease((t-1.1)/.8):0;
}
// Opening and closing travel together; a paused simulation keeps its exact width.
export function curtainWidth(previous,closed,dt,reduced=false){const target=closed?43:10,start=Number.isFinite(previous)?Math.max(10,Math.min(43,previous)):10;if(reduced)return target;const value=target+(start-target)*Math.exp(-12*Math.max(0,Math.min(.1,dt||0)));return Math.abs(value-target)<.001?target:value;}
