const ease=t=>{const x=Math.max(0,Math.min(1,t));return x*x*x*(x*(x*6-15)+10);};
export const isCeramic=p=>p?.type==='home'&&p.ceramicProfile?.reviewed===true;
export function ceramicGesture(time,reduced=false){
 if(reduced||!Number.isFinite(time)||time<0)return {reach:1,turn:0};
 const reach=ease(time/.65)*(1-ease((time-3.65)/.75)),turn=time<.8?0:time<1.7?.48*ease((time-.8)/.9):time<2.3?.48:time<3.4?.48*(1-ease((time-2.3)/1.1)):0;return {reach,turn};
}
// The object and both hands share the same eased lift and lower, with source-aware cradle spacing.
export function ceramicHold(profile,time,reduced=false,rest){
 const gesture=ceramicGesture(time,reduced),r=gesture.reach,height=profile.heightIn*2.54*.4,bowl=['cereal-bowl','soup-bowl'].includes(profile.kind),half=Math.max(1.3,Math.min(bowl?4.5:4,profile.diameterIn*2.54*.4*(bowl?.55:.43))),offset=Math.min(4,height*.5),targetY=28.5+offset;
 const hands=[0,1].map(i=>{const a=rest?.[i]||{x:(i?1:-1)*10,y:22,z:1.5};return {x:a.x+((i?1:-1)*half-a.x)*r,y:a.y+(targetY-a.y)*r,z:a.z+(9.5-a.z)*r};});return {...gesture,baseY:(hands[0].y+hands[1].y)/2-offset,z:(hands[0].z+hands[1].z)/2,hands};
}
export function ceramicFactsHTML(p,esc){if(!isCeramic(p))return '';return `<section class="ceramic-facts frame-facts"><h4>Selected ceramic reference</h4><p>${esc(p.brand)} SKU <strong>${esc(p.referenceSKU)}</strong> · ${esc(p.colorName)}.</p><p>${esc(p.ceramicProfile.dimensionNote)}</p>${p.ceramicProfile.capacityNote?`<p>${esc(p.ceramicProfile.capacityNote)} The game does not test usable capacity.</p>`:''}<p>Only this selected reference is stocked here; other source sizes, sets and colors are not included. This format control does not describe wearable fit.</p><p>${esc(p.sourceOfferNote)}</p><details><summary>Photograph & model notes</summary><p>${esc(p.ceramicProfile.photoBasis)}</p><p>Inspecting is a simulated six-minute demonstration. Glaze variation, thickness and handling are original game interpretations.</p></details></section>`;}
