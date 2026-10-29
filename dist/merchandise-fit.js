import * as T from './vendor/three.module.js';
import {poseHumanHands,maskSleevedSkin} from './human-anatomy.js?v=33.0.0';
import {applyCharacterPose,retargetGarmentGroup,retargetLimbGroup,solveArmToGrip} from './character-rig.js?v=34.0.0';
import {productAppearance} from './product-appearance.js?v=23.0.0';
import {referenceMaterial} from './merchandise-materials.js?v=23.0.0';
import {merchandiseTemplate,physicalProduct} from './merchandise-3d.js?v=23.0.0';
import {addGarmentBrand,strapGeometry,addChainLinks} from './merchandise-details.js?v=23.0.0';

export function fitScaleForSize(size,usual){const sizes=['XS','S','M','L','XL'],a=sizes.indexOf(size),b=sizes.indexOf(usual);if(a>=0&&b>=0)return 1+(a-b)*.035;const n=Number(size),u=Number(usual);return n&&u?Math.max(.9,Math.min(1.1,Math.sqrt(n/u))):1;}
export function trackMerchandise(w,object){object.traverse(o=>{if(!o.isMesh)return;w.resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){w.resources.add(m);for(const k of ['map','bumpMap','roughnessMap'])if(m[k])w.resources.add(m[k]);if(m.userData.detailTexture)w.resources.add(m.userData.detailTexture);}});return object;}
function mesh(parent,geo,mat,x=0,y=0,z=0){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
function ribbon(parent,points,width,mat,linear=false){return mesh(parent,strapGeometry(points,width,.14,{linear}),mat);}
function skinLegs(g){for(const limb of g.userData.limbs.slice(2)){for(const part of [limb.userData.upper||limb.children[0],limb.userData.lower,limb.userData.joint])if(part){part.material=g.userData.head.material;part.visible=true;}}if(g.userData.pelvis)g.userData.pelvis.material=g.userData.head.material;}
function shirtShell(cut,ease=1){
 const cropped=cut.length==='cropped'||cut.kind==='bra',bare=cut.sleeve==='none',bottom=cut.kind==='bra'?23.5:cropped?22:cut.length==='thigh'?10:cut.length==='maxi'?5:15.5,top=cut.kind==='bra'?29:bare?31.7:34.8;
 const rings=[[bottom,7.7,5.8],[bottom+(top-bottom)*.15,cut.fit==='slim'?7.5:8.3,5.9],[27,cut.fit==='slim'?7.5:8.5,6],[31.2,8,5.9],[top,bare?7.4:3.6,bare?5.5:3.8]],pos=[],uv=[],idx=[],groups=[],n=32;
 if(cut.kind==='bra')rings.splice(2,2);else if(!bare&&top>33.5){rings.push([32.4,7.2,5.4],[33.4,5.5,4.6]);}
 rings.sort((a,b)=>a[0]-b[0]);
 rings.forEach(([y,w,d],r)=>{for(let i=0;i<=n;i++){const theta=i/n*Math.PI*2,front=Math.max(0,Math.sin(theta)),neckWeight=Math.max(0,Math.min(1,(y-31.2)/Math.max(.1,top-31.2))),neckDip=(cut.neckline==='v'?front*3.2:cut.neckline==='scoop'?front*1.7:0)*neckWeight;pos.push(Math.cos(theta)*w*ease,y-25-neckDip,Math.sin(theta)*d*ease);uv.push((Math.cos(theta)+1)/2,(y-bottom)/(top-bottom));if(r<rings.length-1&&i<n){const k=r*(n+1)+i,start=idx.length;idx.push(k,k+n+1,k+1,k+1,k+n+1,k+n+2);groups.push([start,6,Math.sin((i+.5)/n*Math.PI*2)>0?0:1]);}}});
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));const front=[],back=[];for(const [start,count,material]of groups)(material?back:front).push(...idx.slice(start,start+count));geo.setIndex([...front,...back]);geo.addGroup(0,front.length,0);geo.addGroup(front.length,back.length,1);geo.computeVertexNormals();return geo;
}
function poseCloth(g,object){g.userData.poseCloth??=[];g.userData.poseCloth.push({object,rest:object.geometry?new Float32Array(object.geometry.attributes.position.array):null});}
function skirtGeometry(cut,ease=1){const n=48,segments=7,top=17.4,bottom={thigh:10,midi:5,maxi:.9}[cut.length]??5,positions=[],uv=[],index=[];
 for(let row=0;row<=segments;row++){const t=row/segments,wr=8.5+(cut.fit==='slim'?1:cut.fit==='flare'?5.5:3.5)*t,dr=6+Math.min(2.5,wr-8.5)*t;for(let i=0;i<=n;i++){const a=i/n*Math.PI*2,pleat=Math.sin(a*(cut.pleats?16:10))*(cut.pleats?.3:.12)*t,y=top+(bottom-top)*t+(cut.hem==='high-low'?Math.max(0,Math.sin(a))*2*t:cut.hem==='asymmetric'?Math.cos(a)*1.5*t:0);positions.push(Math.cos(a)*(wr+pleat)*ease,y,Math.sin(a)*(dr+pleat)*ease);uv.push((Math.cos(a)+1)/2,1-t);if(row<segments&&i<n){const k=row*(n+1)+i;index.push(k,k+1,k+n+1,k+1,k+n+2,k+n+1);}}}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(index);geo.computeVertexNormals();return geo;}
