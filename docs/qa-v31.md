# v31 shopping, navigation and native-browser QA

Tested 28 October 2026 against compiled `/Mallside/` builds. Save schema 6 and the original primary/backup keys are retained.

## Regression and artifact checks

All **386/386 Node tests** passed. Eleven new cases cover refresh-rate-independent acceleration, diagonal speed, immediate release, bounded delayed frames, camera damping, deferred/coalesced canvas resize and teardown, guarded shader compatibility, pending route cancellation, real shop-exit lifecycle, portal distance isolation, filtered store guidance and interactive shop/court map links on every floor of all ten malls. The existing input mock now includes the shared route-cancellation method; its pointer-cancellation assertions remain intact.

The earlier campaign, catalog, economy, garment, room, geometry, touch, recovery and compatibility checks remain in the suite. Source/notice/inventory checks, production build and strict artifact validation are release gates. The playable artifact contains 1,977 files, one minified application bundle and no development tree or source maps.

## Native Safari and Firefox

The repeatable [gameplay runner](../scripts/gameplay-browser-qa.mjs) creates disposable localhost WebDriver sessions and synthetic saves. Firefox uses native pointer clicks and keyboard input. Safari’s final suite uses native Enter activation for buttons, plus native movement/Tab/Escape input; its driver intermittently dropped mouse events before they reached the document. Earlier native pointer diagnostics reproduced and verified the scrolling fix, and Chromium touch checks cover pointer-based shopping controls. Shared activities use the lighter 2D map; shop entry, movement, fitting, checkout, map routing and fullscreen checks use actual WebGL scenes.

Both final runs passed **18/18 checks with zero captured game or console errors** after the fixes. No shader or resize error was excluded from capture.

| Browser | Version / mode | Results | Measured CSS viewports |
| --- | --- | --- | --- |
| Safari | 26.6.2, visible native browser / keyboard activation | 18/18, 0 errors | 390×729, 768×729, 1400×729 |
| Firefox | 159.0 with geckodriver 0.37.1, native headless | 18/18, 0 errors | 500×759, 768×939, 1400×915 |

Safari’s window was constrained to the available display. Firefox’s desktop minimum prevented a 390px width. Neither final run recorded resource warnings. The checks cover:

- Both activities for Maya, Eli, Noor, Jules and Sam: original-choice continuation, saved first answer, keyboard second answer, exact time/XP/money outcome, unchanged completed chapters and a closed daily reward limit. Maya also reloads and resumes a partial activity.
- Shop entry, interrupting an interior route, exit without drifting and repeat entry.
- Keyboard movement and stopping after release.
- Browsing, choosing a size, fitting, carrying a selection, walking to checkout, paying and persisting the receipt with the unpaid bag emptied.
- Selecting a court on the interactive map from inside a shop, with the interior left before the mall route begins.
- Viewport-filling gameplay, a usable shop exit while expanded and returning from fullscreen.
- Resized phone/tablet/desktop layouts, no horizontal overflow, search/no-results feedback and dialog Tab/Shift-Tab/Escape containment.
- Menu access to major pages, settings and camera controls, with working Journal navigation.
- No captured JavaScript exceptions or unexpected console errors.

An initial Safari run under concurrent regression load timed out during setup. A later native-click diagnosis found a test window extending below the physical display: the browser could report a DOM element in view while its click point was off screen. The runner now constrains Safari windows to `screen.availWidth/availHeight` and awaits persisted completion. The isolated Noor checks passed after that harness correction. A later Sam test exposed an actual navigation race: animated document scrolling could continue after the Journal opened and move the button between hit-testing and activation. Reading the viewport coordinates, disabling animated document scrolling and repeating the same native pointer action confirmed the cause. View changes now scroll immediately and the document uses automatic rather than animated programmatic scrolling. The SVG court test uses native keyboard activation because Firefox WebDriver's element-click command rejected scrolling an SVG link into view; mouse/touch map alternatives remain available in the game.

Safari also exposed ResizeObserver loop notifications during scene resizing. Canvas backing-store work now coalesces into the next animation frame, with pending work cancelled on destruction; the notifications are fixed rather than excluded from error capture. Two new regressions cover coalescing and cleanup.

Optional Google-font CSS was also removed from the blocking local stylesheet. It now loads after the interface, with system-font fallbacks available immediately. Native setup waits for the game’s controls and records delivered input. A stuck Safari pairing was cleared before the final clean run; setup/activation failures were not counted as passes.

Safari's WebGL-to-Metal linker also rejected a constant ambient-light uniform passed through a helper. The compatibility module inlines the identity call after checking the exact vendored helper semantics; lighting values and other material calculations stay the same. This follows the [r180 helper](https://raw.githubusercontent.com/mrdoob/three.js/r180/src/renderers/shaders/ShaderChunk/lights_pars_begin.glsl.js) and its [fragment call](https://raw.githubusercontent.com/mrdoob/three.js/r180/src/renderers/shaders/ShaderChunk/lights_fragment_begin.glsl.js). A regression checks the actual vendored chunks, repeat application and refusal to rewrite changed equations. Shader errors are still fatal in browser QA.

## Responsive and interface checks

Chromium touch-capable contexts checked 320×568, 390×844, 844×390 and 1440×1000 layouts, including viewport-expanded play. Scene and movement controls remain present without horizontal overflow. The final compact layouts completed search, shop entry in 2D and explicit shop exit. Fullscreen shells measured exactly the viewport bounds; the native/browser-expanded scene retains the header, visible exit and movement controls.

Testing caught two inherited layout defects: an old landscape grid could collapse the new canvas, and a drawer constrained to the short scene could hide its search results. The play shell now resets the old grid, and the drawer uses a separate viewport-sized overlay with a nonshrinking header and scrollable body. Screenshots were inspected for the larger 3D shop, compact fullscreen scenes, search results and short landscape views.

The new scene includes instanced overhead gallery lighting, hanging planting and actual current-floor directory textures. Store controls moved into the guide instead of covering the scene. These changes do not claim exact mall geometry, complete inventory in research locations, physical mobile-device testing or manual screen-reader certification.

## Publication and cleanup

The Pages workflow repeats source checks, all regressions, build and artifact validation before publishing. Verify `release.json` against the published commit and test the changed live flow.

Both disposable sessions, drivers and the local server were stopped. The temporary Firefox app, disk image, driver/archive, logs and five generated Firefox QA artifacts were removed. All eight recorded disposable profile paths were absent; ten test-created crash/telemetry metadata entries were removed while preserving the pre-existing empty Profiles directory. Safari’s **Allow remote automation** checkbox was visibly verified **off (0)** after testing. No personal browser profile or unrelated working file was cleared.
