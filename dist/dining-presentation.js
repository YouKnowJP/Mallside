// These are original game meals. The shapes and seating do not represent a real menu.
export const DINING_SEATS = [
 {id:'left', name:'Left seat', offset:-22},
 {id:'right', name:'Right seat', offset:22}
];

export function diningSeat(layout,id) {
 const bench=layout.seating?.[0];
 const choice=DINING_SEATS.find(seat=>seat.id===id);
 if(!bench||!choice)return null;
 const x=bench.x+bench.width/2+choice.offset;
 return {id:choice.id,x,y:bench.y+bench.height/2,rotation:0,bench:true,height:15,
  approach:{x,y:bench.y+bench.height+30}};
}

export function mealAnimation(id) {
 if(id==='coffee'||id==='water')return 'drink';
 return id==='icecream'?'icecream':'eat';
}

const dishes={
 sandwich:`<ellipse cx="80" cy="55" rx="49" ry="26" fill="#f7e7cb"/><ellipse cx="80" cy="55" rx="42" ry="20" fill="none" stroke="#cda477" stroke-width="1.5"/>
 <path d="M47 59l18-32 32 33-19 11z" fill="#aa6035"/><path d="M47 53l18-30 33 32-20 12z" fill="#ddaa69"/>
 <path d="M55 51l13-19m-8 24 13-19m-7 23 12-18" stroke="#99542d" stroke-width="2" stroke-linecap="round"/>
 <path d="M78 47l28-14 20 29-31 8z" fill="#8a5232"/><path d="M78 43l28-14 20 29-31 8z" fill="#ebbd79"/>
 <path d="M91 45l17-8m-14 13 17-8m-14 13 17-8" stroke="#ad6c3f" stroke-width="2" stroke-linecap="round"/>`,
 bowl:`<path d="M36 48q5 33 44 33t44-33" fill="#608a7e"/><ellipse cx="80" cy="47" rx="44" ry="22" fill="#dae2d5"/><ellipse cx="80" cy="47" rx="38" ry="17" fill="#f7e3bd"/>
 <path d="M48 45l9-8 9 6-6 10zm47-5 7-6 10 8-7 8zm-21 12 7-7 10 6-6 8z" fill="#77966d"/>
 <path d="M68 38l7 1-2 7-7-1zm28 11 7 3-3 6-7-3zm-35 5 7 1-2 6-7-1z" fill="#d88855"/>
 <path d="M77 33l5 1m3 6 5 1m-40 9 4 2m33 10 5-1" stroke="#bc9a68" stroke-width="1.5" stroke-linecap="round"/>`,
 snack:`<ellipse cx="80" cy="64" rx="48" ry="17" fill="#e8d8be"/><path d="M38 52q18 22 42-6l6 5q-9 27-36 19-10-4-12-18z" fill="#d9a94e"/>
 <path d="M79 46l4-5 5 4-2 6" fill="#7a7041"/><path d="M41 56q17 17 36-3" fill="none" stroke="#f5d77b" stroke-width="2"/>
 <path d="M82 39l5 28q12 10 29 0l5-28" fill="#e6b7a8"/><ellipse cx="101.5" cy="39" rx="19.5" ry="8" fill="#faf1d8"/><path d="M94 40q8-5 14-1" fill="none" stroke="#d8bcad" stroke-width="2"/>`,
 coffee:`<ellipse cx="81" cy="67" rx="43" ry="14" fill="#b1c6af"/><path d="M104 39q22-3 17 10-3 7-17 8" fill="none" stroke="#eee2c9" stroke-width="7"/>
 <path d="M55 36l5 27q19 12 41 0l6-27" fill="#f5e7cd"/><ellipse cx="81" cy="36" rx="26" ry="12" fill="#faf0d9"/>
 <ellipse cx="81" cy="36" rx="21" ry="8" fill="#876143"/><path d="M73 36q8-8 15 0-8 6-15 0z" fill="#e9c397"/>`,
 icecream:`<path d="M64 48l16 32 17-32z" fill="#c39057"/><path d="M68 54l17 17m-12-8 18-11m-14 20 11-7" stroke="#9f6e41" stroke-width="1.6"/>
 <path d="M60 47q-4-7 4-11-1-16 16-18 17 1 17 18 10 4 3 13z" fill="#f7e8be"/><path d="M68 34q4-11 14-11" fill="none" stroke="#fff5df" stroke-width="3" stroke-linecap="round"/>`,
 water:`<ellipse cx="80" cy="73" rx="26" ry="8" fill="#b2c7bc"/><path d="M62 28l5 42q13 6 26 0l5-42" fill="#c7ded6"/>
 <path d="M65 45l3 23q12 6 24 0l3-23" fill="#8db8bd"/><ellipse cx="80" cy="44" rx="15" ry="5" fill="#abd0cf"/>
 <ellipse cx="80" cy="28" rx="18" ry="6" fill="#d9ebe2"/><path d="M69 37l4 26" stroke="#edf4e8" stroke-width="2"/>`
};

export function mealArtwork(id) {
 if(!Object.hasOwn(dishes,id))return '';
 return `<svg class="meal-art" viewBox="0 0 160 94" aria-hidden="true" focusable="false">
 <rect width="160" height="94" rx="12" fill="#e3e9d9"/><path d="M0 71q46-15 91-1t69 0v24H0z" fill="#d6dfca"/>
 ${dishes[id]}</svg>`;
}

export function mealEffects(food) {
 return `<div class="meal-effects"><span>${food.minutes} game min</span><span>+${food.hunger} fullness</span><span>+${food.energy} stamina</span></div>`;
}
