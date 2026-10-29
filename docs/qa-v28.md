# v28 save recovery QA

Tested 28 October 2026 against the compiled production game at the `/Mallside/` prefix. This release changes browser-local persistence and recovery controls; it retains save schema 6 and the original primary keys.

## Automated regression coverage

Passed **356/356 tests**, including all 25 new save-recovery regressions. Source checks and the 1,977-file production artifact check passed.

`node --test --test-concurrency=2 tests/*.test.mjs` covers the existing campaign, catalog, economy, stories, rooms, routes and rendering regressions, plus 25 new save-recovery tests. The new cases cover:

- Original version 1–6 bytes and migrations, including early v1 saves without purchases; schema-6 receipts and rewards retain their identity.
- First backup creation, one-generation rotation, unchanged writes and independent mode keys.
- Truncated/invalid/future saves, unreadable core history, invalid receipts, wrong-mode saves, missing primaries and corrupt/checksum-mismatched backups.
- Read denial, backup/primary quota failures, protected primaries, retries and invalid in-memory snapshots.
- Stale-tab writes, stale restore reviews, confirmed replacements, manual-restore undo, exact backup retention and other-mode preservation.
- Restored purchase/reward history and prevention of repeated mission credit or overnight income.

## Compiled Chromium checks

Isolated localhost test data was used; public player saves were not injected or modified.

| Flow | Result |
| --- | --- |
| Healthy existing boot seeds backup without rewriting primary | Passed |
| Damaged boot blocks gameplay, hidden navigation, visibility and unload autosaves | Passed |
| Review/cancel/confirm backup restoration preserves day, wallet, purchase and completed chapter | Passed |
| Recovered game sleeps once; reload does not duplicate income | Passed |
| Player options exposes manual backup review | Passed |
| Invalid JSON remains editable; valid import requires summary and confirmation | Passed |
| No usable backup: exact damaged bytes download and reviewed JSON import | Passed |
| Fresh-start cancellation retains raw damage; confirmation changes only selected mode | Passed |
| Opening free shop leaves damaged career unchanged | Passed |
| Denied storage shows recovery; empty retry does not silently start a game | Passed |
| Failed write preserves primary and shows warning; pending progress saves after storage recovers | Passed |
| A second tab changes progress; stale tab pauses and explicitly loads latest copy | Passed |
| 390 × 844 and desktop recovery layout, no horizontal overflow | Passed |
| Import textarea participates in dialog Tab loop; Escape returns to recovery | Passed |

Desktop and phone-sized recovery screenshots were inspected for clipped text and controls. Resizing a desktop browser is not physical mobile-device certification.

Safari and Firefox’s v27.0.1 gameplay matrix is recorded in [browser QA](qa-v27-browsers.md). The initial 28.0.0 checks above used Chromium. The [28.0.1 native matrix](qa-v28-browsers.md) now covers all recovery flows in Safari and Firefox, including the Safari keyboard fix. Safari automation was turned off and the temporary Firefox installation removed after those checks. Physical iOS/Android and broader assistive-technology testing remain roadmap work.

## Release gates

Source syntax, relative links, notices and current asset inventory must pass `npm run check`. Generate the bundle with `npm run build` and validate it with `npm run check:public`. The main-branch GitHub Pages workflow repeats the checks and tests before publication; verify the public `release.json` version and exact source commit after deployment.
