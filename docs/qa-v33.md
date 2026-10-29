# v33 release QA

Testing on 29 October 2026 uses isolated synthetic saves and the compiled `/Mallside/` artifact. Native browser validation and publication remain pending until recorded below.

## Regression and build

- **403/403 Node tests passed**, with two test files running concurrently to avoid memory pressure during the geometry/campaign checks. The final run took 58.4 seconds.
- Nine new regressions cover deterministic finite HDR environment pixels and orientation, bevel bounds/normals, camera composition, path-following route samples, color/data texture spaces and caching, palm geometry, shared texture lifetime, backward-compatible preferences and removed contact actors.
- Starter-clothing regressions now inspect physical shirt/sleeve/neck meshes instead of the replaced anatomical paint groups. Existing pose, retail fitting, save/recovery, economy, tenant, reachable-stop and campaign tests remain in the suite.
- Production build and public artifact validation passed. Source/reference/inventory validation is repeated after these release notes are complete.

## Visual review

Compiled Chromium screenshots were inspected for the outdoor court, close and raised camera modes, route markers, shop entry, collection-room body view and face close-up. The review caught and corrected player clipping in the closer shop view, empty exterior space at the shop cutaway, rough starter-shirt edges and neck transitions, floating eyebrow placement and shared texture disposal during actor replacement. Shader error capture remains enabled.

Touch-capable Chromium emulation measured 320×568, 390×844, 768×1024 and 844×390 with no document or dialog horizontal overflow and zero captured game/console errors. Native touch taps and a held touch moved the player; after release and Stop, position remained unchanged across the measured 300ms settling interval, raised view persisted after reload, and expanded gameplay measured exactly 390×844 at that viewport. The guide toggle is omitted when compact expanded play already hides the sidebar; incidental 3D captions are omitted from the 2D fallback's camera dialog.

## Browser matrix

**Firefox 159.0 / geckodriver 0.37.1 passed 28/28 checks in one final run**, with zero captured game exceptions, console errors, resource warnings or input retries. The final scenarios took 135.2 seconds. Native Firefox ran headless with pointer clicks and keyboard input. Measured CSS viewports were 500×759, 768×939 and 1400×915, without document/dialog horizontal overflow.

Coverage includes all ten shared activities; 3D entry/exit/reentry; route interruption, walking and stopping; fitting, carrying, buying and refunding; cinema reservations/refunds/use; demos and research-only shops; discovery trails and exact rewards; upper-floor routing and floor connectors; keyboard dialog details; fullscreen; search; and the new v33 lighting/camera/route/portrait/room checks. Two earlier mixed-workload attempts timed out without captured game errors; isolated v32 and v33 shop comparisons both passed. The final run used no competing browser render tests and a process-scoped idle-sleep assertion. A separate portrait-case attempt found an incorrect test selector for Stops; correcting it made all four isolated visual checks pass before the full repeat. No application error was excluded.

**Native Safari is pending.** Desktop control reported the Mac locked, and no Safari automation setting was enabled for this release. Publication is held until the Mac is unlocked and Safari validation completes. Safari's previously restored-off setting has not been changed.

Desktop emulation does not certify physical iOS/iPadOS/Android devices or manual screen-reader behavior.

## Temporary test cleanup

The disposable Firefox app, installer, geckodriver/archive, profile root, comparison copy, logs and 11 generated Firefox QA files were removed after the passing run. Four newly created crash/telemetry files were removed against a recorded baseline; all pre-existing Firefox paths were retained. The owned Firefox driver and comparison server were stopped. No Firefox installation was placed in Applications and no personal browser profile was used.

## Publication

Publish only after the source checks, regressions and both native browser suites pass. Record the deployed commit and matching bundle through the workflow/live release metadata; verify a changed public flow in an isolated context. Keep raw synthetic saves and QA screenshots in ignored local output, and remove temporary Firefox software/profiles after testing. Safari automation must be restored off.
