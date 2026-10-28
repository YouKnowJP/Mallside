// Original mall activities and characters. Merchandise is always drawn from the real catalog.
export const LOCALS=[
 {id:'maya',name:'Maya',role:'The thoughtful shopper',color:'#b789ad',line:'I always window-shop before buying. Two good finds and a proper break make a lovely day.'},
 {id:'eli',name:'Eli',role:'The weekend explorer',color:'#769ca5',line:'There is more here than storefronts. Try the carousel, visit the sculpture court, or make something at the flower studio.'},
 {id:'sam',name:'Sam',role:'The mall regular',color:'#c39b69',line:'Need a little direction? The map shows the whole center. Pick a court or a stop and your shopper will walk there.'}
];
export const WINDOW_COUNT=3;
export function windowSelection(products,store,day=1){const list=products.filter(p=>p.store===store);if(!list.length)return [];const start=((day-1)*3)%list.length;return Array.from({length:Math.min(WINDOW_COUNT,list.length)},(_,i)=>list[(start+i)%list.length]);}
export function momentKey(s,id){return `${s.day}:${s.mallId}:${id}`;}
export function momentStatus(s){const prefix=`${s.day}:${s.mallId}:`,windows=new Set((s.windowVisits||[]).filter(v=>typeof v==='string'&&v.startsWith(prefix))).size,talks=new Set((s.conversations||[]).filter(v=>typeof v==='string'&&v.startsWith(prefix))).size,activities=(s.activityLog||[]).filter(v=>v.day===s.day&&v.mallId===s.mallId).length;return {windows,talks,activities,ready:windows>=2&&talks>=1&&activities>=1,claimed:(s.mallMoments||[]).includes(momentKey(s,'complete'))};}
