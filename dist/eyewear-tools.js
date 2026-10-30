// Virtual styling tools use retailer widths; they never collect prescriptions.
export const isVerifiedFrame=p=>p?.type==='sunglasses'&&!!p.frameProfile;
const ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
export function frameGesture(time,reduced=false){if(reduced||!Number.isFinite(time))return 0;return ease((time-.45)/.95)*(1-ease((time-2.3)/1.1));}
export function frameFactsHTML(p,esc){return isVerifiedFrame(p)?`<dl class="frame-facts"><dt>Frame color</dt><dd>${esc(p.colorName)}</dd><dt>Frame material</dt><dd>${esc(p.frameProfile.material)}</dd><dt>Source widths</dt><dd>${p.sizes.map(esc).join(' · ')}</dd><dt>Price reference</dt><dd>Published starting USD offer. Real lens customization changes the price.</dd></dl><p class="hint">Virtual styling preview · game fit is simulated. Compare the source photograph and widths. Prescription and lens ordering are outside this game.</p>`:'';}
