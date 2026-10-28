# Mallside v9 QA

Validation on October 27, 2026. Release query `9.0.9`. Local test progress was separate from the public site's browser save.

## Automated coverage

`npm test` runs the original economy, catalog, campaign, movement, map, photo and lifecycle suites plus the v9 depth suite. The release gate is 168 passing tests. JavaScript syntax checks and `git diff --check` also pass.

Coverage includes all 548 real listings through inspect, fit/demo, checkout, reload, use, refund/final-sale rules; the paid 24-chapter campaign; all destination gates; save migration; integer-cent tax/refunds; carrying/packages; needs and closing; continuous navigation; and sleep idempotency.

New coverage checks every item’s department/display-page reachability, every interior service route, all 20 mall-floor bounds, distinct architectural families, invalid/correct/duplicate activity transactions, friendship limits and rewards, saved look restoration and unavailable pieces, styling requirements and paid prices, shelf opening/capacity, unique-model collection goals, tax-inclusive savings targets, portrait limits and equipment metadata, camera clearance, malformed imported fields, objective destinations, same-trip unpaid bag recovery/expiry, and fitting preview cleanup.

## Live checks: Codex in-app browser

- Continued an existing v8 free-shop save with its wallet, history, purchases, name, mall unlocks and outfit intact.
- Entered Gucci’s actual 3D interior, changed departments to Footwear, paged displays, opened all 15 real photographed products, inspected and tried a bag. The shopper walked to the fitting station; completion returned to fit feedback with the original outfit restored.
- Added one item, reloaded, returned to the shop and found the unpaid selection and exact $1,515.50 tax-inclusive total intact. Checkout produced an itemized receipt and one purchase.
- Equipped purchased top/bag through explicit tag-removal confirmation, saved a named look, removed a piece, and restored the saved combination. Displayed an opened AirPods purchase in the collection room.
- Captured the actual 3D outfit with rose frame/celebrate pose; saved its 640×800 image to the album; reloaded and verified the original image loaded from device storage.
- Completed all six activities through their UI: corrected flower recipe after an invalid attempt, selected tea recipe fields, arranged sculpture cards, chose garden details, selected carousel horse 4, and watched all three cinema story scenes from seat 6. Each produced a saved memory. The Friday cinema event paid its $22 bonus once.
- Talked about style with Maya. One friendship point and the previously saved look unlocked chapter 1; collecting advanced to the gated second chapter.
- Ate a snack, recovered fullness, rode to Level 2, and started the full homeward routine. Observed the down-escalator animation, then the next-day recap after the unskipped exit/home/sleep sequence. Day 6 began at 10 AM with 100/100 needs and exactly one $1,080 free-shop paycheck.
- Tested desktop 1366×900, tablet 768×1024, phone 390×844 and 320×740. Inspected real activity/meal layouts and checked horizontal overflow. Fullscreen/expanded layout fits the full viewport after the new objective/HUD at 1366×900, 320×740 and landscape 844×390 by DOM bounds.

- Verified the lighter 2D map reaches the photo studio and explicitly labels its illustrated outfit snapshot; its pose selector changes the drawn arms.

## Independent Chrome smoke

- Opened the main menu, continued free shop, displayed the welcome guide and actual `mall-3d` scene, used Stops, walked to the booth and captured/saved an actual 3D portrait.
- Chrome automation had delayed CDP input; native accessibility clicks completed the same controls. This is recorded as a tooling limit, not evidence of game frame-rate performance.

## Issues found and fixed

- Click-target tagging replaced animated person limb metadata: merge user data instead. Regression-tested.
- Fitting feedback lost the selected item on reopening: retain it for size changes.
- Some mall anchors were off-floor: distribute within bounds and test every floor.
- Different mall families had identical amenity positions: authored alternate arcade/garden arrangements.
- Flower removal touch targets overlapped: separate flower heads. Retested removal/retry to successful completion.
- Portraits could be blocked by nearby furniture: pose temporarily in a clear court and choose a collision-free camera view; restore position, limbs, renderer and label visibility afterward.
- Fullscreen used a fixed subtraction that clipped the bottom controls after adding objectives: use remaining flex space, verified against viewport bounds.
- Unpaid selections vanished on refresh, or could be retagged during cross-mall saving: same-trip recovery and epoch-aware persistence.
- Imported malformed life fields could break panels: normalize new arrays, references and memory choices without resetting the existing economy.
- Local preview bind address was corrupted by a prior broad version replacement: restore `127.0.0.1`; version edits now target only package version and explicit asset query strings.

## Limits

No test can guarantee a bug-free game. Physical iPhone/iPad hardware, every browser/GPU, touch gestures on real devices, long-duration performance, and disabled/private storage combinations were not exhaustively tested. 2D remains available if WebGL cannot start. Viewport tests are not physical device certification.

PNG export controls were exercised in both browsers, but the automation did not receive a download event; browser policy blocked access to the download manager. File-download completion therefore remains unverified. Album persistence and original 640×800 image loading were verified. Photos are device-local and separate from JSON backups.

Courts are stylized mall-inspired scenes using three architectural families, not exact current real-world unit maps. Store stock, game prices/policies and avatar product geometry are simulated. Cinema scenes are original illustrated interactive stories, not video.
