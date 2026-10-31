const ease=t=>{const x=Math.max(0,Math.min(1,t));return x*x*x*(x*(x*6-15)+10);};
// Lift, hold, return and rest meet with zero velocity and acceleration.
export function flowerGesture(time,reduced=false){
 if(reduced||!Number.isFinite(time)||time<0)return 0;
 const t=time%4;return t<.8?ease(t/.8):t<1.4?1:t<2.2?1-ease((t-1.4)/.8):0;
}
