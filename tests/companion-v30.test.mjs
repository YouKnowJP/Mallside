import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import {companionBoard,companionCard,companionSession,companionMemory} from '../dist/companion-ui.js';

const ctx={E,esc:v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')};
function completed(choiceIndex=0){
 const s=E.createState();s.day=6;s.sandbox=true;
 s.localStories=E.LOCAL_STORIES.map(d=>({id:d.id,choice:d.choices[choiceIndex].id,stage:5,active:false,readyDay:6,history:Array.from({length:5},(_,stage)=>({stage,day:stage+1,mallId:'orange'}))}));
 return E.validateImport(JSON.stringify(s));
}
function answers(s,variant=0){const a=E.companionInvitation(s,s.companionVisit.person).activity;for(let i=s.companionVisit.answers.length;i<a.steps.length;i++)E.answerCompanionVisit(s,i,a.steps[i].options[variant].id);}
function untouched(s,fn,pattern){const before=structuredClone(s);assert.throws(fn,pattern);assert.deepEqual(s,before);}

test('five completed chapters unlock next-day invitations and retain all ten original story choices',()=>{
 const fresh=E.createState();untouched(fresh,()=>E.beginCompanionVisit(fresh,'maya'),/five/);
 const lines=new Set();for(let choice=0;choice<2;choice++){const s=completed(choice);for(const d of E.LOCAL_STORIES){const v=E.companionInvitation(s,d.id);assert.ok(v.unlocked&&!v.waiting);assert.equal(v.person,d.person);lines.add(v.callback);assert.equal(E.localStory(s,d.id).stage,5);}}
 assert.equal(lines.size,10);
 const s=completed();s.day=5;untouched(s,()=>E.beginCompanionVisit(s,'maya'),/tomorrow/);E.nextDay(s);E.beginCompanionVisit(s,'maya');
});

test('all ten shared activities accept every answer path and finish with exact atomic costs',()=>{
 const used=new Set();for(const d of E.LOCAL_STORIES)for(let variant=0;variant<3;variant++){
  let s=completed();for(let visit=0;visit<2;visit++){
   const chapterHistory=structuredClone(s.localStories);E.beginCompanionVisit(s,d.id);const a=E.companionInvitation(s,d.id).activity;used.add(a.id);
   assert.equal(s.minutes,E.OPEN);answers(s,variant);const cash=s.cash,xp=s.xp,bond=s.friendships[d.id]||0;s.energy=50;
   const result=E.finishCompanionVisit(s);assert.equal(s.minutes,E.OPEN+a.minutes);assert.equal(s.cash,cash);assert.equal(s.xp,xp+20);assert.equal(s.friendships[d.id],bond+1);assert.ok(s.energy>50&&s.energy<=56);assert.equal(result.title,a.title);assert.equal(s.companionVisit,null);assert.deepEqual(s.localStories,chapterHistory);assert.deepEqual(s.companionMemories.at(-1).answers,a.steps.map(p=>p.options[variant].id));assert.equal(s.purchases.length,0);
   s=E.parseSave(JSON.stringify(s));E.nextDay(s);
  }
 }assert.equal(used.size,10);
});

test('only one shared memory across all friends and malls can reward per day, including after reload',()=>{
 let s=completed();E.beginCompanionVisit(s,'eli');answers(s);E.finishCompanionVisit(s);s=E.parseSave(JSON.stringify(s));s.mallId='southcoast';
 for(const n of E.LOCALS)untouched(s,()=>E.beginCompanionVisit(s,n.id),/today/);
 untouched(s,()=>E.finishCompanionVisit(s),/Choose/);E.nextDay(s);E.beginCompanionVisit(s,'jules');answers(s);E.finishCompanionVisit(s);assert.equal(s.companionMemories.length,2);
});

test('partial choices survive sleep, save import and travel without time, money or progress loss',()=>{
 let s=completed();E.beginCompanionVisit(s,'noor');E.answerCompanionVisit(s,0,'bright');const activity=s.companionVisit.activity;
 const xp=s.xp,cash=s.cash;assert.equal(s.minutes,E.OPEN);untouched(s,()=>E.beginCompanionVisit(s,'sam'),/current/);
 E.nextDay(s);s=E.validateImport(JSON.stringify(s));assert.equal(s.companionVisit.activity,activity);assert.deepEqual(s.companionVisit.answers,['bright']);assert.equal(s.xp,xp);assert.ok(s.cash>cash);
 s.mallId='southcoast';untouched(s,()=>E.answerCompanionVisit(s,1,'shelf'),/Return/);untouched(s,()=>E.finishCompanionVisit(s),/Return/);s.mallId='orange';answers(s);E.finishCompanionVisit(s);assert.equal(s.companionMemories[0].day,7);
});

test('stale, invalid and incomplete answers cannot change progression; cancel permits a fresh choice',()=>{
 const s=completed();for(const id of ['__proto__','missing',null])untouched(s,()=>E.beginCompanionVisit(s,id));E.beginCompanionVisit(s,'maya');
 for(const fn of [()=>E.answerCompanionVisit(s,1,'leaf'),()=>E.answerCompanionVisit(s,0,'missing'),()=>E.answerCompanionVisit(s,'0','use'),()=>E.answerCompanionVisit(s,-1,'use'),()=>E.finishCompanionVisit(s)])untouched(s,fn);
 E.answerCompanionVisit(s,0,'use');untouched(s,()=>E.answerCompanionVisit(s,0,'care'));const cash=s.cash,xp=s.xp,minutes=s.minutes;E.cancelCompanionVisit(s);assert.equal(s.cash,cash);assert.equal(s.xp,xp);assert.equal(s.minutes,minutes);assert.equal(s.companionMemories.length,0);E.beginCompanionVisit(s,'sam');assert.deepEqual(s.companionVisit.answers,[]);
});

test('closing-time validation preserves finished choices for tomorrow and cannot replay a completion',()=>{
 const s=completed();s.minutes=E.CLOSE-9;untouched(s,()=>E.beginCompanionVisit(s,'maya'),/time/);s.minutes=E.OPEN;E.beginCompanionVisit(s,'maya');answers(s);s.minutes=E.CLOSE-9;untouched(s,()=>E.finishCompanionVisit(s),/time/);E.nextDay(s);E.finishCompanionVisit(s);untouched(s,()=>E.finishCompanionVisit(s));
});

test('normalization rejects damaged optional records without resetting wallet, old chapters or rewards',()=>{
 const s=completed();E.beginCompanionVisit(s,'maya');answers(s);E.finishCompanionVisit(s);const valid=structuredClone(s.companionMemories[0]);
 s.companionMemories=[null,{...valid,day:99},{...valid,day:1},{...valid,person:'__proto__'},{...valid,answers:['use','bad']},{...valid,activity:'eli-sound'},valid,{...valid,answers:['care','line'],extra:'discard'}];s.companionVisit={person:'eli',activity:'eli-sound',startedDay:6,mallId:'orange',answers:[]};
 let copy=E.parseSave(JSON.stringify(s));assert.deepEqual(copy.companionMemories,[valid]);assert.equal(copy.companionVisit,null);assert.equal(copy.cash,s.cash);assert.equal(copy.xp,s.xp);assert.deepEqual(copy.localStories,s.localStories);
 E.nextDay(copy);copy.companionVisit={person:'sam',activity:'sam-bench',startedDay:7,mallId:'orange',answers:['faces','same','extra']};copy=E.validateImport(JSON.stringify(copy));assert.equal(copy.companionVisit,null);
 const old=E.createState();delete old.companionMemories;delete old.companionVisit;for(const version of [2,3,4,5,6]){old.version=version;const restored=E.loadState(JSON.stringify(old));assert.deepEqual(restored.companionMemories,[]);assert.equal(restored.companionVisit,null);assert.equal(restored.version,6);}
});

test('memory retention stays bounded, alternates a friend’s activities and recalls their last choices',()=>{
 let s=completed();for(let i=0;i<36;i++){E.beginCompanionVisit(s,'sam');assert.equal(s.companionVisit.activity,i%2?'sam-bench':'sam-route');answers(s,i%3);E.finishCompanionVisit(s);s=E.validateImport(JSON.stringify(s));if(i<35)E.nextDay(s);}
 assert.equal(s.companionMemories.length,30);assert.equal(s.companionMemories[0].day,12);assert.equal(E.companionInvitation(s,'sam').previous.day,41);assert.match(companionCard(s,'sam',ctx),/Last time, Day 41/);untouched(s,()=>E.beginCompanionVisit(s,'eli'),/today/);
});

test('shared visits respect the existing daily bond limit and level-up rules',()=>{
 const s=completed();E.meetLocal(s,'maya');const bond=s.friendships.maya;E.beginCompanionVisit(s,'maya');answers(s);E.finishCompanionVisit(s);assert.equal(s.friendships.maya,bond);
 const career=completed();career.sandbox=false;career.xp=E.LEVELS[1].xp-10;const cash=career.cash;E.beginCompanionVisit(career,'maya');answers(career);E.finishCompanionVisit(career);assert.equal(career.cash,cash+E.LEVELS[1].bonus*100);
});

test('UI exposes saved choices, return mall, cost and daily cap, with escaped player text',()=>{
 const s=completed();assert.match(companionBoard(s,ctx),/An afternoon with a familiar face/);E.beginCompanionVisit(s,'jules');s.playerName='<script>';
 assert.match(companionSession(s,ctx),/0 \/ 2 choices saved/);assert.ok(!companionSession(s,ctx).includes('<script>'));E.answerCompanionVisit(s,0,'seat');assert.match(companionSession(s,ctx),/little bench/);assert.match(companionCard(s,'jules',ctx),/One shared memory per day/);
 s.mallId='southcoast';assert.match(companionCard(s,'jules',ctx),/Return to The Outlets at Orange/);s.mallId='orange';answers(s);assert.match(companionSession(s,ctx),/Keep this memory · 12 min/);E.finishCompanionVisit(s);assert.match(companionMemory(s,s.companionMemories[0],ctx),/already been collected/);assert.match(companionBoard(s,ctx),/Read memory · Day 6/);
});
