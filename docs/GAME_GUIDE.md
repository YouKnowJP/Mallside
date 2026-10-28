# Mallside — a shopping life

A browser shopping-life simulation with a main menu, ten XP-gated mall destinations with twenty-three playable floor views, 1,598 playable shop/service identities, 8,571 evidence-backed branch listings representing 1,771 distinct named real models, ten career levels, and twenty-four story chapters. Run `npm start` to serve http://127.0.0.1:4317. No install or build is required. Run `npm test` for the release regression suite.

## v23: anatomical 3D characters and a live dressing room

The sphere-and-cylinder figure has been replaced by a textured, weighted MakeHuman HM08 human mesh with a53-bone rig,30 finger joints, anatomical face/ears/hands, real skin maps, fitted strand hair and separate eyes. Textured short hair and a chin-length bob, plus soft/defined face detail, are selectable in settings. Skin and hair colors tint the source detail instead of flattening it. The new proportions shorten the arms, and fingers relax or close around the actual product grip. Eyelids blink and honor reduced motion.

The wardrobe now uses the same3D rig, purchased garments, bag anchors and pose solver as the mall. Inspect the whole outfit or a face close-up, turn around, and switch between standing, walking and sitting. Clothing wraps the measured anatomical body envelope; covered arm/hip skin is masked beneath fabric, neck coverage avoids open seams, and size ease stays visible. Long skirts shorten the step. Hems move subtly with the gait, while bags pivot around the top and their straps keep contact with the moving lugs. Seated bags settle beside the player.

Existing money, progression, product identity, photos, prices, receipts, returns and saves are preserved. Old appearances acquire defaults for the optional style fields. The2D graphics mode and illustrated transition scenes remain available. This is a game character and controlled garment deformation, not a complete physical cloth solver. All anatomical source assets are CC0; sources, hashes and an offline rebuild script are retained. See `docs/human-assets-v23.md` and `docs/qa-v23.md`.

## v20: articulated shoppers and outfit fit

A new adult-proportioned 3D figure has shaped shoulders, waist, jaw, hair, eyes and hands, plus separate elbows, wrists, knees and ankles. The distance-driven walk plants each stance foot, lifts the swing foot and eases turns. Seated transitions ground the feet and rest the pelvis on the bench. Tops and long sleeves follow the new joints; trousers articulate at the knees. Hems and cuffs respond to the floor, while a continuous hip bend avoids sharp fabric stretching.

Held merchandise and paid shopping bags use real grip anchors and stay upright after elbow/root turns. Large pieces use a forward carry pose. Equipped bags are set beside the shopper during a seated moment; their straps unhook and settle as fixed-length segments. Cups and ice creams are scaled to the new hands, and sipping bends the elbow toward the face. Shoppers use the same walking rig. Fitting-room inlays sit flush with the floor so they cannot cover the shoes. Existing catalog identity, prices, saves and economy are preserved. These remain original stylized game models and controlled cloth posing, not photorealistic scans or a complete cloth simulator. See `docs/character-audit-v20.md` and `docs/qa-v20.md`.

## v19: the whole clothing and bag catalog

All 2,971 physical clothing/bag listings (752 unique references) now use construction profiles and photo-derived surfaces. Seventeen garment forms replace the overly broad shirt/hoodie categories, and 89 named/family bag rules drive twelve silhouettes. Dresses, skirts, jumpsuits, collars, halter straps, puff sleeves, coats, wide/skinny legs, bucket bags, hobos, pouches and other forms are distinct. Suitable store/worn surfaces can sample high-resolution areas of the original photograph; reviewed regions, background filtering and aspect-aware print mapping protect the results. These remain stylized interpretations, with conservative estimated proportions outside the researched measurement references.

Two-segment legs, hip caps, seated hem deformation, lap-aware bag placement, re-fitted straps and hand-attached food props improve movement/resting. Repeated fitting releases its own resources while retaining shared catalog templates. Mall windows use compact surfaces, and material sections stay batched. Product names, photographs, prices, purchases and old saves are preserved. See `docs/retail-design-v19.md`, `docs/garment-audit-v19.md`, `docs/bag-audit-v19.md` and `docs/qa-v19.md`.

