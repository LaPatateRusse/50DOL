// L'ascenseur du 13e — Partie 2 (accessoires ../engine/horreur.js ; même style que la Partie 1).
const EP = {
  subs: { font: '900 82px Montserrat', y: 360, stroke: 0, space: 24, red: '#FF4B4B' },
  vignette: { carnet: .6, montres: .55 },
  hideSubs: gt => gt > CUE.partie3 - .1,
};
const SC = {};
const L = i => LINES[i].start;

function liftier(c, x, y, s, t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  [-1, 1].forEach(k => line(c, [[k * 18, -260], [k * 22, 0]], 30, '#1E1A22', null));
  rr(c, -70, -560, 140, 310, 30); fs(c, '#6E1E2A', 0);
  for (let i = 0; i < 4; i++) { circ(c, 0, -520 + i * 60, 7); fs(c, '#C9A227', 0); }
  line(c, [[-60, -540], [-90, -300], [-80, -200]], 24, '#6E1E2A', null); line(c, [[60, -540], [90, -300], [80, -200]], 24, '#6E1E2A', null);
  rr(c, -16, -640, 32, 90, 12); fs(c, '#D8D2C8', 0);
  c.beginPath(); c.ellipse(0, -700 + Math.sin(t * 1.2) * 3, 62, 78, 0, 0, Math.PI * 2); fs(c, '#E8E2D8', 0);
  c.beginPath(); c.ellipse(0, -690, 50, 40, 0, 0, Math.PI * 2); fs(c, 'rgba(0,0,0,.05)', 0);
  rr(c, -70, -790, 140, 50, 10); fs(c, '#4A1018', 0); rr(c, -85, -748, 170, 16, 6); fs(c, '#2A0A10', 0);
  c.restore();
}
function elevatorDoors(c, x, y, open, label) {
  rr(c, x - 20, y - 20, 440, 740, 8); fs(c, '#8A8F9C', 0);
  c.fillStyle = '#E8D9A8'; c.fillRect(x, y, 400, 700);
  const w = 200 * (1 - open);
  rr(c, x, y, w, 700, 2); fs(c, '#B8BDC8', 3, '#7A808C'); rr(c, x + 400 - w, y, w, 700, 2); fs(c, '#B8BDC8', 3, '#7A808C');
  if (label) { rr(c, x + 150, y - 90, 100, 56, 8); fs(c, '#111', 0); text(c, label, x + 200, y - 60, '700 40px "Roboto Mono"', '#FF4B4B'); }
}
function corridor(c) {
  c.fillStyle = '#2A1A22'; c.fillRect(-300, -300, 1700, 2600);
  c.fillStyle = '#3A2530'; c.beginPath(); c.moveTo(0, 300); c.lineTo(440, 780); c.lineTo(440, 1140); c.lineTo(0, 1700); c.fill();
  c.beginPath(); c.moveTo(1080, 300); c.lineTo(640, 780); c.lineTo(640, 1140); c.lineTo(1080, 1700); c.fill();
  c.fillStyle = '#7A1F2B'; c.beginPath(); c.moveTo(-100, 1800); c.lineTo(440, 1140); c.lineTo(640, 1140); c.lineTo(1180, 1800); c.fill();
  c.fillStyle = '#150C12'; c.fillRect(440, 780, 200, 360);
  [0, 1].forEach(k => { for (let i = 0; i < 3; i++) { const x = k ? 900 - i * 120 : 180 + i * 120, y = 820 + i * 40; glow(c, x, y - 40, 60, 'rgba(255,200,120,A)', .35); circ(c, x, y - 40, 10); fs(c, '#FFD9A0', 0); } });
}
// porte d'appartement en perspective sur un mur latéral (k = -1 gauche, 1 droite ; d = 0 proche → 1 loin)
function sideDoor(c, k, d, open = 0) {
  const x0 = k < 0 ? lerp(40, 400, d) : lerp(1040, 680, d), w = lerp(150, 30, d) * -k, top = lerp(620, 820, d), bot = lerp(1500, 1110, d);
  c.beginPath(); c.moveTo(x0, top); c.lineTo(x0 - w, top + lerp(40, 10, d) * 1); c.lineTo(x0 - w, bot - lerp(30, 6, d)); c.lineTo(x0, bot); c.closePath(); fs(c, open ? '#0A0608' : '#4A2A30', 0);
  const tx = x0 - w / 2, ty = top + (bot - top) * .25;
  text(c, '13', tx, ty, `700 ${Math.round(lerp(46, 12, d))}px "Roboto Mono"`, '#D9B25A');
  if (open) glow(c, tx, (top + bot) / 2, lerp(120, 30, d), 'rgba(255,210,140,A)', .3);
}
function clockFace(c, x, y, r, t) {
  circ(c, x, y, r); fs(c, '#E8E0CC', Math.max(2, r * .08), '#3A2A20');
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; line(c, [[x + Math.cos(a) * r * .78, y + Math.sin(a) * r * .78], [x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9]], Math.max(1.5, r * .04), '#3A2A20', null); }
  // 3 h 13 : petite aiguille un peu après 3, grande sur 13 min
  const ah = (3 + 13 / 60) / 12 * Math.PI * 2 - Math.PI / 2, am = 13 / 60 * Math.PI * 2 - Math.PI / 2;
  line(c, [[x, y], [x + Math.cos(ah) * r * .5, y + Math.sin(ah) * r * .5]], Math.max(2, r * .08), '#1A1210', null);
  line(c, [[x, y], [x + Math.cos(am) * r * .75, y + Math.sin(am) * r * .75]], Math.max(1.5, r * .05), '#1A1210', null);
}

