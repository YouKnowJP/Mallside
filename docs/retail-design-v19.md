# Mallside v19: the full physical catalog

All **2,971 clothing/bag listings**, sharing **752 distinct reference photographs**, now have construction and surface profiles. This replaces the six-family-only approach with 568 clothing references across 17 garment forms, and 184 bag references across 89 named/family construction rules and 12 silhouettes. No products, prices or source photographs were invented or changed for this release.

## Shape and material evidence

`garment-reference-rules.js` separates tees, shirts, polos, tanks, bras, dresses, skirts, jumpsuits, sweaters, hoodies, cardigans, jackets, coats, vests, pants, shorts and swim/bodysuits. Sleeve, neckline, closure, hem, leg, fit, coverage, fabric and pocket rules follow the actual names/materials. Thirty-five existing photographs were directly reviewed; twenty have conservative cloth-only texture regions. See `garment-audit-v19.md` for exact exceptions and source-view limits.

`bag-reference-rules.js` covers totes, buckets, crescents, hobos, satchels, duffels, flaps, pouches, backpacks, wallets, boxes and special constructions. Fifty-two photographs were directly reviewed; nine regions isolate bags in model/composite photographs. Profiles distinguish padded Tabby, curved Cleo, asymmetric Saddle, knotted Jodie, wide Cassette weave, Jackie closure, bamboo handles, bucket drawstrings, luggage, phone sleeves, charms and other documented forms. See `bag-audit-v19.md` for construction sources and limits. Some small detail tokens use the shared seam/closure treatment and the photographed surface rather than a separate sculpted ornament.

The previous manufacturer measurement references remain, with Mini Jodie and the pictured Dior Saddle added by the audit. Most other dimensions are conservative game estimates using the model profile and photograph proportions, not manufacturer measurements. Packshot proportions adjust hanging garments conservatively rather than applying full-person bounds to an item worn by a model. Exact physical fit and rear/unseen details cannot be established from one front photograph.

`analyze-product-surfaces.py` reads existing photograph pixels and emits JSON/JavaScript metadata: checksum, foreground aspect, row widths, panel coordinates, palette and a compact color/print sample. It does not write or edit raster images. Source-body backgrounds connected to a white panel edge are filtered from the compact sample, and trouser samples use one leg rather than the gap. The 29 reviewed texture regions and raw photographs remain traceable in `photo-surfaces-v19.json`.

Reproduction requires Python with Pillow:

```sh
node scripts/export-product-surfaces.mjs > /private/tmp/mallside-product-surfaces.json
python3 scripts/analyze-product-surfaces.py /private/tmp/mallside-product-surfaces.json
```

## Meshes and surfaces

`merchandise-garments.js` constructs different hanging forms, including collars/plackets, puff or absent sleeves, straps, full dresses/skirts, separate trouser legs, jumpsuits, coat lengths, pockets, quilting and appropriate briefs. The misclassified Topologie padded strap receives strap geometry. `merchandise-bags.js` builds curved or tapered bodies, gussets, flaps, edge piping, zips, drawstrings, handles, pockets and matching hardware. It uses flat solid straps and instanced chain links. This is original stylized geometry, not licensed manufacturer CAD.

Every physical reference has a sampled surface. Inside stores and on equipped pieces, suitable isolated/reviewed body regions can use UV coordinates into the original local photograph for higher-resolution print and brand detail. Regions with excessive detected background retain the compact filtered surface. Back/detail-only garment photographs guide fabric instead of inventing a front logo. Repeated prints have separate aspect-aware body, sleeve and skirt mappings so dots/checks are not stretched to the character's proportions. Unseen sides/back use matching fabric treatments; exact reverse-side branding is not claimed.

Cotton, denim, knit, fleece, nylon, canvas, silk, tweed, suede, raffia, saffiano, leather and glazed finishes have appropriate original grain/roughness treatments. Exact photo texture and game lighting can differ from the actual product. Folded ambient stock also uses the photo-derived palette. Product details keep the original photograph, price and source link and describe the visual adaptation.

## Worn fit and movement

Curved worn shells support cropped/sleeveless styles, collars, halter straps, puff sleeves, coats and dresses. Sleeves follow actual arm joints. Bottoms follow thigh and shin joints, with hip caps bridging the waist. Full dresses/jumpsuits suppress conflicting lower clothing visually without changing ownership or equipment records. Bottom-only pieces do not cover the torso. Size ease remains a gameplay model rather than real-world sizing advice.

`updateOutfitPose` follows the final activity pose. Seated knees bend and shoe soles remain level; longer hems deform around the bent hips and restore exactly when standing. Crossbody bags move outside the lap/thighs, shoulder bodies stay outside sleeves, and backpacks shift beside the seated shopper to clear the bench back. Straps are rebuilt to the new bag position while retaining shoulder anchors. Held merchandise keeps an actual wrist grip and stays upright/above the floor. Food, cups and ice cream attach to the right hand; carried merchandise moves to the other hand during consumption. Portraits also update and restore attachment frames.

## Resource and compatibility behavior

Front/back material sections use bounded draw groups; repeated rack models and chain links remain instanced. Full-resolution photo loads are reserved for interiors and worn bag/body pieces, while mall windows use compact surfaces. Repeated fitting releases the old rig's own geometry, materials and textures while preserving shared catalog templates. Late image callbacks cannot revive disposed materials. A regression test checks repeated preview cleanup.

The commerce catalog, stock, integer-cent transactions, source associations, tag rules, receipts, saves and progression are unchanged. The 2D renderer and wardrobe illustration remain available and explicitly illustrated. This release does not promise exact product replicas, cloth physics, hardware testing on every device, or absence of every possible clipping case.
