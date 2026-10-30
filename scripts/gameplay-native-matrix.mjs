// Every scenario uses a fresh native session. Never enables Safari automation or installs browsers.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {spawnSync,spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),runner=fileURLToPath(new URL('./gameplay-browser-qa.mjs',import.meta.url));
const args=Object.fromEntries(process.argv.slice(2).map(v=>{const i=v.indexOf('=');assert.ok(i>0);return [v.slice(0,i).replace(/^--/,''),v.slice(i+1)];}));
const browser=args.browser||'firefox',base=args.base||'http://127.0.0.1:4318/Mallside/',driver=args.driver||'http://127.0.0.1:'+(browser==='firefox'?4445:4444);assert.ok(['firefox','safari'].includes(browser));
for(const u of [base,driver])assert.ok(['localhost','127.0.0.1','[::1]'].includes(new URL(u).hostname));
const listing=spawnSync(process.execPath,[runner,'--list=true'],{cwd:root,encoding:'utf8'});assert.equal(listing.status,0,listing.stderr);let cases=JSON.parse(listing.stdout);if(args.match)cases=cases.filter(n=>n.includes(args.match));assert.ok(cases.length);
cases.sort((a,b)=>Number(b.startsWith('v38'))-Number(a.startsWith('v38'))||a.localeCompare(b));
const release=await fetch(base+'release.json').then(r=>r.json()),html=await fetch(base).then(r=>r.text()),styles=[...html.matchAll(/href="([^\"]+\.css)"/g)].map(m=>m[1]);
const fingerprint=createHash('sha256').update(JSON.stringify({release,styles,test:readFileSync(runner,'utf8')})).digest('hex'),folder=root+'build/qa/'+browser+'-matrix';mkdirSync(folder,{recursive:true});const reports=[];
for(const [i,name]of cases.entries()){
 const key=createHash('sha256').update(name).digest('hex').slice(0,12),path=folder+'/'+key+'.json',log=folder+'/'+key+'.log';
 if(args.resume==='true'&&existsSync(path)){const d=JSON.parse(readFileSync(path,'utf8'));if(d.fingerprint===fingerprint){reports.push(d);console.log(JSON.stringify({name,status:'reused-pass'}));continue;}}
 console.log(JSON.stringify({index:i+1,total:cases.length,name,status:'running'}));const started=Date.now(),argv=[runner,'--browser='+browser,'--base='+base,'--driver='+driver,'--match='+name,...args.binary?['--binary='+args.binary]:[]];
 const output=await new Promise(resolve=>{const p=spawn(process.execPath,argv,{cwd:root,stdio:['ignore','pipe','pipe']});let out='';p.stdout.on('data',d=>out+=d);p.stderr.on('data',d=>out+=d);p.on('exit',code=>resolve({code,out}));});writeFileSync(log,output.out);assert.equal(output.code,0,'Native scenario failed: '+name+' · '+log);
 const d=JSON.parse(readFileSync(root+'build/qa/'+browser+'-gameplay-report.json','utf8'));assert.deepEqual(d.errors,[]);assert.deepEqual(d.release,release);assert.deepEqual(new Set(d.results.map(r=>r.name)),new Set([name,'no captured game exceptions or unexpected console errors']));
 const stored={...d,fingerprint,styles};writeFileSync(path,JSON.stringify(stored,null,2)+'\n');reports.push(stored);console.log(JSON.stringify({index:i+1,name,status:'passed',ms:Date.now()-started}));
}
const results=[...new Map(reports.flatMap(d=>d.results).map(r=>[r.name,r])).values()],summary={browser,release,styles,capabilities:reports[0].capabilities,sessions:reports.length,passed:results.length,results,errors:reports.flatMap(d=>d.errors),resourceWarnings:reports.flatMap(d=>d.resourceWarnings),inputRetries:reports.flatMap(d=>d.inputRetries)};writeFileSync(root+'build/qa/'+browser+'-matrix-report.json',JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify({browser,passed:summary.passed,sessions:summary.sessions,errors:summary.errors.length,warnings:summary.resourceWarnings.length}));
