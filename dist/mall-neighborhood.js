import {spacedCrowdPoint} from './ambient-motion.js?v=36.0.0';
import {COMMONS} from './commons.js?v=32.0.0';
import {onSurface,contains,walkable,closestFloor,clearWalk} from './free-navigation.js?v=25.0.0';
const overlap=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
export function connectStorefronts(layout){
 const shops=[...layout.rects,...layout.units,...layout.anchors],links=[],publicFloor=[...layout.campus.halls.map(h=>({kind:'hall',a:layout.campus.nodes[Number(h.a)],b:layout.campus.nodes[Number(h.b)],width:h.width})),...layout.campus.courts.map(c=>({...c,kind:'court'}))];
 for(let i=0;i<shops.length;i++)for(let j=i+1;j<shops.length;j++){
  const a=shops[i],b=shops[j];if(a.side!==b.side)continue;const horizontal=a.side===0||a.side===2;
  const face=r=>horizontal?(r.side===0?r.y+r.height:r.y):(r.side===1?r.x+r.width:r.x);if(Math.abs(face(a)-face(b))>3)continue;
  const [first,last]=[a,b].sort((x,y)=>(horizontal?x.x:x.y)-(horizontal?y.x:y.y)),start=horizontal?first.x+first.width:first.y+first.height,end=horizontal?last.x:last.y,gap=end-start;
  if(gap<.4||gap>110)continue;const depth=Math.min(horizontal?a.height:a.width,horizontal?b.height:b.width),front=face(a),back=a.side===0||a.side===1?front-depth:front;
  const r={id:'retail-wall-'+links.length,structure:true,side:a.side,x:horizontal?start+.1:back,y:horizontal?back:start+.1,width:horizontal?gap-.2:depth,height:horizontal?depth:gap-.2,owners:[a.id,b.id]};
  if(layout.nav.obstacles.some(o=>overlap(r,o)))continue;
  if([[r.x,r.y],[r.x+r.width,r.y],[r.x,r.y+r.height],[r.x+r.width,r.y+r.height]].some(([x,y])=>onSurface({x,y},publicFloor,-3)))continue;
  links.push(r);layout.nav.obstacles.push(r);
 }
 delete layout.nav.grid;return links;
}
export function fillRetailBacks(layout){
 const blocks=[],floor=layout.nav.surfaces;
 const hitsFloor=r=>floor.some(s=>{if(s.kind==='court'){const x=Math.max(r.x,Math.min(r.x+r.width,s.x)),y=Math.max(r.y,Math.min(r.y+r.height,s.y));return Math.hypot(x-s.x,y-s.y)<s.radius+3;}const a=s.a,b=s.b,dx=b.x-a.x,dy=b.y-a.y,pad=s.width/2+3;let lo=0,hi=1;for(const [v,q]of [[-dx,a.x-r.x+pad],[dx,r.x+r.width+pad-a.x],[-dy,a.y-r.y+pad],[dy,r.y+r.height+pad-a.y]]){if(Math.abs(v)<1e-9){if(q<0)return false;}else if(v<0)lo=Math.max(lo,q/v);else hi=Math.min(hi,q/v);if(lo>hi)return false;}return true;});
 for(const u of [...layout.rects,...layout.units,...layout.anchors,...layout.retailLinks||[]]){
  let best=null;for(let depth=16;depth<=288;depth+=16){const r={id:'retail-back-'+blocks.length,structure:true,side:u.side,x:u.side===1?u.x-depth:u.x,y:u.side===0?u.y-depth:u.y,width:Math.abs(u.side)===1?depth:u.width,height:Math.abs(u.side)===1?u.height:depth};if(u.side===-1)r.x=u.x+u.width+.1;if(u.side===2)r.y=u.y+u.height+.1;if(u.side===1)r.width-=.1;if(u.side===0)r.height-=.1;
   if(layout.family==='southcoast'&&(u.x<1220&&r.x+r.width>1220||u.x>1380&&r.x<1380))break;if(r.x<35||r.y<35||r.x+r.width>layout.width-35||r.y+r.height>layout.height-35||hitsFloor(r)||layout.nav.obstacles.some(o=>overlap(r,o)))break;best=r;
  }if(best){blocks.push(best);layout.nav.obstacles.push(best);}
 }delete layout.nav.grid;return blocks;
}
export const FIXTURE_STOPS={coffee:{name:'Coffee kiosk',label:'Choose a real drink'},photo:{name:'Outfit photo spot',label:'Take a portrait'},flowers:{name:'Flower cart',label:'Make a bouquet'},popup:{name:'Pop-up counter',label:'See today’s offer'}};
export function fixtureStop(f){return f.kind==='art'?{id:'art:'+f.id,name:'Sculpture alcove',label:'Make a sketch · free'}:f.amenity?{id:'amenity:'+f.amenity,name:f.amenity==='water'?'Water refill station':'Community noticeboard',label:f.amenity==='water'?'Take a free drink':'Read the invitations'}:f.activity?{id:'commons:'+f.activity,name:COMMONS[f.activity].name,label:COMMONS[f.activity].verb}:f.venue?{id:'venue:'+f.venue,...FIXTURE_STOPS[f.venue]}:f.kind==='bench'?{id:'bench:'+f.id,name:'Garden bench',label:'Sit & rest'}:{id:'directory:'+f.node,name:'Mall directory',label:'Find a shop'};}
export function shopperPlan(layout,count=32){
 const shops=[...layout.rects,...layout.units].sort((a,b)=>Math.hypot(a.door.x-layout.spawn.x,a.door.y-layout.spawn.y)-Math.hypot(b.door.x-layout.spawn.x,b.door.y-layout.spawn.y)),points=shops.slice(0,Math.max(24,count)).map(u=>u.door);const actors=[];
 for(let i=0;i<count;i++){
  const courts=[...layout.campus.courts].sort((a,b)=>Math.hypot(a.x-layout.spawn.x,a.y-layout.spawn.y)-Math.hypot(b.x-layout.spawn.x,b.y-layout.spawn.y)).slice(0,4),n=i>=24?(courts[(i-24)%courts.length]||layout.spawn):(points[i%points.length]||layout.spawn),a=i*2.399963,r=i>=24?75+(i%3)*28:9;let p=spacedCrowdPoint(n,a,r,actors,layout.spawn,layout.nav);if(!p)for(const court of layout.campus.courts){p=spacedCrowdPoint(court,a,75,actors,layout.spawn,layout.nav);if(p)break;}if(!p)continue;
  const targets=(i>=24?[]:shops).map(u=>({...u.door,storeId:u.id,face:{x:u.x+u.width/2,y:u.y+u.height/2}})).filter(q=>Math.hypot(q.x-p.x,q.y-p.y)<320&&clearWalk(p,q,layout.nav)).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y)).slice(i%3,6+i%3);
  for(const angle of [a+1,a+2.4,a+4]){const q={x:p.x+Math.cos(angle)*65,y:p.y+Math.sin(angle)*65};if(walkable(q,layout.nav)&&clearWalk(p,q,layout.nav))targets.push(q);}
  if(!targets.length)targets.push({...p});actors.push({id:'shopper-'+i,x:p.x,y:p.y,targets,speed:34+i%6*5,dwell:2+i%5,look:i%6});
 }return actors;
}

