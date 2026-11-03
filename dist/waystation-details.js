import {buildWaterHousing} from './water-details.js?v=49.0.0';
// Original furnishings fit the existing 22×20 collider; they add no hidden obstacles.
export function buildWaystationDetails(b,x,z,amenity,theme){
 b.box(x,2,z,22,4,20,theme.trim);
 b.box(x,18,z,20,32,18,theme.stone);
 if(amenity==='water'){
  buildWaterHousing(b,x,z,theme);
 }else{
  for(const dx of [-9,9])b.box(x+dx,42,z-6,2,48,2,theme.trim,0,'timber');
  b.box(x,51,z-6,20,27,3,'#567369');
  for(let i=0;i<3;i++){
   const xx=x-6+i*6;b.box(xx,51+i%2*3,z-3.9,5,12,.6,['#ead3a3','#f3e9ce','#d4c4d9'][i]);
   b.cylinder(xx,57+i%2*3,z-3.5,.65,.8,'#c99e59');
   for(let j=0;j<3;j++)b.box(xx,52-j*2+i%2*3,z-3.4,3,.4,.15,'#819180');
  }
  b.box(x,66,z-6,22,3,8,theme.trim,0,'timber');
  for(const side of[-1,1])b.box(x+side*9.5,51,z-3.8,.6,25,.5,'#b99b63',0,'metal');
  for(const yy of[28,32])b.box(x,yy,z+4,18,.7,9,theme.trim,0,'timber');
  for(const dx of[-8,0,8])b.box(x+dx,30,z+4,.6,4,9,theme.trim,0,'timber');
  b.box(x,34,z+4,18,3,9,theme.trim,0,'timber');
  for(const dx of [-5,5]){b.box(x+dx,37,z+4,5,3,6,'#eee4cc');b.box(x+dx,38.6,z+5,3,.2,3,'#8ba190');}
 }
}
export function paintWaystation(w,p,theme){
 const x=p.x+p.width/2,y=p.y+p.height/2;
 w.round(x-11,y-10,22,20,3,theme.stone);
 if(p.amenity==='water'){
  w.round(x-10,y-20,20,10,2,'#647b78');w.ellipse(x,y-5,8,5,'#bac8c1');w.ellipse(x,y-6,6,3,'#718e89');
  w.line(x-5,y-15,x-5,y-7,'#c7d6cc',2);w.line(x-5,y-15,x,y-15,'#c7d6cc',2);w.round(x+6,y-10,3,6,1,'#f3e8cd');
 }else{
  w.round(x-11,y-27,22,24,2,'#567369');
  for(let i=0;i<3;i++){w.round(x-8+i*5.5,y-24+i%2*3,4.5,13,1,['#ead3a3','#f3e9ce','#d4c4d9'][i]);w.line(x-7+i*5.5,y-20+i%2*3,x-5+i*5.5,y-20+i%2*3,'#819180',1);}
  w.round(x-10,y-2,20,3,1,theme.trim);
 }
}
