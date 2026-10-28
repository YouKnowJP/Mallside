// Product identities and descriptions checked against the linked official brand sources.
// Prices, availability, grading and store placement are game data, not live retail offers.
export const CHECKED_ON='2026-10-24';
export const STORES=[
 {id:'ross',name:'Ross',sub:'DRESS FOR LESS',tier:0,color:'#a65f4c',light:'#f1d6b8',policy:30,range:'$10–$45',u:.45,v:.45,w:2.4,d:2.2,npc:'Maya',greeting:'Welcome! The best finds take a little looking. Check the label before the price.'},
 {id:'marshalls',name:'Marshalls',sub:'THE TREASURE HUNT',tier:0,color:'#467b91',light:'#cddfdc',policy:30,range:'$13–$70',u:3.3,v:.45,w:2.4,d:2.2,npc:'Theo',greeting:'A fresh delivery came in this morning. Compare the same item across stores to spot a deal.'},
 {id:'uniqlo',name:'UNIQLO',sub:'LIFEWEAR ESSENTIALS',tier:1,color:'#b84b3e',light:'#efdbb9',policy:30,range:'$20–$60',u:6.15,v:.45,w:2.4,d:2.2,npc:'Aki',greeting:'Simple things, made for everyday life. The fitting rooms are ready when you are.'},
 {id:'nordstrom',name:'Nordstrom',sub:'YOUR SIGNATURE STYLE',tier:2,color:'#627b59',light:'#dfe5c6',policy:30,range:'$85–$165',u:.45,v:6.15,w:2.4,d:2.2,npc:'Jules',greeting:'Let’s find something you’ll use for years. Your budget matters as much as your style.'},
 {id:'lv',name:'Louis Vuitton',sub:'THE ART OF TRAVEL',tier:3,color:'#826143',light:'#e3cf9e',policy:30,range:'$590–$3,050',u:3.3,v:6.15,w:2.4,d:2.2,npc:'Camille',greeting:'Welcome to the maison. Explore the real collection names and take time with each piece.'},
 {id:'hermes',name:'Hermès',sub:'CRAFT & CURIOSITY',tier:4,color:'#c87c32',light:'#f2d39f',policy:30,range:'$180–$2,525',u:6.15,v:6.15,w:2.4,d:2.2,npc:'Luc',greeting:'Bonjour. A scarf, a sandal, a keepsake. A styling appointment lets you take a closer look.'}
];
const source={
 hanes:'https://www.hanes.com/beefy-tees-for-all',
 jeans:'https://www.levi.com/US/en_US/clothing/men/jeans/straight/501-original-mens-jeans/p/005013724',
 pack:'https://www.jansport.com/products/superbreak-plus-js0a4que',
 stan:'https://www.adidas.com/us/leather_upper-stan_smith',
 champion:'https://www.champion.com/collections/mens-powerblend',
 kanken:'https://www.fjallraven.com/us/en-us/bags-gear/kanken/kanken-bags/kanken/',
 casio:'https://www.casio.com/us/watches/casio/product.F-91W-1/',
 uniqlo:'https://www.uniqlo.com/us/en/contents/lifewear-magazine/so-many-tshirts-so-many-styles/',
 round:'https://www.uniqlo.com/us/en/products/E481610-000/00',
 longchamp:'https://www.longchamp.com/us/en/products/handbag-l-L1626089002.html',
 birken:'https://www.birkenstock.com/us/arizona-birko-flor-nubuck/arizona-core-birkoflornubuck-0-eva-u_650.html',
 samba:'https://www.adidas.com/us/samba-og-shoes/HP7903.html',
 jo:'https://www.jomalone.com/scents/woody/wood-sage-sea-salt',
 neverfull:'https://us.louisvuitton.com/eng-us/products/neverfull-mm-other-leathers-nvprod7310027v/M27521',
 zippy:'https://us.louisvuitton.com/eng-us/products/zippy-wallet-monogram-013178/M42616',
 belt:'https://us.louisvuitton.com/eng-us/products/lv-initiales-40mm-reversible-belt-monogram-nvprod2540214v/M0566Q',
 sneaker:'https://en.louisvuitton.com/eng-nl/products/run-away-sneaker-nvprod7540100v/1AKBK4',
 speedy:'https://us.louisvuitton.com/eng-us/products/speedy-bandouliere-25-monogram-nvprod5320019v/M46977',
 scarf:'https://www.hermes.com/us/en/product/brides-de-gala-en-fleurs-scarf-90-H004192Sv08/',
 oran:'https://www.hermes.com/us/en/product/oran-sandal-H202230ZvD1/',
 clic:'https://www.hermes.com/us/en/product/clic-h-bracelet-H700001FP19GM/',
 nil:'https://www.hermes.com/us/en/product/un-jardin-sur-le-nil-eau-de-toilette-V20396/',
 evelyne:'https://www.hermes.com/uk/en/product/evelyne-16-amazone-bag-H069426CKDS/'
};
const p=(id,store,name,brand,type,price,retail,color,material,key,extra={})=>({id,store,name,brand,type,price:Math.round(price*100),retail:Math.round(retail*100),color,material,source:source[key],assetKey:key,sizes:['XS','S','M','L','XL'],...extra});
const shoes=['6','7','8','9','10'];const one=['One size'];
export const PRODUCTS=[
 p('r-tee','ross','Beefy-T cotton T-shirt','Hanes','shirt',9.99,15,'#667d54','Ring-spun cotton crew-neck tee.','hanes'),
 p('r-jeans','ross','501 Original Jeans','Levi’s','pants',34.99,84.95,'#577591','Straight leg with the signature button fly.','jeans',{sizes:['28','30','32','34','36']}),
 p('r-bag','ross','SuperBreak Plus backpack','JanSport','backpack',24.99,48,'#a36c4c','Daypack with laptop sleeve and bottle pocket.','pack',{sizes:one}),
 p('r-shoes','ross','Stan Smith shoes','adidas','shoes',44.99,100,'#e5e6d6','Classic low-top tennis-inspired sneakers.','stan',{sizes:shoes}),
 p('r-knit','ross','Powerblend Full-Zip Hoodie','Champion','hoodie',24.99,55,'#a9a591','Midweight fleece zip hoodie.','champion',{finalSale:true}),
 p('m-tee','marshalls','Beefy-T cotton T-shirt','Hanes','shirt',12.99,15,'#667d54','Ring-spun cotton crew-neck tee.','hanes'),
 p('m-knit','marshalls','Powerblend Full-Zip Hoodie','Champion','hoodie',29.99,55,'#a9a591','Midweight fleece zip hoodie.','champion'),
 p('m-bag','marshalls','Kånken backpack','Fjällräven','backpack',69.99,95,'#a77d48','Classic rectangular daypack with carry handles.','kanken',{sizes:one}),
 p('m-shoes','marshalls','Stan Smith shoes','adidas','shoes',49.99,100,'#e5e6d6','Classic low-top tennis-inspired sneakers.','stan',{sizes:shoes}),
 p('m-watch','marshalls','F-91W-1 digital watch','Casio','digitalwatch',17.99,22.95,'#363e39','Digital watch with alarm, stopwatch, and resin strap.','casio',{sizes:one}),
 p('u-tee','uniqlo','SUPIMA Cotton Crew Neck T-Shirt','UNIQLO','shirt',24.90,24.90,'#e5dbc3','SUPIMA cotton everyday crew-neck T-shirt.','uniqlo'),
 p('u-jeans','uniqlo','Wide Straight Jeans','UNIQLO','pants',49.90,49.90,'#45697b','Wide straight-leg denim jeans.','uniqlo',{sizes:['28','30','32','34','36']}),
 p('u-jacket','uniqlo','U AIRism Cotton Oversized T-Shirt','UNIQLO','shirt',24.90,24.90,'#90a08c','Relaxed fit with half-length sleeves.','uniqlo'),
 p('u-knit','uniqlo','UV Protection Crew Neck Cardigan','UNIQLO','cardigan',39.90,39.90,'#c3b294','Crew-neck layer from the LifeWear collection.','uniqlo'),
 p('u-bag','uniqlo','Round Mini Shoulder Bag','UNIQLO','crossbody',19.90,19.90,'#8a7c57','Compact nylon crossbody with adjustable strap.','round',{sizes:one}),
 p('n-jeans','nordstrom','501 Original Jeans','Levi’s','pants',84.95,84.95,'#577591','Straight leg with the signature button fly.','jeans',{sizes:['28','30','32','34','36']}),
 p('n-bag','nordstrom','Le Pliage Original L handbag','Longchamp','bag',165,165,'#71523e','Foldable canvas handbag with leather handles and flap.','longchamp',{sizes:one}),
 p('n-shoes','nordstrom','Samba OG shoes','adidas','shoes',100,100,'#e5dfc9','Football-inspired low-tops with a gum sole.','samba',{sizes:shoes}),
 p('n-sandal','nordstrom','Arizona Birkibuc sandals','BIRKENSTOCK','sandals',115,115,'#967c59','Two adjustable straps with a contoured cork footbed.','birken',{sizes:shoes}),
 p('n-scent','nordstrom','Wood Sage & Sea Salt Cologne','Jo Malone London','perfume',165,165,'#c8b67e','Woody, mineral fragrance inspired by the coast.','jo',{sizes:['100 ml'],finalSale:true}),
 p('l-bag','lv','Neverfull MM · Monogram Origine','Louis Vuitton','bag',3050,3050,'#79553d','Monogram Origine coated-canvas tote with leather trim.','neverfull',{sizes:one}),
 p('l-wallet','lv','Zippy Wallet · Monogram','Louis Vuitton','wallet',940,940,'#835b3a','Zip-around coated-canvas wallet with leather lining.','zippy',{sizes:one}),
 p('l-belt','lv','LV Initiales 40mm Reversible Belt','Louis Vuitton','belt',590,590,'#77553d','Reversible belt with an LV Initiales buckle.','belt',{sizes:['80 cm','85 cm','90 cm','95 cm','100 cm']}),
 p('l-shoes','lv','Run Away Sneaker','Louis Vuitton','shoes',1200,1200,'#d7c5a6','Running-inspired sneaker from the Run Away collection.','sneaker',{sizes:shoes}),
 p('l-travel','lv','Speedy Bandoulière 25','Louis Vuitton','duffel',1980,1980,'#79553d','Monogram canvas city bag with a removable strap.','speedy',{sizes:one}),
 p('h-scarf','hermes','Brides de Gala en Fleurs scarf 90','Hermès','scarf',660,660,'#6a6456','Silk twill with hand-rolled edges.','scarf',{sizes:one}),
 p('h-sandal','hermes','Oran sandal','Hermès','sandals',900,900,'#b68b57','Calfskin sandal with the signature H-shaped cutout.','oran',{sizes:shoes}),
 p('h-bracelet','hermes','Clic H bracelet','Hermès','bracelet',810,810,'#a39480','Narrow enamel bracelet with an H toggle clasp.','clic',{sizes:['PM','GM']}),
 p('h-scent','hermes','Un Jardin sur le Nil Eau de toilette','Hermès','perfume',180,180,'#8ca26a','Green, woody eau de toilette inspired by Aswan.','nil',{sizes:['100 ml'],finalSale:true}),
 p('h-bag','hermes','Evelyne 16 Amazone bag','Hermès','crossbody',2525,2525,'#ab7547','Mini leather crossbody in the Evelyne family.','evelyne',{sizes:one})
];
