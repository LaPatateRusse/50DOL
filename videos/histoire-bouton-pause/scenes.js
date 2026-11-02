// Le Bouton Pause — histoire complète (kits : props.js, horreur.js → hero/kid, quotidien.js).
const EP = { hideSubs: gt => gt > CUE.endcard - .1 };
const SC = {};
const L = i => LINES[i].start;

function oldMe(c, x, y, s, f, hood, t) { // « toi » avec 60 ans de plus : cheveux blancs, dos voûté, canne
  c.save(); c.translate(x, y); c.rotate(f * .12); c.translate(-x, -y);
  kid(c, { x, y, s, f, t, eyes: .1, front: [.5, .3], back: [.3, .2] });
  c.restore();
  const hx = x + f * s * 20, hy = y - s * 570;
  if (!hood) { c.beginPath(); c.arc(hx, hy, s * 84, Math.PI * 1.05, Math.PI * 1.95); c.lineWidth = 30 * s; c.strokeStyle = '#E8E8EE'; c.stroke(); }
  line(c, [[hx + f * s * 10, hy + s * 40], [hx + f * s * 50, hy + s * 44]], 4 * s, 'rgba(255,255,255,.5)', null);
  line(c, [[x + f * s * 110, y - s * 330], [x + f * s * 130, y]], 10 * s, '#6B4A30', null);
}

