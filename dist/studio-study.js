import {isPlanningStore} from './shopping-plans.js?v=36.0.0';
// Newly stocked studios retain the original creative studies saved before their catalogs arrived.
export const supportsMaterialStudy=st=>isPlanningStore(st)||[42,43].includes(st?.collectionEdition);
// Original Mallside design exercises. These samples are never merchant stock.
export const STUDY_PALETTES=[
 {id:'earth',name:'Earth & linen',colors:['#ac7456','#dfca9e','#718374'],labels:['Clay','Linen','Sage']},
 {id:'coast',name:'Coast & ink',colors:['#658e98','#e6ded0','#424f65'],labels:['Sea glass','Chalk','Ink']},
 {id:'berry',name:'Berry & brass',colors:['#966375','#d4b56e','#b5b3a4'],labels:['Berry','Brass','Stone']}
];
export const STUDY_FINISHES=[{id:'textured',name:'Textured',description:'A softer, broken reflection.'},{id:'smooth',name:'Smooth',description:'A clearer highlight along each edge.'}];
export const studioGroup=st=>['apparel','shoes','bags'].includes(st.businessKind)?'textile':['beauty','jewelry','eyewear'].includes(st.businessKind)?'light':'workshop';
export const validStudy=d=>!!d&&STUDY_PALETTES.some(p=>p.id===d.palette)&&STUDY_FINISHES.some(f=>f.id===d.finish);
export function studyFor(s,store){const saved=(s.materialStudies||[]).find(n=>n.store===store);return saved?{...saved}:{store,palette:'earth',finish:'textured',day:s.day};}
export function createStudioStudies({storeById,mallOf,isPlanningStore}){
 function normalize(s){const notes=new Map();for(const n of Array.isArray(s.materialStudies)?s.materialStudies:[]){if(!validStudy(n)||!supportsMaterialStudy(storeById(n.store))||!Number.isSafeInteger(n.day)||n.day<1||n.day>s.day)continue;notes.set(n.store,{store:n.store,palette:n.palette,finish:n.finish,day:n.day});}s.materialStudies=[...notes.values()];}
 function save(s,draft){const st=storeById(draft?.store);if(!supportsMaterialStudy(st)||!mallOf(s).sections.some(d=>d.stores.includes(st.id))||!validStudy(draft))throw Error('Choose a material study at a supported shop in this center.');const note={store:st.id,palette:draft.palette,finish:draft.finish,day:s.day},index=s.materialStudies.findIndex(n=>n.store===st.id);if(index<0)s.materialStudies.push(note);else s.materialStudies[index]=note;return {...note};}
 return {normalize,save};
}
