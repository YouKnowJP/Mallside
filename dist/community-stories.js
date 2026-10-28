// Original, optional local stories. Evidence comes from completed engine actions;
// an unfinished chapter survives sleep, travel and a save reload.
export const LOCAL_STORY_CHAPTERS=5;
export const LOCAL_STORIES = [
 {id:'maya',name:'A gift with a reason',person:'Maya',emoji:'🎁',intro:'Help Maya choose a gift, then come back to see how it went.',choices:[{id:'useful',name:'Something useful',text:'A real home, beauty, hobby or technology find.'},{id:'style',name:'A little personal style',text:'A real wearable or accessory in its usual size.'}]},
 {id:'eli',name:'The afternoon club',person:'Eli',emoji:'🌿',intro:'Build a tradition around the places between the shops.',choices:[{id:'quiet',name:'The quieter corners',text:'Gardens, art and a flower workshop.'},{id:'play',name:'A little more playful',text:'Carousel horses and a cinema afternoon.'}]},
 {id:'noor',name:'Tomorrow, already yours',person:'Noor',emoji:'🧥',intro:'Make more of the pieces you choose to keep, with a room and an outfit for tomorrow.',choices:[{id:'quiet',name:'An everyday rhythm',text:'A considered everyday look and a quieter finish.'},{id:'expressive',name:'A little self-expression',text:'A personal shelf and a flower-studio detour.'}]},
 {id:'jules',name:'A welcome worth sharing',person:'Jules',emoji:'✍',intro:'Build a welcoming little route and leave a memory of an ordinary afternoon.',choices:[{id:'green',name:'The greener route',text:'Gardens, art and a quiet pause.'},{id:'bright',name:'A playful welcome',text:'A carousel ride, a photo and friendly company.'}]},
 {id:'sam',name:'A regular’s little route',person:'Sam',emoji:'🗺',intro:'Learn the useful stops, then make a route worth sharing.',choices:[{id:'practical',name:'A practical loop',text:'Useful stops and a few carefully read labels.'},{id:'slow',name:'The scenic route',text:'Leave time for a seat and tea on the terrace.'}]}
];
const definition=id=>LOCAL_STORIES.find(v=>v.id===id);
const task=(id,label,type,target=1,values=null,route={kind:'venue',id:'services'})=>({id,label,type,target,values,route});
function chapter(id,stage,choice){
 const hello=who=>task('hello','Talk with '+definition(who).person,'talk',1,[who],{kind:'local',id:who});
 const labels=n=>task('labels','Read '+n+' different real-product labels','inspect',n,null,{kind:'view',id:'catalog'});
 const shops=n=>task('shops','Walk into '+n+' different '+(n===1?'store':'stores'),'visit',n,null,{kind:'view',id:'catalog'});
 const rest=task('rest','Take a free bench break','rest',1,null,{kind:'venue',id:'rest'});
 const photo=task('photo','Take an outfit portrait or postcard · $5','photo',1,null,{kind:'venue',id:'photo'});
 const route=task('directory','Save a route note at a mall directory','amenity',1,['directory'],{kind:'directory',id:'directory'});
 const water=task('water','Use the complimentary water station','amenity',1,['water']);
 const activity=(id,label)=>task(id,label,'activity',1,[id],{kind:'venue',id:{artwalk:'art',tea:'lounge'}[id]||id});
 const notice=task('notice','Choose a community notice at guest services','amenity',1,['notice']);
 const property=task('property','Match the lost-property claim card at concierge','amenity',1,['property']);
 const unwind=task('unwind','Unwind in your collection room · 8 min','home',1,['unwind'],{kind:'view',id:'collections'});
 const arrange=task('arrange','Swap two kept finds on your room shelf','arrange',1,null,{kind:'view',id:'collections'});
 const books={
  maya:[
   {title:'Listen before choosing',text:choice==='style'?'“Something they can wear often would mean more than a grand gesture. Let’s look carefully first.”':'“They love an ordinary thing that makes the day easier. Let’s read a few labels before deciding.”',tasks:[labels(2),hello('maya')],cash:1200,xp:35},
   {title:'The thoughtful parcel',text:'Buy a new, inspected '+(choice==='style'?'wearable or accessory in your usual size':'home, beauty, hobby or technology find')+' for at most $150 including tax. Keep it unused, wrap it at guest services, and bring it to Maya. She reimburses its receipt total and the $2 wrap fee.',tasks:[{id:'gift',label:'Bring a qualifying wrapped gift to Maya',type:'gift',target:1,route:{kind:'venue',id:'services'}}],gift:true,cash:2000,xp:75},
   {title:'The story it carries',text:choice==='style'?'“They already have an outfit in mind. Thank you for choosing something that felt like them.”':'“They made room for it right away. It’s the little useful things we reach for every day.”',tasks:[photo,rest,hello('maya')],cash:2500,xp:60}
  ],
  eli:[
   {title:'Pick an afternoon',text:choice==='quiet'?'“Start at the directory. I know a garden worth slowing down for.”':'“A map first, then a little carousel ride. You never get too old for a good detour.”',tasks:[route,activity(choice==='quiet'?'bridge':'carousel',choice==='quiet'?'Observe the garden bridge':'Choose a carousel horse and ride'),hello('eli')],cash:1500,xp:40},
   {title:'Make it a tradition',text:choice==='quiet'?'“This time, look at the art and make something with your hands.”':'“A ride and a film: a whole afternoon with no shopping list.”',tasks:[activity(choice==='quiet'?'artwalk':'carousel',choice==='quiet'?'Complete the sculpture walk':'Enjoy a carousel ride'),activity(choice==='quiet'?'flowers':'cinema',choice==='quiet'?'Arrange the workshop bouquet':'Finish the cinema screening'),shops(2)],cash:3000,xp:65},
   {title:'Something to remember',text:'“One photo, a couple of window labels, and a catch-up. Same time another day?”',tasks:[photo,labels(2),hello('eli')],cash:2500,xp:60}
  ],
  noor:[
   {title:'Start with the label',text:'“Before we plan a wardrobe, let’s look closely. Three different real models, a seat, and a proper conversation.”',tasks:[labels(3),rest,hello('noor')],cash:1200,xp:45},
   {title:'Tomorrow, already chosen',text:'“Keep at least two pieces you can wear in your usual size. Equip them, save a named look, then prepare tomorrow’s outfit in your collection room. No new purchase is required if you already have them.”',tasks:[task('look','Save a new named outfit','look',1,null,{kind:'view',id:'wardrobe'}),task('plan','Prepare tomorrow’s two-piece outfit','plan',1,null,{kind:'view',id:'collections'}),hello('noor')],cash:2200,xp:70},
   {title:choice==='expressive'?'A corner of your own':'Make room for the everyday',text:choice==='expressive'?'“Choose something you have decided to keep for your shelf. Then make a little color at the flower studio.”':'“Give a kept find a place in your room. Leave a guestbook memory, and leave room for a seat.”',tasks:[task('display','Place a kept purchase on your shelf','display',1,null,{kind:'view',id:'collections'}),choice==='expressive'?activity('flowers','Arrange a workshop bouquet'):task('guestbook','Sign today’s concierge guestbook','amenity',1,['guestbook']),hello('noor')],cash:3000,xp:80}
  ],
  jules:[
   {title:'A friendly first loop',text:'“A directory, free water and two real storefronts. Those are the first things I show a newcomer.”',tasks:[route,water,shops(2),hello('jules')],cash:1200,xp:45},
   {title:'A page for an ordinary day',text:'“A mood, a detail worth remembering, a place to sit. Sign the guestbook at concierge, then take the sort of detour we chose.”',tasks:[task('guestbook','Sign today’s concierge guestbook','amenity',1,['guestbook']),rest,activity(choice==='green'?'bridge':'carousel',choice==='green'?'Observe the garden bridge':'Take a carousel ride')],cash:2000,xp:65},
   {title:'Pass the welcome along',text:choice==='green'?'“One art walk, one picture, and a last conversation. The next visitor has a calmer route to follow.”':'“One ride, one picture, and a last conversation. The next visitor has a brighter afternoon to try.”',tasks:[activity(choice==='green'?'artwalk':'carousel',choice==='green'?'Complete the sculpture walk':'Enjoy a carousel ride'),photo,hello('jules')],cash:3000,xp:80}
  ],
  sam:[
   {title:'The useful little stops',text:'“The directory and free water station are two stops I always point out. Then choose a shop you haven’t looked inside today.”',tasks:[route,water,shops(1)],cash:1000,xp:35},
   {title:choice==='slow'?'Leave a little room':'Shop with a little intention',text:choice==='slow'?'“A seat, a warm tea, and enough time to read two labels. No need to rush.”':'“Read three different labels and take a seat before making another decision.”',tasks:choice==='slow'?[rest,activity('tea','Prepare a terrace tea'),labels(2)]:[rest,labels(3)],cash:1800,xp:50},
   {title:'Pass the route along',text:'“Make one more loop through three shops, save a route note and tell me what you found. That’s a regular’s welcome.”',tasks:[shops(3),route,hello('sam')],cash:2500,xp:65}
  ]
 };
 const followups={
  maya:[
   {title:'Good things find their way back',text:choice==='style'?'“They wore it on an ordinary Tuesday. That is the best sort of thank-you. Someone else has lost a favorite thing—shall we help concierge match the claim?”':'“Your useful little gift is part of their day now. Let’s help someone find the thing they already miss.”',tasks:[property,water,hello('maya')],cash:2200,xp:65},
   {title:'A welcome, passed on',text:'“A gift started with paying attention. Choose a community notice, share a small memory, and let yourself have a quiet evening.”',tasks:[notice,task('guestbook','Leave a new concierge guestbook memory','amenity',1,['guestbook']),unwind,hello('maya')],cash:3200,xp:90}
  ],
  eli:[
   {title:'An invitation without a shopping list',text:choice==='quiet'?'“The quieter club has room for one more. Read a community notice and find the garden again.”':'“The afternoon club is still going. Pick a community notice and make time for another carousel turn.”',tasks:[notice,activity(choice==='quiet'?'bridge':'carousel',choice==='quiet'?'Observe the garden bridge':'Take a carousel ride'),hello('eli')],cash:2200,xp:65},
   {title:'Leave the afternoon better',text:'“A lost favorite back in the right hands, a little water, and a restful evening. That is an afternoon worth repeating.”',tasks:[property,water,unwind,hello('eli')],cash:3200,xp:90}
  ],
  noor:[
   {title:'The order that feels like you',text:choice==='expressive'?'“Your shelf can tell its own story. Put two kept finds on it, swap their places, then give yourself a quiet moment.”':'“Put two kept finds on the shelf and swap their places. Something you already own can feel fresh when you see it differently.”',tasks:[arrange,unwind,hello('noor')],cash:2200,xp:70},
   {title:'Enough for an ordinary morning',text:'“We made room for what you keep. Choose a community invitation, help someone keep a favorite of their own, and come tell me how the week felt.”',tasks:[notice,property,hello('noor')],cash:3400,xp:95}
  ],
  jules:[
   {title:'The welcome becomes a habit',text:choice==='green'?'“The green route is on the board now. Choose a notice, read the directory and leave a page for whoever comes next.”':'“The playful route has a few followers. Choose a notice, read the directory and leave a friendly page.”',tasks:[notice,route,task('guestbook','Leave today’s concierge guestbook memory','amenity',1,['guestbook'])],cash:2200,xp:65},
   {title:'Someone else’s way home',text:'“A welcome is in the little things. Help match a lost favorite, refill your water, and leave enough time to unwind at home. Tell me before you go.”',tasks:[property,water,hello('jules'),unwind],cash:3200,xp:90}
  ],
  sam:[
   {title:'A regular lends a hand',text:choice==='slow'?'“There is time for someone else’s errand too. The claim card has every detail; then we can take that scenic bench break.”':'“One more useful stop: the claim card at concierge. Check every detail, then take a seat.”',tasks:[property,rest,hello('sam')],cash:2200,xp:65},
   {title:'A route worth coming back to',text:'“You know the stops. Pick an invitation from the board, save a fresh route note, and make your evening as considered as your afternoon.”',tasks:[notice,route,unwind,hello('sam')],cash:3200,xp:90}
  ]
 };
 return stage<3?books[id]?.[stage]||null:followups[id]?.[stage-3]||null;
}
export function createCommunityStories(ctx){
 const record=(s,id)=>s.localStories?.find(v=>v.id===id);
 function giftCandidates(s){
  const r=record(s,'maya');if(!r?.active||r.stage!==1)return [];
  return s.purchases.slice(r.after).filter(i=>{
   const p=ctx.byId(i.productId);
   return p&&!i.returned&&!i.delivered&&!i.worn&&!i.checked&&i.tags&&i.giftWrap&&i.total<=15000&&i.day>=r.startedDay&&s.seen.includes(p.id)&&!['food','drink'].includes(p.type)&&(r.choice==='style'?ctx.canTry(p)&&i.size===ctx.idealSize(s,p):!ctx.canTry(p));
  });
 }
 function status(s,id){
  const d=definition(id);if(!d)return null;const r=record(s,id),stage=r?.stage||0,complete=stage===LOCAL_STORY_CHAPTERS,c=complete?null:chapter(id,stage,r?.choice||d.choices[0].id);
  const tasks=(c?.tasks||[]).map(t=>({...t,count:t.type==='gift'?Math.min(1,giftCandidates(s).length):Math.min(t.target,r?.progress?.[t.id]?.length||0)}));
  return {...d,record:r,chapter:c,stage,complete,active:!!r?.active,waiting:!!r&&!r.active&&!complete&&s.day<r.readyDay,ready:!!r?.active&&tasks.every(t=>t.count>=t.target),tasks,done:tasks.filter(t=>t.count>=t.target).length,total:tasks.length};
 }
 function start(s,id,choice){
  const d=definition(id);if(!d)throw Error('Local story not found.');let r=record(s,id);
  if(r?.stage===LOCAL_STORY_CHAPTERS)throw Error('This local story is complete.');if(r?.active)throw Error('This chapter is already underway.');
  if(r&&s.day<r.readyDay)throw Error('Come back tomorrow for the next chapter.');
  if(!r){if(!d.choices.some(c=>c.id===choice))throw Error('Choose a direction for this story.');r={id,choice,stage:0,readyDay:s.day,history:[]};s.localStories.push(r);}
  Object.assign(r,{active:true,startedDay:s.day,mallId:s.mallId,after:s.purchases.length,progress:{}});s.communityFocus=id;s.outingFocus=false;return status(s,id);
 }
 function event(s,type,value){
  for(const r of s.localStories||[]){if(!r.active||r.mallId!==s.mallId)continue;const c=chapter(r.id,r.stage,r.choice);for(const t of c?.tasks||[]){if(t.type!==type||t.values&&!t.values.includes(value))continue;const key=type==='inspect'?ctx.modelKey(ctx.byId(value)):String(value),list=r.progress[t.id]||(r.progress[t.id]=[]);if(key&&!list.includes(key)&&list.length<t.target)list.push(key);}}
 }
 function claim(s,id,giftId){
  const v=status(s,id);if(!v?.ready)throw Error('Finish every step of this local chapter first.');const r=v.record;let reimbursement=0,gift=null;
  if(v.chapter.gift){gift=giftCandidates(s).find(i=>i.id===giftId);if(!gift)throw Error('Bring a qualifying wrapped gift to Maya.');reimbursement=gift.total+gift.giftWrap.fee;}
  // Validate everything before consuming an item or advancing the saved chapter.
  ctx.canAct(s,3,0,{care:true});ctx.advance(s,3);if(gift){gift.delivered=true;gift.deliveredTo='Maya';}
  r.history.push({stage:r.stage,day:s.day,mallId:s.mallId,title:v.chapter.title,...gift?{productId:gift.productId,wrap:gift.giftWrap.style}:{}});r.stage++;r.active=false;r.progress={};r.readyDay=s.day+1;if(s.communityFocus===id)s.communityFocus=null;
  return {title:v.chapter.title,xp:v.chapter.xp,cash:v.chapter.cash,reimbursement,complete:r.stage===LOCAL_STORY_CHAPTERS};
 }
 function next(s){const v=status(s,s.communityFocus);if(!v?.active)return null;const base={chapter:'LOCAL',person:v.person,title:v.chapter.title,step:v.done,steps:v.total};if(v.ready)return {...base,kind:'local',id:v.id,label:'Share this chapter with '+v.person};const t=v.tasks.find(t=>t.count<t.target);return {...base,...t.route,label:t.label};}
 function normalize(s){
  const source=Array.isArray(s.localStories)?s.localStories:[];s.localStories=[];
  for(const d of LOCAL_STORIES){const r=source.find(v=>v?.id===d.id);if(!r||!d.choices.some(c=>c.id===r.choice)||!Number.isInteger(r.stage)||r.stage<0||r.stage>LOCAL_STORY_CHAPTERS||!Array.isArray(r.history)||r.history.length!==r.stage)continue;
   const history=r.history.filter((h,i)=>h&&h.stage===i&&Number.isSafeInteger(h.day)&&h.day>0&&h.day<=s.day&&ctx.mallById(h.mallId));if(history.length!==r.stage)continue;
   const active=r.active===true&&r.stage<LOCAL_STORY_CHAPTERS&&Number.isSafeInteger(r.startedDay)&&r.startedDay>0&&r.startedDay<=s.day&&ctx.mallById(r.mallId)&&Number.isSafeInteger(r.after)&&r.after>=0&&r.after<=s.purchases.length;
   const progress={};for(const t of chapter(d.id,r.stage,r.choice)?.tasks||[]){progress[t.id]=[...new Set((Array.isArray(r.progress?.[t.id])?r.progress[t.id]:[]).filter(v=>typeof v==='string'&&v.length>0&&v.length<240))].slice(0,t.target);}
   s.localStories.push({id:d.id,choice:r.choice,stage:r.stage,active:!!active,startedDay:active?r.startedDay:s.day,mallId:active?r.mallId:s.mallId,after:active?r.after:s.purchases.length,readyDay:Number.isSafeInteger(r.readyDay)?Math.max(1,Math.min(s.day+1,r.readyDay)):s.day,progress,history:history.map(h=>({stage:h.stage,day:h.day,mallId:h.mallId,title:chapter(d.id,h.stage,r.choice).title,...ctx.byId(h.productId)?{productId:h.productId,wrap:['sage','rose','midnight'].includes(h.wrap)?h.wrap:'sage'}:{}}))});
  }
  if(!s.localStories.some(v=>v.id===s.communityFocus&&v.active))s.communityFocus=null;
 }
 return {all:s=>LOCAL_STORIES.map(d=>status(s,d.id)),status,start,event,claim,next,normalize,giftCandidates};
}
