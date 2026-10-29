import {beveledBox,surfaceTexture,palmFrondGeometry} from './scene-finish.js?v=33.0.0';
import {surfaceFinish} from './mall-atmosphere.js?v=33.0.0';
import {retailIdentity,drawRetailSign} from './retail-identity.js?v=23.0.0';
import * as T from './vendor/three.module.js';
import {themeFor,facadeFrame} from './mall-design.js?v=35.0.0';
import {brandDesign} from './brand-designs.js?v=23.0.0';

// Shared instances keep the extra architectural detail affordable on tablets and phones.
class Details{
 constructor(w){this.w=w;this.parts={box:[],timber:[],metal:[],roof:[],light:[],glass:[],cylinder:[],foliage:[],frond:[],round:[],water:[],ripple:[]};this.owner=null;}
 box(x,y,z,width,height,depth,color,rotation=0,finish='box'){this.parts[finish].push({x,y,z,sx:width,sy:height,sz:depth,color,rotation,owner:this.owner});}
 glass(x,y,z,width,height,depth,color,rotation=0){this.parts.glass.push({x,y,z,sx:width,sy:height,sz:depth,color,rotation,owner:this.owner});}
 roof(x,y,z,width,height,depth,color,rotation=0){this.parts.roof.push({x,y,z,sx:width,sy:height,sz:depth,color,rotation,owner:this.owner});}
 light(x,y,z,width,height,depth,color,rotation=0){this.parts.light.push({x,y,z,sx:width,sy:height,sz:depth,color,rotation,owner:this.owner});}
 cylinder(x,y,z,radius,height,color){this.parts[radius>=10?'round':'cylinder'].push({x,y,z,sx:radius,sy:height,sz:radius,color,rotation:0,owner:this.owner});}
 leaf(x,y,z,radius,color,sx=1,sy=1,sz=1,rotation=0){this.parts.foliage.push({x,y,z,sx:radius*sx,sy:radius*sy,sz:radius*sz,color,rotation,owner:this.owner});}
 water(x,y,z,radius){this.parts.water.push({x,y,z,sx:radius,sy:1,sz:radius,color:'#83aaa2',rotation:0,owner:null});for(const r of [.28,.56,.82])this.parts.ripple.push({x,y:y+.55,z,sx:radius*r,sy:1,sz:radius*r,color:'#dcece2',rotation:0,owner:null});}
 frond(x,y,z,length,width,color,rotation){this.parts.frond.push({x,y,z,sx:length,sy:length,sz:width,color,rotation,owner:this.owner});}
 flush(){let count=0;const w=this.w,dummy=new T.Object3D();for(const [kind,parts]of Object.entries(this.parts)){if(!parts.length)continue;const geometry=['box','timber','metal','roof','light','glass'].includes(kind)?beveledBox():kind==='frond'?palmFrondGeometry():kind==='cylinder'?new T.CylinderGeometry(1,1,1,12):kind==='round'||kind==='water'?new T.CylinderGeometry(1,1,1,kind==='water'?48:24):kind==='ripple'?new T.RingGeometry(.97,1,48).rotateX(-Math.PI/2):new T.SphereGeometry(1,12,8),material=w.mat('#ffffff',{...surfaceFinish(kind),...['box','timber','metal'].includes(kind)?{map:surfaceTexture(w,kind==='timber'?'timber':'stone'),bumpMap:surfaceTexture(w,kind==='timber'?'timber':'stone',true),bumpScale:.035}:kind==='frond'?{side:T.DoubleSide,roughness:.9}:kind==='glass'?{transparent:true,opacity:.22,depthWrite:false,envMapIntensity:1.45}:kind==='water'?{roughness:.14,metalness:.22,envMapIntensity:1.5,transparent:true,opacity:.86,depthWrite:false}:kind==='ripple'?{transparent:true,opacity:.38,depthWrite:false,roughness:.3}:kind==='roof'?{map:roofTexture(w),bumpMap:roofRelief(w),bumpScale:.38}:kind==='light'?{emissive:'#b59046',emissiveIntensity:.6}:{}}),mesh=new T.InstancedMesh(geometry,material,parts.length);if(kind==='light')w.windowMaterials?.add(material);w.resources.add(geometry);mesh.castShadow=!['glass','water','ripple'].includes(kind);mesh.receiveShadow=true;for(let i=0;i<parts.length;i++){const p=parts[i];dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(0,p.rotation,0);dummy.scale.set(p.sx,p.sy,p.sz);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,new T.Color(p.color));}mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();if(parts[0].owner){mesh.userData.instanceUnits=parts.map(p=>p.owner);if(!parts[0].owner.structure)w.clickables.push(mesh);parts.forEach((p,index)=>{let entry=w.cutawayAssets.get(p.owner.id);if(!entry){entry={unit:p.owner,parts:[],objects:[],cut:false};w.cutawayAssets.set(p.owner.id,entry);}entry.parts.push({mesh,index,p});});}w.scene.add(mesh);count+=parts.length;}return count;}
}
function facadeLabel(w,text,x,y,z,width,color,bg,rotation=0,height=18){const sprite=w.label(text,x,y,z,width,color,bg),material=new T.MeshBasicMaterial({map:sprite.material.map});w.resources.add(material);const sign=w.mesh(new T.PlaneGeometry(width,height),material);sign.position.copy(sprite.position);sign.rotation.y=rotation;sign.castShadow=false;sprite.removeFromParent();return sign;}
export function brandSign(w,store,x,y,z,width,height=22,rotation=0){const identity=retailIdentity(store),c=document.createElement('canvas');c.width=1024;c.height=224;drawRetailSign(c.getContext('2d'),identity,c.width,c.height);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;w.resources.add(texture);const material=new T.MeshBasicMaterial({map:texture});w.resources.add(material);const sign=w.mesh(new T.PlaneGeometry(width,height),material);sign.position.set(x,y,z);sign.rotation.y=rotation;sign.castShadow=false;sign.userData.brandIdentity=identity.key;return sign;}
function roofTexture(w){if(w.mallRoofTexture)return w.mallRoofTexture;const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle='#b8aaa0';g.fillRect(0,0,256,256);for(let row=0;row<8;row++)for(let col=0;col<16;col++){const x=col*16,y=row*32,shade=g.createLinearGradient(x,0,x+16,0);shade.addColorStop(0,'#91867b');shade.addColorStop(.28,'#d9c9b8');shade.addColorStop(.58,'#f6e4cc');shade.addColorStop(1,'#b4a08b');g.fillStyle=shade;g.fillRect(x,y+1,16,31);g.fillStyle='#69554955';g.fillRect(x,y+29,16,2);g.fillStyle='#fff7dc33';g.fillRect(x+3,y+2,8,1);}const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;w.resources.add(t);w.mallRoofTexture=t;return t;}
function roofRelief(w){if(!w.mallRoofRelief){const t=roofTexture(w).clone();t.colorSpace=T.NoColorSpace;t.needsUpdate=true;w.resources.add(t);w.mallRoofRelief=t;}return w.mallRoofRelief;}

