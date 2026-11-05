// Perdu en forêt — Jour 3 (FIN) : série de survie, style cinéma (cinema.js + cinema-rig.js). Conseils vérifiés.
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

const enfant = (p, x, y, o = {}) => rig(p, { x, y, s: o.s || .5, f: o.f || 1, t: o.t, pose: o.pose, seat: o.seat, walk: o.walk, col: o.col, col2: o.col2, hair: kidHair, e: o.e || 'n', mouth: o.mouth, look: o.look, lookY: o.lookY, armF: o.armF, armB: o.armB, holdF: o.holdF, seed: 2, light: o.light ?? 1 });
const me = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, hair: kidHair, seed: 2, light: 1, ...o });


function clearing(p, gt) {
  p.fillStyle = grad(p, 0, 640, ['#9ED0EE', '#D2ECF6']); p.fillRect(-400, -200, 2800, 900);
  for (let i = 0; i < 14; i++) { const x = -300 + i * 200; if (x > 500 && x < 1400) continue; rr(p, x, 200 + (i * 37) % 120, 40, 600, 6); fs(p, '#3E2E22', 0); circ(p, x + 20, 220 + (i * 37) % 120, 130); fs(p, '#3A7A4A', 0); }
  p.fillStyle = '#7FAA5A'; p.fillRect(-400, 640, 2800, 700);
}
function topView(p, gt, k) { // vue du ciel : clairière, sweat orange, lettres SOS
  p.fillStyle = '#2E5A34'; p.fillRect(-400, -200, 2800, 1400);
  for (let i = 0; i < 40; i++) { circ(p, (i * 233) % 2600 - 300, (i * 157) % 1300 - 100, 90 + (i % 3) * 30); fs(p, ['#3A6A3E', '#2A5230', '#447A48'][i % 3], 0); }
  p.beginPath(); p.ellipse(960, 540, 700, 380, 0, 0, Math.PI * 2); fs(p, '#8AB25E', 0);
  rr(p, 560, 300, 140, 120, 20); fs(p, '#F2A31B', 0);
  const n = 1 + Math.floor(k * 3); p.save(); p.translate(1020, 540); text(p, 'SOS'.slice(0, n), 0, 0, '900 340px Montserrat', '#5A3E22'); p.restore();
}
function stream(p, gt) {
  p.fillStyle = grad(p, 0, 640, ['#B8D8C8', '#DCEDE4']); p.fillRect(-400, -200, 2800, 900);
  for (let i = 0; i < 12; i++) { const x = -300 + i * 220; rr(p, x, 160, 36, 600, 6); fs(p, '#4A3A2A', 0); circ(p, x + 18, 180, 120); fs(p, '#4E8A5E', 0); }
  p.fillStyle = '#6A8A4A'; p.fillRect(-400, 640, 2800, 700);
  p.beginPath(); p.moveTo(-400, 760); p.quadraticCurveTo(900, 700, 2400, 780); p.lineTo(2400, 900); p.quadraticCurveTo(900, 830, -400, 900); p.closePath(); fs(p, '#6AAED8', 0);
  for (let i = 0; i < 10; i++) { const x = ((i * 260 + gt * 120) % 2800) - 400; line(p, [[x, 800], [x + 70, 798]], 5, 'rgba(255,255,255,.7)', null); }
}
const smsScr = (from, msg, red) => scrMsg(from, msg, 1);

