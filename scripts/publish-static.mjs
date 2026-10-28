// Called by trusted main-branch CI. Only the generated Mallside folder is copied.
import assert from 'node:assert/strict';
import {existsSync,readFileSync,rmSync,cpSync} from 'node:fs';
import {resolve} from 'node:path';
const [artifactArg,hostArg]=process.argv.slice(2);
assert.ok(artifactArg&&hostArg,'Expected artifact and hosting checkout paths');
const artifact=resolve(artifactArg,'Mallside'),host=resolve(hostArg),target=resolve(host,'Mallside');
assert.ok(existsSync(resolve(host,'.git')),'Target must be the separate hosting checkout');
const release=JSON.parse(readFileSync(resolve(artifact,'release.json'),'utf8'));
assert.equal(release.sourceVisibility,'private');
assert.equal(release.sourceCommit,process.env.GITHUB_SHA,'Artifact must match the current tested source commit');
assert.ok(existsSync(resolve(artifact,release.bundle)),'Missing compiled entry');
rmSync(target,{recursive:true,force:true});cpSync(artifact,target,{recursive:true});
console.log('Prepared generated Mallside files in the public hosting checkout.');
