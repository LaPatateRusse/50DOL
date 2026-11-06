// Alerte inondation — Jour 3 (FIN) : série de survie au schéma du Blackout (moteur : ../engine/engine.js + props.js).
const EP = {
  vignette: { grenier: .18, retour: .18, photos: .18 },
  hideSubs: gt => gt > CUE.endcard - .1,
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
function roofScene(c, gt, wl) { // toit de maison vu de côté, eau autour
  c.fillStyle = grad(c, -200, 1500, ['#0B1020', '#253049']); c.fillRect(-300, -300, 1700, 2600);
  skyline(c, FAR, '#28324A', '#222B40');
  c.beginPath(); c.moveTo(60, 1300); c.lineTo(540, 900); c.lineTo(1020, 1300); c.closePath(); fs(c, '#7A3A2A', 6, '#2A1410');
  for (let i = 0; i < 6; i++) line(c, [[120 + i * 70, 1250 - i * 58], [960 - i * 70, 1250 - i * 58]], 4, 'rgba(0,0,0,.25)', null);
  rr(c, 700, 900, 70, 180, 4); fs(c, '#5A2A1E', 5);
  rr(c, 60, 1300, 960, 400, 0); fs(c, '#C9B89A', 5);
  water(c, wl, gt, '#4E6E66', .92);
  rain(c, gt);
}
function attic(c, gt, wl) {
  c.fillStyle = '#2A2420'; c.fillRect(-300, -300, 1700, 2600);
  c.beginPath(); c.moveTo(-300, 1400); c.lineTo(540, 500); c.lineTo(1400, 1400); c.closePath(); fs(c, '#4A3A2E', 0);
  for (let i = 0; i < 8; i++) line(c, [[540, 500], [-300 + i * 240, 1400]], 10, '#3A2C22', null);
  rr(c, 300, 1100, 160, 120, 10); fs(c, '#6B4A30', 4); rr(c, 640, 1150, 200, 90, 10); fs(c, '#6B4A30', 4);
  water(c, wl, gt, '#4E6E66', .85);
}
function muddy(c, gt) {
  nightRoom(c, '#8A7E6A', '#5A4A38');
  c.fillStyle = '#6A5A42'; c.fillRect(-300, 900, 1700, 60); // trace de l'eau sur le mur
  text(c, '— 1,80 m —', 540, 880, '700 40px Oswald', '#4A3A2A');
  rr(c, 760, 600, 220, 300, 10); fs(c, '#D9DCE2', 6); // tableau électrique
  for (let k = 0; k < 4; k++) { rr(c, 790 + k * 46, 650, 30, 90, 6); fs(c, '#F4F5F7', 3); rr(c, 796 + k * 46, 700, 18, 30, 4); fs(c, '#3A3F49', 0); }
  rr(c, 150, 1200, 300, 140, 20); fs(c, '#6A5A42', 5); rr(c, 500, 1230, 200, 110, 10); fs(c, '#5A4A38', 5);
  for (let i = 0; i < 14; i++) { c.beginPath(); c.ellipse((i * 157) % 1100, 1360 + (i % 3) * 40, 90, 18, 0, 0, Math.PI * 2); fs(c, '#4A3A28', 0); }
}
// ---------- SCÈNES ----------
SC.toit = (c, lt, gt) => {
  const second = gt >= LINES[2].start - .1;
  c.save(); cam(c, 540, second ? 1000 : 1050, second ? 1.1 + (gt - LINES[2].start) * .01 : lerp(1.3, 1.15, pr(lt, 0, 4)));
  roofScene(c, gt, second ? 1240 : lerp(1400, 1300, pr(lt, 0, 4)));
  drawMax(c, { x: second ? 560 : 420, y: second ? 910 : 1080, s: .55, f: 1, t: gt, sit: second ? 1 : 0, shiver: 1, front: [.4, .3], back: [.3, .2] });
  c.restore();
  if (!second) floodTitle(c, 3, 300, pop(lt, .2), pop(lt, .4, .45));
  else badge(c, 540, 360, pop(gt, LINES[2].start + .3), 'DERNIER RECOURS', '#1F6FB2');
};
SC.grenier = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.05 + lt * .01);
  attic(c, gt, lerp(1500, 1050, eo(pr(gt, LINES[1].start + 1, CUE.trap))));
  c.restore();
  badge(c, 540, 300, pop(gt, CUE.r1), 'RÈGLE N°1', '#1F6FB2');
  const s = pop(gt, CUE.trap);
  if (s) { forbid(c, 540, 560, s); badge(c, 540, 720, s, 'PIÈGE : PAS DE SORTIE'); }
};
SC.signal = (c, lt, gt) => {
  const on = Math.sin(gt * 6) > 0, sh = gt > CUE.sheet - 1.2;
  c.save(); cam(c, 560, 1000, 1.25);
  roofScene(c, gt, 1240);
  drawMax(c, { x: 560, y: 910, s: .6, f: 1, t: gt, front: [2.6 + (sh ? Math.sin(gt * 9) * .3 : 0), .2], back: [sh ? 2.5 : .4, .2] });
  const hx = 560 + 70, hy = 910 - 330;
  if (on && !sh) { glow(c, hx, hy, 260, 'rgba(255,250,200,A)', .7); circ(c, hx, hy, 14); fs(c, '#FFFDE0', 0); }
  if (sh) { c.save(); c.translate(hx - 20, hy - 30); c.rotate(Math.sin(gt * 9) * .3); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(120, -40 + Math.sin(gt * 12) * 30, 240, 10); c.lineTo(230, 140); c.quadraticCurveTo(120, 100, 0, 120); c.closePath(); fs(c, '#F4F1EA', 5); c.restore(); }
  c.restore();
  badge(c, 540, 300, pop(gt, CUE.r2), 'RÈGLE N°2 : SE FAIRE VOIR', '#1F6FB2');
};
SC.bateau = (c, lt, gt) => {
  const bx = lerp(1300, 820, eo(pr(gt, CUE.boat - .5, CUE.boat + 2.5)));
  c.save(); cam(c, 640, 1100, 1.2);
  roofScene(c, gt, 1240);
  c.fillStyle = 'rgba(230,150,100,.22)'; c.fillRect(-300, -300, 1700, 2600);
  boat(c, bx, 1250, .9, gt);
  drawMax(c, { x: 640, y: 1060, s: .55, f: 1, t: gt, front: gt > CUE.help ? [1.6, .1] : [.4, .3], back: [.3, .2] });
  c.restore();
  const s = pop(gt, LINES[4].start + .2);
  if (s) { c.save(); c.translate(540, 300); c.scale(s, s); rr(c, -125, -40, 250, 80, 40); fs(c, '#34373F', 5, '#22252b'); text(c, '07 H 00', 0, 3, '800 44px Montserrat', '#F5C518', 'center', 0, OL, '4px'); c.restore(); }
  badge(c, 540, 1500, pop(gt, CUE.help), 'ATTENDS QU\'ON T\'AIDE', '#2EAD5B');
};
SC.gymnase = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.05 + lt * .01);
  c.fillStyle = '#C9B89A'; c.fillRect(-300, -300, 1700, 2600);
  c.fillStyle = '#B07A4A'; c.fillRect(-300, 1250, 1700, 900);
  for (let i = 0; i < 6; i++) line(c, [[-300, 1300 + i * 120], [1400, 1300 + i * 120]], 4, 'rgba(255,255,255,.4)', null);
  for (let i = 0; i < 5; i++) { rr(c, -100 + i * 260, 1350 + (i % 2) * 140, 220, 70, 20); fs(c, ['#3A6EA5', '#2E6A3E', '#C0392B', '#6B4A30', '#5A5F68'][i], 4); }
  for (let i = 0; i < 6; i++) figure(c, 40 + i * 180, 1250, .45, '#3A3F49', gt * .5 + i, i % 2 ? 1 : -1);
  drawMax(c, { x: 560, y: 1330, s: .8, f: 1, t: gt, front: [.3, .2], back: [.25, .2] });
  c.restore();
  ['💧 EAU', '🛏 COUVERTURES', '📶 RÉSEAU'].forEach((l, i) => { const s = pop(gt, LINES[5].start + 2.4 + i * .7); if (s) badge(c, 540, 300 + i * 110, s, l, '#2EAD5B'); });
};
SC.retour = (c, lt, gt) => {
  c.save(); cam(c, 560, 1000, 1.08 + lt * .01);
  muddy(c, gt);
  drawMax(c, { x: 360, y: 1330, s: .86, f: 1, t: gt, front: [gt > CUE.noswitch - .6 && gt < CUE.noswitch + .3 ? 1.6 : .4, .5], back: [.3, .2] });
  c.restore();
  badge(c, 540, 1500, pop(gt, CUE.mud), 'BOUE PARTOUT', '#6B4A30');
  badge(c, 540, 300, pop(gt, CUE.r3), 'RÈGLE N°3', '#1F6FB2');
  const s = pop(gt, CUE.noswitch);
  if (s) { forbid(c, 870, 700, s); badge(c, 540, 440, s, 'PAS DE COURANT AVANT CONTRÔLE'); }
};
SC.photos = (c, lt, gt) => {
  c.save(); cam(c, 560, 1000, 1.08);
  muddy(c, gt);
  drawMax(c, { x: 360, y: 1330, s: .86, f: 1, t: gt, front: [1.6, 1.0], back: [1.4, .9] });
  c.save(); c.translate(360 + 170, 1330 - 620); rr(c, -30, -50, 60, 100, 10); fs(c, '#141416', 4); c.restore();
  c.restore();
  const fl = gt > CUE.photo && gt < CUE.photo + .25; if (fl) { c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(0, 0, W, H); }
  const s = pop(gt, CUE.photo + .1);
  if (s) { c.save(); c.translate(760, 560); c.rotate(.08); c.scale(s, s); rr(c, -200, -150, 400, 300, 10); fs(c, '#fff', 6); c.fillStyle = '#6A5A42'; c.fillRect(-180, -130, 360, 220); text(c, '📸 ASSURANCE', 0, 130, '700 36px Oswald', '#1d1d22'); c.restore(); }
};
SC.fin = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.05);
  muddy(c, gt); c.fillStyle = 'rgba(255,220,160,.15)'; c.fillRect(-300, -300, 1700, 2600);
  drawMax(c, { x: 540, y: 1330, s: .9, f: 1, t: gt, front: [2.6, .2], back: [.3, .2] });
  c.restore();
  vignette(c, .6);
  const k = pr(gt, CUE.endcard - .1, CUE.endcard + .15);
  if (k > 0) {
    c.fillStyle = `rgba(8,8,10,${k})`; c.fillRect(0, 0, W, H);
    const s1 = pop(gt, CUE.endcard + .1), s2 = pop(gt, CUE.endcard + .3, .45), s3 = pop(gt, CUE.endcard + .9);
    if (s1) { c.save(); c.translate(540, 700); c.scale(s1, s1); rr(c, -330, -58, 660, 116, 6); fs(c, '#1F6FB2', 0); text(c, 'ALERTE INONDATION', 0, 4, '700 78px Oswald', '#fff'); c.restore(); }
    if (s2) { c.save(); c.translate(540, 900); c.scale(s2, s2); text(c, 'FIN', 6, 10, '700 250px Oswald', '#1A3A5A'); text(c, 'FIN', 0, 0, '700 250px Oswald', '#EEF0F4'); c.restore(); }
    if (s3) { c.save(); c.globalAlpha = clamp(s3); text(c, 'TU AURAIS FAIT COMME MAX ?', 540, 1110, '800 44px Montserrat', '#F5C518', 'center', 0, OL, '6px'); text(c, 'Nouvelle série de survie bientôt', 540, 1200, '700 40px Montserrat', '#FFFFFF'); c.restore(); }
  }
};

// ---------- HUD ----------
function hud(c, gt, sid) {
  if (gt < CUE.endcard && ['toit', 'signal', 'bateau'].includes(sid) && gt > LINES[0].start + 2) {
    const ps = pop(gt, LINES[0].start + 2.2);
    gaugePill(c, 24, 140, ps, 'EAU', 6, 6, '#E53935');
    if (ps) text(c, '280 CM', 24 + 470 * ps, 177, '700 48px Oswald', '#fff', 'left', 10, OL);
  }
}
