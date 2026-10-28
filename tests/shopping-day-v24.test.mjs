import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
const fresh=()=>{const s=E.createState();s.sandbox=true;s.cash=10000000;return s;};
const buy=(s,p,size=E.idealSize(s,p))=>{E.checkout(s,p.store,[{id:p.id,size}]);return s.purchases.at(-1);};
const complete=s=>{for(const i of E.outingStatus(s).items){E.inspect(s,i.productId);if(i.fit)E.fit(s,i.productId,E.idealSize(s,i.product));if(i.buy)buy(s,i.product);}if(s.outing.template==='window')E.rest(s);};
const branch=(core,mall)=>E.STORES.find(st=>st.mallId===mall&&E.sameRetailer(st.id,core));

test('all ten destinations offer deterministic, affordable outings using active photographed real models',()=>{
 let rotating=0;
 for(const mall of E.MALLS){
  const s=E.createState();s.mallId=mall.id;s.xp=mall.xp;s.cash=1000000;
  let last=null;
  for(const day of [1,2,7]){
   s.day=day;const offers=E.outingOffers(s);assert.ok(offers.some(o=>o.id==='window'),mall.id);
   assert.deepEqual(E.outingOffers(s),offers);
   for(const offer of offers){
    assert.ok(offer.estimate<=offer.budget);assert.ok(offer.budget<=s.dailyBudget&&offer.budget<=s.cash);
    assert.equal(new Set(offer.items.map(i=>E.modelKey(E.byId(i.productId)))).size,offer.items.length);
    for(const i of offer.items){const p=E.byId(i.productId);assert.ok(p&&!p.archived&&PRODUCT_PHOTOS[p.id]);assert.ok(mall.sections.some(d=>d.stores.includes(p.store)));assert.ok(E.storeById(p.store).tier<=E.levelOf(s));if(i.fit)assert.ok(E.canTry(p));}
   }
   const signature=offers.map(o=>o.items.map(i=>i.productId).join(',')).join('|');if(last&&last!==signature)rotating++;last=signature;
  }
 }
 assert.ok(rotating>=10,'daily model edits should rotate across the destinations');
});

test('a cashless player can finish a free outing through real inspections and a new rest',()=>{
 const s=E.createState();s.cash=0;s.dailyBudget=0;assert.deepEqual(E.outingOffers(s).map(o=>o.id),['window']);
 E.acceptOuting(s,'window');assert.equal(E.nextShoppingAction(s).chapter,'OUTING');
 const before=structuredClone(s);assert.throws(()=>E.claimOuting(s),/Complete every/);assert.deepEqual(s,before);
 complete(s);assert.ok(E.outingStatus(s).ready);const reward=E.claimOuting(s);assert.equal(reward.cash,0);assert.equal(s.cash,0);assert.equal(s.xp,3*8+30);assert.equal(s.outingClaimDays.length,1);assert.equal(s.outingFocus,false);
 const claimed=structuredClone(s);assert.throws(()=>E.claimOuting(s),/already/);assert.throws(()=>E.acceptOuting(s,'window'),/already/);assert.deepEqual(s,claimed);
});

test('shopping outings require new paid purchases, preserve tags and include actual per-line tax',()=>{
 const s=fresh(),offer=E.outingOffers(s).find(o=>o.id==='style');assert.ok(offer);
 for(const i of offer.items)buy(s,E.byId(i.productId));
 E.acceptOuting(s,'style');assert.ok(E.outingStatus(s).items.every(i=>!i.purchase),'previous ownership cannot fill a new shopping brief');
 complete(s);const status=E.outingStatus(s);assert.ok(status.ready);assert.equal(status.spent,status.items.reduce((n,i)=>n+i.purchase.price+i.purchase.tax,0));assert.ok(status.spent<=status.budget);assert.ok(status.items.every(i=>i.purchase.tags&&!i.purchase.worn));
 const before=s.cash,reward=E.claimOuting(s);assert.equal(s.cash,before+reward.cash);assert.equal(s.outingLog[0].spent,status.spent);
});

