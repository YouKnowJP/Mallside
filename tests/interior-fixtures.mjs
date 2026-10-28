import {STORES,FLOORPLANS} from '../dist/engine.js';
import {interiorPlan} from '../dist/shop-interiors.js';
// Routing and camera geometry depend on fixture positions, not on repeated branch/product names.
export function interiorSamples(){const layouts=new Map();for(const st of STORES){const l=interiorPlan(st,FLOORPLANS.orange),key=JSON.stringify([l.displays,l.fixtures,l.services,l.spawn,l.exit]);if(!layouts.has(key))layouts.set(key,{st,l});}return [...layouts.values()];}
