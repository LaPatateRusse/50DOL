// Accessoires des séries horreur (style docs/style-horreur.md) : personnage, créature, décors, téléphone, HUD.
const NAVY = '#1C2140', NAVY2 = '#252C52', ORANGE = '#F28C28', MOON = 'rgba(190,205,255,A)';

// ---------- personnages ----------
// Toi : tête noire ronde, deux yeux blancs, sweat orange. o : x,y (pieds), s, f (1 = regarde à droite), sit, eyes (0..1 grands), look, arms
function kid(c, o) {
  const t = o.t || 0, s = o.s, f = o.f;
  c.save(); c.translate(o.x + (o.shake ? Math.sin(t * 50) * 2 : 0), o.y); c.scale(s * f, s);
  const legs = o.sit ? [[[0, -250], [110, -250], [112, -10]], [[-14, -250], [96, -250], [96, -10]]]
    : [-1, 1].map(k => { const a = o.walk !== undefined ? Math.sin(o.walk) * .35 * k : 0; return [[k * 10, -250], [k * 10 + Math.sin(a) * 250, -250 + Math.cos(a) * 248]]; });
  legs.forEach(L => { line(c, L, 26, '#8D93A6', null); const e = L[L.length - 1]; rr(c, e[0] - 16, e[1] - 12, 54, 22, 10); fs(c, '#15151C', 0); });
  c.translate(0, -250);
  // corps (sweat orange)
  rr(c, -58, -250, 116, 262, 34); fs(c, ORANGE, 0);
  c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(-58, -40, 116, 30);
  rr(c, -20, -60, 60, 46, 10); fs(c, 'rgba(0,0,0,.10)', 0); // poche
  line(c, [[-6, -238], [-10, -180]], 4, '#FFC58A', null); line(c, [[14, -238], [18, -186]], 4, '#FFC58A', null);
  const arm = (a, col) => {
    const sh = [10, -215], L1 = 105, L2 = 95;
    const el = [sh[0] + Math.sin(a[0]) * L1, sh[1] + Math.cos(a[0]) * L1];
    const ha = [el[0] + Math.sin(a[0] + a[1]) * L2, el[1] + Math.cos(a[0] + a[1]) * L2];
    line(c, [sh, el, ha], 26, col, null); circ(c, ha[0], ha[1], 15); fs(c, '#15151C', 0);
    return ha;
  };
  arm(o.back || [.2, .1], '#D9761C');
  // tête
  const hy = -315;
  circ(c, 8, hy, 78); fs(c, '#0E0E14', 0);
  c.beginPath(); c.arc(8, hy, 78, -1.1, .9); c.lineWidth = 7; c.strokeStyle = 'rgba(160,190,255,.75)'; c.stroke();
  const e = o.eyes ?? 0, lx = (o.look || 0) * 6;
  [[22, hy - 4], [58, hy - 4]].forEach(([x, y]) => { c.beginPath(); c.ellipse(x + lx, y, 11 + e * 6, 17 + e * 9, 0, 0, Math.PI * 2); fs(c, '#fff', 0); });
  const hand = arm(o.front || [.3, .1], ORANGE);
  c.restore();
  return hand;
}
// Le Copieur : très grand, maigre, gris pâle, bras trop longs, yeux jaunes lumineux.
function copieur(c, x, y, s, o = {}) {
  const t = o.t || 0, turn = o.turn ?? 1, breathe = Math.sin(t * 1.6) * 6;
  c.save(); c.translate(x, y); c.scale(s * (o.f || 1), s);
  const PALE = '#BFC3CE', SH = '#8E93A3';
  // jambes
  line(c, [[-40, -520], [-70, -260], [-40, 0]], 26, SH, null); line(c, [[40, -520], [80, -260], [60, 0]], 26, PALE, null);
  // torse voûté
  c.beginPath(); c.moveTo(-60, -520); c.quadraticCurveTo(-90, -800 + breathe, 20, -900 + breathe); c.quadraticCurveTo(110, -800, 60, -520); c.closePath(); fs(c, PALE, 0);
  for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(-40, -760 + k * 45); c.quadraticCurveTo(0, -740 + k * 45, 40, -760 + k * 45); c.lineWidth = 5; c.strokeStyle = SH; c.stroke(); }
  // bras jusqu'au sol, longs doigts
  [[-50, SH, -1], [70, PALE, 1]].forEach(([sx, col, k]) => {
    const hx = sx + k * 70, hy = -40;
    line(c, [[sx, -860 + breathe], [sx + k * 120, -450], [hx, hy]], 20, col, null);
    for (let d = -2; d <= 2; d++) line(c, [[hx, hy], [hx + d * 18 + k * 20, hy + 60]], 6, col, null);
  });
  // tête allongée qui tourne vers nous
  c.save(); c.translate(30, -930 + breathe); c.rotate((1 - turn) * .5);
  c.beginPath(); c.ellipse(0, 0, 60, 92, 0, 0, Math.PI * 2); fs(c, PALE, 0);
  const ex = lerp(30, 0, turn);
  [[-22, -10], [22, -10]].forEach(([dx, dy], i) => { if (turn < .5 && i === 0) return; glow(c, dx + ex, dy, 60, 'rgba(255,225,80,A)', .55); c.beginPath(); c.ellipse(dx + ex, dy, 11, 8, 0, 0, Math.PI * 2); fs(c, '#FFE36B', 0); });
  if (turn > .6) { c.beginPath(); c.moveTo(-34 + ex, 38); c.quadraticCurveTo(ex, 60, 34 + ex, 38); c.lineWidth = 5; c.strokeStyle = '#3A1D24'; c.stroke(); }
  c.restore();
  c.restore();
}