test('a fit alone does not credit a purchase in the wrong size',()=>{
 const s=fresh();let chosen;
 for(let d=1;d<=30;d++){s.day=d;const o=E.outingOffers(s).find(o=>o.id==='find');if(o&&E.byId(o.items[0].productId).sizes.length>1){chosen=o;break;}}
 assert.ok(chosen);E.acceptOuting(s,'find');const p=E.outingStatus(s).items[0].product,usual=E.idealSize(s,p),wrong=p.sizes.find(v=>v!==usual);
 E.inspect(s,p.id);E.fit(s,p.id,usual);const wrongPurchase=buy(s,p,wrong);assert.equal(E.outingStatus(s).items[0].purchase,undefined);assert.equal(E.outingStatus(s).ready,false);
 E.returnItem(s,wrongPurchase.id,p.store);buy(s,p,usual);assert.ok(E.outingStatus(s).ready);
});

test('refunds and delivered purchases stop satisfying an unclaimed outing',()=>{
 const s=fresh();E.acceptOuting(s,'find');complete(s);const ready=E.outingStatus(s);assert.ok(ready.ready);const item=ready.items[0].purchase;
 E.returnItem(s,item.id,item.store);assert.equal(E.outingStatus(s).ready,false);const before=structuredClone(s);assert.throws(()=>E.claimOuting(s));assert.deepEqual(s,before);
 const replacement=buy(s,ready.items[0].product);replacement.delivered=true;assert.equal(E.outingStatus(s).ready,false);
});

test('the allowance is enforced from receipt totals and cannot be claimed while over budget',()=>{
 const s=fresh();E.acceptOuting(s,'find');complete(s);const status=E.outingStatus(s);s.outing.budget=status.spent-1;
 assert.ok(E.outingStatus(s).overBudget);const before=structuredClone(s);assert.throws(()=>E.claimOuting(s),/allowance/);assert.deepEqual(s,before);
});

test('matching labels at other branches count, but yesterday’s inspections and rests do not',()=>{
 const s=fresh();E.rest(s);E.acceptOuting(s,'window');let usedBranch=false;
 for(const i of E.outingStatus(s).items){const p=E.PRODUCTS.find(p=>p.id!==i.productId&&E.sameModel(p,i.product));E.inspect(s,p?.id||i.productId);if(p)usedBranch=true;}
 assert.ok(usedBranch);assert.ok(E.outingStatus(s).items.every(i=>i.inspected));assert.equal(E.outingStatus(s).ready,false,'rest must happen after acceptance');E.rest(s);assert.ok(E.outingStatus(s).ready);
 const summary=E.nextDay(s);assert.ok(summary.outing&&!summary.outing.claimed);assert.equal(s.outing,null);assert.equal(s.outingFocus,false);E.acceptOuting(s,'window');assert.ok(E.outingStatus(s).items.every(i=>!i.inspected));
});

test('cancellation preserves purchases and one-reward-per-day protection survives backups',()=>{
 const s=fresh();E.acceptOuting(s,'find');complete(s);const purchases=structuredClone(s.purchases),cash=s.cash;E.cancelOuting(s);assert.deepEqual(s.purchases,purchases);assert.equal(s.cash,cash);
 E.acceptOuting(s,'find');assert.ok(E.outingStatus(s).items.every(i=>!i.purchase));complete(s);E.claimOuting(s);const restored=E.validateImport(JSON.stringify(s)),snapshot=structuredClone(restored);assert.throws(()=>E.claimOuting(restored),/already/);assert.deepEqual(restored,snapshot);
 const recap=E.nextDay(restored);assert.ok(recap.outing.claimed);assert.ok(E.outingOffers(restored).length);assert.equal(restored.outingLog.length,1);
});

