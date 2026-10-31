import {PRODUCT_PHOTOS} from './product-photos.js?v=45.0.0';
import {PHOTO_PALETTES} from './photo-palettes.js?v=45.0.0';
import {PHOTO_SURFACES} from './photo-surfaces.js?v=45.0.0';
import {garmentProfile} from './garment-reference-rules.js?v=45.0.0';
import {bagProfile} from './bag-reference-rules.js?v=44.0.0';

export const MODEL_REFERENCES={
 roundmini:{width:28,height:17,depth:10,finish:'nylon',detail:'roundmini',carry:'crossbody',source:'https://www.uniqlo.com/us/en/products/E481610-000/00'},
 tabby26:{width:25.4,height:13.97,depth:6.985,finish:'glazed',detail:'coach-c',carry:'shoulder',handleDrop:24.13,source:'https://www.coach.com/products/tabby-shoulder-bag-26/CFQ88.html'},
 speedy25:{width:25,height:19,depth:15,finish:'canvas',pattern:'lv',detail:'speedy',carry:'hand',source:'https://us.louisvuitton.com/eng-us/products/speedy-bandouliere-25-monogram-nvprod5320019v/M46977'},
 neverfull:{width:47,baseWidth:31,height:28,depth:14,finish:'canvas',pattern:'lv',detail:'neverfull',carry:'shoulder',handleDrop:20,source:'https://br.louisvuitton.com/por-br/produtos/neverfull-mm-lezard-007653/M41177'},
 pliageL:{width:47,baseWidth:31,height:30,depth:19,finish:'nylon',detail:'pliage',carry:'shoulder',handleDrop:25,source:'https://www.longchamp.com/gb/en/products/tote-bag-l-L1899089001.html'},
 classic1112:{width:25.5,height:15.5,depth:6.5,finish:'pebble',pattern:'diamond',detail:'chanel-cc',carry:'shoulder',source:'https://www.chanel.cn/fi/fashion/p/A01112B25720UB663/classic-11-12-handbag-grained-shiny-calfskin-gold-tone-metal/'},
};
export function productAppearance(p){
 const n=(p.name||'').toLowerCase(),photo=PRODUCT_PHOTOS[p.id],palette=PHOTO_PALETTES[photo?.path],surface=PHOTO_SURFACES[photo?.path],bag=bagProfile(p),garment=bag?null:garmentProfile(p);let exact=null;
 if(/round mini shoulder/.test(n))exact=MODEL_REFERENCES.roundmini;
 else if(/tabby shoulder bag 26/.test(n)&&/CFQ88/.test(p.source||''))exact=MODEL_REFERENCES.tabby26;
 else if(/speedy.*25/.test(n))exact=MODEL_REFERENCES.speedy25;
 else if(/neverfull mm/.test(n))exact=MODEL_REFERENCES.neverfull;
 else if(/le pliage original l tote/.test(n))exact=MODEL_REFERENCES.pliageL;
 else if(/classic.*11.12/.test(n))exact=MODEL_REFERENCES.classic1112;
 if(!exact&&bag?.reference)exact={...bag.reference,source:bag.reference.source};
 const result={color:palette?.color||p.color||'#697b70',photo:photo?.path,surface,colorEvidence:palette?.reviewed?'reviewed-photograph':palette?'photo-sample':'catalog',finish:bag?.finish||garment.fabric,detail:bag?.detail||'',pattern:bag?.pattern??garment?.pattern,carry:bag?.carry,longSleeve:garment?.sleeve==='long',oversized:['relaxed','wide'].includes(garment?.fit),patternScale:bag?.patternScale||(/cassette/.test(n)?.45:1.4),dimensionsVerified:!!exact&&!exact.axesInterpreted,source:exact?.source||p.source,garment,bag};
 if(bag){
  const numeric=n.match(/(?:\s|^)(2[0-9]|3[0-9]|4[0-5])(?:\s|$|\s*\u00b7)/),size=bag.sizeClass;
  result.width=size==='charm'?10:size==='wallet'||p.type==='wallet'?13:size==='luggage'?38:numeric?Number(numeric[1]):/mini|\bxs\b/.test(n)?22:/large|\bl\b|travel/.test(n)?42:bag.silhouette==='tote'?36:bag.silhouette==='backpack'?28:30;
  const aspect=surface?.shapeEvidence==='foreground-estimate'&&surface.aspect>.5&&surface.aspect<3?bag.aspect*.75+Math.max(bag.aspect*.75,Math.min(bag.aspect*1.25,surface.aspect))*.25:bag.aspect;
  result.height=result.width/aspect;result.depth=Math.max(size==='charm'?.8:2,result.width*bag.depthRatio);if(bag.taper!==1)result.baseWidth=result.width/bag.taper;
  result.handleDrop=bag.handleDropRatio?result.height*bag.handleDropRatio:bag.carry==='shoulder'?22:undefined;
 }
 if(exact)Object.assign(result,exact);
 if(result.pattern==='plain')result.pattern='';
 result.sleeveStripes=garment&&/adidas/i.test(p.brand||'')&&(/3.stripes|three.stripes|sst/i.test(p.name))?3:0;
 result.trim=garment?.trimColor||bag?.trim||((result.detail==='pliage')?'#754930':result.pattern==='lv'?'#bd8654':result.color);
 result.hardware=bag?.hardwareColor||(/silver|pewter|gunmetal/.test(n)?'#aeb4b7':'#c9aa67');
 if((p.brand||'').toLowerCase().includes('levi')&&garment?.coverage==='bottom')result.detail='redtab';
 return result;
}