function path(c,s){if(s.kind==='court'){c.moveTo(s.x+s.radius,s.y);c.arc(s.x,s.y,s.radius,0,Math.PI*2);return;}const dx=s.b.x-s.a.x,dy=s.b.y-s.a.y,angle=Math.atan2(dy,dx),r=s.width/2;c.moveTo(s.a.x+Math.cos(angle-Math.PI/2)*r,s.a.y+Math.sin(angle-Math.PI/2)*r);c.lineTo(s.b.x+Math.cos(angle-Math.PI/2)*r,s.b.y+Math.sin(angle-Math.PI/2)*r);c.arc(s.b.x,s.b.y,r,angle-Math.PI/2,angle+Math.PI/2);c.lineTo(s.a.x+Math.cos(angle+Math.PI/2)*r,s.a.y+Math.sin(angle+Math.PI/2)*r);c.arc(s.a.x,s.a.y,r,angle+Math.PI/2,angle+Math.PI*1.5);c.closePath();}
function stroke(c,a,b,width,color){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();}
function medallion(c,n,theme,index){
 const radius=n.radius-13;c.fillStyle=theme.inlay;c.beginPath();c.arc(n.x,n.y,radius,0,7);c.fill();c.fillStyle=theme.floor;c.beginPath();c.arc(n.x,n.y,radius-5,0,7);c.fill();c.strokeStyle=theme.inlay;c.lineWidth=2;c.beginPath();c.arc(n.x,n.y,53,0,7);c.stroke();
 for(let i=0;i<8;i++){const a=i*Math.PI/4+(index%2?Math.PI/8:0);c.fillStyle=i%2?theme.stone:theme.inlay;c.beginPath();c.moveTo(n.x,n.y);c.lineTo(n.x+Math.cos(a-.12)*23,n.y+Math.sin(a-.12)*23);c.lineTo(n.x+Math.cos(a)*47,n.y+Math.sin(a)*47);c.lineTo(n.x+Math.cos(a+.12)*23,n.y+Math.sin(a+.12)*23);c.closePath();c.fill();}
 c.fillStyle=theme.floor;c.beginPath();c.arc(n.x,n.y,11,0,7);c.fill();
}
export function createMallGroundCanvas(l,createCanvas=()=>document.createElement('canvas')){
 const c=l.campus,theme=themeFor(l.family),canvas=createCanvas();canvas.width=2048;canvas.height=Math.round(2048*c.height/c.width);const g=canvas.getContext('2d'),scale=canvas.width/c.width;g.scale(scale,scale);g.fillStyle=c.outdoor?'#abbba2':'#aab8ad';g.fillRect(0,0,c.width,c.height);
 // Continuous building podiums bind the shop rows into complete wings.
 for(const h of c.halls){const a=c.nodes[Number(h.a)],b=c.nodes[Number(h.b)];stroke(g,a,b,h.width+322,c.outdoor?'#cfccb6':'#d7d6cb');}
 for(const n of c.courts){g.fillStyle=c.outdoor?'#c6c9b1':'#d7d6cb';g.beginPath();g.arc(n.x,n.y,n.radius+102,0,7);g.fill();}
 g.save();g.beginPath();for(const s of l.nav.surfaces)path(g,s);g.clip();g.fillStyle=theme.floor;g.fillRect(0,0,c.width,c.height);
 const size=c.outdoor?48:72;g.lineWidth=.75;for(let y=0;y<c.height;y+=size)for(let x=0;x<c.width;x+=size){g.fillStyle=(Math.floor(x/size)+Math.floor(y/size))%5===0?'#ffffff12':'#665a4310';g.fillRect(x,y,size,size);g.strokeStyle='#7a735326';g.strokeRect(x,y,size,size);if(!c.outdoor){g.strokeStyle='#ffffff27';g.beginPath();g.moveTo(x+9,y+18);g.lineTo(x+size-9,y+size-22);g.stroke();}}
 for(const h of c.halls){const a=c.nodes[Number(h.a)],b=c.nodes[Number(h.b)],dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy),nx=-dy/length,ny=dx/length;for(const sign of [-1,1]){const d=h.width/2-13,aa={x:a.x+nx*d*sign,y:a.y+ny*d*sign},bb={x:b.x+nx*d*sign,y:b.y+ny*d*sign};stroke(g,aa,bb,6,theme.inlay);stroke(g,aa,bb,2,'#f5eddc');}}
 c.courts.forEach((n,i)=>medallion(g,n,theme,i));g.restore();
 // Small planted borders replace the former featureless ground beyond the shopping wings.
 for(const p of l.environment.edgePlanting){g.fillStyle='#536d5129';g.beginPath();g.ellipse(p.x+34,p.y+38,37,23,0,0,7);g.fill();}
 return canvas;
}
// A deterministic, small texture adds stone grain without external assets or extra draw calls.
export function stoneDetailTexture(width=1200,height=900){
 const size=64,data=new Uint8Array(size*size*4);let seed=2701;
 for(let i=0;i<size*size;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const value=220+(seed>>>24)%31;data.set([value,value,value,255],i*4);}
 const texture=new T.DataTexture(data,size,size,T.RGBAFormat);texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(Math.max(1,width/80),Math.max(1,height/80));texture.magFilter=T.LinearFilter;texture.minFilter=T.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true;return texture;
}
export function buildMallGround(w,l){
 const c=l.campus,theme=themeFor(l.family),canvas=createMallGroundCanvas(l);
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;w.resources.add(texture);const grain=stoneDetailTexture(c.width,c.height);w.resources.add(grain);const material=w.mat('#ffffff',{map:texture,roughness:c.outdoor?.75:.4,envMapIntensity:c.outdoor?.45:.85,roughnessMap:grain,bumpMap:grain,bumpScale:c.outdoor?.22:.1}),floor=w.mesh(new T.PlaneGeometry(c.width,c.height),material);floor.rotation.x=-Math.PI/2;floor.position.set(c.width/2,-.5,c.height/2);floor.castShadow=false;
 // The playable footprint has thickness, rather than floating as a white ribbon.
 if(c.outdoor&&(w.state.floor||0)===0){const ground=w.mesh(new T.PlaneGeometry(c.width+600,c.height+600),w.mat('#9aab88',{roughness:1,map:surfaceTexture(w,'stone')}));ground.rotation.x=-Math.PI/2;ground.position.set(c.width/2,-9.3,c.height/2);ground.castShadow=false;ground.userData.role='landscape-ground';}
 const base=new Details(w);for(const h of c.halls){const a=c.nodes[Number(h.a)],b=c.nodes[Number(h.b)],length=Math.hypot(b.x-a.x,b.y-a.y),angle=Math.atan2(b.x-a.x,b.y-a.y);base.box((a.x+b.x)/2,-5,(a.y+b.y)/2,h.width+310,8,length,theme.stone,angle);}base.flush();
 w.scene.background=new T.Color(theme.sky);w.sceneFog=new T.Fog(theme.sky,1350,4200);w.scene.fog=w.sceneFog;
 return theme;
}
function plant(b,x,z,theme,palm=false,small=false){
 b.cylinder(x,6,z,small?12:23,12,theme.stone);b.cylinder(x,12.5,z,small?10:20,2,'#5a5844');
 if(small){b.leaf(x,23,z,14,theme.plant,1,.65,1);for(let i=0;i<4;i++)b.leaf(x+Math.cos(i*1.6)*8,30,z+Math.sin(i*1.6)*8,4,theme.flowers);return;}
 b.cylinder(x,palm?43:32,z,palm?3:4,palm?74:52,'#8a7658');
 if(palm){for(let y=15;y<78;y+=6)b.cylinder(x,y,z,3.35,.65,'#a18b69');for(let i=0;i<11;i++){const a=i*Math.PI*2/11;b.frond(x,81+(i%3)*2,z,37+i%3*4,12,i%2?theme.plant:'#73906a',-a);}}
 else{b.leaf(x,65,z,25,theme.plant,1,.82,1);b.leaf(x-13,57,z+5,18,'#7b9a70');b.leaf(x+11,69,z-3,17,'#698d65');for(let i=0;i<5;i++){const a=i*2.4;b.leaf(x+Math.cos(a)*20,58+i%3*8,z+Math.sin(a)*18,10,i%2?theme.plant:'#86a477',1,.7,1);}}
}
function framedBeam(b,x,z,width,height,depth,theme,angle=0){b.box(x,height,z,width,5,depth,theme.stone,angle);b.box(x,height+4,z,width,3,depth-2,theme.trim,angle);}
export function buildStorefronts(w,units,theme){
 const b=new Details(w),outdoor=w.layout.campus.outdoor;
 for(const [index,u]of units.entries()){
  const f=facadeFrame(u),width=f.width,depth=f.depth,design=brandDesign(u),identity=retailIdentity(u),accent=design.referenceKind==='brand-reference'?design.accent:index%3===0?theme.accent:theme.trim,height=outdoor?99:108;
  const local=(x,y,z,sx,sy,sz,color,finish='box')=>b.box(f.x+f.right.x*x+f.front.x*z,y,f.z+f.right.y*x+f.front.y*z,sx,sy,sz,color,f.turn,finish);b.owner=u;
  local(0,2,0,width,4,depth,theme.stone);
  // Recessed, correctly oriented glazing and a clear central entrance.
  local(0,height/2,-10,width,height,Math.max(20,depth-20),design.referenceKind==='brand-reference'?design.wall:theme.wall);
  b.glass(f.x+f.front.x*(depth/2+1),34,f.z+f.front.y*(depth/2+1),width-10,53,1,'#bdd4cb',f.turn);
  local(0,32,depth/2+3,25,60,3,'#263e3c');for(const sign of [-1,1]){local(sign*14,30,depth/2+7,2,57,10,'#a8c2b5');local(sign*12,60,depth/2+5,2,4,12,theme.trim);}local(0,1,depth/2+12,25,2,28,'#475c54');
  for(const sign of [-1,1]){
   local(sign*(width/2-4),height/2,depth/2+3,7,height,10,identity.facade==='glass'?'#d2d8d2':design.referenceKind==='brand-reference'?design.fixture:theme.stone);
   local(sign*13,34,depth/2+3,2,55,4,theme.trim);
   local(sign*(width/2-17),28,depth/2-19,19,34,1,design.wall);
   local(sign*4,30,depth/2+5,1,9,1,'#d4b983','metal');
  }
  for(const sign of [-1,1]){local(sign*(width/2+1),58,0,2,15,depth-22,'#9fb2a8');local(sign*(width/2+3),47,0,4,3,depth-12,theme.stone);}
  local(0,72,depth/2+6,width-4,27,6,identity.background);b.light(f.x+f.front.x*(depth/2+5),55,f.z+f.front.y*(depth/2+5),width-12,2,2,'#e2c58a',f.turn);
  // Layered joinery, sill and display lighting remain inside the existing envelope.
  for(const sign of [-1,1]){const pane=Math.max(9,(width-42)/2),px=sign*(22+pane/2);local(px,6,depth/2-3,pane,3,18,design.fixture);local(px,11,depth/2+3,pane,1.5,2,theme.trim);local(px,43,depth/2+3,1,50,2,'#a3b5ae');b.light(f.x+f.right.x*px+f.front.x*(depth/2-7),58,f.z+f.right.y*px+f.front.y*(depth/2-7),pane-2,1.4,5,'#efd8b1',f.turn);}
  for(const sign of [-1,1]){const px=sign*Math.max(23,width*.29);local(px,37,depth/2+3.8,1,38,1,'#f0f3e9','glass');local(px+sign*3,37,depth/2+3.8,.65,38,1,'#d6e6e0','glass');}local(0,61,depth/2-3,24,1.4,12,'#485c52');
  local(0,4,depth/2+7,24,1.5,5,'#bac1b7');local(0,7,depth/2+5,23,1,1,'#d3c4a0');
  local(0,89,depth/2+5,width+5,4,13,theme.stone);
  if(outdoor)b.roof(f.x,height+2,f.z,width+3,5,depth+3,theme.roof,f.turn);else local(0,height+2,0,width+3,5,depth+3,theme.stone);
  local(0,height-5,depth/2+3,width+6,4,12,theme.trim);
  if(outdoor){local(0,56,depth/2+13,width+3,4,28,index%3===0?accent:'#d9c5a2');for(const sign of [-1,1])local(sign*(width/2-3),29,depth/2+15,3,54,3,theme.trim);}
  else{local(0,85,depth/2+3,width-15,9,3,'#b6c7bd');local(0,93,depth/2+7,width+4,3,20,theme.trim);}
  if(identity.key==='sephora')for(const sign of [-1,1])for(let j=0;j<5;j++)local(sign*(width/2-5),12+j*10,depth/2+5,9,10,12,j%2?'#f5f3ed':'#141716');
  if(['timber','workshop'].includes(identity.facade))for(const sign of [-1,1])for(let j=0;j<4;j++)local(sign*(width/2-7)+j*1.2,37,depth/2+6,1,52,7,design.trim);
  if(identity.facade==='sport'){local(0,95,depth/2+4,width,5,6,identity.key==='nike'?'#f36b32':identity.ink);for(const sign of [-1,1])local(sign*(width/2-2),35,depth/2+6,3,62,7,'#343b37');}
  if(identity.facade==='boutique'||identity.facade==='jewelry')for(const sign of [-1,1]){local(sign*(width/2-9),37,depth/2+7,2,60,6,design.trim);local(sign*(width/2-22),7,depth/2+9,25,8,20,design.fixture);}
  if(identity.facade==='glass')local(0,97,depth/2+9,width-8,2,12,'#c6ceca');
  const sx=f.x+f.front.x*(depth/2+11),sz=f.z+f.front.y*(depth/2+11),label=brandSign(w,u,sx,72,sz,width-8,23,f.turn);
  label.userData.cutawayOwner=u.id;w.tag(label,'door:'+u.id,u.door);w.nearLabels.push({object:label,x:sx,z:sz,radius:420,directory:true,physicalSign:true});
 }
 b.owner=null;return b.flush();
}
function directoryTexture(w,theme,l,position){
 const c=document.createElement('canvas');c.width=256;c.height=384;const g=c.getContext('2d');g.fillStyle='#f1ebd9';g.fillRect(0,0,256,384);g.fillStyle=theme.accent;g.fillRect(0,0,256,48);g.fillStyle='#fff7df';g.font='bold 18px Arial';g.textAlign='center';g.fillText('CENTER DIRECTORY',128,31);
 const k=Math.min(224/l.width,260/l.height),ox=(256-l.width*k)/2,oy=65+(260-l.height*k)/2;g.save();g.translate(ox,oy);g.scale(k,k);g.strokeStyle='#b0bda8';g.lineCap='round';
 for(const h of l.campus.halls){const a=l.campus.nodes[Number(h.a)],b=l.campus.nodes[Number(h.b)];g.lineWidth=h.width;g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();}
 for(const r of [...l.rects,...l.units]){g.fillStyle=r.color||theme.accent;g.fillRect(r.x,r.y,r.width,r.height);}
 g.fillStyle='#a5482a';g.beginPath();g.arc(position.x,position.y,6/k,0,7);g.fill();g.restore();g.fillStyle=theme.accent;g.font='bold 15px Arial';g.fillText('YOU ARE HERE',128,352);g.font='13px Arial';g.fillText(l.plan.levels[l.campus.floor]||'Current floor',128,373);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;w.resources.add(t);return t;
}
export function buildPublicRealm(w,l,theme){
 const d=l.environment,b=new Details(w),mainCourt=l.campus.courts.find(n=>/Jewel|Atrium/.test(n.label))||l.campus.courts.reduce((a,n)=>Math.hypot(a.x-l.spawn.x,a.y-l.spawn.y)<Math.hypot(n.x-l.spawn.x,n.y-l.spawn.y)?a:n),portals=d.portals.filter(p=>l.campus.outdoor||Math.hypot(p.x-mainCourt.x,p.y-mainCourt.y)>190);w.waterFeatures=[];
 for(const p of d.edgePlanting){const x=p.x+p.width/2,z=p.y+p.height/2;if(p.kind==='garden'){b.box(x,4,z,p.width,8,p.height,theme.stone);b.box(x,8,z,p.width-8,1,p.height-8,'#687850');for(const dx of [-23,0,23])for(const dz of [-17,17]){b.leaf(x+dx,18,z+dz,15,theme.plant,1,.65,.8);b.leaf(x+dx+3,25,z+dz-3,4,theme.flowers);}plant(b,x, z,theme,false,true);}else{plant(b,x,z,theme,p.palm);b.box(x,3,z,63,6,63,theme.stone);}}
 for(const p of portals.flatMap(p=>[-1,1].map(sign=>({x:p.x+Math.cos(p.angle)*sign*p.width/2,y:p.y-Math.sin(p.angle)*sign*p.width/2,height:p.height})))){b.box(p.x,4,p.y,22,8,22,theme.stone);b.box(p.x,p.height/2,p.y,9,p.height,9,theme.wall);b.box(p.x,p.height-3,p.y,19,6,19,theme.trim);}
 // Original stone inlays articulate the broad courts without adding obstacles.
 for(const [i,n]of l.campus.courts.entries()){
  const rim=w.mesh(new T.RingGeometry(29,31,32),w.mat(theme.inlay,{roughness:.95}));rim.rotation.x=-Math.PI/2;rim.position.set(n.x,.22,n.y);rim.castShadow=false;
  for(let j=0;j<4;j++){const angle=j*Math.PI/2,x=n.x+Math.cos(angle)*17,z=n.y+Math.sin(angle)*17;b.box(x,.3,z,8,.25,8,j%2?theme.stone:theme.inlay,Math.PI/4);}
 }
 for(const p of d.fixtures){const x=p.x+p.width/2,z=p.y+p.height/2;
  if(p.kind==='bench'){
   const a=p.rotation,rx=Math.cos(a),rz=-Math.sin(a),fx=Math.sin(a),fz=Math.cos(a);b.box(x,12,z,64,5,22,'#987752',a,'timber');b.box(x-fx*9,24,z-fz*9,64,21,4,'#b2946c',a,'timber');for(const side of [-1,1]){b.box(x+rx*23,6,z+rz*23,5,12,18,theme.trim,a,'metal');b.box(x+rx*30,19,z+rz*30,3,9,19,theme.trim,a,'metal');}
   for(const slat of [-7,0,7])b.box(x+fx*slat,14.7,z+fz*slat,63,.5,1.4,'#6f583f',a,'timber');for(const rail of [19,26,33])b.box(x-fx*11,rail,z-fz*11,62,1,1,'#967653',a,'timber');
   if(l.campus.outdoor){const a=p.rotation,px=x-Math.sin(a)*8,pz=z-Math.cos(a)*8;b.cylinder(px,49,pz,1.6,72,theme.trim);const shade=w.mesh(new T.ConeGeometry(43,12,8),w.mat(theme.wall));shade.position.set(px,91,pz);shade.castShadow=true;}
   const hit=w.box(x,17,z,p.width,26,p.height,w.mat('#ffffff',{transparent:true,opacity:0,depthWrite:false}));hit.castShadow=false;w.tag(hit,'bench:'+p.id,p.approach);
  }else if(p.kind==='kiosk'){
   const accent={coffee:'#54766a',photo:'#9d8798',flowers:'#789262',popup:'#bd8c62'}[p.venue];
   b.box(x,14,z,38,28,32,theme.stone);b.box(x,29,z,43,3,37,accent);b.box(x,50,z-13,43,4,16,accent);for(const sign of [-1,1])b.box(x+sign*17,39,z-13,2,22,2,theme.trim);
   if(p.venue==='coffee'){for(const dx of [-9,6]){b.cylinder(x+dx,35,z,4,10,'#f2eadb');b.cylinder(x+dx,40,z,4.5,1,theme.trim);}b.box(x+9,38,z-7,13,17,9,'#384d45');}
   else if(p.venue==='flowers')for(let i=0;i<6;i++){const dx=i%3*10-10,dz=Math.floor(i/3)*12-6;b.cylinder(x+dx,34,z+dz,3,9,'#a4896a');b.leaf(x+dx,42,z+dz,6,[theme.flowers,'#edcb98','#ddaaad'][i%3]);}
   else if(p.venue==='photo'){b.box(x,40,z,15,10,9,'#4e6060');b.cylinder(x,47,z,3,3,theme.stone);}
   else for(const dx of [-10,0,10])b.box(x+dx,35,z,7,9,7,['#819b87','#c39a76','#b4a079'][(dx+10)/10]);
   const hit=w.box(x,25,z,40,52,34,w.mat('#ffffff',{transparent:true,opacity:0,depthWrite:false}));hit.castShadow=false;w.tag(hit,'venue:'+p.venue,p.approach);
  }else if(p.kind==='waystation'){
   b.box(x,2,z,30,4,28,theme.trim);b.box(x,18,z,22,32,20,theme.stone);
   if(p.amenity==='water'){b.box(x,38,z-6,20,12,6,'#647b78');b.box(x,32,z+3,18,2,16,'#bac8c1');for(const dx of [-5,5]){b.cylinder(x+dx,34,z+2,1,4,'#d1dbd3');b.box(x+dx,37,z,2,2,5,'#abc8c3');}b.cylinder(x+8,38,z+6,2,7,'#f5eedc');b.box(x,47,z-6,14,3,2,'#a0c7c5');}
   else{for(const dx of [-9,9])b.box(x+dx,42,z-6,2,48,2,theme.trim);b.box(x,51,z-6,25,27,3,'#567369');for(let i=0;i<3;i++)b.box(x-7+i*7,51+(i%2)*3,z-3.9,6,12,1,['#ead3a3','#f3e9ce','#d4c4d9'][i]);b.box(x,66,z-6,29,3,7,theme.trim);}
   const key='amenity:'+p.amenity,hit=w.box(x,31,z,26,64,24,w.mat('#ffffff',{transparent:true,opacity:0,depthWrite:false}));hit.castShadow=false;w.tag(hit,key,p.approach);const label=w.label(p.amenity==='water'?'Free water ↗':'Community board ↗',x,80,z,78,theme.accent);w.tag(label,key,p.approach);w.nearLabels.push({object:label,x,z,radius:130,directory:true});
   }else if(p.kind==='art'){
   b.box(x,3,z,29,6,29,theme.stone);b.box(x,7,z,23,2,23,theme.trim);
   for(const [i,color]of ['#b38860','#5e8b80'].entries()){const ring=w.mesh(new T.TorusGeometry(11,2.5,6,28),w.mat(color,{roughness:.36,metalness:.5}));ring.position.set(x+(i?3:-3),23,z);ring.rotation.set(.25,i?-.7:.7,i?.3:-.3);w.tag(ring,'art:'+p.id,p.approach);}
   const label=w.label('Sculpture alcove ↗',x,65,z,95,theme.accent);w.tag(label,'art:'+p.id,p.approach);w.nearLabels.push({object:label,x,z,radius:160,directory:true});
  }else if(p.kind==='commons'){
   b.box(x,13,z,26,26,26,theme.stone);b.box(x,27,z,30,2,30,theme.trim);
   if(p.activity==='garden'){b.box(x,29,z,25,3,25,'#6f7957');for(const [dx,dz]of [[-6,5],[6,5],[0,-6]]){b.leaf(x+dx,39,z+dz,9,theme.plant,.7,1,.7);b.leaf(x+dx,46,z+dz,4,theme.flowers);}}
   else if(p.activity==='reading'){b.box(x,43,z-9,27,29,5,theme.trim);b.box(x,30,z,27,3,24,theme.wall);b.box(x,55,z,29,3,25,theme.wall);for(let i=0;i<5;i++)b.box(x-10+i*5,42,z-5,4,20,11,['#b87d68','#719685','#d4b465','#879bb0','#a28ba4'][i]);}
   else for(let i=0;i<3;i++){b.box(x-9+i*9,29,z,8,2,20,['#bf805f','#698f83','#d1b46e'][i]);b.box(x-9+i*9,30.2,z,1,.3,12,'#fff1d3');b.box(x-9+i*9,30.3,z-5,5,.3,1,'#fff1d3');}
   const names={mosaic:'Mosaic table',reading:'Reading shelf',garden:'Garden study'},key='commons:'+p.activity,hit=w.box(x,30,z,30,62,30,w.mat('#ffffff',{transparent:true,opacity:0,depthWrite:false}));hit.castShadow=false;w.tag(hit,key,p.approach);const label=w.label(names[p.activity]+' ↗',x,76,z,82,theme.accent);w.tag(label,key,p.approach);w.nearLabels.push({object:label,x,z,radius:150,directory:true});
  }else if(p.kind==='planter')plant(b,x,z,theme,false,true);
  else if(p.kind==='fountain'){
   b.cylinder(x,5,z,17,10,theme.stone);b.water(x,10.4,z,14);b.cylinder(x,15,z,4,9,theme.trim);const jet=w.mesh(new T.CylinderGeometry(.9,1.3,19,6),w.mat('#c5e7df',{transparent:true,opacity:.65,depthWrite:false}));jet.position.set(x,26,z);jet.castShadow=false;w.waterFeatures.push({mesh:jet,y:26});
  }else if(p.kind==='directory'){
   b.box(x,26,z,13,50,8,theme.trim);b.box(x,53,z,25,6,12,theme.stone);
   const panel=w.mesh(new T.PlaneGeometry(22,33),w.mat('#ffffff',{map:directoryTexture(w,theme,l,{x,y:z}),roughness:.8}));panel.position.set(x,34,z+4.4);panel.castShadow=false;w.tag(panel,'directory:'+p.node,p.approach);w.tag(w.label('Directory ↗',x,66,z,56,theme.accent),'directory:'+p.node,p.approach);w.nearLabels.push({object:w.scene.children.at(-1),x,z,radius:125,directory:true});
  }
 }
 // Repeated gallery lighting and planted hanging baskets add detail above
 // head height without narrowing the collision-tested walking lanes.
 for(const h of l.campus.halls){const a=l.campus.nodes[Number(h.a)],z=l.campus.nodes[Number(h.b)],length=Math.hypot(z.x-a.x,z.y-a.y),angle=Math.atan2(z.x-a.x,z.y-a.y);
  for(let distance=210;distance<length-90;distance+=310){const f=distance/length,x=a.x+(z.x-a.x)*f,y=a.y+(z.y-a.y)*f;
   b.box(x,113,y,h.width+40,1.2,1.2,theme.trim,angle,'metal');
   for(const offset of [-32,0,32]){const xx=x+Math.cos(angle)*offset,zz=y-Math.sin(angle)*offset;b.cylinder(xx,108,zz,1,10,theme.trim);b.light(xx,101,zz,8,6,8,'#f4d8a5');}
   if(l.campus.outdoor)for(const side of [-1,1]){const xx=x+Math.cos(angle)*side*(h.width/2+10),zz=y-Math.sin(angle)*side*(h.width/2+10);b.cylinder(xx,101,zz,7,9,theme.stone);b.leaf(xx,105,zz,10,theme.plant,1,.5,1);for(const offset of [-5,5])b.leaf(xx+offset,101,zz+4,4,theme.flowers);}
  }
 }
 // Every canopy and arch has a matching pair of columns outside the walking lanes.
 for(const p of portals){
  if(p.arch){const arch=w.mesh(new T.TorusGeometry(p.width/2,3,5,32,Math.PI),w.mat(theme.stone));arch.position.set(p.x,p.height,p.y);arch.rotation.y=p.angle;arch.scale.y=.35;}
  else{framedBeam(b,p.x,p.y,p.width+8,p.height,9,theme,p.angle);for(const shift of [-20,0,20]){const x=p.x+Math.sin(p.angle)*shift,z=p.y+Math.cos(p.angle)*shift;b.box(x,p.height+4,z,p.width-9,3,3,theme.trim,p.angle);}}
  if(l.campus.outdoor){for(const sign of [-1,1]){const x=p.x+Math.cos(p.angle)*sign*(p.width/2-24),z=p.y-Math.sin(p.angle)*sign*(p.width/2-24);b.box(x,p.height-12,z,3,17,3,theme.trim);b.light(x,p.height-22,z,11,10,10,'#e5c588');}}
  else b.box(p.x,p.height-4,p.y,p.width-20,2,3,'#e5cf99',p.angle);
 }
 if(!l.campus.outdoor)for(const h of l.campus.halls){
  const a=l.campus.nodes[Number(h.a)],z=l.campus.nodes[Number(h.b)],length=Math.hypot(z.x-a.x,z.y-a.y),angle=Math.atan2(z.x-a.x,z.y-a.y),roof=w.box((a.x+z.x)/2,132,(a.y+z.y)/2,h.width+30,2,length,w.mat('#cbdad3',{transparent:true,opacity:.07,depthWrite:false}));roof.rotation.y=angle;roof.castShadow=false;
  for(const side of [-1,1])b.box((a.x+z.x)/2+Math.cos(angle)*side*(h.width/2+13),132,(a.y+z.y)/2-Math.sin(angle)*side*(h.width/2+13),4,5,length,theme.trim,angle);
 }
 if(!l.campus.outdoor)for(const n of [mainCourt]){
  const ring=w.mesh(new T.TorusGeometry(n.radius+15,3,6,40),w.mat(theme.trim));ring.rotation.x=Math.PI/2;ring.position.set(n.x,145,n.y);ring.castShadow=false;
  const glass=w.mesh(new T.SphereGeometry(n.radius+13,24,10,0,Math.PI*2,0,Math.PI/2),w.mat('#bfdad4',{transparent:true,opacity:.09,depthWrite:false,side:T.DoubleSide}));glass.scale.y=.24;glass.position.set(n.x,145,n.y);glass.castShadow=false;
  for(let i=0;i<4;i++){const beam=w.mesh(new T.TorusGeometry(n.radius+13,1.4,4,24,Math.PI),w.mat(theme.stone));beam.position.set(n.x,145,n.y);beam.scale.y=.24;beam.rotation.y=i*Math.PI/4;beam.castShadow=false;}
 }
 const count=b.flush();w.canvas.dataset.environmentRevision='35';w.canvas.dataset.artAlcoves=String(d.fixtures.filter(f=>f.kind==='art').length);w.canvas.dataset.waystationCount=String(d.fixtures.filter(f=>f.amenity).length);w.canvas.dataset.publicSeats=String(d.seating.length);w.canvas.dataset.landscapeFeatures=String(d.edgePlanting.length+d.fixtures.length);w.canvas.dataset.architecturalDetails=String(count);return count;
}

