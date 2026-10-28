export const WALK_BOUNDS={left:80,right:934,top:242,bottom:411};
export const blocked=(p,obstacles,padding=7)=>obstacles.some(r=>p.x>r.x-padding&&p.x<r.x+r.width+padding&&p.y>r.y-padding&&p.y<r.y+r.height+padding);
export function slideMove(from,to,obstacles,bounds=WALK_BOUNDS){const clamp=p=>({x:Math.max(bounds.left,Math.min(bounds.right,p.x)),y:Math.max(bounds.top,Math.min(bounds.bottom,p.y))});const p=clamp(to);if(!blocked(p,obstacles))return p;const x=clamp({x:p.x,y:from.y});if(!blocked(x,obstacles))return x;const y=clamp({x:from.x,y:p.y});return !blocked(y,obstacles)?y:from;}
// A small A* grid keeps routes around fountains, planters, and counters.
export function planPath(start,end,obstacles,bounds=WALK_BOUNDS){
 const step=15,cols=Math.floor((bounds.right-bounds.left)/step)+1,rows=Math.floor((bounds.bottom-bounds.top)/step)+1;
 const point=id=>({x:bounds.left+(id%cols)*step,y:bounds.top+Math.floor(id/cols)*step});
 const nearest=p=>{let best=-1,distance=Infinity;for(let i=0;i<cols*rows;i++){const q=point(i);if(blocked(q,obstacles))continue;const d=Math.hypot(q.x-p.x,q.y-p.y);if(d<distance){best=i;distance=d;}}return best;};
 const first=nearest(start),last=nearest(end);if(first<0||last<0)return [];const open=new Set([first]),came=new Map(),g=new Map([[first,0]]),f=new Map([[first,0]]),closed=new Set();
 while(open.size){let current=[...open].reduce((a,b)=>(f.get(a)??Infinity)<(f.get(b)??Infinity)?a:b);if(current===last){const route=[point(current)];while(came.has(current)){current=came.get(current);route.push(point(current));}route.reverse();if(!blocked(end,obstacles))route.push(end);return route;}
  open.delete(current);closed.add(current);const x=current%cols,y=Math.floor(current/cols);
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||nx>=cols||ny<0||ny>=rows)continue;const next=ny*cols+nx;if(closed.has(next)||blocked(point(next),obstacles))continue;if(dx&&dy&&(blocked(point(y*cols+nx),obstacles)||blocked(point(ny*cols+x),obstacles)))continue;const score=g.get(current)+Math.hypot(dx,dy);if(score<(g.get(next)??Infinity)){came.set(next,current);g.set(next,score);const q=point(next),finish=point(last);f.set(next,score+Math.hypot(q.x-finish.x,q.y-finish.y)/step);open.add(next);}}
 }
 return [];
}
