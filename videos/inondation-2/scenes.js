// Alerte inondation — Jour 2 : série de survie au schéma du Blackout (moteur : ../engine/engine.js + props.js).
const EP = {
  vignette: { danger: .18, robinet: .18 },
  hideSubs: gt => gt > CUE.jour3 - .1,
};
const SC = {};
const WATER = 'rgba(92,120,110,A)';

// ---------- aides ----------
function rain(c, gt, n = 120, a = .5) {
  c.save(); c.strokeStyle = `rgba(200,215,235,${a})`; c.lineWidth = 3;
  for (let i = 0; i < n; i++) {
    const x = ((i * 137) % 1500) - 200, y = ((i * 251 + gt * 2400) % 2300) - 300;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x - 14, y + 60); c.stroke();
  }
  c.restore();
}
function water(c, top, gt, col = '#4E6E66', a = .92) { // surface ondulée de top jusqu'en bas
  c.save(); c.globalAlpha = a; c.beginPath(); c.moveTo(-300, 2300);
  for (let x = -300; x <= 1400; x += 40) c.lineTo(x, top + Math.sin(x * .02 + gt * 3) * 10 + Math.sin(x * .05 - gt * 5) * 5);
  c.lineTo(1400, 2300); c.closePath(); c.fillStyle = col; c.fill();
  c.globalAlpha = a * .6; c.strokeStyle = '#9FBAB0'; c.lineWidth = 6; c.beginPath();
  for (let x = -300; x <= 1400; x += 40) { const y = top + Math.sin(x * .02 + gt * 3) * 10 + Math.sin(x * .05 - gt * 5) * 5; x === -300 ? c.moveTo(x, y) : c.lineTo(x, y); }
  c.stroke(); c.restore();
}
function street(c, gt, level) { // rue de nuit sous la pluie, eau au niveau `level`
  c.fillStyle = grad(c, -200, 1500, ['#0B1020', '#253049']); c.fillRect(-300, -300, 1700, 2600);
  skyline(c, FAR, '#28324A', '#222B40');
  [[-120, 620], [300, 560], [720, 600]].forEach(([x, y], k) => {
    rr(c, x, y, 380, 1300, 4); fs(c, ['#2A3248', '#30384F', '#272F44'][k], 5, '#0A0D14');
    for (let r = 0; r < 9; r++) for (let q = 0; q < 3; q++) { const lit = (r * 3 + q + k) % 7 === 0; c.fillStyle = lit ? '#FFB347' : '#161C2A'; c.fillRect(x + 40 + q * 110, y + 60 + r * 120, 70, 70); }
  });
  c.fillStyle = '#3A4256'; c.fillRect(-300, 1560, 1700, 800);
  rr(c, 840, 1250, 18, 320, 4); fs(c, '#1A1E28', 0); glow(c, 850, 1250, 260, 'rgba(255,200,120,A)', .35); circ(c, 850, 1250, 16); fs(c, '#FFD58A', 0);
  water(c, level, gt);
  rain(c, gt);
}
function carSide(c, x, y, s, tilt = 0, col = '#C0392B') {
  c.save(); c.translate(x, y); c.rotate(tilt); c.scale(s, s);
  rr(c, -220, -90, 440, 110, 30); fs(c, col, 6);
  c.beginPath(); c.moveTo(-130, -90); c.lineTo(-80, -170); c.lineTo(100, -170); c.lineTo(150, -90); c.closePath(); fs(c, col, 6);
  c.beginPath(); c.moveTo(-110, -95); c.lineTo(-72, -155); c.lineTo(5, -155); c.lineTo(5, -95); c.closePath(); fs(c, '#9CC3E6', 0);
  c.beginPath(); c.moveTo(20, -95); c.lineTo(20, -155); c.lineTo(92, -155); c.lineTo(130, -95); c.closePath(); fs(c, '#9CC3E6', 0);
  circ(c, -130, 20, 50); fs(c, '#1d1d22', 6); circ(c, 130, 20, 50); fs(c, '#1d1d22', 6);
  circ(c, -130, 20, 20); fs(c, '#AEB6C0', 0); circ(c, 130, 20, 20); fs(c, '#AEB6C0', 0);
  c.restore();
}
function paperBg(c) {
  c.fillStyle = '#F1EADB'; c.fillRect(-300, -300, 1700, 2600);
  for (let x = -300; x < 1400; x += 54) { c.fillStyle = '#E5DCC8'; c.fillRect(x, -300, 3, 2600); }
  for (let y = -300; y < 2300; y += 54) { c.fillStyle = '#E5DCC8'; c.fillRect(-300, y, 1700, 3); }
}
function stairs(c, gt, wl) { // cage d'escalier vue de côté ; wl = niveau de l'eau
  nightRoom(c, '#3A4254', '#232833');
  for (let i = 0; i < 9; i++) { rr(c, 80 + i * 110, 1330 - i * 90, 1200, 90, 0); fs(c, '#5A5048', 4, '#2A241F'); }
  line(c, [[120, 1150], [1100, 430]], 14, '#8A6A4A', OL, 5);
  for (let i = 0; i < 9; i++) line(c, [[150 + i * 110, 1330 - i * 90], [150 + i * 110, 1150 - i * 80]], 6, '#8A6A4A', null);
  if (wl !== undefined) water(c, wl, gt, '#4E6E66', .85);
}
function radioBox(c, x, y, on, gt, t0) {
  line(c, [[x + 200, y + 10], [x + 320, y - 210]], 6, '#9AA3AE', OL, 4);
  rr(c, x, y, 330, 200, 22); fs(c, '#8B5E3C', 7);
  rr(c, x + 25, y + 25, 150, 150, 14); fs(c, '#3A2A20', 5);
  for (let r = 0; r < 5; r++) for (let k = 0; k < 5; k++) { circ(c, x + 45 + k * 28, y + 45 + r * 28, 6); fs(c, '#1d1510', 0); }
  rr(c, x + 195, y + 35, 115, 50, 8); fs(c, on ? '#F5C518' : '#5A4A30', 5);
  if (on) for (let k = 0; k < 3; k++) { const q = ((gt - t0) * 1.2 + k / 3) % 1; c.globalAlpha = 1 - q; c.beginPath(); c.arc(x + 100, y + 100, 140 + q * 180, -1.1, -.3); c.lineWidth = 8; c.strokeStyle = '#F5C518'; c.stroke(); }
  c.globalAlpha = 1;
}
function floodTitle(c, day, y, s1, s2, sub) {
  if (s1) { c.save(); c.translate(540, y); c.scale(s1, s1); rr(c, -330, -58, 660, 116, 6); fs(c, '#1F6FB2', 0); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(-330, 50, 660, 8); text(c, 'ALERTE INONDATION', 0, 4, '700 78px Oswald', '#fff'); c.restore(); }
  if (s2) { c.save(); c.translate(540, y + 200); c.scale(s2, s2); text(c, 'JOUR ' + day, 6, 10, '700 250px Oswald', sub || '#8C93A3'); text(c, 'JOUR ' + day, 0, 0, '700 250px Oswald', '#EEF0F4'); c.restore(); }
}

