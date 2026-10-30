# Scripts

Normal players need none of these tools. Local development uses `dist/`; production publishes generated `build/site/Mallside/` files. See `docs/DEPLOYMENT.md`.

## Supported release commands

- `npm ci`: install the pinned development bundler.
- `npm run build` and `npm run check:public`: create and verify the generated game artifact without source maps, development files or file-manager metadata. Verification also enforces matching license/permissions notices, the retained ownership banner and official-play/license metadata. For an isolated local preview, `npm run check:public -- /absolute/path/to/game` verifies the same rules against a copied artifact; CI retains the default output path.

- `npm run check` / `check-release.mjs`: offline syntax, local static-reference, documentation-link, notice and photo-inventory validation. Uses Node's standard library.
- `npm run inventory` / `create-asset-inventory.mjs`: rebuilds `docs/ASSET_INVENTORY.json` from the actual runtime photo index and on-disk hashes. Uses Node's standard library. It does not download assets or establish permission.
- `prepare-human-assets.py`: deterministic CC0 anatomy conversion from retained local inputs. Uses Python's standard library; see `docs/human-assets-v23.md`.
- `export-merchandise-references.mjs` / `export-product-surfaces.mjs`: export the retained runtime references for analysis.
- `analyze-merchandise-colors.py` / `analyze-product-surfaces.py`: optional source-photo analysis, requiring separately installed Pillow; see the corresponding versioned design notes. They do not rewrite the source rasters.

## Native Safari and Firefox QA

`npm run test:browser -- --browser=safari --driver=http://127.0.0.1:4444` runs the compiled-game flow matrix through a running native W3C driver. Build first with `npm run build`, then serve `build/site` on `127.0.0.1:4318`; the game must be reachable at `http://127.0.0.1:4318/Mallside/`.

Start Apple's `safaridriver --port 4444` only after enabling remote automation with the developer's approval. Keep the automated Safari window visible: the game intentionally pauses when hidden. The test runner never enables that setting itself.

For Firefox, start Mozilla's `geckodriver --port 4445`, then use `npm run test:browser -- --browser=firefox --driver=http://127.0.0.1:4445 --binary=/absolute/path/to/firefox --headless=true`. Without `--headless=true`, leave Firefox visible. Use an official browser and driver compatible with it. Existing installed Firefox can be selected by the driver when `--binary` is omitted.

These commands create disposable sessions and synthetic saves and refuse non-local endpoints. Do not point them at a personal browser profile. They exercise UI actions and actual WebGL rendering, retain the existing hidden-window pause, and write reports/screenshots to ignored `build/qa/`. `--base=http://127.0.0.1:4318/Mallside/` selects another local served prefix; `--session=... --keep=true` is available for an already isolated developer session. Close kept sessions afterward. No extra JavaScript dependency is installed.

The runner handles Safari's native scrolling/click timing and falls back from element screenshots to its supported whole-window screenshot API. See [recorded native-browser QA](../docs/qa-v27-browsers.md).

## Native save-recovery QA

After the same build/server/driver setup, run `npm run test:recovery -- --browser=safari --driver=http://127.0.0.1:4444`, or select Firefox with `--browser=firefox --driver=http://127.0.0.1:4445 --binary=/absolute/path/to/firefox --headless=true`.

[The recovery runner](save-recovery-browser-qa.mjs) always creates its own disposable WebDriver session and refuses non-local endpoints. It seeds synthetic career/free-shop saves, checks versions 1–6, failed writes, damaged/missing saves, reviewed replacements, mode isolation, real cross-tab conflicts, night-transition idempotence, keyboard focus and responsive recovery layout. Download checks capture the actual generated Blob payload before the operating-system save step, avoiding files in a personal Downloads folder. Error capture, screenshots, browser capabilities and reports go to ignored `build/qa/`.

Enable Safari automation only for the authorized test run, and turn it off afterward. If Firefox was downloaded solely for testing, stop its sessions/driver, unmount its disk image and remove its temporary app, archive, profiles, logs and QA artifacts. Preserve pre-existing browser profiles and unrelated projects’ files. Neither runner installs a browser or changes Safari security settings.

