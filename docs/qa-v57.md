# v57 release QA

**Local, compact and native browser validation passed.** Safari automation is visibly off again. Publication and live verification are recorded separately in ignored `build/qa/v57-live-proof.json`. This committed QA record describes the tested candidate and does not assert deployment before it happens.

## Completed checks

The frozen candidate `app-F2I6ZXTT.js` passes **728/728 local tests**, with zero failures, cancellations, skips or todo cases. Ten new regressions cover projected label bounds, collision/priority/deduplication, camera projection and near/far clipping, semantic visibility restoration without moving targets, separate rig-bound starter trouser surfaces, continuous cropped-top waist coverage, walking/seated skinning, catalog outfit replacement, shared resource lifetime, cached surface materials, exact fixture bounds and catalog/save compatibility. An existing fitting lifecycle test now also verifies the restored shop-floor status. Source checks pass for 221 browser modules, and the generated artifact verifies all 2,072 public files.

**Safari 26.6.2 and Firefox 159.0.1 each pass 18 selected scenarios / 19 checks from 102 available scenarios**, with zero captured game exceptions, unexpected console errors, resource warnings or input retries. The selection includes all three v57 cases, all three v56 cases, v33 presentation/lighting/portrait checks, cropped garment transactions, collection-room movement and core shop entry, walking, fitting, carrying, payment, exits, fullscreen and responsive keyboard containment. Safari uses one retained window bounded to 18 cases. Firefox uses 18 fresh headless profiles, all independently verified absent. Both use real native input. [Native proof](research-v57/browser-proof.json) records each scenario and the exact source/artifact/runner fingerprints.

Six desktop Chromium touch-capable contexts pass at **320, 390 and 768 px**, in both 3D and lighter graphics: no horizontal overflow, valid source notebooks and direct exits, all four current-floor amenities, 44 px map controls, paused free map views, unchanged money/XP and correct original/illustrated character previews. Every owned context closes with no captured browser errors or warnings. [Compact proof](research-v57/compact-proof.json) records actual scene dimensions and label bounds. Physical mobile devices and manual assistive-technology certification remain outside this desktop coverage.

## Visual corrections and evidence

Review found jagged anatomical waist/ankle cuts beneath cropped tops and a high preview bench blocking seated rear views. Continuous original waist/hem layers now cover those cuts, with source-aware catalog outfits still replacing the starter layers; the crop regression checks exposed skin above the new waist. The dressing-room uses a low backless seat. Front/back/seated character views, the quieter shop scene and compact layouts have been visually reviewed. Full-name destination lists and real clickable objects remain available when a floating label cannot fit. Two small Safari background-window thumbnails are excluded from visual assessment; full-size optical/shop and outfit views were reviewed instead.

Initial rejected test runs used an outdated fitting mock, expected the waistband instead of its visible seam as the first ray hit, and expected a word boundary in concatenated guide text. The corrected tests verify the actual status, valid clothing surface and exact bag button text. Those earlier incomplete runs are excluded. A final code review corrected decorative labels receiving destination priority when no route was selected; the added controller regression and all final local, compact, Safari and Firefox checks pass against the corrected candidate. A separate Firefox profile also verifies the cropped seated back view after 74 real rendered frames and is removed afterward. No clock, visibility or synthetic click override is used for retained native interactions.

All 8,856 complete product records, 1,598 shop identities, photographs, schema 6, map revision 10 and economy rules remain compatible. [Compatibility evidence](research-v57/compatibility.json) includes unchanged catalog-source hashes.

## Cleanup and publication gate

Both native selections pass. Safari automation is visibly off and its owned driver is stopped. Temporary Firefox software, profiles, caches, raw reports and preference backups are removed; all 14 pre-existing Firefox entries and their original file bytes are preserved. Sanitized proof remains in this documentation, with cleanup details in ignored `build/qa/v57-live-proof.json`.

Publication requires committed runtime bytes matching the frozen candidate apart from the release commit stamp, successful exact-head GitHub Pages jobs, and live purchase/reload/refund/exit and seated-view checks. The committed QA record does not assert those later events before they happen.
