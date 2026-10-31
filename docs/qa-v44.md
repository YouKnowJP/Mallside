# v44 release QA

## Scope and sources

Four exact official MCM SKU references in two unfinished shops; source-reviewed tote/backpack construction and original care/packing studios; retained material studies; time-based bag settling; detailed camera kiosks and free album access on all 23 floors.

[Catalog evidence](research-v44/catalog-evidence.json) records live official page text and exact source/runtime photograph hashes. Pages were fetched live through Firecrawl and photographs directly from the official image service. Published dimension sequences are approximate; drawing axes and virtual carry are interpreted from photographs, not measured capacity or physical fit. Source pages include mixed stock/return notices, so real availability and retailer return entitlement are not asserted. All 8,758 earlier full product records and appearance profiles remain unchanged. Schema 6 saves and map revision 10 remain compatible.

## Offline and compiled validation

- Twelve new regressions cover exact SKU/offer/photo references, retained identities and notes, free atomic studies, source comparisons, preview/payment/refunds, reachable services/exits, finite source-specific geometry, bounded care fixtures, time-step-independent bag settling, pause/reduced motion, and center-scoped photo markers.
- Final full suite: **524/524 passed**, zero failures, in **77.6 seconds**. Historical count/filter expectations include the eight new branch listings. An independent audit deep-compared every earlier complete product record and appearance profile against v43.
- Release checks: **152 browser modules**. Public verification: **2,030 files**, one minified bundle, no source maps or development tree. Photo inventory: **1,987 references / 1,965 unique runtime photos / 42 unindexed legacy images**.
- The tests caught an empty bag-pattern fallback to a missing garment profile; the null-safe fallback is fixed. All earlier appearance profiles still match. Route checks use the actual cross-building campus planner, including South Coast's separate buildings.
- Compiled Chromium touch emulation at **320/390/768 CSS px** passes without horizontal overflow. Collection exits measure **44.2px**; study exits measure **62.4px at 320px**, **48px at 390/768px**, and are visible and hit-tested. Palette selection, free saves and direct exits pass with zero captured errors. Saving changes neither the displayed clock nor cash/XP.
- All **47 photo-kiosk approaches across 23 floors** pass walkability and actual campus routing. Native backpack fitting and camera-kiosk screenshots have been visually reviewed.
- Frozen JavaScript: **`app-57XY2UKE.js`**. Styles: **`styles-6d92a5f8e9bb.css`**, **`life-styles-1e3849d338d1.css`**. See the [browser proof and artifact hashes](research-v44/browser-proof.json).

## Native Safari and Firefox

- **Safari 26.6.2: 62/62 checks passed**, covering all **61 scenarios in one visible retained window**, with actual WebGL and native WebDriver keyboard input.
- **Firefox 159.0 / geckodriver 0.37.1: 62/62 checks passed**, covering all **61 scenarios in one visible retained window**, with actual WebGL and native pointer/keyboard input.
- Independent verification matches every scenario report to the release, stylesheet names, both runner sources, isolation mode and all 2,030 frozen public-file hashes. Both complete matrices have **zero captured game errors, resource warnings and input retries**. The native compact-window tests use each platform’s real window limits; exact 320/390/768px touch checks are recorded separately above. No source change was needed after the native runs began.

## Cleanup and deployment

- Safari’s **Allow remote automation is verified off**, its settings window is closed, and its owned session and driver are stopped.
- The temporary Firefox app, downloads, driver and disposable profiles are removed. All **four newly created home paths** were removed; all **nine pre-existing paths** and the existing preference file remain. New home paths remaining: **zero**. No v44 updater cache was created.
- Raw native browser reports, screenshots and temporary Chromium QA helpers are removed after retaining this sanitized proof. The localhost preview and neutral research tools are removed after live publication verification.
- Publication uses the main-branch check/publish workflow. The post-commit build and deployed JavaScript/CSS must match the tested hashes; the release metadata records the publication commit. Completion is reported only after CI and live verification pass.

## Limits

Desktop native browsers and touch emulation do not certify physical mobile devices, complete screen-reader use or prolonged GPU stress. Source provenance does not add photograph permission. Wider catalog research and exact branch architecture remain roadmap work.
