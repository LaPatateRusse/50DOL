// Et si la Lune disparaissait cette nuit ? — « Et si… ? » science, format cinéma (docs/BRIEF-STYLE-CINEMA.md).
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const moonOn = gt => gt < CUE.gone;

// ---------- HUD : compteur qui change à chaque étape ----------
function step(gt) {
  if (gt < CUE.gone) return ['0,25 LUX', 'PLEINE LUNE', undefined, false];
  if (gt < L(3)) return ['0 LUX', 'MINUTE 1', CUE.gone, true];
  if (gt < L(5)) return ['MARÉE ÷ 3', gt < L(4) ? '6 HEURES' : '1 NUIT', L(3) + .2, true];
  if (gt < L(6)) return ['AXE : 23,4° → ?', '1 MILLION D\'ANS', L(5) + .2, true];
  return ['+3,8 CM / AN', 'AUJOURD\'HUI', CUE.far, false];
}
const clockIcon = (c, x, y) => { c.save(); circ(c, x, y, 14); fs(c, null, 4, '#C9D4FF'); line(c, [[x, y], [x, y - 9]], 4, '#C9D4FF', null); line(c, [[x, y], [x + 7, y + 3]], 4, '#C9D4FF', null); c.restore(); };
function hud(c, gt) {
  const [v, sub, bump, neg] = step(gt);
  cinemaHud(c, gt, { part: 'Et si la Lune disparaissait ?', off: gt > CUE.endcard, val: v, neg, bump, sub, subIcon: clockIcon });
}

