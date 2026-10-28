# Develop and deploy

The source repository is now private, and public hosting publishes generated files only. The game keeps https://youknowjp.github.io/Mallside/.

Follow [Private source, public game](PRIVATE_HOSTING.md) for the current commands, deployment-key scope, automation, rollback considerations and validation. The local clone is `/Users/youknowjp/Documents/Personal PR/Mallside`.

The prior direct-from-source Pages setup was replaced because GitHub Free does not support Pages on a private source repository. `dist/` remains the editable application; `build/site/Mallside/` is now the publishable artifact. The earlier Sites deployment remains separate and is not updated by this GitHub workflow.
