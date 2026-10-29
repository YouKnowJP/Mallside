import {attachWornGarment,attachWornBag,attachHeldProduct,updateAttachmentFrames} from './merchandise-fit.js?v=35.0.0';
import * as T from './vendor/three.module.js';
import {productAppearance} from './product-appearance.js?v=23.0.0';
import {physicalProduct} from './merchandise-3d.js?v=23.0.0';
import {carriedSelections} from './shopping-selection.js?v=35.0.0';
import {carried,canTry} from './engine.js?v=35.0.0';

export function dressPerson(w,g,equipment){
 const top=equipment.top,cut=top&&physicalProduct(top)&&productAppearance(top).garment;
 if(physicalProduct(equipment.bottom)&&cut?.coverage!=='full'&&cut?.coverage!=='bottom')attachWornGarment(w,g,equipment.bottom,'bottom');
 if(physicalProduct(top))attachWornGarment(w,g,top,cut?.coverage==='bottom'?'bottom':'top');
 if(physicalProduct(equipment.bag))attachWornBag(w,g,equipment.bag);
}

export function syncCarriedMerchandise(w,{force=false,pickupId=null}={}){
 if(!w.player)return;const now=performance.now();if(!force&&now<(w.carryCheckAt||0))return;w.carryCheckAt=now+200;
 const entries=carriedSelections(w.state),paid=carried(w.state).length,signature=JSON.stringify([w.player.uuid,entries.map(i=>[i.id,i.size]),paid,!!w.previewingMerchandise]);
 if(signature===w.carrySignature)return;w.carrySignature=signature;
 const source=pickupId?w.merchandiseRecords?.filter(r=>r.product.id===pickupId&&r.object.visible).sort((a,b)=>a.object.getWorldPosition(new T.Vector3()).distanceTo(w.player.position)-b.object.getWorldPosition(new T.Vector3()).distanceTo(w.player.position))[0]?.object.getWorldPosition(new T.Vector3()):null;
 if(w.carryVisual){const old=new Set(w.carryVisual.userData.attachments||[]);old.forEach(o=>o.removeFromParent());w.player.userData.gravityAttachments=(w.player.userData.gravityAttachments||[]).filter(a=>!old.has(a.holder));w.carryVisual.removeFromParent();}
 w.carryVisual=new T.Group();w.carryVisual.userData.attachments=[];w.player.add(w.carryVisual);
 const shown=entries.slice(-3);for(const [i,item]of shown.entries()){
  const {holder,model}=attachHeldProduct(w,w.player,item.product,i===1?0:1,{offset:i===2?4:0});holder.visible=!w.previewingMerchandise;w.carryVisual.userData.attachments.push(holder);
  if(source&&item.id===pickupId&&i===shown.length-1){w.player.updateMatrixWorld(true);const start=holder.worldToLocal(source.clone());w.pickupPulse={model,from:start,to:model.position.clone(),start:now};model.position.copy(start);}
 }
 if(paid){const limb=w.player.userData.limbs[0],anchor=limb.userData.grip||limb,g=new T.Group();anchor.add(g);g.userData.limbIndex=0;g.position.set(0,w.player.userData.rig?0:-18,0);w.box(0,-9,0,9,10,5,'#e8dcc3',g);const h=w.mesh(new T.TorusGeometry(3,.55,5,16,Math.PI),w.mat('#987950'),g);h.position.y=-3;g.visible=!w.previewingMerchandise;w.carryVisual.userData.attachments.push(g);w.player.userData.gravityAttachments??=[];w.player.userData.gravityAttachments.push({holder:g,limb,anchor});limb.rotation.x=-1.22;g.rotation.x=1.22;}

 // Take one visible display copy per selected unit. Putting it back restores the display.
 const counts=new Map();entries.forEach(i=>counts.set(i.id,(counts.get(i.id)||0)+1));const grouped=new Map();for(const r of w.merchandiseRecords||[]){if(!grouped.has(r.product.id))grouped.set(r.product.id,[]);grouped.get(r.product.id).push(r);}
 for(const [id,records]of grouped){records.sort((a,b)=>a.object.getWorldPosition(new T.Vector3()).distanceTo(w.player.position)-b.object.getWorldPosition(new T.Vector3()).distanceTo(w.player.position));records.forEach((r,i)=>r.object.visible=i>=(counts.get(id)||0));}
 w.canvas.dataset.carriedProducts=JSON.stringify(entries.map(i=>({id:i.id,size:i.size,store:i.store})));w.canvas.dataset.carrying3D=String(shown.length);
 const info=document.querySelector('#carried-selection'),put=document.querySelector('[data-action="put-back-held"]'),tryButton=document.querySelector('[data-held-try]');const local=entries.filter(i=>i.store===w.inside),held=local.at(-1);
 if(info)info.textContent=held?'In hand · '+held.product.name+' · '+held.size+' · unpaid':'Pick up clothes and bags from the displays';if(put)put.hidden=!held;
 if(tryButton){const wearable=held?canTry(held.product):(w.layout?.store?.products||[]).some(canTry);tryButton.textContent=wearable?(held?'Try held':'Try-on'):(held?'Inspect held':'Demos');tryButton.setAttribute('aria-label',wearable?(held?'Try carried item in fitting room':'Walk to fitting room'):(held?'Inspect carried product and demo options':'Walk to product demos'));}
}
export function poseCarriedMerchandise(w){
 syncCarriedMerchandise(w);if(w.action)return;const held=w.carryVisual?.userData.attachments||[];if(w.player.userData.ownedHandBag)w.player.userData.limbs[1].rotation.x=-1.22;for(const holder of held)if(holder.visible)w.player.userData.limbs[holder.userData.limbIndex??1].rotation.x=-1.22;updateAttachmentFrames(w.player);
 if(w.pickupPulse){const p=w.pickupPulse,t=w.state.preferences.reducedMotion?1:Math.min(1,(performance.now()-p.start)/600),k=1-Math.pow(1-t,3);p.model.position.lerpVectors(p.from,p.to,k);if(t===1)w.pickupPulse=null;}
}

// A two-hand activity frees both grips; restore the exact prior visibility on exit.
export function stowHandhelds(person){const previous=(person.userData.gravityAttachments||[]).map(({holder})=>[holder,holder.visible]);for(const [holder]of previous)holder.visible=false;let restored=false;return ()=>{if(restored)return;restored=true;for(const [holder,visible]of previous)holder.visible=visible;};}
