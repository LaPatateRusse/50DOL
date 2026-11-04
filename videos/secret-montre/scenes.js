// Le secret de sa montre — format « Le secret de… », style cinéma (cinema.js + cinema-rig.js). Histoire originale.
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const MAL = '#2E9A6A', MAL2 = '#237A52', POMP = '#2A3A5A', POMP2 = '#1E2C46', M1 = '#E05B8B', M2 = '#F2A31B';

const curlHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); c.fillStyle = '#1A1210';
  for (let i = 0; i < 8; i++) { const a = Math.PI * (1.0 + i * .143); circ(c, Math.cos(a) * r * .92, Math.sin(a) * r * .92, r * .25); c.fill(); } c.restore(); };
const shortHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .05, r * 1.03, Math.PI * 1.08, Math.PI * 1.92); c.quadraticCurveTo(r * .3, -r * .82, -r * .9, -r * .45); c.closePath(); fs(c, '#5A3A22', 0); c.restore(); };
const capHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .1, r * 1.03, Math.PI * 1.02, Math.PI * 1.98); c.closePath(); fs(c, '#D83A3A', 0); rr(c, r * .2, -r * .45, r * 1.05, r * .2, r * .1); fs(c, '#B02828', 0); c.restore(); };
const helmetHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .1, r * 1.12, Math.PI * .95, Math.PI * 2.05); c.closePath(); fs(c, '#E8C63A', 0); rr(c, -r * 1.3, -r * .2, r * 2.6, r * .2, r * .1); fs(c, '#C9A82A', 0); c.restore(); };

// ---------- accessoires ----------
function watch(p, x, y, s, gt, o = {}) {
  p.save(); p.translate(x, y); p.scale(s, s);
  rr(p, -60, -170, 120, 340, 20); fs(p, '#5A3E2A', 0);
  circ(p, 0, 0, 110); fs(p, '#C9CED8', 0); circ(p, 0, 0, 92); fs(p, '#FBF6EA', 0);
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; line(p, [[Math.sin(a) * 74, -Math.cos(a) * 74], [Math.sin(a) * 86, -Math.cos(a) * 86]], i % 3 ? 3 : 6, '#3A3A48', null); }
  const run = o.run, sec = run ? gt * 6.28 / 60 * 6 : (47 / 60) * 6.28, hr = (4 + 47 / 60) / 12 * 6.28, mn = 47 / 60 * 6.28;
  line(p, [[0, 0], [Math.sin(hr) * 46, -Math.cos(hr) * 46]], 9, '#1A1A20', null);
  line(p, [[0, 0], [Math.sin(mn) * 70, -Math.cos(mn) * 70]], 6, '#1A1A20', null);
  line(p, [[0, 0], [Math.sin(sec) * 78, -Math.cos(sec) * 78]], 2.5, '#E53935', null);
  circ(p, 0, 0, 7); fs(p, '#1A1A20', 0);
  if (o.crack) line(p, [[-60, -40], [-10, 10], [30, -5], [70, 50]], 3, 'rgba(90,100,120,.7)', null);
  p.restore();
}
const wristWatch = (q, x, y) => { rr(q, x - 26, y - 14, 52, 28, 8); fs(q, '#5A3E2A', 0); circ(q, x, y, 18); fs(q, '#FBF6EA', 3, '#C9CED8'); };

