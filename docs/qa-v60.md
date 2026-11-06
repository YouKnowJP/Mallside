# Mallside v60 · release QA

Reviewed 5 November 2026. This is a bounded improvement to one unfinished shop and all guest-services counters. More shops, exact mall geometry and broader character refinement remain roadmap work.

## Candidate checks

The candidate passes **756/756 local regressions**, with no failures, cancellations, skips or todo cases. Eleven v60 tests cover exact merchant identity, licensed-photo provenance and hash, discontinued-model qualifications, source dimensions, solid geometry and bounded resource use, smooth two-hand tracking, original furniture footprints/routes, purchased-parcel capacity/import/refund rules, physical parcel markers and stationary associate return acceleration. Source validation covers **229 browser modules**; the public artifact verifies **2,073 files**. The final notification-only CSS correction also passes compact and both native browser selections.

All 8,856 previous complete product records, 1,598 shop identities, old photographs, schema 6, map revision 10 and economy rules remain compatible. The new exact H1n record makes 8,857 catalog entries. [Compatibility](research-v60/compatibility.json) records independent previous-release hashes. [Source evidence](research-v60/catalog-evidence.json) distinguishes the adopted black H1n photograph from the excluded H4n Pro finish and qualifies both models’ discontinued status.

## Browsers and compact layouts

**Safari 26.6.2 and Firefox 159.0.1 each pass 18 selected scenarios / 19 checks from 111 available scenarios**, with zero captured exceptions, unexpected console errors, resource warnings or input retries. Safari uses two paired windows, each bounded to 18 cases; Firefox uses 18 fresh headless sessions. The selection covers all three new v60 flows, previous material/bench interactions, associate assistance, exhausted formats, fitting, physical pickup, payment, reload, exact refunds, repeated shop exits, map transitions, native walking, evening lighting, fullscreen and keyboard containment. Real clocks and document visibility remain active; native keyboard and pointer input are used. [Combined evidence](research-v60/browser-proof.json) and [retained Firefox evidence](research-v60/firefox-proof.json) record exact fingerprints, scenario names and reviewed image hashes.

Ten owned **Chromium 156.0.8078.80** touch contexts pass at **320 × 900, 390 × 900, 768 × 900, 844 × 390 and 320 × 568**, in 3D and lighter graphics. Checks verify contained content, scenario focus retention, at least 44 px controls, static reduced-motion meters, persisted parcel collection and no routine notification covering either dialog. All contexts close without captured page errors. These are desktop emulations, not physical mobile or assistive-technology certification. [Compact evidence](research-v60/compact-proof.json) is bound to the corrected frozen runtime and public files.

## Corrections and exclusions

Review corrected a sideways EXIF conversion, a single-item collection’s misleading two-item tally, scenario focus loss, the recorder’s fallback Home & stationery department and old arrival/badge notifications covering compact dialogs. The H4n Pro’s mismatched All Black photograph and FIGS photographs without established publication permission were excluded. The recorder uses original unlettered geometry; its exact photograph has independent CC BY-SA 4.0 attribution and terms.

The early interrupted Firefox run is excluded. The final run restarts every selected case against the corrected CSS fingerprint. Safari completes 16 cases in its first paired window; a hidden-window walking interruption is excluded, then the two unfinished cases pass in a second visible paired window under the same candidate fingerprint. No hidden-document override, accelerated animation clock or synthetic-click substitution is used for native passes.

## Cleanup and publication gate

Safari remote automation is visibly off after testing, other developer flags are preserved, a normal Start Page remains and the owned driver/display assertions are stopped. Firefox software, installer, driver, all 18 final profiles and temporary-root entries are removed. One test-only global crash-helper log is removed; all 14 pre-existing Firefox entries and original bytes remain preserved. The official Mozilla download, app signature (team 43AQ936H96) and geckodriver digest were verified, including the app signature after testing. Raw captures/reports are removed after their reviewed hashes and sanitized evidence are retained.

Publication requires committed runtime bytes matching the frozen candidate apart from the release commit stamp, successful exact-head GitHub Pages jobs, matching uploaded artifact bytes and live changed shopping/parcel/save/refund/exit checks. The committed QA record does not assert later deployment events before they occur; final publication and teardown are recorded in ignored build/qa/v60-live-proof.json.
