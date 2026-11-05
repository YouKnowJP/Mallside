import * as T from './vendor/three.module.js';
import {detailBoxes} from './detail-instances.js?v=48.0.0';
import {updateStudioStudy} from './studio-details.js?v=57.0.0';
// Original kitchenware joinery, source cards and glaze samples; never purchasable extra stock.
export function buildTablewareStudio(w,st,style){
 const r=w.layout.rail,cx=r.x+r.width/2,z=r.y+r.height/2,parts=[],box=(...v)=>parts.push(v);
 box(cx,10,z,r.width-8,20,r.height-8,style.fixture);box(cx,21,z,r.width-6,2,r.height-6,style.trim);
 for(const [i,dx]of[-69,0,69].entries()){box(cx+dx,45,z-16,64,46,3,style.wall);box(cx+dx,69,z-16,66,3,4,style.trim);box(cx+dx,24,z+1,58,4,30,'#e7e2d4');for(const side of[-1,1])box(cx+dx+side*32,45,z-16,2,46,4,style.trim);w.photo(st.products[i],cx+dx,40,z+2,38,28);box(cx+dx,26.3,z+16,31,.5,7,'#f2ecd9');}
 for(const[x,i]of[[558,0],[600,1],[642,2]]){box(x,34,150,32,1.6,25,style.trim);box(x,35,150,29,.4,22,'#eee8d9');for(let j=0;j<3;j++)box(x-9+j*9,36.2,153,7,.8,13,['#a98f6d','#d1bb91','#718a7a'][j]);box(x,44,139,28,15,1.4,style.fixture);box(x,44,140,24,11,.3,'#efe6d2');}
 detailBoxes(w,w.scene,parts);const samples=[558,600,642].map(x=>{const mat=w.mat('#d1bb91',{roughness:.7}),m=w.mesh(new T.CylinderGeometry(6,6,1.1,20),mat);m.position.set(x,37.8,149);return mat;});w.studioStudy={store:st.id,samples,signature:null,group:'workshop'};updateStudioStudy(w);w.canvas.dataset.tablewareStudio='49';
}
