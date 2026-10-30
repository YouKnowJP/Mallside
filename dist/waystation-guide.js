import {COMMONS} from './commons.js?v=32.0.0';

export function nearbyDiscoveries(s,layout,amenity){
 const fixtures=layout.environment.fixtures,origin=fixtures.find(f=>f.amenity===amenity)?.approach||layout.spawn;
 return fixtures.filter(f=>f.activity&&f.approach).map(f=>({fixture:f,activity:COMMONS[f.activity],discovered:s.commonsNotes.some(n=>n.mallId===s.mallId&&n.floor===(s.floor||0)&&n.kind===f.activity),distance:Math.hypot(f.approach.x-origin.x,f.approach.y-origin.y)})).sort((a,b)=>a.distance-b.distance||a.fixture.id.localeCompare(b.fixture.id));
}
export function nearbyDiscoveryHTML(s,layout,amenity,esc){
 const stops=nearbyDiscoveries(s,layout,amenity);if(!stops.length)return '';
 return `<section class="nearby-discoveries" aria-label="Nearby discoveries"><h3>A little more around this stop</h3><p>Walk to a free discovery on this floor. Your notebook remembers each visit.</p><div class="public-stop-grid">${stops.map(({fixture:f,activity:a,discovered})=>`<button class="public-stop" data-action="center-stop" data-id="${esc(f.id)}" data-type="fixture" data-floor="${s.floor||0}"><span><strong>${esc(a.name)}</strong><small>${discovered?'Discovered on this floor ✓':esc(a.verb)+' · free'}</small></span><b aria-hidden="true">↗</b></button>`).join('')}</div></section>`;
}
