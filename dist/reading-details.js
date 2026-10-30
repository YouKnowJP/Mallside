const colors=['#b57d66','#718f84','#c4aa6b','#8197aa','#9d819c'];
export const readingChoiceIndex=choice=>['receipt','window','bench'].indexOf(choice);

// All original books and joinery stay on the existing 30×30 shelf collider.
export function buildReadingDetails(w,b,x,z,theme){
 b.box(x,43,z-9,27,29,5,theme.trim);b.box(x,30,z,27,3,24,theme.wall);b.box(x,55,z,29,3,25,theme.wall);
 for(const dx of [-12,12])b.box(x+dx,43,z-4,1,23,14,theme.accent);
 for(let i=0;i<5;i++){
  const xx=x-10+i*5,h=17+i%3;
  b.box(xx,32+h/2,z-5,4,h,10,colors[i]);b.box(xx,32+h/2,z+.2,2.9,h-1.2,.4,'#e8dfcc');
  for(const y of [35,45])b.box(xx,y,z+1,3,.45,.4,theme.trim);
 }
 b.box(x+2,32,z+8,19,1,11,colors[1]);b.box(x+2,32.8,z+8,18,.5,10,'#f2ead8');
 for(const dx of [-4.5,4.5]){b.box(x+2+dx,33.3,z+8,8,.35,9,'#f5efdf');for(let j=0;j<4;j++)b.box(x+2+dx,33.55,z+5+j*1.7,6,.15,.2,'#b0a38c');}
 const marker=w.box(x+2,34,z+10,2,.4,8,w.mat(colors[0],{roughness:.8}));
 w.readingStudies??=[];w.readingStudies.push({marker,signature:null});updateReadingDetails(w);
 w.canvas.dataset.readingDetailRevision='42';
}
export function updateReadingDetails(w){
 const choice=w.state.commonsNotes?.find(n=>n.mallId===w.state.mallId&&n.floor===(w.state.floor||0)&&n.kind==='reading')?.choice,index=readingChoiceIndex(choice);
 for(const s of w.readingStudies||[]){if(s.signature===choice)continue;s.marker.material.color.set(colors[Math.max(0,index)]);s.marker.position.x+=(index<0?0:(index-1)*3)-(s.offset||0);s.offset=index<0?0:(index-1)*3;s.signature=choice;}
 if(w.readingStudies?.length)w.canvas.dataset.readingBookmark=choice||'unread';
}
