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

Except for individually licensed photographs identified below, **no blanket reproduction, redistribution or commercial image license is recorded for these photographs.** A public product page or a source citation does not establish that permission. Inclusion in this project is not a grant of third-party rights to another user. These assets must not be represented as original Mallside photography or exclusive Mallside property. Permission, license terms, an applicable legal basis, and any product-design rights require individual review before commercial use or wider relicensing.

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

## v45 activewear source photographs

Four exact-SKU Fabletics photographs are referenced by the v45 catalog. Official selected-color page and image-service provenance, source/runtime hashes and reviewed crop regions are recorded in docs/research-v45/catalog-evidence.json and docs/ASSET_INVENTORY.json. Fabletics and its respective rights holders retain rights in their photographs and marks; inclusion is not a record of commercial permission. Studio fixtures, flower props and game animations are original Mallside interpretations.

## v46 tailoring source photographs

Four exact selected-color Sandro US packshots are referenced by the v46 catalog. Official page/image provenance, dated offers, source/runtime hashes and reviewed fabric regions are recorded in docs/research-v46/catalog-evidence.json and docs/ASSET_INVENTORY.json. Sandro and the respective rights holders retain their photographs and marks; commercial permission is not recorded. Tailoring fixtures, tea counters, recipe cards and game motion are original Mallside interpretations, not exact branch interiors or real stock/fit/return claims.

## v47 collectible source photographs

Four exact Hot Topic US photographs of Sanrio Japan Originals collectibles are referenced by the v47 catalog. Source pages, selected image URLs, qualified dated offers and source/runtime hashes are recorded in docs/research-v47/catalog-evidence.json and docs/ASSET_INVENTORY.json. Hot Topic, Sanrio and the respective rights holders retain their photographs, characters and marks; commercial permission is not recorded. Solid models, collector fixtures, mosaic/notebook details and motion are original adapted game interpretations, not measured replicas, surveyed interiors or real inventory/fit/return guarantees.

## v48 ceramic source photographs

Four selected Arhaus US ceramic photographs are referenced by the v48 catalog. Exact source pages, selected SKUs, dated prices, dimensions and photo hashes are recorded in docs/research-v48/catalog-evidence.json and docs/ASSET_INVENTORY.json. Manton uses a merchant-assigned shared hero image whose historical filename differs from the selected Small SKU; this is explicitly qualified. Arhaus and the respective rights holders retain their photographs and marks; commercial permission is not recorded. Hollow ceramic models, glaze studios, garden details and inspection motion are original adapted game interpretations, not measured replicas, surveyed interiors or real branch inventory/return guarantees.

## v49 tableware source photographs

Four selected single-item Sur La Table US porcelain photographs are referenced by the v49 catalog. Exact product/variant pages, SKUs, selected-image URLs, dated offers, qualified dimensions/capacities and source/runtime photo hashes are recorded in docs/research-v49/catalog-evidence.json and docs/ASSET_INVENTORY.json. Mug and cereal bowl references use the selected single-item SKU photographs, rather than set photographs. Sur La Table and the respective rights holders retain their photographs and marks; commercial permission is not recorded. Hollow models, interpreted unlabeled dimensions, tableware fixtures, water stations and motion are original adapted game interpretations, not measured replicas, surveyed interiors or real inventory/capacity/return guarantees.

## v50 paper source photographs

Four exact English paperback covers from Kinokuniya USA and three fixed Erin Condren B6 notebook packshots are referenced by the v50 catalog. Official product pages, exact ISBNs or merchant product references, dated standard USD offers, published specifications, reviewed crops and source/runtime hashes are recorded in docs/research-v50/catalog-evidence.json and docs/ASSET_INVENTORY.json. The retailers, publishers, authors/artists and respective rights holders retain their photographs, artwork, characters and marks; commercial permission is not recorded. Book text and merchant interior-page artwork are not reproduced. Neutral spines/backs, sample pages, fixtures, noticeboards and motion are original adapted Mallside art, not measured replicas, surveyed branches or real stock/paper-performance/return guarantees.


## v51 garden and storage references

Six selected product references and source photographs from Terrain and The Container Store were checked on 3 November 2026. Exact SKUs, selected formats, qualified USD offers, photo URLs and hashes are recorded in docs/research-v51/catalog-evidence.json. Terrain photographs may show multiple sizes and plants; Container Store photographs may show shoes. Those extra contents are not merchant inventory in Mallside. Planter marks, storage geometry, studio foliage, guest-service tools and wrapping props are original adapted game art. Branch pages establish merchant presence, not surveyed interiors or local stock. Existing third-party photo/design rights remain with their respective owners; source links do not establish reproduction or commercial redistribution permission.

## v60 licensed H1n photograph

`dist/assets/photos/v60-real-zoom-h1n.webp`: **Grabadora Zoom H1n encendida.jpg**, by **Luisalvaz**, own work, licensed **CC BY-SA 4.0**. Source: https://commons.wikimedia.org/wiki/File:Grabadora_Zoom_H1n_encendida.jpg (reviewed revision 1285898458). Original image: https://upload.wikimedia.org/wikipedia/commons/2/26/Grabadora_Zoom_H1n_encendida.jpg . License: https://creativecommons.org/licenses/by-sa/4.0/ . Changes: orientation normalized, resized to 900 × 1200 pixels and encoded as WebP, without cropping. This adapted photograph remains available under CC BY-SA 4.0, independently of the game’s proprietary code and original geometry. No author, manufacturer or retailer endorsement is implied. Full attribution and provenance are retained in docs/research-v60/catalog-evidence.json and the asset inventory.

H1n and the specifications-only H4n Pro comparison are discontinued model references. Manufacturer specifications inform original simplified geometry and an original comparison studio; the game does not reproduce a measured sonic comparison or record microphones.
