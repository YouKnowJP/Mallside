import {surfaceTexture} from './scene-finish.js?v=57.0.0';
// Shared procedural materials for original game casework, not merchant product finishes.
export function shopSurface(w,color,kind='paint'){
 w.shopSurfaces??=new Map();const key=kind+':'+color;if(w.shopSurfaces.has(key))return w.shopSurfaces.get(key);
 const m=w.mat(color,kind==='timber'?{roughness:.68,envMapIntensity:.48,bumpMap:surfaceTexture(w,'timber',true),bumpScale:.11,roughnessMap:surfaceTexture(w,'timber',true)}:kind==='metal'?{roughness:.34,metalness:.48,envMapIntensity:1.05}:{roughness:.82,envMapIntensity:.4,bumpMap:surfaceTexture(w,'stone',true),bumpScale:.025});w.shopSurfaces.set(key,m);return m;
}
