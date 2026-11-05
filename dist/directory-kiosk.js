import * as T from './vendor/three.module.js';
import {beveledBox,surfaceTexture} from './scene-finish.js?v=57.0.0';
// A narrow freestanding directory fits the unchanged 14×14 collision footprint.
export function buildDirectoryKiosk(w,p,theme,texture){
 const root=new T.Group(),x=p.x+p.width/2,z=p.y+p.height/2;root.position.set(x,0,z);w.scene.add(root);
 const timber=w.mat(theme.trim,{map:surfaceTexture(w,'timber'),roughness:.72}),stone=w.mat(theme.stone,{roughness:.8}),metal=w.mat(theme.accent,{roughness:.5,metalness:.22});
 const box=(pos,size,mat)=>{const o=w.mesh(beveledBox(...size,.25),mat,root);o.position.set(...pos);return o;};
 box([0,2,0],[13.5,4,13.5],stone);box([0,28,0],[11,52,6],timber);box([0,55,0],[13.5,2,8],stone);
 for(const sign of[-1,1])box([sign*6.2,34,3.3],[.6,38,1.2],metal);
 const panel=w.mesh(new T.PlaneGeometry(10,15),w.mat('#ffffff',{map:texture,roughness:.8}),root);panel.position.set(0,40,3.2);panel.castShadow=false;w.tag(panel,'directory:'+p.node,p.approach);
 box([0,13,3.7],[10,1.6,1.2],metal);for(let i=0;i<3;i++)box([-3+i*3,10,3.2],[1.5,1.5,.5],stone);
 box([0,7,-3.2],[7,2,.4],metal);root.userData={originalDirectory:true,fixture:p.id};w.canvas.dataset.directoryKioskRevision='54';return root;
}
export function directoryNearby(s,l,position,{E}){
 const origin=position||l.spawn,rank=p=>Math.hypot(p.x-origin.x,p.y-origin.y),floor=s.floor||0;
 const shops=[...l.rects,...l.units].map(u=>({u,st:E.storeById(u.id)})).filter(q=>q.st?.count&&q.st.tier<=E.levelOf(s)&&E.storeFloor(E.mallOf(s),q.st.id)===floor).sort((a,b)=>rank(a.u.door)-rank(b.u.door)||a.st.name.localeCompare(b.st.name)).slice(0,4).map(q=>q.st);
 const amenities=l.environment.fixtures.filter(p=>p.amenity==='water'||p.kind==='bench'||p.activity).sort((a,b)=>rank(a.approach)-rank(b.approach)).filter((p,i,a)=>a.findIndex(q=>(q.amenity||q.activity||q.kind)===(p.amenity||p.activity||p.kind))===i).slice(0,4);
 return {shops,amenities};
}
export function directoryGuideHTML(s,l,position,{E,esc}){
 const {shops,amenities}=directoryNearby(s,l,position,{E}),labels={water:'Free water station',bench:'Garden bench',mosaic:'Mosaic table',reading:'Reading shelf',garden:'Garden study'};
 return `<section class="directory-nearby"><h3>Plan your next stop.</h3><p>Nearby on this floor, by map distance. Paths use the existing corridors and connections. Reading is free and pauses time; walking and activities keep their normal costs.</p><div class="directory-nearby-grid"><article><h4>Stocked shops</h4>${shops.map(st=>`<button class="button secondary wide" data-action="visit" data-id="${esc(st.id)}">${esc(st.name)} · ${st.count} verified references ↗</button>`).join('')||'<p>Check another floor for stocked shops.</p>'}</article><article><h4>Free public stops</h4>${amenities.map(p=>`<button class="button secondary wide" data-action="center-stop" data-floor="${s.floor||0}" data-type="fixture" data-id="${esc(p.id)}">${esc(labels[p.amenity||p.activity||p.kind])} ↗</button>`).join('')}</article></div><button class="button secondary wide" data-action="plan-notebook">My saved shortlists · ${s.shoppingPlans.length}</button></section>`;
}
