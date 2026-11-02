// Ne réponds pas — Partie 1 (série horreur « Les règles de la nuit ») : scènes, HUD, réglages.
const EP = {
  subs: { font: '900 82px Montserrat', y: 360, stroke: 0, space: 24, red: '#FF4B4B' },
  vignette: { message: .5, message2: .5, fin: .7 },
  hideSubs: gt => gt > CUE.partie2 - .1,
};
const SC = {};
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
  bubbles.forEach(([txt, at]) => {
    if (gt < at - .6) return;
    if (gt < at) { [0, 1, 2].forEach(k => { circ(c, -230 + k * 30, y + 30, 10 + Math.sin(gt * 8 + k) * 2); fs(c, '#7A84B0', 0); }); return; }
    const s = pop(gt, at, .3);
    c.save(); c.translate(-260, y); c.scale(s, s);
    c.font = '700 40px Montserrat'; const words = txt.split(' '); const linesTxt = []; let cur = '';
    words.forEach(w => { const tst = cur ? cur + ' ' + w : w; if (c.measureText(tst).width > 440) { linesTxt.push(cur); cur = w; } else cur = tst; });
    linesTxt.push(cur);
    const h = 40 + linesTxt.length * 52;
    rr(c, 0, 0, 500, h, 26); fs(c, '#343D6E', 0);
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

// ---------- SCÈNES ----------
SC.chambre = (c, lt, gt) => {
  const b = CUE.buzz1, glowOn = gt > b;
  c.save(); cam(c, 560, 1000, 1.0 + lt * .012);
  bedroom(c, gt);
  const hand = kid(c, { x: 420, y: 1300, s: .78, f: 1, sit: 1, t: gt, eyes: gt > b ? .3 : 0, look: 1, front: [1.9, .9], back: [.6, .3] });
  // téléphone dans la main
  c.save(); c.translate(420 + hand[0] * .78, 1300 - 250 * .78 + hand[1] * .78);
  const sh = gt > b && gt < b + .9 ? Math.sin(gt * 110) * 5 : 0;
  c.rotate(.4); rr(c, -30 + sh, -55, 60, 100, 12); fs(c, '#F2F4FF', 0); rr(c, -22 + sh, -45, 44, 80, 8); fs(c, glowOn ? '#8FB4FF' : '#2A3050', 0);
  c.restore();
  if (glowOn) glow(c, 520, 900, 300, 'rgba(140,180,255,A)', .25);
  c.restore();
  dust(c, gt);
};
SC.message = (c, lt, gt) => {
  phoneUI(c, gt, 'Mamie', "chambre d'à côté", [["Si tu m'entends t'appeler depuis le jardin…", CUE.msg1], ['surtout, ne réponds pas.', chunkAt(2, 3)]]);
};
SC.lit = (c, lt, gt) => {
  const nm = CUE.name, scared = pr(gt, nm, nm + .4);
  c.save(); cam(c, lerp(560, 640, scared), lerp(980, 900, scared), lerp(1.15, 1.45, eio(scared)));
  bedroom(c, gt);
  kid(c, { x: 420, y: 1300, s: .78, f: 1, sit: 1, t: gt, eyes: scared, look: scared * 2, shake: scared > .5, front: [lerp(1.9, 1.2, scared), .9], back: [.6, .3] });
  if (gt > nm - .3) for (let k = 0; k < 3; k++) { const q = ((gt - nm) * .8 + k / 3) % 1; c.globalAlpha = (1 - q) * .8; c.beginPath(); c.arc(770, 780, 60 + q * 160, Math.PI * .6, Math.PI * 1.3); c.lineWidth = 7; c.strokeStyle = '#FF4B4B'; c.stroke(); }
  c.globalAlpha = 1;
  c.restore();
  dust(c, gt, 40, 7);
};
SC.voix = (c, lt, gt) => {
  const tap = CUE.tap;
  c.save(); cam(c, 540, lerp(900, 980, pr(lt, 0, 6)), 1.05 + lt * .02);
  nightGarden(c, -300, -300, 1700, 1800, gt);
  // façade de la maison avec la fenêtre de ta chambre
  rr(c, 160, 300, 760, 1300, 4); fs(c, '#232A4E', 0);
  for (let y = 330; y < 1600; y += 60) { c.fillStyle = 'rgba(255,255,255,.03)'; c.fillRect(160, y, 760, 4); }
  const sh = gt > tap && gt < tap + 1 ? Math.sin(gt * 90) * 4 : 0;
  rr(c, 340 + sh, 520, 400, 460, 6); fs(c, '#151A33', 12, '#D6DCF0');
  glow(c, 540, 750, 220, 'rgba(140,180,255,A)', .18);
  c.fillStyle = '#D6DCF0'; c.fillRect(535 + sh, 520, 10, 460);
  // longs doigts gris qui apparaissent sous la fenêtre
  const f = eo(pr(gt, tap - 1.2, tap - .2));
  if (f > 0) for (let d = 0; d < 4; d++) { const x = 400 + d * 34; line(c, [[x, 1120], [x + 4, 1120 - 150 * f], [x + 14, 990 - 30 * f]], 12, '#BFC3CE', null); }
  c.fillStyle = '#121734'; c.fillRect(-300, 1350, 1700, 900);
  c.restore();
  dust(c, gt, 30, 21);
};
SC.fenetre = (c, lt, gt) => {
  const rv = CUE.reveal, up = eo(pr(gt, rv, rv + 1.2));
  c.save(); cam(c, lerp(560, 640, up), lerp(1000, 880, up), lerp(1.0, 1.15, up));
  c.fillStyle = NAVY; c.fillRect(-300, -300, 1700, 2600);
  rr(c, 140, 300, 120, 1100, 10); fs(c, '#2E3670', 0);
  const WX = 330, WY = 380, WW = 760, WH = 760;
  c.save(); rr(c, WX, WY, WW, WH, 4); c.clip();
  nightGarden(c, WX, WY, WW, WH, gt);
  // corde à linge
  line(c, [[WX, WY + 420], [WX + WW, WY + 400]], 3, '#9AA0B8', null);
  // créature : cachée derrière le linge puis se redresse
  copieur(c, WX + 220, WY + 760 + lerp(160, 0, up), lerp(.5, .78, up), { t: gt, turn: 0 });
  rr(c, WX + 110, WY + 418, 150, 170, 8); fs(c, '#C63A3A', 0); for (let k = 0; k < 4; k++) { c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(WX + 110 + k * 38, WY + 418, 10, 170); c.fillRect(WX + 110, WY + 450 + k * 36, 150, 8); }
  rr(c, WX + 300, WY + 412, 40, 120, 8); fs(c, '#EDEFF5', 0); rr(c, WX + 345, WY + 412, 40, 120, 8); fs(c, '#EDEFF5', 0);
  rr(c, WX + 500, WY + 405, 110, 220, 8); fs(c, '#4A6AA8', 0);
  c.restore();
  rr(c, WX, WY, WW, WH, 4); fs(c, null, 16, '#D6DCF0'); c.fillStyle = '#D6DCF0'; c.fillRect(WX + WW / 2 - 6, WY, 12, WH); c.fillRect(WX, WY + WH / 2 - 6, WW, 12);
  c.fillStyle = '#2A3060'; c.fillRect(WX - 30, WY + WH, WW + 60, 30);
  c.fillStyle = '#141830'; c.fillRect(-300, 1500, 1700, 900);
  kid(c, { x: 230, y: 1520, s: .82, f: 1, t: gt, eyes: up, walk: gt < LINES[7].end ? gt * 5 : undefined, front: [up > .5 ? 2.4 : 1.2, .5], back: [.4, .2] });
  c.restore();
  dust(c, gt, 40, 33);
};
SC.creature = (c, lt, gt) => {
  const turn = eio(pr(gt, CUE.turn, CUE.turn + 1.6));
  c.save(); cam(c, 560, 540, 1.2 + lt * .05);
  nightGarden(c, -300, -300, 1700, 2200, gt);
  copieur(c, 520, 1500, 1.15, { t: gt, turn });
  c.restore();
  dust(c, gt, 30, 41);
};
SC.message2 = (c, lt, gt) => {
  phoneUI(c, gt, 'Mamie', "chambre d'à côté", [["Si tu m'entends t'appeler depuis le jardin…", -1], ['surtout, ne réponds pas.', -1], ["Ce n'est pas moi.", CUE.msg2], ['Ne fais aucun bruit.', chunkAt(11, 1) + .3], ['Il copie les voix.', chunkAt(11, 2) + .4]], CUE.buzz2);
};
SC.fin = (c, lt, gt) => {
  const cr = CUE.creak, open = eo(pr(gt, cr - .3, cr + 1.5));
  c.save(); cam(c, 540, lerp(950, 1150, pr(lt, 0, 6)), 1.05 + lt * .03);
  c.fillStyle = '#151933'; c.fillRect(-300, -300, 1700, 2600);
  // escalier qui descend vers la porte d'entrée
  for (let k = 0; k < 9; k++) { const y = 900 + k * 90, w = 700 - k * 40; rr(c, 540 - w / 2, y, w, 90, 2); fs(c, k % 2 ? '#20264A' : '#252C55', 0); }
  rr(c, 400, 560, 280, 330, 4); fs(c, '#0B0E1E', 0);
  // porte d'entrée qui s'ouvre : lumière de lune et ombre immense
  c.save(); c.globalCompositeOperation = 'lighter';
  c.fillStyle = `rgba(160,180,255,${.25 * open})`; c.fillRect(400, 560, 280 * open, 330); c.restore();
  if (open > .2) { c.save(); c.globalAlpha = open; c.fillStyle = '#05060D';
    c.beginPath(); c.moveTo(430, 890); c.lineTo(470, 1700); c.lineTo(600, 1700); c.lineTo(470, 890); c.closePath(); c.fill(); c.restore(); }
  rr(c, 400 + 280 * open, 560, 280 * (1 - open) + 4, 330, 2); fs(c, '#3A2E3A', 0);
  kid(c, { x: 300, y: 1750, s: 1.0, f: 1, t: gt, eyes: 1, shake: true, front: [.3, .2], back: [.2, .2] });
  c.restore();
  dust(c, gt, 30, 55);
  vignette(c, .6);
  const k = pr(gt, CUE.partie2 - .1, CUE.partie2 + .15);
  if (k > 0) {
    c.fillStyle = `rgba(6,7,12,${k})`; c.fillRect(0, 0, W, H);
    const s1 = pop(gt, CUE.partie2 + .1), s2 = pop(gt, CUE.partie2 + .35, .45), s3 = pop(gt, CUE.partie2 + .9);
    if (s1) { c.save(); c.translate(540, 700); c.scale(s1, s1); text(c, 'NE RÉPONDS PAS', 0, 0, '900 84px Montserrat', '#FF4B4B'); c.restore(); }
    if (s2) { c.save(); c.translate(540, 880); c.scale(s2, s2); text(c, 'PARTIE 2', 0, 0, '900 170px Montserrat', '#F2F4FF'); c.restore(); }
    if (s3) { c.save(); c.globalAlpha = clamp(s3); text(c, 'TU AURAIS RÉPONDU ?', 540, 1080, '800 48px Montserrat', '#C9D4FF', 'center', 0, OL, '4px'); text(c, 'OUI  /  NON', 540, 1160, '900 64px Montserrat', '#FF4B4B'); c.restore(); }
  }
};

// ---------- HUD : lieu + horodatage ----------
const PLACES = { chambre: 'TA CHAMBRE', message: 'TA CHAMBRE', lit: 'TA CHAMBRE', voix: 'JARDIN', fenetre: 'TA CHAMBRE', creature: 'JARDIN', message2: 'TA CHAMBRE', fin: 'ESCALIER' };
function hud(c, gt, sid) {
  if (gt > CUE.partie2 - .1) return;
  const secs = Math.floor(gt), tc = `03:00:${String(secs % 60).padStart(2, '0')}`.replace('03:00:', secs >= 60 ? '03:01:' : '03:00:');
  const label = PLACES[sid];
  c.save();
  c.font = '700 30px Montserrat'; c.letterSpacing = '10px'; const lw = c.measureText(label).width; c.letterSpacing = '0px';
  if (Math.floor(gt * 1.6) % 2 === 0) { circ(c, 540 - lw / 2 - 30, 190, 9); fs(c, '#FF3B3B', 0); }
  text(c, label, 540, 192, '700 30px Montserrat', '#E6EAFF', 'center', 0, OL, '10px');
  c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 14;
  text(c, tc, 540, 255, '700 92px "Roboto Mono"', '#FFFFFF');
  c.restore();
}
