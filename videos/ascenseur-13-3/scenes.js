// L'ascenseur du 13e — Partie 3 (FIN) (accessoires ../engine/horreur.js ; même style que les Parties 1 et 2).
const EP = {
  subs: { font: '900 82px Montserrat', y: 360, stroke: 0, space: 24, red: '#FF4B4B' },
  vignette: { noir: .7, horloge: .6, couloir: .5 },
  hideSubs: gt => gt > CUE.endcard - .1,
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


// horloge avec minutes au choix et trotteuse
function clockLive(c, x, y, r, min, sec) {
  circ(c, x, y, r); fs(c, '#E8E0CC', Math.max(2, r * .08), '#3A2A20');
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; line(c, [[x + Math.cos(a) * r * .78, y + Math.sin(a) * r * .78], [x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9]], Math.max(1.5, r * .04), '#3A2A20', null); }
  const ah = (3 + min / 60) / 12 * Math.PI * 2 - Math.PI / 2, am = min / 60 * Math.PI * 2 - Math.PI / 2, as = sec / 60 * Math.PI * 2 - Math.PI / 2;
  line(c, [[x, y], [x + Math.cos(ah) * r * .5, y + Math.sin(ah) * r * .5]], r * .08, '#1A1210', null);
  line(c, [[x, y], [x + Math.cos(am) * r * .75, y + Math.sin(am) * r * .75]], r * .05, '#1A1210', null);
  if (sec !== undefined) line(c, [[x, y], [x + Math.cos(as) * r * .85, y + Math.sin(as) * r * .85]], r * .02, '#C0392B', null);
  circ(c, x, y, r * .05); fs(c, '#1A1210', 0);
}
// gardien : uniforme bleu, casquette, tête noire et yeux blancs (même famille que le héros)
function guard(c, x, y, s, f, t) {
  c.save(); c.translate(x, y); c.scale(s * f, s);
  [-1, 1].forEach(k => { line(c, [[k * 14, -250], [k * 16, -8]], 28, '#1E2438', null); rr(c, k * 16 - 16, -18, 54, 22, 10); fs(c, '#0B0B10', 0); });
  rr(c, -66, -520, 132, 290, 34); fs(c, '#2F4A7A', 0); rr(c, 20, -470, 34, 24, 4); fs(c, '#D9B25A', 0);
  line(c, [[-50, -500], [-70, -390], [-60, -300]], 26, '#2A4170', null); // bras le long du corps (coude positif)
  line(c, [[50, -500], [120, -420], [190, -470]], 26, '#2A4170', null); circ(c, 196, -474, 16); fs(c, '#0E0E14', 0); // bras qui montre
  circ(c, 8, -600, 76); fs(c, '#0E0E14', 0);
  [[22, -604], [56, -604]].forEach(([ex, ey]) => { c.beginPath(); c.ellipse(ex, ey, 13, 20, 0, 0, Math.PI * 2); fs(c, '#fff', 0); });
  c.beginPath(); c.arc(8, -620, 78, Math.PI, Math.PI * 2); fs(c, '#1E2F55', 0); rr(c, 20, -630, 110, 20, 8); fs(c, '#16233F', 0);
  c.restore();
}
function panel(c, lit13, press0) {
  rr(c, 240, 520, 600, 1000, 30); fs(c, '#8A909E', 6, '#5A606C');
  const btn = (x, y, lab, on) => { circ(c, x, y, 52); fs(c, on ? '#FFD9A0' : '#2A2D36', 4, '#C9CED8'); if (on) glow(c, x, y, 110, 'rgba(255,190,110,A)', .55); text(c, lab, x, y + 2, '700 46px "Roboto Mono"', on ? '#3A1A10' : '#E8EAF2'); };
  const labs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  labs.forEach((l, i) => btn(400 + (i % 3) * 140, 1420 - Math.floor(i / 3) * 150, l, l === '0' && press0));
  if (lit13) { const k = lit13; c.save(); c.globalAlpha = k; btn(540, 1420 - 5 * 150 + 40, '13', true); c.restore(); }
  text(c, 'TOIT', 540, 600, '700 34px Montserrat', '#2A2D36');
}

