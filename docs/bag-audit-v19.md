# Bag construction audit — v19

The physical catalog contains **184 unique bag/reference photographs** (many branch listings share a photograph). `bag-reference-rules.js` assigns every current bag, crossbody, backpack, duffel and wallet a construction profile; none of the current photographs falls back to the generic `shoulder` model family. The profiles currently resolve to 89 named/family groups and twelve silhouette classes. These are game construction rules and visual proportions, not manufacturer CAD.

## Profile contract

`bagProfile(p)` returns `silhouette`, `aspect` (body width/body height, excluding handles), `taper` (top/base width ratio), `roundness` (corner/curve fraction), `depthRatio` (depth/body width), `construction`, `carry`, `handles`, `closure`, `detail`, `finish`, `pattern`, `modelFamily`, `sizeClass`, `source` and `evidence`. Some profiles add `topDip`, `flapDip`, `integratedHandle`, `chain`, `paddedEdges`, `envelope`, `trim`, `hardwareColor`, `handleDropRatio`, `patternScale`, `photoRegion` or a sourced `reference`.

`source` retains the existing catalog reference. `evidence: catalog-name-and-material` means a family inference, not a claim of individual photograph verification. Nine exceptional photos have a manually reviewed body crop in normalized `[left,top,right,bottom]` coordinates. `photoPresentation: worn` means a model is in the photo; do not infer the bag's silhouette from the full human outline. Two additional regions isolate the representative product in a composite or small-accessory photo. `aspectEvidence: reviewed-photo` identifies visual estimates, not exact measurements. The material/texture renderer should treat `trim: null` as inheriting the body color. All crops are metadata only; the photographs are not modified.

### Coverage

| Body silhouette | Unique photos |
| --- | ---: |
| Tote | 46 |
| Hobo | 30 |
| Flap | 29 |
| Backpack | 16 |
| Box / case | 16 |
| Satchel | 13 |
| Wallet | 11 |
| Pouch | 7 |
| Bucket | 6 |
| Crescent | 5 |
| Duffel | 3 |
| Saddle | 2 |

Counts describe body treatments; handles, gussets, side panels and closures further distinguish the models.

## Visual review

**52 local product photographs were inspected individually**. The other current products receive named/model-family rules inferred from their catalog identity and material; this is not a manual 184-photo verification claim.

Reviewed groups included:

- Gucci Jackie medium: brown pebbled rounded body, single shoulder strap and vertical piston closure.
- Bottega Mini Jodie and Jodie: wide rounded woven body, substantial knot and short integrated handle. Barbara is a rectangular double-handle tote; Madison is a woven flap with gold ring clasp; Giorno has a wide soft trapezoid flap and side cords; Corso flares at its sides; Lauren is a rounded tab pouch with chain; Pinacoteca is a double-handle soft tote; Campana uses an integrated oval handle opening.
- Dior chocolate suede Saddle: asymmetric saddle body with drop-D stirrup hardware. Toujours is a small cannage hobo with deeply curved handle opening.
- Prada Cleo: shallow concave top and strongly curved lower corners, thin shoulder strap, pale glazed surface and triangular plaque.
- Longchamp Roseau: tall suede bucket with silver bamboo-shaped toggle. The Original L tote photo is on a full-body model and needs a body crop.
- Saint Laurent Simone medium: the bag sits across a model's lower torso, requiring a crop. Simone large is a wide envelope bag. Mombasa has an exaggerated round lower body, deep top dip and rigid curved handle. Icarino has an integrated handle opening. Le 5 à 7 has a slim vertical hobo body and YSL closure. Gaby is a small zip-around vanity case.
- Hermès Evelyne: vertical pebbled pouch/body with rounded bottom corners and perforated H panel.
- ALDO Legoriaa: shallow zip crossbody rectangle; Zoeyannee: structured belted double-handle satchel; Deandriaax: gold envelope flap with chain; Noemiaa: pale trapezoid top-handle tote with ring attachments.
- Balenciaga Le City Mini: metallic/silver softly structured satchel with front zip, corner details and tabs.
- Cult Gaia Palloncino: gathered rigid metallic bulb/pouch with chain wrist handle; Idalia: textured bead surface and fringe.
- Oscar de la Renta TRO: small top-handle satchel with a raised flower covering the flap.
- Topologie Cloud Sleeve Mini: a small vertical phone sleeve, not a full-size purse.
- CALPAK bow charm: a loop and large bow, not a handbag. CALPAK passport/tag set is a small wallet/passport accessory set, not an upright tote.
- LSPACE Comporta: wide shallow raffia flap shoulder bag; it must not become a generic tote just because it is a beach accessory.
- MZ Wallace Momo: a small half-round gingham zip pouch.
- Sanrio/Hunet Kuromi treat bag: a tall, flat printed rectangle with purple handles and trim.
- Coach Chelsea: wide soft envelope flap. The pictured Rogue 25 has a light fleece/shearling-looking body and tan leather handles/trim, unlike a generic smooth-leather satchel.
- Kipling Elysiana: two top handles, front zipper and patch. Bells: a soft cream crescent with a round patch and monkey charm.
- Nike Heritage Crossbody 4L: a black front-zip rectangle with white Nike mark, photographed on a model. Four MUJI shoulder products also use on-model photos, with separate body crops and distinct vertical tote/round pouch/hobo/crossbody shapes.
- DKNY TEDDY: despite its name, the pictured model is a cream leather crescent flap with a detachable small pouch; do not give it teddy fleece.
- Miu Miu matelassé Pouch: despite its name, the photo shows a long black shoulder bag with a thin single strap and vertical ruched folds; do not turn it into a hand clutch.
- Kurt Geiger Kensington Drench: the photographed black models have chevron/herringbone quilt and black hardware; a gold clasp is not appropriate for this pictured variant.

