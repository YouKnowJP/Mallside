import * as T from './vendor/three.module.js';

function bitmap(kind,color,pattern){
 const size=128,data=new Uint8Array(size*size*4),hex=new T.Color(color).getHex(),rgb=[hex>>16&255,hex>>8&255,hex&255];
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  let grain=((Math.imul(x+17,374761393)^Math.imul(y+31,668265263))>>>0)%101/100-.5;
  let bump=kind==='silk'?Math.sin(x*.18+y*.08)*.035+grain*.015:kind==='velvet'||kind==='suede'?grain*.10:kind==='saffiano'?Math.sin((x+y)*1.4)*.09+Math.sin((x-y)*1.4)*.09:kind==='tweed'?Math.sin(x*1.2)*Math.cos(y*.7)*.18+grain*.14:kind==='denim'?Math.sin((x+y)*Math.PI/3)*.15+grain*.13:kind==='knit'?Math.sin(x*Math.PI/3)*Math.cos(y*Math.PI/6)*.19:kind==='nylon'||kind==='canvas'||kind==='raffia'?((x%3===0?1:-.3)+(y%3===0?1:-.3))*.06:kind==='pebble'||kind==='leather'||kind==='glazed'?Math.sin(x*.9+Math.sin(y*1.3))*Math.cos(y*.8)*.05+grain*.055:grain*.045;
  if(pattern==='diamond'){const a=(x+y)%32,b=(x-y+256)%32;if(a<2||b<2)bump-=.22;else bump+=Math.sin(a*Math.PI/32)*Math.sin(b*Math.PI/32)*.10;}
  if(pattern==='chevron'&&((y+Math.abs(x%64-32))%22<2))bump-=.23;
  if(pattern==='woven')bump+=((Math.floor(x/16)+Math.floor(y/16))%2?Math.sin(x*.4):Math.sin(y*.4))*.18;
  const i=(y*size+x)*4;for(let c=0;c<3;c++)data[i+c]=Math.max(0,Math.min(255,rgb[c]*(1+bump*.5)));data[i+3]=255;
 }
 // Small monogram motifs tile over actual curved body surfaces, never as a product photograph.
 if(pattern==='lv'||pattern==='oblique'){
  const ink=rgb.map(v=>Math.round(v*(rgb[0]>160?.66:1.55))),dot=(x,y)=>{if(x<0||x>=size||y<0||y>=size)return;const i=(y*size+x)*4;ink.forEach((v,c)=>data[i+c]=Math.min(255,v));};
  for(let yy=6;yy<size;yy+=32)for(let xx=5+(Math.floor(yy/32)%2)*16;xx<size;xx+=32){
   if(pattern==='lv'){for(let y=0;y<11;y++)dot(xx,y+yy);for(let x=0;x<7;x++)dot(xx+x,yy+10);for(let y=0;y<11;y++){dot(xx+8+Math.floor(y*.4),yy+y);dot(xx+16-Math.floor(y*.4),yy+y);}for(let a=0;a<Math.PI*2;a+=.17){dot(Math.round(xx+11+Math.cos(a)*4),Math.round(yy+22+Math.sin(a)*4));}}
   else for(let t=0;t<17;t++){dot(xx+t,yy+t);dot(xx+8+t,yy+t);}
  }
 }
 const tx=new T.DataTexture(data,size,size);tx.colorSpace=T.SRGBColorSpace;tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.repeat.set(2,2);tx.needsUpdate=true;return tx;
}
function sampledSurface(s){const alphabet='0123456789abcdefghijklmnopqrstuv',data=new Uint8Array(s.size[0]*s.size[1]*4),colors=s.colors.map(c=>parseInt(c.slice(1),16));for(let i=0;i<s.grid.length;i++){const c=colors[alphabet.indexOf(s.grid[i])];const j=((s.size[1]-1-Math.floor(i/s.size[0]))*s.size[0]+i%s.size[0])*4;data[j]=c>>16&255;data[j+1]=c>>8&255;data[j+2]=c&255;data[j+3]=255;}const tx=new T.DataTexture(data,...s.size);tx.colorSpace=T.SRGBColorSpace;tx.wrapS=tx.wrapT=T.ClampToEdgeWrapping;tx.magFilter=T.LinearFilter;tx.needsUpdate=true;return tx;}
export function photoRegionForAspect(a,surfaceAspect=1,imageAspect=1){
 const region=a.surface.region.slice(),allover=['stripe','plaid','floral','gingham','camo','gg','lv','coach-jacquard','oblique','cannage'].includes(a.pattern)||a.garment?.motif==='dots';if(!allover)return region;
 const [x0,y0,x1,y1]=region,w=x1-x0,h=y1-y0,wantedH=w*imageAspect/surfaceAspect;
 if(wantedH<h){const cy=(y0+y1)/2;return [x0,cy-wantedH/2,x1,cy+wantedH/2];}
 const wantedW=h*surfaceAspect/imageAspect,cx=(x0+x1)/2;return [cx-wantedW/2,y0,cx+wantedW/2,y1];
}
export function referenceMaterial(appearance,{trim=false,metal=false,plain=false,highDetail=false,surfaceAspect=.9}={}){
 const color=trim?appearance.trim:appearance.color,finish=appearance.finish;
 if(metal)return new T.MeshStandardMaterial({color:appearance.hardware,metalness:.86,roughness:.22});
 const photographed=!trim&&!plain&&appearance.surface&&!['back','detail'].includes(appearance.garment?.photoView),texture=photographed?sampledSurface(appearance.surface):bitmap(trim?'leather':finish,color,trim?'':appearance.pattern);
 if(!photographed&&!trim&&appearance.pattern){if(appearance.pattern==='woven')texture.repeat.setScalar(appearance.patternScale||1);else texture.repeat.set((appearance.width||30)/24,(appearance.height||22)/24);}
 const bump=bitmap(trim?'leather':finish,'#808080',trim?'':appearance.pattern);bump.colorSpace=T.NoColorSpace;bump.needsUpdate=true;
 const material=new T.MeshPhysicalMaterial({color:'#ffffff',map:texture,bumpMap:bump,bumpScale:['nylon','cotton','silk'].includes(finish)?.018:.045,roughness:finish==='glazed'?.26:finish==='silk'?.42:finish==='leather'?.48:finish==='pebble'?.58:finish==='metal'?.27:.9,metalness:finish==='metal'?.65:0,clearcoat:finish==='glazed'?.55:0,clearcoatRoughness:.25});
 // Sample the original reference at full resolution on curved surfaces when its
 // body region is isolated or manually reviewed. The compact map remains the fallback.
 if(highDetail&&photographed&&typeof document!=='undefined'&&appearance.photo&&(appearance.surface.backgroundFraction||0)<.025&&(appearance.surface.regionReviewed||appearance.surface.shapeEvidence==='foreground-estimate')){
  let active=true;material.addEventListener('dispose',()=>active=false);const detail=new T.TextureLoader().load(appearance.photo,tx=>{if(!active){tx.dispose();return;}const [x0,y0,x1,y1]=photoRegionForAspect(appearance,surfaceAspect,tx.image.width/tx.image.height);tx.offset.set(x0,1-y1);tx.repeat.set(x1-x0,y1-y0);material.map=tx;material.needsUpdate=true;},undefined,()=>{});detail.colorSpace=T.SRGBColorSpace;detail.wrapS=detail.wrapT=T.ClampToEdgeWrapping;detail.anisotropy=4;material.userData.detailTexture=detail;
 }
 return material;
}
