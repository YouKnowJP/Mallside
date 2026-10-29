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

This release's new browser checks use Chromium and touch emulation. The native Safari/Firefox matrix documented in [v31 QA](qa-v31.md) remains historical; it was not rerun for v32. Physical mobile devices and manual screen-reader certification remain open. Safari automation was not enabled, and no temporary Firefox installation was created.

## Publication

Publish only after the local checks pass. The Pages workflow repeats the source, regression, build and artifact checks. After deployment, verify the live version, commit and hashed bundle, then exercise a changed public flow in an isolated browser context. Stop the owned preview server and close disposable contexts afterward.
