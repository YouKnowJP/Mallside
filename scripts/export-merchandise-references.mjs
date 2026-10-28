import {PRODUCTS} from '../dist/catalog.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
const types=new Set(['shirt','hoodie','cardigan','jacket','pants','shorts','bag','crossbody','backpack','duffel','wallet']);
process.stdout.write(JSON.stringify(PRODUCTS.filter(p=>types.has(p.type)).map(p=>({id:p.id,name:p.name,brand:p.brand,type:p.type,color:p.color,material:p.material,source:p.source,photo:PRODUCT_PHOTOS[p.id]?.path})))+'\n');
