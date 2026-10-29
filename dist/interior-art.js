import {closestFloor} from './free-navigation.js?v=25.0.0';
import {themeFor} from './mall-design.js?v=35.0.0';
import {surfaceTexture} from './scene-finish.js?v=33.0.0';
import * as T from './vendor/three.module.js';

export function interiorFloor(world,style){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const c=canvas.getContext('2d');
 c.fillStyle=style.key==='prada'?'#f3f1e7':style.floor;c.fillRect(0,0,512,512);c.lineWidth=2;
 if(['wood','parquet'].includes(style.pattern)){
  for(let row=0;row<8;row++){const y=row*64,offset=row%2?128:0;for(let x=-256+offset;x<512;x+=256){c.fillStyle=row%2?style.floor:style.fixture;c.globalAlpha=.16;c.fillRect(x,y,254,62);c.globalAlpha=1;c.strokeStyle='#594f3c35';c.strokeRect(x,y,256,64);for(let n=0;n<3;n++){c.strokeStyle='#fff8e414';c.beginPath();c.moveTo(x+8,y+12+n*17);c.lineTo(x+240,y+10+n*17);c.stroke();}}}
 }else if(['checker','gingham'].includes(style.pattern)){
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){c.fillStyle=style.pattern==='checker'?'#202820':style.accent;c.globalAlpha=style.pattern==='checker'?1:(x%2&&y%2?.28:(x+y)%2?.12:0);if((x+y)%2||style.pattern==='gingham')c.fillRect(x*64,y*64,64,64);}c.globalAlpha=1;
 }else if(style.pattern==='terrazzo'||style.pattern==='concrete'){
  let seed=19;for(let i=0;i<250;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%512;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const y=seed%512;c.fillStyle=i%2?'#fffbed35':'#535f5320';c.fillRect(x,y,2+i%4,2+i%3);}
 }else if(style.pattern==='track'){
  c.strokeStyle='#f3ecda';c.lineWidth=8;for(const x of [80,256,432]){c.beginPath();c.moveTo(x,0);c.lineTo(x,512);c.stroke();}
 }else{
  c.strokeStyle='#65736222';for(let x=0;x<=512;x+=128){c.beginPath();c.moveTo(x,0);c.lineTo(x,512);c.stroke();c.beginPath();c.moveTo(0,x);c.lineTo(512,x);c.stroke();}
 }
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(3.2,2.7);world.resources.add(texture);
 world.box(600,-3,450,840,6,690,world.mat('#ffffff',{map:texture,roughness:['wood','parquet'].includes(style.pattern)?.57:style.pattern==='concrete'?.8:.42,bumpMap:surfaceTexture(world,'stone',true),bumpScale:.06,envMapIntensity:.8}));
}