// ---------- décors ----------
function dust(c, t, n = 40, seed = 0) {
  for (let i = 0; i < n; i++) {
    const x = (rnd(i + seed) * W + Math.sin(t * .3 + i) * 40), y = (rnd(i + seed + 50) * H - t * (6 + rnd(i) * 10)) % H;
    c.globalAlpha = .25 + .35 * Math.abs(Math.sin(t + i)); circ(c, x, y < 0 ? y + H : y, 2 + rnd(i + 9) * 3); fs(c, '#C9D4FF', 0);
  }
  c.globalAlpha = 1;
}
function nightGarden(c, x, y, w, h, t) { // vue du jardin la nuit (dans une fenêtre ou plein cadre)
  c.fillStyle = grad(c, y, y + h, ['#1A2350', '#2A3468', '#1B2240']); c.fillRect(x, y, w, h);
  glow(c, x + w * .62, y + h * .2, h * .35, MOON, .45); circ(c, x + w * .62, y + h * .2, h * .06); fs(c, '#F2F4FF', 0);
  for (let k = 0; k < 9; k++) { const px = x + k * w / 8 - 40, ph = h * (.35 + rnd(k + 3) * .2); c.beginPath(); c.moveTo(px - 70, y + h * .62); c.lineTo(px, y + h * .62 - ph); c.lineTo(px + 70, y + h * .62); fs(c, '#141A38', 0); }
  c.fillStyle = '#161C36'; c.fillRect(x, y + h * .62, w, h * .38);
}
function bedroom(c, t, opts = {}) {
  c.fillStyle = NAVY; c.fillRect(-300, -300, 1700, 2600);
  for (let x = -300; x < 1400; x += 120) { c.fillStyle = 'rgba(255,255,255,.025)'; c.fillRect(x, -300, 6, 1700); }
  // fenêtre + rideaux + rayon de lune
  nightGarden(c, 560, 260, 420, 520, t);
  rr(c, 552, 252, 436, 536, 6); fs(c, null, 14, '#D6DCF0'); c.fillStyle = '#D6DCF0'; c.fillRect(764, 252, 10, 536); c.fillRect(552, 515, 436, 10);
  rr(c, 480, 220, 90, 640, 10); fs(c, '#2E3670', 0); rr(c, 970, 220, 90, 640, 10); fs(c, '#2E3670', 0);
  c.save(); c.globalCompositeOperation = 'lighter';
  const g = c.createLinearGradient(780, 780, 500, 1400); g.addColorStop(0, 'rgba(150,170,255,.16)'); g.addColorStop(1, 'rgba(150,170,255,0)');
  c.fillStyle = g; c.beginPath(); c.moveTo(560, 780); c.lineTo(980, 780); c.lineTo(820, 1500); c.lineTo(160, 1500); c.closePath(); c.fill(); c.restore();
  // poster
  rr(c, 120, 330, 220, 300, 8); fs(c, '#4A3A7A', 0); circ(c, 230, 440, 60); fs(c, '#8E7BD0', 0); c.fillStyle = '#8E7BD0'; c.fillRect(160, 540, 140, 14); c.fillRect(160, 570, 110, 10);
  c.fillStyle = '#141830'; c.fillRect(-300, 1300, 1700, 900);
  // table de nuit + réveil
  rr(c, -60, 1080, 220, 220, 8); fs(c, '#2A2F55', 0);
  rr(c, 10, 1020, 120, 60, 8); fs(c, '#0E0E14', 0); text(c, '03:00', 70, 1051, '700 38px "Roboto Mono"', '#FF4B4B');
  // lit
  rr(c, 140, 1060, 840, 140, 14); fs(c, '#3B4690', 0);
  rr(c, 160, 1010, 200, 70, 30); fs(c, '#E6E9F5', 0);
  for (let k = 1; k < 6; k++) { c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(360 + k * 100, 1066, 4, 130); }
  c.fillStyle = '#1D2148'; c.fillRect(140, 1200, 840, 100);
}
function phoneUI(c, gt, name, sub, bubbles, buzzAt) {
  c.fillStyle = grad(c, 0, H, ['#151A30', '#1E2648', '#10142A']); c.fillRect(0, 0, W, H);
  c.save(); c.filter = 'blur(30px)'; c.fillStyle = 'rgba(120,140,220,.35)'; c.fillRect(-80, 560, 300, 500); c.restore();
  const shake = buzzAt !== undefined && gt > buzzAt && gt < buzzAt + .8 ? Math.sin(gt * 120) * 6 : 0;
  c.save(); c.translate(540 + shake, 1250); c.scale(1.28, 1.28);
  rr(c, -330, -640, 660, 1320, 70); fs(c, '#0B0D18', 0);
  rr(c, -300, -610, 600, 1260, 50); fs(c, '#1A2040', 0);
  c.fillStyle = '#222A50'; c.fillRect(-300, -560, 600, 150);
  line(c, [[-250, -505], [-270, -485], [-250, -465]], 6, '#7FA6FF', null);
  circ(c, -175, -485, 44); fs(c, '#5B8BE0', 0); text(c, name[0], -175, -483, '800 44px Montserrat', '#fff');
  text(c, name, -110, -505, '800 44px Montserrat', '#fff', 'left'); text(c, sub, -110, -458, '600 28px Montserrat', '#9AA6D6', 'left');
  let y = -330;
  bubbles.forEach(b => {
    const [txt, at] = b;
    if (gt < at - .6) return;
    if (gt < at) { [0, 1, 2].forEach(k => { circ(c, -230 + k * 30, y + 30, 10 + Math.sin(gt * 8 + k) * 2); fs(c, '#7A84B0', 0); }); return; }
    const s = pop(gt, at, .3);
    c.save(); c.translate(b[2] ? -240 : -260, y); c.scale(s, s);
    c.font = '700 40px Montserrat'; const words = txt.split(' '); const linesTxt = []; let cur = '';
    words.forEach(w => { const tst = cur ? cur + ' ' + w : w; if (c.measureText(tst).width > 440) { linesTxt.push(cur); cur = w; } else cur = tst; });
    linesTxt.push(cur);
    const h = 40 + linesTxt.length * 52;
    rr(c, 0, 0, 500, h, 26); fs(c, b[2] ? '#3B6FE0' : '#343D6E', 0);
    linesTxt.forEach((l, i) => text(c, l, 30, 46 + i * 52, '700 40px Montserrat', '#fff', 'left'));
    text(c, '03:00', 10, h + 30, '600 26px Montserrat', '#8A93BE', 'left');
    c.restore();
    y += h + 70;
  });
  rr(c, -260, 520, 520, 70, 35); fs(c, '#141936', 0); text(c, 'Message…', -220, 556, '600 30px Montserrat', '#555E8E', 'left');
  c.restore();
  // mains
  [[-1, 0], [1, 1]].forEach(([k]) => { for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(540 + k * 430, 1560 + i * 110, 50, 44, 0, 0, Math.PI * 2); fs(c, '#0E0E14', 0); } });
}


