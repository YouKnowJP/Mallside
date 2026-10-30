# v41 release QA

The previous v40 workflow [41100390394](https://github.com/YouKnowJP/Mallside/actions/runs/41100390394) now reports **completed / success**, with both `check` and `publish` successful. Its delayed waiting record has resolved; no environment protection or branch policy was changed.

## Changes under test

Original material-study interactions and richer fixture detail in all 327 pending planning shops; physical and 2D mosaic arrangements on all 23 floors; time-based fitting curtains; room-finish cache cleanup. No catalog products, stock, prices, purchase policies or photographs change.

Fifteen new regressions cover schema-6 compatibility, optional-note normalization and bounds, atomic non-spending saves, named accessible controls, a dedicated studios filter, proximity signs, every study/rest/help/exit route, real sample colors/finishes and preview rollback, geometry within existing fixtures, physical arrow directions, mall/floor scoping, reduced motion, refresh-rate-independent curtains and procedural texture disposal/recreation.

The native matrix has 52 gameplay scenarios plus its strict error check. Three new scenarios cover all three physical studio types, discarded/saved/reloaded studies, physical mosaic keyboard turns and saved arrangements, compact focus, draft cancellation and direct shop exits. Full validation uses fresh disposable sessions, actual headless Firefox and native visible Safari, synthetic saves and the compiled `/Mallside/` artifact.

- Full regression: **490/490 passed** on the final game code in **56.2 seconds**. The full suite found a missing-note assumption in the mosaic painter; its default arrangement now also supports minimal/older scene state, and the affected checks and full suite pass.
- Compiled Chromium review: all three physical study types preview/save their actual materials with no captured page exceptions. Physical mosaic keyboard turns and saved reloads pass. Touch-capable **320/390/768 CSS px** layouts retain named controls, focus, draft rollback and visible hit-tested save/exit targets of at least **48px**, without horizontal overflow.
- Release checks: **133 browser modules / 2,836 local references**. Public artifact: **2,016 files**. The photo inventory changes only its release label; every photo and catalog listing stays intact.
- Frozen JavaScript: **`app-AG5U2HJG.js`**. Styles: **`styles-6d92a5f8e9bb.css`**, **`life-styles-a3e53f64648f.css`**.

The finder dropdown originally left shortcut selection indicators stale. The handler now updates both, and the compact native scenario checks that path before exercising the shortcut buttons.

- **Firefox 159.0 / geckodriver 0.37.1: 53/53 checks passed.** Actual headless Firefox used WebGL and native WebDriver input. Native compact study controls measured a 500px viewport with visible, hit-tested 48px save/exit buttons.
- **Safari 26.6.2: 53/53 checks passed.** Native visible Safari tested all three studio types, physical keyboard-driven mosaics, fitting, purchases, refunds, saved progress, movement, fullscreen and shared activities. Compact study controls measured a 390px viewport with visible, hit-tested 48px save/exit buttons.
- All 52 passed scenario reports per browser match the current compiled release, styles, both runner sources and isolation mode. They use 52 distinct passed sessions per browser. Both final summaries contain **zero captured game exceptions, resource warnings and input retries**. Native studio and mosaic screenshots were visually reviewed.
- Concurrent rendering initially stalled older dining/gallery driver commands without captured game exceptions. The suites then finished serially, reusing only exact-fingerprint passes. Safari’s native fullscreen attempt also needed its real window foregrounded; the unchanged scenario passed after focus was restored at the readiness checkpoint. These attempts are separate from the final passing session counts.
- Safari’s **Allow remote automation is verified off**, and its owned driver is stopped. The temporary Firefox app, downloads, driver, profiles and newly created crash metadata were removed; all nine pre-test Firefox paths were preserved. Native/Chromium report, screenshot and foreground checkpoint files are removed after recording these results.


## Limits

Desktop browsers and touch emulation do not certify physical phones/tablets or full manual screen-reader access. Studio furnishings are original game scenes. Real catalogs in the remaining shops still need research and image permissions. Exact branch geometry, broader character/clothing refinement and long-session GPU stress remain on the roadmap.
