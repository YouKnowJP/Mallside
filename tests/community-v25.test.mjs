import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import {headingFor,turnToward,yieldToPlayer} from '../dist/motion.js';
import {daylightAt,adultAppearance} from '../dist/mall-atmosphere.js';
import * as T from '../dist/vendor/three.module.js';
import {MallWorld3D} from '../dist/world-3d.js';
import {applyCharacterPose} from '../dist/character-rig.js';
import {stowHandhelds} from '../dist/merchandise-carry.js';
import {personStop,walkable,clearWalk} from '../dist/free-navigation.js';
import {spatialLayout} from '../dist/spatial-layout.js';
import {localChapterCard,communityBoard,wrappingDesk} from '../dist/community-ui.js';

const fresh=()=>{const s=E.createState();s.cash=200000;return s;};
const localProducts=s=>E.PRODUCTS.filter(p=>E.storeById(p.store).mallId===s.mallId&&E.storeById(p.store).tier<=E.levelOf(s));
const buy=(s,p,size=E.idealSize(s,p))=>{E.checkout(s,p.store,[{id:p.id,size}]);return s.purchases.at(-1);};
const giftProduct=(s,style=false)=>E.PRODUCTS.find(p=>E.storeById(p.store).tier<=E.levelOf(s)&&!['food','drink'].includes(p.type)&&E.canTry(p)===style&&p.audience!=='child'&&E.price(s,p)+Math.round(E.price(s,p)*E.TAX)<=15000&&!p.finalSale);
function experience(s,id){const spec=E.experienceSpec(s,id),choices={bridge:{details:spec.garden},artwalk:{order:spec.art},flowers:{stems:spec.flower.recipe},tea:{base:spec.tea.base,temperature:spec.tea.temperature,minutes:spec.tea.minutes},cinema:{film:spec.film.id,seat:2,scenes:[0,1,2]},carousel:{horse:2}};E.completeExperience(s,id,choices[id]);}
function keptLook(s){
 if(Object.keys(s.equipment).length>=2)return;
 const slots=new Set();for(const p of localProducts(s)){const slot=E.slotForProduct(p);if(!E.canTry(p)||!E.SLOT_NAMES[slot]||slots.has(slot))continue;const item=buy(s,p);E.wear(s,item.id);slots.add(slot);if(slots.size===2)break;}
}
function finishTasks(s,id){let gift=null;for(const t of E.localStory(s,id).tasks){
 if(t.type==='inspect'){const seen=new Set();for(const p of localProducts(s)){const key=E.modelKey(p);if(seen.has(key))continue;E.inspect(s,p.id);seen.add(key);if(seen.size===t.target)break;}}
 else if(t.type==='visit')for(const st of E.STORES.filter(st=>st.mallId===s.mallId&&st.tier<=E.levelOf(s)).slice(0,t.target))E.visit(s,st.id);
 else if(t.type==='talk')E.chatTopic(s,id,E.LOCAL_TOPICS[id][0].id);
 else if(t.type==='rest')E.rest(s);
 else if(t.type==='photo')E.takePhoto(s);
 else if(t.type==='amenity'){if(t.values[0]==='guestbook')E.signGuestbook(s,'curious','people');else if(t.values[0]==='notice')E.readCommunityNotice(s,'garden');else if(t.values[0]==='property')E.helpLostProperty(s,E.lostPropertyCase(s.day).id);else E.useAmenity(s,t.values[0]);}
 else if(t.type==='look'){keptLook(s);E.saveLook(s,'Tomorrow, together');}
 else if(t.type==='plan'){keptLook(s);E.prepareTomorrow(s);}
 else if(t.type==='display'){keptLook(s);E.pinDisplay(s,Object.values(s.equipment)[0]);}
 else if(t.type==='home')E.unwindAtHome(s);
 else if(t.type==='arrange'){keptLook(s);for(const id of Object.values(s.equipment).slice(0,2))E.pinDisplay(s,id);E.moveDisplay(s,s.displayItems[0],1);}
 else if(t.type==='activity')experience(s,t.values[0]);
 else if(t.type==='gift'){const p=giftProduct(s,E.localStory(s,id).record.choice==='style');E.inspect(s,p.id);gift=buy(s,p);E.wrapGift(s,gift.id,'rose');}
 }return gift;}

