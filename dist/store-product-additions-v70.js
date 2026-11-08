import {SHOP_STAFF_EDITION} from './shop-staff.js?v=70.0.0';

const date='2026-11-07';
const directory='https://www.irvinespectrumcenter.com/shopping/stores/att';
const offers=[
 {assetKey:'v66-apple-iphone16-pink',sku:'6586E',slug:'apple-iphone-16-128gb-pink',amount:729.99,
  priceSource:'https://www.business.att.com/content/dam/businesscenter/pdf/legal/att-business-equipment-list.pdf',
  note:'Earlier AT&T Business full undiscounted equipment price for 6586E. The consumer listing marked this Pink selection unavailable when checked 7 November 2026.'},
 {assetKey:'v66-apple-iphone17-lavender',sku:'6065F',slug:'apple-iphone-17-256gb-lavender',amount:929.99},
 {assetKey:'v67-galaxy-s25-ultra',sku:'6846E',slug:'samsung-galaxy-s25-ultra-256gb-titanium-silverblue',amount:1299.99}
];

export function phoneCounterListings(st,products,associationFor){
 return offers.map(({assetKey,sku,slug,amount,priceSource,note})=>{
  const {name,brand,modelId,type,sizes,optionLabel,color,colorName,phoneProfile:body,material}=products.find(p=>p.assetKey===assetKey);
  const phoneProfile={...body};
  delete phoneProfile.manufacturerModelUS;
  const source='https://www.att.com/buy/phones/'+slug,price=Math.round(amount*100);
  const sourceOfferNote=(note||'AT&T US full retail equipment price checked 7 November 2026.')+' Game prices and branch stock are simulated.';
  const listing={id:st.id+'::'+assetKey,store:st.id,assetKey,name,brand,modelId,type,sizes,optionLabel,color,colorName,phoneProfile,material,
   source,sourceRetailer:note?'AT&T US · earlier business reference':'AT&T US',priceSource:priceSource||source,referenceSKU:sku,reference:sku,
   price,retail:price,referenceAmount:amount,referenceCurrency:'USD',referencePriceVerified:true,referenceCheckedOn:date,observedPriceDate:date,
   sourceOfferNote,priceBasis:sourceOfferNote,sourceKind:'retailer-product-page',collectionReference:SHOP_STAFF_EDITION,condition:'New',seed:true,
   finalSale:false,audience:'adult',merchant:st.name,merchantOnly:true,merchantNames:[st.name],
   merchantEvidence:{kind:'exact-retailer-product',source,checkedOn:date,selectedSKU:sku,selectedColor:colorName,selectedFormat:sizes[0],retailerAssociationSource:directory}};
  return {...listing,assortmentBasis:'documented-retailer',associationEvidence:{...associationFor(st,listing),...note?{historical:true}:{}}};
 });
}
