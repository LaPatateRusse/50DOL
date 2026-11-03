// Le Baby-phone — horreur complète en 1 partie (format cinéma : docs/BRIEF-STYLE-CINEMA.md, kits cinema.js + cinema-rig.js).
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;

// ---------- compteurs ----------
const breaths = gt => gt < CUE.b2 ? 1 : gt < CUE.b3 ? 2 : gt < CUE.b4 ? 3 : 4;
const lastBump = gt => [CUE.b4, CUE.b3, CUE.b2].find(t => gt >= t);
const clockAt = gt => gt < L(2) ? '22:41' : gt < L(5) ? '23:00' : '00:00';
const moonIcon = (c, x, y) => { c.save(); c.beginPath(); c.arc(x, y, 14, .6, Math.PI * 2 - .6, false); c.arc(x + 8, y - 4, 11, Math.PI * 2 - .9, .9, true); c.closePath(); c.fillStyle = '#C9D4FF'; c.fill(); c.restore(); };
function hud(c, gt) {
  const n = breaths(gt);
  cinemaHud(c, gt, { part: 'Le Baby-phone', off: gt > CUE.endcard, val: n + (n > 1 ? ' RESPIRATIONS' : ' RESPIRATION'), neg: n > 1, bump: lastBump(gt),
    sub: clockAt(gt), subIcon: moonIcon, hit: gt > L(5) ? L(5) + .2 : gt > L(2) ? L(2) + .2 : undefined });
}

