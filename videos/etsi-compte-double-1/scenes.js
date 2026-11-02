// Et si ton compte doublait chaque jour ? — Partie 1 (moteur ../engine/, style Max).
const EP = { vignette: { tracfin: .18 }, hideSubs: gt => gt > CUE.partie2 - .1 };
const SC = {};

const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
function bill(c, x, y, s, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  rr(c, -70, -36, 140, 72, 8); fs(c, '#7CC46A', 5); circ(c, 0, 0, 22); fs(c, '#5BA84A', 0); text(c, '€', 0, 2, '700 34px Oswald', '#fff');
  c.restore();
}
function moneyRain(c, t, n, seed = 0) {
  for (let i = 0; i < n; i++) { const x = rnd(i + seed) * 1200 - 60, y = ((rnd(i + seed + 30) * 2200) + t * (300 + rnd(i) * 200)) % 2200 - 150; bill(c, x, y, .8, Math.sin(t * 2 + i) * .6); }
}
function room(c) {
  c.fillStyle = '#D9C9AE'; c.fillRect(-300, -300, 1700, 1700);
  c.fillStyle = '#B49B7C'; c.fillRect(-300, 1200, 1700, 120);
  c.fillStyle = '#8A6446'; c.fillRect(-300, 1320, 1700, 900);
}
function balance(c, gt, day, value, s = 1) { // carte « solde » + jour
  card(c, 540, 230, s, `SOLDE · JOUR ${day}`, `${fmt(value)} €`, (p, x, y) => { circ(p, x, y, 46); fs(p, '#F5C518', 6); text(p, '€', x, y + 2, '700 56px Oswald', '#1d1d22'); }, '#1d1d22', '', 0);
}
function bankPhone(c, gt, text1, blocked) {
  c.fillStyle = '#E9EEF5'; c.fillRect(0, 0, W, H);
  c.save(); c.translate(540, 1100);
  rr(c, -330, -640, 660, 1280, 70); fs(c, '#1d1d22', 0);
  rr(c, -300, -610, 600, 1220, 50); fs(c, '#FFFFFF', 0);
  c.fillStyle = '#1F4E8C'; c.fillRect(-300, -560, 600, 160);
  text(c, 'MA BANQUE', 0, -480, '700 56px Oswald', '#fff');
  if (blocked) {
    const s = pop(gt, CUE.blocked);
    c.save(); c.translate(0, -280); c.scale(s, s);
    circ(c, 0, 0, 110); fs(c, '#E53935', 0); rr(c, -40, -20, 80, 70, 10); fs(c, '#fff', 0); c.beginPath(); c.arc(0, -20, 30, Math.PI, 0); c.lineWidth = 14; c.strokeStyle = '#fff'; c.stroke();
    text(c, 'COMPTE BLOQUÉ', 0, 170, '700 70px Oswald', '#E53935');
    text(c, 'Vérification de l\'origine des fonds', 0, 240, '600 30px Montserrat', '#555');
    c.restore();
  } else { text(c, text1, 0, -100, '800 50px Montserrat', '#1d1d22'); circ(c, 0, 200, 90 + Math.sin(gt * 10) * 6); fs(c, '#34C759', 0); }
  c.restore();
}

