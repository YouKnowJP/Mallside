// A host acknowledges arrival and each new study, then returns to a relaxed pose.
const smooth = t => {
 const x = Math.max(0, Math.min(1, t));
 return x * x * x * (10 + x * (6 * x - 15));
};
const rise = .44, hold = .29, fall = .68;

export function consultationLift(trip, signature, dt, {paused = false, reducedMotion = false} = {}) {
 if (reducedMotion) {
  trip.presentation = null;
  return 0;
 }
 let pose = trip.presentation;
 if (!paused) {
  if (!pose || pose.signature !== signature) {
   pose = trip.presentation = {signature, elapsed:0, from:pose?.lift || 0, lift:pose?.lift || 0};
  }
  pose.elapsed = Math.min(rise + hold + fall, pose.elapsed + Math.max(0, dt));
  pose.lift = pose.elapsed < rise
   ? pose.from + (1 - pose.from) * smooth(pose.elapsed / rise)
   : 1 - smooth((pose.elapsed - rise - hold) / fall);
 }
 return pose?.lift || 0;
}
