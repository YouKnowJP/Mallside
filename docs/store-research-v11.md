# Playable storefronts and product research — v11

Research checked October 27, 2026. The full-center directory retains 1,598 source entries. Every entry has a reachable, enterable shop or service identity; the directory is no longer an information-only endpoint.

## Genuine merchandise

The catalog now represents **979 distinct named real models** under **231 manufacturer/vendor labels**, up from 526 models. New research contributes 455 source/photo records, including overlaps with earlier models. Each record retains its actual product name, maker, official product reference, price basis and genuine product photograph. The bundle contains no generated merchandise images. Branch copies reuse each model photograph.

- [Retail source manifest](research-v11/retail.json): official public USD product feeds and direct product pages. Merchant capsule and actual vendor are separate fields, e.g. Maeve at Anthropologie. Non-USD feeds, unpublished/internal products and schematic-only images were excluded.
- [Food source manifest](research-v11/food.json): 40 real menu items from 12 chains. Their prices are simulated US reference values unless a specific published location price is cited. Some actual matching-product photographs come from official international sites because US sources blocked extraction; this is preserved in the source notes.
- [Home/beauty source manifest](research-v11/home-beauty.json): source-matched beauty, home, jewelry and toy models with 45 downloadable real photos. Two failed-photo records were not included.

Actual photographs are locally bundled WebP assets, with descriptions/source URLs available through the product detail. Color/finish and avatar geometry can differ from the photograph. Provider menus, stock, current prices or regional availability are not asserted by the game.

## Assortments and honesty

There are 1,447 merchandise-bearing shop identities plus 151 service/experience identities. Original story shop identities can be shared across malls. Source-verified brand capsules are available at 333 added branches. Another 115 branches use multibrand game selections. The remaining 967 retail branches use a clearly labeled **game guest capsule** of category-appropriate real photographed products. Every card keeps its actual manufacturer name and real product source; a guest capsule does not claim the real named retailer carries it. Original story shop assortments remain as previously documented.

This distinction is visible in the associate greeting and product detail. It avoids creating fictional brand products or presenting unverified branch inventory as factual. Exact retailer assortments still need further source-specific curation.

## Services and restaurants

Restaurants support actual photographed menu identities, game checkout/tax, saved receipts, and eating/drinking animations with once-only recovery. Prepared food/drinks are final sale under the game rules.

Salons, repairs, cinemas, galleries, wellness businesses, visitor services and showrooms have enterable original game service interiors. They offer book/use/refund interactions appropriate to their broad business type. Session names, prices, duration and recovery are game design, not real provider menus or medical/financial advice. Public-service locations do not sell unrelated clothing or pretend to perform real banking, healthcare or recruitment.

## Technical coverage

All directory facade clicks, keyboard/touch entrances, nearby prompts and directory routes resolve to the existing interior system. Source geometry stays batched outdoors to avoid creating thousands of independent 3D facade draw calls. Model photos load for the active interior; source models share their assets across branches. Product/store lookups are indexed. The catalog has mall/store filters and merges repeated offers when showing a whole selection.

Original 32-shop story objectives remain finite. The new branches contribute ordinary discovery and shopping progress without making existing story completion require visiting 1,598 locations. Old wallets, purchases, outfits, source IDs and progress are retained.
