# v28 · Save recovery

Mallside keeps career and free shop separate. Each mode now keeps one last-known-good local backup alongside its current save. When an existing save opens correctly, it receives a backup without rewriting its stored JSON. Later saves protect the previous validated snapshot before writing new progress.

## If a save cannot be loaded

The recovery screen pauses gameplay and autosaving. It shows the available backup’s day, balance, shopper, kept purchases, completed chapters and capture time. Choose **Review this recovery**, check the summary, then confirm **Restore this backup**. Cancelling preserves the stored data. A restore can roll back recent actions.

You can download the exact stored save data before choosing a replacement. If no usable local backup exists, import a JSON save you previously downloaded. Review its day, balance and mode before confirming. You can also open the other mode without changing the damaged one. **Start this mode fresh…** always requires confirmation.

An unavailable-storage screen lets you retry after allowing storage for the site. A save changed by another tab pauses stale saving; download this tab’s progress if needed, then load the latest stored copy. Avoid playing the same mode in several tabs at once.

## Back up healthy progress

Open **Player & options → Save & recovery** to review/restore the local backup, download it as an ordinary importable JSON save, download current progress, or import a downloaded save. A healthy save replaced by a restore becomes the next local backup, providing one undo generation.

If browser storage fills or refuses a write, a persistent warning says the current progress is not saved. Keep the tab open, download current progress, make storage available and retry. The game never reports success for a failed write.

## Compatibility and limits

Primary save keys and the version-6 JSON format are unchanged. Existing versions 1–6 retain their automatic migrations; reviewed imports accept versions 2–6 as before. Purchases, receipts, completed rewards, story history and the night-transition guard remain part of the same state.

Backups are local to this browser/profile and website origin. Clearing or evicting site data can remove both copies. Download JSON for a separate copy or before moving browsers/devices. Outfit-photo images remain in IndexedDB and are not included in either JSON copy. No cloud save was added, and the integrity check cannot detect every plausible edit to valid game data.
