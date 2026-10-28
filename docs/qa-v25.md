# v25 QA — local stories and mall atmosphere

## Automated release checks

The final two-worker run passed **309/309 tests** with no skipped or cancelled cases (47.8 seconds locally). This includes the ordinary-action playthrough of all 24 main chapters and all existing catalog, photographed-product, whole-center routing, store-customer, rig, garment, floor-contact, seating, strap and save regressions.

The new cases play all six local-story choices through three mornings and cover new/distinct action evidence, mall-specific progress, overnight partial completion, fixed choices, reward idempotence, receipt-backed gift reimbursement, correct purchased size, unused/tagged/unchecked requirements, old purchases, wrap/unwrapping/return fees, insufficient-time atomicity, water cooldown, malformed backups, and starting at all ten destinations. They also cover diagonal headings, shortest-angle turning, 30/60 FPS equivalence, bounded daylight, adult appearance variation, reduced-motion head restoration, standing water, two-hand grip release/restoration, transient prop cleanup, walkable conversation spacing at every destination and NPC yielding.

The first unconstrained parallel test run was interrupted during local resource pressure; it was not counted as a pass. Final verification used two workers with the live walking scene stopped. The release source check passed for **77 browser modules and 289 local references**. The production artifact check passed for **1,977 files**, one minified bundle, retained catalog photographs/notices and no source maps or development tree.

## Live browser checks

The existing local free-shop save at Day 12 / South Coast Plaza loaded with its previous money, purchases and appearance intact. The home flow advanced it to Day 13 with the expected $1,080 game income and restored needs. No production save was reset.

Sam's practical path was accepted through Journal → Meet Sam. Following the objective walked to a physical directory; saving a route note advanced its step. Guest services led to the water station, which restored stamina without charging and rejected immediate reuse with a 30-minute cooldown. Walking into UNIQLO completed the shop step. Returning to Sam and sharing the chapter paid exactly $10 / 35 XP, switched back to main-story guidance and showed the next chapter waiting until Day 14.

A photographed UNIQLO U AIRism Cotton Oversized T-Shirt was inspected, physically carried, tried in the fitting room, rotated, returned to the shop floor and purchased at the counter for **$26.95**, including **$2.05** game tax. Wrapping in rose paper charged $2 / six minutes and replaced its wrap button with a wrapped receipt. Loading the compiled `/Mallside/` build preserved the receipt, paper, money and claimed chapter. Unwrapping cost one minute without changing the wallet; rewrapping in midnight paper charged another $2. Close-up review led to corrections for standing water, free hands during wrapping, transient prop disposal and conversation body separation; each has regression coverage.

The compiled Journal was checked at **390 × 844** and **820 × 1180**. Document width matched viewport width, and phone story buttons measured 44 pixels high. Local stories use one collapsible shelf, three columns on desktop and one on smaller viewports. Existing real photographs loaded. The phone wrapping desk also fit without horizontal overflow; its paper choices measured 79 pixels high and its action controls measured at least 44 pixels. Local screenshot evidence is retained in the visualization workspace as `mallside-v25-stories-phone.png`, `mallside-v25-stories-tablet.png`, `mallside-v25-wrapping-phone.png` and `mallside-v25-wrapping.png`.

The final compiled candidate is `app-Z7J5IDO3.js`. Maya's style story was then played through the UI: a new conversation plus two different labels completed chapter one, including the new explicit reread control on a familiar item. Claiming paid $12 / 35 XP; sleeping unlocked chapter two on Day 14. The previously wrapped Day 13 purchase did not qualify. A newly inspected size-M AIRism top was carried to the physical checkout for $26.95 and wrapped for $2. The corrected animation set the shopping bag aside, held the parcel with both hands and restored the handheld afterward while ambient shoppers continued moving. Maya offered only the new receipt and paid **$48.95**: its $26.95 total, $2 wrapping reimbursement and $20 chapter reward, plus 75 XP. The next chapter waits until Day 15. The 3D scene reported environment revision 25, morning daylight and a continuous heading of -0.121 radians; no character dimensions or merchandise assets were rescaled.

Publication uses the existing private-source main-branch workflow, which reruns the complete suite, builds the artifact and verifies generated-only public output before Pages updates. The deployed release is checked against its exact source commit before reporting it live.

## Limits

Live tests use Chromium and viewport emulation, not physical Safari/iPhone/iPad/Firefox certification. Geometry remains an original condensed mall adaptation, and character/fabric motion is controlled animation rather than a complete physics simulation. Catalog identities, prices and images were not expanded in this release. Pending tenant research, richer homes and longer stories remain in [the roadmap](../ROADMAP.md).
