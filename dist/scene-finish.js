import * as T from './vendor/three.module.js';

// Original, locally generated lighting and surface art. No downloaded HDRI or textures.
export function environmentPixels(indoor=false,width=512,height=256){
 const data=new Float32Array(width*height*4),sky=new T.Color(indoor?'#d2dce0':'#abc9dd'),ground=new T.Color(indoor?'#8d8172':'#8a927a');
 const panels=indoor?[[-.65,.72,.25,4.5],[.62,.7,-.3,3.2],[0,.98,0,2.5]]:[[-.4,.78,.47,6.5]];
 for(let y=0;y<height;y++){const theta=(y+.5)/height*Math.PI,up=-Math.cos(theta),r=Math.sin(theta);for(let x=0;x<width;x++){
  const phi=(x+.5)/width*Math.PI*2,dx=-Math.cos(phi)*r,dz=-Math.sin(phi)*r,t=Math.max(0,Math.min(1,up*.7+.45)),c=ground.clone().lerp(sky,t),base=indoor?.48:.72;
  let glow=0;for(const [a,b,c,power]of panels){const dot=(dx*a+up*b+dz*c)/Math.hypot(a,b,c);glow+=Math.pow(Math.max(0,dot),indoor?38:180)*power;}
  const i=(y*width+x)*4;data[i]=c.r*base+glow;data[i+1]=c.g*base+glow*.94;data[i+2]=c.b*base+glow*.82;data[i+3]=1;
 }}return {data,width,height};
}
export function installReflection(w,indoor=false){
 const pixels=environmentPixels(indoor),source=new T.DataTexture(pixels.data,pixels.width,pixels.height,T.RGBAFormat,T.FloatType);source.mapping=T.EquirectangularReflectionMapping;source.minFilter=source.magFilter=T.LinearFilter;source.needsUpdate=true;
 const generator=new T.PMREMGenerator(w.renderer);try{const target=generator.fromEquirectangular(source);w.resources.add(target);w.scene.environment=target.texture;w.scene.environmentIntensity=indoor?.8:.72;}finally{generator.dispose();source.dispose();}
 w.finishTextures=new Map();
}
export function installLighting(w,indoor=false){
 installReflection(w,indoor);w.contactActors=[];w.sceneLabels=[];
 w.sun.shadow.mapSize.set(w.canvas.clientWidth<700?1024:2048,w.canvas.clientWidth<700?1024:2048);w.sun.shadow.bias=-.00025;w.sun.shadow.normalBias=.07;w.sun.shadow.radius=3;
 w.canvas.dataset.visualRevision='33';w.canvas.dataset.lightingModel='prefiltered-environment';
}
export function beveledBox(width=1,height=1,depth=1,radius=Math.min(width,height,depth)*.035){
 const g=new T.BoxGeometry(width,height,depth,3,3,3),p=g.attributes.position,n=g.attributes.normal,halves=[width/2,height/2,depth/2],r=Math.min(radius,...halves),v=new T.Vector3(),inner=new T.Vector3(),normal=new T.Vector3();
 for(let i=0;i<p.count;i++){const original=[p.getX(i),p.getY(i),p.getZ(i)],q=original.map((value,k)=>Math.sign(value)*(Math.abs(value)>halves[k]*.9?halves[k]:halves[k]-r));v.set(...q);inner.set(...q.map((value,k)=>Math.max(-halves[k]+r,Math.min(halves[k]-r,value))));normal.copy(v).sub(inner).normalize();v.copy(inner).addScaledVector(normal,r);p.setXYZ(i,v.x,v.y,v.z);n.setXYZ(i,normal.x,normal.y,normal.z);}
 g.computeBoundingBox();g.computeBoundingSphere();return g;
}
export function surfaceTexture(w,kind='stone',dataOnly=false){
 w.finishTextures??=new Map();const key=kind+(dataOnly?'-data':'-color');if(w.finishTextures?.has(key))return w.finishTextures.get(key);
 const size=128,data=new Uint8Array(size*size*4);let seed=3301;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=(seed>>>24)/255,grain=kind==='fabric'?((x%4<2?.25:.6)+(y%4<2?.15:.4)):kind==='timber'?Math.sin(x*.32+Math.sin(y*.05)*2)*.5+.5:Math.sin(x*.035+y*.06+Math.sin(y*.07)*1.4)*.5+.5,value=Math.round(dataOnly?180+noise*42+grain*22:224+noise*15+grain*16);data.set([value,value,value,255],(y*size+x)*4);}
 const t=new T.DataTexture(data,size,size,T.RGBAFormat);t.colorSpace=dataOnly?T.NoColorSpace:T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(kind==='timber'?3:kind==='fabric'?1:8,kind==='timber'?3:kind==='fabric'?1:8);t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;t.needsUpdate=true;w.resources.add(t);w.finishTextures?.set(key,t);return t;
}
export function cameraComposition(mode='promenade',inside=false,zoom=1){
 const z=Math.max(.5,Math.min(3,Number.isFinite(zoom)?zoom:1));
 return mode==='raised'?{distance:380/z,altitude:350/z,lookHeight:12,lead:inside?0:65}:{distance:(inside?305:330)/z,altitude:(inside?235:205)/z,lookHeight:24,lead:inside?0:34};
}
export function sampleRoute(avatar,path,{spacing=24,max=80,range=650}={}){
 if(!path?.length)return [];const points=[avatar,...path],result=[];let distance=0,next=spacing;
 for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],length=Math.hypot(b.x-a.x,b.y-a.y);if(length<.001)continue;while(next<=distance+length&&result.length<max&&next<=range){const t=(next-distance)/length;result.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});next+=spacing;}distance+=length;if(result.length>=max||distance>range)break;}return result;
}
export function palmFrondGeometry(){
 const positions=[],uv=[];const tri=(a,b,c)=>{for(const p of [a,b,c]){positions.push(...p);uv.push(p[0],p[2]+.5);}};
 for(let i=0;i<11;i++){const t=.07+i*.078,width=Math.sin(Math.PI*t)*.72,drop=-.22*t*t;for(const sign of [-1,1]){const a=[t,drop,0],b=[Math.min(1,t+.17),drop-.04,sign*width],c=[t+.045,drop-.012,0];tri(a,b,c);}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();g.computeBoundingSphere();return g;
}
function shadowTexture(){const size=64,data=new Uint8Array(size*size*4);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const r=Math.hypot((x+.5-size/2)/(size/2),(y+.5-size/2)/(size/2)),a=Math.max(0,1-r);data.set([255,255,255,Math.round(a*a*255)],(y*size+x)*4);}const t=new T.DataTexture(data,size,size,T.RGBAFormat);t.needsUpdate=true;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.generateMipmaps=true;return t;}
export function buildSceneAccents(w){
 const texture=shadowTexture(),material=new T.MeshBasicMaterial({map:texture,color:'#26392e',transparent:true,opacity:.3,depthWrite:false}),geometry=new T.PlaneGeometry(25,21);w.resources.add(texture);w.resources.add(material);w.resources.add(geometry);
 w.contactShadows=new T.InstancedMesh(geometry,material,96);w.contactShadows.count=0;w.contactShadows.frustumCulled=false;w.scene.add(w.contactShadows);
 const routeMat=new T.MeshBasicMaterial({color:'#367b75',transparent:true,opacity:.84,depthWrite:false}),routeGeo=new T.CircleGeometry(1.7,10);w.resources.add(routeMat);w.resources.add(routeGeo);w.routeDots=new T.InstancedMesh(routeGeo,routeMat,80);w.routeDots.count=0;w.routeDots.frustumCulled=false;w.scene.add(w.routeDots);
 const ringGeo=new T.RingGeometry(8,9,48),ringMat=new T.MeshBasicMaterial({color:'#c08842',transparent:true,opacity:.9,depthWrite:false,side:T.DoubleSide});w.resources.add(ringGeo);w.resources.add(ringMat);w.destinationRing=new T.Mesh(ringGeo,ringMat);w.destinationRing.rotation.x=-Math.PI/2;w.destinationRing.visible=false;w.scene.add(w.destinationRing);
 w.playerMarker=new T.Mesh(ringGeo,ringMat);w.playerMarker.rotation.x=-Math.PI/2;w.scene.add(w.playerMarker);w.accentDummy=new T.Object3D();
}
export function updateSceneAccents(w){
 const d=w.accentDummy;if(!d)return;w.contactActors=w.contactActors.filter(g=>g.parent);let count=0;for(const g of w.contactActors){if(!g.parent||!g.visible||count>=96)continue;d.position.set(g.position.x,.12,g.position.z);d.rotation.set(-Math.PI/2,0,-g.rotation.y);d.scale.set(1,1,1);d.updateMatrix();w.contactShadows.setMatrixAt(count++,d.matrix);}w.contactShadows.count=count;w.contactShadows.instanceMatrix.needsUpdate=true;
 const dots=w.action||w.overview?[]:sampleRoute(w.avatar,w.path);dots.forEach((p,i)=>{d.position.set(p.x,.6,p.y);d.rotation.set(-Math.PI/2,0,0);d.scale.set(1,1,1);d.updateMatrix();w.routeDots.setMatrixAt(i,d.matrix);});w.routeDots.count=dots.length;w.routeDots.instanceMatrix.needsUpdate=true;
 const end=w.path?.at(-1);w.destinationRing.visible=!!end&&!w.action&&!w.overview;if(end)w.destinationRing.position.set(end.x,.65,end.y);w.playerMarker.visible=!w.action;w.playerMarker.position.set(w.player.position.x,.5,w.player.position.z);w.playerMarker.scale.setScalar(w.overview?2.4:1);
 if(w.playerLabel)w.playerLabel.visible=false;
 const nearest=w.sceneLabels.filter(l=>l.object.parent&&Math.hypot(l.point.x-w.avatar.x,l.point.y-w.avatar.y)<(l.product?220:340)).sort((a,b)=>Math.hypot(a.point.x-w.avatar.x,a.point.y-w.avatar.y)-Math.hypot(b.point.x-w.avatar.x,b.point.y-w.avatar.y));const products=[...new Set(nearest.filter(l=>l.product).map(l=>l.id))].slice(0,2);
 for(const l of w.sceneLabels)l.object.visible=!w.overview&&!w.action&&l.id!==w.lastNearby&&nearest.includes(l)&&(!l.product||products.includes(l.id));
 for(const a of w.localActors||[])a.label.visible=!w.overview&&!w.action&&Math.hypot(a.g.position.x-w.avatar.x,a.g.position.z-w.avatar.y)<120;
 w.canvas.dataset.routeDots=String(dots.length);w.canvas.dataset.contactShadows=String(count);w.canvas.dataset.cameraMode=w.state.preferences.cameraMode||'promenade';
}
