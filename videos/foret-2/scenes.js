// Perdu en forêt — Jour 2 : série de survie, style cinéma (cinema.js + cinema-rig.js). Conseils vérifiés.
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
function hud(c, gt) {
  const b = gt < L(4) ? 4 : 3;
  cinemaHud(c, gt, { part: 'Perdu en forêt', off: gt > CUE.endcard, day: gt < L(1) ? undefined : 2, dayAt: L(1), val: gt >= L(6) ? 'EAU : 0 L' : 'BATTERIE : ' + b + ' %', neg: true, bump: gt >= L(6) ? L(6) : undefined });
}
SC.flash = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 1000, 640, push(lt, 1.2, 1.35, 3)); woods(p, gt, { night: 1 });
    leafPile(p, 1000, 830, 1.1, 1);
    p.save(); p.translate(1000, 770); circ(p, 0, 0, 40); fs(p, SKIN, 0); kidHair(p, 40, [0, 0]); eyes(p, 6, 0, 40, { t: gt, e: 'wide', blink: false }); p.restore();
    const lx = lerp(1500, 600, clamp(lt / 3)); glow(p, lx, 600, 200, 'rgba(255,240,200,A)', .7); circ(p, lx, 600, 10); fs(p, '#FFF6D8', 0);
    p.restore();
  });
};
SC.nuit = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'hide'], [at(1, .5), 'lamp'], [at(1, .8), 'gone']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, .6);
    p.save(); cam2(p, 1000 + dx, 640 + dy, push(st, 1.15, 1.3, 3)); woods(p, gt, { night: 1 });
    leafPile(p, 1000, 830, 1.1, 1);
    p.save(); p.translate(1000, 770); circ(p, 0, 0, 40); fs(p, SKIN, 0); kidHair(p, 40, [0, 0]); eyes(p, 6, 0, 40, { t: gt, e: shot === 'gone' ? 'sad' : 'wide', blink: false }); p.restore();
    if (shot !== 'gone') { const lx = shot === 'hide' ? lerp(1700, 1250, clamp(st / 3)) : lerp(1250, 300, clamp(st / 2)); glow(p, lx, 620, 220, 'rgba(255,240,200,A)', .7); circ(p, lx, 620, 10); fs(p, '#FFF6D8', 0); }
    p.restore();
  });
};
SC.matin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wake'], [CUE.sms - .3, 'sms'], [L(3), 'info'], [at(3, .6), 'face']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'wake') {
      p.save(); cam2(p, 1000 + dx, 640 + dy, push(st, 1.15, 1.25, 3)); woods(p, gt, { night: .2 }); leafPile(p, 1000, 830, 1.1, 1);
      enfant(p, 1000, 800, { t: gt, pose: 'sit', seat: 60 / .5, f: 1, e: 'n', lookY: .5, armF: [1.2, .5], holdF: (q, x, y) => phoneSmall(q, x + 10, y - 20) }); p.restore();
    } else if (shot === 'sms') {
      p.save(); cam2(p, 960, 560, 1.15); woods(p, gt, { night: .2 }); p.restore(); p.fillStyle = 'rgba(0,0,0,.4)'; p.fillRect(0, 0, SW, SH);
      phoneBig(p, 960, 560, 1.2, .02, scrMsg('06 •• •• •• ••', ['Ne bouge pas.\nOn arrive.', 'Gendarmerie.\nTon oncle nous\na donné ton\nnuméro.'], clamp((gt - CUE.sms + .3) / .6) * .5 + .5), { edge: '#5B6E8A' });
    } else if (shot === 'info') {
      p.save(); cam2(p, 960, 540, push(st, 1, 1.05, 3)); paper(p); p.restore();
      phoneBig(p, 620, 560, .8, -.05, scrCall('Numéro inconnu', 'Appel entrant', '#5B6E8A'), { edge: '#5B6E8A' });
      text(p, '=', 960, 560, '900 160px Montserrat', '#3A3A48');
      p.save(); p.translate(1350, 560); circ(p, 0, 0, 170); fs(p, '#1F4E8C', 0); text(p, 'SECOURS', 0, 10, '900 56px Montserrat', '#FFFFFF'); p.restore();
      text(p, 'PEUT-ÊTRE', 960, 880, '900 64px Montserrat', '#E53935');
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); woods(p, gt, { night: .2 }); p.restore();
      me(p, 960, 640, 230, gt, { e: 'sad' });
    }
  });
};
SC.clairiere = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'walk'], [CUE.sweat - .4, 'sweat'], [L(5), 'build'], [CUE.sos - .8, 'top']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'walk') {
      p.save(); cam2(p, 960 + dx, 600 + dy, push(st, 1.05, 1.15, 3)); clearing(p, gt);
      enfant(p, lerp(500, 900, clamp(st / 3)), 835, { t: gt, pose: 'walk', walk: gt * 7, e: 'n', look: 1 }); p.restore();
    } else if (shot === 'sweat') {
      p.save(); cam2(p, 960 + dx, 640 + dy, push(st, 1.15, 1.25, 3)); clearing(p, gt);
      rr(p, 1050, 800, 200, 60, 20); fs(p, '#F2A31B', 0);
      enfant(p, 900, 835, { t: gt, pose: 'kneel', e: 'n', lookY: .5, col: '#E8E4DC', col2: '#D8D4CC', armF: [1.0, .4] }); p.restore();
    } else if (shot === 'build') {
      p.save(); cam2(p, 960 + dx, 640 + dy, push(st, 1.1, 1.2, 3)); clearing(p, gt);
      rr(p, 1050, 800, 200, 60, 20); fs(p, '#F2A31B', 0); line(p, [[600, 820], [880, 800]], 24, '#5A3E22', null);
      enfant(p, 760, 835, { t: gt, pose: 'kneel', e: 'n', lookY: .5, col: '#E8E4DC', col2: '#D8D4CC', armF: [1.0 + Math.sin(gt * 4) * .2, .3] }); p.restore();
    } else {
      p.save(); cam2(p, 960, 540, push(st, 1.0, 1.15, 3)); topView(p, gt, clamp((gt - CUE.sos + .8) / 2)); p.restore();
    }
  });
};
SC.ruisseau = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'face'], [CUE.stream - .4, 'stream'], [CUE.germ - .3, 'info'], [at(7, .7), 'hands']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'face') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); clearing(p, gt); p.restore();
      me(p, 960, 640, 230, gt, { e: 'sad', mouth: 'o', col: '#E8E4DC', col2: '#D8D4CC', sweat: true });
    } else if (shot === 'stream' || shot === 'hands') {
      p.save(); cam2(p, 960 + dx, 700 + dy, push(st, 1.1, 1.25, 3)); stream(p, gt);
      enfant(p, 800, 735, { t: gt, pose: 'kneel', e: 'n', lookY: .6, col: '#E8E4DC', col2: '#D8D4CC', armF: shot === 'hands' ? [.9, .3] : [.6, .4] }); p.restore();
    } else {
      p.save(); cam2(p, 960, 540, push(st, 1, 1.05, 3)); paper(p); p.restore();
      const a = pop(gt, CUE.germ), b = pop(gt, CUE.germ + 1.2), d = pop(gt, CUE.germ + 2.4);
      if (a) { p.save(); p.translate(400, 520); p.scale(a, a); circ(p, 0, 0, 110); fs(p, '#7ABF5A', 0); for (let i = 0; i < 8; i++) { const an = i / 8 * 6.28; line(p, [[Math.cos(an) * 110, Math.sin(an) * 110], [Math.cos(an) * 150, Math.sin(an) * 150]], 10, '#5A9A3A', null); } eyes(p, 0, 0, 80, { t: gt, e: 'angry', mouth: 'grit' }); text(p, 'PARASITES', 0, 220, '900 44px Montserrat', '#3A3A48'); p.restore(); }
      if (b) { p.save(); p.translate(960, 520); p.scale(b, b); text(p, '→', -230, 0, '900 100px Montserrat', '#3A3A48'); text(p, 'DIARRHÉE', 40, 10, '900 60px Montserrat', '#8A5A22'); p.restore(); }
      if (d) { p.save(); p.translate(1580, 520); p.scale(d, d); text(p, '→', -300, 0, '900 100px Montserrat', '#3A3A48'); rr(p, -70, -150, 140, 260, 30); fs(p, null, 12, '#3A6EA5'); rr(p, -58, 60, 116, 40, 12); fs(p, '#E53935', 0); text(p, 'DÉSHYDRATATION', 0, 220, '900 40px Montserrat', '#E53935'); p.restore(); }
    }
  });
};
SC.ciel = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 960, 400, push(lt, 1.0, 1.15, 3)); clearing(p, gt);
    const x = lerp(2200, 1300, clamp(lt / 4)); p.save(); p.translate(x, 160); p.fillStyle = '#2A2D38';
    p.beginPath(); p.ellipse(0, 0, 90, 40, 0, 0, Math.PI * 2); p.fill(); rr(p, 60, -10, 170, 16, 8); p.fill(); line(p, [[-140, -50], [140, -50]], 6, `rgba(40,40,50,${.5 + .5 * Math.sin(gt * 40)})`, null); p.restore();
    p.restore();
    me(p, 760, 780, 200, gt, { e: 'wide', mouth: 'o', lookY: -.8, look: 1, col: '#E8E4DC', col2: '#D8D4CC' });
  });
};
SC.fin = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 960 + Math.sin(gt) * 5, 700, push(lt, 1.15, 1.3, 4)); stream(p, gt);
    enfant(p, 800, 735, { t: gt, pose: 'kneel', e: 'worried', lookY: .6, col: '#E8E4DC', col2: '#D8D4CC', armF: [.9, .3] }); p.restore();
  });
  cinemaEnd(c, gt, CUE.endcard, 'JOUR 3', 'Tu bois l\'eau du ruisseau ? OUI / NON');
};
