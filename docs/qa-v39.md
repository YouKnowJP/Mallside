# v39 release QA

Validation uses disposable synthetic saves and the compiled `/Mallside/` artifact. Safari and Firefox must both pass before publication.

## Source and regression coverage

Nine official retailer color variants retain their exact source image, USD offer and sizes/widths. Eyewear quotes explicitly remain starting-price references; the $175 Wide-only Durand variant is not assigned the $95 offer from another color. The source contact sheet was visually reviewed. Four on-model apparel photographs have reviewed construction/crop metadata.

Eleven new regressions cover provenance/raster hashes, seven merchant-scoped studios, retention of all 8,665 prior active IDs by a sorted-ID digest, fit/purchase/reload/refund for every new variant, compatible local shortlists, width/price wording, distinct solid frame geometry and head attachment, bounded/reduced-motion fitting, reachable studio stations, inset garden bounds and safe frame resource disposal, continuous opaque garment coverage at hips/backs, and actual neckline/shoulder skin occlusion. Existing count assertions reflect 1,039 stocked/426 pending/335 planning identities and 3,025 clothing/bag listings with 770 unique photographs. The earlier collection and bookshop tests retain their own edition scopes.

## Browser coverage

Three new native scenarios exercise a physical optical desk, two-price comparison, exact width, eased frame fitting, payment and refund; a Rhone polo/shorts fitting and paid receipts through reload/refund; and a physical garden discovery followed by compact width/price details, preserved notes and pinned shop controls.

The full native matrix lists every scenario and uses a fresh disposable session per scenario. It records the exact release and styles; optional resume accepts only the same release/style/test fingerprint. Safari activates focused controls with native keyboard input and Firefox uses native element clicks. Visibility pauses remain intact. A bounded `caffeinate` process prevents display sleep only while a native matrix is running.

## Completed local checks

- Full regression: **462/462 passed** in 89.0 seconds on the final code.
- Release checks: **119 browser modules / 2,783 local references**, source-image checksums and notices. Public artifact: **2,008 files**, without source maps or development directories.
- Tested JavaScript: **`app-WY7MCJDP.js`**. Styles: **`styles-6d92a5f8e9bb.css`**, **`life-styles-718fe5bb5eea.css`**.
- Isolated compiled Chromium: optical interiors, exact frame facts, close-up fitting/finish, Rhone fitting and no captured page exceptions. Touch-capable **320/390/768px** layouts retain the $175 starting-price qualifier and Wide-only option without horizontal overflow; comparison review receives focus.
- Visual review corrected the opaque polo's shoulder/hip clipping. Shell rings now follow the body's curvature, include the actual neckline/trapezius bounds and provide shoulder clearance. Ray-based regressions protect these visible coverage fixes. Frame adjustment stays beside the face and restores finger posing after attachment updates. Displays use smaller frames on original stands.

## Completed native checks and cleanup

- **Safari 26.6.2: 47/47 checks passed across 46 fresh sessions.** **Firefox 159.0 / geckodriver 0.37.1: 47/47 checks passed across 46 fresh sessions.** Both tested the exact JavaScript and styles above, with zero captured game/console errors, resource warnings or input retries.
- Both matrices cover all three v39 scenarios plus prior shopping, shop entry/exit, maps, activities, movement, fullscreen, save/reload and keyboard/compact-layout paths. Native fitting screenshots were reviewed for lighting, frames, hands and garment coverage.
- Safari's compact frame panel was tested at 390 CSS px; Firefox's native minimum was 500 CSS px. Both retained visible 44px checkout/exit controls without horizontal overflow. Chromium touch emulation supplies the narrower 320px check above.
- Removed the disposable Firefox application, download, driver and profiles, plus the four metadata files created by this run; all nine pre-existing Firefox baseline paths were preserved. Safari's **Allow remote automation** checkbox was visibly verified **off** after the final matrix. Removed temporary native reports, screenshots and foreground checkpoint files after recording these results.

## Limits

Native desktop browsers and touch emulation do not certify physical phone/tablet behavior or full manual screen-reader access. Real branch inventory, lens/prescription configuration and exact manufacturer geometry remain outside these tests. Source citations do not grant new image permissions. Broader map/store fidelity, graphics and prolonged GPU stress remain roadmap work.
