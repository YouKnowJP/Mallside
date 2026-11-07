import * as T from './vendor/three.module.js';

// Original surface and landscape art; these are game finishes, not surveyed mall materials.
export const PROMENADE_REVISION='64';
const finishes={
 orange:{name:'Warm limestone promenade',pattern:'pavers',tile:[28,14],colors:['#dfd2ba','#d6c9b0','#e7dcc6','#daced0'],joint:'#b7aa91'},
 citadel:{name:'Terracotta arcade',pattern:'pavers',tile:[24,12],colors:['#ceac8e','#d6b89b','#ddc4a9','#cba88b'],joint:'#bba68d'},
 spectrum:{name:'Sandstone and mosaic courts',pattern:'pavers',tile:[30,15],colors:['#e2d3b6','#dac9aa','#e9dcc4','#d9c8ad'],joint:'#b5a78d'},
 desert:{name:'Desert sandstone',pattern:'pavers',tile:[36,18],colors:['#dfcbb0','#d6c0a4','#e8d8bd','#d9c7b1'],joint:'#b7a186'},
 island:{name:'Coastal pale aggregate',pattern:'terrazzo',tile:[36,36],colors:['#e5e1cf','#dcdcca','#ece8da','#e0e1d3'],joint:'#bfc3b4'},
 century:{name:'Garden limestone',pattern:'stone',tile:[42,21],colors:['#e2dfd3','#d8d8cb','#e9e5d9','#dbe0d4'],joint:'#b9bcae'},
 brea:{name:'Ivory terrazzo gallery',pattern:'terrazzo',tile:[40,40],colors:['#eee9dd','#e7e4d8','#f1ede3','#e8e7df'],joint:'#cbc8bc'},
 delamo:{name:'Garden gallery stone',pattern:'stone',tile:[42,21],colors:['#e6e3d7','#dddfd2','#ece9df','#e2e2d8'],joint:'#bfc2b5'},
 beverly:{name:'Warm gallery terrazzo',pattern:'terrazzo',tile:[40,40],colors:['#e9e1d9','#e2dbd2','#efe8df','#e8e2dc'],joint:'#c5b9ad'},
 southcoast:{name:'Grand limestone gallery',pattern:'stone',tile:[44,22],colors:['#eae3d4','#e2dac9','#f0eadd','#e7dfcf'],joint:'#c3b59e'}
};
export function promenadeFinish(id){return finishes[typeof id==='string'?id:id?.id]||finishes.brea;}
const noise=(x,y)=>{let n=(Math.imul(x+17,374761393)+Math.imul(y+29,668265263))|0;n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967295;};
export function paintPromenadePaving(g,width,height,id){
 const f=promenadeFinish(id),[tw,th]=f.tile;g.fillStyle=f.joint;g.fillRect(0,0,width,height);
 for(let row=0,y=0;y<height;y+=th,row++)for(let col=-1,x=-tw;x<width;x+=tw,col++){
  const xx=x+(f.pattern==='pavers'&&row%2?tw/2:0),v=noise(col,row);g.fillStyle=f.colors[Math.min(3,Math.floor(v*4))];g.fillRect(xx+.42,y+.42,tw-.84,th-.84);
  g.fillStyle='#ffffff14';g.fillRect(xx+.7,y+.7,tw-1.4,.36);g.fillStyle='#6655420b';g.fillRect(xx+.7,y+th-.9,tw-1.4,.35);
  if(f.pattern==='terrazzo')for(let i=0;i<8;i++){const px=xx+noise(col*11+i,row*13)*tw,py=y+noise(col*17,row*7+i)*th,r=.35+noise(col+i,row-i)*.65;g.fillStyle=i%3?'#ffffff32':'#82776820';g.beginPath();g.ellipse(px,py,r,r*.55,i,0,Math.PI*2);g.fill();}
  else if(f.pattern==='stone'&&v>.6){g.strokeStyle='#a79b7d0c';g.lineWidth=.35;g.beginPath();g.moveTo(xx+3,y+th*.25);g.bezierCurveTo(xx+tw*.3,y+th*.35,xx+tw*.6,y+th*.2,xx+tw-3,y+th*.48);g.stroke();}
 }
}
export function paintPromenadeCourt(g,n,theme,index,id){
 const r=Math.max(20,n.radius-15);g.fillStyle=theme.floor;g.beginPath();g.arc(n.x,n.y,r,0,Math.PI*2);g.fill();
 g.strokeStyle=theme.inlay;g.lineWidth=1.3;for(const radius of[r-2,r-7]){g.beginPath();g.arc(n.x,n.y,radius,0,Math.PI*2);g.stroke();}
 const count=id==='spectrum'?12:8;g.strokeStyle=theme.stone;g.lineWidth=.7;
 for(let i=0;i<count;i++){const a=i*Math.PI*2/count+(index%2)*Math.PI/count;g.beginPath();g.moveTo(n.x+Math.cos(a)*r*.36,n.y+Math.sin(a)*r*.36);g.lineTo(n.x+Math.cos(a)*(r-9),n.y+Math.sin(a)*(r-9));g.stroke();}
 g.strokeStyle=theme.inlay;g.lineWidth=.8;g.beginPath();g.arc(n.x,n.y,r*.36,0,Math.PI*2);g.stroke();
 // A small original compass inlay leaves the center visually quiet and walkable.
 for(let i=0;i<4;i++){const a=i*Math.PI/2;g.fillStyle=i%2?theme.stone:theme.inlay;g.beginPath();g.moveTo(n.x+Math.cos(a)*12,n.y+Math.sin(a)*12);g.lineTo(n.x+Math.cos(a+.34)*3,n.y+Math.sin(a+.34)*3);g.lineTo(n.x+Math.cos(a+Math.PI)*2,n.y+Math.sin(a+Math.PI)*2);g.lineTo(n.x+Math.cos(a-.34)*3,n.y+Math.sin(a-.34)*3);g.closePath();g.fill();}
}
export function leafyCanopyGeometry(){
 const positions=[],colors=[],tri=(a,b,c,shade)=>{for(const p of[a,b,c]){positions.push(...p);colors.push(shade,shade,shade);}};
 for(let i=0;i<52;i++){
  const a=i*2.399963,r=.35+.55*Math.sqrt((i+.5)/52),y=(noise(i,9)-.5)*1.55,cx=Math.cos(a)*r,cz=Math.sin(a)*r,len=.2+noise(i,5)*.18,wide=len*.45,ux=Math.cos(a+.6),uz=Math.sin(a+.6),vx=-uz,vz=ux,shade=.78+noise(i,3)*.22;
  const base=[cx-ux*len*.5,y-.05,cz-uz*len*.5],tip=[cx+ux*len,y-.1,cz+uz*len],mid=[cx+ux*len*.15,y+.12,cz+uz*len*.15],left=[mid[0]+vx*wide,y,mid[2]+vz*wide],right=[mid[0]-vx*wide,y,mid[2]-vz*wide];tri(base,left,mid,shade);tri(left,tip,mid,shade+.035);tri(base,mid,right,shade*.9);tri(right,mid,tip,shade*.94);
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.computeBoundingBox();const box=g.boundingBox,center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());g.translate(-center.x,-center.y,-center.z);g.scale(2/size.x,2/size.y,2/size.z);g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();return g;
}
export function planterGeometry(){return new T.LatheGeometry([new T.Vector2(.68,-.5),new T.Vector2(.74,-.48),new T.Vector2(.96,.38),new T.Vector2(1,.42),new T.Vector2(1,.5),new T.Vector2(.9,.5),new T.Vector2(.88,.39)],24);}
function groundingTexture(){
 const size=64,data=new Uint8Array(size*size*4);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const dx=Math.abs((x+.5)/size*2-1),dy=Math.abs((y+.5)/size*2-1),edge=Math.max(dx,dy),a=Math.max(0,Math.min(1,(1-edge)/.25));data.set([255,255,255,Math.round(a*a*255)],(y*size+x)*4);}
 const t=new T.DataTexture(data,size,size,T.RGBAFormat);t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t;
}
export function buildGrounding(w,l,inside=false){
 const rects=inside?[...l.displays.slice(0,w.interiorSelection?.items?.length||0),...l.stockFixtures,l.checkout,l.returns,l.rail,...l.seating]:[...l.rects,...l.units,...l.anchors,...l.venues,...l.environment.fixtures,...l.environment.edgePlanting];
 const rows=rects.filter(r=>Number.isFinite(r.x)&&Number.isFinite(r.y)&&r.width>0&&r.height>0),texture=groundingTexture(),geometry=new T.PlaneGeometry(1,1),material=new T.MeshBasicMaterial({map:texture,color:'#3b382d',transparent:true,opacity:inside?.12:.18,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),mesh=new T.InstancedMesh(geometry,material,rows.length),dummy=new T.Object3D();
 for(const[i,r]of rows.entries()){dummy.position.set(r.x+r.width/2,inside?.055:-.35,r.y+r.height/2);dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.set(r.width+7,r.height+7,1);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);}mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.renderOrder=1;mesh.name='original-static-grounding';w.resources.add(texture);w.resources.add(geometry);w.resources.add(material);w.scene.add(mesh);w.canvas.dataset.promenadeRevision=PROMENADE_REVISION;w.canvas.dataset.pavingStyle=promenadeFinish(w.state.mallId).pattern;w.canvas.dataset.groundedFixtures=String(rows.length);return mesh;
}