## v18 product reference models and character fit

All 2,971 clothing/bag listings use colors sampled from their 752 existing reference photographs, with five visually reviewed variants. Six researched bag families receive individual proportions and construction: Round Mini, the pictured CFQ88 glazed-leather Tabby 26, Speedy 25, Neverfull MM, Le Pliage Original L tote and Classic 11.12. Nylon, denim, cotton, knit, fleece, canvas, leather and glazed finishes have surface grain; selected quilt, woven, monogram, hardware and brand details distinguish models. These remain original stylized models, not exact manufacturer assets. Photographs remain the reference for variant details.

Worn tops wrap around the torso, sleeves follow the arm joints, and trouser legs follow the leg joints. Game size adds controlled ease. Hand-held objects grip at the wrist and stay upright, with a loaded arm pose to keep long garments above the floor. Separate shoulder, crossbody, backpack and hand-carry attachments place bags and their straps on the shopper. Existing picking, fitting, checkout, tags, returns, prices and saves are preserved. See `docs/retail-design-v18.md` and `docs/qa-v18.md`.

## v17 physical clothes and bags

Clothes and bags in the 3D world now use solid merchandise models instead of photo boards. Rails carry volumetric garments with collars, seams, cuffs and hangers; bag families have shaped bodies, handles, straps and hardware. Select a display, choose a size and pick it up. Unpaid selections appear in the shopper's hands, can be put back, survive a reload, and are charged at the existing checkout. The first three selections are shown individually; the eight-item limit remains. Fitting walks into a reserved cubicle, previews the 3D garment/bag on the shopper and stays open with Turn/Done controls. Leaving the preview restores the owned outfit and held items. Photographs and real product references remain in details for exact model/color information. The 3D models are original stylized interpretations, not manufacturer scans. See `docs/retail-design-v17.md` and `docs/qa-v17.md`.

## v16 stocked stores and customer life

Stocked stores have six main product stations plus six wall bays, additional rails or islands where space allows, and a front merchandise table. Clothing rails carry repeated garment silhouettes and folded stock from the store's own photographed real models. Fitting cubicles have mirrors, benches and moving curtains; other categories use open style/consultation counters. Staffed checkout and returns include registers, terminals, shopping bags and a marked queue. Up to eight customers (five on narrow screens) browse, try or test, queue, pay and leave carrying bags. Exclusive fitting-room/register reservations keep their visits ordered. These ambient purchases never change player money, ownership or stock. The shop toolbar occupies its own row above the scene. See `docs/retail-design-v16.md` and `docs/qa-v16.md`.

## v15 brand windows and physical shop visits

Readable brand signs, recessed glazed display bays, photographed merchandise and different retail fixtures make stores easier to recognize. Sport, folded-apparel, beauty, technology, atelier and luxury rooms have different treatments; documented references guide features such as Prada's green/checkerboard gallery and Sephora's black-and-white stripes. The compact shop toolbar walks the shopper to fitting, checkout and returns before opening their menus. Entry/exit fades respect reduced motion. Verified stock and existing saves are unchanged; stores awaiting evidence still say Collection in research. See `docs/retail-design-v15.md` and `docs/qa-v15.md`.

## v14 connected shopping streets

Narrower galleries now have opposing rows of real-store façades, continuous walls/canopies, deeper connected retail blocks and lit entrances. Indoor malls have connected overhead glazing. Up to 36 animated shoppers (24 on narrow screens) browse local routes and can be approached for a short conversation. Nearby coffee, flower, photo and pop-up counters use the existing playable menus and activities. Mall entrances have sliding glass panels; nearby stocked windows show their own verified product photographs. Existing saves and catalog data are preserved. See `docs/mall-design-v14.md` and `docs/qa-v14.md`.

## v13 map finish

