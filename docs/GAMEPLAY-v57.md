# v57 · A clearer scene and a better dressed character

Floating 3D labels now share a bounded presentation layer. Names stay inside the canvas, avoid one another, the player and the nearby/status controls, and prefer the active destination. Duplicate product name/price targets collapse to one label. The small-screen view allows three labels; larger views allow six. A small preference for retained labels reduces flicker while walking. Physical signs, clickable objects, route positions and the full-name shop lists remain authoritative. Activity close-ups clear the floating overlays and nearby prompt.

Original starter trousers now have separate rig-bound fabric surfaces, a continuous raised waistband, fly and pocket stitching, tidier ankle hems and a procedural twill surface. These are character clothes, never catalog merchandise or owned purchases. Cropped tops retain the starter waist; real catalog bottoms and full outfits replace all original trouser layers. Shared scene geometry follows the existing skeleton without per-frame geometry allocation. Controlled skinning remains distinct from cloth physics.

The dressing-room preview uses a low backless seat so front, side and back seated outfit views remain visible. The home-room bench retains its existing construction and routes. Shop casework uses cached wood, paint and metal materials; larger nested fixture boxes gain beveled edges inside their original dimensions. Product reference materials and photographs are preserved.

Fitting feedback changes from walking instructions to an explicit try-on message on arrival, nearby prompts clear during activities, and a one-item bag uses singular wording.

All 8,856 complete product records, 1,598 shop identities, catalog photographs, save schema 6, map revision 10 and economy rules remain unchanged. This release emphasizes presentation and clarity across existing content. Additional catalogs, more faithful center geometry, store-crowd neighbor avoidance, broader shared activities and physical mobile/accessibility testing remain on the roadmap.

See [compatibility evidence](research-v57/compatibility.json) and [release QA](qa-v57.md).
