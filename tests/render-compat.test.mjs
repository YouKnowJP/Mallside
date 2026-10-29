import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {patchAmbientLighting} from '../dist/render-compat.js';

test('ambient compatibility preserves the vendored identity equation and refuses changed semantics',()=>{
 const chunks={lights_pars_begin:T.ShaderChunk.lights_pars_begin,lights_fragment_begin:T.ShaderChunk.lights_fragment_begin},before=chunks.lights_fragment_begin;
 assert.equal(patchAmbientLighting(chunks),true);assert.equal(chunks.lights_pars_begin,T.ShaderChunk.lights_pars_begin);assert.equal(chunks.lights_fragment_begin,before.replaceAll('getAmbientLightIrradiance( ambientLightColor )','ambientLightColor'));assert.equal(patchAmbientLighting(chunks),false);
 const changed={lights_pars_begin:T.ShaderChunk.lights_pars_begin.replace('vec3 irradiance = ambientLightColor;','vec3 irradiance = ambientLightColor * 2.0;'),lights_fragment_begin:before};assert.equal(patchAmbientLighting(changed),false);assert.equal(changed.lights_fragment_begin,before);
});
