#!/usr/bin/env python3
"""Build synchronous CC0 HM08 geometry for Mallside; no Blender or dependencies.

Usage: python3 scripts/prepare-human-assets.py --source /path/to/research
The source directory contains base.obj, rig.game_engine.json,
weights.game_engine.json, LICENSE.ASSETS.md and the selected system-pack subset/.
The exact raw geometry/rig inputs are retained under assets/character/source so
future builds can omit --source. This script only handles data, never MH code.
"""
from __future__ import annotations
import argparse, collections, hashlib, json, math, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'dist/assets/character'


def load_obj(path):
    vertices, uvs, faces = [], [], []
    groups = collections.defaultdict(list)
    group = 'default'
    for line in path.read_text().splitlines():
        token = line.split()
        if not token or token[0].startswith('#'):
            continue
        if token[0] == 'v':
            vertices.append(list(map(float, token[1:4])))
        elif token[0] == 'vt':
            uvs.append(list(map(float, token[1:3])))
        elif token[0] == 'g':
            group = ' '.join(token[1:])
        elif token[0] == 'f':
            face = []
            for part in token[1:]:
                ids = part.split('/')
                vi = int(ids[0]); vi = vi - 1 if vi > 0 else len(vertices) + vi
                ti = int(ids[1]) if len(ids) > 1 and ids[1] else 0
                ti = ti - 1 if ti > 0 else len(uvs) + ti if ti < 0 else -1
                face.append((vi, ti))
            faces.append(face)
            groups[group].append(face)
    return vertices, uvs, faces, groups


def fit_proxy(path, base, vertex_count):
    scale = [1., 1., 1.]
    mappings, reading = [], False
    for line in path.read_text().splitlines():
        token = line.split()
        if not token or token[0].startswith('#'):
            continue
        if token[0] in ('x_scale', 'y_scale', 'z_scale'):
            axis = 'xyz'.index(token[0][0])
            scale[axis] = abs(base[int(token[1])][axis] - base[int(token[2])][axis]) / float(token[3])
        elif token[0] == 'verts':
            reading = True
        elif reading and token[0].lstrip('-').isdigit():
            if len(token) == 1:
                mappings.append(([int(token[0])], [1.], [0., 0., 0.]))
            elif len(token) >= 9:
                mappings.append((list(map(int, token[:3])), list(map(float, token[3:6])), list(map(float, token[6:9]))))
            if len(mappings) == vertex_count:
                break
    assert len(mappings) == vertex_count, (path, len(mappings), vertex_count)
    result = []
    for ids, weights, offset in mappings:
        result.append([sum(w * base[i][axis] for i, w in zip(ids, weights)) + offset[axis] * scale[axis] for axis in range(3)])
    return result, mappings


def quantize(value):
    if isinstance(value, float):
        n = round(value, 5)
        return 0 if n == 0 else n
    if isinstance(value, list):
        return [quantize(v) for v in value]
    if isinstance(value, dict):
        return {k: quantize(v) for k, v in value.items()}
    return value


