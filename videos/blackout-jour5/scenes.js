// Blackout général — Jour 5, FIN (moteur ../engine/, accessoires props.js ; même style que les Jours 1-4).
const EP = { vignette: { prises: .18, kit: .18 }, hideSubs: gt => gt > CUE.fin - .1 };
const SC = {};
const L = i => LINES[i].start;

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
function plugIcon(c, x, y, s, out) {
  c.save(); c.translate(x, y); c.scale(s, s);
  rr(c, -90, -90, 180, 180, 24); fs(c, '#FFFFFF', 7);
  circ(c, -32, 0, 14); fs(c, '#2A2A2A', 0); circ(c, 32, 0, 14); fs(c, '#2A2A2A', 0);
  c.translate(out * 120, -out * 60);
  rr(c, -50, -30, 100, 60, 12); fs(c, '#3A3F4A', 6); line(c, [[-20, -30], [-20, -60]], 10, '#9AA0AE', null); line(c, [[20, -30], [20, -60]], 10, '#9AA0AE', null);
  line(c, [[0, 30], [0, 120], [80, 160]], 14, '#3A3F4A', null);
  c.restore();
}
function bulb(c, x, y, s, on) {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (on) glow(c, 0, 0, 220, 'rgba(255,220,120,A)', .7);
  circ(c, 0, 0, 70); fs(c, on ? '#FFE27A' : '#E8E8EE', 7); rr(c, -34, 60, 68, 50, 8); fs(c, '#9AA0AE', 6);
  c.restore();
}

