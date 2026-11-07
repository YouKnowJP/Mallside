import {VERIFIED_PHONE_ADDITIONS} from './store-product-additions-v61.js?v=61.0.0';
import {VERIFIED_DIVE_WATCH_ADDITIONS} from './store-product-additions-v62.js?v=62.0.0';

const DATE = '2026-11-06';
const APPLE_STORES = ['apple', 'century-tenant-apple-Level1', 'beverly-tenant-apple-Level7', 'delamo-tenant-apple-Mainlevel', 'spectrum-tenant-apple'];
const APPLE_DIRECTORY = 'https://www.apple.com/retail/storelist/';
const APPLE_PHONE = 'https://www.apple.com/shop/buy-iphone/';
const SHARE_ALIKE = 'https://creativecommons.org/licenses/by-sa/4.0';
const CC0 = 'https://creativecommons.org/publicdomain/zero/1.0';
const PHOTO_GROUP = 'v66-shopping-edit';
const PHONE_PRICE_NOTE = 'Apple US one-time hardware price for connecting to a carrier later, checked 6 November 2026. Game prices and branch stock are simulated.';
const FORMAT_NOTE = 'Retailer-selected storage. The photograph shows the finish and body.';

function photo(id, file, image, description, author, license, licenseUrl, changes, variantNote) {
 return {
  path:'assets/photos/v66-' + id + '.webp', source:'https://commons.wikimedia.org/wiki/File:' + file,
  imageUrl:'https://upload.wikimedia.org/wikipedia/commons/' + image,
  description, author, rightsHolder:author, license, licenseUrl, changes, variantNote, group:PHOTO_GROUP
 };
}
const ultramarine = photo('iphone16-ultramarine', 'Back_view_of_iPhone_16_Ultramarine.jpg', 'b/bf/Back_view_of_iPhone_16_Ultramarine.jpg',
 'Back of the iPhone 16 in Ultramarine', 'メイド理世', 'CC-BY-SA-4.0', SHARE_ALIKE,
 'Orientation normalized, resized to 1200 pixels high and encoded as WebP without cropping.',
 'Rear view of an Ultramarine display handset. The display tether is separate from the selected hardware.');
const lavender = photo('iphone17-lavender', 'IPhone_17_(Lavender)_-_Backside.jpg', 'a/ab/IPhone_17_%28Lavender%29_-_Backside.jpg',
 'Back of the iPhone 17 in Lavender', 'AzureSaturn', 'CC0-1.0', CC0,
 'Resized to 1200 pixels high and encoded as WebP without cropping.',
 'Rear view of a Lavender iPhone 17. Storage is documented by the retailer.');
const airpods = photo('airpods-pro-3', 'AirPods_Pro_3_with_case.jpg', 'b/b9/AirPods_Pro_3_with_case.jpg',
 'AirPods Pro 3 in the charging case', 'Auggie G', 'CC-BY-3.0', 'https://creativecommons.org/licenses/by/3.0',
 'Encoded as WebP at the original 695 × 527 dimensions.', 'Video still showing both earbuds and the charging case.');
const [pink, black] = VERIFIED_PHONE_ADDITIONS;
const [watch] = VERIFIED_DIVE_WATCH_ADDITIONS;

function iphone16(finish, color, rimColor, image, variantNote = image.variantNote) {
 const slug = finish.toLowerCase();
 return {
  id:'v66-apple-iphone16-' + slug, modelId:'v61-real-iphone16-' + slug + '-128',
  name:'iPhone 16 · 128GB · ' + finish, type:'phone', priceUSD:829, sizes:['128GB'], optionLabel:'STORAGE',
  color, colorName:finish, referenceSKU:'A3081', sizeBasis:FORMAT_NOTE,
  source:APPLE_PHONE + 'iphone-16/6.1-inch-display-128gb-' + slug + '-unlocked',
  sourceOfferNote:PHONE_PRICE_NOTE, material:'Aluminum frame, color-infused glass and vertically aligned rear cameras.',
  photo:image, phoneProfile:{...pink.phoneProfile, rimColor, photoAuthor:image.author, photoLicenseUrl:image.licenseUrl, photoNote:variantNote}
 };
}

