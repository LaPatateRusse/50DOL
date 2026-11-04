// Le secret de son goûter — format « Le secret de… », style cinéma (cinema.js + cinema-rig.js). Histoire originale.
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const LENA = '#9B6BD6', LENA2 = '#8458BE', PAPY = '#8A6A4A', PAPY2 = '#6E5238', M1 = '#E05B8B', M2 = '#5BBF7A';

const lenaHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); c.fillStyle = '#2A1A12';
  c.beginPath(); c.arc(0, 0, r * 1.07, Math.PI * .95, Math.PI * 2.05); c.quadraticCurveTo(r * .4, -r * .62, -r * .1, -r * .6); c.quadraticCurveTo(-r * .8, -r * .5, -r * 1.07, 0); c.closePath(); c.fill();
  c.beginPath(); c.ellipse(-r * 1.0, r * .35, r * .22, r * .55, .15, 0, Math.PI * 2); c.fill(); c.beginPath(); c.ellipse(r * 1.0, r * .35, r * .22, r * .55, -.15, 0, Math.PI * 2); c.fill(); c.restore(); };
const kidHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .05, r * 1.04, Math.PI * 1.05, Math.PI * 1.95); c.quadraticCurveTo(r * .5, -r * .7, 0, -r * .62); c.quadraticCurveTo(-r * .6, -r * .72, -r * 1.0, -r * .3); c.closePath(); fs(c, '#4A2E1E', 0); c.restore(); };
const capHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .1, r * 1.03, Math.PI * 1.02, Math.PI * 1.98); c.closePath(); fs(c, '#D83A3A', 0); rr(c, r * .2, -r * .45, r * 1.05, r * .2, r * .1); fs(c, '#B02828', 0); c.restore(); };
const papyHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); c.strokeStyle = '#D6D6DE'; c.lineCap = 'round'; c.lineWidth = r * .13;
  c.beginPath(); c.arc(0, 0, r * .97, Math.PI * .98, Math.PI * 1.28); c.stroke(); c.beginPath(); c.arc(0, 0, r * .97, -Math.PI * .28, Math.PI * .02); c.stroke();
  rr(c, r * .02, r * .3, r * .5, r * .13, r * .06); fs(c, '#E6E6EC', 0); c.restore(); };

// ---------- accessoires ----------
function croissant(q, x, y, s = 1) { // pain au chocolat
  q.save(); q.translate(x, y); q.scale(s, s);
  rr(q, -70, -32, 140, 64, 18); fs(q, '#D99A3E', 0); rr(q, -70, -32, 140, 22, 12); fs(q, '#E8B45A', 0);
  [-30, 30].forEach(dx => { rr(q, dx - 10, -34, 20, 68, 6); fs(q, '#5A3420', 0); }); q.restore();
}
function backpack(q, x, y, s = 1, open = 0) {
  q.save(); q.translate(x, y); q.scale(s, s);
  rr(q, -110, -150, 220, 280, 40); fs(q, '#3A6EA5', 0); rr(q, -80, 20, 160, 90, 20); fs(q, '#2E5A8A', 0);
  if (open) { croissant(q, 0, -150 - open * 40, 1); }
  rr(q, -110, -150, 220, 50, [40, 40, 0, 0]); fs(q, '#2E5A8A', 0); q.restore();
}
function armchair(p, x, y, s = 1) {
  p.save(); p.translate(x, y); p.scale(s, s);
  rr(p, -150, -330, 300, 250, 50); fs(p, '#5B8A9A', 0); rr(p, -170, -160, 340, 120, 30); fs(p, '#4A7A8A', 0);
  rr(p, -190, -220, 60, 190, 26); fs(p, '#6A9AAA', 0); rr(p, 130, -220, 60, 190, 26); fs(p, '#6A9AAA', 0); p.restore();
}

