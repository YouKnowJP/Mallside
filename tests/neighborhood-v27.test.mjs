import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import * as T from '../dist/vendor/three.module.js';
import {communityNoticeHTML,lostPropertyHTML,homeRoutineHTML} from '../dist/neighborhood-ui.js';
import {homeWalkRoute,HOME_STOPS} from '../dist/home-scene.js';
import {CharacterStudio} from '../dist/character-studio.js';
import {stoneDetailTexture} from '../dist/mall-environment.js';
const ctx={E,esc:v=>String(v).replaceAll('<','&lt;')};
const fresh=()=>E.createState();
function untouched(s,fn,pattern){const before=structuredClone(s);assert.throws(fn,pattern);assert.deepEqual(s,before);}

test('lost-property puzzle rotates without inventing owned products; wrong claims are atomic',()=>{
 const seen=new Set();for(let day=1;day<=6;day++){const s=fresh();s.day=day;const c=E.lostPropertyCase(day);seen.add(c.id);assert.equal(c.options.length,3);const wrong=c.options.find(v=>v.id!==c.id);untouched(s,()=>E.helpLostProperty(s,wrong.id),/match/);const cash=s.cash;E.helpLostProperty(s,c.id);assert.equal(s.cash,cash);assert.equal(s.purchases.length,0);assert.equal(s.minutes,E.OPEN+6);assert.equal(s.xp,15);untouched(s,()=>E.helpLostProperty(s,c.id),/today/);}assert.equal(seen.size,3);
});
test('daily notice, claim and home rewards cannot be replayed by travel or reload; morning opens new actions',()=>{
 let s=fresh();E.readCommunityNotice(s,'welcome');E.helpLostProperty(s,E.lostPropertyCase(s.day).id);s.energy=40;E.unwindAtHome(s);assert.ok(s.energy>40&&s.energy<=52);assert.equal(s.neighborhoodDays.length,3);s=E.validateImport(JSON.stringify(s));s.mallId='southcoast';
 for(const fn of [()=>E.readCommunityNotice(s,'garden'),()=>E.helpLostProperty(s,E.lostPropertyCase(s.day).id),()=>E.unwindAtHome(s)])untouched(s,fn,/today/);
 E.nextDay(s);E.readCommunityNotice(s,'garden');E.helpLostProperty(s,E.lostPropertyCase(s.day).id);E.unwindAtHome(s);assert.equal(s.neighborhoodDays.length,6);
});
test('new actions respect closing time and reject invalid input before changing state',()=>{
 for(const [minutes,fn]of [[2,s=>E.readCommunityNotice(s,'garden')],[5,s=>E.helpLostProperty(s,E.lostPropertyCase(s.day).id)],[7,s=>E.unwindAtHome(s)]]){const s=fresh();s.minutes=E.CLOSE-minutes;untouched(s,()=>fn(s),/time/);}
 const s=fresh();untouched(s,()=>E.readCommunityNotice(s,'__proto__'));untouched(s,()=>E.helpLostProperty(s,'missing'));untouched(s,()=>E.moveDisplay(s,'missing',1));
});
test('malformed optional records normalize independently of wallet, receipts, choices and completed chapter rewards',()=>{
 const s=fresh();s.neighborhoodDays=[null,{day:1,mallId:'orange',kind:'notice',choice:'garden',extra:'discard'},{day:1,mallId:'orange',kind:'notice',choice:'welcome'},{day:2,mallId:'orange',kind:'property',choice:'scarf'},{day:1,mallId:'orange',kind:'property',choice:'scarf'},{day:1,mallId:'missing',kind:'unwind',choice:'quiet'}];
 for(const d of E.LOCAL_STORIES)s.localStories.push({id:d.id,choice:d.choices[0].id,stage:3,readyDay:2,history:[0,1,2].map(stage=>({stage,day:1,mallId:'orange'}))});
 const restored=E.validateImport(JSON.stringify(s));assert.equal(restored.cash,s.cash);assert.equal(restored.neighborhoodDays.length,1);assert.deepEqual(Object.keys(restored.neighborhoodDays[0]).sort(),['choice','day','kind','mallId']);for(const d of E.LOCAL_STORIES){const v=E.localStory(restored,d.id);assert.equal(v.stage,3);assert.equal(v.record.history.length,3);assert.ok(v.waiting);untouched(restored,()=>E.claimLocalChapter(restored,d.id));}
 E.nextDay(restored);E.beginLocalStory(restored,'maya','style');assert.equal(E.localStory(restored,'maya').record.choice,'useful');assert.equal(E.localStory(restored,'maya').stage,3);
 const old=fresh();delete old.neighborhoodDays;assert.deepEqual(E.validateImport(JSON.stringify(old)).neighborhoodDays,[]);
});
test('shelf order moves only existing displayed ownership and persists with no duplication or charge',()=>{
 const s=fresh();s.cash=1000000;for(const p of E.PRODUCTS.filter(p=>E.storeById(p.store).tier===0&&E.canTry(p)).slice(0,2)){E.checkout(s,p.store,[{id:p.id,size:E.idealSize(s,p)}]);E.openAndDisplay(s,s.purchases.at(-1).id);}
 assert.equal(s.displayItems.length,2);const before=[...s.displayItems],cash=s.cash,count=s.purchases.length;E.moveDisplay(s,before[0],1);assert.deepEqual(s.displayItems,before.toReversed());assert.equal(s.cash,cash);assert.equal(s.purchases.length,count);assert.deepEqual(E.validateImport(JSON.stringify(s)).displayItems,s.displayItems);untouched(s,()=>E.moveDisplay(s,before[0],1));untouched(s,()=>E.moveDisplay(s,before[0],-2));
});
test('concierge and home controls expose fixed costs, success and disabled daily actions',()=>{
 const s=fresh();assert.match(communityNoticeHTML(s,ctx),/3 game minutes/);assert.match(lostPropertyHTML(s,ctx),/wrong match costs nothing/);assert.match(homeRoutineHTML(s),/8 game minutes/);E.readCommunityNotice(s,'garden');E.helpLostProperty(s,E.lostPropertyCase(s.day).id);E.unwindAtHome(s);assert.match(communityNoticeHTML(s,ctx),/Kept in your daybook/);assert.doesNotMatch(lostPropertyHTML(s,ctx),/data-action="property-match"/);assert.match(homeRoutineHTML(s),/disabled/);
});
test('all home stops walk through the open rug and arrive without frame-rate overshoot',()=>{
 const previous=globalThis.document;globalThis.document={querySelector:()=>null};try{for(const [id,stop]of Object.entries(HOME_STOPS)){const w={setting:'home',state:fresh(),player:new T.Group(),homeDistance:0,rotation:0};w.player.position.set(-28,0,8);CharacterStudio.prototype.walkHomeTo.call(w,id);for(let i=0;i<500&&w.homePath.length;i++)CharacterStudio.prototype.stepHome.call(w,.04);assert.equal(w.homePath.length,0);assert.ok(Math.abs(w.player.position.x-stop.x)<.001);assert.ok(Math.abs(w.player.position.z-stop.z)<.001);assert.ok(Number.isFinite(w.homeDistance));for(const p of homeWalkRoute(id))assert.ok(p.x>=-48&&p.x<=34&&p.z>=-27&&p.z<=48);}
 const reduced={setting:'home',state:fresh(),player:new T.Group()};reduced.state.preferences.reducedMotion=true;CharacterStudio.prototype.walkHomeTo.call(reduced,'door');assert.deepEqual(reduced.homePath,[]);assert.equal(reduced.player.position.z,48);assert.deepEqual(homeWalkRoute('missing'),[]);
 }finally{globalThis.document=previous;}
});
test('stone detail stays deterministic, bounded and locally owned at every destination scale',()=>{
 const a=stoneDetailTexture(1200,900),b=stoneDetailTexture(1200,900);assert.deepEqual(a.image.data,b.image.data);assert.equal(a.image.data.length,64*64*4);assert.equal(a.colorSpace,T.NoColorSpace);assert.equal(a.wrapS,T.RepeatWrapping);for(let i=0;i<a.image.data.length;i+=4){assert.ok(a.image.data[i]>=220&&a.image.data[i]<=250);assert.equal(a.image.data[i+3],255);}a.dispose();b.dispose();
});
