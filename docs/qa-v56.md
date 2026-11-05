# v56 release QA

The final source passes **718/718 local tests**, with no failures, cancellations, skips or todo cases. All 12 new regressions pass. Source checks cover 218 browser modules; the generated game contains 2,072 files with bundle `app-VWYWZOWP.js`.

## Native browser results

**Safari 26.6.2 and Firefox 159.0.1 each pass 18 selected scenarios / 19 checks**, with no captured game exceptions, unexpected console errors, resource warnings or input retries. Safari uses one retained window bounded to 18 cases; Firefox uses 18 fresh headless profiles, all independently verified removed. Every retained result matches the final source, public artifact, runner fingerprint and time budgets. Real clocks, visibility checks and native input remain active.

This is an **18-scenario selection from 99 available scenarios**, not a full native matrix rerun. It covers all three new cases; affected optical fitting, maps, planning, material studies, collection-room walking and stable pointer controls; v55 regressions; and core shop entry/re-entry/interruption, walking, fitting, carrying, payment, fullscreen, exits and compact keyboard containment. [Browser proof](research-v56/browser-proof.json) records each case and its isolated session digest.

The new cases verify both JINS source widths and dimensions, free comparison/notebook/studies, both native frame fittings, two purchases, reload and exact refunds, direct exits, free zoom/pan/Find me, keyboard destination reveal, all mapped amenities, an actual mapped rest route, and compact/lighter controls.

## Corrections and regressions

Twelve new tests cover selected merchant offers, exact variants and photograph hashes; complete compatibility of all 8,854 earlier products, palettes and shop identities; fitting, tagged purchase, reload, wearing and refunds; retained studies and free source facts; clear optical geometry and material-specific proportions; stationary gesture joins and actual per-frame hand targets; studio routes and owned resource disposal; all 23 floor maps' real routes; bounded views and keyboard reveal; and collision-aware labels against shops, every badge, other labels and the player callout.

Review found the current-position marker intercepting map clicks, crowded labels and a misleading notebook footer. The marker now lets clicks through, annotation placement is tested across all 23 floors, and the footer names frame dimensions. The map supports up to 16× zoom; pointer clicks retain their target while keyboard focus reveals destinations. Repeated identical status text is not announced again.

A retained Safari run exposed a collection-room walk stalling while the room was out of view after choosing a preset below the fold. Preset destinations now reveal and focus the room. Both browsers pass that regression plus native furniture/floor clicks, route cancellation and the stable tablet pointer pad. Geometry teardown disposes tracked/shared geometry once.

Earlier incomplete or superseded candidate runs are excluded. Firefox WebDriver's SVG element-click limitation is handled with actual pointer actions at the visible badge. The optical test correctly follows the existing selection-to-collection flow after adding a nonphysical selection. These harness corrections are distinguished from game fixes; no synthetic DOM click or visibility/clock override is used for the retained interactions.

## Compact layouts

Six retained desktop Chromium touch-capable contexts pass at **320, 390 and 768 px**, each in 3D and lighter graphics. Checks cover exact source widths/dimensions, free notebooks and map views, direct exits, all existing mapped venues, zoom/pan, keyboard reveal, unchanged free-state values, no horizontal overflow, at least **44 px** controls and badges at least **59 px** across at maximum zoom. All owned contexts close without browser errors or failed local requests. A separate 768 px visual probe resets the map to a contextual zoom and passes the same checks. [Compact proof](research-v56/compact-proof.json) records the scope. Physical mobile devices and broader assistive-technology verification remain on the roadmap.

## Cleanup and publication gate

Cleanup and exact-head publication evidence are retained in ignored `build/qa/v56-live-proof.json`. Publication requires both native passes, committed bytes matching the tested artifact except its release commit stamp, successful GitHub check/publish jobs and live byte/gameplay verification. This committed QA file does not assert deployment before it happens. Temporary browser files and automation are restored as part of the release teardown.
