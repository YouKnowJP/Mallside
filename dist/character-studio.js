import * as T from './vendor/three.module.js';
import {createShopper} from './character-rig.js?v=25.0.0';
import {dressPerson} from './merchandise-carry.js?v=25.0.0';
import {updateOutfitPose,releasePersonResources} from './merchandise-fit.js?v=23.0.0';
import {equippedLook} from './engine.js?v=25.0.0';

// The dressing room uses the same rig, products and pose solver as the mall.
export class CharacterStudio{
 constructor(canvas,state,{facing='down',pose='stand',focus='body'}={}){
  this.canvas=canvas;this.state=state;this.resources=new Set();this.textures=new Map();this.scene=new T.Scene();this.scene.background=new T.Color('#e8e3d6');this.renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.camera=new T.PerspectiveCamera(31,1,.1,300);this.scene.add(new T.HemisphereLight('#fff6e8','#b6b3aa',1.1));const key=new T.DirectionalLight('#fff2de',1.4);key.position.set(-25,65,40);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-35,right:35,top:60,bottom:-20,near:1,far:150});key.shadow.bias=-.0003;this.scene.add(key);const fill=new T.DirectionalLight('#deebf2',.65);fill.position.set(30,35,20);this.scene.add(fill);
  const floor=this.mesh(new T.CircleGeometry(65,64),this.mat('#e0d8c4'));floor.rotation.x=-Math.PI/2;floor.position.y=-.04;floor.receiveShadow=true;this.bench=new T.Group();this.scene.add(this.bench);this.box(0,12,-1,80,6,24,'#a28160',this.bench);this.box(0,26,-11,80,22,3,'#b79772',this.bench);for(const x of [-32,32])this.box(x,6,-1,3,12,20,'#5f6d61',this.bench);this.bench.visible=false;
  this.facing=facing;this.pose=pose;this.focus=focus;this.rotation={down:0,left:-Math.PI/2,right:Math.PI/2,up:Math.PI}[facing]||0;this.sit=pose==='sit'?1:0;this.clock=0;this.alive=true;this.camera.position.set(0,32,116);this.rebuild();this.resize();this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);this.frame=requestAnimationFrame(t=>this.draw(t));
 }
 mat(color,extra={}){const m=new T.MeshStandardMaterial({color,roughness:.76,...extra});this.resources.add(m);return m;}
 mesh(geo,mat,parent=this.scene){this.resources.add(geo);const m=new T.Mesh(geo,mat);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
 box(x,y,z,w,h,d,color,parent=this.scene){const m=this.mesh(new T.BoxGeometry(w,h,d),this.mat(color),parent);m.position.set(x,y,z);return m;}
 rebuild(){if(this.player){this.player.removeFromParent();releasePersonResources(this,this.player);}this.player=createShopper(this,this.state.appearance.shirt,this.state.appearance,equippedLook(this.state),dressPerson);this.signature=JSON.stringify([this.state.appearance,this.state.equipment]);}
 resize(){const r=this.canvas.getBoundingClientRect(),width=Math.max(1,r.width||500),height=Math.max(1,r.height||600);this.renderer.setSize(width,height,false);this.camera.aspect=width/height;this.camera.updateProjectionMatrix();}
 setFacing(value){this.facing=value;}
 setPose(value){this.pose=value;}
 setFocus(value){this.focus=value;}
 draw(now){if(!this.alive||!this.canvas.isConnected)return;const dt=this.last?Math.min(.05,(now-this.last)/1000):0;this.last=now;this.clock+=dt;const signature=JSON.stringify([this.state.appearance,this.state.equipment]);if(signature!==this.signature)this.rebuild();const reduced=this.state.preferences.reducedMotion,target={down:0,left:-Math.PI/2,right:Math.PI/2,up:Math.PI}[this.facing]||0;this.rotation+=Math.atan2(Math.sin(target-this.rotation),Math.cos(target-this.rotation))*(reduced?1:.15);this.sit+=(Number(this.pose==='sit')-this.sit)*(reduced?1:.16);if(this.sit<.001)this.sit=0;if(this.sit>.999)this.sit=1;this.player.rotation.y=this.rotation;this.bench.rotation.y=this.rotation;this.bench.visible=this.sit>.01;
  updateOutfitPose(this.player,{walking:this.pose==='walk',distance:this.clock*38,time:this.clock,seated:this.sit>0,blend:this.sit,kind:this.sit?'rest':'',reducedMotion:reduced});
  const face=this.focus==='face',p=face?new T.Vector3(0,this.player.position.y+47.5,25):new T.Vector3(0,32,116),look=face?new T.Vector3(0,this.player.position.y+47.5,0):new T.Vector3(0,26,0);if(reduced)this.camera.position.copy(p);else this.camera.position.lerp(p,.14);this.camera.lookAt(look);this.player.updateMatrixWorld(true);this.renderer.render(this.scene,this.camera);this.frames=(this.frames||0)+1;if(now-(this.telemetryAt||0)>400){this.telemetryAt=now;for(const [key,value]of Object.entries({characterModel:'MakeHuman HM08',previewPose:this.pose,previewFocus:this.focus,frame:String(this.frames)}))if(this.canvas.dataset[key]!==value)this.canvas.dataset[key]=value;}this.frame=requestAnimationFrame(t=>this.draw(t));
 }
 destroy(){this.alive=false;cancelAnimationFrame(this.frame);this.observer?.disconnect();this.player?.userData.anatomy?.skeleton.dispose();for(const r of this.resources)r.dispose?.();this.resources.clear();this.renderer.dispose();this.renderer.forceContextLoss();}
}
