// Avatars du compte @etsi_scenario (sans Max) : A = bulle « ET SI ? », B = personnage « toi » en lumière.
const EP = { vignette: { a: 0, b: 0 }, hideSubs: () => true };
const SC = {};
function rays(c, cx, cy, col) {
  c.save(); c.translate(cx, cy);
  for (let i = 0; i < 16; i++) { c.rotate(Math.PI / 8); c.beginPath(); c.moveTo(0, 0); c.lineTo(-90, -900); c.lineTo(90, -900); c.closePath(); c.fillStyle = i % 2 ? col : 'rgba(0,0,0,0)'; c.fill(); }
  c.restore();
}
SC.a = (c) => {
  const cx = 540, cy = 960;
  c.fillStyle = grad(c, 420, 1500, ['#3EC6E0', '#2A7FD4']); c.fillRect(0, 0, W, H);
  rays(c, cx, cy, 'rgba(255,255,255,.12)');
  // grande bulle
  c.save(); c.translate(cx, cy - 20);
  rr(c, -360, -250, 720, 460, 120); fs(c, '#FFFFFF', 0);
  c.beginPath(); c.moveTo(-160, 200); c.lineTo(-250, 330); c.lineTo(-40, 205); c.closePath(); fs(c, '#FFFFFF', 0);
  text(c, 'ET SI', -40, -10, '700 230px Oswald', '#1d2448');
  text(c, '?', 250, -10, '700 260px Oswald', '#FF4B4B');
  c.restore();
  circ(c, 800, 1290, 26); fs(c, '#FFD84D', 0); circ(c, 870, 1220, 14); fs(c, '#FFD84D', 0);
};
SC.b = (c) => {
  const cx = 540, cy = 960;
  c.fillStyle = grad(c, 420, 1500, ['#FFE7A8', '#FFB86B']); c.fillRect(0, 0, W, H);
  rays(c, cx, cy, 'rgba(255,255,255,.22)');
  kid(c, { x: cx - 40, y: cy + 950, s: 1.6, f: 1, t: 0, eyes: .6, look: 0, front: [.2, .1], back: [.2, .1] });
  c.save(); c.translate(cx + 300, cy - 300);
  circ(c, 0, 0, 115); fs(c, '#fff', 0);
  c.beginPath(); c.moveTo(-70, 75); c.lineTo(-120, 145); c.lineTo(-20, 100); c.closePath(); fs(c, '#fff', 0);
  text(c, '?', 0, 8, '700 160px Oswald', '#FF4B4B');
  c.restore();
};
function hud() {}
