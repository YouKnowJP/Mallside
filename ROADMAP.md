# Mallside development roadmap

Updated 28 October 2026. The game is playable and under active development; this is a record of remaining work, not a claim that the whole game is finished.

## Completed in v29

- Tap-to-step and hold-to-walk controls, explicit Stop, larger targets and a separate control rail; portrait/tablet/landscape layouts retain usable movement controls.
- Canvas-scoped keyboard input, safe pointer cancellation/capture loss, multi-touch guards and input cleanup on focus/visibility changes.
- Skip link, current-page navigation, inert dialog backgrounds, drawer focus return, consistent Tab loops and preserved browser shortcuts.
- Stronger UI text contrast and clearer locked-achievement labels; compact clock pause/resume and expanded small-screen shop directories/interiors.
- Touch-capable Chromium emulation, 320–844px layouts, larger text, short form viewports, selected axe-core audits and regression tests. See [v29 QA](docs/qa-v29.md). Physical devices and manual screen-reader certification remain open.

## Completed in v28

- Separate last-known-good local backups for career and free shop, with validated writes and unchanged primary save keys/schema.
- A paused recovery screen for damaged or missing saves, reviewed restore/import, exact stored-data downloads and confirmed fresh starts.
- Persistent storage-failure warnings, safe retries and protection from a stale tab overwriting newer progress.
- Compatibility, failure-injection, restore/reward regressions and compiled Chromium recovery checks. See [v28 QA](docs/qa-v28.md).
- Native Safari/Firefox recovery validation in v28.0.1: 17 checks each, with Safari’s dialog Tab navigation fixed. See [native recovery QA](docs/qa-v28-browsers.md).

## Browser validation in v27.0.1

- Native Safari 26.6.2 and Firefox 159.0 each passed eleven compiled-game flow checks covering WebGL, room movement, daily actions, story continuation, reloads and original portrait storage. No game-code defects were reproduced. See [browser QA](docs/qa-v27-browsers.md).

## Completed in v27

- Ten follow-up local chapters extend all five stories to five chapters each, with original choices, history, next-day waits and previously collected rewards preserved.
- Concierge community invitations and daily lost-property claim matching add no-purchase errands and new chapter evidence.
- Furniture-safe walking stops in the collection room, saved shelf reordering and an optional daily evening pause advance the home routine.
- Procedural stone grain, indoor/outdoor floor finishes, storefront pane and soffit detail, shoulder movement, head counter-motion and airborne ankle roll refine presentation.
- Corrected repeated room-renderer creation in the owned-item list and clarified 2D movement availability.

## Completed in v26

- Noor and Jules add six multi-day local missions and six friendship chapters, retaining the previous completed stories and choices.
- Furnished 3D collection room, real owned-product shelf models, three saved room finishes and close-up pose/camera controls with the lighter fallback retained.
- Receipt-backed kept-outfit preparation, next-day application and a persistent local concierge guestbook with bounded daily rewards.
- Window-facing shopper pauses, actual-distance gait, conversation attention, shared starter-shirt sleeves/collar and gentle seated gestures.
- Distinct instanced architectural material responses, preserved clothing fit, and clearer fitting-room return feedback.

## Completed in v25

- Three branching local stories with nine optional chapters, fixed choices, new-action evidence, overnight continuation and one-time rewards.
- Real-purchase gift wrapping and delivery, complimentary water and directory route notes.
- Continuous player headings, smoother player/NPC turns, conversation spacing, yielding shoppers, diverse adult appearances and restrained head attention.
- Changing daylight and window illumination, more layered storefront finishes, slatted benches and smoother foliage.
- New multi-day story-path, gift economy, save and graphics regressions, plus live interaction checks.

## Completed in v24

- Four daily outing formats built from active real-model catalog records, with photographs, allowances, guided steps and a daily reward.
- Saved progress, return-aware receipt validation, no-purchase outings, overnight refresh and outing memories.
- Story, request and passport progress across actual retailer branches, with distinct-model counts and geographic destination evidence preserved.
- Correct nonwearable carried-item prompts and physical returns-counter routing from receipts.
- New regressions plus the existing full-campaign, catalog, route, character and store tests.

## Next gameplay and presentation work

- Continue developing consequences beyond the five-chapter local arcs, including more varied shared activities and conversations tied to later visits.
- Develop the room’s named walking stops into unrestricted home navigation with more rooms and collection arrangements; deepen the homeward routine beyond the current evening pause.
- Continued camera, storefront, lighting, NPC and character/fabric refinement; the current motion is controlled animation rather than complete cloth physics.
- Physical phone/tablet testing, including iOS/iPadOS Safari and Android Firefox, and broader accessibility verification. The desktop Safari/Firefox matrix is complete for the recorded versions.

## Catalog and mall fidelity

The current source snapshot has **1,015 stocked identities, 133 service identities and 450 identities awaiting catalog research**. Pending stores must not receive invented merchandise or undocumented guest assortments. Complete them with real-model evidence, exact photographs and individually reviewed image permissions. Existing photo citations are provenance, not blanket commercial clearance.

Continue refining each adapted whole-center footprint and interior against primary mall/retailer references. Current maps are original condensed game layouts; exact unit geometry, every floor connection and manufacturer product construction are not universally reproduced. Prioritize observed playability problems over simply adding more directory entries.

## Release discipline

Keep all Mallside development and direct GitHub Pages publishing in the public `YouKnowJP/Mallside` repository, working from `/Users/youknowjp/Documents/Personal PR/Mallside`. Keep `Personal-Project` separate for Tilewright and other projects. Validate changes, keep saves compatible, live-test the changed flow and publish the generated game through the main-branch workflow. Preserve the public play URL and third-party notices. Never commit credentials or save backups, or include development directories or source maps in the playable artifact. See [deployment](docs/DEPLOYMENT.md).
