// Construction profiles, not manufacturer CAD or measured dimensions. Every bag SKU gets a profile.
// Exact photograph colors and foreground measurements are applied by product-appearance separately.
const BAG_TYPES=new Set(['bag','crossbody','backpack','duffel','wallet']);
const RULES=[
 [/bow bag charm/,'bow-charm',{silhouette:'pouch',aspect:1.3,taper:1,roundness:.04,depthRatio:.07,construction:'structured',carry:'hand',handles:'none',closure:'open',detail:'bow-charm',finish:'leather',sizeClass:'charm'}],
 [/luggage tag.*passport|passport cover/,'passport-set',{silhouette:'wallet',aspect:.75,taper:1,roundness:.04,depthRatio:.10,construction:'structured',carry:'hand',handles:'none',closure:'open',detail:'passport-set',sizeClass:'wallet'}],
 [/spinner|carry.on.*luggage/,'spinner',{silhouette:'box',aspect:.67,taper:1,roundness:.10,depthRatio:.57,construction:'structured',carry:'hand',handles:'single',closure:'zip',detail:'spinner',sizeClass:'luggage'}],
 [/cloud sleeve/,'phone-sleeve',{silhouette:'pouch',aspect:.70,taper:1,roundness:.10,depthRatio:.12,construction:'padded',carry:'crossbody',handles:'none',closure:'open',detail:'phone-sleeve',finish:'nylon',sizeClass:'mini'}],
 [/palloncin/,'palloncino',{silhouette:'pouch',aspect:.85,taper:.5,roundness:.48,depthRatio:.62,construction:'structured',carry:'hand',handles:'single',closure:'drawstring',detail:'gathered-neck',finish:'metal',sizeClass:'mini'}],
 [/idalia/,'idalia',{silhouette:'box',aspect:1.65,taper:.96,roundness:.06,depthRatio:.24,construction:'soft',carry:'shoulder',handles:'single',closure:'flap',detail:'bead-fringe',finish:'leather',pattern:'beaded'}],
 [/saddle/,'saddle',{silhouette:'saddle',aspect:1.28,taper:1,roundness:.22,depthRatio:.255,construction:'structured',carry:'shoulder',handles:'single',closure:'flap',detail:'dior-saddle'}],
 [/round mini|lunetta/,'crescent',{silhouette:'crescent',aspect:1.65,taper:1,roundness:.45,depthRatio:.36,construction:'soft',carry:'crossbody',handles:'none',closure:'zip',detail:'curved-zip'}],
 [/jackie/,'jackie',{silhouette:'hobo',aspect:1.48,taper:.86,roundness:.22,depthRatio:.17,construction:'structured',carry:'shoulder',handles:'single',closure:'turnlock',detail:'jackie-piston',handleDropRatio:.73}],
 [/bamboo 1947/,'bamboo',{silhouette:'satchel',aspect:1.36,taper:.82,roundness:.16,depthRatio:.43,construction:'structured',carry:'hand',handles:'single',closure:'flap',detail:'bamboo-handle'}],
 [/horsebit/,'horsebit',{silhouette:'flap',aspect:1.50,taper:.97,roundness:.14,depthRatio:.33,construction:'structured',carry:'shoulder',handles:'none',closure:'flap',detail:'horsebit'}],
 [/marmont/,'marmont',{silhouette:'flap',aspect:1.73,taper:1,roundness:.20,depthRatio:.27,construction:'padded',carry:'shoulder',handles:'none',closure:'flap',detail:'gucci-gg',pattern:'chevron',chain:true}],
 [/dionysus/,'dionysus',{silhouette:'flap',aspect:1.70,taper:1,roundness:.08,depthRatio:.32,construction:'structured',carry:'shoulder',handles:'none',closure:'flap',detail:'dionysus-clasp',chain:true}],
 [/ophidia/,'ophidia',{silhouette:'box',aspect:1.35,taper:.94,roundness:.22,depthRatio:.30,construction:'structured',carry:'crossbody',handles:'none',closure:'zip',detail:'gucci-web',pattern:'gg'}],
 [/gg emblem/,'gg-emblem',{silhouette:'tote',aspect:1.15,taper:1.16,roundness:.10,depthRatio:.40,construction:'soft',carry:'shoulder',handles:'double',closure:'open',detail:'gucci-web',pattern:'gg'}],
 [/pillow tabby/,'pillow-tabby',{silhouette:'flap',aspect:1.65,taper:1,roundness:.30,depthRatio:.34,construction:'padded',carry:'shoulder',handles:'single',closure:'flap',detail:'coach-c',paddedEdges:true}],
 [/tabby/,'tabby',{silhouette:'flap',aspect:1.82,taper:1,roundness:.11,depthRatio:.28,construction:'structured',carry:'shoulder',handles:'single',closure:'flap',detail:'coach-c'}],
 [/swing zip|swinger/,'swing-zip',{silhouette:'box',aspect:2.05,taper:1.05,roundness:.15,depthRatio:.32,construction:'structured',carry:'shoulder',handles:'double',closure:'zip',detail:'coach-hangtag'}],
 [/juliet/,'juliet',{silhouette:'hobo',aspect:1.72,taper:.92,roundness:.31,depthRatio:.25,construction:'soft',carry:'shoulder',handles:'single',closure:'zip',detail:'coach-hangtag'}],
 [/hamptons|brooklyn|belted ergo/,'coach-hobo',{silhouette:'hobo',aspect:1.20,taper:.88,roundness:.27,depthRatio:.34,construction:'soft',carry:'shoulder',handles:'single',closure:'open',detail:'coach-hangtag'}],
 [/chelsea/,'chelsea',{silhouette:'flap',aspect:1.70,taper:1.04,roundness:.20,depthRatio:.29,construction:'soft',carry:'shoulder',handles:'single',closure:'flap',detail:'coach-hangtag',flapDip:.18}],
 [/rowan|rogue/,'coach-satchel',{silhouette:'satchel',aspect:1.40,taper:.95,roundness:.13,depthRatio:.50,construction:'structured',carry:'hand',handles:'double',closure:'zip',detail:'coach-hangtag'}],
 [/le roseau/,'roseau',{silhouette:'bucket',aspect:.86,taper:.86,roundness:.12,depthRatio:.45,construction:'soft',carry:'shoulder',handles:'single',closure:'turnlock',detail:'roseau-toggle',finish:'suede'}],
 [/le pliage.*backpack/,'pliage-backpack',{silhouette:'backpack',aspect:.80,taper:.78,roundness:.18,depthRatio:.45,construction:'soft',carry:'backpack',handles:'single',closure:'flap',detail:'pliage',finish:'nylon'}],
 [/le pliage.*pouch/,'pliage-pouch',{silhouette:'tote',aspect:1.55,taper:1.20,roundness:.09,depthRatio:.35,construction:'soft',carry:'hand',handles:'single',closure:'zip',detail:'pliage',finish:'nylon',trim:'#754930',sizeClass:'mini'}],
 [/le pliage/,'pliage',{silhouette:'tote',aspect:1.45,taper:1.45,roundness:.07,depthRatio:.41,construction:'soft',carry:'shoulder',handles:'double',closure:'zip',detail:'pliage',trim:'#754930'}],
 [/galleria/,'galleria',{silhouette:'satchel',aspect:1.38,taper:.92,roundness:.07,depthRatio:.45,construction:'structured',carry:'hand',handles:'double',closure:'zip',detail:'prada',finish:'saffiano'}],
 [/cleo/,'cleo',{silhouette:'hobo',aspect:1.45,taper:.88,roundness:.34,depthRatio:.13,construction:'structured',carry:'shoulder',handles:'single',closure:'open',detail:'prada',finish:'glazed',topDip:.20}],
 [/arqué|arque/,'arque',{silhouette:'crescent',aspect:1.48,taper:1,roundness:.43,depthRatio:.25,construction:'structured',carry:'shoulder',handles:'single',closure:'zip',detail:'prada'}],
 [/re.edition|re.nylon.*shoulder|re.nylon.*mini/,'re-edition',{silhouette:'hobo',aspect:1.43,taper:.92,roundness:.24,depthRatio:.30,construction:'soft',carry:'shoulder',handles:'single',closure:'zip',detail:'prada'}],
 [/neverfull/,'neverfull',{silhouette:'tote',aspect:1.66,taper:1.50,roundness:.05,depthRatio:.30,construction:'soft',carry:'shoulder',handles:'double',closure:'open',detail:'neverfull',pattern:'lv',trim:'#bd8654'}],
 [/onthego/,'onthego',{silhouette:'tote',aspect:1.32,taper:1,roundness:.04,depthRatio:.43,construction:'structured',carry:'shoulder',handles:'double',closure:'open',detail:'lv-handle-patches',pattern:'lv',trim:'#bd8654'}],
 [/néonoé|neonoe|petit noé|petit noe/,'noe',{silhouette:'bucket',aspect:.95,taper:1.10,roundness:.12,depthRatio:.60,construction:'soft',carry:'shoulder',handles:'none',closure:'drawstring',detail:'drawstring',pattern:'lv',trim:'#bd8654'}],
 [/alma/,'alma',{silhouette:'satchel',aspect:1.30,taper:.80,roundness:.35,depthRatio:.44,construction:'structured',carry:'hand',handles:'double',closure:'zip',detail:'lv-padlock',pattern:'lv',trim:'#bd8654'}],
 [/pochette métis|pochette metis/,'metis',{silhouette:'flap',aspect:1.40,taper:1,roundness:.06,depthRatio:.29,construction:'structured',carry:'crossbody',handles:'single',closure:'turnlock',detail:'lv-slock',pattern:'lv',trim:'#bd8654'}],
 [/speedy|keepall/,'speedy',{silhouette:'duffel',aspect:1.55,taper:1,roundness:.32,depthRatio:.60,construction:'soft',carry:'hand',handles:'double',closure:'zip',detail:'speedy',pattern:'lv',trim:'#bd8654'}],
 [/evelyne/,'evelyne',{silhouette:'box',aspect:.82,taper:.96,roundness:.22,depthRatio:.22,construction:'soft',carry:'crossbody',handles:'none',closure:'open',detail:'evelyne-h',finish:'pebble'}],
 [/birkin|kelly/,'hermes-satchel',{silhouette:'satchel',aspect:1.35,taper:.86,roundness:.07,depthRatio:.44,construction:'structured',carry:'hand',handles:'double',closure:'turnlock',detail:'turnlock'}],
 [/calvi|bastia|zippy|clémence|clemence|victorine|card.?holder|mini wallet|wallet|organizer|key pouch/,'wallet',{silhouette:'wallet',aspect:1.65,taper:1,roundness:.05,depthRatio:.12,construction:'structured',carry:'hand',handles:'none',closure:'flap',detail:'wallet-seam',sizeClass:'wallet'}],
 [/mombasa/,'mombasa',{silhouette:'hobo',aspect:1.02,taper:.85,roundness:.50,depthRatio:.29,construction:'soft',carry:'shoulder',handles:'single',closure:'open',detail:'ysl-horn',topDip:.38}],
 [/icarino/,'icarino',{silhouette:'hobo',aspect:.95,taper:.80,roundness:.45,depthRatio:.22,construction:'padded',carry:'hand',handles:'single',closure:'open',detail:'ysl',pattern:'diamond',integratedHandle:true}],
 [/icare/,'icare',{silhouette:'tote',aspect:1.35,taper:1.24,roundness:.20,depthRatio:.35,construction:'padded',carry:'shoulder',handles:'double',closure:'open',detail:'ysl',pattern:'diamond'}],
 [/le 5 à 7|le 5 a 7/,'le5a7',{silhouette:'hobo',aspect:.94,taper:.87,roundness:.16,depthRatio:.35,construction:'soft',carry:'shoulder',handles:'single',closure:'turnlock',detail:'ysl',topDip:.12}],
 [/simone/,'simone',{silhouette:'flap',aspect:1.95,taper:1,roundness:.03,depthRatio:.18,construction:'soft',carry:'hand',handles:'none',closure:'flap',detail:'ysl',envelope:true}],
 [/loulou/,'loulou',{silhouette:'flap',aspect:1.45,taper:1,roundness:.19,depthRatio:.33,construction:'padded',carry:'shoulder',handles:'none',closure:'flap',detail:'ysl',pattern:'chevron',chain:true}],
 [/kate small/,'kate',{silhouette:'flap',aspect:1.57,taper:1,roundness:.03,depthRatio:.22,construction:'structured',carry:'shoulder',handles:'none',closure:'flap',detail:'ysl',chain:true}],
 [/sac de jour/,'sac-de-jour',{silhouette:'satchel',aspect:1.30,taper:.87,roundness:.04,depthRatio:.45,construction:'structured',carry:'hand',handles:'double',closure:'open',detail:'accordion-gussets'}],
 [/gaby vanity/,'gaby',{silhouette:'box',aspect:1.4,taper:1,roundness:.10,depthRatio:.45,construction:'structured',carry:'hand',handles:'single',closure:'zip',detail:'ysl',pattern:'diamond'}],
 [/mini jodie|\bjodie\b|small veneta|baby campana|small campana|\bcampana\b/,'jodie',{silhouette:'hobo',aspect:1.85,taper:1,roundness:.40,depthRatio:.33,construction:'soft',carry:'shoulder',handles:'single',closure:'zip',detail:'woven-knot',pattern:'woven'}],
 [/andiamo clutch/,'andiamo-clutch',{silhouette:'flap',aspect:2.20,taper:1,roundness:.10,depthRatio:.18,construction:'structured',carry:'hand',handles:'none',closure:'flap',detail:'andiamo-knot',pattern:'woven'}],
 [/andiamo/,'andiamo',{silhouette:'tote',aspect:1.40,taper:1.05,roundness:.08,depthRatio:.45,construction:'soft',carry:'hand',handles:'double',closure:'open',detail:'andiamo-knot',pattern:'woven'}],
 [/baby barbara/,'barbara',{silhouette:'tote',aspect:1.35,taper:1,roundness:.10,depthRatio:.35,construction:'structured',carry:'hand',handles:'double',closure:'open',detail:'woven-handles',pattern:'woven'}],
 [/small madison/,'madison',{silhouette:'flap',aspect:1.65,taper:1.02,roundness:.12,depthRatio:.28,construction:'soft',carry:'shoulder',handles:'none',closure:'turnlock',detail:'ring-clasp',pattern:'woven',chain:true}],
 [/giorno/,'giorno',{silhouette:'flap',aspect:1.90,taper:.87,roundness:.15,depthRatio:.28,construction:'soft',carry:'hand',handles:'none',closure:'flap',detail:'side-cords',pattern:'woven'}],
 [/small lauren/,'lauren',{silhouette:'pouch',aspect:1.70,taper:.76,roundness:.32,depthRatio:.30,construction:'soft',carry:'shoulder',handles:'none',closure:'flap',detail:'tab-clasp',pattern:'woven',chain:true}],
 [/cassette/,'cassette',{silhouette:'flap',aspect:1.60,taper:1,roundness:.10,depthRatio:.27,construction:'padded',carry:'crossbody',handles:'none',closure:'flap',detail:'wide-weave',pattern:'woven',patternScale:.45}],
 [/corso|pinacoteca/,'bottega-tote',{silhouette:'tote',aspect:1.35,taper:1.30,roundness:.10,depthRatio:.40,construction:'soft',carry:'shoulder',handles:'double',closure:'open',detail:'woven-handles',pattern:'woven'}],
 [/toujours/,'toujours',{silhouette:'hobo',aspect:1.36,taper:.88,roundness:.26,depthRatio:.33,construction:'soft',carry:'shoulder',handles:'single',closure:'zip',detail:'dior-charm',pattern:'cannage',topDip:.26}],
 [/book tote|promenade/,'book-tote',{silhouette:'tote',aspect:1.28,taper:1,roundness:.03,depthRatio:.42,construction:'structured',carry:'hand',handles:'double',closure:'open',detail:'dior',pattern:'oblique'}],
 [/ella|willow tote|cargo tote|ninon|shopping|tote|marche|march[eé]|comporta|corso/,'tote',{silhouette:'tote',aspect:1.35,taper:1.16,roundness:.08,depthRatio:.36,construction:'soft',carry:'shoulder',handles:'double',closure:'open',detail:'handle-patches'}],
 [/kira|eleanor/,'tory-flap',{silhouette:'flap',aspect:1.60,taper:1,roundness:.12,depthRatio:.32,construction:'padded',carry:'shoulder',handles:'none',closure:'turnlock',detail:'tory-double-t',pattern:'diamond',chain:true}],
 [/le city/,'city',{silhouette:'satchel',aspect:1.55,taper:1.10,roundness:.16,depthRatio:.35,construction:'soft',carry:'hand',handles:'double',closure:'zip',detail:'city-studs',finish:'glazed'}],
 [/le click east west/,'click',{silhouette:'box',aspect:2.50,taper:1,roundness:.13,depthRatio:.23,construction:'soft',carry:'shoulder',handles:'single',closure:'zip',detail:'side-ties'}],
 [/marcie/,'marcie',{silhouette:'saddle',aspect:1.28,taper:1,roundness:.33,depthRatio:.28,construction:'structured',carry:'crossbody',handles:'none',closure:'flap',detail:'marcie-stitch',chain:true}],
 [/top handle tro/,'tro',{silhouette:'satchel',aspect:1.20,taper:.82,roundness:.12,depthRatio:.40,construction:'structured',carry:'hand',handles:'single',closure:'flap',detail:'raised-flower'}],
 [/kensington/,'kensington',{silhouette:'flap',aspect:1.48,taper:1,roundness:.10,depthRatio:.35,construction:'padded',carry:'shoulder',handles:'none',closure:'flap',detail:'eagle-clasp',pattern:'diamond',chain:true}],
 [/momo pouch/,'momo',{silhouette:'pouch',aspect:1.8,taper:1,roundness:.45,depthRatio:.15,construction:'soft',carry:'hand',handles:'none',closure:'zip',detail:'wrist-loop',finish:'nylon',pattern:'gingham'}],
 [/crosby hobo/,'crosby',{silhouette:'hobo',aspect:1.35,taper:.90,roundness:.25,depthRatio:.35,construction:'padded',carry:'shoulder',handles:'single',closure:'zip',detail:'quilt-panels',finish:'nylon',pattern:'diamond'}],
 [/flap crossbody/,'flap-crossbody',{silhouette:'flap',aspect:1.40,taper:1,roundness:.16,depthRatio:.28,construction:'padded',carry:'crossbody',handles:'none',closure:'flap',detail:'quilt-panels'}],
 [/belt bag/,'belt-bag',{silhouette:'box',aspect:1.58,taper:.93,roundness:.18,depthRatio:.29,construction:'soft',carry:'crossbody',handles:'none',closure:'zip',detail:'belt-buckle',finish:'nylon'}],
 [/backpack|rucksack/,'backpack',{silhouette:'backpack',aspect:.78,taper:.82,roundness:.25,depthRatio:.45,construction:'soft',carry:'backpack',handles:'single',closure:'zip',detail:'front-pocket'}],
 [/duffel|duffle|travel bag/,'duffel',{silhouette:'duffel',aspect:1.7,taper:1,roundness:.30,depthRatio:.50,construction:'soft',carry:'hand',handles:'double',closure:'zip',detail:'end-gussets'}],
 [/drawstring/,'bucket',{silhouette:'bucket',aspect:.88,taper:.85,roundness:.15,depthRatio:.52,construction:'soft',carry:'shoulder',handles:'none',closure:'drawstring',detail:'drawstring'}],
 [/matelassé|matelasse|teddy|pouch|clutch/,'pouch',{silhouette:'pouch',aspect:1.65,taper:.92,roundness:.24,depthRatio:.25,construction:'padded',carry:'hand',handles:'none',closure:'zip',detail:'gathered-edge'}],
 [/hobo/,'hobo',{silhouette:'hobo',aspect:1.35,taper:.92,roundness:.31,depthRatio:.32,construction:'soft',carry:'shoulder',handles:'single',closure:'zip',detail:'curved-seam'}],
 [/satchel|top handle/,'satchel',{silhouette:'satchel',aspect:1.42,taper:.88,roundness:.14,depthRatio:.40,construction:'structured',carry:'hand',handles:'double',closure:'zip',detail:'handle-patches'}],
 [/flap|messenger/,'flap',{silhouette:'flap',aspect:1.65,taper:1,roundness:.12,depthRatio:.28,construction:'structured',carry:'crossbody',handles:'none',closure:'flap',detail:'flap-seam'}],
];
const WORN_PHOTO_REGIONS={
 'le pliage original l tote bag':[.33,.245,.59,.46],
 'simone medium in soft leather':[.265,.54,.815,.825],
 'heritage crossbody bag (4l)':[.12,.60,.66,.98],
 'tanned leather shoulder bag':[.35,.22,.54,.455],
 'water repellent ripstop shoulder bag':[.323,.378,.51,.525],
 'water repellent 2-way shoulder bag':[.38,.365,.63,.55],
 'water repellent shoulder bag':[.455,.375,.625,.495],
};
const named={
 legoriaa:{silhouette:'box',aspect:1.6,taper:.9,roundness:.13,carry:'crossbody',handles:'none',closure:'zip',detail:'aldo-wordmark'},
 zoeyannee:{silhouette:'satchel',aspect:1.60,taper:.88,roundness:.10,carry:'hand',handles:'double',closure:'turnlock',detail:'belted-lock'},
 deandriaax:{silhouette:'flap',aspect:2.1,taper:1,roundness:.03,depthRatio:.14,carry:'shoulder',handles:'none',closure:'flap',detail:'chain',finish:'metal',chain:true},
 noemiaa:{silhouette:'tote',aspect:1.45,taper:.95,roundness:.10,carry:'hand',handles:'double',closure:'open',detail:'ring-handles'},
};

