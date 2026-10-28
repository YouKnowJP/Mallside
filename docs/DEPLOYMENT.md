# Develop and deploy

Mallside uses one active repository: **[YouKnowJP/Mallside](https://github.com/YouKnowJP/Mallside)**. It contains the publicly readable source and the GitHub Pages workflow. The local clone is `/Users/youknowjp/Documents/Personal PR/Mallside`. `Personal-Project` is independent and contains Tilewright and other projects.

**Play:** https://youknowjp.github.io/Mallside/. Players need only this link; no account, install or payment is required.

## Local development and production build

Use Node.js 22+ and Python 3. Run these commands from the Mallside clone:

```sh
npm ci
npm start
```

Open http://127.0.0.1:4317/. The editable application is `dist/`; do not serve the repository root.

Before release:

```sh
npm run check
npm test
npm run build
npm run check:public
```

The ignored `build/site/Mallside/` directory is the complete production game. It contains one minified, content-hashed application bundle, hashed styles, local photographs and required notices. The artifact checker verifies these dependencies, the release metadata and the absence of source maps and development directories. The source remains available in GitHub independently of the optimized game artifact. `package.json`'s `private: true` prevents accidental npm publication; it does not control GitHub visibility.

## Automatic publishing

Repository **Settings → Pages → Build and deployment → Source** must be **GitHub Actions**. The repository is public so it can use Pages on GitHub Free. Making it private on an ineligible plan would unpublish the site.

Every push to `main` runs **Check and publish Mallside** in `.github/workflows/pages.yml`. It installs the locked development bundler, checks the source and notices, runs the regression suite, builds and validates the game, then uploads a Pages artifact. The deployment job waits for all those checks. Pull requests run checks and builds without publishing. The main workflow also supports a manual **Run workflow** on `main`.

Upload **`build/site/Mallside` itself**, not its parent `build/site`: Pages adds the project prefix `/Mallside/`. Uploading the parent would produce an incorrect `/Mallside/Mallside/` nesting. Keep all browser asset links relative.

The `github-pages` environment and GitHub's short-lived `GITHUB_TOKEN`/OIDC perform deployment. Only the publish job has `pages: write` and `id-token: write`. There are no cross-repository credentials, hosting deploy keys or required repository secrets. Workflow concurrency serializes publishing for each branch; failed checks leave the previous working site intact.

## Verify and roll back

1. Check both jobs in the repository's Actions tab.
2. Open the public play link in a browser and inspect `release.json` under that URL. Its `sourceCommit` must match the successful `main` commit; `sourceVisibility` is `public`.
3. Check that the entry script, styles, product images and rights links load from `/Mallside/`, and exercise the changed game flow.

For a content rollback, revert the relevant change on `main` and let the same checks and deployment run. Avoid changing the Pages path or save keys: keeping the same origin and path preserves existing browser progress. Export a save backup before moving devices or origins; outfit-photo binaries are not included in JSON backups.

## Retired hosting

The earlier generated-files-only `YouKnowJP/YouKnowJP.github.io` host is no longer needed or used for Mallside. The direct deployment was verified before removing the obsolete `MALLSIDE_PAGES_DEPLOY_KEY` source secret. The old hosting repository was unavailable (HTTP 404) at final verification, so no archive or deletion was performed by this migration. No second repository is an update destination. See [the hosting history](PRIVATE_HOSTING.md) and [migration record](MIGRATION.md).

The original Sites deployment is separate and is not updated by this workflow. Do not reintroduce its `.openai/` identity or credentials into this repository. Preserve the proprietary game license and all independent third-party notices.
