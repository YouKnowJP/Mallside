# Mallside v8.0.6 validation

Checked October 26, 2026. This release adds a genuine browser WebGL 3D mall, free floor navigation, physical shop interiors, in-scene activity animations and complete real product photo coverage. No purchases use real money.

## Automated verification

`npm test`: **144 passed, 0 failed**. This includes the full 24-chapter career; inspect, fit/demo, checkout, eligible refund/final-sale, use and reload for every one of the 548 listings; a 2,000-action deterministic economy session; save migration, equipment, needs, errands, closing and night idempotency.

New checks cover arbitrary off-corridor endpoints, continuous collision segments, sliding without diagonal corner penetration, long-move tunneling, disconnected regions, A* routes around fixtures,40,000 free movement steps, all shop/venue/local/landmark/escalator/exit targets across 20 floor scenes, interior display reachability, scene entry, animation completion exactly once and the upper-floor departure sequence. The retained 2D guide also has open-floor collision/reachability checks.

`python3 scripts/audit-photos-v8.py`: 548/548 local valid WebP photographs; 526 distinct files; no missing, invalid or tiny images. Full provenance is in `photo-catalog-v8.json`; the grouped manifests retain model-matching evidence and archived paths. Product IDs and save/economy references were preserved while correcting verified model titles and two source links. Photograph variants and simulated prices are disclosed. No generated merchandise illustration fallback remains in cards or window displays.

## Live browser checks

- In-app browser: the ten destinations rendered as 3D scenes, with no captured JavaScript/graphics errors. Photo storefronts, fountain, cafés, benches, carousel, escalator, locals, minimap and camera controls rendered.
- Keyboard movement changed the actual rendered player position freely outside the old corridor network. Holding a mobile direction control moved X from 834.00 to 621.11. Walls/fixtures remain solid; pointer paths use open-floor routes.
- Shop directory travel reached a real 3D interior. The catalog-to-Coach path opened the selected real Swing Zip Bag photograph and CM565 reference. Product inspection, bag, checkout and receipt worked: $395.00 + $32.59 game tax = $427.59. Returning the unused item refunded exactly $427.59 and restored the prior wallet balance.
- Walking north through the Gucci doorway changed the scene from `mall-3d` to `shop-interior`, without an intervening room-selection menu. The explicit return-to-mall control also worked. Clothing rails, real product photo displays and the collection/checkout counter were visible.
- South Coast Plaza escalator rides reached Level 2 and returned to Level 1. The player visibly traversed the animated steps. Entering another level preserves progress and places the shopper at its escalator landing.
- A bench-rest animation showed the shopper seated in the actual court. Ice cream and drink animations showed held props and restored needs once. The carousel animation placed the shopper on a moving horse and recorded its journal reward once. Animation time pauses the live clock.
- Full upper-floor departure completed: walk to escalator, descend, walk to mall exit, evening home/sleep scene, next-day recap, restored needs and one paycheck. Closing time inside a store also exits the interior before the homeward route.
- Responsive layouts were inspected at 320×740, 390×844, 768×1024 and 1366×900. Phone controls fit above the fixed navigation; nearby prompts no longer cover the central character. Horizontal document width matched viewport width in the checked phone/tablet layouts.
- Chrome separately rendered the 3D mall with no captured warnings/errors. Its catalog showed 24 photo cards, 12 already decoded within the lazy-load viewport and 0 broken images.
- The explicit 2D graphics option rendered a playable guide with real photo windows. The 3D option was restored. WebGL initialization failure also has a 2D fallback by construction; an artificial GPU/context failure was not forced in the browser.

## Limits

Finite tests cannot prove an absence of every bug. These were desktop browser and viewport checks, not physical iPhone/iPad/Android hardware certification, and a complete independent native Safari playthrough was not performed. Touch drag is implemented; live input verification used the on-screen movement controls. Native fullscreen behavior depends on the browser and embedding permissions; the existing expanded-play fallback is retained.

The 3D malls and interiors are stylized original game arrangements, not exact current architectural replicas or tenant directories. Some floor scenes are activity/landmark floors with no selected shop tenants. The 2D guide preserves schematic reference relationships. Product photographs show genuine variants; character equipment is illustrated 3D geometry rather than a scanned product. Reference prices, availability, stock, return policies and fit are game values; source links may describe retired products.