test('late or unavailable outing choices fail without spending, changing serials or touching a save',()=>{
 const s=fresh();s.minutes=E.CLOSE-5;let before=structuredClone(s);assert.throws(()=>E.acceptOuting(s,'window'),/not enough time/);assert.deepEqual(s,before);assert.throws(()=>E.acceptOuting(s,'toString'),/not available/);assert.deepEqual(s,before);
 s.minutes=E.OPEN;E.acceptOuting(s,'window');before=structuredClone(s);assert.throws(()=>E.acceptOuting(s,'find'),/current outing/);assert.deepEqual(s,before);
});

test('old and malformed saves acquire safe outing fields without losing money, purchases or earned story',()=>{
 const s=fresh(),item=buy(s,E.byId('u-bag'));s.missions=['first'];for(const key of ['outing','outingFocus','outingClaimDays','outingLog'])delete s[key];let copy=E.loadState(JSON.stringify(s));assert.equal(copy.cash,s.cash);assert.deepEqual(copy.missions,s.missions);assert.equal(copy.purchases[0].id,item.id);assert.equal(copy.outing,null);
 for(const bad of [{template:'toString',day:1},{template:'window',day:1,targets:['missing']},{template:'style',day:1,targets:'bad'}]){s.outing=bad;s.outingFocus=true;s.outingClaimDays=[null,-1,1,1,Infinity];s.stock='corrupt';copy=E.loadState(JSON.stringify(s));assert.equal(copy.cash,s.cash);assert.equal(copy.outing,null);assert.equal(copy.outingFocus,false);assert.deepEqual(copy.outingClaimDays,[1]);assert.deepEqual(copy.stock,{});}
});

test('UNIQLO branch purchases fulfill the actual top and Round Mini story goals, and returns undo ownership',()=>{
 const s=fresh(),st=branch('uniqlo','brea');assert.ok(st);const products=E.PRODUCTS.filter(p=>p.store===st.id),top=products.find(p=>['shirt','cardigan'].includes(p.type)),bag=products.find(p=>E.sameModel(p,E.byId('u-bag')));assert.ok(top&&bag);
 const topItem=buy(s,top),bagItem=buy(s,bag),mission=E.MISSIONS.find(m=>m.id==='essentials');assert.ok(mission.steps[0][1](s));assert.ok(mission.steps[1][1](s));
 E.returnItem(s,bagItem.id,st.id);assert.equal(mission.steps[1][1](s),false);topItem.delivered=true;assert.equal(mission.steps[0][1](s),false);
});

test('retailer stamps accept real branches once and never confuse Nordstrom Rack with Nordstrom',()=>{
 const s=fresh(),st=branch('uniqlo','brea'),rack=E.STORES.find(st=>/Nordstrom Rack/i.test(st.name));s.visits=[st.id,'uniqlo'];assert.ok(E.visitedRetailer(s,'uniqlo'));assert.equal(E.CORE_STORES.filter(st=>E.visitedRetailer(s,st.id)).length,1);
 assert.ok(rack);s.visits=[rack.id];assert.equal(E.visitedRetailer(s,'nordstrom'),false);assert.equal(E.sameRetailer(rack.id,'nordstrom'),false);
});

test('different-model goals cannot be farmed with the same named model’s multiple source IDs or branches',()=>{
 const s=fresh(),all=E.PRODUCTS.filter(p=>E.sameRetailer(p.store,'nordstrom')).sort((a,b)=>a.price-b.price),first=all[0],duplicate=all.find(p=>p.id!==first.id&&E.sameModel(p,first));assert.ok(duplicate);
 buy(s,first);buy(s,duplicate);const signature=E.MISSIONS.find(m=>m.id==='signature');assert.equal(signature.steps[1][1](s),false);
 const other=all.find(p=>!E.sameModel(p,first));buy(s,other);assert.ok(signature.steps[1][1](s));
 E.inspect(s,first.id);E.inspect(s,duplicate.id);assert.equal(E.dailyGoalProgress(s,'inspect'),1);assert.throws(()=>E.claimDaily(s,'inspect'),/Finish/);E.inspect(s,other.id);assert.equal(E.dailyGoalProgress(s,'inspect'),2);
 const coach=E.PRODUCTS.filter(p=>/Swing Zip Bag/i.test(p.name)&&/coach/i.test(p.brand));assert.ok(coach.length>1);assert.equal(E.modelCount(coach),1);
});

