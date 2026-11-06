import {STUDY_PALETTES,STUDY_FINISHES} from './studio-study.js?v=61.0.0';

export function floorStudyHTML(st,draft,{esc}){
 const palette=STUDY_PALETTES.find(p=>p.id===draft.palette);
 return `<section class="floor-study" aria-label="Material preview on the shop floor"><div class="floor-study-heading"><strong>Try the materials together</strong><span class="study-chips" aria-hidden="true">${palette.colors.map(c=>`<i style="background:${c}"></i>`).join('')}</span></div><p>Original planning samples · ${esc(st.name)} · no merchandise reserved</p><div class="floor-study-fields"><label>Palette<select id="floor-study-palette">${STUDY_PALETTES.map(p=>`<option value="${p.id}" ${p.id===draft.palette?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label><label>Finish<select id="floor-study-finish">${STUDY_FINISHES.map(f=>`<option value="${f.id}" ${f.id===draft.finish?'selected':''}>${esc(f.name)}</option>`).join('')}</select></label></div><p data-floor-guide-status role="status">The host is joining the workbench. You can preview while you wait.</p><div class="floor-study-actions"><button class="button orange" data-action="floor-study-save">Keep study · free</button><button class="button secondary" data-action="floor-study-cancel">Cancel preview</button></div></section>`;
}
export function benchShops(s,layout,point,E){
 const seen=new Set();return [...layout.rects,...layout.units||[]].flatMap(r=>{const st=E.storeById(r.id);if(seen.has(r.id)||!st?.count||E.levelOf(s)<st.tier)return [];seen.add(r.id);return [{id:r.id,name:st.name,count:st.count,distance:Math.hypot(r.door.x-point.x,r.door.y-point.y)}];}).sort((a,b)=>a.distance-b.distance||a.name.localeCompare(b.name)).slice(0,4);
}
export function benchPauseHTML(s,layout,point,{E,esc}){
 const shops=benchShops(s,layout,point,E),picks=Object.values(E.savedBags(s)).flat().length;
 return `<section class="bench-pause"><span class="eyebrow">PAUSE & PLAN · THIS FLOOR</span><h3>A moment to choose your next stop.</h3><p>${picks?picks+' unpaid selection'+(picks===1?'':'s')+' in your basket.':'Your basket is empty. Take a look around before choosing.'} Reviewing your finds spends no game money or time.</p><div class="bench-pause-tools"><button class="button secondary" data-action="play-bag" ${picks?'':'disabled'}>Review my picks</button><button class="button secondary" data-action="plan-notebook">Saved shortlists</button></div><h4>Closest stocked shops from this seat</h4>${shops.length?`<div class="rest-shop-links">${shops.map(st=>`<button class="button secondary" data-action="visit" data-id="${esc(st.id)}">${esc(st.name)} · ${st.count} verified references ↗</button>`).join('')}</div>`:'<p>No stocked shops on this floor yet. Open the center map to find verified collections on another floor.</p><button class="button secondary" data-action="center-map">Open center map ↗</button>'}<p>Walking follows the real game route. Resting below uses the existing 30-minute break.</p></section>`;
}
// Fine original joinery fits the existing public bench, with no new obstacles.
export function buildBenchPlanningDetails(b,x,z,rotation,theme){
 const rx=Math.cos(rotation),rz=-Math.sin(rotation),fx=Math.sin(rotation),fz=Math.cos(rotation),at=(u,v)=>({x:x+rx*u+fx*v,z:z+rz*u+fz*v});
 for(const side of [-1,1]){const arm=at(side*29,0);b.box(arm.x,24,arm.z,4,2,19,theme.trim,rotation,'metal');for(const v of [-7,7]){const screw=at(side*29,v);b.cylinder(screw.x,25.2,screw.z,.65,.4,'#d9d7c9');}}
 const card=at(23,-10);b.box(card.x,28,card.z,10,5,.7,'#e0d5b9',rotation,'metal');for(const u of [20,23,26]){const p=at(u,-9.55);b.box(p.x,28,p.z,.5,2.8,.12,'#627b6a',rotation);}
}
