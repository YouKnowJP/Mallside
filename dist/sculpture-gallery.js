export const ART_VIEWS=['curve','shadow','color'];
export function sculptureDrawing(detail='curve'){
 const view=ART_VIEWS.includes(detail)?detail:'curve';
 const lines=view==='shadow'?'<path d="M60 117l62-15 75 15-65 15z" fill="#63746b" opacity=".28"/><path d="M94 110l62-9 57 15-65 11z" fill="#63746b" opacity=".18"/>':view==='color'?'<circle cx="82" cy="125" r="8" fill="#b38860"/><circle cx="106" cy="125" r="8" fill="#5e8b80"/><circle cx="130" cy="125" r="8" fill="#8195a0"/>':'';
 return `<svg class="sculpture-drawing" viewBox="0 0 260 160" role="img" aria-label="Original Two Lines study: ${view}"><rect x="1" y="1" width="258" height="158" rx="10" fill="#eee5d3"/><path d="M48 140h166M68 130h128" stroke="#b8b4a0" fill="none"/>${lines}<ellipse cx="111" cy="75" rx="25" ry="47" transform="rotate(-23 111 75)" fill="none" stroke="#b38860" stroke-width="${view==='curve'?5:8}"/><ellipse cx="146" cy="76" rx="25" ry="47" transform="rotate(24 146 76)" fill="none" stroke="#5e8b80" stroke-width="${view==='curve'?5:8}"/>${view==='curve'?'<path d="M73 62q5-35 23-39M173 85q8-39-9-57" stroke="#7a8174" stroke-width="1" fill="none"/>':''}</svg>`;
}
