# v34 release QA

Validation uses isolated synthetic saves and the compiled `/Mallside/` build on 29 October 2026. Both browsers completed all 31 distinct gameplay checks on the compiled v34 JavaScript bundle `app-IBUYWSXV.js`, including targeted repeats described below. The final responsive footer CSS is separately verified in Chromium, native Firefox and native Safari.

## Regression and layout coverage

The final full regression run passed **411/411 tests in 86.9 seconds**, after the map/controller and shop-control fixes. Eight new regressions cover all 46 waystation approaches, map labels, compatible/bounded saved shops, useful research-only options, physical associate/information routes, frame-independent gait easing, finite/static poses and bounded ambient visitors.

Every floor has one water and one notice fixture, a reachable resting place and all three discovery activities. Existing tenant, fitting, counter, service, floor-connection, save/recovery, economy, campaign and merchandise checks remain in the suite. Research-only stock is not fabricated.

## Compiled Chromium review

- Enter a research-only shop, inspect its original information gallery, save it, physically reach the associate, return to the collection guide, open stocked-shop search, filter to saved shops and retain the bookmark after reload.
- Activate the direct Saved shops shortcut with touch and Enter at 320px; verify one saved result, the selected filter, retained keyboard focus and no horizontal overflow.
- Measure collection dialogs at 320×568, 390×844, 768×1024, 844×390 and 1440×1000: no document or dialog horizontal overflow and zero captured game/console errors.
- Visit the water fixture on Brea's upper floor, drink once, reject a repeat within the cooldown, walk to the noticeboard and save the welcome invitation. Wallet unchanged; the second attempt adds no water record or recovery. The first drink raised energy from 40 to 47.82 after its time cost.
- Repeat water access in the illustrated fallback using touch-capable 320×568 emulation, without horizontal overflow or game exceptions.
- Walk with full motion: gait weight eases in, then returns to zero after release while the stopped player position remains identical. Inspect the court, water stop, research gallery and collection-guide screenshots.

The browser review caught a real controller defect: map selections still used an older duplicated fixture classifier and routed new amenities to a directory screen. The map now uses the same `fixtureStop` resolver as physical fixture clicks, and the water/notice flow passed after the fix. Two early Firefox attempts could not drive the native availability dropdown with the attempted keyboard sequence. A directly visible Saved shops shortcut was added for clearer player access and native pointer/Enter validation; the dropdown remains covered by Chromium selection checks. The native case also accepts the existing same-shop behavior of opening its guide immediately. The full native follow-up caught the collection guide missing the shared fixed exit footer. Its persistent exit strip was restored, retaining the in-content exit as well. Review also removed misleading checkout/returns/department controls from research-only shops and supplied actual information/associate routes instead.

## Native browsers

Safari 26.6.2 completed **31 distinct checks** on `app-IBUYWSXV.js`: 29 successful scenarios from the full attempt and a **4/4** focused v34 repeat, with two duplicate scenarios. The full attempt verified the restored exit footer and saved-shop workflow. Its final animation assertion failed with a key held across separate WebDriver commands and polling; that attempt is not counted as a pass. The runner now uses one bounded native key-down/pause/key-up sequence and records actual key events. The repeat recorded one key-down and one key-up, a peak gait weight of 0.994, and identical stopped coordinates before/after settling. Both phases captured zero game/console errors. Compact layout/overflow cases also passed during the full attempt. Safari automation was then visibly verified off (0), with local-file, cross-origin and Apple Events settings unchanged at 0.

Firefox 159.0 / geckodriver 0.37.1 completed **31 distinct checks**: 29 successful scenarios from the full attempt and a **2/2** fresh-profile repeat of the final motion/error checks. The long run timed out during navigation when starting its last full-motion scenario, without a captured game exception; it is not represented as a passing full run. The isolated repeat recorded one key-down and one key-up, a peak gait weight of 0.997 and identical stopped coordinates. Both phases recorded zero game/console errors.

The full attempt in each browser passed the previously failing research-shop exit scenario after the shared exit strip was restored. Stocked-shop, fitting, receipt/refund, service booking/use, map/floor, story and save/reload cases remained in the coverage. Each browser used disposable localhost saves; Safari buttons use native Enter activation, Firefox uses native element clicks, and walking uses bounded native key sequences. The reusable runner now has 31 distinct checks, including upper-floor amenities/cooldown/invitation persistence, the research gallery/associate/saved-shop flow, and full-motion visitors/gait settling. `--only=places` isolates the three new scenarios plus strict error capture.

## Responsive exit follow-up

The compact Chromium review found the restored exit strip still scrolled out of view in long dialogs. The shared strip is now sticky at the bottom of the scrolling modal, with a 44px minimum button height. No game JavaScript changed during this CSS follow-up.

- In the actual compiled game, touch-capable Chromium checked 320×568, 390×844, 768×1024 and 844×390. The footer was visible, hit-testable and at least 44px high at every size, with no horizontal document/dialog overflow. Tapping it closed the guide successfully.
- Native Firefox repeated the collection/saved-shop/exit case and strict error capture: **2/2 passed** on the final CSS. Its compact window measured 500×759, with the exit visible and hit-testable, and returned to the 3D mall successfully.
- Native Safari 26.6.2 loaded a temporary responsive fixture containing the actual collection-guide markup and production stylesheets. At 320×568, 390×844, 768×1024 and 844×390, all four frames reported the exit visible and hit-testable before and after scrolling, without overflow. Results were read through Safari’s native accessibility interface. This CSS-only probe used a normal Safari tab; remote automation remained off. The tab and temporary fixture were removed afterward.

The final stylesheet is `life-styles-3090f8e9af50.css`. The responsive fixture tests layout; the native gameplay runs separately verify the actual exit handler.

Desktop browser input and mobile emulation do not certify physical iOS/iPadOS/Android devices or manual screen-reader behavior. Retail garment drape and remaining destination-specific modelling remain on the roadmap.

## Test cleanup

The temporary Firefox app, installer, geckodriver/archive, profile root and logs were removed. Fourteen Firefox QA artifacts and the four known new crash/telemetry metadata files were removed against the recorded baseline. All original Firefox paths were preserved. Safari’s automation checkbox was visibly verified off (0), its driver was stopped, and its temporary layout tab was closed.

## Publication and cleanup

Publish through the main-branch checks and Pages workflow only after both native suites pass. Verify the live version, commit and exact tested bundle, then exercise changed public flows in a disposable context. Remove the temporary Firefox app, installer, driver, profiles and new test metadata against a baseline; preserve unrelated browser data. Close disposable sessions, stop owned drivers/preview processes and visibly verify Safari remote automation off.
