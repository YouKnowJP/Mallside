# Mallside v14 validation

The complete release suite passed **212/212 tests** in 120.4 seconds with `node --test --test-concurrency=2 tests/*.test.mjs`. The final atrium/sign visual adjustments also passed the 8 scenery/life checks; the two modified renderer/app modules passed syntax checks. `git diff --check` passed.

## Automated coverage

- All 23 floors, 1,598 source directory identities, storefront entrances, activities, escalator transfers and exits retain collision-free routes. South Coast's west building still uses the Level 2 bridge and both escalator legs.
- Every physical obstacle remains separate. Added retail links join existing store identities; connected backs add solid building area without creating fake tenants or merchandise.
- Standard shopping galleries have close opposing rows and real storefronts near their main arrival court. Source floor and west/main zone constraints remain intact. The smaller Fashion Island upper gallery and South Coast upper/west galleries have enough frontage for their source occupants.
- Every added counter maps to an existing playable activity on the same floor. All bench and directory approaches are reachable.
- Thirty-six planned desktop shoppers start at distinct walkable places with clear local window-shopping routes. Their populations remain close to the arrival area; narrow-screen builds use 24.
- Existing progression, catalog provenance and raster files, tax/refund amounts, saves, receipts, ownership, equipment, fitting, portrait framing, reduced-motion lifecycle, 40,000 movement steps and home/sleep checks pass.
- The denser layout exposed one blocked portrait-camera angle. Additional angular camera candidates and adaptive portrait framing resolved it without weakening the clearance test.

## Live browser checks

In-app Chromium/WebGL, normal desktop, 390×844 phone and 820×1180 tablet overrides:

- Orange: continuous shop rows, joined retail masses, real store-window photos, deeper façades, entrance gate and court counters visible. Shops near the central court replace the previous empty diagonal approaches.
- Shoppers: watched walking and browsing, clicked a person, walked into range, and opened Riley's conversation with a suggested next stop.
- Flower cart: selected the nearby counter from Stops, walked over, opened the workshop, chose Daisy + Daisy + Eucalyptus, and finished. Wallet changed from $81,450.55 to $81,440.55; the clock advanced 25 minutes, a 15 XP memory was recorded and the flower animation returned to the mall.
- Closing and morning: completed the new mall exit route and home/sleep sequence. Day 9 retained existing ownership, restored both needs and paid $1,080 once.
- Phone: no horizontal overflow (390px document and viewport), 24 shoppers reported, readable HUD and controls. Walked through American Eagle's doorway and back out. That store's pending assortment remains explicitly empty, as before this map pass.
- Stocked Nike branch: walked the new route, entered the 25-item interior, and viewed real photographed models and visible prices on tablet. Document and viewport width both 820px; HUD values remained separated.
- South Coast: connected indoor glazing and a single primary atrium dome, dense shop wings, window displays, walking crowds and clear player visibility. Removed overlapping central roof gateways after visual review.
- Browser warning/error logs were empty in inspected scenes. Temporary viewport overrides were reset.

Physical iPhone/iPad hardware and every browser engine were not available. This release changes mall geometry and scenery, not the v12 catalog scope. Known pending assortments are still labeled rather than filled with guest products. The malls remain original condensed game interpretations of source floors/broad zones.
