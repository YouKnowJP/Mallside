import {freeRoute,freeMove,walkable} from './free-navigation.js?v=52.0.0';
import {walkingStep} from './motion.js?v=34.0.0';

// These footprints match the visible furniture. Coordinates use the room's x/z floor.
export const HOME_FURNITURE=[
 {id:'shelf',x:16,y:-33,width:82,height:30},
 {id:'desk',x:-90,y:-20,width:36,height:22},
 {id:'wardrobe',x:-99,y:17,width:21,height:37},
 {id:'lamp',x:59.5,y:26.5,width:33,height:33}
];
export const HOME_STOPS={window:{x:-32,z:-27,label:'At the window',use:'A quiet moment'},shelf:{x:34,z:10,label:'Beside your kept finds',use:'Arrange my shelf'},door:{x:-28,z:48,label:'At the doorway',use:'Back to the mall'},center:{x:-28,z:8,label:'Back on the rug'},wardrobe:{x:-62,z:36,label:'At your wardrobe',use:'Open my wardrobe'},memories:{x:-67,z:14,label:'At the memory desk',use:'Read my memories'}};
export const createHomeNavigation=()=>({bounds:{left:-101,right:103,top:-46,bottom:70},gridStep:6,obstacles:HOME_FURNITURE.map(r=>({...r}))});
const floor=p=>({x:p.x,y:p.z}),room=p=>({x:p.x,z:p.y});
export function homeWalkRoute(id,from=HOME_STOPS.center,nav=createHomeNavigation()){
 const target=typeof id==='string'?HOME_STOPS[id]:id;
 if(!target||!walkable(floor(target),nav)||!walkable(floor(from),nav))return [];
 return freeRoute(floor(from),floor(target),nav).slice(1).map(p=>({...room(p),label:target.label||'On the open floor'}));
}
export function moveHome(from,vector,dt,nav,velocity){
 const length=Math.hypot(vector.x,vector.z);if(!length||!Number.isFinite(length))return {...from,velocity:{x:0,y:0}};
 const next=walkingStep(floor(from),vector.x,vector.z,velocity,38,Math.max(0,Math.min(.05,dt)));
 return {...room(freeMove(floor(from),next,nav)),velocity:next.velocity};
}
// Screen-relative directions match the fixed room camera, including diagonal normalization.
export function homeDirection(keys){
 const x=Number(keys.has('right'))-Number(keys.has('left')),z=Number(keys.has('down'))-Number(keys.has('up'));
 return {x:x*.875+z*.484,z:-x*.484+z*.875};
}
export function nearbyHomeStop(p,radius=31){
 return Object.entries(HOME_STOPS).filter(([,s])=>s.use).map(([id,s])=>({id,...s,distance:Math.hypot(p.x-s.x,p.z-s.z)})).filter(s=>s.distance<=radius).sort((a,b)=>a.distance-b.distance)[0]||null;
}
