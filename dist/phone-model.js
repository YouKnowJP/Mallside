import * as T from './vendor/three.module.js';
export const isPhone=p=>p?.type==='phone'&&p.phoneProfile?.reviewed===true;
function face(width,height,radius){const s=new T.Shape(),x=-width/2,y=-height/2,r=Math.min(radius,width/2,height/2);s.moveTo(x+r,y);s.lineTo(x+width-r,y);s.quadraticCurveTo(x+width,y,x+width,y+r);s.lineTo(x+width,y+height-r);s.quadraticCurveTo(x+width,y+height,x+width-r,y+height);s.lineTo(x+r,y+height);s.quadraticCurveTo(x,y+height,x,y+height-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
// Original unlettered handset: source body proportions, simplified lenses and controls.
export function createPhone(p){
 const a=p.phoneProfile,k=.11,width=a.widthMM*k,height=a.heightMM*k,depth=a.depthMM*k,root=new T.Group(),frame=new T.MeshStandardMaterial({color:p.color,metalness:.4,roughness:.42}),glass=new T.MeshStandardMaterial({color:p.color,roughness:.28,metalness:.07}),black=new T.MeshStandardMaterial({color:'#10191d',roughness:.2,metalness:.18}),rim=new T.MeshStandardMaterial({color:a.rimColor,roughness:.36,metalness:.6}),screen=new T.MeshStandardMaterial({color:'#1c2e36',roughness:.2}),light=new T.MeshStandardMaterial({color:'#e4e5d5',roughness:.45});
 const add=(geo,mat,x,y,z,role)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;m.userData.role=role;root.add(m);return m;};
 const panel=(x,y,z,w,h,d,r,mat,role)=>add(new T.ExtrudeGeometry(face(w,h,r),{depth:d,bevelEnabled:false,curveSegments:12,steps:1}),mat,x,y,z-d/2,role);
 panel(0,height/2,0,width,height,depth,width*.105,frame,'frame');panel(0,height/2,depth/2+.025,width-.12,height-.12,.05,width*.1,glass,'back-glass');panel(0,height/2,-depth/2-.025,width-.15,height-.15,.05,width*.1,black,'front-bezel');panel(0,height/2,-depth/2-.058,width-.35,height-.35,.025,width*.09,screen,'neutral-front');
 // An original neutral screen, without OS artwork, a logo or a biometric display.
 panel(0,height*.91,-depth/2-.08,width*.27,.34,.025,.16,black,'front-sensor');
 panel(-width*.28,height*.815,depth/2+.12,width*.27,height*.24,.22,width*.13,frame,'camera-island');
 for(const yy of[height*.76,height*.87]){const lens=add(new T.CylinderGeometry(width*.105,width*.105,.18,24),rim,-width*.28,yy,depth/2+.29,'lens-rim');lens.rotation.x=Math.PI/2;const aperture=add(new T.CylinderGeometry(width*.08,width*.08,.04,24),black,-width*.28,yy,depth/2+.4,'rear-lens');aperture.rotation.x=Math.PI/2;const glint=add(new T.CircleGeometry(width*.035,16),screen,-width*.29,yy+.06,depth/2+.425,'lens-glint');}
 const flash=add(new T.CylinderGeometry(.24,.24,.06,16),light,width*.015,height*.815,depth/2+.09,'flash');flash.rotation.x=Math.PI/2;
 // Left/right names follow the manufacturer front view; this model shows its back.
 for(const [y,h,role]of[[height*.74,.8,'volume-up'],[height*.65,.8,'volume-down'],[height*.84,.5,'action-button']])add(new T.BoxGeometry(.08,h,depth*.65),rim,width/2+.04,y,0,role);
 for(const [y,h,role]of[[height*.74,1.3,'side-button'],[height*.38,1,'camera-control']])add(new T.BoxGeometry(.08,h,depth*.65),rim,-width/2-.04,y,0,role);
 add(new T.BoxGeometry(1,.12,.28),black,0,.04,0,'usb-c');for(const side of[-1,1])for(let i=0;i<4;i++)add(new T.BoxGeometry(.13,.08,.16),black,side*(1.2+i*.25),.03,0,'speaker-port');
 root.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(root),size=bounds.getSize(new T.Vector3());for(const c of root.children)c.position.y-=bounds.min.y;
 root.userData={productId:p.id,source:p.source,style:'smartphone',size:{x:size.x,y:size.y,z:size.z},bodyDimensions:{width,height,depth},volumetric:true,adaptedProportions:true,noWirelessService:true};return root;
}
