import {walkable,onSurface,contains,clearWalk,closestFloor} from './free-navigation.js?v=25.0.0';

// Original architectural art direction. The real center topology stays in campus-model.
export const MALL_THEMES={
 orange:{name:'Sunlit outlet village',wall:'#e5c9a1',stone:'#d1b994',trim:'#876248',accent:'#3c6a62',roof:'#b77a58',floor:'#e8d7b7',inlay:'#b2936d',plant:'#47765b',flowers:'#d2a077',sky:'#dce9e4',style:'village'},
 citadel:{name:'Tuscan shopping courts',wall:'#e7d4bb',stone:'#c6af8c',trim:'#80634f',accent:'#776b50',roof:'#aa7157',floor:'#eaddc7',inlay:'#ba9d79',plant:'#567654',flowers:'#b385a0',sky:'#e1e9e3',style:'arcade'},
 spectrum:{name:'Lanterns and mosaic courtyards',wall:'#eedcb9',stone:'#d5bd91',trim:'#93724e',accent:'#377f82',roof:'#b86e51',floor:'#e8d8b7',inlay:'#7bada5',plant:'#447b5a',flowers:'#d6a455',sky:'#d5e8e5',style:'moorish'},
 brea:{name:'A light-filled indoor arcade',wall:'#eee9dc',stone:'#d7d0bc',trim:'#96876b',accent:'#648a81',roof:'#d7d9cf',floor:'#ece8db',inlay:'#b8a889',plant:'#5b805f',flowers:'#bd8c91',sky:'#e1e8e3',style:'skylight'},
 delamo:{name:'Garden galleries',wall:'#e4e1d1',stone:'#ccc4af',trim:'#8a8c72',accent:'#4f7967',roof:'#bfcfc4',floor:'#e4dfd1',inlay:'#b6b6a1',plant:'#426b50',flowers:'#c89e82',sky:'#dae6df',style:'garden'},
 desert:{name:'Desert resort promenades',wall:'#ddc5a5',stone:'#c3a787',trim:'#80644e',accent:'#737d60',roof:'#ae785e',floor:'#e3d1b2',inlay:'#b7956e',plant:'#58785a',flowers:'#bf8a65',sky:'#e7e8df',style:'desert'},
 island:{name:'Coastal garden courtyards',wall:'#e9e4d6',stone:'#cfcab6',trim:'#87978b',accent:'#497d79',roof:'#9fae9b',floor:'#e5e0cb',inlay:'#9aafa2',plant:'#457a59',flowers:'#c59ca9',sky:'#d8e9e7',style:'coastal'},
 century:{name:'Sculpture and garden terraces',wall:'#e1dfd5',stone:'#c1c4b6',trim:'#777f76',accent:'#638577',roof:'#a3b4a9',floor:'#e3e0d4',inlay:'#acb0a1',plant:'#477251',flowers:'#b695ae',sky:'#dee8e4',style:'garden'},
 beverly:{name:'The signature atrium',wall:'#e8e2de',stone:'#c9bfb4',trim:'#9f8b75',accent:'#756479',roof:'#c8cad0',floor:'#e5ded7',inlay:'#b49f87',plant:'#5d7660',flowers:'#b28a9a',sky:'#dfe6e6',style:'gallery'},
 southcoast:{name:'Jewel courts and grand galleries',wall:'#ece5d5',stone:'#d2c5ab',trim:'#a28b60',accent:'#58776b',roof:'#cdd9d1',floor:'#ebe4d4',inlay:'#b59b6a',plant:'#4d765a',flowers:'#bb8d9b',sky:'#dfe8e4',style:'grand'}
};
export const themeFor=id=>MALL_THEMES[typeof id==='string'?id:id.id]||MALL_THEMES.brea;
export function completeRetailWings(c,tenantCount){
 if(tenantCount<65||!c.completeFloor)return c;
 const loops=c.family==='southcoast'?[{left:1660,top:330,right:c.width-310,bottom:c.height-310}]:[{left:310,top:310,right:c.width-310,bottom:c.height-310}];
 for(const r of loops){const principal=c.nodes.slice(),base=c.nodes.length,coords=[[r.left,r.top,'North-west arcade'],[r.right,r.top,'North-east arcade'],[r.right,r.bottom,'South-east arcade'],[r.left,r.bottom,'South-west arcade']];
  for(const [x,y,label]of coords){const n={id:String(c.nodes.length),x,y,label};c.nodes.push(n);c.courts.push({...n,radius:100});}
  for(let i=0;i<4;i++)c.halls.push({a:String(base+i),b:String(base+(i+1)%4),width:120});
  for(const i of [0,2]){const n=c.nodes[base+i],near=principal.filter(p=>c.family!=='southcoast'||p.x>1500).reduce((a,b)=>Math.hypot(a.x-n.x,a.y-n.y)<Math.hypot(b.x-n.x,b.y-n.y)?a:b);c.halls.push({a:near.id,b:n.id,width:120});}
 }
 return c;
}
export function facadeFrame(r){
 const side=r.side||0,turn=side*Math.PI/2,swap=Math.abs(side)===1;
 const width=swap?r.height:r.width,depth=swap?r.width:r.height;
 return {x:r.x+r.width/2,z:r.y+r.height/2,width,depth,turn,front:{x:Math.sin(turn),y:Math.cos(turn)},right:{x:Math.cos(turn),y:-Math.sin(turn)}};
}
const overlaps=(a,b,p=10)=>a.x<b.x+b.width+p&&a.x+a.width+p>b.x&&a.y<b.y+b.height+p&&a.y+a.height+p>b.y;
const distanceToSegment=(p,a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,k=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p.x-a.x-k*dx,p.y-a.y-k*dy);};
export function furnishCampus(layout){
 const c=layout.campus,theme=themeFor(layout.family),fixtures=[],edgePlanting=[],colonnades=[],portals=[],protectedPoints=[layout.spawn,layout.exit,layout.elevator,...layout.escalators.map(e=>e.landing),...[...layout.rects,...layout.units,...layout.anchors,...layout.venues,...layout.locals].map(r=>r.door)];
 const available=r=>!layout.nav.obstacles.some(o=>overlaps(r,o,13))&&!protectedPoints.some(p=>contains(p,r,28));
 const allOnFloor=r=>[[r.x,r.y],[r.x+r.width,r.y],[r.x,r.y+r.height],[r.x+r.width,r.y+r.height]].every(([x,y])=>walkable({x,y},layout.nav,10));
 const accessSpines=[...c.halls.map(h=>({a:c.nodes[Number(h.a)],b:c.nodes[Number(h.b)]})),...layout.nav.surfaces.filter(s=>s.kind==='hall'&&s.width<100)];
 const clearSpine=r=>accessSpines.every(h=>distanceToSegment({x:r.x+r.width/2,y:r.y+r.height/2},h.a,h.b)>Math.max(r.width,r.height)/2+23);
 const add=(kind,x,y,width,height,rotation=0,node=null)=>{const r={id:kind+'-'+fixtures.length,kind,x:x-width/2,y:y-height/2,width,height,rotation,node};if(!available(r)||!allOnFloor(r)||!clearSpine(r))return null;fixtures.push(r);layout.nav.obstacles.push(r);return r;};
 const placeBench=n=>{for(const [dx,dy,rotation]of [[-58,-58,Math.PI/4],[58,-58,-Math.PI/4],[58,58,-Math.PI*3/4],[-58,58,Math.PI*3/4],[0,-72,0],[72,0,-Math.PI/2],[0,72,Math.PI],[-72,0,Math.PI/2]]){const bw=Math.abs(Math.cos(rotation))*64+Math.abs(Math.sin(rotation))*22,bh=Math.abs(Math.sin(rotation))*64+Math.abs(Math.cos(rotation))*22,r=add('bench',n.x+dx,n.y+dy,bw,bh,rotation,n.id);if(r){r.seat={x:n.x+dx,y:n.y+dy,rotation};const approach={x:r.seat.x+Math.sin(rotation)*30,y:r.seat.y+Math.cos(rotation)*30};if(walkable(approach,layout.nav,10)&&clearWalk(closestFloor(n,layout.nav),approach,layout.nav,10)){r.approach=approach;protectedPoints.push(approach);return r;}else{fixtures.pop();layout.nav.obstacles.pop();}}}return null;};
 // Reserve an accessible resting spot before activity tables on compact floors.
 for(const n of c.courts)if(placeBench(n))break;
 // Small commons tables occupy court edges, with a separately tested approach.
 // One of each activity on every public floor gives quieter wings a reason to visit.
 for(const [index,activity]of ['mosaic','reading','garden'].entries()){
  const offset=Math.floor(index*c.courts.length/3),courts=c.courts.slice(offset).concat(c.courts.slice(0,offset));let placed=false;
  for(const n of courts){for(const [dx,dy]of [[-53,-53],[53,53],[-53,53],[53,-53],[0,-72],[72,0],[0,72],[-72,0]]){
   const r=add('commons',n.x+dx,n.y+dy,26,26,0,n.id);if(!r)continue;
   r.approach=[{x:n.x+dx,y:n.y+dy+32},{x:n.x+dx,y:n.y+dy-32},{x:n.x+dx+32,y:n.y+dy},{x:n.x+dx-32,y:n.y+dy}].find(p=>walkable(p,layout.nav,10)&&clearWalk(closestFloor(n,layout.nav),p,layout.nav,10));
   if(!r.approach){fixtures.pop();layout.nav.obstacles.pop();continue;}
   r.id='commons-'+activity;r.activity=activity;protectedPoints.push(r.approach);placed=true;break;
  }if(placed)break;}
 }
 for(const [i,n]of c.courts.entries()){
  const venue=['coffee','photo','flowers','popup'][i%4];if(!layout.venues.some(v=>v.id===venue))continue;
  for(const [dx,dy]of [[-46,46],[46,-46],[46,46],[-46,-46]]){
   const r=add('kiosk',n.x+dx,n.y+dy,38,32,0,n.id);if(!r)continue;
   r.venue=venue;r.approach=[{x:n.x+dx,y:n.y+dy+32},{x:n.x+dx,y:n.y+dy-32},{x:n.x+dx+34,y:n.y+dy},{x:n.x+dx-34,y:n.y+dy}].find(p=>walkable(p,layout.nav,10)&&clearWalk(closestFloor(n,layout.nav),p,layout.nav,10));
   if(!r.approach){fixtures.pop();layout.nav.obstacles.pop();continue;}protectedPoints.push(r.approach);break;
  }
 }
 for(const [i,n]of c.courts.entries()){
  // Furnish the edges of a court; the central walking spine and all store approaches stay clear.
  for(let seat=fixtures.filter(f=>f.kind==='bench'&&f.node===n.id).length;seat<2;seat++)if(!placeBench(n))break;
  for(const [dx,dy]of [[-52,-53],[52,53],[52,-53],[-52,53]]){if(add(i%3===0?'fountain':'planter',n.x+dx,n.y+dy,32,32,0,n.id))break;}
  if(i%2===0)for(const [dx,dy]of [[48,-54],[-48,54],[-48,-54],[48,54]]){const r=add('directory',n.x+dx,n.y+dy,14,14,0,n.id);if(r){r.approach=[{x:r.x+7,y:r.y+30},{x:r.x+30,y:r.y+7},{x:r.x+7,y:r.y-16},{x:r.x-16,y:r.y+7}].find(p=>walkable(p,layout.nav,10)&&clearWalk(closestFloor(n,layout.nav),p,layout.nav,10));if(!r.approach){fixtures.pop();layout.nav.obstacles.pop();}else protectedPoints.push(r.approach);break;}}
 }
 const offFloor=r=>available(r)&&[[r.x,r.y],[r.x+r.width,r.y],[r.x,r.y+r.height],[r.x+r.width,r.y+r.height],[r.x+r.width/2,r.y+r.height/2]].every(([x,y])=>!onSurface({x,y},layout.nav.surfaces,-16));
 for(const [i,h]of c.halls.entries()){
  const a=c.nodes[Number(h.a)],b=c.nodes[Number(h.b)],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
  const buildings=[...layout.rects,...layout.units,...layout.anchors],postClear=r=>!protectedPoints.some(p=>contains(p,r,24))&&[[r.x,r.y],[r.x+r.width,r.y],[r.x,r.y+r.height],[r.x+r.width,r.y+r.height]].every(([x,y])=>!onSurface({x,y},layout.nav.surfaces,-12)||buildings.some(o=>contains({x,y},o,-3)));
  for(let d=145;d<len-105;d+=900){const x=a.x+dx*d/len,y=a.y+dy*d/len,posts=[-1,1].map(sign=>({x:x+nx*sign*(h.width/2+26),y:y+ny*sign*(h.width/2+26)}));if(posts.every(p=>postClear({x:p.x-7,y:p.y-7,width:14,height:14}))){const height=c.outdoor&&['moorish','arcade'].includes(theme.style)?88:c.outdoor?99:137;portals.push({x,y,angle:Math.atan2(dx,dy),width:h.width+52,height,arch:c.outdoor&&['moorish','arcade'].includes(theme.style)});colonnades.push(...posts.map(p=>({...p,angle:Math.atan2(dx,dy),height})));}}
  for(let d=100;d<len-65;d+=158)for(const sign of [-1,1]){
   const x=a.x+dx*d/len+nx*sign*(h.width/2+184),y=a.y+dy*d/len+ny*sign*(h.width/2+184),r={x:x-28,y:y-28,width:56,height:56};if(offFloor(r))edgePlanting.push({...r,kind:c.outdoor?'tree':'garden',palm:c.outdoor&&['spectrum','desert','orange','island'].includes(layout.family),variation:(i+Math.floor(d))%4});
  }
 }
 for(let y=180;y<c.height-140&&edgePlanting.length<52;y+=170)for(let x=180;x<c.width-140&&edgePlanting.length<52;x+=170){if((Math.round(x/170)+Math.round(y/170))%3)continue;const r={x:x-42,y:y-36,width:84,height:72};if(offFloor(r)&&c.halls.some(h=>distanceToSegment({x,y},c.nodes[Number(h.a)],c.nodes[Number(h.b)])<370)&&!edgePlanting.some(p=>Math.hypot(p.x-r.x,p.y-r.y)<110))edgePlanting.push({...r,kind:'garden',variation:Math.round(x+y)%4});}
 delete layout.nav.grid;
 return {revision:15,theme,fixtures,edgePlanting,colonnades,portals,seating:fixtures.filter(f=>f.kind==='bench'),courts:c.courts};
}