// ---------- décors ----------
function classroom(p, gt) {
  p.fillStyle = grad(p, 0, 780, ['#D8E4EC', '#C4D2DC']); p.fillRect(-400, -200, 2800, 1000);
  rr(p, 380, 120, 1160, 360, 10); fs(p, '#2F4A3A', 14, '#8A6A3A'); text(p, 'Les incendies', 960, 220, '700 56px Montserrat', 'rgba(255,255,255,.85)');
  text(p, '1. Ramper sous la fumée', 960, 320, '700 40px Montserrat', 'rgba(255,255,255,.7)'); text(p, '2. Fermer les portes', 960, 390, '700 40px Montserrat', 'rgba(255,255,255,.7)');
  circ(p, 200, 300, 70); fs(p, '#FFFFFF', 8, '#3A3A48'); line(p, [[200, 300], [200, 250]], 6, '#1A1A20', null); line(p, [[200, 300], [235, 310]], 6, '#1A1A20', null);
  p.fillStyle = '#9A8A70'; p.fillRect(-400, 780, 2800, 500);
}
function chair(p, x, y) { rr(p, x - 55, y - 140, 110, 16, 5); fs(p, '#5A8AC8', 0); line(p, [[x - 45, y - 124], [x - 45, y]], 9, '#5A6478', null); line(p, [[x + 45, y - 124], [x + 45, y]], 9, '#5A6478', null); }
function desk(p, x, y) { rr(p, x - 160, y - 150, 320, 26, 6); fs(p, '#C99A5A', 0); line(p, [[x - 130, y - 124], [x - 130, y]], 12, '#5A6478', null); line(p, [[x + 130, y - 124], [x + 130, y]], 12, '#5A6478', null); }
function smokeStairs(p, gt) {
  p.fillStyle = grad(p, 0, 1080, ['#2A1A14', '#4A2A1A']); p.fillRect(-400, -200, 2800, 1400);
  for (let i = 0; i < 9; i++) { rr(p, -200 + i * 220, 820 - i * 90, 400, 90, 2); fs(p, '#3A2A22', 0); }
  glow(p, 1600, 300, 600, 'rgba(255,120,40,A)', .5 + .15 * Math.sin(gt * 9));
  for (let i = 0; i < 12; i++) { const x = (i * 263 + gt * 40) % 2400 - 300, y = (i * 131) % 700 + 100; p.beginPath(); p.ellipse(x, y, 260, 120, 0, 0, Math.PI * 2); fs(p, 'rgba(60,50,50,.35)', 0); }
}
function outside(p, gt) {
  p.fillStyle = grad(p, 0, 700, ['#F2A86A', '#F7D79A']); p.fillRect(-400, -200, 2800, 900);
  rr(p, 1100, 120, 600, 660, 6); fs(p, '#5A4A44', 0); for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) { rr(p, 1150 + i * 190, 170 + j * 150, 110, 90, 4); fs(p, j < 2 ? '#2A1A14' : '#F7C88A', 0); }
  for (let i = 0; i < 5; i++) { const y = 140 - ((gt * 30 + i * 60) % 300); p.beginPath(); p.ellipse(1400 + Math.sin(i) * 80, y, 160, 70, 0, 0, Math.PI * 2); fs(p, 'rgba(80,70,70,.5)', 0); }
  rr(p, 100, 560, 820, 220, 20); fs(p, '#D83A3A', 0); rr(p, 680, 470, 240, 120, 16); fs(p, '#D83A3A', 0); rr(p, 700, 490, 200, 70, 8); fs(p, '#BFE3F7', 0);
  [260, 760].forEach(x => { circ(p, x, 790, 60); fs(p, '#1A1A22', 0); }); line(p, [[160, 540], [640, 400]], 18, '#C9CED8', null);
  p.fillStyle = '#9A9488'; p.fillRect(-400, 780, 2800, 500);
}
function finCard(c, gt, t0, q) {
  const k = pr(gt, t0, t0 + .2); if (k <= 0) return;
  stage(c, p => {
    p.fillStyle = `rgba(5,6,10,${k})`; p.fillRect(0, 0, SW, SH);
    const b = pop(gt, t0 + .15, .45), qq = clamp((gt - t0 - .8) * 3);
    if (b) { p.save(); p.translate(SW / 2, 430); p.scale(b, b); text(p, 'FIN', 0, 0, '900 190px Montserrat', '#F5B82E'); p.restore(); }
    if (qq > 0) { p.globalAlpha = qq; text(p, q, SW / 2, 700, '800 58px Montserrat', '#FFFFFF'); text(p, 'Dis-le en commentaire', SW / 2, 790, '700 38px Montserrat', '#9AA2BC'); }
  }, { vig: .3 });
}

// ---------- HUD ----------
function hud(c, gt) {
  const flash = gt >= L(5) && gt < L(7);
  cinemaHud(c, gt, { part: 'Le secret de sa montre', off: gt > CUE.endcard, day: gt < L(1) || flash ? undefined : gt < L(3) ? 1 : 3, dayAt: gt < L(3) ? L(1) : L(3),
    val: flash ? 'IL Y A 6 ANS' : 'MONTRE : 16:47', neg: flash, bump: flash ? L(5) : undefined });
}

