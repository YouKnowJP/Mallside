export function apparelFactsHTML(p,esc){
 if(p.collectionReference!==40)return '';
 return `<div class="apparel-facts"><p><strong>Source sizing:</strong> ${esc(p.sizeBasis)}</p><p>${esc(p.sourceOfferNote)}</p>${p.sourceAvailability==='OutOfStock'?'<p>The online source marks this color out of stock. Mallside uses simulated quantities; this is a dated product reference.</p>':''}</div>`;
}
