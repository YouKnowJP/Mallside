# Mallside v7.0.5 validation

October 26, 2026. This release adds mall scenery, rotating shop windows, locals, and a daily exploration circuit. Test gameplay used localhost saves only.

## Automated results

`npm test`: **130 passed; 0 failed**. Existing 548-product checkout/return/use coverage, full 24-chapter career, deterministic economy fuzzing, save migration, needs, equipment and night checks still pass.

New checks cover all twenty floor views: building/anchor/amenity bounding boxes do not overlap, remain within the map, and have entrances reachable through the concourse graph. All twelve activity/service sites and three local characters are present on each floor. Rotating windows select three distinct real products from the correct store and change on the next day. New discovery/conversation rewards resist duplicate claims, reject invalid/late actions atomically, and survive reload. The daily circuit requires two distinct window labels, a conversation and an activity at the current mall. Painter checks cover finite geometry, compact amenity scaling and animated frames. Malformed exploration entries do not crash the progress panel.

## Live checks

- In-app browser: all ten destinations rendered their scenery, floor controls and minimap without captured console errors.
- South Coast Plaza: Hermès window → read two labels → window-shopping animation → labeled product references → Maya conversation and chat animation → carousel route and activity → collect the 60 XP/$35 reward once. Repeat chat/reward controls correctly disabled.
- Cross-floor window routing: Level 1 → elevator → Louis Vuitton on Level 2 → window preview → enter full shop. Three preview products and all fifteen shop products appeared.
- Phone at 390×844: window cards fit within the modal with readable text and working actions, with no horizontal overflow. All three reference links were present. The shop's local photos loaded.
- Map sizes 320×700, 390×844, 768×1024, 1366×900 and 844×390: document width matches viewport width; canvas/floor controls and overview remain in bounds. Short normal landscape play can scroll vertically.
- Phone Stops panel: minimap and nearby prompt hide while its independently scrolling drawer is open. The daily challenge was compacted into expandable details after visual review, leaving room for local characters and activity choices.
- Chrome: map art rendered without captured errors. Fullscreen button enabled expanded play; Escape restored normal play with the map still present. Native fullscreen was rejected by the test environment and the fallback message appeared. Night journey reached the home/sleep sequence from the redesigned map.

No physical iPhone/iPad, Safari or Firefox verification was performed this release. No claim of zero bugs, native fullscreen support in every environment, current live retailer inventory, or exact mall floor-plan reproduction. Maps remain stylized major-wing adaptations with curated game pins; source/accuracy disclosures remain in every Guide.
