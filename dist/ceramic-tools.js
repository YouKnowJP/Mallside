const ease=t=>{const x=Math.max(0,Math.min(1,t));return x*x*x*(x*(x*6-15)+10);};
export const isCeramic=p=>p?.type==='home'&&p.ceramicProfile?.reviewed===true;
export function ceramicGesture(time,reduced=false){
 if(reduced||!Number.isFinite(time)||time<0)return {reach:.7,turn:0};
 const reach=ease(time/.65),turn=time<.8?0:time<1.7?.48*ease((time-.8)/.9):time<2.3?.48:time<3.4?.48*(1-ease((time-2.3)/1.1)):0;return {reach,turn};
}
export function ceramicFactsHTML(p,esc){if(!isCeramic(p))return '';return `<section class="ceramic-facts frame-facts"><h4>Selected ceramic reference</h4><p>Arhaus SKU <strong>${esc(p.referenceSKU)}</strong> · ${esc(p.colorName)}.</p><p>${esc(p.ceramicProfile.dimensionNote)}</p><p>Only this selected reference is stocked here; other source sizes and colors are not included. This format control does not describe wearable fit.</p><p>${esc(p.sourceOfferNote)}</p><details><summary>Photograph & model notes</summary><p>${esc(p.ceramicProfile.photoBasis)}</p><p>Inspecting is a simulated six-minute demonstration. Glaze variation, thickness and handling are original game interpretations.</p></details></section>`;}