function purchaseSize(w,p,slot){const id=w.state?.equipment?.[slot],purchase=w.state?.purchases?.find(i=>i.id===id&&i.productId===p.id);return p.gameSize||purchase?.size||w.state?.[slot==='bottom'?'waist':'size']||'M';}
export function attachWornGarment(w,g,p,slot){
 const a=productAppearance(p),cut=a.garment,group=new T.Group();group.userData={productId:p.id,role:'worn-'+slot,cut:cut.kind};g.add(group);const material=referenceMaterial(a,{highDetail:true}),plain=referenceMaterial(a,{plain:true}),trim=referenceMaterial(a,{trim:true}),usual=w.state?.[slot==='bottom'?'waist':'size']||'M',ease=fitScaleForSize(purchaseSize(w,p,slot),usual)*(a.oversized?1.07:1);
 group.userData.ease=ease;
 if(cut.special==='bag-strap'){ribbon(group,[[-6,34,-4],[-5,34,5],[3,25,7],[9,18,6]],2.4,plain);retargetGarmentGroup(g,group);return trackMerchandise(w,group);}
 const bottoms=(skirt=false)=>{
  skinLegs(g);if(g.userData.anatomy)g.userData.pelvis.visible=false;mesh(group,new T.CylinderGeometry(8.4*ease,8.3*ease,3.8,24),plain,0,16.8,0).scale.z=.72;
  if(cut.underwear||cut.kind==='swim'&&cut.coverage==='bottom'){mesh(group,new T.CylinderGeometry(8.2,4.3,4.6,24),plain,0,14.8,0).scale.z=.75;return;}
  if(skirt){if(g.userData.rig){const reach=cut.length==='maxi'?(cut.fit==='slim'?4.4:6.5):cut.length==='midi'?(cut.fit==='slim'?6.5:8.5):9.3;g.userData.rig.stepReach=reach;g.userData.rig.stride=reach*4;}if(g.userData.rig&&['midi','maxi'].includes(cut.length))for(const leg of g.userData.limbs.slice(2))leg.userData.upper.visible=false;const skirtMaterial=referenceMaterial(a,{highDetail:true,surfaceAspect:cut.fit==='slim'?1.4:2.2}),skirt=mesh(group,skirtGeometry(cut,ease),skirtMaterial);skirt.userData.role='skirt-drape';poseCloth(g,skirt);return;}
  for(const [i,limb]of g.userData.limbs.slice(2).entries()){
   const leg=new T.Group();leg.userData={productId:p.id,role:'trouser-leg',side:i};limb.add(leg);(limb.userData.upper||limb.children[0]).visible=false;const wide=cut.fit==='wide'||cut.leg==='wide',tight=cut.leg==='legging',r=(wide?4.15:tight?3.1:3.6)*ease,shorts=cut.kind==='shorts'||cut.setBottom==='shorts'||cut.underwear;
   const cap=mesh(leg,new T.SphereGeometry(r,16,10),plain,0,-.2,0);cap.scale.z=1.05;mesh(leg,new T.CylinderGeometry(r,r*.98,shorts?7.6:8.2,16),material,0,-4.0,0);
   if(!shorts){const shin=new T.Group();shin.userData={productId:p.id,role:'trouser-shin'};(limb.userData.knee||limb).add(shin);if(!limb.userData.knee)shin.position.y=-8;if(limb.userData.lower)limb.userData.lower.visible=false;const hem=cut.leg==='flare'?r*1.25:cut.leg==='jogger'?r*.82:r*.97;mesh(shin,new T.CylinderGeometry(r,hem,8.5,16),material,0,-4.25,0);mesh(shin,new T.TorusGeometry(hem,.22,6,20),trim,0,-8.3,0).rotation.x=Math.PI/2;if(g.userData.rig)retargetLimbGroup(shin,{x:.51,y:11/9,z:.51});poseCloth(g,shin);g.userData.poseCloth.at(-1).limbFloor=true;trackMerchandise(w,shin);}
   for(const sign of [-1,1])mesh(leg,new T.BoxGeometry(.16,7,.2),trim,sign*r,-3.8,r*.55);
   if(cut.pockets>1)mesh(leg,new T.BoxGeometry(2.5,3,.3),trim,0,-2,3.6);if(cut.pockets>=4)mesh(leg,new T.BoxGeometry(3.2,3.5,.5),trim,i?3.3:-3.3,-6,0);if(g.userData.rig)retargetLimbGroup(leg,{x:.51,y:1.5,z:.51});trackMerchandise(w,leg);
  }
 };
 if(cut.coverage==='bottom')bottoms(cut.kind==='skirt');
 else{
  g.userData.torso.visible=['tank','bra','swim'].includes(cut.kind)||cut.sleeve==='none'||cut.length==='cropped';if(g.userData.torso.visible)g.userData.torso.material=g.userData.head.material;
  const body=mesh(group,shirtShell(cut,ease),[material,plain],0,25,0);if(['thigh','maxi'].includes(cut.length)&&!['dress','jumpsuit'].includes(cut.kind))poseCloth(g,body);
  if(cut.sleeve!=='none'){
   for(const [i,limb]of g.userData.limbs.slice(0,2).entries()){
    const sleeve=new T.Group();sleeve.userData={productId:p.id,role:'sleeve',side:i};limb.add(sleeve);const adult=!!g.userData.rig,long=cut.sleeve==='long',length=adult?(long?7.8:cut.sleeve==='puff'?4.4:4.0):(long?15.7:7.6),r=(cut.sleeve==='puff'?4.65:3.85)*ease*(adult?.47:1),cuff=(cut.sleeve==='puff'?3.45:3.65)*ease*(adult?.47:1);
    if(adult&&!long)maskSleevedSkin(w,g,limb,length);
    const patterned=['stripe','plaid','floral'].includes(cut.pattern)||cut.motif==='dots',sleeveMaterial=patterned?referenceMaterial(a,{highDetail:true,surfaceAspect:2*Math.PI*r/length}):plain;
    mesh(sleeve,new T.CylinderGeometry(r,cuff,length,16),sleeveMaterial,0,-length/2+.1,0);mesh(sleeve,new T.CylinderGeometry(cuff+.03,cuff+.03,.45,16),trim,0,-length,0);const shoulder=mesh(sleeve,new T.SphereGeometry(r,16,8,0,Math.PI*2,0,Math.PI/2),sleeveMaterial,adult?(i?-.22:.22):0,.05,0);shoulder.scale.set(1.12,.64,1.02);
    if(long){(limb.userData.upper||limb.children[0]).visible=false;if(adult){limb.userData.lower.visible=false;const fore=new T.Group();fore.userData={productId:p.id,role:'forearm-sleeve',side:i};limb.userData.elbow.add(fore);mesh(fore,new T.SphereGeometry(cuff,14,10),sleeveMaterial);mesh(fore,new T.CylinderGeometry(cuff,cuff*.76,6.5,16),sleeveMaterial,0,-3.2,0);mesh(fore,new T.CylinderGeometry(cuff*.77,cuff*.77,.5,16),trim,0,-6.5,0);trackMerchandise(w,fore);}else mesh(sleeve,new T.SphereGeometry(2.05,12,8),g.userData.head.material,0,-17.4,.5);}
    if(a.sleeveStripes)for(const z of [-.6,0,.6])mesh(sleeve,new T.BoxGeometry(.12,length-.5,.25),trim,i?r:-r,-length/2,z);
    if(cut.quilted)for(let y=-2;y>-length;y-=2.5)mesh(sleeve,new T.TorusGeometry(r-.05,.12,5,18),trim,0,y,0).rotation.x=Math.PI/2;
    trackMerchandise(w,sleeve);
   }
  }else if(cut.neckline==='halter'){ribbon(group,[[-5,31,5.8],[0,35,-3.4],[5,31,5.8]],.8,plain);}
  else if(cut.kind!=='vest'&&cut.neckline!=='strapless'||cut.straps){
   for(const sign of [-1,1])ribbon(group,[[sign*5.2,29.5,5.7],[sign*5.5,34.7,0],[sign*5.2,30,-5.7]],cut.straps==='spaghetti'?.55:cut.straps==='wide'?2.3:1.3,plain);
  }
  if(cut.neckline==='collared')for(const sign of [-1,1]){const shape=new T.Shape();shape.moveTo(sign*3.2,34.4);shape.lineTo(sign*5.2,31.2);shape.lineTo(sign*1.2,29.4);shape.lineTo(0,32.4);shape.closePath();mesh(group,new T.ExtrudeGeometry(shape,{depth:.35,bevelEnabled:false}),trim,0,0,5.2);}
  if(cut.belted){const belt=mesh(group,new T.TorusGeometry(8.6,.48,6,32),trim,0,20,0);belt.rotation.x=Math.PI/2;belt.scale.y=.73;mesh(group,new T.BoxGeometry(2.7,1.1,.5),trim,0,20,6.8);}
  if(cut.highNeck)mesh(group,new T.CylinderGeometry(3.7,4,3,24,1,true),plain,0,35,0);
  if(cut.closure==='zip'||cut.closure==='buttons'){const short=cut.kind==='polo',height=short?5.5:cut.length==='cropped'?11:16,y=short?30.5:25.5;mesh(group,new T.BoxGeometry(.45,height,.35),trim,0,y,6.25);if(cut.closure==='buttons')for(let dy=-height/2+1;dy<height/2;dy+=2.9)mesh(group,new T.SphereGeometry(.32,8,6),trim,0,y+dy,6.5);}
  if(cut.hooded){const hood=mesh(group,new T.TorusGeometry(5.2,1.45,8,24,Math.PI*1.5),plain,0,35.8,-5.5);hood.scale.y=1.06;for(const x of [-1.5,1.5])mesh(group,new T.CylinderGeometry(.14,.14,4.4,6),trim,x,30,6.3);}
  for(let i=0;i<Math.min(cut.pockets,2);i++)mesh(group,new T.BoxGeometry(3.3,3,.45),trim,(i?1:-1)*4.5,22,6.2);
  if(cut.quilted)for(let y=19;y<32;y+=3.6){const rib=mesh(group,new T.TorusGeometry(8.3,.2,5,32),trim,0,y,0);rib.rotation.x=Math.PI/2;rib.scale.y=.73;}
  if(cut.coverage==='full'){if(cut.kind==='dress')bottoms(true);else if(cut.kind==='jumpsuit'||cut.setBottom)bottoms();else{skinLegs(g);if(g.userData.anatomy)g.userData.pelvis.visible=false;mesh(group,new T.CylinderGeometry(7.7,4.1,4.5,24),plain,0,14.8,0).scale.z=.75;}}
 }
 addGarmentBrand(group,a,p,{worn:true});retargetGarmentGroup(g,group);return trackMerchandise(w,group);
}

