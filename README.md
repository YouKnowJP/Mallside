# Mallside — A Shopping Life

**[Play Mallside in your browser](https://youknowjp.github.io/Mallside/)** · [Report a bug](https://github.com/YouKnowJP/Mallside/issues) · [Documentation](docs/README.md)

A shopping-life simulation by **Jackson Pham / YouKnowJP**. Walk through connected 3D shopping centers, browse photographed real products, try outfits, carry purchases to checkout, and manage your budget, energy and time before heading home.

Play directly from the link. Players do not need GitHub, an account, a download, or a payment. All purchases and money inside the game are simulated.

**Free to play · Proprietary source available · No commercial redistribution without written permission.** Sharing the official play link is welcome. See the [permissions guide](PERMISSIONS.md) and [full license](LICENSE).

## v28 — a safer shopping life

Each mode now keeps a separate last-known-good backup. Unreadable saves open a paused recovery screen with a reviewed restore, raw-data download, JSON import and a confirmed fresh start. Storage failures show a persistent warning; another tab’s changes pause stale saving. Existing saves keep their keys and version-6 format, with earlier migrations retained. See [save recovery](docs/GAMEPLAY-v28.md), [release QA](docs/qa-v28.md) and [remaining work](ROADMAP.md).

The 28.0.1 patch fixes Safari’s recovery-dialog Tab navigation. All 17 native recovery checks passed in Safari 26.6.2 and Firefox 159.0; see [native recovery QA](docs/qa-v28-browsers.md).

## Previous update · v27 — a neighborhood to come back to

Continue all five local stories through ten new chapters, help match lost-property claims and keep a community invitation. Walk between stops in your collection room, rearrange kept finds and take an evening pause. Stone grain, storefront layers and more natural airborne steps refine the 3D mall and characters. Existing saves and earlier rewards carry forward. See [v27 gameplay](docs/GAMEPLAY-v27.md), [release QA](docs/qa-v27.md) and [remaining work](ROADMAP.md).

The 27.0.1 validation release passed native Safari 26.6.2 and Firefox 159.0 gameplay checks. See the [browser QA matrix](docs/qa-v27-browsers.md) and [repeatable runner](scripts/README.md).

## Previous update · v26 — a room, a rhythm, a few familiar faces

Meet Noor and Jules in six new multi-day local missions, with six further friendship chapters. Arrange kept real-product models in a furnished 3D collection room, choose its finish, prepare tomorrow’s outfit and leave a local guestbook memory at concierge. Window-browsing pauses, actual-distance gait, starter-shirt detail and distinct material finishes refine the people and mall. See [v26 gameplay](docs/GAMEPLAY-v26.md), [design references](docs/design-research-v26.md), [release QA](docs/qa-v26.md) and [remaining work](ROADMAP.md).

## Previous update · v25 — people, parcels and a more natural mall

Three branching local stories add nine optional multi-day chapters. Wrap a real purchase, deliver Maya’s gift, refill at guest services and save directory route notes. Continuous walking headings, smoother turns, varied adult appearances, changing daylight and layered storefront details improve the 3D scene. See [v25 gameplay](docs/GAMEPLAY-v25.md), [gameplay QA](docs/qa-v25.md), [publication QA](docs/QA.md) and [remaining work](ROADMAP.md).

## Previous update · 24.0.0

Plan a fresh daily outing from the main menu or Journal: a considered find, a two-piece outfit, a gift hunt or a free window-shopping afternoon. Follow the real-product checklist, keep new purchases within its tax-inclusive allowance, and collect one outing reward each day. Progress survives reloads; returning an unclaimed purchase removes its credit. Named-retailer story goals and requests now recognize actual branches across malls, while location-specific discovery stays tied to the destination.

See the [outing guide](docs/GAMEPLAY-v24.md), [release QA](docs/qa-v24.md), and [remaining development work](ROADMAP.md).

## In the game

- Ten mall destinations with career unlocks and a separate free-shop mode.
- Real named product references, local photographs and simulated prices, with source links.
- Walkable shops, fitting rooms, checkout, receipts, returns and a persistent wardrobe.
- Missions, story chapters, friendships, cafés, activities and a day/night routine.
- Textured 3D characters, jointed hands, wearable clothes and bags, and a live dressing room.
- Keyboard and pointer/touch controls, fullscreen, reduced motion and a lighter 2D fallback.

Mall geometry and stock are adapted for play. Catalog references do not promise current retail availability or exact real-world prices. The game is independent of the brands and centers it depicts.

## Play and save

Use WASD or arrow keys to walk, or tap open floor and use the on-screen controls. Enter shops, select products, choose a size, and use the fitting room or checkout. The main menu contains help and player options.

Progress is stored in this browser. Career and free shop have separate saves. Use **Player & options → Save & recovery → Download current progress** before changing devices, clearing browser data, or moving from the old game address. Import that JSON backup at the new address. Browser storage is separated by website origin; saves do not transfer automatically. Outfit-photo binaries remain in the original browser and are not included in the JSON backup.

Modern desktop and mobile browsers can load the static game. 3D requires WebGL; the game offers a 2D fallback. Live QA covers desktop Safari 26.6.2, Firefox 159.0 (native headless flow checks) and Chromium, including resized phone/tablet layouts. Physical mobile devices and every browser/GPU combination are not certified; see the [browser QA](docs/qa-v27-browsers.md).

## Run locally

Requires Node.js 22+ and Python 3. Source is publicly readable under the proprietary license below. Run `npm ci` for the pinned production bundler; local development serves the editable `dist/` files.

```sh
git clone https://github.com/YouKnowJP/Mallside.git
cd Mallside
npm ci
npm start
```

Open **http://127.0.0.1:4317/**. Opening `index.html` directly with `file://` will not load ES modules correctly.

```sh
npm run check
npm test
```

## Project layout

| Path | Contents |
| --- | --- |
| `dist/` | Editable browser application and prepared assets for local development |
| `build/site/Mallside/` | Generated production game; ignored by Git and published by Pages |
| `tests/` | Node regression tests for the economy, navigation, catalog, characters and scenes |
| `scripts/` | Release checks, asset inventory and documented research/conversion tools |
| `docs/` | Current guides, migration record, QA and source research; retired hosting notes in `docs/history/` |
| `.github/` | CI, GitHub Pages deployment and issue templates |

The public `YouKnowJP/Mallside` repository contains the complete project. A push to `main` runs checks and tests, builds the game and publishes directly to GitHub Pages in this same repository. No second hosting repository or deployment key is needed. `Personal-Project` remains separate for Tilewright and other projects. See [deployment instructions](docs/DEPLOYMENT.md), [architecture](docs/ARCHITECTURE.md), and [the retained game guide](docs/GAME_GUIDE.md).

## Rights and permissions

**Copyright © 2026 Jackson Pham (YouKnowJP). All rights reserved for owned, copyrightable Mallside material.**

The [proprietary license](LICENSE) permits free personal non-commercial play, private evaluation and non-commercial gameplay media. It does **not** grant permission to sell, monetize, redistribute or operate another hosted copy of the protected game, including rebranded copies, ad-supported clones or free mirrors. The source is publicly readable and forkable on GitHub; it is not open source or a commercial reuse license. See [permissions and examples](PERMISSIONS.md), or [request written permission](https://github.com/YouKnowJP/Mallside/issues).

Third-party components and public-domain assets retain their own rights: Three.js is MIT, MakeHuman graphical assets are CC0, and brand/product photographs remain their owners' material. Photograph source links are provenance, not proof of permission. No exclusive rights are claimed over those assets. See [third-party notices](THIRD_PARTY_NOTICES.md), [rights and clearance notes](docs/RIGHTS.md), [asset inventory](docs/ASSET_INVENTORY.json), and [privacy information](PRIVACY.md).

The repository began with a README and MIT license only. The game was imported under the proprietary license; the initial history is preserved. See [migration provenance](docs/MIGRATION.md).
