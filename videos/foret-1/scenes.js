// Perdu en forêt — Jour 1 : nouvelle série de survie (5 épisodes), style cinéma (cinema.js + cinema-rig.js).
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const UNC = '#3A7A4A', UNC2 = '#2E6A3E';

const kidHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .05, r * 1.04, Math.PI * 1.05, Math.PI * 1.95); c.quadraticCurveTo(r * .5, -r * .7, 0, -r * .62); c.quadraticCurveTo(-r * .6, -r * .72, -r * 1.0, -r * .3); c.closePath(); fs(c, '#4A2E1E', 0); c.restore(); };
const beanie = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .1, r * 1.05, Math.PI * 1.0, Math.PI * 2.0); c.closePath(); fs(c, '#C0392B', 0); rr(c, -r * 1.06, -r * .2, r * 2.12, r * .24, r * .1); fs(c, '#A02E22', 0); c.restore(); };

// ---------- décors ----------
function woods(p, gt, o = {}) { // o.night (0..1), o.path
  const n = o.night || 0;
  p.fillStyle = grad(p, 0, 760, n > .5 ? ['#04060A', '#0A1210'] : n > 0 ? ['#E89A5A', '#7A6A5A'] : ['#9ED0B8', '#CFE8D8']); p.fillRect(-400, -200, 2800, 1100);
  for (let layer = 0; layer < 3; layer++) for (let i = 0; i < 16; i++) {
    const x = -300 + i * 190 + layer * 70 + (i * 37 % 50), w = 30 + layer * 18, top = 40 + ((i * 53 + layer * 31) % 160);
    const col = n > .5 ? ['#0A100C', '#0E1610', '#121C14'][layer] : n > 0 ? ['#4A3A30', '#3A3028', '#2A221E'][layer] : ['#7AA488', '#5A8A6A', '#3E6E4E'][layer];
    rr(p, x, top, w, 800 - top, 6); fs(p, col, 0);
    circ(p, x + w / 2, top + 20, 70 + layer * 20); fs(p, n > .5 ? ['#0C140E', '#101A12', '#142016'][layer] : n > 0 ? ['#5A4A38', '#4A3E30', '#3A3026'][layer] : ['#6A9A78', '#4E8A5E', '#3A7A4A'][layer], 0);
  }
  p.fillStyle = n > .5 ? '#070A08' : n > 0 ? '#3A3226' : '#6A8A4A'; p.fillRect(-400, 780, 2800, 500);
  if (o.path) { p.beginPath(); p.moveTo(700, 1300); p.quadraticCurveTo(900, 900, 1100, 780); p.lineTo(1200, 780); p.quadraticCurveTo(1100, 900, 1300, 1300); p.closePath(); fs(p, '#B89A6A', 0); }
  if (n > .5) for (let i = 0; i < 30; i++) { circ(p, (i * 331) % 2400 - 300, (i * 97) % 300, 1.5); fs(p, 'rgba(255,255,255,.4)', 0); }
}
function leafPile(p, x, y, s, k = 1) {
  p.save(); p.translate(x, y); p.scale(s, s);
  for (let i = 0; i < Math.floor(40 * k); i++) { const a = (i * 2.4) % 6.28, rr_ = (i % 7) * 30; p.beginPath(); p.ellipse(Math.cos(a) * (60 + rr_ * 1.6), -Math.abs(Math.sin(a)) * (20 + rr_ * .5), 34, 16, a, 0, Math.PI * 2); fs(p, ['#B8762A', '#D89A3A', '#8A5A22', '#C9842E'][i % 4], 0); }
  p.restore();
}
function phoneSmall(q, x, y) { rr(q, x - 20, y - 40, 40, 72, 8); fs(q, '#16161C', 0); rr(q, x - 15, y - 34, 30, 58, 5); fs(q, '#9CC3FF', 0); }
function paper(p) {
  p.fillStyle = '#F1EADB'; p.fillRect(-400, -200, 2800, 1400);
  for (let x = -400; x < 2400; x += 60) { p.fillStyle = '#E5DCC8'; p.fillRect(x, -200, 3, 1400); }
  for (let y = -200; y < 1200; y += 60) { p.fillStyle = '#E5DCC8'; p.fillRect(-400, y, 2800, 3); }
}
const batScr = (pct, plane) => (c, w, h) => {
  c.fillStyle = '#0F1118'; c.fillRect(0, 0, w, h);
  text(c, plane ? 'MODE AVION' : 'AUCUN RÉSEAU', w / 2, 60, '800 22px Montserrat', plane ? '#F5B82E' : '#FF5A5A');
  rr(c, w / 2 - 90, 240, 170, 80, 14); fs(c, null, 8, '#FFFFFF'); rr(c, w / 2 + 84, 265, 14, 30, 4); fs(c, '#FFFFFF', 0);
  rr(c, w / 2 - 80, 250, Math.max(6, 150 * pct / 100), 60, 8); fs(c, pct < 10 ? '#FF3B30' : '#2EBD6B', 0);
  text(c, pct + ' %', w / 2, 420, '900 80px Montserrat', pct < 10 ? '#FF3B30' : '#FFFFFF');
  if (plane) { rr(c, 30, 520, w - 60, 90, 20); fs(c, '#F5B82E', 0); text(c, 'BATTERIE PROTÉGÉE', w / 2, 566, '900 21px Montserrat', '#1A1A20'); }
};

