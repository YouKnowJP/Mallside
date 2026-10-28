# Mallside v16 validation

The release suite passed **221/221 tests**, with no failures or skips, in 36.0 seconds using `node --test --test-concurrency=2 tests/*.test.mjs`. The final customer-spacing adjustment passed all four customer checks again. Final stock-rendering changes passed syntax checks and live browser initialization. `git diff --check` passed.

## Automated coverage

The previous 217 release checks remain passing. Four new customer/fitout checks cover:

- Every distinct interior layout: stocked fixture approaches, both fitting cubicles, all queue positions and existing services have clear collision-free routes from the entrance.
- A 350-second deterministic customer session: real own-store models only; browsing, comparison, fitting, queueing, payment, exit and re-entry; exclusive room/register ownership; bounded unique payment queues; every customer completes purchases; player state and product data remain unchanged.
- Technology customers use demos, desktop customers start at separate displays, five-customer builds respect the requested limit, pending catalogs have no invented buyers, and crowds can be disabled.
- Paused/reduced-motion states freeze the lifecycle and moving customers yield when approaching the player.

An initial implementation calculated complete shelf routes while constructing each branch layout. Explicit clear side-aisle approaches removed that unnecessary work; all route assertions still pass. The six main product stations, new shelf approaches, fitting camera and portrait camera also passed the 38 relevant geometry/identity/life checks after adding the entrance table.

## Live verification

In-app Chromium/WebGL using the separate local free-shop save, with desktop, 390×844 phone and 820×1180 tablet viewport overrides:

- Continued Day 9, walked from South Coast's upper level through the existing home route and slept. Day 10 restored both needs and paid $1,080 once, preserving three retained purchases.
- Routed through South Coast's west/main buildings to Uniqlo. Entered the 15-model store and inspected full wall bays, hanging rails, folded stock, front edit table, two fitting rooms, staffed checkout/returns and a marked queue. Eight customers occupied different stages of the shopping cycle; customers left with bags. The rendered scene reported ambient purchases increasing independently of the player wallet.
- Walked through the fuller floor to fitting, chose **SUPIMA Cotton Crew Neck T-Shirt**, size **M**, viewed its real photograph/reference and completed the temporary fitting animation with positive fit feedback.
- Added the shirt to the bag. Checkout walked to the front of the staffed payment counter. Paid **$24.90 + $2.05 game tax = $26.95**, receipt **D10-9**. Wallet changed **$82,520.55 → $82,493.60**; retained ownership increased from three to four.
- Returns walked to the front of the other desk at **(290, 734)**. The tagged, unused purchase qualified. Confirming returned **$26.95**, restoring **$82,520.55**, three retained purchases and an empty unpaid bag.
- Phone: five customers, 364px-wide toolbar, 340.5px-high unobscured canvas, and equal document/viewport width of **390px**. All five primary actions remained visible. Tapping the new front table walked to its approach and opened the real **DRY-EX Crew Neck Short-Sleeve T-Shirt** with photograph, $24.90 game price, size controls and UNIQLO reference.
- Tablet: document/viewport width both **820px**, 774px toolbar and roughly 694px of canvas. The controls occupy a separate row; fitting rooms and merchandise remain visible.
- Reopened the final desktop scene, verified stocked rear shelves and pleated fitting curtains, and captured the finished store. Inspected browser warning/error logs were empty. Temporary viewport overrides were reset before handoff.

All transactions use simulated game money. The public save was not reset or used for test purchases. Physical iPhone/iPad hardware and other browser engines were unavailable; viewport testing is not hardware certification. The enhanced fitout/customer life is in the 3D renderer; the lighter 2D fallback retains its existing shopping menus. Existing catalog gaps remain marked rather than receiving unverifiable products.
