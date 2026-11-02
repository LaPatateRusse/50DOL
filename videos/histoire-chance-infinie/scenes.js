// Chance Infinie — histoire complète (kits : props.js, horreur.js → hero/kid, quotidien.js).
const EP = { hideSubs: gt => gt > CUE.endcard - .1, subs: { font: '700 84px Oswald', y: 250, stroke: 14, space: 22 } };
const SC = {};
const L = i => LINES[i].start;
const RAIN = ['#7D8A9C', '#B9C3CF'];

function cat(c, x, y, s, f = 1, o = {}) {           // chat noir, yeux jaunes, collier rouge
  c.save(); c.translate(x, y); c.scale(s * f, s);
  c.beginPath(); c.moveTo(-90, -40); c.quadraticCurveTo(-170, -60, -150, -170); c.lineWidth = 22; c.strokeStyle = '#121218'; c.lineCap = 'round'; c.stroke();
  c.beginPath(); c.ellipse(0, -60, 100, 60, 0, 0, Math.PI * 2); fs(c, '#121218', 0);
  [-50, 50].forEach(k => { rr(c, k - 14, -40, 28, 40, 10); fs(c, '#121218', 0); });
  circ(c, 90, -130, 58); fs(c, '#121218', 0);
  [[55, -175], [125, -175]].forEach(([ex, ey]) => { c.beginPath(); c.moveTo(ex - 24, ey + 20); c.lineTo(ex, ey - 30); c.lineTo(ex + 24, ey + 20); c.closePath(); fs(c, '#121218', 0); });
  const e = o.eyes ?? 1;
  [[72, -135], [112, -135]].forEach(([ex, ey]) => { c.beginPath(); c.ellipse(ex, ey, 11, 15 * e + 1, 0, 0, Math.PI * 2); fs(c, '#FFD23F', 0); c.beginPath(); c.ellipse(ex, ey, 3, 11 * e + .5, 0, 0, Math.PI * 2); fs(c, '#121218', 0); });
  line(c, [[48, -88], [128, -84]], 10, '#E53935', null); circ(c, 92, -72, 13); fs(c, '#F5C518', 0);
  c.restore();
}
function rain(c, t, a = .5) { c.save(); c.globalAlpha = a; for (let i = 0; i < 90; i++) { const x = (i * 137) % 1400 - 150, y = ((i * 263 + t * 1600) % 2100) - 200; line(c, [[x, y], [x - 12, y + 50]], 4, '#E6EEF8', null); } c.restore(); }
function car(c, x, y) {
  rr(c, x, y - 200, 520, 150, 40); fs(c, '#D64545', 6); rr(c, x + 90, y - 290, 300, 110, 30); fs(c, '#D64545', 6);
  rr(c, x + 120, y - 270, 110, 70, 10); fs(c, '#BFE3F7', 4); rr(c, x + 250, y - 270, 110, 70, 10); fs(c, '#BFE3F7', 4);
  circ(c, x + 110, y - 45, 50); fs(c, '#222', 6); circ(c, x + 410, y - 45, 50); fs(c, '#222', 6);
  glow(c, x + 520, y - 140, 90, 'rgba(255,240,170,A)', .6);
}
function bill(c, x, y, s, label, col = '#6FBF73') { c.save(); c.translate(x, y); c.scale(s, s); c.rotate(-.08); rr(c, -120, -60, 240, 120, 12); fs(c, col, 6); circ(c, 0, 0, 36); fs(c, 'rgba(255,255,255,.4)', 0); text(c, label, 0, 4, '700 62px Oswald', '#1d1d22'); c.restore(); }
function grandpa(c, x, y, s, o = {}) { mate(c, x, y, s, '#8FB3D9', '#ECECF2', 1, o); }