// Right-angle galleries let real shop rows face each concourse, including former diagonal links.
export function connectedGalleries(c){
 const halls=[];for(const h of c.halls){const a=c.nodes[Number(h.a)],b=c.nodes[Number(h.b)],dx=Math.abs(a.x-b.x),dy=Math.abs(a.y-b.y);
  if(dx<40||dy<40||c.family==='southcoast'&&((a.x<1400)!==(b.x<1400))){halls.push(h);continue;}
  const options=[{x:a.x,y:b.y},{x:b.x,y:a.y}],distance=q=>Math.min(...c.nodes.filter(n=>n!==a&&n!==b).map(n=>Math.hypot(n.x-q.x,n.y-q.y)));
  options.sort((p,q)=>distance(q)-distance(p));const q=options[0];let corner=c.nodes.find(n=>Math.hypot(n.x-q.x,n.y-q.y)<20);if(!corner){corner={...q,id:String(c.nodes.length),label:'Shopping gallery'};c.nodes.push(corner);}
  for(const [from,to]of [[a,corner],[corner,b]])if(from.id!==to.id&&!halls.some(e=>e.a===from.id&&e.b===to.id||e.a===to.id&&e.b===from.id))halls.push({a:from.id,b:to.id,width:h.width});
 }c.halls=halls;return c;
}