// ---------- décors (repère 1920 × 1080) ----------
function sky(p, gt, o = {}) {
  p.fillStyle = grad(p, 0, 900, o.dark ? ['#020308', '#05070F'] : ['#0B1430', '#1A2850']); p.fillRect(-400, -200, 2800, 1300);
  const n = o.dark ? 260 : 70;
  for (let i = 0; i < n; i++) { const x = rnd(i) * 2400 - 200, y = rnd(i + 99) * 700 - 100, tw = .5 + .5 * Math.sin(gt * 2 + i); circ(p, x, y, (o.dark ? 1.6 : 1.2) + rnd(i + 7) * 1.8); p.fillStyle = `rgba(255,255,255,${(o.dark ? .55 : .3) + tw * .35})`; p.fill(); }
  if (o.dark) { p.save(); p.globalAlpha = .25; p.fillStyle = grad(p, 0, 700, ['rgba(160,140,255,0)', 'rgba(160,140,255,.35)', 'rgba(160,140,255,0)']); p.beginPath(); p.moveTo(200, -100); p.lineTo(700, -100); p.lineTo(1700, 800); p.lineTo(1200, 800); p.closePath(); p.fill(); p.restore(); } // voie lactée
  if (o.moon) { glow(p, 1450, 220, 320, 'rgba(230,235,255,A)', .5); circ(p, 1450, 220, 80); fs(p, '#ECEEF6', 0); [[1425, 200, 16], [1478, 240, 11], [1460, 190, 8]].forEach(([x, y, r]) => { circ(p, x, y, r); fs(p, '#D3D6E2', 0); }); }
  if (o.hole) { circ(p, 1450, 220, 80); fs(p, '#000', 0); }
}
function beach(p, gt, o = {}) {
  sky(p, gt, o);
  const tide = o.tide ?? 1, hz = 560, wy = lerp(900, 800, tide) + Math.sin(gt * 1.2) * 6;
  p.fillStyle = grad(p, hz, wy, o.dark ? ['#060A1A', '#0C1430'] : ['#16285A', '#22386E']); p.fillRect(-400, hz, 2800, wy - hz + 40);
  if (o.moon) { cone(p, 1450, hz, 60, 160, wy - hz, 'rgba(230,235,255,A)', .18); for (let i = 0; i < 12; i++) { const w = 30 + 40 * Math.abs(Math.sin(gt * 1.7 + i * 1.3)); p.fillStyle = 'rgba(240,244,255,.45)'; p.fillRect(1450 - w / 2 + Math.sin(gt * 2 + i) * 14, hz + 14 + i * 22, w, 4); } }
  for (let i = 0; i < 8; i++) { p.fillStyle = `rgba(255,255,255,${o.dark ? .06 : .14})`; p.fillRect(-300 + ((i * 410 + gt * 40) % 2600), hz + 40 + i * 30, 220, 3); }
  p.fillStyle = o.dark ? '#1A1820' : '#5A5068'; p.beginPath(); p.moveTo(-400, wy); p.quadraticCurveTo(960, wy - 30, 2400, wy); p.lineTo(2400, 1200); p.lineTo(-400, 1200); p.closePath(); p.fill();
  p.fillStyle = o.dark ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.3)'; p.beginPath(); p.moveTo(-400, wy); p.quadraticCurveTo(960, wy - 30, 2400, wy); p.lineWidth = 6; p.strokeStyle = p.fillStyle; p.stroke();
}
function rock(p, x, y, dark) { p.beginPath(); p.ellipse(x, y - 40, 120, 70, 0, Math.PI, 0); p.closePath(); fs(p, dark ? '#24222C' : '#4A4458', 0); p.beginPath(); p.ellipse(x - 30, y - 80, 60, 20, -.2, 0, Math.PI * 2); fs(p, 'rgba(255,255,255,.08)', 0); }
function turtle(p, x, y, s, f, gt, k) {
  p.save(); p.translate(x, y); p.scale(s * f, s);
  const w = Math.sin(gt * 10 + k) * .4;
  [[-22, -10, w], [22, -10, -w], [-18, 14, -w], [18, 14, w]].forEach(([fx, fy, a]) => { p.save(); p.translate(fx, fy); p.rotate(a + (fx < 0 ? -.6 : .6)); p.beginPath(); p.ellipse(0, 0, 18, 7, 0, 0, Math.PI * 2); fs(p, '#4A6A4A', 0); p.restore(); });
  p.beginPath(); p.ellipse(0, 0, 26, 20, 0, 0, Math.PI * 2); fs(p, '#5A7A4E', 0); p.beginPath(); p.ellipse(-4, -3, 16, 12, 0, 0, Math.PI * 2); fs(p, '#6E8E5E', 0);
  circ(p, 30, 0, 9); fs(p, '#4A6A4A', 0); circ(p, 33, -3, 2.5); fs(p, '#0A0A10', 0);
  p.restore();
}
function cityLights(p, gt) {
  for (let i = 0; i < 7; i++) { const x = -260 + i * 120; line(p, [[x, 760], [x, 520]], 8, '#2A2830', null); circ(p, x, 515, 12); fs(p, '#FFE0A0', 0); glow(p, x, 515, 90, 'rgba(255,210,140,A)', .5); }
  for (let i = 0; i < 10; i++) { p.fillStyle = 'rgba(255,210,140,.6)'; p.fillRect(-380 + i * 60, 600 + (i % 3) * 30, 18, 24); }
}
function globe(p, x, y, r, tilt, gt) {
  glow(p, x, y, r * 1.6, 'rgba(120,170,255,A)', .25);
  p.save(); p.translate(x, y); p.rotate(tilt);
  circ(p, 0, 0, r); fs(p, '#1E5BB0', 0);
  p.save(); circ(p, 0, 0, r); p.clip();
  [[-.3, -.2, .5, .32], [.35, .15, .4, .25], [-.05, .45, .3, .18], [.1, -.55, .35, .2]].forEach(([a, b, w, h], i) => { const sx = ((a + gt * .05 + 1.5) % 2 - 1) * r; p.beginPath(); p.ellipse(sx, b * r, w * r, h * r, .3, 0, Math.PI * 2); fs(p, '#3E9B5A', 0); });
  p.beginPath(); p.ellipse(0, -r * .92, r * .5, r * .16, 0, 0, Math.PI * 2); fs(p, '#EEF4FF', 0);
  p.fillStyle = 'rgba(0,0,0,.35)'; p.fillRect(r * .15, -r, r, r * 2);
  p.restore();
  line(p, [[0, -r * 1.35], [0, r * 1.35]], 6, '#FFD23F', null);
  p.restore();
}
function finCard(c, gt, at, q) {
  const k = pr(gt, at, at + .2); if (k <= 0) return;
  stage(c, p => {
    p.fillStyle = `rgba(5,6,10,${k})`; p.fillRect(0, 0, SW, SH);
    const b = pop(gt, at + .15, .45), qq = clamp((gt - at - .8) * 3);
    if (b) { p.save(); p.translate(SW / 2, 420); p.scale(b, b); text(p, 'ET SI… ?', 0, 0, '900 170px Montserrat', '#F5B82E'); p.restore(); }
    if (qq > 0) { p.globalAlpha = qq; text(p, q, SW / 2, 690, '800 56px Montserrat', '#FFFFFF'); text(p, 'Dis-le en commentaire', SW / 2, 780, '700 38px Montserrat', '#9AA2BC'); }
  }, { vig: .3 });
}

