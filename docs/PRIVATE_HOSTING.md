# Private source, public game

The canonical source is the **private** `YouKnowJP/Mallside` repository. The local clone is `/Users/youknowjp/Documents/Personal PR/Mallside`.

The public game keeps its address: https://youknowjp.github.io/Mallside/.

GitHub Free does not host Pages directly from a private repository. Instead, `YouKnowJP/YouKnowJP.github.io` hosts only generated browser files in its `Mallside/` folder. It contains no editable game-module tree, source maps, development tests, research documentation or private source history. The original source repository and its history remain private. Browser-delivered JavaScript, CSS, data and images are necessarily public; minification is not DRM or a promise of secrecy.

## Automatic publishing

A push to private `main` runs the release checks and regression suite, then `npm run build` and `npm run check:public`. The latter verifies one minified application bundle, no development tree or source maps, complete product photos and matching legal notices. Content hashes in JS/CSS filenames refresh changed assets without changing the play URL.

A trusted main-branch job copies only that verified artifact to the public hosting repo and pushes it. The hosting repo's standard GitHub Pages branch deployment then updates the public site. Pull requests run checks/builds but cannot publish. No source repo token or private files are put in the public artifact.

The private repository secret `MALLSIDE_PAGES_DEPLOY_KEY` is an SSH key whose public counterpart is a write deploy key **only on the public hosting repository**. It cannot grant source-repository access. The private key is stored encrypted by GitHub Actions and is never committed. To rotate it, create a new dedicated hosting deploy key, replace the Actions secret, verify a publish, then remove the old public key. Removing the key/secret stops automatic publishing but does not remove the last deployed game.

Watch the private repo's **Check and publish Mallside** workflow, then the public hosting repo's Pages deployment. `Mallside/release.json` reports the exact tested source commit and production bundle. Keep the same Pages path to preserve player storage. Do not enable Pages on the private source repo unless the account is later upgraded and the hosting design is intentionally changed.

## Local release commands

Use Node.js 22+ and Python 3. First run `npm ci` for the pinned development bundler. Run `npm start` for the editable game, `npm run check` and `npm test` for validation, then `npm run build` and `npm run check:public` for the production artifact. The generated output is `build/site/Mallside/`; it is ignored by Git in the private source checkout. Do not serve or publish the source repository root.

Source privatization does not recall earlier downloads, caches or independently retained copies. Prior rights and independent third-party licenses still apply. See RIGHTS.md and THIRD_PARTY_NOTICES.md.
