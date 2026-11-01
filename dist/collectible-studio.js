import {detailBoxes} from './detail-instances.js?v=47.0.0';
import {updateStudioStudy} from './studio-details.js?v=47.0.0';

// Original comparison trays and seam samples occupy the existing source-desk and rail.
export function buildCollectibleStudio(w,st,style){
 const parts=[],box=(...v)=>parts.push(v),paper='#f1e8d9';
 for(const [i,x]of [570,600,630].entries()){
  box(x,37,151,25,2,25,style.trim);box(x,38.3,151,22,.6,22,paper);
  box(x,57,133,24,27,1,['#dba6be','#bbccbd','#bdafcb'][i]);
  for(let j=0;j<6;j++){box(x-8,47+j*3,133.8,.4,1.2,.3,paper);box(x+8,47+j*3,133.8,.4,1.2,.3,paper);}
  box(x,38.8,158,15,.2,4,'#eee0c7');
 }
 const r=w.layout.rail,cx=r.x+r.width/2,cz=r.y+r.height/2;
 box(cx,11,cz,r.width-8,14,r.height-8,style.fixture);box(cx,18.6,cz,r.width-6,1,r.height-6,paper);
 for(const dx of [-22,0,22]){box(cx+dx,20,cz,18,2,22,style.trim);for(let j=0;j<4;j++)box(cx+dx-5+j*3,21.3,cz,.4,.4,16,'#b99472');}
 detailBoxes(w,w.scene,parts);
 const samples=[570,600,630].map(x=>{const mat=w.mat('#d6b9c5',{roughness:.9});w.box(x,40.4,146,16,3,11,mat);return mat;});
 w.studioStudy={store:st.id,samples,signature:null,group:'workshop'};updateStudioStudy(w);w.canvas.dataset.collectibleStudio='47';
}
