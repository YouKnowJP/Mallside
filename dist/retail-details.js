import * as T from './vendor/three.module.js';
import {departmentOf,displayPoint} from './shop-interiors.js?v=63.0.0';
import {money,price} from './engine.js?v=66.0.0';
import {shopSurface} from './shop-surfaces.js?v=57.0.0';

export function displayCard(state,p,index){return {number:String(index+1).padStart(2,'0'),department:departmentOf(p),name:p.name,price:money(price(state,p)),note:'Game price · inspect for sizes'};}
function cardTexture(w,card){
 if(typeof document==='undefined')return null;
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;const c=canvas.getContext('2d');
 c.fillStyle='#f5f0e4';c.fillRect(0,0,512,256);c.fillStyle='#a88e62';c.fillRect(24,24,4,208);c.fillStyle='#5b655a';c.font='600 20px Arial';c.fillText(card.number+' / '+card.department.toUpperCase(),48,44,442);
 c.fillStyle='#263c32';c.font='600 27px Arial';let line='',y=88;for(const word of card.name.split(' ')){const next=line?line+' '+word:word;if(c.measureText(next).width>426&&line){c.fillText(line,48,y,426);y+=32;line=word;if(y>120)break;}else line=next;}if(y<=120)c.fillText(line,48,y,426);
 c.font='600 36px Arial';c.fillText(card.price,48,190,420);c.fillStyle='#59685b';c.font='18px Arial';c.fillText(card.note,48,228,430);
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;w.resources.add(texture);return texture;
}
// Original store stationery and fine joinery stay inside existing fixture footprints.
export function buildRetailDetails(w,store,profile,layout,selection){
 const root=new T.Group();root.name='original-retail-details';w.scene.add(root);const metal=shopSurface(w,profile.trim,'metal'),wood=shopSurface(w,profile.fixture,'timber');
 selection.forEach((p,i)=>{const r=layout.displays[i],x=r.x+r.width/2,z=r.y+r.height-3,apparel=['shirt','hoodie','cardigan','jacket','pants','shorts'].includes(p.type),height=apparel?3.5:(w.fixtureHeights?.[i]??32)+.5,group=new T.Group();group.position.set(x,height,z);root.add(group);w.box(0,-3,-1,34,2,9,metal,group);w.box(0,apparel?16:2,-3,1,apparel?34:10,1,metal,group);const card=displayCard(w.state,p,i),plane=w.mesh(new T.PlaneGeometry(32,16),w.mat('#ffffff',{map:cardTexture(w,card),roughness:.85,metalness:0,side:T.DoubleSide}),group);plane.position.set(0,apparel?34:8,0);plane.rotation.x=-.22;w.tag(group,'product:'+p.id,displayPoint(r));group.userData.card=card;});
 for(const r of layout.stockFixtures.filter(r=>r.kind==='wall')){const x=r.x+r.width/2,z=r.y+r.height/2,side=r.side;for(const h of [10,35,60,85])w.box(x-side*8,h,z,1.2,1.4,r.height-10,metal,root);w.box(x-side*7,89,z,2,1.2,r.height-8,w.mat('#eddfbd',{emissive:'#d2b77d',emissiveIntensity:.08,roughness:.8}),root);}
 for(const r of [layout.checkout,layout.returns]){const x=r.x+r.width/2,z=r.y+r.height/2;w.box(x,8,z+28,r.width-6,9,1.5,wood,root);for(let dx=-r.width/2+13;dx<r.width/2;dx+=18)w.box(x+dx,25,z+30,1.1,28,1.1,metal,root);w.box(x+46,51,z+10,21,1,15,'#eee8d9',root);for(let n=0;n<5;n++)w.box(x+46,51.6,z+7+n*1.8,12-n%2*3,.1,.35,'#748174',root);}
 w.canvas.dataset.retailDetailRevision='58';w.canvas.dataset.physicalPriceCards=String(selection.length);return root;
}
