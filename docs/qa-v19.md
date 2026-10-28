# Mallside v19 validation

The complete release suite passed **249/249 tests**, no failures/skips, in **49.6 seconds**: `node --test --test-concurrency=2 tests/*.test.mjs`. This run includes the final print mapping, body-region corrections, material batching and preview-resource cleanup.

## New coverage

- Every one of the 752 unique physical models is created and held at three arm angles; grip alignment, finite geometry, bounded material groups and floor clearance are checked.
- All 184 bag references are checked in walking, rest and eating poses against actual leg-bone interiors and a bench back. The assertions inspect the bag body rather than merely its strap.
- Seventy-two garment cut/sleeve/length/fit combinations are checked for finite posed geometry and exact restoration to standing shape.
- Seated knee bends, level shoe soles, food/ice-cream/tea hand ancestry and prop removal are checked.
- All 2,971 physical listings and 752 local photograph checksums have palette/surface evidence. Every encoded surface grid, palette and source region is validated.
- Seventeen garment forms, 184 bag references and more than sixty named bag families are required. Dress/shirt/bra/strap and other category corrections are asserted.
- Print sampling stays upright and within the cloth region, with aspect-preserving repeat-pattern mappings for different panels. Front graphics are not automatically cropped as an all-over pattern.
- Repeated fitting disposes only owned rig resources; the shared catalog models remain usable and the resource set does not grow after the initial template allocation.

The previous engine, stock, taxes, refund, tag, branch ownership, capacity, requests, saves, migration, navigation, fitting lifecycle, home and crowd tests remain in the full suite.

## Live verification

The local free-shop save is separate from the public save. In the in-app Chromium browser, the player wore the existing Hanes tee and Gucci Horsebit bag, walked to a bench and rested, then visited Madewell on Level 2. The former T-shirt-shaped Madewell Smocked Waist Midi Dress now has puff sleeves and a flared skirt. Turn/Done restored the owned outfit, with no money charged for fitting.

Picked up the dress, walked to checkout and paid $60.60 ($55.98 plus $4.62 tax), changing the wallet from $83,600.55 to $83,539.95. Wearing removed its tags once and persisted through reload. The equipped outfit was retained into the closing/home route and Day 12; the $1,080 paycheck produced $84,619.95 and restored needs. The public save was not used for test purchases or resets.

Live close-up checks exposed stretched repeated prints and a white background edge in the original reviewed Madewell panel. The material mapping now preserves print aspect and uses a narrower cloth-only region. Shader warnings/errors were empty in the observed fitting sessions. Final 1280 × 900 desktop fitting showed the corrected dot pattern, puff sleeves, flared skirt and equipped Horsebit bag. Phone 390 × 844 and tablet 820 × 1180 previews retained Turn/Done controls; DOM scroll widths matched 390 and 820 respectively. No horizontal overflow was observed. The console warning/error lists were empty.

A fresh Day 12 bench rest showed the purchased dress's seated drape, bent legs and bag beside the shopper with the closer activity camera. Ambient shoppers can pass in front of the view. The exact same worn look returned after resting and remained present in a later fitting preview. Screenshots are in the task visualization directory: `mallside-v19-dress-fit.png`, `mallside-v19-seated.png`, `mallside-v19-phone.png`, and `mallside-v19-tablet.png`.

Two early browser input calls timed out during scene startup; refreshed UI inspection showed that each requested navigation had completed. Subsequent store, fitting and viewport interactions completed normally. No all-device performance or frame-rate guarantee is inferred from these checks.

## Limits

The live session samples representative products in one browser engine. Automated geometry covers every physical reference and many poses, but is not a manual visual audit of every variant or evidence of perfect cloth physics. Viewport checks do not constitute physical iPhone/iPad testing or all-browser/GPU certification. Some exact dimensions, unseen back details and source-photo accuracy remain limited by the documented reference evidence. Passing tests does not establish that every possible pose is free of clipping.
