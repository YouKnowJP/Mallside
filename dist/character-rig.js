import {addHumanAnatomy,poseHumanHands,updateHumanFace} from './human-anatomy.js?v=23.0.0';
import * as T from './vendor/three.module.js';

export const CHARACTER={height:52,hipHeight:25,shoulderHeight:40.8,upperLeg:12,lowerLeg:11,upperArm:7.7,forearm:7.1,stride:40,pelvisBottom:21.2,ankleHeight:1.6};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function lerpTable(y,table){for(let i=1;i<table.length;i++)if(y<=table[i][0]){const [a,x]=table[i-1],[b,z]=table[i];return x+(z-x)*clamp((y-a)/(b-a),0,1);}return table.at(-1)[1];}
export function bodyY(y){return y<=16?y*25/16:y+9;}
export function bodyEnvelope(y){return {x:lerpTable(y,[[21.5,4.4],[25,5.15],[29,4.5],[34,5.2],[38,5.8],[41,5.2],[43,2.1],[44,1.4],[46,1.4]]),z:lerpTable(y,[[21.5,2.6],[25,3.0],[29,2.65],[34,3.25],[38,3.2],[41,2.8],[43,1.6],[44,1.3],[46,1.3]])};}
export function retargetBodyPoint(x,y,z,profile=null,ease=1){const yy=bodyY(y),sx=lerpTable(y,[[0,.67],[16,.67],[22,.61],[29,.70],[32,.71],[35,.49],[60,.49]]);let xx=x*sx,zz=z*.55;
 // Keep fitted fabric outside the skin envelope; a smaller game size adds ease without cutting through skin.
 if(yy>=22&&yy<=44.5){const sampled=profile&&profile[Math.max(0,Math.min(profile.length-1,Math.round((yy-20)*2)))],env=sampled?{x:sampled[0],z:z>=0?sampled[1]:sampled[2]}:bodyEnvelope(yy),clearance=.12+Math.max(0,ease-.9)*1.6,r=Math.hypot(xx/(env.x+clearance),zz/(env.z+clearance));if(r>1e-6&&r<1){xx/=r;zz/=r;}}
 return new T.Vector3(xx,yy,zz);
}
function loft(rings,segments=32){const p=[],uv=[],idx=[];for(let r=0;r<rings.length;r++){const [y,x,z]=rings[r];for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2;p.push(Math.cos(a)*x,y,Math.sin(a)*z);uv.push(i/segments,r/(rings.length-1));if(r<rings.length-1&&i<segments){const k=r*(segments+1)+i;idx.push(k,k+segments+1,k+1,k+1,k+segments+1,k+segments+2);}}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;}
export function createShopper(w,color,appearance={},equipment={},dress){
 appearance={...appearance,hairStyle:appearance.hairStyle||((parseInt(String(color).slice(-2),16)||0)%3===0?'bob':'short'),faceStyle:appearance.faceStyle||((parseInt(String(color).slice(-2),16)||0)%2?'defined':'natural')};
 const g=new T.Group(),skin=w.mat(appearance.skin||'#d4a27d',{roughness:.68}),base=w.mat(equipment.top?.color||color,{roughness:.92}),pants=w.mat(equipment.bottom?.color||'#526775',{roughness:.94}),shoeMat=w.mat(equipment.shoes?.color||'#e7e2d8');
 const mesh=(geo,mat,parent=g,x=0,y=0,z=0)=>{const m=w.mesh(geo,mat,parent);m.position.set(x,y,z);return m;},ellipse=(x,y,z,sx,sy,sz,mat,parent=g)=>{const m=mesh(new T.SphereGeometry(1,20,14),mat,parent,x,y,z);m.scale.set(sx,sy,sz);return m;};
 const headGroup=new T.Bone();headGroup.position.y=46.7;g.add(headGroup);const limbs=[];
 for(const sign of [-1,1]){const arm=new T.Bone();arm.position.set(sign*6.5,40.8,0);g.add(arm);const elbow=new T.Bone();elbow.position.y=-7.7;arm.add(elbow);const hand=new T.Bone();hand.position.y=-7.1;elbow.add(hand);const grip=new T.Group();grip.position.set(0,-2.4,.5);hand.add(grip);arm.userData={elbow,hand,grip,upperLength:7.7,lowerLength:7.1};limbs.push(arm);}
 for(const sign of [-1,1]){const leg=new T.Bone();leg.position.set(sign*2.7,25,0);g.add(leg);const knee=new T.Bone();knee.position.y=-12;leg.add(knee);const foot=new T.Bone();foot.position.y=-11;knee.add(foot);const shoe=ellipse(0,-.68,1.12,1.38,.92,2.75,shoeMat,foot);ellipse(0,-1.36,1.12,1.40,.24,2.8,w.mat('#f4efe4'),foot);for(let i=0;i<4;i++){const lace=mesh(new T.CapsuleGeometry(.055,1.6,2,6),w.mat('#f4f1e7'),foot,0,.1-i*.08,.2+i*.38);lace.rotation.z=Math.PI/2;}leg.userData={knee,foot,shoe,ankle:foot,upperLength:12,lowerLength:11};limbs.push(leg);}
 g.userData={limbs,rig:{...CHARACTER,profile:'adult-v23',headGroup,pose:{}}};addHumanAnatomy(w,g,appearance,{skin,base,pants,headGroup,limbs});
 if(equipment.hat){g.userData.anatomy.meshes.get('hair').visible=false;ellipse(0,4.2,.1,2.9,1.4,3.05,w.mat(equipment.hat.color),headGroup);const brim=mesh(new T.CapsuleGeometry(.18,3.5,3,12),w.mat(equipment.hat.color),headGroup,0,3.6,3.15);brim.rotation.z=Math.PI/2;}
 if(equipment.belt){const m=mesh(new T.TorusGeometry(5.25,.28,6,32),w.mat(equipment.belt.color),g,0,26,0);m.rotation.x=Math.PI/2;m.scale.y=.6;}
 if(equipment.scarf){const m=mesh(new T.TorusGeometry(1.8,.55,8,24),w.mat(equipment.scarf.color),g,0,43.3,0);m.rotation.x=Math.PI/2;}
 if(equipment.jewelry?.type==='sunglasses'){for(const x of [-.96,.96])ellipse(x,.97,3.47,.80,.48,.16,w.mat('#35433e'),headGroup);mesh(new T.BoxGeometry(.5,.11,.12),w.mat('#bda073'),headGroup,0,.98,3.55);}else if(equipment.jewelry)ellipse(0,38,3.5,.4,.6,.15,w.mat('#c6a76b'));
 if(equipment.watch){const band=mesh(new T.TorusGeometry(.99,.16,6,16),w.mat(equipment.watch.color),limbs[1].userData.hand,0,.45,0);band.rotation.x=Math.PI/2;}
 if(equipment.bag&&!equipment.bag.type)ellipse(9.5,28,0,3.4,4,1.7,w.mat(equipment.bag.color||'#ab815c'));
 dress?.(w,g,equipment);w.scene.add(g);applyCharacterPose(g,{});return g;
}

