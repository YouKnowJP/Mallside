# Scripts

Normal players need none of these tools. Local development uses `dist/`; production publishes generated `build/site/Mallside/` files. See `docs/DEPLOYMENT.md`.

## Supported release commands

- `npm ci`: install the pinned development bundler.
- `npm run build` and `npm run check:public`: create and verify the generated game artifact without source maps, development files or file-manager metadata.

- `npm run check` / `check-release.mjs`: offline syntax, local static-reference, documentation-link, notice and photo-inventory validation. Uses Node's standard library.
- `npm run inventory` / `create-asset-inventory.mjs`: rebuilds `docs/ASSET_INVENTORY.json` from the actual runtime photo index and on-disk hashes. Uses Node's standard library. It does not download assets or establish permission.
- `prepare-human-assets.py`: deterministic CC0 anatomy conversion from retained local inputs. Uses Python's standard library; see `docs/human-assets-v23.md`.
- `export-merchandise-references.mjs` / `export-product-surfaces.mjs`: export the retained runtime references for analysis.
- `analyze-merchandise-colors.py` / `analyze-product-surfaces.py`: optional source-photo analysis, requiring separately installed Pillow; see the corresponding versioned design notes. They do not rewrite the source rasters.

## Historical research tools

The remaining Python download, expansion, assembly and optimization scripts are retained as research provenance for earlier catalog schemas. They are **not** part of installation, CI, deployment or the supported release process. Some expect old JSON fields, research inputs in temporary directories, Pillow or a machine-specific `cwebp` executable. Do not run them blindly against the current catalog. Review their input/output schema and rights before adapting them. Existing prepared assets are sufficient to run and test the game without network access.

Source URLs document where material was researched; they do not grant permission to download, redistribute or commercialize it. Update the asset inventory and notices after any intentional asset change.
