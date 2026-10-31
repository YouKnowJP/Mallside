import * as T from './vendor/three.module.js';
import {PHOTO_FRAMES,PHOTO_POSES} from './life-content.js?v=26.0.0';
export const latestCenterPortrait=s=>[...(s.photoAlbum||[])].reverse().find(p=>p.mallId===s.mallId&&PHOTO_FRAMES[p.frame]&&PHOTO_POSES.includes(p.pose));
// An original camera/backdrop/album tray fits the existing 40×34 kiosk footprint.
export function buildPhotoKiosk(w,b,x,z,theme,approach){
 b.box(x,51,z-12,36,40,2,theme.trim);b.box(x,51,z-10.7,32,36,.5,'#d6c9ba');
 for(const dx of [-11,0,11])b.box(x+dx,51,z-10.3,9,33,.3,['#95a99b','#d6b2a4','#91a5b5'][(dx+11)/11]);
 b.box(x,38,z,16,12,10,'#40554e');b.box(x+5,45,z-1,4,3,5,'#e9d6ad');
 for(const [radius,depth,zz,color]of [[4,4,z+6,'#596c65'],[3,.5,z+8.2,'#233c42']]){const lens=w.mesh(new T.CylinderGeometry(radius,radius,depth,20),w.mat(color,{metalness:.25,roughness:.22}));lens.rotation.x=Math.PI/2;lens.position.set(x,38,zz);}
 for(const dx of [-11,11]){b.box(x+dx,37,z+11,8,1.3,8,'#eee5d3');b.box(x+dx,37.8,z+11,6,.2,5,theme.accent);}
 const marker=w.box(x+11,38.2,z+11,4,.3,3,w.mat('#ddd2be',{roughness:.8}));w.photoKiosks??=[];w.photoKiosks.push({marker,signature:null,baseX:x+11});updatePhotoKiosks(w);
 const key='photo-album',hit=w.box(x+11,40,z+11,10,8,10,w.mat('#ffffff',{transparent:true,opacity:0,depthWrite:false}));hit.castShadow=false;w.tag(hit,key,approach);
 const label=w.label('Photo album ↗',x+8,94,z+9,58,theme.accent);w.tag(label,key,approach);w.nearLabels.push({object:label,x:x+8,z:z+9,radius:100,directory:true});
 w.canvas.dataset.photoKioskRevision='44';
}
export function updatePhotoKiosks(w){
 const p=latestCenterPortrait(w.state),signature=p?[p.id,p.frame,p.pose].join(':'):'empty';
 for(const k of w.photoKiosks||[]){if(k.signature===signature)continue;k.marker.material.color.set(p?PHOTO_FRAMES[p.frame].color:'#ddd2be');k.marker.position.x=k.baseX+(p?PHOTO_POSES.indexOf(p.pose)-1:0);k.signature=signature;}
 if(w.photoKiosks?.length)w.canvas.dataset.photoKioskMemory=p?p.frame+':'+p.pose:'empty';
}
