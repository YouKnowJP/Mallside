// Original source-review props stay on the existing desk, bench and fitting partitions.
export function buildTextileStudio(w,st,style){
 const denim=st.products.some(p=>p.type==='pants'),paper='#eee7d7';
 for(const [i,p]of st.products.slice(0,3).entries()){
  const x=562+i*36;
  for(let layer=0;layer<3;layer++)w.box(x,36+layer*2,153,26,1.7,18,p.color);
  for(const dx of [-10,10])w.box(x+dx,40.9,153,.35,.3,14,denim?'#bba27a':'#c2b7a4');
  w.box(x+7,41.2,157,6,.3,6,paper);
 }
 for(const dx of [-37,37]){w.cyl(600+dx,85,132,1.2,4,style.trim);w.box(600+dx,79,133,21,2,1,style.trim);}
 for(let i=0;i<5;i++)w.box(573+i*13,48,133.1,10,12,.5,st.products[i%st.count].color);
 // A simple tape and note pad are planning tools, not purchasable merchant stock.
 w.cyl(644,34,157,5,2,denim?'#d5b679':'#b49d89');w.cyl(644,35.2,157,2,.5,paper);
 w.box(572,17,629,24,1.8,18,style.accent);for(let i=0;i<5;i++)w.box(562+i*4,18.1,629,.3,.2,16,style.wall);
 for(const room of w.layout.fittingRooms){
  const z=w.layout.fitting.y+8;
  for(const dx of [-18,18]){w.box(room.x+dx,44,z,2,67,1.6,style.trim);w.box(room.x+dx,44,z+1.1,.6,58,.5,'#f2e4c0');}
  for(const y of [11,77])w.box(room.x,y,z,38,2,1.6,style.trim);
 }
 w.canvas.dataset.textileStudio=denim?'denim':'jersey';
}