function heli(p, x, y, s, gt) {
  p.save(); p.translate(x, y); p.scale(s, s); p.fillStyle = '#C62828';
  p.beginPath(); p.ellipse(0, 0, 110, 55, 0, 0, Math.PI * 2); p.fill();
  rr(p, 80, -14, 200, 22, 10); p.fill(); rr(p, 260, -50, 18, 60, 6); p.fill();
  p.beginPath(); p.ellipse(-40, -8, 50, 30, 0, 0, Math.PI * 2); fs(p, '#BFE3F5', 0);
  rr(p, -6, -70, 12, 20, 4); fs(p, '#2A2D38', 0);
  const r = 230 * Math.abs(Math.cos(gt * 30)); line(p, [[-r, -72], [r, -72]], 8, 'rgba(40,40,50,.8)', null);
  line(p, [[-80, 70], [80, 70]], 8, '#2A2D38', null); line(p, [[-50, 50], [-50, 70]], 6, '#2A2D38', null); line(p, [[50, 50], [50, 70]], 6, '#2A2D38', null);
  p.restore();
}
function shade(p, a) { p.fillStyle = `rgba(0,0,0,${a})`; p.fillRect(-400, -200, 2800, 1400); }
function bodySig(p, x, y, s, kind, col) { // signal sol-air vu de face : 'Y' ou 'N'
  p.save(); p.translate(x, y); p.scale(s, s);
  circ(p, 0, -190, 50); fs(p, SKIN, 0); kidHair(p, 50, [0, -190]);
  line(p, [[0, -140], [0, 40]], 34, col, null);
  line(p, [[0, 40], [-50, 220]], 30, '#2A3550', null); line(p, [[0, 40], [50, 220]], 30, '#2A3550', null);
  if (kind === 'Y') { line(p, [[0, -110], [-130, -280]], 26, col, null); line(p, [[0, -110], [130, -280]], 26, col, null); }
  else { line(p, [[0, -110], [130, -280]], 26, col, null); line(p, [[0, -110], [-130, 60]], 26, col, null); }
  p.restore();
}
function hud(c, gt) {
  cinemaHud(c, gt, { part: 'Perdu en forêt', off: gt > CUE.endcard, day: gt < L(1) ? undefined : 3, dayAt: L(1), val: gt >= CUE.rescue + 1 ? 'SAUVÉ' : 'EAU : 0 L', neg: gt < CUE.rescue + 1, bump: gt >= CUE.rescue + 1 ? CUE.rescue + 1 : undefined });
}
SC.flash = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 960, 500, push(lt, 1.1, 1.3, 3)); woods(p, gt, {}); shade(p, .25);
    heli(p, lerp(1500, 1100, clamp(lt / 3)), 150, 1.1, gt); p.restore();
    me(p, 760, 800, 210, gt, { e: 'wide', mouth: 'o', lookY: -.8, look: 1, col: '#E8E4DC', col2: '#D8D4CC' });
  });
};
SC.refus = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wake'], [at(1, .55), 'plane'], [CUE.three - .3, 'three']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'wake') {
      p.save(); cam2(p, 1000 + dx, 640 + dy, push(st, 1.1, 1.25, 3)); woods(p, gt, { night: .2 }); leafPile(p, 1200, 830, 1.0, .8);
      enfant(p, 950, 800, { t: gt, pose: 'sit', seat: 60 / .5, f: 1, e: 'sad', lookY: .4, col: '#E8E4DC', col2: '#D8D4CC' }); p.restore();
    } else if (shot === 'plane') {
      p.save(); cam2(p, 960, 400, push(st, 1.0, 1.1, 3)); clearing(p, gt);
      const x = lerp(1300, -300, clamp(st / 3)); p.save(); p.translate(x, 160); p.fillStyle = '#2A2D38'; p.beginPath(); p.ellipse(0, 0, 90, 30, 0, 0, Math.PI * 2); p.fill(); rr(p, -30, -8, 60, 16, 6); p.fill(); line(p, [[-20, -6], [-20, -80]], 14, '#2A2D38', null); line(p, [[-20, 6], [-20, 80]], 14, '#2A2D38', null); p.restore();
      p.restore();
      me(p, 760, 820, 190, gt, { e: 'sad', lookY: -.7, look: -1, col: '#E8E4DC', col2: '#D8D4CC' });
    } else {
      p.save(); cam2(p, 960, 540, push(st, 1, 1.05, 3)); paper(p); p.restore();
      const a = pop(gt, CUE.three);
      if (a) { p.save(); p.translate(960, 470); p.scale(a, a); text(p, '3', 0, 60, '900 420px Montserrat', '#E53935'); text(p, 'JOURS SANS EAU', 0, 260, '900 64px Montserrat', '#3A3A48'); p.restore(); }
      rr(p, 1420, 300, 120, 220, 26); fs(p, null, 10, '#3A6EA5'); rr(p, 1430, 470, 100, 40, 10); fs(p, '#E53935', 0);
      text(p, 'ENVIRON', 960, 160, '800 44px Montserrat', '#6A6A78');
    }
  });
};
SC.bruit = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'trees'], [CUE.heli - .2, 'heli']]);
  film(c, gt, p => {
    const sh = shot === 'trees' ? Math.sin(gt * 50) * 4 : 0;
    if (shot === 'trees') {
      p.save(); cam2(p, 960 + sh, 600, push(st, 1.15, 1.25, 3)); clearing(p, gt);
      enfant(p, 960, 835, { t: gt, pose: 'stand', e: 'wide', lookY: -.8, col: '#E8E4DC', col2: '#D8D4CC' }); p.restore();
    } else {
      p.save(); cam2(p, 960, 500, push(st, 1.0, 1.2, 3)); clearing(p, gt); heli(p, lerp(2100, 1250, clamp(st / 3)), 200, 1.0, gt); p.restore();
    }
  });
};
SC.signal = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'open'], [CUE.yes - .5, 'yes'], [CUE.no - .3, 'no']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'open') {
      p.save(); cam2(p, 960, 540, push(st, 1.0, 1.15, 3)); topView(p, gt, 1); p.restore();
      p.save(); p.translate(960, 820); circ(p, 0, 0, 34); fs(p, SKIN, 0); kidHair(p, 34, [0, 0]); circ(p, 0, 60, 40); fs(p, '#E8E4DC', 0); p.restore();
      const k = clamp((gt - at(4, .3)) / 1); if (k > 0) { p.save(); p.globalAlpha = k; text(p, 'À DÉCOUVERT', 960, 120, '900 70px Montserrat', '#FFFFFF'); p.restore(); }
    } else {
      p.save(); cam2(p, 960, 540, push(st, 1, 1.05, 3)); paper(p); p.restore();
      const y = shot === 'yes';
      bodySig(p, 960, 620, 1.3 * pop(gt, y ? CUE.yes : CUE.no), y ? 'Y' : 'N', '#E8E4DC');
      rr(p, 560, 900, 800, 120, 30); fs(p, y ? '#2EBD6B' : '#E53935', 0);
      text(p, y ? 'Y = « YES » : AIDE-MOI' : 'NON = PAS BESOIN', 960, 975, '900 54px Montserrat', '#FFFFFF');
      if (!y) { line(p, [[640, 200], [1280, 860]], 26, 'rgba(229,57,53,.85)', null); line(p, [[1280, 200], [640, 860]], 26, 'rgba(229,57,53,.85)', null); }
    }
  });
};
SC.miroir = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'phone'], [CUE.flashsun - .4, 'flash']]);
  film(c, gt, p => {
    if (shot === 'phone') {
      p.save(); cam2(p, 960, 560, push(st, 1.0, 1.1, 3)); clearing(p, gt); p.restore();
      phoneBig(p, 960, 560, 1.1, -.1 + Math.sin(gt * 2) * .05, (q, w, h) => { q.fillStyle = '#0B0C10'; q.fillRect(0, 0, w, h); q.fillStyle = 'rgba(255,255,255,.18)'; q.beginPath(); q.moveTo(0, 0); q.lineTo(w * .6, 0); q.lineTo(0, h * .5); q.fill(); }, { edge: '#5B6E8A' });
      glow(p, 1500, 180, 260, 'rgba(255,240,180,A)', .8); circ(p, 1500, 180, 80); fs(p, '#FFE27A', 0);
    } else {
      p.save(); cam2(p, 960, 500, push(st, 1.0, 1.15, 3)); topView(p, gt, 1); p.restore();
      const f = .5 + .5 * Math.sin(gt * 9); glow(p, 960, 820, 360, 'rgba(255,255,230,A)', .9 * f); circ(p, 960, 820, 30); fs(p, '#FFFFFF', 0);
      text(p, 'VISIBLE DE TRÈS LOIN', 960, 120, '900 64px Montserrat', '#FFFFFF');
    }
  });
};
SC.sauvetage = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'turn'], [CUE.rescue - .3, 'wait'], [at(8, .7), 'help']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, .5);
    p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.0, 1.12, 3)); clearing(p, gt);
    if (shot === 'turn') { heli(p, 960 + Math.cos(gt * .8) * 500, 220, .9, gt); enfant(p, 960, 835, { t: gt, pose: 'stand', e: 'happy', mouth: 'o', armF: [2.7, 0], armB: [2.7, 0], col: '#E8E4DC', col2: '#D8D4CC' }); }
    else if (shot === 'wait') { heli(p, 1550, lerp(250, 560, clamp(st / 3)), 1.0, gt); enfant(p, 700, 835, { t: gt, pose: 'stand', e: 'n', col: '#E8E4DC', col2: '#D8D4CC' }); }
    else {
      heli(p, 1550, 560, 1.0, gt);
      enfant(p, 760, 835, { t: gt, pose: 'stand', e: 'happy', mouth: 'smile', col: '#E8E4DC', col2: '#D8D4CC' });
      rig(p, { x: lerp(1300, 900, clamp(st / 1.5)), y: 835, s: .62, f: -1, t: gt, pose: st < 1.5 ? 'walk' : 'stand', walk: gt * 7, col: '#F2A31B', col2: '#D88A10', pants: '#2A3550', e: 'happy', mouth: 'smile', seed: 7, light: 1, armF: st >= 1.5 ? [1.4, .2] : undefined });
    }
    p.restore();
  });
};
SC.fin = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 960, 560, push(lt, 1.05, 1.2, 4)); clearing(p, gt); heli(p, lerp(1400, 2400, clamp(lt / 6)), lerp(400, 100, clamp(lt / 6)), .9, gt); p.restore();
    me(p, 960, 640, 230, gt, { e: 'happy', mouth: 'smile', col: '#F2A31B', col2: '#D88A10' });
  });
  const k = pr(gt, CUE.endcard, CUE.endcard + .2); if (k <= 0) return;
  stage(c, p => {
    p.fillStyle = `rgba(5,6,10,${k})`; p.fillRect(0, 0, SW, SH);
    const b = pop(gt, CUE.endcard + .15, .45), qq = clamp((gt - CUE.endcard - .8) * 3);
    if (b) { p.save(); p.translate(SW / 2, 430); p.scale(b, b); text(p, 'FIN', 0, 0, '900 190px Montserrat', '#F5B82E'); p.restore(); }
    if (qq > 0) { p.globalAlpha = qq; text(p, 'Tu aurais tenu 3 jours ?', SW / 2, 700, '800 54px Montserrat', '#FFFFFF'); text(p, 'Nouvelle série de survie bientôt', SW / 2, 790, '700 38px Montserrat', '#9AA2BC'); }
  }, { vig: .3 });
};
