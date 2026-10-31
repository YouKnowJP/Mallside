import * as T from './vendor/three.module.js';
import {STUDY_PALETTES,studyFor,studioGroup} from './studio-study.js?v=43.0.0';
import {surfaceTexture} from './scene-finish.js?v=33.0.0';

// Joinery, tools and samples remain inside the lounge's reserved display/rail footprints.
export function buildStudyStation(w,st,style,r){
 const x=r.x+r.width/2,z=r.y+r.height/2,group=studioGroup(st),frame=w.mat(style.trim,{roughness:.55}),paper='#f2ead8',samples=[];
 w.box(x,49,z-18,82,39,4,frame);w.box(x,49,z-15.5,76,33,1,paper);
 for(let i=0;i<3;i++){
  const dx=(i-1)*25,mat=w.mat(STUDY_PALETTES[0].colors[i],{roughness:.85,bumpMap:surfaceTexture(w,group==='textile'?'fabric':'stone',true),bumpScale:.06});samples.push(mat);
  w.box(x+dx,31,z+7,23,2,24,style.trim);
  if(group==='textile'){
   for(let layer=0;layer<3;layer++)w.box(x+dx,33+layer*2,z+7,20,1.8,21,mat);
   w.box(x+dx,50,z-14,20,27,1.2,mat);for(const side of [-8,8])w.box(x+dx+side,50,z-13.3,.4,24,.3,paper);
   w.cyl(x+dx,65,z-14,1.2,2,style.trim);
  }else if(group==='light'){
   const dome=w.mesh(new T.SphereGeometry(8,16,10),mat);dome.position.set(x+dx,36,z+7);dome.scale.y=.65;
   w.box(x+dx,49,z-14,20,24,1.2,mat);w.cyl(x+dx,42,z+7,1.3,2,paper);
  }else{
   w.box(x+dx,39,z+4,20,14,15,mat);w.box(x+dx,47,z-14,20,24,1.2,mat);
   w.box(x+dx-4,39,z+12,1,10,.5,paper);w.box(x+dx+5,39,z+12,1,10,.5,paper);
  }
  w.box(x+dx,32,z+23,14,.6,4,paper);
 }
 w.box(x+39,33,z+9,3,2,27,'#c8aa72');for(let i=0;i<6;i++)w.box(x+39,34.1,z-1+i*4,2,.2,.3,style.trim);
 w.studioStudy={store:st.id,samples,signature:null,group};updateStudioStudy(w);
}
export function updateStudioStudy(w){
 const study=w.studioStudy;if(!study)return;const d=w.studioPreview?.store===study.store?w.studioPreview:studyFor(w.state,study.store),signature=d.palette+':'+d.finish;if(study.signature===signature)return;
 const palette=STUDY_PALETTES.find(p=>p.id===d.palette)||STUDY_PALETTES[0];for(const [i,m]of study.samples.entries()){m.color.set(palette.colors[i]);m.roughness=d.finish==='smooth'?.24:.88;m.bumpScale=d.finish==='smooth'?0:.06;}
 study.signature=signature;w.canvas.dataset.materialStudy=signature;w.canvas.dataset.materialStudyGroup=study.group;
}
export function buildPlanningDetails(w,st,style,layout){
 const timber=w.mat(style.fixture,{map:surfaceTexture(w,'timber'),roughness:.72}),paper='#eee5d0',group=studioGroup(st);
 for(const [i,r]of layout.displays.entries()){
  const x=r.x+r.width/2,z=r.y+r.height/2;
  // Slatted aprons, recessed handles and workbench foot rails add readable construction.
  for(const dz of [-26,26]){w.box(x,24,z+dz,84,7,2,timber);w.box(x,24,z+dz*1.04,17,1,1,style.trim);}
  for(const dx of [-35,35])w.box(x+dx,7,z,3,2,43,style.trim);
  if(i===1)continue;
  w.box(x-34,32,z+16,14,1.6,18,'#8b9e8a');w.box(x-34,33,z+16,12,.5,16,paper);for(let j=0;j<4;j++)w.box(x-34,33.3,z+11+j*3,9,.2,.3,style.trim);
 }
 const r=layout.rail,x=r.x+r.width/2,z=r.y+r.height/2;
 for(const dx of [-72,0,72]){
  w.box(x+dx,46,z-12,62,76,5,timber);w.box(x+dx,46,z-8.7,54,66,1,paper);
  if(group==='textile'){for(let j=0;j<3;j++)w.box(x+dx-15+j*15,48,z-7.5,12,43,1,STUDY_PALETTES[j].colors[(j+1)%3]);}
  else if(group==='light'){for(let j=0;j<4;j++)w.box(x+dx+(j%2*22-11),34+Math.floor(j/2)*25,z-7.5,18,20,1,STUDY_PALETTES[j%3].colors[1]);}
  else{for(let j=0;j<3;j++){w.box(x+dx,27+j*20,z-5,43,2,10,style.trim);w.box(x+dx-10+j*10,34+j*20,z-5,14,12,8,STUDY_PALETTES[j].colors[0]);}}
  w.box(x+dx,86,z-7,56,2,7,style.trim);w.box(x+dx,84.5,z-7,50,1,5,'#eddbb5');
 }
 w.canvas.dataset.planningDetailRevision='41';
}