SC.silence = (c, lt, gt) => {
  c.save(); cam(c, 540, 980, 1.25 + lt * .02);
  corridor(c);
  liftier(c, 700, 1430, .9, gt);
  kid(c, { x: 330, y: 1440, s: .85, f: 1, t: gt, eyes: .3, look: 0, shake: gt > CUE.ask, front: [.2, .1], back: [.2, .1] });
  c.restore();
  dust(c, gt, 25, 3);
};
SC.porte = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.05 + lt * .02);
  c.fillStyle = '#2A1A22'; c.fillRect(-300, -300, 1700, 2600); c.fillStyle = '#7A1F2B'; c.fillRect(-300, 1340, 1700, 900);
  elevatorDoors(c, 340, 620, 0, '13');
  rr(c, 820, 900, 70, 110, 10); fs(c, '#9AA0AE', 0); circ(c, 855, 955, 24); fs(c, gt > CUE.btn && Math.floor(gt * 3) % 2 ? '#3A3A3A' : '#2A2A2A', 0);
  kid(c, { x: 700, y: 1350, s: .82, f: 1, t: gt, eyes: .9, look: 1, front: gt > CUE.btn - .6 ? [2.0, .2] : [.3, .2], back: [.2, .2] });
  c.restore();
  dust(c, gt, 25, 5);
};
SC.portes = (c, lt, gt) => {
  c.save(); cam(c, 540, 980, 1.0 + lt * .04);
  corridor(c);
  [-1, 1].forEach(k => [0, .4, .75].forEach(d => sideDoor(c, k, d, k === 1 && d === .4 && gt > L(3) - .8)));
  const run = pr(gt, CUE.run, CUE.run + 4);
  kid(c, { x: 540, y: lerp(1560, 1240, run), s: lerp(.85, .5, run), f: 1, t: gt, walk: gt * 12, back: [.3, .2], front: [.3, .2] });
  c.restore();
  dust(c, gt, 30, 7);
};
SC.montres = (c, lt, gt) => {
  c.save(); cam(c, 540, 960, lerp(1.0, 1.12, pr(lt, 0, 6)));
  c.fillStyle = '#20141A'; c.fillRect(-300, -300, 1700, 2600);
  c.fillStyle = '#140C10'; c.fillRect(-300, 1380, 1700, 900);
  glow(c, 540, 900, 600, 'rgba(255,200,130,A)', .12);
  for (let i = 0; i < 26; i++) { const x = 90 + (i * 233) % 920, y = 470 + ((i * 157) % 760), r = 34 + rnd(i) * 40; if (gt > CUE.clocks - 1 + i * .05) clockFace(c, x, y, r, gt); }
  kid(c, { x: 540, y: 1460, s: .72, f: -1, t: gt, eyes: 1, look: 0, back: [.2, .2], front: [.3, .2] });
  c.restore();
  dust(c, gt, 25, 11);
};
SC.carnet = (c, lt, gt) => {
  c.fillStyle = '#1A1014'; c.fillRect(0, 0, W, H);
  c.save(); cam(c, 540, lerp(1000, 1060, pr(gt, CUE.name - .5, CUE.name + 2)), lerp(1.0, 1.06, pr(lt, 0, 8)), -.02);
  rr(c, 90, 560, 900, 900, 12); fs(c, '#EFE6CF', 0);
  c.fillStyle = 'rgba(120,40,40,.6)'; c.fillRect(170, 560, 4, 900);
  const rows = [['Martin', '3 h 13', 'a répondu'], ['Inès', '3 h 13', 'a répondu'], ['Karim', '3 h 13', 'a répondu'], ['Léa', '3 h 13', 'a répondu'], ['TOI', '', '']];
  rows.forEach(([n, h, s], i) => {
    const y = 700 + i * 150, a = clamp((gt - L(4) - .3 - i * .5) * 2);
    if (a <= 0) return; c.save(); c.globalAlpha = a;
    for (let k = 0; k < 2; k++) { c.fillStyle = 'rgba(80,90,140,.25)'; c.fillRect(190, y + 40 + k * 2, 760, 2); }
    text(c, i === 4 ? 'Ton prénom' : n, 200, y, '700 italic 52px Montserrat', i === 4 ? '#B3261E' : '#2A2A3A', 'left');
    if (h) { text(c, h, 500, y, '700 40px "Roboto Mono"', '#2A2A3A', 'left'); text(c, s, 960, y, '700 italic 32px Montserrat', '#7A2A2A', 'right'); }
    c.restore();
  });
  c.restore();
  dust(c, gt, 18, 13);
};
SC.fin = (c, lt, gt) => {
  const phone = gt > CUE.buzz;
  if (!phone) {
    c.save(); cam(c, 540, 980, 1.1 + lt * .03);
    c.fillStyle = '#20141A'; c.fillRect(-300, -300, 1700, 2600); c.fillStyle = '#140C10'; c.fillRect(-300, 1380, 1700, 900);
    for (let i = 0; i < 10; i++) clockFace(c, 120 + (i * 233) % 860, 520 + ((i * 157) % 500), 40, gt);
    const cl = eo(pr(gt, CUE.slam - .5, CUE.slam));
    rr(c, 720, 640, 260, 740, 6); fs(c, '#0A0608', 0); rr(c, 720, 640, 260 * cl, 740, 6); fs(c, '#4A2A30', 0);
    if (cl < 1) liftier(c, 850, 1380, .55, gt);
    kid(c, { x: 360, y: 1440, s: .8, f: 1, t: gt, eyes: 1, look: 1, shake: gt > CUE.slam, back: [.3, .2], front: [.3, .2] });
    c.restore();
  } else {
    const sh = gt < CUE.buzz + .7 ? Math.sin(gt * 120) * 6 : 0;
    c.fillStyle = '#0D1024'; c.fillRect(0, 0, W, H);
    c.save(); c.translate(540 + sh, 1250); c.scale(1.28, 1.28);
    rr(c, -330, -640, 660, 1320, 70); fs(c, '#0B0E18', 0);
    rr(c, -300, -610, 600, 1260, 50); fs(c, grad(c, -610, 650, ['#2A2040', '#120E1E']), 0);
    text(c, '03:13', 0, -260, '700 190px "Roboto Mono"', '#FF4B4B');
    text(c, 'mardi 4 novembre', 0, -110, '600 38px Montserrat', '#AEB8E6');
    rr(c, 150, -560, 90, 40, 8); fs(c, null, 4, '#FF4B4B'); rr(c, 156, -554, 10, 28, 3); fs(c, '#FF4B4B', 0); text(c, '3 %', 90, -538, '700 30px Montserrat', '#FF4B4B');
    c.restore();
    [-1, 1].forEach(k => { for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(540 + k * 430, 1560 + i * 110, 50, 44, 0, 0, Math.PI * 2); fs(c, '#0E0E14', 0); } });
  }
  dust(c, gt, 25, 21);
  horrorEnd(c, gt, CUE.partie3, "L'ASCENSEUR DU 13E", 'PARTIE 3', 'TU ÉTEINS TON TÉLÉPHONE ?');
};
const PLACES = { silence: '13E ÉTAGE', porte: '13E ÉTAGE', portes: '13E ÉTAGE', montres: 'APPARTEMENT 13', carnet: 'APPARTEMENT 13', fin: 'APPARTEMENT 13' };
function hud(c, gt, sid) { if (gt < CUE.partie3 - .1) horrorHud(c, gt, PLACES[sid], '03:13:00'); }
