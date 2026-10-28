export const normalizeIdentity=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
const aliases={
 onrunning:'on',salvatoreferragamo:'ferragamo',ballyglobal:'bally',oakandfort:'oakfort',somaintimates:'soma',beachbunnyswimwear:'beachbunny',luckybrandjeans:'luckybrand',underarmourhouse:'underarmour',theorymens:'theory',bhldnatanthropologieco:'anthropologie',gbyguess:'gbg',

 zaraman:'zara',zaramens:'zara',zarakids:'zara',zarawoman:'zara',jomalonelondon:'jomalone',citizencompany:'citizen',zwillingjahenckels:'zwilling',sunglasshutinsidebloomingdales:'sunglasshut',
 ag:'agjeans',aloyoga:'alo',seven7forallmankind:'7forallmankind',sevenforallmankind:'7forallmankind',aerieamericaneagleoutfitters:'americaneagle',americaneagleoutfitters:'americaneagle',
 anthropologieco:'anthropologie',anthropologieweddings:'anthropologie',bhldn:'anthropologie',fpmovement:'freepeople',freepeoplemovement:'freepeople',aquabendita:'aguabendita',
 boss:'hugoboss',armaniexchange:'axarmaniexchange',axarmaniexchange:'axarmaniexchange',armani:'giorgioarmani',armanicollezioni:'giorgioarmani',
 hollisterco:'hollister',hollistercompany:'hollister',jcrewjcrewmens:'jcrew',jcrewmen:'jcrew',jjill:'jjill',stateandlibertyclothingcompany:'stateandliberty',stateliberty:'stateandliberty',
 roarkexpeditionunion:'roark',ragbonenewyork:'ragbone',mcqueen:'alexandermcqueen',louisvuittonmens:'louisvuitton',nikedelamo:'nike',nordstrombeautyhaven:'nordstrom',
 bathbodyworksflagship:'bathbodyworks',chanelboutique:'chanel',chanelfragranceandbeauty:'chanel',chanelfragrancebeauty:'chanel',chanelfinejewelry:'chanel',
 kiehlssince1851:'kiehls',loccitaneenprovence:'loccitane',lushfreshhandmadecosmetics:'lush',lushhandmadecosmetics:'lush',maccosmetics:'mac',diorbeauty:'dior',diormen:'dior',
 nordstromrack:'nordstromrack',macysmenhomefurniture:'macys',macysmenshome:'macys',macyswomens:'macys',macyshomefurniture:'macys',macysbackstage:'macys',
 bloomingsdales:'bloomingdales',bloomingdaleshome:'bloomingdales',lastchancestore:'nordstromrack',off5th:'saksoff5th',thecosmeticscompany:'cosmeticscompany',
 sghsunglasshut:'sunglasshut',sunglasshutwest:'sunglasshut',sunglasshutinternational:'sunglasshut',swarovskicrystal:'swarovski',swarvoskicrystal:'swarovski',
 caddiseyeappliances:'caddis',brightoncollectibles:'brighton',calzedoniaintimissimi:'intimissimicalzedonia',dknycompany:'dkny',jambajuice:'jamba',auntieannespretzels:'auntieannes',
 laderachchocolatiersuisse:'laderach',laderachswitzerland:'laderach',starbuckscoffee:'starbucks',starbuckscoffeeinsidemacys:'starbucks',starbuckscoffeemacyswomensentrance:'starbucks',
 benandjerrys:'benjerrys',somisomisoftservetaiyaki:'somisomi',pfchangschinabistro:'pfchangs',fiveguysburgersandfries:'fiveguys',pressedjuicery:'pressed',
 buildabearworkshop:'buildabear',buildabearxhellokittyandfriendsworkshop:'buildabear',lego:'lego',miniso:'miniso',barnesnoblebooksellers:'barnesnoble',
 bookofflowerlevel:'bookoff',bookoffupperlevel:'bookoff',spencergifts:'spencers',spencersgifts:'spencers',lidslockerroom:'lids',lockerroombylids:'lids',lidsoutdoorvillage:'lids',
 gnclivewell:'gnc',gnclivewell:'gnc',zalesjeweler:'zales',zalesthediamond:'zales',kayjewelers:'kay',kaysjewelers:'kay',kevinjewelers:'kevinjewelers',
 hugoboss:'hugoboss',poloralphlauren:'ralphlauren',poloralphlaurenchildren:'ralphlauren',uspoloassn:'uspoloassn',uspoloassn:'uspoloassn',
 northface:'northface',northfacethe:'northface',thenorthface:'northface',the1916companyiwcomega:'the1916company',tudoratthe1916company:'tudor',
 tagheuer:'tagheuer',iwcschaffhausen:'iwc',vancleefarpels:'vancleefarpels',williamssonoma:'williamssonoma',swainelondon:'swaine',
 qsouthmall:'q',qoutdoorvillage:'q',seeseaoutdoorvillage:'seesea',temporarylocationgarage:'garage'
};
// Aliases preserve individual brands; a parent company is not permission to mix its labels.
export function merchantIdentity(name){const cleaned=String(name||'').replace(/\s+at\s+(?:Neiman Marcus|Bloomingdale.?s|Nordstrom|Macy.?s|GARYS).*$/i,'').replace(/\s+(?:Mall [Ee]ntrance|Parking Lot|Outdoor Village)(?:\s+by|\s+near)?.*$/,'').replace(/\s*\((?:New Location|Main Level|South Mall|Lower Level|Upper Level)\)/gi,'').replace(/\b(?:Factory|Outlet|Store|Boutique|Flagship|International|Company Store)\b/gi,'').replace(/^The\s+/i,'');const n=normalizeIdentity(cleaned);return aliases[n]||n;}
export function storeAudience(name){return /\b(?:kids|kid|baby|babygap|gapkids|crewcuts|children|oshkosh)\b/i.test(name)?'child':'all';}
export const isDepartmentMerchant=name=>/^(?:Macy|Nordstrom|Bloomingdale|Neiman Marcus|Saks OFF|Ross|Marshalls|Target|JCPenney|Dick.s Sporting|Champs|JD(?: Sports)?$|Foot Locker|Finish Line|Journeys|Shoe Palace|Footwork|GNC|Vitamin World|Cosmetics Company|The Cosmetics Company|Perfumania|Fragrance|Perfume|Kestan|Local Market|Open Market|As Seen On TV|Optimus|Spencer|Zales|Kay |Kays |Kevin Jewelers|Ben Bridge|Swiss Watch|Tourneau|Bucherer|Watch City|Torre|Books Kinokuniya|BookOff|Barnes|Guitar Center|Sunglass Hut|SGH|LensCrafters|Lenscrafters|Whole Foods|Gelson|Mitsuwa|Toys R Us|ULTA|Olive Young|Moida|Shibuyala|Tokyo Japanese|Anime|Lids|Dodger Clubhouse|Fanzz|Sports Treasures|Pro Image|Chalice|Chrono Toys|The Webster|GARYS|Rebag|Fashionphile|FASHIONPHILE|The 1916)/i.test(name);
