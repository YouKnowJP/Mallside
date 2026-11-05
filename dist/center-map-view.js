// Transient map controls never change the player's position or saved progress.
export const MAP_ZOOM_LIMIT=16;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function mapView(layout,view={}){
 const width=layout.campus.width,height=layout.campus.height;
 const zoom=clamp(Number.isFinite(view.zoom)?view.zoom:1,1,MAP_ZOOM_LIMIT);
 const w=width/zoom,h=height/zoom;
 return {zoom,x:clamp(Number.isFinite(view.x)?view.x:(width-w)/2,0,width-w),y:clamp(Number.isFinite(view.y)?view.y:(height-h)/2,0,height-h),width:w,height:h};
}
export function changeMapView(layout,view,action,position=null){
 const v=mapView(layout,view),cx=v.x+v.width/2,cy=v.y+v.height/2;
 if(action==='overview')return mapView(layout);
 if(action==='you'&&position){const zoom=Math.max(3,v.zoom);return mapView(layout,{zoom,x:position.x-layout.campus.width/zoom/2,y:position.y-layout.campus.height/zoom/2});}
 if(action==='in'||action==='out'){const zoom=clamp(v.zoom*(action==='in'?1.6:1/1.6),1,MAP_ZOOM_LIMIT);return mapView(layout,{zoom,x:cx-layout.campus.width/zoom/2,y:cy-layout.campus.height/zoom/2});}
 const shift={left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]}[action];
 return shift?mapView(layout,{...v,x:v.x+shift[0]*v.width*.3,y:v.y+shift[1]*v.height*.3}):v;
}
export function focusMapPoint(layout,view,point){
 const v=mapView(layout,view),pad=Math.min(v.width,v.height)*.08;
 if(point.x>=v.x+pad&&point.x<=v.x+v.width-pad&&point.y>=v.y+pad&&point.y<=v.y+v.height-pad)return v;
 return mapView(layout,{zoom:v.zoom,x:point.x-v.width/2,y:point.y-v.height/2});
}
export const mapViewBox=v=>[v.x,v.y,v.width,v.height].map(n=>Number(n.toFixed(2))).join(' ');
export const VENUE_LABELS={rest:'Rest lounge',services:'Guest services',food:'Food court',coffee:'Coffee stop',photo:'Photo studio',bridge:'Garden walk',popup:'Pop-up pavilion',flowers:'Flower studio',cinema:'Cinema',carousel:'Carousel',art:'Art walk',lounge:'Quiet lounge'};
export function mapControlsHTML(position){
 const button=(id,label,text)=>`<button class="button secondary" data-action="center-map-view" data-id="${id}" aria-label="${label}">${text}</button>`;
 return `<section class="center-map-controls" aria-label="Map view controls"><div class="map-zoom-controls">${button('in','Zoom in on map','Zoom +')}${button('out','Zoom out on map','Zoom −')}${button('overview','Show the whole floor','Whole floor')}${position?button('you','Center map on your position','Find me'):''}</div><div class="map-pan-controls" role="group" aria-label="Pan map">${button('left','Pan map left','←')}${button('up','Pan map up','↑')}${button('down','Pan map down','↓')}${button('right','Pan map right','→')}</div><p id="center-map-view-status" role="status">Whole floor · zoom in to read storefront labels.</p></section>`;
}
const PUBLIC_LABELS={mosaic:'Mosaic table',reading:'Reading shelf',garden:'Garden study'};
const publicName=f=>f.kind==='art'?'Sculpture alcove':f.amenity?(f.amenity==='water'?'Water refill station':'Community noticeboard'):PUBLIC_LABELS[f.activity];
const overlaps=(a,b,pad=6)=>a.x<b.x+b.width+pad&&a.x+a.width+pad>b.x&&a.y<b.y+b.height+pad&&a.y+a.height+pad>b.y;
function nameLines(name){const words=name.split(/\s+/);if(name.length<=12||words.length===1)return [name];let best=[name],score=Infinity;for(let i=1;i<words.length;i++){const lines=[words.slice(0,i).join(' '),words.slice(i).join(' ')],n=Math.max(...lines.map(v=>v.length));if(n<score){score=n;best=lines;}}return best;}
// Original map annotations are packed against shops, every badge, other labels and the player callout.
export function mapLabelLayout(layout,position=null){
 const c=layout.campus,zones=c.nodes.map(node=>({kind:'zone',id:node.id,name:node.label,node,target:{x:node.x,y:node.y},p:{x:node.x,y:node.y}})),points=[...zones.map(m=>m.p),...layout.escalators.map(e=>e.landing)],places=[...zones];
 const stops=[...layout.environment.fixtures.filter(f=>f.activity||f.amenity||f.kind==='art').map(f=>({kind:'fixture',id:f.id,name:publicName(f),target:f.approach})),...layout.venues.map(v=>({kind:'venue',id:v.id,name:VENUE_LABELS[v.id]||v.id,target:v.door}))];
 for(const stop of stops){let p={...stop.target};for(let i=0;points.some(b=>Math.hypot(b.x-p.x,b.y-p.y)<58)&&i<120;i++){const angle=i*2.4,r=65+Math.floor(i/8)*36;p={x:Math.max(32,Math.min(c.width-32,stop.target.x+Math.cos(angle)*r)),y:Math.max(32,Math.min(c.height-32,stop.target.y+Math.sin(angle)*r))};}points.push(p);places.push({...stop,p});}
 const blocked=[...layout.units,...layout.rects,...layout.anchors].map(r=>({x:r.x,y:r.y,width:r.width,height:r.height}));
 if(position){const side=position.x>c.width-180?-1:1;blocked.push({x:position.x+side*48-(side<0?76:0),y:position.y-22,width:76,height:38});}
 const labels=[];
 for(const place of places){const lines=nameLines(place.name);let chosen=null;
  for(let font=place.kind==='zone'?26:20;font>=14&&!chosen;font-=2){const width=Math.max(...lines.map(s=>s.length))*font*.65+8,height=lines.length*font*1.18+6,rx=width/2+40,ry=height/2+40;
   const base=place.kind==='zone'?[[0,-ry],[0,ry],[rx,0],[-rx,0]]:[[0,ry],[0,-ry],[rx,0],[-rx,0]];
   for(let i=0;i<264;i++){const offset=base[i]||[Math.cos((i-4)%8*Math.PI/4)*rx*(2+Math.floor((i-4)/8)),Math.sin((i-4)%8*Math.PI/4)*ry*(2+Math.floor((i-4)/8))],r={x:place.p.x+offset[0]-width/2,y:place.p.y+offset[1]-height/2,width,height};
    if(r.x<6||r.y<6||r.x+r.width>c.width-6||r.y+r.height>c.height-6||[...blocked,...labels].some(b=>overlaps(r,b))||points.some(p=>Math.hypot(Math.max(r.x,Math.min(p.x,r.x+r.width))-p.x,Math.max(r.y,Math.min(p.y,r.y+r.height))-p.y)<33))continue;
    chosen={bounds:r,x:r.x+width/2,y:r.y+font,lines,font};break;
   }
  }
  place.label=chosen;if(chosen)labels.push(chosen.bounds);
 }
 return {places,points,blocked};
}

