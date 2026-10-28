# Mallside v15 validation

The final release suite passed **217/217 tests**, with no failures or skips, in 35.9 seconds:

`node --test --test-concurrency=2 tests/*.test.mjs`

`git diff --check` and JavaScript syntax checks also pass.

## Automated coverage

The existing 212 release checks cover branch shopping transactions, evidence and photo integrity, progression, saves, returns, character equipment, route/collision geometry, floors/escalators, closing/home/sleep and action idempotency. Five new checks cover readable exact merchant identities, shared brand treatments and distinct retail families, daily own-store photographed windows with no guest fallback, documented signature features, and physical fitting/checkout/returns routing including invalid service input.

The first full v15 run found that Old Navy and Tory Burch records lacked a store-level source despite having official product references. Identity provenance now falls back to that store's own product source, and the final complete suite passes without weakening the assertion.

## Live browser checks

In-app Chromium/WebGL, desktop, 390×844 phone and 820×1180 tablet viewport overrides, using the separate local free-shop save:

- Walked into Nike from the center directory, browsed its 25 real photographed models, and used the new service controls.
- Try-on walked the shopper to the fitting station. Selected Nike Air Force 1 '07 in size 8, watched the temporary rotating equipment preview and received fitting feedback. The official reference remains `https://www.nike.com/t/air-force-1-07-mens-shoes-DZejrQoC/CT2302-100`.
- Added it to the bag; the toolbar showed Bag (1). Catalog checkout walked the shopper to the payment counter before displaying the total.
- Paid a $115 subtotal plus $9.49 game tax, total **$124.49**, receipt **D9-8**. Wallet changed **$81,440.55 → $81,316.06** and ownership increased from three to four.
- Returns walked to the separate desk. The unused tagged purchase was eligible; confirming refunded **$124.49** once, restoring the wallet to **$81,440.55**, three retained purchases and an empty bag.
- Phone: all five toolbar actions remained visible, the toolbar measured 334px wide by 124px tall, and document width equaled the 390px viewport. Exiting restored the mall without a doorway bounce.
- Read Nike, Nordstrom Rack and Levi's signs from the concourse. Confirmed recessed photographed window displays and connected neighboring façades.
- Traveled to South Coast Plaza, searched Prada in the center directory and chose Step inside. The route rode the escalator to Level 2 and entered the green boutique with black-and-white checkerboard floor, bag displays, 15 own-brand real products and separate service desks.
- Tablet: all five shop actions remained readable in a single row; document and viewport width both measured 820px. The 3D view retained working zoom/camera controls for the narrow portrait view.
- Captured storefront and boutique screenshots. Browser warning/error logs were empty in the inspected scenes; temporary viewport overrides were reset.

The public browser save was not used for test purchases or reset. Test purchases use simulated game money. Physical iPhone/iPad hardware and other browser engines were not available, so viewport checks do not certify those devices. The existing 450 pending assortments remain honestly marked; this pass does not add unverifiable products or claim exact real-branch interior replicas.