// ---------- SCÈNES ----------
SC.titre = (c, lt, gt) => {
  c.fillStyle = grad(c, 0, H, ['#1F4E8C', '#163A69']); c.fillRect(0, 0, W, H);
  moneyRain(c, gt, 22);
  const s1 = pop(lt, .1), s2 = pop(lt, .35, .45);
  if (s1) { c.save(); c.translate(540, 520); c.scale(s1, s1); rr(c, -170, -56, 340, 112, 6); fs(c, '#E53935', 0); text(c, 'ET SI…', 0, 4, '700 84px Oswald', '#fff'); c.restore(); }
  if (s2) { c.save(); c.translate(540, 720); c.scale(s2, s2); text(c, 'TON COMPTE', 0, 0, '700 120px Oswald', '#fff', 'center', 12); text(c, 'DOUBLAIT', 0, 130, '700 120px Oswald', '#F5C518', 'center', 12); text(c, 'CHAQUE JOUR ?', 0, 260, '700 120px Oswald', '#fff', 'center', 12); c.restore(); }
};
SC.debut = (c, lt, gt) => {
  const l2 = LINES[2].start;
  const day = gt < LINES[1].start + 2 ? 1 : gt < l2 ? 2 : 7, v = day === 1 ? 1 : day === 2 ? 2 : 128;
  c.save(); cam(c, 540, 1000, 1.05 + lt * .02);
  room(c);
  rr(c, 600, 1040, 380, 30, 8); fs(c, '#6B4A30', 6);
  hero(c, { x: 420, y: 1330, s: .9, f: 1, t: gt, front: [1.9, .8], back: [.3, .2], lean: day === 7 ? .1 : 0, mouthO: day === 7 });
  rr(c, 560, 900, 70, 110, 12); fs(c, '#1d1d22', 0); rr(c, 568, 910, 54, 90, 8); fs(c, '#9CC3FF', 0);
  c.restore();
  balance(c, gt, day, v, 1);
};
SC.kebab = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.05 + lt * .02);
  c.fillStyle = '#F2C14E'; c.fillRect(-300, -300, 1700, 1700); c.fillStyle = '#D9A93A'; c.fillRect(-300, 1150, 1700, 900);
  rr(c, 520, 700, 520, 450, 10); fs(c, '#C0392B', 6); text(c, 'KEBAB', 780, 760, '700 70px Oswald', '#fff');
  rr(c, 560, 820, 440, 300, 8); fs(c, '#F7E3C4', 5);
  line(c, [[780, 840], [780, 1100]], 30, '#8B5A3C', OL, 6);
  hero(c, { x: 330, y: 1330, s: .9, f: 1, t: gt, front: [1.6, -.2], back: [1.2, .3] });
  const tp = pop(gt, CUE.tip); if (tp) { bill(c, 600, lerp(980, 1060, pr(gt, CUE.tip, CUE.tip + .5)), 1.3 * tp, -.2); badge(c, 780, 600, tp, 'POURBOIRE : 100 €', '#2EAD5B'); }
  c.restore();
  balance(c, gt, 10, 1024, 1);
};
SC.demission = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.05 + lt * .02);
  room(c);
  hero(c, { x: 460, y: 1330, s: .9, f: 1, t: gt, front: [2.3, 1.2], back: [.3, .2] });
  rr(c, 610, 760, 60, 100, 10); fs(c, '#1d1d22', 0);
  const v = pop(gt, CUE.voice);
  if (v) { c.save(); c.translate(760, 560); c.scale(v, v); rr(c, -200, -60, 400, 120, 60); fs(c, '#2EAD5B', 0); for (let i = 0; i < 12; i++) { const h = 20 + Math.abs(Math.sin(gt * 12 + i)) * 50; rr(c, -130 + i * 22, -h / 2, 12, h, 6); fs(c, '#fff', 0); } c.restore(); text(c, '« JE DÉMISSIONNE ! »', 760, 690, '700 46px Oswald', '#1d1d22'); }
  c.restore();
  balance(c, gt, 15, 32768, 1);
};
SC.million = (c, lt, gt) => {
  const ring = gt > CUE.ring;
  c.save(); cam(c, 540, 1000, 1.05);
  room(c);
  moneyRain(c, gt, ring ? 6 : 26, 9);
  for (let i = 0; i < 18; i++) bill(c, 200 + (i % 6) * 130, 1290 - Math.floor(i / 6) * 40, 1, (i % 3 - 1) * .2);
  hero(c, { x: 520, y: 1230, s: .9, f: 1, t: gt, front: ring ? [2.3, 1.2] : [2.9, .2], back: [2.7, .2], mouthO: true });
  if (ring) { const sh = Math.sin(gt * 100) * 4; rr(c, 620 + sh, 640, 60, 100, 10); fs(c, '#1d1d22', 0); glow(c, 650, 690, 140, 'rgba(120,200,255,A)', .5); }
  c.restore();
  balance(c, gt, 20, 1048576, 1);
};
SC.banque = (c, lt, gt) => { bankPhone(c, gt, '', true); };
SC.tracfin = (c, lt, gt) => {
  c.save(); cam(c, 540, 900, 1.0 + lt * .01);
  c.fillStyle = '#F1EADB'; c.fillRect(-100, -100, 1300, 2200);
  for (let x = -100; x < 1300; x += 54) { c.fillStyle = '#E5DCC8'; c.fillRect(x, -100, 3, 2200); }
  for (let y = -100; y < 2100; y += 54) { c.fillStyle = '#E5DCC8'; c.fillRect(-100, y, 1300, 3); }
  const a = pop(lt, .2), b = pop(lt, 1.2), d = pop(lt, 2.4);
  if (a) { c.save(); c.translate(240, 560); c.scale(a, a); rr(c, -150, -110, 300, 220, 16); fs(c, '#1F4E8C', 6); text(c, 'BANQUE', 0, 4, '700 60px Oswald', '#fff'); c.restore(); }
  if (b) { c.save(); c.translate(540, 560); c.scale(b, b); line(c, [[-110, 0], [90, 0]], 14, '#2A2A2A', null); c.beginPath(); c.moveTo(110, 0); c.lineTo(70, -30); c.lineTo(70, 30); c.closePath(); fs(c, '#2A2A2A', 0); text(c, 'SIGNALEMENT', 0, -60, '700 40px Oswald', '#E53935'); c.restore(); }
  if (d) { c.save(); c.translate(840, 560); c.scale(d, d); rr(c, -150, -110, 300, 220, 16); fs(c, '#E53935', 6); text(c, 'TRACFIN', 0, -10, '700 64px Oswald', '#fff'); text(c, 'service de l\'État', 0, 50, '600 26px Montserrat', '#fff'); c.restore(); }
  c.restore();
};
SC.choix = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.08);
  room(c);
  hero(c, { x: 540, y: 1330, s: .9, f: 1, t: gt, front: [2.3, 1.2], back: [.3, .2] });
  c.restore();
  const s = pop(gt, LINES[9].start + 3);
  if (s) { badge(c, 300, 460, s, 'LA VÉRITÉ : OUI', '#2EAD5B'); badge(c, 780, 460, s, 'MENTIR : NON', '#E53935'); }
  balance(c, gt, 21, 2097152, pop(gt, LINES[9].start + .6));
  const k = pr(gt, CUE.partie2 - .1, CUE.partie2 + .15);
  if (k > 0) {
    c.fillStyle = `rgba(16,24,48,${k})`; c.fillRect(0, 0, W, H);
    const s1 = pop(gt, CUE.partie2 + .1), s2 = pop(gt, CUE.partie2 + .35, .45);
    if (s1) { c.save(); c.translate(540, 720); c.scale(s1, s1); rr(c, -170, -56, 340, 112, 6); fs(c, '#E53935', 0); text(c, 'ET SI…', 0, 4, '700 84px Oswald', '#fff'); c.restore(); }
    if (s2) { c.save(); c.translate(540, 920); c.scale(s2, s2); text(c, 'PARTIE 2', 0, 0, '700 200px Oswald', '#F5C518'); c.restore(); }
  }
};
function hud() {}
