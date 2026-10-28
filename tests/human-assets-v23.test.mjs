import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {
 HUMAN_BODY,HUMAN_HAIR_SHORT,HUMAN_HAIR_BOB,HUMAN_EYES,
 HUMAN_BONES,HUMAN_BONE_NAMES,HUMAN_TEXTURES,HUMAN_PROVENANCE,
} from '../dist/human-model-data.js';

const assetURL=path=>new URL('../dist/'+path,import.meta.url);
const sourceURL=name=>assetURL('assets/character/source/'+name);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const sourceObj=readFileSync(sourceURL('base.obj'),'utf8');
const provenance=JSON.parse(readFileSync(assetURL('assets/character/provenance.json'),'utf8'));
const bone=name=>{const found=HUMAN_BONES.find(b=>b.name===name);assert.ok(found,'missing anatomical bone '+name);return found;};
const distance=(a,b)=>Math.hypot(...a.map((value,i)=>value-b[i]));
const length=b=>distance(b.head,b.tail);
const measuredBounds=mesh=>{
 const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 for(let i=0;i<mesh.positions.length;i++){
  const axis=i%3;min[axis]=Math.min(min[axis],mesh.positions[i]);max[axis]=Math.max(max[axis],mesh.positions[i]);
 }
 return min.map((value,i)=>[value,max[i]]);
};

// Read the original face-group membership; the converted body's own labels are
// not accepted as evidence that joint cubes or other helpers were removed.
const originalBodyVertices=new Set(),originalPositions=[],jawVertices=new Set();let originalVertexCount=0,bodyFaceCount=0,group='';
for(const line of sourceObj.split('\n')){
 if(line.startsWith('v ')){originalVertexCount++;originalPositions.push(line.slice(2).trim().split(/\s+/).map(Number));}
 else if(line.startsWith('g '))group=line.slice(2).trim();
 else if(line.startsWith('f ')){
  const ids=line.slice(2).trim().split(/\s+/).map(token=>Number(token.split('/')[0])-1);
  if(group==='body'){bodyFaceCount++;for(const id of ids)originalBodyVertices.add(id);}
  if(group==='joint-jaw')for(const id of ids)jawVertices.add(id);
 }
}

test('shipped anatomical source files and original textures match their recorded CC0 provenance',()=>{
 assert.deepEqual(HUMAN_PROVENANCE,provenance,'module and shipped provenance disagree');
 assert.equal(provenance.license,'CC0-1.0');
 for(const [name,key]of [['base.obj','bodySHA256'],['rig.game_engine.json','rigSHA256'],['weights.game_engine.json','weightsSHA256']]){
  assert.match(provenance[key],/^[a-f0-9]{64}$/);assert.equal(hash(readFileSync(sourceURL(name))),provenance[key],name+' source changed');
 }
 assert.deepEqual(new Set(provenance.assets.map(a=>a.key)),new Set(Object.keys(HUMAN_TEXTURES)),'texture reference has no original-asset record');
 for(const record of provenance.assets){
  assert.equal(HUMAN_TEXTURES[record.key],record.file);
  const bytes=readFileSync(assetURL(record.file));assert.equal(hash(bytes),record.sha256,record.key+' original texture changed');
  assert.deepEqual([...bytes.subarray(0,8)],[137,80,78,71,13,10,26,10],record.key+' is not a PNG');
  assert.ok(record.originalPath.endsWith('.png'),'texture provenance has no original filename');
 }
 assert.match(sourceObj,/explicitly released as CC0/);
 assert.match(readFileSync(assetURL('assets/character/LICENSE-CC0.md'),'utf8'),/CC0 1\.0 Universal/);
 assert.match(readFileSync(assetURL('assets/character/LICENSE-MPFB-scope.md'),'utf8'),/Rigs, poses and expressions/);
});

test('the rendered anatomical body contains the actual body surface and excludes all source helper geometry',()=>{
 assert.equal(originalVertexCount,19158,'the reference basemesh changed');
 assert.equal(bodyFaceCount,13378);assert.equal(originalBodyVertices.size,13380);
 const convertedVertices=new Set(HUMAN_BODY.sourceVertexIndices);
 assert.equal(convertedVertices.size,originalBodyVertices.size,'body surface lost original vertices');
 for(const id of convertedVertices)assert.ok(originalBodyVertices.has(id),'helper vertex leaked into rendered skin: '+id);
 assert.ok(HUMAN_BODY.sourceVertexIndices.every(id=>id>=0&&id<13380));
 assert.equal(HUMAN_BODY.triangleCount,26756,'body surface has missing or added faces');
 assert.ok(HUMAN_BODY.vertexCount>convertedVertices.size,'UV seams were lost');
});

