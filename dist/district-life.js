// Original game activities. These menus and sculptures are not real tenant offerings.
export const ART_DETAILS=[
 {id:'curve',name:'Follow the curves',text:'Two looping ribbons turn in different directions. Your sketch follows one line, then the other, until they meet.'},
 {id:'shadow',name:'Trace the shadows',text:'The open center leaves a bright patch on the stone. You draw the space around the sculpture as carefully as the sculpture itself.'},
 {id:'color',name:'Notice the patina',text:'Warm metal and cool green pick up the colors of the court. You save a tiny palette beside your shopping notes.'}
];
export function diningMealIds(st){if(st?.businessKind!=='food')return [];return /coffee|cafe|café|tea|nespresso|espresso/i.test(st.name)?['coffee','snack','sandwich']:/chocolat|candy|yogurt|cream|bakery|cookie|dessert/i.test(st.name)?['icecream','snack','coffee']:['sandwich','bowl','snack'];}
export function createDistrictLife({storeById,mallById,planFor,storeFloor,mallOf,FOOD,eat,canAct,advance,addXP}){
 const menu=st=>diningMealIds(st).map(id=>FOOD.find(f=>f.id===id));
 const key=n=>n.mallId+':'+n.floor;
 function normalize(s){
  s.diningVisits=(Array.isArray(s.diningVisits)?s.diningVisits:[]).filter(v=>v&&diningMealIds(storeById(v.store)).includes(v.meal)&&Number.isSafeInteger(v.day)&&v.day>0&&v.day<=s.day&&Number.isSafeInteger(v.minutes)&&v.minutes>=600&&v.minutes<=1200&&Number.isSafeInteger(v.paid)&&v.paid===FOOD.find(f=>f.id===v.meal)?.price).slice(-120).map(v=>({store:v.store,meal:v.meal,day:v.day,minutes:v.minutes,paid:v.paid}));
  const notes=new Map();for(const n of Array.isArray(s.artNotes)?s.artNotes:[])if(n&&mallById(n.mallId)&&Number.isInteger(n.floor)&&n.floor>=0&&n.floor<planFor({mallId:n.mallId}).levels.length&&ART_DETAILS.some(d=>d.id===n.detail)&&Number.isSafeInteger(n.day)&&n.day>0&&n.day<=s.day)notes.set(key(n),{mallId:n.mallId,floor:n.floor,detail:n.detail,day:n.day});s.artNotes=[...notes.values()];
 }
 function dine(s,storeId,meal){const st=storeById(storeId),mall=mallOf(s);if(!st||!menu(st).some(f=>f.id===meal)||!mall.sections.some(d=>d.stores.includes(storeId))||storeFloor(mall,storeId)!==(s.floor||0))throw Error('Walk to a dining location on this mall floor first.');const food=eat(s,meal);s.diningVisits.push({store:storeId,meal,day:s.day,minutes:s.minutes,paid:food.price});s.diningVisits=s.diningVisits.slice(-120);return food;}
 function sketch(s,detail){if(!mallById(s.mallId)||!Number.isInteger(s.floor||0)||(s.floor||0)<0||(s.floor||0)>=planFor(s).levels.length)throw Error('Choose a public mall floor first.');if(!ART_DETAILS.some(d=>d.id===detail))throw Error('Choose a detail to sketch.');const old=s.artNotes.find(n=>key(n)===key({mallId:s.mallId,floor:s.floor||0}));if(old?.day===s.day)throw Error('You saved a sketch here today. Come back tomorrow.');canAct(s,3,0,{care:true});advance(s,3);s.energy=Math.min(100,s.energy+4);const note={mallId:s.mallId,floor:s.floor||0,detail,day:s.day};if(old)s.artNotes[s.artNotes.indexOf(old)]=note;else s.artNotes.push(note);if(!old)addXP(s,5);return {note,xp:old?0:5};}
 return {normalize,menu,dine,sketch};
}
