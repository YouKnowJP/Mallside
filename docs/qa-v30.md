# v30 shared-afternoon QA

Tested 28 October 2026 against the compiled `/Mallside/` artifact. Save schema stays at 6; the new active visit and memory list are optional, local save fields.

## Regression coverage

All **375/375 tests** passed, including ten new companion regressions and the previous 365 checks for campaign progression, catalog/economy, geometry, character models, touch input, save recovery and compatibility.

The new cases cover all five locals, both original story choices, all ten activities and each of their three answer alternatives. Checks verify next-day unlocks, exact finishing time and XP, no purchase or direct cash charge, the existing bond/level-up rules, one completion per day across friends and malls, invalid and stale answers, cancelling, closing-time failures, partial progress over sleep/travel/reload, old-save defaults, malformed optional data, original chapter-history preservation, bounded memory retention and escaped UI text. Invalid operations are checked for unchanged state.

A first normalization run found a null active-visit dereference; it was fixed before the suite passed. Optional missing fields now normalize safely for existing saves.

## Compiled-game checks

Fresh Chromium contexts used synthetic QA saves, leaving player browser profiles untouched.

- All five friends: route from Journal to the local, start an activity, choose by touch, reload after one answer, route back and resume, choose by keyboard, finish, inspect persisted time/XP/money/memory, then confirm the daily invitation cannot repeat. Each passed at 320×568 with no page exceptions or horizontal overflow.
- The choices preserve focus on the current question. Completion and leave controls measured at least 44px high. The background main content and top bar remain inert during dialogs.
- 320×360 with larger text and 844×390 landscape: question one, question two and the final review stay below the sticky header and inside the visible dialog after focus. A first short-screen run found focus below the visible area; explicit dialog scrolling fixes it. Viewport screenshots were inspected after the fix.
- A saved, partially answered Orange activity loaded at South Coast Plaza: the Journal returned to Orange, rebuilt the correct mall renderer and resumed the retained answer. Returning to the original mall is enforced in the engine too.
- Leaving an activity clears its partial choices without granting XP or writing a memory. Original-mall routing, cancellation and no-overflow checks passed at 390×844.
- Tab and Shift-Tab wrap between dialog controls; Escape closes and restores focus to the mall canvas, with background inertness removed.
- A 1280×800 3D scene passes activity entry, choices, completion and rereading the identical saved memory from the Journal, with unchanged cash and no page exceptions. It also retains dialog focus, keyboard containment and clean close behavior. The five-friend completion matrix above used the lighter 2D map.

The new shared scenes are choice-based conversations, not new animated group movement or a simulation of actual room changes. Existing room arrangements, catalog photographs, receipts and original story rewards remain intact.

## Release checks and limits

Source/notice checks, the complete regression suite, the production build and public-artifact validation are release gates. The Pages workflow repeats them before deploying; publication is followed by checking public release metadata and the changed live flow.

These checks cover Chromium, including touch/viewport emulation; they are not physical mobile-device or manual screen-reader certification. The recorded native Safari/Firefox gameplay and recovery matrices remain in the earlier QA documents. Safari automation was not enabled and Firefox was not installed for v30. Temporary screenshots and synthetic fixtures remain under ignored QA directories and are excluded from the playable artifact.
