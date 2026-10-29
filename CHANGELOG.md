# Changelog

The newest entry describes the current setup. Older entries record the hosting arrangements used at that release.

## 31.0.0 — A clearer shopping day — 28 October 2026

- Rebuild Explore around a larger scene, compact time/wallet bar, persistent shopping guide, searchable shop/floor/availability finder and a unified game menu.
- Add explicit shop browsing/exits, a grouped unpaid-bag review and clearer size/checkout steps; keep researched and unfinished merchandise distinguishable.
- Cancel stale interior and floor-transfer routes, avoid recording portal jumps as walking, and route court-map selections through the mall graph after leaving a shop.
- Add interactive storefront/court map links, floor markers, correct inside-shop player position and actual floor diagrams on physical directory panels.
- Add time-based walking acceleration, immediate release, camera/look-target smoothing, overhead gallery lighting and hanging planting.
- Make expanded gameplay fill the viewport, preserve an explicit exit and provide mobile camera tools through Menu; fix inherited short-landscape and clipped-search-drawer layouts.
- Fix a Safari navigation/focus race caused by animated document scrolling moving click targets, defer canvas resize work and keep optional web fonts from blocking startup.
- Work around Safari’s ambient-light shader linker failure with a guarded, equivalent shader expression.
- Add eleven movement/lifecycle/map/resize/render regressions and repeatable native shared-activity/shopping QA. Preserve save schema 6 and existing real-product assets.

## 30.0.0 — Shared afternoons — 28 October 2026

- Continue all five completed local stories with ten original, alternating shared conversation activities and dialogue that recalls the original story choices and the last retained visit.
- Save each choice immediately, resume after reload/sleep/travel, return to the original mall and keep the latest 30 memories in the Journal.
- Validate activity choices and finishing costs before mutation; allow one shared-memory reward per day across friends and malls, with no purchase requirement or direct cash payout.
- Add touch and keyboard dialogs, explicit time/reward feedback, next-question focus and short-screen focus reveal; retain version-6 saves and earlier chapter rewards.
- Add ten gameplay/compatibility regressions and compiled-game browser checks; see [v30 QA](docs/qa-v30.md).

## 29.0.0 — Touch, keyboard and small-screen access — 28 October 2026

- Added tap-to-step, hold-to-walk and Stop controls outside the map overlay, with larger targets and collapsible map/camera tools.
- Confined walking keys to map focus, preserved modified browser shortcuts, and stopped stale pointer/key input on cancellation, capture loss, blur and hidden tabs.
- Added skip navigation, current-page labels, dialog background isolation, drawer focus restoration and camera-tool Escape behavior.
- Improved UI text contrast, locked-achievement status labels, the clock pause/resume target, short form viewports and narrow shop-directory/interior layouts.
- Added nine input regressions and exercised native touch events in Chromium mobile emulation, keyboard paths, portrait/tablet/landscape layouts, larger text and selected automated accessibility rules. Save schema 6, economy, purchases and photo assets are retained.

## 28.0.1 — Native recovery testing and Safari keyboard fix — 28 October 2026

- Fixed Safari skipping the recovery import-review button when tabbing from the JSON textarea. Dialogs now advance and wrap focus explicitly for Tab and Shift-Tab.
- Passed 17 native recovery checks each in Safari 26.6.2 and Firefox 159.0, including both modes, real cross-tab conflicts, failed writes, exact download payloads and once-only night income.
- Added a reusable localhost-only recovery runner and documented browser measurements, specific navigation-cancelled font warnings and temporary-browser cleanup.
- Kept save schema 6, existing primary/backup formats, game progress and catalog assets unchanged.

## 28.0.0 — Save recovery — 28 October 2026

- Keep one previous validated local save per mode, captured before replacing the primary; check backup integrity and retain the original JSON save keys and schema.
- Stop silent fresh-game fallback from overwriting damaged saves. Recovery pauses gameplay and autosaving until a reviewed restore/import or confirmed fresh start, with downloads of stored data and a separate-mode escape.
- Add manual backup review/download in Player & options, persistent failed-save warnings, retries and stale-tab protection.
- Preserve automatic migration of versions 1–6 and reviewed import of versions 2–6; protect receipts, progression, daily rewards and night-transition idempotence.
- Add 25 storage/compatibility regressions and test the compiled recovery flows, storage failures, keyboard focus and responsive layout in Chromium. Safari/Firefox’s prior gameplay checks remain recorded separately.

## 27.0.1 — Native Safari and Firefox validation — 28 October 2026

- Verified eleven compiled-game flow checks in Safari 26.6.2 and Firefox 159.0, including WebGL walking, all room stops, migrated local stories, daily actions, next-morning reloads and original portrait persistence.
- Added a reusable localhost-only W3C WebDriver runner with native pointer/key input, error capture, Safari screenshot handling and ignored QA reports.
- Recorded responsive desktop-browser measurements and retained physical mobile-device testing as an explicit limit. No game-code defects were reproduced; application behavior, saves, catalog and photographs are unchanged.

## 27.0.0 — A neighborhood to come back to — 28 October 2026

