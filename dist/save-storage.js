// Browser-local, one-generation backups. Primary saves retain their original JSON format.
export const SAVE_MODES=['career','free'];
export const saveKey=mode=>{if(!SAVE_MODES.includes(mode))throw Error('Unknown save mode.');return 'mallside-'+mode;};
export const backupKey=mode=>saveKey(mode)+'-backup';
export function saveChecksum(raw){let n=2166136261;for(let i=0;i<raw.length;i++)n=Math.imul(n^raw.charCodeAt(i),16777619);return (n>>>0).toString(16).padStart(8,'0');}
export function createSaveStorage(storage,{decode,createState,now=Date.now}){
 const heads=new Map(),blocked=new Set();
 const parse=(raw,mode)=>{const state=decode(raw);if(!!state.sandbox!==(mode==='free'))throw Error('This save belongs to the other game mode.');return state;};
 function readBackup(raw,mode){
  if(raw===null)return null;
  try{const v=JSON.parse(raw);if(v?.format!=='mallside-last-good'||v.version!==1||v.mode!==mode||typeof v.raw!=='string'||v.checksum!==saveChecksum(v.raw))return null;return {raw:v.raw,state:parse(v.raw,mode),savedAt:Number.isSafeInteger(v.savedAt)&&v.savedAt>=0&&v.savedAt<=8640000000000000?v.savedAt:null};}catch{return null;}
 }
 function inspect(mode){
  const key=saveKey(mode);let raw=null,backupRaw=null;
  try{raw=storage.getItem(key);backupRaw=storage.getItem(backupKey(mode));}catch{return {mode,status:'unavailable',reason:'unavailable',raw,backupRaw,backup:null,state:null};}
  const backup=readBackup(backupRaw,mode);
  if(raw===null)return {mode,status:backupRaw!==null?'recovery':'new',reason:backupRaw!==null?'missing':null,raw,backupRaw,backup,state:backupRaw!==null?null:createState(mode)};
  try{return {mode,status:'ready',reason:null,raw,backupRaw,backup,state:parse(raw,mode)};}catch(error){return {mode,status:'recovery',reason:'damaged',raw,backupRaw,backup,state:null,message:error.message};}
 }
 function keepBackup(mode,raw,existing){
  if(readBackup(existing,mode)?.raw===raw)return;
  parse(raw,mode);
  storage.setItem(backupKey(mode),JSON.stringify({format:'mallside-last-good',version:1,mode,savedAt:now(),raw,checksum:saveChecksum(raw)}));
 }
 function open(mode){
  let slot=inspect(mode);heads.set(mode,slot.raw);
  if(['recovery','unavailable'].includes(slot.status))blocked.add(mode);else blocked.delete(mode);
  // Protect a valid existing save immediately, without rewriting or migrating its primary bytes.
  if(slot.status==='ready'&&!slot.backup){try{keepBackup(mode,slot.raw,slot.backupRaw);slot=inspect(mode);}catch{slot.warning='backup-unavailable';}}
  return slot;
 }
 const failed=(reason,snapshot)=>({ok:false,reason,snapshot});
 function encoded(mode,state){const raw=JSON.stringify(state);parse(raw,mode);return raw;}
 function write(mode,state){
  const slot=inspect(mode);
  if(blocked.has(mode)||!heads.has(mode))return failed('recovery',slot);
  if(slot.status==='unavailable')return failed('unavailable',slot);
  if(slot.raw!==heads.get(mode)){blocked.add(mode);return failed('changed',slot);}
  if(slot.status==='recovery'){blocked.add(mode);return failed('recovery',slot);}
  let raw;try{raw=encoded(mode,state);}catch{return failed('invalid',slot);}
  if(raw===slot.raw&&slot.backup)return {ok:true,backup:slot.backup};
  try{keepBackup(mode,slot.raw??raw,slot.backupRaw);}catch{return failed('backup-write',slot);}
  try{storage.setItem(saveKey(mode),raw);}catch{return failed('primary-write',slot);}
  heads.set(mode,raw);return {ok:true,backup:readBackup(storageSafeBackup(mode),mode)};
 }
 function storageSafeBackup(mode){try{return storage.getItem(backupKey(mode));}catch{return null;}}
 function replace(mode,state,expected){
  const slot=inspect(mode);
  if(slot.status==='unavailable')return failed('unavailable',slot);
  if(!expected||slot.raw!==expected.raw||slot.backupRaw!==expected.backupRaw)return failed('changed',slot);
  let raw;try{raw=encoded(mode,state);}catch{return failed('invalid',slot);}
  // A healthy pre-restore save becomes the undo backup. Damaged data never replaces a good backup.
  const previous=slot.status==='ready'?slot.raw:!slot.backup?raw:null;
  if(previous!==null)try{keepBackup(mode,previous,slot.backupRaw);}catch{return failed('backup-write',slot);}
  try{storage.setItem(saveKey(mode),raw);}catch{return failed('primary-write',slot);}
  heads.set(mode,raw);blocked.delete(mode);return {ok:true,state:parse(raw,mode)};
 }
 function restore(mode,expected){if(!expected?.backup)return failed('no-backup',inspect(mode));return replace(mode,expected.backup.state,expected);}
 return {open,inspect,write,replace,restore,expected:mode=>heads.get(mode),backup:mode=>inspect(mode).backup};
}
