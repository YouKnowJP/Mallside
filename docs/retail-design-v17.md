# Mallside v17: physical merchandise

The 3D renderer replaces in-world clothing and bag picture boards with solid mesh objects. Real photographs remain available in product details, the catalog, receipts and wardrobe. Product identity, manufacturer references, prices and stock data are unchanged.

## Models

`merchandise-3d.js` creates original stylized game models for shirts, sweaters, hoodies, cardigans, jackets, trousers and shorts. Garments have depth, rounded seams, collars, sleeves, cuffs and appropriate pockets/zips, with hangers for rack presentations. Bag model names select crescent, shoulder, tote, satchel, flap, duffel, backpack and wallet treatments, including shaped bodies, gussets, handles, straps and hardware. The Round Mini Shoulder Bag's burgundy presentation follows the existing product photograph. Other palette/finish choices remain game interpretations and may differ from the photographed variant.

Models retain their real SKU and source link. There are no generated new products, image-plane merchandise models or claims of licensed manufacturer scans. Exact dimensions, branding and material simulation are adapted; the detail photograph and real product page remain the reference for the actual item.

Shared model templates reuse geometry/materials. Repeated rack garments and shelved bags are instanced by mesh part. Main display objects and stocked bays retain their existing collision-free approaches and select the matching own-store real model. Island labels now reference the clothing model actually hanging there rather than an unrelated item from that retailer.

## Picking up and carrying

`validatePickup` checks the branch, shopping level, open day, valid size, current stock and eight-item combined carrying limit before changing the unpaid selection. Picking up moves a model toward the shopper's hand, hides a corresponding display copy and updates the carrying strip. No money is charged and no ownership/tags change at this point. Up to three selected objects are individually visible; the full unpaid selection remains saved and itemized at checkout. Putting back removes one unpaid entry and restores a display copy. Physical stock silhouettes represent store atmosphere rather than an exact count of every size/color in stock.

Selections use the existing day/mall-scoped saved bag format and stock revalidation. Display pages and reloads restore the visual carrying state. Checkout still uses the existing atomic integer-cent transaction, original tax/coupon rules and receipt. Clearing paid selections replaces loose items with a shopping bag for tagged carried purchases. Trying an item is separate from wearing a paid purchase and never removes tags.

## The fitting cubicle

The first cubicle is reserved for the player. Ambient customers use the other room and its waiting position. The shopper follows the physical route into the cubicle; a front camera and cutaway curtain reveal the temporary 3D garment or bag. The preview stays open for inspection, Turn rotates the shopper, and Done walks back out before restoring normal interaction. The owned look and unpaid carried objects return afterward. Explicitly finishing an approach/exit still completes only once. Already charged fitting presentations can finish their walk at closing time, and manual movement cannot interrupt their route.

The clock pauses during the fitting presentation; the stated ten game minutes and stamina cost apply once on starting. Reduced motion, pause handling and the existing 2D fallback remain available. The physical model/carrying experience is in 3D; 2D retains its shopping menus.
