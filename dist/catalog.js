import {buildLegacyStorefronts} from './legacy-storefronts-v11.js?v=23.0.0';
import {installPlayableStores} from './playable-stores.js?v=44.0.0';
import {PRODUCT_PHOTOS} from './product-photos.js?v=44.0.0';
import {PRODUCT_CORRECTIONS} from './catalog-corrections-v8.js?v=23.0.0';
import {improveProductLinks} from './catalog-links-v7.js?v=23.0.0';
import {ADDITIONS} from './catalog-v6.js?v=23.0.0';
import {NEW_STORES,EXPANSION_PRODUCTS} from './catalog-expansion.js?v=23.0.0';
import {PRODUCTS as ORIGINAL_PRODUCTS} from './catalog-original.js?v=23.0.0';
import {EXTRA} from './catalog-data.js?v=23.0.0';
export const CHECKED_ON='2026-10-24';
export const DISTRICTS=[
 {id:'market',name:'Market Walk',subtitle:'Everyday prices & treasure hunts',emoji:'🛍',color:'#b17c4d',ground:'#e6e9cf',stores:['ross','marshalls','target','oldnavy','hm']},
 {id:'central',name:'Central Square',subtitle:'High street, sneakers & creative finds',emoji:'👟',color:'#5c8390',ground:'#dae6d8',stores:['uniqlo','levis','nike','adidas','lego']},
 {id:'gallery',name:'Gallery Court',subtitle:'Beauty, tech & designer favorites',emoji:'✨',color:'#81799a',ground:'#e5e1d0',stores:['sephora','apple','nordstrom','coach','longchamp','tory']},
 {id:'avenue',name:'Luxury Avenue',subtitle:'Fashion houses & forever pieces',emoji:'👜',color:'#987245',ground:'#e8dec3',stores:['gucci','prada','lv','hermes']},
 {id:'garden',name:'Garden Promenade',subtitle:'Movement, small joys & the planted bridge',emoji:'🌿',color:'#3a8b76',ground:'#d3e9d1',stores:[]},
 {id:'terrace',name:'Jewel Court',subtitle:'Jewelry, house fragrances & the glass-roof terrace',emoji:'💎',color:'#9d6c8e',ground:'#eadce6',stores:[]}
];
const st=(id,name,tier,district,color,light,npc,sub)=>({id,name,tier,district,color,light,npc,sub,policy:30,greeting:`Welcome to ${name}. Take your time with the collection. Check the real brand source, compare your options, and choose what works for your budget.`});
export const STORES=[
 st('ross','Ross',0,'market','#a65f4c','#f1d6b8','Maya','DRESS FOR LESS'),
 st('marshalls','Marshalls',0,'market','#467b91','#cddfdc','Theo','THE TREASURE HUNT'),
 st('target','Target',0,'market','#b94c3e','#eddfcc','Sam','EVERYDAY ESSENTIALS'),
 st('oldnavy','Old Navy',0,'market','#3c5d77','#d7e0dc','Riley','WARDROBE ON A BUDGET'),
 st('hm','H&M',1,'market','#b65c56','#f0e2cd','Alex','HIGH-STREET STYLE'),
 st('uniqlo','UNIQLO',1,'central','#b84b3e','#efdbb9','Aki','LIFEWEAR ESSENTIALS'),
 st('levis','Levi’s',1,'central','#9b574d','#e5d6b8','Jamie','DENIM ORIGINALS'),
 st('nike','Nike',2,'central','#525e53','#e2e3cf','Jordan','SPORT & STREET'),
 st('adidas','adidas',2,'central','#486e88','#d7e4de','Kai','THE THREE STRIPES'),
 st('lego','LEGO',2,'central','#c9a348','#f5e2a8','Eli','BUILD SOMETHING YOU LOVE'),
 st('sephora','Sephora',3,'gallery','#555a53','#e5e0d2','Zoe','THE BEAUTY EDIT'),
 st('apple','Apple',3,'gallery','#87938d','#e7e8dd','Morgan','A LITTLE EVERYDAY TECH'),
 st('nordstrom','Nordstrom',3,'gallery','#627b59','#dfe5c6','Jules','YOUR SIGNATURE STYLE'),
 st('coach','Coach',4,'gallery','#9b714f','#ead9b7','Drew','CRAFTED TO KEEP'),
 st('longchamp','Longchamp',4,'gallery','#56775f','#dbe4c9','Léa','LE PLIAGE & BEYOND'),
 st('tory','Tory Burch',4,'gallery','#c18c47','#f1ddba','Tess','SIGNATURE HARDWARE'),
 st('gucci','Gucci',5,'avenue','#67704d','#e5dfbf','Luca','THE HOUSE COLLECTION'),
 st('prada','Prada',5,'avenue','#5a7570','#d8e2d1','Sofia','MODERN MILANESE STYLE'),
 st('lv','Louis Vuitton',5,'avenue','#826143','#e3cf9e','Camille','THE ART OF TRAVEL'),
 st('hermes','Hermès',6,'avenue','#c87c32','#f2d39f','Luc','CRAFT & CURIOSITY'),
 ...NEW_STORES.map(n=>({...st(n.id,n.name,n.tier,n.district,n.color,n.light,n.npc,n.sub)}))
];
const sizes={shoes:['6','7','8','9','10'],sandals:['6','7','8','9','10'],pants:['28','30','32','34','36'],shorts:['XS','S','M','L','XL'],shirt:['XS','S','M','L','XL'],hoodie:['XS','S','M','L','XL'],cardigan:['XS','S','M','L','XL'],jacket:['XS','S','M','L','XL'],belt:['80 cm','85 cm','90 cm','95 cm','100 cm']};
const colors={shoes:'#dedac6',sandals:'#a58d63',shirt:'#9aaa86',hoodie:'#b6ab90',pants:'#57758b',jacket:'#86957c',bag:'#916a47',backpack:'#818c69',buildingtoy:'#8aa26c',skincare:'#dadcc5',lipstick:'#a65f58',makeup:'#bd9275',earbuds:'#e7e7da',headphones:'#9da49b',speaker:'#aab0a4',bottle:'#91aaa5',tumbler:'#b7c8ac'};
const descriptions={shoes:'Real sneaker or shoe model.',sandals:'Real sandal model.',shirt:'Real top from the brand collection.',hoodie:'Real fleece or hoodie model.',pants:'Real trouser or denim model.',jacket:'Real outerwear model.',bag:'Real handbag model.',backpack:'Real backpack model.',buildingtoy:'Real LEGO building set.',skincare:'Real skincare product. No skin-care advice is provided.',lipstick:'Real lip color or balm.',makeup:'Real makeup product.',mascara:'Real mascara product.',earbuds:'Real wireless earbud model.',headphones:'Real headphone model.',speaker:'Real speaker model.',bottle:'Real reusable bottle.',tumbler:'Real drink tumbler.',digitalwatch:'Real digital watch model.',cardgame:'Real card game.',stationery:'Real writing instrument.',tracker:'Real item-tracker model.',stylus:'Real digital stylus.',mouse:'Real computer mouse.',keyboard:'Real keyboard model.',charger:'Real power-adapter model.',cable:'Real charging cable.',hat:'Real hat from the brand collection.',wallet:'Real small-leather-goods model.',perfume:'Real fragrance product.'};
export const PRODUCTS=[...ORIGINAL_PRODUCTS,...EXPANSION_PRODUCTS,...Object.entries(EXTRA).flatMap(([store,rows])=>rows.map((r,i)=>{
 const mixed=!r.brand;const brand=mixed?r.reference:r.brand;const reference=mixed?'':r.reference;
 return {id:`${store}-x${i+1}`,store,name:r.name,brand,type:r.type,price:Math.round(r.price*100),retail:Math.round(r.price*(store==='ross'||store==='marshalls'?1.65:1)*100),source:r.source,reference,assetKey:`${store}-x${i+1}`,sizes:sizes[r.type]||['One size'],color:colors[r.type]||'#b5aa8a',material:descriptions[r.type]||'A real product from the official brand collection.',finalSale:['skincare','lipstick','mascara','makeup','perfume'].includes(r.type)};
}))];
// Accessible early-game accessories, identities verified against official brand pages.
PRODUCTS.push(
 {id:'nike-v5-cap',store:'nike',brand:'Nike',name:'Club Unstructured Futura Wash Cap',type:'hat',price:2600,retail:2600,color:'#4e6257',sizes:['S/M','M/L','L/XL'],material:'Cotton twill cap. Illustrated color; simulated sizing and price.',source:'https://www.nike.com/gb/t/club-unstructured-futura-wash-cap-WDLHM6/FB5368-011',assetKey:'nike-v5-cap'},
 {id:'nike-v5-crossbody',store:'nike',brand:'Nike',name:'Heritage Crossbody Bag (4L)',type:'crossbody',price:2700,retail:2700,color:'#3f4853',sizes:['One size'],material:'Real 4L crossbody bag model. Illustrated color; simulated price.',source:'https://www.nike.com/t/bolsa-bandolera-heritage-4l-5NLbPq',assetKey:'nike-v5-crossbody'},
 {id:'levis-v5-belt',store:'levis',brand:'Levi’s',name:'Reversible Belt',type:'belt',price:3500,retail:5500,color:'#6d503c',sizes:['80 cm','85 cm','90 cm','95 cm','100 cm'],material:'Reversible belt with square metal buckle. Game size labels and price.',source:'https://www.levi.com/US/en_US/accessories/men/reversible-belt/p/004BV0000',assetKey:'levis-v5-belt'}
);
PRODUCTS.push(...ADDITIONS);
improveProductLinks(PRODUCTS);
for(const p of PRODUCTS)Object.assign(p,PRODUCT_CORRECTIONS[p.id]||{});
export const CORE_STORES=STORES.slice();
const legacyProducts=PRODUCTS.map(p=>({...p}));
buildLegacyStorefronts(CORE_STORES.map(st=>({...st})),legacyProducts,PRODUCT_PHOTOS);
installPlayableStores(STORES,PRODUCTS,PRODUCT_PHOTOS);
const activeIds=new Set(PRODUCTS.map(p=>p.id));
export const ARCHIVED_PRODUCTS=legacyProducts.filter(p=>!activeIds.has(p.id)).map(p=>({...p,archived:true}));
for(const district of DISTRICTS)district.stores=CORE_STORES.filter(st=>st.district===district.id).map(st=>st.id);
export const UNIQUE_MODELS=new Set(PRODUCTS.map(p=>p.brand+' · '+p.name)).size;
const storeItems=new Map();for(const p of PRODUCTS){if(!storeItems.has(p.store))storeItems.set(p.store,[]);storeItems.get(p.store).push(p);}export const productsForStore=id=>storeItems.get(typeof id==='string'?id:id?.id)||[];
for(const store of STORES){const entries=productsForStore(store.id);const low=Math.floor(Math.min(...entries.map(p=>p.price))/100),high=Math.ceil(Math.max(...entries.map(p=>p.price))/100);store.range=entries.length?`$${low.toLocaleString('en-US')}–$${high.toLocaleString('en-US')}`:store.catalogStatus==='service'?'Services & experiences':'Catalog in research';store.count=entries.length;store.products=entries;}
export const VENUES=[
 {id:'coffee',name:'Starbucks coffee stop',emoji:'☕',district:'market',description:'Real drink names. Game prices. A little caffeine for the next lap.'},
 {id:'food',name:'Food court',emoji:'🥪',district:'central',description:'Lunch, a snack, and somewhere to put your shopping bags.'},
 {id:'popup',name:'The Pop-Up Pavilion',emoji:'🎪',district:'gallery',description:'A rotating showcase of real products. Collect a daily stamp and a game coupon.'},
 {id:'rest',local:true,name:'Atrium gardens',emoji:'🌳',district:'avenue',description:'Quiet benches and a free half-hour rest.'},
 {id:'photo',local:true,name:'Photo booth',emoji:'📷',district:'central',description:'Collect a district postcard for your shopping passport.'},
 {id:'services',name:'Guest services',emoji:'ℹ️',district:'gallery',description:'Complimentary package check, request board, directory, and calendar.'},
 {id:'bridge',name:'Garden bridge',short:'BRIDGE',emoji:'🌉',district:'garden',description:'A planted link between places. Take a restorative walk.'},
 {id:'carousel',name:'Carousel court',short:'CAROUSEL',emoji:'🎠',district:'garden',description:'A little joy beneath the carousel lights.'},
 {id:'flowers',name:'Flower studio',short:'FLOWERS',emoji:'💐',district:'market',description:'A small flower arranging workshop.'},
 {id:'cinema',name:'The Galleria cinema',short:'CINEMA',emoji:'🎬',district:'central',description:'Put your bags down for a seated matinée.'},
 {id:'art',name:'Sculpture court',short:'ART',emoji:'🎨',district:'avenue',description:'A slower look around the original art installations.'},
 {id:'lounge',name:'Terrace tea lounge',short:'TEA',emoji:'🍵',district:'terrace',description:'A warm drink and a view across Jewel Court.'}
];
export const POPUPS=[
 {id:'botanicals',title:'Build & Bloom',host:'LEGO Botanicals showcase',store:'lego',description:'Orchids, bonsai, and flowers that last. Explore four real building sets.',products:['lego-x1','lego-x2','lego-x3','lego-x5']},
 {id:'sneakers',title:'The Sneaker Archive',host:'adidas classics showcase',store:'adidas',description:'Meet the Samba, Gazelle, Spezial, and Campus. A little sneaker history, one pair at a time.',products:['adidas-x1','adidas-x2','adidas-x3','adidas-x6']},
 {id:'beauty',title:'The Beauty Counter',host:'Sephora beauty showcase',store:'sephora',description:'Explore real cult favorites and try a simulated product demo.',products:['sephora-x1','sephora-x2','sephora-x3','sephora-x10']},
 {id:'craft',title:'Made to Carry',host:'Coach craftsmanship showcase',store:'coach',description:'Discover real Coach silhouettes and plan your next considered purchase.',products:['coach-x1','coach-x2','coach-x4','coach-x5']}
];

POPUPS.push(
 {id:'stationery',title:'The Thoughtful Desk',host:'MUJI stationery showcase',store:'muji',description:'Discover actual everyday writing and organization products.',products:['muji-v4-1','muji-v4-2','muji-v4-3','muji-v4-4']},
 {id:'running',title:'Your Own Pace',host:'New Balance classics showcase',store:'newbalance',description:'Explore real New Balance sneaker models, one considered step at a time.',products:['newbalance-v4-1','newbalance-v4-2','newbalance-v4-3','newbalance-v4-4']},
 {id:'bluebox',title:'A Little Blue Box',host:'Tiffany & Co. jewelry showcase',store:'tiffany',description:'Look closely at real jewelry designs and plan a future keepsake.',products:['tiffany-v4-1','tiffany-v4-2','tiffany-v4-3','tiffany-v4-4']},
 {id:'fragrance',title:'The Fragrance Salon',host:'CHANEL fragrance showcase',store:'chanel',description:'Explore actual named fragrances in a simulated scent-counter experience.',products:['chanel-v4-1','chanel-v4-2','chanel-v4-3','chanel-v4-4']}
);
