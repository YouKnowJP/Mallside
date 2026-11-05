import * as T from './vendor/three.module.js';
import {detailBoxes} from './detail-instances.js?v=48.0.0';
import {surfaceTexture} from './scene-finish.js?v=57.0.0';
export function homeGardenPixels(){
 const width=160,height=120,data=new Uint8Array(width*height*4);
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const v=y/height,u=x/width,hill=.58+Math.sin(u*7)*.07,sky=[170+v*35,199+v*21,202+v*12];let c=v>hill?[133-v*34,159-v*28,113-v*24]:sky;
  for(const [cx,cy,rx,ry]of[[.13,.47,.17,.3],[.58,.54,.13,.22],[.9,.43,.22,.37]]){const d=((u-cx)/rx)**2+((v-cy)/ry)**2;if(d<1){const shade=Math.max(0,1-d);c=[76+shade*24,116+shade*26,86+shade*17];}if(Math.abs(u-cx)<.012&&v>cy&&v<.94)c=[123,116,88];}
  const grain=((x*17+y*13)%11-5)*.6;data.set([...c.map(n=>Math.round(n+grain)),255],(y*width+x)*4);
 }return {width,height,data};
}
// Original room props; decorative books, cloth and plants are never merchant stock.
export function buildHomeDetails(w,style){
 const make=(id,parts)=>{const g=new T.Group();g.userData.homeStation=id;w.scene.add(g);detailBoxes(w,g,parts);return g;},wood=style.wood,ink=style.accent,paper='#eee7d5';
 const wardrobe=[];const box=(...p)=>wardrobe.push(p);
 box(-89,36,35.5,18,72,35,wood);box(-79.7,37,35.5,.5,65,31,ink);
 for(const z of[27.2,43.8]){box(-79.25,37,z,.4,61,15,wood);box(-78.8,36,z+(z<35?5:-5),.8,6,.8,'#d3ba8c');}
 for(const z of[20.5,50.5])box(-89,2,z,15,4,2,ink);
 box(-89,73,35.5,19,2,36,ink);make('wardrobe',wardrobe);
 const desk=[];for(let i=0;i<3;i++){desk.push([-82+i*3,29.6+i*.5,-6,10,.65,8,paper]);desk.push([-82+i*3,30+i*.5,-6,.5,.15,7,ink]);}
 desk.push([-61,29.7,-8,8,.8,11,ink],[-61,30.3,-8,6.5,.35,9,paper],[-57.8,30.7,-7.5,.4,.3,7,wood]);make('memories',desk);
 const shelves=[];for(const x of[31,57,83])for(const y of[14,40]){shelves.push([x,y,-5.8,9,.4,3,paper],[x,y+.22,-5.6,4,.1,.5,ink]);}make('shelf',shelves);
 // Curved curtain folds stay inside the existing reveal; use one instanced drawable.
 const g=new T.Group();g.userData.homeStation='window';w.scene.add(g);const geo=new T.CylinderGeometry(1,1,62,10),mat=w.mat('#ded4be',{roughness:.95,map:surfaceTexture(w,'fabric')}),folds=new T.InstancedMesh(geo,mat,12),d=new T.Object3D();w.resources.add(geo);g.add(folds);
 for(let i=0;i<12;i++){d.position.set((i<6?-90:-14)+(i%6)*1.3,57,-37.4+(i%2)*.8);d.scale.set(1,1,1);d.updateMatrix();folds.setMatrixAt(i,d.matrix);}folds.computeBoundingSphere();
 make('door',[[-28,.13,54,30,.2,18,ink],[-28,.26,54,27,.1,15,'#c6b598']]);
 const pixels=homeGardenPixels(),texture=new T.DataTexture(pixels.data,pixels.width,pixels.height,T.RGBAFormat);texture.colorSpace=T.SRGBColorSpace;texture.flipY=true;texture.needsUpdate=true;texture.magFilter=T.LinearFilter;w.resources.add(texture);const view=w.mesh(new T.PlaneGeometry(64,51),new T.MeshBasicMaterial({map:texture}),g);w.resources.add(view.material);view.position.set(-50,56,-42.2);
 const ring=w.mesh(new T.RingGeometry(3.5,4,32),new T.MeshBasicMaterial({color:'#447869',transparent:true,opacity:.8,depthWrite:false}));w.resources.add(ring.material);ring.rotation.x=-Math.PI/2;ring.visible=false;w.homeMarker=ring;
 if(w.canvas)w.canvas.dataset.homeDetailRevision='52';
}