// ---------- décors ----------
function yard(p, gt) {
  p.fillStyle = grad(p, 0, 600, ['#9ED0EE', '#D2ECF6']); p.fillRect(-400, -200, 2800, 900);
  rr(p, -300, 220, 2600, 440, 6); fs(p, '#E8C9A0', 0); for (let i = 0; i < 10; i++) { rr(p, -200 + i * 260, 300, 160, 140, 6); fs(p, '#BFE3F7', 8, '#FFFFFF'); }
  p.fillStyle = '#B8B2A6'; p.fillRect(-400, 660, 2800, 700);
  rr(p, 300, 700, 500, 30, 8); fs(p, '#6B4A30', 0); rr(p, 320, 730, 24, 100, 4); fs(p, '#5A3E28', 0); rr(p, 756, 730, 24, 100, 4); fs(p, '#5A3E28', 0);
}
function street(p, gt) {
  p.fillStyle = grad(p, 0, 700, ['#F2B07A', '#F7D8A8']); p.fillRect(-400, -200, 2800, 1000);
  rr(p, 900, 180, 900, 600, 6); fs(p, '#EDE4D4', 0); for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { rr(p, 960 + i * 280, 240 + j * 200, 160, 130, 6); fs(p, '#F7D79A', 6, '#FFFFFF'); }
  rr(p, 1240, 560, 220, 220, 6); fs(p, '#7A5A3A', 0); rr(p, 1050, 470, 600, 70, 10); fs(p, '#3A6EA5', 0); text(p, 'RÉSIDENCE LES TILLEULS', 1350, 508, '800 30px Montserrat', '#FFFFFF');
  for (let i = 0; i < 4; i++) { rr(p, -200 + i * 280, 380, 30, 400, 6); fs(p, '#5A3E2A', 0); circ(p, -185 + i * 280, 360, 120); fs(p, '#5E8A4A', 0); }
  p.fillStyle = '#9A9488'; p.fillRect(-400, 780, 2800, 500);
}
function room(p, gt) {
  p.fillStyle = grad(p, 0, 780, ['#EAE0CC', '#D9CCB4']); p.fillRect(-400, -200, 2800, 1100);
  rr(p, 1150, 140, 520, 460, 6); fs(p, '#F7C88A', 14, '#FFFFFF'); glow(p, 1410, 370, 500, 'rgba(255,210,140,A)', .45); line(p, [[1410, 140], [1410, 600]], 12, '#FFFFFF', null);
  cone(p, 1410, 600, 520, 900, 300, 'rgba(255,220,160,A)', .18);
  frame(p, 300, 200, 220, 170, q => { croissant(q, 410, 290, .7); });
  p.fillStyle = '#A89478'; p.fillRect(-400, 780, 2800, 500);
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
  const day = gt < L(1) ? undefined : gt < L(3) ? 1 : gt < L(9) ? 3 : 4;
  const m = gt > CUE.note ? 10 : gt > CUE.lit ? 5 : 0;
  cinemaHud(c, gt, { part: 'Le secret de son goûter', off: gt > CUE.endcard, day, dayAt: day === 3 ? L(3) : day === 4 ? L(9) : L(1),
    val: gt < L(4) ? 'GOÛTERS CACHÉS : ' + (day || 3) : 'SOUVENIR : ' + m + ' MIN', neg: gt >= L(4) && m === 0, bump: m === 10 ? CUE.note : m === 5 ? CUE.lit : undefined });
}

const lena = (p, x, y, o = {}) => rig(p, { x, y, s: o.s || .5, f: o.f || 1, t: o.t, pose: o.pose, seat: o.seat, walk: o.walk, col: LENA, col2: LENA2, hair: lenaHair, e: o.e || 'n', mouth: o.mouth, look: o.look, lookY: o.lookY, armF: o.armF, armB: o.armB, holdF: o.holdF, seed: 3, light: o.light ?? 1 });
const papy = (p, x, y, o = {}) => rig(p, { x, y, s: .6, f: o.f || 1, t: o.t, pose: 'sit', seat: 200 / .6, col: PAPY, col2: PAPY2, pants: '#3A3A44', hair: papyHair, e: o.e || 'n', mouth: o.mouth, look: o.look, lookY: o.lookY, armF: o.armF || [.75, .85], armB: o.armB || [.75, .85], holdF: o.holdF, seed: 6, light: 1 });
const bustLena = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, col: LENA, col2: LENA2, hair: lenaHair, seed: 3, light: 1, ...o });
const bustPapy = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, col: PAPY, col2: PAPY2, hair: papyHair, seed: 6, light: 1, ...o });