// ---------- HUD ----------
const bat = gt => gt < L(2) ? 31 : gt < L(4) ? 18 : gt < CUE.plane ? 6 : gt < L(7) ? 5 : 4;
function hud(c, gt) {
  const b = gt < L(1) ? 4 : bat(gt);
  cinemaHud(c, gt, { part: 'Perdu en forêt', off: gt > CUE.endcard, day: gt < L(1) ? undefined : 1, dayAt: L(1), val: 'BATTERIE : ' + b + ' %', neg: b < 10, bump: gt > CUE.plane && gt < CUE.plane + 1 ? CUE.plane : undefined });
}

const enfant = (p, x, y, o = {}) => rig(p, { x, y, s: o.s || .5, f: o.f || 1, t: o.t, pose: o.pose, seat: o.seat, walk: o.walk, hair: kidHair, e: o.e || 'n', mouth: o.mouth, look: o.look, lookY: o.lookY, armF: o.armF, armB: o.armB, holdF: o.holdF, seed: 2, light: o.light ?? 1 });
const me = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, hair: kidHair, seed: 2, light: 1, ...o });

// ---------- scènes ----------
SC.flash = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 960, 560, push(lt, 1.05, 1.2, 3)); woods(p, gt, { night: .4 }); p.restore();
    me(p, 620, 660, 220, gt, { e: 'worried', lookY: .5, rim: 'rgba(160,190,255,.9)' });
    phoneBig(p, 1320, 560, .95, .08, batScr(4), { edge: '#5B6E8A' });
  });
};
SC.sentier = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'walk'], [at(1, .58), 'photo'], [L(2), 'turn'], [at(2, .45), 'spin']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'walk') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.05, 1.15, 4)); woods(p, gt, { path: true });
      rig(p, { x: 1060 + st * 40, y: 835, s: .6, f: 1, t: gt, pose: 'walk', walk: gt * 6, col: UNC, col2: UNC2, hair: beanie, e: 'happy', seed: 6, light: 1 });
      enfant(p, 860 + st * 40, 835, { t: gt, pose: 'walk', walk: gt * 7 + 1, e: 'happy', mouth: 'smile' });
      p.restore();
    } else if (shot === 'photo') {
      p.save(); cam2(p, 760 + dx, 560 + dy, push(st, 1.15, 1.25, 3)); woods(p, gt, {});
      enfant(p, 700, 835, { t: gt, f: 1, e: 'happy', look: 1, lookY: -.4, armF: [2.0, .3], holdF: (q, x, y) => phoneSmall(q, x + 10, y - 30) });
      p.restore();
    } else if (shot === 'turn') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.2, 1.35, 3)); woods(p, gt, {});
      enfant(p, 960, 835, { t: gt, f: -1, e: 'wide', look: -1, mouth: 'o' });
      p.restore();
    } else {
      p.save(); cam2(p, 960, 500, 1.25, Math.sin(st * 1.3) * .06); woods(p, gt + st * 3, {}); p.restore();
      me(p, 960, 700, 210, gt, { e: 'worried', look: Math.sin(st * 3) });
    }
  });
};
SC.regle = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'still'], [CUE.stop - .2, 'stop'], [at(3, .55), 'map'], [L(4), 'call'], [CUE.sms - .6, 'sms'], [L(5), 'plane']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'still' || shot === 'stop') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.1, 1.2, 3)); woods(p, gt, { night: .2 });
      enfant(p, 960, 835, { t: gt, f: 1, e: 'n', look: 0, lookY: .2 });
      p.restore();
      if (shot === 'stop') { const s = pop(gt, CUE.stop); if (s) { p.save(); p.translate(1400, 400); p.scale(s, s);
        p.beginPath(); for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; p.lineTo(Math.cos(a) * 150, Math.sin(a) * 150); } p.closePath(); fs(p, '#E53935', 10, '#FFFFFF');
        text(p, 'STOP', 0, 4, '900 84px Montserrat', '#FFFFFF'); p.restore(); } }
    } else if (shot === 'map') {
      p.save(); cam2(p, 960, 540, push(st, 1, 1.06, 3)); paper(p);
      circ(p, 760, 560, 240); fs(p, 'rgba(46,189,107,.18)', 6, '#2EBD6B'); text(p, 'ZONE DE RECHERCHE', 760, 270, '800 40px Montserrat', '#2EBD6B');
      const k = clamp(st / 2.2), pts = [[760, 560], [880, 470], [980, 600], [1150, 520], [1300, 650], [1480, 560], [1640, 700]];
      p.setLineDash([18, 16]); line(p, pts.slice(0, 1 + Math.floor(k * (pts.length - 1))), 10, '#E53935', null); p.setLineDash([]);
      const last = pts[Math.floor(k * (pts.length - 1))]; circ(p, last[0], last[1], 22); fs(p, '#E53935', 0);
      if (k > .8) text(p, 'TROP LOIN', 1600, 820, '900 54px Montserrat', '#E53935');
      p.restore();
    } else if (shot === 'call') {
      p.save(); cam2(p, 960, 560, 1.15); woods(p, gt, { night: .3 }); p.restore(); p.fillStyle = 'rgba(0,0,0,.4)'; p.fillRect(0, 0, SW, SH);
      phoneBig(p, 960, 560, 1.2, -.03, scrCall('112', 'Appel en cours…', '#E53935'), { edge: '#5B6E8A' });
      text(p, '112 = TOUS LES RÉSEAUX', 1540, 220, '900 46px Montserrat', '#F5B82E');
    } else if (shot === 'sms') {
      p.save(); cam2(p, 960, 560, 1.15); woods(p, gt, { night: .3 }); p.restore(); p.fillStyle = 'rgba(0,0,0,.4)'; p.fillRect(0, 0, SW, SH);
      phoneBig(p, 960, 560, 1.2, .03, scrMsg('Tonton', ['Perdu.\nJe ne bouge\nplus.'], clamp(st / .6)), { edge: '#5B6E8A' });
    } else {
      p.save(); cam2(p, 960, 560, 1.15); woods(p, gt, { night: .35 }); p.restore(); p.fillStyle = 'rgba(0,0,0,.4)'; p.fillRect(0, 0, SW, SH);
      phoneBig(p, 960, 560, 1.2, -.02, batScr(5, gt > CUE.plane), { edge: '#5B6E8A' });
    }
  });
};
SC.abri = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'build'], [at(6, .3), 'ground'], [at(6, .62), 'pile']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'build') {
      p.save(); cam2(p, 960 + dx, 600 + dy, push(st, 1.1, 1.2, 3)); woods(p, gt, { night: .45 });
      leafPile(p, 1150, 830, .9, .5 + st * .1);
      enfant(p, 900, 835, { t: gt, pose: 'kneel', f: 1, e: 'n', lookY: .5, armF: [1.0 + Math.sin(gt * 4) * .3, .3], armB: [.9, .4] });
      p.restore();
    } else if (shot === 'ground') {
      p.save(); cam2(p, 960, 540, push(st, 1, 1.05, 3)); paper(p);
      [[560, false], [1360, true]].forEach(([x, leaves]) => {
        p.fillStyle = '#8A6A4A'; p.fillRect(x - 330, 700, 660, 60);
        if (leaves) leafPile(p, x, 700, 1.1, 1);
        const y = leaves ? 610 : 660; rr(p, x - 220, y - 50, 440, 60, 30); fs(p, '#F2A31B', 0); circ(p, x + 260, y - 30, 46); fs(p, SKIN, 0);
        if (!leaves) for (let i = 0; i < 4; i++) { const k = ((st * .8 + i * .25) % 1); line(p, [[x - 150 + i * 100, 720 + k * 60], [x - 150 + i * 100, 760 + k * 60]], 10, `rgba(229,57,53,${1 - k})`, null); }
        text(p, leaves ? 'ISOLÉ DU SOL' : 'LE SOL VOLE TA CHALEUR', x, 900, '900 44px Montserrat', leaves ? '#2EBD6B' : '#E53935');
        text(p, leaves ? '✓' : '✗', x, 380, '900 120px Montserrat', leaves ? '#2EBD6B' : '#E53935');
      });
      p.restore();
    } else {
      p.save(); cam2(p, 1000 + dx, 640 + dy, push(st, 1.2, 1.3, 3)); woods(p, gt, { night: .5 });
      leafPile(p, 1000, 830, 1.1, 1);
      enfant(p, 1000, 800, { t: gt, pose: 'sit', seat: 60 / .5, f: 1, e: 'n', armF: [.75, .85], armB: [.75, .85] });
      p.restore();
    }
  });
};
SC.nuit = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'dark'], [CUE.vibe - .3, 'sms'], [L(8), 'face'], [at(8, .45), 'num'], [CUE.light - .5, 'lamp']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, .6);
    if (shot === 'dark') {
      p.save(); cam2(p, 1000 + dx, 640 + dy, push(st, 1.2, 1.35, 3)); woods(p, gt, { night: 1 });
      leafPile(p, 1000, 830, 1.1, 1);
      enfant(p, 1000, 800, { t: gt, pose: 'sit', seat: 60 / .5, f: 1, e: 'worried', armF: [.75, .85], armB: [.75, .85], light: -1 });
      p.restore();
    } else if (shot === 'sms' || shot === 'num') {
      p.fillStyle = '#05060A'; p.fillRect(0, 0, SW, SH);
      const sh = gt > CUE.vibe && gt < CUE.vibe + .5 ? Math.sin(gt * 90) * 8 : 0;
      phoneBig(p, 960 + sh, 560, 1.2, .02, scrMsg(shot === 'num' ? 'Numéro inconnu' : '06 •• •• •• ••', ['Ne bouge pas.\nOn arrive.'], 1), { edge: shot === 'num' ? '#E53935' : '#5B6E8A' });
      if (shot === 'num') text(p, 'PAS TON ONCLE', 1560, 220, '900 50px Montserrat', '#FF3B30');
    } else if (shot === 'face') {
      p.fillStyle = '#05060A'; p.fillRect(0, 0, SW, SH); glow(p, 960, 760, 500, 'rgba(160,190,255,A)', .25);
      me(p, 960, 640, 230, gt, { e: 'wide', mouth: 'o', rim: 'rgba(160,190,255,.9)' });
    } else {
      p.save(); cam2(p, 1200 + dx, 560 + dy, push(st, 1.1, 1.3, 3)); woods(p, gt, { night: 1 });
      const lx = 1400 + Math.sin(gt * 1.7) * 30, ly = 600 + Math.abs(Math.sin(gt * 3)) * 12;
      glow(p, lx, ly, 160 + st * 40, 'rgba(255,240,200,A)', .7); circ(p, lx, ly, 10); fs(p, '#FFF6D8', 0);
      p.restore();
    }
  });
};
SC.fin = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 1300, 560, push(lt, 1.3, 1.6, 4)); woods(p, gt, { night: 1 });
    const lx = 1400 + Math.sin(gt * 1.7) * 30, ly = 600 + Math.abs(Math.sin(gt * 3)) * 12;
    glow(p, lx, ly, 260 + lt * 30, 'rgba(255,240,200,A)', .75); circ(p, lx, ly, 12); fs(p, '#FFF6D8', 0);
    p.restore();
  });
  cinemaEnd(c, gt, CUE.endcard, 'JOUR 2', 'Tu réponds au message ? OUI / NON');
};
