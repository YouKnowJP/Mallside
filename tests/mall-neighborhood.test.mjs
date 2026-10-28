import {test} from 'node:test';
import assert from 'node:assert/strict';
import {MALLS,STORES,VENUES} from '../dist/engine.js';
import {spatialLayout} from '../dist/spatial-layout.js';
import {mallLayouts} from './campus-assertions.mjs';
import {fixtureStop,shopperPlan} from '../dist/mall-neighborhood.js';
import {walkable,clearWalk} from '../dist/free-navigation.js';

test('dense retail wings join actual stores and add solid building mass without creating catalog identities',()=>{
 for(const mall of MALLS)for(const l of mallLayouts(mall)){
  const units=[...l.rects,...l.units,...l.anchors],ids=new Set(units.map(u=>u.id));
  for(const r of l.retailLinks){assert.equal(r.owners.length,2);assert.ok(r.owners.every(id=>ids.has(id)));assert.ok(l.nav.obstacles.includes(r));assert.equal(walkable({x:r.x+r.width/2,y:r.y+r.height/2},l.nav),false);}
  const area=rs=>rs.reduce((sum,r)=>sum+r.width*r.height,0);
  if(units.length>10){assert.ok(l.retailLinks.length>units.length*.25,mall.id+' has disconnected store rows');assert.ok(area([...l.retailLinks,...l.backBlocks])>area(units)*.3,mall.id+' has empty retail backs');}
 }
});

test('shopping streets fit opposing storefronts closely and bring real shops near the main arrival court',()=>{
 for(const mall of MALLS){const floor=['beverly','delamo'].includes(mall.id)?1:0,l=spatialLayout(mall,floor,STORES);
  assert.ok(l.campus.halls.every(h=>h.width<=128));
  for(const h of l.campus.halls){const a=l.campus.nodes[Number(h.a)],b=l.campus.nodes[Number(h.b)];if(mall.id==='southcoast'&&((a.x<1400)!==(b.x<1400)))continue;assert.ok(Math.abs(a.x-b.x)<40||Math.abs(a.y-b.y)<40,'shop rows must fit the concourse');}
  assert.ok([...l.rects,...l.units].some(r=>Math.hypot(r.door.x-l.spawn.x,r.door.y-l.spawn.y)<325),mall.id+' arrival has no nearby storefronts');
 }
});

test('all arcade kiosks lead to existing playable activities on the same floor',()=>{
 let total=0;for(const mall of MALLS)for(const l of mallLayouts(mall))for(const f of l.environment.fixtures){const action=fixtureStop(f);assert.ok(action.id&&action.name&&action.label);if(f.venue){total++;assert.ok(VENUES.some(v=>v.id===f.venue));assert.ok(l.venues.some(v=>v.id===f.venue));assert.equal(action.id,'venue:'+f.venue);assert.ok(walkable(f.approach,l.nav));}}
 assert.ok(total>100);
});

test('36 ambient shoppers start at distinct reachable places and have clear local browsing routes',()=>{
 for(const mall of MALLS){const floor=['beverly','delamo'].includes(mall.id)?1:0,l=spatialLayout(mall,floor,STORES),actors=shopperPlan(l,36);
  assert.equal(actors.length,36);assert.equal(new Set(actors.map(a=>a.id)).size,36);assert.ok(new Set(actors.map(a=>a.x.toFixed(1)+':'+a.y.toFixed(1))).size>=30);
  assert.ok(actors.filter(a=>Math.hypot(a.x-l.spawn.x,a.y-l.spawn.y)<650).length>=8,mall.id+' crowds are too far away');
  for(const a of actors){assert.ok(walkable(a,l.nav));assert.ok(a.targets.length);for(const q of a.targets){assert.ok(walkable(q,l.nav));assert.ok(clearWalk(a,q,l.nav));assert.ok(Math.hypot(a.x-q.x,a.y-q.y)<400);}}
 }
});
