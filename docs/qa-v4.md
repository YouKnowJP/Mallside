# Mallside v4 verification

Date: 2026-10-25. Build: 4.0.1. Existing production site identity and audience are preserved.

## Automated checks

`npm test`: 101 passing tests. Includes a complete economy/interaction pass for all 480 listings and a deterministic 2,000-action session. Motion tests compare 30/60 fps, normalized diagonals, clamped background frames, directional gait, and reduced motion. Navigation tests cover obstacle-free routes to all storefront slots and the home exit. A new-career campaign test completes all twenty-four chapters using ordinary actions and sleep income. Night tests prove a completed day token pays only once and survives save/reload.

## Live checks completed

- Main menu, continue career/free shop, reviewed new-career option, player settings and persistence after reload.
- Catalog filtering and source-backed 15-item store inventory; detail-to-store walking, size selection, inspect, fit, checkout, itemized tax, and saved receipt.
- Community brief: new inspected jeans in size 32, $37.88 total, successful $72.88 reimbursement-plus-fee delivery, no second claim, item removed from kept collection.
- Calendar carousel: $3 activity, $15 Wednesday bonus, daily repeated reward disabled.
- MUJI purchase: $2.60 total, concierge package check, collection, original-store refund including $0.20 tax, and persisted refund.
- Exported JSON backup; invalid import rejected; valid backup reviewed/restored; original day, balance, requests, purchases, and preferences recovered.
- Closing-time test save imported through the actual review UI at 7:58 PM. Automatic 8 PM close, exit walk, street, home, sleep, and morning observed. Each presentation stage was captured. Work pay occurred once; reload retained the correct next day and balance.
- Full animation, reduced-motion routine, and skip-animation routine all completed. Background navigation is inert during the journey.
- Phone walking and viewport checks at 375, 390, 768, and 1024 pixels. Catalog and journal have no horizontal page overflow. Touch arrows were moved below the floor plan after an observed storefront overlap; larger player rendering improves visibility.
- Browser console error log clear during main playthrough.
- Chrome: career Hermès purchase controls locked at rank 7, all fifteen bag buttons disabled; switching to free shop opens all stores and preserves the separate career.

- Safari: main menu, separate free-shop entry, and the new canvas mall render verified. The native background session pauses requestAnimationFrame and its clock; full motion was verified in Chrome and the in-app browser. Safari native automation was interrupted by a window change, so no full Safari motion claim is made.

## Scope

No physical iPhone/iPad hardware test. External brand availability, live stock, live prices, and retailer policies are not simulated as current facts; in-game sources and disclosures distinguish real identities from game rules.
