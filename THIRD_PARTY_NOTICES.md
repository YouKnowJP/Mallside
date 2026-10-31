# Third-party notices

The Mallside proprietary license covers only owned, copyrightable project material. The following components, source assets and references retain their independent rights. No retailer, mall, manufacturer, library author or asset author is represented as a sponsor or partner.

## Three.js r180 — MIT

Files: `dist/vendor/three.module.js`, `dist/vendor/three.core.js`.

Copyright © 2010–2025 three.js authors. The complete MIT notice is retained at [`dist/vendor/THREE-LICENSE.txt`](dist/vendor/THREE-LICENSE.txt). The MIT license permits commercial reuse of Three.js itself, subject to its terms; Mallside cannot remove that permission.

Source: https://github.com/mrdoob/three.js/tree/r180

## MakeHuman / MPFB graphical assets — CC0 1.0 Universal

Files: the body, hair, eyes, textures, rig data and retained conversion inputs in `dist/assets/character/`, and the corresponding data in `dist/human-model-data.js`.

The graphical assets are supplied under CC0. They are not exclusively owned by Mallside. No MakeHuman or MPFB application code is included. The retained MPFB license explains that application's GPL scope and its graphical-asset exception; it does not relicense Mallside as GPL.

- [Bundled asset license](dist/assets/character/LICENSE-CC0.md)
- [MPFB scope notice](dist/assets/character/LICENSE-MPFB-scope.md)
- [Source paths and SHA256 provenance](dist/assets/character/provenance.json)
- [Detailed conversion and attribution record](docs/human-assets-v23.md)
- Official licenses: https://github.com/makehumancommunity/makehuman/blob/master/LICENSE.ASSETS.md and https://github.com/makehumancommunity/mpfb2/blob/master/LICENSE.md

## Product photographs, product designs and retailer information

Product photographs under `dist/assets/photos/` and other legacy product-image paths are sourced from the brands, retailers or documented suppliers listed in `dist/product-photos.js`, seed data and the research records. Photo-derived color/texture metadata and product-shaped game interpretations also refer to those real products.

**No blanket reproduction, redistribution or commercial image license is recorded for these photographs.** A public product page or a source citation does not establish that permission. Inclusion in this project is not a grant of third-party rights to another user. These assets must not be represented as original Mallside photography or exclusive Mallside property. Permission, license terms, an applicable legal basis, and any product-design rights require individual review before commercial use or wider relicensing.

[`docs/ASSET_INVENTORY.json`](docs/ASSET_INVENTORY.json) records the runtime photo index, source URLs, file hashes and a `permission-not-recorded` status. It also lists legacy images without a matching current photo-index record, so they are not silently assumed cleared. This is provenance and a clearance worklist, not a legal clearance certificate.

## Brands, mall names and maps

Referenced brand names, trademarks, logos, trade dress, product designs and mall identities belong to their respective owners. Mallside claims no ownership or trademark license for them. Source directory and product links establish factual research, not affiliation or permission. Mall geometry is an adapted game interpretation, not an official surveyed plan. Research references are retained in `docs/`.

## Google Fonts — remotely delivered

`dist/styles.css` requests DM Sans and Manrope through Google Fonts, with local/system fallbacks. The repository does not bundle those font binaries. The font projects use the SIL Open Font License; consult their own notices if self-hosting:

- DM Sans: https://github.com/google/fonts/tree/main/ofl/dmsans
- Manrope: https://github.com/google/fonts/tree/main/ofl/manrope

Google receives normal network request information when these remote fonts load. See [privacy information](PRIVACY.md).

## esbuild — development-only MIT compiler

Pinned esbuild 0.28.2 generates the public minified browser artifact. It is a development dependency, not a browser service or the game license. Its own MIT license is retained by npm in `node_modules/esbuild/LICENSE.md` (or `LICENSE`, depending on package layout). Source: https://github.com/evanw/esbuild. The generated application retains the runtime library and graphical-asset notices above.

## Development tools and GitHub Actions

Node.js, Python, optional photo-research tools and GitHub Actions are installed or run separately; they are not game ownership claims. Actions retain their own licenses. `scripts/README.md` distinguishes the release tools from historical research scripts.

## v43 official watch references

Four exact-SKU TAG Heuer Formula 1 Date product references and matching official photographs were checked on 30 October 2026. Source URLs, selected SKU, offer qualifications and photograph hashes are recorded in `docs/research-v43/catalog-evidence.json` and the asset inventory. The photographs retain third-party rights; permission is not recorded. Original game watch geometry, comparison furniture and sculpture details are Mallside interpretations, not representations of official branch interiors or current stock.

## v44 official bag references

Four selected MCM SKU photographs and source references were checked on 30 October 2026. Source URLs, offer qualifications, photograph hashes and reviewed body regions are recorded in `docs/research-v44/catalog-evidence.json` and the asset inventory. Photograph permission is not recorded. Bag geometry, inferred axes, material studies, photo kiosks and motion are original game interpretations; local stock, real return eligibility, capacity and physical fit are not asserted.
