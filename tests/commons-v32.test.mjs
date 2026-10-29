import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import {fixtureStop} from '../dist/mall-neighborhood.js';
import {commonsActivity,commonsNotebook,publicStops} from '../dist/commons-ui.js';
import {shoppingGuide,campusMapSVG} from '../dist/play-ui.js';
import {mallLayouts,assertCampusTrip} from './campus-assertions.mjs';
import {MallWorld3D} from '../dist/world-3d.js';
const esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');

test('all 23 public floors have three reachable, distinct physical discovery stops',()=>{
 let total=0;for(const m of E.MALLS){const layouts=mallLayouts(m);for(const [floor,l]of layouts.entries()){
  assert.ok(l.seating.length>0,m.id+' floor '+floor+' keeps a resting spot');const stops=l.environment.fixtures.filter(f=>f.activity);assert.deepEqual(stops.map(f=>f.activity),Object.keys(E.COMMONS));
  for(const f of stops){assert.ok(l.nav.obstacles.includes(f));assertCampusTrip(m,layouts,floor,l.spawn,floor,f.approach);assert.equal(fixtureStop(f).id,'commons:'+f.activity);total++;}
 }}assert.equal(total,69);
});
test('discovery trail records choices, rewards each first visit and completes once per mall',()=>{
 const s=E.createState();s.sandbox=true;s.energy=40;const cash=s.cash,start=s.minutes;
 assert.deepEqual(E.commonsStatus(s),{count:0,target:3,complete:false});
 for(const [kind,choice]of [['mosaic',[0,1,2]],['reading','receipt'],['garden','shade']]){const r=E.recordCommons(s,kind,choice);assert.equal(r.xp,kind==='garden'?30:5);}
 assert.equal(s.xp,40);assert.equal(s.cash,cash);assert.equal(s.minutes,start+14);assert.ok(s.energy>40);assert.equal(E.commonsStatus(s).complete,true);
 const before=structuredClone(s);assert.throws(()=>E.recordCommons(s,'reading','window'),/already/);assert.deepEqual(s,before);
 s.day++;s.minutes=E.OPEN;assert.equal(E.recordCommons(s,'reading','window').xp,0);assert.equal(s.commonsNotes.length,3);assert.equal(s.commonsNotes.find(n=>n.kind==='reading').choice,'window');
 s.mallId='citadel';assert.equal(E.commonsStatus(s).count,0);assert.equal(E.recordCommons(s,'garden','color').xp,5);
 const copy=E.validateImport(JSON.stringify(s));assert.deepEqual(copy.commonsNotes,s.commonsNotes);assert.equal(copy.xp,s.xp);assert.equal(copy.cash,cash);
});
test('unfinished puzzles, invalid choices, wrong floors and closing actions are atomic',()=>{
 const s=E.createState();for(const [kind,choice,floor]of [['mosaic',[0,1,3],0],['mosaic',[0,1,2,3],0],['garden','invented',0],['reading','receipt',1],['bad','receipt',0],['toString','receipt',0]]){const before=structuredClone(s);assert.throws(()=>E.recordCommons(s,kind,choice,floor));assert.deepEqual(s,before);}
 s.minutes=E.CLOSE-2;const late=structuredClone(s);assert.throws(()=>E.recordCommons(s,'garden','shade'));assert.deepEqual(s,late);
});
test('legacy saves default to an empty notebook; imported notes are bounded, deduplicated and validated',()=>{
 const s=E.createState();delete s.commonsNotes;assert.deepEqual(E.loadState(JSON.stringify(s)).commonsNotes,[]);s.commonsNotes=[null,{}, {mallId:'orange',floor:0,kind:'toString',choice:'receipt',day:1},...Array.from({length:200},()=>({mallId:'orange',floor:0,kind:'reading',choice:'receipt',day:1})),{mallId:'orange',floor:9,kind:'garden',choice:'shade',day:1},{mallId:'orange',floor:0,kind:'reading',choice:'receipt',day:10}];
 const copy=E.loadState(JSON.stringify(s));assert.deepEqual(copy.commonsNotes,[{mallId:'orange',floor:0,kind:'reading',choice:'receipt',day:1}]);assert.equal(copy.cash,s.cash);assert.deepEqual(copy.purchases,s.purchases);
});
test('map destinations expose public stops and interactive floor connections with explicit labels',()=>{
 const s=E.createState();s.sandbox=true;s.mallId='brea';const l=mallLayouts(E.mallOf(s))[1],html=publicStops(l,1,{E,esc,s}),svg=campusMapSVG(l,null,1,{E,esc});
 for(const f of l.environment.fixtures.filter(f=>f.activity)){assert.ok(html.includes('data-id="'+f.id+'"'));assert.ok(svg.includes('data-id="'+f.id+'"'));}
 assert.ok(svg.includes('data-type="connector"'));assert.ok(svg.includes('data-floor="1"'));assert.ok(html.includes('My discoveries · 0/3'));
 const a=commonsActivity(s,'mosaic',[0,1,2],{E,esc});assert.ok(a.includes('Turn tile 1, currently up'));assert.ok(a.includes('Save the mosaic discovery'));assert.ok(commonsNotebook(s,{E,esc}).includes('Still to discover'));
});
test('shop guide adapts to service, stocked nonwearable and research-only branches',()=>{
 const s=E.createState();for(const st of E.STORES){const html=shoppingGuide(s,st.id,{E,esc});assert.ok(html.includes('Exit '+esc(st.name)));if(E.isServiceStore(st)){assert.ok(html.includes('Enjoy or refund'));assert.ok(!html.includes('Choose your size'));}else if(!st.count&&st.businessKind==='food'){assert.ok(html.includes('original Mallside game meal'));assert.ok(html.includes('dining-open'));}else if(!st.count){assert.ok(html.includes('collection is still being researched'));assert.ok(!html.includes('Choose your size'));}else if(!st.products.some(E.canTry)){assert.ok(html.includes('Explore a demo'));}}
});
test('service refunds require the original mall and preserve the booking until the player returns',()=>{
 const st=E.STORES.find(E.isServiceStore),s=E.createState();s.sandbox=true;s.mallId=st.mallId;const b=E.bookStoreService(s,st.id,E.serviceMenu(st)[0].id);s.mallId=E.MALLS.find(m=>m.id!==st.mallId).id;const before=structuredClone(s);assert.throws(()=>E.refundStoreService(s,b.id,st.id),/original branch/);assert.deepEqual(s,before);s.mallId=st.mallId;E.refundStoreService(s,b.id,st.id);assert.equal(b.refunded,true);
});
test('nonwearable and child collections route to product browsing instead of an empty fitting studio',()=>{
 for(const st of E.STORES.filter(st=>st.count&&!st.products.some(E.canTry))){const w={inside:st.id,layout:{services:{fitting:{x:4,y:5}}},navigate(point,action){this.action=action;}};assert.equal(MallWorld3D.prototype.goToShopService.call(w,'fitting'),true);assert.deepEqual(w.action,{interaction:'rack:'+st.id});}
});