export function buildAnchor(w,a,theme){
 const b=new Details(w),f=facadeFrame(a),height=131,local=(x,y,z,sx,sy,sz,color,finish='box')=>b.box(f.x+f.right.x*x+f.front.x*z,y,f.z+f.right.y*x+f.front.y*z,sx,sy,sz,color,f.turn);
 b.owner=a;local(0,height/2,0,f.width,height,f.depth,theme.wall);local(0,2,0,f.width+8,4,f.depth+8,theme.stone);local(0,height+3,0,f.width+8,7,f.depth+8,theme.stone);local(0,42,f.depth/2+3,f.width-28,72,4,'#869f99');
 for(let x=-f.width/2+10;x<f.width/2;x+=34)local(x,48,f.depth/2+7,7,96,12,theme.stone);
 for(const sign of [-1,1]){local(sign*(f.width/2+2),65,0,3,49,f.depth-25,'#8ca49c');for(let z=-f.depth/2+16;z<f.depth/2;z+=37)local(sign*(f.width/2+4),67,z,5,76,6,theme.stone);local(sign*(f.width/2+4),101,0,7,6,f.depth,theme.trim);}
 local(0,101,f.depth/2+8,f.width,22,13,theme.trim);local(0,55,f.depth/2+20,81,6,44,theme.stone);local(0,23,f.depth/2+6,41,46,5,'#3c5752');
 b.flush();const face={x:f.x+f.front.x*(f.depth/2+12),z:f.z+f.front.y*(f.depth/2+12)},label=facadeLabel(w,a.name,face.x,103,face.z,Math.min(200,f.width-15),'#f5eedb',theme.trim,f.turn);label.userData.cutawayOwner=a.id;w.tag(label,'landmark:'+a.id.slice(9),a.door);w.nearLabels.push({object:label,x:face.x,z:face.z,radius:430,directory:true});
 const hit=w.box(f.x,40,f.z,a.width,80,a.height,w.mat('#ffffff',{transparent:true,opacity:0,depthWrite:false}));hit.castShadow=false;w.tag(hit,'landmark:'+a.id.slice(9),a.door);
}

