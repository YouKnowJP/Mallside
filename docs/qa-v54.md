# v54 release QA

Local validation passed: **693/693 tests**, with no failures, cancellations or skips. Source checks cover 208 browser modules and 3,581 local references. The final generated artifact contains 2,068 files and bundle `app-RR2SEREP.js`.

Fourteen new regressions cover the exact brush offers, selected SKUs, dimensions and source-photo hashes; complete prior product and palette compatibility; merchant-only stocking; six-minute inspection and duplicate XP prevention; checkout/import/refunds; retained saved notes; escaped factual source cards; solid geometry and instancing; smooth motion joins and fixed reduced motion; hand contact through inspection; studio footprints and resource reuse; collision-safe shop routes; owned room models; all 85 directory footprints; and current-floor guide contents and real campus routes.

Review caught an unreachable initial brush target and residual hand-solve error close to rest. Moving the held brush closer and using a bounded higher-precision solve near the lift/lower endpoints corrected hand contact. It also corrected the carried brush’s origin and orientation so the shopper holds its handle. Clothing photo-surface tests continue to cover clothing and bags; the new brush geometry has its own source-bound tests.

Three new native scenarios exercise the stocked Aveda shop and both inspection flows, free source comparison, retained material notes, payment/reload/exact refunds, owned shelf models, compact format cards and direct exits, plus detailed public directories, free current-floor guides, real amenity/shop walking and saved shortlist access. Real clocks, visibility and native input remain active.


## Browser results and final visual correction

The complete native baseline passed in **Safari 26.6.2 and Firefox 159.0.1**: **93 scenarios / 94 checks in each browser**, with no captured game exceptions, unexpected console errors, resource warnings or input retries. Safari used six bounded sessions; Firefox used 93 fresh headless sessions. Every report was independently checked against its source, public artifact, runner and session fingerprints. All Firefox profiles were removed. These full matrices tested `app-ZRJJ25UU.js`; their evidence is preserved separately in [baseline proof](research-v54/browser-baseline-proof.json).

Final screenshot review then found overlapping generic paper pads and the purpose-built slate desk fronts. An assembled-scene regression reproduced the duplicate surfaces. The correction skips only generic placeholders for brush products in `planning-lounge.js`; data, routes, hit targets and controls are unchanged. The strengthened regression, all 14 v54 cases and the full 693-test suite passed on the corrected source.

The final `app-RR2SEREP.js` artifact passed a fresh **Firefox three-scenario / four-check v54 rerun** with no errors, warnings or retries and three removed profiles. A native **Safari visual recheck**, with automation remaining off, used a fresh local origin and private window: free shop, Century City travel, directory search, actual Aveda entry, collection desk, material study, close-range corrected desk rendering and direct exit. Only the owned test window was closed. This was a targeted manual visual recheck; it is not presented as a second full Safari matrix. See [final browser proof](research-v54/browser-proof.json).

Six isolated Chromium touch contexts covered **320, 390 and 768 px**, each in 3D and lighter graphics. They passed exact two-format source cards, mini SKU selection, real inspection, direct exits, title clearance, no horizontal overflow, minimum 46 px new touch targets, current-floor shop links, actual water-station routes, free money/XP invariants and saved shortlist access. All owned contexts closed, with no captured browser errors or failed requests. Native Firefox also checks the compact flow. [Compact proof](research-v54/compact-proof.json) records the scope; physical mobile and screen-reader certification remain future work.

## Cleanup and publication gate

Safari remote automation was visibly confirmed off and its driver stopped before the final manual visual check; it remained off throughout. The temporary Firefox application, installer, driver, archives, profiles, attributable crash/telemetry files and its specifically named update-cache tree were removed. Mozilla signatures were checked before and after testing. All 14 pre-existing Firefox support/cache/preference entries and exact original preference bytes were preserved. Disposable raw browser reports and screenshots are removed after their sanitized evidence and reviewed screenshot hashes are recorded.

Publication requires the committed rebuild to match every final tested runtime byte except the `release.json` commit stamp, successful exact-head GitHub check/publish jobs, and post-publication live byte checks plus an isolated gameplay smoke. That deployment evidence is retained locally in ignored `build/qa/v54-live-proof.json`; this committed QA file does not assert a deployment before it occurs.
