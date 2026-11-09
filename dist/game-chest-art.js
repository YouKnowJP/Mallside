// Original tabletop art shared by the library and its playable scenarios.
const terrain = {
 hills:['#b76d55','#efb17e','<path d="M-44 4Q-30-24-11-7Q6-31 40 0M-39 7Q-28-7-15-3M4-2Q18-13 32 5" fill="none" stroke="#643943" stroke-width="3"/><path d="M-40 16h24v-8h-24zm52-1h24V6H12z" fill="#f1ad81" opacity=".65"/>'],
 forest:['#397d67','#8caa72','<g fill="#1d504b"><path d="M-37 8l11-21 11 21zm18-5L-6-23 7 3zm25 3 12-22L30 6zm18 5 10-17 9 17z"/></g><path d="M-40 13q23-7 33 0t48 1" fill="none" stroke="#c9cf85" stroke-width="1.6"/>'],
 fields:['#bd8c43','#f1cd75','<path d="M-47 10Q-15-15 41-4M-42 18Q-4-4 47 4M-35 24Q-11 8 40 12" fill="none" stroke="#8d6238" stroke-width="2.5"/><path d="M-29-4v-12m0 5-4-3m4 6 5-4m40 1v-13m0 5-5-4m5 8 5-4" stroke="#fff0a4" stroke-width="1.8"/>'],
 pasture:['#719965','#b9cc86','<path d="M-45 13Q-11-12 23 5T47 10M-40 19q18-12 31-7" fill="none" stroke="#4f734f" stroke-width="2.5"/><g fill="#f9e5ac"><ellipse cx="-20" cy="0" rx="8" ry="4"/><ellipse cx="14" cy="-6" rx="8" ry="4"/><ellipse cx="28" cy="5" rx="7" ry="4"/></g><g fill="#4b5e47"><circle cx="-13" cy="-1" r="2"/><circle cx="21" cy="-7" r="2"/><circle cx="34" cy="4" r="2"/></g>'],
 mountains:['#6d7f8b','#b2b8a7','<path d="M-42 14-17-23 2 9 16-15 41 13z" fill="#4c5b6a"/><path d="M-27-8-17-23-8-8l-9-3zm37 2 6-9 9 10-8-2z" fill="#f0e5c3"/><path d="M-32 16h64" stroke="#a7acac" stroke-width="1.5"/>'],
 desert:['#bc9862','#efcf91','<path d="M-45 7q27-25 52-4t39-8M-40 17q22-19 45-6t35-2" fill="none" stroke="#f4dc9c" stroke-width="2.5"/>']
};
export const hexCorners=[[-60,0],[-30,-52],[30,-52],[60,0],[30,52],[-30,52]];
const hex=hexCorners.map(corner=>corner.join(',')).join(' ');
const islandTiles=[
 [126,126,'hills',5], [216,74,'forest',8], [306,126,'fields',6],
 [396,74,'pasture',10], [486,126,'mountains',9], [216,178,'pasture',11], [396,178,'fields',11]
];

export function terrainArt({active,route=[],pieces=[],harbor=false,board=islandTiles,roads=[],robber=-1,width=612,height=244}={}){
 const coastline='<path d="M0 45Q89 16 132 51T244 40T369 26T512 50T614 31M0 218Q73 190 147 220T281 208T411 215T546 207T612 200" fill="none" stroke="#9dc1aa" stroke-opacity=".36" stroke-width="2"/>';
 const tiles=board.map(([x,y,kind,n],index)=>{
  const [color,edge,marks]=terrain[kind],selected=n!==null&&n===active;
  return `<g transform="translate(${x} ${y})"><polygon points="${hex}" transform="translate(0 4)" fill="#143d43"/>
  <polygon points="${hex}" fill="${color}" stroke="${selected?'#fff0a4':edge}" stroke-width="${selected?4:2.5}" stroke-linejoin="round"/>
  <path d="M-46-6l21-36h50l21 36M-45 9l21 33h48l21-33" fill="none" stroke="${edge}" opacity=".48"/>
  ${marks}${n===null?'':`<circle cy="23" r="12" fill="${selected?'#ffda7d':'#f4e1ae'}" stroke="#493d36" stroke-width="1.5"/>
  <text y="28" text-anchor="middle" fill="#342c29" font-size="14" font-weight="800">${n}</text>`}
  ${index===robber?'<path d="M-9 11v-5l5-11a7 7 0 1 1 8 0l5 11v5z" fill="#3a3040" stroke="#f5dcad" stroke-width="2.5"/>':''}</g>`;
 }).join('');
 return `<svg class="chest-terrain" viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false">
  <rect width="${width}" height="${height}" fill="#24565b"/>${coastline}
  <path d="M27 189h33m-22 9h35m482-146h31m-43 9h24M53 64h33m-19 8h32m442 108h36" stroke="#b2d2b9" opacity=".48" stroke-width="2" stroke-linecap="round"/>
  <circle cx="554" cy="52" r="16" fill="#24565b" stroke="#aac5a9" opacity=".75"/><path d="m554 39 4 13-4 12-4-12z" fill="#e7cb88"/>
  ${tiles}
  ${harbor?'<g transform="translate('+(Array.isArray(harbor)?harbor.join(' '):'71 185')+')"><path d="m-19 6 9 8h20l9-8zM0 4v-25l12 22H0" fill="#ead9ae" stroke="#233d3f" stroke-width="2"/><text y="32" text-anchor="middle" fill="#fbecc4" font-size="13" font-weight="700">2:1</text></g>':''}
  ${route.length?'<polyline points="'+route.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="#3d2a24" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><polyline points="'+route.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="#ffbc6b" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>':''}
  ${roads.map(([a,b,color,fresh])=>`<g class="${fresh?'match-road-new':''}"><path d="M${a.join(' ')}L${b.join(' ')}" stroke="#303037" stroke-width="11" stroke-linecap="round"/><path d="M${a.join(' ')}L${b.join(' ')}" stroke="${color}" stroke-width="6" stroke-linecap="round"/></g>`).join('')}
  ${pieces.map(([x,y,piece,color='#ffc879',fresh])=>`<g transform="translate(${x} ${y})"><g class="${fresh?'match-piece-new':''}">${piece==='site'
   ?'<circle r="7" fill="#fff0bf" stroke="#3c3b35" stroke-width="2"/>'
   :piece==='city'
    ?`<path d="M-14 8v-13l7-7 7 7 7-12 7 8V8z" fill="${color}" stroke="#483227" stroke-width="2"/><path d="M-5 8V2h4v6M6 8V0h4v8" fill="#47383b"/>`
    :`<path d="m-10-2 10-10 10 10V9h-20z" fill="${color}" stroke="#483227" stroke-width="2"/><path d="M-2 9V2h5v7" fill="#47383b"/>`}</g></g>`).join('')}
 </svg>`;
}

