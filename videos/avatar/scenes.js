// Avatar du compte @etsi_scenario : Max, fond lumineux, bulle « ? ».
const EP = { vignette: { a: 0 }, hideSubs: () => true };
const SC = {};
SC.a = (c) => {
  // carré utile : y 420 → 1500 (1080 px), recadré ensuite
  const cx = 540, cy = 960;
  c.fillStyle = grad(c, 420, 1500, ['#FFD84D', '#FFA62B']); c.fillRect(0, 0, W, H);
  c.save(); c.translate(cx, cy);
  for (let i = 0; i < 16; i++) { c.rotate(Math.PI / 8); c.beginPath(); c.moveTo(0, 0); c.lineTo(-90, -900); c.lineTo(90, -900); c.closePath(); c.fillStyle = i % 2 ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,0)'; c.fill(); }
  c.restore();
  circ(c, cx, cy + 40, 400); fs(c, 'rgba(255,255,255,.35)', 0);
  // Max en buste, grand
  drawMax(c, { x: cx - 40, y: cy + 1050, s: 1.75, f: 1, t: 0, front: [.15, .1], back: [.15, .1] });
  // bulle « ? »
  c.save(); c.translate(cx + 290, cy - 300);
  circ(c, 0, 0, 120); fs(c, '#fff', 10);
  c.beginPath(); c.moveTo(-70, 80); c.lineTo(-120, 150); c.lineTo(-20, 105); c.closePath(); fs(c, '#fff', 0);
  text(c, '?', 0, 10, '700 170px Oswald', '#E53935');
  c.restore();
};
function hud() {}
