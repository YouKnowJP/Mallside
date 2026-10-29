# v32 release QA

Tested 29 October 2026 against the compiled `/Mallside/` game using isolated synthetic saves.

## Automated checks

- Full Node regression suite: **394 tests**. Eight new regressions cover all discovery routes, rewards, atomic failures, save migration/validation, map destinations, shop guidance, branch refunds and nonwearable routing.
- Every one of the **69 discovery stops on all 23 public floors** has a physical collider and a reachable approach through the campus graph. Every floor retains a resting spot. Existing tenant, counter, fitting-room, connector and campaign checks remain in the full suite.
- Source/references/notices/inventory validation, optimized production build and public artifact validation are required before the main-branch Pages deployment.

## Compiled Chromium checks

Desktop Chromium used native pointer and keyboard actions in disposable contexts. Touch-capable Chromium emulation checked 320×568, 390×844, 768×1024 and 844×390. The tested flows recorded **zero JavaScript exceptions or console errors**.

- Walk from the map to each discovery, solve the mosaic with Enter, choose a story and a garden detail, check the exact 40 XP total and inspect all three saved notes after reload.
- Tap to solve and save the mosaic on a 320px viewport; verify the live guide changes to 1/3. No document or dialog horizontal overflow at the four measured compact sizes.
- Use a saved bag outside a shop, walk into Ross and automatically reach checkout, pay exactly once, then return the purchase through the physical returns desk. The full original wallet is restored and the unpaid bag is empty.
- Enter AMC, reserve/refund one ticket, reserve/use another and exit through its explicit footer. Verify both booking states and the exact $18 net game charge.
- Enter a child-size/nonwearable collection, open its demos and persist a demonstration. Enter a research-only shop and verify its explanation, accurate directory label and usable exit.
- Route from Island Fashion’s upper floor to a reading stop on the rooftop; save a note on floor 3. Activate a map floor connector with Enter and reach the floor chooser.
- Complete a garden discovery in the illustrated 2D fallback. Expanded gameplay measures exactly 1440×1000 in a 1440×1000 viewport.
- Tab/Shift-Tab around the map dialog, open the accuracy section with Enter and reach its source link. Closed details are excluded from the explicit focus loop.
- Inspect screenshots of the 3D commons, floor diagram, mosaic/notebook, compact layouts, upper court and 2D fallback.

The first full regression run caught a compact-floor seating regression. Reserving seating and enlarging compact courts fixed it; all three activities and at least one resting spot are now checked on each floor. Browser testing also caught stale discovery counts and inaccessible details in the dialog focus loop; both were fixed and repeated successfully.

## Native Safari and Firefox follow-up

Native validation on 29 October 2026 passed the seven new v32 scenarios and the existing shared-activity/shopping suite. Both browsers covered **25 distinct checks with zero captured game exceptions, console errors or resource warnings**. Safari completed all 25 in one final run. Firefox completed the 18-check core run and eight-check v32 run, with their final error-capture check repeated in both runs.

| Browser | Native mode | Passed | Measured CSS viewports |
| --- | --- | --- | --- |
| Safari 26.6.2 | Visible SafariDriver window; native keyboard activation | 25/25 | 390×729, 768×729, 1400×729 |
| Firefox 159.0 / geckodriver 0.37.1 | Headless native Firefox; pointer clicks and keyboard | 25 distinct checks across 18/18 + 8/8 runs | 500×759, 768×939, 1400×915 |

The new cases cover the three-stop discovery trail and exact 40 XP outcome, keyboard mosaic controls, saved choices/reload/repeat limits, saved-bag routing into checkout and a full purchase refund, service booking/refund/cinema use/exit, nonwearable demos and research-only shop guidance, cross-floor rooftop discoveries and floor connectors, map details keyboard navigation, and the illustrated fallback/compact activity layouts. The existing suite also repeats all ten shared activities, 3D shop entry/exit/reentry, walking and stopping, fitting/carrying/paying, interior-to-map routing, fullscreen, shop search, dialog containment and game-menu access.

Safari's early walking attempts stopped when its automated window became hidden or its protection dialog paused the session. These attempts were not counted as passes. Re-selecting the existing window through the standard WebDriver switch-window command restored visibility and movement. The runner now restores the actual test window, requires visibility before advancing a wait condition, excludes hidden time from the gameplay timeout and bounds the overall wait. It can also reuse a resumed Safari session. No game visibility override or error exclusion was introduced. The final run recorded visible windows throughout setup and all checks passed. No additional gameplay code fix was needed.

Safari still uses native Enter activation because of the earlier driver pointer-delivery limitation documented in [v31 QA](qa-v31.md). Firefox uses native pointer activation. These desktop checks and Chromium touch emulation do not certify physical mobile devices or manual screen-reader behavior.

After testing, all disposable sessions, drivers and the preview server were stopped. The temporary Firefox app, installer, geckodriver/archive, disposable profile root and 11 Firefox QA artifacts were removed. Four test-created Firefox crash/telemetry files were removed against a recorded baseline; pre-existing directories and data were preserved. Safari's **Allow remote automation** checkbox was visibly verified **off (0)**. Its original local-file restrictions were also verified restored.

## Publication

Publish only after the local checks pass. The Pages workflow repeats the source, regression, build and artifact checks. After deployment, verify the live version, commit and hashed bundle, then exercise a changed public flow in an isolated browser context. Stop the owned preview server and close disposable contexts afterward.
