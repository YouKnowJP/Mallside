# Mallside v64 QA

The promenade candidate passes **801 source tests**, plus the browser module, photo inventory and public artifact checks. The public candidate contains 2,078 files. The [v63 baseline](research-v64/compatibility-before.json) confirms that all 8,863 complete product records, 1,598 shop identities, 23 navigation floors and their entrances, save schema 6 and map revision 10 are unchanged. Geometry fingerprints use six decimal places to ignore platform differences in the last bits of floating-point calculations.

The compact matrix passes at **320 × 900, 390 × 900, 768 × 900, 844 × 390 and 320 × 568** in both graphics modes. It verifies 44 px walking controls, camera and Stop actions, keyboard focus return, an expanded canvas that fits the viewport, and shop browsing and exit. The first visual pass found that notifications could cover the exit on a short phone; the corrected build displays them inside the dialog and keeps its action bar clear. See the [compact results](research-v64/compact-proof.json). These are desktop browser emulations of compact viewports.

The final candidate passes **17 native Firefox 159.0.1 gameplay scenarios plus the exception check**, with no captured errors, warnings or input retries. The selection covers walking, storefront entry and exit, fitting and checkout, receipts and exact refunds, floor maps, indoor evening lighting, fullscreen and keyboard focus. The temporary signed browser, installer, driver and test files are removed, and all 14 pre-existing Firefox Library entries are intact.

Native **Safari 26.6.2 passes the same 17 gameplay scenarios plus the exception check** in one visible test window. No game exceptions, resource warnings or input retries were captured. Full-size outdoor and indoor captures were visually checked. The temporary Safari session was closed and remote automation was visibly verified off.

The [validation record](research-v64/validation.json) identifies the exact bundle, styles and runner shared by the two tests. The existing GitHub Pages workflow publishes the verified build to the official play address.