def packed_mesh(vertices, uvs, faces, influences=None, mappings=None):
    triangles = [(face[0], face[i], face[i + 1]) for face in faces for i in range(1, len(face) - 1)]
    normals = [[0., 0., 0.] for _ in vertices]
    for triangle in triangles:
        a, b, c = [vertices[k[0]] for k in triangle]
        u = [b[i] - a[i] for i in range(3)]; v = [c[i] - a[i] for i in range(3)]
        normal = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
        for vi, _ in triangle:
            for axis in range(3): normals[vi][axis] += normal[axis]
    for normal in normals:
        length = math.sqrt(sum(n*n for n in normal)) or 1
        for axis in range(3): normal[axis] /= length
    result = {k: [] for k in ['positions', 'normals', 'uvs', 'indices', 'sourceVertexIndices']}
    if influences is not None: result.update(skinIndices=[], skinWeights=[])
    seam_ids = {}
    for triangle in triangles:
        for key in triangle:
            if key not in seam_ids:
                vi, ti = key; seam_ids[key] = len(seam_ids)
                result['positions'].extend(vertices[vi]); result['normals'].extend(normals[vi])
                result['uvs'].extend(uvs[ti] if ti >= 0 else [0., 0.]); result['sourceVertexIndices'].append(vi)
                if influences is not None:
                    if mappings is None:
                        weights = influences.get(vi, {})
                    else:
                        weights = collections.defaultdict(float)
                        for base_vi, influence in zip(mappings[vi][0], mappings[vi][1]):
                            for bone, value in influences.get(base_vi, {}).items(): weights[bone] += influence * value
                    strongest = sorted(((bone, value) for bone, value in weights.items() if value > 0), key=lambda pair: pair[1], reverse=True)[:4]
                    assert strongest and sum(value for _, value in strongest) > 0, ('unweighted', vi)
                    total = sum(value for _, value in strongest)
                    indices = [bone for bone, _ in strongest]
                    scaled = [value / total * 100000 for _, value in strongest]
                    units = [math.floor(value) for value in scaled]
                    for i in sorted(range(len(units)), key=lambda i: scaled[i]-units[i], reverse=True)[:100000-sum(units)]: units[i] += 1
                    values = [value / 100000 for value in units]
                    indices.extend([0] * (4-len(indices))); values.extend([0.] * (4-len(values)))
                    result['skinIndices'].extend(indices); result['skinWeights'].extend(values)
            result['indices'].append(seam_ids[key])
    result['bounds'] = [[min(v[i] for v in vertices if True), max(v[i] for v in vertices if True)] for i in range(3)]
    result['vertexCount'] = len(seam_ids); result['triangleCount'] = len(triangles)
    return quantize(result)


