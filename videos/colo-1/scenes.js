// La colo — Partie 1 : nouvelle mini-série d'horreur, style cinéma (cinema.js + cinema-rig.js). Histoire originale.
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const SAMI = '#3FA36B', SAMI2 = '#318A58', DIR = '#3A6EA5', DIR2 = '#2E5A8A';

const kidHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .05, r * 1.04, Math.PI * 1.05, Math.PI * 1.95); c.quadraticCurveTo(r * .5, -r * .7, 0, -r * .62); c.quadraticCurveTo(-r * .6, -r * .72, -r * 1.0, -r * .3); c.closePath(); fs(c, '#4A2E1E', 0); c.restore(); };
const curlHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); c.fillStyle = '#1A1210';
  for (let i = 0; i < 7; i++) { const a = Math.PI * (1.05 + i * .15); circ(c, Math.cos(a) * r * .9, Math.sin(a) * r * .9, r * .28); c.fill(); } c.restore(); };
const capHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .1, r * 1.03, Math.PI * 1.02, Math.PI * 1.98); c.closePath(); fs(c, '#D8A23A', 0);
  rr(c, r * .2, -r * .45, r * 1.05, r * .2, r * .1); fs(c, '#B8862A', 0); c.restore(); };

// ---------- décors ----------
function dorm(p, gt, night) {
  p.fillStyle = grad(p, 0, 780, night ? ['#0C0E18', '#12141F'] : ['#C9A27A', '#B48C64']); p.fillRect(-400, -200, 2800, 1100);
  for (let i = 0; i < 20; i++) line(p, [[-400, 40 + i * 40], [2400, 40 + i * 40]], 3, night ? 'rgba(0,0,0,.35)' : 'rgba(90,60,30,.25)', null);
  rr(p, 1640, 160, 260, 220, 6); fs(p, night ? '#1A2440' : '#CDE8F5', 10, night ? '#2A2030' : '#6B4A30'); if (night) glow(p, 1770, 270, 200, 'rgba(160,190,255,A)', .25);
  p.fillStyle = night ? '#0A0B12' : '#7A5A3E'; p.fillRect(-400, 780, 2800, 500);
}
function bunk(p, x, night, heads = [], gt = 0) {
  const wood = night ? '#2A2028' : '#7A5638';
  [x - 230, x + 230].forEach(px => { rr(p, px - 14, 180, 28, 610, 6); fs(p, wood, 0); });
  [470, 730].forEach((y, k) => {
    rr(p, x - 230, y, 460, 40, 8); fs(p, wood, 0); rr(p, x - 216, y - 40, 432, 44, 14); fs(p, night ? '#2A3050' : '#5B8BE0', 0);
    rr(p, x - 210, y - 64, 120, 40, 16); fs(p, night ? '#3A3E52' : '#F4EEE4', 0);
    const h = heads[k]; if (h) head(p, x - 150, y - 70, 34, gt, h);
  });
}
function head(p, x, y, r, gt, o = {}) {
  circ(p, x, y, r); fs(p, SKIN, 0); (o.hair || kidHair)(p, r, [x, y]);
  eyes(p, x + r * .2, y, r, { t: gt, e: o.e || 'closed', blink: false, look: o.look, seed: o.seed || 0 });
}
function lake(p, gt) {
  p.fillStyle = grad(p, 0, 600, ['#8EC8EA', '#D2ECF6']); p.fillRect(-400, -200, 2800, 900);
  for (let i = 0; i < 12; i++) { const x = -300 + i * 210; p.beginPath(); p.moveTo(x, 300 - (i % 3) * 40); p.lineTo(x - 90, 560); p.lineTo(x + 90, 560); p.closePath(); fs(p, i % 2 ? '#3E7A4A' : '#4E8A5A', 0); }
  p.fillStyle = '#4E9AC8'; p.fillRect(-400, 560, 2800, 140);
  for (let i = 0; i < 6; i++) line(p, [[-200 + i * 380 + Math.sin(gt + i) * 20, 600 + (i % 3) * 30], [-80 + i * 380 + Math.sin(gt + i) * 20, 600 + (i % 3) * 30]], 5, 'rgba(255,255,255,.55)', null);
  p.fillStyle = '#7FB25E'; p.fillRect(-400, 700, 2800, 600);
  rr(p, 1150, 360, 620, 420, 6); fs(p, '#8A5A3A', 0); p.beginPath(); p.moveTo(1110, 380); p.lineTo(1460, 200); p.lineTo(1810, 380); p.closePath(); fs(p, '#5A3A2A', 0);
  rr(p, 1400, 560, 130, 220, 6); fs(p, '#5A3A24', 0); rr(p, 1220, 470, 120, 100, 6); fs(p, '#CDE8F5', 6, '#5A3A24');
  text(p, 'CHALET 7', 1460, 430, '800 34px Montserrat', '#F4EEE4');
}
function doorNote(p, gt) {
  p.fillStyle = '#6B4A30'; p.fillRect(-400, -200, 2800, 1400);
  for (let i = 0; i < 12; i++) line(p, [[-300 + i * 200, -200], [-300 + i * 200, 1300]], 6, 'rgba(0,0,0,.25)', null);
  p.save(); p.translate(960, 540); p.rotate(-.03);
  rr(p, -460, -260, 920, 520, 6); fs(p, '#F6F0DC', 0); rr(p, -60, -280, 120, 40, 4); fs(p, 'rgba(220,220,200,.8)', 0);
  text(p, 'À MINUIT,', 0, -130, 'italic 800 64px Montserrat', '#2A2A38');
  text(p, 'SI QUELQU\'UN FAIT L\'APPEL…', 0, -20, 'italic 800 46px Montserrat', '#2A2A38');
  text(p, 'NE RÉPONDS PAS.', 0, 110, 'italic 900 72px Montserrat', '#C0303A');
  p.restore();
}
function torchCone(p, gt, x, y, tx, ty, a = .35) {
  const ang = Math.atan2(ty - y, tx - x), len = Math.hypot(tx - x, ty - y);
  p.save(); p.translate(x, y); p.rotate(ang - Math.PI / 2);
  const g = p.createLinearGradient(0, 0, 0, len); g.addColorStop(0, `rgba(255,240,200,${a})`); g.addColorStop(1, 'rgba(255,240,200,0)');
  p.beginPath(); p.moveTo(-14, 0); p.lineTo(14, 0); p.lineTo(170, len); p.lineTo(-170, len); p.closePath(); p.fillStyle = g; p.fill(); p.restore();
  glow(p, tx, ty, 200, 'rgba(255,240,200,A)', a * .8);
}
function bed13(p, x, y, s, gt, o = {}) {
  p.save(); p.translate(x, y); p.scale(s, s);
  rr(p, -300, -40, 600, 60, 10); fs(p, '#2A2028', 0); rr(p, -300, -120, 30, 160, 6); fs(p, '#2A2028', 0);
  rr(p, -270, -110, 140, 50, 18); fs(p, '#3A3E52', 0);
  const br = 1 + Math.sin(gt * 1.6) * .05;
  p.beginPath(); p.moveTo(-280, -50); p.quadraticCurveTo(-200, -60 - 90 * br, -40, -60 - 70 * br); p.quadraticCurveTo(140, -60 - 80 * br, 280, -50); p.closePath(); fs(p, '#4A3A5A', 0);
  if (o.hand) { circ(p, -150, -78, 22); fs(p, '#ECEAE4', 0); for (let i = 0; i < 4; i++) line(p, [[-150 + i * 9 - 12, -70], [-160 + i * 10 - 12, -36]], 7, '#ECEAE4', null); }
  p.restore();
}

