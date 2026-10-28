# Character and outfit audit — v20

The target is a proportioned, articulated shopper whose clothes and carried products remain attached during the shopping day. This audit concerns rendering and movement. It does not change product references, prices, purchases, returns, progression or save data.

## Risks found in v19

- Walking rotated each entire leg on a sine wave. There was no stationary stance footprint or independently articulated ankle, so the feet could slide even when a sole looked level.
- An upper arm was also the hand attachment frame. Compensating only that joint's quaternion cannot keep products upright once the elbow and wrist articulate.
- Long sleeves were a single rigid cylinder. They could not follow a bent elbow without exposing the arm or crossing the forearm.
- Seated bags moved their bodies while straps were regenerated between fixed shoulder points and the new bag location. This could make a fixed-length strap stretch.
- Cloth posing read `mesh.position.y + vertex.y` as body height. Retargeting must use a consistent coordinate frame, particularly if the body hierarchy changes later.
- The older bag regression test skipped hand-carried bags, because those have no `bagFit` record. Its leg collision probes also assumed the old shin length.
- Staff, browsing shoppers, purchase bags and food props used old arm offsets. Updating the player alone would leave other people and props visually inconsistent.

## Independent v20 checks

`tests/character-v20.test.mjs` observes world-space joints and mesh bounds, rather than accepting pose labels or reproducing the pose equations.

- Adult silhouette sanity and separate elbow, wrist, knee and ankle anchors.
- Constant measured upper/lower limb lengths during walking, seating, trying and root rotation.
- Complete sole floor contact in standing and reduced-motion modes.
- A stationary world footprint while the root advances through each stance interval.
- Swing clearance and finite transforms over two complete stride cycles.
- Feet stay grounded during both directions of a sitting transition; the actual pelvis bounds rest on the seat at completion.
- Returning to the idle pose restores transforms without accumulated drift.
- Every unique physical product reference stays upright, meets the real grip when carried and rests at bench height when parked.
- Every bag reference, including hand-carried models, clears sampled leg interiors and the bench back.
- Representative garment cuts stay above the floor and restore their standing shape.
- Measured solid strap centerlines do not grow more than 10% through a seating transition.
- Indexed cloth edges do not more than double in length while the character sits; this is a deliberately generous regression bound, not a physical cloth simulation claim.

## First v20 geometry finding

With hip height 25 and a 23-unit leg, an ankle target at 1.6 is unreachable if the root remains at zero. The initial solver clamped the leg and left both soles 0.4001 units above the floor. A walking root of −2.5 similarly made the extreme stride target unreachable, producing a 0.1527-unit sole gap and a 0.0731-unit footprint shift. The tests record these actual mesh/contact failures so the floor fit must be fixed in the rig, rather than hidden by a larger tolerance.

The root was adjusted to −0.4 while standing and initially −2.7 while walking. All six skeleton/contact tests passed after this change. The final gait varies the pelvis height with the support leg reach, rising near mid-stance and lowering near the next plant, to avoid an unnecessarily crouched walk while preserving foot contact.

The first integrated run additionally identified maxi hems below the floor, bootcut cuffs crossing the floor during the forward stride, hand-carried totes intersecting the forward shin, cloth edges stretching up to 7.11 times their rest length at the seat clamp, and shoulder straps stretching up to 1.82 times their standing length before the parked coil transition. These measurements informed the floor, drape, carry and strap fixes; they were not accepted by relaxing the regression tolerances.

The final cloth issue crossed the hip boundary: a 1.9368-unit rest edge stretched to 4.0641 units because the vertex below the hip received the complete rotation while its neighbor above the hip stayed fixed. Tapering the angle from zero at the hip made this transition continuous and passed the targeted edge regression.

## Verification status

All 11 independent geometry checks pass after the targeted corrections. The last complete audit run passed 10 checks, including every referenced product grip, all bag leg/bench contacts, garment floor clearance and strap length. The one remaining cloth check passed separately after the hip transition fix.

Coverage includes 752 unique physical product photographs, 184 bag photographs and 72 combinations of garment cut, sleeve, length and fit. Copies sold at multiple branches share their reference model. The tests include forward and reverse seating transitions and repeated returns to idle.

The integrating release workflow owns the full application regression suite and live browser/device verification. This geometry audit does not claim those separate checks have completed.

## Scope limits

Geometric tests catch floor penetration, loose attachment frames, stretched bone lengths and transform drift. They cannot establish that a stylized procedural character is photorealistic, nor certify that every cloth surface is free of collision at every possible pose. Final rendered walking, sitting, fitting-room and checkout checks remain necessary, including touch layouts and reduced motion.
