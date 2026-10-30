import * as T from './vendor/three.module.js';
import {turnToward} from './motion.js?v=34.0.0';
export function mosaicTurns(w){const p=w.commonsPreview,s=w.state;if(p?.mallId===s.mallId&&p.floor===(s.floor||0))return [...p.turns];return (s.commonsNotes||[]).some(n=>n.kind==='mosaic'&&n.mallId===s.mallId&&n.floor===(s.floor||0))?[0,1,2]:[1,2,3];}
export function buildMosaicStudy(w,x,z,theme){
 const root=new T.Group();root.position.set(x,29,z);w.scene.add(root);w.box(0,0,0,28,2,28,theme.trim,root);w.box(0,1.1,0,26,.4,26,'#ddd0b1',root);
 for(let i=0;i<7;i++)for(const side of [-1,1]){w.box(-11+i*3.6,1.6,side*11,3,.6,3,i%2?theme.inlay:theme.wall,root);w.box(side*11,1.6,-7+i*2.3,3,.6,1.8,i%2?theme.wall:theme.inlay,root);}
 const tiles=[],turns=mosaicTurns(w);for(let i=0;i<3;i++){
  const tile=new T.Group();tile.position.set((i-1)*8.5,2,0);tile.rotation.y=-turns[i]*Math.PI/2;root.add(tile);tiles.push(tile);
  w.box(0,0,0,7.5,1.3,7.5,['#bf805f','#698f83','#d1b46e'][i],tile);
  for(const dx of [-2,0,2])for(const dz of [-2,0,2])w.box(dx,.7,dz,1.8,.12,1.8,i%2?'#93aca0':'#ead5a9',tile);
  w.box(0,.92,0,.65,.3,4,'#fff5d9',tile);for(const sign of [-1,1]){const arm=w.box(sign*.75,.92,-1.25,.65,.3,2,'#fff5d9',tile);arm.rotation.y=sign*Math.PI/4;}
 }
 w.box(0,2,7.3,15,.7,3.5,theme.wall,root);for(let i=0;i<3;i++)w.box(-4+i*4,2.6,7.3,2,.25,.6,theme.accent,root);
 w.mosaicStudy={root,tiles};root.userData={originalStudy:true,footprint:30};updateMosaicStudy(w);return root;
}
export function updateMosaicStudy(w){if(!w.mosaicStudy)return;const turns=mosaicTurns(w);for(const [i,tile]of w.mosaicStudy.tiles.entries())tile.rotation.y=turnToward(tile.rotation.y,-turns[i]*Math.PI/2,w.frameDt,w.state.preferences.reducedMotion);w.canvas.dataset.mosaicTurns=JSON.stringify(turns);w.canvas.dataset.mosaicYaw=JSON.stringify(w.mosaicStudy.tiles.map(t=>Number(t.rotation.y.toFixed(4))));w.canvas.dataset.mosaicDetailRevision='41';}
export function paintMosaicStudy(w,x,y,theme){const c=w.ctx,turns=mosaicTurns(w);w.round(x-14,y-14,28,28,2,theme.trim);w.round(x-12,y-12,24,24,1,'#ddd0b1');for(let i=0;i<3;i++){c.save();c.translate(x-8+i*8,y);c.rotate(turns[i]*Math.PI/2);w.round(-3.5,-3.5,7,7,1,['#bf805f','#698f83','#d1b46e'][i]);w.line(0,2,0,-2,'#fff5d9',.7);w.line(0,-2,-1.5,-.5,'#fff5d9',.7);w.line(0,-2,1.5,-.5,'#fff5d9',.7);c.restore();}}
