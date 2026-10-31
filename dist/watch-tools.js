export const isVerifiedWatch=p=>p?.type==='watch'&&p.watchProfile?.reviewed===true;
const smooth=x=>{const t=Math.max(0,Math.min(1,x));return t*t*t*(t*(t*6-15)+10);};
// One deliberate lift, hold and return. Position, velocity and acceleration meet at each boundary.
export function watchGesture(time,reduced=false){
 if(reduced||!Number.isFinite(time)||time<0)return 0;
 const t=Math.min(4.5,time);return t<1.1?smooth(t/1.1):t<3?1:1-smooth((t-3)/1.5);
}
export function watchFactsHTML(p,esc){
 if(!isVerifiedWatch(p))return '';
 return `<div class="apparel-facts watch-facts"><p><strong>Case diameter:</strong> ${p.watchProfile.caseMM} mm · ${esc(p.watchProfile.movement)} · date display.</p><p>${esc(p.sizeBasis)}</p><p>${esc(p.sourceOfferNote)}</p></div>`;
}
