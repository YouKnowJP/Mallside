import * as T from './vendor/three.module.js';

// A solid rectangular cross-section follows the strap curve, including its side edges.
export function strapGeometry(points,width,thickness=.25,{linear=false}={}){
 const curve=new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),positions=[],uv=[],index=[],steps=32;
 for(let i=0;i<=steps;i++){const t=i/steps,p=linear?new T.Vector3(...points[Math.min(i,points.length-1)]):curve.getPoint(t),v=linear?new T.Vector3(...points[Math.min(i+1,points.length-1)]).sub(new T.Vector3(...points[Math.max(0,i-1)])).normalize():curve.getTangent(t),n=new T.Vector3(-v.y,v.x,0).normalize();for(const [side,depth]of [[-1,1],[1,1],[1,-1],[-1,-1]]){const q=p.clone().addScaledVector(n,side*width/2);q.z+=depth*thickness/2;positions.push(q.x,q.y,q.z);uv.push(side<0?0:1,t*4);}if(i<steps)for(let j=0;j<4;j++){const a=i*4+j,b=a+4,c=i*4+(j+1)%4,d=c+4;index.push(a,b,c,c,b,d);}}
 index.push(0,1,2,0,2,3);const e=steps*4;index.push(e,e+2,e+1,e,e+3,e+2);const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(index);geo.computeVertexNormals();return geo;
}
export function addChainLinks(parent,points,metal,{radius=.45,wire=.09}={}){
 const curve=new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),count=Math.max(4,Math.ceil(curve.getLength()/(radius*1.45))),links=new T.InstancedMesh(new T.TorusGeometry(radius,wire,5,12),metal,count),dummy=new T.Object3D();
 for(let i=0;i<count;i++){const t=i/(count-1);dummy.position.copy(curve.getPoint(t));dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),curve.getTangent(t));dummy.rotateY(i%2?.55:-.55);dummy.scale.set(1,1.3,1);dummy.updateMatrix();links.setMatrixAt(i,dummy.matrix);}links.instanceMatrix.needsUpdate=true;links.castShadow=true;parent.add(links);return links;
}

export function addReferenceDetails(parent,a,{width:w,height:h,depth:d},metal,trim){
 const mesh=(geo,mat,x=0,y=0,z=d/2+.5)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;};
 const box=(x,y,z,ww,hh,dd,mat=trim)=>mesh(new T.BoxGeometry(ww,hh,dd),mat,x,y,z);
 const arc=(x,y,r,flip=false)=>{const m=mesh(new T.TorusGeometry(r,.35,6,32,Math.PI*1.65),metal,x,y,d/2+.5);m.rotation.z=(flip?Math.PI:0)+Math.PI*.175;return m;};
 if(a.detail==='coach-c'){const c=arc(0,-h*.10,h*.15);c.scale.set(1.4,.88,1);box(0,-h*.18,d/2+.3,h*.25,h*.49,.6,trim);c.position.z=d/2+.6;}
 if(a.detail==='chanel-cc'||a.detail==='gucci-gg'){arc(-1.1,-h*.08,2.1);arc(1.1,-h*.08,2.1,true);if(a.detail==='gucci-gg')for(const x of [-1.1,1.1])box(x+.7,-h*.09,d/2+1.3,1.7,.55,.5,metal);}
 if(a.detail==='prada'){
  const s=new T.Shape();s.moveTo(0,-2);s.lineTo(-3.1,2.6);s.lineTo(3.1,2.6);s.closePath();const plaque=mesh(new T.ExtrudeGeometry(s,{depth:.35,bevelEnabled:false}),metal);plaque.position.y=h*.05;
  const inner=mesh(new T.ExtrudeGeometry(s,{depth:.2,bevelEnabled:false}),trim,0,h*.05,d/2+1);inner.scale.set(.82,.82,1);for(let i=0;i<3;i++)box((i-1)*1.1,h*.075,d/2+1.3,.65,.18,.2,metal);
 }
 if(a.detail==='pliage'){
  box(0,h/2-4.2,d/2+.65,8,8.6,1.2,trim);const snap=mesh(new T.CylinderGeometry(.9,.9,.3,16),metal,0,h/2-6.6,d/2+1.5);snap.rotation.x=Math.PI/2;
  const horse=new T.Shape();horse.moveTo(-1.8,0);for(const [x,y]of [[-.8,1],[1.1,1],[1.5,2],[2,1.5],[1.5,.2],[.4,-.2],[1,-1],[-.2,-.7],[-1,-.2],[-1.8,-1],[-2,-.8],[-1.8,0]])horse.lineTo(x,y);mesh(new T.ExtrudeGeometry(horse,{depth:.12,bevelEnabled:false}),metal,0,h/2-2.9,d/2+1.3);
 }
 if(a.detail==='neverfull'){for(const sign of [-1,1]){box(sign*w*.31,h*.1,d/2+.5,.9,h*.7,.4,trim);const knot=mesh(new T.TorusGeometry(1,.25,5,12),metal,sign*w*.43,h*.27,d/2+.8);for(const dx of [-.3,.3]){const cord=box(sign*w*.43+dx,-h*.02,d/2+.5,.25,h*.58,.25,trim);cord.rotation.z=sign*.12;}}}
 if(a.detail==='speedy'){for(const x of [-w*.27,w*.27])box(x,0,d/2+.55,1.8,h-1,.6,trim);box(w*.28,h*.32,d/2+1.2,2.2,3,.9,metal);}
 if(a.detail==='turnlock'){for(const x of [-w*.2,w*.2])box(x,h*.13,d/2+.6,w*.34,1.8,.55,trim);box(0,h*.11,d/2+1.2,3.4,2.3,.8,metal);}
 if(a.detail==='dior'){box(0,0,d/2+.6,w*.93,4,.5,trim);for(let i=0;i<12;i++)box(-w*.38+i*w*.067,0,d/2+.95,.4,1.9,.3,metal);}
}

export function addGarmentBrand(parent,a,p,{worn=false}={}){
 const brand=(p.brand||'').toLowerCase(),detail=a.detail,white=new T.MeshStandardMaterial({color:'#eeeee8',roughness:.85});
 if(detail==='swoosh'){
  const s=new T.Shape();s.moveTo(-3,-.3);s.bezierCurveTo(-4.5,-3.7,-1,-2.8,3.5,.8);s.bezierCurveTo(-.5,-1,-2.8,-2.2,-3,-.3);const m=new T.Mesh(new T.ExtrudeGeometry(s,{depth:.12,bevelEnabled:false}),white);m.scale.setScalar(worn?.45:1);m.position.set(worn?4.2:6,worn?29:7,worn?6.6:2.5);parent.add(m);
 }
 if(detail==='redtab'){const red=new T.Mesh(new T.BoxGeometry(worn?.6:1.1,worn?2:3,.3),new T.MeshStandardMaterial({color:'#b91c27'}));red.position.set(worn?7:11,worn?13:10,worn?-4.2:-4);parent.add(red);}
 if(brand==='patagonia'&&/better sweater|synchilla/i.test(p.name)){const m=new T.Mesh(new T.BoxGeometry(worn?3.2:6,worn?1.2:2,.3),new T.MeshStandardMaterial({color:'#354c65'}));m.position.set(worn?4:6,worn?29:7,worn?6.7:2.5);parent.add(m);}
}