// ---------- scènes ----------
SC.plage = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wide'], [at(0, .4), 'face'], [at(0, .7), 'moon'], [L(1), 'hole'], [at(1, .55), 'wide2']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'wide' || shot === 'wide2') {
      const on = moonOn(gt);
      p.save(); cam2(p, 1100 + dx, 560 + dy, push(st, 1.1, 1.18, 4)); beach(p, gt, { moon: on, hole: !on, dark: !on }); rock(p, 800, 905, !on);
      rig(p, { x: 760, y: 900, s: .55, f: 1, t: gt, pose: 'sit', seat: 120 / .55, e: on ? 'n' : 'wide', lookY: -.6, look: 1, armF: [.75, .85], armB: [.55, .85], light: 1, rim: on ? 'rgba(230,235,255,.9)' : 'rgba(80,90,130,.6)' });
      p.restore();
    } else if (shot === 'face') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); sky(p, gt, { moon: true });
      bust(p, 900, 640, 220, { t: gt, e: 'happy', mouth: 'smile', lookY: -.5, look: 1, light: 1, rim: 'rgba(230,235,255,.95)' });
      p.restore();
    } else if (shot === 'moon') {
      const k = clamp((gt - CUE.gone + .4) / .4);
      p.save(); cam2(p, 1450, 230, 2.4 + st * .05); sky(p, gt, { moon: k < 1, dark: k >= 1, hole: k >= 1 });
      if (k > 0 && k < 1) { p.fillStyle = `rgba(255,255,255,${1 - k})`; p.fillRect(0, -200, 2400, 1400); }
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 3)); sky(p, gt, { dark: true });
      bust(p, 960, 640, 230, { t: gt, e: 'wide', mouth: 'o', lookY: -.6, light: 1, rim: 'rgba(80,90,130,.7)' });
      p.restore();
    }
  });
};
SC.nuit = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'black'], [at(2, .3), 'hands'], [at(2, .58), 'stars'], [at(2, .82), 'face']]);
  film(c, gt, p => {
    if (shot === 'black') {
      p.save(); cam2(p, 960, 560, 1.2); beach(p, gt, { dark: true }); p.restore();
      p.fillStyle = 'rgba(0,0,0,.6)'; p.fillRect(0, 0, SW, SH);
    } else if (shot === 'hands') {
      p.fillStyle = '#020306'; p.fillRect(0, 0, SW, SH);
      const bl = ((gt * .9) % 3.4) < .12; [-1, 1].forEach(k => { p.beginPath(); p.ellipse(960 + k * 70 + Math.sin(gt) * 20, 520, 26, bl ? 3 : 40, 0, 0, Math.PI * 2); fs(p, '#fff', 0); });
    } else if (shot === 'stars') {
      p.save(); cam2(p, 960, 380, push(st, 1, 1.15, 3)); sky(p, gt, { dark: true }); p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.06, 2)); sky(p, gt, { dark: true });
      bust(p, 960, 650, 230, { t: gt, e: 'happy', mouth: 'smile', lookY: -.6, light: 1, rim: 'rgba(160,170,255,.7)' });
      p.restore();
    }
  });
};
SC.maree = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'shore'], [at(3, .4), 'gauge'], [at(3, .7), 'wide']]);
  const k = eo(clamp((gt - CUE.tide) / 3));
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'shore' || shot === 'wide') {
      p.save(); cam2(p, 960 + dx, 620 + dy, shot === 'wide' ? 1.05 : 1.3); beach(p, gt, { dark: true, tide: lerp(0, .33, k) });
      rig(p, { x: 1300, y: 900, s: .55, f: -1, t: gt, e: 'worried', lookY: .3, light: -1, rim: 'rgba(120,140,200,.7)' });
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); p.fillStyle = '#05070F'; p.fillRect(-200, -200, 2400, 1500);
      rr(p, 900, 80, 120, 940, 8); fs(p, '#E8E4D8', 0);
      for (let m = 0; m <= 9; m++) { const y = 980 - m * 95; p.fillStyle = '#2A2A3A'; p.fillRect(900, y, m % 3 ? 40 : 80, 6); text(p, m + ' m', 1060, y + 4, '700 34px Montserrat', '#E8E4D8', 'left'); }
      const normal = 980 - 9 * 95, now = 980 - 3 * 95 * k;
      p.setLineDash([16, 12]); line(p, [[700, normal], [1220, normal]], 5, 'rgba(255,255,255,.6)', null); p.setLineDash([]);
      text(p, 'AVEC LA LUNE', 690, normal - 4, '800 30px Montserrat', 'rgba(255,255,255,.7)', 'right');
      p.fillStyle = 'rgba(40,110,220,.55)'; p.fillRect(600, now, 720, 1000 - now);
      text(p, 'SANS', 690, now - 16, '800 34px Montserrat', '#7FB2FF', 'right');
      p.restore();
    }
  });
};
SC.tortues = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'nest'], [at(4, .35), 'close'], [at(4, .65), 'lights']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'nest') {
      p.save(); cam2(p, 960 + dx, 760 + dy, 1.6 + st * .03); beach(p, gt, { dark: true, tide: .3 });
      for (let i = 0; i < 6; i++) { const k = clamp(st / 2.5 - i * .08); turtle(p, 960 + (i - 3) * 60 - k * 120, 900 + (i % 2) * 30 - k * 10, .9, -1, gt, i); }
      p.restore();
    } else if (shot === 'close') {
      p.save(); cam2(p, 960, 900, 3.2); beach(p, gt, { dark: true, tide: .3 });
      turtle(p, 1000 - st * 40, 905, 1.2, -1, gt, 1);
      p.restore();
    } else {
      p.save(); cam2(p, 500 + dx, 650 + dy, 1.2); beach(p, gt, { dark: true, tide: .3 }); cityLights(p, gt);
      for (let i = 0; i < 8; i++) turtle(p, 900 + i * 70 - st * 90, 880 + (i % 3) * 25, .7, -1, gt, i);
      p.restore();
    }
  });
};
SC.axe = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'space'], [at(5, .45), 'tilt'], [at(5, .75), 'face']]);
  film(c, gt, p => {
    if (shot === 'space' || shot === 'tilt') {
      p.save(); cam2(p, 960, 540, push(st, 1, 1.1, 4)); sky(p, gt, { dark: true });
      const wob = shot === 'tilt' ? Math.sin(gt * 1.6) * .7 + Math.sin(gt * 3.1) * .25 : 0;
      globe(p, 960, 540, 300, .41 + wob, gt);
      if (shot === 'space') { circ(p, 1500, 300, 40); fs(p, null, 4, 'rgba(255,255,255,.35)'); p.setLineDash([10, 10]); circ(p, 960, 540, 560); fs(p, null, 3, 'rgba(255,255,255,.15)'); p.setLineDash([]); }
      text(p, shot === 'tilt' ? Math.round(23 + Math.abs(wob) * 60) + '°' : '23,4°', 1500, 820, '900 90px Montserrat', shot === 'tilt' ? '#FF4B4B' : '#FFD23F');
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); sky(p, gt, { dark: true });
      bust(p, 960, 640, 230, { t: gt, e: 'worried', sweat: true, light: -1, rim: 'rgba(120,170,255,.8)' });
      p.restore();
    }
  });
};
SC.fin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'back'], [at(6, .45), 'far'], [L(7), 'face']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'back') {
      p.save(); cam2(p, 1100 + dx, 560 + dy, push(st, 1.1, 1.18, 3)); beach(p, gt, { moon: true }); rock(p, 800, 905, false);
      rig(p, { x: 760, y: 900, s: .55, f: 1, t: gt, pose: 'sit', seat: 120 / .55, e: 'happy', mouth: 'smile', lookY: -.6, look: 1, armF: [.75, .85], armB: [.55, .85], light: 1, rim: 'rgba(230,235,255,.9)' });
      p.restore();
    } else if (shot === 'far') {
      p.save(); cam2(p, 960, 540, 1); sky(p, gt, { dark: true });
      globe(p, 420, 560, 150, .41, gt);
      const mx = lerp(1300, 1560, eo(clamp(st / 2.5)));
      circ(p, mx, 560, 46); fs(p, '#ECEEF6', 0); glow(p, mx, 560, 120, 'rgba(230,235,255,A)', .4);
      line(p, [[580, 700], [mx, 700]], 4, '#FFD23F', null); line(p, [[1300, 680], [1300, 720]], 4, '#FFD23F', null); line(p, [[mx, 680], [mx, 720]], 4, '#FFD23F', null);
      text(p, '+3,8 cm / an', (1300 + mx) / 2 + 60, 770, '800 46px Montserrat', '#FFD23F');
      text(p, '384 400 km', 940, 650, '700 40px Montserrat', 'rgba(255,255,255,.75)');
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.06, 2)); sky(p, gt, { moon: true });
      bust(p, 900, 640, 220, { t: gt, e: 'happy', mouth: 'smile', look: 1, lookY: -.4, light: 1, rim: 'rgba(230,235,255,.95)' });
      p.restore();
    }
  });
  finCard(c, gt, CUE.endcard, 'Quelle question pour le prochain « Et si » ?');
};
