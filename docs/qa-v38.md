# v38 release QA

Validation uses isolated synthetic saves and the compiled `/Mallside/` artifact. Publication requires regression and native Safari/Firefox passes.

## Edition and gameplay checks

Eight physical editions have official retailer evidence linking ISBN, format, USD offer and cover. The covers were visually reviewed together. Six previously pending bookshop identities now have eight editions each; existing products and purchase IDs remain intact. The stock snapshot is 1,032 verified identities, 133 service identities and 433 pending catalogs.

Ten new regressions cover physical-edition provenance and raster covers, merchant associations, solid book geometry including wide art books, inspect/preview/purchase/reload/refund flows, once-per-ISBN preview rewards across branches, old shortlist compatibility and edition language, all desk/bench/counter/exit routes, non-spending public bookshop guides, bounded page turns, static reduced-motion poses, clear reading cameras and the physical edition-desk route. Historical planning/collection assertions retain exact updated current-catalog counts; v37's own twelve desks are still checked separately.

## Compiled and native checks

The native runner adds three scenarios: the physical edition desk, comparison, visible page turn, purchase and refund; a public reading-shelf route into an actual stocked bookshop and a saved hardcover receipt; and compact edition/planner controls with old notes and pinned checkout/exit.

The native matrix runner lists every scenario, starts a disposable browser session per scenario, checks strict error capture and records the exact bundle/styles. Optional resume accepts only a matching release/style/test fingerprint. It never installs a browser, enables Safari automation or changes document visibility. Native Safari uses focused controls plus real keyboard activation; Firefox uses native element clicks. Hidden-window pauses remain intact.

- Full regression: **451/451 passed** in 68.7 seconds, including the ten new bookshop checks. The historical nonwearable guide/route assertions now explicitly retain the new book-specific edition route.
- Release checks: **113 browser modules / 2,757 local references**, current image hashes and notices; public artifact **1,999 files** with no source maps or development tree.
- Tested compiled JavaScript: **`app-7GFIIQ5V.js`**. Styles: **`styles-6d92a5f8e9bb.css`**, **`life-styles-c38f483ca932.css`**.
- Isolated compiled Chromium: source-cover shop displays, edition detail, reading/finish, no clothing fitting button, and no captured page exceptions. Touch-capable layouts at **320, 390 and 768 CSS pixels** retain edition facts without horizontal overflow; comparison focus lands on `collection-comparison`.
- Visual review found and corrected a reading close-up behind the back wall. Reading now chooses a clear floor corridor and faces the camera; its hand and page timing stay synchronized. Book controls route to the edition desk, and the bookshop guide uses ISBN/format language.

## Native results and cleanup

**Safari 26.6.2** and **Firefox 159.0 / geckodriver 0.37.1** each passed **43 gameplay scenarios plus the strict error check (44 distinct checks)** across 43 disposable sessions. Both ran the exact JavaScript/styles listed above, with **zero captured game/console exceptions, zero resource warnings and zero input retries**. All three v38 scenarios passed in each browser. Reading screenshots were reviewed in both native browsers and retain visible characters, source covers, pages and lighting.

The full matrix also covers ten shared activities, shop entry/interruption/re-entry, keyboard walking/stopping, fitting/payment/refunds, map/floor routes, full viewport play, compact controls, dialog keyboard loops, all public discovery types, service bookings, reflected/evening lighting, portraits and the collection room, saved shops, legacy receipts, dining, sculpture notebooks, budgeted shortlists, themed lounges, crowd/rest poses and v37 collection studios. Safari's compact shop viewport was 390 × 732 CSS pixels; its checkout/exit targets remained visible and 44 pixels high. Firefox's native minimum was 500 pixels; both also covered 768- and 1,400-pixel widths.

All temporary native sessions and owned drivers were stopped. The temporary Firefox application, DMG, driver archive and profiles were removed. Only the four crash/telemetry metadata files created during this run were removed from the user Library; all nine baseline Firefox paths were preserved exactly. The pre-existing Firefox preference file was retained. Safari's **Allow remote automation** checkbox was observed off after testing; the Disable local file restrictions, Disable cross-origin restrictions and Allow JavaScript from Apple Events options remained unchecked. Temporary native reports/screenshots were removed after their results were recorded here.

## Limits

Desktop native browsers and touch emulation do not certify physical phones/tablets or full manual screen-reader behavior. Firefox’s native compact viewport is limited to 500 CSS pixels on this Mac; narrower 320/390-pixel edition layouts are covered by the separate touch-emulation checks. Source references establish provenance and a dated online offer, not live branch stock or new image permissions. Full book text is not shipped. Extended browser/GPU stress and broader mall/retailer fidelity remain roadmap work.
