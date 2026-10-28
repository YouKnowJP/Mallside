import {test} from 'node:test';
import assert from 'node:assert/strict';
import {MALLS,STORES} from '../dist/engine.js';
import {facadeFrame,themeFor,completeRetailWings,cameraCutaway,overviewFraming} from '../dist/mall-design.js';
import {walkable,onSurface,contains,freeRoute} from '../dist/free-navigation.js';
import {spatialLayout} from '../dist/spatial-layout.js';
import {mallLayouts,assertCampusTrip} from './campus-assertions.mjs';

test('all four shopfront orientations use the physical entrance face and correct dimensions',()=>{
 for(const side of [0,1,2,-1]){
  const f=facadeFrame({x:100,y:200,width:76,height:100,side});
  assert.equal(f.width,Math.abs(side)===1?100:76);
  assert.equal(f.depth,Math.abs(side)===1?76:100);
  const expected={0:[0,1],1:[1,0],2:[0,-1],'-1':[-1,0]}[side];
  assert.ok(Math.abs(f.front.x-expected[0])<1e-9&&Math.abs(f.front.y-expected[1])<1e-9);
  assert.ok(Math.abs(f.front.x*f.right.x+f.front.y*f.right.y)<1e-9);
 }
});

test('new seating and directory approaches are reachable across all 23 public floor views',()=>{
 let seats=0,directories=0;
 for(const mall of MALLS){const layouts=mallLayouts(mall);for(const [floor,l] of layouts.entries()){
  assert.equal(l.environment.revision,14);
  assert.deepEqual(l.environment.theme,themeFor(mall));
  for(const f of l.environment.fixtures){
   assert.ok(l.nav.obstacles.includes(f),'visible furniture must be a real collider');
   if(!f.approach)continue;
   assert.ok(walkable(f.approach,l.nav),mall.id+' '+f.id);
   assertCampusTrip(mall,layouts,floor,l.spawn,floor,f.approach);
   if(f.kind==='bench'){seats++;assert.ok(Math.hypot(f.approach.x-f.seat.x,f.approach.y-f.seat.y)<=31);}else directories++;
  }
 }}assert.ok(seats>100);assert.ok(directories>30);
});

test('architectural layouts are deterministic and larger main floors include a closed connected retail arcade',()=>{
 for(const mall of MALLS){const a=spatialLayout(mall,0,STORES),b=spatialLayout(mall,0,STORES);
  assert.deepEqual(a.environment,b.environment);
  assert.ok(a.environment.portals.length>0);
  assert.ok(a.environment.seating.length>0);
  assert.ok(a.environment.edgePlanting.length>0);
 }
 const original={family:'orange',width:2000,height:1600,completeFloor:true,nodes:[{id:'0',x:1000,y:800}],courts:[],halls:[]};
 const c=completeRetailWings(original,90);assert.equal(c.nodes.length,5);
 assert.equal(c.halls.length,6);
 for(const id of ['1','2','3','4'])assert.ok(c.halls.filter(h=>h.a===id||h.b===id).length>=2);
});

test('spatial lookup agrees with uncached physical floor checks, including cell boundaries and signed padding',()=>{
 let seed=2026;
 for(const mall of MALLS){const {nav}=spatialLayout(mall,0,STORES);for(let i=0;i<1500;i++){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed/2**32*nav.bounds.right;
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;const y=seed/2**32*nav.bounds.bottom;
  const p={x:i%10===0?Math.round(x/96)*96:x,y},pad=[-5,0,8,12][i%4],b=nav.bounds;
  const expected=p.x>=b.left+pad&&p.x<=b.right-pad&&p.y>=b.top+pad&&p.y<=b.bottom-pad&&onSurface(p,nav.surfaces,pad)&&!nav.obstacles.some(r=>contains(p,r,pad));
  assert.equal(walkable(p,nav,pad),expected,mall.id+' '+JSON.stringify({p,pad}));
 }}
});

test('navigation caches refresh when furniture is added or a floor array is replaced',()=>{
 const n={bounds:{left:0,top:0,right:500,bottom:500},obstacles:[{x:200,y:140,width:70,height:190}]},a={x:50,y:250},b={x:440,y:250};
 assert.ok(freeRoute(a,b,n).length>2);
 n.obstacles.push({x:0,y:380,width:500,height:20});assert.equal(walkable({x:50,y:390},n),false);
 n.obstacles=[{x:200,y:0,width:70,height:500}];assert.deepEqual(freeRoute(a,b,n),[]);
 n.obstacles=[];assert.deepEqual(freeRoute(a,b,n),[a,b]);
 n.surfaces=[{kind:'court',x:50,y:250,radius:45}];assert.equal(walkable(b,n),false);
 n.surfaces=[{kind:'court',x:440,y:250,radius:45}];assert.equal(walkable(b,n),true);
});

test('camera cutaways lower only buildings that obstruct the view of the shopper',()=>{
 const p={x:200,y:200},camera={x:200,y:350,z:580};
 assert.equal(cameraCutaway({x:170,y:240,width:60,height:60},p,camera),true);
 assert.equal(cameraCutaway({x:170,y:440,width:60,height:60},p,camera),false);
 assert.equal(cameraCutaway({x:300,y:240,width:60,height:60},p,camera),false);
 assert.equal(cameraCutaway({x:170,y:70,width:60,height:60},p,camera),false);
});

test('whole-center framing fits every floor corner on tall phones and wide desktop screens after rotation',()=>{
 for(const aspect of [.42,.82,1.78,2.4])for(const angle of [0,.32,Math.PI/4,Math.PI/2]){
  const f=overviewFraming(4200,2800,aspect,angle),norm=Math.hypot(.62,.79),v=.79/norm,h=.62/norm,tan=Math.tan(46*Math.PI/360);
  for(const x of [-2100,2100])for(const z of [-1400,1400])for(const y of [-12,168]){
   const depth=f.distance-(x*Math.sin(angle)+z*Math.cos(angle))*h-y*v;
   assert.ok(Math.abs(x*Math.cos(angle)-z*Math.sin(angle))<depth*tan*aspect);
   assert.ok(Math.abs(-(x*Math.sin(angle)+z*Math.cos(angle))*v+y*h)<depth*tan);
  }
 }
});
