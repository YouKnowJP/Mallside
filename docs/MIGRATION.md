# GitHub migration provenance

Imported 28 October 2026 into https://github.com/YouKnowJP/Mallside.

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

## Canonical source and hosting

`YouKnowJP/Mallside` on `main` is the canonical source for this GitHub release. GitHub Pages publishes the `dist/` directory. The old Sites deployment and local source checkout are retained for continuity; no force push, repository deletion or production-save reset is part of the move.

Saves are local to each hostname. Players moving to GitHub Pages must export a JSON backup at the old address and import it at the new one. Local outfit-photo binaries remain on the old origin. Neither migration nor publication uploads a player's save.
