// Le secret du gâteau — format « Le secret de… » n°2 (directives agent stratège), style cinéma (cinema.js + cinema-rig.js).
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const SIS = '#9B6BD6', SIS2 = '#7E52B8', GRAN = '#7A6AA8', GRAN2 = '#62548C', NURSE = '#E8ECF2', NURSE2 = '#C9CFD8', MATE1 = '#E05B8B', MATE2 = '#5BBF7A';

const sisHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); c.fillStyle = '#5A3420';
  c.beginPath(); c.arc(0, 0, r * 1.06, Math.PI * 1.0, Math.PI * 2.0); c.quadraticCurveTo(r * .3, -r * .62, -r * .2, -r * .58); c.quadraticCurveTo(-r * .8, -r * .45, -r * 1.06, 0); c.closePath(); c.fill();
  [-1, 1].forEach(k => { c.beginPath(); c.ellipse(k * r * 1.12, r * .15, r * .26, r * .42, k * .3, 0, Math.PI * 2); c.fill(); }); c.restore(); }; // couettes
const granHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, 0, r * 1.05, Math.PI * .95, Math.PI * 2.05); c.lineWidth = r * .24; c.strokeStyle = '#E6E6EE'; c.stroke();
  circ(c, -r * .7, -r * .85, r * .34); fs(c, '#E6E6EE', 0);
  c.lineWidth = r * .05; c.strokeStyle = '#E8C46A'; [r * .0, r * .5].forEach(x => { circ(c, x, -r * .05, r * .2); c.stroke(); }); c.restore(); };
const capNurse = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); rr(c, -r * .6, -r * 1.25, r * 1.2, r * .4, r * .1); fs(c, '#FFFFFF', 0); c.fillStyle = '#E53935'; c.fillRect(-r * .08, -r * 1.2, r * .16, r * .3); c.fillRect(-r * .18, -r * 1.1, r * .36, r * .1); c.restore(); };
const capHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .1, r * 1.03, Math.PI * 1.02, Math.PI * 1.98); c.closePath(); fs(c, '#D83A3A', 0);
  rr(c, r * .2, -r * .45, r * 1.05, r * .2, r * .1); fs(c, '#B02828', 0); c.restore(); };
// petit paquet serviette (fermé) ou gâteau déplié
function bundle(c, x, y, s, open) {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (!open) { rr(c, -110, 10, 220, 40, 10); fs(c, '#F4F4F8', 0); c.beginPath(); c.moveTo(-70, 20); c.quadraticCurveTo(0, -80, 70, 20); c.closePath(); fs(c, '#E6E6EE', 0); line(c, [[-25, -10], [25, -32]], 4, '#C9CED8', null); line(c, [[-110, 30], [-70, 18]], 4, '#C9CED8', null); line(c, [[110, 30], [70, 18]], 4, '#C9CED8', null); }
  else { rr(c, -110, 10, 220, 40, 10); fs(c, '#F4F4F8', 0); c.beginPath(); c.moveTo(-50, 20); c.lineTo(50, 20); c.lineTo(30, -40); c.lineTo(-50, -40); c.closePath(); fs(c, '#F2C6A0', 0); rr(c, -50, -54, 80, 18, 6); fs(c, '#F59AB8', 0); circ(c, 0, -60, 9); fs(c, '#E53935', 0); }
  c.restore();
}
const holdBundle = (q, x, y) => bundle(q, x + 6, y - 22, .55, false);

// ---------- HUD ----------
function hud(c, gt) {
  const day = gt < L(1) ? undefined : gt < L(9) ? 1 : 2;
  const known = gt > CUE.days;
  cinemaHud(c, gt, { part: 'Le secret du gâteau', off: gt > CUE.endcard, day, dayAt: day === 2 ? L(9) : L(1),
    val: known ? '214 GÂTEAUX GARDÉS' : 'GÂTEAUX GARDÉS : ?', neg: !known, bump: known ? CUE.days : undefined });
}

