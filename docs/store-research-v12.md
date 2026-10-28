# Mallside v12 catalog and interior evidence

Checked 2026-10-27. This release replaces the v11 guest assortment fallback.

- 1,771 distinct pictured real models across 8,571 active branch listings.
- 931 newly bundled photographed reference records, including native-currency references and actual restaurant menu products.
- 1,015 stocked stores, 450 storefronts awaiting a verified photographed catalog, 133 service/activity locations. All 1,598 directory entries retain reachable interiors.
- No active category/price/hash-selected guest merchandise. Manufacturer boutiques use their own makers. Multibrand retailers use their own listings or explicit carried-brand proof.

## Evidence and prices

Research handoffs are preserved under `research-v12/`. Every bundled model has an actual source photograph, model name, positive price and source link. Retailer associations cite a retailer, maker, mall owner or documented regional primary source. This is reference stock, not live branch inventory. Category and condition restrictions are enforced: Sephora fragrance evidence does not permit handbags, Dyson hair-tools proof does not permit vacuums, and certified pre-owned watch evidence does not permit new watches.

Ross carried-brand proof covers Nike, Coach, Calvin Klein and Michael Kors through a regional municipal grand-opening announcement. It does not prove specific mall-branch SKUs. Marshalls evidence covers explicitly documented brands; prior unsupported Hanes-at-Ross listings are retired. Ross and similar stores apply original simulated off-price discounts, clearly separate from the model's reference amount.

USD game prices remain separate from native EUR, GBP, AUD, HKD and CHF published reference amounts. Conversions use the dated 2026-10-27 [ECB reference file](https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml). Menu prices without a public current quote are labeled simulated references. No invented published price or live-availability claim is made.

Photos are local genuine product rasters, never AI merchandise. Pictured variants may differ from illustrated avatar equipment. Source sizing is retained where available; undisclosed source sizes use a disclosed game reference option. Child models are browsable/demoable and cannot be fitted to the adult shopper.

## Original interiors

`brand-designs.js`, `interior-blueprints.js` and `interior-art.js` separate material palettes, architectural features, display arrangements and functional stations. Sports shops use sneaker-wall/track cues; Apple uses open tables; Sephora has striped/tester-counter cues; luxury salons vary niches, trunks, arches, vitrines and materials. Restaurant counters, bookstore shelves, toy fixtures and home vignettes differ.

Brand/design-team and official mall-owner references are preserved in `research-v12/interior-references.json`. These are condensed original game interiors inspired by documented visual cues, not measured as-built replicas. A collapsed design reference is available in each store's collection view.

## Preservation and unresolved coverage

A frozen v11 catalog builder and seed snapshot reconstruct prior IDs. Retired purchases retain their original manufacturer/model, paid amount, tax, wardrobe slot and game return policy. They cannot be bought again or kept as unpaid bag selections. Active product browsing excludes archived guest listings.

Unresolved research is explicit in the coverage JSON and researcher artifacts. It includes unavailable photo endpoints, public catalogs lacking a model/price/photo combination, unpublished independent shops, inaccessible menus and stores with only unsuitable or pre-owned results. Empty retail locations are not relabeled as service businesses. No other retailer's product is substituted to fill a gap.

Regenerate coverage with `node scripts/audit-catalog-v12.mjs`. The static modules and bundled images are the release inputs; no research server is required at runtime.
