// Original local activities. No purchases, payments or personal writing leave the browser.
export const ROOM_STYLES=[{id:'sage',name:'Garden studio',wall:'#e3e6db',wood:'#a68969',accent:'#789283'},{id:'oak',name:'Warm oak',wall:'#eee2cf',wood:'#b18b65',accent:'#ba8974'},{id:'blue',name:'Evening blue',wall:'#dce4e7',wood:'#8b8278',accent:'#6f879e'}];
export const GUESTBOOK_MOODS=[{id:'curious',name:'Curious'},{id:'unhurried',name:'Unhurried'},{id:'inspired',name:'Inspired'}];
export const GUESTBOOK_HIGHLIGHTS=[{id:'windows',name:'A good window display'},{id:'people',name:'A friendly conversation'},{id:'garden',name:'A quieter green corner'},{id:'find',name:'A considered real-product find'}];
export function createHomeLife(ctx){
 function prepare(s){
  if(s.outfitPlans.some(v=>v.day===s.day))throw Error('Tomorrow’s outfit is already prepared. Try it tomorrow, or make a new plan on another day.');
  const entries=Object.entries(s.equipment);
  if(entries.length<2)throw Error('Equip at least two kept purchases in different outfit slots first.');
  const items=entries.map(([slot,id])=>{const i=ctx.owned(s).find(i=>i.id===id),p=i&&ctx.byId(i.productId);if(!i||!i.worn||i.checked||i.giftWrap||ctx.slotForProduct(p)!==slot||i.size!==ctx.idealSize(s,p))throw Error('Use available, opened purchases in your usual size. Collect checked pieces first.');return {slot,id,productId:p.id};});
  ctx.canAct(s,5,1,{care:true});ctx.advance(s,5,1);
  const plan={day:s.day,forDay:s.day+1,mallId:s.mallId,items};s.outfitPlans.push(plan);s.outfitPlans=s.outfitPlans.slice(-60);ctx.event(s,'plan',String(s.day));return plan;
 }
 function apply(s){
  const plan=s.outfitPlans.find(v=>v.forDay===s.day);if(!plan)throw Error('Prepare an outfit the day before wearing it.');
  const equipment={};for(const v of plan.items){const i=ctx.owned(s).find(i=>i.id===v.id),p=i&&ctx.byId(i.productId);if(!i||!i.worn||i.checked||i.giftWrap||p.id!==v.productId||ctx.slotForProduct(p)!==v.slot||i.size!==ctx.idealSize(s,p))throw Error('A planned piece is unavailable or no longer in your saved size. Collect checked pieces first.');equipment[v.slot]=i.id;}
  s.equipment=equipment;s.displayItems=s.displayItems.filter(id=>!Object.values(equipment).includes(id));s.outfit=Object.values(equipment).at(-1)||null;return plan;
 }
 function guestbook(s,mood,highlight){
  if(!GUESTBOOK_MOODS.some(v=>v.id===mood)||!GUESTBOOK_HIGHLIGHTS.some(v=>v.id===highlight))throw Error('Choose a mood and one highlight for your guestbook entry.');
  if(s.guestbook.some(v=>v.day===s.day))throw Error('You signed the guestbook today. Another page waits tomorrow.');
  ctx.canAct(s,5,0,{care:true});ctx.advance(s,5);const entry={day:s.day,mallId:s.mallId,mood,highlight};s.guestbook.push(entry);s.guestbook=s.guestbook.slice(-120);ctx.addXP(s,10);ctx.event(s,'amenity','guestbook');return entry;
 }
 function normalize(s){
  s.roomStyle=ROOM_STYLES.some(v=>v.id===s.roomStyle)?s.roomStyle:'sage';
  const seen=new Set(),valid=v=>v&&Number.isSafeInteger(v.day)&&v.day>0&&v.day<=s.day&&ctx.mallById(v.mallId);
  s.guestbook=(Array.isArray(s.guestbook)?s.guestbook:[]).filter(v=>{if(!valid(v)||seen.has(v.day)||!GUESTBOOK_MOODS.some(m=>m.id===v.mood)||!GUESTBOOK_HIGHLIGHTS.some(h=>h.id===v.highlight))return false;seen.add(v.day);return true;}).slice(-120).map(({day,mallId,mood,highlight})=>({day,mallId,mood,highlight}));
  const days=new Set();s.outfitPlans=(Array.isArray(s.outfitPlans)?s.outfitPlans:[]).filter(v=>{if(!valid(v)||days.has(v.day)||v.forDay!==v.day+1||!Array.isArray(v.items)||v.items.length<2||v.items.length>9)return false;const slots=new Set(),ids=new Set();for(const e of v.items){const i=e&&s.purchases.find(i=>i.id===e.id),p=i&&ctx.byId(i.productId);if(!p||p.id!==e.productId||ctx.slotForProduct(p)!==e.slot||slots.has(e.slot)||ids.has(e.id))return false;slots.add(e.slot);ids.add(e.id);}days.add(v.day);return true;}).slice(-60).map(v=>({day:v.day,forDay:v.forDay,mallId:v.mallId,items:v.items.map(({slot,id,productId})=>({slot,id,productId}))}));
 }
 return {prepare,apply,guestbook,normalize};
}
