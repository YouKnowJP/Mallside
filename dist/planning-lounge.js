import {isBookProduct} from './book-tools.js?v=38.0.0';
import {displayPoint} from './shop-interiors.js?v=39.0.0';
import {surfaceTexture} from './scene-finish.js?v=33.0.0';

// All props are original planning materials, never merchant merchandise or purchasable samples.
export function buildPlanningLounge(w,st,style,layout){
 const group=['apparel','shoes','bags'].includes(st.businessKind)?'textile':['beauty','jewelry','eyewear'].includes(st.businessKind)?'light':'workshop',timber=w.mat(style.fixture,{map:surfaceTexture(w,'timber'),roughness:.8}),paper=w.mat('#f2ead6',{roughness:.95}),colors=[style.accent,'#b9856a','#75928b','#c6ad71'];
 for(const [i,r]of layout.displays.entries()){
  const x=r.x+r.width/2,z=r.y+r.height/2,p=displayPoint(r),key=(i===5?'associate:':i===4?'shopfinder:':i===3?'planner-budget:':i===2?'planner-route:':i===1?'planner-category:':'planner:')+st.id;
  w.box(x,.2,z,r.width-2,.3,r.height-2,'#d8d1b8');w.box(x,28,z,r.width-8,4,r.height-8,timber);for(const dx of [-35,35])w.box(x+dx,13,z,4,26,r.height-15,style.trim);
  if(i===0){w.box(x,47,z-15,69,34,4,style.trim);w.box(x,47,z-12.7,63,28,1,paper);for(const [j,a]of [[-21,4],[-4,-5],[19,6]].entries()){const [dx,dy]=a;w.cyl(x+dx,33,z+dy,3,3,colors[j]);w.box(x+dx,49+j*3,z-11.8,5,5,1,colors[j]);}w.box(x,31,z+9,65,1,19,paper);}
  else if(group==='textile'&&i<4){w.box(x,51,z-14,75,42,4,style.trim);for(let j=0;j<4;j++){const mat=w.mat(colors[(j+i)%4],{bumpMap:surfaceTexture(w,'fabric',true),bumpScale:.03});w.box(x-27+j*18,51,z-11,15,34,1.5,mat);w.cyl(x-27+j*18,70,z-10,1,2,style.trim);}for(let j=0;j<3;j++)w.box(x-25+j*24,32+j*.4,z+8,20,3,20,colors[(j+i)%4]);}
  else if(group==='light'&&i<4){w.box(x,33,z,70,6,35,'#e4d8bd');for(const [j,dx]of [-22,0,22].entries()){w.ball(x+dx,44+j%2*3,z,7,w.mat(colors[(i+j)%4],{roughness:.18,metalness:.2,transparent:true,opacity:.72}));w.cyl(x+dx,37,z,8,2,style.trim);}w.box(x,51,z-18,64,38,3,'#b4c4bd');for(const dx of [-33,33])w.box(x+dx,51,z-17,2,42,3,style.trim);}
  else if(group==='workshop'&&i<4){w.box(x,31,z,74,1,41,paper);for(let j=0;j<5;j++)w.box(x-28+j*14,32,z,1,.2,35,'#a9b9ab');for(let j=0;j<3;j++)w.box(x,32,z-12+j*12,66,.2,1,'#a9b9ab');for(let j=0;j<4;j++)w.box(x-20+j*13,35+j%2*4,z+6,10,6+j%2*8,11,colors[j]);w.box(x,49,z-18,55,33,3,style.trim);w.box(x,49,z-16,49,27,1,paper);}
  else {for(let j=0;j<3;j++){w.box(x-20+j*20,32,z+4,16,3,24,colors[j]);w.box(x-20+j*20,34,z+4,13,.5,21,paper);}w.box(x,47,z-15,62,30,3,style.trim);w.box(x,47,z-13,56,24,1,paper);}
  w.cyl(x+37,36,z-20,4,10,style.trim);w.ball(x+37,46,z-20,7,'#6d8a69');
  const names=['Shopping desk','Compare verified finds','Review your next stops','Budget & shortlist','Find stocked shops','Meet the associate'];
  const surface=w.box(x,37,z,80,22,45,w.mat('#ffffff',{transparent:true,opacity:0,depthWrite:false}));surface.castShadow=false;w.tag(surface,key,p);
  if(i===0||i===5){const label=w.label(names[i]+' ↗',x,83,z,112,style.accent);w.tag(label,key,p);}
  w.interiorStops.push({point:p,id:key,name:names[i],label:i===5?'Advice & original planning activities':i===4?'Verified shops in this center':'Plan verified finds at their actual shops'});
 }
 buildLoungeBench(w,st);
 // Existing partition footprints become a small planning studio with a framed reflective panel.
 const f=layout.fitting,x=f.x+f.width/2;w.box(x,48,f.y+5,86,84,2,style.trim);w.box(x,48,f.y+7,80,78,1,w.mat('#b9cac5',{metalness:.5,roughness:.18}));
 w.canvas.dataset.collectionGuideDisplays=String(layout.displays.length);w.canvas.dataset.planningLounge=group;
}

