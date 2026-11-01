export const isCollectible=p=>p?.type==='plush'&&p.plushProfile?.reviewed===true;
const ease=t=>{const x=Math.max(0,Math.min(1,t));return x*x*x*(x*(x*6-15)+10);};
export function collectibleGesture(time,reduced=false){
 if(reduced||!Number.isFinite(time)||time<0)return {reach:.65,turn:0};
 const reach=ease(time/.6),turn=time<.8?0:time<1.6?ease((time-.8)/.8)*.55:time<2.2?.55:time<3.2?.55*(1-ease(time-2.2)):0;return {reach,turn};
}
export function collectibleFactsHTML(p,esc){if(!isCollectible(p))return '';return `<section class="collectible-facts frame-facts"><h4>Collectible reference</h4><p>Hot Topic product ID <strong>${esc(p.referenceSKU)}</strong> · one unsized collectible.</p><p>Color descriptions follow the reviewed photograph; the listing has no selectable color menu.</p><p>${esc(p.plushProfile.dimensionNote)}</p><p>${esc(p.sourceOfferNote)}</p><p>The solid game model is adapted from this photograph. Inspecting is a simulated 6-minute demonstration; this is not a wearable fitting or a real product-quality guarantee.</p></section>`;}