export function attachHeldProduct(w,g,p,limbIndex=1,{offset=0}={}){
 const limb=g.userData.limbs[limbIndex],holder=new T.Group(),template=merchandiseTemplate(w,p,['shirt','hoodie','cardigan','jacket','pants','shorts'].includes(p.type)),model=template.clone(true),scale=Math.min(.29,(g.userData.rig?42:22.5)/template.userData.size.y),anchor=limb.userData.grip||limb;
 holder.userData={productId:p.id,role:'held',limbIndex,baseLimbIndex:limbIndex,model,anchor,offset};holder.position.set(offset,g.userData.rig?0:-18,offset*.45);anchor.add(holder);holder.add(model);model.scale.setScalar(scale);model.position.y=-template.userData.size.y*scale;
 g.userData.gravityAttachments??=[];g.userData.gravityAttachments.push({holder,limb,anchor});updateAttachmentFrames(g);return {holder,model};
}
function strapPoints(fit){const {appearance:a,model,bodyH:h,bodyW:w,bodyD:d}=fit,{x,y,z}=model.position,top=y+h;
 if(a.carry==='backpack')return [-1,1].map(sign=>[[x+sign*w*.25,top-1,z],[sign*4.9,42.8,-3],[sign*5.4,39,5.0],[x+sign*w*.25,y+2,z]]);
 if(a.carry==='crossbody')return [[[x-w*.35,top,z],[3,31,5.3],[-2,38,5.3],[-4.5,42.8,2.7],[-4.5,42.8,-2.7],[7.5,38,-4],[9,32,-1],[x+w*.35,top,z]]];
 return [-1,1].map(sign=>[[x-w*.32,top,z+sign*d*.35],[6.5,42.8,sign*2.3],[x+w*.32,top,z+sign*d*.35]]);
}
function relaxedStrap(fit,rest,amount){
 const delta=fit.model.position.clone().sub(fit.basePosition),original=rest.points.map(p=>p.clone().add(delta)),length=rest.lengths.reduce((a,b)=>a+b,0),base=fit.model.position.y+.16,center=fit.model.position.clone().add(new T.Vector3(0,.2,fit.bodyD/2+2.5)),loops=Math.max(1,Math.ceil(length/25)),radius=Math.min(3.5,length/(loops*Math.PI*2));
 const points=original.map((p,i)=>{const t=i/(original.length-1),angle=t*Math.PI*2*loops,target=new T.Vector3(center.x+Math.sin(angle)*radius,base+Math.pow(Math.abs(t-.5)*2,6)*fit.bodyH,center.z+Math.cos(angle)*radius);return p.lerp(target,amount);});
 const first=original[0],last=original.at(-1),support=fit.seatPlane+.12,ground=fit.groundPlane+.1;
 // Unhook before sitting. Fixed-length segments settle into loose folds beside the bag.
 for(let pass=0;pass<600;pass++){points[0].copy(first);points.at(-1).copy(last);for(let i=0;i<points.length-1;i++){const d=points[i+1].clone().sub(points[i]),n=d.length();if(n<1e-6)continue;d.multiplyScalar((n-rest.lengths[i])/n);if(i===0)points[i+1].sub(d);else if(i===points.length-2)points[i].add(d);else{points[i].addScaledVector(d,.5);points[i+1].addScaledVector(d,-.5);}}for(let i=1;i<points.length-1;i++){points[i].y=Math.max(points[i].y,amount>.85?support:ground);}}
 points[0].copy(first);points.at(-1).copy(last);return points.map(p=>p.toArray());
}
function swayStrap(fit,rest){const angle=fit.sway||0,center=fit.basePosition.clone().add(new T.Vector3(0,fit.bodyH,0)),rotate=p=>p.clone().sub(center).applyAxisAngle(new T.Vector3(0,0,1),angle).add(center),first=rotate(rest.points[0]).sub(rest.points[0]),last=rotate(rest.points.at(-1)).sub(rest.points.at(-1));return rest.points.map((p,i)=>{const t=i/(rest.points.length-1);return p.clone().addScaledVector(first,Math.pow(1-t,3)).addScaledVector(last,Math.pow(t,3)).toArray();});}
function rebuildStraps(fit,seated=0){
 if(!fit.restStraps)fit.restStraps=strapPoints(fit).map(points=>{const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),sample=curve.getPoints(32);return {points:sample,lengths:sample.slice(1).map((p,i)=>p.distanceTo(sample[i]))};});
 for(const s of fit.straps){fit.resources.delete(s.mesh.geometry);s.mesh.geometry.dispose();s.mesh.removeFromParent();if(s.chain){fit.resources.delete(s.chain.geometry);s.chain.geometry.dispose();s.chain.removeFromParent();}}
 fit.straps=fit.restStraps.map(rest=>{const points=seated?relaxedStrap(fit,rest,seated):swayStrap(fit,rest),m=ribbon(fit.group,points,fit.appearance.carry==='backpack'?.8:.48,fit.material,true);fit.resources.add(m.geometry);const chain=fit.appearance.bag.chain?addChainLinks(fit.group,points,fit.metal,{radius:.27,wire:.06}):null;if(chain)fit.resources.add(chain.geometry);return {mesh:m,points,width:.48,chain};});
}
export function attachWornBag(w,g,p){
 const a=productAppearance(p);if(a.carry==='hand'){const held=attachHeldProduct(w,g,p,1);g.userData.ownedHandBag=true;return held.holder;}
 const group=new T.Group();group.userData={productId:p.id,role:'worn-bag',carry:a.carry};g.add(group);const model=merchandiseTemplate(w,p,false,true).clone(true),scale=.29,size=model.userData.size,bodyH=size.y*scale,bodyW=size.x*scale,bodyD=size.z*scale,material=referenceMaterial(a,{trim:true}),metal=referenceMaterial(a,{metal:true});group.add(model);model.scale.setScalar(scale);
 if(a.carry==='backpack')model.position.set(0,25,-4.3-bodyD/2),model.rotation.y=Math.PI;
 else if(a.carry==='crossbody')model.position.set(Math.min(3,6.5-bodyW/2),24,4.5+bodyD/2);
 else model.position.set(9.0+bodyW/2,Math.max(5,41-(a.handleDrop||22)*scale-bodyH),0);
 const fit={group,model,appearance:a,scale,bodyH,bodyW,bodyD,material,metal,basePosition:model.position.clone(),resources:w.resources,straps:[],lastPose:null};g.userData.bagFit=fit;rebuildStraps(fit);return trackMerchandise(w,group);
}
export function updateOutfitPose(g,{seated=false,walking=false,distance=0,kind='',time=0,reducedMotion=false,blend=1,seatHeight=15,delta=0}={}){
 const amount=seated?Math.max(0,Math.min(1,blend)):0,limbs=g.userData.limbs,adult=!!g.userData.rig;applyCharacterPose(g,{seated,walking,distance,kind,time,reducedMotion,blend,seatHeight,delta});
 if(!adult)for(const limb of limbs.slice(2)){if(limb.userData.knee)limb.userData.knee.rotation.x=.8*amount;const shoe=limb.userData.shoe;if(shoe)shoe.rotation.x=-limb.rotation.x-(limb.userData.knee?.rotation.x||0);}
 g.updateMatrixWorld(true);
 for(const {object,rest,limbFloor}of g.userData.poseCloth||[]){
  const meshes=object.isMesh?[object]:object.children.filter(o=>o.isMesh);
  // Limb cuffs use their own rest vertices; floor response is performed in world space.
  if(limbFloor){for(const m of meshes){m.userData.clothRest??=new Float32Array(m.geometry.attributes.position.array);const p=m.geometry.attributes.position,src=m.userData.clothRest,inv=m.matrixWorld.clone().invert();for(let i=0;i<p.count;i++){const v=new T.Vector3(src[i*3],src[i*3+1],src[i*3+2]),world=v.clone().applyMatrix4(m.matrixWorld);if(world.y<.08){world.y=.08;v.copy(world.applyMatrix4(inv));}p.setXYZ(i,v.x,v.y,v.z);}p.needsUpdate=true;m.geometry.computeVertexNormals();m.geometry.computeBoundingSphere();}continue;}
  const p=object.geometry.attributes.position;
  for(let i=0;i<p.count;i++){let x=rest[i*3],y=rest[i*3+1],z=rest[i*3+2],hip=adult?25:17,drop=hip-y-object.position.y;
   if(drop>0&&amount){const theta=(adult?1.1:.8)*amount*Math.min(1,drop/5),upper=Math.min(drop,12),lower=Math.max(0,drop-12),bend=theta*(1-Math.min(1,lower/10));y=hip-upper*Math.cos(theta)-lower+z*Math.sin(bend);z=upper*Math.sin(theta)+z*Math.cos(bend)*(1-.22*amount);
    if(adult){const seat=seatHeight-g.position.y+.15,support=Math.max(0,Math.min(1,(16.2-z)/8))*amount;y+=Math.max(0,seat-y)*support;}
   }
   if(adult&&walking&&!reducedMotion&&!amount&&drop>1){const follow=Math.min(1,drop/23),phase=distance/(g.userData.rig.stride||40)*Math.PI*2;x+=Math.sin(phase-drop*.08)*.32*follow*follow;z+=Math.sin(phase*2-drop*.1)*.35*follow;}
   if(adult)y=Math.max(y,.1-g.position.y-object.position.y);p.setXYZ(i,x,y,z);
  }p.needsUpdate=true;object.geometry.computeVertexNormals();object.geometry.computeBoundingSphere();
 }
 const fit=g.userData.bagFit;
 if(fit){const next=fit.basePosition.clone(),carry=fit.appearance.carry;fit.sway=walking&&!reducedMotion&&!amount?Math.sin(distance/(g.userData.rig?.stride||40)*Math.PI*2)*(carry==='crossbody'?.012:.025):0;fit.model.rotation.z=fit.sway;next.x+=Math.sin(fit.sway)*fit.bodyH;next.y+=(1-Math.cos(fit.sway))*fit.bodyH;if(amount){const park=new T.Vector3(9.5+fit.bodyW/2,seatHeight-g.position.y+.15,1.5);next.lerp(park,amount);}fit.model.rotation.y=carry==='backpack'?Math.PI*(1-amount):0;
  if(fit.model.position.distanceToSquared(next)>1e-8||fit.lastPose!==amount||fit.lastSway!==fit.sway){fit.model.position.copy(next);fit.seatPlane=seatHeight-g.position.y;fit.groundPlane=-g.position.y;rebuildStraps(fit,amount);fit.lastPose=amount;fit.lastSway=fit.sway;}
 }
 const eating=['eat','drink','icecream','tea'].includes(kind);g.userData.seatAmount=amount;g.userData.seatHeight=seatHeight;
 for(const entry of g.userData.gravityAttachments||[]){const {holder}=entry;holder.userData.baseLimbIndex??=holder.userData.limbIndex??1;const index=eating?0:holder.userData.baseLimbIndex,target=limbs[index];entry.limb=target;entry.anchor=target.userData.grip||target;holder.userData.limbIndex=index;}
 updateAttachmentFrames(g);
}
export function updateAttachmentFrames(g){const adult=!!g.userData.rig,amount=g.userData.seatAmount||0;if(adult&&amount<.95){for(const index of [0,1]){const entries=(g.userData.gravityAttachments||[]).filter(e=>e.holder.visible&&g.userData.limbs.indexOf(e.limb)===index);if(entries.length){const height=Math.max(...entries.map(e=>{const m=e.holder.userData.model;return m?m.userData.size.y*m.scale.y:14;}));const width=Math.max(...entries.map(e=>{const m=e.holder.userData.model;return m?m.userData.size.x*m.scale.x:9;}));solveArmToGrip(g,index,Math.max(32,height+1.5-g.position.y),5.5,(index?1:-1)*(7.2+width/2));}}}for(const entry of g.userData.gravityAttachments||[]){const {holder,limb}=entry,model=holder.userData.model,height=model?model.userData.size.y*model.scale.y:14,index=g.userData.limbs.indexOf(limb),anchor=entry.anchor||limb.userData.grip||limb;

 if(adult&&amount>0&&holder.visible){if(holder.parent!==g)g.attach(holder);g.updateMatrixWorld(true);const from=anchor.getWorldPosition(new T.Vector3());g.worldToLocal(from);const width=model?model.userData.size.x*model.scale.x:9,park=new T.Vector3((index?1:-1)*(8+width/2)+(holder.userData.offset||0),g.userData.seatHeight-g.position.y+height+.15,1.5);holder.position.lerpVectors(from,park,amount);holder.quaternion.identity();holder.userData.parked=true;}
 else{if(holder.parent!==anchor)anchor.add(holder);holder.position.set(holder.userData.offset||0,adult?0:-18,(holder.userData.offset||0)*.45);holder.userData.parked=false;
  if(!adult&&model&&holder.visible){const limit=-Math.acos(Math.max(0,Math.min(1,(limb.position.y-height-1.5)/18)));limb.rotation.x=Math.min(limb.rotation.x,limit);}
  g.updateMatrixWorld(true);const rootQ=g.getWorldQuaternion(new T.Quaternion()),parentQ=anchor.getWorldQuaternion(new T.Quaternion());holder.quaternion.copy(parentQ.invert().multiply(rootQ));
 }
}const grasp=[0,0];if(['eat','drink','icecream','tea'].includes(g.userData.rig?.pose.kind))grasp[1]=.85;for(const e of g.userData.gravityAttachments||[])if(e.holder.visible&&!e.holder.userData.parked)grasp[g.userData.limbs.indexOf(e.limb)]=1;poseHumanHands(g,grasp);}

// A preview owns its rig/garment resources; cached shelf/bag meshes remain shared.
export function releasePersonResources(w,person){
 const collect=object=>{const found=new Set();object.traverse(o=>{if(!o.isMesh)return;found.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){found.add(m);for(const key of ['map','bumpMap','roughnessMap'])if(m[key])found.add(m[key]);if(m.userData.detailTexture)found.add(m.userData.detailTexture);}});return found;};
 const shared=new Set([...(w.humanSharedResources||[]),...(w.finishTextures?.values()||[])]);for(const model of w.merchandiseCache?.values()||[])for(const r of collect(model))shared.add(r);
 person.userData.anatomy?.skeleton.dispose();
 for(const r of collect(person))if(!shared.has(r)){w.resources.delete(r);r.dispose();}
}
