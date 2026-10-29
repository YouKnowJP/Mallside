// Closed <details> content can retain layout boxes in some engines. It must
// never become the target of our dialog's explicit keyboard focus loop.
export function dialogFocusables(root){
 return [...root.querySelectorAll('button:not(:disabled),a[href],select:not(:disabled),input:not(:disabled),textarea:not(:disabled),summary,[tabindex="0"]')].filter(el=>{
  if(el.tabIndex<0||el.matches(':disabled')||!el.getClientRects().length||el.closest('[inert]')||getComputedStyle(el).visibility==='hidden')return false;
  for(let p=el.parentElement;p&&p!==root;p=p.parentElement){if(p.tagName==='DETAILS'&&!p.open&&!p.querySelector(':scope > summary')?.contains(el))return false;}
  return true;
 });
}
