# v37 release QA

Validation uses isolated synthetic saves and the compiled `/Mallside/` artifact on 29 October 2026. Publication is gated on regression and native Safari/Firefox passes.

## Source and regression review

Fourteen models have factual official-page records with exact USD offers, source color, sizes and matching product photographs. Images were visually reviewed together; all have checksum-bound palettes and fabric samples. Old analysis snapshots remain intact. The collection adds eleven stocked identities and twelve collection desks; 439 catalogs remain pending.

Eleven new regressions cover provenance, branch associations, all desk/bench/stock/exit routes, old shortlist compatibility, every new model's fitting/purchase/reload/refund, explicit source size formats, bounded free comparison, continuous item carrying, staff greeting limits and steady carried poses. Existing coverage tests retain exact updated counts: 3,017 physical listings and 766 unique clothing/bag photographs.

The first full run found missing photograph analysis and a wrist reset occurring after hand IK. Both were corrected before the final browser matrix. Focused checks then passed 35/35. The final full regression run passed **441/441 tests in 101.5 seconds**. Source checks passed for 110 browser modules. The public artifact check verified 1,991 files, including all photographs and notices, with no development tree or source maps.

The tested compiled bundle is `app-YHYJNGVF.js`. Touch-capable Chromium verified 320×568, 390×844, 768×1024 and 844×390: no document/dialog horizontal overflow, correct comparison review focus, pinned hit-testable 44px Exit and checkout buttons, successful touch exit and completed purchases at every size. No game exceptions were captured.

## Browser validation

The native runner adds three v37 scenarios covering the physical desk, saved-plan compatibility, staff/item telemetry and bench; all three brands' exact-size fitting, purchase, reload and refund; and compact comparison, keyboard activation, cancellation and pinned exit. The complete matrix has 41 distinct checks, using fresh native sessions. The lightweight purchase scenario exposed an existing overlap between independently pinned Exit and checkout bars. They now share one pinned footer, so both controls remain hit-testable. New shop header controls also wrap at 320px instead of overflowing. The runner uses the actual lightweight shop checkout control. Safari also stalled after repeated reloads; its remaining scenarios were run individually in fresh sessions. Actual window visibility and standard window restoration apply to both native browsers. An upper-floor command timed out after several Firefox scene reloads with no captured game error; the isolated case passed in 7.1 seconds in a fresh profile. Longer multi-scene Firefox batches repeated a native command timeout with no captured game exception. For the final Firefox matrix, each public-activity scenario uses its own disposable profile; no browser visibility or game-pause state is falsified.

Firefox **159.0 / geckodriver 0.37.1** passed all **41 distinct checks** on `app-YHYJNGVF.js`, across 13 fresh sessions (53 results including repeated strict error checks). It recorded zero captured game/console errors, zero resource warnings and zero input retries. Safari **26.6.2** passed the same **41 distinct checks**. Its final validation uses the collection session plus 37 independently isolated scenarios (78 results including strict error checks). It recorded zero captured game/console errors, resource warnings and input retries. Both browsers tested the identical compiled JavaScript and styles.

The tested styles are `life-styles-330e2a6c68a1.css` and `styles-6d92a5f8e9bb.css`.

## Limits and cleanup

Desktop native checks and touch emulation do not certify physical mobile devices or full manual screen-reader behavior. Official references establish provenance, not live branch quantities or new image permissions. The existing third-party rights notices remain in the artifact.

The temporary Firefox app, installer, archive, driver, profiles and logs were removed, together with 22 generated Firefox QA artifacts and four newly created crash/telemetry files. The cleanup comparison preserved all nine pre-existing Firefox metadata paths and found no added paths remaining. Only the owned Firefox driver process was stopped.

Safari remote automation was visibly verified off (0). Disable-local-file, disable-cross-origin and Apple-Events JavaScript settings remained at their original 0 values, and the settings window was closed. The owned Safari driver, local preview server and temporary display-awake assertion were stopped. Publication is gated by the main-branch CI checks, followed by live release and shopping-flow verification.
