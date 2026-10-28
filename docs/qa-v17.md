# Mallside v17 validation

The complete release suite passed **227/227 tests**, with no failures or skips, in 46.1 seconds: `node --test --test-concurrency=2 tests/*.test.mjs`. The 13 merchandise/fitting/lifecycle tests passed again after the final fitting-label cleanup. JavaScript syntax and `git diff --check` pass.

## Automated coverage

Six new tests cover solid geometry and real SKU/source identity across the clothing/bag families (no image planes or image textures), different bag silhouettes, pickup/put-back validation and unpaid save restoration, fitting/checkout/tagged refund accuracy, a reserved player cubicle, and a preview that remains open and turns until finished. Existing navigation, stock, taxes, ownership, crowd lifecycle, saves, reduced motion, closing and home/sleep coverage remain passing.

Invalid sizes, wrong branches, unavailable/archived items and full hands are rejected before selection mutation. Pickup and fitting do not deduct money, decrement stock, grant ownership or remove tags. Checkout and refund retain their original atomic checks. Customer room reservations keep the player cubicle clear. Presentation routes can finish at closing, and manual controls cannot interrupt a fitting approach.

## Live verification

In-app Chromium/WebGL on the separate local free-shop save:

- Entered South Coast Plaza's Uniqlo. The 15-model collection showed solid shirts/pants on hangers and shaped bags with straps on shelves and pedestals. The large clothing/bag photograph boards were absent from the 3D floor; real photographs and links remained in product details.
- Selected the actual 3D **Round Mini Shoulder Bag** from the central pedestal, opened its real $19.90 listing, and chose **Pick up & carry**. One display copy disappeared; a bag appeared in the shopper's hand and the carrying strip showed its SKU/size as unpaid. Wallet stayed **$82,520.55**.
- Added **SUPIMA Cotton Crew Neck T-Shirt**, size **M**, and carried both selections. Reloading retained their exact unpaid SKU/size choices. An intervening free bench rest preserved them without a purchase.
- The fitting route entered the reserved cubicle at **(259, 183)**. The close camera showed the 3D shirt on the shopper, while the owned look and loose carried objects returned afterward. The preview remained open for inspection, the Turn control was used, and Done returned to the shop floor before showing fitting feedback. Floating shop signs are hidden during this close-up.
- Walked with both unpaid items to checkout. Subtotal **$44.80**, original game tax **$3.69**, total **$48.49**. Paid once, receipt **D10-10**; wallet became **$82,472.06** and retained ownership increased from three to five. Loose unpaid models cleared after payment.
- Walked to returns. Both tried-but-unused purchases retained tags and qualified: **$21.54** for the bag and **$26.95** for the shirt. Refunding restored **$82,520.55**, three retained purchases and empty unpaid hands.
- Phone, **390×844**: document width equaled the viewport's **390px**, the toolbar was **364px** wide, all primary actions remained visible, and the room used five ambient shoppers. Tapped the front table's 3D shirt, opened the real **DRY-EX Crew Neck Short-Sleeve T-Shirt**, selected size M, picked it up and entered the fitting preview using the phone controls. Captured the clean close-up, used Turn and Done, then put the unpaid shirt back. Empty hands and **$82,520.55** were verified afterward.
- Tablet, **820×1180**: document/viewport width both **820px**, toolbar **774px**, with the carrying strip contained within the layout. Temporary viewport overrides were reset before handoff. Inspected warning/error logs were empty.

Transactions use simulated game money. The public save was not reset or used for test purchases. Real item references and existing catalog/photo coverage are unchanged. These are original stylized 3D interpretations; exact manufacturer geometry, color and material scans are not supplied. Physical iPhone/iPad hardware and other browser engines were unavailable. The lighter 2D fallback retains its existing shopping menus.
