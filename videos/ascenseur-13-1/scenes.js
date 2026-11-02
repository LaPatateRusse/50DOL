// L'ascenseur du 13e — Partie 1 (accessoires ../engine/horreur.js).
const EP = {
  subs: { font: '900 82px Montserrat', y: 360, stroke: 0, space: 24, red: '#FF4B4B' },
  vignette: { note: .6, heure: .5 },
  hideSubs: gt => gt > CUE.partie2 - .1,
};
const SC = {};

// Le Liftier : uniforme rouge sombre, casquette, long cou, visage lisse sans traits.
function liftier(c, x, y, s, t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  [-1, 1].forEach(k => line(c, [[k * 18, -260], [k * 22, 0]], 30, '#1E1A22', null));
  rr(c, -70, -560, 140, 310, 30); fs(c, '#6E1E2A', 0);
  for (let i = 0; i < 4; i++) { circ(c, 0, -520 + i * 60, 7); fs(c, '#C9A227', 0); }
  line(c, [[-60, -540], [-90, -300], [-80, -200]], 24, '#6E1E2A', null); line(c, [[60, -540], [90, -300], [80, -200]], 24, '#6E1E2A', null);
  rr(c, -16, -640, 32, 90, 12); fs(c, '#D8D2C8', 0);  // long cou
  c.beginPath(); c.ellipse(0, -700 + Math.sin(t * 1.2) * 3, 62, 78, 0, 0, Math.PI * 2); fs(c, '#E8E2D8', 0); // visage lisse
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

SC.hall = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.0 + lt * .02);
  c.fillStyle = '#20253F'; c.fillRect(-300, -300, 1700, 2600);
  c.fillStyle = '#171B30'; c.fillRect(-300, 1320, 1700, 900);
  for (let i = 0; i < 6; i++) { rr(c, 60 + i * 30, 560 + i * 18, 70, 10, 3); fs(c, '#2E3460', 0); } // boîtes aux lettres
  rr(c, 40, 540, 220, 200, 6); fs(c, '#2A3058', 0);
  elevatorDoors(c, 560, 620, eo(pr(lt, 4, 6)), '0');
  glow(c, 760, 500, 300, 'rgba(255,240,200,A)', .12);
  kid(c, { x: lerp(260, 600, eo(pr(lt, 4.5, 7))), y: 1340, s: .8, f: 1, t: gt, walk: lt < 7 ? gt * 6 : undefined, front: [.3, .2], back: [.2, .2] });
  c.restore();
  dust(c, gt, 25, 3);
};
SC.cabine = (c, lt, gt) => {
  const ding = CUE.ding, fl = gt < LINES[1].start + 2.5 ? 10 : gt < LINES[1].start + 4.5 ? 11 : gt < ding ? 12 : 13;
  const shake = gt > ding - 1 && gt < ding ? Math.sin(gt * 80) * 3 : 0;
  c.save(); cam(c, 540 + shake, 960, 1.05 + lt * .02);
  c.fillStyle = '#3A3F52'; c.fillRect(-300, -300, 1700, 2600);
  for (let x = 100; x < 1000; x += 160) { c.fillStyle = 'rgba(255,255,255,.04)'; c.fillRect(x, 300, 8, 1100); }
  rr(c, 380, 640, 320, 140, 12); fs(c, '#0B0B10', 6, '#666');
  text(c, String(fl), 540, 712, '700 110px "Roboto Mono"', fl === 13 ? '#FF3B3B' : '#FFB347');
  if (fl === 13) glow(c, 540, 710, 260, 'rgba(255,40,40,A)', .4);
  rr(c, 820, 640, 150, 420, 12); fs(c, '#9AA0AE', 0);
  for (let i = 0; i < 12; i++) { const bx = 850 + (i % 2) * 60, by = 670 + Math.floor(i / 2) * 62; circ(c, bx + 15, by + 20, 22); fs(c, i === 11 ? '#FFB347' : '#D6DAE2', 0); text(c, String(12 - i), bx + 15, by + 22, '700 20px Montserrat', '#333'); }
  c.fillStyle = '#2A2E3E'; c.fillRect(-300, 1340, 1700, 900);
  kid(c, { x: 480, y: 1350, s: .82, f: 1, t: gt, eyes: fl === 13 ? 1 : 0, look: 1, front: [.4, .2], back: [.2, .2] });
  c.fillStyle = 'rgba(255,230,180,.06)'; c.fillRect(-300, -300, 1700, 2600);
  c.restore();
};
SC.couloir = (c, lt, gt) => {
  c.save(); cam(c, 540, lerp(980, 900, pr(lt, 0, 8)), 1.0 + lt * .03);
  c.fillStyle = '#2A1A22'; c.fillRect(-300, -300, 1700, 2600);
  c.fillStyle = '#3A2530'; c.beginPath(); c.moveTo(0, 300); c.lineTo(440, 780); c.lineTo(440, 1140); c.lineTo(0, 1700); c.fill();
  c.beginPath(); c.moveTo(1080, 300); c.lineTo(640, 780); c.lineTo(640, 1140); c.lineTo(1080, 1700); c.fill();
  c.fillStyle = '#7A1F2B'; c.beginPath(); c.moveTo(-100, 1800); c.lineTo(440, 1140); c.lineTo(640, 1140); c.lineTo(1180, 1800); c.fill(); // moquette rouge
  c.fillStyle = '#150C12'; c.fillRect(440, 780, 200, 360);
  [[0, 700], [1, 700]].forEach(([k]) => { for (let i = 0; i < 3; i++) { const x = k ? 900 - i * 120 : 180 + i * 120, y = 820 + i * 40; glow(c, x, y - 40, 60, 'rgba(255,200,120,A)', .35); circ(c, x, y - 40, 10); fs(c, '#FFD9A0', 0); } });
  const np = pop(gt, CUE.notepop);
  if (np) { c.save(); c.translate(250, 1000); c.rotate(-.1); c.scale(np, np); rr(c, -60, -45, 120, 90, 4); fs(c, '#F4ECD8', 0); line(c, [[-40, -10], [40, -10]], 4, '#555', null); line(c, [[-40, 12], [25, 12]], 4, '#555', null); c.restore(); }
  c.restore();
  dust(c, gt, 30, 7);
};
SC.note = (c, lt, gt) => {
  c.fillStyle = '#2A1A22'; c.fillRect(0, 0, W, H);
  c.save(); cam(c, 540, 1000, lerp(1.0, 1.08, pr(lt, 0, 4)), -.03);
  rr(c, 130, 640, 820, 560, 10); fs(c, '#F4ECD8', 0);
  c.fillStyle = 'rgba(200,200,180,.4)'; c.fillRect(470, 610, 140, 60);
  const lines = [['Si quelqu\'un te demande', 0], ['l\'heure…', .6], ['ne réponds JAMAIS.', 1.4]];
  lines.forEach(([t, d], i) => { const a = pr(gt, LINES[4].start + d, LINES[4].start + d + .4); if (!a) return; c.save(); c.globalAlpha = a; text(c, t, 540, 790 + i * 140, i === 2 ? '800 72px Montserrat' : '700 62px Montserrat', i === 2 ? '#B3261E' : '#24365E'); c.restore(); });
  c.restore();
  dust(c, gt, 20, 13);
};
SC.liftier = (c, lt, gt) => {
  const ask = CUE.ask, near = eo(pr(gt, LINES[6].start, ask + .5));
  c.save(); cam(c, 540, lerp(980, 900, near), lerp(1.0, 1.5, near));
  c.fillStyle = '#2A1A22'; c.fillRect(-300, -300, 1700, 2600);
  c.fillStyle = '#3A2530'; c.beginPath(); c.moveTo(0, 300); c.lineTo(440, 780); c.lineTo(440, 1140); c.lineTo(0, 1700); c.fill();
  c.beginPath(); c.moveTo(1080, 300); c.lineTo(640, 780); c.lineTo(640, 1140); c.lineTo(1080, 1700); c.fill();
  c.fillStyle = '#7A1F2B'; c.beginPath(); c.moveTo(-100, 1800); c.lineTo(440, 1140); c.lineTo(640, 1140); c.lineTo(1180, 1800); c.fill();
  c.fillStyle = '#150C12'; c.fillRect(440, 780, 200, 360);
  liftier(c, 540, lerp(1130, 1420, near), lerp(.42, .95, near), gt);
  c.restore();
  if (gt > CUE.face && gt < CUE.face + .4) { c.fillStyle = 'rgba(255,255,255,.15)'; c.fillRect(0, 0, W, H); }
  dust(c, gt, 30, 17);
};
SC.heure = (c, lt, gt) => {
  c.fillStyle = '#0D1024'; c.fillRect(0, 0, W, H);
  c.save(); c.translate(540, 1250); c.scale(1.28, 1.28);
  rr(c, -330, -640, 660, 1320, 70); fs(c, '#0B0E18', 0);
  rr(c, -300, -610, 600, 1260, 50); fs(c, grad(c, -610, 650, ['#2A2040', '#120E1E']), 0);
  const m = gt > CUE.clock ? '13' : '12';
  text(c, `03:${m}`, 0, -260, '700 190px "Roboto Mono"', gt > CUE.clock ? '#FF4B4B' : '#fff');
  text(c, 'lundi 3 novembre', 0, -110, '600 38px Montserrat', '#AEB8E6');
  c.restore();
  [[-1], [1]].forEach(([k]) => { for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(540 + k * 430, 1560 + i * 110, 50, 44, 0, 0, Math.PI * 2); fs(c, '#0E0E14', 0); } });
};
SC.fin = (c, lt, gt) => {
  const cl = eo(pr(gt, CUE.doors, CUE.doors + 4));
  c.save(); cam(c, 540, 1000, 1.05 + lt * .02);
  c.fillStyle = '#2A1A22'; c.fillRect(-300, -300, 1700, 2600);
  c.fillStyle = '#7A1F2B'; c.fillRect(-300, 1340, 1700, 900);
  elevatorDoors(c, 340, 620, 1 - cl, '13');
  kid(c, { x: 260, y: 1350, s: .82, f: 1, t: gt, eyes: 1, look: 1, shake: true, front: [.3, .2], back: [.2, .2] });
  liftier(c, 920, 1360, .82, gt);
  c.restore();
  dust(c, gt, 25, 21);
  horrorEnd(c, gt, CUE.partie2, "L'ASCENSEUR DU 13E", 'PARTIE 2', 'TU LUI RÉPONDS ?');
};
const PLACES = { hall: 'HALL', cabine: 'ASCENSEUR', couloir: '13E ÉTAGE', note: '13E ÉTAGE', liftier: '13E ÉTAGE', heure: '13E ÉTAGE', fin: '13E ÉTAGE' };
function hud(c, gt, sid) { if (gt < CUE.partie2 - .1) horrorHud(c, gt, PLACES[sid], '03:12:00'); }
