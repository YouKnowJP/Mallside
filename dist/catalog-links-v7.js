// Primary model pages checked October 26, 2026. Prices are still game values.
const direct={
 'Hermès|H24 Eau de Toilette':'https://www.hermes.com/us/en/product/h24-eau-de-toilette-V101561V0/',
 'Hermès|Calvi Duo Compact card holder':'https://www.hermes.com/us/en/product/calvi-duo-compact-card-holder-H082977CK55/',
 'UNIQLO|SUPIMA Cotton Crew Neck T-Shirt':'https://www.uniqlo.com/us/en/products/E455365-000/00',
 'UNIQLO|U AIRism Cotton Oversized T-Shirt':'https://www.uniqlo.com/us/en/products/E465185-000/00',
 'Coach|Tabby Shoulder Bag 26':'https://www.coach.com/products/tabby-shoulder-bag-26/CH857-V5BLK.html',
 'New Balance|9060':'https://www.newbalance.com/pd/9060/U9060BLK-D-115.html',
 'CHANEL|N°5 Eau de Parfum Spray':'https://www.chanel.com/us/fragrance/p/125530/n5-eau-de-parfum-spray/',
 'Dior|Sauvage Eau de Parfum':'https://www.dior.com/en_us/beauty/products/sauvage-eau-de-parfum-Y0785220.html',
 'Alo|Accolade Crew Neck Pullover':'https://www.aloyoga.com/products/u3031rg-accolade-crew-neck-pullover-black'
};
const details={
 'Hermès|H24 Eau de Toilette':'H24 is a real Hermès eau de toilette with clary sage, narcissus, rosewood and sclarene notes. The reference page is the 100 ml presentation; the game price is simulated.',
 'Hermès|Calvi Duo Compact card holder':'A compact Hermès card holder with snap closure, a credit-card slot and a separate snap pocket. The linked reference is a Mysore goatskin version. Illustrated colors and game stock are simulated.',
 'UNIQLO|SUPIMA Cotton Crew Neck T-Shirt':'A real UNIQLO crew-neck T-shirt made from 100% SUPIMA cotton. The official page provides its current material, fit, size and color details.',
 'UNIQLO|U AIRism Cotton Oversized T-Shirt':'A real Uniqlo U AIRism cotton T-shirt with dropped shoulders, half sleeves and an oversized silhouette. The official page provides current size and fabric details.',
 'Coach|Tabby Shoulder Bag 26':'A real Coach shoulder bag with a structured silhouette and detachable short and long straps. Materials and colors vary by reference; see the linked model.',
 'Dior|Sauvage Eau de Parfum':'A real Dior fragrance in the Sauvage collection. The linked official page describes the refillable eau de parfum and available presentations.'
};
export function improveProductLinks(products){for(const p of products){const identity=p.brand+'|'+p.name,link=direct[identity];if(details[identity])p.material=details[identity];if(link){p.source=link;p.sourceKind='product';}if(p.brand==='LEGO'&&/^\d{5}$/.test(p.reference)&&p.source.endsWith('.pdf')){p.priceSource=p.source;p.source='https://www.lego.com/en-us/service/building-instructions/'+p.reference;p.sourceKind='set';}}}
export function sourceLabel(p){return p.sourceKind==='set'?'Real LEGO set & instructions ↗':p.sourceRetailer?'View '+p.sourceRetailer+' product reference ↗':p.sourceKind==='product'?'View real '+p.brand+' product ↗':'View '+p.brand+' model reference ↗';}