Ten destination palettes now coordinate connected retail arcades, detailed façades, patterned paving, planted courts, skylights, pergolas, lighting and public furniture. Garden benches can be reached and used for animated rest; public directory stands open the center guide. Foreground building cutaways keep the shopper visible, and the overview fits the full rotated mall on narrow screens. The 2D fallback shares the same floor geometry and furnishing. Existing progress and catalog data are preserved. See `docs/mall-design-v13.md` for references and geometry limits, and `docs/qa-v13.md` for validation.

## The daily loop

Start or continue a career, or choose a separate free-shop save. Customize the shopper's name, skin/hair/outfit/bag colors and game sizes. Set normal/cozy/leisurely clock pace, walking speed, animation preference, crowds, optional chimes, and larger text. Export a JSON backup or review an import before restoring it.

The mall opens at 10 AM and closes at 8 PM. While exploring or browsing a store, one game minute passes every one, two, or three real seconds according to the clock option. Product details, the main menu, catalog, journal, missions, recovery menus, manual pause, and hidden tabs pause the live clock. Actions still use explicit game time. Fullness falls by 0.16 per minute; stamina falls by 0.06, doubled below 25 fullness. At 5 fullness the shopper needs food before shopping. Food court meals and the named Starbucks menu offer different recovery choices; water and bench rests are free.

The default play view is a genuine Three.js/WebGL 3D courtyard with an animated, equipped shopper. Walk freely across the tiled floor using WASD/arrows, touch drag or the on-screen pad. Tap open floor to navigate around physical shop, fountain, planter and furniture colliders. Continuous segment checks prevent corner clipping and long-step tunneling; an eight-neighbor A* grid with line-of-sight smoothing serves pointer routes. Rotate the camera, zoom or show the whole mall. A lighter 2D view is available in settings and automatically used if 3D cannot initialize.

Head home voluntarily or at closing. The shopper walks from its current location to the exit, then across an evening street, into home, and to bed. Presentation time pauses the live clock. The sequence supports reduced motion and a skip action. A day token prevents duplicate sleep pay. A pending journey survives a reload. Morning restores needs, pays simulated work income, brings packages home, advances return deadlines, refreshes stock and goals, expires requests/coupons, and shows a recap.

## Ten mall destinations

| Level | XP | Destination | Reference center |
| --- | ---: | --- | --- |
| 1 | 0 | The Outlets at Orange | The Outlets at Orange |
| 2 | 150 | Citadel Outlets | Citadel Outlets |
| 3 | 400 | Irvine Spectrum Center | Irvine Spectrum Center |
| 4 | 800 | Brea Mall | Brea Mall |
| 5 | 1,400 | Del Amo Fashion Center | Del Amo Fashion Center |
| 6 | 2,200 | Desert Hills Premium Outlets | Desert Hills Premium Outlets |
| 7 | 3,200 | Fashion Island | Fashion Island |
| 8 | 4,400 | Westfield Century City | Westfield Century City |
| 9 | 5,800 | Beverly Center | Beverly Center |
| 10 | 7,500 | South Coast Plaza | South Coast Plaza |

Ten destinations now use large whole-center campus layouts, with 3,600×2,700-unit grounds (4,200×2,800 at South Coast Plaza), long retail wings, anchor courts and floor-specific footprints. Nearly 1,600 source directory entries populate the center maps. Outdoor centers retain open plazas; indoor centers have broad concourses bounded by shop buildings. Irvine Spectrum has a rotating observation-wheel landmark. The player walks to the escalator and rides its animated steps before changing floors; choosing a shop on another floor routes there automatically. The upper-floor journey home rides down before walking to the ground-floor exit. Traveling between malls takes twenty game minutes; changing floors takes three.

The scenery includes photo-filled storefront displays, tiled courts, a fountain, carousel, cafés, benches, flower studio, cinema, pop-up pavilion and three named locals per floor. Shop interiors have real product displays, a clothing rail and a browse/checkout counter. Keyboard walking through a doorway enters the interior; walking back through the exit returns to the courtyard. Tapping a storefront or the nearby E prompt also enters. A minimap and optional directory guide exploration. All twelve services are tappable scenery. Sitting, eating, drinking, carousel rides, bridge walks and browsing animate in the 3D scene. Character equipment is stylized and does not claim to be a 3D scan of the photographed product.