## Additional primary references

Manufacturer pages were checked October 27, 2026. These checks establish construction cues; they do not assert that every catalog color/version has identical dimensions.

- [Gucci Jackie collection](https://www.gucci.com/us/en/st/capsule/jackie-1961): the house identifies the piston closure as a defining design code. The inspected existing brown Jackie photograph guides the particular material/shape.
- [Dior chocolate suede Saddle M0455CSRQ_M66M](https://www.dior.com/en_us/fashion/products/M0455CSRQ_M66M): official matching pictured model has suede goatskin, D stirrup strap, magnetic pull and CD handle signatures; dimensions 25.5 × 20 × 6.5 cm, short handle drop 18 cm. These are included in the profile's `reference`.
- [Bottega Mini Jodie](https://www.bottegaveneta.com/en-us/mini-jodie-black-651876VCPP58803.html): official family reference describes rounded Intrecciato leather body, knot and zip; body 26 × 13 × 8.5 cm, handle drop 10 cm. The game photograph is green, so the reference is marked `manufacturer-family`, not exact pictured color proof.
- [Bottega Jodie collection](https://www.bottegaveneta.com/en-us/women-collection-us/women-bags/jodie): confirms the supple rounded hobo shape and knot. Mini and larger versions use different carrying proportions.
- [Prada Cleo official construction note](https://videos.prada.com/csr-video/NL70_Prada%20Donna.pdf): identifies the curved lines and sloping lower construction. The local photograph shows the pale leather version rather than the note's particular patterned version.

Loewe Puzzle and Celine Luggage are not among the 184 current bag-photo identities; no unneeded new products or inventory were introduced for this audit.

## Implementation guidance and limits

Surface finishes include leather, pebble, glazed, suede, saffiano, nylon, canvas, denim, raffia, fleece and metal. Pattern tokens include plain, diamond, chevron, woven, LV, GG, Coach jacquard, Dior oblique/cannage, gingham, camo, printed, ruched and beaded. Brand detail tokens represent real photographed construction cues, not permission to invent new wordmarks or to imply licensed manufacturer assets.

A renderer can use seams/trim, body panel colors and reference photograph sampling rather than placing a full model photograph on a flat board. Prefer generic construction detail if a particular emblem cannot be reproduced legibly. Absolute scale remains a game adaptation outside the individually sourced references. When worn/sitting, soft shoulder bags should sit outside the arm/hip, backpacks should clear the back and seat, and hand bags should follow a wrist or lap placement; wrist grips alone cannot prevent all sitting intersections.
