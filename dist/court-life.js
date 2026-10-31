import {benchSeatTarget} from './ambient-motion.js?v=36.0.0';
import {applyCharacterPose} from './character-rig.js?v=45.0.0';
import {adultAppearance} from './mall-atmosphere.js?v=33.0.0';

// Original ambient visitors; the book is scenery, not a catalog item.
export function buildCourtLife(w){
 w.courtVisitors=[];w.courtLifeCenter=null;if(w.state.preferences.crowds===false)return;
 const count=Math.min(w.width<700?2:3,w.layout.environment.seating.length);
 for(let i=0;i<count;i++){const g=w.person(['#6b8b82','#b08770','#9294aa'][i],adultAppearance(i+9));if(i%2===0){const book=w.box(0,30,9,10,.8,8,'#8f6d63',g);book.userData.role='ambient-book';w.box(0,30.55,9,9,.5,7,'#eee5cc',g);}w.courtVisitors.push({g,reading:i%2===0});}
 updateCourtLife(w,0);
}
export function updateCourtLife(w,dt){
 if(!w.courtVisitors?.length)return;
 if(!w.courtLifeCenter||Math.hypot(w.avatar.x-w.courtLifeCenter.x,w.avatar.y-w.courtLifeCenter.y)>500){
  w.courtLifeCenter={...w.avatar};const seats=[...w.layout.environment.seating].sort((a,b)=>Math.hypot(a.seat.x-w.avatar.x,a.seat.y-w.avatar.y)-Math.hypot(b.seat.x-w.avatar.x,b.seat.y-w.avatar.y));
  const retained=new Set(w.courtVisitors.filter(v=>v.seat&&Math.hypot(v.seat.x-w.avatar.x,v.seat.y-w.avatar.y)<650).map(v=>v.seat));
  for(const v of w.courtVisitors){if(retained.has(v.seat))continue;const next=seats.find(f=>!retained.has(f.seat)&&(!v.seat||Math.hypot(f.seat.x-w.avatar.x,f.seat.y-w.avatar.y)>230));if(next)v.seat=next.seat;if(v.seat)retained.add(v.seat);}
 }
 let visible=0;for(const v of w.courtVisitors){const p=v.seat;v.g.visible=!!p&&!w.overview&&Math.hypot(p.x-w.avatar.x,p.y-w.avatar.y)<600;if(!v.g.visible)continue;visible++;const target=benchSeatTarget(p);v.g.position.set(target.x+Math.cos(p.rotation)*21,0,target.y-Math.sin(p.rotation)*21);v.g.rotation.y=p.rotation;applyCharacterPose(v.g,{seated:true,seatHeight:17,time:w.t||0,delta:dt,kind:v.reading?'browse':'rest',reducedMotion:w.state.preferences.reducedMotion});}
 w.canvas.dataset.seatedVisitors=String(visible);
}
