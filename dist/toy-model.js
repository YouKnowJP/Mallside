import * as T from './vendor/three.module.js';

export const isTableToy = p => ['tower', 'cube', 'letters'].includes(p?.toyProfile?.kind);

function blocks(parent, specs) {
 const geometry = new T.BoxGeometry();
 const material = new T.MeshStandardMaterial({color:'#ffffff', roughness:.65});
 const mesh = new T.InstancedMesh(geometry, material, specs.length);
 const frame = new T.Object3D();
 const color = new T.Color();
 specs.forEach(([x,y,z,w,h,d,finish,yaw = 0,pitch = 0], i) => {
  frame.position.set(x,y,z);
  frame.scale.set(w,h,d);
  frame.rotation.set(pitch,yaw,0);
  frame.updateMatrix();
  mesh.setMatrixAt(i,frame.matrix);
  mesh.setColorAt(i,color.set(finish));
 });
 mesh.computeBoundingBox();
 mesh.castShadow = mesh.receiveShadow = true;
 parent.add(mesh);
}

function tower(root) {
 const pieces = [], wood = ['#c3935a','#cfa472','#dfb985'];
 for (let layer=0; layer<18; layer++) {
  const cross = layer % 2;
  for (let piece=-1; piece<=1; piece++) {
   const shifted = layer===10 && piece===0 ? 2.5 : 0;
   pieces.push([cross ? shifted : piece*3.1, .88+layer*1.76, cross ? piece*3.1 : shifted,
    3,1.73,9.1,wood[(layer+piece+1)%3],cross*Math.PI/2]);
  }
 }
 blocks(root,pieces);
}

function cube(root) {
 const pieces = [[0,5.5,0,11,11,11,'#272a2a']];
 const finishes = ['#e9e8d7','#da9147','#397fba','#e65b49','#3ca174','#efc654'];
 for (let side=0; side<6; side++) {
  for (let row=-1; row<=1; row++) {
   for (let column=-1; column<=1; column++) {
    const a=column*3.55,b=row*3.55,f=finishes[side];
    if (side<4) {
     const angle=side*Math.PI/2;
     const x=a*Math.cos(angle)+5.56*Math.sin(angle), z=-a*Math.sin(angle)+5.56*Math.cos(angle);
     pieces.push([x,5.5+b,z,3.1,3.1,.16,f,angle]);
    } else pieces.push([a,side===4?11.06:-.06,b,3.1,3.1,.16,f,0,Math.PI/2]);
   }
  }
 }
 blocks(root,pieces);
}

function letters(root) {
 const pieces=[[0,.8,0,21,1.6,21,'#b68b59']];
 const finishes=['#b7c5a3','#d2a36c','#a19cb5','#d99a85'];
 for(let row=0;row<7;row++)for(let col=0;col<7;col++){
  const finish=(row===3&&col===3)?3:(row===col||row+col===6)?2:(row+col)%3===0?1:0;
  pieces.push([(col-3)*2.8,1.7,(row-3)*2.8,2.65,.24,2.65,finishes[finish]]);
 }
 for(let i=0;i<4;i++)pieces.push([(i-1.5)*2.8,2.3,0,2.3,1,2.3,'#e8cb91']);
 blocks(root,pieces);
}

export function createTableToy(p) {
 const root = new T.Group();
 const kind = p.toyProfile.kind;
 ({tower,cube,letters})[kind](root);
 const bounds = new T.Box3().setFromObject(root);
 const size = bounds.getSize(new T.Vector3());
 root.children[0].position.y = -bounds.min.y;
 root.userData = {productId:p.id,source:p.source,style:'table-toy-'+kind,
  size:{x:size.x,y:size.y,z:size.z},volumetric:true,adaptedProportions:true};
 return root;
}