export function retargetGarmentGroup(g,group){
 if(!g.userData.rig)return;g.updateMatrixWorld(true);const rootInverse=g.matrixWorld.clone().invert();group.traverse(o=>{if(!o.isMesh)return;o.updateMatrixWorld(true);const matrix=new T.Matrix4().multiplyMatrices(rootInverse,o.matrixWorld),p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){const old=new T.Vector3(p.getX(i),p.getY(i),p.getZ(i)).applyMatrix4(matrix),v=retargetBodyPoint(old.x,old.y,old.z,g.userData.anatomy?.envelope,group.userData.ease||1);p.setXYZ(i,v.x,v.y,v.z);}o.position.set(0,0,0);o.rotation.set(0,0,0);o.scale.set(1,1,1);p.needsUpdate=true;o.geometry.computeVertexNormals();o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();});
 for(const record of g.userData.poseCloth||[])if(group.getObjectById(record.object.id))record.rest=new Float32Array(record.object.geometry.attributes.position.array);
}
export function retargetLimbGroup(group,{x=.5,y=1,z=.55}={}){group.traverse(o=>{if(!o.isMesh)return;o.geometry.scale(x,y,z);o.position.multiply(new T.Vector3(x,y,z));o.geometry.computeVertexNormals();o.geometry.computeBoundingSphere();});}

