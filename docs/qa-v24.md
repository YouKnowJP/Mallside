# v24 QA — daily outings and branch-aware shopping

## Automated results

The complete suite passed **291/291 tests**, including the ordinary-actions playthrough of all 24 story chapters. New cases cover real catalog/photograph offers at all ten malls, deterministic daily rotation, a zero-cash outing, actual new receipts and line tax, correct purchased size, refunds/delivery, allowances, branch labels, day expiry, cancellation, one reward per day, backup reloads and malformed saved fields.

Branch regressions cover UNIQLO tops and the Round Mini Shoulder Bag, Nordstrom versus Nordstrom Rack, duplicate named models with multiple source IDs, restricted errands and exact purchased-label inspection, current-mall guidance, and destination-local evidence before model deduplication. Raw receipt/stock/visit IDs and earned claims are preserved.

The campaign fixture now deliberately chooses genuinely different models rather than two branch listings of one jewelry model. Its discovery search computes the seen-model set once per action. Outing sorting computes hashes once per candidate, and model identities are cached for immutable catalog objects, avoiding repeated normalization/sorting work during planning.

Source module/reference, asset inventory and notice checks pass. The production artifact is a single minified browser bundle with content-hashed CSS and the existing photographed products; the public-output check excludes source maps and development files. Generated-directory cleanup retries transient filesystem races encountered during the local build.

## Live checks

On a separate local career, the player accepted the Clinique Facial Soap For Oily Skin gift outing at The Outlets at Orange, followed the route into Nordstrom Rack, inspected the real product, carried an unpaid selection to checkout and paid **$11.43** including **$0.87** game tax. The outing advanced to 3/3 only after the paid receipt. Returning the unused product refunded the original total and rolled the outing back to 1/3. No production save was reset.

The compiled production bundle was then tested with the same local save. Its nonwearable selection correctly offered product inspection rather than a fitting-room action. Re-purchasing the soap restored the outing to 3/3, and collecting the reward paid exactly $12 and 45 XP; the claim button was replaced with a collected state. Taking that receipt back to the store walked the shopper to its physical returns desk before opening the matching receipt dialog.

The full walking-home and sleep sequence reached Day 2 with $180 work-shift income, restored needs, a completed-and-collected outing recap, a saved memory and newly rotated photographed offers. On the 390 × 844 phone viewport, accepting an outing, reloading and reopening the main-menu planner retained the same target, allowance and 0/4 checklist. Cancelling through its confirmation on the 820 × 1180 tablet viewport preserved the $430.57 wallet and story progress. Desktop, tablet and phone boards had no horizontal document overflow, all outing photographs loaded, and phone outing buttons measured 44 pixels high. No browser warnings or errors were captured in the compiled-build session.

Screenshot evidence is retained in the local visualization workspace as `mallside-v24-outings-desktop.png`, `mallside-v24-outings-tablet.png` and `mallside-v24-outings-phone.png`. The live browser engine is Chromium; viewport checks are not physical iPhone/iPad or Safari/Firefox certification. Product fitting remains a game sizing model. Catalog/map fidelity and other unfinished areas remain explicit in [the roadmap](../ROADMAP.md).
