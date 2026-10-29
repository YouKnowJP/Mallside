# v28.0.1 · Native save-recovery validation

Tested 28 October 2026 on macOS 26.6.2 against the compiled `/Mallside/` production layout. Safari 26.6.2 and Firefox 159.0 each passed **17/17 checks** after the fix below. Firefox used official geckodriver 0.37.1, a disposable profile and native headless mode; Safari used Apple's installed browser and driver.

## Defect and fix

Safari's default keyboard navigation could skip **Review this backup** after the save-import textarea. The old dialog handler only wrapped focus at the first and last controls, allowing Safari's own Tab preferences to skip intervening buttons. The handler now handles each Tab and Shift-Tab itself, advances through visible focusable controls, and wraps in both directions. Recovery can be completed without changing the player's Safari keyboard preferences. The same check passed in Firefox.

## Native results

| Check | Safari | Firefox |
| --- | --- | --- |
| Versions 1–6 migrate and retain exact pre-migration backups | Pass | Pass |
| Normal writes rotate the previous validated snapshot | Pass | Pass |
| Damaged boot pauses navigation and visibility/unload autosaves | Pass | Pass |
| Review, cancel and confirm recovery; wallet, purchases and rewards retained | Pass | Pass |
| Manual backup restore retains healthy replaced progress as one undo copy | Pass | Pass |
| Missing primary recovers; unreadable backup remains downloadable | Pass | Pass |
| Damaged-data and importable-backup download payloads match exact bytes | Pass | Pass |
| Bad import stays editable; reviewed JSON recovers without a local backup | Pass | Pass |
| Fresh-start cancellation, confirmation and other-mode escape | Pass | Pass |
| Damaged free-shop recovery preserves career progress | Pass | Pass |
| Primary/backup write failures warn, preserve progress and retry | Pass | Pass |
| Blocked storage and empty retry never silently start fresh | Pass | Pass |
| A stale restore review cannot overwrite newly changed stored progress | Pass | Pass |
| Real second-tab change pauses stale saving and explicitly loads latest | Pass | Pass |
| Restored pending night pays once and remains once after reload | Pass | Pass |
| Forward/reverse Tab, Escape and responsive containment | Pass | Pass |
| Captured game exceptions and other unexpected console errors | 0 | 0 |

The download checks read the actual generated Blob and filename before the operating-system save step; they do not leave files in the player's Downloads directory. Test fixture navigation cancelled four pending Google-font loads in the final Firefox run (`NS_BINDING_ABORTED`, status 2152398850). The runner retains those specific resource cancellations separately from game errors; other errors still fail. Mozilla documents this abort status in [its navigation diagnostics](https://bugzilla.mozilla.org/show_bug.cgi?id=1914409). The font fallbacks and recovery layout remained usable.

Safari measured CSS viewports of **390×792, 768×972 and 1200×948**. Firefox measured **500×759, 768×939 and 1200×915**; its desktop-window minimum prevented a 390px viewport. Neither browser showed horizontal document overflow. Recovery screenshots were inspected. These are resized desktop browsers; physical iOS/iPadOS and Android validation remains roadmap work.

## Repeat and cleanup

Use [the recovery runner](../scripts/save-recovery-browser-qa.mjs) and [its setup instructions](../scripts/README.md). It creates its own test session, refuses non-local URLs and uses synthetic saves. Native element clicks and keys exercise the UI; no public player saves are changed. Safari's protected automation window must be left undisturbed during the run. Standard element clicks avoided intermittent misses from synthetic pointer actions.

After testing, both sessions and drivers were stopped. Safari's **Allow remote automation** checkbox was visibly verified off. The temporary Firefox app, disk image, driver archive/binary, profiles, logs and generated Firefox QA artifacts were removed; pre-existing profile directories were preserved. The durable results are recorded here instead of retaining a browser installation.

The release also runs the full **356-test regression suite**, source/notices/inventory checks, production build and strict artifact validation before Pages publication. Primary save keys, schema 6, purchase identities, photographs, economy rules and backup rotation are unchanged by this patch.
