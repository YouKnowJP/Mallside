const date = '2026-11-07';
const toyStore = 'delamo-tenant-toysrusatmacys-Mainlevel';
const toyDirectory = 'https://www.simon.com/mall/del-amo-fashion-center/stores/toys-r-us-at-macys';
const verizonStore = 'spectrum-tenant-verizonwireless';
const verizonDirectory = 'https://www.irvinespectrumcenter.com/shopping/stores/verizon-wireless';
const samsungSpecs = 'https://images.samsung.com/is/content/samsung/assets/us/business/mobile/phones/galaxy-s25/02052025/S25_Series_B2B_Spec_Sheet_HRc.pdf';
const sourceImages = 'https://upload.wikimedia.org/wikipedia/commons/';
const gallery = 'https://commons.wikimedia.org/wiki/File:';

function photo(id, file, image, description, author, version, dimensions, rotated = false) {
 return {path:'assets/photos/v67-'+id+'.webp',source:gallery+file,imageUrl:sourceImages+image,description,author,
  rightsHolder:author,license:'CC-BY-SA-'+version,licenseUrl:'https://creativecommons.org/licenses/by-sa/'+version+'/',
  changes:(rotated?'Orientation normalized, resized':'Resized')+' to '+dimensions+' and encoded as WebP without cropping.',
  group:'v67-game-table'};
}

const jenga = photo('jenga-classic','Jenga_tower_1.JPG','f/f0/Jenga_tower_1.JPG',
 'A Jenga Classic hardwood tower in play','Joshjrowe','3.0','900 × 1200',true);
const cube = photo('rubiks-3x3','Rubik%27s_Cube_3x3.jpg','0/0f/Rubik%27s_Cube_3x3.jpg',
 'A scrambled black Rubik’s 3×3 cube with six tile colors','Thenror','4.0','1200 × 1002');
const letters={
 path:'assets/photos/v67-scrabble-classic.webp',source:gallery+'Scrabble_tiles_en.jpg',
 imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Scrabble_tiles_en.jpg/1280px-Scrabble_tiles_en.jpg',
 description:'All 100 English-language Scrabble tiles',author:'Agentsoo',rightsHolder:'Agentsoo',license:'PD-self',
 licenseUrl:gallery+'Scrabble_tiles_en.jpg',changes:'1280-pixel source preview resized to 1200 × 1155 and encoded as WebP.',
 group:'v67-game-table'
};
const galaxy = photo('galaxy-s25-ultra','Samsung_Galaxy_S25_Ultra_Titanium_Silverblue.jpg','2/25/Samsung_Galaxy_S25_Ultra_Titanium_Silverblue.jpg',
 'The back of a Samsung Galaxy S25 Ultra in Titanium Silverblue','Alvis Jean','4.0','900 × 1200',true);

