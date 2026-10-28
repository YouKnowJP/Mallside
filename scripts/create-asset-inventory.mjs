// Provenance is recorded separately from permission; this script grants no rights.
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve,relative} from 'node:path';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const dist=resolve(root,'dist');
const digest=path=>createHash('sha256').update(readFileSync(resolve(dist,path))).digest('hex');
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(resolve(dir,e.name)):[resolve(dir,e.name)]);

export function createAssetInventory(){
 const hashes=new Map();
 const photos=Object.entries(PRODUCT_PHOTOS).sort(([a],[b])=>a.localeCompare(b,'en')).map(([id,p])=>{
  if(!p.path.startsWith('assets/')||p.path.includes('..'))throw Error('Invalid photograph path: '+id);
  if(!hashes.has(p.path))hashes.set(p.path,digest(p.path));
  return {id,path:p.path,sha256:hashes.get(p.path),source:p.source,imageUrl:p.imageUrl,description:p.description,rightsHolder:'Respective third-party owner; not established by source URL',permissionStatus:'permission-not-recorded'};
 });
 const unindexedImages=walk(resolve(dist,'assets')).map(p=>relative(dist,p).replaceAll('\\','/'))
  .filter(p=>!p.startsWith('assets/character/')&&/\.(?:png|jpe?g|webp|gif|avif|svg)$/i.test(p)&&!hashes.has(p)).sort()
  .map(path=>({path,sha256:digest(path),permissionStatus:'permission-not-recorded',note:'No matching current runtime photo-index entry; retained legacy image. Research records may contain earlier provenance.'}));
 return {schemaVersion:1,release:JSON.parse(readFileSync(resolve(root,'package.json'),'utf8')).version,
  notice:'Provenance and clearance worklist only. Source URLs and inclusion do not establish reproduction, redistribution or commercial permission. No exclusive Mallside ownership is asserted for these photographs.',
  characterAssets:{license:'CC0-1.0',provenance:'dist/assets/character/provenance.json',notice:'Independent public-domain graphical assets; see THIRD_PARTY_NOTICES.md.'},
  runtimePhotoEntries:photos.length,uniqueRuntimePhotoFiles:hashes.size,photos,unindexedImages};
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const inventory=createAssetInventory();
 writeFileSync(resolve(root,'docs/ASSET_INVENTORY.json'),JSON.stringify(inventory,null,2)+'\n');
 console.log(`Recorded ${inventory.runtimePhotoEntries} photo references, ${inventory.uniqueRuntimePhotoFiles} unique runtime files and ${inventory.unindexedImages.length} unindexed images. Permissions are not presumed.`);
}