export function buildInteriorArchitecture(w,style,layout){
 // A visible mall-side threshold grounds the cutaway shop in its surrounding concourse.
 const theme=themeFor(w.state?.mallId),apron=w.box(600,-4,850,1600,6,1200,w.mat(theme.floor,{roughness:.64,bumpMap:surfaceTexture(w,'stone',true),bumpScale:.045}));apron.castShadow=false;
 interiorFloor(w,style);
 for(const x of [360,840]){const pane=w.box(x,20,793,275,40,2,w.mat('#a9c5bf',{transparent:true,opacity:.15,roughness:.2,metalness:.1,envMapIntensity:1.25,depthWrite:false}));pane.castShadow=false;w.box(x,2,794,280,3,4,style.trim);for(const dx of [-138,138])w.box(x+dx,23,794,3,46,4,style.trim);}
 w.box(600,.1,783,90,.3,18,style.trim);

 w.box(600,52,112,840,104,7,style.wall);for(const x of [192,1008]){w.box(x,19,450,5,38,680,style.wall);w.box(x,64,265,5,128,310,style.wall);w.box(x,39,450,7,3,680,style.trim);}
 w.box(600,8,119,826,8,4,style.trim);w.box(600,100,117,830,4,4,style.trim);
 // Low display-wall details preserve the view into the game room.
 const feature=style.feature,backCenter=layout.rail.x<500?640:530,cols=[backCenter-95,backCenter,backCenter+95];
 if(/stripes/.test(feature))for(let i=0;i<16;i++)w.box(208+i*51,47,118,26,82,3,i%2?'#f5f4ed':'#151a17');
 if(/wood|leather|denim|woven|cane|timber/.test(feature))for(let i=0;i<26;i++)w.box(210+i*31,47,120,3,80,4,style.trim);
 if(/niches|silk|velvet|green|blue|stone|toy/.test(feature)){
  for(const x of cols){w.box(x,45,121,82,64,5,style.accent);for(const dx of [-42,42])w.box(x+dx,45,127,3,66,8,style.trim);w.box(x,79,127,88,3,8,style.trim);w.box(x,14,135,88,5,24,style.fixture);}
 }
 if(/shoe|sneaker|travel|shelf|fold|book|rack/.test(feature)){
  for(const x of cols){for(const y of [26,52,78])w.box(x,y,134,85,3,28,style.fixture);for(const dx of [-43,43])w.box(x+dx,46,128,3,74,22,style.trim);}
 }
 if(feature==='screen'){w.box(backCenter,55,121,250,70,4,'#3c4a44');w.label('Explore. Create. Discover.',backCenter,56,126,210,'#eaf1e5','#3c4a44');}
 if(feature==='sink'){w.box(backCenter,19,135,250,38,48,style.fixture);for(const x of [backCenter-55,backCenter+55]){w.cyl(x,40,135,25,3,'#ded5be');w.cyl(x,44,130,3,12,style.trim);}}
 if(feature==='trunks'){for(const [x,y,size]of [[cols[0],20,70],[cols[1],15,55],[cols[2],22,78]]){w.box(x,y,135,size,y*2,40,style.fixture);for(const dx of [-size/3,size/3])w.box(x+dx,y,157,3,y*2,1,style.trim);}}
 if(feature==='stud-wall'){for(let x=430;x<=800;x+=45)for(let y=25;y<=75;y+=25){const stud=w.cyl(x,y,121,9,3,[style.accent,style.fixture,style.trim][Math.round(x/45)%3]);stud.rotation.x=Math.PI/2;}}
 if(/arches/.test(feature)){for(const x of cols){for(const dx of [-40,40])w.box(x+dx,35,125,9,65,9,style.trim);const curve=w.mesh(new T.TorusGeometry(40,4,5,24,Math.PI),w.mat(style.trim));curve.position.set(x,65,126);}}
 if(/menu|coffee|bakery|citrus|steel-counter/.test(feature)){
  w.box(backCenter,23,135,270,46,42,style.fixture);for(const x of cols){w.box(x,70,120,80,39,3,'#34453b');w.label(x===backCenter?'THE MENU':'MADE TO ORDER',x,70,124,75,'#f4ebd8','#34453b');}
 }
 if(feature==='light-mirrors'){for(const x of cols){w.box(x,48,122,78,65,3,style.trim);w.box(x,48,126,68,55,2,'#afc5bd');for(const dx of [-45,45])w.box(x+dx,48,127,3,64,2,'#f5edd6');}}
 if(feature==='room-scenes'){for(const x of [backCenter-45]){w.box(x,22,145,140,35,45,style.fixture);w.box(x,44,130,140,24,12,style.accent);w.box(x+94,25,140,40,50,40,style.trim);}}
 if(feature==='red-circle'){const disc=w.cyl(600,55,121,34,4,style.accent);disc.rotation.x=Math.PI/2;const inner=w.cyl(600,55,124,20,4,style.wall);inner.rotation.x=Math.PI/2;}
 if(feature==='three-stripes')for(let i=0;i<3;i++){const stripe=w.box(600+i*28,52,121,14,75,3,style.accent);stripe.rotation.z=-.25;}

 // Original accent rug is flat scenery and never blocks the walking route.
 if(['salon','jewelry','home','coastal'].includes(style.layout))w.box(600,.35,400,350,.3,250,style.accent).material.transparent=true;
}

