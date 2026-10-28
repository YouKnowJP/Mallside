# Garment shape audit — v19

`garment-reference-rules.js` supplies a product-specific visual profile for every item in the physical clothing subset. The commerce `type` remains compatible with existing purchase IDs and receipts, while garment forms take precedence over that coarse label. No product identities, prices, photos or merchant assignments changed.

## Coverage

The current catalog contains **2,205 clothing listings using 568 unique photographs**. Every one receives a complete profile with kind, sleeve, neckline, length, fit, fabric, closure, pattern, pocket count, seams and ribbing. Additional geometry/fit hints include coverage (upper/bottom/full), leg shape, rise, high neckline, pleats, hood, quilting, sheer construction, straps and hem shape.

The audited classification covers 17 forms:

| Shape | Unique photos |
| --- | ---: |
| Tee | 72 |
| Shirt / blouse | 41 |
| Polo | 24 |
| Tank / corset top | 11 |
| Bra | 8 |
| Dress | 60 |
| Skirt / kilt | 11 |
| Jumpsuit | 3 |
| Sweater / sweatshirt | 37 |
| Hoodie | 29 |
| Cardigan | 15 |
| Jacket / blazer | 101 |
| Coat | 9 |
| Vest | 5 |
| Pants | 110 |
| Shorts / brief | 25 |
| Swim / bodysuit | 7 |

Catalog-name rules handle every product, with **35 photograph-reviewed overrides**. Those exceptions are keyed by the existing local photo path, so branch copies get the same look. The remainder are catalog-derived interpretations; this is not manual visual verification of all 568 images or a claim of exact manufacturer dimensions.

## Representative photograph review

Viewed the existing photographs directly for the following: Calvin Klein Camas Dress and Elia Blouse; Madewell Smocked Waist Midi Dress; Miu Miu Piqué Polo Vest; Soma Enbliss One Piece and Swimsuit Bottom; ba&sh Cyrus Jumpsuit; Windsor Dial Up The Drama, Polka Dot Corset and Eira Dress; Calvin Klein Christine Sweater; Zimmermann Devi Halter Silk Maxi Dress; lululemon Energy Bra; H&M Ribbed Tank; Topologie Puffer Pack Strap; Cult Gaia Stella Top; LSPACE Lily Rose and Misha; BHLDN 3-D Floral High-Low Dress; Burberry Wool Midi Kilt; Holiday Melina and Liana; Brandy Melville Chloe Top; Cinq à Sept Nyomi Top; Tommy Bahama Bubble Sleeve Top; the Angola Net Short Set; True Grit Cozy Crew; AG Sadie Crew; Janie and Jack Cabana Matching Set; UNIQLO Seamless Down Parka; The North Face Summit Nuptse gold/black jacket; UNIQLO Wide Straight Jeans; Max Mara Long Cashmere Coat; H&M Regular Fit Oxford Shirt; and Adidas Adicolor Classics SST Track Jacket. These photographs are unchanged catalog assets.

Notable corrections:

- Camas is a narrow-strapped slim midi dress, not a short-sleeved tee.
- Elia is a sheer long-sleeved high-neck blouse. Christine is a buttoned collared cardigan despite its Sweater name.
- The Madewell dress has puff sleeves, smocking and a dotted pattern.
- Miu Miu's pictured polo vest is layered over short sleeves. Its worn form should not gain long sleeves from the former type.
- The Cyrus Jumpsuit is strapless and wide-legged; the Eira dress is narrow-strapped, fitted and asymmetric rather than a standard straight midi.
- LSPACE's pictured Misha is ankle length despite the short product title. Stella is an open-shoulder halter top; Lily Rose is a short-sleeved lace tee.
- Oxford, resort and dress shirts use collars/buttons and suitable sleeve lengths. The T-shirt matcher is word-bounded so it does not accidentally match the end of “fit shirt” or “sweatshirt.” Polo Bear quarter-zip sweaters and Wimbledon Polo sweatshirts remain long sleeved.
- A high-waist Soma swimsuit bottom is bottom coverage even though the old commerce type is shirt. Briefs similarly require bottom geometry, not a tee body.
- Topologie Puffer Pack Strap is a detachable padded bag strap, not a jacket. Its profile has `special: 'bag-strap'` so a renderer can bypass garment bodies entirely.
- Two photographed matching sets carry explicit `setBottom: 'shorts'` and full coverage. The top and matching bottom should move independently with the appropriate body joints.

## Reviewed texture regions

Twenty reviewed entries include a normalized `photoRegion: [x0,y0,x1,y1]` for a conservative cloth-only panel in the unchanged source photograph. These regions avoid bare skin, neck openings, limbs, background, upstream promotional captions and, for jeans, the gap between legs. `onModel`, `photoView` and `photoRegionPart` explain what was sampled. They are panel texture coordinates rather than segmentation masks or claims that a rectangle contains the full garment silhouette.

The H&M Oxford photo is a collar/placket detail; its region uses the lower fabric/button section without the inner neck label. The UNIQLO down-parka photograph is promotional and cropped; its region uses the lower-right fabric without the overlaid logo text. The True Grit Cozy Crew reference is a back view and should guide fabric texture only, not front logo placement. The wide-jean region samples one leg rather than including the background in the inner-leg gap. Transparent Elia/Corset/Lace pieces intentionally have no reviewed texture ROI to avoid baking visible model skin into the material.

These coordinates are metadata. No images are cropped, generated or modified by this audit.

## Fit implications

Sleeveless garments must leave the base arms visible. Bras and cropped tops require a skin-colored torso under uncovered areas. Dresses and skirts should articulate or deform around seated bent legs without showing incompatible base trousers through the skirt; a full jumpsuit needs arm and leg attachments. Full-cover outfits should visually suppress conflicting lower garments during their preview while preserving equipment/ownership state. Maxi lengths must stop above the feet, and flared hems need enough seated width. Bottom-only swim/brief items must not hide the torso merely because the old commerce category is shirt.

Some pre-existing reference photographs visibly contain an “AI MODIFIED” watermark. This audit neither creates nor edits images and does not authenticate the upstream retailer's photo process. Product photograph provenance remains in the existing catalog source records.

## Validation

`node --check dist/garment-reference-rules.js` passed. An executable audit imported the function, deduplicated the 568 clothing photographs, checked all required enum fields against their allowed values, validated all 20 texture-region coordinates are within bounds with positive area and explicit on-model flags, and verified the shirt/sweatshirt, dress/jumpsuit, swimsuit-bottom, Topologie and reviewed-pose exceptions. The renderer owner adds integration and motion tests separately.
