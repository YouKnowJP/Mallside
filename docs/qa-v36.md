# v36 release QA

Validation uses isolated synthetic saves and the compiled `/Mallside/` build on 29 October 2026. Publication requires successful regression and native Safari/Firefox checks.

## Regression scope

Ten new tests cover the 359 planning lounges and real local product provenance, non-spending saved plans, atomic invalid edits, the 16-plan cap, compatible import normalization, tax-inclusive totals and explicit save/route controls, deterministic search, crowd spacing on all 23 floors, bounded avoidance, smooth sitting/contact and head-turn easing. Existing pending-fitting assertions now check the functional planning route.

The full regression suite passed **430/430 tests in 68.5 seconds**. Source checks passed for 104 browser modules, and the production artifact check verified 1,977 files with required notices and no source maps or development tree.

## Compiled review

The final compiled bundle is `app-5R2KLAMC.js`. The textile, abstract light-study and design-workbench room variants were inspected in the compiled game. Saving and reopening a three-item shortlist preserved money and purchases. Touch-capable Chromium checked 320×568, 390×844, 768×1024 and 844×390: no horizontal document/dialog overflow; budget focus was retained, the third pick focused Save, saving focused a route, and the pinned exit remained visible and hit-testable. Touch exit worked at every size. No game exceptions were captured.

Review caught scroll/focus resetting during shortlist edits and knees intersecting the new bench fronts. Focus and scroll now follow the action being updated; a shared forward seat offset and correct seat heights clear the front edge. Physical rest was inspected, recovered stamina and preserved cash. The compact-court crowd grouping seen in v35 was revisited at the same location and now uses separate walkable positions.

## Native matrix

The runner adds three v36 scenarios: budget/search/shortlist persistence and a route to the actual product shop; room variants, lightweight draft cancellation and compact exit; spaced full-motion crowds and physical bench rest. The full matrix now has 38 distinct checks. Fresh sessions separate lounge, district, core, commons, visual and places groups, each with strict error capture and release metadata.

Firefox **159.0 / geckodriver 0.37.1** and Safari **26.6.2** each passed all **38 distinct checks** on `app-5R2KLAMC.js`. The six fresh-session groups passed 4/4 (lounge), 5/5 (district), 18/18 (core), 8/8 (commons), 4/4 (visual) and 4/4 (places). The strict error check repeats in each group. Both browsers recorded zero captured game/console errors, zero resource warnings and zero input retries.

The new budget, focus, persistence, actual-shop route, themed interiors, lightweight cancellation and physical rest scenarios passed in both browsers. The native planner’s pinned exit was visible and hit-testable without horizontal overflow at 390×732 in Safari and 500×759 in Firefox. Full-motion walking settled without coordinate drift after native key release.

The tested styles are `life-styles-6d64768cbc72.css` and `styles-6d92a5f8e9bb.css`.

## Limits

Desktop native browser checks and touch emulation do not certify physical mobile hardware or full manual screen-reader behavior. Catalog research remains separate from original planning activities. The real catalog remains 1,015 stocked identities, 133 service identities and 450 pending catalogs.

The temporary Firefox app, installers, geckodriver, profiles and logs were removed, along with 18 generated Firefox QA artifacts and four newly created crash/telemetry files. The cleanup comparison verified all nine pre-existing metadata paths unchanged, with no added paths remaining. Only the owned Firefox driver process was stopped.

Safari remote automation was visibly verified off (0), with “Disable local file restrictions”, “Disable cross-origin restrictions” and “Allow JavaScript from Apple Events” preserved at their original 0 settings. Its settings window was closed. The owned Safari driver and preview server were stopped. Publication uses the canonical main-branch checks and Pages workflow, followed by live release and gameplay verification.
