# Mallside privacy information

Updated 28 October 2026. Maintainer: [Jackson Pham / YouKnowJP](https://github.com/YouKnowJP).

## Game data on your device

The static game has no account, payment processor, advertising integration or gameplay server. Purchases use fictional game money. Player names, appearance choices, inventory, progression, settings, receipts, room finishes, prepared-outfit plans and guestbook mood/highlight choices are stored in your browser's local storage (`mallside-career`, `mallside-free` and `mallside-mode`). Outfit-photo images are stored in the browser's IndexedDB database `mallside-portraits`.

The game does not send those saves or outfit photos to a gameplay backend. Exporting a backup downloads JSON to your device; importing reads the file you choose. Outfit-photo binaries are not included in the JSON backup. An exported save can include a name you entered, so review it before posting it publicly.

Browser storage can be unavailable, cleared, evicted or isolated in private browsing. Back up progress using Player & options. To remove stored game data, use your browser's controls to clear this site's local storage and IndexedDB; this also removes progress and local outfit photos. Saves are specific to each website origin and browser profile.

## Hosting and external services

GitHub Pages serves the public game and may process ordinary hosting/security logs such as IP addresses and request information under [GitHub's privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement). The earlier `chatgpt.site` deployment is operated by its own hosting provider.

The stylesheet loads DM Sans and Manrope through Google Fonts. Those requests disclose normal network information to Google; see [Google Fonts privacy information](https://developers.google.com/fonts/faq/privacy). System-font fallbacks work if fonts are blocked. Product photographs used by the runtime are bundled locally in this release. Clicking a real-product link opens a third-party website with its own privacy policy.

No claim is made that hosting platforms or external sites have no logging. There is no cross-device cloud synchronization or cookie banner that promises to control those providers. Player reports in the public Mallside repository are public unless a private reporting channel is explicitly used. The game source repository is publicly readable under its proprietary license. Do not post passwords, tokens, personal save backups or other sensitive information.