The main play screen has a compact needs HUD and four optional panels: Shops, Stops, Story, and Guide. Each Guide links the map reference, states its limits, and offers a landmark discovery trail. First visits give 12 XP; completing a mall trail gives 100 XP and $50 once. Ten trails add persistent exploration content beyond the existing passport rewards.

The 3D and 2D maps cover the principal center-wide wings and connections using condensed original geometry. Official directories provide tenant names and verified floors or broad zones; exact unit polygons and distances remain adapted. Smaller upper/lower levels have separate footprints. Unknown floor placements and the game’s catalog counters are labeled as game arrangements. Some geometric references are historical. See `docs/map-research-v10.md` for current coverage and limits. The destination order is game progression, not a factual ranking of malls.

Use the Fullscreen button, menu option, settings control, or F shortcut. The game requests native browser fullscreen where supported and provides expanded viewport play if it is blocked/unavailable. Escape leaves expanded play. iOS/browser support and embedded-browser permissions can limit native fullscreen.

## Window shopping and mall moments

The Shops panel offers a three-item window edit with real named designs, prices, product photographs, wishlist controls and prominent product reference links. The selection rotates each game day. Read a label to record a discovery and watch a short browsing animation; entering the full store preserves its existing checkout and returns flows. Cross-floor window visits route via the escalator.

Meet Maya, Eli and Sam on the concourses. Conversations take five minutes and award 12 XP once per character, mall and day, with a chat animation. The expandable Mall Moment card in Stops asks for two unique window labels, one conversation and one center activity at that mall. Collect 60 XP and $35 once per mall per day. Logs persist through reload; v6 saves receive empty exploration logs without resetting progress. The main view stays focused on the map; optional panels pause the live clock while reading.

Nine popular models received more specific official links, and all 48 archive LEGO additions now link to their individual official set/instructions reference with the historical price PDF retained separately. See `docs/product-links-v7.md`. A collection reference is labeled as such where a current direct model page is not verified.

## The dressing room

Nine independent equipment slots show purchased tops, bottoms, shoes, bags, hats, belts, scarves, watches, and jewelry. Preview the illustrated character from four directions, swap or remove individual items, and keep the equipped look in the mall, activities, and walk home. Backpacks, shoulder bags, hats, belts and other accessories have distinct visible shapes. Illustration colors are game art, not exact product reproductions. Equipping removes tags only on first use; removing or swapping an item does not restore return eligibility. Checked, delivered, returned, and unowned items cannot be equipped. Equipped items free carrying space.

Fitting-room turns preview the selected real product on the character. Eating, coffee, ice cream, bench rest, bridge walks, carousel, flower workshop, cinema, and other activities have animated scenes with accessible captions, reduced motion, and skip controls. Actions apply once before presentation; skipping never charges or rewards a second time. Short landscape screens retain the animation header and skip control.

## Long-term content

Ten levels unlock destination travel and each brand’s first available shopping location. Discoveries, twenty-four ordered chapters, ten daily goals, ten one-time destination discovery rewards, eleven badges, and client requests support progress. New malls receive a one-time welcome bonus. The catalog previews all real models, while store routing and checkout respect shopping unlocks.

Twelve shopping briefs rotate through up to three accessible offers per day; offers always have an unlocked qualifying product. Accept one, inspect a matching real model, purchase it afterward in the shopper's usual game size, stay within the tax-inclusive budget, and deliver it unused. Delivery transfers ownership and reimburses the exact paid amount plus a fee. Delivered items cannot be reused or returned for a second payout. A request shortlist makes the criteria visible; unfinished briefs expire overnight.

Six once-per-day activities offer different time, cost, and recovery choices: garden stroll, carousel, sculpture walk, flower workshop, cinema, and terrace tea. Seven weekly occasions award one-time daily bonuses for the featured activity. The journal combines requests, calendar, activity history, carrying status, and a player-set daily checkout budget.

## Purchases, packages, and returns