SC.j1 = (c, lt, gt) => {
  const busX = lerp(400, 1400, eo(pr(gt, L(0) + 2.2, L(0) + 4.5)));
  c.save(); cam(c, 540, 1050, 1.05);
  dayStreet(c, gt);
  busStop(c, 860, 1380);
  bus(c, busX - 600, 1400);
  const run = gt < L(0) + 4.5;
  hero(c, { x: run ? lerp(-100, 380, pr(gt, L(0) + .5, L(0) + 4)) : 380, y: 1400, s: .7, f: 1, t: gt, walk: run ? gt * 12 : undefined, mouthO: !run });
  if (gt > CUE.find - .5) remote(c, 520, 1370, .6 * pop(gt, CUE.find), true);
  c.restore();
  dayCard(c, gt, L(0) - .3, 'JOUR 1', 'UNE JOURNÉE NORMALE');
};
SC.j2 = (c, lt, gt) => {
  const frozen = gt > CUE.press1 && gt < CUE.unpress;
  const boarded = gt > L(4) + .4;
  c.save(); cam(c, 540, 1050, 1.05);
  dayStreet(c, frozen ? 0 : gt, { clouds: true });
  busStop(c, 860, 1380);
  const bx = gt < CUE.press1 ? lerp(-120, -60, pr(gt, L(2), CUE.press1)) : gt < CUE.unpress ? -60 : lerp(-60, 900, eo(pr(gt, CUE.unpress, CUE.unpress + 2.5)));
  bus(c, bx, 1400);
  for (let i = 0; i < 4; i++) { const x = 180 + i * 160, y = 420 + Math.sin(i) * 40; line(c, [[x - 30, y], [x, y + 16], [x + 30, y]], 6, '#2A2A2A', null); }
  if (!boarded || gt < CUE.unpress) hero(c, { x: boarded ? lerp(700, 760, pr(gt, L(4) + .4, L(4) + 1.5)) : 560, y: 1400, s: .7, f: -1, t: gt, front: [1.8, .3], mouthO: frozen && !boarded });
  remote(c, 470, 1150, .4, frozen);
  c.restore();
  freezeFx(c, frozen, gt);
  dayCard(c, gt, L(2) - .3, 'JOUR 2', 'LA TÉLÉCOMMANDE');
};
SC.controle = (c, lt, gt) => {
  const frozen = gt > CUE.pause2 && gt < CUE.grade - .4;
  c.save(); cam(c, 540, 1000, 1.05 + lt * .01);
  classroom(c, gt, 'CONTRÔLE DE MATHS');
  [[240, 1180, '#5B8BE0', '#3A2A1A'], [540, 1180, '#E05B8B', '#C98A3A'], [840, 1180, '#5BBF7A', null]].forEach(([x, y, h, hair], i) => { desk(c, x, y); mate(c, x, y + 150, .68, h, hair, 1, { eyes: .1 }); });
  teacher(c, 980, 1330, .8, -1);
  if (frozen) hero(c, { x: lerp(160, 560, pr(gt, CUE.pause2, CUE.pause2 + 3)), y: 1330, s: .74, f: 1, t: gt, walk: gt * 6 });
  else hero(c, { x: 160, y: 1330, s: .74, f: 1, t: gt, eyes: gt > CUE.grade ? .8 : .3 });
  c.restore();
  freezeFx(c, frozen, gt);
  const g = pop(gt, CUE.grade);
  if (g) { c.save(); c.translate(540, 260); c.rotate(-.06); c.scale(g, g); rr(c, -170, -90, 340, 180, 16); fs(c, '#fff', 6); text(c, '20/20', 0, 6, '700 120px Oswald', '#E53935'); c.restore(); }
};
SC.j3 = (c, lt, gt) => {
  const juice = gt > L(9) + 1.2;
  c.save(); cam(c, 540, 1000, 1.05);
  classroom(c, gt, 'HISTOIRE');
  desk(c, 400, 1180); mate(c, 400, 1330, .68, '#5B8BE0', '#3A2A1A', 1, { eyes: gt > L(8) + 3 ? .9 : .1, smile: false });
  if (gt > L(8) + 2) { c.setLineDash([10, 8]); line(c, [[380, 1320], [460, 1240]], 6, '#fff', null); c.setLineDash([]); }
  teacher(c, 860, 1330, .8, -1);
  rr(c, 760, 960, 70, 90, 10); fs(c, juice ? '#FFA62B' : '#6B4A30', 5);
  [[150, '#E05B8B', '#C98A3A'], [620, '#5BBF7A', null]].forEach(([x, h, hair]) => mate(c, x, 1330, .64, h, hair, 1, { smile: juice, eyes: juice ? .5 : .1 }));
  hero(c, { x: 560, y: 1340, s: .72, f: 1, t: gt, mouthO: juice });
  c.restore();
  if (juice) badge(c, 540, 280, pop(gt, L(9) + 1.2), 'MDR', '#2EAD5B');
  dayCard(c, gt, L(8) - .3, 'JOUR 3', 'LE ROI DES BLAGUES');
};
SC.j4 = (c, lt, gt) => {
  c.save(); cam(c, 540, 900, 1.15);
  c.fillStyle = '#E8EEF2'; c.fillRect(-300, -300, 1700, 2600);
  rr(c, 250, 300, 580, 700, 20); fs(c, '#BFD7E6', 10, '#9AA0AE');
  c.save(); rr(c, 260, 310, 560, 680, 16); c.clip();
  hero(c, { x: 540, y: 1560, s: 1.4, f: 1, t: gt, eyes: gt > CUE.mirror ? .9 : .2 });
  if (gt > CUE.mirror) { c.beginPath(); c.arc(572, 760, 110, Math.PI * 1.2, Math.PI * 1.55); c.lineWidth = 26; c.strokeStyle = '#F4F4F8'; c.stroke(); }
  c.restore();
  c.fillStyle = '#D9C49A'; c.fillRect(-300, 1050, 1700, 900);
  c.restore();
  const w = pop(gt, CUE.watch);
  if (w) card(c, 540, 1300, w * .9, 'TA MONTRE', '+6 H', (p, x, y) => { circ(p, x, y, 46); fs(p, '#fff', 6); line(p, [[x, y], [x, y - 30]], 6, OL, null); line(p, [[x, y], [x + 24, y + 10]], 6, OL, null); }, '#E53935', '', 0);
  dayCard(c, gt, L(10) - .3, 'JOUR 4', 'UN DÉTAIL BIZARRE');
};
SC.j5 = (c, lt, gt) => {
  const near = eo(pr(gt, CUE.move, CUE.move + 3)), hood = gt < CUE.reveal;
  c.save(); cam(c, lerp(540, 700, near), lerp(1050, 950, near), lerp(1.05, 1.35, near));
  dayStreet(c, 0, { clouds: true });
  mate(c, 200, 1420, .6, '#E05B8B', '#C98A3A', 1, { walk: .8 });
  mate(c, 980, 1440, .6, '#5BBF7A', null, -1, { walk: -.8 });
  hero(c, { x: 480, y: 1420, s: .7, f: 1, t: gt, eyes: gt > CUE.move ? 1 : .2 });
  if (gt > CUE.move - .6) oldMe(c, lerp(1250, 820, near), 1420, .74, -1, hood, gt);
  c.restore();
  freezeFx(c, true, gt);
  dayCard(c, gt, L(12) - .3, 'JOUR 5', 'QUELQU\'UN D\'AUTRE');
};
SC.fin = (c, lt, gt) => {
  c.save(); cam(c, 700, 900, 1.5 + lt * .02);
  dayStreet(c, 0, { clouds: true });
  hero(c, { x: 480, y: 1420, s: .7, f: 1, t: gt, eyes: 1 });
  oldMe(c, 820, 1420, .74, -1, false, gt);
  remote(c, 690, 1150, .5, false);
  c.restore();
  freezeFx(c, true, gt);
  endAsk(c, gt, CUE.endcard, 'LE BOUTON PAUSE', 'TU L\'AURAIS UTILISÉE ?');
};
function hud() {}