export function buildLoungeBench(w,st){
 w.bench(600,630);const seat={x:600,y:675},benchKey='lounge-bench:'+st.id,benchHit=w.box(600,18,630,88,32,24,w.mat('#ffffff',{transparent:true,opacity:0,depthWrite:false}));benchHit.castShadow=false;w.tag(benchHit,benchKey,seat);w.interiorStops.push({point:seat,id:benchKey,name:'Lounge bench',label:'Rest 30 min · free · recover stamina'});
}

// An original material/source desk and rest corner accompany newly verified collections.
export function buildCollectionStudio(w,st,style){
 const timber=w.mat(style.fixture,{map:surfaceTexture(w,'timber'),roughness:.8}),paper=w.mat('#f5eddb',{roughness:.95}),items=st.products.filter(p=>/^v(?:37-real|38-book|39-real)-/.test(p.modelId||'')).slice(0,3);
 w.box(600,29,147,120,5,44,timber);for(const x of [550,650])w.box(x,13,147,4,26,34,style.trim);
 for(const [i,p]of items.entries()){const x=563+i*36;if(p.frameProfile){w.box(x,33,150,27,3,22,style.trim);const frame=w.photo(p,x,40,149,23,31);frame.rotation.y=(i-1)*.12;continue;}if(isBookProduct(p)){const book=w.photo(p,x,47,149,23,31);book.rotation.y=(i-1)*.08;continue;}w.box(x,33+i*.4,150,28,3,24,w.mat(p.color,{bumpMap:surfaceTexture(w,'fabric',true),bumpScale:.025}));w.box(x,35+i*.4,153,13,.3,10,paper);}
 w.box(600,60,130,102,47,3,style.trim);w.box(600,60,132,96,41,1,paper);for(const x of [570,600,630])w.box(x,60,133,22,28,.5,style.accent);
 w.cyl(649,42,137,3,25,style.trim);w.cyl(649,57,137,10,9,'#dfcfaa');
 const key='collection:'+st.id,point={x:600,y:210},hit=w.box(600,51,147,120,55,45,w.mat('#ffffff',{transparent:true,opacity:0,depthWrite:false}));hit.castShadow=false;w.tag(hit,key,point);const label=w.label('Collection desk ↗',600,98,140,140,style.accent);w.tag(label,key,point);w.interiorStops.push({point,id:key,name:'Collection desk',label:st.collectionEdition===38?'Compare physical editions, ISBNs & prices':st.products.some(p=>p.frameProfile)?'Compare frame colors, widths & source prices':'Compare source colors, fabrics, sizes & prices'});
 buildLoungeBench(w,st);if(st.collectionEdition===38){for(let i=0;i<3;i++)w.box(630,17+i*2,630,17,1.5,11,['#547d75','#c39a66','#8e7086'][i]);w.box(626,23,631,9,.2,6,'#f2ead8');w.canvas.dataset.bookshopStudio='38';}if(st.collectionEdition===39)w.canvas.dataset.verifiedStudio=st.businessKind==='eyewear'?'frames':'apparel';w.canvas.dataset.collectionStudio=String(items.length);
}
