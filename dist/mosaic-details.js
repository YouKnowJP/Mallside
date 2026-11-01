import * as T from './vendor/three.module.js';
import {detailBoxes} from './detail-instances.js?v=47.0.0';
export function mosaicTurns(w){const p=w.commonsPreview,s=w.state;if(p?.mallId===s.mallId&&p.floor===(s.floor||0))return [...p.turns];return (s.commonsNotes||[]).some(n=>n.kind==='mosaic'&&n.mallId===s.mallId&&n.floor===(s.floor||0))?[0,1,2]:[1,2,3];}
const ease=t=>{const x=Math.max(0,Math.min(1,t));return x*x*x*(x*(x*6-15)+10);};
export function mosaicTurn(from,to,elapsed,reduced=false){const delta=Math.atan2(Math.sin(to-from),Math.cos(to-from));return reduced?(to||0):from+delta*ease(elapsed/.36);}
export function buildMosaicStudy(w,x,z,theme){
 const root=new T.Group();root.position.set(x,29,z);w.scene.add(root);const base=[],box=(...v)=>base.push(v);
 box(0,0,0,28,2,28,theme.trim);box(0,1.1,0,26,.4,26,'#ddd0b1');
 for(let i=0;i<7;i++)for(const side of [-1,1]){box(-11+i*3.6,1.6,side*11,3,.6,3,i%2?theme.inlay:theme.wall);box(side*11,1.6,-7+i*2.3,3,.6,1.8,i%2?theme.wall:theme.inlay);}
 // Spare tesserae, an original notebook and inset joinery stay inside the old 30-unit footprint.
 box(0,2,7.3,15,.7,3.5,theme.wall);for(let i=0;i<3;i++)box(-4+i*4,2.6,7.3,2,.25,.6,theme.accent);
 for(const x of [-9,9]){box(x,2,7.2,4.5,.8,4.5,theme.trim);box(x,2.5,7.2,3.8,.2,3.8,'#f1e7cf');for(let j=0;j<3;j++)box(x-1+j,2.7,7.2,.25,.15,2.7,theme.accent);}
 for(const side of [-1,1])box(side*12.4,-1.1,0,.6,.5,23,theme.inlay);
 const staticMesh=detailBoxes(w,root,base),tiles=[],turns=mosaicTurns(w);for(let i=0;i<3;i++){
  const tile=new T.Group();tile.position.set((i-1)*8.5,2,0);tile.rotation.y=-turns[i]*Math.PI/2;root.add(tile);tiles.push(tile);const parts=[[0,0,0,7.5,1.3,7.5,['#bf805f','#698f83','#d1b46e'][i]]];
  for(const dx of [-2,0,2])for(const dz of [-2,0,2])parts.push([dx,.7,dz,1.8,.12,1.8,i%2?'#93aca0':'#ead5a9']);
  parts.push([0,.92,0,.65,.3,4,'#fff5d9']);for(const sign of [-1,1])parts.push([sign*.75,.92,-1.25,.65,.3,2,'#fff5d9',sign*Math.PI/4]);detailBoxes(w,tile,parts);
 }
 const marker=w.box(0,2.8,7.3,1,.3,1,w.mat('#d7c8a5'),root);w.mosaicStudy={root,tiles,marker,turns:turns.join(':'),motions:tiles.map(t=>({from:t.rotation.y,to:t.rotation.y,start:0})),staticMesh};root.userData={originalStudy:true,footprint:30};w.canvas.dataset.mosaicCourtRevision='47';updateMosaicStudy(w);return root;
}
export function updateMosaicStudy(w,now=performance.now()/1000){if(!w.mosaicStudy)return;const study=w.mosaicStudy,turns=mosaicTurns(w),key=turns.join(':');
 if(study.turns!==key){study.turns=key;study.motions=study.tiles.map((t,i)=>({from:t.rotation.y,to:-turns[i]*Math.PI/2,start:now}));}
 for(const [i,tile]of study.tiles.entries()){const m=study.motions[i];tile.rotation.y=mosaicTurn(m.from,m.to,now-m.start,w.state.preferences.reducedMotion);}
 const saved=(w.state.commonsNotes||[]).some(n=>n.kind==='mosaic'&&n.mallId===w.state.mallId&&n.floor===(w.state.floor||0));study.marker.material.color.set(saved?'#719c7b':'#d7c8a5');w.canvas.dataset.mosaicNotebook=saved?'saved':'unrecorded';w.canvas.dataset.mosaicTurns=JSON.stringify(turns);w.canvas.dataset.mosaicYaw=JSON.stringify(study.tiles.map(t=>Number(t.rotation.y.toFixed(4))));w.canvas.dataset.mosaicDetailRevision='41';
}
export function paintMosaicStudy(w,x,y,theme){const c=w.ctx,turns=mosaicTurns(w);w.round(x-14,y-14,28,28,2,theme.trim);w.round(x-12,y-12,24,24,1,'#ddd0b1');for(let i=0;i<3;i++){c.save();c.translate(x-8+i*8,y);c.rotate(turns[i]*Math.PI/2);w.round(-3.5,-3.5,7,7,1,['#bf805f','#698f83','#d1b46e'][i]);w.line(0,2,0,-2,'#fff5d9',.7);w.line(0,-2,-1.5,-.5,'#fff5d9',.7);w.line(0,-2,1.5,-.5,'#fff5d9',.7);c.restore();}}