export function campusMapSVG(layout,position,floor,{E,esc},view){
 const c=layout.campus,v=mapView(layout,view),annotation=mapLabelLayout(layout,position),pointAttrs=p=>`data-map-x="${p.x}" data-map-y="${p.y}"`;
 const paths=c.halls.map(e=>{const a=c.nodes[Number(e.a)],b=c.nodes[Number(e.b)];return `<path d="M${a.x} ${a.y}L${b.x} ${b.y}" stroke="#fff9eb" stroke-width="${e.width}" stroke-linecap="round"/>`;}).join('')+c.courts.map(n=>`<circle cx="${n.x}" cy="${n.y}" r="${n.radius}" fill="#fff9eb"/>`).join('');
 const label=(text,x,y,size=23,anchor='middle')=>`<text class="map-place-label" x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}">${esc(text)}</text>`;
 const placeLabel=m=>{if(!m.label)return '';const b=m.label.bounds,x=clamp(m.p.x,b.x,b.x+b.width),y=clamp(m.p.y,b.y,b.y+b.height),line=Math.hypot(x-m.p.x,y-m.p.y)>72?`<path d="M${m.p.x} ${m.p.y}L${x} ${y}" stroke="#879d8a" stroke-width="2" pointer-events="none"/>`:'';return `${line}<text class="map-place-label" text-anchor="middle" font-size="${m.label.font}">${m.label.lines.map((line,i)=>`<tspan x="${m.label.x}" y="${m.label.y+i*m.label.font*1.18}">${esc(line)}</tspan>`).join('')}</text>`;};
 const blocks=[...layout.units,...layout.rects,...layout.anchors].map(r=>{
  const st=E.storeById(r.id),color=st?.count?'#9a684c':st&&(E.isServiceStore(st)||st.businessKind==='food')?'#527967':'#b7bcaa',shape=`<rect x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" rx="5" fill="${color}"/>`;
  if(!st)return shape;
  const p={x:r.x+r.width/2,y:r.y+r.height/2},words=st.name.split(/\s+/),lines=[''],maxChars=Math.max(6,Math.floor((r.width-12)/(19*.57)));
  for(const word of words){const i=lines.length-1;if(lines[i]&&lines[i].length+word.length>maxChars&&lines.length<3)lines.push(word);else lines[i]+=(lines[i]?' ':'')+word;}
  const names=lines.slice(0,3).map((text,i)=>{text=text.length>maxChars*1.5?text.slice(0,Math.floor(maxChars*1.5)-1)+'…':text;return label(text,p.x,p.y+(i-(lines.length-1)/2)*21,Math.min(19,(r.width-10)/(Math.max(1,text.length)*.6)));}).join('');
  return `<a href="#shop" data-action="center-unit" data-id="${esc(r.id)}" ${pointAttrs(p)} aria-label="Walk to ${esc(st.name)} and enter"><title>${esc(st.name)} · ${st.count?st.count+' products':E.isServiceStore(st)?'Services':st.businessKind==='food'?'Original game dining':'Collection in research'}</title>${shape}<g class="map-shop-labels" aria-hidden="true">${names}</g></a>`;
 }).join('');
 const nodes=annotation.places.filter(m=>m.kind==='zone').map(m=>`<a href="#court" data-action="center-zone" data-floor="${floor}" data-id="${esc(m.id)}" ${pointAttrs(m.p)} aria-label="Walk to ${esc(m.name)}"><circle cx="${m.p.x}" cy="${m.p.y}" r="30" fill="#496e58"/>${placeLabel(m)}</a>`).join('');
 const connectors=layout.escalators.map(e=>`<a href="#connection" data-action="center-stop" data-type="connector" data-floor="${floor}" data-id="${esc(e.id)}" ${pointAttrs(e.landing)} aria-label="Walk to a floor connection"><rect x="${e.landing.x-25}" y="${e.landing.y-25}" width="50" height="50" rx="9" fill="#4e6580"/><text x="${e.landing.x}" y="${e.landing.y+12}" text-anchor="middle" font-size="34" fill="white">↕</text></a>`).join('');
 const stops=annotation.places.filter(m=>m.kind!=='zone').map(m=>{
  const {p,target,name}=m,venue=m.kind==='venue',color=venue?'#356b70':'#865588',letters={rest:'R',services:'G',food:'D',coffee:'C',photo:'P',bridge:'W',popup:'S',flowers:'F',cinema:'M',carousel:'O',art:'A',lounge:'Q'};
  return `<a href="#public-stop" data-action="center-stop" data-type="${m.kind}" data-floor="${floor}" data-id="${esc(m.id)}" ${pointAttrs(p)} aria-label="Walk to ${esc(name)}"><title>${esc(name)} · choose to walk here</title><path d="M${p.x} ${p.y}L${target.x} ${target.y}" stroke="${color}" stroke-width="4"/><circle cx="${p.x}" cy="${p.y}" r="26" fill="${color}" stroke="white" stroke-width="4"/><text x="${p.x}" y="${p.y+10}" text-anchor="middle" font-size="27" fill="white">${venue?letters[m.id]||'·':'✦'}</text><g class="map-shop-labels map-venue-label" aria-hidden="true">${placeLabel(m)}</g></a>`;
 }).join('');
 const side=position?.x>c.width-180?-1:1;
 const marker=position?`<g aria-label="Your position" pointer-events="none"><circle cx="${position.x}" cy="${position.y}" r="31" fill="none" stroke="white" stroke-width="12"/><circle cx="${position.x}" cy="${position.y}" r="31" fill="none" stroke="#9c4629" stroke-width="6"/>${label('YOU',position.x+side*48,position.y+12,32,side<0?'end':'start')}</g>`:'';
 return `<svg class="campus-plan" data-map-zoom="${v.zoom.toFixed(2)}" viewBox="${mapViewBox(v)}" role="group" aria-label="Interactive center map: choose a storefront, court or amenity"><rect width="${c.width}" height="${c.height}" rx="50" fill="#d4dece"/>${paths}${blocks}${nodes}${connectors}${stops}${marker}</svg>`;
}