function winFrame(c) { // cadre de fenêtre au premier plan (on voit la rue à travers)
  c.fillStyle = '#2A2018'; c.fillRect(0, 0, W, 90); c.fillRect(0, 0, 50, H); c.fillRect(W - 50, 0, 50, H); c.fillRect(0, 1700, W, 220);
  c.fillRect(W / 2 - 18, 90, 36, 1610); c.fillRect(50, 860, W - 100, 30);
  c.fillStyle = 'rgba(180,200,230,.06)'; c.fillRect(50, 90, W - 100, 1610);
}
// ---------- SCÈNES ----------
function manOnPost(c, x, wy, gt, holding, arms) { // homme dans l'eau, éclairé par le lampadaire
  glow(c, x, wy - 120, 260, 'rgba(255,210,140,A)', .35);
  rr(c, x - 45, wy - 170, 90, 200, 30); fs(c, '#C0392B', 5);
  circ(c, x, wy - 215, 40); fs(c, '#E8B48A', 5); c.fillStyle = '#3A2A20'; c.beginPath(); c.arc(x, wy - 225, 41, Math.PI, 0); c.fill();
  if (holding) { line(c, [[x + 35, wy - 140], [x + 85, wy - 200]], 22, '#C0392B', OL, 5); line(c, [[x - 35, wy - 140], [x + 80, wy - 150]], 22, '#C0392B', OL, 5); }
  else { const up = Math.sin(gt * 6) * .3 * arms; line(c, [[x - 35, wy - 140], [x - 95, wy - 260 - up * 60]], 22, '#C0392B', OL, 5); line(c, [[x + 35, wy - 140], [x + 95, wy - 250 + up * 60]], 22, '#C0392B', OL, 5); }
}
function jerry(c, x, y, s, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); rr(c, -50, -70, 100, 140, 14); fs(c, '#F2A31B', 6); rr(c, -14, -92, 28, 26, 6); fs(c, '#C0392B', 5); rr(c, -36, -56, 40, 22, 8); fs(c, null, 6, '#C98A10'); c.restore(); }
function boat(c, x, y, s, gt) {
  c.save(); c.translate(x, y + Math.sin(gt * 3) * 6); c.scale(s, s);
  c.beginPath(); c.moveTo(-220, -40); c.lineTo(220, -40); c.lineTo(170, 40); c.lineTo(-180, 40); c.closePath(); fs(c, '#E53935', 6);
  c.fillStyle = '#fff'; c.fillRect(-200, -20, 380, 14);
  [-80, 40].forEach((dx, k) => { rr(c, dx - 30, -150, 60, 110, 20); fs(c, '#1F2A44', 5); circ(c, dx, -180, 30); fs(c, '#E8B48A', 5); rr(c, dx - 32, -215, 64, 26, 10); fs(c, '#C0392B', 4); });
  c.restore();
}
// ---------- SCÈNES ----------
SC.fenetre = (c, lt, gt) => {
  const close = gt >= LINES[1].start - .1, zk = close ? eio(pr(gt, LINES[1].start - .1, LINES[1].start + .5)) : 0;
  c.save(); cam(c, lerp(400, 560, zk), lerp(1250, 1100, zk), lerp(1.5, 1.1, zk));
  street(c, gt, 1380);
  manOnPost(c, 330, 1380 + Math.sin(gt * 2) * 6, gt, false, 1);
  water(c, 1380, gt, '#4E6E66', .9);
  c.restore();
  winFrame(c);
  if (close) { c.save(); c.globalAlpha = zk; drawMax(c, { x: 820, y: 1700, s: .9, f: -1, t: gt, front: [.6, .4], back: [.3, .2] }); c.restore(); }
  forbid(c, 540, 380, pop(gt, CUE.no));
};
SC.titre = (c, lt, gt) => {
  c.save(); cam(c, 540, 960, lerp(1.0, 1.06, pr(lt, 0, 4))); street(c, gt, 1400); c.restore();
  c.fillStyle = 'rgba(5,8,16,.35)'; c.fillRect(0, 0, W, H);
  floodTitle(c, 2, 320, pop(lt, .1), pop(lt, .3, .45));
  const s3 = pop(lt, .6);
  if (s3) { c.save(); c.translate(540, 720); c.scale(s3, s3); rr(c, -125, -40, 250, 80, 40); fs(c, '#34373F', 5, '#22252b'); text(c, '03 H 20', 0, 3, '800 44px Montserrat', '#F5C518', 'center', 0, OL, '4px'); c.restore(); }
  badge(c, 540, 1420, pop(gt, CUE.r1 + .6), 'NE JAMAIS ENTRER DANS L\'EAU');
};
SC.danger = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.0 + lt * .01);
  c.fillStyle = grad(c, 0, 1900, ['#0B1020', '#253049']); c.fillRect(-300, -300, 1700, 2600);
  water(c, 520, gt, '#3E5A52', .97);
  for (let i = 0; i < 40; i++) { circ(c, (i * 197) % 1200, 600 + (i * 331) % 1300, 4 + i % 5); fs(c, 'rgba(160,190,170,.25)', 0); }
  c.fillStyle = '#2A2E2A'; c.fillRect(-300, 1650, 1700, 400);
  const m = pop(gt, CUE.manhole);
  if (m) { c.save(); c.translate(300, 1650); c.scale(m, m); c.beginPath(); c.ellipse(0, 0, 150, 40, 0, 0, Math.PI * 2); fs(c, '#050607', 0); c.save(); c.translate(170, -60); c.rotate(-.6); c.beginPath(); c.ellipse(0, 0, 150, 30, 0, 0, Math.PI * 2); fs(c, '#4A4F58', 5); c.restore(); c.restore();
    for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(300, 1650, 80 + ((gt * 120 + k * 60) % 180), Math.PI * 1.1, Math.PI * 1.9); c.lineWidth = 6; c.strokeStyle = 'rgba(200,230,220,.4)'; c.stroke(); } }
  [[700, 1200, .4], [880, 900, -.3], [200, 1000, .8]].forEach(([x, y, r], k) => { const s = pop(gt, CUE.manhole + .6 + k * .3); if (!s) return; c.save(); c.translate(x + Math.sin(gt + k) * 20, y); c.rotate(r + gt * .2); c.scale(s, s); rr(c, -120, -18, 240, 36, 6); fs(c, '#6B4A30', 5); c.restore(); });
  const sp = pop(gt, CUE.spark);
  if (sp) { c.save(); c.translate(820, 1500); c.scale(sp, sp); line(c, [[0, -200], [0, 0]], 14, '#1d1d22', null); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28 + gt * 8; line(c, [[0, 0], [Math.cos(a) * 90, Math.sin(a) * 90]], 8, '#F5C518', null); } glow(c, 0, 0, 200, 'rgba(255,230,80,A)', .6 * (.5 + .5 * Math.sin(gt * 30))); c.restore(); }
  c.restore();
  const f = pop(gt, CUE.fall - 1.6);
  if (gt > LINES[4].start - .1) { c.fillStyle = 'rgba(241,234,219,.97)'; c.fillRect(0, 0, W, H);
    const k = clamp((gt - LINES[4].start) / 2);
    c.save(); c.translate(540, 1500); rr(c, -400, -150 * 1, 800, 150, 0); fs(c, '#6AAED8', 0); for (let i = 0; i < 6; i++) { const x = -380 + ((i * 160 + gt * 200) % 760); line(c, [[x, -120], [x + 60, -120]], 8, '#fff', null); } c.restore();
    text(c, '15 CM', 540, 300, '700 200px Oswald', '#E53935');
    c.save(); c.translate(540, 1350); c.rotate(eo(pr(gt, CUE.fall - .4, CUE.fall + .2)) * 1.3); line(c, [[0, 0], [0, -360]], 40, '#3B4A6B', OL, 6); circ(c, 0, -420, 60); fs(c, '#E8B48A', 6); c.restore();
    badge(c, 540, 520, pop(gt, CUE.fall), 'ÇA SUFFIT POUR TOMBER');
  }
};
SC.appel = (c, lt, gt) => {
  c.fillStyle = '#0B0E15'; c.fillRect(0, 0, W, H);
  c.save(); cam(c, 540, 900, lerp(1.0, 1.08, pr(lt, 0, 4)));
  glow(c, 560, 760, 700, 'rgba(120,160,255,A)', .25);
  phone(c, 560, 760, .05, 1, (p, w, h) => {
    p.fillStyle = grad(p, 0, h, ['#1E2A44', '#0E1424']); p.fillRect(0, 0, w, h);
    text(p, gt > CUE.call ? 'Appel en cours…' : 'Composer', w / 2, 110, '700 34px Montserrat', '#9AA2BC');
    text(p, '112', w / 2, 260, '700 150px Oswald', '#fff');
    if (gt > CUE.call) { const q = pr(gt, CUE.call, CUE.call + 1); for (let k = 0; k < 3; k++) { c.globalAlpha = 1; } circ(p, w / 2, 560, 60); fs(p, '#E53935', 0); text(p, '✆', w / 2, 566, '700 60px Montserrat', '#fff'); }
    else { circ(p, w / 2, 560, 60); fs(p, '#34C759', 0); text(p, '✆', w / 2, 566, '700 60px Montserrat', '#fff'); }
  });
  c.restore();
  const s = pop(gt, chunkAt(5, 2));
  if (s) { c.save(); c.translate(540, 1500); c.scale(s, s); rr(c, -360, -80, 720, 160, 30); fs(c, '#fff', 6); text(c, '📍 ADRESSE', 0, -24, '700 50px Oswald', '#1d1d22'); text(c, '+ CE QUI SE PASSE', 0, 40, '700 40px Oswald', '#E53935'); c.restore(); }
};
SC.fenetre2 = (c, lt, gt) => {
  const hold = gt > CUE.grab;
  c.save(); cam(c, 460, 1250, 1.45);
  street(c, gt, 1380);
  manOnPost(c, hold ? 770 : lerp(330, 600, pr(lt, 0, 3)), 1380 + Math.sin(gt * 2) * 6, gt, hold, 1);
  water(c, 1380, gt, '#4E6E66', .9);
  c.restore();
  winFrame(c);
  badge(c, 540, 380, pop(gt, CUE.grab), 'ACCROCHE-TOI !', '#2EAD5B');
};
SC.bidon = (c, lt, gt) => {
  const th = CUE.throw, k = pr(gt, th - .2, th + 1.2);
  c.save(); cam(c, 560, 1150, 1.15);
  street(c, gt, 1380);
  manOnPost(c, 770, 1380 + Math.sin(gt * 2) * 6, gt, true, 0);
  const x = lerp(200, 640, k), y = k < 1 ? lerp(700, 1380, k) - Math.sin(k * Math.PI) * 300 : 1370 + Math.sin(gt * 3) * 8;
  if (gt > th - .2) jerry(c, x, y, .8, k * 4 * (k < 1));
  water(c, 1380, gt, '#4E6E66', .85);
  c.restore();
  const s = pop(gt, chunkAt(7, 2));
  if (s) { c.save(); c.translate(540, 360); c.scale(s, s); rr(c, -320, -70, 640, 140, 30); fs(c, '#fff', 6); jerry(c, -230, 0, .55); text(c, 'VIDE + FERMÉ = FLOTTE', 50, 4, '700 46px Oswald', '#1d1d22'); c.restore(); }
};
SC.aube = (c, lt, gt) => {
  c.save(); cam(c, 560, 1200, 1.2);
  street(c, gt, 1380);
  c.fillStyle = 'rgba(230,150,100,.25)'; c.fillRect(-300, -300, 1700, 2600);
  const bx = lerp(1300, 760, eo(pr(gt, CUE.boat - .5, CUE.boat + 2.5)));
  manOnPost(c, gt > CUE.saved ? bx - 60 : 770, 1380 + Math.sin(gt * 2) * 6, gt, gt < CUE.saved, 0);
  water(c, 1380, gt, '#5E7E76', .85);
  boat(c, bx, 1390, .9, gt);
  c.restore();
  const s = pop(gt, LINES[8].start + .2);
  if (s) { c.save(); c.translate(540, 300); c.scale(s, s); rr(c, -125, -40, 250, 80, 40); fs(c, '#34373F', 5, '#22252b'); text(c, '06 H 00', 0, 3, '800 44px Montserrat', '#F5C518', 'center', 0, OL, '4px'); c.restore(); }
  badge(c, 540, 420, pop(gt, CUE.saved), 'SAUVÉ', '#2EAD5B');
};
SC.robinet = (c, lt, gt) => {
  c.save(); cam(c, 560, 1000, 1.1 + lt * .01);
  tiles(c, '#D9DCE2', '#C3C7CF');
  c.fillStyle = '#9A8F80'; c.fillRect(-300, 1380, 1700, 900);
  rr(c, 520, 980, 520, 400, 10); fs(c, '#E9EBEE', 7); rr(c, 560, 940, 440, 60, 12); fs(c, '#AEB6C0', 6);
  line(c, [[780, 940], [780, 800], [880, 800], [880, 860]], 26, '#AEB6C0', OL, 5);
  if (gt < CUE.tap + 1) { c.fillStyle = '#8A7A50'; c.fillRect(870, 870, 20, 70); }
  const drink = gt > CUE.bottle;
  drawMax(c, { x: 320, y: 1388, s: .9, f: 1, t: gt, mouthO: drink, front: drink ? [2.4, 1.5] : [.4, .3], back: [.3, .2] });
  if (drink) { c.save(); c.translate(320 + 140, 1388 - 700); c.rotate(-.9); rr(c, -22, -70, 44, 140, 12); fs(c, '#8FC8F0', 5); rr(c, -12, -88, 24, 22, 4); fs(c, '#3B82D6', 4); c.restore(); }
  c.restore();
  const s = pop(gt, CUE.tap);
  if (s) { forbid(c, 880, 600, s); badge(c, 760, 440, s, 'PAS POTABLE ?'); }
  badge(c, 540, 260, pop(gt, LINES[9].start + 1.6), 'RÈGLE N°2', '#1F6FB2');
  const b = pop(gt, CUE.bottle);
  if (b) { c.save(); c.translate(540, 1560); c.scale(b, b); rr(c, -300, -60, 600, 120, 30); fs(c, '#fff', 6); text(c, '💧 EAU EN BOUTEILLE', 0, 4, '700 52px Oswald', '#2EAD5B'); c.restore(); }
};
SC.soir = (c, lt, gt) => {
  const wl = lerp(1000, 760, eo(pr(lt, 0, 4)));
  c.save(); cam(c, 560, 900, 1.12 + lt * .01);
  stairs(c, gt, wl);
  rain(c, gt, 40, .3);
  drawMax(c, { x: 820, y: 1330 - 6 * 90, s: .7, f: -1, t: gt, mouthO: true, front: [.3, .2], back: [.2, .2], shiver: 1 });
  c.fillStyle = 'rgba(6,10,30,.45)'; c.fillRect(-300, -300, 1700, 2600);
  c.restore();
  badge(c, 540, 300, pop(gt, chunkAt(11, 2)), '1ER ÉTAGE INONDÉ');
};
SC.fin = (c, lt, gt) => {
  c.save(); cam(c, 540, lerp(900, 800, pr(lt, 0, 4)), lerp(1.05, 1.25, pr(lt, 0, 5)));
  nightRoom(c, '#2C3242', '#1B1F28');
  rr(c, 380, 200, 320, 200, 8); fs(c, '#141820', 6); // trappe du toit
  c.save(); c.translate(380, 200); c.rotate(-.5 * eo(pr(gt, CUE.roof - .5, CUE.roof + .5))); rr(c, 0, -10, 320, 30, 6); fs(c, '#5C4330', 5); c.restore();
  if (gt > CUE.roof) { rain(c, gt, 30, .6); glow(c, 540, 300, 260, 'rgba(160,180,220,A)', .3); }
  for (let i = 0; i < 8; i++) { line(c, [[460, 420 + i * 110], [620, 420 + i * 110]], 10, '#8A8F99', OL, 4); }
  line(c, [[460, 380], [460, 1330]], 14, '#8A8F99', OL, 5); line(c, [[620, 380], [620, 1330]], 14, '#8A8F99', OL, 5);
  drawMax(c, { x: 800, y: 1330, s: .86, f: -1, t: gt, front: [2.4, .3], back: [.3, .2], lean: -.05 });
  c.fillStyle = 'rgba(6,10,30,.4)'; c.fillRect(-300, -300, 1700, 2600);
  c.restore();
  vignette(c, .7);
  const k = pr(gt, CUE.jour3 - .1, CUE.jour3 + .15);
  if (k > 0) {
    c.fillStyle = `rgba(8,8,10,${k})`; c.fillRect(0, 0, W, H);
    floodTitle(c, 3, 700, pop(gt, CUE.jour3 + .1), pop(gt, CUE.jour3 + .3, .45), '#1A3A5A');
    const s3 = pop(gt, CUE.jour3 + .9);
    if (s3) { c.save(); c.globalAlpha = clamp(s3); text(c, 'PARTIE SUIVANTE DEMAIN', 540, 1110, '800 44px Montserrat', '#F5C518', 'center', 0, OL, '6px'); text(c, 'Max monte sur le toit ? OUI / NON', 540, 1200, '700 42px Montserrat', '#FFFFFF'); c.restore(); }
  }
};

// ---------- HUD ----------
function hud(c, gt, sid) {
  if (gt < CUE.jour3 && !['titre', 'danger'].includes(sid)) {
    const lvl = gt < LINES[11].start ? 110 : Math.round(lerp(110, 260, pr(gt, LINES[11].start, LINES[12].end)));
    const ps = pop(gt, LINES[0].start + .3);
    gaugePill(c, 24, 140, ps, 'EAU', 6, 6, lvl > 200 ? '#E53935' : '#3B82D6');
    if (ps) text(c, lvl + ' CM', 24 + 470 * ps, 177, '700 48px Oswald', '#fff', 'left', 10, OL);
  }
}
