// Et si ton compte doublait chaque jour ? — Partie 2, FIN (moteur ../engine/, même style que la Partie 1).
const EP = { vignette: { calcul: .15, zero: .15 }, hideSubs: gt => gt > CUE.fin - .1 };
const SC = {};
const LS = i => LINES[i].start, LE = i => LINES[i].end, AT = (i, k) => LS(i) + (LE(i) - LS(i)) * k;

const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
function bill(c, x, y, s, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  rr(c, -70, -36, 140, 72, 8); fs(c, '#7CC46A', 5); circ(c, 0, 0, 22); fs(c, '#5BA84A', 0); text(c, '€', 0, 2, '700 34px Oswald', '#fff');
  c.restore();
}
function moneyRain(c, t, n, seed = 0) {
  for (let i = 0; i < n; i++) { const x = rnd(i + seed) * 1200 - 60, y = ((rnd(i + seed + 30) * 2200) + t * (300 + rnd(i) * 200)) % 2200 - 150; bill(c, x, y, .8, Math.sin(t * 2 + i) * .6); }
}
function room(c, morning) {
  c.fillStyle = morning ? '#EADFC8' : '#D9C9AE'; c.fillRect(-300, -300, 1700, 1700);
  c.fillStyle = '#B49B7C'; c.fillRect(-300, 1200, 1700, 120);
  c.fillStyle = '#8A6446'; c.fillRect(-300, 1320, 1700, 900);
  if (morning) { rr(c, 640, 380, 300, 360, 8); fs(c, '#BFE3F7', 8, '#FFFFFF'); glow(c, 790, 560, 380, 'rgba(255,240,190,A)', .45); }
}
function office(c) {
  c.fillStyle = '#DCE6F0'; c.fillRect(-300, -300, 1700, 1700);
  c.fillStyle = '#1F4E8C'; c.fillRect(-300, 300, 1700, 70); text(c, 'MA BANQUE', 540, 340, '700 50px Oswald', '#fff');
  c.fillStyle = '#9AA8B8'; c.fillRect(-300, 1320, 1700, 900);
}
function bankDesk(c, x, y) { rr(c, x - 330, y - 30, 660, 40, 8); fs(c, '#6B4A30', 6); rr(c, x - 300, y + 10, 600, 300, 6); fs(c, '#7D5A3E', 6); }
function screenVal(c, x, y, s, val, hot) {
  c.save(); c.translate(x, y); c.scale(s, s);
  rr(c, -300, -190, 600, 380, 24); fs(c, '#1d1d22', 0); rr(c, -275, -165, 550, 300, 12); fs(c, hot ? '#FFF4D6' : '#FFFFFF', 0);
  c.fillStyle = '#1F4E8C'; c.fillRect(-275, -165, 550, 60); text(c, 'SOLDE CLIENT', 0, -134, '700 34px Oswald', '#fff');
  text(c, fmt(val) + ' €', 0, 10, '700 72px Oswald', hot ? '#E53935' : '#1d1d22');
  rr(c, -40, 190, 80, 90, 6); fs(c, '#1d1d22', 0);
  c.restore();
}
function graph(c) {
  c.fillStyle = '#F1EADB'; c.fillRect(-100, -100, 1300, 2200);
  for (let x = -100; x < 1300; x += 54) { c.fillStyle = '#E5DCC8'; c.fillRect(x, -100, 3, 2200); }
  for (let y = -100; y < 2100; y += 54) { c.fillStyle = '#E5DCC8'; c.fillRect(-100, y, 1300, 3); }
}
function calculator(c, x, y, s, shown) {
  c.save(); c.translate(x, y); c.scale(s, s);
  rr(c, -150, -220, 300, 440, 30); fs(c, '#2A2D38', 6); rr(c, -120, -190, 240, 90, 10); fs(c, '#B8D8A8', 0);
  text(c, shown, 105, -142, '700 40px "Roboto Mono"', '#1d1d22', 'right');
  for (let i = 0; i < 12; i++) { rr(c, -110 + (i % 3) * 80, -70 + Math.floor(i / 3) * 70, 60, 50, 10); fs(c, i === 11 ? '#F5A623' : '#4A4E5C', 0); }
  c.restore();
}
function banker(c, x, y, s, pale) {
  teacher(c, x, y, s, -1);
  if (pale) { c.save(); c.globalAlpha = .55; circ(c, x - 8 * s, y - 630 * s, 80 * s); fs(c, '#EDEDF2', 0); c.restore(); }
}
function bankApp(val, notif, k = 1) {
  return (c, w, h) => {
    c.fillStyle = '#F4F6FA'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#1F4E8C'; c.fillRect(0, 0, w, 120); text(c, 'MA BANQUE', w / 2, 75, '700 40px Oswald', '#fff');
    text(c, 'SOLDE', w / 2, 420, '700 40px Oswald', '#7A8496');
    text(c, val, w / 2, 530, '700 96px Oswald', '#1d1d22');
    if (notif) {
      const y = lerp(-140, 140, back(clamp(k)));
      rr(c, 16, y, w - 32, 150, 26); fs(c, '#FFFFFF', 4, '#D8DCE6');
      circ(c, 70, y + 75, 34); fs(c, '#E53935', 0); text(c, '+', 70, y + 78, '700 50px Oswald', '#fff');
      text(c, 'TES ABONNÉS', 120, y + 58, '800 30px Montserrat', '#1d1d22', 'left');
      text(c, 'ONT DOUBLÉ', 120, y + 104, '800 30px Montserrat', '#E53935', 'left');
    }
  };
}

