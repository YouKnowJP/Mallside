const BASES={green:{name:'Green tea',color:'#8a9b65'},black:{name:'Black tea',color:'#98734d'},herbal:{name:'Herbal infusion',color:'#b4837d'}};
export const latestTeaMemory=s=>[...(s.activityMemories||[])].reverse().find(m=>m.activity==='tea'&&m.mallId===s.mallId&&BASES[m.choice?.base]);
export function teaCardHTML(s,{E,esc}){
 const a=E.experienceSpec(s,'tea'),memories=(s.activityMemories||[]).filter(m=>m.activity==='tea'&&m.mallId===s.mallId&&BASES[m.choice?.base]).slice(-3).reverse();
 return `<div class="modal-body tea-recipe-card"><span class="eyebrow">ORIGINAL MALLSIDE RECIPE · FREE TO READ</span><h3>${esc(a.tea.name)}</h3><p>${esc(a.tea.description)}</p><div class="care-summary"><span>${esc(BASES[a.tea.base].name)}</span><span>${esc(a.tea.temperature)}°C</span><span>${esc(a.tea.minutes)} minutes</span></div><p>This is our game workshop recipe. Reading this card spends no money or game time and awards no XP. Starting opens the choices; finishing the workshop uses ${E.money(a.price)} and ${a.minutes} game minutes.</p><button class="button orange wide" data-action="enjoy-activity" data-id="tea" ${a.completed?'disabled':''}>${a.completed?'Today’s tea memory collected ✓':'Open the tea workshop'}</button><h4>Tea memories from this center</h4><div class="tea-card-memories">${memories.map(m=>`<p><small>DAY ${m.day}</small> · ${esc(m.title)}<br>${esc(BASES[m.choice.base].name)} · ${esc(m.choice.temperature)}°C · ${esc(m.choice.minutes)} minutes</p>`).join('')||'<p>Your first completed tea workshop here will leave a memory.</p>'}</div><button class="button secondary wide" data-action="close">Back to the lounge</button></div>`;
}
// Batched counter detail stays in the rear of the existing lounge collider.
export function buildTeaLounge(w,b,v,theme){
 const x=v.x+v.width/2,z=v.y+17,width=Math.min(68,v.width-12);
 b.box(x,15,z,width,30,22,theme.stone);b.box(x,31,z,width+3,2,24,theme.trim);
 for(const [i,dx]of [-22,0,22].entries()){
  b.cylinder(x+dx,38,z-3,5,11,['#8a9b65','#98734d','#b4837d'][i]);b.cylinder(x+dx,44,z-3,5.4,1,theme.stone);b.box(x+dx,38,z+2.2,5,5,.5,'#eee6d3');
 }
 b.box(x,33,z+7,34,1,8,'#e5d4b5');for(const dx of [-10,10]){b.cylinder(x+dx,35.3,z+7,3,4,'#eee6d3');b.cylinder(x+dx,37.4,z+7,2.4,.2,'#a2a77f');}
 b.box(x+width/2-7,34,z+7,9,1,7,'#f2e9d8');
 const marker=w.box(x+width/2-7,34.8,z+7,6,.3,4,w.mat('#d2c6af',{roughness:.8}));w.teaLounges??=[];w.teaLounges.push({marker,signature:null});updateTeaLounges(w);
 const label=w.label('Tea recipe card ↗',x,62,z,60,theme.accent);w.tag(label,'tea-card',v.door);w.teaLounges.at(-1).label=label;w.nearLabels.push({object:label,x,z,radius:170,directory:true});w.canvas.dataset.teaLoungeRevision='46';
}
export function updateTeaLounges(w){
 const active=w.action?.previewProduct?.id==='tea';if(w.teaLoungeName)w.teaLoungeName.visible=!active;const m=latestTeaMemory(w.state),signature=m?m.id+':'+m.choice.base:'empty';for(const v of w.teaLounges||[]){if(active&&v.label)v.label.visible=false;if(v.signature===signature)continue;v.marker.material.color.set(m?BASES[m.choice.base].color:'#d2c6af');v.signature=signature;}
 if(w.teaLounges?.length)w.canvas.dataset.teaLoungeMemory=m?m.choice.base:'empty';
}
