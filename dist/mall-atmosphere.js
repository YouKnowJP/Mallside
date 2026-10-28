// Palette and adult appearance variation without extra lights, assets or actors.
const STOPS=[
 {minute:600,name:'morning',sky:[.82,.89,.89],sun:[1,.95,.84],sunPower:2.0,ambient:1.45,window:.28},
 {minute:840,name:'afternoon',sky:[.82,.89,.91],sun:[1,.97,.89],sunPower:2.15,ambient:1.5,window:.22},
 {minute:1050,name:'golden hour',sky:[.86,.81,.74],sun:[1,.80,.56],sunPower:1.65,ambient:1.30,window:.65},
 {minute:1200,name:'evening',sky:[.45,.54,.64],sun:[1,.72,.48],sunPower:.7,ambient:1.12,window:1.05}
];
export function daylightAt(minutes=600,indoor=false){
 const m=Math.max(600,Math.min(1200,Number.isFinite(minutes)?minutes:600));let i=1;while(i<STOPS.length-1&&m>STOPS[i].minute)i++;
 const a=STOPS[i-1],b=STOPS[i],raw=(m-a.minute)/(b.minute-a.minute),t=raw*raw*(3-2*raw),mix=(a,b)=>a+(b-a)*t,colors=(a,b)=>a.map((n,i)=>mix(n,b[i]));
 return {name:t<.5?a.name:b.name,sky:colors(a.sky,b.sky),sun:colors(a.sun,b.sun),sunPower:mix(a.sunPower,b.sunPower)*(indoor?.64:1),ambient:mix(a.ambient,b.ambient)+(indoor?.25:0),window:mix(a.window,b.window),elevation:mix(850,600)*(1-(m-600)/1200)};
}
const PEOPLE=[
 {skin:'#d2a17e',hair:'#3d3029',hairStyle:'short',faceStyle:'defined'},
 {skin:'#986b53',hair:'#282421',hairStyle:'bob',faceStyle:'natural'},
 {skin:'#e1bb99',hair:'#af9067',hairStyle:'short',faceStyle:'natural'},
 {skin:'#b58362',hair:'#4b3830',hairStyle:'bob',faceStyle:'defined'},
 {skin:'#79503e',hair:'#262322',hairStyle:'short',faceStyle:'natural'},
 {skin:'#d4ac8d',hair:'#776755',hairStyle:'bob',faceStyle:'defined'}
];
export function adultAppearance(index=0){return {...PEOPLE[((Math.trunc(index)||0)%PEOPLE.length+PEOPLE.length)%PEOPLE.length]};}
