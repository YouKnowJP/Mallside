import {V40_GARMENT_OVERRIDES} from './garment-overrides-v40.js?v=40.0.0';
import {PRODUCT_PHOTOS} from './product-photos.js?v=40.0.0';

// Photograph-reviewed exceptions preserve product identity; no retailer/category logo is invented.
export const GARMENT_PHOTO_OVERRIDES={
 ...V40_GARMENT_OVERRIDES,
"assets/photos/v39-real-a5e3ece138b0a6a0da86.webp":{"kind": "tee", "sleeve": "short", "neckline": "crew", "fit": "slim", "closure": "none", "onModel": true, "photoRegion": [0.42, 0.34, 0.6, 0.57], "photoView": "front"},"assets/photos/v39-real-81dc0f258bddbacd5b06.webp":{"kind": "tee", "sleeve": "short", "neckline": "crew", "fit": "slim", "closure": "none", "onModel": true, "photoRegion": [0.4, 0.31, 0.59, 0.55], "photoView": "front"},"assets/photos/v39-real-c678c7554f7339197f9a.webp":{"kind": "polo", "sleeve": "short", "neckline": "collared", "fit": "slim", "closure": "buttons", "onModel": true, "photoRegion": [0.44, 0.26, 0.6, 0.38], "photoView": "front"},"assets/photos/v39-real-68c4b9b01af83168a25d.webp":{"kind": "shorts", "sleeve": "none", "neckline": "crew", "fit": "regular", "closure": "drawstring", "onModel": true, "photoRegion": [0.39, 0.31, 0.59, 0.52], "photoView": "front"},
 "assets/photos/v37-real-0417a09327a87ea91cd1.webp":{"kind":"tee","sleeve":"short","neckline":"crew","fit":"slim","onModel":false,"photoRegion":[0.38,0.3,0.61,0.68]},
 "assets/photos/v37-real-be7edcf1ba0722eb53f3.webp":{"kind":"tee","sleeve":"short","neckline":"crew","onModel":true,"photoRegion":[0.4,0.32,0.59,0.55]},
 "assets/photos/v37-real-cd2808650b94a694a24c.webp":{"kind":"tee","sleeve":"long","neckline":"crew","fit":"slim","onModel":false,"photoRegion":[0.41,0.25,0.62,0.63]},
 "assets/photos/v37-real-626f381aad658663d34a.webp":{"kind":"tee","sleeve":"short","neckline":"crew","closure":"none","onModel":false,"photoRegion":[0.38,0.31,0.62,0.64]},
 "assets/photos/v37-real-ee9fdd943eeaea41e5b8.webp":{"kind":"polo","sleeve":"short","neckline":"collared","onModel":true,"photoRegion":[0.42,0.29,0.61,0.52]},
 "assets/photos/v37-real-ed7f43220dabfc76053c.webp":{"kind":"pants","fit":"slim","leg":"taper","onModel":true,"photoRegion":[0.4,0.25,0.49,0.69]},
 "assets/photos/v37-real-bacf135ebf19bd59ee48.webp":{"kind":"shorts","onModel":true,"photoRegion":[0.38,0.15,0.51,0.36]},
 "assets/photos/v37-real-97de58ff2216b6f998f3.webp":{"kind":"tee","fit":"relaxed","onModel":true,"photoRegion":[0.42,0.33,0.59,0.54]},
 "assets/photos/v37-real-dffeb1f8a86c1f8b5e98.webp":{"kind":"tank","sleeve":"none","neckline":"scoop","straps":"wide","ribbing":true,"onModel":false,"photoRegion":[0.35,0.37,0.6,0.68]},
 "assets/photos/v37-real-f3edb7e563f873b8ecd8.webp":{"kind":"pants","leg":"flare","fit":"flare","onModel":false,"photoRegion":[0.34,0.3,0.44,0.69]},
 "assets/photos/v37-real-edc9a3f21079c3cb73f8.webp":{"kind":"pants","leg":"legging","fit":"slim","ribbing":true,"onModel":false,"photoRegion":[0.37,0.3,0.46,0.68]},
 "assets/photos/v37-real-f94e71e2bd3b6fdee88a.webp":{"kind":"pants","leg":"straight","onModel":false,"photoRegion":[0.34,0.32,0.43,0.72]},
 "assets/photos/v37-real-a43e5cdac3fd534a2d7a.webp":{"kind":"jacket","fit":"relaxed","pockets":2,"onModel":false,"photoRegion":[0.39,0.3,0.61,0.62]},
 "assets/photos/v37-real-6fe23b5808c6b6f6c74f.webp":{"kind":"tee","fit":"relaxed","fabric":"cotton","onModel":false,"photoRegion":[0.37,0.31,0.62,0.66]},

 'assets/photos/v11-real-cb6de8dd60311698.webp':{kind:'dress',sleeve:'none',neckline:'scoop',length:'maxi',fit:'flare',fabric:'cotton',straps:'spaghetti',photoRegion:[0.42,0.41,0.57,0.84],onModel:true,photoView:'front',photoRegionPart:'skirt-panel'},
 'assets/photos/v11-real-965fdb574e116f14.webp':{kind:'tee',sleeve:'short',neckline:'crew',length:'hip',fit:'slim',fabric:'cotton'},
 'assets/photos/v11-real-d39130eb641c484b.webp':{kind:'shirt',sleeve:'long',neckline:'collared',length:'hip',fit:'flare',fabric:'cotton',closure:'buttons',pattern:'stripe',pockets:1,hem:'peplum',photoRegion:[0.38,0.21,0.58,0.43],onModel:true,photoView:'front',photoRegionPart:'body'},
 'assets/photos/v11-real-60e89f45696b40c0.webp':{kind:'shirt',sleeve:'puff',neckline:'collared',length:'hip',fit:'relaxed',fabric:'cotton',closure:'buttons',embellishment:'embroidery'},
 'assets/photos/v12-real-12f916c3449962df8c15.webp':{kind:'shirt',sleeve:'short',neckline:'collared',length:'hip',fit:'relaxed',fabric:'knit',closure:'buttons',sheer:true,set:true,setBottom:'shorts',coverage:'full',trimPiping:true},
 'assets/photos/v11-real-b843dc56a867667e.webp':{kind:'sweater',sleeve:'long',neckline:'crew',length:'hip',fit:'relaxed',fabric:'fleece',closure:'none',photoRegion:[0.46,0.3,0.66,0.57],onModel:true,photoView:'back',photoRegionPart:'body'},
 'assets/photos/v11-real-f6ad216f5463fd17.webp':{kind:'tee',sleeve:'short',neckline:'crew',length:'hip',fit:'regular',fabric:'cotton',closure:'none',pattern:'graphic',photoRegion:[0.32,0.27,0.69,0.7],onModel:false,photoView:'front',photoRegionPart:'body'},
 'assets/photos/v12-real-206e70d3a48fdbf01782.webp':{kind:'shirt',sleeve:'short',neckline:'collared',length:'hip',fit:'regular',fabric:'cotton',closure:'buttons',pattern:'graphic',pockets:1,set:true,setBottom:'shorts',coverage:'full',photoRegion:[0.29,0.17,0.58,0.5],onModel:false,photoView:'front',photoRegionPart:'shirt-panel'},
 'assets/photos/abe9171b801460a86ca8.webp':{kind:'jacket',sleeve:'long',neckline:'hood',length:'hip',fit:'regular',fabric:'nylon',closure:'zip',quilted:true,hooded:true,photoRegion:[0.61,0.66,0.94,0.98],onModel:false,photoView:'detail',photoRegionPart:'body'},
 'assets/photos/v12-real-1f79d4d33933bff0dc4a.webp':{kind:'jacket',sleeve:'long',neckline:'collared',length:'hip',fit:'relaxed',fabric:'nylon',closure:'zip',quilted:true,pattern:'colorblock',photoRegion:[0.32,0.29,0.69,0.78],onModel:false,photoView:'front',photoRegionPart:'body'},
 'assets/photos/d08182aef5b51447c85d.webp':{kind:'pants',sleeve:'none',neckline:'crew',length:'maxi',fit:'wide',fabric:'denim',closure:'zip',pockets:5,coverage:'bottom',leg:'wide',photoRegion:[0.36,0.3,0.48,0.78],onModel:false,photoView:'front',photoRegionPart:'left-leg'},
 'assets/photos/v12-real-d79e89720ebed08b449a.webp':{kind:'coat',sleeve:'long',neckline:'collared',length:'maxi',fit:'relaxed',fabric:'knit',closure:'wrap',belted:true,photoRegion:[0.4,0.25,0.58,0.76],onModel:true,photoView:'front',photoRegionPart:'body'},
 'assets/photos/bc46563acad72a89e0e6.webp':{kind:'shirt',sleeve:'long',neckline:'collared',length:'hip',fit:'regular',fabric:'cotton',closure:'buttons',photoRegion:[0.34,0.32,0.67,0.9],onModel:false,photoView:'detail',photoRegionPart:'placket'},
 'assets/photos/f34e3eaa634c042b2afe.webp':{kind:'jacket',sleeve:'long',neckline:'crew',length:'hip',fit:'regular',fabric:'nylon',closure:'zip',pattern:'stripe',ribbing:true,trimColor:'#f3f3ee',photoRegion:[0.32,0.18,0.68,0.86],onModel:false,photoView:'front',photoRegionPart:'body'},
 'assets/photos/v12-real-f98d95d140de4d8669e3.webp':{kind:'dress',sleeve:'none',neckline:'strapless',length:'midi',fit:'slim',fabric:'silk',closure:'none',straps:'spaghetti',photoRegion:[0.42,0.29,0.59,0.75],onModel:true,photoView:'front',photoRegionPart:'body'},
 'assets/photos/v12-real-8a66b5df7f69ff019ff6.webp':{kind:'shirt',sleeve:'long',neckline:'crew',length:'hip',fit:'relaxed',fabric:'silk',closure:'buttons',sheer:true,highNeck:true},
 'assets/photos/v12-real-b9d30ff118e5bf750da6.webp':{kind:'dress',sleeve:'puff',neckline:'scoop',length:'midi',fit:'flare',fabric:'cotton',pattern:'graphic',motif:'dots',smocked:true,photoRegion:[0.46,0.22,0.58,0.68],onModel:true,photoView:'front',photoRegionPart:'body'},
 'assets/photos/v12-real-5c7c5a126d5482b870be.webp':{kind:'vest',sleeve:'short',neckline:'collared',length:'cropped',fit:'regular',fabric:'cotton',closure:'buttons',pattern:'colorblock',layered:true,photoRegion:[0.38,0.22,0.61,0.43],onModel:true,photoView:'front',photoRegionPart:'vest-panel'},
 'assets/photos/v12-real-24e7bb58f7f94f55aed1.webp':{kind:'swim',sleeve:'none',neckline:'v',length:'hip',fit:'slim',fabric:'nylon',coverage:'full',straps:'narrow',ruched:true},
 'assets/photos/v12-real-737fc23d6b22981d5ba2.webp':{kind:'swim',sleeve:'none',neckline:'scoop',length:'cropped',fit:'slim',fabric:'nylon',coverage:'bottom',rise:'high',ruched:true},
 'assets/photos/v12-real-1152877a80daac05c4e5.webp':{kind:'jumpsuit',sleeve:'none',neckline:'strapless',length:'maxi',fit:'wide',fabric:'cotton',closure:'none',pockets:2,coverage:'full',photoRegion:[0.39,0.19,0.59,0.43],onModel:true,photoView:'front',photoRegionPart:'bodice'},
 'assets/photos/v11-real-a6c2dbee82cfae97.webp':{kind:'dress',sleeve:'none',neckline:'strapless',length:'thigh',fit:'slim',fabric:'nylon',embellishment:'rhinestone',boning:true,photoRegion:[0.39,0.33,0.61,0.65],onModel:true,photoView:'front',photoRegionPart:'body'},
 'assets/photos/v12-real-a70d57ba47ba798c5185.webp':{kind:'cardigan',sleeve:'long',neckline:'collared',length:'hip',fit:'slim',fabric:'knit',closure:'buttons'},
 'assets/photos/v12-real-6b710dd5023ccf350639.webp':{kind:'dress',sleeve:'none',neckline:'halter',length:'midi',fit:'flare',fabric:'silk',pattern:'floral',hem:'high-low',straps:'halter',photoRegion:[0.39,0.28,0.63,0.62],onModel:true,photoView:'front',photoRegionPart:'skirt-panel'},
 'assets/photos/d92f2ac7c047eca294c3.webp':{kind:'bra',sleeve:'none',neckline:'scoop',length:'cropped',fit:'slim',fabric:'nylon',coverage:'upper',straps:'wide',ribbing:false},
 'assets/photos/a39b1bc37d1450da4a2e.webp':{kind:'tank',sleeve:'none',neckline:'collared',length:'hip',fit:'slim',fabric:'cotton',closure:'buttons',ribbing:true},
 'assets/photos/v11-real-56c97581d33591ec.webp':{kind:'tank',sleeve:'none',neckline:'strapless',length:'cropped',fit:'slim',fabric:'nylon',pattern:'graphic',motif:'dots',straps:'spaghetti',sheer:true,boning:true},
 'assets/photos/v11-real-5cb2382a209ab639.webp':{kind:'dress',sleeve:'none',neckline:'scoop',length:'midi',fit:'slim',fabric:'nylon',straps:'spaghetti',hem:'asymmetric',embellishment:'rhinestone',ruched:true,photoRegion:[0.42,0.3,0.59,0.55],onModel:true,photoView:'front',photoRegionPart:'body'},
 'assets/photos/v11-real-7769b1e7afe1c044.webp':{kind:'vest',sleeve:'none',neckline:'scoop',length:'cropped',fit:'regular',fabric:'nylon',closure:'none',special:'bag-strap',quilted:true},
 'assets/photos/v11-real-3e9fc7ec02e8d8dd.webp':{kind:'tank',sleeve:'none',neckline:'halter',length:'cropped',fit:'slim',fabric:'knit',closure:'none',straps:'halter',ribbing:false,motif:'raised-cord'},
 'assets/photos/v11-real-e77477791b6b8243.webp':{kind:'tee',sleeve:'short',neckline:'crew',length:'cropped',fit:'slim',fabric:'knit',closure:'none',sheer:true,motif:'lace'},
 'assets/photos/v12-real-db3f099f071a42bf9260.webp':{kind:'dress',sleeve:'none',neckline:'strapless',length:'midi',fit:'flare',fabric:'silk',closure:'none',pattern:'floral',straps:'spaghetti',hem:'high-low',ruffles:true},
 'assets/photos/v12-real-a0bd0781901ceabb200e.webp':{kind:'skirt',sleeve:'none',neckline:'crew',length:'midi',fit:'flare',fabric:'knit',closure:'wrap',coverage:'bottom',pleats:true,buckles:2,photoRegion:[0.39,0.18,0.63,0.52],onModel:true,photoView:'front',photoRegionPart:'skirt-panel'},
 'assets/photos/v11-real-0a6882a5480a9763.webp':{kind:'dress',sleeve:'none',neckline:'strapless',length:'maxi',fit:'slim',fabric:'silk',closure:'wrap',pattern:'floral',ruched:true,photoRegion:[0.42,0.33,0.58,0.88],onModel:true,photoView:'front',photoRegionPart:'body'},
 'assets/photos/v11-real-0de62b56a7b99d2c.webp':{kind:'tee',sleeve:'long',neckline:'crew',length:'cropped',fit:'slim',fabric:'nylon',closure:'none',pattern:'floral',sheer:true},
};