- Extended every local story from three to five chapters, adding ten follow-ups that retain original choices, completed history and one-time rewards.
- Added community invitations, a rotating lost-property matching activity and a bounded daily home routine, with atomic costs and reload-safe daily limits.
- Added walking between furniture-safe room stops and saved shelf reordering; corrected repeated room-renderer creation inside the owned-item list.
- Refined stone grain, indoor/outdoor floor finishes, layered storefront panes, entrance soffits, shoulder movement, head counter-motion and airborne ankle roll.
- Kept save version 6, both game modes, catalog identities, photographs, original prices and third-party terms; clarified unavailable walking controls in lighter graphics.

## 26.0.1 — Free play and public-source permissions — 28 October 2026

- Clarified the proprietary license for free personal play, private evaluation, sharing gameplay and restrictions on rehosts, rebranding and monetized redistribution.
- Added a readable permissions guide to the repository and playable artifact, preserving GitHub platform rights, prior grants and independent third-party licenses.
- Retained an ownership notice in generated JavaScript and added license/official-play metadata, enforced by release checks.
- Limited the provided Pages publisher to the canonical repository to avoid accidental publication from an unchanged fork.
- Corrected the player-facing feedback link and kept the public game, account-free play, saves and automatic publication intact.

## 26.0.0 — A room, a rhythm, a few familiar faces — 28 October 2026

- Added Noor and Jules, six optional multi-day local missions and six friendship chapters.
- Added a furnished 3D collection room with owned-product shelf models, saved finishes and room/outfit/face cameras.
- Added next-day outfit preparation/application and a local concierge guestbook with atomic costs and daily reward limits.
- Improved actual-window shopper pauses and gaze, actual-distance gait, starter-shirt sleeve/collar detail and seated gestures.
- Added distinct instanced material responses and clearer fitting-room return feedback; retained product references, save keys and ownership rules.
- Updated privacy information for public source and the new local planning/memory fields.

## 25.0.3 — Migration cleanup — 28 October 2026

- Clarified editable source versus generated production files, updated current documentation links, and moved retired hosting notes into `docs/history/`.
- Removed obsolete cross-repository workspace rules and fully merged local work branches.
- Excluded macOS/Windows file-manager metadata from asset packaging and made artifact verification reject it.
- Kept gameplay, save keys, catalog references, proprietary terms and automatic same-repository Pages publishing unchanged.

## 25.0.2 — Single-repository publishing — 28 October 2026

- Made Mallside source public at the owner's request and replaced the two-repository publisher with direct GitHub Pages deployment.
- Preserved the play URL and existing browser progress; removed the obsolete publisher credential.
- Verified two automatic main-branch deployments and updated release metadata and deployment guidance.

## 25.0.1 — Publication and layout polish

- Aligned local-story action buttons on desktop while retaining stacked mobile cards.
- Restored the missing generated-files hosting repository, its limited publisher key and the same public play URL; source stays private.

## 25.0.0 — Local stories and mall atmosphere

- Added three original branching stories, nine optional chapters, overnight continuation and saved outcomes.
- Added gift wrapping, receipt-backed gift delivery and reimbursement, water recovery/cooldown and directory route notes.
- Fixed cardinal-only 3D player turns; smoothed player and NPC rotations and added bounded browsing attention.
- Added deterministic adult appearances, time-of-day lighting and window illumination, layered storefront finishes and bench/plant detail.
- Preserved the existing rig, product catalog, save version, private source and generated-file deployment.


## 24.0.0 — A day with a plan — 28 October 2026

- Added rotating daily outings with real product photos, tax-inclusive allowances, checklists, route guidance, memories and one reward per day.
- New purchases, usual sizes, refunds, overnight expiry and backups now drive outing progress.
- Fixed named-retailer story/request/passport goals across actual mall branches and deduplicated repeated real-model listings.
- Preserved location-specific evidence, old saves, ownership, appearance and prior rewards.
- Corrected nonwearable fitting prompts and receipt routing to physical returns desks; clarified real mall level names.
- Retained private source and automatic generated-only public publishing.

## 23.0.2 — Private source and automatic public builds — 28 October 2026

- Made the canonical game repository private and moved the local clone to `/Users/youknowjp/Documents/Personal PR/Mallside`.
- Replaced direct-source Pages deployment with a tested minified public artifact in a separate hosting repository.
- Preserved the public play URL, player storage origin and automatic main-branch publishing.
- Added output checks that exclude source maps, editable modules and the development tree.

## 23.0.1 — GitHub migration — 28 October 2026

- Imported the complete v23 browser game, assets, tests and research into `YouKnowJP/Mallside`.
- Added automated checks and deployment of `dist/` to GitHub Pages.
- Added a proprietary game license, third-party asset notices, privacy information and a player-facing rights page.
- Added project navigation, development/deployment instructions, migration provenance and an asset-clearance inventory.
- Preserved the existing gameplay, product catalog and saved-state format. Saves from a different hostname require manual JSON export/import.

## 23.0.0 — anatomical character and 3D dressing room

Textured human topology, face/hair settings, jointed fingers, wardrobe stand/walk/sit/face previews, garment refitting, palm grips and seated bag placement. See [v23 QA](docs/qa-v23.md) and the [retained game guide](docs/GAME_GUIDE.md) for earlier gameplay releases.
