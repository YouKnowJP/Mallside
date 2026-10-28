import {equippedLook} from './engine.js?v=27.0.0';
import {paintPerson} from './sprites.js?v=23.0.0';
import {nightFrame} from './motion.js?v=25.0.0';
export class HomeJourney{
 constructor(root,state,done){this.root=root;this.state=state;this.done=done;this.canvas=root.querySelector('canvas');this.ctx=this.canvas.getContext('2d');this.elapsed=0;this.last=0;this.alive=true;this.frame=t=>this.animate(t);requestAnimationFrame(this.frame);}
 destroy(){this.alive=false;}
 rect(x,y,w,h,color){this.ctx.fillStyle=color;this.ctx.fillRect(x,y,w,h);}
 ellipse(x,y,rx,ry,color){this.ctx.fillStyle=color;this.ctx.beginPath();this.ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);this.ctx.fill();}
 text(t,x,y,size,color){this.ctx.fillStyle=color;this.ctx.font=`600 ${size}px Georgia`;this.ctx.textAlign='center';this.ctx.fillText(t,x,y);}
 animate(now){if(!this.alive)return;const dt=this.last?Math.max(0,Math.min((now-this.last)/1000,.05)):0;this.last=now;if(!document.hidden)this.elapsed+=dt;const reduced=this.state.preferences?.reducedMotion;const f=nightFrame(reduced?this.elapsed*12:this.elapsed);this.root.dataset.stage=f.stage;this.root.querySelector('[data-journey-caption]').textContent=f.label;this.draw(f);if(f.stage==='morning'){this.alive=false;this.done();return;}requestAnimationFrame(this.frame);}
 draw(f){const c=this.ctx;c.setTransform(this.canvas.width/1000,0,0,this.canvas.height/560,0,0);c.clearRect(0,0,1000,560);
  if(f.stage==='street'){
   const sky=c.createLinearGradient(0,0,0,560);sky.addColorStop(0,'#5c6581');sky.addColorStop(.6,'#c99a94');sky.addColorStop(1,'#e5c39d');this.rect(0,0,1000,560,sky);this.ellipse(825,80,28,28,'#f2e2a9');
   for(let i=0;i<5;i++){const x=i*145-25;this.rect(x,155-i%2*22,130,235,'#71817c');this.rect(x+8,182-i%2*22,114,35,'#e5c488');this.text(i===0?'MALLSIDE':i===2?'THE GALLERIA':'',x+65,205-i%2*22,13,'#785f46');for(let j=0;j<4;j++)this.rect(x+15+j*27,251,17,65,'#e3ce93');}
   this.rect(750,170,200,220,'#f0d2ad');c.beginPath();c.moveTo(727,170);c.lineTo(850,85);c.lineTo(973,170);c.closePath();c.fillStyle='#83716c';c.fill();this.rect(825,277,54,113,'#866956');this.rect(771,213,40,48,'#f7e4a9');this.rect(890,213,40,48,'#f7e4a9');this.text('HOME',850,202,18,'#846348');
   this.rect(0,390,1000,170,'#d9cbb4');for(let i=0;i<12;i++)this.rect(i*91,402,2,158,'#c3b79e');for(const x of [190,500,720]){this.rect(x,255,5,157,'#677568');this.ellipse(x+2,257,16,14,'#fff0b7');this.ellipse(x+2,265,45,55,'#fff0b71c');}
   const x=70+f.progress*776;paintPerson(c,x,420,{appearance:this.state.appearance,equipment:equippedLook(this.state),player:true,moving:true,facing:'right',distance:f.progress*776,label:this.state.playerName,reduced:this.state.preferences?.reducedMotion,labelSize:15});
  }else{
   this.rect(0,0,1000,560,'#e9dbbc');this.rect(0,350,1000,210,'#beaa84');for(let i=0;i<8;i++)this.rect(0,365+i*27,1000,2,'#ab9774');this.rect(65,110,150,243,'#b3916f');this.rect(80,126,120,225,'#627f75');this.rect(169,245,7,10,'#e8c884');this.rect(280,90,155,150,'#9ba99c');this.rect(288,98,139,134,f.stage==='sleep'?'#374e6e':'#a1c3bc');this.rect(353,98,5,134,'#e7d7af');this.rect(288,163,139,5,'#e7d7af');this.ellipse(325,128,17,17,'#f4e3ae');
   this.rect(720,270,195,145,'#98774e');this.rect(707,252,221,130,'#eee6cc');this.rect(716,265,53,105,'#f8f0dc');this.rect(771,267,147,105,this.state.appearance?.shirt||'#b98464');this.rect(678,313,25,77,'#947652');this.ellipse(690,287,27,22,'#eed8a3');this.rect(684,287,12,34,'#b5965f');this.rect(450,331,93,62,'#b69b6e');this.rect(462,313,21,33,this.state.appearance?.bag||'#bd743f');
   if(f.stage==='home'){const x=145+f.progress*611;paintPerson(c,x,414,{appearance:this.state.appearance,equipment:equippedLook(this.state),player:true,moving:true,facing:'right',distance:f.progress*611,label:this.state.playerName,labelSize:15});this.text('Your own quiet corner.',530,72,27,'#7b745b');}
   else{this.ellipse(746,292,15,13,this.state.appearance?.skin||'#d4a27d');this.rect(731,279,29,8,this.state.appearance?.hair||'#594234');this.rect(0,0,1000,560,`rgba(28,38,63,${.25+f.progress*.5})`);this.text('Z  z  z',784,215-Math.sin(f.progress*6)*6,36,'#e9e2c9');this.text('Rest. Tomorrow has new little possibilities.',500,499,24,'#f3e8c7');}
  }
 }
}