SC.noir = (c, lt, gt) => {
  c.fillStyle = '#05050A'; c.fillRect(0, 0, W, H);
  const off = pr(gt, CUE.off - .3, CUE.off + .3);
  if (off < 1) { c.save(); c.globalAlpha = 1 - off; c.translate(540, 1100); rr(c, -260, -500, 520, 1000, 60); fs(c, '#0B0E18', 0); rr(c, -236, -476, 472, 952, 44); fs(c, '#2A2040', 0); text(c, '03:13', 0, -200, '700 150px "Roboto Mono"', '#FF4B4B'); c.restore(); }
  const near = eo(pr(gt, CUE.off, CUE.ask + .3));
  if (gt > CUE.off) { c.save(); c.globalAlpha = .18 + near * .5; c.beginPath(); c.ellipse(lerp(900, 760, near), lerp(900, 980, near), 120 * (1 + near * .5), 150 * (1 + near * .5), 0, 0, Math.PI * 2); fs(c, '#E8E2D8', 0); rr(c, lerp(900, 760, near) - 140 * (1 + near * .5), lerp(900, 980, near) - 210 * (1 + near * .5), 280 * (1 + near * .5), 70 * (1 + near * .5), 12); fs(c, '#4A1018', 0); c.restore(); }
  const bl = Math.floor(gt * 2.3) % 7 === 0 ? .2 : 1;
  if (gt > CUE.off + .2) [[400, 1000], [450, 1000]].forEach(([x, y]) => { c.beginPath(); c.ellipse(x, y, 14 + near * 6, (22 + near * 10) * bl, 0, 0, Math.PI * 2); fs(c, '#fff', 0); });
  dust(c, gt, 12, 3);
};
SC.horloge = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, lerp(1.0, 1.15, pr(lt, 0, 8)));
  c.fillStyle = '#0E080C'; c.fillRect(-300, -300, 1700, 2600);
  for (let i = 0; i < 22; i++) { const x = 90 + (i * 233) % 920, y = 470 + ((i * 157) % 900), r = 30 + rnd(i) * 30; if (Math.hypot(x - 540, y - 1000) > 330) { c.save(); c.globalAlpha = .45; clockFace(c, x, y, r + 14, gt); c.restore(); } }
  const on = gt > CUE.tick; if (on) glow(c, 540, 1000, 420, 'rgba(255,210,150,A)', .35);
  const mn = gt > CUE.min ? 13 + eo(pr(gt, CUE.min, CUE.min + .25)) : 13;
  clockLive(c, 540, 1000, 260, mn, on ? (gt - CUE.tick) * 6 % 60 : 0);
  c.restore();
  dust(c, gt, 20, 9);
};
SC.couloir = (c, lt, gt) => {
  c.save(); cam(c, 540, 980, 1.0 + lt * .03);
  corridor(c);
  const op = eo(pr(gt, CUE.ding, CUE.ding + .8));
  c.fillStyle = '#E8D9A8'; c.globalAlpha = op; c.fillRect(470, 800, 140, 340); c.globalAlpha = 1;
  if (op > 0) glow(c, 540, 970, 260, 'rgba(255,230,170,A)', .5 * op);
  const g = 1 - pr(gt, L(4) + .4, L(4) + 1.6);
  if (g > 0) { c.save(); c.globalAlpha = g; c.translate(Math.sin(gt * 60) * 8 * g, 0); liftier(c, 540, 1300, .6, gt); c.restore(); }
  kid(c, { x: 330, y: 1560, s: .8, f: 1, t: gt, eyes: 1, look: 1, shake: g > 0, back: [.3, .2], front: [.4, .3] });
  c.restore();
  dust(c, gt, 25, 5);
};
SC.ascenseur = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.05 + lt * .02);
  c.fillStyle = '#D9CBA0'; c.fillRect(-300, -300, 1700, 2600); c.fillStyle = '#8A7A5A'; c.fillRect(-300, 1380, 1700, 900);
  const cl = eo(pr(gt, CUE.press + .3, CUE.press + 2.2));
  c.fillStyle = '#20141A'; c.fillRect(340, 620, 400, 700);
  c.save(); c.beginPath(); c.rect(340, 620, 400, 700); c.clip(); liftier(c, 540, 1320, .75, gt); c.restore();
  const w = 200 * cl; rr(c, 340, 620, w, 700, 2); fs(c, '#B8BDC8', 3, '#7A808C'); rr(c, 740 - w, 620, w, 700, 2); fs(c, '#B8BDC8', 3, '#7A808C');
  rr(c, 820, 900, 70, 110, 10); fs(c, '#9AA0AE', 0); circ(c, 855, 955, 24); fs(c, gt > CUE.press ? '#FFD9A0' : '#2A2A2A', 0);
  kid(c, { x: 700, y: 1450, s: .82, f: 1, t: gt, eyes: 1, look: 1, walk: gt < CUE.press ? gt * 12 : undefined, front: gt > CUE.press - .5 ? [1.9, .2] : [.3, .2], back: [.2, .2] });
  c.restore();
  dust(c, gt, 20, 7);
};
SC.rdc = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.0 + lt * .02);
  c.fillStyle = grad(c, 300, 1400, ['#3A4A6A', '#5A6A8A']); c.fillRect(-300, -300, 1700, 2600);
  rr(c, 620, 560, 380, 780, 8); fs(c, '#A8C4E8', 8, '#2A2D36'); glow(c, 810, 900, 380, 'rgba(255,220,180,A)', .35); // porte vitrée : le jour se lève
  for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) { rr(c, 60 + j * 120, 640 + i * 110, 100, 80, 6); fs(c, '#8A6A3A', 3, '#5A4020'); }
  c.fillStyle = '#C9C0B0'; c.fillRect(-300, 1380, 1700, 900);
  for (let i = 0; i < 12; i++) { c.fillStyle = i % 2 ? '#B8AE9C' : '#D4CCBC'; c.fillRect(-300 + i * 160, 1380, 160, 900); }
  kid(c, { x: 330, y: 1500, s: .82, f: 1, t: gt, eyes: .6, look: 1, back: [.2, .1], front: [.3, .2] });
  if (gt > CUE.guard - .8) guard(c, lerp(1100, 780, eo(pr(gt, CUE.guard - .8, CUE.guard + .4))), 1500, .85, -1, gt);
  c.restore();
  dust(c, gt, 15, 11);
};
SC.bouton = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, lerp(1.0, 1.25, pr(gt, CUE.b13 - .6, CUE.b13 + 2.5)));
  c.fillStyle = '#5A606C'; c.fillRect(-300, -300, 1700, 2600);
  panel(c, gt > CUE.b13 ? clamp((gt - CUE.b13) * 3) * (Math.floor(gt * 4) % 5 ? 1 : .7) : 0, false);
  c.restore();
  if (gt > CUE.b13) { c.fillStyle = `rgba(120,0,0,${.12 * Math.abs(Math.sin(gt * 3))})`; c.fillRect(0, 0, W, H); }
  dust(c, gt, 12, 13);
};
SC.fin = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.05 + lt * .02);
  c.fillStyle = '#1A1A24'; c.fillRect(-300, -300, 1700, 2600); c.fillStyle = '#2A2A36'; c.fillRect(-300, 1380, 1700, 900);
  const op = eo(pr(lt, .3, 2.5));
  elevatorDoors(c, 340, 620, op, '13');
  if (op > .2) { c.save(); c.globalAlpha = op; c.fillStyle = '#20141A'; c.fillRect(340 + 200 * (1 - op), 620, 400 * op, 700); liftier(c, 540, 1320, .62, gt); c.restore(); }
  c.restore();
  dust(c, gt, 20, 21);
  horrorEnd(c, gt, CUE.endcard, "L'ASCENSEUR DU 13E", 'FIN', 'TU SERAIS REMONTÉ ?');
};
const PLACES = { noir: 'APPARTEMENT 13', horloge: 'APPARTEMENT 13', couloir: '13E ÉTAGE', ascenseur: '13E ÉTAGE', rdc: 'REZ-DE-CHAUSSÉE', bouton: 'REZ-DE-CHAUSSÉE', fin: 'REZ-DE-CHAUSSÉE' };
function hud(c, gt, sid) { if (gt < CUE.endcard - .1) horrorHud(c, gt, PLACES[sid], gt > CUE.min ? '03:14:00' : '03:13:00'); }