def main():
    parser = argparse.ArgumentParser(); parser.add_argument('--source', type=Path, default=DEST/'source')
    source = parser.parse_args().source.resolve(); DEST.mkdir(parents=True, exist_ok=True)
    source_store = DEST/'source'; source_store.mkdir(exist_ok=True)
    # Keep compact selected authoring inputs, not the 267 MB original system pack.
    core_files = ['base.obj', 'rig.game_engine.json', 'weights.game_engine.json', 'LICENSE.ASSETS.md', 'mpfb-LICENSE.md']
    selected = ['hair/short01/short01.obj', 'hair/short01/short01.mhclo', 'hair/bob02/bob02.obj', 'hair/bob02/bob02.mhclo', 'eyes/low-poly/low-poly.obj', 'eyes/low-poly/low-poly.mhclo']
    if source != source_store.resolve():
        for name in core_files: shutil.copy2(source/name, source_store/name)
        for name in selected:
            target = source_store/'subset'/name; target.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(source/'subset'/name, target)
    vertices, uvs, _, groups = load_obj(source/'base.obj')
    weights_source = json.loads((source/'weights.game_engine.json').read_text()); assert weights_source['license'] == 'CC0'
    rig = json.loads((source/'rig.game_engine.json').read_text()); bone_names = list(rig)
    influence_map = collections.defaultdict(dict)
    for name, weights in weights_source['weights'].items():
        for vi, weight in weights:
            if weight > 0: influence_map[vi][bone_names.index(name)] = weight
    def endpoint(spec):
        if spec['strategy'] == 'CUBE':
            ids = sorted({vi for f in groups[spec['cube_name']] for vi, _ in f})
        else:
            assert spec['strategy'] == 'MEAN'; ids = spec['vertex_indices']
        return [sum(vertices[i][a] for i in ids) / len(ids) for a in range(3)]
    bones = []
    for name, bone in rig.items():
        bones.append({'name': name, 'parent': bone_names.index(bone['parent']) if bone['parent'] else -1,
            'head': endpoint(bone['head']), 'tail': endpoint(bone['tail']), 'headMarker': bone['head'].get('cube_name', bone['head'].get('vertex_indices')),
            'tailMarker': bone['tail'].get('cube_name', bone['tail'].get('vertex_indices')), 'roll': bone['roll']})
    body = packed_mesh(vertices, uvs, groups['body'], influence_map)
    # Bounds must exclude the source helpers, even though normals retain source IDs.
    body_ids = {vi for f in groups['body'] for vi, _ in f}
    body['bounds'] = quantize([[min(vertices[i][a] for i in body_ids), max(vertices[i][a] for i in body_ids)] for a in range(3)])
    proxies = {}
    for label, stem in [('HAIR_SHORT', 'hair/short01/short01'), ('HAIR_BOB', 'hair/bob02/bob02'), ('EYES', 'eyes/low-poly/low-poly')]:
        p, uv, faces, _ = load_obj(source/'subset'/(stem+'.obj'))
        fitted, mappings = fit_proxy(source/'subset'/(stem+'.mhclo'), vertices, len(p))
        proxies[label] = packed_mesh(fitted, uv, faces, influence_map, mappings)
    texture_sources = {
        'lightFemale': ('skins/young_caucasian_female2/young_lightskinned_female_diffuse2.png', 'skin-light-female.png'),
        'lightMale': ('skins/young_caucasian_male2/young_lightskinned_male_diffuse2.png', 'skin-light-male.png'),
        'darkFemale': ('skins/young_african_female/young_darkskinned_female_diffuse.png', 'skin-dark-female.png'),
        'hairShort': ('hair/short01/short01_diffuse.png', 'hair-short.png'),
        'hairBob': ('hair/bob02/bob02_diffuse.png', 'hair-bob.png'),
        'eyesBrown': ('eyes/materials/brown_eye.png', 'eyes-brown.png'),
    }
    textures = {}
    for key, (original, filename) in texture_sources.items():
        target = DEST/filename
        original_path = source/'subset'/original
        if original_path.exists() and original_path.resolve() != target.resolve(): shutil.copy2(original_path, target)
        assert target.exists(), target
        textures[key] = 'assets/character/'+filename
    shutil.copy2(source/'LICENSE.ASSETS.md', DEST/'LICENSE-CC0.md')
    shutil.copy2(source/'mpfb-LICENSE.md', DEST/'LICENSE-MPFB-scope.md')
    sha = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
    provenance = {
        'license': 'CC0-1.0',
        'bodySource': 'https://raw.githubusercontent.com/makehumancommunity/makehuman/v1.3.0/makehuman/data/3dobjs/base.obj',
        'bodySHA256': sha(source/'base.obj'),
        'rigSource': 'https://github.com/makehumancommunity/mpfb2/tree/master/src/mpfb/data/rigs/standard',
        'rigLicenseSource': 'https://github.com/makehumancommunity/mpfb2/blob/master/LICENSE.md',
        'rigSHA256': sha(source/'rig.game_engine.json'), 'weightsSHA256': sha(source/'weights.game_engine.json'),
        'systemPack': 'https://files.makehumancommunity.org/asset_packs/makehuman_system_assets/makehuman_system_assets_cc0.zip',
        'licenseSource': 'https://github.com/makehumancommunity/makehuman/blob/master/LICENSE.ASSETS.md',
        'coordinates': 'Unmodified OBJ axis convention: +Y up, +Z front, source units. No Blender default_position conversion.',
        'assets': [{'key': key, 'originalPath': original, 'file': textures[key], 'sha256': sha(DEST/filename)} for key, (original, filename) in texture_sources.items()],
    }
    output = ['// Derived solely from CC0 MakeHuman graphical assets. See assets/character/LICENSE-CC0.md.\n// Generated by scripts/prepare-human-assets.py; positions are raw HM08 OBJ coordinates.\n']
    for name, data in [('BONE_NAMES', bone_names), ('BONES', bones), ('BODY', body), *proxies.items(), ('TEXTURES', textures), ('PROVENANCE', provenance)]:
        output.append('export const HUMAN_'+name+'='+json.dumps(quantize(data), separators=(',', ':'))+';\n')
    (ROOT/'dist/human-model-data.js').write_text(''.join(output))
    (DEST/'provenance.json').write_text(json.dumps(provenance, indent=2)+'\n')
    print(json.dumps({'body': [body['vertexCount'], body['triangleCount']], 'hair': [proxies['HAIR_SHORT']['vertexCount'], proxies['HAIR_SHORT']['triangleCount']], 'bob': [proxies['HAIR_BOB']['vertexCount'], proxies['HAIR_BOB']['triangleCount']], 'eyes': [proxies['EYES']['vertexCount'], proxies['EYES']['triangleCount']], 'bones': len(bone_names), 'moduleBytes': (ROOT/'dist/human-model-data.js').stat().st_size}))

if __name__ == '__main__': main()