// ---------- HUD ----------
function hud(c, gt) {
  let val = 'ENFANTS : 12', neg = false, bump;
  if (gt < L(1)) { val = 'ENFANTS : 13'; neg = true; }
  else if (gt > L(5) && gt < CUE.thirteen) { const n = Math.min(12, 1 + Math.floor(clamp((gt - L(5)) / (CUE.me + .3 - L(5))) * 12)); val = 'APPEL : ' + n; }
  else if (gt >= CUE.thirteen) { val = 'APPEL : 13'; neg = true; bump = CUE.thirteen; }
  cinemaHud(c, gt, { part: 'La colo', off: gt > CUE.endcard, val, neg, bump });
}

const me = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, hair: kidHair, seed: 2, light: 1, rim: 'rgba(255,226,170,.9)', ...o });
const sami = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, col: SAMI, col2: SAMI2, hair: curlHair, seed: 4, light: -1, rim: 'rgba(255,226,170,.9)', ...o });

// ---------- scènes ----------
SC.flash = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 960, 540, push(lt, 1.0, 1.15, 3.5)); dorm(p, gt, true);
    bunk(p, 600, true, [{}, {}], gt); bunk(p, 1300, true, [{}, { e: 'wide' }], gt);
    torchCone(p, gt, -100, 120, lerp(400, 1150, clamp(lt / 2.5)), 680, .4);
    p.restore();
  });
};
SC.lac = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'lake'], [at(1, .62), 'bunks'], [L(2), 'door'], [L(3), 'laugh'], [at(3, .45), 'dir']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'lake') {
      p.save(); cam2(p, 1100 + dx, 560 + dy, push(st, 1.05, 1.18, 4)); lake(p, gt);
      [[600, '#F2A31B', kidHair], [760, SAMI, curlHair], [900, '#E05B8B', capHair]].forEach(([x, col, hair], i) =>
        rig(p, { x: x + st * 60, y: 835, s: .42, f: 1, t: gt, pose: 'walk', walk: gt * 7 + i, col, col2: col, hair, e: 'happy', seed: 3 + i, light: 1 }));
      p.restore();
    } else if (shot === 'bunks') {
      p.save(); cam2(p, 960 + dx, 540 + dy, push(st, 1.05, 1.12, 3)); dorm(p, gt, false);
      bunk(p, 600, false, [{ e: 'happy' }, { e: 'happy', hair: curlHair }], gt); bunk(p, 1300, false, [{ e: 'happy', hair: capHair }, { e: 'happy' }], gt);
      p.restore();
    } else if (shot === 'door') {
      p.save(); cam2(p, 960, 540, push(st, 1.0, 1.15, 4)); doorNote(p, gt); p.restore();
    } else if (shot === 'laugh') {
      p.save(); cam2(p, 1000 + dx, 560 + dy, 1.2); lake(p, gt);
      rig(p, { x: 1250, y: 835, s: .62, f: -1, t: gt, col: DIR, col2: DIR2, hair: kidHair, e: 'happy', mouth: 'smile', look: -1, armF: [.6, .5] });
      [[620, '#F2A31B', kidHair], [800, SAMI, curlHair], [960, '#E05B8B', capHair]].forEach(([x, col, hair], i) =>
        rig(p, { x, y: 835, s: .42, f: 1, t: gt, col, col2: col, hair, e: 'happy', mouth: 'smile', look: 1, seed: 3 + i, light: 1 }));
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); lake(p, gt);
      bust(p, 960, 640, 230, { t: gt, col: DIR, col2: DIR2, hair: kidHair, e: 'happy', talk: talking(gt, at(3, .45), E(3)), seed: 8, light: 1 });
      p.restore();
    }
  });
};
SC.nuit = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'dark'], [CUE.torch - .3, 'torch'], [L(5), 'count'], [at(5, .62), 'sleepy'], [L(6), 'sami'], [CUE.me - .2, 'me']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, .6);
    if (shot === 'dark') {
      p.save(); cam2(p, 960 + dx, 540 + dy, push(st, 1.05, 1.15, 3)); dorm(p, gt, true);
      bunk(p, 600, true, [{}, {}], gt); bunk(p, 1300, true, [{}, {}], gt);
      p.restore();
    } else if (shot === 'torch') {
      p.save(); cam2(p, 960 + dx, 540 + dy, push(st, 1.1, 1.25, 3));
      p.fillStyle = '#06070C'; p.fillRect(-400, -200, 2800, 1400);
      rr(p, 760, 140, 400, 660, 8); fs(p, '#14121A', 12, '#2A2028');
      const k = clamp(st / 1.5); p.fillStyle = `rgba(255,236,190,${.55 * k})`; p.fillRect(940, 150, 22 + k * 30, 640);
      glow(p, 960, 470, 300, 'rgba(255,236,190,A)', .3 * k);
      p.fillStyle = '#0A0B12'; p.fillRect(-400, 800, 2800, 500);
      p.restore();
    } else if (shot === 'count') {
      p.save(); cam2(p, 960 + dx, 540 + dy, push(st, 1.05, 1.12, 3)); dorm(p, gt, true);
      bunk(p, 600, true, [{}, {}], gt); bunk(p, 1300, true, [{}, {}], gt);
      torchCone(p, gt, -100, 120, 450 + Math.sin(st * 1.4) * 500 + st * 120, 600, .35);
      p.restore();
    } else if (shot === 'sleepy') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); dorm(p, gt, true); p.restore();
      p.fillStyle = 'rgba(0,0,10,.3)'; p.fillRect(0, 0, SW, SH);
      bust(p, 960, 640, 230, { t: gt, col: '#E05B8B', col2: '#C04A74', hair: capHair, e: 'closed', blink: false, talk: talking(gt, st > .3 ? gt - 1 : 0, at(5, .95)), seed: 5, light: 1, rim: 'rgba(255,236,190,.9)' });
    } else if (shot === 'sami') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); dorm(p, gt, true); p.restore();
      p.fillStyle = 'rgba(0,0,10,.3)'; p.fillRect(0, 0, SW, SH);
      sami(p, 960, 640, 230, gt, { e: 'closed', blink: false, talk: talking(gt, L(6) + 1.2, L(6) + 2.2) });
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 2.5)); dorm(p, gt, true); p.restore();
      p.fillStyle = 'rgba(0,0,10,.3)'; p.fillRect(0, 0, SW, SH);
      const wake = gt > at(6, .62);
      me(p, 960, 640, 230, gt, { e: wake ? 'wide' : 'closed', blink: false, mouth: wake ? 'o' : undefined, talk: talking(gt, CUE.me - .1, CUE.me + .7) });
    }
  });
};
SC.treize = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'beam'], [CUE.thirteen + .4, 'face'], [CUE.present - .5, 'next'], [L(8), 'beds'], [CUE.bed - .7, 'lump']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, .5);
    if (shot === 'beam') {
      p.save(); cam2(p, 1100 + dx, 560 + dy, push(st, 1.1, 1.3, 3)); dorm(p, gt, true);
      bunk(p, 600, true, [{}, {}], gt); bunk(p, 1300, true, [{}, { e: 'wide' }], gt);
      torchCone(p, gt, -100, 120, 1150, 660, .45);
      p.restore();
    } else if (shot === 'face') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 2)); dorm(p, gt, true); p.restore();
      p.fillStyle = 'rgba(0,0,10,.3)'; p.fillRect(0, 0, SW, SH);
      me(p, 960, 640, 230, gt, { e: 'wide', mouth: 'o', look: 1 });
    } else if (shot === 'next' || shot === 'lump') {
      const z = shot === 'lump' ? push(st, 1.4, 1.7, 3) : push(st, 1.1, 1.25, 3);
      p.save(); cam2(p, (shot === 'lump' ? 1250 : 1000) + dx, 620 + dy, z); dorm(p, gt, true);
      rr(p, 200, 700, 560, 60, 10); fs(p, '#2A2028', 0); rr(p, 220, 640, 520, 70, 16); fs(p, '#2A3050', 0);
      head(p, 330, 620, 46, gt, { e: 'wide', look: 1 });
      bed13(p, 1250, 760, 1, gt, { hand: shot === 'lump' && gt > CUE.bed });
      glow(p, 1250, 640, 380, 'rgba(160,190,255,A)', .15);
      p.restore();
    } else {
      p.save(); cam2(p, 960 + dx, 540 + dy, 1.05); dorm(p, gt, true);
      bunk(p, 420, true, [{}, {}], gt); bunk(p, 1020, true, [{}, {}], gt);
      bed13(p, 1600, 790, .8, gt);
      p.restore();
      const n = Math.min(13, 1 + Math.floor(clamp(st / (D(8) * .6)) * 13));
      p.save(); text(p, String(n), 1600, 380, '900 120px Montserrat', n === 13 ? '#FF4B4B' : 'rgba(255,255,255,.85)'); p.restore();
    }
  });
};
SC.fin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'me'], [at(9, .45), 'lump']]);
  film(c, gt, p => {
    if (shot === 'me') { p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 2.5)); dorm(p, gt, true); p.restore(); p.fillStyle = 'rgba(0,0,10,.3)'; p.fillRect(0, 0, SW, SH);
      me(p, 960, 640, 230, gt, { e: 'worried', look: 1 }); return; }
    p.save(); cam2(p, 1250, 640, push(st, 1.7, 1.85, 4)); dorm(p, gt, true);
    bed13(p, 1250, 760, 1, gt, { hand: true });
    glow(p, 1250, 640, 380, 'rgba(160,190,255,A)', .15);
    p.restore();
  });
  cinemaEnd(c, gt, CUE.endcard, 'PARTIE 2', 'Tu soulèves la couverture ? OUI / NON');
};