## Historical research tools

The remaining Python download, expansion, assembly and optimization scripts are retained as research provenance for earlier catalog schemas. They are **not** part of installation, CI, deployment or the supported release process. Some expect old JSON fields, research inputs in temporary directories, Pillow or a machine-specific `cwebp` executable. Do not run them blindly against the current catalog. Review their input/output schema and rights before adapting them. Existing prepared assets are sufficient to run and test the game without network access.

Source URLs document where material was researched; they do not grant permission to download, redistribute or commercialize it. Update the asset inventory and notices after any intentional asset change.


## Native shared-activity and shopping QA

After the same compiled build/server/driver setup, run `node scripts/gameplay-browser-qa.mjs --browser=safari --driver=http://127.0.0.1:4444`, or use `--browser=firefox --driver=http://127.0.0.1:4445 --binary=/absolute/path/to/firefox --headless=true`. The runner creates disposable localhost sessions and synthetic saves, exercises both activities for every local, and checks the 3D shopping loop, movement/release, shop exits, court routing, fullscreen, responsive search and the game menu. Safari windows are constrained to the available display; its final button checks use native Enter activation to avoid inconsistent SafariDriver mouse delivery. Firefox uses native element clicks. Native keyboard movement and strict game/renderer error capture remain enabled. Prefer running the large Node suite before native browsers to avoid memory pressure. `--only=shared --person=noor` isolates a shared-activity case for diagnosis. `--only=core`, `--only=commons` and `--only=visual` split the earlier 28 checks into the existing gameplay, v32 discovery/shop and v33 presentation groups (each repeats strict error capture). `--only=places` adds the three v34 waystation/shop/animation scenarios (31 distinct checks in the full run). Run browser render suites serially to avoid GPU contention. The named groups can use separate disposable sessions when a long profile run accumulates navigation/render state; report distinct coverage and retries explicitly. the v33 group checks reflection/contact lighting, camera/guide persistence, route clearing, evening indoor layouts, portraits and dressed room close-ups. Reports/screenshots stay in ignored `build/qa/`; complete the Safari/temporary-Firefox cleanup described above after the run.


## Native matrix isolation

`node scripts/gameplay-browser-qa.mjs --list=true` lists the exact scenario names without opening a browser. `gameplay-native-matrix.mjs` runs each scenario in a fresh WebDriver session, with native inputs and strict error capture. Supply `--browser=safari|firefox`, localhost `--base`/`--driver`, and an explicit `--binary` for a temporary Firefox app. `--resume=true` reuses only reports matching the same release, styles and test source. Reports stay under ignored `build/qa`; the runner neither downloads browsers nor changes Safari settings. Restore Safari automation and remove owned browser profiles/artifacts after validation.

When a native window starts occluded, `--await-foreground=true` pauses the matrix's first fresh session at its fixture page. It writes `build/qa/<browser>-foreground-ready.json`; after restoring that actual window, create `build/qa/<browser>-foreground-go` to continue. Old checkpoint files are removed before the run. Visibility and game time remain real; the script does not override either. Scenario logs stream while running, and versioned scenarios run newest first.

`--reuse-window=true` retains one owned WebDriver window while each scenario still navigates through the fixture page, resets its synthetic save and reloads the compiled game. This avoids Stage Manager hiding each replacement browser process. The report distinguishes scenario count from unique sessions. Resume fingerprints include both runner sources and the isolation mode; the retained session is deleted in `finally`, including a failed scenario. The default still uses a fresh session per scenario. Keep the actual window visible in either mode.

For Firefox, `--headless=true` runs the actual browser without depending on desktop focus. The mode is included in fingerprints/reports. WebGL, native WebDriver input and the game's visibility checks remain active; no visibility or clock override is installed. Safari requires its real visible window.

Exact clock-cost assertions read the displayed game clock. Walking clock ticks can precede the next local-storage autosave, so a saved timestamp is not a reliable baseline for a paused product dialog. Purchase/refund/save assertions still inspect the stored state.
