import {gaitPose} from './motion.js?v=25.0.0';
export function paintPerson(c,x,y,{color='#b8ac86',appearance={},equipment={},player=false,moving=false,facing='down',distance=0,reduced=false,label='',labelSize=14,pose='stand',time=0}={}){
 const {step,bob,arm}=gaitPose(distance,moving,reduced),skin=appearance.skin||'#d4a27d',hair=appearance.hair||'#594234',seated=['sit','rest','eat','drink','icecream'].includes(pose),b=seated?0:bob;
 const rect=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
 const round=(x,y,w,h,r,color)=>{c.fillStyle=color;c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h);c.fill();};
 const line=(x,y,x2,y2,col,w=2)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke();};
 const top=equipment.top?.color||appearance.shirt||color,bottom=equipment.bottom?.color||'#435c79',shoe=equipment.shoes?.color||'#35443e';
 c.save();c.translate(x,y);c.fillStyle='#254d4938';c.beginPath();c.ellipse(0,4,15,5,0,0,Math.PI*2);c.fill();
 if(player){c.strokeStyle='#e8b65b';c.lineWidth=2;c.beginPath();c.ellipse(0,4,21,9,0,0,Math.PI*2);c.stroke();}
 if(seated){round(-9,-14,21,8,3,bottom);round(6,-10,7,15,2,bottom);round(6,1,12,5,2,shoe);round(-6,-5,6,10,2,bottom);round(-7,1,10,5,2,shoe);}
 else{rect(-8,-15,6,16+step*.45,bottom);rect(2,-15,6,16-step*.45,bottom);round(-9,step*.45,9,5,2,shoe);round(1,-step*.45,9,5,2,shoe);}
 round(-11,-37-b,22,25,4,player?top:color);if(pose==='celebrate')line(-13,-31-b,-24,-51-b,skin,6);else rect(-16,-33-b+arm*.5,6,20,skin);if(['wave','celebrate'].includes(pose))line(13,-31-b,24,-51-b,skin,6);else rect(10,-33-b-arm*.5,6,20,skin);
 if(equipment.belt){rect(-11,-17-b,22,4,equipment.belt.color);rect(-2,-18-b,6,6,'#d9b962');rect(0,-16-b,2,2,'#715a3c');}
 if(equipment.scarf){round(-9,-36-b,19,6,2,equipment.scarf.color);rect(4,-32-b,6,15,equipment.scarf.color);}
 if(equipment.jewelry&&equipment.jewelry.type!=='sunglasses'){line(-7,-34-b,0,-26-b,'#e3bd68',1.8);line(0,-26-b,7,-34-b,'#e3bd68',1.8);round(-2,-28-b,4,5,1,equipment.jewelry.color||'#edd389');}
 if(equipment.watch)round(pose==='celebrate'?-26:-16,pose==='celebrate'?-50-b:-18-b+arm*.5,6,5,1,equipment.watch.color||'#d6bf7b');
 round(-9,-53-b,18,19,5,skin);round(-10,-56-b,20,9,4,hair);
 if(facing==='up')round(-10,-51-b,20,13,3,hair);
 else if(facing==='left'){rect(-11,-47-b,4,8,skin);rect(-7,-45-b,2,3,'#384139');rect(6,-51-b,4,13,hair);}
 else if(facing==='right'){rect(7,-47-b,4,8,skin);rect(5,-45-b,2,3,'#384139');rect(-10,-51-b,4,13,hair);}
 else{rect(-5,-45-b,2,pose==='rest'?1:3,'#384139');rect(4,-45-b,2,pose==='rest'?1:3,'#384139');rect(-10,-51-b,3,13,hair);}
 if(equipment.jewelry?.type==='sunglasses'&&facing!=='up'){round(-8,-47-b,7,5,1,'#344744');round(1,-47-b,7,5,1,'#344744');line(-1,-45-b,1,-45-b,'#8d7859',1);}
 if(equipment.hat){const col=equipment.hat.color||'#5f6e65';round(-12,-61-b,24,11,3,col);round(-16,-52-b,32,5,2,col);rect(-11,-53-b,22,2,'#ffffff44');}
 const bag=equipment.bag;if(bag){const col=bag.color||appearance.bag||'#bd743f';if(bag.type==='backpack'){if(facing==='up'){round(-14,-34-b,28,27,5,col);round(-10,-20-b,20,12,3,'#ffffff22');line(-8,-18-b,8,-18-b,'#e7d8b7',1);round(-5,-31-b,10,5,1,'#f2e3c4');}else{line(-8,-35-b,-6,-17-b,col,3);line(8,-35-b,6,-17-b,col,3);round(facing==='left'?-21:14,-29-b,8,24,3,col);}}
 else{if(bag.type==='crossbody'||/shoulder|crossbody/i.test(bag.name))line(-10,-36-b,17,-14-b,col,2.5);round(12,-18-b-arm*.4,17,16,bag.type==='duffel'?6:3,col);line(16,-17-b,17,-24-b,col,2);line(17,-24-b,24,-24-b,col,2);line(24,-24-b,25,-17-b,col,2);rect(19,-10-b,4,3,'#e9cc85');}}
 const lift=reduced?0:Math.sin(time*3)*3;
 if(['eat','drink','icecream'].includes(pose)){line(12,-18,22,-30+lift,skin,6);if(pose==='icecream'){c.fillStyle='#c08a52';c.beginPath();c.moveTo(17,-37+lift);c.lineTo(26,-37+lift);c.lineTo(22,-22+lift);c.fill();round(16,-44+lift,12,10,5,'#fff0ce');}else if(pose==='drink'){round(17,-39+lift,11,15,2,'#faf2dd');rect(17,-37+lift,11,4,'#5b8f77');}else{round(14,-28+lift,15,5,3,'#e6b975');}}
 if(pose==='rest'){c.fillStyle='#688978';c.font='10px Georgia';c.fillText('z',17,-55-lift);c.fillText('Z',25,-65-lift);}
 if(player&&label){c.font=`600 ${labelSize}px Arial`;c.textAlign='center';c.fillStyle='#704d2e';c.fillText(label,0,equipment.hat?-82:-72);}
 c.restore();
}
