# Mallside v10 QA

Validation on October 27, 2026. Release query `10.0.6`. Preview saves were separate from the public origin.

## Automated checks

The final release run passed all 178 tests (0 failures, 0 skipped). It retains the economy, 548-listing catalog, campaign, save, activity, fitting, photo and movement checks from v9. New coverage verifies all 1,598 retained directory entries have a reachable representation, every one of the 23 floor views has connected destination routes, and floor transitions preserve walkable landings.

Specific regressions cover South Coast Plaza main-to-west travel using Level 2 and both escalator legs, A/B/C west-building placement, partial-floor geometry and department-anchor exclusions, positions beyond the old 1,200-unit boundary, older Del Amo/Beverly floor migration, read-only closing routes, directory destinations opening catalog interiors or reference information, and rejection of phone fragments/announced or temporarily closed listings.

JavaScript syntax checks and `git diff --check` pass. Final run: 178/178 passed in 64.99 seconds.

## Live browser checks

- Continued the existing local free-shop save; wallet, purchased items and floor state remained intact across refresh.
- Searched the South Coast Plaza directory and walked to Anthropologie in west Zone B. The destination remained in the west building beyond the former map boundary.
- Used the directory to walk to Louis Vuitton on Level 2 and entered its playable 3D interior. This exposed and fixed a directory action that initially handled reference storefronts only.
- Started the unskipped home journey inside that upper-floor interior. It completed through campus travel, home and sleep. The next-day recap showed Day 5, one $1,080 paycheck and 100/100 stamina/fullness. The wallet increased from $301,449.78 to $302,529.78.
- Inspected South Coast Plaza whole-center 3D overview and searchable 235-entry floor planner. Floor previews include the separate Level 3 west and Nordstrom areas.
- Traveled to Fashion Island and rode to its distinct Rooftop footprint. Removed misleading duplicated main-floor department anchors from partial dining/service levels.
- Checked phone viewports 390×844 and 320×740 and tablet 820×1180. Whole-center controls and searchable directory fit; document scroll width equals viewport width at both phone sizes. The modal retains a reachable close button and its own scrolling.
- Independent Chrome smoke loaded the actual 3D Outlets at Orange campus and opened its whole-center directory. Console inspection in both browsers found no JavaScript errors during these checks. Chrome input occasionally timed out after dispatch while the requested game action completed; fresh accessibility state confirmed completion.

## Issues found and corrected

Public floor masks initially left disconnected small-floor targets. Shop and anchor bodies now stay clear of the halls; kiosks occupy counter bays; escalator footprints are reserved before placement. All routes are regression-checked.

Catalog destinations in the complete directory now enter the actual shop rather than looking only for reference units. Automatic night-floor transfers carry the remaining route without spending daytime floor-change costs or requiring the mall to remain open. Large-map saves use each campus's bounds. Small-floor escalators are unique, avoiding duplicate landing obstacles. Full-center floor previews show the player marker only on the current floor.

Phone-only extraction fragments and announced/temporarily closed rows are excluded from source storefronts. Destination cards distinguish source directory entries from playable shopping counters.

## Limits

These are original condensed center-wide models of the principal wings, courts, buildings and public connections, not measured replicas. Individual suite shapes, distances, some unknown floors, activities and catalog counters are adapted. Shared-suite concessions can appear as separate directory locations. The cited print directories can omit wrapped/no-phone rows, so coverage is not a promise of every current tenant. See [map research](map-research-v10.md).

Only 32 catalog shops have the existing complete browse/fit/checkout/return gameplay; other real directory storefronts provide official listing information. Product prices and shopping policies remain simulated game values. This update does not add new merchandise models.

No test guarantees that a game has no bugs. Real iPhone/iPad hardware, Safari/Firefox, all GPUs, long-session performance and every real touch gesture were not tested in this pass. Responsive viewport checks do not certify physical devices. Existing 2D fallback remains available. Historical v9 QA documents the earlier full shopping, activities and wardrobe checks.
