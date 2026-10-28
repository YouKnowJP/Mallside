# Release and migration QA

## Free-play permissions update — 26.0.1

Clarified the proprietary license and added the repository/shipped permissions guide while preserving GitHub platform rights, prior valid grants and independently licensed material. Added a retained ownership banner and license/official-play metadata to production output, aligned player-facing notices and corrected the retired feedback URL. The provided workflow only uploads/deploys Pages from the canonical repository; fork checks remain available. Gameplay, catalog/photo hashes, save keys and hosting visibility remain unchanged.

Source checks passed for all 80 browser modules, local references and matching notices. The isolated production candidate passed artifact verification for 1,977 files, all 1,934 photo references and one generated script. Four injected cases (altered license, altered permissions guide, missing bundle banner and incorrect official URL) were rejected, and the restored candidate passed.

The generated rights page was reviewed at 390 × 844 with no horizontal overflow; the guide link opened and ASCII text avoids charset ambiguity on static text responses. Returning to the game and continuing a fresh local career opened the 3D Orange mall without an account, payment or new consent gate. Console warning/error logs were empty. The normal main-branch workflow reruns the full regression suite before publication. These checks establish notice consistency and playability, not legal enforceability, complete ownership or technical copy prevention.

## Previous gameplay update — 26.0.0

The [v26 QA record](qa-v26.md) covers the new local stories, owned-product collection room, outfit preparation, guestbook, visual refinements and compiled-browser checks. The existing direct GitHub Pages workflow tests and publishes the final main-branch source. Migration records below are historical.

## Migration cleanup — 25.0.3

Validated on 28 October 2026. The active source and publishing repository is public `YouKnowJP/Mallside`; `Personal-Project` remains a separate private repository for Tilewright and other projects.

- Restored the missing local `Personal-Project` Git metadata after verifying all 392 tracked files matched remote commit `c1c7534e4641e0385293af004d1c5c7346e0a920`. No tracked project files were overwritten. Its repository catalog check passed for 392 files and 1,503 local references.
- Confirmed no tracked Mallside paths, Mallside workflow, deployment key or secret remains in `Personal-Project`. Mallside has no deployment keys, required Actions secrets or repository variables; its Pages source is the same-repository workflow.
- Moved retired hosting notes under `docs/history/`, clarified the chronology in the migration record and changelog, refreshed the current documentation index and distinguished editable `dist/` from generated `build/site/Mallside/`.
- Removed obsolete publisher workspace rules, two fully merged local branches and four generated `public-game` artifacts from the retired publisher. Source commits, rights notices, current Pages artifacts and player save keys were preserved.
- Preserved 486 older temporary entries (research, logs, deployment snapshots and scratch directories; about 1,135 MiB) in one owner-only local archive outside both Git checkouts. The archive contains a manifest of original paths, sizes and file counts and is not part of either repository or deployment.

The full game regression suite passed **309/309** tests (33.2 seconds). Release checks passed for **77 browser modules and 295 local references**, including the relocated documentation. The photograph inventory diff changes only its release label; product files and hashes remain unchanged.

A disposable packaging probe retained two legitimate files, filtered seven macOS/Windows metadata paths, and verified that anatomical conversion inputs stay excluded. Five separately injected metadata cases made the artifact checker fail with the expected reason. All probes were removed and the final build verified **1,976 generated files** with all 1,934 photo references, required notices and one minified script. The script is still `app-Z7J5IDO3.js`; gameplay code is unchanged. Finder can recreate ignored metadata in local folders; the build filter and public-artifact check prevent it from being silently included in a release.

Publish this cleanup through the normal tested `main` workflow. The public `release.json` must match the successful source commit before reporting the release live.

## Historical validation records

The records below describe earlier releases and hosting arrangements. Current operating instructions are in `DEPLOYMENT.md`; retired private-source hosting notes are in `history/HOSTING.md`.

Scope: preserve the v23 game while importing it into the standalone GitHub repository, document rights and provenance, and publish `dist/` under the `/Mallside/` project path.

