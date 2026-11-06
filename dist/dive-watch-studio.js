import {detailBoxes} from './detail-instances.js?v=48.0.0';
import {updateStudioStudy} from './studio-details.js?v=62.0.0';

// An original watch salon: lined trays, glass-edge casework, storage and neutral reflection samples.
export function buildDiveWatchStudio(w,st,style){
 const r=w.layout.rail,cx=r.x+r.width/2,cz=r.y+r.height/2,parts=[],box=(...p)=>parts.push(p),ink='#413f3b',wood='#8c6b50',lining='#b9ac93',paper='#e9e1ce';
 box(cx,17,cz,r.width-8,34,r.height-8,wood);box(cx,35.5,cz,r.width-4,3,r.height-4,ink);for(const dx of[-r.width*.24,r.width*.24]){box(cx+dx,38,cz,45,2,30,lining);box(cx+dx,39.3,cz,39,.6,25,paper);box(cx+dx,14,cz+r.height/2-3,r.width*.43,22,1,ink);box(cx+dx,24,cz+r.height/2-2,22,1,1,paper);}
 const watch=st.products[0];w.photo(watch,cx-r.width*.24,44,cz,9,8);box(cx+r.width*.24,41,cz,24,2,17,paper);for(let i=0;i<4;i++)box(cx+r.width*.24-8+i*5,42.1,cz,.3,.2,10,ink);
 const samples=[];for(const[i,x]of[563,600,637].entries()){box(x,34,148,29,2,25,ink);const m=w.mat(['#bba37a','#d9cfb4','#5e7770'][i],{metalness:.25,roughness:.72});w.box(x,36.3,147,24,2.5,20,m);samples.push(m);box(x,38,155,19,.4,4,paper);}
 box(630,17.5,630,22,1,13,paper);for(let i=0;i<4;i++)box(624+i*4,18.1,630,.3,.2,8,ink);
 // Thin glass dividers and plinth lights stay on the reserved rail.
 const glass=w.mat('#c4d2ca',{transparent:true,opacity:.14,depthWrite:false,roughness:.14});for(const sign of[-1,1])w.box(cx+sign*(r.width/2-8),45,cz,1,16,r.height-16,glass);for(const dx of[-r.width*.28,r.width*.28]){box(cx+dx,40,cz-r.height/2+8,2,8,2,ink);box(cx+dx,45,cz-r.height/2+8,18,1.2,4,paper);}
 detailBoxes(w,w.scene,parts);w.studioStudy={store:st.id,samples,signature:null,group:'light'};updateStudioStudy(w);w.canvas.dataset.diveWatchStudio='62';
}

// Stock cases use only this shop's verified reference; the spare pads are original display props.
export function buildDiveWatchStockCase(w,p,r,style){
 const cx=r.x+r.width/2,cz=r.y+r.height/2,wall=r.kind==='wall',parts=[],box=(...a)=>parts.push(a),ink='#405b51',paper='#e9e1ce';
 box(cx,18,cz,r.width,36,r.height,style.fixture);box(cx,37,cz,r.width-2,2,r.height-2,ink);
 const trayZ=wall?[cz]:[cz-r.height*.28,cz+r.height*.28];
 for(const z of trayZ){box(cx,39,z,Math.min(34,r.width-6),2,27,'#b9ac93');box(cx,40.3,z,Math.min(29,r.width-9),.6,22,paper);const watch=w.photo(p,cx,45,z,9,8);if(wall)watch.rotation.y=r.side<0?Math.PI/2:-Math.PI/2;box(cx,41,z+10,Math.min(20,r.width-10),1,3,ink);}
 // An open glass surround and warm strip lighting leave the real-size object legible.
 const glass=w.mat('#c4d2ca',{transparent:true,opacity:.12,depthWrite:false,roughness:.15});for(const sign of[-1,1]){w.box(cx+sign*(r.width/2-2),48,cz,1,20,r.height-4,glass);box(cx+sign*(r.width/2-3),37.5,cz,.8,1,r.height-8,paper);}
 for(const z of[cz-r.height/2+5,cz+r.height/2-5]){box(cx,18,z,r.width-6,25,1,ink);box(cx,26,z,r.width*.4,1,1,paper);}
 detailBoxes(w,w.scene,parts);
}
