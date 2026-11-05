// Alerte inondation — Jour 1 : nouvelle série de survie au schéma du Blackout (moteur : ../engine/engine.js + props.js).
const EP = {
  vignette: { voiture: .18, compteur: .18, sac: .18 },
  hideSubs: gt => gt > CUE.jour2 - .1,
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
SC.intro = (c, lt, gt) => {
  c.save(); cam(c, 540, lerp(1300, 1200, pr(lt, 0, 4)), lerp(1.25, 1.1, pr(lt, 0, 4)));
  street(c, gt, lerp(1640, 1480, pr(lt, 0, 4)));
  c.restore();
};
SC.alerte = (c, lt, gt) => {
  c.save(); cam(c, 640, 1420, lerp(1.4, 1.55, pr(lt, 0, 3)));
  street(c, gt, 1470);
  carSide(c, 620, 1520, .9, Math.sin(gt * 2) * .02);
  c.restore();
  forbid(c, 540, 420, pop(gt, chunkAt(1, 3)));
};
SC.titre = (c, lt, gt) => {
  c.save(); cam(c, 540, 960, lerp(1.0, 1.06, pr(lt, 0, 4)));
  street(c, gt, 1400);
  c.restore();
  c.fillStyle = 'rgba(5,8,16,.35)'; c.fillRect(0, 0, W, H);
  floodTitle(c, 1, 320, pop(lt, .1), pop(lt, .3, .45));
  const s3 = pop(lt, .6);
  if (s3) { c.save(); c.translate(540, 720); c.scale(s3, s3); rr(c, -125, -40, 250, 80, 40); fs(c, '#34373F', 5, '#22252b'); text(c, '02 H 04', 0, 3, '800 44px Montserrat', '#F5C518', 'center', 0, OL, '4px'); c.restore(); }
};
SC.rue = (c, lt, gt) => {
  const al = CUE.alarm, l4 = LINES[4].start;
  if (gt >= l4 - .1) { // la rue vue de la fenêtre
    c.save(); cam(c, 540, 1300, lerp(1.0, 1.12, pr(gt, l4, l4 + 3)));
    street(c, gt, 1380);
    for (let i = 0; i < 5; i++) { const x = ((i * 300 + gt * 90) % 1600) - 300; rr(c, x, 1395 + Math.sin(gt * 3 + i) * 6, 70, 20, 8); fs(c, ['#6B4A30', '#3A6EA5', '#E53935', '#7DD36A', '#AEB6C0'][i], 0); }
    c.restore();
    winFrame(c);
    return;
  }
  const shake = gt > al && gt < al + 1.2 ? Math.sin(gt * 140) * 5 : 0;
  c.save(); cam(c, 560, 1050, 1.1 + lt * .015);
  nightRoom(c, '#2C3242', '#1B1F28');
  window4(c, 600, 380, 400, 560, '#4B3A2E'); c.fillStyle = grad(c, 380, 940, ['#0E1424', '#26304A']); c.fillRect(600, 380, 400, 560);
  c.save(); rr(c, 600, 380, 400, 560, 0); c.clip(); rain(c, gt, 60, .6); c.restore(); windowEnd(c, 600, 380, 400, 560, '#4B3A2E');
  rr(c, 120, 1250, 460, 90, 26); fs(c, '#6E7480', 6);
  drawMax(c, { x: 330, y: 1330, s: .86, f: 1, t: gt, mouthO: gt > al, front: [gt > al ? 1.5 : .4, gt > al ? 1.2 : .3], back: [.25, .2] });
  if (gt > al) {
    c.save(); c.translate(330 + 150 + shake, 1330 - 620); rr(c, -30, -50, 60, 100, 10); fs(c, '#141416', 4); rr(c, -24, -42, 48, 84, 6); fs(c, '#E53935', 0); c.restore();
    glow(c, 480, 710, 220, 'rgba(255,80,60,A)', .4 + .2 * Math.sin(gt * 12));
  }
  c.fillStyle = 'rgba(6,10,30,.35)'; c.fillRect(-300, -300, 1700, 2600);
  c.restore();
  const s = pop(gt, al + .1);
  if (s) { c.save(); c.translate(540, 360); c.scale(s, s); rr(c, -380, -90, 760, 180, 30); fs(c, 'rgba(240,242,248,.95)', 6); text(c, '⚠ ALERTE CRUE', 0, -24, '700 64px Oswald', '#E53935'); text(c, 'Montez en hauteur. Évitez les déplacements.', 0, 44, '700 30px Montserrat', '#1d1d22'); c.restore(); }
};
SC.voiture = (c, lt, gt) => {
  const fl = eo(pr(gt, CUE.carfloat - .4, CUE.carfloat + 1.2));
  c.save(); cam(c, 540, 1350, 1.05);
  street(c, gt, lerp(1520, 1470, fl));
  carSide(c, lerp(540, 780, fl), lerp(1560, 1470, fl) + Math.sin(gt * 3) * 6 * fl, 1.1, fl * .12);
  c.restore();
  const s = pop(gt, CUE.car);
  if (s) card(c, 540, 300, s * .9, 'IL SUFFIT DE', '30 CM', dropIcon, '#E53935', '', 0);
  if (fl > .5) badge(c, 540, 560, pop(gt, CUE.carfloat + .2), 'EMPORTÉE', '#E53935');
};
SC.parking = (c, lt, gt) => {
  const fill = eo(pr(lt, .3, 3.5));
  c.save(); cam(c, 540, 1100, 1.05 + lt * .01);
  c.fillStyle = '#2A2E36'; c.fillRect(-300, -300, 1700, 2600);
  c.fillStyle = '#3A3F49'; c.fillRect(-300, 300, 1700, 60); // plafond
  [100, 500, 900].forEach(x => { rr(c, x, 360, 80, 1200, 0); fs(c, '#4A505C', 4); c.fillStyle = '#F5C518'; for (let y = 400; y < 1500; y += 120) c.fillRect(x, y, 80, 30); });
  c.beginPath(); c.moveTo(-300, 900); c.lineTo(400, 1500); c.lineTo(-300, 1500); c.closePath(); fs(c, '#4A505C', 0); // rampe
  text(c, 'P -2', 760, 520, '700 120px Oswald', '#F5C518');
  carSide(c, 760, 1480, .8, 0, '#3A6EA5');
  water(c, lerp(1560, 760, fill), gt, '#4E6E66', .9);
  c.restore();
  const s = pop(gt, CUE.nopark);
  if (s) { forbid(c, 540, 380, s); badge(c, 540, 520, s, 'PAS AU PARKING'); }
};
SC.compteur = (c, lt, gt) => {
  const off = gt > CUE.breaker;
  c.save(); cam(c, 560, 1000, 1.08 + lt * .015);
  nightRoom(c, '#4A4F5E', '#2A2D36');
  rr(c, 560, 420, 420, 560, 18); fs(c, '#D9DCE2', 7);
  for (let r = 0; r < 2; r++) for (let k = 0; k < 5; k++) { rr(c, 600 + k * 74, 480 + r * 220, 56, 150, 8); fs(c, '#F4F5F7', 5); rr(c, 612 + k * 74, (off ? 560 : 500) + r * 220, 32, 50, 6); fs(c, k === 0 && r === 0 ? '#E53935' : '#3A3F49', 0); }
  text(c, off ? 'OFF' : 'ON', 770, 950, '700 60px Oswald', off ? '#E53935' : '#2EAD5B');
  drawMax(c, { x: 330, y: 1330, s: .88, f: 1, t: gt, front: [Math.abs(gt - CUE.breaker) < .6 ? 2.0 : .4, .6], back: [.25, .2] });
  headlamp(c, 330, 1330, .88, 1, true, gt);
  water(c, 1300, gt, '#4E6E66', .0);
  c.fillStyle = 'rgba(6,10,30,.35)'; c.fillRect(-300, -300, 1700, 2600);
  c.restore();
  const s = pop(gt, CUE.dry);
  if (s) { c.save(); c.translate(540, 1380); c.scale(s, s); rr(c, -300, -60, 600, 120, 30); fs(c, '#fff', 6); text(c, '👟 PIEDS AU SEC', 0, 4, '700 56px Oswald', '#1d1d22'); c.restore(); }
  badge(c, 540, 300, pop(gt, LINES[7].start + .2), 'RÈGLE N°1', '#1F6FB2');
};
SC.sac = (c, lt, gt) => {
  c.save(); cam(c, 540, 960, lerp(1.0, 1.05, pr(lt, 0, 6)));
  paperBg(c);
  c.restore();
  badge(c, 540, 260, pop(gt, LINES[8].start + .2), 'RÈGLE N°2', '#1F6FB2');
  const bs = pop(gt, CUE.bag);
  if (bs) { c.save(); c.translate(540, 620); c.scale(bs, bs); rr(c, -170, -140, 340, 300, 50); fs(c, '#2E6A3E', 7); rr(c, -90, -200, 180, 90, 40); fs(c, null, 14, '#1E4A2A'); rr(c, -120, -40, 240, 120, 20); fs(c, '#3A7A4A', 5); c.restore(); }
  const items = [['EAU', '#3B82D6'], ['LAMPE', '#F5C518'], ['CHARGEUR', '#AEB6C0'], ['PAPIERS', '#E5DCC8'], ['MÉDICAMENTS', '#E53935']];
  const ch = LINES[8].chunks;
  items.forEach(([lab, col], i) => {
    const t0 = ch.length > 2 ? chunkAt(8, Math.min(ch.length - 1, 2 + i)) : CUE.bag + .6 + i * .5;
    const s = pop(gt, Math.max(CUE.bag + .3 + i * .45, Math.min(t0, CUE.bag + .3 + i * .7))); if (!s) return;
    const x = i < 3 ? 220 + i * 320 : 380 + (i - 3) * 320, y = i < 3 ? 1330 : 1500;
    c.save(); c.translate(x, y); c.scale(s, s); rr(c, -150, -55, 300, 110, 24); fs(c, '#fff', 6); circ(c, -105, 0, 22); fs(c, col, 4); text(c, lab, 20, 4, '700 40px Oswald', '#1d1d22'); c.restore();
  });
};
SC.escalier = (c, lt, gt) => {
  const k = pr(gt, CUE.up - .3, LINES[9].end);
  c.save(); cam(c, lerp(380, 760, k), lerp(1150, 700, k), 1.05);
  stairs(c, gt, 1360);
  const i = lerp(0, 7, k), x = 140 + i * 110, y = 1330 - i * 90;
  drawMax(c, { x, y, s: .7, f: 1, t: gt, lean: .1, front: [Math.sin(gt * 8) * .5 + .3, .4], back: [-Math.sin(gt * 8) * .5 + .3, .4] });
  c.save(); c.translate(x - 40, y - 380); rr(c, -60, -70, 90, 140, 24); fs(c, '#2E6A3E', 5); c.restore();
  c.fillStyle = 'rgba(6,10,30,.35)'; c.fillRect(-300, -300, 1700, 2600);
  c.restore();
  badge(c, 540, 300, pop(gt, LINES[9].start + .2), 'RÈGLE N°3 : MONTER', '#1F6FB2');
  const s = pop(gt, CUE.nocave);
  if (s) { forbid(c, 540, 1420, s); badge(c, 540, 1560, s, 'JAMAIS À LA CAVE'); }
};
SC.radio = (c, lt, gt) => {
  const on = gt > CUE.radio_on;
  c.save(); cam(c, 600, 1000, lerp(1.05, 1.15, pr(lt, 0, 5)));
  nightRoom(c, '#4A4F5E', '#2A2D36');
  rr(c, 200, 1110, 760, 24, 6); fs(c, '#6B4A30', 6); rr(c, 250, 1134, 24, 190, 4); fs(c, '#5C4330', 6); rr(c, 880, 1134, 24, 190, 4); fs(c, '#5C4330', 6);
  radioBox(c, 560, 910, on, gt, CUE.radio_on);
  drawMax(c, { x: 360, y: 1330, s: .86, f: 1, t: gt, front: [1.3, .5], back: [1.1, .4] });
  headlamp(c, 360, 1330, .86, 1, true, gt);
  c.fillStyle = 'rgba(6,10,30,.35)'; c.fillRect(-300, -300, 1700, 2600);
  c.restore();
  badge(c, 540, 380, pop(gt, CUE.radio_on + .2), 'RADIO : CONSIGNES', '#2EAD5B');
};
SC.nuit = (c, lt, gt) => {
  const wl = lerp(1150, 900, eo(pr(lt, 0, D_(11))));
  c.save(); cam(c, 560, 900, 1.12 + lt * .01);
  stairs(c, gt, wl);
  drawMax(c, { x: 900, y: 1330 - 7 * 90, s: .7, f: -1, t: gt, mouthO: true, front: [.3, .2], back: [.2, .2], shiver: 1 });
  c.fillStyle = 'rgba(6,10,30,.45)'; c.fillRect(-300, -300, 1700, 2600);
  c.restore();
  const s = pop(gt, LINES[11].start + .2);
  if (s) { c.save(); c.translate(540, 300); c.scale(s, s); rr(c, -125, -40, 250, 80, 40); fs(c, '#34373F', 5, '#22252b'); text(c, '03 H 10', 0, 3, '800 44px Montserrat', '#F5C518', 'center', 0, OL, '4px'); c.restore(); }
};
const D_ = i => LINES[i].end - LINES[i].start;
SC.fin = (c, lt, gt) => {
  const cry = CUE.cry;
  c.save(); cam(c, lerp(560, 400, pr(gt, cry, cry + 3)), lerp(1300, 1250, pr(gt, cry, cry + 3)), lerp(1.1, 1.6, pr(gt, cry, cry + 4)));
  street(c, gt, 1380);
  const x = lerp(260, 360, pr(gt, cry, cry + 6)), wy = 1380 + Math.sin(gt * 2) * 6;
  glow(c, x, wy - 120, 260, 'rgba(255,210,140,A)', .35);
  rr(c, x - 45, wy - 170, 90, 200, 30); fs(c, '#C0392B', 5);
  circ(c, x, wy - 215, 40); fs(c, '#E8B48A', 5); c.fillStyle = '#3A2A20'; c.beginPath(); c.arc(x, wy - 225, 41, Math.PI, 0); c.fill();
  const up = gt > cry ? Math.sin(gt * 6) * .3 : 0;
  line(c, [[x - 35, wy - 140], [x - 95, wy - 260 - up * 60]], 22, '#C0392B', OL, 5);
  line(c, [[x + 35, wy - 140], [x + 95, wy - 250 + up * 60]], 22, '#C0392B', OL, 5);
  water(c, 1380, gt, '#4E6E66', .9);
  c.restore();
  winFrame(c);
  vignette(c, .7);
  const k = pr(gt, CUE.jour2 - .1, CUE.jour2 + .15);
  if (k > 0) {
    c.fillStyle = `rgba(8,8,10,${k})`; c.fillRect(0, 0, W, H);
    floodTitle(c, 2, 700, pop(gt, CUE.jour2 + .1), pop(gt, CUE.jour2 + .3, .45), '#1A3A5A');
    const s3 = pop(gt, CUE.jour2 + .9);
    if (s3) { c.save(); c.globalAlpha = clamp(s3); text(c, 'PARTIE SUIVANTE DEMAIN', 540, 1110, '800 44px Montserrat', '#F5C518', 'center', 0, OL, '6px'); text(c, 'Max descend l\'aider ? OUI / NON', 540, 1200, '700 42px Montserrat', '#FFFFFF'); c.restore(); }
  }
};

// ---------- HUD ----------
function hud(c, gt, sid) {
  if (['rue', 'voiture', 'parking', 'compteur', 'sac', 'escalier', 'radio', 'nuit', 'fin'].includes(sid) && gt < CUE.jour2) {
    const lvl = gt < LINES[11].start ? Math.round(lerp(20, 60, pr(gt, LINES[3].start, LINES[11].start))) : Math.round(lerp(60, 110, pr(gt, LINES[11].start, LINES[12].end)));
    const ps = pop(gt, LINES[3].start + .3);
    gaugePill(c, 24, 140, ps, 'EAU', Math.min(6, Math.ceil(lvl / 20)), 6, '#3B82D6');
    if (ps) text(c, lvl + ' CM', 24 + 470 * ps, 177, '700 48px Oswald', '#fff', 'left', 10, OL);
  }
}
