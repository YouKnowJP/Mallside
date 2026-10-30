import * as T from './vendor/three.module.js';
import {PRODUCT_PHOTOS} from './product-photos.js?v=40.0.0';
import {isBookProduct,readingGesture} from './book-tools.js?v=38.0.0';
// Solid adapted books: exact source cover, neutral original back/spine and paper edges.
export function placeBook(w,p,x,y,z,width,height,parent=w.scene){
 const g=new T.Group(),ratio=Math.max(.45,Math.min(1.7,p.bookAspect||.66)),h=Math.min(height,width/ratio),bw=h*ratio,d=h*(p.bookFormat==='Hardcover'?.12:.08),edge=p.bookFormat==='Hardcover'?.55:.3,cover=w.mat(p.color||'#526b69',{roughness:.88}),paper=w.mat('#e8e0cc',{roughness:1});parent.add(g);g.position.set(x,y,z);
 w.box(0,0,0,bw*.95,h*.96,d*.85,paper,g);for(const side of [-1,1])w.box(0,0,side*d/2,bw,h,edge,cover,g);w.box(-bw/2+.4,0,0,1,h,d,cover,g);
 for(const dy of [-.35,-.15,.05,.25])w.box(bw*.47,h*dy,0,.18,.14,d*.75,'#bfb59d',g);
 const data=PRODUCT_PHOTOS[p.id];if(data){let tx=w.textures.get(data.path);if(!tx){tx=new T.TextureLoader().load(data.path);tx.colorSpace=T.SRGBColorSpace;w.textures.set(data.path,tx);w.resources.add(tx);}const mat=new T.MeshBasicMaterial({map:tx});w.resources.add(mat);const front=w.mesh(new T.PlaneGeometry(bw,h),mat,g);front.position.z=d/2+edge;front.castShadow=false;}
 g.userData={productId:p.id,bookISBN:p.bookISBN,source:p.source,volumetric:true};return g;
}
export function createReadingProp(w){
 const g=new T.Group();w.player.add(g);g.position.set(0,31.5,10.5);g.rotation.x=.18;
 w.box(0,-.4,0,14,.5,9,'#607968',g);for(const x of [-3.5,3.5])w.box(x,0,0,6.7,.6,8.6,'#eee7d5',g);w.box(0,.1,0,.4,.7,8.8,'#d3c6a8',g);
 for(const x of [-3.5,3.5])for(let i=0;i<4;i++)w.box(x,.34,-2.5+i*1.5,4.5,.04,.10,'#b1bbaa',g);
 const leaf=new T.Group();g.add(leaf);w.box(3.45,.42,0,6.7,.08,8.5,'#f7f1e3',leaf);g.userData.leaf=leaf;g.userData.originalPages=true;return g;
}
export function updateReadingProp(prop,time,reduced){const pose=readingGesture(time,reduced);prop.userData.leaf.rotation.z=pose.page===0?0:-pose.page;return pose;}
