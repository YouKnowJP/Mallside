// Original Mallside activities. Lost-property props never become catalog purchases.
export const COMMUNITY_NOTICES=[
 {id:'garden',name:'A quieter loop',text:'Meet Eli for a garden pause, then look for a piece of public art.',person:'eli',highlight:'garden'},
 {id:'welcome',name:'A newcomer’s welcome',text:'Jules is putting together a friendly route: a directory, free water and a proper hello.',person:'jules',highlight:'people'},
 {id:'wardrobe',name:'Keep what feels like you',text:'Noor is comparing the pieces already in the wardrobe. A thoughtful outfit needs no new purchase.',person:'noor',highlight:'find'}
];
const PROPERTY=[
 {id:'umbrella',name:'A navy umbrella',detail:'A wooden handle and a little yellow ribbon',emoji:'☂'},
 {id:'scarf',name:'A green scarf',detail:'A cream stitched edge and two small tassels',emoji:'🧣'},
 {id:'keys',name:'A ring of keys',detail:'A round red tag and a tiny bicycle charm',emoji:'🔑'}
];
export function lostPropertyCase(day=1){
 day=Number.isSafeInteger(day)&&day>0?day:1;
 const index=((Number.isSafeInteger(day)?day:1)-1)%PROPERTY.length,item=PROPERTY[(index+PROPERTY.length)%PROPERTY.length];
 return {id:item.id,description:item.detail,options:PROPERTY.map(v=>({...v})),reference:'LP-'+String(Math.max(1,day)).padStart(3,'0')};
}
export function createNeighborhoodLife(ctx){
 function once(s,kind){if(s.neighborhoodDays.some(v=>v.day===s.day&&v.kind===kind))throw Error('You have completed this today. Come back tomorrow.');}
 function record(s,kind,choice){const v={day:s.day,mallId:s.mallId,kind,choice};s.neighborhoodDays.push(v);s.neighborhoodDays=s.neighborhoodDays.slice(-180);return v;}
 function notice(s,id){
  if(!COMMUNITY_NOTICES.some(v=>v.id===id))throw Error('Choose a notice on the community board.');once(s,'notice');ctx.canAct(s,3,0,{care:true});ctx.advance(s,3);const v=record(s,'notice',id);ctx.addXP(s,5);ctx.event(s,'amenity','notice');return v;
 }
 function property(s,id){
  once(s,'property');if(id!==lostPropertyCase(s.day).id)throw Error('That item does not match every detail on the claim card. Look again; no time or money has been used.');ctx.canAct(s,6,0,{care:true});ctx.advance(s,6);const v=record(s,'property',id);ctx.addXP(s,15);ctx.event(s,'amenity','property');return v;
 }
 function unwind(s){
  once(s,'unwind');ctx.canAct(s,8,0,{care:true});ctx.advance(s,8);s.energy=Math.min(100,s.energy+12);const v=record(s,'unwind','quiet');ctx.addXP(s,10);ctx.event(s,'home','unwind');return v;
 }
 function arrange(s,id,direction){
  const index=s.displayItems.indexOf(id),next=index+direction;
  if(![-1,1].includes(direction)||index<0||next<0||next>=s.displayItems.length)throw Error('Choose a displayed purchase with a neighboring shelf place.');
  [s.displayItems[index],s.displayItems[next]]=[s.displayItems[next],s.displayItems[index]];ctx.event(s,'arrange',String(id));return true;
 }
 function normalize(s){
  const seen=new Set();s.neighborhoodDays=(Array.isArray(s.neighborhoodDays)?s.neighborhoodDays:[]).filter(v=>{
   if(!v||!Number.isSafeInteger(v.day)||v.day<1||v.day>s.day||!ctx.mallById(v.mallId))return false;
   const valid=v.kind==='notice'?COMMUNITY_NOTICES.some(n=>n.id===v.choice):v.kind==='property'?lostPropertyCase(v.day).id===v.choice:v.kind==='unwind'&&v.choice==='quiet',key=v.day+':'+v.kind;
   if(!valid||seen.has(key))return false;seen.add(key);return true;
  }).slice(-180).map(({day,mallId,kind,choice})=>({day,mallId,kind,choice}));
 }
 return {notice,property,unwind,arrange,normalize};
}
