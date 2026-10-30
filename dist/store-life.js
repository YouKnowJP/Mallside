import {staffGesture,staffTarget} from './staff-motion.js?v=37.0.0';
import {turnToward} from './motion.js?v=34.0.0';
import {adultAppearance} from './mall-atmosphere.js?v=33.0.0';
import {attachHeldProduct,updateAttachmentFrames} from './merchandise-fit.js?v=37.0.0';
import {physicalProduct} from './merchandise-3d.js?v=37.0.0';
import {applyCharacterPose,solveArmToGrip} from './character-rig.js?v=37.0.0';
import * as T from './vendor/three.module.js';
import {createStoreCustomers,updateStoreCustomers,customerActivity} from './store-customers.js?v=37.0.0';
import {slotForProduct} from './malls.js?v=23.0.0';

const colors=['#bf8b71','#638a84','#a890ab','#c0ab6d','#7e93b1','#b76e66','#8b9a6e','#988674'];
export function buildStoreLife(w,store){
 const sim=createStoreCustomers(w.layout,store.products,w.state.preferences.crowds===false?0:w.width<700?5:8,{reservedRoom:0});w.storeCustomers=sim;
 for(const a of sim.actors){
  const g=w.person(colors[a.id],adultAppearance(a.id));
  const left=g.userData.limbs[0],bag=new T.Group();left.userData.grip.add(bag);bag.userData.limbIndex=0;w.box(0,-8,0,9,10,5,'#eee5d3',bag);const handle=w.mesh(new T.TorusGeometry(2.5,.4,4,12,Math.PI),w.mat('#9a7c56'),bag);handle.position.y=-2;g.userData.gravityAttachments??=[];g.userData.gravityAttachments.push({holder:bag,limb:left,anchor:left.userData.grip});
  let item;if(physicalProduct(a.product))item=attachHeldProduct(w,g,a.product,1).holder;else{const right=g.userData.limbs[1];item=new T.Group();item.userData.dynamicMerchandise=true;item.userData.limbIndex=1;right.userData.grip.add(item);w.photo(a.product,0,-8,0,10,15,item);g.userData.gravityAttachments.push({holder:item,limb:right,anchor:right.userData.grip});}
  const label=w.label('',a.x,64,a.y,88);a.visual={g,bag,item,label,original:colors[a.id],caption:''};g.position.set(a.x,0,a.y);
 }
 w.canvas.dataset.storeShopperCount=String(sim.actors.length);w.canvas.dataset.storePurchases='0';
}
export function drawStoreLife(w,dt,paused){
 const sim=w.storeCustomers;if(!sim)return;
 updateStoreCustomers(sim,dt,{paused,reducedMotion:w.state.preferences.reducedMotion,player:w.avatar});
 const near=new Set(sim.actors.filter(a=>a.visible!==false).sort((a,b)=>Math.hypot(a.x-w.avatar.x,a.y-w.avatar.y)-Math.hypot(b.x-w.avatar.x,b.y-w.avatar.y)).slice(0,w.width<700?1:3).map(a=>a.id));
 for(const a of sim.actors){const {g,bag,item,label}=a.visual,active=a.phase==='act'&&!a.moving,trying=a.stage==='try'&&!a.waitingRoom&&active,scanning=a.stage==='pay'&&active,browsing=['browse','compare','demo'].includes(a.stage)&&active;
  g.visible=a.visible!==false;g.position.set(a.x,0,a.y);const target=a.moving?a.rotation:scanning||browsing?Math.PI:trying?(w.state.preferences.reducedMotion?0:Math.sin(sim.clock*.7)*.45):g.rotation.y;g.rotation.y=turnToward(g.rotation.y,target,paused?0:dt,w.state.preferences.reducedMotion);g.userData.attention=browsing?.15:0;
  bag.visible=a.bag;item.visible=a.hasItem&&!a.bag&&g.visible;
  a.gaitDistance=(a.gaitDistance||0)+(a.moving?Math.hypot(a.x-(a.visual.lastX??a.x),a.y-(a.visual.lastY??a.y)):0);a.visual.lastX=a.x;a.visual.lastY=a.y;applyCharacterPose(g,{walking:a.moving,distance:a.gaitDistance,time:sim.clock,delta:paused?0:dt,kind:scanning?'pay':browsing?'browse':trying?'compare':'',carrying:item.visible,reducedMotion:w.state.preferences.reducedMotion});
  updateAttachmentFrames(g);g.userData.torso.material.color.set(trying&&slotForProduct(a.product)==='top'?a.product.color||a.visual.original:a.visual.original);
  const caption=customerActivity(a);if(caption!==a.visual.caption){const tx=label.material.map,c=tx.image.getContext('2d');c.fillStyle='#fffaf0';c.fillRect(0,0,512,112);c.fillStyle='#405a50';c.font='600 39px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText(caption,256,56,480);tx.needsUpdate=true;a.visual.caption=caption;}
  label.position.set(a.x,66,a.y);label.visible=w.state.preferences.activityCaptions===true&&g.visible&&near.has(a.id)&&Math.hypot(a.x-w.avatar.x,a.y-w.avatar.y)<285;
 }
 for(const c of w.fittingCurtains||[]){const occupant=sim.actors.find(a=>a.room===c.room&&a.phase==='act'),player=w.playerFittingRoom===c.room,closed=!!occupant||player;const width=closed?43:10;c.mesh.scale.x+=(width/10-c.mesh.scale.x)*(w.state.preferences.reducedMotion?1:.15);c.mesh.position.x=c.x+(closed?0:-23);c.mesh.visible=!player;}
 for(const staff of w.storeStaff){
  const g=staff.mesh,origin={x:g.position.x,y:g.position.z},distance=Math.hypot(w.avatar.x-origin.x,w.avatar.y-origin.y),paying=staff.kind==='checkout'&&sim.actors.some(a=>a.stage==='pay'&&a.phase==='act');
  staff.gesture=staffGesture(staff.gesture,distance,paused||w.state.preferences.reducedMotion?0:dt);const target=staffTarget(origin,w.avatar,sim.actors);g.rotation.y=turnToward(g.rotation.y,target,paused?0:dt,w.state.preferences.reducedMotion);g.userData.attention=Math.atan2(Math.sin(target-g.rotation.y),Math.cos(target-g.rotation.y));
  applyCharacterPose(g,{kind:paying?'pay':staff.gesture.greet>0?'greet':'talk',time:sim.clock,delta:paused?0:dt,reducedMotion:w.state.preferences.reducedMotion});
 }
 w.canvas.dataset.staffAttention='37';w.canvas.dataset.heldShopperItems=String(sim.actors.filter(a=>a.visual.item.visible).length);
 const counts=sim.actors.reduce((v,a)=>(v[a.stage]=(v[a.stage]||0)+1,v),{});if(w.canvas.dataset.storeCustomerStates!==JSON.stringify(counts))w.canvas.dataset.storeCustomerStates=JSON.stringify(counts);if(w.canvas.dataset.storePurchases!==String(sim.purchases))w.canvas.dataset.storePurchases=String(sim.purchases);
 const active=sim.actors.filter(a=>['try','demo'].includes(a.stage)&&a.phase==='act'&&!a.waitingRoom).length,status=document.querySelector('#store-life-status'),text=sim.actors.length?sim.actors.length+' shoppers · '+active+(sim.wearable?' trying on':' testing')+' · '+sim.queue.length+' in line':'Quiet shopping · staff ready to help';if(status&&status.textContent!==text)status.textContent=text;
}