test('all ten story paths finish five chapters through ordinary actions across five mornings',()=>{
 for(const definition of E.LOCAL_STORIES)for(const choice of definition.choices){let s=fresh();for(let stage=0;stage<E.LOCAL_STORY_CHAPTERS;stage++){
  E.beginLocalStory(s,definition.id,stage===0?choice.id:undefined);assert.equal(E.localStory(s,definition.id).stage,stage);
  const gift=finishTasks(s,definition.id),v=E.localStory(s,definition.id);assert.ok(v.ready,definition.id+' '+choice.id+' '+stage);
  const before=s.cash,level=E.levelOf(s),result=E.claimLocalChapter(s,definition.id,gift?.id),bonus=E.LEVELS.slice(level+1,E.levelOf(s)+1).reduce((n,l)=>n+l.bonus*100,0);assert.equal(s.cash,before+result.cash+result.reimbursement+bonus);assert.throws(()=>E.claimLocalChapter(s,definition.id,gift?.id));
  if(gift){assert.equal(gift.deliveredTo,'Maya');assert.equal(E.returnEligibility(s,gift).ok,false);assert.equal(E.owned(s).some(i=>i.id===gift.id),false);assert.equal(result.reimbursement,gift.total+200);}
  if(stage<E.LOCAL_STORY_CHAPTERS-1){assert.ok(E.localStory(s,definition.id).waiting);assert.throws(()=>E.beginLocalStory(s,definition.id));E.nextDay(s);s=E.validateImport(JSON.stringify(s));assert.equal(E.localStory(s,definition.id).stage,stage+1);}
 }assert.ok(E.localStory(s,definition.id).complete);assert.equal(s.localStories[0].history.length,E.LOCAL_STORY_CHAPTERS);assert.throws(()=>E.beginLocalStory(s,definition.id,choice.id));}
});

test('a chapter counts new distinct models, preserves partial steps overnight and keeps location evidence local',()=>{
 let s=fresh();const ps=localProducts(s);E.inspect(s,ps[0].id);E.beginLocalStory(s,'maya','useful');assert.equal(E.localStory(s,'maya').tasks[0].count,0);
 E.inspect(s,ps[0].id);E.inspect(s,ps[0].id);assert.equal(E.localStory(s,'maya').tasks[0].count,1);
 const other=E.PRODUCTS.find(p=>E.storeById(p.store).mallId!=='orange');s.mallId=E.storeById(other.store).mallId;E.inspect(s,other.id);assert.equal(E.localStory(s,'maya').tasks[0].count,1);s.mallId='orange';
 E.nextDay(s);s=E.loadState(JSON.stringify(s));const different=ps.find(p=>E.modelKey(p)!==E.modelKey(ps[0]));E.inspect(s,different.id);E.meetLocal(s,'maya');assert.ok(E.localStory(s,'maya').ready);
});

test('story choices change later missions, remain saved and do not allow restarting for another payout',()=>{
 for(const [id,a,b]of [['eli','quiet','play'],['sam','practical','slow']]){const one=fresh(),two=fresh();E.beginLocalStory(one,id,a);E.beginLocalStory(two,id,b);if(id==='eli')assert.notDeepEqual(E.localStory(one,id).tasks.map(v=>v.id),E.localStory(two,id).tasks.map(v=>v.id));finishTasks(one,id);E.claimLocalChapter(one,id);const cash=one.cash;assert.throws(()=>E.beginLocalStory(one,id,b));assert.equal(one.cash,cash);E.nextDay(one);E.beginLocalStory(one,id,b);assert.equal(E.localStory(one,id).record.choice,a);}
});