const malik = (p, x, y, o = {}) => rig(p, { x, y, s: o.s || .5, f: o.f || 1, t: o.t, pose: o.pose, seat: o.seat, walk: o.walk, col: MAL, col2: MAL2, hair: curlHair, e: o.e || 'n', mouth: o.mouth, look: o.look, lookY: o.lookY, armF: o.armF, armB: o.armB, holdF: o.holdF || wristWatch, seed: 4, light: o.light ?? 1 });
const pomp = (p, x, y, o = {}) => rig(p, { x, y, s: o.s || .62, f: o.f || 1, t: o.t, pose: o.pose, walk: o.walk, col: POMP, col2: POMP2, pants: '#1E2C46', hair: o.helmet ? helmetHair : shortHair, patch: '#E8C63A', e: o.e || 'n', mouth: o.mouth, talk: o.talk, look: o.look, lookY: o.lookY, armF: o.armF, armB: o.armB, holdF: o.holdF, seed: 7, light: o.light ?? 1 });
const bMalik = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, col: MAL, col2: MAL2, hair: curlHair, seed: 4, light: 1, ...o });
const bPomp = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, col: POMP, col2: POMP2, hair: shortHair, seed: 7, light: 1, ...o });

// ---------- scènes ----------
SC.flash = (c, lt, gt) => {
  film(c, gt, p => {
    p.fillStyle = grad(p, 0, 1080, ['#2A2420', '#0E0C0A']); p.fillRect(0, 0, SW, SH); glow(p, 960, 520, 650, 'rgba(255,220,170,A)', .3);
    p.save(); cam2(p, 960, 540, push(lt, 1.0, 1.3, 3.5)); watch(p, 960, 540, 3.2, gt, { crack: true }); p.restore();
  });
};
SC.classe = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'room'], [at(1, .45), 'watch'], [L(2), 'mock'], [at(2, .55), 'malik']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'room') {
      p.save(); cam2(p, 1000 + dx, 600 + dy, push(st, 1.1, 1.2, 3)); classroom(p, gt);
      chair(p, 1100, 835); desk(p, 1000, 835); malik(p, 1100, 835, { t: gt, pose: 'sit', seat: 140 / .5, f: -1, lookY: .5, armF: [1.25, .45], armB: [1.2, .5] });
      [[600, M1, null], [420, M2, capHair]].forEach(([x, col, hair], i) => rig(p, { x, y: 835, s: .5, f: 1, t: gt, col, col2: col, hair, e: 'side', look: 1, seed: 8 + i, light: 1 }));
      p.restore();
    } else if (shot === 'watch') {
      p.save(); cam2(p, 960, 560, 1.1); classroom(p, gt); p.restore(); p.fillStyle = 'rgba(0,0,0,.4)'; p.fillRect(0, 0, SW, SH);
      watch(p, 960, 540, 2.6, gt, { crack: true });
    } else if (shot === 'mock') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); classroom(p, gt); p.restore();
      bust(p, 960, 640, 230, { t: gt, col: M2, col2: M2, hair: capHair, e: 'happy', mouth: 'smile', talk: talking(gt, L(2) + .8, at(2, .5)), look: 1, seed: 9, light: 1 });
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); classroom(p, gt); p.restore();
      bMalik(p, 960, 640, 230, gt, { e: 'n', talk: talking(gt, at(2, .62), E(2)), look: -1 });
    }
  });
};
SC.pompier = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'talk'], [at(3, .55), 'kids'], [CUE.sees - .2, 'sees'], [at(4, .6), 'ask']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'talk') {
      p.save(); cam2(p, 760 + dx, 560 + dy, push(st, 1.05, 1.15, 3)); classroom(p, gt);
      pomp(p, 700, 835, { t: gt, f: 1, e: 'n', talk: true, look: 1, armF: [1.4, .2] });
      p.restore();
    } else if (shot === 'kids') {
      p.save(); cam2(p, 1000 + dx, 600 + dy, push(st, 1.1, 1.2, 3)); classroom(p, gt);
      chair(p, 1100, 835); desk(p, 1000, 835); malik(p, 1100, 835, { t: gt, pose: 'sit', seat: 140 / .5, f: -1, look: -1, armF: [1.25, .45], armB: [1.2, .5] });
      p.restore();
    } else if (shot === 'sees') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 2)); classroom(p, gt); p.restore();
      bPomp(p, 960, 640, 230, gt, { e: 'wide', mouth: 'o', look: 1, lookY: .4 });
    } else {
      p.save(); cam2(p, 960 + dx, 600 + dy, push(st, 1.1, 1.2, 3)); classroom(p, gt);
      chair(p, 1150, 835); desk(p, 1050, 835); malik(p, 1150, 835, { t: gt, pose: 'sit', seat: 140 / .5, f: -1, e: 'worried', look: -1, armF: [1.25, .45], armB: [1.2, .5] });
      pomp(p, 760, 835, { t: gt, f: 1, e: 'wide', talk: true, look: 1, armF: [1.5, .1] });
      p.restore();
    }
  });
};
SC.souvenir = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'malik'], [CUE.fire - .2, 'fire'], [CUE.carry - .3, 'carry'], [at(5, .78), 'tick'], [L(6), 'count'], [CUE.out - .8, 'out']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, 1.3);
    if (shot === 'malik') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); classroom(p, gt); p.restore();
      bMalik(p, 960, 640, 230, gt, { e: 'sad', lookY: .5, talk: true });
    } else if (shot === 'fire' || shot === 'carry') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.1, 1.2, 3)); smokeStairs(p, gt);
      if (shot === 'carry') {
        pomp(p, 900, 835 - 90, { t: gt, pose: 'walk', walk: gt * 5, f: -1, helmet: true, e: 'n', look: -1, armF: [1.2, .9], armB: [1.1, 1.0], light: 1 });
        p.save(); p.translate(830, 560); p.rotate(-1.2); rig(p, { x: 0, y: 0, s: .3, f: 1, t: gt, col: MAL, col2: MAL2, hair: curlHair, e: 'closed', blink: false, seed: 4 }); p.restore();
      }
      p.restore();
      p.fillStyle = 'rgba(255,140,60,.08)'; p.fillRect(0, 0, SW, SH);
    } else if (shot === 'tick' || shot === 'count') {
      p.fillStyle = '#140C08'; p.fillRect(0, 0, SW, SH); glow(p, 960, 540, 600, 'rgba(255,140,60,A)', .3);
      p.save(); cam2(p, 960, 540, push(st, 1, 1.15, 3)); watch(p, 960, 540, 3, gt, { run: true }); p.restore();
    } else {
      p.save(); cam2(p, 760 + dx, 600 + dy, push(st, 1.05, 1.15, 3)); outside(p, gt);
      pomp(p, 1000, 835, { t: gt, f: -1, helmet: true, e: 'happy', look: -1, armF: [1.0, .8] });
      rig(p, { x: 840, y: 835, s: .32, f: 1, t: gt, col: MAL, col2: MAL2, hair: curlHair, e: 'n', look: 1, lookY: -.3, armF: [.9, .7], holdF: wristWatch, seed: 4, light: 1 });
      p.restore();
    }
  });
};
SC.fin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'kneel'], [at(7, .5), 'pface'], [L(8), 'give'], [CUE.close - .3, 'hands'], [L(9), 'malik']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'kneel' || shot === 'give') {
      p.save(); cam2(p, 960 + dx, 620 + dy, push(st, 1.1, 1.2, 3)); classroom(p, gt);
      malik(p, 1100, 835, { t: gt, f: -1, e: shot === 'give' ? 'sad' : 'wide', look: -1, armF: shot === 'give' ? [1.4, .1] : undefined });
      pomp(p, 800, 835, { t: gt, pose: 'kneel', f: 1, e: 'sad', look: 1, talk: shot === 'kneel' && talking(gt, at(7, .45), E(7)) });
      p.restore();
    } else if (shot === 'pface') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); classroom(p, gt); p.restore();
      bPomp(p, 960, 640, 230, gt, { e: 'sad', talk: true, look: 1 });
      [-1, 1].forEach(k => { circ(p, 960 + k * 40 + 0, 660, 6); fs(p, 'rgba(160,200,255,.9)', 0); });
    } else if (shot === 'hands') {
      p.save(); cam2(p, 960, 560, 1.1); classroom(p, gt); p.restore(); p.fillStyle = 'rgba(0,0,0,.4)'; p.fillRect(0, 0, SW, SH);
      watch(p, 960, 560, 2.2, gt, { crack: true });
      const k = clamp((gt - CUE.close) / 1.2);
      hand(p, lerp(400, 700, k), 600, 1.1, 0, { sleeve: POMP, cuff: POMP2, open: true });
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); classroom(p, gt); p.restore();
      bMalik(p, 960, 640, 230, gt, { e: 'happy', mouth: 'smile' });
    }
  });
  finCard(c, gt, CUE.endcard, 'Et toi, tu l\'aurais deviné ?');
};
