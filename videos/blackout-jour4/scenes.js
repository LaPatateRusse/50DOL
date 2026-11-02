// Blackout général — Jour 4 (moteur ../engine/, accessoires props.js).
const EP = { vignette: { ration: .18, purif: .18 }, hideSubs: gt => gt > CUE.jour5 - .1 };
const SC = {};

function paperBg(c) {
  c.fillStyle = '#F1EADB'; c.fillRect(-100, -100, 1300, 2200);
  for (let x = -100; x < 1300; x += 54) { c.fillStyle = x % 270 ? '#E5DCC8' : '#DCD1BA'; c.fillRect(x, -100, 3, 2200); }
  for (let y = -100; y < 2100; y += 54) { c.fillStyle = y % 270 ? '#E5DCC8' : '#DCD1BA'; c.fillRect(-100, y, 1300, 3); }
}
function bottle(c, x, y, s, fill, col = '#4A90D9', label = '') {
  c.save(); c.translate(x, y); c.scale(s, s);
  rr(c, -36, -110, 72, 200, [24, 24, 12, 12]); fs(c, '#CFE6F7', 6);
  rr(c, -36, 90 - 200 * fill, 72, 200 * fill, [0, 0, 12, 12]); fs(c, col, 0);
  rr(c, -36, -110, 72, 200, [24, 24, 12, 12]); fs(c, null, 6);
  rr(c, -18, -140, 36, 34, 6); fs(c, '#2F6FB5', 6);
  if (label) text(c, label, 0, 30, '700 30px Oswald', '#fff');
  c.restore();
}
function door(c, x, y) {
  rr(c, x, y, 330, 760, 6); fs(c, '#5C4330', 7);
  rr(c, x + 40, y + 50, 250, 290, 6); fs(c, '#6A4E38', 5); rr(c, x + 40, y + 390, 250, 320, 6); fs(c, '#6A4E38', 5);
  circ(c, x + 290, y + 400, 14); fs(c, '#C9A227', 5);
}