// ---------- décors (repère 1920 × 1080) ----------
function living(p, gt, o = {}) {
  p.fillStyle = grad(p, 0, 800, ['#12142A', '#1A1C34']); p.fillRect(-400, -200, 2800, 1100);
  p.fillStyle = '#0E0F1E'; p.fillRect(-400, 800, 2800, 400);
  rr(p, 1320, 170, 300, 340, 4); fs(p, '#0A0E22', 0); glow(p, 1520, 250, 110, 'rgba(200,215,255,A)', .35);
  rr(p, 1310, 160, 320, 360, 4); fs(p, null, 10, '#2A2E4A');
  // télé = la seule source de lumière
  const fl = .8 + Math.sin(gt * 7) * .1 + Math.sin(gt * 13) * .06;
  rr(p, 160, 420, 420, 250, 10); fs(p, '#06070C', 0); rr(p, 175, 435, 390, 220, 6); fs(p, `rgba(120,170,255,${.55 * fl})`, 0);
  rr(p, 300, 670, 160, 24, 6); fs(p, '#1A1B26', 0); rr(p, 120, 694, 500, 110, 8); fs(p, '#1E1A22', 0);
  cone(p, 370, 545, 380, 1500, 700, 'rgba(120,170,255,A)', .12 * fl);
  glow(p, 370, 545, 420, 'rgba(120,170,255,A)', .3 * fl);
  if (o.eyes) eyesBehind(p, gt, o.eyes); // derrière le dossier du canapé
  // canapé
  rr(p, 820, 560, 820, 200, 40); fs(p, '#3A2E3E', 0); rr(p, 780, 640, 900, 170, 40); fs(p, '#4A3A4E', 0);
  rr(p, 760, 600, 90, 230, 30); fs(p, '#3A2E3E', 0); rr(p, 1610, 600, 90, 230, 30); fs(p, '#3A2E3E', 0);
  p.fillStyle = `rgba(120,170,255,${.08 * fl})`; p.fillRect(780, 640, 900, 30);
  // table basse + baby-phone
  rr(p, 900, 860, 520, 40, 8); fs(p, '#2A2026', 0);
  if (o.monitor !== false) monitorSmall(p, 1260, 845, gt);
}
function monitorSmall(p, x, y, gt) {
  rr(p, x - 46, y - 90, 92, 92, 14); fs(p, '#E6E8EE', 0); rr(p, x - 34, y - 78, 68, 44, 6); fs(p, '#0B1A12', 0);
  const n = breaths(gt); for (let i = 0; i < 5; i++) { circ(p, x - 26 + i * 13, y - 20, 4); fs(p, i < n ? '#FF5A4A' : '#3A3E48', 0); }
  line(p, [[x + 30, y - 90], [x + 40, y - 140]], 6, '#C9CCD6', null);
  glow(p, x, y - 56, 60, 'rgba(80,255,150,A)', .25);
}
// Les Respirants : formes pâles et plates derrière le canapé, seulement des yeux, qui « respirent ».
function eyesBehind(p, gt, k) {
  [[880, 0], [1420, .7], [1610, 1.3]].forEach(([x, ph], i) => {
    const a = clamp(k * 3 - i * .6); if (a <= 0) return;
    const rise = 90 * a + Math.sin(gt * 1.6 + ph) * 8;
    p.save(); p.globalAlpha = a;
    p.beginPath(); p.ellipse(x, 600 - rise, 80, 120, 0, Math.PI, 0); p.lineTo(x + 80, 720); p.lineTo(x - 80, 720); p.closePath(); fs(p, '#9EA2B0', 0); p.beginPath(); p.ellipse(x - 20, 560 - rise, 40, 90, 0, Math.PI, 0); p.fillStyle = 'rgba(255,255,255,.12)'; p.fill();
    [-1, 1].forEach(s => { p.beginPath(); p.ellipse(x + s * 30, 560 - rise, 20, 32 + Math.sin(gt * 1.6 + ph) * 4, 0, 0, Math.PI * 2); fs(p, '#06060A', 0); circ(p, x + s * 30, 556 - rise, 5); fs(p, '#FFE37A', 0); glow(p, x + s * 30, 556 - rise, 22, 'rgba(255,227,122,A)', .6); });
    p.restore();
  });
}
// Écran du baby-phone en gros plan (repère : coin haut-gauche, w × h).
const scrMonitor = (gt, zoomEmit) => (c, w, h) => {
  c.fillStyle = '#0B1A12'; c.fillRect(0, 0, w, h);
  text(c, clockAt(gt), w / 2, 90, '700 44px "Roboto Mono"', '#7CFFB0');
  c.beginPath(); for (let x = 0; x <= w - 60; x += 4) { const y = 300 + Math.sin(x * .05 + gt * 3) * 30 * (breaths(gt) || .3) + Math.sin(x * .13 + gt * 5) * 10; x ? c.lineTo(30 + x, y) : c.moveTo(30, y); } c.lineWidth = 4; c.strokeStyle = '#7CFFB0'; c.stroke();
  const n = breaths(gt);
  text(c, String(n), w / 2, 470, '900 150px Montserrat', n > 1 ? '#FF5A4A' : '#7CFFB0');
  text(c, n > 1 ? 'RESPIRATIONS' : 'RESPIRATION', w / 2, 560, '800 34px Montserrat', '#7CFFB0');
  text(c, 'Émetteur : SALON', w / 2, 680, zoomEmit ? '800 34px Montserrat' : '600 20px Montserrat', zoomEmit ? '#FFE37A' : 'rgba(124,255,176,.55)');
};
function stairs(p, gt) {
  p.fillStyle = grad(p, 0, 1080, ['#10122A', '#181A30']); p.fillRect(-400, -200, 2800, 1500);
  for (let i = 0; i < 9; i++) { rr(p, 500 + i * 110, 900 - i * 80, 900, 80, 4); fs(p, i % 2 ? '#2A2030' : '#30243A', 0); }
  line(p, [[480, 860], [1480, 180]], 14, '#4A3A40', null);
  rr(p, 1440, 60, 200, 300, 6); fs(p, '#2A2030', 0); p.fillStyle = 'rgba(255,220,160,.5)'; p.fillRect(1440, 355, 200, 6);
  glow(p, 1540, 360, 160, 'rgba(255,220,160,A)', .25);
}
function sisterBed(p, gt) {
  bedroomNight(p, gt, { clock: clockAt(gt) });
  circ(p, 380, 572, 52); fs(p, '#0E0E14', 0);
  p.lineCap = 'round'; p.strokeStyle = '#fff'; p.lineWidth = 5; [-1, 1].forEach(k => { p.beginPath(); p.moveTo(380 + k * 14 - 8, 570); p.lineTo(380 + k * 14 + 8, 570); p.stroke(); });
  p.beginPath(); p.arc(380, 572, 58, Math.PI * 1.0, Math.PI * 2.0); p.quadraticCurveTo(390, 540, 340, 548); p.quadraticCurveTo(325, 560, 322, 572); p.closePath(); p.fillStyle = '#6B3A2A'; p.fill(); circ(p, 330, 540, 22); fs(p, '#6B3A2A', 0);
  rr(p, 330, 590, 820, 140, 24); fs(p, '#E89AB0', 0); p.fillStyle = 'rgba(0,0,0,.08)'; p.fillRect(330, 590, 820, 14);
  rr(p, 1500, 380, 260, 440, 6); fs(p, '#2A2236', 0); line(p, [[1630, 390], [1630, 810]], 4, '#1A1424', null); // placard
}
function finCard(c, gt, at, q) {
  const k = pr(gt, at, at + .2); if (k <= 0) return;
  stage(c, p => {
    p.fillStyle = `rgba(5,6,10,${k})`; p.fillRect(0, 0, SW, SH);
    const b = pop(gt, at + .15, .45), qq = clamp((gt - at - .8) * 3);
    if (b) { p.save(); p.translate(SW / 2, 430); p.scale(b, b); text(p, 'FIN', 0, 0, '900 190px Montserrat', '#FF4B4B'); p.restore(); }
    if (qq > 0) { p.globalAlpha = qq; text(p, q, SW / 2, 700, '800 58px Montserrat', '#FFFFFF'); text(p, 'Dis-le en commentaire', SW / 2, 790, '700 38px Montserrat', '#9AA2BC'); }
  }, { vig: .3 });
}

