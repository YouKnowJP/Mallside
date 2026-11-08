export const PHONE_COUNTER_STORE='spectrum-tenant-att';
export const GAME_NIGHT_STORE='delamo-tenant-thegamechest-Upperlevel';
export const SHOP_STAFF_EDITION=70;

export function staffButton(st,esc){
 const label=st.id===PHONE_COUNTER_STORE?'Ask about handsets':st.id===GAME_NIGHT_STORE?'Plan a game night':'';
 return label?`<button class="button secondary" data-action="staff-open" data-id="${esc(st.id)}">${label}</button>`:'';
}

const phoneTopics={
 grip:['A narrower phone','Let’s start with the narrowest of these bodies. Try holding it in the demo and compare the width for yourself.'],
 storage:['More storage','These are the two selected 256GB models. I’ll put the lower game price first so you can compare what fits your budget.'],
 pen:['A built-in pen','The Galaxy S25 Ultra has a built-in S Pen. You can inspect its shape and the handset edges at the display.']
};
const gameTopics={
 pair:['Two players','Start with a game designed for two. Try a short practice turn together so both players can see how a round works.'],
 beginner:['New players','Pick a game you can explain with one example turn. A short first round gives everyone time to try it before you teach the rest.'],
 group:['A larger group','Count everyone who wants to play before choosing. Look for a game that supports the whole group, or split into two tables so nobody has to wait.']
};

export function phoneCounterPicks(st,topic){
 const handsets=st.products.filter(p=>p.phoneProfile?.reviewed);
 if(topic==='grip')return handsets.slice().sort((a,b)=>a.phoneProfile.widthMM-b.phoneProfile.widthMM);
 if(topic==='storage')return handsets.filter(p=>p.sizes.includes('256GB')).sort((a,b)=>a.price-b.price);
 if(topic==='pen')return handsets.filter(p=>p.phoneProfile.body==='s25-ultra');
 return [];
}

function topicButtons(topics,chosen,esc){
 return `<div class="staff-topics" role="group" aria-label="Choose a question">${Object.entries(topics).map(([id,[label]])=>
  `<button class="button secondary" data-action="staff-topic" data-id="${id}" aria-pressed="${id===chosen}">${esc(label)}</button>`).join('')}</div>`;
}

export function phoneCounterHTML(s,st,topic,{E,esc,picture}){
 const message=Object.hasOwn(phoneTopics,topic)?phoneTopics[topic][1]:'What would you like to compare? We can look at how the phones feel in hand, the storage on the shelf, or the model with a built-in pen.';
 return `<div class="modal-body shop-staff-counter"><span class="eyebrow">HANDSET COUNTER · FREE TO EXPLORE</span>
  <div class="staff-reply" role="status"><strong>${esc(st.npc)} · Shop associate</strong><p>${esc(message)}</p></div>
  ${topicButtons(phoneTopics,topic,esc)}
  <div class="staff-handsets">${phoneCounterPicks(st,topic).map(p=>`<article>
   <div class="mini-art">${picture(p)}</div><div><h3>${esc(p.name)}</h3><p>${p.phoneProfile.widthMM} mm wide · ${p.phoneProfile.weightGrams} g · ${E.money(E.price(s,p))} in game</p></div>
   <div class="staff-item-actions"><button class="button secondary" data-action="detail" data-id="${esc(p.id)}">Inspect handset</button>
   <button class="button secondary" data-action="staff-stock" data-id="${esc(p.id)}">Ask to check ${esc(p.sizes[0])}</button></div></article>`).join('')}</div>
  <p class="hint">The associate checks game stock at this shop. Looking and asking are free.</p></div>`;
}

export function gameNightHTML(st,topic,esc){
 const selected=Object.hasOwn(gameTopics,topic)?gameTopics[topic]:null;
 return `<div class="modal-body shop-staff-counter"><span class="eyebrow">GAME-NIGHT TABLE · FREE TO EXPLORE</span>
  <div class="staff-reply" role="status"><strong>${esc(st.npc)} · Shop associate</strong><p>${esc(selected?.[1]||'Who’s joining you for game night? I can help you think through the table size and how much time to leave for learning a new game.')}</p></div>
  ${topicButtons(gameTopics,topic,esc)}
  ${selected?`<p class="staff-table-note">For your table · ${esc(selected[0])}</p>`:''}
  <p class="hint">This is an original Mallside consultation. The shop’s product catalog is in research.</p></div>`;
}
