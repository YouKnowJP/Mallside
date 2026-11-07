import {detailBoxes} from './detail-instances.js?v=48.0.0';
import {retailLight} from './retail-light.js?v=68.0.0';

export function furnishFittingBay(w,parent,x,z,style){
 const linen='#e6d8be',brass='#a48a63',timber=style.fixture;
 detailBoxes(w,parent,[
  [x,44,z,38,78,2,brass],
  [x-21,44,z+2,1.8,71,1.8,linen],[x+21,44,z+2,1.8,71,1.8,linen],
  [x-14,8,z+15,24,4,15,timber],[x-14,10.8,z+15,24,2,14,linen],
  [x-23,3,z+15,2.5,6,11,brass],[x-5,3,z+15,2.5,6,11,brass],
  [x+23,22,z+11,13,2.4,14,timber],[x+23,20,z+11,2,3,9,brass],
  [x+26,55,z+6,4,11,2,timber],[x+26,54,z+8,2,1.8,4,brass],
  [x+26,49,z+8,2,1.8,4,brass]
 ]);
 w.box(x,44,z+1.25,34,74,.5,w.mat('#b7cdc6',{metalness:.72,roughness:.22}),parent);
 retailLight(w,parent,x,47,z+1.75,32,69);
}