const cardArt={
 scout:['#243e5c','#dfb879','<path d="m0 87 26-29 19 17 18-24 21 27v30H0z" fill="#172c4b"/><path d="m18 83 14-23 8 15 13-12 15 23z" fill="#4c6f7c"/><path d="M42 40l5 10-5 10-5-10z" fill="#ffdaa1"/>'],
 guide:['#355b60','#f1d791','<path d="M8 94q12-29 34-41 22 12 34 41z" fill="#25454a"/><path d="M20 82q22-18 44 0M32 95V69h20v26" fill="none" stroke="#a9bc82" stroke-width="2"/><path d="M38 74h8v12h-8z" fill="#ffdfa6"/>'],
 rival:['#523952','#f0a793','<path d="m0 98 23-38 18 22 18-26 25 40v12H0z" fill="#30283f"/><path d="M26 70h32l-5 20H31z" fill="#9d5a70"/><path d="m30 69 5-8 7 7 7-7 5 8" fill="none" stroke="#ffd4a3" stroke-width="2"/>'],
 ink:['#3d386a','#c1b9e4','<path d="M42 54c2 9 13 17 13 25a13 13 0 1 1-26 0c0-8 11-16 13-25z" fill="#8a82b5" stroke="#e1d4f2" stroke-width="1.5"/>'],
 courier:['#57374b','#f4c582','<path d="M5 91q30-29 74-14M2 102q33-31 72-15" fill="none" stroke="#be8292" stroke-width="3"/><path d="m24 69 36-11-10 31-8-12z" fill="#f7d38f" stroke="#6b4b66" stroke-width="2"/>']
};
export function illustratedCard(kind){
 const [color,light,scene]=cardArt[kind];
 return `<svg viewBox="0 0 84 108" aria-hidden="true" focusable="false">
  <rect width="84" height="108" fill="${color}"/>
  <circle cx="42" cy="46" r="22" fill="${light}" opacity=".24"/><circle cx="42" cy="46" r="16" fill="${light}" opacity=".8"/>
  <path d="M14 26h5m-2.5-2.5v5m45 8h5m-2.5-2.5v5m-9-15h5m-2.5-2.5v5m-36 28h5" stroke="${light}" stroke-width="1.3"/>
  ${scene}<rect x="5" y="5" width="74" height="98" rx="6" fill="none" stroke="${light}" opacity=".78"/>
  <path d="m42 11 5 6-5 6-5-6zM10 92v5h5m59-5v5h-5" fill="none" stroke="${light}"/>
 </svg>`;
}

export function chestCard(kind,title,stats,status,style=''){
 return `<div class="chest-card-slot"><span class="chest-card ${style}" aria-hidden="true">${style==='empty'?'':illustratedCard(kind)}</span><strong>${title}</strong><small>${stats}</small><small class="chest-card-status">${status}</small></div>`;
}

export function chestCover(id){
 return `<div class="chest-cover ${id}" aria-hidden="true">${id==='catan'?terrainArt({route:[[186,126],[246,126],[276,74]],pieces:[[186,126,'home'],[276,74,'site']]})
  :`<span>${illustratedCard('guide')}</span><span>${illustratedCard('courier')}</span><span>${illustratedCard('scout')}</span>`}</div>`;
}

export function resourceTray(counts){
 return `<div class="chest-pieces">${Object.entries(counts).map(([label,count])=>`<span data-resource="${label.toLowerCase().split(' ')[0]}">${label} <strong>${count}</strong></span>`).join('')}</div>`;
}

export function loreTrack(lore,opponent){
 const show=(label,value)=>`<span>${label} <strong>${value}</strong><small>/ 20</small><i style="--lore:${value*5}%" aria-hidden="true"></i></span>`;
 return `<div class="chest-lore">${show(opponent===undefined?'Lore':'Your lore',lore)}${opponent===undefined?'':show('Opposing lore',opponent)}</div>`;
}
