import * as T from './vendor/three.module.js';

// Tangent planes bound the actual body cross-section. An ellipse of maximum X/Z
// radii can still cut through the corners of the visible torso in a cropped top.
const directions=Array.from({length:48},(_,i)=>[Math.cos(i*Math.PI/24),Math.sin(i*Math.PI/24)]);
let canonicalSections;
function sections(g){
 if(canonicalSections)return canonicalSections;
 const rows=Array.from({length:51},()=>directions.map(()=>-Infinity));g.updateMatrixWorld(true);g.userData.anatomy.skeleton.update();
 for(const name of ['torso','pelvis','neckline']){
  const m=g.userData.anatomy.meshes.get(name),positions=m.geometry.attributes.position;
  for(let i=0;i<positions.count;i++){
   const p=m.getVertexPosition(i,new T.Vector3()),row=Math.round((p.y-20)*2);
   for(let r=Math.max(0,row-1);r<=Math.min(50,row+1);r++)for(const [j,[x,z]]of directions.entries())rows[r][j]=Math.max(rows[r][j],p.x*x+p.z*z);
  }
 }
 for(let r=0;r<rows.length;r++)if(!Number.isFinite(rows[r][0]))rows[r]=rows[Math.max(0,r-1)].slice();
 canonicalSections=rows;return rows;
}
export function bodySectionRadius(g,y,x,z){
 const length=Math.hypot(x,z);if(!length||!g.userData.anatomy)return 0;
 const row=sections(g)[Math.max(0,Math.min(50,Math.round((y-20)*2)))],dx=x/length,dz=z/length;let radius=Infinity;
 for(const [i,[nx,nz]]of directions.entries()){const dot=dx*nx+dz*nz;if(dot>1e-5)radius=Math.min(radius,row[i]/dot);}
 return Number.isFinite(radius)?Math.max(0,radius):0;
}
