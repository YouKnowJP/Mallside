// Source labels stay intact. This matching is an illustrated game fit, not real sizing advice.
export function referenceSize(s,p){
 if(p.sizingSystem==='alpha'){
  if(p.collectionReference===45&&s.size==='XXL'&&p.sizes.includes('XXL-1X'))return 'XXL-1X';
  const aliases={XXS:['XXS','2XS'],XXL:['XXL','2XL','2X'],XXXL:['XXXL','3XL','3X'],XXXXL:['XXXXL','4XL','4X']},choices=aliases[s.size]||[s.size];
  return choices.find(v=>p.sizes.includes(v))||null;
 }
 const waist=Number(s.waist);if(!Number.isFinite(waist))return null;
 if(p.sizingSystem==='waist')return p.sizes.find(v=>Number(v)===waist)||null;
 if(p.sizingSystem==='waist-inseam'){
  const rows=p.sizes.map(label=>({label,match:/^(\d+)\s*[xX]\s*(\d+)$/.exec(label)||/^W(\d+)L(\d+)$/.exec(label)})).filter(r=>r.match);
  rows.sort((a,b)=>Math.abs(Number(a.match[1])-waist)*100+Math.abs(Number(a.match[2])-32)-(Math.abs(Number(b.match[1])-waist)*100+Math.abs(Number(b.match[2])-32)));
  return rows[0]?.label||null;
 }
 return null;
}
