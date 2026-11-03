// J'entends tes pensées — histoire complète (kits : props.js, horreur.js → hero/kid, quotidien.js).
const EP = { hideSubs: gt => gt > CUE.endcard - .1, subs: { font: '700 84px Oswald', y: 250, stroke: 14, space: 22 } };
const SC = {};
const L = i => LINES[i].start;

// Bulle de pensée (nuage) avec petites bulles vers la tête (hx, hy).
function thought(c, gt, at, x, y, txt, hx, hy, col = '#FFFFFF', ink = '#1d1d22') {
  if (gt < at) return;
  const s = pop(gt, at, .35);
  c.save(); c.font = '800 40px Montserrat';
  const words = txt.split(' '), Ls = []; let cur = '';
  words.forEach(w => { const t = cur ? cur + ' ' + w : w; if (c.measureText(t).width > 520) { Ls.push(cur); cur = w; } else cur = t; }); Ls.push(cur);
  const w = Math.max(...Ls.map(l => c.measureText(l).width)) + 90, h = Ls.length * 52 + 70;
  [[.75, 18], [.5, 12], [.28, 8]].forEach(([k, r]) => { circ(c, lerp(hx, x, k), lerp(hy, y + h / 2, k), r * s); fs(c, col, 0); });
  c.translate(x, y); c.scale(s, s);
  for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; circ(c, Math.cos(a) * w * .42, Math.sin(a) * h * .38, h * .42); fs(c, col, 0); }
  rr(c, -w / 2, -h / 2, w, h, h / 2); fs(c, col, 0);
  Ls.forEach((l, i) => text(c, l, 0, -((Ls.length - 1) * 26) + i * 52 + 4, '800 40px Montserrat', ink));
  c.restore();
}
function balloons(c, t) { [[120, '#E53935'], [300, '#F5C518'], [800, '#2E7BC4'], [960, '#2EAD5B']].forEach(([x, col], i) => { const y = 520 + Math.sin(t * 2 + i) * 14; c.beginPath(); c.ellipse(x, y, 60, 74, 0, 0, Math.PI * 2); fs(c, col, 0); line(c, [[x, y + 74], [x + 10, y + 300]], 3, '#555', null); }); }