SC.titre = (c, lt, gt) => {
  c.save(); cam(c, 540, 960, lerp(1.0, 1.06, pr(lt, 0, 4)));
  exteriorNight(c, gt, 0, 1);
  c.restore();
  const s1 = pop(lt, .1), s2 = pop(lt, .3, .45);
  c.save(); c.translate(540, 300); c.scale(s1, s1); rr(c, -300, -58, 600, 116, 6); fs(c, '#E53935', 0); text(c, 'BLACKOUT GÉNÉRAL', 0, 4, '700 78px Oswald', '#fff'); c.restore();
  c.save(); c.translate(540, 500); c.scale(s2, s2); text(c, 'JOUR 5', 6, 10, '700 250px Oswald', '#8C93A3'); text(c, 'JOUR 5', 0, 0, '700 250px Oswald', '#EEF0F4'); c.restore();
  card(c, 540, 690, pop(gt, L(0) + 1.0), 'EAU STOCKÉE', '150 L', dropIcon, '#1d1d22', '', 0);
};
SC.matin = (c, lt, gt) => {
  const out = gt > L(2) - .1;
  c.save(); cam(c, 540, 1000, 1.05 + lt * .015);
  if (!out) {
    nightRoom(c, '#6A7286', '#454B5B');
    window4(c, 520, 380, 420, 520, '#4B3A2E');
    c.fillStyle = grad(c, 380, 900, ['#9FB4D8', '#F2C9A0']); c.fillRect(520, 380, 420, 520);
    glow(c, 730, 640, 380, 'rgba(255,220,170,A)', .4);
    windowEnd(c, 520, 380, 420, 520, '#4B3A2E');
    drawMax(c, { x: 380, y: 1340, s: .88, f: 1, t: gt, front: [.3, .3], back: [.2, .2] });
  } else {
    exteriorNight(c, gt, 0, 1);
    drawMax(c, { x: 400, y: 1490, s: .7, f: 1, t: gt, walk: gt * 7, front: [.3, .2], back: [.2, .2] });
    figure(c, 640, 1490, .72, '#5B8BE0', gt * 7, -1);
  }
  c.restore();
  if (!out) badge(c, 540, 300, pop(gt, L(1) + 2.2), 'DE JOUR', '#2EAD5B');
  else badge(c, 540, 300, pop(gt, CUE.pair), 'JAMAIS SEUL', '#2EAD5B');
};
SC.hall = (c, lt, gt) => {
  c.save(); cam(c, 540, 1050, 1.05 + lt * .02);
  c.fillStyle = '#8E95A6'; c.fillRect(-300, -300, 1700, 2600); c.fillStyle = '#5A6070'; c.fillRect(-300, 1450, 1700, 900);
  for (let i = 0; i < 6; i++) { rr(c, 80 + i * 60, 600, 50, 70, 4); fs(c, '#C9CED8', 4); }
  [[600, '#5B8BE0'], [760, '#E05B8B'], [920, '#5BBF7A']].forEach(([x, col], i) => figure(c, x, 1460, .8, col, 0, -1));
  for (let i = 0; i < 5; i++) bottle(c, 640 + i * 70, 1430, .5, .9);
  drawMax(c, { x: 300, y: 1460, s: .78, f: 1, t: gt, front: gt > CUE.neigh ? [1.5, .2] : [.3, .2], back: [.2, .2] });
  c.restore();
  if (gt > CUE.neigh) badge(c, 540, 300, pop(gt, CUE.neigh), 'DES VOISINS', '#2EAD5B');
};
SC.prises = (c, lt, gt) => {
  c.save(); cam(c, 540, 900, lerp(1.0, 1.05, pr(lt, 0, 7)));
  paperBg(c);
  const hs = pop(lt, .1);
  c.save(); c.translate(540, 250); c.scale(hs, hs); text(c, 'RETOUR DU COURANT', 0, 0, '700 86px Oswald', '#2A2A2A'); c.restore();
  const p = pop(gt, CUE.plug); if (p) { plugIcon(c, 330, 620, p * 1.2, eo(pr(gt, CUE.plug + .3, CUE.plug + 1.2))); c.save(); c.translate(330, 860); c.scale(p, p); text(c, 'DÉBRANCHER', 0, 0, '700 52px Oswald', '#2A2A2A'); c.restore(); }
  const b = pop(gt, CUE.lamp); if (b) { bulb(c, 770, 600, b * 1.2, gt > CUE.lamp + .6); c.save(); c.translate(770, 860); c.scale(b, b); text(c, '1 LAMPE ALLUMÉE', 0, 0, '700 46px Oswald', '#2A2A2A'); c.restore(); }
  c.restore();
};
SC.kit = (c, lt, gt) => {
  c.save(); cam(c, 540, 900, lerp(1.0, 1.05, pr(lt, 0, 8)));
  paperBg(c);
  c.save(); c.translate(540, 240); text(c, 'KIT D\'URGENCE', 0, 0, '700 110px Oswald', '#2A2A2A'); c.restore();
  const k = pop(gt, CUE.kit);
  if (k) { for (let i = 0; i < 3; i++) bottle(c, 330 + i * 120, 600, k * 1.1, 1, '#4A90D9', '4 L'); c.save(); c.translate(450, 800); c.scale(k, k); text(c, '× 3 JOURS', 0, 0, '700 56px Oswald', '#2A2A2A'); text(c, 'PAR PERSONNE', 0, 60, '800 30px Montserrat', '#2A2A2A'); c.restore(); }
  const items = ['RADIO À PILES', 'LAMPE', 'CONSERVES', 'NUMÉROS UTILES'];
  items.forEach((t, i) => { const s = pop(gt, CUE.items + i * .9); if (!s) return; c.save(); c.translate(800, 470 + i * 110); c.scale(s, s); rr(c, -150, -40, 300, 80, 16); fs(c, '#FFFFFF', 6); text(c, t, 0, 4, '700 34px Oswald', '#2A2A2A'); c.restore(); });
  c.restore();
};
SC.retour = (c, lt, gt) => {
  const k = clamp((gt - CUE.light1) / (CUE.city - CUE.light1 + .01));
  c.save(); cam(c, 540, lerp(1150, 960, eo(pr(lt, 0, 6))), lerp(1.3, 1.0, eo(pr(lt, 0, 6))));
  c.fillStyle = grad(c, -200, 1500, ['#0B1020', '#2A3552']); c.fillRect(-300, -300, 1700, 2600);
  skyline(c, FAR, '#28324A', '#222B40', (bi, wi) => gt > CUE.city ? .9 : 0);
  skyline(c, NEAR, '#1A2133', '#161C2B', (bi, wi) => rnd(bi * 13 + wi) < k ? 1 : 0);
  rr(c, 420, 450, 260, 1250, 4); fs(c, '#222A3E', 5, '#0A0D14');
  for (let r = 0; r < 13; r++) for (let q = 0; q < 3; q++) { const on = gt > CUE.light1 && (r === 2 && q === 0 || rnd(r * 7 + q) < k); c.fillStyle = on ? '#FFB347' : '#161C2A'; c.fillRect(450 + q * 80, 490 + r * 78, 46, 40); }
  if (gt > CUE.light1) glow(c, 520, 650, 300, 'rgba(255,170,70,A)', .5);
  c.fillStyle = '#3A4256'; c.fillRect(-300, 1500, 1700, 800);
  c.restore();
};
SC.fin = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.08 + lt * .01);
  nightRoom(c, '#6A5A4A', '#3A3028');
  glow(c, 540, 500, 600, 'rgba(255,210,140,A)', .35);
  bulb(c, 540, 330, .7, true);
  drawMax(c, { x: 380, y: 1340, s: .85, f: 1, t: gt, front: [.3, .3], back: [.2, .2] });
  figure(c, 700, 1340, .85, '#5B8BE0', 0, -1);
  c.restore();
  const k = pr(gt, CUE.fin - .1, CUE.fin + .15);
  if (k > 0) {
    c.fillStyle = `rgba(8,8,10,${k})`; c.fillRect(0, 0, W, H);
    const s1 = pop(gt, CUE.fin + .1), s2 = pop(gt, CUE.fin + .3, .45), s3 = pop(gt, CUE.fin + .9);
    if (s1) { c.save(); c.translate(540, 700); c.scale(s1, s1); rr(c, -300, -58, 600, 116, 6); fs(c, '#E53935', 0); text(c, 'BLACKOUT GÉNÉRAL', 0, 4, '700 78px Oswald', '#fff'); c.restore(); }
    if (s2) { c.save(); c.translate(540, 900); c.scale(s2, s2); text(c, 'FIN', 6, 10, '700 250px Oswald', '#5A2020'); text(c, 'FIN', 0, 0, '700 250px Oswald', '#EEF0F4'); c.restore(); }
    if (s3) { c.save(); c.globalAlpha = clamp(s3); text(c, 'TU AURAIS TENU COMBIEN DE JOURS ?', 540, 1110, '800 42px Montserrat', '#F5C518', 'center', 0, OL, '4px'); c.restore(); }
  }
};
function hud(c, gt, sid) {}