const additions = [
 {
  id:'v67-jenga-classic', store:toyStore, retailerDirectory:toyDirectory, brand:'Hasbro Gaming', name:'Jenga Classic · 54 hardwood blocks',
  type:'toy', sizes:['54-block set'], optionLabel:'SET', colorName:'Natural hardwood', color:'#c99a62',
  source:'https://www.macys.com/shop/product/hasbro-gaming-jenga-classic-puzzle-game?ID=23636310', sourceRetailer:'Macy’s US',
  referenceSKU:'Macy’s 23636310', referenceAmount:14.99,
  sourceOfferNote:'Macy’s published $14.99 comparison price checked 7 November 2026. The same page showed a temporary discount. Game stock and discounts are simulated.',
  material:'Classic 54-block hardwood tower. Alternate the direction of each layer, then move one block at a time.',
  toyProfile:{kind:'tower',photoNote:'The classic tower is pictured during play. Retail packaging and the stacking sleeve are not shown.'}, photo:jenga
 },
 {
  id:'v67-rubiks-3x3', store:toyStore, retailerDirectory:toyDirectory, brand:'Rubik’s', name:'Rubik’s Cube · Original 3×3',
  type:'toy', sizes:['3×3 cube'], optionLabel:'FORMAT', colorName:'Six colors / black frame', color:'#4d8269',
  source:'https://www.macys.com/shop/product/rubiks-cube-the-original-3x3-color-matching-puzzle-classic-problem-solving-challenging-brain-teaser-fidget-toy-for-adults-kids-ages-8-up?ID=13923353',
  sourceRetailer:'Macy’s US archived listing', priceSource:'https://www.gamestop.com/toys-games/puzzles/products/rubiks-3x3-cube/316739.html?a=1',
  referenceSKU:'Spin Master 6063964', referenceAmount:10.99, historical:true,
  sourceOfferNote:'Macy’s product page is unavailable for purchase. $10.99 is GameStop’s non-member US price for Spin Master 6063964, checked 7 November 2026. Game stock and discounts are simulated.',
  material:'Original six-color 3×3 format with a black frame and molded color tiles.',
  toyProfile:{kind:'cube',photoNote:'This licensed photograph shows a scrambled original-format 3×3. The retailer pages document the offered format and price.'}, photo:cube
 },
 {
  id:'v67-scrabble-classic', store:toyStore, retailerDirectory:toyDirectory, brand:'Hasbro Gaming', name:'Scrabble Classic · 100 wooden tiles',
  type:'toy', sizes:['English board game'], optionLabel:'EDITION', colorName:'Natural tiles / classic board', color:'#b88858',
  source:'https://www.macys.com/shop/product/hasbro-gaming-scrabble-classic-board-game?ID=16955736',
  sourceRetailer:'Macy’s US archived listing', priceSource:'https://www.kohls.com/product/prd-5588392/hasbro-scrabble-game.jsp',
  referenceSKU:'Hasbro F4204', referenceAmount:24.99, historical:true,
  sourceOfferNote:'Macy’s archived box and contents match the F4204 edition. $24.99 is Kohl’s US price for F4204, checked 7 November 2026. Game stock and discounts are simulated.',
  material:'English-language board game with 100 wooden letter tiles, four racks and a drawstring bag.',
  toyProfile:{kind:'letters',photoNote:'This component photograph shows the 100 English-language tiles. The board, box and bag are documented by the retailer.'}, photo:letters
 },
 {
  id:'v67-galaxy-s25-ultra', store:verizonStore, retailerDirectory:verizonDirectory, brand:'Samsung', name:'Galaxy S25 Ultra · 256 GB · Titanium Silverblue',
  type:'phone', sizes:['256GB'], optionLabel:'STORAGE', colorName:'Titanium Silverblue', color:'#667582',
  source:'https://indirect-soe-nsd2.verizon.com/smartphones/samsung-galaxy-s25-ultra/?sku=sku6019387',
  sourceRetailer:'Verizon US', referenceSKU:'sku6019387', referenceAmount:1299.99,
  priceSource:'https://www.samsung.com/us/smartphones/galaxy-s25-ultra/buy/galaxy-s25-ultra-256gb-verizon-sm-s938uzbavzw/',
  sourceOfferNote:'Verizon published a $1,299.99 full retail reference for Titanium Silverblue and marked it out of stock. Manufacturer variant SM-S938UZBAVZW documents the 256 GB finish. Game stock and payments are simulated.',
  material:'Titanium frame, glass front and back, separate rear camera rings and built-in S Pen.',
  phoneProfile:{reviewed:true,body:'s25-ultra',widthMM:77.6,heightMM:162.8,depthMM:8.2,weightGrams:218,displayInches:6.9,
   rimColor:'#9daab5',manufacturerSource:samsungSpecs,manufacturerModelUS:'SM-S938UZBAVZW',
   photoAuthor:galaxy.author,photoLicenseUrl:galaxy.licenseUrl,
   photoNote:'The hand-held photograph shows the back and finish. Manufacturer and carrier pages document storage and SKU.'}, photo:galaxy
 }
];

export const NEW_COLLECTION_REFERENCE = 67;
export const WORKSHOP_PHOTOS = Object.fromEntries(additions.map(({id,photo})=>[id,photo]));

export function workshopListings(stores, associationFor) {
 const byId = new Map(stores.map(st=>[st.id,st]));
 return additions.map(({photo,retailerDirectory,historical,...p})=>{
  const st=byId.get(p.store);
  const price=Math.round(p.referenceAmount*100);
  const listing={...p,id:st.id+'::'+p.id,assetKey:p.id,modelId:p.id,price,retail:price,reference:p.referenceSKU,
   referenceCurrency:'USD',referencePriceVerified:true,referenceCheckedOn:date,observedPriceDate:date,priceBasis:p.sourceOfferNote,
   sourceKind:'retailer-product-page',collectionReference:NEW_COLLECTION_REFERENCE,condition:'New',seed:true,finalSale:false,
   merchant:st.name,merchantOnly:true,merchantNames:[st.name],audience:'adult',
   merchantEvidence:{kind:'exact-retailer-product',source:p.source,checkedOn:date,selectedSKU:p.referenceSKU,
    selectedColor:p.colorName,selectedFormat:p.sizes[0],retailerAssociationSource:retailerDirectory}};
  const evidence=associationFor(st,listing);
  return {...listing,assortmentBasis:'documented-retailer',associationEvidence:{...evidence,...historical?{historical:true}:{}}};
 });
}
