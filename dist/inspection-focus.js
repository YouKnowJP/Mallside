const CLOSE_UPS=new Set(['ceramic','storage','fragrance','brush','collectible','read']);
// Restore before simulation updates, then temporarily hide only nearby character occluders.
// This changes camera presentation, never positions, routing, stock or activity state.
export function restoreInspectionActors(w){if(!w.inspectionActors)return;for(const [g,visible]of w.inspectionActors)g.visible=visible;w.inspectionActors.clear();}
export function focusInspectionActors(w){
 if(!w.inside||!CLOSE_UPS.has(w.action?.kind))return;w.inspectionActors??=new Map();
 const hide=g=>{if(!g||g===w.player||Math.hypot(g.position.x-w.avatar.x,g.position.z-w.avatar.y)>100)return;w.inspectionActors.set(g,g.visible);g.visible=false;};
 for(const s of w.storeStaff||[])hide(s.mesh);for(const a of w.storeCustomers?.actors||[])hide(a.visual?.g);
}
