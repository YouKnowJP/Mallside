# Mallside v5 verification

Version: 5.0.6. Checked 25 October 2026. The source remains a buildless static ES-module app.

## Automated validation

`npm test`: **115 passing tests**, no failures or skips. Syntax checks pass for app, engine, world, sprite and activity modules.

The retained suite exercises all **483 real-product listings** through inspection, fit/demo, checkout, accurate refund or final-sale rejection, use, and reload; a deterministic **2,000-action** shopping session checks atomic failures, integer-cent balances, stock and needs; a new career completes all **24 chapters** with earned income and ordinary actions.

New coverage checks all ten exact XP gates, atomic travel failures, every store's earliest mall, connected east/west loops and entry positions, all nine independent equipment slots, swaps and unequipping, rejected equipment, equipment persistence, v4 migration, destination rewards, and ice cream. Routes to every storefront, kiosk, and both exits are checked from both court entrances and the center in **all 21 courts**. Sprite tests cover all equipment, four facings, standing and seated eating/drinking/rest poses with finite drawing geometry. A separate migration audit proves every previously unlocked retailer remains accessible at all seven legacy career tiers.

## Live checks

In-app browser and Chrome, using normal UI controls. Test progress is isolated to localhost. A rich nine-slot free-shop fixture was imported through the game's review-and-restore UI, preserving the separate career save.

- Fresh career: set leisurely clock; walk into Ross; inspect Hanes Beefy-T; try size M with animated fitting-room preview; add jeans in size 32 and a JanSport backpack; pay **$75.74** including **$5.77** game tax.
- Dressing room: equip top, bottoms and bag individually; verify tags removed, no return action for used items, and the backpack visible from behind. A nine-slot fixture visibly shows bag, hat, belt, scarf, jewelry, watch, clothing and shoes, including during activities and walking home.
- Claim first chapter: **125 → 175 XP**, unlock Citadel, receive the chapter reward and one-time **$200** level bonus; travel to the unlocked destination. Remaining malls retain disabled travel with precise XP requirements.
- Vanilla ice cream: play the cone-eating scene, verify seated pose and caption, skip presentation, confirm a single **$5.50** charge and restored needs. Bench rest walks to the seat, sits, closes eyes, and displays rest marks; skip safely completes presentation.
- Walk through court exits using the keyboard and accessible route buttons. South Coast's Fashion House Avenue, Bridge of Gardens and Jewel Court connect without an exit menu. Character equipment and day state persist.
- Normal home journey: leave the current court, visibly walk across the evening street with equipment, then receive the next-day recap with full needs and exactly one paycheck. Reduced motion in Chrome also reaches the next day without getting stuck.
- Chrome: search the added Levi's Reversible Belt; route to its store; select default **90 cm**; pay **$37.89**, return unused at the original store, and verify wallet returns to **$76,053.05**, the exact pre-purchase balance.
- Settings: clock pace, larger text, reduced motion, and save import/review exercised. Save/reload retains destination and equipment.
- No console warnings or errors were captured in the tested game flows.

## Responsive and visual checks

All six primary screens were checked at **320×740**, **390×844**, **768×1024**, and **1366×900**: Explore, catalog, missions, journal, wardrobe, and destination passport. After corrections, the changed map shop list and catalog have no content outside the viewport and document width equals viewport width at all four sizes. Other screens were clear in the full sweep. Phone controls remain below the map and bottom navigation stays available.

**844×390 landscape:** the activity header initially extended above the viewport. The final version constrains the scene, preserves its aspect ratio, and keeps the skip button visible. Retest measured the header at y=32.25–109.75 and skip button at y=53–89 within the 390-pixel viewport. The seated ice-cream scene and caption remain visible.

Other issues found and fixed: a planter obstructed a central shop door; connected entries spawned at a bench; some request offers had no unlocked qualifying merchandise; long store names overflowed two-column phone lists. These corrections have automated or live regression checks.

## Verification limits

The native Safari test connection timed out before control was available. No claim of a complete Safari live playthrough is made. Viewport checks are browser emulation, not physical iPhone/iPad or Android hardware testing. No finite test suite can prove the absence of all bugs. Prices, layouts, product colors in illustrations, stock, policies and retailer placements remain explicit game simulations.