// ---------- SCÈNES ----------
SC.flash = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.05 + lt * .03);
  room(c); moneyRain(c, gt, 22, 4);
  hero(c, { x: 540, y: 1330, s: .9, f: 1, t: gt, front: [2.9, .2], back: [2.7, .2], mouthO: true });
  c.restore();
  card(c, 540, 230, 1, 'SOLDE · JOUR 21', '2 097 152 €', (p, x, y) => { circ(p, x, y, 46); fs(p, '#F5C518', 6); text(p, '€', x, y + 2, '700 56px Oswald', '#1d1d22'); }, '#1d1d22', '', 0);
  badge(c, 540, 520, pop(gt, AT(0, .5)), 'TOUT DONNER ?', '#E53935');
};
SC.verite = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.05 + lt * .02);
  office(c);
  banker(c, 760, 1180, .9, false);
  bankDesk(c, 760, 1190);
  hero(c, { x: 300, y: 1330, s: .9, f: 1, t: gt, front: lt > 2.5 ? [1.6, .1] : [.3, .2], back: [.3, .2] });
  c.restore();
  badge(c, 540, 230, pop(lt, .1), 'PARTIE 2 · LA FIN', '#E53935');
};
SC.ecran = (c, lt, gt) => {
  const hot = gt > CUE.double;
  c.save(); cam(c, 540, 1000, lt < 2 ? 1.05 : 1.25 + (lt - 2) * .02);
  office(c);
  banker(c, 820, 1180, .9, false);
  bankDesk(c, 760, 1190);
  screenVal(c, 440, 890, .9, hot ? 2097152 : 1048576, hot);
  c.restore();
  if (hot) badge(c, 540, 300, pop(gt, CUE.double), 'x 2', '#2EAD5B');
};
SC.calcul = (c, lt, gt) => {
  c.save(); cam(c, 540, 900, 1.0 + lt * .01);
  graph(c);
  const a = pop(gt, CUE.j30), b = pop(gt, CUE.j42), d = pop(gt, CUE.j42 + 1.6);
  calculator(c, 540, 330, .8, gt > CUE.j42 ? '4,4 E12' : gt > CUE.j30 ? '1,07 E9' : '2097152');
  if (a) { c.save(); c.translate(540, 720); c.scale(a, a); text(c, 'JOUR 30', 0, -50, '700 60px Oswald', '#1F4E8C'); text(c, '1 073 741 824 €', 0, 40, '700 76px Oswald', '#1d1d22'); c.restore(); }
  if (b) { c.save(); c.translate(540, 1330); c.scale(b, b); text(c, 'JOUR 42', 0, -50, '700 60px Oswald', '#1F4E8C'); text(c, '4 398 046 511 104 €', 0, 40, '700 70px Oswald', '#E53935'); c.restore(); }
  if (d) { c.save(); c.translate(540, 1560); c.scale(d, d); rr(c, -400, -70, 800, 140, 20); fs(c, '#1F4E8C', 6); text(c, '> PIB DE LA FRANCE', 0, -14, '700 52px Oswald', '#fff'); text(c, '(≈ 2 900 milliards € par an)', 0, 40, '600 30px Montserrat', '#fff'); c.restore(); }
  c.restore();
};
SC.panique = (c, lt, gt) => {
  const second = gt > AT(4, .58);
  if (!second) {
    c.save(); cam(c, 640, 900, 1.35 + lt * .02);
    office(c); banker(c, 640, 1180, .9, true); bankDesk(c, 640, 1190);
    c.restore();
  } else {
    c.save(); cam(c, 540, 900, 1.0);
    graph(c);
    const items = [['BAGUETTE', '1,20 €', '45 €'], ['KEBAB', '8 €', '300 €'], ['TICKET DE BUS', '2 €', '75 €']];
    items.forEach(([n, a, b], i) => { const s = pop(gt, AT(4, .62) + i * .45); if (!s) return;
      c.save(); c.translate(540, 400 + i * 240); c.scale(s, s); rr(c, -420, -100, 840, 200, 24); fs(c, '#FFFFFF', 6);
      text(c, n, -380, -40, '700 48px Oswald', '#1F4E8C', 'left'); text(c, a, -380, 50, '700 64px Oswald', '#1d1d22', 'left');
      line(c, [[-120, 30], [80, 30]], 12, '#E53935', null); c.beginPath(); c.moveTo(110, 30); c.lineTo(70, 2); c.lineTo(70, 58); c.closePath(); fs(c, '#E53935', 0);
      text(c, b, 380, 50, '700 80px Oswald', '#E53935', 'right'); c.restore(); });
    c.restore();
    badge(c, 540, 260, pop(gt, AT(4, .6)), 'LES PRIX S\'ENVOLENT', '#E53935');
  }
};
SC.zero = (c, lt, gt) => {
  c.save(); cam(c, 540, 900, 1.0 + lt * .015);
  graph(c);
  const s = pop(gt, CUE.zero - .95), r = pop(gt, CUE.zero);
  if (s) { c.save(); c.translate(540, 700); c.scale(s, s); text(c, '0 × 2', 0, 0, '700 260px Oswald', '#1d1d22'); c.restore(); }
  if (r) { c.save(); c.translate(540, 1450); c.scale(r, r); text(c, '= 0', 0, 0, '700 300px Oswald', '#2EAD5B'); c.restore(); }
  c.restore();
};
SC.don = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.05 + lt * .015);
  c.fillStyle = grad(c, -300, 1200, ['#8EC8EA', '#D2ECF6']); c.fillRect(-300, -300, 1700, 1600);
  c.fillStyle = '#B8B2A6'; c.fillRect(-300, 1240, 1700, 900);
  rr(c, -100, 500, 420, 740, 8); fs(c, '#E8E4DC', 6); rr(c, -60, 560, 340, 90, 8); fs(c, '#E53935', 0); text(c, 'HÔPITAL', 110, 608, '700 56px Oswald', '#fff');
  rr(c, 760, 760, 380, 480, 8); fs(c, '#C0392B', 6); text(c, 'KEBAB', 950, 830, '700 60px Oswald', '#fff');
  hero(c, { x: 540, y: 1330, s: .9, f: 1, t: gt, front: [1.8, .1], back: [.3, .2] });
  for (let i = 0; i < 10; i++) { const k = ((lt * .6 + i * .1) % 1); bill(c, lerp(640, i % 2 ? 1000 : 120, k), lerp(1000, 700, k) - Math.sin(k * Math.PI) * 200, .8, k * 4); }
  c.restore();
  const labels = [['HÔPITAL', .3], ['MAMAN', .43], ['PROF DE MATHS', .56], ['KEBAB', .7]];
  labels.forEach(([l, k], i) => badge(c, i % 2 ? 760 : 320, 260 + i * 110, pop(gt, AT(6, k)), l, '#2EAD5B'));
};
SC.matin = (c, lt, gt) => {
  const notif = gt > CUE.notif - .3;
  c.save(); cam(c, 540, 1000, 1.05);
  room(c, true);
  hero(c, { x: 300, y: 1330, s: .9, f: 1, t: gt, front: [1.9, .8], back: [.3, .2], mouthO: notif });
  c.restore();
  const z = gt > LS(7) + 1.5 ? 1 : pop(gt, LS(7) + .2);
  if (z) phone(c, 680, 720, .04, .8 * z, bankApp(gt > CUE.solde ? '0 €' : '…', notif, (gt - CUE.notif + .3) / .5));
  if (gt > CUE.solde && !notif) badge(c, 640, 380, pop(gt, CUE.solde), 'C\'EST FINI', '#2EAD5B');
};
SC.fin = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.05 + lt * .02);
  room(c, true);
  hero(c, { x: 540, y: 1330, s: .9, f: 1, t: gt, front: [2.3, 1.2], back: [.3, .2], mouthO: true });
  c.restore();
  badge(c, 540, 380, pop(gt, LS(9) + .2), 'ABONNE-TOI', '#E53935');
  endAsk(c, gt, CUE.fin, 'FIN', 'TU AURAIS TOUT DONNÉ ?');
};
function hud() {}
