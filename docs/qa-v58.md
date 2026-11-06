# Mallside v58 · release QA

Reviewed 5 November 2026. This record covers a bounded update to in-person shopping feel; it does not claim that every shop, map or character detail is finished.

## Candidate and automated checks

Candidate `app-Q3X4PAG7.js` passes **737/737 local tests**, with no failures, cancellations, skips or todo cases. Nine new regressions cover exact-product/size stock checks without mutation, routes to each real display across distinct layouts, continuous associate movement, paused and reduced-motion equivalents, cancellation, an already-occupied player approach, shopper separation and progress, exact price-card identities and catalog/save compatibility. After the last arrival-message correction, 21 focused checks also pass. Source validation covers 223 browser modules; the generated artifact verifies all 2,072 public files.

Across all **190 distinct stocked layouts**, the 375-second crowd simulation retains a minimum 25 logical units between visible shoppers and completes at least four purchases per shopper, with one fitting room reserved for the player. This checks both separation and eventual progress. [Layout evidence](research-v58/crowd-layout-proof.json) records each result.

## Native and compact browsers

**Safari 26.6.2 and Firefox 159.0.1 each pass 17 selected scenarios / 18 checks from 105 available scenarios**, with zero captured game exceptions, unexpected console errors, resource warnings or input retries. The selection covers all three v58 cases, the v57 presentation/fitting cases, day/evening lighting, store entry and repeat exit, native walking, exact-size fitting/carrying, checkout and refunds, service bookings, nonwearable/pending options, map transitions, fullscreen and keyboard containment. Safari uses one retained window bounded to 18 cases. Firefox uses 17 fresh headless sessions; each disposable profile is independently confirmed absent. Real clocks, visibility and native input remain active. [Native evidence](research-v58/browser-proof.json) records scenario names, exact source/artifact/runner fingerprints and reviewed image hashes.

Six touch-capable desktop **Chromium 156.0.8078.80** contexts pass at exactly **320, 390 and 768 px**, in 3D and lighter graphics. They verify full product-image containment, no horizontal overflow, 44 px result controls, no older success toasts covering results, correct size retention, unchanged cash, modal keyboard containment and access to the size-check shortcut in expanded 3D play. All six owned contexts close without captured browser errors. [Compact evidence](research-v58/compact-proof.json) records actual dimensions. These are desktop emulations; physical phone/tablet and manual assistive-technology certification remain open roadmap work.

## Corrections found during review

The review corrected a clipped product photo caused by its grid container, older notifications obscuring the new result, a staff route aimed at the player’s occupied display approach, selected sizes resetting after product location, and a stale walking message after arrival. Associates now stop beside the player, face the display, return continuously when cancelled and provide stationary reduced-motion results. Fixed price stands, open-legged tables, shelf edges and counter details have been visually reviewed.

Early incomplete runs are excluded. They include concurrent browser-startup timeouts, a test that tried to click an exit after Escape had already closed the lighter shop, interrupted pre-correction candidates and an orphaned Firefox driver session. The corrected lighter-mode check verifies the actual closed-dialog state. The orphan session/profile was cleared before the final passing Firefox selection. No visibility, animation-clock or synthetic-click override was used to obtain native passes.

All 8,856 complete products, 1,598 shop identities, photographs, schema 6, map revision 10 and economy rules remain compatible. [Compatibility](research-v58/compatibility.json) records unchanged catalog hashes; [primary retailer research](research-v58/shopping-evidence.json) separates supported practices from original game adaptations.

## Cleanup and publication gate

Safari automation is visibly off, other developer flags are preserved, its original normal Start Page is retained and the owned driver is stopped. Temporary Firefox software, profiles and test-only crash/cache files are removed; all 14 pre-existing Firefox entries and original file bytes are preserved. Sanitized evidence stays in this documentation. Remaining raw test material is removed during final publication teardown, with details in ignored `build/qa/v58-live-proof.json`.

Publication requires committed runtime bytes matching the frozen candidate apart from the release commit stamp, successful exact-head GitHub Pages jobs, matching uploaded artifact bytes and live shopping/reload/refund/exit checks. This committed record does not assert those later events before they occur.
