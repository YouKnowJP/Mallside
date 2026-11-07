import {crowdStep} from './ambient-motion.js?v=36.0.0';
import {freeRoute,walkable,freeMove,personStop} from './free-navigation.js?v=25.0.0';
import {stepToward} from './motion.js?v=34.0.0';
import {stock,byId,storeById,levelOf,CLOSE} from './engine.js?v=63.0.0';

// A check is a per-visit conversation, never a reservation or a purchase.
export function checkRequest(state,storeId,bags,productId,size){
 const p=byId(productId),st=storeById(storeId);
 if(!p||p.archived||!st||p.store!==storeId)throw Error('Choose a current item from this shop.');
 if(levelOf(state)<st.tier)throw Error('Unlock this store’s shopping level first.');
 if(state.minutes>=CLOSE)throw Error('The mall is closed. Come back tomorrow.');
 if(!p.sizes.includes(size))throw Error('Choose one of this product’s listed sizes or formats.');
 return {id:productId,size,product:p,available:Math.max(0,stock(state,productId,size)-(bags[storeId]||[]).filter(i=>i.id===productId&&i.size===size).length)};
}
export function associateTrip(layout,request,{displayIndex=null,origin=null}={}){
 if(request.product.store!==layout.store.id||!storeById(layout.store.id)?.count)throw Error('Ask about an item stocked by this shop.');
 const home={...layout.services.associate},index=displayIndex??Math.max(0,layout.store.products.findIndex(p=>p.id===request.id))%layout.displays.length;
 const display=layout.displays[index],displayPoint={x:display.x+display.width/2,y:display.y+display.height+20};
 const from=origin||home,stop=personStop(displayPoint,from,layout.nav),route=freeRoute(from,stop,layout.nav),back=freeRoute(stop,home,layout.nav);
 if(route.length<2||back.length<2||[...route,...back].some(p=>!walkable(p,layout.nav)))throw Error('The associate cannot reach that display.');
 return {...request,x:from.x,y:from.y,home,displayPoint,stop:{...stop},route,back,stage:'walking',time:0,distance:0,rotation:0,moving:false};
}
// A planning host meets beside the board; samples remain original scenery.
export function consultationTrip(layout,point,origin=null){const home={...layout.services.associate},from=origin||home,stop=personStop(point,from,layout.nav),route=freeRoute(from,stop,layout.nav);if(route.length<2)throw Error('The host cannot reach this workbench.');return {consultation:true,x:from.x,y:from.y,home,displayPoint:{...point},stop,route,back:freeRoute(stop,home,layout.nav),stage:'walking',time:0,distance:0,rotation:0,moving:false};}
export function returnAssociateTrip(trip,layout){return {...trip,stage:'returning',route:freeRoute(trip,trip.home,layout.nav),walkSpeed:trip.moving?(trip.walkSpeed||0):0,moving:false};}
export function updateAssociateTrip(trip,seconds,{paused=false,reducedMotion=false,nav=null,neighbors=[]}={}){
 if(!trip||paused||['ready','consulting'].includes(trip.stage))return;
 const dt=Math.max(0,Math.min(.05,seconds));trip.moving=false;
 if(reducedMotion){trip.walkSpeed=0;trip.route=[];trip.x=trip.home.x;trip.y=trip.home.y;trip.stage=trip.consultation&&trip.stage!=='returning'?'consulting':'ready';return;}
 if(trip.route.length){const next=stepToward(trip,trip.route[0],(trip.walkSpeed=(trip.walkSpeed||0)+(100-(trip.walkSpeed||0))*(1-Math.exp(-10*dt)))*Math.max(.22,Math.min(1,Math.hypot(trip.route[0].x-trip.x,trip.route[0].y-trip.y)/24)),dt),p=nav?crowdStep(trip,freeMove(trip,next,nav),neighbors,-1,nav):next,dx=p.x-trip.x,dy=p.y-trip.y,d=Math.hypot(dx,dy);trip.x=p.x;trip.y=p.y;trip.distance+=d;trip.moving=d>.001;if(trip.moving)trip.rotation=Math.atan2(dx,dy);if(next.arrived&&Math.hypot(trip.x-next.x,trip.y-next.y)<.1)trip.route.shift();return;}
 if(trip.stage==='walking'){trip.stage=trip.consultation?'consulting':'checking';trip.time=0;trip.walkSpeed=0;}
 if(trip.stage==='checking'){trip.time+=dt;if(trip.time>=1.6){trip.stage='returning';trip.route=trip.back.map(p=>({...p}));}}
 else if(trip.stage==='returning'){trip.stage='ready';trip.walkSpeed=0;}
}
export function requestStatus(trip,name='Your associate'){
 return trip.stage==='ready'?name+' is ready with your size check.':trip.stage==='checking'?name+' is checking '+trip.size+' at the display.':trip.stage==='returning'?name+' is returning to the help point.':name+' is checking the display for you.';
}
