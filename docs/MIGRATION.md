# GitHub migration provenance

Imported 28 October 2026 into https://github.com/YouKnowJP/Mallside.

**Current setup:** one public Mallside repository, direct GitHub Pages publishing, and the local clone at `/Users/youknowjp/Documents/Personal PR/Mallside`. `Personal-Project` contains Tilewright and other projects. Follow [DEPLOYMENT.md](DEPLOYMENT.md); the earlier stages below are provenance, not current deployment instructions.

## Source snapshot

- Prior game: Mallside v23.0.0, static site plus tests, research and conversion tooling.
- Source commit: `bdb432c10e343955547a4dfff7f1c15ed19b4207` from the existing Mallside deployment checkout.
- Prior deployed address: https://mallside-shopping-life.youknowjp.chatgpt.site/.
- Import method: copied tracked working-tree files from that exact clean snapshot; no dependency installation or game regeneration.
- The earlier long README is retained as `docs/GAME_GUIDE.md`; the new root README provides navigation and deployment instructions.
- Deployment-specific `.openai/` identity and Git metadata were not copied. No tokens, archives, private saves or machine environment files are part of the import.
- GitHub package version: 23.0.1. Changes concern repository structure, publication, documentation and an in-game rights/privacy link. Gameplay module cache keys and save schema remain v23-compatible.

The destination's existing history is preserved. Its baseline commit was `0741e43fa698997db274c626db2e79960ea3d9a6` (`Initial commit`), containing only `README.md` and `LICENSE`. The MIT starter text named Jackson Pham. No Mallside game code or assets were in that commit. The proprietary game license is introduced in the same commit as the game files, and no earlier permissions for existing material are revoked.

The broad MIT notice of the unrelated parent Personal-Project repository is not imported into this standalone game repository. The source checkout was a separate Git repository. This record does not purport to determine or extinguish any independently granted rights outside the inspected repositories.

## Initial source and hosting — 23.0.1

At import, `YouKnowJP/Mallside` on `main` became the canonical source and GitHub Pages published `dist/` directly. The old Sites deployment and source checkout were retained at that stage. No force push or production-save reset was part of the move. Later releases changed the packaging and hosting as recorded below.

Saves are local to each hostname. Players moving to GitHub Pages must export a JSON backup at the old address and import it at the new one. Local outfit-photo binaries remain on the old origin. Neither migration nor publication uploads a player's save.


## Temporary private source and clone relocation — 23.0.2

On 28 October 2026, the canonical source repository was made private, and its working clone moved from `Personal-Project/Mallside-GitHub` to `/Users/youknowjp/Documents/Personal PR/Mallside`. The earlier path descriptions above record the import at that time. At that stage, only generated browser output was published through `YouKnowJP/YouKnowJP.github.io`, preserving the public game URL. This arrangement is retired; see [hosting history](history/HOSTING.md).


## Single-repository publishing update

On 28 October 2026, the owner chose to make `YouKnowJP/Mallside` public and publish directly from that repository using free GitHub Pages. Version 25.0.2 replaces the cross-repository copy job with the standard Pages artifact and deployment actions. The public play URL and save keys stay the same. The proprietary license and third-party notices are unchanged. `Personal-Project` remains independent for Tilewright and other projects, with no tracked Mallside files; the current local clone remains `/Users/youknowjp/Documents/Personal PR/Mallside`. See [deployment](DEPLOYMENT.md).

## Post-migration cleanup — 25.0.3

The local `Personal-Project` folder was reconnected to its own GitHub repository by restoring Git metadata after its 392 tracked files matched the remote exactly. Its project files and private visibility were preserved. Mallside remains a sibling checkout in its own public repository. There are no tracked Mallside files or Mallside publishing workflows in `Personal-Project`.

Retired publishing documentation now lives under `docs/history/`. Obsolete cross-repository workspace rules, merged work branches and generated artifacts were removed. Older temporary research and deployment snapshots were preserved in a private local archive outside both active checkouts. File-manager metadata is filtered from production assets and rejected by artifact verification. The game URL, source history, licenses and save keys remain the same.