// ---------- scènes ----------
SC.flash = (c, lt, gt) => {
  film(c, gt, p => {
    p.fillStyle = grad(p, 0, 1080, ['#2A2420', '#0E0C0A']); p.fillRect(0, 0, SW, SH); glow(p, 960, 520, 650, 'rgba(255,220,170,A)', .3);
    p.save(); cam2(p, 960, 560, push(lt, 1.05, 1.25, 3));
    backpack(p, 960, 700, 1.4, 1 - clamp(lt / 2.2));
    hand(p, 700, 380 + clamp(lt / 2.2) * 200, .8, .4, { sleeve: LENA, cuff: LENA2 });
    p.restore();
  });
};
SC.ecole = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'bench'], [at(1, .5), 'bag'], [L(2), 'mock'], [at(2, .45), 'mock2'], [at(2, .78), 'me']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'bench') {
      p.save(); cam2(p, 760 + dx, 560 + dy, push(st, 1.1, 1.2, 3)); yard(p, gt);
      lena(p, 560, 835, { t: gt, pose: 'sit', seat: 140 / .5, f: 1, e: 'n', lookY: .4, armF: [.75, .85], armB: [.75, .85] });
      [[1200, M1, null], [1400, M2, capHair]].forEach(([x, col, hair], i) => rig(p, { x, y: 835, s: .5, f: -1, t: gt, col, col2: col, hair, e: 'happy', mouth: 'smile', look: -1, seed: 7 + i, armF: [1.3, .4], holdF: (q, xx, yy) => croissant(q, xx + 20, yy, .6), light: 1 }));
      p.restore();
    } else if (shot === 'bag') {
      p.save(); cam2(p, 960, 560, 1.1); yard(p, gt); p.restore(); p.fillStyle = 'rgba(0,0,0,.35)'; p.fillRect(0, 0, SW, SH);
      backpack(p, 960, 700, 1.4, 1 - clamp((gt - CUE.hide + 1) / 1));
      hand(p, 700, 380 + clamp((gt - CUE.hide + 1) / 1) * 200, .8, .4, { sleeve: LENA, cuff: LENA2 });
    } else if (shot === 'mock' || shot === 'mock2') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); yard(p, gt); p.restore();
      const m = shot === 'mock';
      bust(p, 960, 640, 230, { t: gt, col: m ? M1 : M2, col2: m ? M1 : M2, hair: m ? undefined : capHair, e: 'happy', mouth: 'smile', talk: true, seed: m ? 7 : 8, light: 1, look: m ? 1 : -1 });
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); yard(p, gt); p.restore();
      bust(p, 960, 640, 230, { t: gt, hair: kidHair, e: 'n', look: -1, seed: 2, light: 1 });
    }
  });
};
SC.rue = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'follow'], [at(3, .55), 'door']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    p.save(); cam2(p, (shot === 'door' ? 1300 : 900) + dx, 560 + dy, push(st, 1.05, 1.18, 3)); street(p, gt);
    if (shot === 'follow') {
      lena(p, 900 + st * 90, 835, { t: gt, pose: 'walk', walk: gt * 7, f: 1, e: 'n' });
      rig(p, { x: 380 + st * 80, y: 835, s: .5, f: 1, t: gt, pose: 'walk', walk: gt * 7 + 1, hair: kidHair, e: 'n', look: 1, seed: 2, light: 1 });
    } else {
      const k = clamp((gt - CUE.enter + .8) / 1.2);
      p.save(); p.globalAlpha = 1 - k * .9; lena(p, lerp(1200, 1350, k), 835, { t: gt, pose: 'walk', walk: gt * 7, f: 1, e: 'n' }); p.restore();
      rig(p, { x: 800, y: 835, s: .5, f: 1, t: gt, hair: kidHair, e: 'wide', look: 1, seed: 2, light: 1 });
    }
    p.restore();
  });
};
SC.chambre = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'room'], [at(4, .6), 'papy'], [L(5), 'give'], [CUE.lit - .3, 'lit'], [L(6), 'papy2'], [at(6, .55), 'lena'], [L(7), 'room2'], [CUE.forgot - .2, 'forgot']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'room' || shot === 'give' || shot === 'room2') {
      p.save(); cam2(p, 1000 + dx, 560 + dy, push(st, 1.05, 1.15, 3)); room(p, gt);
      armchair(p, 1200, 835, 1);
      const has = shot !== 'room' && gt > CUE.snack;
      papy(p, 1200, 835, { t: gt, f: -1, e: shot === 'room2' ? 'happy' : 'n', mouth: shot === 'room2' ? 'smile' : undefined, look: shot === 'room' ? 1 : -1, lookY: has ? .5 : 0, holdF: has ? (q, x, y) => croissant(q, x, y - 10, .7) : undefined });
      lena(p, shot === 'room' ? 560 : 860, 835, { t: gt, f: 1, e: shot === 'room2' ? 'happy' : 'n', mouth: shot === 'room2' ? 'smile' : undefined, look: 1, armF: shot === 'give' && !has ? [1.4, .1] : undefined, holdF: shot === 'give' && !has ? (q, x, y) => croissant(q, x + 20, y, .7) : undefined });
      p.restore();
    } else if (shot === 'papy' || shot === 'lit' || shot === 'papy2') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); room(p, gt); p.restore();
      const on = shot !== 'papy';
      if (on) glow(p, 960, 560, 500, 'rgba(255,220,160,A)', .3);
      bustPapy(p, 960, 640, 230, gt, { e: on ? (shot === 'lit' ? 'wide' : 'happy') : 'n', mouth: shot === 'lit' ? 'o' : undefined, look: on ? 0 : 1, talk: shot === 'papy2' || (shot === 'papy' && talking(gt, at(4, .75), E(4))) });
    } else if (shot === 'lena') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); room(p, gt); p.restore();
      bustLena(p, 960, 640, 230, gt, { e: 'happy', mouth: 'smile' });
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); room(p, gt); p.restore();
      bustPapy(p, 960, 640, 230, gt, { e: 'n', look: 1, lookY: -.1 });
    }
  });
};
SC.fin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'me'], [at(8, .5), 'lenaface'], [L(9), 'bag'], [at(9, .62), 'note'], [L(10), 'lenaface']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'me') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); street(p, gt); p.restore();
      bust(p, 960, 640, 230, { t: gt, hair: kidHair, e: 'sad', seed: 2, light: 1 });
    } else if (shot === 'lenaface') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); street(p, gt); p.restore();
      bustLena(p, 960, 640, 230, gt, { e: 'happy', mouth: 'smile', look: -1 });
    } else if (shot === 'bag') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.1, 1.2, 3)); yard(p, gt);
      backpack(p, 1150, 830, .6, 0);
      rig(p, { x: 900, y: 835, s: .5, f: 1, t: gt, hair: kidHair, e: 'happy', mouth: 'smile', look: 1, armF: [1.4, .2], holdF: (q, x, y) => croissant(q, x + 20, y, .6), seed: 2, light: 1 });
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, 1.1); yard(p, gt); p.restore(); p.fillStyle = 'rgba(0,0,0,.35)'; p.fillRect(0, 0, SW, SH);
      croissant(p, 760, 600, 2.2);
      const n = pop(gt, CUE.note - .4, .4); if (n) { p.save(); p.translate(1200, 520); p.scale(n, n); p.rotate(.06); rr(p, -230, -110, 460, 220, 6); fs(p, '#FFF6A8', 0);
        text(p, 'Pour demain.', 0, -40, '700 46px Montserrat', '#3A3A48'); text(p, 'Ça fera 10 minutes.', 0, 30, '700 40px Montserrat', '#3A3A48'); p.restore(); }
    }
  });
  finCard(c, gt, CUE.endcard, 'Et toi, tu aurais fait pareil ?');
};