test('store-specific errands accept an allowed branch while retaining exact listing inspection and purchase gates',()=>{
 const s=fresh();let brief,p;
 for(let day=1;day<=14&&!p;day++){s.day=day;for(const b of E.errandOffers(s)){if(!b.stores)continue;const q=E.PRODUCTS.find(p=>!b.stores.includes(p.store)&&E.stock(s,p.id,E.idealSize(s,p))>=2&&E.errandMatchesProduct(p,b)&&E.price(s,p)+Math.round(E.price(s,p)*E.TAX)<=b.budget);if(q){brief=b;p=q;break;}}}
 assert.ok(p&&brief);const earlier=buy(s,p);E.acceptErrand(s,brief.id);E.inspect(s,p.id);assert.ok(!E.errandCandidates(s).some(i=>i.id===earlier.id));
 const item=buy(s,p);assert.ok(E.errandCandidates(s).some(i=>i.id===item.id));item.checked=true;assert.equal(E.errandCandidates(s).length,0);item.checked=false;item.worn=true;assert.equal(E.errandCandidates(s).length,0);item.worn=false;E.deliverErrand(s,item.id);assert.equal(item.delivered,true);
});

test('retailer-wide story matching never credits another mall’s location-specific destination evidence',()=>{
 const s=fresh();E.travelMall(s,'brea');const before=E.destinationGoal(s,'brea'),outside=E.PRODUCTS.find(p=>E.STORES.find(st=>st.id===p.store)?.mallId==='southcoast'&&E.sameRetailer(p.store,'uniqlo'));assert.ok(outside);E.inspect(s,outside.id);s.visits.push(outside.store);assert.deepEqual(E.destinationGoal(s,'brea'),before);
});

test('guidance prefers the current mall’s branch and advances beyond already visited retailers',()=>{
 const s=fresh();E.travelMall(s,'brea');const store=branch('uniqlo','brea');assert.equal(E.preferredStoryStore(s,'uniqlo'),store.id);assert.equal(E.preferredStoryProduct(s,'u-bag').store,store.id);
 s.missions=['first'];s.visits=[E.STORES.find(st=>st.id!=='ross'&&E.sameRetailer(st.id,'ross'))?.id||'ross',E.STORES.find(st=>st.id!=='marshalls'&&E.sameRetailer(st.id,'marshalls'))?.id||'marshalls'];const action=E.nextShoppingAction(s);assert.equal(action.kind,'product');assert.ok(E.byId(action.id)&&!E.byId(action.id).archived);
});


test('destination discovery deduplicates matching models only after filtering to that mall',()=>{
 const s=fresh();let mall,group;
 for(const m of E.MALLS){const shops=new Set(m.sections.flatMap(d=>d.stores)),models=new Map();for(const p of E.PRODUCTS.filter(p=>shops.has(p.store))){const key=E.modelKey(p);if(!models.has(key))models.set(key,[]);models.get(key).push(p);}const found=[...models.values()].find(items=>new Set(items.map(p=>p.store)).size>1);if(found){mall=m;group=found;break;}}
 assert.ok(mall&&group);E.travelMall(s,mall.id);E.inspect(s,group[0].id);const second=group.find(p=>p.store!==group[0].store);E.inspect(s,second.id);assert.equal(E.destinationGoal(s,mall.id).inspects,1);s.visits.push(group[0].store,group[0].store);assert.equal(E.destinationGoal(s,mall.id).visits,1);
 const remote=E.PRODUCTS.find(p=>E.sameModel(p,group[0])&&!mall.sections.some(d=>d.stores.includes(p.store)));if(remote){E.inspect(s,remote.id);assert.equal(E.destinationGoal(s,mall.id).inspects,1);}
});