export function solveTwoBone(down,forward,upper,lower,reverse=false){const r=clamp(Math.hypot(down,forward),.05,upper+lower-.0001),theta=Math.atan2(forward,down),alpha=Math.acos(clamp((upper*upper+r*r-lower*lower)/(2*upper*r),-1,1)),bend=Math.PI-Math.acos(clamp((upper*upper+lower*lower-r*r)/(2*upper*lower),-1,1));return {upper:-theta+(reverse?alpha:-alpha),lower:reverse?-bend:bend};}
export function solveArmToGrip(g,index,y,z=7.5,x=null){
 const arm=g.userData.limbs[index],a=arm.userData;if(!a.elbow)return;const desired=new T.Vector3(x??arm.position.x,y,z),wrist=desired.clone(),origin=arm.position.clone(),total=a.upperLength+a.lowerLength;
 for(let pass=0;pass<4;pass++){
  const d=wrist.clone().sub(origin),r=Math.max(.05,Math.min(total-.001,d.length()));d.normalize();const along=(a.upperLength*a.upperLength-a.lowerLength*a.lowerLength+r*r)/(2*r),height=Math.sqrt(Math.max(0,a.upperLength*a.upperLength-along*along)),bend=new T.Vector3(0,-1,0).addScaledVector(d,d.y);if(bend.lengthSq()<.001)bend.set(0,0,-1);bend.normalize();const elbow=origin.clone().addScaledVector(d,along).addScaledVector(bend,height),end=origin.clone().addScaledVector(d,r),q1=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,-1,0),elbow.clone().sub(origin).normalize()),q2=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,-1,0),end.sub(elbow).normalize());arm.quaternion.copy(q1);a.elbow.quaternion.copy(q1.clone().invert().multiply(q2));
  g.updateMatrixWorld(true);const actual=g.worldToLocal(a.grip.getWorldPosition(new T.Vector3()));wrist.add(desired.clone().sub(actual));
 }
}
function levelFoot(g,leg){const foot=leg.userData.foot;if(!foot)return;foot.rotation.set(-leg.rotation.x-leg.userData.knee.rotation.x,0,0);}
export function applyCharacterPose(g,{walking=false,distance=0,time=0,seated=false,blend=1,kind='',reducedMotion=false,seatHeight=15,attention=g.userData.attention||0}={}){
 const rig=g.userData.rig;if(!rig)return;const elevated=['escalator','bridge','carousel'].includes(kind)?g.position.y:null;const amount=seated?clamp(blend,0,1):0,move=walking&&!reducedMotion&&!seated,phase=((distance/rig.stride)%1+1)%1,reach=rig.stepReach||10,stanceZ=reach-reach*4*(phase%.5),baseY=move?Math.sqrt((rig.upperLeg+rig.lowerLeg)**2-stanceZ**2)+rig.ankleHeight-rig.hipHeight:-.4,seatedY=seatHeight-rig.pelvisBottom;g.position.y=baseY+(seatedY-baseY)*amount;
 for(const [i,leg]of g.userData.limbs.slice(2).entries()){
  let z=0,lift=0,contact=true,cycle=(phase+i*.5)%1;if(move){contact=cycle<.5;const t=contact?cycle*2:(cycle-.5)*2;z=contact?reach-reach*2*t:-reach+reach*2*(t*t*(3-2*t));lift=contact?0:Math.min(3.2,reach*.32)*Math.sin(t*Math.PI);}
  const hipY=25+g.position.y,targetY=rig.ankleHeight+lift,seatDrop=25+seatedY-rig.ankleHeight-rig.lowerLeg,seatZ=Math.sqrt(Math.max(0,rig.upperLeg**2-seatDrop**2));z=z*(1-amount)+seatZ*amount;
  const angles=solveTwoBone(hipY-targetY,z,rig.upperLeg,rig.lowerLeg);leg.rotation.x=angles.upper;leg.rotation.z=0;leg.userData.knee.rotation.x=angles.lower;leg.userData.contact=contact||amount>0;leg.userData.target={y:targetY,z};levelFoot(g,leg);
 }
 if(!kind||kind==='walk'||kind==='rest'||kind==='try')for(const [i,arm]of g.userData.limbs.slice(0,2).entries()){const swing=move?Math.sin(phase*Math.PI*2)*(i?1:-1)*.28:0;arm.rotation.x=swing-.035;arm.rotation.z=(i?1:-1)*.075;arm.userData.elbow.rotation.x=move?-.17-Math.max(0,-swing)*.4:-.10;if(amount)solveArmToGrip(g,i,29,7.5);}
 else for(const arm of g.userData.limbs.slice(0,2))if(arm.userData.elbow)arm.userData.elbow.rotation.x=-.25;
 if(['eat','drink','icecream','tea'].includes(kind)){const sip=(Math.sin(time*3)+1)/2;solveArmToGrip(g,1,36.5+7.2*sip,8-1.8*sip);g.userData.limbs[1].rotation.z=0;}
 if(elevated!==null){g.position.y=elevated;if(kind==='carousel')for(const leg of g.userData.limbs.slice(2)){leg.rotation.x=-1.05;leg.userData.knee.rotation.x=1.2;levelFoot(g,leg);}}
 if(kind==='wrap')for(let i=0;i<2;i++)solveArmToGrip(g,i,31+(reducedMotion?0:Math.sin(time*2+i)*.6),11);const idle=reducedMotion?0:Math.sin(time*1.1+(g.userData.anatomy?.seed||0))*.045;rig.headGroup.rotation.x=reducedMotion?0:kind==='wrap'?.12:move?0:Math.sin(time*.8)*.012;rig.headGroup.rotation.y=reducedMotion?0:move?Math.sin(phase*Math.PI*2)*.018:idle+clamp(Number.isFinite(attention)?attention:0,-.28,.28);rig.headGroup.rotation.z=move?Math.sin(phase*Math.PI*2)*.008:0;rig.pose={seated:amount,walking:move,phase,seatHeight,kind};updateHumanFace(g,time,reducedMotion);const grasp=[0,0];if(['eat','drink','icecream','tea'].includes(kind))grasp[1]=.85;for(const entry of g.userData.gravityAttachments||[])if(entry.holder.visible&&amount<.5)grasp[g.userData.limbs.indexOf(entry.limb)]=1;poseHumanHands(g,grasp);
}