// ---------- scènes ----------
SC.salon = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wide'], [at(0, .45), 'monitor'], [L(1), 'fridge'], [at(1, .55), 'note'], [L(2), 'face'], [at(2, .5), 'monitor2']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'wide') {
      p.save(); cam2(p, 1100 + dx, 600 + dy, push(st, 1.15, 1.25, 4)); living(p, gt);
      rig(p, { x: 1100, y: 830, s: .6, f: -1, t: gt, pose: 'sit', seat: 170 / .6, e: 'n', look: 1, armF: [.75, .85], armB: [.55, .85], light: -1, rim: 'rgba(150,190,255,.9)' });
      p.restore();
    } else if (shot === 'monitor' || shot === 'monitor2') {
      p.fillStyle = '#07080E'; p.fillRect(0, 0, SW, SH); glow(p, 960, 540, 600, 'rgba(120,255,170,A)', .12);
      const sh = shot === 'monitor2' && gt > CUE.b2 && gt < CUE.b2 + .6 ? Math.sin(gt * 90) * 8 : 0;
      phoneBig(p, 960 + sh, 560, .95 + st * .02, -.04, scrMonitor(gt, false), { hand: false, edge: '#C9CCD6' });
    } else if (shot === 'fridge') {
      p.save(); cam2(p, 960 + dx, 540 + dy, push(st, 1.1, 1.18, 3));
      p.fillStyle = grad(p, 0, 1080, ['#14182E', '#0C0E1C']); p.fillRect(-200, -200, 2400, 1500);
      rr(p, 620, 60, 680, 1000, 30); fs(p, '#C9CCD6', 0); line(p, [[640, 420], [1280, 420]], 6, '#9A9DA8', null); rr(p, 1220, 180, 26, 160, 12); fs(p, '#9A9DA8', 0);
      cone(p, 960, -60, 300, 900, 1100, 'rgba(200,220,255,A)', .12);
      rr(p, 780, 520, 300, 220, 4); fs(p, '#F2EAC8', 0); circ(p, 930, 520, 18); fs(p, '#D83A3A', 0);
      for (let i = 0; i < 4; i++) { p.fillStyle = 'rgba(40,40,60,.5)'; p.fillRect(810, 580 + i * 36, 220 - i * 30, 8); }
      p.restore();
    } else if (shot === 'note') {
      p.save(); cam2(p, 960, 540, push(st, 1, 1.08, 3)); p.fillStyle = '#B9BCC6'; p.fillRect(-200, -200, 2400, 1500);
      rr(p, 420, 160, 1080, 760, 6); fs(p, '#F2EAC8', 0); circ(p, 960, 170, 34); fs(p, '#D83A3A', 0);
      const T = ['Si le baby-phone compte', 'plus d\'UNE respiration…', 'ne monte pas.', '— Papa & Maman'];
      T.forEach((l, i) => { p.save(); p.globalAlpha = clamp((st - .2 - i * .35) * 2.5); text(p, l, 960, 340 + i * 150, i === 2 ? '800 italic 76px Montserrat' : '700 italic 60px Montserrat', i === 2 ? '#B3261E' : '#2A2A3A'); p.restore(); });
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 3)); p.fillStyle = '#0A0C18'; p.fillRect(-200, -200, 2400, 1500);
      glow(p, 300, 520, 600, 'rgba(120,170,255,A)', .3);
      bust(p, 1000, 600, 230, { t: gt, e: gt > CUE.b2 ? 'wide' : 'n', look: gt > CUE.b2 ? 1 : -1, lookY: gt > CUE.b2 ? .6 : 0, light: -1, rim: 'rgba(150,190,255,.9)' });
      p.restore();
    }
  });
};
SC.escalier = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'climb'], [at(3, .55), 'door']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, 1.4);
    if (shot === 'climb') {
      p.save(); cam2(p, 1000 + dx, 520 + dy, 1.15); stairs(p, gt);
      const k = clamp(st / 3) * .55;
      rig(p, { x: 640 + k * 600, y: 900 - k * 480, s: .55, f: 1, t: gt, pose: 'walk', walk: gt * 4, e: 'worried', light: 1, rim: 'rgba(255,220,160,.8)' });
      p.restore();
    } else {
      const op = eo(clamp((gt - CUE.creak + .3) * 1.2));
      p.save(); cam2(p, 960 + dx, 540 + dy, push(st, 1.1, 1.25, 3)); p.fillStyle = '#12142A'; p.fillRect(-200, -200, 2400, 1500);
      rr(p, 700, 100, 520, 980, 6); fs(p, '#0A0A14', 0);
      p.save(); p.translate(700, 100); p.scale(1 - op * .55, 1); rr(p, 0, 0, 520, 980, 6); fs(p, '#3A2E3E', 0); circ(p, 460, 520, 16); fs(p, '#C9A27A', 0); p.restore();
      if (op > .1) glow(p, 1000, 600, 300, 'rgba(255,150,190,A)', .15 * op);
      p.restore();
      blurred(p, 10, q => bust(q, 1600, 760, 270, { t: gt, look: -1, light: 1 }));
    }
  });
};
SC.chambre = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'room'], [at(4, .35), 'sister'], [at(4, .55), 'bed'], [at(4, .78), 'closet']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'room') {
      p.save(); cam2(p, 900 + dx, 560 + dy, push(st, 1.1, 1.18, 3)); sisterBed(p, gt);
      rig(p, { x: 1350, y: 835, s: .6, f: -1, t: gt, e: 'worried', light: -1 });
      p.restore();
    } else if (shot === 'sister') {
      p.save(); cam2(p, 470, 610, 2.2 + st * .03); sisterBed(p, gt); p.restore();
    } else if (shot === 'bed') {
      p.save(); cam2(p, 760, 760, 1.6); sisterBed(p, gt); p.restore();
      p.fillStyle = 'rgba(0,0,0,.35)'; p.fillRect(0, 0, SW, SH);
      cone(p, 1300, 360, 60, 700, 600, 'rgba(255,250,220,A)', .25); // lampe torche du téléphone
      rig(p, { x: 1500, y: 980, s: .7, f: -1, t: gt, pose: 'kneel', e: 'worried', lookY: .5, armF: [1.6, .1], light: 1 });
    } else {
      p.save(); cam2(p, 1600, 600, 1.7 + st * .03); sisterBed(p, gt);
      p.save(); p.translate(1500, 380); p.scale(1 - eo(clamp(st * 2)) * .5, 1); rr(p, 0, 0, 130, 440, 4); fs(p, '#3A3046', 0); p.restore();
      p.restore();
    }
  });
};
SC.retour = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'sit'], [at(5, .45), 'clock'], [at(5, .7), 'monitor']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'sit') {
      p.save(); cam2(p, 1100 + dx, 600 + dy, push(st, 1.2, 1.28, 3)); living(p, gt);
      rig(p, { x: lerp(1500, 1100, eo(clamp(st / 1.5))), y: 830, s: .6, f: -1, t: gt, pose: st < 1.5 ? 'walk' : 'sit', seat: 170 / .6, walk: gt * 6, e: 'worried', light: -1, rim: 'rgba(150,190,255,.9)' });
      p.restore();
    } else if (shot === 'clock') {
      p.fillStyle = '#05060A'; p.fillRect(0, 0, SW, SH);
      rr(p, 560, 360, 800, 340, 30); fs(p, '#0A0A0E', 0); text(p, '00:00', 960, 540, '700 220px "Roboto Mono"', '#FF3B3B'); glow(p, 960, 530, 500, 'rgba(255,60,60,A)', .2 + Math.sin(gt * 4) * .05);
    } else {
      p.fillStyle = '#07080E'; p.fillRect(0, 0, SW, SH); glow(p, 960, 540, 600, 'rgba(120,255,170,A)', .12);
      const sh = gt > CUE.b3 && gt < CUE.b3 + .6 ? Math.sin(gt * 90) * 8 : 0;
      phoneBig(p, 960 + sh, 560, .95 + st * .02, .03, scrMonitor(gt, false), { hand: false, edge: '#C9CCD6' });
    }
  });
};
SC.ecran = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'lean'], [at(6, .4), 'zoom'], [L(7), 'realize'], [at(7, .5), 'table']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'lean') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.12, 3)); p.fillStyle = '#0A0C18'; p.fillRect(-200, -200, 2400, 1500);
      glow(p, 960, 900, 500, 'rgba(120,255,170,A)', .25);
      bust(p, 960, 640, 230, { t: gt, e: 'n', lookY: .9, light: 1, rim: 'rgba(120,255,170,.7)', tilt: .1 });
      p.restore();
    } else if (shot === 'zoom') {
      p.fillStyle = '#07080E'; p.fillRect(0, 0, SW, SH); glow(p, 960, 540, 600, 'rgba(120,255,170,A)', .12);
      p.save(); cam2(p, 960, lerp(560, 860, eo(clamp(st / 1.2))), lerp(1, 1.9, eo(clamp(st / 1.2))));
      phoneBig(p, 960, 560, .95, 0, scrMonitor(gt, gt > CUE.emit - .4), { hand: false, edge: '#C9CCD6' });
      p.restore();
    } else if (shot === 'realize') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.15, 3)); p.fillStyle = '#0A0C18'; p.fillRect(-200, -200, 2400, 1500);
      glow(p, 300, 520, 600, 'rgba(120,170,255,A)', .3);
      bust(p, 1000, 600, 230, { t: gt, e: 'wide', mouth: 'o', sweat: true, light: -1, rim: 'rgba(150,190,255,.9)' });
      p.restore();
    } else {
      p.save(); cam2(p, 1120 + dx, 680 + dy, 1.55 + st * .04); living(p, gt); rig(p, { x: 1000, y: 830, s: .6, f: 1, t: gt, pose: 'sit', seat: 170 / .6, e: 'wide', lookY: .7, armF: [.75, .85], light: 1, rim: 'rgba(120,255,170,.7)' }); p.restore();
    }
  });
};
SC.fin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'monitor'], [at(8, .3), 'face'], [at(8, .62), 'reveal'], [L(9), 'back']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, 1.3);
    if (shot === 'monitor') {
      p.fillStyle = '#07080E'; p.fillRect(0, 0, SW, SH); glow(p, 960, 540, 600, 'rgba(255,90,74,A)', .12);
      const sh = gt > CUE.b4 && gt < CUE.b4 + .6 ? Math.sin(gt * 90) * 8 : 0;
      phoneBig(p, 960 + sh, 560, .95 + st * .03, -.03, scrMonitor(gt, true), { hand: false, edge: '#C9CCD6' });
    } else if (shot === 'face') {
      p.save(); cam2(p, 960, 560, push(st, 1.05, 1.2, 2)); p.fillStyle = '#0A0C18'; p.fillRect(-200, -200, 2400, 1500);
      glow(p, 300, 520, 600, 'rgba(120,170,255,A)', .3);
      bust(p, 960, 600, 240, { t: gt, e: 'side', look: 1, mouth: 'grit', sweat: true, light: -1, rim: 'rgba(150,190,255,.9)' });
      p.restore();
    } else {
      const k = shot === 'back' ? 1 : clamp((gt - CUE.eyes + 1.2) / 1.4);
      p.save(); cam2(p, 1200 + dx, 600 + dy, push(st, 1.25, 1.35, 4)); living(p, gt, { eyes: k });
      rig(p, { x: 1150, y: 830, s: .6, f: -1, t: gt, pose: 'sit', seat: 170 / .6, e: 'wide', look: -1, armF: [.75, .85], armB: [.55, .85], shake: true, light: -1, rim: 'rgba(150,190,255,.9)' });
      p.restore();
    }
  });
  finCard(c, gt, CUE.endcard, 'Toi, tu te serais retourné ?');
};
