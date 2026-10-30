// Disposable native validation. Never enables automation or installs browsers.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,existsSync,appendFileSync,unlinkSync} from 'node:fs';
import {spawnSync,spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url)),runner=root+'scripts/gameplay-browser-qa.mjs';
const args=Object.fromEntries(process.argv.slice(2).map(v=>{const i=v.indexOf('=');assert.ok(i>0);return [v.slice(0,i).replace(/^--/,''),v.slice(i+1)];}));
const browser=args.browser||'firefox',base=args.base||'http://127.0.0.1:4318/Mallside/',driver=args.driver||'http://127.0.0.1:'+(browser==='firefox'?4445:4444),reuseWindow=args['reuse-window']==='true';
assert.ok(['firefox','safari'].includes(browser));
for(const u of [base,driver])assert.ok(['localhost','127.0.0.1','[::1]'].includes(new URL(u).hostname));
const listing=spawnSync(process.execPath,[runner,'--list=true'],{cwd:root,encoding:'utf8'});
assert.equal(listing.status,0,listing.stderr);
let cases=JSON.parse(listing.stdout);if(args.match)cases=cases.filter(n=>n.includes(args.match));assert.ok(cases.length);
cases.sort((a,b)=>Number(b.match(/^v(\d+)/)?.[1]||0)-Number(a.match(/^v(\d+)/)?.[1]||0)||a.localeCompare(b));
const release=await fetch(base+'release.json').then(r=>r.json()),html=await fetch(base).then(r=>r.text()),styles=[...html.matchAll(/href="([^\"]+\.css)"/g)].map(m=>m[1]);
const isolation=reuseWindow?'retained-window':'fresh-session';
const headless=args.headless==='true';assert.ok(!headless||browser==='firefox','Headless mode is Firefox-only');
const fingerprint=createHash('sha256').update(JSON.stringify({release,styles,isolation,headless,test:readFileSync(runner,'utf8'),matrix:readFileSync(fileURLToPath(import.meta.url),'utf8')})).digest('hex');
const folder=root+'build/qa/'+browser+'-matrix';mkdirSync(folder,{recursive:true});const reports=[];
if(args['await-foreground']==='true')for(const suffix of ['-foreground-go','-foreground-ready.json']){const p=root+'build/qa/'+browser+suffix;if(existsSync(p))unlinkSync(p);}
let retainedSession=null,foregroundRequested=false;
try{
 for(const [i,name]of cases.entries()){
  const key=createHash('sha256').update(name).digest('hex').slice(0,12),path=folder+'/'+key+'.json',log=folder+'/'+key+'.log';
  if(args.resume==='true'&&existsSync(path)){
   const d=JSON.parse(readFileSync(path,'utf8'));
   if(d.fingerprint===fingerprint){assert.equal(d.isolation,isolation);reports.push(d);console.log(JSON.stringify({name,status:'reused-pass'}));continue;}
  }
  console.log(JSON.stringify({index:i+1,total:cases.length,name,status:'running',isolation}));
  const started=Date.now(),argv=[runner,'--browser='+browser,'--base='+base,'--driver='+driver,'--match='+name];
  if(args.binary)argv.push('--binary='+args.binary);
  if(headless)argv.push('--headless=true');
  if(args['await-foreground']==='true'&&!foregroundRequested){argv.push('--await-foreground=true');foregroundRequested=true;}
  if(reuseWindow){argv.push('--keep=true');if(retainedSession)argv.push('--session='+retainedSession,'--session-report='+root+'build/qa/'+browser+'-gameplay-report.json');}
  writeFileSync(log,'');
  const output=await new Promise((resolve,reject)=>{
   const child=spawn(process.execPath,argv,{cwd:root,stdio:['ignore','pipe','pipe']});let out='';
   for(const stream of [child.stdout,child.stderr])stream.on('data',d=>{out+=d;appendFileSync(log,d);});
   child.on('error',reject);child.on('exit',code=>resolve({code,out}));
  });
  const sessionRecord=output.out.split('\n').flatMap(line=>{try{return [JSON.parse(line)];}catch{return [];}}).find(d=>d.session&&d.release);
  // Capture the owned session even on failure so finally can close it.
  if(reuseWindow&&sessionRecord)retainedSession=sessionRecord.session;
  assert.equal(output.code,0,'Native scenario failed: '+name+' · '+log);assert.ok(sessionRecord?.session);
  const d=JSON.parse(readFileSync(root+'build/qa/'+browser+'-gameplay-report.json','utf8'));
  assert.deepEqual(d.errors,[]);assert.deepEqual(d.release,release);
  assert.deepEqual(new Set(d.results.map(r=>r.name)),new Set([name,'no captured game exceptions or unexpected console errors']));
  const stored={...d,session:sessionRecord.session,isolation,headless,fingerprint,styles};
  writeFileSync(path,JSON.stringify(stored,null,2)+'\n');reports.push(stored);
  console.log(JSON.stringify({index:i+1,name,status:'passed',ms:Date.now()-started}));
 }
 const results=[...new Map(reports.flatMap(d=>d.results).map(r=>[r.name,r])).values()];
 const summary={browser,release,styles,isolation,headless,capabilities:reports[0].capabilities,scenarios:reports.length,sessions:new Set(reports.map(r=>r.session)).size,passed:results.length,results,errors:reports.flatMap(d=>d.errors),resourceWarnings:reports.flatMap(d=>d.resourceWarnings),inputRetries:reports.flatMap(d=>d.inputRetries)};
 writeFileSync(root+'build/qa/'+browser+'-matrix-report.json',JSON.stringify(summary,null,2)+'\n');
 console.log(JSON.stringify({browser,passed:summary.passed,scenarios:summary.scenarios,sessions:summary.sessions,errors:summary.errors.length,warnings:summary.resourceWarnings.length}));
}finally{
 if(retainedSession){const response=await fetch(driver+'/session/'+retainedSession,{method:'DELETE',signal:AbortSignal.timeout(45000)});assert.ok(response.ok,'Owned retained session did not close');}
}
