# Mallside v59 · release QA

Reviewed 5 November 2026. This is a bounded update to original planning interiors and public pause points. The remaining catalogs, exact mall geometry and broader character refinement remain roadmap work.

## Candidate checks

The corrected candidate passes **745/745 local regressions**, with no failures, cancellations, skips or todo cases. Eight v59 regression cases cover consultation routes beside the actual workbench in all 292 planning lounges, personal space, eased walking, paused/reduced-motion equivalents, continuous return, valid material controls, interpolated material appearance without frame-by-frame resource creation, bench destinations on all 23 floors, original detail footprints and catalog/save compatibility. Source validation covers 224 browser modules; the public artifact verifies all 2,072 files.

All 8,856 complete product records, 1,598 shop identities, existing photos, schema 6, map revision 10 and economy rules remain compatible. [Compatibility](research-v59/compatibility.json) records the unchanged catalog hashes. No pending shop receives invented merchandise. [Five primary retailer and mall sources](research-v59/shopping-services-evidence.json) distinguish observed visitor/consultation practices from original game adaptations.

## Browsers and compact views

**Safari 26.6.2 and Firefox 159.0.1 each pass 18 selected scenarios / 19 checks from 108 available scenarios**, with zero captured exceptions, unexpected console errors, resource warnings or input retries. The selection covers all three new v59 cases, v58 associate/stock/pickup/payment/refund cases, material rollback and reload, public rest and actual next-shop arrival, shop entry and repeated exit, native walking, fitting and checkout, map transitions, day/evening lighting, fullscreen and keyboard containment. Safari uses one explicitly retained window bounded to 18 cases; Firefox uses 18 fresh headless sessions. Every final Firefox profile is independently confirmed absent. Real clocks, visibility and native keyboard/pointer input remain active. [Native evidence](research-v59/browser-proof.json) records the exact candidate/runner fingerprints, individual scenario names and reviewed image hashes.

Ten owned desktop **Chromium 156.0.8078.80** touch contexts pass in both graphics modes at **320 × 900, 390 × 900, 768 × 900, 844 × 390 and 320 × 568**. The checks verify no horizontal overflow, scene/panel containment, 44 px material controls, stable select identity, keyboard access to Save/Cancel and exit from the nonmodal panel, free saved notes, no stale entrance notifications covering controls, and the existing lighter-mode material dialog. All contexts close without captured page errors. [Compact evidence](research-v59/compact-proof.json) records actual dimensions. These are desktop emulations; physical phones/tablets and manual assistive-technology certification remain open.

## Corrections and exclusions

Review corrected a desktop panel/footer overlap, empty guides on floors with no stocked collections, select replacement during keyboard changes, Safari native selects rendering below 44 px, Safari default Tab navigation skipping the Save button, short-landscape panel clipping and old entrance notifications covering a short-screen preview. Landscape controls now sit beside the scene; very short portrait views retain a scrollable panel. Internal Tab steps include both action buttons without trapping focus in the panel. Normal public lounges retain their existing next-stop guide, while bench-specific guides avoid duplicating it.

Preliminary incomplete/interrupted candidates and Safari protection-dialog pauses are excluded from the final evidence. Harness corrections scoped controls to the open dialog and checked actual material option values rather than tea-choice assumptions. The bench check selects the exact public bench through the center map instead of assuming the nearest fixture at the test spawn. The final Safari preflight window was retained through the complete selected run. No hidden-document override, accelerated animation clock or synthetic-click substitution was used for native passes.

## Cleanup and publication gate

Safari remote automation is visibly off after testing, other developer flags are preserved, a normal Start Page is left open and the owned driver is stopped. Temporary Firefox software, profiles and test-only crash/cache files are removed while all 14 pre-existing entries and original file bytes are preserved. Sanitized evidence remains here; raw test material is removed during final publication teardown, recorded in ignored `build/qa/v59-live-proof.json`.

Publication requires committed runtime bytes matching the frozen candidate apart from the release commit stamp, successful exact-head GitHub Pages jobs, matching uploaded artifact bytes and live material/shopping/reload/refund/exit checks. This committed record does not assert later deployment events before they occur.
