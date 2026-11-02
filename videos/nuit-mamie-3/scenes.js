// Ne réponds pas — Partie 3, fin (accessoires : ../engine/horreur.js).
const EP = {
  subs: { font: '900 82px Montserrat', y: 360, stroke: 0, space: 24, red: '#FF4B4B' },
  vignette: { vocal: .5, fin: .6 },
  hideSubs: gt => gt > CUE.endcard - .1,
};
const SC = {};

// Mamie : même style que « toi » (tête noire, yeux blancs) + chignon gris, gilet violet.
function mamie(c, x, y, s, f = 1, t = 0) {
  c.save(); c.translate(x, y); c.scale(s * f, s);
  [-1, 1].forEach(k => line(c, [[k * 12, -230], [k * 16, 0]], 26, '#6B6F80', null));
  rr(c, -64, -470, 128, 250, 40); fs(c, '#7A4FA0', 0);
  for (let i = 0; i < 4; i++) { circ(c, 0, -440 + i * 55, 6); fs(c, '#D9C8F0', 0); }
  circ(c, 8, -540, 74); fs(c, '#0E0E14', 0);
  circ(c, -40, -600, 34); fs(c, '#B8BCC8', 0);
  c.beginPath(); c.arc(8, -555, 76, Math.PI * 1.05, Math.PI * 1.9); c.lineWidth = 14; c.strokeStyle = '#B8BCC8'; c.stroke();
  [[24, -540], [56, -540]].forEach(([ex, ey]) => { circ(c, ex, ey, 14); fs(c, '#fff', 0); circ(c, ex, ey, 18); fs(c, null, 4, '#C9A227'); });
  c.restore();
}
function callScreen(c, gt, state) { // appel entrant puis « appel manqué »
  const missed = state === 'missed', shake = missed ? 0 : Math.sin(gt * 110) * 5;
  c.fillStyle = '#0D1024'; c.fillRect(0, 0, W, H);
  c.save(); c.translate(540 + shake, 1250); c.scale(1.28, 1.28);
  rr(c, -330, -640, 660, 1320, 70); fs(c, '#0B0E18', 0);
  rr(c, -300, -610, 600, 1260, 50); fs(c, grad(c, -610, 650, ['#2A3466', '#141936']), 0);
  text(c, missed ? 'Appel manqué' : 'Appel entrant', 0, -430, '600 40px Montserrat', missed ? '#FF4B4B' : '#AEB8E6');
  circ(c, 0, -250, 110); fs(c, '#5B8BE0', 0); text(c, 'M', 0, -246, '800 110px Montserrat', '#fff');
  text(c, 'Mamie', 0, -60, '800 80px Montserrat', '#fff');
  if (!missed) [[-170, '#FF4B4B'], [170, '#34C759']].forEach(([x, col]) => { circ(c, x, 380, 70); fs(c, col, 0); });
  c.restore();
}

