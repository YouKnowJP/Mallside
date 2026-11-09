import * as T from './vendor/three.module.js';
import {detailBoxes} from './detail-instances.js?v=48.0.0';
import {retailLight} from './retail-light.js?v=68.0.0';

export function buildHandsetCounter(w,st,style){
 const top='#e0d1b6',ink='#435760',metal='#68838e',parts=[];
 for(const [i,p] of st.products.entries()){
  const x=562+i*38;
  parts.push([x,33,150,32,2,29,top],[x,36,146,12,4,9,ink],
   [x,35,161,26,.7,5,metal],[x,49,137,23,15,1.4,p.color]);
  const phone=w.photo(p,x,42,147,7,10);
  phone.rotation.y=(i-1)*.30+Math.PI;
 }
 parts.push([600,17,166,108,20,3,ink],[600,24,168,91,1.4,1.4,metal],
  [600,85,136,107,2,7,ink],[600,83.8,138,100,.5,3,'#f5e1ae']);
 detailBoxes(w,w.scene,parts);
 retailLight(w,w.scene,600,34.1,152,105,24,true);
 w.label('HANDSET COMPARISON',600,77,134,80,style.accent);
 w.canvas.dataset.handsetCounter='70';
}

const libraryColors=['#34605c','#a45642','#ca9b55','#675479','#56776f','#99724d'];

export function buildGameChestShelf(w,x,z,index) {
 const walnut='#47372f',paper='#e6c994',parts=[
  [x,53,z-16,77,45,4,walnut],[x-38,51,z-9,3,42,16,walnut],[x+38,51,z-9,3,42,16,walnut]
 ];
 for(const [row,y] of [34,52,70].entries()){
  parts.push([x,y-2,z-8,74,2,18,'#855d44']);
  for(let col=0;col<5;col++){
   const sx=x-29+col*14,color=libraryColors[(index+row*2+col)%libraryColors.length];
   const height=10+(index+row+col)%4;
   parts.push([sx,y+height/2-1,z-8,12,height,12,color],
    [sx,y+height/2+1,z-1.8,7,1.5,.45,paper],[sx,y+1,z-1.8,9,.6,.45,walnut]);
  }
 }
 parts.push([x,32,z+11,56,.65,15,'#d8bb84'],[x-11,33,z+11,22,1.2,12,libraryColors[index%libraryColors.length]],
  [x+13,34,z+11,15,3,10,'#805741']);
 detailBoxes(w,w.scene,parts);
}

export function buildGameNightTable(w,layout){
 const f=layout.fitting,x=f.x+f.width/2,z=f.y+18,walnut='#51392d',amber='#c48a57',cream='#f1d7a3',green='#284d4a',violet='#4d3b59';
 const parts=[
  [x,30,z,100,5,25,walnut],[x,32.8,z,97,.7,23,amber],
  [x,32.8,z,86,.9,20,green],[x,31.5,z+12,96,2,1,amber],
  [x-40,14,z,4,28,18,walnut],[x+40,14,z,4,28,18,walnut],[x,10,z-5,84,3,4,walnut],
  [x,62,z-9,93,57,3,walnut],[x,64,z-7,74,42,1,'#355857'],
  [x,58,z-6,74,1.5,.5,cream],[x,83,z-6,74,1.5,.5,cream],
  [x-43,61,z-6,8,45,4,amber],[x+43,61,z-6,8,45,4,amber],
  [x+24,33.5,z,32,1,17,violet],[x+24,34.1,z-7,30,.35,.55,cream],
  [x+24,34.1,z+7,30,.35,.55,cream]
 ];
 for(const [i,dx] of [15,24,33].entries()){
  const tone=['#986468','#536b75','#bd945f'][i];
  parts.push([x+dx,34.4,z,7,.75,10,tone,.13*(i-1)],[x+dx,34.85,z+1.5,2.5,.18,3,cream,.13*(i-1)]);
 }
 for(const [i,dx] of [-43,43].entries()){
  parts.push([x+dx,72,z-4,7,1,9,cream],[x+dx,69,z-2,6,5,6,'#bc8656']);
  for(let k=0;k<3;k++)parts.push([x+dx,38+k*3.5,z-4,8,2.5,6,libraryColors[i*3+k]]);
 }
 for(const [dx,dz] of [[-42,5],[-37,6],[4,5]])parts.push([x+dx,35,z+dz,3,3,3,cream,dx*.03]);
 for(const [dx,dz] of [[-31,-4],[-17,1],[-8,2]])parts.push([x+dx,36,z+dz,3,3,2.8,'#d59351',.1]);
 detailBoxes(w,w.scene,parts);
 const tileGeometry=new T.CylinderGeometry(4.6,4.6,1,6);
 const tiles=[[-35,0],[-28,-3],[-21,0],[-14,-3],[-7,0],[-28,4],[-14,4]];
 for(const [i,[dx,dz]] of tiles.entries()){
  const tile=w.mesh(tileGeometry,w.mat(libraryColors[i%libraryColors.length]));
  tile.position.set(x+dx,33.75,z+dz);tile.rotation.y=Math.PI/6;
 }
 for(const dx of [-38,40])w.cyl(x+dx,35,z+7,1.6,2.5,'#b89455');
 retailLight(w,w.scene,x,34.3,z,91,21,true);
 retailLight(w,w.scene,x,69,z-5.7,66,34);
 const sign=w.label('TAYLOR’S TABLE',x,73,z-5,67,'#fae1ad','#294b4b');
 sign.scale.y*=.84;
 w.canvas.dataset.gameNightTable='70';
 w.canvas.dataset.gameChestFurniture='72';
}
