# v40 release QA

Validation uses disposable synthetic saves and the compiled `/Mallside/` artifact. Safari and Firefox must both pass before publication.

## Evidence and regressions

Eight exact selected-color records retain official USD offers, source size labels and matching photographs. Cotton On’s displayed price takes precedence over stale analytics values; promotion and standard references remain distinct. Aritzia’s structured availability and opened size-menu observations are recorded separately. Source photographs and garment-only sampling regions were visually reviewed.

Thirteen new regressions cover source/photo checksums, merchant-only stocking, all 8,698 prior product IDs, exact W/L and alpha sizing, fit/purchase/reload/refund, old shortlist compatibility, source wording, garment construction, cropped torso/shoulder coverage and exposed waist, starter-shirt/denim overlap, reachable furnished studios, 22×20 waystation bounds, saved discovery links and actual campus journeys on all 23 floors, bounded/reduced-motion poses and refresh-rate-independent action cameras.

Visual review found and corrected visible cropped-top skin intersections and small denim-waistband poke-throughs. The crop fix bounds the actual body cross-section using tangent planes rather than treating it as an ellipse; tests ray-check both sides of the dressed body. Coverage preserves skin below the intended cropped hem. Existing full-length apparel and frame regressions remain in place.

## Compiled browser coverage

Chromium checks reviewed the furnished denim/jersey interiors and fitting scenes with zero captured page exceptions. Touch-capable 320/390/768 CSS px layouts retain W32L32, the online-offer qualification, 44px Add controls and comparison focus without horizontal overflow.

The browser matrix has 49 gameplay scenarios plus its strict error check. Full release validation uses a fresh disposable session per scenario: actual headless Firefox and native visible Safari. Three v40 scenarios cover physical denim comparison/fitting/manual turning/payment/refund; cropped jersey and alpha labels through purchases/reload/refunds; and water-to-discovery routes, saved status at a noticeboard and compact source controls. Older shop, map, activity, movement, keyboard, fullscreen and save/reload flows remain in the matrix.

- Full regression: **475/475 passed** on the final game code in 141.7 seconds.
- Release checks: **129 browser modules / 2,810 local references**. Inventory: **1,973 photo references / 1,951 unique runtime files / 42 legacy unindexed files**. Public artifact: **2,016 files**, with no source maps or development tree.
- Frozen JavaScript: **`app-2K2Q2L5U.js`**. Styles: **`styles-6d92a5f8e9bb.css`**, **`life-styles-dbd3e3bac89b.css`**.
- Native fingerprints include the compiled release, styles, both runner sources, isolation and headless mode. All 49 final scenario reports per browser match the current fingerprint and use distinct disposable sessions. The game’s real visibility pauses and clocks remain intact.

- **Firefox 159.0 / geckodriver 0.37.1:** 50/50 checks passed across 49 fresh sessions, using actual headless Firefox with WebGL and native WebDriver input.
- **Safari 26.6.2:** 50/50 checks passed across 49 fresh visible sessions. One discovery-trail attempt was interrupted by Safari’s remote-control protection dialog; after continuing the session, that scenario passed in a fresh session and the remaining matrix completed. Earlier matching completed scenarios were retained.
- Both final matrices report **zero captured exceptions, resource warnings and input retries**. Native denim and cropped-jersey fitting screenshots were visually reviewed; garment coverage and Safari lighting pass.
- Corrected two test-harness issues: the older crowd check expected a stale animation revision, and the reading-cost check compared autosaved time that can lag the live walking clock. It now checks the displayed clock before and after the paused preview and verifies the exact six-minute charge in both browsers.
- Safari’s **Allow remote automation is verified off**. The temporary Firefox app, downloads, driver, disposable profiles and four newly created crash-metadata files were removed; all nine recorded pre-test Firefox paths were preserved. Native report, screenshot and foreground checkpoint files are removed after recording these results.

## Limits

Desktop Safari/Firefox and touch emulation do not certify physical phones/tablets or full manual screen-reader access. Product prices are dated online references; game stock, fit, returns and interiors remain simulated. Source citations establish provenance, not new image permissions. Exact mall/branch geometry, further catalogs, starter-trouser waist seams visible under cropped tops, GPU stress and broader animation work remain on the roadmap.
