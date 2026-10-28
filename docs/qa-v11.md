# Mallside v11 QA

Checked October 27, 2026. Release query `11.0.3`. Local browser progress is separate from the public Site origin.

## Automated release gate

**189/189 tests passed**, zero failures/skips, in 22.18 seconds. All original catalog, economy, mission, save, movement, photo, activity and navigation suites remain. Legacy assertions about the old fixed 548-listing count were expanded; the original 32 story shop catalogs still meet their previous minimums.

New coverage resolves every one of the 1,598 source directory entries to a reachable playable shop or service entrance; runs a full browse/fit-or-demo/checkout/refund-or-final-sale/save lifecycle at every added retail branch; validates each actual product/photo identity; rejects paying or returning at the wrong branch; exercises booking/refund/use at every service branch; checks atomic failures at closing or locked malls; rejects malformed imported bookings; verifies once-only food recovery after reload; and verifies sunglasses equipment and real numeric-size suffix matching.

A further 39-test targeted run verifies seating, collision-free display/service routes, photography clearance and every new branch transaction after adding cafe/service benches. The final full release run includes those changes. JavaScript syntax and diff-whitespace checks pass.

## Live checks

- Continued the existing local free-shop save with its Day 5 wallet, prior orders and purchased items intact.
- Used Fashion Island’s complete directory from the Rooftop floor to walk through an escalator route into Anthropologie & Co.’s actual 3D shop. Its real Maeve Colette pants photograph, source link, $120 reference price and source size options were visible.
- Walked to the fitting station and ran a try-on. Live testing exposed petite size labels being matched against an arbitrary middle size; numeric 32 now matches source label 32 P. A regression test verifies correct feedback.
- Added size 32 P to the original branch bag, paid $129.90 including $9.90 game tax, received receipt D5-11, and returned it through that branch’s return desk. The full $129.90 was refunded and the wallet returned to $302,529.78.
- Entered Starbucks Coffee’s 3D cafe, browsed six actual photographed menu items, ordered a Caffe Latte for $5.68 including game tax and received receipt D5-12. The receipt offered “Drink here”; the seating/drinking animation completed and stamina recovered. Food use is once-only in engine/save tests.
- Entered Drybar’s service lounge, reserved a $25 game styling session, refunded it, reserved another and played its seated session. The receipt list showed one Refunded and one Enjoyed record. The wallet correctly retained only the used $25 charge.
- Phone 390x844 service-booking layout: legible single-column offers, reachable close button, document width exactly 390 pixels with no horizontal overflow. Retail checks at 390x844 and 320x740 also have no horizontal overflow; all four Marine Layer product photographs loaded successfully. The phone shop toolbar stays compact and keeps Browse/Exit controls visible.

- Independent Chrome check continued its prior outlet save, walked into ALDO Outlet, and displayed all four genuine ALDO photographed products with prices and fitting/bag controls. No JavaScript errors were observed.

## Issues found and fixed

A canonical story shop’s brand match initially suppressed a directory branch even when that story shop was not physically present in the mall. Every source entry is now explicitly checked for a valid store identity.

Cache-keyed ES module copies initially relied on a mutated photo object. Branch photograph resolution now derives from the stable verified model ID, including after different module import paths. All branch photographs are checked on disk.

Real source size suffixes now match saved numeric sizes. Unused display bays no longer leave invisible display collisions; seating collision footprints are shared with the render geometry. Cafe receipts offer immediate consumption. Interior navigation hides the exterior map shortcuts/minimap, provides a direct Browse/Services button, and collapses extra department controls during an animation.

## Scope and verification limits

All storefronts are enterable and playable, but their exact real-world current assortments are not all verified. 333 added branches have source-matched brand capsules; 115 use multibrand game selections; 967 use explicitly labeled guest capsules. Each card retains its actual product maker. Guest capsules and original service sessions are game arrangements. See [research and provenance](store-research-v11.md).

Prices, stock, tax, returns, avatar geometry and fit feedback are simulated. Prepared-food final-sale rules and service sessions are game policies rather than real retailer terms. Physical iPhone/iPad hardware, every browser/GPU and long-duration performance are not certified by these checks. No tests can guarantee zero bugs.
