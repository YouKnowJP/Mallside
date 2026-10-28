import * as T from './vendor/three.module.js';
import {addGarmentBrand} from './merchandise-details.js?v=23.0.0';

export function garmentDimensions(a){
 const g=a.garment,full=['dress','jumpsuit'].includes(g.kind),bottom=g.coverage==='bottom';
 const height=g.underwear||g.kind==='swim'&&g.coverage==='bottom'?24:full?({thigh:83,midi:112,maxi:140}[g.length]||112):bottom?g.kind==='skirt'?({thigh:43,midi:70,maxi:95}[g.length]||70):g.kind==='shorts'?34:100:g.kind==='bra'?27:g.length==='cropped'?43:g.length==='thigh'?90:g.length==='maxi'?115:65;
 let width=g.fit==='slim'?42:g.fit==='relaxed'||g.fit==='wide'?57:50;
 if(a.surface?.shapeEvidence==='foreground-estimate'&&!['detail','back'].includes(g.photoView)){const expected=width*(g.sleeve==='long'?1.74:g.sleeve==='none'?1:1.56)/height;const photoFactor=Math.max(.88,Math.min(1.12,a.surface.aspect/expected));width*=photoFactor;}
 return {height,width,bottom};
}
export function buildGarmentModel(b,p,a,{hanger=false}={}){
 const {mesh,box,panel,tube,ring,g,main,trim,seam,metal}=b,cut=a.garment,{height:H,width:W}=garmentDimensions(a),bottom=cut.coverage==='bottom';
 const garmentTop=(centerY,height,width)=>{
  const strapless=cut.neckline==='strapless',none=cut.sleeve==='none',bra=cut.kind==='bra',neck=cut.neckline==='v'?height*.22:height*.07,scoop=cut.neckline==='scoop',body=new T.Shape(),top=centerY+height/2,base=centerY-height/2,shoulder=top-height*.04,neckY=strapless?top-height*.2:top-neck;
  body.moveTo(-width*.17,top);body.lineTo(-width*.5,shoulder);
  if(!none){const len=cut.sleeve==='long'?height*.82:height*.30,reach=cut.sleeve==='long'?width*.37:width*.28;body.lineTo(-width*.5-reach,shoulder-len);body.lineTo(-width*.5-reach+width*.16,shoulder-len-5);body.lineTo(-width*.43,shoulder-height*.30);}
  else body.lineTo(-width*.43,top-height*.23);
  body.lineTo(-width*(cut.fit==='slim'?.41:.48),base);body.lineTo(width*(cut.fit==='slim'?.41:.48),base);body.lineTo(width*.43,top-height*.23);
  if(!none){const len=cut.sleeve==='long'?height*.82:height*.30,reach=cut.sleeve==='long'?width*.37:width*.28;body.lineTo(width*.5+reach-width*.16,shoulder-len-5);body.lineTo(width*.5+reach,shoulder-len);}
  body.lineTo(width*.5,shoulder);body.lineTo(width*.17,top);
  if(strapless)body.lineTo(width*.1,neckY),body.lineTo(-width*.1,neckY);
  else if(cut.neckline==='v')body.lineTo(0,neckY),body.lineTo(-width*.17,top);
  else body.quadraticCurveTo(width*.11,top-neck*(scoop?2.8:1.2),0,top-neck*(scoop?2.4:1)),body.quadraticCurveTo(-width*.11,top-neck*(scoop?2.8:1.2),-width*.17,top);
  body.closePath();const solid=mesh(new T.ExtrudeGeometry(body,{depth:3.4,bevelEnabled:true,bevelSize:.45,bevelThickness:.45,bevelSegments:2,curveSegments:12}));solid.position.z=-1.7;const position=solid.geometry.attributes.position,uv=solid.geometry.attributes.uv;for(let i=0;i<position.count;i++){if(solid.geometry.attributes.normal.getZ(i)>.3)uv.setXY(i,(position.getX(i)+width/2)/width,(position.getY(i)-base)/height);}uv.needsUpdate=true;
  tube([[-width*.17,top,2.1],[0,top-neck*(scoop?2.4:1),2.3],[width*.17,top,2.1]],.45,trim);
  tube([[-width*.45,base+1,2.1],[0,base+.6,2.2],[width*.45,base+1,2.1]],.35,seam);
  if(a.sleeveStripes)for(const sign of [-1,1])for(const dx of [-1.4,0,1.4]){const len=cut.sleeve==='long'?height*.79:height*.27,reach=cut.sleeve==='long'?width*.35:width*.26;tube([[sign*(width*.48+dx),shoulder,2.2],[sign*(width*.48+reach+dx),shoulder-len,2.2]],.35,trim);}
  if(cut.neckline==='collared')for(const sign of [-1,1]){const c=new T.Shape();c.moveTo(sign*width*.16,top+1);c.lineTo(sign*width*.28,top-9);c.lineTo(sign*width*.06,top-13);c.lineTo(0,top-4);c.closePath();const m=mesh(new T.ExtrudeGeometry(c,{depth:.65,bevelEnabled:false}),trim);m.position.z=2;}
  if(cut.closure==='buttons'||cut.closure==='zip'){box(0,centerY,2.4,cut.closure==='zip'?.55:1,height-3,.5,trim);if(cut.closure==='buttons')for(let y=base+7;y<top-5;y+=9){const button=mesh(new T.CylinderGeometry(.7,.7,.4,10),metal);button.rotation.x=Math.PI/2;button.position.set(0,y,2.9);}}
  for(let i=0;i<Math.min(cut.pockets,2);i++)panel((i?1:-1)*width*.27,centerY-7,2.7,width*.22,9,.5,1,trim);
  if(cut.kind==='hoodie'||cut.hooded){const hood=ring(0,top+1,-3,9,2.5,trim);hood.scale.y=1.1;for(const x of [-2,2])tube([[x,top-4,3],[x,top-17,3.2]],.25,seam);panel(0,base+10,2.8,width*.6,11,.5,2,trim);}
  if(cut.quilted)for(let y=base+6;y<top-7;y+=height*.15)tube([[-width*.45,y,2.3],[0,y-1,3.2],[width*.45,y,2.3]],.55,trim);
  if(cut.ribbing)for(let x=-width*.4;x<width*.4;x+=3)box(x,base+2,2.3,.35,3,.3,seam);
  if(bra||cut.straps)for(const x of [-width*.28,width*.28])box(x,top+2,0,cut.straps==='wide'?4:1.5,9,3.2,trim);
 };
 const lower=(topY,length,waistWidth)=>{
  if(cut.underwear||cut.kind==='swim'&&cut.coverage==='bottom'){const brief=new T.Shape();brief.moveTo(-waistWidth/2,topY);brief.lineTo(waistWidth/2,topY);brief.quadraticCurveTo(waistWidth*.15,topY-10,waistWidth*.12,topY-22);brief.lineTo(-waistWidth*.12,topY-22);brief.quadraticCurveTo(-waistWidth*.15,topY-10,-waistWidth/2,topY);const m=mesh(new T.ExtrudeGeometry(brief,{depth:3,bevelEnabled:true,bevelSize:.3,bevelThickness:.3,bevelSegments:2}));m.position.z=-1.5;box(0,topY-2,2,waistWidth,3,.5,trim);}
  else if(cut.kind==='skirt'||cut.kind==='dress'){
   const hem=cut.fit==='slim'?waistWidth*.57:waistWidth*(cut.fit==='flare'?.94:.76),shape=new T.Shape();shape.moveTo(-waistWidth*.42,topY);shape.lineTo(waistWidth*.42,topY);shape.quadraticCurveTo(waistWidth*.49,topY-length*.4,hem,topY-length);for(let i=0;i<=12;i++){const x=hem-i*hem/6,y=topY-length+((cut.hem==='high-low')?Math.max(0,1-Math.abs(x)/hem)*8:cut.hem==='asymmetric'?(x/hem+1)*5:Math.sin(i*Math.PI)*1.4);shape.lineTo(x,y);}shape.quadraticCurveTo(-waistWidth*.49,topY-length*.4,-waistWidth*.42,topY);shape.closePath();const m=mesh(new T.ExtrudeGeometry(shape,{depth:7,bevelEnabled:true,bevelSize:1,bevelThickness:1,bevelSegments:3,curveSegments:14}));m.position.z=-3.5;
   for(let i=-3;i<=3;i++)tube([[i*waistWidth*.095,topY-3,4],[i*hem*.23,topY-length*.55,4.4],[i*hem*.27,topY-length+2,4]],cut.pleats?.5:.18,seam);
  }else{
   const slim=cut.fit==='slim'||cut.leg==='legging',wide=cut.fit==='wide'||cut.leg==='wide',legWidth=waistWidth*(slim?.22:wide?.40:.29),legH=length-11;panel(0,topY-4,0,waistWidth,10,4,1.5);for(const sign of [-1,1]){const shape=new T.Shape(),cx=sign*waistWidth*.25,top=topY-7,bottom=topY-length,hem=cut.leg==='flare'?legWidth*1.35:cut.leg==='jogger'?legWidth*.70:legWidth;shape.moveTo(cx-legWidth/2,top);shape.lineTo(cx+legWidth/2,top);shape.lineTo(cx+hem/2,bottom);shape.lineTo(cx-hem/2,bottom);shape.closePath();const leg=mesh(new T.ExtrudeGeometry(shape,{depth:4,bevelEnabled:true,bevelSize:.6,bevelThickness:.6,bevelSegments:2}));leg.position.z=-2;tube([[cx+sign*legWidth*.45,top-3,2.7],[cx+sign*hem*.45,bottom+2,2.7]],.25,seam);if(cut.pockets)panel(cx,topY-8,2.9,legWidth*.7,7,.4,1,trim);if(cut.pockets>=4)panel(cx,topY-length*.5,3.1,legWidth*.7,11,.7,1,trim);}
   box(0,topY-1,2.7,waistWidth,1.8,.5,trim);for(const x of [-waistWidth*.35,waistWidth*.35])box(x,topY-2,3,1,4,.6,seam);
  }
 };
 if(cut.special==='bag-strap'){for(let i=0;i<12;i++)panel(0,i*6,0,9,5,3,1.8,i%2?main:trim);ring(0,78,0,2.8,.7,metal);ring(0,-5,0,2.8,.7,metal);}
 else if(cut.kind==='jumpsuit'){lower(H*.57,H*.57,W*.85);garmentTop(H*.785,H*.43,W);}
 else if(cut.kind==='dress'){lower(H*.62,H*.62,W);garmentTop(H*.81,H*.38,W);}
 else if(bottom)lower(H,H,W*.85);
 else garmentTop(H/2,H,W);
 addGarmentBrand(g,a,p);
 if(hanger){const y=H+5;tube([[-20,y,0],[0,y+10,0],[20,y,0],[-20,y,0]],.65,metal);tube([[0,y+10,0],[0,y+15,0],[3,y+18,0],[5,y+15,0]],.6,metal);}
 g.userData.cut=cut.kind;
}
