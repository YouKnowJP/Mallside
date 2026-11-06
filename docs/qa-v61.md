# Mallside v61 · release QA

Reviewed 6 November 2026. This bounded update completes two research-only handset shops and refines the existing coffee terraces. Remaining shops, wider assortments, exact mall geometry and broader character refinement remain roadmap work.

## Candidate checks

The corrected candidate passes **773/773 local regressions**, with no failures, cancellations, skips or todo cases. Seventeen v61 tests cover exact selected carrier variants, dated offer qualifications, licensed-photo hashes, source dimensions, solid model details, display scale and surface placement, coordinated hand tracking, retained notes, purchases/import/refunds, free café selection, payment review, all 23 counter footprints and routes, unchanged economy, finite hand motion and distinct props. Source validation covers **236 browser modules**; the generated public artifact verifies **2,075 files**.

All **8,857 previous complete product records**, **1,598 shop identities**, old photographs, schema 6, map revision 10 and economy rules remain compatible. Four new branch listings make **8,861 catalog entries**. [Compatibility](research-v61/compatibility.json), [carrier/manufacturer and photo evidence](research-v61/catalog-evidence.json), [coffee research](research-v61/coffee-evidence.json) and the [asset inventory](ASSET_INVENTORY.json) distinguish exact references from original game adaptations. The two carrier offers are dated 5 November; no actual branch stock or service activation is asserted.

## Browsers and compact layouts

**Safari 26.6.2 and Firefox 159.0.1 each pass 25 selected scenarios / 26 checks from 115 available scenarios**, with zero captured exceptions, unexpected console errors, resource warnings or input retries. The final evidence uses retained windows in coordinator batches capped at 26 cases, one paired Safari session and two headless Firefox sessions. Each scenario reloads a clean game fixture. The selection covers all four v61 flows, previous recorder/parcel/material/bench interactions, associate checks, exhausted formats, fitting, payment, reload, exact refunds, shop exits, map transitions, native walking, evening lighting, fullscreen, keyboard containment, water, tea and seated dining. [Native evidence](research-v61/browser-proof.json) retains exact per-case fingerprints, runner revisions, viewport observations and reviewed image hashes.

Ten owned **Chromium 156.0.8078.80** touch contexts pass at **320 × 900, 390 × 900, 768 × 900, 844 × 390 and 320 × 568**, in 3D and lighter graphics. Checks verify contained dialogs, at least 44 px controls, keyboard selection/focus, free menu browsing, visible payment controls, exact single pastry charges and correct coffee/meal metrics. Every context closes without captured page errors. These are desktop emulations, not physical-device or assistive-technology certification. [Compact evidence](research-v61/compact-proof.json) is bound to the final corrected runtime and public files.

## Corrections and evidence continuity

Review corrected a photo-orientation conversion, café counter-handle bounds, a hidden payment footer, the hardcoded café location, pastry orders playing a drink animation, overwritten hand poses and oversized handset displays. The final hand solve damps near-straight-arm oscillation; the cup moves toward the face, and floor handsets retain handheld scale on their actual fixture surfaces. The water-station regression's optional diagnostic canvas is guarded. South Coast Plaza counter routes are checked through their existing bridge/floor connection, rather than assuming every wing connects on the same floor.

The final dining check exposed a test timing race: the driver delivered Stop after the short route had already served the meal. The corrected check sends two immediate native pointer taps to observed button coordinates, then verifies both actual click events and zero charge before a second, completed meal. Both browsers pass the corrected check. No game clock, document visibility, animation frame or click handler is substituted.

The [audited test-only patch](research-v61/dining-test-revision.patch) reconstructs the prior runner; every other scenario body is byte-identical. Measured unchanged passes retain their original runner fingerprints against the same frozen runtime and styles. The repeated dining case and remaining scenarios carry the corrected runner fingerprint. Superseded oversized-display runs and interrupted startup/layout attempts are excluded. This preserves valid evidence without representing a failed or interrupted scenario as a pass.

## Cleanup and publication gate

Safari remote automation is visibly off, all other developer flags remain unchanged and its normal Start Page is preserved. The paired test window, owned drivers and temporary display assertions are closed or stopped. Firefox's temporary software, installer, driver, metadata and **14 observed profiles** are absent. Four new test-only global crash/glean files are removed; all **14 pre-existing Firefox entries**, kinds and file bytes remain preserved. Official download checksums and Mozilla's Apple signing team **43AQ936H96** are verified, including the app signature after testing. [Cleanup evidence](research-v61/cleanup-proof.json) records the scoped teardown.

Publication requires committed runtime bytes matching the frozen candidate apart from the release commit stamp, successful exact-head GitHub Pages jobs, matching uploaded artifact bytes and live changed shopping/café/save/refund/exit checks. This committed QA record does not claim later deployment events in advance. Final publication and remaining raw-file/server cleanup are recorded in ignored build/qa/v61-live-proof.json.
