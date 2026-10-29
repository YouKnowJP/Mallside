import {COMPANION_ACTIVITIES,COMPANION_CALLBACKS} from './companion-content.js?v=30.0.0';

export function createCompanionLife(ctx){
 const definition=id=>COMPANION_ACTIVITIES.find(v=>v.id===id);
 const story=(s,id)=>s.localStories.find(v=>v.id===id&&v.stage===ctx.chapters);
 const last=(s,id)=>s.companionMemories.slice().reverse().find(v=>v.person===id);
 const completedToday=s=>s.companionMemories.some(v=>v.day===s.day);
 function status(s,id){
  const local=ctx.locals.find(v=>v.id===id);if(!local)return null;
  const r=story(s,id),previous=last(s,id),active=s.companionVisit?.person===id?s.companionVisit:null;
  const choices=COMPANION_ACTIVITIES.filter(v=>v.person===id),activity=active?definition(active.activity):choices.find(v=>v.id!==previous?.activity)||choices[0];
  return {id,person:local.name,unlocked:!!r,waiting:!!r&&s.day<=r.history.at(-1).day,doneToday:completedToday(s),busy:!!s.companionVisit&&!active,active,activity,previous,callback:r?COMPANION_CALLBACKS[id][r.choice]:'',ready:!!active&&active.answers.length===activity.steps.length};
 }
 function start(s,id){
  const v=status(s,id);if(!v?.unlocked)throw Error('Share all five local story chapters first.');
  if(v.waiting)throw Error('Come back tomorrow for a shared afternoon.');
  if(v.doneToday)throw Error('You saved a shared afternoon today. Another invitation waits tomorrow.');
  if(s.companionVisit)throw Error('Continue or leave your current shared activity first.');
  ctx.canAct(s,v.activity.minutes,0,{care:true});
  s.companionVisit={person:id,activity:v.activity.id,startedDay:s.day,mallId:s.mallId,answers:[]};return status(s,id);
 }
 function current(s){
  const r=s.companionVisit;if(!r)throw Error('Choose a shared activity first.');
  if(r.mallId!==s.mallId)throw Error('Return to '+ctx.mallById(r.mallId).name+' to continue this afternoon.');
  return r;
 }
 function answer(s,index,id){
  const r=current(s),a=definition(r.activity),step=a.steps[index];
  if(!Number.isInteger(index)||index!==r.answers.length||!step?.options.some(v=>v.id===id))throw Error('Choose an answer for the current question.');
  r.answers.push(id);return status(s,r.person);
 }
 function finish(s){
  const r=current(s),v=status(s,r.person);if(!v.ready)throw Error('Share both choices before finishing this activity.');
  if(v.doneToday)throw Error('You saved a shared afternoon today. Another invitation waits tomorrow.');
  // No mutation until every cost and daily limit has been checked.
  ctx.canAct(s,v.activity.minutes,0,{care:true});ctx.advance(s,v.activity.minutes);
  const memory={person:r.person,activity:r.activity,day:s.day,mallId:r.mallId,answers:[...r.answers]};
  s.companionMemories.push(memory);s.companionMemories=s.companionMemories.slice(-30);s.companionVisit=null;
  s.energy=Math.min(100,s.energy+6);ctx.bond(s,r.person);ctx.addXP(s,20);return {...memory,title:v.activity.title,xp:20,minutes:v.activity.minutes};
 }
 function normalize(s){
  const validAnswers=(a,answers,complete)=>Array.isArray(answers)&&answers.length<=(a?.steps.length||0)&&(!complete||answers.length===a.steps.length)&&answers.every((id,i)=>a.steps[i].options.some(v=>v.id===id));
  const valid=(r,active=false)=>{const a=definition(r?.activity),arc=r&&story(s,r.person),day=active?r?.startedDay:r?.day;return !!a&&a.person===r.person&&!!arc&&Number.isSafeInteger(day)&&day>arc.history.at(-1).day&&day<=s.day&&!!ctx.mallById(r.mallId)&&validAnswers(a,r.answers,!active);};
  const days=new Set();s.companionMemories=(Array.isArray(s.companionMemories)?s.companionMemories:[]).filter(r=>valid(r)).sort((a,b)=>a.day-b.day).filter(r=>{if(days.has(r.day))return false;days.add(r.day);return true;}).slice(-30).map(({person,activity,day,mallId,answers})=>({person,activity,day,mallId,answers:[...answers]}));
  const r=s.companionVisit;s.companionVisit=valid(r,true)&&!completedToday(s)?{person:r.person,activity:r.activity,startedDay:r.startedDay,mallId:r.mallId,answers:[...r.answers]}:null;
 }
 return {all:s=>ctx.locals.map(v=>status(s,v.id)),status,start,answer,finish,cancel:s=>{s.companionVisit=null;},normalize};
}