// ---------- décors ----------
function canteen(p, gt) {
  p.fillStyle = grad(p, 0, 760, ['#D9D2C0', '#C9C0AA']); p.fillRect(-400, -200, 2800, 1000);
  for (let i = 0; i < 5; i++) { rr(p, -100 + i * 450, 160, 300, 260, 8); fs(p, '#BFE3F7', 0); rr(p, -110 + i * 450, 150, 320, 280, 8); fs(p, null, 10, '#9A8E78'); }
  cone(p, 760, 420, 300, 900, 500, 'rgba(255,250,230,A)', .18);
  p.fillStyle = '#8C7E66'; p.fillRect(-400, 760, 2800, 500);
  rr(p, 200, 640, 1500, 40, 8); fs(p, '#E8DCC4', 0);
  rr(p, -400, 735, 2800, 26, 6); fs(p, '#6A5A44', 0); [100, 600, 1100, 1600].forEach(x => { p.fillStyle = '#4A3E2E'; p.fillRect(x, 760, 18, 75); }); // banc line(p, [[260, 680], [260, 820]], 14, '#6A5E4A', null); line(p, [[1640, 680], [1640, 820]], 14, '#6A5E4A', null);
  [[420, '#E05B4B'], [820, '#5B8BE0'], [1220, '#5BBF7A']].forEach(([x, col]) => { rr(p, x - 90, 616, 180, 28, 8); fs(p, '#C9CED8', 0); circ(p, x - 30, 614, 26); fs(p, col, 0); });
}
function eveningStreet(p, gt) { streetNight(p, gt, { lampX: 700 }); p.fillStyle = 'rgba(255,170,110,.12)'; p.fillRect(-400, -200, 2800, 1400); }
function residence(p, gt) {
  p.fillStyle = grad(p, 0, 900, ['#2A2A48', '#4A3A58']); p.fillRect(-400, -200, 2800, 1400);
  rr(p, 300, 180, 1400, 640, 6); fs(p, '#C9B89A', 0); rr(p, 280, 150, 1440, 50, 6); fs(p, '#7A5A48', 0);
  rr(p, 650, 230, 620, 70, 8); fs(p, '#2F5D4A', 0); text(p, 'RÉSIDENCE LES TILLEULS', 960, 266, '800 36px Montserrat', '#FFFFFF');
  for (let i = 0; i < 4; i++) for (let r = 0; r < 2; r++) { const lit = (i + r) % 3 === 0; rr(p, 380 + i * 340, 340 + r * 220, 200, 150, 6); fs(p, lit ? '#FFD9A0' : '#5A6478', 0); if (lit) glow(p, 480 + i * 340, 415 + r * 220, 160, 'rgba(255,210,150,A)', .35); }
  rr(p, 880, 600, 160, 220, 6); fs(p, '#3A2A24', 0);
  p.fillStyle = '#2A2A30'; p.fillRect(-400, 820, 2800, 400);
}
function room(p, gt) {
  p.fillStyle = grad(p, 0, 780, ['#E8D8C0', '#D8C4A8']); p.fillRect(-400, -200, 2800, 1000);
  wallpaper(p, -400, -200, 2800, 980, 'rgba(0,0,0,0)', 'rgba(150,110,80,.12)');
  rr(p, 1250, 160, 360, 320, 6); fs(p, '#3A4A6A', 0); rr(p, 1240, 150, 380, 340, 6); fs(p, null, 12, '#F4EEE4'); glow(p, 1430, 300, 220, 'rgba(255,200,150,A)', .3);
  frame(p, 500, 200, 200, 240, (q, x, y) => { q.fillStyle = '#E8C080'; q.fillRect(x - 90, y - 110, 180, 220); circ(q, x - 30, y + 10, 34); fs(q, '#0E0E14', 0); circ(q, x + 30, y + 30, 24); fs(q, '#0E0E14', 0); });
  p.fillStyle = '#9A7A5A'; p.fillRect(-400, 780, 2800, 400);
  rr(p, 150, 560, 420, 260, 30); fs(p, '#8A4A5A', 0); rr(p, 120, 640, 80, 200, 30); fs(p, '#7A3A4A', 0); rr(p, 520, 640, 80, 200, 30); fs(p, '#7A3A4A', 0); // fauteuil
  lamp(p, 900, 40, 300);
}
function finCard(c, gt, at, q) {
  const k = pr(gt, at, at + .2); if (k <= 0) return;
  stage(c, p => {
    p.fillStyle = `rgba(5,6,10,${k})`; p.fillRect(0, 0, SW, SH);
    const b = pop(gt, at + .15, .45), qq = clamp((gt - at - .8) * 3);
    if (b) { p.save(); p.translate(SW / 2, 430); p.scale(b, b); text(p, 'FIN', 0, 0, '900 190px Montserrat', '#F5B82E'); p.restore(); }
    if (qq > 0) { p.globalAlpha = qq; text(p, q, SW / 2, 700, '800 58px Montserrat', '#FFFFFF'); text(p, 'Dis-le en commentaire', SW / 2, 790, '700 38px Montserrat', '#9AA2BC'); }
  }, { vig: .3 });
}
const sister = (p, x, y, o = {}) => rig(p, { x, y, s: .42, seat: 100 / .42, f: o.f || 1, t: o.t, pose: o.pose, walk: o.walk, col: SIS, col2: SIS2, hair: sisHair, e: o.e || 'n', mouth: o.mouth, lookY: o.lookY, armF: o.armF, armB: o.armB, holdF: o.holdF, seed: 3, light: o.light ?? 1 });

