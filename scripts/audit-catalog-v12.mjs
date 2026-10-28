import fs from 'node:fs';
import {STORES,PRODUCTS,UNIQUE_MODELS,ARCHIVED_PRODUCTS} from '../dist/catalog.js';
import {STORE_PRODUCT_ADDITIONS} from '../dist/store-product-additions-v12.js';
import {brandDesign} from '../dist/brand-designs.js';
const report={release:'12.0.0',checkedOn:'2026-10-27',sourceEntries:STORES.length,stockedStores:STORES.filter(s=>s.catalogStatus==='verified').length,pendingStores:STORES.filter(s=>s.catalogStatus==='pending').length,serviceLocations:STORES.filter(s=>s.catalogStatus==='service').length,activeListings:PRODUCTS.length,distinctModels:UNIQUE_MODELS,newPicturedReferences:STORE_PRODUCT_ADDITIONS.length,archivedReceiptListings:ARCHIVED_PRODUCTS.length,stores:STORES.map(s=>({id:s.id,name:s.name,mall:s.mallId,status:s.catalogStatus,products:s.count,interiorLayout:brandDesign(s).layout,reference:s.source||null}))};
fs.writeFileSync(new URL('../docs/catalog-coverage-v12.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(report).filter(([k])=>k!=='stores'))));