const apple = [
 iphone16('Pink', pink.color, pink.phoneProfile.rimColor, pink.photo, 'Pink display sample behind a clear case. Case, tether and hand are separate from the selected hardware.'),
 iphone16('Black', black.color, black.phoneProfile.rimColor, black.photo, 'Black display sample held in front of an Apple display. Hand, tether and display are separate from the selected hardware.'),
 {...iphone16('Ultramarine', '#6574c8', '#4f5aa6', ultramarine), modelId:'v66-apple-iphone16-ultramarine'},
 {
  id:'v66-apple-iphone17-lavender', name:'iPhone 17 · 256GB · Lavender', type:'phone', priceUSD:929,
  sizes:['256GB'], optionLabel:'STORAGE', color:'#b8aed6', colorName:'Lavender', referenceSKU:'iPhone 17 · US',
  source:APPLE_PHONE + 'iphone-17/6.3-inch-display-256gb-lavender-unlocked', sizeBasis:FORMAT_NOTE,
  sourceOfferNote:PHONE_PRICE_NOTE, material:'Aluminum frame, color-infused glass back and Ceramic Shield 2 front.',
  photo:lavender, phoneProfile:{reviewed:true, widthMM:71.5, heightMM:149.6, depthMM:7.95, weightGrams:177,
   displayInches:6.3, manufacturerSource:'https://www.apple.com/iphone-17/specs/', rimColor:'#8f80ac',
   photoAuthor:lavender.author, photoLicenseUrl:lavender.licenseUrl, photoLicense:'CC0 1.0', photoNote:lavender.variantNote}
 },
 {
  id:'v66-apple-airpods-pro-3', name:'AirPods Pro 3', type:'earbuds', priceUSD:249, sizes:['Earbuds + charging case'],
  optionLabel:'PACKAGE', color:'#f4f3ef', colorName:'White', referenceSKU:'A3063 / A3064 / A3065',
  source:'https://www.apple.com/shop/buy-airpods/airpods-pro-3',
  sourceOfferNote:'Apple US one-time package price checked 6 November 2026. Game prices and branch stock are simulated.',
  material:'White in-ear wireless earbuds and a compact charging case. Inspect the original game model or look at the licensed reference photograph.',
  photo:airpods
 }
].map(p => ({...p, brand:'Apple', merchant:'Apple', retailerDirectory:APPLE_DIRECTORY, storeIds:APPLE_STORES}));

const tudor = [
 ['century-tenant-tudor-Level1', 'Tudor', 'Westime', 'https://westime.com/catalog/watches/tudor/black-bay-54-steel',
  'https://www.tudorwatch.com/en/retailers/details/unitedstates/california/losangeles/131436-tudorboutiquewestimelosangeles'],
 ['island-tenant-tudoratthe1916company-main', 'Tudor at The 1916 Company', 'The 1916 Company',
  'https://www.the1916company.com/watches/tudor/black-bay/black-bay-m79000n-0001/',
  'https://www.tudorwatch.com/en/retailers/details/unitedstates/california/newportbeach/10661-the1916companynewportbeach']
].map(([store, merchant, retailer, source, retailerDirectory]) => ({
 ...watch, id:'v66-tudor-black-bay54-steel', modelId:watch.id, merchant, sourceRetailer:retailer, source,
 retailerDirectory, storeIds:[store], sourceAvailability:'Retailer catalog listing. Local inventory is unconfirmed.',
 sourceOfferNote:retailer + ' US published price checked 6 November 2026. Game prices, branch stock and returns are simulated.'
}));

const ADDITIONS = [...apple, ...tudor];
export const SHOPPING_EDIT_PHOTOS = Object.fromEntries(ADDITIONS.map(({id, photo}) => [id, photo]));

export function shoppingEditListings(stores, associationFor) {
 const byId = new Map(stores.map(st => [st.id, st]));
 return ADDITIONS.flatMap(({storeIds, photo, retailerDirectory, ...p}) => storeIds.map(store => {
  const st = byId.get(store);
  const price = Math.round(p.priceUSD * 100);
  const listing = {...p, id:store + '::' + p.id, store, assetKey:p.id, modelId:p.modelId || p.id,
   price, retail:price, reference:p.referenceSKU, referenceAmount:p.priceUSD, referenceCurrency:'USD',
   sourceRetailer:p.sourceRetailer || 'Apple US', sourceKind:'retailer-product-page', referencePriceVerified:true,
   referenceCheckedOn:DATE, observedPriceDate:DATE, priceBasis:p.sourceOfferNote, collectionReference:66,
   condition:'New', seed:true, finalSale:false, audience:'adult', merchantOnly:true, merchantNames:[st.name],
   merchantEvidence:{kind:'exact-retailer-product', source:p.source, checkedOn:DATE, selectedSKU:p.referenceSKU,
    selectedColor:p.colorName, selectedFormat:p.sizes[0], retailerAssociationSource:retailerDirectory}
  };
  const evidence = associationFor(st, listing);
  return {...listing, associationEvidence:evidence, assortmentBasis:evidence.kind === 'own-brand' ? 'brand-models' : 'documented-retailer'};
 }));
}