export function garmentProfile(p={}){
 const n=String(p.name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(),type=p.type||'shirt',brand=String(p.brand||'').toLowerCase(),path=p.photo||PRODUCT_PHOTOS[p.id]?.path;
 let kind='tee';
 // Name-specific forms take precedence over the older commerce category.
 if(/jumpsuit|romper|boilersuit|playsuit|catsuit/.test(n))kind='jumpsuit';
 else if(/swim|one[ -]piece|bikini|bathing|triangle top|bodysuit/.test(n))kind='swim';
 else if(/\bbra\b|bralette/.test(n))kind='bra';
 else if(/\bbrief\b|\bthong\b|underwear|panties/.test(n))kind='shorts';
 else if(/\bdress\b|gown|caftan|kaftan|robe bebe/.test(n)&&!/dress shirt|dress pant|dress trouser/.test(n))kind='dress';
 else if(/skirt|\bkilt\b/.test(n))kind='skirt';
 else if(/\bvest\b|gilet|waistcoat/.test(n))kind='vest';
 else if(/\bcoat\b|overcoat|trench|manteau|chesterfield/.test(n))kind='coat';
 else if(type==='pants'||/\bpants?\b|trouser|jeans?|legging|jogger|sweatpant|pantalone/.test(n))kind='pants';
 else if(type==='shorts'||/\bshorts\b|bermuda|sweatshort/.test(n))kind='shorts';
 else if(type==='jacket'||/jacket|blazer|blouson|bomber|overshirt|parka|anorak|shacket|windbreaker|biker|track top/.test(n))kind='jacket';
 else if(/cardigan/.test(n))kind='cardigan';
 else if(/hoodie|hooded/.test(n))kind='hoodie';
 else if(/\bpolo\b/.test(n)&&!/sweater|sweatshirt|quarter[ -]?zip|half[ -]?zip|1\/4 zip/.test(n))kind='polo';
 else if(/tank|singlet|camisole|corset|bustier/.test(n))kind='tank';
 else if(/sweater|sweatshirt|pullover|quarter[ -]?zip|half[ -]?zip|1\/4 zip|crew neck|girocollo|cozy crew/.test(n)&&!/\bt[ -]?shirt\b|\btee\b|long.sleeve t/.test(n))kind='sweater';
 else if(/shirt|blouse|henley|tunic|button.front|button.down|placket/.test(n)&&!/\bt[ -]?shirt\b/.test(n))kind='shirt';
 else if(brand==='scott barber')kind='shirt';
 else if(type==='hoodie')kind='hoodie';
 else if(type==='cardigan')kind='sweater';
 let sleeve=['tank','bra','swim','vest','pants','shorts','skirt'].includes(kind)?'none':['shirt','sweater','hoodie','cardigan','jacket','coat'].includes(kind)?'long':kind==='dress'||kind==='jumpsuit'?'none':'short';
 if(/long[ -]?sleeve|longsleeve/.test(n))sleeve='long';if(/short[ -]?sleeve|cap[p]?ed sleeve|\bss\b/.test(n))sleeve='short';if(/sleeveless|strapless|halter|off[ -]the[ -]shoulder/.test(n))sleeve='none';if(/puff sleeve|bubble sleeve/.test(n))sleeve='puff';
 if(kind==='polo'&&!/long[ -]?sleeve|longsleeve/.test(n))sleeve='short';
 let neckline=kind==='hoodie'?'hood':['shirt','polo','jacket','coat','vest'].includes(kind)?'collared':['tank','bra','swim','dress'].includes(kind)?'scoop':'crew';
 if(/v[ -]?neck|plunge|cowl.neck/.test(n))neckline='v';if(/crew|round neck|girocollo/.test(n))neckline='crew';if(/halter/.test(n))neckline='halter';if(/strapless|bandeau/.test(n))neckline='strapless';if(/high[ -]?neck|mock[ -]?neck|turtle[ -]?neck/.test(n))neckline='crew';
 let length=['dress','skirt'].includes(kind)?'midi':kind==='coat'?'thigh':['pants','jumpsuit'].includes(kind)?'maxi':['bra','shorts'].includes(kind)?'cropped':'hip';
 if(/mini\b|short dress/.test(n))length='thigh';if(/midi|\bkilt\b/.test(n))length='midi';if(/maxi|gown|caftan|kaftan|long dress|long coat|overcoat/.test(n))length='maxi';if(/crop|shrunken|waist length|longline bra|corset/.test(n))length='cropped';if(kind==='dress'&&/^long |long split/.test(n))length='maxi';if(kind==='jacket'&&/short parka/.test(n))length='hip';if(kind==='cardigan'&&/long|duster/.test(n))length='thigh';
 let fit='regular';if(/slim|skinny|bodycon|second.skin|compression|legging|rigor|align high|wunder train.*tight|airlift.*legging/.test(n)||['bra','swim','tank'].includes(kind))fit='slim';else if(/wide|barrel|balloon|baggy|loose.*pant/.test(n))fit='wide';else if(/relax|oversize|loose|boyfriend|dropped|flowy|caftan|kaftan/.test(n))fit='relaxed';if(/flare|boot[ -]?cut|a[ -]line|fit.*flare/.test(n))fit='flare';
 let fabric='cotton';if(/denim|jeans?|trucker/.test(n)||(/levi/.test(brand)&&['pants','shorts'].includes(kind)))fabric='denim';else if(/suede/.test(n))fabric='suede';else if(/leather|vegan leather/.test(n))fabric='leather';else if(/velvet|velour/.test(n))fabric='velvet';else if(/tweed|boucle|herringbone/.test(n))fabric='tweed';else if(/silk|satin|chiffon|cowl|slip dress/.test(n))fabric='silk';else if(/fleece|sweat|sherpa|powerblend|accolade|scuba|synchilla|polaire/.test(n))fabric='fleece';else if(/cashmere|knit|crochet|merino|ribbed|sweater|wool|maille|maglia/.test(n)||['sweater','cardigan'].includes(kind))fabric='knit';else if(/nylon|puffer|pufftech|nuptse|down|shell|rain|futurelight|pertex|wind|dri.fit|swim|airlift|airbrush|alosoft|warpstreme|legging|water.repell|luon/.test(n)||['bra','swim'].includes(kind))fabric='nylon';
 let closure=['shirt','polo','cardigan','coat'].includes(kind)?'buttons':['jacket','hoodie','pants'].includes(kind)?'zip':'none';if(kind==='hoodie'&&!/zip/.test(n))closure='none';if(kind==='jacket'&&/blazer|chore|trucker|overshirt/.test(n))closure='buttons';if(/zip|half.zip|quarter.zip/.test(n))closure='zip';if(/wrap|\bkilt\b/.test(n))closure='wrap';
 let pattern='plain';if(/stripe|4.bar|3.stripes|microstripe/.test(n))pattern='stripe';else if(/plaid|check|pied de poule|prince of wales|tartan/.test(n))pattern='plaid';else if(/floral|flower|garden|delfino|serpentine|botanical|pip floral/.test(n))pattern='floral';else if(/color[ -]?block|two.tone|multicolor/.test(n))pattern='colorblock';else if(/graphic|artwork|logo|mascot|bear|polka|print|tapestry|monopoly|nascar|\bjersey\b/.test(n))pattern='graphic';
 const underwear=/\bbrief\b|\bthong\b|underwear|panties/.test(n),coverage=['pants','shorts','skirt'].includes(kind)||/swimsuit bottom|bikini bottom/.test(n)?'bottom':['dress','jumpsuit'].includes(kind)||kind==='swim'&&!/\btop\b/.test(n)?'full':'upper';
 let pockets=['pants','shorts'].includes(kind)?2:['jacket','coat','cardigan','hoodie'].includes(kind)?2:0;if(/cargo/.test(n))pockets=4;if(/5 pocket|jeans?|trucker/.test(n))pockets=5;if(/one pocket|pocket tee|pocket shirt/.test(n))pockets=1;if(underwear||['bra','swim','skirt','dress'].includes(kind))pockets=0;
 const profile={kind,sleeve,neckline,length,fit,fabric,closure,pattern,pockets,coverage,highNeck:/high[ -]?neck|mock[ -]?neck|turtle[ -]?neck/.test(n),leg:/legging|compression|rigor|tight/.test(n)?'legging':/boot[ -]?cut|flare/.test(n)?'flare':/barrel|balloon/.test(n)?'barrel':/jogger|sweatpant|track pant/.test(n)?'jogger':/taper/.test(n)?'taper':fit==='wide'?'wide':'straight',bodysuit:/bodysuit/.test(n),seams:true,ribbing:/rib|knit|fleece|sweat/.test(n)||['sweater','hoodie','cardigan'].includes(kind),pleats:/pleat|\bkilt\b/.test(n),quilted:/quilt|puffer|pufftech|down|nuptse|padded/.test(n),hooded:kind==='hoodie'||/hood|parka/.test(n),sheer:/sheer|mesh|lace/.test(n),underwear,rise:/high[ -]?waist|high.rise/.test(n)?'high':/low[ -]?waist|low.rise/.test(n)?'low':'regular',hem:/high.low/.test(n)?'high-low':/asymmetr/.test(n)?'asymmetric':'straight',evidence:'catalog-name',source:p.source,photo:path};
 const reviewed=GARMENT_PHOTO_OVERRIDES[path];if(reviewed){Object.assign(profile,reviewed,{evidence:'photo-reviewed',reviewed:true,onModel:reviewed.onModel??reviewed.special!=='bag-strap'});if(!reviewed.coverage)profile.coverage=['dress','jumpsuit'].includes(profile.kind)?'full':['pants','shorts','skirt'].includes(profile.kind)?'bottom':'upper';}
 if(profile.coverage==='bottom')profile.sleeve='none';
 return profile;
}
