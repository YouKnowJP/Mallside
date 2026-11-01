const ease=t=>{const x=Math.max(0,Math.min(1,t));return x*x*x*(x*(x*6-15)+10);};
// Deliberate lift, hold, lower and rest. Joins have zero speed and acceleration.
export function consumptionPose(kind,time,reduced=false){
 if(reduced||!Number.isFinite(time)||time<0||!['drink','tea','eat','icecream'].includes(kind))return {lift:0,tilt:0};
 const t=time%4.6,lift=t<.9?ease(t/.9):t<1.5?1:t<2.5?1-ease((t-1.5)):0;
 return {lift,tilt:['drink','tea'].includes(kind)?-.32*lift:0};
}
