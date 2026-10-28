# Retired private-source hosting

This is a historical note. **Current development and deployment use one public repository, `YouKnowJP/Mallside`.** Follow [DEPLOYMENT.md](DEPLOYMENT.md) for the active workflow.

On 28 October 2026, the source was temporarily private. GitHub Free could not host Pages directly from that private repository, so a second public repository, `YouKnowJP/YouKnowJP.github.io`, received generated game files in a `Mallside/` folder. A scoped hosting deploy key and the source Actions secret `MALLSIDE_PAGES_DEPLOY_KEY` enabled those copies. Editable source, tests and history remained private during that arrangement; browser-delivered code and assets were public.

The owner subsequently chose publicly readable source and free GitHub Pages in a single repository. The replacement workflow tests and publishes directly from `Mallside/main`, keeping https://youknowjp.github.io/Mallside/. It uses GitHub's built-in short-lived credentials instead of the old key. The cross-repository publishing script has been removed. The direct deployment was verified and the obsolete source secret removed. The old hosting repository was already unavailable (HTTP 404) at final verification; this migration did not delete or recreate it.

Public visibility allows viewing and GitHub forking; it does not replace [the proprietary license](../LICENSE) or grant commercial reuse rights. Changes in visibility cannot recall existing downloads or forks. Third-party rights remain independent.
