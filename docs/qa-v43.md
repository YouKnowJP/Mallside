# v43 release QA

## Scope and sources

Four exact official TAG Heuer SKU references in three unfinished shops; source-reviewed solid watch models and original comparison studios; preserved material studies; eased wrist inspection; sculpture detail and saved sketch markers on all 23 floors.

[Catalog evidence](research-v43/catalog-evidence.json) hashes live official page text and exact source/runtime photograph bytes. Pages were fetched live through Firecrawl and images directly from TAG Heuer's CDN. Provenance does not add third-party commercial permission. All 8,746 earlier full product records and appearance profiles remain unchanged, including all 784 earlier color profiles and 784 surface profiles. Schema 6 saves and map revision 10 remain compatible.

## Offline and compiled validation

- Ten new regressions cover exact SKU/price/case/photo references, retained identities and notes, atomic free studies, source comparisons, fitting/payment/refunds, reachable services/exits, finite attached watch geometry, static reduced motion, continuous wrist-gesture joins, bounded fixtures and mall/floor-scoped sketch markers.
- Final full suite: **512/512 passed**, zero failures, in **245.6 seconds**. Historical catalog-count and ID-filter expectations were extended for the twelve new branch listings; the earlier ID checksums still match.
- Release checks: **145 browser modules**. Public verification: **2,026 files**; one minified game bundle, no source maps or development tree. Photo inventory: **1,983 references / 1,961 unique runtime photos / 42 unindexed legacy images**.
- Visual review corrected oversized watch props and excessive individual part draws before freezing the artifact. Models now use smaller display/wrist proportions and batch static dial/link parts by material. Native watch fitting and sculpture screenshots were reviewed in both browser families.
- Compiled Chromium touch emulation at **320/390/768 CSS px** passes without horizontal overflow. Hit-tested save/exit controls measure **62.4px at 320px**, **48px at 390/768px**. Case facts, retained notes, draft rollback, free saves and direct exits pass with zero captured errors. The helper compares the actual displayed clock, because periodic persistence can lag the live clock; saving the study advances neither the displayed clock nor money/XP.
- Frozen JavaScript: **`app-FJFUO6ZN.js`**. Styles: **`styles-6d92a5f8e9bb.css`**, **`life-styles-a3e53f64648f.css`**.

## Native Safari and Firefox

- **Safari 26.6.2: 59/59 checks passed**, covering all **58 scenarios in one retained window**. Actual WebGL, native WebDriver keyboard input, visibility and game time remain active.
- Initial Firefox headless attempts passed ten fresh-session scenarios, including all three new flows, but later encountered intermittent driver navigation/session-start and event-loop timeouts. Desktop control also confirmed that the Mac had locked. Those attempts are separate from the final full-pass count. A visible retained-window run after local unlock exercised a clean synthetic save and full navigation for every scenario on the same frozen game code.
- **Firefox 159.0 / geckodriver 0.37.1: 59/59 checks passed**, covering all **58 scenarios in one visible retained window**, with actual WebGL and native pointer/keyboard input.
- Independent verification matches every final report to the release, stylesheet names, both runner sources, isolation mode and frozen artifact hashes. Both complete matrices have **zero game errors, resource warnings and input retries**. Compact flows use each native platform's real window limits. See [browser proof and artifact hashes](research-v43/browser-proof.json).

## Cleanup

- Safari's **Allow remote automation is verified off**, and its settings window is closed. Both owned native browser sessions and drivers are stopped.
- The temporary Firefox app, downloads, driver and disposable profiles were removed. **4,453 added Firefox profile/cache paths** were removed; all **nine pre-test paths** and the pre-existing preference file remain. New home paths remaining: **zero**.
- Removed owned updater caches: mallside-v43-firefox, mallside-v41-firefox. These include the old v41 cache whose matching temporary app no longer existed. Unrelated cache parents remain intact.
- Native/Chromium temporary QA artifacts are removed after retaining this record and the sanitized proof. The localhost preview and remaining neutral research tools are stopped/removed at the end of publication verification.

## Limits

Desktop native tests and touch emulation do not certify physical mobile devices, complete manual screen-reader use or prolonged GPU stress. Furnishings and game geometry are original adaptations; source references do not assert branch inventory or measured wrist fit. Wider catalog research and exact branch architecture remain roadmap work.
