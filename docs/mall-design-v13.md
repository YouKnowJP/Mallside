# Mallside v13 architecture and public realm

The map pass replaces thin walkways on an empty ground plane with continuous retail podiums, connected perimeter arcades on larger main floors, tiled concourses, patterned court medallions, shop canopies, glazing, cornices, lanterns, planted borders, usable garden benches and public directories. Indoor courts use lightweight skylight structures. Each destination has a coherent palette and architectural family. Storefronts now face their actual public approach rather than always facing the same world direction.

This is original game architecture using the existing source-directory floor and broad-zone assignments. Added arcades are condensed game space, not surveyed mall extensions or an exact as-built floor plan. South Coast Plaza's west building remains separated by Bear Street, with its public connection on Level 2. The existing source notes and official map links remain in the game.

Primary design references consulted:

- South Coast Plaza art tour, Jewel Court dome and Bridge of Gardens: https://www.southcoastplaza.com/art-tour/
- Official Bridge of Gardens page: https://www.southcoastplaza.com/directory/bridge-of-garden/
- Irvine Spectrum Center's open-air courts and attractions: https://www.irvinespectrumcenter.com/travel
- Landscape designer's project description: https://cms-collaborative.com/project/irvine-spectrum-center/
- Lighting manufacturer's project reference for coordinated palms, arches and lanterns: https://service.nerinorthamerica.com/en/references/spectrum-center-irvine.aspx?LN=en-US&idC=63155
- ULI project case study, paving, sheltered passages and planted fountains: https://casestudies.uli.org/wp-content/uploads/2015/12/C026017.pdf

These references inform the architectural vocabulary; no commercial product pictures were generated or replaced. Catalog models, photographs, reference prices, receipts and ownership remain unchanged from v12.

The extra geometry uses shared instanced meshes and one cached floor atlas. Public fixtures have real colliders and clear approaches; benches connect to the existing rest animation and recovery rules. Foreground retail buildings lower into a camera cutaway when they would hide the shopper. Overview framing includes the complete rotated footprint at both phone and desktop aspect ratios. Spatial buckets and cached adjacent grid edges reduce repeated navigation work on the larger floor layouts.
