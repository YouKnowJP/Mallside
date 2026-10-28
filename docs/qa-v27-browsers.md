# v27.0.1 — native Safari and Firefox validation

Tested 28 October 2026 on macOS 26.6.2 against the compiled game at the production-shaped `/Mallside/` path. This is a validation release: **no application defects were reproduced and no game-code changes were needed**. The source gains a reusable browser test runner and updated QA records; the production application bundle remains `app-22LCP536.js`.

## Results

| Changed flow | Safari 26.6.2 | Firefox 159.0 |
| --- | --- | --- |
| Compiled boot, menu counts and a migrated day-four save | Pass | Pass |
| Actual WebGL mall and native keyboard walking | Pass | Pass |
| Community invitation; wrong claim has no cost; correct claim persists | Pass | Pass |
| Guestbook choices and daily credit | Pass | Pass |
| WebGL room, window/shelf/door stops and saved shelf order | Pass | Pass |
| Narrow, tablet-sized and desktop room layouts | Pass | Pass |
| Reduced motion places the shopper directly at the chosen stop | Pass | Pass |
| Lighter graphics explains unavailable walking and retains progress | Pass | Pass |
| Noor chapter four, exact $22 reward, sleep and day-five reload | Pass | Pass |
| Portrait capture and original IndexedDB image after reload | Pass | Pass |
| Captured gameplay JavaScript exceptions / console errors | 0 | 0 |

Both engines passed **11/11 flow checks**. Safari used Apple's installed Safari and native `safaridriver`. Firefox used Mozilla's official Firefox 159.0 release with geckodriver 0.37.1 in a disposable profile. The complete Firefox run used its native headless mode so desktop occlusion could not pause the game; its real WebGL scene and room still rendered, and screenshots were captured for visual review. An earlier visible Firefox session also loaded the WebGL mall.

Safari's measured CSS viewports were **390×792, 768×972 and 1440×1048** (the requested outer window sizes include browser chrome). The game showed no horizontal document overflow. The room corners and kept-product models remained visible in the narrow and desktop screenshots. Firefox measured **500×759, 768×939 and 1440×1015**; its native window minimum constrained the requested narrow width to 500 CSS pixels. These are resized desktop windows, not physical iPhone or iPad tests.

The tests used isolated localhost saves built through the real engine/catalog. Public player saves were not reset or used for purchases. Imported chapter choices and first-three-chapter histories were retained; a shelf swap did not duplicate purchases or charge money. Claiming Noor's fourth chapter advanced once and retained all four history records after the next morning and reload. Portrait binaries were retrieved from IndexedDB rather than an illustrated save-backup substitute.

## Repeatable runner and setup observations

Run [the native browser runner](../scripts/browser-qa.mjs) against an isolated local build and a driver already started by the developer; see [script instructions](../scripts/README.md). The runner refuses production/non-local endpoints, prepares synthetic browser-local progress, uses native pointer/key actions and stores reports/screenshots under ignored `build/qa/`. It does not change browser security settings or install browsers.

Safari required the user's explicit approval and local authentication to enable its automation setting. Initial native-interface checks independently exercised backup review/import, the furnished room, walking stops and shelf reordering. The automated run then covered the full matrix. Safari's native driver required settled scrolling before clicks and a whole-window screenshot fallback when its element-screenshot command returned an error; those accommodations are in the runner, not changes to game behavior.

A hidden Safari window and an occluded visible Firefox window correctly paused game time and movement. Those harness attempts were not counted as completed playthroughs. Safari's complete run was performed with its test window visible, and the complete Firefox run used headless mode. Do not weaken the game's hidden-window pause to make a browser test advance.

## Release checks and limits

The release workflow runs the existing **331-test regression suite**, source/notices/photo checks, production build and strict artifact validation before Pages publication. The v27 gameplay suite and new native-browser suite cover different layers; the latter is a local developer check, not a mandatory cloud job requiring macOS browsers.

Physical iOS/iPadOS Safari and Android Firefox devices remain outside this validation. So do every possible OS/GPU/browser version and unrestricted home navigation. See the [roadmap](../ROADMAP.md) and [v27 gameplay QA](qa-v27.md). Source provenance and existing photograph/third-party permissions are unchanged.

Setup references: [Apple's WebDriver guide](https://developer.apple.com/documentation/webkit/testing-with-webdriver-in-safari), [Mozilla's geckodriver usage](https://firefox-source-docs.mozilla.org/testing/geckodriver/Usage.html), [Mozilla's headless command-line support](https://firefox-source-docs.mozilla.org/browser/CommandLineParameters.html).