Each store has an unpaid bag saved for the current mall and game day. Reloading restores valid selections within stock and carrying limits; traveling to another mall or sleeping clears unpaid selections. Today’s carried purchases and unpaid selections share an eight-item limit. Concierge package check frees carrying capacity without removing ownership. Collect a checked item before using, delivering, or returning it. Any remaining checked packages automatically come home after sleep.

Checkout uses integer cents and itemized 8.25% game tax, with an afternoon queue. Receipts retain actual paid totals, including coupons, for accurate refunds. Unused purchases with intact tags/packaging can be returned to their original store within thirty game days. Marked final-sale and used products cannot be refunded. Clothing/accessories support fit and wear/carry; tech, beauty, and hobby products support demos and open/use. Opening packaging removes return eligibility. LEGO building takes thirty minutes.

## Version 9: a fuller shopping life

The next-step button above the map points to the current chapter’s actual store, item, service, reward, or next morning. An optional three-step welcome guide can be reopened from Help. Ten destinations use three composed architectural families, with mirrored or rearranged courts, all landmarks inside the floor bounds, and locals walking between morning, afternoon, and evening stops.

Shop interiors contain six real-photo merchandise displays per page, category-specific furniture, department filtering, and complete paging through every listing. Fitting, checkout, returns, and associate services have separate physical stops. Paging never charges another store visit. Trying an item walks to the fitting studio, temporarily changes the 3D equipment, then restores the owned outfit.

Six activities now take player choices: daily flower recipes, tea preparation, sculpture-order puzzles, garden observations, cinema seat selection with three illustrated original story scenes, and six selectable carousel horses. Correct completion applies its cost and reward once, plays the character action, and saves a memory. Incorrect choices can be revised, and closing an unfinished session is free. The cinema is an illustrated interactive short, not streamed video.

Maya, Eli, and Sam have six conversation topics, rotating replies, friendship hearts, and nine gated personal chapters. Friendship increases at most once per person per game day across malls. Six saved looks restore owned equipment and base appearance; three daily styling briefs give those outfits a purpose. A six-place collection shelf holds opened purchases. Eight collection goals reward actual discovery, and a savings goal includes game tax without reserving the wallet. Return-date reminders help plan another visit.

The photo studio captures the actual equipped 3D shopper against an open court, with three poses and three frames. Up to twenty portraits persist in IndexedDB separately from the JSON save and have PNG download controls. The album labels an illustrated backup if the original image is absent on another device. The 2D renderer uses an explicitly labeled illustrated snapshot. Export portraits separately from save backups.

Research and implementation rationale: `docs/design-research-v9.md`.

## Version 10: the whole shopping center

South Coast Plaza includes its west/home building, Village, main north/south galleries, southeast wing and department anchor courts. The Bridge of Gardens connects the buildings on Level 2. Routes between separated ground-floor buildings walk to an escalator, cross on Level 2, then descend automatically; normal shopping floor changes retain their game-time cost. Homeward trips use the same geography without charging extra actions after closing.

Del Amo now has Lower, Main and Upper views; Century City has its smaller Level 3; Beverly includes street businesses, Levels 6–7 and a compact Level 8 service view. Fashion Island’s lower, upper and roof areas no longer repeat the main mall. Ten distinct wing arrangements replace the shared courtyard.

The Center map offers floor previews, court destinations, a source directory search and walk-to controls. Every source storefront now opens a playable interior. Retail branches have photographed real-product assortments with browsing, fitting or demos, checkout and eligible returns. Service locations have original game booking, activity and unused-ticket refund flows. The 32 original story shops retain their full collections and campaign roles. Source locations that share a brand may appear on multiple floors. The minimap, following camera, floor landing, save bounds and night route all support the larger campus. Old saves retain their economy and inventory; obsolete physical positions reset to a valid entrance.

## Product identity and visuals

Each retailer has at least fifteen named real products. All 548 listings link to an official product, support, or relevant collection page. Some refer to earlier-generation or archive models. Prices, stock, retailer placement, compare-at values, sizing feedback, return rules, appointments, people, events, and payouts are simulated. Placement in Ross, Marshalls, or any other store does not imply real current availability.

