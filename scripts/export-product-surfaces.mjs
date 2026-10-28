import {PRODUCTS} from '../dist/catalog.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
import {PHOTO_PALETTES} from '../dist/photo-palettes.js';
import {garmentProfile} from '../dist/garment-reference-rules.js';
import {bagProfile} from '../dist/bag-reference-rules.js';
const types=new Set(['shirt','hoodie','cardigan','jacket','pants','shorts','bag','crossbody','backpack','duffel','wallet']);
process.stdout.write(JSON.stringify(PRODUCTS.filter(p=>types.has(p.type)).map(p=>({...p,photo:PRODUCT_PHOTOS[p.id]?.path,baseColor:PHOTO_PALETTES[PRODUCT_PHOTOS[p.id]?.path]?.color||p.color,garment:['shirt','hoodie','cardigan','jacket','pants','shorts'].includes(p.type)?garmentProfile(p):null,bag:bagProfile(p)})))+'\n');
