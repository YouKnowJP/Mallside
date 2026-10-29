import {walkable,freeMove} from './free-navigation.js?v=25.0.0';
export function smoothSeatBlend(elapsed,duration=8){if(!Number.isFinite(elapsed)||!Number.isFinite(duration)||duration<=0)return 0;const t=Math.max(0,Math.min(1,elapsed/.65,(duration-elapsed)/.5));return t*t*(3-2*t);}
export function ambientStrideSpeed(base,remaining){return Math.max(0,base)*Math.max(.18,Math.min(1,Math.max(0,remaining)/38));}
export function spacedCrowdPoint(anchor,angle,radius,actors,spawn,nav){
 for(let attempt=0;attempt<192;attempt++){const r=attempt?radius+18+Math.floor((attempt-1)/12)*20:radius,a=angle+(attempt?((attempt-1)%12)*Math.PI/6:0),p={x:anchor.x+Math.cos(a)*r,y:anchor.y+Math.sin(a)*r};if(walkable(p,nav)&&Math.hypot(p.x-spawn.x,p.y-spawn.y)>=48&&actors.every(q=>Math.hypot(q.x-p.x,q.y-p.y)>=34))return p;}return null;
}
// Take a small step to the right when a neighbor blocks the forward step. Navigation stays authoritative.
export function crowdStep(from,next,others,index,nav){
 const clear=p=>others.every((o,i)=>i===index||Math.hypot(p.x-o.x,p.y-o.y)>=25||Math.hypot(p.x-o.x,p.y-o.y)>Math.hypot(from.x-o.x,from.y-o.y)+.001);
 if(clear(next))return next;const dx=next.x-from.x,dy=next.y-from.y;
 for(const sign of [1,-1]){const side=freeMove(from,{x:from.x+dy*sign,y:from.y-dx*sign},nav);if(clear(side)&&Math.hypot(side.x-from.x,side.y-from.y)>.001)return side;}return {...from};
}

export function benchSeatTarget(seat){const angle=seat.rotation||0;return {...seat,x:seat.x+Math.sin(angle)*8,y:seat.y+Math.cos(angle)*8};}
