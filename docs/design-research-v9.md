# Mallside v9 — depth and completion audit

Research reviewed October 27, 2026. Original implementation; no copied game art, characters, dialogue, or proprietary maps.

## Findings and implemented response

| Gap found in v8 | v9 response | Completion rule |
| --- | --- | --- |
| All stores felt like the same sparse room | Department-specific rails, shelves, cases and tables; six actual photographed products per page; departments and paging | All 548 listings reachable; separate fitting, checkout, returns and associate stops |
| Activities were mostly paid animation buttons | Six choice-based activities with daily briefs, retries and persistent memories | No payment on cancellation or invalid choices; one daily transaction |
| Conversations did not build a relationship | Topics, rotating replies, hearts, schedules and three stories each for Maya/Eli/Sam | One bond point/person/day across malls; story rewards once |
| Outfit ownership lacked a purpose | Six named looks and three daily styling briefs | Owned, opened, available pieces; paid item-price budgets and actual slots/brands |
| Purchased hobby items had nowhere to go | Six-place collection shelf and eight collection goals | Explicit opening confirmation, no refund after opening, unique model counting |
| Photo booth did not produce a picture | Actual 640×800 3D outfit portraits, frames, poses, local album and PNG controls | Twenty portrait cap; originals stored separately; honest illustrated fallback |
| It was easy to lose the next mission step | Persistent next-action button and optional interactive welcome guide | Every chapter points to a valid action; urgent needs and closing take priority |
| Layouts looked too similar and some anchors were outside the floor | Outlet village, skylight arcade and garden courts, with rearranged/mirrored scenery | All 20 floor views in bounds and route-tested |
| Refresh lost unpaid selections | Same-day, same-mall bag recovery | Validate store, size, stock, rank and eight-item carrying cap |

## Primary-source design research

- [Stardew Valley official overview](https://www.stardewvalley.net/about/): varied daily activities, skill progression, scheduled community characters, collections, and personal spaces. Applied as a rhythm of shopping, recovery, friendships and persistent memories; not a farming clone.
- [Fashion Dreamer official affinity manual](https://eu.fashion-dreamer.com/en-gb/manuals/switch/09/): preference-aware outfits and relationship events. Applied to original styling briefs and gated friendship stories. These are offline systems. The [official discontinuation notice](https://eu.fashion-dreamer.com/nl/onlinemodediscontinued/) states that Fashion Dreamer online mode ended March 17, 2026; no current online feature claim is made here.
- [Nintendo Styling Star](https://www.nintendo.com/au/games/nintendo-3ds/new-style-boutique-3-styling-star/): occasion-based styling and visible character outcomes. Applied to reusable owned outfits, story requests, and remembered looks.
- [Nintendo developer interview, Style Savvy](https://iwataasks.nintendo.com/interviews/ds/stylesavvy/0/2/): shopping needs social outcomes and self-expression beyond a sales counter. Applied to conversations, favors, photos and the personal collection room.
- [Clothing Store Simulator official Steam listing](https://store.steampowered.com/app/2923390/Clothing_Store_Simulator/): distinct store fixtures and customer-facing shopping interactions. Applied to original shopper-focused departments and physical service stops, without store-management scope.
- [Microsoft XAG 109: Objective clarity](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/109): visible goals, explicit next steps, revisitable guidance and progress. Applied to the next-action button and optional three-step guide.
- [South Coast Plaza concierge](https://www.southcoastplaza.com/concierge/): a shopping center includes services and reasons to spend time beyond buying. Mall reference sources and plan confidence remain in `docs/map-research-v6.md` and in each game destination’s Guide.

## Product and map accuracy

No fictional catalog merchandise was added. The existing 548 real listings and 526 photograph files remain intact. Identities and reference links are real; simulated game prices, taxes, retailer stock, people and policies are explicitly labeled. A dated published price is not a claim of current availability. Character equipment remains original stylized geometry, not a 3D product scan.

Courts, store interiors and activity arrangements are authored gameplay scenes inspired by the centers. They do not reproduce each current retail unit or claim to be architectural maps. Three layout families plus curated store/floor placements are used across ten destinations.

## Deliberate limits

Browser-local single-player saves, no multiplayer or cloud synchronization; portraits require separate export. The cinema uses original illustrated story scenes, not video. Mobile viewport QA cannot certify physical iPhone/iPad GPU behavior. The 2D view remains available for devices unable to initialize WebGL.
