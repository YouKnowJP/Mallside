export function smoothBagSway(previous,target,delta,reduced=false){
 if(reduced)return 0;
 const bound=v=>Number.isFinite(v)?Math.max(-.04,Math.min(.04,v)):0,a=bound(previous),b=bound(target),dt=Number.isFinite(delta)?Math.max(0,Math.min(.1,delta)):0;
 if(!dt)return a;const next=b+(a-b)*Math.exp(-12*dt);return Math.abs(next-b)<.00001?b:next;
}
export function bagFactsHTML(p,esc){
 if(p.collectionReference!==44||!p.bagReference)return '';
 const b=p.bagReference;
 return `<div class="apparel-facts bag-facts"><p><strong>Source format:</strong> ${esc(b.format)} · ${esc(b.publishedDimensions)}.</p><p>Handle drop: ${esc(b.handleDrop)}. ${esc(b.axesNote)}</p><p>${esc(p.sizeBasis)}</p><p>${esc(p.sourceOfferNote)}</p></div>`;
}