test('tracking a local chapter and a daily outing is mutually exclusive and care stays first',()=>{
 const s=fresh();E.acceptOuting(s,'window');E.beginLocalStory(s,'sam','practical');assert.equal(s.outingFocus,false);assert.equal(E.nextShoppingAction(s).chapter,'LOCAL');E.focusOuting(s,true);assert.equal(s.communityFocus,null);E.trackLocalStory(s,'sam');s.energy=5;assert.equal(E.nextShoppingAction(s).id,'rest');s.energy=100;s.minutes=1195;assert.equal(E.nextShoppingAction(s).kind,'sleep');
});

test('wrapping uses a real unused receipt, keeps tags, blocks wear/use/return and does not refund its fee',()=>{
 let s=fresh();const p=giftProduct(s,true),i=buy(s,p),cash=s.cash;E.wrapGift(s,i.id,'midnight');assert.equal(s.cash,cash-200);assert.equal(i.tags,true);assert.equal(i.worn,false);assert.throws(()=>E.wrapGift(s,i.id,'rose'));assert.throws(()=>E.wear(s,i.id));assert.throws(()=>E.useProduct(s,i.id));assert.throws(()=>E.returnItem(s,i.id,i.store));s=E.validateImport(JSON.stringify(s));assert.equal(s.purchases[0].giftWrap.style,'midnight');E.unwrapGift(s,i.id);assert.ok(E.returnEligibility(s,s.purchases[0]).ok);E.returnItem(s,i.id,i.store);assert.equal(s.cash,200000-200);
});

test('gift delivery requires a new eligible wrapped purchase and cannot consume a used, checked or wrong-sized item',()=>{
 const s=fresh();E.beginLocalStory(s,'maya','style');finishTasks(s,'maya');E.claimLocalChapter(s,'maya');E.nextDay(s);
 const p=giftProduct(s,true),old=buy(s,p);E.inspect(s,p.id);E.wrapGift(s,old.id,'sage');E.beginLocalStory(s,'maya');assert.equal(E.localGiftCandidates(s).length,0);
 const i=buy(s,p);E.wrapGift(s,i.id,'sage');assert.equal(E.localGiftCandidates(s)[0].id,i.id);i.checked=true;assert.equal(E.localGiftCandidates(s).length,0);i.checked=false;i.worn=true;assert.equal(E.localGiftCandidates(s).length,0);i.worn=false;i.size='invalid';assert.equal(E.localGiftCandidates(s).length,0);i.size=E.idealSize(s,p);i.returned=true;assert.equal(E.localGiftCandidates(s).length,0);i.returned=false;
 const cash=s.cash;s.minutes=1199;assert.throws(()=>E.claimLocalChapter(s,'maya',i.id));assert.equal(i.delivered,undefined);assert.equal(s.cash,cash);assert.equal(E.localStory(s,'maya').stage,1);
});

test('invalid gift/amenity operations leave money, time and purchases unchanged; free water has a cooldown',()=>{
 const s=fresh();for(const fn of [()=>E.wrapGift(s,'missing','sage'),()=>E.useAmenity(s,'missing'),()=>E.beginLocalStory(s,'__proto__','useful')]){const before=JSON.stringify(s);assert.throws(fn);assert.equal(JSON.stringify(s),before);}
 s.cash=0;s.energy=40;E.useAmenity(s,'water');assert.equal(s.cash,0);assert.ok(s.energy>40);const before=JSON.stringify(s);assert.throws(()=>E.useAmenity(s,'water'));assert.equal(JSON.stringify(s),before);E.rest(s);E.useAmenity(s,'water');E.nextDay(s);E.useAmenity(s,'water');
});

