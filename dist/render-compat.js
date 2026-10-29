// r180's ambient helper is an identity function. Inlining its uniform argument
// avoids a Safari/ANGLE Metal linker error about constant/thread address spaces.
// Guard the exact helper semantics so a future library update is never rewritten
// if the equation changes. Other light, shadow and material calculations stay put.
export function patchAmbientLighting(chunks){
 const identity=/vec3 getAmbientLightIrradiance\s*\(\s*const in vec3 ambientLightColor\s*\)\s*\{\s*vec3 irradiance = ambientLightColor;\s*return irradiance;\s*\}/;
 if(!identity.test(chunks.lights_pars_begin||''))return false;
 const source=chunks.lights_fragment_begin,call='getAmbientLightIrradiance( ambientLightColor )';
 if(typeof source!=='string'||!source.includes(call))return false;
 chunks.lights_fragment_begin=source.replaceAll(call,'ambientLightColor');return true;
}
