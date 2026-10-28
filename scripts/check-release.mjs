import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import {resolve,dirname,extname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createAssetInventory} from './create-asset-inventory.mjs';

const root=fileURLToPath(new URL('../',import.meta.url)),dist=resolve(root,'dist');
const read=p=>readFileSync(resolve(root,p),'utf8');
const walk=dir=>readdirSync(dir,{withFileTypes:true}).filter(e=>!['.git','node_modules','.openai','build'].includes(e.name)).flatMap(e=>e.isDirectory()?walk(resolve(dir,e.name)):[resolve(dir,e.name)]);
const files=walk(dist);let references=0;
function localReference(file,target){
 if(!target||/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(target))return;
 const path=decodeURIComponent(target.split(/[?#]/)[0]);if(!path)return;
 assert.ok(!path.startsWith('/'),'Origin-root URL breaks project hosting: '+target+' in '+relative(root,file));
 const resolved=resolve(dirname(file),path);
 assert.ok(resolved.startsWith(root),'Reference escapes repository: '+target);
 assert.ok(existsSync(resolved),'Missing local reference '+target+' in '+relative(root,file));references++;
}

for(const file of files){
 const extension=extname(file);
 if(extension==='.js'){
  const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  for(const match of readFileSync(file,'utf8').matchAll(/(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)(['"])(\.{1,2}\/[^'"]+)\1/g))localReference(file,match[2]);
 }
 if(extension==='.html')for(const match of readFileSync(file,'utf8').matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/g))localReference(file,match[1]);
 if(extension==='.css')for(const match of readFileSync(file,'utf8').matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g))localReference(file,match[1]);
}
for(const file of walk(root).filter(p=>extname(p)==='.md'&&!p.startsWith(dist))){
 for(const match of readFileSync(file,'utf8').matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g))localReference(file,match[1]);
}
for(const [source,shipped] of [['LICENSE','dist/LICENSE.txt'],['THIRD_PARTY_NOTICES.md','dist/THIRD_PARTY_NOTICES.txt'],['PRIVACY.md','dist/PRIVACY.txt']]){
 assert.equal(read(source),read(shipped),'Shipped notice differs from '+source);
}
assert.ok(read('dist/index.html').includes('href="legal.html"'),'Missing player-facing rights link');
assert.ok(read('LICENSE').includes('MALLSIDE PROPRIETARY LICENSE'),'Missing game license');
assert.ok(read('dist/vendor/THREE-LICENSE.txt').includes('Permission is hereby granted'),'Missing Three.js notice');
assert.ok(read('dist/assets/character/LICENSE-CC0.md').includes('CC0'),'Missing character notice');
assert.equal(JSON.parse(read('package.json')).license,'SEE LICENSE IN LICENSE');
assert.equal(existsSync(resolve(root,'.openai')),false,'Deployment-specific identity must not be imported');
for(const file of walk(root)){
 assert.ok(statSync(file).size<95*1024*1024,'File exceeds safe GitHub size: '+relative(root,file));
 assert.ok(!/\.(?:pem|key|p12|pfx)$/.test(file),'Unexpected private-key file: '+relative(root,file));
}
assert.deepEqual(JSON.parse(read('docs/ASSET_INVENTORY.json')),createAssetInventory(),'Photo inventory is stale: run npm run inventory and review the diff');
console.log(`Release checks passed: ${files.filter(p=>p.endsWith('.js')).length} browser modules, ${references} local references, notices and current photo hashes. Ready for root or /Mallside/ static hosting.`);