export function buildRetailConnections(w,l,theme){
 const b=new Details(w);for(const r of [...l.retailLinks||[],...l.backBlocks||[]]){const f=facadeFrame(r);b.owner=r;b.box(f.x,49,f.z,r.width,98,r.height,theme.wall);b.box(f.x,101,f.z,r.width+2,6,r.height+2,theme.roof);
 if(r.id.startsWith('retail-back-')){for(const side of [-1,1]){b.box(f.x,44,f.z+side*(r.height/2+.5),Math.max(2,r.width-8),52,2,'#7c9992');b.box(f.x+side*(r.width/2+.5),44,f.z,2,52,Math.max(2,r.height-8),'#7c9992');b.box(f.x,76,f.z+side*(r.height/2+2),r.width+3,6,8,theme.stone);b.box(f.x+side*(r.width/2+2),76,f.z,8,6,r.height+3,theme.stone);for(let x=-r.width/2+4;x<r.width/2;x+=44)b.box(f.x+x,44,f.z+side*(r.height/2+2),4,59,4,theme.stone);for(let z=-r.height/2+4;z<r.height/2;z+=44)b.box(f.x+side*(r.width/2+2),44,f.z+z,4,59,4,theme.stone);}continue;}
 b.box(f.x+f.front.x*f.depth/2,74,f.z+f.front.y*f.depth/2,f.width+2,7,13,theme.trim,f.turn);b.box(f.x+f.front.x*(f.depth/2+9),55,f.z+f.front.y*(f.depth/2+9),f.width+2,4,28,theme.stone,f.turn);}
 b.flush();w.canvas.dataset.connectedStorefronts=String((l.retailLinks||[]).length);
}

export function buildMallEntrance(w,l,theme){
 if(l.campus.floor!==0)return;const p=l.exit,b=new Details(w);for(const sign of [-1,1]){b.box(p.x+sign*77,56,p.y,12,112,19,theme.stone);b.box(p.x+sign*77,7,p.y,22,14,28,theme.trim);b.box(p.x+sign*61,49,p.y+2,21,87,3,'#8ca69b');}
 b.box(p.x,115,p.y,170,28,24,theme.trim);b.box(p.x,132,p.y,177,7,31,theme.stone);b.box(p.x,93,p.y+13,166,5,50,theme.stone);b.light(p.x,89,p.y+19,153,2,4,'#e6cea1');b.flush();
 const label=facadeLabel(w,'MALL ENTRANCE',p.x,115,p.y+24,130,'#faf4df',theme.trim);w.nearLabels.push({object:label,x:p.x,z:p.y,radius:420,directory:true,physicalSign:true});w.entryDoors=[];
 for(const sign of [-1,1]){const door=w.box(p.x+sign*20,41,p.y,38,80,2,w.mat('#9cbbb2',{transparent:true,opacity:.36,depthWrite:false}));door.castShadow=false;w.entryDoors.push({mesh:door,x:p.x,sign,z:p.y});}
}
