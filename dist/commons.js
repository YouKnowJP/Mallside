// Original Mallside public-space activities; these are game additions, not real tenant claims.
export const COMMONS={
 mosaic:{name:'Mosaic table',icon:'◈',verb:'Arrange the tiles',minutes:5,recovery:4,description:'Three little tiles make a route through the afternoon. Turn them to match ↑ → ↓.',choices:[]},
 reading:{name:'Reading shelf',icon:'▤',verb:'Read a little story',minutes:5,recovery:6,description:'An open shelf of original Mallside micro-stories. Choose a page to take into your afternoon.',choices:[
  {id:'receipt',name:'The folded receipt',text:'A receipt fell from an old coat. On the back, someone had written: a good day, even without buying anything. You fold it carefully and put it back.'},
  {id:'window',name:'After the windows',text:'The shops were closing, but the sky still had one color left. Two friends stopped at the fountain until the last pink disappeared.'},
  {id:'bench',name:'The regular',text:'Every Thursday, the same person sat on the same bench with a different book. Today they left a flower between the pages for the next reader.'}]},
 garden:{name:'Garden study',icon:'❧',verb:'Notice a detail',minutes:4,recovery:5,description:'Look closely at this original pocket garden. Choose a detail for your discovery notebook.',choices:[
  {id:'leaves',name:'Layers of leaves',text:'Broad leaves make a quiet backdrop for the smaller plants. Your sketch follows the shapes from tall to low.'},
  {id:'color',name:'A small patch of color',text:'A few warm flowers stand out against the green. You mark their color beside the day’s shopping notes.'},
  {id:'shade',name:'Patterns of shade',text:'Light falls between the stems and across the stone rim. You trace the shadows before they move.'}]}
};
export const MOSAIC_TARGET=[0,1,2];
export const commonsKey=(mallId,floor,kind)=>mallId+':'+floor+':'+kind;
export function createCommonsLife({mallById,planFor,canAct,advance,addXP}){
 function normalize(s){const notes=new Map();for(const n of Array.isArray(s.commonsNotes)?s.commonsNotes:[]){const a=Object.hasOwn(COMMONS,n?.kind)?COMMONS[n.kind]:null;if(!a||!mallById(n.mallId)||!Number.isInteger(n.floor)||n.floor<0||n.floor>=planFor({mallId:n.mallId}).levels.length||!Number.isInteger(n.day)||n.day<1||n.day>s.day||!(n.kind==='mosaic'?n.choice==='aligned':a.choices.some(c=>c.id===n.choice)))continue;notes.set(commonsKey(n.mallId,n.floor,n.kind),{mallId:n.mallId,floor:n.floor,kind:n.kind,choice:n.choice,day:n.day});}s.commonsNotes=[...notes.values()];}
 function status(s,mallId=s.mallId){const kinds=new Set(s.commonsNotes.filter(n=>n.mallId===mallId).map(n=>n.kind));return {count:kinds.size,target:3,complete:kinds.size===3};}
 function record(s,kind,choice,floor=s.floor||0){const a=Object.hasOwn(COMMONS,kind)?COMMONS[kind]:null;if(!a||floor!==(s.floor||0)||!(kind==='mosaic'?Array.isArray(choice)&&choice.length===3&&choice.every((v,i)=>v===MOSAIC_TARGET[i]):a.choices.some(c=>c.id===choice)))throw Error('Finish this activity on its mall floor first.');
  const key=commonsKey(s.mallId,floor,kind),old=s.commonsNotes.find(n=>commonsKey(n.mallId,n.floor,n.kind)===key);if(old?.day===s.day)throw Error('You already saved a discovery here today. Come back tomorrow.');
  canAct(s,a.minutes,0,{care:true});const before=status(s),first=!old,note={mallId:s.mallId,floor,kind,choice:kind==='mosaic'?'aligned':choice,day:s.day};advance(s,a.minutes);s.energy=Math.min(100,s.energy+a.recovery);if(old)s.commonsNotes[s.commonsNotes.indexOf(old)]=note;else s.commonsNotes.push(note);const completed=!before.complete&&status(s).complete,xp=(first?5:0)+(completed?25:0);if(xp)addXP(s,xp);return {note,xp,completed};
 }
 return {normalize,status,record};
}