test('older saves default optional story fields; malformed story fields do not reset the wallet or purchases',()=>{
 const s=fresh(),i=buy(s,giftProduct(s));s.localStories=[null,{id:'__proto__'},{id:'maya',choice:'bad',stage:0,history:[]}];s.communityFocus='missing';s.amenityUses=[null,{id:'water',day:-4,minutes:Infinity}];i.giftWrap={style:'missing',day:1,fee:9000000};const copy=E.validateImport(JSON.stringify(s));assert.equal(copy.cash,s.cash);assert.equal(copy.purchases.length,1);assert.deepEqual(copy.localStories,[]);assert.deepEqual(copy.amenityUses,[]);assert.equal(copy.communityFocus,null);assert.equal(copy.purchases[0].giftWrap,undefined);
});

test('all ten malls can begin the local stories without changing existing catalog identities',()=>{
 for(const mall of E.MALLS){const s=fresh();s.xp=mall.xp;s.mallId=mall.id;for(const d of E.LOCAL_STORIES){E.beginLocalStory(s,d.id,d.choices[0].id);assert.equal(E.localStory(s,d.id).record.mallId,mall.id);}}
});

test('local cards escape names and expose explicit task, wrapping fee and next-day feedback',()=>{
 const s=fresh(),esc=x=>String(x).replaceAll('<','&lt;'),ctx={E,esc,picture:p=>'<img alt="'+p.id+'">'};assert.match(communityBoard(s,ctx),/25 OPTIONAL MISSIONS/);E.beginLocalStory(s,'sam','practical');assert.match(localChapterCard(s,'sam',ctx),/Follow this chapter/);assert.match(localChapterCard(s,'sam',ctx),/0 \/ 1/);assert.match(wrappingDesk(s,ctx,'sage'),/not refundable/);
});

test('continuous heading follows diagonals, stays put at rest and turns the shortest way across wraparound',()=>{
 assert.equal(headingFor(1,1),Math.PI/4);assert.equal(headingFor(-1,-1),-Math.PI*.75);assert.equal(headingFor(0,0,1.7),1.7);const a=Math.PI-.02,b=-Math.PI+.02;const value=turnToward(a,b,1/60);assert.ok(value>a&&value-a<.04);assert.equal(turnToward(0,1,0),0);assert.equal(turnToward(0,1,1/60,true),1);
 let slow=0,fast=0;for(let i=0;i<30;i++)slow=turnToward(slow,1,1/30);for(let i=0;i<60;i++)fast=turnToward(fast,1,1/60);assert.ok(Math.abs(slow-fast)<1e-10);
});

test('daylight stays continuous and finite, dims into evening and preserves readable indoor light',()=>{
 for(const indoor of [false,true])for(let m=580;m<=1220;m+=3){const p=daylightAt(m,indoor);for(const a of [...p.sky,...p.sun,p.sunPower,p.ambient,p.window,p.elevation])assert.ok(Number.isFinite(a)&&a>=0);assert.deepEqual(daylightAt(m,indoor),p);}
 assert.deepEqual(daylightAt(NaN),daylightAt(600));assert.deepEqual(daylightAt(1300),daylightAt(1200));assert.ok(daylightAt(1200).sunPower<daylightAt(600).sunPower);assert.ok(daylightAt(1200).window>daylightAt(600).window);assert.ok(daylightAt(1200,true).ambient>1);for(const minute of [840,1050])assert.ok(Math.abs(daylightAt(minute-.001).sunPower-daylightAt(minute+.001).sunPower)<1e-5);
 const skins=new Set(Array.from({length:6},(_,i)=>adultAppearance(i).skin));assert.equal(skins.size,6);const p=adultAppearance(0);p.skin='broken';assert.notEqual(adultAppearance(0).skin,'broken');
});