SC.doute = (c, lt, gt) => {
  c.save(); cam(c, 520, 980, 1.05 + lt * .02);
  nightRoom(c, '#5A6276', '#353B4B');
  door(c, 120, 580);
  drawMax(c, { x: 640, y: 1340, s: .88, f: -1, t: gt, front: [.3, .3], back: [.2, .2] });
  c.restore();
  const q = pop(gt, LINES[0].start + 2.2);
  if (q) { c.save(); c.translate(540, 380); c.scale(q, q); rr(c, -320, -70, 640, 140, 30); fs(c, '#FFF8E1', 6); text(c, '« Ils t\'attendent en bas. »', 0, 4, '700 48px Montserrat', '#24365E'); c.restore(); }
  forbid(c, 285, 700, pop(gt, CUE.stay));
  badge(c, 285, 860, pop(gt, CUE.stay + .2), 'ON NE SORT PAS', '#E53935');
};
SC.titre = (c, lt, gt) => {
  c.save(); cam(c, 540, 960, lerp(1.0, 1.06, pr(lt, 0, 4)));
  exteriorNight(c, gt, 0, 1);
  snow(c, gt, 110, .85);
  c.restore();
  const s1 = pop(lt, .1), s2 = pop(lt, .3, .45);
  c.save(); c.translate(540, 300); c.scale(s1, s1); rr(c, -300, -58, 600, 116, 6); fs(c, '#E53935', 0); text(c, 'BLACKOUT GÉNÉRAL', 0, 4, '700 78px Oswald', '#fff'); c.restore();
  c.save(); c.translate(540, 500); c.scale(s2, s2); text(c, 'JOUR 4', 6, 10, '700 250px Oswald', '#8C93A3'); text(c, 'JOUR 4', 0, 0, '700 250px Oswald', '#EEF0F4'); c.restore();
  card(c, 540, 690, pop(gt, LINES[2].start + 1.2), 'EAU STOCKÉE', '158 L', dropIcon, '#1d1d22', '', 0);
};
SC.ration = (c, lt, gt) => {
  c.save(); cam(c, 540, 900, lerp(1.0, 1.05, pr(lt, 0, 7)));
  paperBg(c);
  const hs = pop(lt, .1);
  c.save(); c.translate(540, 260); c.scale(hs, hs); text(c, 'RATIONNER', 0, 0, '700 120px Oswald', '#2A2A2A'); text(c, 'PAR JOUR', 0, 100, '800 34px Montserrat', '#2A2A2A', 'center', 0, OL, '4px'); c.restore();
  const b = CUE.bottles;
  [[300, 'BOIRE', '2 L', '#4A90D9', 1], [540, 'SE LAVER', '1 L', '#7DB5EA', .5], [780, 'RÉSERVE', '+', '#2EAD5B', .9]].forEach(([x, lab, v, col, f], i) => {
    const s = pop(gt, b + i * .5); if (!s) return;
    bottle(c, x, 620, s * 1.3, f, col, v);
    c.save(); c.translate(x, 860); c.scale(s, s); text(c, lab, 0, 0, '700 52px Oswald', '#2A2A2A'); c.restore();
  });
  c.restore();
};
SC.purif = (c, lt, gt) => {
  const p = CUE.pill, k = eo(pr(gt, p, p + 1.2));
  c.save(); cam(c, 540, 900, 1.0 + lt * .01);
  paperBg(c);
  c.save(); c.translate(540, 240); text(c, 'PURIFIER', 0, 0, '700 120px Oswald', '#2A2A2A'); c.restore();
  bottle(c, 440, 640, 1.6, .75, gt > p + .6 ? '#4A90D9' : '#9BA77A', '');
  if (gt > p - .3 && gt < p + .9) { const y = lerp(380, 640, k); circ(c, 440, y, 26); fs(c, '#FFFFFF', 6); }
  if (gt > p + .3 && gt < p + 2) for (let i = 0; i < 8; i++) { circ(c, 420 + rnd(i) * 50, 700 - ((gt * 120 + i * 40) % 220), 6); fs(c, '#EAF4FF', 3, '#9CC3FF'); }
  const t = pop(gt, CUE.timer);
  if (t) { c.save(); c.translate(780, 640); c.scale(t, t); circ(c, 0, 0, 130); fs(c, '#fff', 8); c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 112, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pr(gt, CUE.timer, CUE.timer + 1.5)); c.closePath(); fs(c, '#F5C518', 0); text(c, 'NOTICE', 0, 190, '700 48px Oswald', '#2A2A2A'); c.restore(); }
  badge(c, 440, 890, pop(gt, p - .2), 'PASTILLE (PHARMACIE)', '#2EAD5B');
  c.restore();
};
SC.fenetre = (c, lt, gt) => {
  c.save(); cam(c, 540, lerp(1000, 1250, eio(pr(lt, 0, 5))), lerp(1.0, 1.35, eio(pr(lt, 0, 5))));
  exteriorNight(c, gt, 1);
  // hall éclairé par des lampes torches
  rr(c, 440, 1380, 220, 120, 4); fs(c, '#0B0E18', 0);
  if (gt > CUE.torch - .6) for (let i = 0; i < 3; i++) {
    const a = Math.sin(gt * 1.3 + i * 2) * .5;
    c.save(); c.globalCompositeOperation = 'lighter'; c.translate(480 + i * 70, 1440); c.rotate(a);
    const g = c.createLinearGradient(0, 0, 160, 0); g.addColorStop(0, 'rgba(255,240,190,.5)'); g.addColorStop(1, 'rgba(255,240,190,0)');
    c.fillStyle = g; c.beginPath(); c.moveTo(0, 0); c.lineTo(160, -40); c.lineTo(160, 40); c.closePath(); c.fill(); c.restore();
    figure(c, 480 + i * 70, 1495, .18, '#05070C', 0, 1);
  }
  snow(c, gt, 70, .7, .8, 300);
  c.restore();
  badge(c, 540, 300, pop(gt, LINES[7].start), '3 SILHOUETTES', '#E53935');
};
SC.camion = (c, lt, gt) => {
  const lg = gt > CUE.lights;
  c.save(); cam(c, 540, 1100, 1.05 + lt * .02);
  c.fillStyle = grad(c, -200, 1500, ['#0B1020', '#2A3552']); c.fillRect(-300, -300, 1700, 2600);
  skyline(c, NEAR, '#1A2133', '#161C2B');
  c.fillStyle = '#3A4256'; c.fillRect(-300, 1450, 1700, 800);
  // camion
  const x = lerp(1300, 640, eo(pr(gt, CUE.lights - .4, CUE.lights + 2)));
  rr(c, x - 330, 1220, 460, 250, 16); fs(c, '#D7262E', 6); rr(c, x + 140, 1280, 190, 190, 16); fs(c, '#C21F27', 6);
  rr(c, x + 170, 1300, 120, 80, 8); fs(c, '#9CC3FF', 4);
  text(c, 'SÉCURITÉ CIVILE', x - 100, 1330, '700 46px Oswald', '#fff');
  circ(c, x - 220, 1480, 46); fs(c, '#1d1d22', 6); circ(c, x + 220, 1480, 46); fs(c, '#1d1d22', 6);
  if (lg) { const on = Math.floor(gt * 6) % 2; glow(c, x + 200, 1260, 300, on ? 'rgba(60,120,255,A)' : 'rgba(255,60,60,A)', .5); rr(c, x + 180, 1250, 50, 24, 6); fs(c, on ? '#4A8BFF' : '#FF4B4B', 0); }
  for (let i = 0; i < 3; i++) { rr(c, x - 280 + i * 70, 1400, 50, 60, 8); fs(c, '#2F72C0', 4); }
  snow(c, gt, 60, .6, .8, 500);
  c.restore();
};
SC.choix = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.1);
  nightRoom(c, '#4A5266', '#2C3140');
  window4(c, 520, 380, 420, 520, '#4B3A2E');
  c.fillStyle = grad(c, 380, 900, ['#0E1424', '#26304A']); c.fillRect(520, 380, 420, 520);
  const on = Math.floor(gt * 6) % 2; glow(c, 730, 860, 200, on ? 'rgba(60,120,255,A)' : 'rgba(255,60,60,A)', .5);
  windowEnd(c, 520, 380, 420, 520, '#4B3A2E');
  drawMax(c, { x: 420, y: 1340, s: .88, f: 1, t: gt, front: [2.0, .6], back: [.3, .2] });
  headlamp(c, 420, 1340, .88, 1, false, gt);
  c.restore();
  const s = pop(gt, LINES[9].start + 3.5);
  if (s) { badge(c, 330, 300, s, 'DESCENDRE : OUI', '#2EAD5B'); badge(c, 750, 300, s, 'ATTENDRE : NON', '#E53935'); }
  const k = pr(gt, CUE.jour5 - .1, CUE.jour5 + .15);
  if (k > 0) {
    c.fillStyle = `rgba(8,8,10,${k})`; c.fillRect(0, 0, W, H);
    const s1 = pop(gt, CUE.jour5 + .1), s2 = pop(gt, CUE.jour5 + .3, .45), s3 = pop(gt, CUE.jour5 + .9);
    if (s1) { c.save(); c.translate(540, 700); c.scale(s1, s1); rr(c, -300, -58, 600, 116, 6); fs(c, '#E53935', 0); text(c, 'BLACKOUT GÉNÉRAL', 0, 4, '700 78px Oswald', '#fff'); c.restore(); }
    if (s2) { c.save(); c.translate(540, 900); c.scale(s2, s2); text(c, 'JOUR 5', 6, 10, '700 250px Oswald', '#5A2020'); text(c, 'JOUR 5', 0, 0, '700 250px Oswald', '#EEF0F4'); c.restore(); }
    if (s3) { c.save(); c.globalAlpha = clamp(s3); text(c, 'LE DERNIER JOUR…', 540, 1110, '800 44px Montserrat', '#F5C518', 'center', 0, OL, '6px'); c.restore(); }
  }
};
function hud(c, gt, sid) {
}
