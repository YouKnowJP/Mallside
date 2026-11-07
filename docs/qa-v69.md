# Mallside v69 release checks

The tested bundle is `app-3UKOSI5L.js`. All 819 source tests passed. The new checks cover swapping a size in a full bag, keeping bag order and money intact, rejecting an exhausted size, and easing curtain and try-on movement.

- **Firefox 159.0.1** completed the 3D fitting-room route, previewed the exact blouse, turned on demand, and returned to the shop floor. An unpaid size swap survived exit and reload. The compact flow kept its exact selection and requested an alternate size. An unfinished textile studio retained its saved fabric palette. The earlier window-to-till and denim fitting, purchase, and refund routes also passed.
- **Responsive checks** passed at 320 × 568, 390 × 844, 844 × 390, and 1440 × 950 in Chromium. The tray and result fit within the available width, the result received keyboard focus, and the size swap persisted.
- **Safari 26.6.2** completed the lightweight fitting-room visit in a private window. The tray retained the unpaid size 38 blouse, the associate confirmed size 40, and the try-on result received keyboard focus. Swapping to size 40 left the wallet at $75,000 in game money. The bag still showed one unpaid size 40 blouse after reloading. Safari remote automation was off throughout.
