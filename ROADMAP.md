# Mallside development roadmap

Updated 28 October 2026. The game is playable and under active development; this is a record of remaining work, not a claim that the whole game is finished.

## Completed in v24

- Four daily outing formats built from active real-model catalog records, with photographs, allowances, guided steps and a daily reward.
- Saved progress, return-aware receipt validation, no-purchase outings, overnight refresh and outing memories.
- Story, request and passport progress across actual retailer branches, with distinct-model counts and geographic destination evidence preserved.
- Correct nonwearable carried-item prompts and physical returns-counter routing from receipts.
- New regressions plus the existing full-campaign, catalog, route, character and store tests.

## Next gameplay and presentation work

- More local stories and varied multi-day requests, richer conversation and clearer consequences for choices.
- More tactile service interactions and a more developed home/collection space, including deeper gift presentation.
- Continued camera, storefront, lighting, NPC and character/fabric refinement; the current motion is controlled animation rather than complete cloth physics.
- Additional manual Safari/Firefox and physical phone/tablet testing, broader accessibility verification, and save-recovery improvements.

## Catalog and mall fidelity

The current source snapshot has **1,015 stocked identities, 133 service identities and 450 identities awaiting catalog research**. Pending stores must not receive invented merchandise or undocumented guest assortments. Complete them with real-model evidence, exact photographs and individually reviewed image permissions. Existing photo citations are provenance, not blanket commercial clearance.

Continue refining each adapted whole-center footprint and interior against primary mall/retailer references. Current maps are original condensed game layouts; exact unit geometry, every floor connection and manufacturer product construction are not universally reproduced. Prioritize observed playability problems over simply adding more directory entries.

## Release discipline

Keep the canonical source private at `YouKnowJP/Mallside`, working from `/Users/youknowjp/Documents/Personal PR/Mallside`. Validate changes, keep saves compatible, live-test the changed flow and publish generated browser files through the existing main-branch workflow. Preserve the public play URL and third-party notices. Never put source maps, the development tree, private keys or save backups into the public hosting repository.
