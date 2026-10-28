// Original gameplay activities, requests, and calendar. No fictional merchandise.
export const ACTIVITIES=[
 {id:'bridge',venue:'bridge',name:'Garden bridge stroll',emoji:'🌉',minutes:15,energy:2,recovery:8,price:0,description:'Walk the planted bridge, watch the center below, and collect a place stamp.'},
 {id:'carousel',venue:'carousel',name:'Carousel ride',emoji:'🎠',minutes:12,energy:1,recovery:4,price:300,description:'A little turn beneath the lights, with a souvenir stamp for your journal.'},
 {id:'artwalk',venue:'art',name:'Sculpture court walk',emoji:'🎨',minutes:20,energy:2,recovery:5,price:0,description:'Explore the original installations and changing colors of Jewel Court.'},
 {id:'flowers',venue:'flowers',name:'Flower arranging workshop',emoji:'💐',minutes:25,energy:3,recovery:7,price:1000,description:'Spend a little time arranging flowers at the garden studio.'},
 {id:'cinema',venue:'cinema',name:'Matinée at the cinema',emoji:'🎬',minutes:45,energy:0,recovery:22,price:1200,description:'Take a proper seated break for an original in-game short-film screening.'},
 {id:'tea',venue:'lounge',name:'Tea on the terrace',emoji:'🍵',minutes:20,energy:0,recovery:18,hunger:8,price:600,description:'A warm tea and a quiet view. It helps stamina, but lunch still matters.'}
];
export const CALENDAR=[
 {name:'Maker Monday',theme:'Try something creative',activity:'flowers',bonus:1800,xp:35},
 {name:'Take-it-slow Tuesday',theme:'A little room to breathe',activity:'bridge',bonus:1200,xp:30},
 {name:'Wonder Wednesday',theme:'Make a small, joyful detour',activity:'carousel',bonus:1500,xp:35},
 {name:'Culture Thursday',theme:'Look up from the shop windows',activity:'artwalk',bonus:1500,xp:35},
 {name:'Film Friday',theme:'Put your shopping bags down',activity:'cinema',bonus:2200,xp:40},
 {name:'Terrace Saturday',theme:'A slower sip between shops',activity:'tea',bonus:1500,xp:35},
 {name:'Sunday in Bloom',theme:'Finish the week with something lovely',activity:'flowers',bonus:2200,xp:40}
];
export const ERRANDS=[
 {id:'everyday-top',name:'An everyday refresh',npc:'Maya',text:'Find a comfortable everyday top. Please check the label before buying.',types:['shirt'],budget:4000,rank:0,fee:2500,xp:45},
 {id:'hydration',name:'A bottle for the commute',npc:'Sam',text:'A real reusable water bottle or tumbler for my daily commute.',types:['bottle','tumbler'],budget:6000,rank:0,fee:2200,xp:45},
 {id:'small-treat',name:'A little hobby break',npc:'Eli',text:'Find a real LEGO set or a card game for a relaxed weekend.',types:['buildingtoy','cardgame'],budget:7500,rank:0,fee:2800,xp:50},
 {id:'warm-layer',name:'The evening gets chilly',npc:'Riley',text:'A hoodie, cardigan, or jacket for evening walks. Keep it within my budget.',types:['hoodie','cardigan','jacket'],budget:8500,rank:0,fee:3000,xp:50},
 {id:'denim-day',name:'A denim kind of day',npc:'Jamie',text:'A pair of actual jeans or trousers, in my usual waist size.',types:['pants'],budget:12000,rank:1,fee:3500,xp:60},
 {id:'sneaker-search',name:'A fresh pair',npc:'Kai',text:'A pair of sneakers or sandals. Compare the options before checking out.',types:['shoes','sandals'],budget:16000,rank:2,fee:4500,xp:65},
 {id:'creative-desk',name:'Something for my desk',npc:'Morgan',text:'I would love an actual tech accessory, pen, or LEGO set.',types:['tracker','mouse','keyboard','stylus','stationery','buildingtoy'],budget:16000,rank:2,fee:4000,xp:60},
 {id:'beauty-gift',name:'A little beauty gift',npc:'Zoe',text:'Find a named lip product, skincare product, or perfume. The label is part of the gift.',types:['lipstick','skincare','perfume'],budget:18000,rank:3,fee:5000,xp:70},
 {id:'designer-carry',name:'A considered carry',npc:'Léa',text:'A real bag or wallet from Coach, Longchamp, or Tory Burch.',types:['bag','wallet','crossbody','backpack'],stores:['coach','longchamp','tory'],budget:70000,rank:4,fee:9000,xp:90},
 {id:'jewel-box',name:'A small celebration',npc:'Tess',text:'A real jewelry design for a milestone. Please stay within my total budget.',types:['bracelet','necklace','earrings','ring'],budget:150000,rank:5,fee:18000,xp:110},
 {id:'fashion-house',name:'A fashion-house keepsake',npc:'Camille',text:'A small piece from a fashion house, chosen with care.',types:['wallet','belt','scarf','perfume','hat'],stores:['lv','gucci','prada','dior','chanel','ysl','bottega'],budget:160000,rank:5,fee:20000,xp:120},
 {id:'orange-keepsake',name:'A little orange-box moment',npc:'Luc',text:'A real Hermès design. Inspect the details before choosing.',stores:['hermes'],budget:220000,rank:6,fee:25000,xp:130}
];