The game source, catalog, assets and tests were copied from the clean v23 snapshot recorded in [migration provenance](MIGRATION.md). UI changes add menu/footer links opening the independent rights/privacy page, with a refreshed entry-module cache key. No economy or save-format migration is introduced.

Release checks validate JavaScript syntax, relative module/HTML/CSS paths, local documentation links, matching repository/shipped notices, file-size limits, and every recorded product-photo hash. The inventory includes 1,934 photo-index records referencing 1,912 files, plus 42 older unindexed images. Those images are explicitly marked as lacking recorded permission; passing a technical check does not establish legal clearance.

The imported regression suite passed **274/274** tests on Node.js v26.0.0 (24.9 seconds). Release checks passed for **72 browser modules and 262 local references**, all shipped notices and the current photograph hashes. A high-confidence credential-pattern scan found no matching token/private-key patterns in the imported tree.

The local `/Mallside/` preview returned HTTP 200, rendered the existing 3D save, paused correctly, displayed the product catalog and opened Rights & privacy from the footer. Runtime warning/error logs were empty. The separate legal page exposes the full game terms, independent notices and privacy text. The previous source checkout and its deployed save were not changed. Remote checks and deployment are recorded in GitHub Actions for the published commit. Previous v23 visual/fit coverage and its limits remain in [v23 QA](qa-v23.md). Local checks use Chromium through the in-app browser, not a certification of every physical mobile device or Safari/Firefox.


### Private-source publication — 23.0.2

The private clone was relocated to `/Users/youknowjp/Documents/Personal PR/Mallside`. The full regression suite passed 274/274 tests (Node.js v26.0.0, 28.3 seconds). Source release checks passed for 72 browser modules, 265 local references and the photograph/notice inventory. The production build passed its artifact checks: 1,976 public files, one minified ES-module bundle, complete product photographs and licenses, and no source maps, editable module tree, tests, research, Git metadata or anatomical conversion inputs.

The generated-only local preview rendered the existing saved outfit and walking wardrobe preview, with no failed product images and no warning/error console entries. The new source workflow runs these checks on GitHub before copying the verified artifact to the separate public hosting repository. Remote runs and the public `release.json` provide the publication record. The source is private; browser-delivered code/data/images remain inspectable by players.


### Single-repository Pages preparation — 25.0.2

Before changing source visibility, Gitleaks 8.30.1 scanned all seven existing Git commits. Its 39 generic-key findings were reviewed: all were catalog `assetKey` or mall-directory `key` identifiers, with no credential rules otherwise matching. The logs of all six completed source workflows also scanned without findings. This is a bounded scan, not a guarantee about undetectable secrets.

The full game regression suite passed 309/309 tests (Node.js v26.0.0, 41.0 seconds). Release checks passed for 77 browser modules and 293 local references. The production artifact check passed for 1,977 files, all 1,934 photo references, notices and one minified application bundle. The game bundle remains `app-Z7J5IDO3.js`; this update changes hosting and documentation, not gameplay or save keys. The asset inventory change is its release label only.

The replacement workflow uploads `build/site/Mallside/` as the project Pages root, waits for successful checks, and deploys with short-lived built-in credentials. Pull requests cannot publish. The old cross-repository copy script is removed. Verify the new main-branch Actions run and public `release.json` before retiring the previous host; record those remote results in the completion report.


The first automatic direct Pages run, [40748600493](https://github.com/YouKnowJP/Mallside/actions/runs/40748600493), passed both jobs and served source commit `9aa452864c07671b1622666bf686c988b2d1b1f1` at the unchanged public URL. Fourteen live entry/style/script/photo/character-texture/notice URLs returned HTTP 200; development-file and double-nested game paths returned 404 as expected. The live browser loaded the main menu, continued the existing save, opened the mall and displayed catalog products/prices. No purchase or save reset was performed. The obsolete publishing secret was then removed. The previous hosting repository and old nested local Sites checkout were already absent at final verification; neither was deleted by this migration. A normal follow-up documentation push verifies the same automatic publishing path after credential cleanup.