SC.rue = (c, lt, gt) => {
  const saved = gt > CUE.save, vanished = gt > CUE.vanish;
  c.save(); cam(c, 540, 1100, 1.05);
  dayStreet(c, gt, { sky: RAIN });
  const cx = saved ? 300 : 600;
  if (!vanished) cat(c, saved ? 390 : 600, saved ? 1250 : 1560, .8, saved ? -1 : 1, { eyes: gt > L(1) ? 1.3 : .9 });
  hero(c, { x: saved ? 300 : lerp(-120, 520, pr(gt, L(0) + .5, CUE.save)), y: 1420, s: .72, f: 1, t: gt, walk: saved ? undefined : gt * 12, front: saved ? [2.2, .2] : undefined, eyes: saved ? .9 : .3 });
  car(c, lerp(1500, saved ? 900 : 700, eo(pr(gt, CUE.car, CUE.save))) + (saved ? (gt - CUE.save) * 600 : 0), 1680);
  if (vanished) { const k = pr(gt, CUE.vanish, CUE.vanish + .6); if (k < 1) { c.save(); c.globalAlpha = 1 - k; cat(c, 390, 1250, .8, -1); c.restore(); } }
  c.restore();
  rain(c, gt);
};
SC.chance = (c, lt, gt) => {
  c.save(); cam(c, 540, 1050, 1.05);
  dayStreet(c, gt);
  hero(c, { x: 380, y: 1420, s: .75, f: 1, t: gt, eyes: .8, mouthO: gt > CUE.bill });
  c.restore();
  const b = pop(gt, CUE.bill); if (b) bill(c, 760, 1300, b, '20 €');
  const k = pop(gt, CUE.ticket); if (k) card(c, 760, 900, k * .9, 'TICKET À GRATTER', '100 €', (p, x, y) => { circ(p, x, y, 40); fs(p, '#F5C518', 6); text(p, '★', x, y + 4, '700 50px Montserrat', '#fff'); }, '#2EAD5B', '', 0);
  const m = pop(gt, CUE.crush);
  if (m) { c.save(); c.translate(540, 1620); c.scale(m, m); rr(c, -360, -80, 720, 160, 40); fs(c, '#fff', 6); text(c, '💬 « Tu fais quoi samedi ? »', 0, 4, '800 42px Montserrat', '#1d1d22'); c.restore(); }
};
SC.perte = (c, lt, gt) => {
  const two = gt > L(5);
  c.save(); cam(c, 540, 1050, 1.05);
  dayStreet(c, gt, { sky: ['#C9D4E0', '#E8EDF2'] });
  if (!two) {
    mate(c, 760, 1420, .78, '#7D6B5D', '#3A2A1A', -1, { arm: Math.sin(gt * 8) > 0, eyes: .9 });
    hero(c, { x: 300, y: 1420, s: .72, f: 1, t: gt, eyes: .5 });
  } else {
    mate(c, 740, 1420, .76, '#5B8BE0', '#3A2A1A', -1, { eyes: .05 });
    for (let i = 0; i < 2; i++) { const y = 900 + ((gt * 300 + i * 120) % 200); circ(c, 690 - i * 30, y, 10); fs(c, '#7FC8FF', 0); }
    hero(c, { x: 300, y: 1420, s: .72, f: 1, t: gt, eyes: .9 });
  }
  c.restore();
  if (gt > CUE.lose1 && !two) badge(c, 760, 600, pop(gt, CUE.lose1), '−20 €', '#E53935');
  if (gt > CUE.lose2) badge(c, 740, 600, pop(gt, CUE.lose2), 'LARGUÉ', '#E53935');
};
SC.collier = (c, lt, gt) => {
  const zoom = gt > CUE.note;
  c.save(); cam(c, zoom ? 560 : 540, zoom ? 1080 : 1100, zoom ? 1.6 : 1.05);
  brightRoom(c);
  cat(c, 560, 1070, .7, -1, { eyes: 1 });
  c.restore();
  c.fillStyle = 'rgba(20,24,60,.35)'; c.fillRect(0, 0, W, H);
  const n = pop(gt, CUE.note, .4);
  if (n) {
    c.save(); c.translate(540, 1250); c.scale(n, n); c.rotate(-.03);
    rr(c, -420, -260, 840, 520, 14); fs(c, '#FFF6DC', 6);
    ['La chance ne se crée pas.', 'Elle se déplace.', 'Pour arrêter…', 'donne-la.'].forEach((l, i) => text(c, l, 0, -150 + i * 100, '700 58px Oswald', i === 3 ? '#E53935' : '#3A2A1A'));
    c.restore();
  }
};
SC.papy = (c, lt, gt) => {
  const woke = gt > CUE.wake;
  c.save(); cam(c, 540, 1050, 1.05);
  c.fillStyle = '#EAF2F5'; c.fillRect(-300, -300, 1700, 1700); c.fillStyle = '#B9CDD6'; c.fillRect(-300, 1320, 1700, 900);
  rr(c, 760, 420, 220, 160, 12); fs(c, '#1d1d22', 0);
  c.beginPath(); for (let x = 0; x <= 200; x += 4) { const ph = (x + gt * 120) % 200, y = 500 - (ph > 90 && ph < 110 ? (woke ? 50 : 20) * Math.sin((ph - 90) / 20 * Math.PI * 2) : 0); x ? c.lineTo(770 + x, y) : c.moveTo(770 + x, y); } c.lineWidth = 5; c.strokeStyle = '#3DDC84'; c.stroke();
  grandpa(c, 380, 1310, .78, { eyes: woke ? .5 : 0, smile: woke });
  rr(c, 120, 1060, 640, 260, 20); fs(c, '#CFE3F0', 0); rr(c, 140, 1020, 180, 60, 26); fs(c, '#FFFFFF', 0); c.fillStyle = '#9FBACB'; c.fillRect(120, 1300, 640, 30);
  cat(c, 640, 1060, .5, -1);
  hero(c, { x: 900, y: 1420, s: .74, f: -1, t: gt, front: [2.6, .2], eyes: woke ? 1 : .3 });
  if (gt > CUE.give && gt < CUE.give + 3) for (let i = 0; i < 14; i++) { const k = ((gt - CUE.give) * .6 + i / 14) % 1; circ(c, lerp(780, 450, k), 1100 - Math.sin(k * Math.PI) * 220 + Math.sin(i) * 30, 10); fs(c, '#FFD23F', 0); }
  c.restore();
};
SC.fin = (c, lt, gt) => {
  c.save(); cam(c, 460, 1000, 1.45 + lt * .02);
  c.fillStyle = '#EAF2F5'; c.fillRect(-300, -300, 1700, 1700); c.fillStyle = '#B9CDD6'; c.fillRect(-300, 1320, 1700, 900);
  grandpa(c, 380, 1310, .78, { eyes: .6, smile: true });
  rr(c, 120, 1060, 640, 260, 20); fs(c, '#CFE3F0', 0); rr(c, 140, 1020, 180, 60, 26); fs(c, '#FFFFFF', 0);
  cat(c, 640, 1060, .5, -1, { eyes: 1.2 });
  c.restore();
  endAsk(c, gt, CUE.endcard, 'CHANCE INFINIE', 'À QUI TU L\'AURAIS DONNÉE ?');
};
function hud() {}
