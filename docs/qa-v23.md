# v23 — anatomical characters, garment fit and the 3D dressing room

## Scope

A real weighted human topology replaces the primitive head, hair, arms and hands. MakeHuman HM08 body geometry, fitted short/bob hair, eye geometry and original skin/hair/eye textures are bundled with CC0 provenance. No MakeHuman/MPFB application code is copied. The project's own retargeter maps the source A-pose onto the game's skeleton. The arm chain is7.7+7.1 units instead of22, preventing the new fingers reaching the knees. Thirty finger joints close around the palm's real grip. Eyelid morphs blink while separate eye surfaces are hidden at full closure; reduced motion disables this.

The existing26,756-triangle body is split into compact anatomical regions while keeping the original normalized skin weights. Immutable geometry/texture data is shared within a scene. Each character owns its skeleton and materials; fitting releases those resources, including bone textures. Covered proximal arm triangles are removed beneath sleeves with cuff overlap. A skin layer around the neck/shoulders prevents missing surfaces when a top hides the base torso. Hips covered by garments are masked. The actual anatomical profile refits clothing shells, with size-dependent clearance retained.

The wardrobe shares the mall's actual character and merchandise modules. Stand/walk/sit, four directions and whole-outfit/face cameras inspect the same purchases. Haircut and face-detail fields are normalized through old saves, backup imports and saved looks. Price and stock data is unchanged. Render telemetry is rate-limited and only changed shop/cutaway values are written, avoiding unnecessary DOM mutation while animating.

## Automated verification

The full suite passed 274/274 tests after anatomy, source asset, appearance, shader and collar changes. Final sleeve masks were additionally checked with 33/33 character, reference-fit, resource and product-coverage checks. Final studio/control telemetry changes passed 12/12 scene lifecycle and detailed-character checks. Top-level module syntax and Git whitespace checks passed before packaging.

Existing catalog-wide geometry tests cover752 unique physical product references,184 bag references and72 combinations of garment form/sleeve/length/fit. They observe real grip positions, body/leg contacts, soles, seated pelvis contact, floor clearance, repeated pose restoration, strap length and fabric edge extension. The new detail tests check anatomical head/hands,53 bones,30 independent finger joints, unchanged finger-bone lengths during grasp, actual eyelid morphs, bounded hem movement, shorter long-skirt strides, and real strap/lug contact during bag sway. Hair/face choices round-trip through a paid outfit's saved look without changing its money or purchases.

Nine source-asset tests verify SHA256 provenance, body-only source geometry without helpers, valid indices/normals/weights, acyclic nondegenerate bones, fitted bob clearance and plausible source proportions. The conversion script rebuilds deterministically from the retained selected inputs.

Legacy tests were updated to measure the shorter real arm, actual anatomical palm and scene-shared geometry ownership. A real regression found during this work was lost size ease when garments snapped to the body envelope; size-dependent clearance corrected it rather than removing the size assertion.

## Live checks and limits

The local test save is separate from production. The owned Madewell Smocked Waist Midi Dress and Gucci Horsebit1955 Mini Bag were used for fitting and the studio. Detailed face, ears, fingers, skin and short/bob hair were inspected; style changes used the normal settings controls. Product names, photos, prices and existing purchases remained available. The public save is preserved.

Close views exposed hip skin through the old waist shape, missing collar/shoulder coverage and proximal arm skin at sleeve caps. The anatomy envelope, covered-region masks and neckline overlap addressed these. A V-neck ring fold was corrected by distributing the dip through the shoulder rows. Live visual checks covered desktop (1280×900), phone (390×844) and tablet (820×1180), whole-outfit walking/seated previews and the detailed face camera. Phone and tablet document widths matched the viewport with no horizontal overflow. Stand, Walk, Sit and Face & hair controls responded to pointer input after the telemetry cleanup. The dress stayed covered while seated, feet reached the floor, and the bag rested on the bench. No warning/error console entries were present in the final local run. Screenshots are retained in the task visualization directory.

Browser automation occasionally timed out before mouse-command dispatch. Fresh state inspection and keyboard-accessible buttons/selectors were used to continue testing. These infrastructure timeouts are not treated as proof that every physical pointer/touch device has been tested. The live engine is Chromium; phone/tablet sizes are viewport checks, not physical iPhone/iPad or Safari/Firefox certification.

Source anatomy and source hair fitting do not constitute manufacturer scans or full cloth simulation. Fabric posing, skin coverage masks and a constrained strap relaxation cover the tested shopping poses. Exact unseen product construction and every possible combination of garment/accessory/body pose are not certified. The2D fallback and illustrated night transitions intentionally retain their lighter art.
