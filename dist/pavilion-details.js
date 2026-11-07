import * as T from './vendor/three.module.js';
import {currentPopup,byId} from './engine.js?v=68.0.0';
import {PRODUCT_PHOTOS} from './product-photos.js?v=67.0.0';
import {detailBoxes} from './detail-instances.js?v=48.0.0';

// Original exhibition furniture and photographic cards, inside the existing counter footprint.
export function buildPavilionDetails(w,v){
 const root=new T.Group(),width=v.width,depth=v.height,long=width>=depth,L=Math.max(width,depth),D=Math.min(width,depth);root.position.set(v.x+width/2,0,v.y+depth/2);w.scene.add(root);const parts=[],wood='#aa8761',ink='#48675d',paper='#eee6d3',point=(u,y,d)=>[long?u:d,y,long?d:u],box=(u,y,d,ww,h,dd,c)=>parts.push([...point(u,y,d),long?ww:dd,h,long?dd:ww,c]);
 for(const sign of[-1,1]){box(sign*(L/2-7),24,-D/2+7,3,48,3,ink);box(sign*(L/2-7),66,-D/2+7,2.5,40,2.5,ink);}
 box(0,76,-D/2+7,L-10,3,12,wood);for(let i=0;i<9;i++)box((i-4)*(L-12)/9,78,-D/2+7,(L-12)/9-.4,1.5,12,i%2?'#dbb668':'#eee1bd');
 box(0,17,D/2-2,L-12,28,1,wood);for(const sign of[-1,1])box(sign*L*.25,23,D/2-1.3,14,1,1,paper);
 const cards=[];for(let i=0;i<4;i++){const u=(i-1.5)*(L-24)/4;box(u,44,0,24,2,30,ink);box(u,45.3,0,20,.6,26,paper);const card=new T.Group();card.position.set(...point(u,46,0));if(!long)card.rotation.y=Math.PI/2;root.add(card);const frame=w.mesh(new T.BoxGeometry(20,23,1),w.mat(ink),card);frame.position.set(0,11.5,0);const plane=w.mesh(new T.PlaneGeometry(18,21),w.mat('#ffffff',{side:T.DoubleSide,roughness:.9}),card);plane.position.set(0,11.5,.6);card.userData.plane=plane;card.userData.originalPhotoCard=true;w.tag?.(card,'venue:popup',v.door);cards.push(card);}
 box(L/2-14,44,D/2-13,14,2,17,wood);box(L/2-14,45.2,D/2-13,11,.4,14,paper);box(L/2-14,49,D/2-13,4,7,4,ink);box(L/2-14,53,D/2-13,8,2,7,wood);
 const mark=w.mesh(new T.CylinderGeometry(4,4,.5,24),w.mat('#618566'),root);mark.position.set(...point(L/2-14,45.8,D/2-13));mark.visible=false;
 let canvas=null,texture=null;if(globalThis.document?.createElement){canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;if(canvas.getContext?.('2d')){texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;w.resources.add(texture);}else canvas=null;}
 const board=w.mesh(new T.PlaneGeometry(L-20,18),w.mat(paper,{...texture?{map:texture}:{},side:T.DoubleSide,roughness:.9}),root);board.position.set(...point(0,65,-D/2+9));if(!long)board.rotation.y=Math.PI/2;board.userData.originalPavilionSign=true;
 detailBoxes(w,root,parts);w.pavilionDesk={root,cards,mark,canvas,texture,signature:null,width,depth};w.canvas.dataset.pavilionRevision='62';updatePavilionDetails(w);return root;
}
function fitCard(card){const plane=card.userData.plane,image=plane.material.map?.image;if(!image?.width)return;const k=Math.min(18/image.width,21/image.height);plane.scale.set(image.width*k/18,image.height*k/21,1);}
export function updatePavilionDetails(w){
 const d=w.pavilionDesk;if(!d)return;const event=currentPopup(w.state),claimed=w.state.popupStamps.some(s=>s.day===w.state.day),signature=w.state.day+':'+event.id+':'+claimed;if(d.signature===signature)return;d.signature=signature;d.mark.visible=claimed;
 if(d.canvas){const c=d.canvas.getContext('2d');c.fillStyle='#eee6d3';c.fillRect(0,0,1024,256);c.fillStyle='#3e6153';c.font='600 56px Georgia';c.textAlign='center';c.fillText(event.title,512,93,950);c.font='28px Arial';c.fillText('DAY '+w.state.day+' · GAME SHOWCASE'+(claimed?' · STAMP COLLECTED':''),512,158,950);c.fillStyle='#8d6946';c.font='24px Arial';c.fillText('Compare · read the source · visit the stockist',512,209,950);d.texture.needsUpdate=true;}
 for(const [i,card]of d.cards.entries()){const p=byId(event.products[i]);card.userData.productId=p?.id||'';card.userData.interaction=p?'pavilion-source:'+p.id:'venue:popup';if(card.userData.lastProduct===p?.id)continue;card.userData.lastProduct=p?.id||'';card.visible=!!p;const photo=PRODUCT_PHOTOS[p?.id];if(!photo||!globalThis.document?.createElementNS)continue;let tx=w.textures.get(photo.path);if(!tx){tx=new T.TextureLoader().load(photo.path,loaded=>{for(const c of w.pavilionDesk?.cards||[])if(c.userData.plane.material.map===loaded)fitCard(c);});tx.colorSpace=T.SRGBColorSpace;w.textures.set(photo.path,tx);w.resources.add(tx);}card.userData.plane.material.map=tx;card.userData.plane.material.needsUpdate=true;fitCard(card);}
 w.canvas.dataset.pavilionEvent=event.id;w.canvas.dataset.pavilionDay=String(w.state.day);w.canvas.dataset.pavilionStamped=String(claimed);
}
