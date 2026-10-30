// Edition facts and original Mallside browsing tools; no book text is reproduced.
export function validISBN(value){return typeof value==='string'&&/^97[89]\d{10}$/.test(value)&&[...value].reduce((n,c,i)=>n+Number(c)*(i%2?3:1),0)%10===0;}
export const isBookProduct=p=>p?.type==='book'&&validISBN(p.bookISBN)&&['Paperback','Hardcover'].includes(p.bookFormat);
export function readingGesture(time,reduced=false){
 if(reduced||!Number.isFinite(time))return {page:0,reach:0};
 const cycle=((time%3.6)+3.6)%3.6/3.6,t=Math.max(0,Math.min(1,(cycle-.45)/.48)),ease=t*t*(3-2*t);return {page:-Math.PI*ease,reach:Math.sin(Math.PI*ease)};
}
export function bookFactsHTML(p,esc){return isBookProduct(p)?`<dl class="book-facts"><dt>Author</dt><dd>${esc(p.bookAuthor)}</dd><dt>Physical edition</dt><dd>${esc(p.bookFormat)}</dd><dt>Publisher</dt><dd>${esc(p.bookPublisher)}</dd><dt>ISBN-13</dt><dd>${esc(p.bookISBN)}</dd></dl><p class="hint">The reference, price and cover belong to this exact edition. Full book text is not included. Browsing leaves purchase tags intact.</p>`:'';}
export function verifiedBookshops(s,E){return E.STORES.filter(st=>st.businessKind==='books'&&st.count>0).sort((a,b)=>(E.mallForStore(s,a.id).id!==s.mallId)-(E.mallForStore(s,b.id).id!==s.mallId)||a.name.localeCompare(b.name)||a.id.localeCompare(b.id));}
export function bookshopGuideHTML(s,{E,esc}){
 const shops=verifiedBookshops(s,E),local=shops.filter(st=>E.mallForStore(s,st.id).id===s.mallId),others=shops.filter(st=>!local.includes(st));
 const rows=list=>list.map(st=>{const mall=E.mallForStore(s,st.id),locked=E.levelOf(s)<st.tier;return `<article><h3>${esc(st.name)}</h3><p>${esc(mall.name)} · ${esc(E.FLOORPLANS[mall.id].levels[E.storeFloor(mall,st.id)])}<br>${st.count} verified products</p><button class="button secondary wide" data-action="visit" data-id="${esc(st.id)}" ${locked?'disabled':''}>${locked?'Opens at rank '+(st.tier+1):'Walk to this bookshop'}</button></article>`;}).join('');
 return `<div class="modal-body bookshop-guide"><p>The public reading shelf contains original Mallside stories. Real books and stationery are sold at their named shops, with photographs and source references.</p><h3>Bookshops in this center</h3><div class="bookshop-rows">${local.length?rows(local):'<p>No verified bookshop collection is available here yet. Explore the planning lounges or try another center below.</p>'}</div><details><summary>Verified bookshops in other centers · ${others.length}</summary><div class="bookshop-rows">${rows(others)}</div></details><p class="hint">Walking spends no money. Check the edition, game price and tax before checkout. Traveling to another center uses the usual game time.</p></div>`;
}