export function buildProductFixture(w,p,r,profile){
 const x=r.x+r.width/2,z=r.y+r.height/2,kind=['shirt','hoodie','cardigan','jacket','pants','shorts'].includes(p.type)?'apparel':['shoes','sandals'].includes(p.type)?'shoes':['bag','crossbody','backpack','duffel','wallet'].includes(p.type)?'boutique':['perfume','skincare','lipstick','makeup','mascara'].includes(p.type)?'beauty':['watch','digitalwatch','ring','bracelet','necklace','earrings'].includes(p.type)?'jewelry':['food','drink'].includes(p.type)?'cafe':profile.kind,wood=profile.fixture,trim=profile.trim;let height=28;
 if(kind==='tech'){w.box(x,22,z,r.width,7,r.height,wood);for(const dx of [-38,38])w.box(x+dx,11,z,4,22,48,trim);height=27;}
 else if(kind==='jewelry'){w.box(x,17,z,r.width,34,r.height,wood);w.box(x,39,z,r.width,14,r.height,w.mat('#cde4de',{transparent:true,opacity:.25,depthWrite:false}));w.box(x,36,z,55,3,35,profile.accent);height=46;}
 else if(kind==='cafe'){w.cyl(x,25,z,45,6,wood);for(const dx of [-33,33])w.box(x+dx,12,z,4,24,40,trim);height=31;}
 else if(kind==='toys'){w.box(x,19,z,r.width,38,r.height,wood);w.box(x,40,z,r.width+2,4,r.height+2,profile.accent);if(profile.feature==='stud-wall')for(const dx of [-28,0,28])for(const dz of [-18,18])w.cyl(x+dx,44,z+dz,7,4,profile.trim);height=47;}
 else if(kind==='apparel'||kind==='department'){
  w.box(x,3,z,r.width,5,r.height,wood);for(const dx of [-43,43])w.box(x+dx,38,z,3,70,5,trim);w.box(x,73,z,90,3,4,trim);height=28;
 }else if(profile.layout==='library'){for(let i=0;i<3;i++)w.box(x,7+i*6,z,85-i*5,6,48,[wood,profile.accent,trim][i]);height=23;}
 else if(kind==='beauty'){w.box(x,16,z,r.width,32,r.height,wood);w.box(x,34,z,r.width+2,4,r.height+2,trim);height=38;}
 else if(profile.layout==='atelier'||kind==='boutique'){w.box(x,17,z,r.width-8,34,r.height-6,wood);w.box(x,36,z,r.width,4,r.height,trim);height=40;}
 else{w.box(x,15,z,r.width,30,r.height,wood);for(const dx of [-38,38])w.box(x+dx,10,z,4,20,45,trim);height=32;}
 return height;
}

// Research-only shops have a useful original information gallery, never invented stock.
export function buildCollectionGallery(w,store,style,layout){
 const names=['Collection status','Find stocked shops','Save this shop','Collection notes','Plan your next stop','Meet the associate'];
 for(const [i,r]of layout.displays.entries()){const x=r.x+r.width/2,z=r.y+r.height/2,point=closestFloor({x,y:r.y+r.height+25},layout.nav);w.box(x,15,z,r.width-8,30,r.height-8,style.fixture);w.box(x,31,z,r.width-4,2,r.height-4,style.trim);
  const board=w.box(x,51,z-10,52,34,3,['#d6e2d6','#e6d2bc','#d9d3e3'][i%3]);for(const dx of [-23,23])w.box(x+dx,42,z-11,2,24,2,style.trim);w.box(x,49,z-7.9,32,2,1,style.accent);for(let line=0;line<3;line++)w.box(x,44-line*4,z-7.9,32-line*5,1,1,style.trim);
  for(let book=0;book<3;book++){w.box(x-16+book*13,34+book*.6,z+12,11,3,16,[style.accent,style.trim,style.wall][book]);w.box(x-16+book*13,34.3+book*.6,z+12.5,10,1,14,'#e8dfc7');}
  if(i%2===0){w.cyl(x+30,38,z+7,5,10,style.trim);w.ball(x+30,49,z+7,7,'#668b69');w.ball(x+27,54,z+7,5,'#83a279');}
  const key=i%3===1?'shopfinder:'+store.id:i===5?'associate:'+store.id:'rack:'+store.id,label=w.label(names[i%names.length],x,77,z,96);w.tag(board,key,point);w.tag(label,key,point);w.interiorStops.push({point,id:key,name:names[i%names.length],label:'Explore this collection guide'});
 }w.canvas.dataset.collectionGuideDisplays=String(layout.displays.length);
}