SC.j1 = (c, lt, gt) => {
  c.save(); cam(c, 540, 1050, 1.05);
  dayStreet(c, gt);
  const p = pr(gt, L(0) + 1.5, L(0) + 5);
  mate(c, lerp(1100, 100, p), 1420, .72, '#E05B8B', '#C98A3A', -1, { walk: gt * 10 });
  hero(c, { x: 420, y: 1420, s: .74, f: 1, t: gt, eyes: .6, look: 1 });
  if (gt > L(1)) { for (let i = 0; i < 3; i++) { const a = gt * 3 + i * 2.1; circ(c, 450 + Math.cos(a) * 110, 900 + Math.sin(a) * 30, 14); fs(c, '#F5C518', 0); } }
  c.restore();
  dayCard(c, gt, L(0) - .3, 'JOUR 1', 'UNE JOURNÉE NORMALE');
};
SC.j2 = (c, lt, gt) => {
  const inClass = gt > L(3) - .2;
  c.save(); cam(c, 540, 1000, 1.05);
  if (!inClass) {
    dayStreet(c, gt); bus(c, 140, 1420);
    mate(c, 280, 1240, .5, '#3B4A6B', null, 1, { eyes: .1 });
    hero(c, { x: 820, y: 1420, s: .72, f: -1, t: gt, eyes: gt > CUE.think1 + 1 ? 1 : .3 });
  } else {
    classroom(c, gt, 'INTERRO SURPRISE');
    teacher(c, 880, 1330, .82, -1);
    [[200, '#5B8BE0', '#3A2A1A'], [420, '#5BBF7A', null]].forEach(([x, h, hair]) => { desk(c, x, 1180); mate(c, x, 1330, .64, h, hair, 1, { eyes: gt > CUE.hand ? .9 : .1 }); });
    hero(c, { x: 620, y: 1340, s: .72, f: 1, t: gt, front: gt > CUE.hand ? [3.0, .1] : undefined, eyes: .5 });
  }
  c.restore();
  if (!inClass) thought(c, gt, CUE.think1, 400, 760, 'Encore lui… toujours en retard.', 300, 960);
  else thought(c, gt, CUE.think2, 560, 720, 'Question 3 : la réponse, c\'est 1789.', 860, 900);
  dayCard(c, gt, L(2) - .3, 'JOUR 2', 'DES VOIX…');
};
SC.j3 = (c, lt, gt) => {
  c.save(); cam(c, 540, 1050, 1.08);
  dayStreet(c, gt);
  mate(c, 720, 1420, .74, '#E05B8B', '#C98A3A', -1, { eyes: .5, smile: gt > CUE.think4 });
  const leave = gt > L(6) + 1.2;
  hero(c, { x: leave ? lerp(380, -200, pr(gt, L(6) + 1.2, L(6) + 3.5)) : 380, y: 1420, s: .74, f: leave ? -1 : 1, t: gt, walk: leave ? gt * 10 : undefined, eyes: .4 });
  c.restore();
  thought(c, gt, CUE.think3, 640, 760, gt > CUE.think4 ? 'Wow… mystérieux.' : 'Il est mignon… mais il parle trop.', 760, 960);
  dayCard(c, gt, L(5) - .3, 'JOUR 3', 'LE CRUSH');
};
SC.j4 = (c, lt, gt) => {
  const day = gt > L(8) - .2;
  c.save(); cam(c, 540, 1050, 1.05);
  if (!day) {
    brightRoom(c); c.fillStyle = 'rgba(20,24,60,.55)'; c.fillRect(-300, -300, 1700, 2600);
    hero(c, { x: 520, y: 1420, s: .76, f: 1, t: gt, eyes: 1, shake: gt > CUE.noise, front: [2.9, -.6], back: [2.9, -.6] });
  } else {
    dayStreet(c, gt);
    mate(c, 720, 1420, .74, '#5BBF7A', '#3A2A1A', -1, { eyes: gt > CUE.yell ? 1 : .2 });
    hero(c, { x: 380, y: 1420, s: .74, f: 1, t: gt, eyes: gt > CUE.yell ? .2 : .6, mouthO: gt > CUE.yell, shake: gt > CUE.yell && gt < CUE.yell + 1.5 });
  }
  c.restore();
  if (!day) {
    const T = ['J\'ai faim', 'Il est quelle heure ?', 'Mon chat me juge', 'Facture…', 'Bruit bizarre', 'Demain lundi…', 'Encore ce voisin'];
    T.forEach((t, i) => { const at = CUE.noise + i * .35, x = 200 + (i * 331) % 700, y = 560 + (i * 197) % 700; thought(c, gt, at, x, y, t, x, y + 80, 'rgba(255,255,255,.92)'); });
  } else {
    thought(c, gt, CUE.think5, 620, 760, 'Samedi… il ne doit surtout rien savoir.', 760, 960);
    if (gt > CUE.yell) badge(c, 300, 700, pop(gt, CUE.yell), 'TRAÎTRE !', '#E53935');
  }
  dayCard(c, gt, L(7) - .3, 'JOUR 4', 'TROP DE BRUIT');
};
SC.j5 = (c, lt, gt) => {
  const on = gt > CUE.lights;
  c.save(); cam(c, 540, 1050, 1.05);
  brightRoom(c);
  if (on) {
    balloons(c, gt);
    rr(c, 190, 820, 700, 120, 14); fs(c, '#E53935', 0); text(c, 'JOYEUX ANNIV !', 540, 884, '700 74px Oswald', '#fff');
    [[140, '#5B8BE0', '#3A2A1A'], [300, '#E05B8B', '#C98A3A'], [780, '#5BBF7A', '#3A2A1A'], [940, '#F5B82E', null]].forEach(([x, h, hair], i) => mate(c, x, 1440, .66, h, hair, x < 540 ? 1 : -1, { smile: true, eyes: .5, arm: Math.sin(gt * 6 + i) > 0 }));
    for (let i = 0; i < 40; i++) { const x = (i * 97) % 1080, y = ((i * 211 + (gt - CUE.lights) * 500) % 1500); rr(c, x, y, 14, 24, 3); fs(c, ['#E53935', '#F5C518', '#2E7BC4', '#2EAD5B'][i % 4], 0); }
  }
  hero(c, { x: 540, y: 1460, s: .78, f: 1, t: gt, eyes: on ? 1 : .3, mouthO: on });
  c.restore();
  if (!on) { c.fillStyle = 'rgba(10,12,30,.82)'; c.fillRect(0, 0, W, H); }
  dayCard(c, gt, L(10) - .3, 'JOUR 5', 'SAMEDI');
};
SC.fin = (c, lt, gt) => {
  const z = eo(pr(gt, L(12), L(12) + 3));
  c.save(); cam(c, lerp(540, 820, z), lerp(1050, 950, z), lerp(1.05, 1.6, z));
  brightRoom(c); balloons(c, gt);
  hero(c, { x: 400, y: 1460, s: .78, f: 1, t: gt, eyes: gt > CUE.voice ? 1 : .6 });
  mate(c, 860, 1440, .7, '#3A3F4A', '#15151C', -1, { eyes: .25 });
  c.restore();
  c.save(); c.globalCompositeOperation = 'saturation'; c.fillStyle = `rgba(120,120,120,${.9 * z})`; c.fillRect(0, 0, W, H); c.restore();
  if (gt > CUE.silence && gt < CUE.voice) { c.save(); c.globalAlpha = pr(gt, CUE.silence, CUE.silence + .5); rr(c, 640, 640, 380, 120, 60); fs(c, '#fff', 0); text(c, '…', 830, 690, '800 70px Montserrat', '#1d1d22'); c.restore(); }
  if (gt > CUE.voice) { const s = pop(gt, CUE.voice); c.save(); c.translate(540, 900); c.scale(s, s); text(c, '« TOI AUSSI, TU NOUS ENTENDS ? »', 0, 0, '700 64px Oswald', '#FF4B4B', 'center', 10); c.restore(); }
  endAsk(c, gt, CUE.endcard, 'J\'ENTENDS TES PENSÉES', 'QUEL POUVOIR POUR LA PROCHAINE ?');
};
function hud() {}