// Camera-facing buildings lower into a floor-plan cutaway when they hide the shopper.
export function cameraCutaway(r,player,camera,height=110){
 let lo=0,hi=1;const dx=camera.x-player.x,dz=camera.z-player.y;
 for(const [d,min,max,start]of [[dx,r.x-10,r.x+r.width+10,player.x],[dz,r.y-10,r.y+r.height+10,player.y]]){
  if(Math.abs(d)<1e-9){if(start<min||start>max)return false;continue;}
  const a=(min-start)/d,b=(max-start)/d;lo=Math.max(lo,Math.min(a,b));hi=Math.min(hi,Math.max(a,b));if(lo>hi)return false;
 }
 return hi>0&&lo<1&&25+(camera.y-25)*Math.max(0,lo)<height+14;
}

export function overviewFraming(width,height,aspect,angle,fov=46){
 const norm=Math.hypot(.62,.79),horizontal=.62/norm,vertical=.79/norm,tan=Math.tan(fov*Math.PI/360),sin=Math.sin(angle),cos=Math.cos(angle);let distance=0;
 for(const x of [-width/2,width/2])for(const z of [-height/2,height/2])for(const y of [-12,168]){
  const depth=(x*sin+z*cos)*horizontal+y*vertical,right=x*cos-z*sin,up=-(x*sin+z*cos)*vertical+y*horizontal;
  distance=Math.max(distance,depth+Math.abs(right)/(tan*Math.max(.2,aspect)),depth+Math.abs(up)/tan);
 }
 distance*=1.12;return {distance,horizontal:distance*horizontal,altitude:12+distance*vertical};
}