`catalog-original.js` preserves thirty original IDs, `catalog-data.js` adds 170 identities, and `catalog-expansion.js` adds 280 more. `docs/catalog-research-v4.md` records the previous expansion. `catalog-v6.js` adds 48 real LEGO sets at published Spring 2024 US catalog prices and 17 MUJI bags/hats at US prices checked on October 26, 2026. The additions display their price source date in product details; LEGO archive prices are explicitly historical. See `docs/catalog-prices-v6.md`. Three researched early-game accessories in `catalog.js` add a Nike Club cap, Nike Heritage crossbody bag, and Levi’s reversible belt, each linked to an official product page. `product-photos.js` and `assets.json` contain local photographs for all 548 listings, deduplicated into 526 optimized WebP files (about 8.2 MB). The static index loads synchronously, including storefront and interior displays, catalog, details, receipts and wardrobe. No generated merchandise illustration fallback is used. Unexpected load failures show an honest unavailable message. `docs/photo-catalog-v8.json` records source pages, image URLs, model evidence and variant notes. Most photos use official galleries; some archived or inaccessible models use documented retailer/supplier references. Five verified name/source corrections preserve all product IDs. Three.js r180 is vendored with its MIT license. Mall, character and bedtime visuals are original game art. System fonts back up Google Fonts. The static game makes no gameplay-backend or payment requests.

## Persistence and validation

Progress stays in the current browser and does not sync across devices. Career and free shop have separate saves. V2/V3/V4/V5 migration retains purchases, claimed chapters, badges, money, and previously unlocked store tiers; V1 retired fictional demo purchases receive credit. Backup import validates the format, previews the day and balance, and preserves the other mode. Invalid scalar fields normalize to safe ranges.

249 automated tests include every listing's full inspect/fit-or-demo/checkout/refund-or-final-sale/use/reload path, a 2,000-action deterministic economy session, all rank gates, atomic failures, refund/coupon accuracy, carrying/package rules, request eligibility and transfers, calendar rollover, needs and recovery, movement speed/collision/path routing, night idempotency, save migration/import validation, readable store identities, own-store window selection, stocked-fixture approaches, customer visit lifecycles, solid merchandise geometry, pickup/put-back validation and interactive fitting. `docs/qa-v19.md` records current live verification and test limits; earlier QA reports are historical. Viewport testing does not constitute physical iPhone/iPad hardware testing.

Independent fan-made game. No affiliation with referenced retailers. No real purchases or payments.

## Playable storefront expansion — v11

All 1,598 retained directory entries lead to an enterable shop or service interior, across the existing 23 mall-floor views. There are 1,447 merchandise-bearing shop identities and 151 service/experience identities (some original story shop identities are shared between malls). The catalog includes 979 distinct photographed product models from 231 manufacturer/vendor labels. The additional research bundle supplies 455 source-matched model records/photos; branch listings share each model photograph rather than inventing extra products.

All active listings require own-brand identity, an actual merchant product listing, or explicit carried-brand evidence. There is no guest-capsule or category-based stock fallback. 1,015 stores have verified photographed collections; 450 remain marked Catalog in research, and 133 locations provide game services. Earlier purchases, equipment and refunds remain supported through a frozen v11 receipt archive. See `docs/store-research-v12.md` and `docs/catalog-coverage-v12.json`.

Restaurants use photographed real menu items and have an eat/drink-here option on their game receipt. Consumption restores needs once; prepared food/drinks are final sale. Service businesses have original game sessions, receipts, animations and unused-booking refunds; these are not their real booking menus. Every store can be entered from its facade, nearby prompt, shop list or whole-center directory. Each added branch keeps its own merchandise stock, bag and return receipt.

The all-product browser starts with the current mall, supports a mall/store selector, and merges repeated branch offers when browsing a whole selection. Source item sizes such as 32 P can match the saved numeric waist. Shop interiors use a compact Browse/Services toolbar and hide the exterior minimap and shortcuts.
