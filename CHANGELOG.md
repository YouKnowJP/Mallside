# Changelog

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