// ---------- scènes ----------
SC.flash = (c, lt, gt) => {
  film(c, gt, p => {
    p.fillStyle = grad(p, 0, 1080, ['#2A2420', '#0E0C0A']); p.fillRect(0, 0, SW, SH); glow(p, 960, 560, 600, 'rgba(255,220,170,A)', .25);
    p.save(); cam2(p, 960, 560, push(lt, 1.1, 1.3, 3));
    const k = eo(clamp(lt / 1.2));
    hand(p, lerp(360, 480, k), 700, 1.1, -.15, { sleeve: SIS, cuff: SIS2 }); hand(p, lerp(1560, 1440, k), 700, 1.1, Math.PI + .15, { sleeve: SIS, cuff: SIS2 });
    bundle(p, 960, 640, 3.2, lt < 1.6);
    p.restore();
  });
};
SC.cantine = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wide'], [at(1, .6), 'wrap'], [L(2), 'kids'], [L(3), 'me'], [at(3, .5), 'away']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'wide' || shot === 'away') {
      p.save(); cam2(p, 900 + dx, 560 + dy, push(st, 1.15, 1.22, 3)); canteen(p, gt);
      sister(p, 820, 835, { t: gt, pose: 'sit', e: 'n', lookY: .5, armF: [1.0, .6], armB: [.75, .85], holdF: gt > CUE.wrap ? holdBundle : undefined });
      rig(p, { x: shot === 'away' ? lerp(1300, 1600, eo(clamp(st / 1.5))) : 1300, y: 835, s: .58, f: shot === 'away' ? 1 : -1, t: gt, pose: shot === 'away' ? 'walk' : 'stand', walk: gt * 6, e: shot === 'away' ? 'sad' : 'n', lookY: shot === 'away' ? .5 : 0, light: -1 });
      p.restore();
    } else if (shot === 'wrap') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 2)); canteen(p, gt); p.restore();
      p.fillStyle = 'rgba(0,0,0,.25)'; p.fillRect(0, 0, SW, SH);
      hand(p, 470, 720, 1, -.15, { sleeve: SIS, cuff: SIS2 }); hand(p, 1450, 720, 1, Math.PI + .15, { sleeve: SIS, cuff: SIS2 }); bundle(p, 960, 660, 2.4, st < .8);
    } else if (shot === 'kids') {
      p.save(); cam2(p, 1000 + dx, 560 + dy, 1.35); canteen(p, gt);
      [[700, MATE1, null], [920, MATE2, capHair], [1140, '#E5A23A', null]].forEach(([x, col, hair], i) => rig(p, { x, y: 835, s: .5, f: i === 2 ? -1 : 1, t: gt, pose: 'sit', seat: 100 / .5, armF: [.75, .85], armB: [.75, .85], col, col2: col, hair, e: gt > CUE.laugh ? 'happy' : 'side', mouth: gt > CUE.laugh ? 'smile' : undefined, talk: gt > CUE.laugh && i === 1, seed: 6 + i, light: 1 }));
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); canteen(p, gt); p.restore();
      blurred(p, 8, q => { q.fillStyle = 'rgba(0,0,0,.2)'; q.fillRect(0, 0, SW, SH); });
      bust(p, 960, 640, 230, { t: gt, e: 'side', look: -1, sweat: true, light: 1 });
    }
  });
};
SC.rue = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'follow'], [at(4, .55), 'corner'], [L(5), 'home'], [at(5, .55), 'window']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, 1.3);
    if (shot === 'follow' || shot === 'corner') {
      p.save(); cam2(p, (shot === 'corner' ? 1100 : 900) + dx, 600 + dy, shot === 'corner' ? 1.4 : 1.15); eveningStreet(p, gt);
      const k = clamp(st / 2.5);
      sister(p, lerp(900, 1500, k), 835, { t: gt, pose: 'walk', walk: gt * 8, holdF: holdBundle, light: -1 });
      if (shot === 'follow') rig(p, { x: lerp(300, 700, k), y: 835, s: .58, f: 1, t: gt, pose: 'walk', walk: gt * 6, e: 'side', look: 1, light: 1 });
      p.restore();
    } else if (shot === 'home') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.05, 1.15, 3)); residence(p, gt);
      sister(p, lerp(700, 960, eo(clamp(st / 1.6))), 830, { t: gt, pose: st < 1.6 ? 'walk' : 'stand', walk: gt * 8, holdF: holdBundle, f: 1, light: -1 });
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 3)); room(p, gt);
      rig(p, { x: 380, y: 835, s: .6, f: 1, t: gt, pose: 'sit', seat: 160 / .6, col: GRAN, col2: GRAN2, hair: granHair, armF: [.75, .85], armB: [.75, .85], e: 'n', lookY: .3, seed: 9, light: 1 });
      p.restore();
      p.fillStyle = 'rgba(20,24,40,.35)'; p.fillRect(0, 0, SW, SH); // vitre
      p.save(); p.globalAlpha = .18; p.fillStyle = '#FFFFFF'; p.beginPath(); p.moveTo(200, 0); p.lineTo(500, 0); p.lineTo(200, 1080); p.lineTo(-100, 1080); p.closePath(); p.fill(); p.restore();
      blurred(p, 10, q => bust(q, 1650, 760, 260, { t: gt, look: -1, light: -1 }));
    }
  });
};
SC.chambre = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'gran'], [at(6, .6), 'wide'], [L(7), 'open'], [at(7, .4), 'smile'], [L(8), 'nurse'], [at(8, .6), 'me']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'gran') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); room(p, gt);
      bust(p, 960, 640, 230, { t: gt, col: GRAN, col2: GRAN2, hair: granHair, e: 'n', look: 1, lookY: .2, seed: 9, light: 1 });
      p.restore();
    } else if (shot === 'wide') {
      p.save(); cam2(p, 700 + dx, 600 + dy, push(st, 1.15, 1.22, 3)); room(p, gt);
      rig(p, { x: 380, y: 835, s: .6, f: 1, t: gt, pose: 'sit', seat: 160 / .6, col: GRAN, col2: GRAN2, hair: granHair, armF: [.75, .85], armB: [.75, .85], e: 'n', seed: 9, light: 1 });
      sister(p, 720, 835, { t: gt, f: -1, armF: [1.2, .3], holdF: holdBundle, light: -1 });
      p.restore();
    } else if (shot === 'open') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 2)); room(p, gt); p.restore();
      p.fillStyle = 'rgba(0,0,0,.2)'; p.fillRect(0, 0, SW, SH);
      hand(p, 440, 700, 1, -.15, { sleeve: SIS, cuff: SIS2 }); hand(p, 1480, 700, 1, Math.PI + .15, { sleeve: SIS, cuff: SIS2 }); bundle(p, 960, 640, 2.6, gt > CUE.open);
    } else if (shot === 'smile') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); room(p, gt);
      const on = gt > CUE.smile; if (on) glow(p, 960, 560, 500, 'rgba(255,220,160,A)', .3);
      bust(p, 960, 640, 230, { t: gt, col: GRAN, col2: GRAN2, hair: granHair, e: on ? 'happy' : 'n', mouth: on ? 'smile' : undefined, talk: talking(gt, at(7, .55), E(7)), seed: 9, light: 1 });
      p.restore();
    } else if (shot === 'nurse') {
      p.save(); cam2(p, 1100 + dx, 600 + dy, 1.4); room(p, gt);
      rig(p, { x: 1300, y: 835, s: .64, f: -1, t: gt, col: NURSE, col2: NURSE2, hair: capNurse, e: 'n', mouth: 'smile', talk: talking(gt, at(8, .2), E(8)), seed: 11, light: -1 });
      rig(p, { x: 980, y: 835, s: .58, f: 1, t: gt, e: 'sad', lookY: .2, light: 1 });
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); room(p, gt); p.restore();
      blurred(p, 8, q => { q.fillStyle = 'rgba(0,0,0,.2)'; q.fillRect(0, 0, SW, SH); });
      bust(p, 960, 640, 230, { t: gt, e: 'sad', mouth: 'smile', sweat: false, light: 1 });
    }
  });
};
SC.fin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wrapMe'], [at(9, .55), 'sit'], [L(10), 'wide']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'wrapMe') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 2)); canteen(p, gt); p.restore();
      p.fillStyle = 'rgba(0,0,0,.2)'; p.fillRect(0, 0, SW, SH);
      hand(p, 470, 720, 1, -.15, {}); hand(p, 1450, 720, 1, Math.PI + .15, {}); bundle(p, 960, 660, 2.4, st < 1.2);
    } else {
      p.save(); cam2(p, 900 + dx, 560 + dy, shot === 'wide' ? push(st, 1.3, 1.15, 3) : push(st, 1.15, 1.22, 3)); canteen(p, gt);
      sister(p, 800, 835, { t: gt, pose: 'sit', e: gt > CUE.sit ? 'happy' : 'n', mouth: gt > CUE.sit ? 'smile' : undefined, armF: [1.0, .6], holdF: holdBundle });
      rig(p, { x: shot === 'sit' ? lerp(1400, 1000, eo(clamp(st / 1.5))) : 1000, y: 835, s: .58, f: -1, t: gt, pose: shot === 'sit' && st < 1.5 ? 'walk' : 'sit', seat: 100 / .58, walk: gt * 6, e: 'happy', mouth: 'smile', armF: [1.0, .6], holdF: holdBundle, light: -1 });
      p.restore();
    }
  });
  finCard(c, gt, CUE.endcard, 'Et toi… tu aurais fait pareil ?');
};
