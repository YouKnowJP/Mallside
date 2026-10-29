# v35 release QA

Validation uses isolated synthetic saves and the compiled `/Mallside/` build on 29 October 2026. Publication is gated on final regression and native-browser checks.

## Coverage

Nine new regressions cover original dining versus catalog integrity, atomic location/menu/payment checks, bounded save normalization, all 23 sculpture approaches and existing public stops, daily/first-visit sketch limits, visible furniture collision, old receipts, cached hand accuracy, gesture easing and stable nearby visitors. Existing guide assertions now distinguish original game dining from researched collections.

The final full regression run passed **420/420 tests in 242.4 seconds**, including the invisible-stock-fixture correction. Source validation and the production artifact check passed for 100 browser modules and 1,977 public files. Save keys and schema 6 remain unchanged.

## Compiled review

The final compiled bundle is `app-IOQS2QBQ.js`. The game was reviewed in isolated Chromium contexts. Original dining opens its review screen, charges only at arrival and persists in lightweight mode. At 320×568, 390×844, 768×1024 and 844×390, the actual dining menu had no document/dialog horizontal overflow and its pinned exit stayed visible, hit-testable and at least 44px high. Touch review, dining and exit completed at all four sizes. The sculpture dialog also passed overflow, 44px target and keyboard-focus containment checks at the same four sizes, then saved a sketch successfully. Indoor sculpture and outdoor ground-floor scenes were visually inspected, with zero captured game exceptions. Inspection led to quieter table labels and shared timber surface detail.

Final source review found that shops with no product stock still inherited invisible auxiliary stock-fixture obstacles. These are removed; visible guide/dining tables now retain their real collision footprints. Both changes receive regression and native follow-up coverage.

## Native browser matrix

The reusable runner has 35 distinct checks: the previous 31 plus reviewed/cancelled/seated dining, lightweight dining, sculpture/sketchbook persistence and legacy research-shop returns. Fresh sessions separate core, commons, visual, places and district groups. Each group includes strict game/console error capture and records the tested release metadata.

Firefox **159.0 / geckodriver 0.37.1** completed all **35 distinct checks** on final bundle `app-IOQS2QBQ.js` in five fresh sessions: district 5/5, core 18/18, commons 8/8, visual 4/4 and places 4/4. The strict error check repeats in each group. The final run recorded zero game/console errors, zero resource warnings and zero input retries. The key-release case recorded a peak gait weight of 0.999 and identical stopped coordinates after settling.

Safari **26.6.2** completed all **35 distinct checks** on `app-IOQS2QBQ.js` in the same five fresh-session groups: 5/5, 18/18, 8/8, 4/4 and 4/4. It recorded zero game/console errors, zero resource warnings and zero input retries. The final walking case recorded one key-down and key-up, peak gait weight 0.995 and identical stopped coordinates before/after settling. The native research-shop exit remained visible and hit-testable at a 390×735 viewport; Firefox’s corresponding native case measured 500×759. New dining, cancellation, lightweight mode, sculpture persistence and legacy returns passed in both browsers.

The final stylesheet is `life-styles-e5561eb736ff.css`; base styles remain `styles-6d92a5f8e9bb.css`.

## Limits and cleanup

Desktop browser automation and touch emulation do not certify physical iOS/iPadOS/Android hardware or full manual screen-reader behavior. The catalog remains 1,015 stocked identities, 133 service identities and 450 pending catalogs; 91 pending food locations gain original game dining rather than invented real merchandise.

The temporary Firefox app, installer, geckodriver/archive, profiles and logs were removed, along with 14 generated Firefox QA artifacts and the four known newly created crash/telemetry files. All nine pre-existing Firefox metadata paths were verified intact, with no added paths remaining. Only the owned driver process was stopped; unrelated browser data was preserved.

Safari’s remote-automation checkbox was visibly verified off (0) after all checks. Its local-file, cross-origin and Apple Events options remained at 0, its settings window was closed, and its owned driver was stopped. Publish only through the canonical main-branch Pages workflow, then verify the public release commit and exact tested bundle.
