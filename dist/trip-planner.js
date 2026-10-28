// Daily game briefs reference existing real catalog models. They create no stock
// and never infer a retailer/brand relationship or a real retail price.
export function createOutingPlanner(ctx){
 const templates={
  find:{id:'find',title:'One good find',emoji:'🛍',description:'Read the label, find your fit and bring home one considered purchase.',xp:40,cash:1000},
  style:{id:'style',title:'An outfit, together',emoji:'👕',description:'Try a top and pair it with a bag or accessory. Keep both within your allowance.',xp:70,cash:2000},
  gift:{id:'gift',title:'The little gift hunt',emoji:'🎁',description:'Check a real model carefully and keep a new find to bring home.',xp:45,cash:1200},
  window:{id:'window',title:'A window-shopping afternoon',emoji:'🌿',description:'Discover three real models, then take a free bench break. No purchase needed.',xp:30,cash:0}
 };
 const template=id=>Object.prototype.hasOwnProperty.call(templates,id)?templates[id]:null;
 const activeProducts=new Set(ctx.products.map(p=>p.id));
 const storesByMall=new Map(ctx.malls.map(m=>[m.id,new Set(m.sections.flatMap(d=>d.stores))]));
 const poolByMall=new Map([...storesByMall].map(([id,stores])=>[id,ctx.products.filter(p=>stores.has(p.store)&&p.audience!=='child'&&p.sizes?.length)]));
 const spec=(id,targets)=>targets.map((productId,i)=>({productId,inspect:true,fit:id==='find'||id==='style'&&i===0,buy:id!=='window'}));
 const allDifferent=ids=>new Set(ids.map(id=>ctx.modelKey(ctx.byId(id)))).size===ids.length;
 const distinct=items=>{const keys=new Set();return items.filter(p=>{const key=ctx.modelKey(p);if(keys.has(key))return false;keys.add(key);return true;});};
 const quote=(s,p)=>{const n=ctx.price(s,p);return n+Math.round(n*ctx.tax);};
 const inStock=(s,p)=>ctx.stock(s,p.id,ctx.idealSize(s,p))>0;
 const claimed=s=>(s.outingClaimDays||[]).includes(s.day);
 function offer(s,id,products,limit){
  const base=templates[id],items=spec(id,products.map(p=>p.id)),pricing={...s,coupon:null};
  const estimate=items.filter(i=>i.buy).reduce((n,i)=>n+quote(pricing,ctx.byId(i.productId)),0);
  const budget=id==='window'?0:Math.min(limit,Math.ceil(estimate/500)*500);
  const stores=new Set(products.map(p=>p.store));
  const minutes=stores.size*5+items.length*3+items.filter(i=>i.fit).length*10+(id==='window'?30:stores.size*8+items.length*2);
  return {...base,items,budget,estimate,minutes,mallId:s.mallId,day:s.day,rest:id==='window'};
 }
 function offers(s){
  if(claimed(s))return [];
  const pool=(poolByMall.get(s.mallId)||[]).filter(p=>ctx.storeById(p.store).tier<=ctx.levelOf(s));
  const pricing={...s,coupon:null},limit=Math.max(0,Math.min(s.dailyBudget,s.cash));
  const rank=(items,key)=>distinct(items).map(p=>({p,score:ctx.hash(s.day+'|'+s.mallId+'|'+key+'|'+p.id)})).sort((a,b)=>a.score-b.score||a.p.id.localeCompare(b.p.id)).map(v=>v.p);
  const affordable=pool.filter(p=>!['food','drink'].includes(p.type)&&quote(pricing,p)<=limit&&inStock(s,p));
  const result=[];
  const finds=rank(affordable.filter(p=>ctx.canTry(p)&&ctx.slotForProduct(p)),'find');
  if(finds.length)result.push(offer(s,'find',[finds[0]],limit));
  const tops=rank(affordable.filter(p=>ctx.slotForProduct(p)==='top'),'top');
  const accessories=rank(affordable.filter(p=>['bag','hat','belt'].includes(ctx.slotForProduct(p))),'accessory');
  for(const top of tops){
   const accessory=accessories.find(p=>quote(pricing,p)+quote(pricing,top)<=limit&&ctx.modelKey(p)!==ctx.modelKey(top));
   if(accessory){result.push(offer(s,'style',[top,accessory],limit));break;}
  }
  const gifts=rank(affordable.filter(p=>!ctx.canTry(p)),'gift');
  if(gifts.length)result.push(offer(s,'gift',[gifts[0]],limit));
  const windows=rank(pool,'windows'),selected=[],visited=new Set();
  for(const p of windows)if(!visited.has(p.store)){selected.push(p);visited.add(p.store);if(selected.length===3)break;}
  for(const p of windows)if(selected.length<3&&!selected.some(q=>ctx.modelKey(q)===ctx.modelKey(p)))selected.push(p);
  if(selected.length===3)result.push(offer(s,'window',selected,0));
  return result;
 }
 function accept(s,id){
  if(claimed(s))throw Error('You have already collected today’s outing reward. New outings arrive tomorrow.');
  if(s.outing)throw Error('Finish or cancel your current outing first.');
  const chosen=offers(s).find(o=>o.id===id);if(!chosen)throw Error('This outing is not available for this mall and allowance.');
  if(s.minutes+chosen.minutes>ctx.close)throw Error('There is not enough time for this outing before closing. Start a fresh one tomorrow.');
  s.outing={template:id,day:s.day,mallId:s.mallId,targets:chosen.items.map(i=>i.productId),budget:chosen.budget,after:s.purchases.length,restAt:s.metrics.rests,started:s.minutes};
  s.outingFocus=true;return status(s);
 }
 function status(s){
  const plan=s.outing,base=template(plan?.template);if(!base||plan.day!==s.day)return null;
  const keyOf=id=>ctx.modelKey(ctx.byId(id));
  const purchases=s.purchases.slice(plan.after).filter(i=>i.day===s.day&&!i.returned&&!i.delivered);
  const items=spec(plan.template,plan.targets).map(i=>{
   const product=ctx.byId(i.productId),key=ctx.modelKey(product);
   const inspected=s.daily.inspect.some(id=>keyOf(id)===key),fitted=s.daily.try.some(id=>keyOf(id)===key);
   const purchase=i.buy?purchases.find(p=>keyOf(p.productId)===key&&(!i.fit||p.size===ctx.idealSize(s,ctx.byId(p.productId)))):null;
   return {...i,product,inspected,fitted,purchase,paid:purchase?.total||0,done:inspected&&(!i.fit||fitted)&&(!i.buy||!!purchase)};
  });
  const spent=items.reduce((n,i)=>n+i.paid,0),shopping=items.some(i=>i.buy),allBought=items.every(i=>!i.buy||i.purchase);
  const steps=items.flatMap(i=>[
   {key:'inspect:'+i.productId,label:'Read '+i.product.name+'’s label',done:i.inspected,kind:'product',id:i.productId},
   ...i.fit?[{key:'fit:'+i.productId,label:'Try '+i.product.name+' in your usual size',done:i.fitted,kind:'product',id:i.productId}]:[],
   ...i.buy?[{key:'buy:'+i.productId,label:'Keep a new '+i.product.name,done:!!i.purchase,kind:'product',id:i.productId}]:[]
  ]);
  if(plan.template==='window')steps.push({key:'rest',label:'Take a free bench break',done:s.metrics.rests>plan.restAt,kind:'venue',id:'rest'});
  if(shopping)steps.push({key:'budget',label:'Keep these finds within the outing allowance',done:allBought&&spent<=plan.budget,kind:'view',id:'journal'});
  const complete=steps.filter(i=>i.done).length,ready=steps.every(i=>i.done),rewardClaimed=claimed(s);
  return {...base,plan,items,steps,spent,budget:plan.budget,complete,total:steps.length,ready,claimed:rewardClaimed,overBudget:allBought&&spent>plan.budget};
 }
 function next(s){
  if(!s.outingFocus)return null;const current=status(s);if(!current||current.claimed)return null;
  const step=current.steps.find(i=>!i.done);
  return {chapter:'OUTING',title:current.title,step:current.complete,steps:current.total,...current.ready?{kind:'outing-claim',id:current.id,label:'Collect your outing reward'}:{kind:step.kind,id:step.id,label:step.label}};
 }
 function claim(s){
  const current=status(s);if(!current)throw Error('Choose an outing for today first.');
  if(current.claimed)throw Error('Today’s outing reward has already been collected.');
  if(!current.ready)throw Error('Complete every outing step and stay within its allowance first.');
  s.outingClaimDays=[...(s.outingClaimDays||[]),s.day].slice(-365);s.outingFocus=false;
  s.outingLog=[{day:s.day,mallId:s.outing.mallId,title:current.title,spent:current.spent,xp:current.xp,cash:current.cash},...(s.outingLog||[])].slice(0,14);
  return {xp:current.xp,cash:current.cash,title:current.title};
 }
 function cancel(s){s.outing=null;s.outingFocus=false;}
 function normalize(s){
  s.outingClaimDays=[...new Set((Array.isArray(s.outingClaimDays)?s.outingClaimDays:[]).filter(n=>Number.isSafeInteger(n)&&n>0&&n<=s.day))].sort((a,b)=>a-b).slice(-365);
  s.outingLog=(Array.isArray(s.outingLog)?s.outingLog:[]).filter(v=>v&&Number.isSafeInteger(v.day)&&v.day>0&&v.day<=s.day&&typeof v.title==='string'&&Number.isSafeInteger(v.spent)&&v.spent>=0&&Number.isSafeInteger(v.xp)&&v.xp>=0&&v.xp<=5000&&Number.isSafeInteger(v.cash)&&v.cash>=0&&v.cash<=100000000).slice(0,14).map(v=>({day:v.day,mallId:storesByMall.has(v.mallId)?v.mallId:s.mallId,title:v.title.slice(0,80),spent:v.spent,xp:v.xp,cash:v.cash}));
  s.outingFocus=!!s.outingFocus;const p=s.outing;
  const valid=p&&template(p.template)&&p.day===s.day&&storesByMall.has(p.mallId)&&Array.isArray(p.targets)&&p.targets.length>=1&&p.targets.length<=3&&p.targets.every(id=>typeof id==='string'&&activeProducts.has(id)&&storesByMall.get(p.mallId).has(ctx.byId(id).store)&&ctx.storeById(ctx.byId(id).store).tier<=ctx.levelOf(s))&&allDifferent(p.targets)&&Number.isSafeInteger(p.budget)&&p.budget>=0&&p.budget<=100000000&&Number.isSafeInteger(p.after)&&p.after>=0&&p.after<=s.purchases.length&&Number.isSafeInteger(p.restAt)&&p.restAt>=0&&p.restAt<=s.metrics.rests;
  const shape=valid&&(p.template==='window'?p.targets.length===3&&p.budget===0:p.template==='style'?p.targets.length===2&&ctx.slotForProduct(ctx.byId(p.targets[0]))==='top'&&['bag','hat','belt'].includes(ctx.slotForProduct(ctx.byId(p.targets[1]))):p.targets.length===1&&(p.template!=='find'||ctx.canTry(ctx.byId(p.targets[0]))));
  if(!shape){s.outing=null;s.outingFocus=false;}
  else s.outing={template:p.template,day:p.day,mallId:p.mallId,targets:[...p.targets],budget:p.budget,after:p.after,restAt:p.restAt,started:Number.isInteger(p.started)?Math.max(ctx.open,Math.min(ctx.close,p.started)):ctx.open};
  if(claimed(s))s.outingFocus=false;
 }
 return {offers,accept,status,next,claim,cancel,normalize,claimed};
}
