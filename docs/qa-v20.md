# v20 character, movement and outfit QA

The release updates the 3D shopper, limb articulation and outfit fit. Existing real product names, photographs, source links, prices, ownership and saves are preserved.

## Automated coverage

The final full application suite passed260/260 tests in60.0 seconds using test concurrency2. Earlier focused runs passed34/34 motion, reference-fit and lifecycle checks and18/18 reference/lifecycle checks. All top-level JavaScript syntax checks and git diff whitespace checks passed before packaging. Final floor material polish passed11/11 reference-fit checks; the store-customer hand-anchor correction passed20/20 character, merchandise-pose and customer simulation checks.

Eleven independent new checks cover adult silhouette, invariant bone lengths, real sole contact, stationary stance footprints, swing clearance, seat contact, pose round trips, all752 physical product grip/parked contacts, all184 bag leg/bench clearances,72 garment cut combinations, strap length through seating and fabric edge stretch. Tests measure actual world-space joints and mesh vertices. They found floor reach errors, cuff/hem penetration, large-bag shin collisions, fixed-anchor strap stretching and a discontinuous hip fold; those defects were corrected in implementation. Legacy assertions were updated for the new actual wrist, body dimensions and two-bone gait rather than obsolete offsets.

The standing body is lowered0.4 units to put its sole on the floor. During walking, hip height follows the support leg's reach rather than maintaining a crouched height through the entire stride. Fitting-room floor inlays are flush; a scene geometry assertion prevents them covering the shoes again. Their material uses a small polygon offset to prevent coplanar floor flicker without raising the surface into the shoes.

## Live checks

The in-app Chromium browser used a separate local free-shop save, Day12 at South Coast Plaza, with the owned Madewell Smocked Waist Midi Dress and Gucci Horsebit bag. No public save purchases or resets were used. The player walked into Madewell, browsed the real photograph and price, entered the reserved fitting cubicle, turned through the outfit and finished. The owned outfit was restored and the product result displayed without a purchase charge.

Store customers’ browsing merchandise and paid bags also use their actual articulated grip anchors rather than offsets from the torso. The new head/body proportions, shaped face/hair, articulated elbows and separate knees/ankles were visible on the player and store shoppers. The fitting camera retained the complete body and controls at desktop1280×900, phone390×844 and tablet820×1180. DOM scroll widths matched the viewport widths on phone/tablet. A transient screenshot immediately after resizing was not used as layout evidence; the settled canvas and viewport bounds were checked.

A physical garden bench was reached through Stops. Rest recovered stamina once, kept the wallet unchanged, lowered the character onto the bench, bent knees, grounded shoes, moved the equipped bag beside the player and returned to standing. The close activity camera hides the player's oversized world label. Seated hems and strap folding remain controlled posing rather than general cloth physics.

A few initial browser input calls timed out during scene startup; fresh page inspection showed the requested actions had completed. Later semantic controls and frame telemetry confirmed continuing animation, fitting turns and completion. The observed browser warning/error lists were empty. Two real-named Starbucks Caffè Latte actions charged exactly$5.25 each, moving the local wallet from$84,619.95 to$84,609.45. The new elbow/wrist pose kept the cup attached and upright; it was removed when the moment completed. During the close seated check, exposed upper-thigh skin was found crossing the skirt; midi/maxi coverage now hides the underlying covered thigh meshes. The final seated drink showed the corrected lap and bag fit.

## Limits

These are original stylized procedural game models, with a more natural adult silhouette. They are not photorealistic manufacturer scans. Controlled fabric posing and a fixed-segment strap relaxation do not simulate every possible contact, material or body type. The garment edge test's maximum2× extension and strap10% length bound are regression limits, not claims of physically exact cloth.

One browser engine was live-tested at three viewport sizes. This does not certify physical iPhones/iPads, every browser/GPU or every product at every pose. Catalog-wide geometry and state tests supplement representative visual checks; passing them cannot prove that no clipping can ever occur.
