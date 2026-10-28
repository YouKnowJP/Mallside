import {build,transform} from 'esbuild';
import {readFileSync,writeFileSync,mkdirSync,rmSync,cpSync} from 'node:fs';
import {resolve,basename,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url)),dist=resolve(root,'dist');
const output=resolve(root,'build/site/Mallside');
rmSync(resolve(root,'build/site'),{recursive:true,force:true,maxRetries:3,retryDelay:100});mkdirSync(output,{recursive:true});
const result=await build({absWorkingDir:root,entryPoints:{app:'dist/app.js'},outdir:output,entryNames:'[name]-[hash]',bundle:true,minify:true,format:'esm',platform:'browser',target:'es2020',sourcemap:false,legalComments:'eof',metafile:true,logLevel:'warning'});
const entry=Object.entries(result.metafile.outputs).find(([,v])=>v.entryPoint==='dist/app.js');
if(!entry)throw Error('Missing browser bundle');
const js=basename(entry[0]);
const cssNames={};
for(const name of ['styles.css','life-styles.css','legal.css']){
 const {code}=await transform(readFileSync(resolve(dist,name),'utf8'),{loader:'css',minify:true,legalComments:'eof'});
 const hash=createHash('sha256').update(code).digest('hex').slice(0,12),filename=name.replace('.css',`-${hash}.css`);
 writeFileSync(resolve(output,filename),code);cssNames[name]=filename;
}
for(const name of ['index.html','legal.html']){
 let html=readFileSync(resolve(dist,name),'utf8');
 html=html.replace(/app\.js\?v=[^"']+/g,js);
 html=html.replace(/href=(["'])(styles\.css|life-styles\.css|legal\.css)(?:\?[^"']*)?\1/g,(_,quote,name)=>'href='+quote+cssNames[name]+quote);
 writeFileSync(resolve(output,name),html);
}
for(const name of ['icon.svg','LICENSE.txt','THIRD_PARTY_NOTICES.txt','PRIVACY.txt','.nojekyll'])cpSync(resolve(dist,name),resolve(output,name));
const isFileManagerMetadata=name=>/^(?:\.DS_Store|Thumbs\.db|desktop\.ini|__MACOSX)$/i.test(name)||name.startsWith('._');
cpSync(resolve(dist,'assets'),resolve(output,'assets'),{recursive:true,filter:p=>{
 const path=relative(resolve(dist,'assets'),p).replaceAll('\\','/');
 return path!=='character/source'&&!path.startsWith('character/source/')&&!path.split('/').some(isFileManagerMetadata);
}});
mkdirSync(resolve(output,'vendor'),{recursive:true});cpSync(resolve(dist,'vendor/THREE-LICENSE.txt'),resolve(output,'vendor/THREE-LICENSE.txt'));
let commit=process.env.GITHUB_SHA;
if(!commit){try{commit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();}catch{commit='local-preview';}}
const pkg=JSON.parse(readFileSync(resolve(root,'package.json'),'utf8'));
writeFileSync(resolve(output,'release.json'),JSON.stringify({game:'Mallside',version:pkg.version,sourceCommit:commit,bundle:js,sourceVisibility:'public',sourceRepository:'https://github.com/YouKnowJP/Mallside',publicFiles:'Generated game only; editable source and history are available in the Mallside repository.'},null,2)+'\n');
writeFileSync(resolve(root,'build/esbuild-meta.json'),JSON.stringify(result.metafile,null,2)+'\n');
console.log(`Generated public game: build/site/Mallside/ (${js})`);
