# Mallside v58 · a more personal shopping visit

Reviewed 5 November 2026. This update adapts in-person retail practices into Mallside’s original shopping simulation. It does not reproduce a surveyed store or assert live branch inventory.

## Find, ask, try and decide

Product details offer **Show this item on the shop floor** in 3D shops. The game reveals the correct department/page and walks to the exact product’s clickable display, retaining the selected size. An associate size check uses that same real catalog identity and the player’s selected size or format. The associate walks from their help point, stops beside the player, checks the actual displayed product and returns while the player can continue browsing. **Size check…** in the main gameplay controls remains accessible in focused play; it opens status and cancellation, or routes back to the associate when ready.

The result rechecks today’s simulated stock after subtracting existing unpaid picks. It offers optional pickup, inspection/another size, or continued browsing. Pickup uses the existing capacity, unlock, closing-time and exact-stock validation. Checking never reserves an item or changes ownership, money or stock. Ordinary unpaused game time still runs while people walk. Existing fitting, bag review, tax, payment, receipt and return rules remain authoritative.

Menus and hidden windows pause staff movement. Cancellation sends the associate back from their current position; leaving/rebuilding a shop or reloading clears this per-visit conversation. Display-page/department switches wait until a check is finished or cancelled so the requested product stays physically present. Reduced motion gives a stationary result; lighter graphics provides the same stock information directly in the accessible dialog.

## More finished stores

Numbered fixed price cards identify the current real display products, department and game price. Stands connect to the floor or fixture. Open-legged footwear, home and accessory tables replace heavy solid blocks; shelf edges, restrained warm strips, counter joinery, paper bags and receipt details add purpose without filling walking space. Original generated stationery and materials use existing catalog references; no brand interior or external image is copied.

Shopper bodies maintain at least 25 logical units of separation in the deterministic layout checks. Waiting positions stay outside fitting-room doors. A shopper reaches the front of the queue before advancing to the register; stalled routes can detour around occupied space. All 190 distinct stocked layouts complete at least four purchases per shopper in the 375-second simulation with a player-reserved fitting room. This is bounded simulation coverage, not a claim of perfect behavior under every possible player obstruction.

## Research and compatibility

[Nike’s in-store support](https://www.nike.com/membership/in-store-services), [Zara’s product-location tools](https://www.zara.com/uk/en/help-center/StoreMode) and [IKEA’s department/aisle guidance](https://www.ikea.com/us/en/customer-service/knowledge/articles/56835821-8dgd-4fb1-b7e3-0015g7f5g990.html) informed the exact-product assistance and locator. UNIQLO’s regional fitting and review/pay/bag guidance informed clearer retained selections and checkout feedback. Apple’s 2016 Union Square account is a historical precedent for themed perimeter displays and expert help, not a current global layout claim. [Six primary sources and their limits](research-v58/shopping-evidence.json) record the evidence and original game adaptations.

All 8,856 complete product records, 1,598 shop identities and existing photos remain unchanged. Save schema 6, map revision 10, ownership, money, reward limits, fitting and refund rules remain compatible. [Compatibility](research-v58/compatibility.json), [crowd layout proof](research-v58/crowd-layout-proof.json) and [QA](qa-v58.md) document the verification and its limits.
