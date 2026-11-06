const ease=t=>{const x=Math.max(0,Math.min(1,t));return x*x*x*(x*(x*6-15)+10);};
// Deliberate lift, hold, lower and rest. Joins have zero speed and acceleration.
export function consumptionPose(kind,time,reduced=false){
 if(reduced||!Number.isFinite(time)||time<0||!['drink','tea','eat','icecream'].includes(kind))return {lift:0,tilt:0};
 const t=time%4.6,lift=t<.9?ease(t/.9):t<1.5?1:t<2.5?1-ease((t-1.5)):0;
 return {lift,tilt:['drink','tea'].includes(kind)?-.32*lift:0};
}
// A finite presentation envelope returns the actual hand to its starting grip.
export function consumptionHandPose(kind,time,reduced=false,rest){
 const t=Number.isFinite(time)?Math.max(0,time):0,reach=reduced?1:ease(t/.8)*(1-ease((t-6.7)/.9)),sip=consumptionPose(kind,t-.9,reduced),from=rest?.[1]||{x:9,y:22,z:1.5},target={x:9-7.5*sip.lift,y:36.5+8.3*sip.lift,z:8-1.8*sip.lift};
 return {reach,right:{x:from.x+(target.x-from.x)*reach,y:from.y+(target.y-from.y)*reach,z:from.z+(target.z-from.z)*reach},tilt:sip.tilt*reach,lift:sip.lift*reach,visible:reduced||reach>.02};
}