// ---------- SCÈNES ----------
SC.appel = (c, lt, gt) => {
  const vm = CUE.vm;
  if (gt < vm - .2) { callScreen(c, gt, gt > CUE.missed ? 'missed' : 'ring'); return; }
  phoneUI(c, gt, 'Messagerie', 'nouveau message', [['Message vocal de « Mamie » · 0:03', vm]]);
};
SC.vocal = (c, lt, gt) => {
  c.fillStyle = '#0D1024'; c.fillRect(0, 0, W, H);
  glow(c, 540, 900, 700, 'rgba(255,60,60,A)', .12 + .08 * Math.sin(gt * 4));
  const playing = gt > CUE.play && gt < CUE.play + 2.2;
  c.save(); c.translate(540, 950);
  rr(c, -420, -150, 840, 300, 60); fs(c, '#1E2448', 0);
  circ(c, -320, 0, 70); fs(c, '#FF4B4B', 0);
  c.beginPath(); c.moveTo(-340, -36); c.lineTo(-290, 0); c.lineTo(-340, 36); c.closePath(); fs(c, '#fff', 0);
  for (let i = 0; i < 26; i++) { const h = 20 + (playing ? Math.abs(Math.sin(gt * 14 + i * .9)) * 100 : 14 + rnd(i) * 30); rr(c, -200 + i * 22, -h / 2, 12, h, 6); fs(c, playing ? '#FF7B7B' : '#5A64A0', 0); }
  text(c, '0:03', 330, 90, '600 34px Montserrat', '#9AA6D6');
  c.restore();
  if (gt > LINES[3].start) {
    const s = pop(gt, LINES[3].start);
    c.save(); c.translate(540, 1500); c.scale(s, s); rr(c, -300, -60, 600, 120, 60); fs(c, '#FF4B4B', 0); text(c, 'C\'EST TA VOIX', 0, 4, '900 60px Montserrat', '#fff'); c.restore();
  }
  dust(c, gt, 20, 5);
};
SC.aube = (c, lt, gt) => {
  const k = pr(lt, 0, 8);
  c.save(); cam(c, 560, 1000, 1.0 + lt * .01);
  bedroom(c, gt);
  c.fillStyle = `rgba(255,170,110,${.12 + .2 * k})`; c.fillRect(560, 260, 420, 520); // l'aube dans la fenêtre
  kid(c, { x: 420, y: 1300, s: .78, f: 1, sit: 1, t: gt, eyes: 1 - .6 * k, front: [.4, .2], back: [.3, .2] });
  c.fillStyle = `rgba(255,170,110,${.10 * k})`; c.fillRect(-300, -300, 1700, 2600);
  c.restore();
  dust(c, gt, 30, 11);
};
SC.mamie = (c, lt, gt) => {
  const hug = eo(pr(gt, CUE.hug - .8, CUE.hug));
  c.save(); cam(c, 560, 1000, 1.1 + lt * .02);
  bedroom(c, gt);
  c.fillStyle = 'rgba(255,170,110,.18)'; c.fillRect(-300, -300, 1700, 2600);
  kid(c, { x: 560, y: 1330, s: .78, f: 1, t: gt, eyes: .2, front: [hug * 1.6, .3], back: [hug * 1.4, .3] });
  mamie(c, lerp(980, 700, eo(pr(lt, 0, 1.6))), 1330, .8, -1, gt);
  if (hug > .9) { c.font = '900 60px Montserrat'; text(c, '♥', 640, 650, '900 60px Montserrat', '#FF7B9C'); }
  c.restore();
  dust(c, gt, 25, 17);
};
SC.jardin = (c, lt, gt) => {
  const st = CUE.steps;
  c.save(); cam(c, 540, lerp(1100, 900, pr(lt, 0, 8)), 1.05);
  c.fillStyle = grad(c, -300, 1200, ['#6E7FB8', '#E8B49A']); c.fillRect(-300, -300, 1700, 1600);
  for (let k = 0; k < 9; k++) { const px = k * 160 - 100, ph = 300 + rnd(k + 3) * 200; c.beginPath(); c.moveTo(px - 90, 1100); c.lineTo(px, 1100 - ph); c.lineTo(px + 90, 1100); fs(c, '#2E3A5E', 0); }
  c.fillStyle = '#4C6A55'; c.fillRect(-300, 1100, 1700, 1100);
  for (let i = 0; i < 7; i++) { // traces de pas immenses
    if (gt < st + i * .35) continue;
    const x = 420 + (i % 2) * 140 + i * 20, y = 1800 - i * 120, s = 1 - i * .09;
    c.save(); c.translate(x, y); c.scale(s, s);
    c.beginPath(); c.ellipse(0, 0, 50, 95, .15, 0, Math.PI * 2); fs(c, '#2F4536', 0);
    for (let d = -2; d <= 2; d++) { c.beginPath(); c.ellipse(d * 26, -120, 10, 30, d * .2, 0, Math.PI * 2); fs(c, '#2F4536', 0); }
    c.restore();
  }
  c.restore();
  dust(c, gt, 20, 23);
};
SC.fin = (c, lt, gt) => {
  const l10 = LINES[10].start - .2;
  if (gt < l10) {
    c.save(); cam(c, 560, 1000, 1.05 + lt * .03);
    c.fillStyle = NAVY; c.fillRect(-300, -300, 1700, 2600);
    nightGarden(c, 600, 300, 380, 480, gt); rr(c, 594, 294, 392, 492, 6); fs(c, null, 12, '#D6DCF0');
    c.fillStyle = '#141830'; c.fillRect(-300, 1300, 1700, 900);
    mamie(c, 420, 1320, .82, 1, gt);
    glow(c, 520, 840, 200, 'rgba(140,180,255,A)', .5 * pr(gt, LINES[9].start + 1, LINES[9].start + 1.5));
    rr(c, 495, 810, 60, 100, 10); fs(c, '#9CC3FF', 0);
    c.restore();
    dust(c, gt, 25, 29);
  } else {
    phoneUI(c, gt, 'Toi', 'en ligne', [['Mamie… tu peux venir dans le jardin ?', CUE.msg]]);
  }
  horrorEnd(c, gt, CUE.endcard, 'NE RÉPONDS PAS', 'FIN', null);
  if (gt > CUE.endcard + 1) { c.save(); c.globalAlpha = clamp(pop(gt, CUE.endcard + 1)); text(c, 'ABONNE-TOI POUR', 540, 1080, '800 48px Montserrat', '#C9D4FF', 'center', 0, OL, '4px'); text(c, 'LA PROCHAINE HISTOIRE', 540, 1150, '900 56px Montserrat', '#FF4B4B'); c.restore(); }
};

const PLACES = { appel: 'SOUS LE LIT', vocal: 'SOUS LE LIT', aube: 'TA CHAMBRE', mamie: 'TA CHAMBRE', jardin: 'JARDIN', fin: 'CHAMBRE DE MAMIE' };
function hud(c, gt, sid) {
  if (gt > CUE.endcard - .1) return;
  const S = TL.scenes.find(s => s.id === sid);
  if (sid === 'aube' || sid === 'mamie' || sid === 'jardin') return horrorHud(c, gt - TL.scenes.find(s => s.id === 'aube').start, PLACES[sid], '06:00:00');
  if (sid === 'fin') return horrorHud(c, gt - S.start, PLACES[sid], '21:47:00');
  horrorHud(c, gt, PLACES[sid], '03:02:00');
}
