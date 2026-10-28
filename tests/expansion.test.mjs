import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';

test('the original 32 story shops retain verified stock and old reference IDs while expanded listings stay unique',()=>{
 assert.equal(E.CORE_STORES.length,32);assert.equal(new Set(E.PRODUCTS.map(p=>p.id)).size,E.PRODUCTS.length);
 assert.ok(new Set(E.PRODUCTS.map(p=>p.brand+' · '+p.name)).size>=526);
 for(const st of E.CORE_STORES){assert.ok(E.PRODUCTS.some(p=>p.store===st.id&&p.associationEvidence));assert.ok(E.DISTRICTS.some(d=>d.id===st.district));}
 for(const popup of E.POPUPS)for(const id of popup.products)assert.equal(E.byId(id)?.store,popup.store);
});
test('ten destination levels gate each mall and its newly available stores',()=>{
 const s=E.createState();
 for(let rank=0;rank<E.LEVELS.length;rank++){s.xp=E.LEVELS[rank].xp;assert.equal(E.levelOf(s),rank);if(rank<9){const before=structuredClone(s);assert.throws(()=>E.travelMall(s,E.MALLS[rank+1].id),/Reach Level/);assert.deepEqual(s,before);const st=E.STORES.find(st=>st.tier===rank+1);if(st){const p=E.PRODUCTS.find(p=>p.store===st.id);assert.throws(()=>E.checkout(s,p.store,[{id:p.id,size:p.sizes[0]}]),/Unlock/);assert.deepEqual(s,before);}}}
 assert.equal(E.MISSIONS.length,24);assert.equal(E.QUESTS.length,10);
});
test('district travel costs time and stamina, while selecting the current wing is free',()=>{
 const s=E.createState();E.travel(s,'central');assert.equal(s.minutes,603);assert.equal(s.district,'central');assert.equal(s.mapOverview,false);assert.equal(s.metrics.travels,1);assert.ok(s.energy<99);const before=structuredClone(s);E.travel(s,'central');assert.deepEqual(s,before);s.minutes=1199;const closed=structuredClone(s);assert.throws(()=>E.travel(s,'gallery'),/Not enough time/);assert.deepEqual(s,closed);
});
test('new service discoveries reward XP once',()=>{const s=E.createState();E.visitVenue(s,'coffee');const xp=s.xp;E.visitVenue(s,'coffee');assert.equal(s.xp,xp);assert.deepEqual(s.venues,['coffee']);});
test('pop-up stamps rotate and are limited to one per day; coupons apply to one matching checkout',()=>{
 const s=E.createState();s.sandbox=true;s.cash=100000;const p=E.byId('lego-x1');const base=E.price(s,p);assert.equal(E.currentPopup(s).id,'botanicals');E.claimPopup(s);assert.equal(E.price(s,p),Math.round(base*.9));const stamped=structuredClone(s);assert.throws(()=>E.claimPopup(s),/already/);assert.deepEqual(s,stamped);
 E.checkout(s,'ross',[{id:'ross::nike-x9',size:'M'}]);assert.ok(s.coupon);const order=E.checkout(s,'lego',[{id:p.id,size:p.sizes[0]}]);assert.equal(order.subtotal,Math.round(base*.9));assert.equal(s.coupon,null);assert.equal(E.price(s,p),base);E.nextDay(s);assert.equal(E.currentPopup(s).id,'sneakers');E.claimPopup(s);assert.equal(s.popupStamps.length,2);E.nextDay(s);assert.equal(s.coupon,null);
});
test('failed checkout preserves a pop-up coupon and all money and stock',()=>{const s=E.createState();E.claimPopup(s);s.sandbox=true;s.cash=0;const before=structuredClone(s);assert.throws(()=>E.checkout(s,'lego',[{id:'lego-x1',size:'One size'}]),/more/);assert.deepEqual(s,before);});
test('tech and hobby demos use time without removing tags or repeat XP',()=>{const s=E.createState();E.demo(s,'apple-x2');assert.equal(s.minutes,606);assert.equal(s.daily.demo.length,1);const xp=s.xp;E.demo(s,'apple-x2');assert.equal(s.xp,xp);assert.equal(s.demos.length,1);assert.throws(()=>E.fit(s,'apple-x2','One size'),/product demo/);});
test('opening a purchased nonwearable removes packaging without assigning an outfit',()=>{const s=E.createState();s.sandbox=true;E.checkout(s,'target',[{id:'target::apple-x1',size:'One size'}]);const item=s.purchases[0];const time=s.minutes;E.useProduct(s,item.id);assert.equal(s.minutes,time+10);assert.equal(item.tags,false);assert.equal(s.outfit,null);assert.equal(s.metrics.wears,0);assert.throws(()=>E.returnItem(s,item.id,'target'),/Used/);});
test('named coffee drinks restore stamina; pastry counts toward lunch',()=>{const s=E.createState();s.energy=20;s.hunger=30;E.eat(s,'sb-flat');assert.equal(s.cash,24450);assert.ok(s.energy>50);assert.equal(s.metrics.coffees,1);assert.equal(s.metrics.meals,0);E.eat(s,'sb-croissant');assert.equal(s.metrics.meals,1);assert.equal(s.daily.eat.length,1);assert.ok(s.hunger>60);});
test('district postcards charge each time but reward discovery XP only once per district',()=>{const s=E.createState();E.takePhoto(s);assert.equal(s.cash,24500);const xp=s.xp;E.takePhoto(s);assert.equal(s.xp,xp);for(const id of ['central','gallery','avenue','garden','terrace']){E.travel(s,id);E.takePhoto(s);}assert.equal(new Set(s.postcards.map(p=>p.district)).size,6);assert.ok(E.unlockBadges(s).some(b=>b.id==='postcards'));});
test('different brands with the same bottle name cannot be compared as identical products',()=>{const s=E.createState();assert.equal(E.byId('target-x3').name,E.byId('target-x10').name);assert.throws(()=>E.compare(s,'target-x3'),/no matching/);});
test('v2 saves preserve purchases, badges, completed chapters, and every previously unlocked store tier',()=>{
 for(const [xp,minimum] of [[0,0],[150,2],[400,4],[850,8],[1400,9]]){const old=E.createState();E.checkout(old,'ross',[{id:'ross::nike-x9',size:'M'}]);old.version=2;old.xp=xp;old.missions=['first'];old.badges=['first-bag'];delete old.daily.popup;delete old.daily.demo;delete old.metrics.coffees;delete old.postcards;const loaded=E.loadState(JSON.stringify(old));assert.equal(loaded.version,6);assert.ok(E.levelOf(loaded)>=minimum);assert.deepEqual(loaded.purchases,old.purchases);assert.deepEqual(loaded.missions,['first']);assert.deepEqual(loaded.badges,['first-bag']);assert.deepEqual(loaded.daily.popup,[]);assert.deepEqual(loaded.postcards,[]);}
});
