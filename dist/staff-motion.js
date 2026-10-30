// A staff member acknowledges a fresh approach, then settles into conversation.
export function staffGesture(previous={},distance=Infinity,dt=0){
 if(!(dt>0))return {...previous};
 const near=distance<125,time=Math.min(.1,dt),cooldown=Math.max(0,(previous.cooldown||0)-time),trigger=near&&!previous.near&&!cooldown,greet=trigger?1.6:Math.max(0,(previous.greet||0)-time);
 return {near,greet,cooldown:trigger?8:cooldown};
}
export function staffTarget(staff,player,actors=[]){
 const candidates=[player,...actors.filter(a=>a.visible!==false)].filter(Boolean).map(p=>({p,d:Math.hypot(p.x-staff.x,p.y-staff.y)})).filter(t=>t.d<210).sort((a,b)=>a.d-b.d);
 const target=candidates[0];return target?Math.atan2(target.p.x-staff.x,target.p.y-staff.y):0;
}