export function bagProfile(p){
 if(!p||!BAG_TYPES.has(p.type))return null;
 const n=(p.name||'').toLowerCase().normalize('NFKC'),b=(p.brand||'').toLowerCase(),m=(p.material||'').toLowerCase(),text=n+' '+m;
 let finish=/suede/.test(text)?'suede':/saffiano/.test(text)?'saffiano':/glazed|brushed leather|patent|mirror|smooth metallic/.test(text)?'glazed':/straw|raffia|rattan|natural.black|beach tote/.test(text)?'raffia':/denim/.test(text)?'denim':/nylon|re.nylon|ripstop|water repellent|water resistant|water.repellant/.test(text)?'nylon':/canvas|jacquard|cotton|monogram|oblique/.test(text)?'canvas':/pebble|grain|foulonn/.test(text)?'pebble':'leather';
 const base={silhouette:'box',aspect:1.45,taper:1,roundness:.17,depthRatio:.30,construction:'soft',carry:p.type==='crossbody'?'crossbody':p.type==='backpack'?'backpack':p.type==='wallet'?'hand':'shoulder',handles:'single',closure:'zip',detail:'edge-stitch',finish,pattern:'plain',modelFamily:'shoulder',sizeClass:/nano|mini|\bxs\b/.test(n)?'mini':/large|\bxl\b|\bl\b|39|50/.test(n)?'large':/small|\bs\b/.test(n)?'small':'medium',source:p.source||null,evidence:'catalog-name-and-material'};
 const matched=RULES.find(([re])=>re.test(n));if(matched)Object.assign(base,matched[2],{modelFamily:matched[1]});
 const item=named[n];if(item)Object.assign(base,item,{modelFamily:n,evidence:'reviewed-photograph'});
 // Manufacturer families can vary by material. Keep the actual catalog/photo material where named.
 if(/suede/.test(text))base.finish='suede';else if(/saffiano/.test(text))base.finish='saffiano';else if(/nylon|ripstop|water repellent/.test(text))base.finish='nylon';
 if(/diamond quilt/.test(n))base.pattern='diamond';else if(/quilt|cannage/.test(n)&&base.pattern==='plain')base.pattern=/cannage/.test(n)?'cannage':'diamond';
 if(/gg supreme|gg canvas|gg emblem|ophidia/.test(n))base.pattern='gg';
 if(/monogram/.test(n)&&b.includes('louis vuitton'))base.pattern='lv';
 if(/jacquard/.test(n)&&b==='coach')base.pattern='coach-jacquard';
 if(/printed|botanical|bowerbird|swimming turtles/.test(n)&&base.pattern==='plain')base.pattern='printed';
 if(/gingham/.test(n))base.pattern='gingham';if(/camo/.test(n))base.pattern='camo';
 if(b.includes('bottega')){base.pattern='woven';if(!base.detail||base.detail==='edge-stitch')base.detail='woven-handles';}
 if(b==='prada'&&base.detail==='edge-stitch')base.detail='prada';
 if(b==='nike'){base.detail='nike-swoosh';base.finish='nylon';}
 if(b==='muji'&&/cotton|canvas|marche/.test(n))base.finish='canvas';
 if(b==='longchamp'&&/le pliage original/.test(n)){base.finish='nylon';base.trim='#754930';}
 if(b==='longchamp'&&/le pliage xtra/.test(n)){base.finish='leather';base.trim=null;}
 if(/le pliage.*handbag/.test(n)){base.carry='hand';base.handleDropRatio=.35;}
 if(/le pliage.*pouch/.test(n)){base.carry='hand';base.handles='single';}
 if(/le pliage.*travel/.test(n)){base.aspect=1.65;base.carry='hand';}
 if(/mini jodie/.test(n)){base.carry='hand';base.handleDropRatio=.77;}
 if(/wallet on a chain/.test(n)){base.carry='crossbody';base.chain=true;base.handles='none';}
 if(/mini eleanor/.test(n)){base.silhouette='satchel';base.handles='single';base.carry='hand';base.pattern='plain';}
 if(/kira quilt suede/.test(n))base.finish='suede';
 if(/drawstring tote/.test(n)){base.silhouette='bucket';base.taper=.88;base.closure='drawstring';base.detail='drawstring';}
 if(/calvi|bastia/.test(n)){base.aspect=/bastia/.test(n)?1.02:1.45;base.closure='flap';}
 if(/kuromi|treat bag/.test(n)){base.silhouette='tote';base.aspect=.76;base.taper=1;base.pattern='printed';base.finish='canvas';base.detail='printed-panel';base.handles='double';}
 if(b==='nike'&&/heritage crossbody/.test(n))Object.assign(base,{modelFamily:'heritage-crossbody',silhouette:'box',aspect:1.42,handles:'none',carry:'crossbody',detail:'nike-swoosh',roundness:.20});
 if(b==='muji'&&n==='tanned leather shoulder bag')Object.assign(base,{modelFamily:'muji-leather-shoulder',silhouette:'tote',aspect:.74,taper:1.05,handles:'single',carry:'shoulder',closure:'open',detail:'edge-stitch',depthRatio:.30});
 if(b==='muji'&&n==='water repellent ripstop shoulder bag')Object.assign(base,{modelFamily:'muji-ripstop-shoulder',silhouette:'pouch',aspect:1.27,handles:'none',carry:'shoulder',closure:'drawstring',detail:'gathered-edge',finish:'nylon'});
 if(b==='muji'&&n==='water repellent 2-way shoulder bag')Object.assign(base,{modelFamily:'muji-two-way',silhouette:'hobo',aspect:1.40,handles:'single',carry:'shoulder',closure:'zip',detail:'curved-seam',finish:'nylon',topDip:.18});
 if(b==='muji'&&n==='water repellent shoulder bag')Object.assign(base,{modelFamily:'muji-crossbody',silhouette:'box',aspect:1.45,handles:'none',carry:'crossbody',closure:'zip',detail:'front-pocket',finish:'nylon',sizeClass:'mini'});
 if(b.includes('anine bing')&&/avenue/.test(n))Object.assign(base,{modelFamily:'avenue',silhouette:'box',aspect:1.42,taper:.86,roundness:.05,construction:'structured',handles:'single',carry:'shoulder',closure:'turnlock',detail:'top-frame'});
 if(b==='coach'&&n==='rogue 25')Object.assign(base,{finish:'fleece',trim:'#b9956e',construction:'soft',aspectEvidence:'reviewed-photo'});
 if(b==='lspace'&&/comporta/.test(n))Object.assign(base,{modelFamily:'comporta',silhouette:'flap',aspect:2.45,roundness:.10,handles:'single',carry:'shoulder',closure:'flap',detail:'flap-seam',finish:'raffia',aspectEvidence:'reviewed-photo'});
 if(b==='kipling'&&/elysiana/.test(n))Object.assign(base,{modelFamily:'kipling-elysiana',silhouette:'tote',aspect:1.38,taper:1,handles:'double',carry:'shoulder',closure:'zip',detail:'kipling-pocket',finish:'nylon'});
 if(b==='kipling'&&/bells/.test(n))Object.assign(base,{modelFamily:'kipling-bells',silhouette:'crescent',aspect:1.60,roundness:.44,handles:'none',carry:'crossbody',closure:'zip',detail:'kipling-monkey',finish:'nylon'});
 if(b==='dkny'&&/teddy/.test(n))Object.assign(base,{modelFamily:'dkny-teddy',silhouette:'crescent',aspect:1.48,roundness:.32,carry:'crossbody',handles:'single',closure:'flap',detail:'dkny-clasp',finish:'leather',construction:'structured'});
 if(b.includes('miu miu')&&/matelass/.test(n))Object.assign(base,{modelFamily:'miu-matelasse',silhouette:'box',aspect:2.25,roundness:.18,handles:'single',carry:'shoulder',closure:'zip',detail:'miu-plaque',pattern:'ruched'});
 if(/kensington.*drench/.test(n))Object.assign(base,{pattern:'chevron',hardwareColor:'#222222'});
 if(/kuromi|treat bag/.test(n))base.modelFamily='kuromi-treat-tote';
 if(WORN_PHOTO_REGIONS[n])Object.assign(base,{photoRegion:WORN_PHOTO_REGIONS[n],photoPresentation:'worn',aspectEvidence:'reviewed-photo'});
 if(/luggage tag.*passport/.test(n))Object.assign(base,{photoRegion:[.54,.36,.80,.52],photoPresentation:'composite',aspectEvidence:'reviewed-photo'});
 if(/bow bag charm/.test(n))Object.assign(base,{photoRegion:[.23,.54,.79,.83],photoPresentation:'isolated',aspectEvidence:'reviewed-photo'});
 if(/mini jodie/.test(n))base.reference={width:26,height:13,depth:8.5,handleDrop:10,evidence:'manufacturer-family',source:'https://www.bottegaveneta.com/en-us/mini-jodie-black-651876VCPP58803.html'};
 if(b==='dior'&&/^saddle bag/.test(n))base.reference={width:25.5,height:20,depth:6.5,handleDrop:18,evidence:'manufacturer-pictured-model',source:'https://www.dior.com/en_us/fashion/products/M0455CSRQ_M66M'};
 return base;
}
