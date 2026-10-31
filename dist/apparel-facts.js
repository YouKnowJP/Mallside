import {bagFactsHTML} from './bag-motion.js?v=44.0.0';
import {watchFactsHTML} from './watch-tools.js?v=43.0.0';
export function apparelFactsHTML(p,esc){
 if(p.bagReference)return bagFactsHTML(p,esc);
 if(p.watchProfile)return watchFactsHTML(p,esc);
 if(![40,42,45].includes(p.collectionReference))return '';
 return `<div class="apparel-facts"><p><strong>Source sizing:</strong> ${esc(p.sizeBasis)}</p><p>${esc(p.sourceOfferNote)}</p>${p.sourceAvailability==='OutOfStock'?'<p>The online source marks this color out of stock. Mallside uses simulated quantities; this is a dated product reference.</p>':''}</div>`;
}