for(const [name,mesh]of [['body',HUMAN_BODY],['short hair',HUMAN_HAIR_SHORT],['bob hair',HUMAN_HAIR_BOB],['eyes',HUMAN_EYES]]){
 test(name+' ships finite indexed geometry with unit normals and four normalized valid skin influences',()=>{
  assert.equal(mesh.positions.length,mesh.vertexCount*3);assert.equal(mesh.normals.length,mesh.vertexCount*3);
  assert.equal(mesh.uvs.length,mesh.vertexCount*2);assert.equal(mesh.sourceVertexIndices.length,mesh.vertexCount);
  assert.equal(mesh.indices.length,mesh.triangleCount*3);assert.equal(mesh.skinIndices.length,mesh.vertexCount*4);assert.equal(mesh.skinWeights.length,mesh.vertexCount*4);
  for(const [attribute,array]of Object.entries({positions:mesh.positions,normals:mesh.normals,uvs:mesh.uvs,skinWeights:mesh.skinWeights}))assert.ok(array.every(Number.isFinite),name+' has invalid '+attribute);
  assert.ok(mesh.indices.every(id=>Number.isInteger(id)&&id>=0&&id<mesh.vertexCount),name+' triangle references a missing vertex');
  assert.ok(mesh.sourceVertexIndices.every(id=>Number.isInteger(id)&&id>=0),name+' has invalid source identity');
  assert.ok(mesh.skinIndices.every(id=>Number.isInteger(id)&&id>=0&&id<HUMAN_BONES.length),name+' references a missing bone');
  for(let i=0;i<mesh.vertexCount;i++){
   const weights=mesh.skinWeights.slice(i*4,i*4+4);assert.ok(weights.every(w=>w>=0&&w<=1),name+' has a negative or excessive influence');
   assert.ok(Math.abs(weights.reduce((sum,w)=>sum+w,0)-1)<1e-8,name+' skin weights do not sum to one');
   assert.ok(Math.abs(Math.hypot(...mesh.normals.slice(i*3,i*3+3))-1)<2e-5,name+' contains a zero or unnormalized normal');
  }
  const bounds=measuredBounds(mesh);
  for(let axis=0;axis<3;axis++){
   assert.ok(bounds[axis][1]>bounds[axis][0],name+' geometry collapsed');
   for(let endpoint=0;endpoint<2;endpoint++)assert.ok(Math.abs(bounds[axis][endpoint]-mesh.bounds[axis][endpoint])<1e-5,name+' bounding metadata does not match its actual surface');
  }
 });
}

test('all 53 anatomical bones have nonzero source frames and connect to one acyclic root',()=>{
 assert.equal(HUMAN_BONES.length,53);assert.equal(HUMAN_BONE_NAMES.length,53);assert.equal(new Set(HUMAN_BONE_NAMES).size,53);
 const roots=HUMAN_BONES.filter(b=>b.parent===-1);assert.equal(roots.length,1);assert.equal(roots[0].name,'Root');
 for(const [index,b]of HUMAN_BONES.entries()){
  assert.equal(b.name,HUMAN_BONE_NAMES[index]);assert.equal(b.head.length,3);assert.equal(b.tail.length,3);
  assert.ok([...b.head,...b.tail].every(Number.isFinite));assert.ok(length(b)>1e-4,b.name+' has no useful rest direction');
  assert.ok(Number.isInteger(b.parent)&&b.parent>=-1&&b.parent<HUMAN_BONES.length);
  const seen=new Set();let at=index;
  while(at>=0){assert.ok(!seen.has(at),b.name+' has a parent cycle');seen.add(at);const next=HUMAN_BONES[at].parent;if(next===-1)assert.equal(HUMAN_BONES[at].name,'Root');at=next;}
 }
 // Five three-segment digits on each hand establish that the shipped anatomy
 // contains actual fingers, rather than merely naming a palm or thumb proxy.
 for(const side of ['l','r'])for(const digit of ['thumb','index','middle','ring','pinky'])for(const segment of ['01','02','03'])bone(digit+'_'+segment+'_'+side);
});

test('the fitted bob ends at the chin and upper neck instead of entering the shoulders',()=>{
 const bounds=measuredBounds(HUMAN_HAIR_BOB),neck=bone('neck_01').head[1],shoulder=Math.max(bone('upperarm_l').head[1],bone('upperarm_r').head[1]);
 assert.ok(bounds[1][0]>neck+.1,'bob reaches below the upper neck');assert.ok(bounds[1][0]>shoulder+.5,'bob enters the shoulder garment region');
 assert.ok(bounds[1][0]<bone('head').head[1],'bob was accidentally reduced to a crown cap');
 assert.ok(bounds[1][1]<measuredBounds(HUMAN_BODY)[1][1]+.2,'bob floats above the scalp');
 assert.equal(HUMAN_HAIR_BOB.triangleCount,2248);assert.equal(provenance.assets.find(a=>a.key==='hairBob').originalPath,'hair/bob02/bob02_diffuse.png');
});

test('source anatomy has adult head, shoulder, hip and limb proportions without stretched limbs',()=>{
 const bounds=measuredBounds(HUMAN_BODY),height=bounds[1][1]-bounds[1][0],jaw=[...jawVertices].reduce((sum,id)=>sum+originalPositions[id][1],0)/jawVertices.size;
 const cranialFraction=(bounds[1][1]-jaw)/height,shoulderFraction=distance(bone('upperarm_l').head,bone('upperarm_r').head)/height,hipFraction=distance(bone('thigh_l').head,bone('thigh_r').head)/height;
 assert.ok(cranialFraction>.11&&cranialFraction<.17,'head is oversized or compressed');
 assert.ok(shoulderFraction>.17&&shoulderFraction<.27,'shoulder width is implausible');assert.ok(hipFraction>.10&&hipFraction<.19,'hip width is implausible');
 for(const [region,min,max]of [['upperarm',.11,.18],['lowerarm',.11,.18],['thigh',.21,.29],['calf',.18,.27]]){
  const left=length(bone(region+'_l')),right=length(bone(region+'_r'));
  assert.ok(left/height>min&&left/height<max,region+' is stretched relative to the body');assert.ok(Math.abs(left-right)/Math.max(left,right)<.01,region+' has unexplained asymmetry');
 }
 assert.ok(bone('neck_01').head[1]>bone('upperarm_l').head[1]);assert.ok(bone('thigh_l').head[1]>bone('calf_l').head[1]);assert.ok(bone('calf_l').head[1]>bone('foot_l').head[1]);
});
