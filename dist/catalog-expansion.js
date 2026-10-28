// Named real products researched against official brand product/collection pages.
// Prices, placement, stock and fitting feedback are game simulation values.
export const NEW_STORES=[
 {id:'zara',name:'Zara',tier:1,district:'market',color:'#6b6058',light:'#eee4d1',npc:'Ines',sub:'THE FRAGRANCE EDIT'},
 {id:'muji',name:'MUJI',tier:1,district:'central',color:'#8a4b4e',light:'#eddfc9',npc:'Ren',sub:'EVERYDAY, THOUGHTFULLY MADE'},
 {id:'newbalance',name:'New Balance',tier:2,district:'garden',color:'#776f88',light:'#e6d9dc',npc:'Noah',sub:'RUN YOUR OWN WAY'},
 {id:'lululemon',name:'lululemon',tier:3,district:'garden',color:'#ae535b',light:'#f0dcce',npc:'Harper',sub:'MOVE, REST, REPEAT'},
 {id:'alo',name:'Alo',tier:3,district:'garden',color:'#697970',light:'#dfebd8',npc:'Sage',sub:'STUDIO TO STREET'},
 {id:'bathbody',name:'Bath & Body Works',tier:0,district:'garden',color:'#5b84a6',light:'#dce6ea',npc:'Lily',sub:'A LITTLE EVERYDAY JOY'},
 {id:'tiffany',name:'Tiffany & Co.',tier:5,district:'terrace',color:'#569e98',light:'#d8eeE3',npc:'Audrey',sub:'THE LITTLE BLUE BOX'},
 {id:'cartier',name:'Cartier',tier:6,district:'terrace',color:'#a04345',light:'#edd9c8',npc:'Louis',sub:'JEWELRY & WATCHMAKING'},
 {id:'ysl',name:'Saint Laurent',tier:5,district:'terrace',color:'#494c45',light:'#e1dece',npc:'Remy',sub:'PARISIAN SILHOUETTES'},
 {id:'bottega',name:'Bottega Veneta',tier:5,district:'terrace',color:'#6e8658',light:'#e5e8c7',npc:'Vera',sub:'INTRECCIATO & CRAFT'},
 {id:'dior',name:'Dior',tier:5,district:'terrace',color:'#838b92',light:'#e1e6dd',npc:'Celine',sub:'COUTURE & BEAUTY'},
 {id:'chanel',name:'CHANEL',tier:5,district:'terrace',color:'#494944',light:'#f0e9d7',npc:'Gabrielle',sub:'BEAUTY & FRAGRANCE'}
];
export const EXPANSION_PRODUCTS=[];
const alpha=['XS','S','M','L','XL'];
const sizes={shoes:['6','7','8','9','10'],sandals:['6','7','8','9','10'],pants:['28','30','32','34','36'],shirt:alpha,shorts:alpha,hoodie:alpha,cardigan:alpha,jacket:alpha,hat:['One size'],bracelet:['S','M','L'],ring:['5','6','7','8','9'],necklace:['One size'],earrings:['One size'],watch:['One size'],belt:['80 cm','85 cm','90 cm','95 cm','100 cm']};
const colors={shoes:'#dedac6',sandals:'#b59b75',shirt:'#adc5ac',pants:'#66899b',hoodie:'#b8c0ad',jacket:'#9cae96',bag:'#92714f',backpack:'#889e7d',wallet:'#a58257',stationery:'#c1bba2',perfume:'#c7b491',lipstick:'#ad6f72',makeup:'#c19479',skincare:'#d4ddc5',bracelet:'#c2a56b',necklace:'#c2a56b',earrings:'#c2a56b',ring:'#c2a56b',watch:'#bbc1b4'};
const materials={stationery:'A named MUJI stationery product. Explore its official model source.',perfume:'A real named fragrance. The in-game tester is a simulation.',skincare:'A real body-care or skin-care product. Demo effects are simulated.',lipstick:'A real named lip-color product. The in-game tester is a simulation.',makeup:'A real named makeup product. The in-game tester is a simulation.',buildingtoy:'A real LEGO building set, identified by its set number.',bracelet:'A real jewelry design. Game sizes and fitting feedback are simplified.',necklace:'A real necklace design. Check its official product details.',earrings:'A real earring design. Check its official product details.',ring:'A real ring design. Game sizes and fitting feedback are simplified.',watch:'A real watch model. Check the official source for its movement and dimensions.'};
const add=(store,brand,source,rows)=>rows.forEach((r,i)=>{const [name,type,price,link,reference,fitSizes,productBrand]=r;const id=`${store}-v4-${i+1}`;EXPANSION_PRODUCTS.push({id,store,brand:productBrand||brand,name,type,price,retail:Math.round(price*(['ross','marshalls'].includes(store)?1.65:1)),source:link||source,reference:reference||'',assetKey:id,sizes:fitSizes||sizes[type]||['One size'],color:colors[type]||'#ac9f83',material:materials[type]||'A named real-world model from the official brand collection. Prices and stock are simulated.',finalSale:['perfume','lipstick','skincare','mascara','makeup'].includes(type)});});
add('newbalance','New Balance','https://www.newbalance.com/shoes/',[
 ['530','shoes',10999],['9060','shoes',15999],['327','shoes',10499],['574 Core','shoes',9999],['740','shoes',11499],['1906R','shoes',15999,'https://www.newbalance.com/pd/1906r/M1906RV1-51193.html'],['2002R','shoes',14499],['Made in USA 990v6','shoes',19999],['Made in USA 992 Core','shoes',19999],['1000','shoes',14999],['550','shoes',10999],['T500','shoes',10999],['RC42','shoes',9999],['471','shoes',9999],['1080v15','shoes',16999]
]);
add("lululemon","lululemon","https://shop.lululemon.com/c/women-thumbholes-zip-up-sweatshirts/n1basozjux6zwbwn",[
 ["Align High-Rise Pant 25 in", "pants", 9800, "https://shop.lululemon.com/p/align-pant-2/i4goprzy85", null, ["2", "4", "6", "8", "10", "12"]],
 ["Define Jacket Luon", "jacket", 12800, null, null, ["2", "4", "6", "8", "10", "12"]],
 ["Swiftly Tech Short-Sleeve Shirt 2.0 Waist Length", "shirt", 6800, "https://shop.lululemon.com/p/swiftly-tech-short-sleeve-2-race/xhjgnp916q", null, ["2", "4", "6", "8", "10", "12"]],
 ["Hotty Hot High-Rise Lined Short 4 in", "shorts", 6800, "https://shop.lululemon.com/p/hotty-hot-short-hr-long/e15cmdjmrc", null, ["2", "4", "6", "8", "10", "12"]],
 ["Wunder Train High-Rise Tight 25 in", "pants", 9800, "https://shop.lululemon.com/p/wunder-train-hr-tight-25/qnd4lof1dl", null, ["2", "4", "6", "8", "10", "12"]],
 ["Energy Bra Medium Support, B-D Cups Evolve", "shirt", 5800, "https://shop.lululemon.com/c/women-energy-strappy-bras/n1e0t2zvietzxmpm", null, ["2", "4", "6", "8", "10", "12"]],
 ["Like a Cloud Longline Bra Light Support, B/C Cup", "shirt", 6800, "https://shop.lululemon.com/c/women-bras-and-underwear/n1sv6a", null, ["2", "4", "6", "8", "10", "12"]],
 ["Softstreme High-Rise Pant Regular", "pants", 12800, "https://shop.lululemon.com/p/softstreme-hr-pant/rl4vn2cefr", null, ["2", "4", "6", "8", "10", "12"]],
 ["Dance Studio Mid-Rise Jogger Full Length", "pants", 11800, "https://shop.lululemon.com/c/women-dance-studio-pants/n16o10z8akdzqd1q", null, ["XS", "S", "M", "L", "XL"]],
 ["Wunder Train Full-Zip Jacket", "jacket", 12800, null, null, ["2", "4", "6", "8", "10", "12"]],
 ["Scuba Evolve Oversized Half-Zip Hoodie", "hoodie", 12800],
 ["Pace Breaker Lined Short 7 in", "shorts", 7800, "https://shop.lululemon.com/c/men-pace-breaker-liner-shorts/n1egx7zg62mzjn1c"],
 ["ABC Classic-Fit 5 Pocket Pant 30L Warpstreme", "pants", 13800, "https://shop.lululemon.com/p/abc-pant-classic-30/uapv0nu4sj"],
 ["Metal Vent Tech Short-Sleeve Shirt", "shirt", 7800, "https://shop.lululemon.com/p/metal-vent-tech-short-sleeve-shirt-3/lbhe17vi2f"],
 ["Everywhere Belt Bag with Long Strap 1L", "crossbody", 3800, "https://shop.lululemon.com/c/belt-bags/n18mu7zrdci"]
]);
add('alo','Alo','https://www.aloyoga.com/collections/bestsellers?page=1&view=fallback',[
 ['7/8 High-Waist Airlift Legging','pants',13400,null,null,alpha],['Accolade Crew Neck Pullover','shirt',13800],['Accolade Straight Leg Sweatpant','pants',13800,null,null,alpha],['Accolade Short','shorts',7800],['Accolade 1/4 Zip Pullover','hoodie',14800],['Accolade Full Zip Hoodie','hoodie',14800],['Ribbed En Pointe Tank','shirt',7800],['Airlift Intrigue Bra','shirt',7800],['Splendor Bra','shirt',6800],['Airbrush Better Together Bra','shirt',8800],['Alosoft Heart Throb Bra','shirt',8800],['Aspire Tank','shirt',6800],['Suit Up Trouser (Regular)','pants',14800,null,null,alpha],['Sway On The Go Jacket','jacket',13800],['Performance Off-Duty Cap','hat',6800]
]);
add('muji','MUJI','https://www.muji.us/collections/pens',[
 ['Gel Ink Cap Type Ballpoint Pen 0.5mm','stationery',240],['Smooth Gel Ink Ballpoint Knock Pen 0.3 mm','stationery',240],['Handy Shredder','stationery',1690,'https://www.muji.us/collections/desk-accessories'],['Steel Book Divider','stationery',290,'https://www.muji.us/collections/desk-accessories'],['Pencil Sharpener','stationery',190,'https://www.muji.us/collections/desk-accessories'],['Oil Ink Triangle 2 Color Ballpoint Pen with Mechanical Pencil','stationery',590],['Acrylic Tape Dispenser','stationery',290,'https://www.muji.us/collections/desk-accessories'],['Dark Gray Double Ring Lined Notebook','stationery',150,'https://www.muji.us/collections/notebook'],['Recycled Paper Lined Notebook B5','stationery',250,'https://www.muji.us/collections/notebook'],['A6 Wirebound Notebook Plain Beige','stationery',290,'https://www.muji.us/collections/notebook'],['Wire-bound Sketchbook F1 20 Sheets','stationery',590,'https://www.muji.us/collections/notebook'],['Polypropylene Cable Case with Stand','stationery',290,'https://www.muji.us/collections/desk-accessories'],['Stapler without Staples','stationery',890,'https://www.muji.us/collections/desk-accessories'],['Nonslip Cutting Ruler','stationery',590,'https://www.muji.us/collections/desk-accessories'],['Stainless Steel Scissors','stationery',290,'https://www.muji.us/collections/desk-accessories']
]);
add('zara','Zara','https://www.zara.com/us/en/woman-beauty-perfumes-l1415.html',[
 ['Cocoa Sunset EDP 100 ml','perfume',3590],['Cocoa Bliss EDP 100 ml','perfume',3590],['Fashionably London EDP 100 ml','perfume',5990],['Fashionably London Elixir Parfum 100 ml','perfume',6990],['Energetically New York EDP 100 ml','perfume',5990],['Energetically New York Elixir Parfum 100 ml','perfume',6990],['Red Zara Temptation EDP 80 ml','perfume',3990],['Red Zara Temptation Elixir Parfum 80 ml','perfume',4990],['Red Zara Temptation Winter EDP 80 ml','perfume',3990],['Red Zara Temptation & Vanille Extrait de Parfum 50 ml','perfume',4990],['Red Zara Temptation Tobacco Extrait de Parfum 50 ml','perfume',4990],['Red Zara Temptation & Sandalwood Extrait de Parfum 50 ml','perfume',4990],['Lightly Bloom EDP 100 ml','perfume',3590],['Deep Garden EDP 100 ml','perfume',3590],['Nude Bouquet EDP 100 ml','perfume',3590]
]);
add('bathbody','Bath & Body Works','https://www.bathandbodyworks.com/c/top-fragrance-finder/',[
 ['Warm Vanilla Sugar Fine Fragrance Mist','perfume',1795],['Into the Night Fine Fragrance Mist','perfume',1795],['Champagne Toast Fine Fragrance Mist','perfume',1795],['In the Stars Fine Fragrance Mist','perfume',1795],['Japanese Cherry Blossom Fine Fragrance Mist','perfume',1795],['Warm Vanilla Sugar Ultimate Hydration Body Cream','skincare',1795],['Champagne Toast Ultimate Hydration Body Cream','skincare',1795],['Japanese Cherry Blossom Ultimate Hydration Body Cream','skincare',1895],['Into the Night Ultimate Hydration Body Cream','skincare',1795],['In the Stars Ultimate Hydration Body Cream','skincare',1795],['A Thousand Wishes Body Scrub','skincare',1995],['Champagne Toast Body Butter','skincare',2095],['Champagne Toast Body Lotion','skincare',1695],['Warm Vanilla Sugar Body Lotion','skincare',1495],['Warm Vanilla Sugar Body Wash','skincare',1595]
]);
add("tiffany","Tiffany & Co.","https://www.tiffany.com/gifts/romantic-gifts/",[
 ["Tiffany T Smile Pendant in Yellow Gold, Small", "necklace", 140000, "https://www.tiffany.com/jewelry/necklaces-pendants/tiffany-t-18k-yellow-gold-necklaces-pendants-1364371976.html"],
 ["Elsa Peretti Open Heart Pendant in Sterling Silver, 7 mm", "necklace", 30000, "https://www.tiffany.com/jewelry/necklaces-pendants/ep-open-heart-sterling-silver-necklaces-pendants-1404181395.html"],
 ["Tiffany 1837 Interlocking Circles Chain Bracelet in Yellow Gold", "bracelet", 210000, "https://www.tiffany.com/gifts/romantic-gifts/"],
 ["Tiffany Soleste Half Eternity Ring in Platinum with Diamonds, 2 mm Wide", "ring", 340000, "https://www.tiffany.com/gifts/romantic-gifts/"],
 ["Return to Tiffany Blue Double Heart Tag Pendant in Silver, Mini", "necklace", 32500, "https://www.tiffany.com/jewelry/necklaces-pendants/return-to-tiffany-sterling-silver-necklaces-pendants-1154458879.html"],
 ["Return to Tiffany Heart Tag Pendant in Silver, Medium", "necklace", 35000, "https://www.tiffany.com/jewelry/necklaces-pendants/return-to-tiffany-sterling-silver-necklaces-pendants-1154167408.html"],
 ["Return to Tiffany Heart Tag Toggle Necklace in Silver", "necklace", 130000, "https://www.tiffany.com/jewelry/necklaces-pendants/return-to-tiffany-sterling-silver-necklaces-pendants-1155147822.html"],
 ["Return to Tiffany Heart Tag Toggle Bracelet in Silver", "bracelet", 90000, "https://www.tiffany.com/jewelry/bracelets/return-to-tiffany-sterling-silver-bracelets-1156147821.html"],
 ["Return to Tiffany Heart Tag Charm Bracelet in Silver", "bracelet", 80000, "https://www.tiffany.com/jewelry/bracelets/return-to-tiffany-sterling-silver-bracelets-1156128456.html"],
 ["Tiffany Infinity Bracelet", "bracelet", 35000, "https://www.tiffany.com/jewelry/bracelets/tiffany-infinity-sterling-silver-bracelets-1156166024.html"],
 ["Tiffany Knot Pendant in Yellow Gold", "necklace", 330000, "https://www.tiffany.com/jewelry/necklaces-pendants/tiffany-knot-18k-yellow-gold-necklaces-pendants-1364375630.html"],
 ["Elsa Peretti Open Heart Stud Earrings in Silver, 11 mm", "earrings", 55000, "https://www.tiffany.com/jewelry/earrings/ep-open-heart-sterling-silver-earrings-1401151001.html"],
 ["Paloma Picasso Olive Leaf Heart Pendant", "necklace", 32500, "https://www.tiffany.com/jewelry/necklaces-pendants/sterling-silver-necklaces-pendants-1914166088.html"],
 ["Tiffany T Narrow Wire Bracelet in Yellow Gold", "bracelet", 250000, "https://www.tiffany.com/jewelry/bracelets/tiffany-t-18k-yellow-gold-bracelets-1366369752.html"],
 ["Tiffany HardWear Micro Link Bracelet in Sterling Silver", "bracelet", 100000, "https://www.tiffany.com/jewelry/bracelets/tiffany-hardwear-sterling-silver-bracelets-60417059.html"]
]);
add("cartier","Cartier","https://www.cartier.com/en-us/be-inspired/the-cartier-icons/",[
 ["LOVE bracelet, classic model", "bracelet", 795000, "https://www.cartier.com/en-us/be-inspired/the-cartier-icons/"],
 ["LOVE bracelet, on chain", "bracelet", 213000, "https://int.cartier.com/en/collections/jewelry/bracelets/love-bracelets/b6091000-love-bracelet%2C-on-chain.html", "B6091000"],
 ["LOVE bracelet, classic model, 4 diamonds", "bracelet", 1310000, "https://www.cartier.com/en-us/jewelry/bracelets/love-bracelet-classic-model-4-diamonds-CRB6070016.html", "B6070016"],
 ["Juste un Clou bracelet, small model", "bracelet", 418000, "https://int.cartier.com/en/collections/jewelry/bracelets/juste-un-clou-bracelets/b6062517-juste-un-clou-bracelet%2C-small-model.html", "B6062517"],
 ["Juste un Clou bracelet, classic model", "bracelet", 870000, "https://www.cartier.com/en-tr/jewellery/bracelets/juste-un-clou-bracelet-classic-model-B6048217.html", "B6048217"],
 ["Juste un Clou ring, small model", "ring", 148000, "https://www.cartier.com/en-us/jewelry/rings/juste-un-clou-ring-small-model-CRB4225900.html", "B4225900"],
 ["Trinity ring, small model", "ring", 170000, "https://www.cartier.com/en-tr/jewellery/rings/trinity/trinity-ring-small-model-CRB4235100.html", "B4235100"],
 ["Trinity ring, classic model", "ring", 235000, "https://www.cartier.com/en-us/be-inspired/the-cartier-icons/"],
 ["Cartier d’Amour bracelet, diamond, mini model", "bracelet", 96000, "https://www.cartier.com/en-ro/jewellery/bracelets/cartier-d-amour/cartier-d-amour-bracelet-diamond-mini-model-CRB6045717", "B6045717"],
 ["Panthère de Cartier watch, small model, steel", "watch", 495000, "https://www.cartier.com/en-sa/watches/collections/panthere-de-cartier/panthere-de-cartier-watch-CRWSPN0013.html", "WSPN0013"],
 ["Tank Must de Cartier watch, small model", "watch", 400000, "https://int.cartier.com/en/collections/watches/all-watches.viewall.html"],
 ["Tank Must de Cartier watch, large model", "watch", 425000, "https://int.cartier.com/en/collections/watches/all-watches.viewall.html"],
 ["Tank Louis Cartier watch, mini model", "watch", 875000, "https://www.cartier.com/en-pt/tank-louis-cartier-watch_cod1647597348583084.html", "WGTA0352"],
 ["Tank Louis Cartier watch, small model", "watch", 1160000, "https://www.cartier.com/en-us/be-inspired/the-cartier-icons/"],
 ["Santos de Cartier watch, medium model", "watch", 780000, "https://www.cartier.com/en-ch/watches/collections/santos-de-cartier/santos-de-cartier-watch-CRWSSA0029", "WSSA0029"]
]);
add('ysl','Saint Laurent','https://www.ysl.com/en-us/ca/shop-women/handbags',[
 ['Simone medium in soft leather','bag',390000],['Simone large in soft leather','bag',460000],['Mombasa medium in leather','bag',430000],['Mombasa small in leather','bag',345000],['Icarino in quilted nappa','bag',320000],['Icarino mini in quilted nappa','bag',290000],['Icare hobo in quilted nappa','bag',450000],['Icare medium in quilted nappa','bag',470000],['Le 5 à 7 Baby Bea in grained leather','bag',275000],['Le 5 à 7 supple small in suede','bag',290000],['Loulou small in matelassé lambskin','bag',280000,'https://www.ysl.com/en-us/ca/new-arrivals/highlights/loulou-bag-women'],['Loulou medium in matelassé lambskin','bag',340000,'https://www.ysl.com/en-us/ca/new-arrivals/highlights/loulou-bag-women'],['Kate small in grain de poudre embossed leather','bag',225000,'https://www.ysl.com/en-us/ca/new-arrivals/highlights/kate-women'],['Sac de Jour nano in smooth leather','bag',290000,'https://www.ysl.com/en-bg/ca/new-arrivals/new-arrivals-women/handbags'],['Gaby vanity in lambskin','bag',230000,'https://www.ysl.com/en-bg/ca/new-arrivals/new-arrivals-women/handbags']
]);
add('bottega','Bottega Veneta','https://www.bottegaveneta.com/en-us/women-collection-us/women-bags',[
 ['Baby Barbara Tote','bag',460000],['Small Madison','bag',460000,'https://www.bottegaveneta.com/en-us/women-collection-us/women-bags/women-madison'],['Giorno','bag',360000,'https://www.bottegaveneta.com/en-us/women-collection-us/women-bags/women-giorno'],['Corso','bag',470000,'https://www.bottegaveneta.com/en-us/women-collection-us/women-bags/women-corso'],['Mini Andiamo','bag',430000,'https://www.bottegaveneta.com/en-us/women-collection-us/women-bags/women-andiamo'],['Small Andiamo','bag',490000,'https://www.bottegaveneta.com/en-us/women-collection-us/women-bags/women-andiamo'],['Mini Jodie','bag',310000,'https://www.bottegaveneta.com/en-us/women-collection-us/women-bags/jodie'],['Small Veneta','bag',480000,'https://www.bottegaveneta.com/en-us/women-collection-us/women-bags/veneta-bag-en'],['Jodie','bag',490000,'https://www.bottegaveneta.com/en-us/women-collection-us/women-bags/jodie'],['Small Lauren 1980','bag',440000,'https://www.bottegaveneta.com/en-us/women-collection-us/women-bags/lauren'],['Baby Campana','bag',380000,'https://www.bottegaveneta.com/en-us/women-collection-us/women-bags/women-campana'],['Small Campana','bag',430000,'https://www.bottegaveneta.com/en-us/women-collection-us/women-bags/women-campana'],['Campana','bag',490000,'https://www.bottegaveneta.com/en-us/women-collection-us/women-bags/women-campana'],['Andiamo Clutch','bag',370000,'https://www.bottegaveneta.com/en-us/women-collection-us/women-bags/women-andiamo-clutch'],['Small Pinacoteca','bag',360000,'https://www.bottegaveneta.com/en-us/women-collection-us/women-bags/pinacoteca']
]);
add('dior','Dior','https://www.dior.com/en_us/beauty/page/triaxe-bestseller.html',[
 ['Miss Dior Parfum','perfume',17000],['Miss Dior Blooming Bouquet','perfume',14000],['J’adore Eau de Parfum','perfume',16500],['Sauvage Eau de Parfum','perfume',13500],['Sauvage Elixir','perfume',19500],['Dior Homme Intense','perfume',13500],['Rouge Dior','lipstick',4900],['Dior Addict Lip Maximizer','lipstick',4200,'https://www.dior.com/en_us/beauty/products/dior-addict-lip-maximizer-C031900063.html'],['Dior Forever Skin Glow','makeup',5700],['Dior Backstage Rosy Glow Stick','makeup',4200],['Saddle Bag with Strap · Chocolate Suede','bag',470000,'https://www.dior.com/en_us/fashion/discover/new-bags-for-women'],['Small Dior Toujours Hobo Bag · Black Cannage','bag',370000,'https://www.dior.com/en_us/fashion/discover/new-bags-for-women'],['Medium Dior Book Tote with Strap · Blue Dior Oblique','bag',380000,'https://www.dior.com/en_us/fashion/discover/new-bags-for-women'],['Dior Promenade Mini Shopping Bag · Blue Dior Oblique','bag',270000,'https://www.dior.com/en_us/fashion/discover/new-bags-for-women'],['Dior Tribales Earrings · Antique Gold-Finish Metal and White Resin Pearls','earrings',60000,'https://www.dior.com/en_us/fashion/products/E1293TRIRS_D908_TU','E1293TRIRS_D908']
]);
add("chanel","CHANEL","https://www.chanel.com/us/fragrance/women/c/7x1x1/",[
 ["N°5 Eau de Parfum Spray", "perfume", 11800, null, "125530"],
 ["Rouge Coco Longwear Satin Lipstick", "lipstick", 5300, "https://www.chanel.com/us/makeup/p/153176/rouge-coco-longwear-satin-lipstick-hydrating-and-smoothing-lip-care/", "153176"],
 ["N°5 L’EAU Eau de Toilette Spray", "perfume", 11500, null, "105536"],
 ["Rouge Coco Hydra Gloss", "lipstick", 4500, "https://www.chanel.com/us/makeup/p/158432/rouge-coco-hydra-gloss-hydrating-and-smoothing-high-shine-lipgloss/", "158432"],
 ["Le Rouge Duo Ultra Tenue Liquid Lip Colour", "lipstick", 5000, "https://www.chanel.com/us/makeup/p/175116/le-rouge-duo-ultra-tenue-ultrawear-liquid-lip-colour/", "175116"],
 ["Rouge Coco Baume Shine Tinted Lip Balm", "lipstick", 4800, "https://www.chanel.com/us/makeup/p/171752/rouge-coco-baume-shine-hydrating-beautifying-tinted-lip-balm-buildable-colour/", "171752"],
 ["Coco Mademoiselle Eau de Parfum Spray", "perfume", 11500, null, "116520"],
 ["Joues Contraste Intense Cream-to-Powder Blush", "makeup", 6000, "https://www.chanel.com/us/makeup/p/151749/joues-contraste-intense-cream-to-powder-blush/", "151749"],
 ["Les 4 Ombres Multi-Effect Quadra Eyeshadow", "makeup", 9000, "https://www.chanel.com/us/makeup/p/151039/les-4-ombres-multi-effect-quadra-eyeshadow/", "151039"],
 ["Coco Mademoiselle The Shimmering Body Oil", "skincare", 15000, null, "116938"],
 ["Chance Eau Splendide Eau de Parfum Spray", "perfume", 11500, null, "136220"],
 ["Chance Eau Fraîche Eau de Parfum Spray", "perfume", 11500, null, "136150"],
 ["Le Volume de Chanel Mascara", "mascara", 4000, "https://www.chanel.com/us/makeup/p/191410/le-volume-de-chanel-mascara/", "191410"],
 ["Paris – St. Moritz Les Eaux de Chanel Eau de Toilette", "perfume", 13200, null, "102450"],
 ["Le Vernis Longwear Nail Colour", "makeup", 3400, "https://www.chanel.com/us/makeup/nails/c/5x1x7x31/nail-colour/", "179447"]
]);
// Five additional named models for each of the original twenty retailers.
const mixed=(store,rows)=>add(store,'','',rows.map(([brand,name,type,price,source,reference])=>[name,type,price,source,reference,null,brand]));
mixed('ross',[
 ['Vans','Authentic','shoes',2999,'https://www.vans.com/en-us/c/shoes/icons-5195'],
 ['Reebok','Classic Leather Shoes','shoes',3499,'https://www.reebok.com/collections/mens-classics'],
 ['PUMA','Suede Classic','shoes',3499,'https://us.puma.com/us/en/pd/sneakers-suede-classic/399781'],
 ['Converse','Chuck 70 Canvas High Top','shoes',3999,'https://www.converse.com/shop/chuck-70-shoes'],
 ['Champion','Powerblend Crewneck Sweatshirt, Script Logo','shirt',2499,'https://www.champion.com/pages/powerblend']
]);
mixed('marshalls',[
 ['Reebok','Club C 85 Shoes','shoes',3499,'https://www.reebok.com/collections/club-c-shoes'],
 ['Columbia','Benton Springs Full Zip Fleece Jacket','jacket',2999,'https://www.columbia.com/p/womens-benton-springs-full-zip-fleece-jacket-%7C-451-%7C-xl-198711259326.html'],
 ['Vans','Authentic','shoes',3499,'https://www.vans.com/en-us/c/shoes/icons-5195'],
 ['PUMA','Suede Classic','shoes',3999,'https://us.puma.com/us/en/pd/sneakers-suede-classic/399781'],
 ['Reebok','Classic Nylon Shoes','shoes',2999,'https://www.reebok.com/collections/mens-classics']
]);
mixed('target',[
 ['LEGO','Sunflowers · 40524','buildingtoy',1499,'https://www.lego.com/en-us/product/sunflowers-40524','40524'],
 ['LEGO','Lotus Flowers · 40647','buildingtoy',1299,'https://www.lego.com/en-us/product/lotus-flowers-40647','40647'],
 ['Maybelline','Lash Sensational Sky High Washable Mascara','mascara',1399,'https://www.maybelline.com/eye-makeup/mascara/lash-sensational-sky-high-washable-mascara-makeup'],
 ['JBL','Tune 510BT','headphones',4995,'https://www.jbl.com/TUNE510BT-.html'],
 ['Sony','WH-CH520','headphones',6999,'https://electronics.sony.com/audio/headphones/headband/p/whch520-w']
]);
add('oldnavy','Old Navy','https://oldnavy.gap.com/browse/category.do?cid=5211',[
 ['Baggy Built-In Flex Rotation Chino Pants','pants',3999,'https://oldnavy.gap.com/browse/product.do?pid=8736080224834'],
 ['Slim Built-In Flex Rotation Chino Pants','pants',3999,'https://oldnavy.gap.com/browse/product.do?pid=8105530123830'],
 ['Skinny Ultimate Built-In Flex Chino Pants','pants',3999,'https://oldnavy.gap.com/browse/product.do?pid=584672052'],
 ['Straight Ultimate Built-In Flex Chino Pants','pants',3999,'https://oldnavy.gap.com/browse/product.do?pid=5799220123836'],
 ['High-Waisted PowerSoft Biker Shorts · 6 in','shorts',1999,'https://oldnavy.gap.com/browse/product.do?pid=848697012']
]);
add('hm','H&M','https://www2.hm.com/en_us/men/products/basics.html',[
 ['Slim Fit T-shirt','shirt',999],['Relaxed Fit T-shirt','shirt',1299],
 ['Regular Fit Oxford Shirt','shirt',2999,'https://www2.hm.com/en_us/productpage.1257417005.html'],
 ['Regular Fit Polo Shirt','shirt',1999,'https://www2.hm.com/en_us/men/products/t-shirts-tank-tops/best-basics.html?page=5'],
 ['Relaxed Fit Sweatpants','pants',2999,null,null,alpha]
]);
add('uniqlo','UNIQLO','https://image.uniqlo.com/UQ/ST3/us/imagesother/NSO/2025/25FW-8-Tysons-Corner-Digital-Flyer.pdf',[
 ['DRY-EX Crew Neck Short-Sleeve T-Shirt','shirt',2490,'https://www.uniqlo.com/us/en/products/E442131-000/00'],
 ['PUFFTECH Parka','jacket',9990,'https://www.uniqlo.com/us/en/products/E486172-000/00'],
 ['Cashmere Crew Neck Sweater','shirt',9990,'https://www.uniqlo.com/us/en/products/E469479-000/00'],
 ['Sweat Oversized Pullover Hoodie','hoodie',4990],['Seamless Down Parka','jacket',14990]
]);
add('levis','Levi’s','https://www.levi.com/US/en_US/clothing/unisex/c/levi_clothing_unisex/facets/feature-fit_name/wedgie%20slim/feature-materialtype/denim',[
 ['517 Bootcut Jeans','pants',7450,'https://www.levi.com/US/en_US/clothing/men/jeans/c/levi_clothing_men_jeans/facets/feature-fit_name/517%E2%84%A2'],
 ['541 Athletic Taper Jeans','pants',7450,'https://www.levi.com/US/en_US/jeans-by-fit-number/men/jeans/541/c/levi_jeans_by_fit_number_men_jeans_541'],['502 Taper Jeans','pants',7950,'https://www.levi.com/US/en_US/jeans-by-fit-number/men/jeans/502/c/levi_jeans_by_fit_number_men_jeans_502'],['725 High Rise Bootcut Jeans','pants',7950,'https://www.levi.com/US/en_US/clothing/women/jeans/bootcut/725-high-rise-bootcut-womens-jeans/p/187590373'],['Wedgie Straight Ankle Jeans','pants',9800,'https://www.levi.com/US/en_US/clothing/women/jeans/c/levi_clothing_women_jeans/facets/feature-fit_name/wedgie%20straight%20ankle']
]);
add('nike','Nike','https://www.nike.com/vn/w/retro-running-shoes-5e1x6z8kemkznik1zy7ok',[
 ['Pegasus 41','shoes',14000,'https://investors.nike.com/_assets/_670338e20d4eb7961dc9659bd7127c86/nike/db/938/9399/webcast_transcript/NIKE-Inc-Q4FY24-OFFICIAL-Transcript_FINAL.pdf'],
 ['P-6000','shoes',11000],['V2K Run','shoes',12000],['Shox R4','shoes',15000],
 ['Zoom Vomero 5','shoes',17000,'https://www.nike.com/t/zoom-vomero-5-mens-shoes-MgsTqZ']
]);
add('adidas','adidas','https://www.adidas.com/us/women-mini_me-lifestyle-street',[
 ['Forum Low CL shoes','shoes',10000],['SL 72 OG shoes','shoes',10000],['Gazelle Indoor shoes','shoes',12000],
 ['Samba XLG shoes','shoes',12000,'https://www.adidas.com/us/white-mini_me-originals-lifestyle'],
 ['Adizero EVO SL shoes','shoes',15000,'https://www.adidas.com/us/adizero_evo_sl']
]);
add('lego','LEGO','https://www.lego.com/en-us/themes/botanicals/about',[
 ['Flower Bouquet · 10280','buildingtoy',5999,'https://www.lego.com/en-us/product/flower-bouquet-10280','10280'],
 ['Tranquil Garden · 10315','buildingtoy',10999,'https://www.lego.com/en-us/product/tranquil-garden-10315','10315'],
 ['Chrysanthemum · 10368','buildingtoy',2999,'https://www.lego.com/en-us/product/chrysanthemum-10368','10368'],
 ['Plum Blossom · 10369','buildingtoy',2999,'https://www.lego.com/en-us/product/plum-blossom-10369','10369'],
 ['Lucky Bamboo · 10344','buildingtoy',2999,'https://www.lego.com/en-us/product/lucky-bamboo-10344','10344']
]);
mixed('sephora',[
 ['Supergoop!','Unseen Sunscreen SPF 50','skincare',3800,'https://supergoop.com/products/unseen-sunscreen-spf-50'],
 ['Fresh','Soy Face Cleanser','skincare',3900,'https://www.fresh.com/us/shop/skincare/cleansers/soy-face-cleanser-H00006238.html'],
 ['Tatcha','The Dewy Skin Cream','skincare',7400,'https://tatcha.com/products/the-dewy-skin-cream'],
 ['Tatcha','The Water Cream','skincare',7400,'https://tatcha.com/pages/curate-your-own-set?country=US'],
 ['Charlotte Tilbury','Airbrush Flawless Setting Spray','makeup',3900,'https://www.charlottetilbury.com/us/product/airbrush-flawless-setting-spray']
]);
mixed('apple',[
 ['Apple','Apple Pencil (USB-C)','stylus',7900,'https://www.apple.com/shop/product/MUWA3AM/A/apple-pencil-usb-c'],
 ['Apple','Magic Trackpad (USB-C)','mouse',12900,'https://www.apple.com/shop/product/mxk93am/a/magic-trackpad-usb%E2%80%91c-white-multi-touch-surface'],
 ['Apple','HomePod (2nd generation)','speaker',29900,'https://support.apple.com/en-us/111843'],
 ['Beats','Solo 4','headphones',19999,'https://www.beatsbydre.com/headphones/solo4-wireless'],
 ['Beats','Studio Pro','headphones',29999,'https://www.beatsbydre.com/headphones/studio-pro-wireless']
]);
mixed('nordstrom',[
 ['New Balance','9060','shoes',15999,'https://www.newbalance.com/shoes/'],
 ['Coach','Swing Zip Bag','bag',39500,'https://www.coach.com/products/swing-zip-bag/CM565.html'],
 ['BIRKENSTOCK','Boston Soft Footbed Suede Leather','shoes',16995,'https://www.birkenstock.com/us/boston-soft-footbed-suede-leather/boston-suede-suedeleather-softfootbed-eva-u_49.html'],
 ['UGG','Tasman II','shoes',12500,'https://au.ugg.com/categories/mens/footwear/slippers'],
 ['Longchamp','Le Pliage Energy L Backpack','backpack',32000,'https://www.longchamp.com/us/en/men/001/bags/001xsa/backpacks/001xsaxsd/']
]);
add('coach','Coach','https://www.coach.com/shop/women/handbags/view-all',[
 ['Swing Zip Bag','bag',39500,'https://www.coach.com/products/swing-zip-bag/CM565.html','CM565'],
 ['Custom Pillow Tabby Shoulder Bag 18','bag',55000,'https://www.coach.com/products/upcrafted-pillow-tabby-shoulder-bag-18/CV107.html','CV107'],
 ['Juliet Shoulder Bag 25','bag',37500,'https://www.coach.com/products/juliet-shoulder-bag-25/CAD75-LHBLK.html','CAD75'],
 ['Hamptons Hobo Bag','bag',29500,'https://www.coach.com/products/hamptons-hobo-bag/CW642-B4%2FOL.html','CW642'],
 ['Rowan Satchel Bag','bag',22900,'https://world.coach.com/ch/shop/outlet/outlet-deals/last-chance']
]);
add('longchamp','Longchamp','https://www.longchamp.com/us/en/men/001/bags/001xsa/backpacks/001xsaxsd/',[
 ['Le Pliage Energy L Backpack','backpack',32000],['Boxford Backpack','backpack',49500],['Le Foulonné Backpack','backpack',79000],['Le Pliage Xtra M Backpack','backpack',89500],
 ['Le Roseau M Shoulder Bag','bag',89500,'https://www.longchamp.com/ie/en/bags/xsa/bags-by-collection/xsa-col/?cgid=XSA-COL&page=3&prefn1=LC_DisplayCountries&prefv1=IE%7C']
]);
add('tory','Tory Burch','https://www.toryburch.com/en-us/handbags/ella/',[
 ['Small Ella Tote','bag',24800],['Ella Tote','bag',29800],['Ella Printed Tote','bag',29800],['Ella Nylon Drawstring Tote','bag',39800],['Ella Natuura Drawstring Tote','bag',49800]
]);
add('gucci','Gucci','https://www.gucci.com/kw/en_gb/ca/women/la-famiglia/handbags-c-spring-summer-2026-women-handbags',[
 ['Gucci Horsebit 1955 Mini Bag','bag',140000,'https://www.gucci.com/us/en/ca/whats-new/gucci-horsebit-1955-c-gucci-horsebit-1955'],
 ['Gucci Bamboo 1947 Small Bag','bag',400000],
 ['GG Emblem Small Tote Bag','bag',235000,'https://www.gucci.com/us/en/pr/women/handbags/shoulder-bags-for-women/gg-emblem-small-tote-bag-p-815214FAD6M1425','815214 FAD6M 1425'],
 ['Gucci Jackie 1961 Medium Shoulder Bag','bag',360000],['Lunetta Small Crossbody Bag','crossbody',170000]
]);
add('prada','Prada','https://www.prada.com/us/en/womens/essentials/prada-re-edition/c/10103US',[
 ['Re-Edition 2008 Re-Nylon Mini Bag','bag',115000],['Re-Edition 2005 Saffiano Leather Bag','bag',285000],['Re-Edition 2005 Saffiano Leather Mini Bag','bag',215000],['Re-Nylon and Saffiano Leather Mini Shoulder Bag','bag',240000],['Re-Nylon Mini Shoulder Bag','bag',225000]
]);
add('lv','Louis Vuitton','https://us.louisvuitton.com/eng-us/women/small-leather-goods/all-small-leather-goods/_/N-t1djn1x0-bl17kbzy9',[
 ['Clémence Wallet · Monogram','wallet',65000],
 ['Victorine Wallet · Monogram','wallet',62500,'https://us.louisvuitton.com/eng-us/products/victorine-wallet-monogram-013217/M62472','M62472'],
 ['NéoNoé MM · Monogram','bag',237000,'https://us.louisvuitton.com/eng-us/products/neonoe-monogram-nvprod290007v/M44887','M44887'],
 ['Petit Noé · Monogram','bag',202000,'https://ca.louisvuitton.com/eng-ca/products/petit-noe-monogram-nvprod5320005v/M46984','M46984'],
 ['OnTheGo MM · Monogram','bag',340000,'https://us.louisvuitton.com/eng-us/products/onthego-mm-monogram-nvprod2130189v/M45321','M45321']
]);
add('hermes','Hermès','https://www.hermes.com/us/en/category/fragrances/',[
 ['Twilly d’Hermès Eau de Parfum','perfume',14400,'https://www.hermes.com/us/en/product/twilly-d-hermes-eau-de-parfum-V107264V0/','V107264V0'],
 ['Un Jardin sur le Toit Eau de Toilette','perfume',17000,'https://www.hermes.com/us/en/product/un-jardin-sur-le-toit-eau-de-toilette-V28103/','V28103'],
 ['Eau des Merveilles Eau de Toilette','perfume',14700,'https://www.hermes.com/us/en/product/compose-your-own-set-of-4-travel-sizes-V4NOMADEGIFT/'],
 ['Barénia Eau de Parfum','perfume',15400],
 ['H24 Eau de Toilette','perfume',12000,'https://www.hermes.com/us/en/product/compose-your-own-set-of-4-travel-sizes-V4NOMADEGIFT/']
]);
