# v29 mobile and accessibility QA

Tested 28 October 2026 against the compiled `/Mallside/` game. This release improves touch, keyboard and responsive access while preserving save schema 6 and the existing local backup layer.

## Input and regression checks

Nine new Node regressions cover short steps versus held walking; cancellation, lost capture and leaving a button; secondary-pointer isolation; Enter/Space repeats; assistive clicks; focus/visibility/disposal cleanup; blocked input; modified/composing keyboard events; and canvas steering dead zones/secondary releases.

The browser checks used a fresh Chromium context with `hasTouch` and mobile emulation. Actual browser touch events exercised both 3D and 2D modes. Each mode passed seven flow checks: one-step taps, hold/release, native touch cancellation, canvas-only keyboard movement and focus loss, keyboard direction buttons, drawer focus/Escape return, and modal background isolation with unchanged wallet. No page exceptions were captured.

The full regression suite passed **365/365 tests**, including the earlier 356 campaign/catalog/economy/geometry/save-recovery checks and the nine new input cases.

## Responsive and keyboard checks

| Scenario | Result |
| --- | --- |
| 320×568, 360×640, 390×844 and 414×896 portrait layouts | Pass |
| 768×1024 tablet-sized layout | Pass |
| 844×390 landscape, map and controls alongside each other | Pass |
| Core walking, shortcut and clock targets at least 44×44px | Pass |
| Walking controls unobscured by fixed navigation | Pass |
| Catalog, missions, journal, wardrobe and destinations at 320px | Pass |
| The same five views with larger text | Pass |
| Settings text input at 320×360, 16px minimum input font | Pass |
| Drawer focus/close and modal Tab/Shift-Tab containment | Pass |
| Browser Find shortcut does not toggle fullscreen | Pass |
| 35 successive catalog Tab stops remain unobscured by fixed navigation | Pass |
| Skip link, camera Escape and journey/dialog inertness restore correctly | Pass |
| Damaged-save recovery remains protected and accessible | Pass |
| Shop directory, store list and product dialogs at 320px | Pass |
| 3D interior keeps usable canvas space; product controls remain inside dialog | Pass |
| Store/product dialogs with external font stylesheet unavailable | Pass |

No horizontal document overflow was found in those checks. Narrow directory testing found that the compact map left too little scrolling space; opening a directory now expands it. A longer keyboard pass found catalog focus beneath the fixed navigation; focus now scrolls immediately into clear view. Enlarged pause-button testing found clock crowding; a single clock/pause control fixes that. Screenshots were inspected for the tested portrait, tablet, landscape and form layouts.

## Automated accessibility scope

axe-core 4.14.0 checked the selected WCAG 2 A/AA and WCAG 2.1 AA rule tags. The menu, mall, player settings, catalog, missions, journal, wardrobe, destinations, collection room, store list, product-detail and damaged-save recovery screens passed with no violations in the selected rules after contrast fixes. Muted foregrounds, selected previews, postcard labels and inverse buttons were corrected; unearned achievements now retain readable text and an explicit status.

This is not a full conformance assessment. Automated rules cannot certify every canvas interaction, screen reader, magnification mode, mobile keyboard or physical GPU. The touch events and viewport sizes above are browser emulation, not physical iPhone/iPad/Android runs. Manual VoiceOver/TalkBack and physical-device testing remain roadmap work. Safari automation was not enabled, and Firefox was not installed for this release.

References informing the controls: [W3C target size guidance](https://www.w3.org/WAI/WCAG21/Understanding/target-size), [W3C visible focus](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html), [Pointer Events](https://www.w3.org/TR/pointerevents/latest/).

## Release gates

Run `npm run check`, `npm test`, `npm run build` and `npm run check:public`. GitHub Pages repeats the checks before deployment; verify the public version, source commit and changed keyboard flow after publishing. QA screenshots, browser profiles and temporary audit packages are excluded from the playable artifact.
