# Mallside v18: product references and character fit

The release improves physical merchandise without changing the 8,571 listings, prices, stock policies, or transaction rules. The physical subset has 2,971 clothing/bag listings sharing 752 photographs. Product detail photographs and links remain the primary reference.

## Color and surface evidence

`scripts/export-merchandise-references.mjs` exports the physical catalog and its existing local photographs. `scripts/analyze-merchandise-colors.py` reads those files, samples a central foreground region, filters likely backgrounds/model skin, and records a dominant quantized color plus photograph checksum. It never edits photographs. `photo-palettes.js` is a small runtime lookup; `merchandise-colors-v18.json` contains provenance and confidence. This is automated color estimation, not manual verification of every variant.

Five photographs were visually reviewed: gray-green SUPIMA tee, burgundy Round Mini, dark-cherry Coach CFQ88 Tabby, cream/tan Neverfull Origine, and navy Le Pliage L tote. Branch copies share their actual photograph's palette. Fallback catalog colors remain for unsupported items outside the physical subset.

To reproduce (requires Python with Pillow):

```sh
node scripts/export-merchandise-references.mjs > /private/tmp/mallside-merchandise-references.json
python3 scripts/analyze-merchandise-colors.py /private/tmp/mallside-merchandise-references.json
```

`merchandise-materials.js` builds deterministic, small procedural albedo/bump textures on curved mesh surfaces. Cotton, denim, knit, fleece, nylon, canvas, pebbled leather, smooth leather and glazed leather have different grain/roughness. Selected products have diamond/chevron quilting, woven construction or original approximations of monogram motifs. Glazed leather has restrained clearcoat. These are original game textures, not scanned or licensed brand assets. Gold/silver hardware and recognizable clasp, patch, stripe or flap details are restricted to matching named families.

## Measurements and construction references

Official references checked October 27, 2026. Measurements are centimeters and represent published dimensions, with the explicit top/base distinction below. Hardware, seams, drape and manufacturing tolerances are adapted for the stylized game scale.

| Model | Reference and application |
| --- | --- |
| [UNIQLO Round Mini](https://www.uniqlo.com/us/en/products/E481610-000/00) | Approximately 28 × 17 × 10, converted/rounded from the official US inch measurements. Nylon crescent body, curved zip and adjustable crossbody strap. |
| [Coach Tabby 26 CFQ88](https://www.coach.com/products/tabby-shoulder-bag-26/CFQ88.html) | Pictured glazed leather/brass/dark cherry variant: 25.4 × 13.97 × 6.985, converted from 10 × 5.5 × 2.75 inches. C clasp, flap, glazed finish and 24.13 cm short-strap drop. The older CH857 pebble-leather dimensions are deliberately not applied. |
| [LV Speedy Bandoulière 25 M46977](https://us.louisvuitton.com/eng-us/products/speedy-bandouliere-25-monogram-nvprod5320019v/M46977) | 25 × 19 × 15. Barrel/duffel treatment, double handles, leather strips and lock. The detachable shoulder strap is omitted in the hand-carry presentation. |
| [LV Neverfull MM M41177](https://br.louisvuitton.com/por-br/produtos/neverfull-mm-lezard-007653/M41177) | 47 top width × 28 × 14. Trapezoid base adapted at 31, slim shoulder handles and side cords. The pictured Origine color is pale canvas with tan trim; this construction reference is a related MM version, not proof of the Origine SKU's exact dimensions. |
| [Longchamp Le Pliage L L1899089001](https://www.longchamp.com/gb/en/products/tote-bag-l-L1899089001.html) | Published base 31 × height 30 × depth 19, handle drop 25. Flared top adapted at 47; nylon body, leather flap/handles and snap. Top width is an art estimate rather than a published manufacturer dimension. |
| [CHANEL Classic 11.12](https://www.chanel.cn/fi/fashion/p/A01112B25720UB663/classic-11-12-handbag-grained-shiny-calfskin-gold-tone-metal/) | 25.5 × 15.5 × 6.5. Regional official construction reference for quilted flap proportions and interlocking clasp. Material/color of the game's existing photograph may represent another variant. |
| [UNIQLO SUPIMA tee](https://www.uniqlo.com/us/en/products/E455365-000/00) | Cotton tee construction and the existing gray-green photograph guide its collar, short sleeves and worn color. Character fit is a game illustration, not real sizing advice. |

Other models retain family-based silhouettes, now improved with photo-derived colors, material grain, smaller wallet scale, thinner hanging garments and appropriate long sleeves. Do not describe the full catalog as exact dimensioned replicas.

## Fitting and carrying

`merchandise-fit.js` creates a curved shirt shell with open neck/hem, rounded shoulder caps and arm-parented sleeves. Long sleeves cover the base arm and add a visible hand. Trouser legs attach to the leg pivots. Numeric and letter sizes apply a limited ease adjustment using the preview size or owned purchase size. The torso and base trousers are hidden only where the replacement meshes cover them.

Hand-held merchandise attaches to the actual wrist, with the highest handle/hanger point at the grip. Counter-rotation keeps the item upright during walking and action poses. A loaded arm bends enough to keep a long hanging item above the floor. Shoulder and crossbody bags use body-only templates and separately fitted straps; backpacks sit behind the torso with two shoulder loops. Large shoulder totes use their individual body/handle proportions; the Tabby uses its published short-strap drop. A clear gap outside the arm prevents the bag body from intersecting sleeves. Styling counters sit behind the fitting position so they do not hide the torso or bag. Handbags/wallets use a hand-carry presentation. Purchased paper bags also attach to the hand.

Fitting remains temporary: selecting a size passes that size to the preview without modifying catalog records, ownership or tags. Done restores the owned outfit and unpaid selections after the physical exit. The first three selected items remain visible, with the existing eight-item carrying limit. No product photos are pasted onto shelf display boards for the physical clothing/bag subset.

Static merchandise reuses cached per-SKU templates; repeated rack items remain instanced. Texture resources are registered for scene disposal. The renderer and 2D fallback, prices, receipts and old saves remain compatible.
