# Anatomical character asset inputs — v23

The new anatomy data is derived from official MakeHuman graphical assets released under **CC0 1.0 Universal**, rather than the AGPL program code. No MakeHuman or MPFB Python, shader or application code is incorporated. MPFB’s license separately includes graphical rigs and mesh-information JSON under CC0; its program code is GPLv3 and is not included. This scope statement is retained at `dist/assets/character/LICENSE-MPFB-scope.md`. The original base OBJ and the selected MHClO/material files explicitly state their September2020 release to CC0. The full asset license is retained at `dist/assets/character/LICENSE-CC0.md`.

Primary references:

- [MakeHuman asset license](https://github.com/makehumancommunity/makehuman/blob/master/LICENSE.ASSETS.md)
- [MakeHuman license scope](https://github.com/makehumancommunity/makehuman/blob/master/LICENSE.md)
- [Official system asset inventory, with per-asset CC0 labels](https://static.makehumancommunity.org/assets/assetpacks/makehuman_system_assets.html)
- [HM08 base OBJ at release v1.3.0](https://raw.githubusercontent.com/makehumancommunity/makehuman/v1.3.0/makehuman/data/3dobjs/base.obj)
- [MPFB rig/JSON asset license scope](https://github.com/makehumancommunity/mpfb2/blob/master/LICENSE.md)
- [Official game-engine rig and weights](https://github.com/makehumancommunity/mpfb2/tree/master/src/mpfb/data/rigs/standard)

## Files and rebuild

`dist/human-model-data.js` is synchronous ES-module data. `scripts/prepare-human-assets.py` is the project's own conversion code using only Python's standard library. Running it without arguments rebuilds from the compact selected raw geometry and rig files retained in `dist/assets/character/source`. `--source /path/to/research` can import the same original inputs and selected system-pack subset. It does not require Blender, network access or package installation for a normal rebuild.

Original PNGs are copied unchanged. Geometry/texture source paths and SHA256 hashes are in `dist/assets/character/provenance.json` and the module's `HUMAN_PROVENANCE`. The base OBJ SHA256 is `8e761e6624b8f54536409135d1636da63b32486a90d4897f84e121d144f6fb4c`.

## Export schema

- `HUMAN_BODY`:14,517 UV-seam vertices,26,756 triangles. Only the OBJ `body` group is rendered:13,380 original vertices, indices0–13379. Joint cubes, hair/clothing helpers, tongue, teeth and genital helper meshes are omitted.
- `HUMAN_HAIR_SHORT`:3,177 UV-seam vertices,3,678 triangles from official `short01`.
- `HUMAN_HAIR_BOB`:1,759 UV-seam vertices,2,248 triangles from official chin-length `bob02`.
- `HUMAN_EYES`:96 vertices,172 triangles from official `low-poly` eyes.
- Each mesh contains flat arrays `positions`, `normals`, `uvs`, `indices`, `sourceVertexIndices`, `skinIndices`, `skinWeights`, plus `bounds`, `vertexCount`, `triangleCount`. Positions are **raw HM08 OBJ coordinates**, +Y up and +Z front. They have not been transformed using Blender rig `default_position` data.
- `HUMAN_BONE_NAMES`:53 game-engine bone names, in the same order used by `skinIndices`.
- `HUMAN_BONES`:one `{name,parent,head,tail,headMarker,tailMarker,roll}` entry per bone. Parent is an index, or−1 for Root. Head/tail positions are means of actual OBJ joint-cube vertices. Root's tail is the mean of the two specified source vertices. `roll` is preserved source metadata; its Blender convention must be handled deliberately by a runtime binding rather than treated as a world-space Euler angle.
- `HUMAN_TEXTURES`:relative asset URLs keyed `lightFemale`, `lightMale`, `darkFemale`, `hairShort`, `hairBob`, `eyesBrown`. Skin and hair maps are2048×2048; eyes1024×1024. Hair and eyes retain original RGBA channels.

Four largest positive official skin influences are kept per vertex and renormalized. Integer quantization at1/100000 makes the four stored weights sum to1 without negative rounding residuals. Source-proxy barycentric weights can be negative for geometric extrapolation: these are preserved for vertex positions, while transferred skin influences are clamped to positive contributions before normalization. Smooth normals are calculated across original vertices before UV seams are split, avoiding artificial seam lighting.

Hair and eyes are fitted to the exact base OBJ using their original MHClO mapping. Using raw proxy OBJ positions directly is incorrect: those files were authored against different default shapes. The fitted short hair bounds are approximately x[−.822,.809], y[6.570,8.652], z[−.506,1.482]; body head top is8.491. Both official bob01 and bob02 were examined. Bob02 was selected: fitted minimumY6.12686, above the neck marker5.89025 and shoulder marker5.2458. It ends around the chin/upper neck and uses2,248 triangles, compared with bob01’s8,474 triangles at minimumY6.18445. Bob02’s smaller mesh is preferable on phones while retaining alpha-textured hair cards. Its fitted bounds are x[−.96651,.98681], y[6.12686,8.57792], z[−.58616,1.67019]. The long01 research asset extends to the waist and was deliberately not included in the shipped character data.

## Validation and runtime considerations

Conversion checks verified finite coordinates, valid triangle and bone indices, nonnegative normalized weights, nearly unit normals, nonzero source bone lengths and an acyclic parent graph. Maximum measured weight sum error was about2.2e−16; normal length error below8.3e−6 after five-decimal quantization. A second conversion using only retained repository inputs reproduced the model data.

Load only the chosen skin texture and share textures across characters. Hair cards require alpha cutout and double-sided rendering; blending alone can produce sorting artifacts. Body coverage/masking and outfit attachment remain runtime responsibilities. Anatomical source topology does not by itself prove that every retargeted cloth or hair pose is collision-free; those checks belong to the integrating character and game QA.
