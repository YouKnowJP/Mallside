# GitHub migration QA — 23.0.1

Scope: preserve the v23 game while importing it into the standalone GitHub repository, document rights and provenance, and publish `dist/` under the `/Mallside/` project path.

The game source, catalog, assets and tests were copied from the clean v23 snapshot recorded in [migration provenance](MIGRATION.md). Gameplay changes are limited to a footer link opening the independent rights/privacy page. No economy or save-format migration is introduced.

Release checks validate JavaScript syntax, relative module/HTML/CSS paths, local documentation links, matching repository/shipped notices, file-size limits, and every recorded product-photo hash. The inventory includes 1,934 photo-index records referencing 1,912 files, plus 42 older unindexed images. Those images are explicitly marked as lacking recorded permission; passing a technical check does not establish legal clearance.

The imported regression suite passed **274/274** tests on Node.js v26.0.0 (24.9 seconds). Release checks passed for **72 browser modules and 262 local references**, all shipped notices and the current photograph hashes. A high-confidence credential-pattern scan found no matching token/private-key patterns in the imported tree.

The local `/Mallside/` preview returned HTTP 200, rendered the existing 3D save, paused correctly, displayed the product catalog and opened Rights & privacy from the footer. Runtime warning/error logs were empty. The separate legal page exposes the full game terms, independent notices and privacy text. The previous source checkout and its deployed save were not changed. Remote checks and deployment are recorded in GitHub Actions for the published commit. Previous v23 visual/fit coverage and its limits remain in [v23 QA](qa-v23.md). Local checks use Chromium through the in-app browser, not a certification of every physical mobile device or Safari/Firefox.
