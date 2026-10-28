# v26 QA — neighborhood stories and the collection room

## Release scope

Six new optional multi-day local chapters and six friendship chapters introduce Noor and Jules. This brings the board to five regulars, 15 local chapters and 15 friendship chapters alongside the existing 24 main chapters. New room finishes, owned-product displays, tomorrow’s outfit preparation and the concierge guestbook share the existing version-6 save. Existing catalog identities, prices and photographs are unchanged; the inventory diff changes only its release label.

## Automated checks

The two-worker regression run passed **323/323 tests**, with no failures, skips or cancellations (157.0 seconds locally). The 14-case v26 suite was rerun after the final room-depth correction and passed **14/14** (21.0 seconds). The publishing workflow reruns the complete suite on the final source commit before deployment.

Coverage includes all 24 main chapters, all ten choices across the five three-chapter local stories, existing friendships, purchased-size and receipt validation, rewards paid once, progress across mornings and reloads, insufficient-time atomicity, real catalog/photo references, full-center routes, customer shopping cycles, garment fit, seated/walking poses and returns. New cases check preparation costs and next-day application, unavailable-plan atomicity, guestbook validation and daily limits across malls, malformed optional save fields, all five reachable conversation stops at all ten destinations, displacement-based gait, window-facing pauses, resource ownership, material responses and room-camera containment at phone/tablet/desktop aspect ratios.

Outfit and shelf regressions enforce one visible placement per owned purchase: displaying unequips it; wearing or applying a saved/prepared look removes it from the shelf. Opening a different purchase for display preserves the remaining equipped outfit. No operation creates ownership or charges for an already purchased piece.

Source checks passed for **80 browser modules and 314 local references**, including syntax, links, catalog/photo hashes and matching shipped notices. The generated artifact contains **1,976 files**, one minified bundle and all **1,934 photo references**, with no editable modules, source maps, tests or development tree. An injected metadata probe was rejected by the strict artifact checker. Finder recreated ignored metadata in the canonical build folder, so local compiled QA uses an isolated metadata-filtered copy, checked with the same checker; CI retains the strict default output check.

## Live compiled-browser checks

Tests use an isolated localhost free-shop save and the generated game under the production `/Mallside/` path. The public player save was not reset or used for test purchases.

At Orange, the player physically reached Noor and started the quiet path, talked about the wardrobe and inspected three distinct real models. Nike WMNS Air Max Dolce, Calvin Klein Elia Blouse and Coach Swing Zip Bag were carried to the counter. The blouse was tried and turned in the fitting room before returning to the shop floor. The receipt charged **$587.43** ($542.66 subtotal plus $44.77 simulated tax) once, reducing $75,000 to **$74,412.57**. Reloading preserved purchases, carried items, ownership and wallet. Opening/wearing all three pieces required the explicit return-tag confirmation and did not charge again.

Preparing the three-piece Day 2 outfit advanced Day 1 from 3:14 to 3:19 PM without changing the wallet. The same-day control disabled afterward. Placing the Swing Zip on the room shelf removed it from the outfit; the top and shoes remained equipped. The plan, shelf contents and Warm oak finish survived a cold reload. Physical bench rest completed Noor’s remaining action evidence and exposed the chapter hand-in objective. The closing-day flow animated the exit walk and journey home before presenting Day 2 breakfast, restored 100/100 needs and exactly $1,080 work-shift income ($75,492.57 wallet). The unfinished chapter remained ready to hand in the next morning.

At **390 × 844**, document width remained 390 pixels and all nine room finish/camera/pose controls measured at least 44 pixels high. At **820 × 1180**, document width matched the viewport and no loaded product image was broken. Whole-room/body framing, standing, sitting and walking controls were exercised. The phone review exposed floor depth interference; hiding the old studio floor in the room and tightening the near plane removed the white floor artifacts in the rebuilt candidate. The camera regression checks all eight room corners and the far plane at four aspect ratios. Fitting-room exit feedback was corrected and a regression prevents navigation from replacing its reserved return path.

## Limits and publication

Live UI checks use Chromium with viewport emulation, not certification on physical iPhones/iPads or Safari/Firefox. Late in testing the browser-control service became unavailable; next-day plan application, guestbook submission and the 2D room fallback therefore retain automated coverage but were not completed as live UI flows in this release. Earlier live compiled checks and the overnight transition were completed; no claim of exhaustive browser testing is made. The character is an original animated anatomical rig; clothing, bags and room interactions remain controlled models rather than full cloth simulation or a freely walkable home. No new merchandise availability or price claims are made. See the [roadmap](../ROADMAP.md) for remaining work and [v26 gameplay](GAMEPLAY-v26.md) for costs and rules.

Publication uses the existing public single-repository main-branch Pages workflow. Its complete checks must pass, and the public `release.json` must match the final source commit before the update is reported live.
