# Develop and deploy

Canonical repository: https://github.com/YouKnowJP/Mallside

Public game: https://youknowjp.github.io/Mallside/

## Local commands

Use Node.js 22+ and Python 3. There are no npm dependencies or compilation steps.

```sh
npm start
npm run check
npm test
```

`npm start` serves `dist/` at `http://127.0.0.1:4317/`. Do not serve the entire repository as a public web root. Research, tests and private local files do not belong in the hosted artifact.

`npm run check` verifies JavaScript syntax, local static references, documentation links, shipped legal notices and the asset inventory. `npm test` runs the Node regression suite. `npm run inventory` refreshes the deterministic photograph provenance/hash inventory after an intentional asset change; review its diff before committing. Neither command downloads or licenses images.

## GitHub Pages

`.github/workflows/pages.yml` runs on pushes to `main`, pull requests, and manual dispatch. The check job runs before publication. Only `main` pushes or manual runs on `main` can deploy. Pull-request code receives read-only repository permissions and cannot publish. The deployment job uses the `github-pages` environment and publishes **only `dist/`** through the official Pages actions. No PAT or repository secret is embedded in game files.

Repository settings must have **Settings → Pages → Source: GitHub Actions** selected. The published repository retains its existing public visibility. The migration configures this setting using the owner's authenticated GitHub access. The owner can monitor a run in [Actions](https://github.com/YouKnowJP/Mallside/actions).

After a change:

1. Run the checks and relevant local visual tests.
2. Commit the reviewed source/assets and notices together.
3. Push to `main` (or merge an approved PR).
4. Wait for both the check and deploy jobs to succeed.
5. Open the public URL, start a game, and check the changed flow and console.

GitHub Pages project URLs include `/Mallside/`. All app paths must stay relative. `dist/.nojekyll` also permits a plain static deployment if the hosting method changes. There is no service worker to clear. A browser refresh loads the published HTML; gameplay imports retain explicit version query strings.

## Rollback

Revert the faulty commit and push the revert to `main`; the same workflow tests and publishes it. Preserve save compatibility when possible. Do not force-push away the migration or ownership record. A rollback cannot recover browser data that a player already cleared.

## Earlier deployment and local checkout

The earlier game remains at https://mallside-shopping-life.youknowjp.chatgpt.site/. This migration does not change that deployment or overwrite its players' saves. Export/import is required to transfer progression to GitHub Pages; local photo binaries do not move with JSON backups.

The earlier `Mallside/` workspace checkout is retained as the existing Sites deployment checkout. `Mallside-GitHub/` is the canonical GitHub checkout created during migration. Work on the latter for GitHub releases. `.openai/` hosting identity, credentials and deployment archives are excluded from this repository; no hosting secret is required by GitHub Pages.
