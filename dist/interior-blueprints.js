import {hasCollectionDesk,hasLoungeBench} from './collection-guide.js?v=43.0.0';
import {brandDesign} from './brand-designs.js?v=40.0.0';

// Six display stations keep every model reachable; their arrangement and furnishings vary by brand.
const plans={
 runway:[[295,315],[800,315],[295,460],[800,460],[390,540],[705,540]],
 perimeter:[[240,300],[550,285],[860,300],[240,465],[550,465],[860,465]],
 forum:[[310,315],[570,315],[815,315],[310,490],[570,490],[815,490]],
 folded:[[285,300],[550,300],[815,300],[285,475],[550,475],[815,475]],
 department:[[265,310],[545,310],[825,310],[265,480],[545,480],[825,480]],
 salon:[[280,300],[535,285],[815,300],[280,475],[535,470],[815,475]],
 gallery:[[255,315],[530,275],[830,315],[255,495],[530,465],[830,495]],
 arcade:[[265,320],[545,280],[825,320],[265,505],[545,475],[825,505]],
 atelier:[[255,305],[545,285],[835,305],[255,480],[545,460],[835,480]],
 coastal:[[280,300],[550,300],[820,300],[330,475],[600,475],[835,475]],
 apothecary:[[270,310],[550,285],[830,310],[270,485],[550,465],[830,485]],
 beauty:[[270,310],[550,310],[830,310],[270,485],[550,485],[830,485]],
 jewelry:[[255,310],[535,280],[825,310],[285,475],[565,465],[835,475]],
 library:[[255,300],[545,300],[835,300],[255,475],[545,475],[835,475]],
 home:[[270,300],[550,285],[830,300],[270,485],[550,465],[830,485]],
 toys:[[270,310],[550,290],[830,310],[320,480],[600,480],[840,480]],
 cafe:[[270,320],[550,290],[830,320],[270,490],[550,490],[830,490]],
 counter:[[270,300],[550,300],[830,300],[270,480],[550,480],[830,480]]
};
export function makeInteriorPlan(store,plan,visibleCount=Math.min(6,store.count||2)){
 const design=brandDesign(store),base=plans[design.layout]||plans.gallery,shift=(design.variation-1.5)*7;
 const displays=base.map(([x,y],i)=>({x:Math.max(265,Math.min(835,x+shift*(i%2?1:-1))),y,width:100,height:65}));
 const mirrored=['perimeter','coastal','atelier','jewelry'].includes(design.layout)&&design.variation%2===1;
 const checkout={x:mirrored?230:820,y:650,width:150,height:60},returns={x:mirrored?830:230,y:650,width:120,height:60};
 const fitting={x:mirrored?815:225,y:135,width:140,height:90},rail={x:mirrored?255:690,y:145,width:220,height:55};
 const lounge=hasLoungeBench(store)||store.catalogStatus==='pending'||['food','service','visitor','entertainment','auto','gallery'].includes(store.businessKind),seating=lounge?[{x:554,y:615,width:92,height:30}]:[];
 const decor=/niches|silk|velvet|shelf|fold|book|rack|screen|sink|trunks|menu|coffee|bakery|citrus|steel-counter|room-scenes|shoe|sneaker|travel/.test(design.feature)?[{x:mirrored?500:390,y:115,width:280,height:48}]:[];
 // Real walls bound two enterable fitting cubicles. The doorways remain open in navigation.
 const fittingWalls=[{x:fitting.x,y:fitting.y,width:140,height:5},...[0,68,136].map(dx=>({x:fitting.x+dx,y:fitting.y,width:4,height:90}))];
 const fittingRooms=[34,104].map((dx,i)=>({id:i,x:fitting.x+dx,y:fitting.y+48,wait:{x:fitting.x+dx,y:258}}));
 // Auxiliary stock fixtures are only rendered when this shop has product stock.
 const noProductStock=!store.count;
 const stockFixtures=visibleCount&&!noProductStock?[-1,1].flatMap(side=>[275,410,550].map((y,i)=>({id:'wall-'+side+'-'+i,kind:'wall',side,x:side<0?198:974,y,width:28,height:i===2?60:90}))):[];
 const collectionDesk=hasCollectionDesk(store)?[{x:540,y:125,width:120,height:45}]:[];
 const fixtures=[...collectionDesk,...displays.slice(0,visibleCount),checkout,returns,...fittingWalls,rail,...seating,...decor,...stockFixtures];
 const services={checkout:{x:checkout.x+checkout.width/2,y:734},returns:{x:returns.x+returns.width/2,y:734},fitting:{x:fitting.x+fitting.width/2,y:246},associate:{x:mirrored?745:445,y:630}};
 // Extra double-sided rails/islands fill the gaps between display columns, never their approaches.
 const overlaps=(a,b,pad=16)=>a.x<b.x+b.width+pad&&a.x+a.width>b.x-pad&&a.y<b.y+b.height+pad&&a.y+a.height>b.y-pad;
 for(const x of noProductStock?[]:[432,714]){const r={id:'island-'+x,kind:'island',x,y:325,width:52,height:160};if(!fixtures.some(f=>overlaps(r,f)))stockFixtures.push(r),fixtures.push(r);}
 if(visibleCount&&!noProductStock){const r={id:'front-edit',kind:'feature',x:525,y:612,width:150,height:45};if(!fixtures.some(f=>overlaps(r,f)))stockFixtures.push(r),fixtures.push(r);}
 const nav={bounds:{left:190,top:110,right:1010,bottom:790},obstacles:fixtures},spawn={x:600,y:735};
 stockFixtures.forEach(r=>r.approach=r.kind==='wall'?{x:r.side<0?r.x+r.width+20:r.x-20,y:r.y+r.height/2}:{x:r.x+r.width/2,y:r.y+r.height+20});
 const queue=[0,1,2].map(i=>({x:services.checkout.x+(mirrored?1:-1)*(55+i*45),y:744}));
 return {plan,store,design,rects:[],anchors:[],venues:[],locals:[],planters:[],displays,fixtures,checkout,returns,fitting,fittingRooms,stockFixtures,queue,rail,seating,services,nav,spawn,exit:{x:600,y:765},elevator:{x:600,y:765},width:1200,height:900};
}
