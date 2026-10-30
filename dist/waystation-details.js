// Original furnishings fit the existing 22×20 collider; they add no hidden obstacles.
export function buildWaystationDetails(b,x,z,amenity,theme){
 b.box(x,2,z,22,4,20,theme.trim);
 b.box(x,18,z,20,32,18,theme.stone);
 if(amenity==='water'){
  for(const dx of [-8,-4,0,4,8])b.box(x+dx,17,z+9.1,1.1,25,.7,theme.trim,0,'metal');
  b.box(x,34,z+1,18,2,14,'#bac8c1',0,'metal');
  b.box(x,35,z+1,14,.5,10,'#718e89');
  for(let i=0;i<5;i++)b.box(x-5+i*2.5,35.4,z+2,.5,.3,7,'#c7d6cc',0,'metal');
  b.box(x,41,z-6,18,12,5,'#647b78',0,'metal');
  b.box(x,45,z-3.2,13,3,.6,'#a8c9bf');
  for(const dx of [-5,5]){b.cylinder(x+dx,37,z-1,1,5,'#c7d6cc');b.box(x+dx,39,z+1,2,2,5,'#a8c9bf',0,'metal');}
  b.cylinder(x+8,40,z+5,1.8,7,'#eee6d2');
  for(const y of [38,40,42])b.cylinder(x+8,y,z+5,2,.5,'#d4c6a8');
 }else{
  for(const dx of [-9,9])b.box(x+dx,42,z-6,2,48,2,theme.trim,0,'timber');
  b.box(x,51,z-6,20,27,3,'#567369');
  for(let i=0;i<3;i++){
   const xx=x-6+i*6;b.box(xx,51+i%2*3,z-3.9,5,12,.6,['#ead3a3','#f3e9ce','#d4c4d9'][i]);
   b.cylinder(xx,57+i%2*3,z-3.5,.65,.8,'#c99e59');
   for(let j=0;j<3;j++)b.box(xx,52-j*2+i%2*3,z-3.4,3,.4,.15,'#819180');
  }
  b.box(x,66,z-6,22,3,8,theme.trim,0,'timber');
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
