# v33 presentation research

Research and implementation reviewed 29 October 2026. The aim is a more coherent, readable shopping environment at the existing browser performance budget. This release refines the established art direction; the remaining destination-specific modelling and animation work stays on the roadmap.

## Lighting and surfaces

[Three.js MeshStandardMaterial](https://threejs.org/docs/pages/MeshStandardMaterial.html) recommends an environment map for physically based materials. [PMREMGenerator](https://threejs.org/docs/pages/PMREMGenerator.html) filters environment illumination for different material roughness. Mallside now generates an original HDR sky/softbox environment locally and filters it with the vendored r180 API. Metal, glass, stone, wood, fabric and water receive distinct roughness and reflection settings. The collection room uses the same lighting foundation.

[Three.js color management](https://threejs.org/manual/pages/color-management.html) distinguishes color textures from non-color data. Procedural color textures use sRGB; bump data uses NoColorSpace. Shared textures survive individual actor/outfit replacement, and scene teardown owns their disposal.

[Three.js shadows](https://threejs.org/manual/pages/shadows.html) explains the extra rendering work for each shadow-casting light. This update keeps one shadow-casting directional light, adds inexpensive soft contact shadows under nearby people, and uses instancing for repeated details and route beads. It does not add a costly screen-wide postprocessing chain. Roof tile relief, small architectural bevels, fountain ripples and segmented palm fronds provide more shape and surface variation.

## Spaces, people and composition

[Irvine Company Retail's design description](https://www.irvinecompanyretail.com/about/) highlights landscaped paseos, coastal architecture and gathering spaces. [Irvine Spectrum's entertainment guide](https://www.irvinespectrumcenter.com/entertainment) also illustrates the center's role beyond transactions. These inform the attention to planting, fountains, thresholds and social space; they are not evidence that the game reproduces any exact real-world footprint or current tenant arrangement.

The closer camera frames people and storefronts; a saved raised preset retains a wider view. Indoor framing was corrected after screenshots exposed player clipping and empty space beyond the shop entrance. Cutaway heights ease between views. Original starter-shirt geometry replaces painted-on clothing, with separate sleeves, a collar and a clean neck transition. Face close-ups receive subtle brows fitted to the existing anatomical head. Retail garments, product identities and researched photographs retain their existing provenance.

## Interface and route clarity

[Xbox Accessibility Guideline 102](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/102) informs contrast and readable controls. [Guideline 114: UI context](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/114) informs clear contextual labels. The header exposes View directly, the shopping guide can give its space to the scene, and route beads follow the actual collision-safe path. Nearby activity captions are optional; essential shop, destination and interaction controls remain available.

These are design references, not a claim of accessibility certification. Physical mobile devices, manual screen-reader testing and further character/clothing refinement remain open.

## Assets and compatibility

All new environment pixels, material grain, roof relief, geometry, contact shadows and route markers are original code-generated work. No source photograph or remote texture was copied from the research pages. No fictional retail SKU was added. Save schema 6 and existing primary/backup keys remain unchanged; older saves default to the closer camera, visible shopping guide and hidden incidental activity captions.
