import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,dirname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {PRODUCT_PHOTOS}from'../dist/product-photos.js';
const root=fileURLToPath(new URL('../',import.meta.url)),site=resolve(root,'build/site/Mallside');
const walk=d=>readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(resolve(d,e.name)):[resolve(d,e.name)]);
const files=walk(site),release=JSON.parse(readFileSync(resolve(site,'release.json'),'utf8'));
assert.equal(release.sourceVisibility,'public');
assert.equal(release.sourceRepository,'https://github.com/YouKnowJP/Mallside');
assert.equal(files.filter(p=>p.endsWith('.js')).length,1,'Ship one generated bundle, not editable source modules');
assert.ok(/^app-[A-Z0-9]+\.js$/.test(release.bundle));
for(const path of files){
 const name=relative(site,path).replaceAll('\\','/');
 assert.ok(!/(?:^|\/)(?:\.DS_Store|Thumbs\.db|desktop\.ini|__MACOSX)(?:\/|$)|(?:^|\/)\._/i.test(name),'File-manager metadata in public artifact: '+name);
 assert.ok(!/\.map$|(?:^|\/)(?:tests|docs|scripts|\.git|\.github|node_modules|source)(?:\/|$)/.test(name),'Development material in public artifact: '+name);
 if(/\.html$|\.css$/.test(path))for(const m of readFileSync(path,'utf8').matchAll(/(?:href|src)=["']([^"']+)["']|url\(['"]?([^)'"\s]+)['"]?\)/g)){
  const value=m[1]||m[2];if(/^(?:[a-z]+:|#|\/\/)/i.test(value))continue;
  assert.ok(!value.startsWith('/'),'Root path would break /Mallside/ hosting');
  assert.ok(existsSync(resolve(dirname(path),value.split(/[?#]/)[0])),'Missing generated dependency: '+value);
 }
}
for(const p of Object.values(PRODUCT_PHOTOS))assert.ok(existsSync(resolve(site,p.path)),'Missing photographed product: '+p.path);
assert.ok(!readFileSync(resolve(site,release.bundle),'utf8').includes('sourceMappingURL='));
for(const [source,dest]of [['LICENSE','LICENSE.txt'],['THIRD_PARTY_NOTICES.md','THIRD_PARTY_NOTICES.txt'],['PRIVACY.md','PRIVACY.txt']])assert.equal(readFileSync(resolve(root,source),'utf8'),readFileSync(resolve(site,dest),'utf8'));
console.log(`Public artifact verified: ${files.length} files; one minified bundle, all catalog photos and required notices; no source maps or development tree.`);
