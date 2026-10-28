# GitHub migration QA — 23.0.1

Scope: preserve the v23 game while importing it into the standalone GitHub repository, document rights and provenance, and publish `dist/` under the `/Mallside/` project path.

The game source, catalog, assets and tests were copied from the clean v23 snapshot recorded in [migration provenance](MIGRATION.md). UI changes add menu/footer links opening the independent rights/privacy page, with a refreshed entry-module cache key. No economy or save-format migration is introduced.

Release checks validate JavaScript syntax, relative module/HTML/CSS paths, local documentation links, matching repository/shipped notices, file-size limits, and every recorded product-photo hash. The inventory includes 1,934 photo-index records referencing 1,912 files, plus 42 older unindexed images. Those images are explicitly marked as lacking recorded permission; passing a technical check does not establish legal clearance.

The imported regression suite passed **274/274** tests on Node.js v26.0.0 (24.9 seconds). Release checks passed for **72 browser modules and 262 local references**, all shipped notices and the current photograph hashes. A high-confidence credential-pattern scan found no matching token/private-key patterns in the imported tree.

The local `/Mallside/` preview returned HTTP 200, rendered the existing 3D save, paused correctly, displayed the product catalog and opened Rights & privacy from the footer. Runtime warning/error logs were empty. The separate legal page exposes the full game terms, independent notices and privacy text. The previous source checkout and its deployed save were not changed. Remote checks and deployment are recorded in GitHub Actions for the published commit. Previous v23 visual/fit coverage and its limits remain in [v23 QA](qa-v23.md). Local checks use Chromium through the in-app browser, not a certification of every physical mobile device or Safari/Firefox.


## Private-source publication — 23.0.2

The private clone was relocated to `/Users/youknowjp/Documents/Personal PR/Mallside`. The full regression suite passed 274/274 tests (Node.js v26.0.0, 28.3 seconds). Source release checks passed for 72 browser modules, 265 local references and the photograph/notice inventory. The production build passed its artifact checks: 1,976 public files, one minified ES-module bundle, complete product photographs and licenses, and no source maps, editable module tree, tests, research, Git metadata or anatomical conversion inputs.

The generated-only local preview rendered the existing saved outfit and walking wardrobe preview, with no failed product images and no warning/error console entries. The new source workflow runs these checks on GitHub before copying the verified artifact to the separate public hosting repository. Remote runs and the public `release.json` provide the publication record. The source is private; browser-delivered code/data/images remain inspectable by players.


## Single-repository Pages preparation — 25.0.2

Before changing source visibility, Gitleaks 8.30.1 scanned all seven existing Git commits. Its 39 generic-key findings were reviewed: all were catalog `assetKey` or mall-directory `key` identifiers, with no credential rules otherwise matching. The logs of all six completed source workflows also scanned without findings. This is a bounded scan, not a guarantee about undetectable secrets.

The full game regression suite passed 309/309 tests (Node.js v26.0.0, 41.0 seconds). Release checks passed for 77 browser modules and 293 local references. The production artifact check passed for 1,977 files, all 1,934 photo references, notices and one minified application bundle. The game bundle remains `app-Z7J5IDO3.js`; this update changes hosting and documentation, not gameplay or save keys. The asset inventory change is its release label only.

The replacement workflow uploads `build/site/Mallside/` as the project Pages root, waits for successful checks, and deploys with short-lived built-in credentials. Pull requests cannot publish. The old cross-repository copy script is removed. Verify the new main-branch Actions run and public `release.json` before retiring the previous host; record those remote results in the completion report.
