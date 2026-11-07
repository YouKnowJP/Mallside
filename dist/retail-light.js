import * as T from './vendor/three.module.js';

// A soft baked accent keeps the lighting cost independent of the number of shops.
export function retailLight(w, parent, x, y, z, width, height, horizontal = false) {
 const cache = w.finishTextures ??= new Map();
 let material = cache.get('retail-accent-light');
 if (!material) {
  const size = 64, pixels = new Uint8Array(size * size * 4);
  for (let row=0; row<size; row++) for (let col=0; col<size; col++) {
   const radius = Math.hypot((col+.5)/size*2-1, (row+.5)/size*2-1);
   const alpha = Math.round(155 * Math.max(0, 1-radius*radius)**3);
   pixels.set([255,244,212,alpha], (row*size+col)*4);
  }
  const texture = new T.DataTexture(pixels,size,size,T.RGBAFormat);
  texture.colorSpace = T.SRGBColorSpace;
  texture.magFilter = T.LinearFilter;
  texture.minFilter = T.LinearFilter;
  texture.needsUpdate = true;
  material = new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false});
  cache.set('retail-accent-light',material);
  w.resources.add(texture);
  w.resources.add(material);
 }
 let plane = cache.get('retail-accent-plane');
 if (!plane) {
  plane = new T.PlaneGeometry(1,1);
  cache.set('retail-accent-plane',plane);
 }
 const light = w.mesh(plane,material,parent);
 light.position.set(x,y,z);
 light.scale.set(width,height,1);
 if (horizontal) light.rotation.x = -Math.PI/2;
 light.castShadow = light.receiveShadow = false;
 return light;
}