// HUD horreur : point rouge + lieu + horodatage qui défile depuis start (« HH:MM:SS »).
function horrorHud(c, gt, label, start = '03:00:00') {
  const [h, m, s0] = start.split(':').map(Number), tot = h * 3600 + m * 60 + s0 + Math.floor(gt);
  const tc = [Math.floor(tot / 3600) % 24, Math.floor(tot / 60) % 60, tot % 60].map(v => String(v).padStart(2, '0')).join(':');
  c.save();
  c.font = '700 30px Montserrat'; c.letterSpacing = '10px'; const lw = c.measureText(label).width; c.letterSpacing = '0px';
  if (Math.floor(gt * 1.6) % 2 === 0) { circ(c, 540 - lw / 2 - 30, 190, 9); fs(c, '#FF3B3B', 0); }
  text(c, label, 540, 192, '700 30px Montserrat', '#E6EAFF', 'center', 0, OL, '10px');
  c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 14;
  text(c, tc, 540, 255, '700 92px "Roboto Mono"', '#FFFFFF');
  c.restore();
}
// Carton de fin : titre de la série, « PARTIE N », question OUI / NON.
function horrorEnd(c, gt, at, title, part, question) {
  const k = pr(gt, at - .1, at + .15); if (k <= 0) return;
  c.fillStyle = `rgba(6,7,12,${k})`; c.fillRect(0, 0, W, H);
  const s1 = pop(gt, at + .1), s2 = pop(gt, at + .35, .45), s3 = pop(gt, at + .9);
  if (s1) { c.save(); c.translate(540, 700); c.scale(s1, s1); text(c, title, 0, 0, '900 84px Montserrat', '#FF4B4B'); c.restore(); }
  if (s2) { c.save(); c.translate(540, 880); c.scale(s2, s2); text(c, part, 0, 0, '900 170px Montserrat', '#F2F4FF'); c.restore(); }
  if (s3 && question) { c.save(); c.globalAlpha = clamp(s3); text(c, question, 540, 1080, '800 48px Montserrat', '#C9D4FF', 'center', 0, OL, '4px'); text(c, 'OUI  /  NON', 540, 1160, '900 64px Montserrat', '#FF4B4B'); c.restore(); }
}

// Héros de toutes les vidéos depuis le 02/11 (personnage de l'avatar) : accepte les mêmes options que drawMax.
function hero(c, o) {
  const s = o.s * 1.06;
  if (o.lean) { c.save(); c.translate(o.x, o.y - 250 * s); c.rotate((o.f || 1) * o.lean * .6); c.translate(-o.x, -(o.y - 250 * s)); }
  const r = kid(c, { x: o.x, y: o.y, s, f: o.f || 1, t: o.t, sit: o.sit, walk: o.walk, shake: o.shiver || o.shake,
    eyes: o.eyes ?? (o.mouthO ? .9 : .15), look: o.look ?? 1, front: o.front, back: o.back });
  if (o.lean) c.restore();
  return r;
}
