const phaseOf=v=>Number.isFinite(v)?((v%1)+1)%1:0;
// Match local forward velocity at toe-off/touchdown. The small overshoot is a natural push-off.
export function footArc(phase,reach){
 const cycle=phaseOf(phase),r=Number.isFinite(reach)?Math.max(0,reach):0,contact=cycle<.5,t=contact?cycle*2:(cycle-.5)*2;
 return {contact,z:contact?r-2*r*t:-r+r*(-2*t+12*t*t-8*t*t*t),lift:contact?0:Math.min(3.2,r*.32)*Math.sin(t*Math.PI)**2};
}
// A continuous pelvis cycle avoids the old cusp whenever support switches between feet.
export function gaitHeight(phase,reach,rig){
 const r=Math.max(0,Math.min(rig.upperLeg+rig.lowerLeg-.01,Number.isFinite(reach)?reach*1.09:0)),low=Math.sqrt((rig.upperLeg+rig.lowerLeg)**2-r*r)+rig.ankleHeight-rig.hipHeight,high=rig.ankleHeight+rig.upperLeg+rig.lowerLeg-rig.hipHeight;
 return low+(high-low)*(.5-.5*Math.cos(phaseOf(phase)*Math.PI*4));
}