test('new attention and wrapping poses keep anatomy finite and restore the neutral head under reduced motion',()=>{
 const w={scene:new T.Scene(),resources:new Set(),state:E.createState()};for(const n of ['mat','mesh','box','ball','cyl'])w[n]=MallWorld3D.prototype[n];const g=MallWorld3D.prototype.person.call(w,'#7e938a');const lengths=g.userData.limbs.map(l=>l.userData.upperLength);
 applyCharacterPose(g,{kind:'wrap',attention:20,time:2});assert.ok(Math.abs(g.userData.rig.headGroup.rotation.y)<.34);for(const l of g.userData.limbs)assert.ok(Number.isFinite(l.rotation.x));assert.deepEqual(g.userData.limbs.map(l=>l.userData.upperLength),lengths);applyCharacterPose(g,{reducedMotion:true,attention:2,time:4});assert.equal(g.userData.rig.headGroup.rotation.y,0);assert.equal(g.userData.rig.headGroup.rotation.x,0);for(const r of w.resources)r.dispose?.();
});

test('water animation stays at the station with no seated blend or remote café destination',()=>{
 const w={scene:new T.Scene(),resources:new Set(),state:E.createState(),avatar:{x:222,y:333},layout:{venues:[]}};for(const n of ['mat','mesh','box','ball','cyl'])w[n]=MallWorld3D.prototype[n];w.player=MallWorld3D.prototype.person.call(w,'#7e938a');w.action={kind:'drink',previewProduct:{water:true},startTime:performance.now()-1000};MallWorld3D.prototype.animatePose.call(w);assert.deepEqual(w.action.seat,w.avatar);assert.equal(w.action.seatBlend,0);assert.equal(w.player.position.x,222);assert.equal(w.player.position.z,333);assert.ok(w.prop.children.length>0);for(const r of w.resources)r.dispose?.();
});


test('two-hand wrapping frees both grips and restores each handheld exactly once',()=>{
 const a=new T.Group(),b=new T.Group(),g=new T.Group();b.visible=false;g.userData.gravityAttachments=[{holder:a},{holder:b}];const restore=stowHandhelds(g);assert.equal(a.visible,false);assert.equal(b.visible,false);restore();assert.equal(a.visible,true);assert.equal(b.visible,false);a.visible=false;restore();assert.equal(a.visible,false);
});

test('finishing wrapping restores hands and releases only the transient parcel resources',()=>{
 const player=new T.Group();player.userData.limbs=Array.from({length:4},()=>new T.Group());const prop=new T.Group(),geometry=new T.BoxGeometry(1,1,1),material=new T.MeshStandardMaterial(),body=new T.BoxGeometry(2,2,2);prop.add(new T.Mesh(geometry,material));player.add(prop);let disposed=0,restored=0,done=0;geometry.addEventListener('dispose',()=>disposed++);material.addEventListener('dispose',()=>disposed++);body.addEventListener('dispose',()=>assert.fail('body resource was disposed'));const w={player,prop,resources:new Set([geometry,material,body]),action:{kind:'wrap',restoreHands:()=>restored++,done:()=>done++},canvas:{dataset:{animation:'wrap'}}};MallWorld3D.prototype.finishAnimation.call(w);MallWorld3D.prototype.finishAnimation.call(w);assert.equal(disposed,2);assert.equal(restored,1);assert.equal(done,1);assert.deepEqual([...w.resources],[body]);
});


test('conversation routes stop beside people on walkable floor at every destination',()=>{
 for(const mall of E.MALLS){const l=spatialLayout(mall,0,E.STORES);for(const n of l.locals){const p=personStop(n,l.spawn,l.nav);assert.ok(walkable(p,l.nav));assert.ok(Math.hypot(p.x-n.x,p.y-n.y)>=31.9,mall.id+' body overlap');assert.ok(clearWalk(n,p,l.nav));}}
});
test('ambient shoppers yield before entering the player space and can walk back out of it',()=>{
 const player={x:0,y:0};assert.deepEqual(yieldToPlayer({x:30,y:0},{x:20,y:0},player),{x:30,y:0});assert.deepEqual(yieldToPlayer({x:10,y:0},{x:15,y:0},player),{x:15,y:0});assert.deepEqual(yieldToPlayer({x:30,y:0},{x:26,y:1},player),{x:26,y:1});
});
