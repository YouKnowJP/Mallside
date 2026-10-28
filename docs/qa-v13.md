# Mallside v13 validation

Release command: `node --test --test-concurrency=2 tests/*.test.mjs`

Result: **208 passed, 0 failed**, including the seven new architecture/navigation checks. The full run completed in 145.9 seconds. `git diff --check` passed. No catalog or economy reset is part of this update.

## Coverage

- All 1,598 source directory identities retain reachable published-floor representations.
- All 23 floor views retain collision-free routes to shop entrances, anchors, amenities, locals, escalators and exits. South Coast Plaza's west-building journey still uses the Level 2 bridge and both escalator legs.
- Every added public bench and directory has a reachable approach; fixtures remain real colliders. Testing caught a directory approach trapped by nearby seating, corrected by requiring a clear approach from the court.
- Façades face their physical entrance side with correct axis dimensions. Rebuilt geometry is deterministic across reloads.
- Spatial lookup matches uncached checks across 15,000 sampled positions, signed padding and cell boundaries. Cache replacement tests cover added fixtures and replaced obstacle/surface arrays.
- Camera cutaways lower only foreground buildings that obstruct the shopper. Rotated whole-center framing contains all floor corners at phone, tablet, desktop and wide aspect ratios.
- Existing campaign, purchases, tax/refunds, catalog photographs, receipts, equipment, returns, stock, save migration, 40,000 movement steps, interiors, fitting cameras, escalator animation and home/sleep lifecycle checks pass.
- The finite-geometry scenery test now exercises the shared floor atlas and new public furniture as well as storefronts and activities. The canvas factory is injected for this Node check; actual browser rendering is checked separately.

## Live browser checks

In-app Chromium/WebGL, normal desktop viewport, 390×844 phone and 820×1180 tablet overrides:

- Orange and Desert Hills outdoor courts: new paving, planters, shop façades, canopy supports, shadows and landscaping visible.
- Desert Hills bench: selected a nearby garden bench from Stops, walked there, sat in the actual seat during the rest animation, and recovered stamina to 100 while the clock advanced 30 game minutes.
- South Coast indoor court: skylight structures, planted furniture and detailed façades loaded. A foreground building originally hid the shopper; camera cutaways now preserve a clear view.
- Complete center directory: searched Dior, routed to its physical entrance, entered the real-product interior, then walked out through its doorway using keyboard movement.
- Phone store interior and mall: touch controls remained available, shop actions were readable, and document width equaled viewport width (390px).
- Tablet: identified and fixed wallet/HUD overlap, then visually confirmed stacked HUD values. The rotated whole-center overview fits inside the stage after a framing correction. Document width equaled viewport width (820px).
- 2D fallback: selected lighter graphics through settings, reopened Explore, and checked the shared paving atlas, benches, directory fixtures, shopfronts and player rendering. Restored 3D afterward.
- Browser warning/error logs were empty in checked 3D and 2D scenes. Temporary viewport overrides were reset.
- Earlier in this local test day sequence, the mall closed, the shopper followed the home route, and the next morning retained ownership and restored needs.

Physical iPhone/iPad hardware and every browser engine were not available for this pass. The malls remain condensed original game adaptations, with source floor/broad-zone references rather than surveyed real-world unit polygons.
