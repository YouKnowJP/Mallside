import * as T from './vendor/three.module.js';
import {detailBoxes} from './detail-instances.js?v=48.0.0';
import {beveledBox,surfaceTexture} from './scene-finish.js?v=33.0.0';
// Each original lounge stays inside the venue footprint and retains the established bench seat.
export function buildRestLounge(w,v){
 const root=new T.Group(),x=v.x+v.width/2,z=v.y+v.height/2;root.position.set(x,0,z);w.scene.add(root);
 const seat=new T.Group();seat.scale.x=Math.min(1,(v.width-4)/88);root.add(seat);
 const wood=w.mat('#b58d64',{map:surfaceTexture(w,'timber'),roughness:.7}),metal=w.mat('#526b61',{metalness:.25,roughness:.5}),paper=w.mat('#eee5d0'),parts=[];
 const box=(p,size,m,parent=seat)=>{const o=w.mesh(beveledBox(...size,Math.min(.45,...size.map(n=>n*.1))),m,parent);o.position.set(...p);return o;};
 box([0,.12,0],[v.width-2,.2,v.height-2],w.mat('#d7d6c0'),root);
 for(const dz of[-8,-2,4,10])box([0,13.5,dz],[86,3,4.8],wood);
 for(const y of[20,27,34])box([0,y,-10],[86,5,3.5],wood);
 for(const dx of[-31,31]){box([dx,6,0],[4,12,21],metal);box([dx,18,-10],[3,29,3],metal);box([dx,22,2],[3,3,20],metal);}
 // Folded original floor guide and note slips are scenery, never merchant products.
 box([30,15.4,3],[15,.6,10],paper);for(let i=0;i<3;i++)parts.push([26+i*4,15.8,3,.35,.12,8,'#a9b7a2']);parts.push([30,15.9,3,12,.1,.5,'#718776']);
 for(const sign of[-1,1]){
  const px=sign*(v.width/2-9),pz=-v.height/2+10,pot=w.mesh(new T.CylinderGeometry(6.2,4.8,11,16),w.mat('#ad9478'),root);pot.position.set(px,5.5,pz);
  const plant=w.mesh(new T.SphereGeometry(1,12,8),w.mat('#70896b'),root);plant.position.set(px,19,pz);plant.scale.set(7,12,6);
  for(const dx of[-3,3]){const leaf=w.mesh(new T.SphereGeometry(1,10,6),w.mat('#91a67c'),root);leaf.position.set(px+dx,16,pz+2);leaf.scale.set(4,7,2.5);leaf.rotation.z=dx*.08;}
 }
 detailBoxes(w,seat,parts);root.userData={originalRestLounge:true,footprint:{width:v.width,depth:v.height}};w.canvas.dataset.restLoungeRevision='53';return root;
}
export function restPanelHTML(s,{E,esc}){
 const mall=E.mallOf(s),floor=s.floor||0,stops=E.STORES.filter(st=>st.count&&st.tier<=E.levelOf(s)&&mall.sections.some(d=>d.stores.includes(st.id))&&E.storeFloor(mall,st.id)===floor).sort((a,b)=>a.name.localeCompare(b.name)).slice(0,4);
 return `<div class="modal-body rest-lounge-panel"><span class="eyebrow">A PAUSE BETWEEN SHOPS</span><h3>Put your bags down.</h3><p>Rest for 30 game minutes to recover up to 38 stamina. You’ll get a little hungrier while time passes.</p><div class="care-summary"><span>⏱ 30 minutes</span><span>⚡ +38</span><span>Free</span></div><button class="button orange wide" data-action="rest-now">Sit & rest · 30 min</button><section class="rest-next"><h3>When you’re ready to go</h3><p>Check your saved finds or choose a stocked shop on ${esc(E.planFor(s).levels[floor])}. Reading this guide is free; walking uses normal game time.</p><button class="button secondary wide" data-action="plan-notebook">My saved shortlists · ${s.shoppingPlans.length}</button><div class="rest-shop-links">${stops.map(st=>`<button class="button secondary" data-action="visit" data-id="${esc(st.id)}">${esc(st.name)} · ${st.count} verified references ↗</button>`).join('')}</div><div class="service-links"><button class="button secondary" data-action="center-map">Open this floor’s map</button><button class="text-button" data-action="food">Find lunch</button></div></section></div>`;
}
