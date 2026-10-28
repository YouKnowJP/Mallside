# Mallside v18 validation

## Automated

The release suite passed 238/238 tests, with no failures or skips: `node --test --test-concurrency=2 tests/*.test.mjs`. The 24 model/fitting/lifecycle tests passed again after the final shoulder-strap drop adjustment. JavaScript syntax checks across the top-level distribution modules and `git diff --check` pass. The suite was rerun after live testing revealed and corrected a styling-counter obstruction.

Eleven reference-model tests cover:

- Photo palettes for all 2,971 physical clothing/bag listings, all 752 file checksums, and five visually reviewed pictured colors.
- Model-specific dimensions, including the pictured CFQ88 glazed-leather Tabby rather than the older pebble-leather version; top/base width distinctions for flared totes.
- Deterministic grain, quilt/monogram textures, proportionally scaled repeat patterns and glazed clearcoat.
- Arm-parented sleeves, leg-parented trousers, outward-facing torso normals and short-sleeve coverage of the base arm.
- Wrist grip alignment, upright carrying during multiple arm poses, and floor clearance of long garments and bags.
- Shoulder/crossbody body placement, connected solid straps, individually instanced chain links and controlled preview-size ease without catalog mutation.
- Coach/Apple styling counters leave the actual preview position clear rather than intersecting the avatar.

The previous 227 regression tests continue to cover catalog/transaction paths, taxes, exact tagged refunds, stock, ownership, save restoration, wrong branches, capacity, fitting exit, room reservations, scene completion, route collision, home/escalators, progression, needs, crowds and reduced motion. Full-catalog engine tests exercise every listing; live browser QA samples representative products rather than manually fitting every model.

## Live browser QA

Used the in-app Chromium browser against the local static server. The public save was not used for purchases, resets or progression.

- Resumed the existing local free-shop Day 10 save, walked/skipped home, and verified Day 11 starts fed/rested with the $1,080 game paycheck, bringing $82,520.55 to $83,600.55.
- Walked into Uniqlo. Tried the gray-green SUPIMA tee; checked its torso/collar and sleeves in the physical fitting preview, turned it, and finished. Fitting did not charge game money.
- Picked up size M, reloaded, continued the same local save, and re-entered Uniqlo. The exact unpaid selection returned in hand at the same cash balance. Try held and Done restored the owned look and unpaid selection. Put back restored the display and removed the held item without charging.
- Tried the burgundy Round Mini, inspected its crescent body and diagonal crossbody strap. Phone 390 × 844 and tablet 820 × 1180 layouts showed the preview with accessible Turn/Done controls. DOM scroll width matched viewport width (390 and 820); no horizontal overflow was observed.
- Carried the Round Mini to checkout. Paid exactly $21.54 ($19.90 + $1.64 tax), reducing the wallet to $83,579.01. Returned the unworn tagged bag at the original branch and received $21.54, restoring $83,600.55. No ownership or tag mutation happened merely from fitting.
- Walked to Coach and previewed the pictured CFQ88 Tabby. Initial live inspection exposed a pre-existing consultation counter crossing the shopper's torso. Moved that counter behind the fitting position, added a geometry regression test, reloaded and repeated the preview.
- The final Tabby fitting also uses its published 24.13 cm short-strap drop, with the bag body outside the arm and the styling counter behind the player. Desktop checks use 1280 × 900. Console warnings/errors were empty in the tested session.

Screenshots are retained in the task's visualization directory: `mallside-v18-shirt-fit.png`, `mallside-v18-crossbody-phone.png`, `mallside-v18-crossbody-tablet.png`, and `mallside-v18-tabby-fit.png`.

## Limits

Original stylized mesh interpretations and procedural textures improve product resemblance. Only selected researched families use manufacturer measurement references; most products still use category/model-name shapes. Automatic photograph color estimation can be imperfect, and lighting changes the rendered color. Related construction references, estimated flared top widths and variant differences are documented in `retail-design-v18.md`. These are not licensed manufacturer models or exact replicas.

Live checks use one browser engine and emulated viewport sizes, not physical iPhone/iPad hardware or every browser/GPU. Passing tests do not establish absence of all bugs or clipping in every possible pose. The 3D improvements apply to the 3D renderer; the labeled illustrated wardrobe/2D fallback remains available.
