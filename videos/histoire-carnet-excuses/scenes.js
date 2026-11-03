// Le Carnet des excuses — histoire complète en 1 partie (format cinéma : docs/BRIEF-STYLE-CINEMA.md, kits cinema.js + cinema-rig.js).
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const MOM = '#B5446E', MOM2 = '#93365A', POTE = '#3D7BD8', POTE2 = '#2C5FAE', GRAN = '#7A6AA8', GRAN2 = '#62548C', PROF = '#5E7D5A', PROF2 = '#4A6447', PAPY = '#8FA3B8', PAPY2 = '#72869B';

// ---------- coiffures (repère de la tête : centre hc, rayon r) ----------
const momHair = gray => (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); c.fillStyle = '#4A2E22';
  circ(c, -r * .62, -r * .9, r * .38); c.fill(); c.beginPath(); c.arc(0, 0, r * 1.07, Math.PI * 1.0, Math.PI * 1.95); c.quadraticCurveTo(r * .3, -r * .6, -r * .1, -r * .55); c.quadraticCurveTo(-r * .7, -r * .45, -r * 1.07, 0); c.fill();
  if (gray > 0) { c.globalAlpha = gray; c.beginPath(); c.arc(0, 0, r * 1.07, Math.PI * 1.45, Math.PI * 1.7); c.lineTo(r * .05, -r * .62); c.closePath(); c.fillStyle = '#C9CCD6'; c.fill(); }
  c.restore(); };
const granHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, 0, r * 1.05, Math.PI * .95, Math.PI * 2.05); c.lineWidth = r * .24; c.strokeStyle = '#E6E6EE'; c.stroke();
  circ(c, -r * .7, -r * .85, r * .34); fs(c, '#E6E6EE', 0);
  c.lineWidth = r * .05; c.strokeStyle = '#E8C46A'; [r * .0, r * .5].forEach(x => { circ(c, x, -r * .05, r * .2); c.stroke(); }); c.restore(); };
const profHair = full => (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, 0, r * 1.04, full ? Math.PI * .95 : Math.PI * .85, full ? Math.PI * 2.0 : Math.PI * 1.3); c.lineWidth = r * .24; c.strokeStyle = full ? '#3A2A1A' : '#9A9DA6'; c.stroke(); c.restore(); };
const capHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .1, r * 1.03, Math.PI * 1.02, Math.PI * 1.98); c.closePath(); fs(c, '#D83A3A', 0);
  rr(c, r * .2, -r * .45, r * 1.05, r * .2, r * .1); fs(c, '#B02828', 0); c.restore(); };
// calotte de cheveux (croissant plein qui épouse le haut du crâne)
const cap = (c, r, col, a0 = 1.0, a1 = 2.0, depth = .55) => { c.beginPath(); c.arc(0, 0, r * 1.06, Math.PI * a0, Math.PI * a1);
  c.quadraticCurveTo(r * .2, -r * depth, -r * .2, -r * (depth - .05)); c.quadraticCurveTo(-r * .8, -r * (depth - .15), -r * 1.06 * Math.cos(Math.PI * (a0 - 1)), r * 1.06 * Math.sin(Math.PI * (a0 - 1)));
  c.closePath(); c.fillStyle = col; c.fill(); };
const papyHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  cap(c, r, '#E6E7EE', 1.0, 1.42, .2); // couronne blanche sur l'arrière du crâne
  c.restore(); };
// Vieillissement du héros : k = 0 (16 ans) → 1 (40 ans) : calotte grise, rides.
const ageHair = k => (c, r, hc = [0, 0]) => { if (k <= .02) return; c.save(); c.translate(hc[0], hc[1]);
  c.globalAlpha = clamp(k * 1.4); cap(c, r, '#A9ADB8', 1.0, 2.0, .62);
  c.globalAlpha = clamp(k * 2); c.lineWidth = r * .035; c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineCap = 'round';
  const n = 1 + Math.round(k * 2); for (let i = 0; i < n; i++) { c.beginPath(); c.moveTo(-r * .3, -r * (.44 - i * .09)); c.quadraticCurveTo(r * .12, -r * (.48 - i * .09), r * .5, -r * (.44 - i * .09)); c.stroke(); }
  c.restore(); };

// ---------- compteurs ----------
function count(gt) { // nombre d'excuses données
  if (gt < CUE.m1) return [0, undefined];
  if (gt < CUE.roll1) return [1, CUE.m1];
  if (gt < CUE.papy) { const k = pr(gt, CUE.roll1, CUE.roll1 + 3); return [1 + Math.round(6 * eio(k)), k < 1 ? gt - .2 : CUE.roll1 + 2.8]; }
  const k = pr(gt, CUE.papy, CUE.papy + 3.4); return [7 + Math.round(17 * eio(k)), k < 1 ? gt - .2 : CUE.papy + 3.2];
}
const ageOf = gt => gt > CUE.young ? 16 : 16 + count(gt)[0];
const ageK = gt => clamp((ageOf(gt) - 16) / 24);
const hourglass = (c, x, y, red) => { c.save(); c.translate(x, y); c.fillStyle = red ? '#FF3B30' : '#F5B82E';
  c.beginPath(); c.moveTo(-12, -16); c.lineTo(12, -16); c.lineTo(0, 0); c.lineTo(12, 16); c.lineTo(-12, 16); c.lineTo(0, 0); c.closePath(); c.fill(); c.restore(); };
function hud(c, gt) {
  const [n, bump] = count(gt), age = ageOf(gt);
  const hit = gt > CUE.young ? CUE.young : gt > CUE.papy ? CUE.papy : gt > CUE.wrinkle ? CUE.wrinkle : undefined;
  const day = gt < L(5) ? 1 : gt < L(10) ? 2 : 3;
  cinemaHud(c, gt, { part: 'Le Carnet des excuses', off: gt > CUE.endcard, day, dayAt: day === 1 ? L(0) : day === 2 ? L(5) : L(10),
    val: n + (n > 1 ? ' PARDONS' : ' PARDON'), bump, sub: 'TOI : ' + age + ' ANS', subIcon: hourglass, hit: gt > CUE.wrinkle ? hit : undefined });
}

// ---------- décors ----------
function street(p, gt) {
  streetNight(p, gt, { lampX: 1080 });
  busShelter(p, 1240, 830);
  p.save(); p.globalAlpha = .3; for (let i = 0; i < 110; i++) { const x = (i * 197) % 2300 - 200, y = ((i * 263 + gt * 1500) % 1300) - 150; line(p, [[x, y], [x - 8, y + 36]], 3, '#C9D6F0', null); } p.restore();
}
function door(p, x, y) { rr(p, x, y - 560, 300, 560, 8); fs(p, '#5A3A2A', 0); circ(p, x + 250, y - 280, 12); fs(p, '#D9B25A', 0); rr(p, x - 16, y - 576, 332, 20, 6); fs(p, '#3A2A20', 0); }
function kitchen(p, gt, day) {
  kitchenNight(p, gt, { day });
  wallpaper(p, 640, -200, 640, 1000, day ? '#CDB99E' : '#3A2E38', day ? 'rgba(160,120,90,.25)' : 'rgba(120,90,110,.25)');
  frame(p, 760, 260, 180, 220, (q, x, y) => { q.fillStyle = '#7FA6D8'; q.fillRect(x - 80, y - 100, 160, 200); circ(q, x, y + 10, 40); fs(q, '#0E0E14', 0); });
  plant(p, 1780, 780, 1.1);
  if (!day) { cone(p, 960, 290, 200, 1000, 560, 'rgba(255,200,130,A)', .28); glow(p, 960, 300, 260, 'rgba(255,200,130,A)', .5); }
}
// Carnet rouge fermé ou ouvert (gros plan). page : 'front' | 'back' | 'last'
function notebook(p, x, y, s, open, page, k = 1) {
  p.save(); p.translate(x, y); p.scale(s, s);
  if (!open) { rr(p, -150, -200, 300, 400, 14); fs(p, '#B3262E', 0); rr(p, -150, -200, 34, 400, [14, 0, 0, 14]); fs(p, '#8A1C22', 0); rr(p, -60, -60, 150, 50, 6); fs(p, '#E8C46A', 0); p.restore(); return; }
  rr(p, -420, -270, 840, 540, 18); fs(p, '#8A1C22', 0);
  rr(p, -400, -250, 395, 500, 8); fs(p, '#F2EAD8', 0); rr(p, 5, -250, 395, 500, 8); fs(p, '#F2EAD8', 0);
  p.fillStyle = 'rgba(0,0,0,.12)'; p.fillRect(-12, -250, 24, 500);
  for (let i = 0; i < 9; i++) { p.fillStyle = 'rgba(120,140,190,.25)'; p.fillRect(-380, -180 + i * 50, 360, 2); p.fillRect(25, -180 + i * 50, 360, 2); }
  const T = { front: ['Chaque excuse', 'sincère rajeunit', 'd\'un an celui', 'qui la reçoit.'],
              back: ['… et chaque', 'excuse vieillit', 'd\'un an celui', 'qui la donne.'],
              last: ['Il te reste', 'UNE personne', 'à qui tu dois', 'des excuses.'] }[page];
  const fnt = page === 'back' ? '700 italic 38px Montserrat' : '800 italic 46px Montserrat';
  p.save(); p.globalAlpha = clamp(k); T.forEach((l, i) => text(p, l, 202, -120 + i * 80, fnt, page === 'back' ? '#8A1C22' : '#2A2A3A')); p.restore();
  p.restore();
}
function mirrorFrame(p, x, y, w, h, draw) {
  rr(p, x - 20, y - 20, w + 40, h + 40, 16); fs(p, '#6B4A30', 0);
  p.save(); rr(p, x, y, w, h, 8); p.clip(); p.fillStyle = grad(p, y, y + h, ['#2A3150', '#151a30']); p.fillRect(x, y, w, h); draw(p);
  p.globalAlpha = .12; p.beginPath(); p.moveTo(x + w * .1, y); p.lineTo(x + w * .3, y); p.lineTo(x + w * .05, y + h); p.lineTo(x - w * .15, y + h); p.closePath(); p.fillStyle = '#fff'; p.fill(); p.restore();
}
function hospital(p, gt, heal) {
  p.fillStyle = grad(p, 0, 800, ['#2E3B44', '#3A4A52']); p.fillRect(-400, -200, 2800, 1100);
  p.fillStyle = '#1F2A30'; p.fillRect(-400, 800, 2800, 400);
  rr(p, 1320, 150, 380, 330, 6); fs(p, '#0E1626', 0); rr(p, 1310, 140, 400, 350, 6); fs(p, null, 12, '#55636C');
  glow(p, 1600, 230, 140, 'rgba(210,225,255,A)', .4);
  cone(p, 1510, 480, 380, 1100, 520, 'rgba(200,220,255,A)', .14);
  rr(p, 1120, 280, 150, 110, 10); fs(p, '#0A0E12', 0);
  p.beginPath(); for (let x = 0; x <= 130; x += 3) { const ph = (x + gt * 90) % 130, yy = 335 - (ph > 55 && ph < 75 ? (heal ? 34 : 14) * Math.sin((ph - 55) / 20 * Math.PI * 2) : 0); x ? p.lineTo(1130 + x, yy) : p.moveTo(1130 + x, yy); } p.lineWidth = 4; p.strokeStyle = '#3DDC84'; p.stroke();
  rr(p, 260, 640, 980, 120, 18); fs(p, '#D9DEE6', 0); rr(p, 260, 760, 980, 40, 8); fs(p, '#8A96A0', 0);
  rr(p, 280, 560, 230, 90, 30); fs(p, '#F2F4F8', 0);
  line(p, [[300, 800], [300, 900]], 14, '#6A747C', null); line(p, [[1200, 800], [1200, 900]], 14, '#6A747C', null);
  lamp(p, 760, 40, 340);
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

// ---------- scènes ----------
SC.arret = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'door'], [at(0, .45), 'slam'], [at(0, .75), 'walk'], [L(1), 'gran'], [at(1, .55), 'give'], [L(2), 'closed'], [at(2, .3), 'page']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'door') {
      p.save(); cam2(p, 900 + dx, 560 + dy, push(st, 1.2, 1.28, 2));
      kitchen(p, gt, true); door(p, 1180, 800);
      rig(p, { x: 700, y: 835, s: .62, f: -1, t: gt, col: MOM, col2: MOM2, hair: momHair(1), e: 'sad', talk: true, armF: [.9, .3], seed: 2, light: 1 });
      rig(p, { x: 1100, y: 835, s: .62, f: 1, t: gt, pose: 'walk', walk: gt * 8, e: 'angry', mouth: 'frown', light: -1 });
      p.restore();
    } else if (shot === 'slam') {
      const sh = st < .3 ? Math.sin(st * 120) * 12 : 0;
      p.save(); cam2(p, 1330 + sh, 520, 2.1); kitchen(p, gt, true); door(p, 1180, 800); p.restore();
      p.fillStyle = `rgba(255,255,255,${clamp(.25 - st)})`; p.fillRect(0, 0, SW, SH);
    } else if (shot === 'walk') {
      p.save(); cam2(p, 900 + dx, 600 + dy, 1.2); street(p, gt);
      const hx = kf(st, [[0, 300], [2.5, 1150]]); shadow(p, hx, 832, 80);
      rig(p, { x: hx, y: 835, s: .6, f: 1, t: gt, pose: 'walk', walk: gt * 7, e: 'sad', lookY: .6, light: 1 });
      p.restore();
    } else if (shot === 'gran') {
      p.save(); cam2(p, 1300 + dx, 560 + dy, push(st, 1.45, 1.55, 3)); street(p, gt);
      rig(p, { x: 1180, y: 835, s: .6, f: 1, t: gt, e: 'n', look: 1, light: 1 });
      rig(p, { x: 1460, y: 835, s: .56, f: -1, t: gt, pose: 'sit', seat: 125 / .56, col: GRAN, col2: GRAN2, hair: granHair, e: 'happy', mouth: 'smile', seed: 4, light: -1 });
      p.restore();
    } else if (shot === 'give') {
      p.fillStyle = grad(p, 0, 1080, ['#141830', '#0A0C16']); p.fillRect(0, 0, SW, SH);
      glow(p, 960, 520, 520, 'rgba(255,215,140,A)', .18);
      const hx = kf(st, [[0, 1500], [.8, 1150]]);
      notebook(p, hx - 300, 540 + Math.sin(gt * 2) * 6, .55, false);
      hand(p, hx, 560, 1.25, Math.PI, { sleeve: GRAN, cuff: GRAN2 });
      hand(p, kf(st, [[0, 150], [1.2, 520]]), 560, 1.15, 0, { open: st < 1.2 });
    } else if (shot === 'closed') {
      p.save(); cam2(p, 960, 540, push(st, 1, 1.12, 2)); p.fillStyle = grad(p, 0, 1080, ['#0B1024', '#1A2140']); p.fillRect(-200, -200, 2400, 1500);
      cone(p, 980, -80, 200, 1100, 1200, 'rgba(255,230,170,A)', .2);
      bust(p, 960, 600, 200, { t: gt, e: 'wide', look: 0, lookY: .8, light: -1 });
      p.restore();
    } else {
      p.save(); cam2(p, 960 + dx * .5, 540, push(st, 1.1, 1.22, 4));
      p.fillStyle = '#0A0B12'; p.fillRect(-200, -200, 2400, 1500); glow(p, 960, 540, 700, 'rgba(255,225,170,A)', .25);
      notebook(p, 960, 560, 1.15, true, 'front', (st - .2) * 1.5);
      p.restore();
    }
  });
};
SC.maman = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wide'], [at(3, .35), 'me'], [L(4), 'mom'], [at(4, .4), 'hair'], [at(4, .75), 'two']]);
  const gray = gt < CUE.m1 ? 1 : clamp(1 - (gt - CUE.m1) * 1.2);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'wide') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.15, 1.22, 3)); kitchen(p, gt, false);
      table(p, 960, 640, 640);
      rig(p, { x: 1220, y: 835, s: .62, f: -1, t: gt, pose: 'sit', seat: 200 / .62, col: MOM, col2: MOM2, hair: momHair(gray), e: 'sad', lookY: .5, seed: 2, light: -1 });
      rig(p, { x: lerp(300, 620, eo(clamp(st / 2))), y: 835, s: .62, f: 1, t: gt, pose: st < 2 ? 'walk' : 'stand', walk: gt * 6, e: 'sad', light: 1 });
      p.restore();
    } else if (shot === 'me') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 3)); kitchen(p, gt, false); p.restore();
      blurred(p, 8, q => { q.fillStyle = 'rgba(10,10,20,.4)'; q.fillRect(0, 0, SW, SH); });
      bust(p, 900, 600, 220, { t: gt, e: 'sad', talk: talking(gt, at(3, .4), E(3)), look: 1, light: -1 });
    } else if (shot === 'mom' || shot === 'hair') {
      const z = shot === 'hair' ? 1.5 : 1;
      p.save(); cam2(p, shot === 'hair' ? 900 : 960, shot === 'hair' ? 420 : 540, z * push(st, 1, 1.06, 3)); kitchen(p, gt, false);
      bust(p, 960, 620, 220, { t: gt, col: MOM, col2: MOM2, hair: momHair(gray), e: gt > CUE.m1 ? 'happy' : 'wide', mouth: gt > CUE.m1 ? 'smile' : 'o', light: 1, seed: 2 });
      if (gt > CUE.m1 && gt < CUE.m1 + 1.5) for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + gt; glow(p, 900 + Math.cos(a) * 260, 380 + Math.sin(a) * 120, 30, 'rgba(255,230,150,A)', .7 * (1 - (gt - CUE.m1) / 1.5)); }
      p.restore();
    } else {
      p.save(); cam2(p, 960 + dx, 560 + dy, 1.35); kitchen(p, gt, false); table(p, 960, 640, 640);
      rig(p, { x: 1150, y: 835, s: .62, f: -1, t: gt, col: MOM, col2: MOM2, hair: momHair(gray), e: 'happy', mouth: 'smile', armF: [1.6, .4], armB: [1.4, .5], seed: 2, light: -1 });
      rig(p, { x: 850, y: 835, s: .62, f: 1, t: gt, e: 'happy', mouth: 'smile', armF: [1.5, .4], light: 1 });
      p.restore();
    }
  });
};
SC.lycee = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'hall'], [at(5, .35), 'prof'], [at(5, .62), 'pote'], [at(5, .82), 'canteen'], [L(6), 'profHair'], [at(6, .38), 'poteFace'], [at(6, .7), 'crowd']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    const ok = gt > L(6);
    if (shot === 'hall') {
      p.save(); cam2(p, lerp(700, 1100, clamp(st / 3)) + dx, 560 + dy, 1.2); hallDay(p, gt);
      const hx = kf(st, [[0, 300], [3, 1250]]); shadow(p, hx, 832, 80);
      rig(p, { x: hx, y: 835, s: .6, f: 1, t: gt, pose: 'walk', walk: gt * 8, e: 'happy', mouth: 'smile', light: 1 });
      rig(p, { x: 1500, y: 835, s: .6, f: -1, t: gt, col: POTE, col2: POTE2, hair: capHair, e: 'n', seed: 5 });
      p.restore();
    } else if (shot === 'prof' || shot === 'pote' || shot === 'canteen') {
      p.save(); cam2(p, 960 + dx, 560 + dy, 1.5); hallDay(p, gt);
      const o = shot === 'prof' ? { col: PROF, col2: PROF2, hair: profHair(false) } : shot === 'pote' ? { col: POTE, col2: POTE2, hair: capHair } : { col: '#E0E3EA', col2: '#C5C9D2', hair: granHair };
      rig(p, { x: 1150, y: 835, s: .62, f: -1, t: gt, ...o, e: 'wide', mouth: 'o', seed: 6 });
      rig(p, { x: 780, y: 835, s: .62, f: 1, t: gt, e: 'sad', talk: true, armF: [1.2, .2], light: 1 });
      p.restore();
    } else if (shot === 'profHair') {
      p.save(); cam2(p, 960, 560, push(st, 1.15, 1.22, 2)); hallDay(p, gt);
      bust(p, 960, 620, 220, { t: gt, col: PROF, col2: PROF2, hair: profHair(st > .4), e: st > .4 ? 'happy' : 'wide', mouth: st > .4 ? 'smile' : 'o', seed: 6 });
      p.restore();
    } else if (shot === 'poteFace') {
      p.save(); cam2(p, 960, 560, push(st, 1.15, 1.22, 2)); hallDay(p, gt);
      bust(p, 960, 620, 220, { t: gt, col: POTE, col2: POTE2, hair: capHair, e: 'happy', mouth: 'smile', seed: 5 });
      if (st < .5) [[-80, 60], [70, 90], [20, 140]].forEach(([x, y]) => { circ(p, 960 + x, 620 + y, 14); fs(p, '#C8505A', 0); });
      p.restore();
    } else {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.2, 1.3, 3)); hallDay(p, gt);
      [[500, POTE, POTE2, capHair], [760, PROF, PROF2, profHair(true)], [1240, '#E05B8B', '#B84670', null], [1480, '#5BBF7A', '#479A62', null]].forEach(([x, col, col2, hair], i) =>
        rig(p, { x, y: 835, s: .58, f: x < 960 ? 1 : -1, t: gt, col, col2, hair, e: 'happy', mouth: 'smile', armF: [2.6 + Math.sin(gt * 6 + i) * .3, .3], seed: i + 7 }));
      rig(p, { x: 1000, y: 835, s: .62, f: 1, t: gt, e: 'happy', mouth: 'smile', armF: [2.8, .2], armB: [2.8, .2], light: 1 });
      p.restore();
    }
  });
};
SC.prix = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'room'], [at(7, .3), 'mirror'], [L(8), 'flip'], [at(8, .3), 'back'], [L(9), 'mirror2']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'room') {
      p.save(); cam2(p, 900 + dx, 560 + dy, push(st, 1.15, 1.22, 2)); bedroomNight(p, gt, { clock: '22:47' });
      rig(p, { x: 600, y: 835, s: .6, f: 1, t: gt, e: 'happy', mouth: 'smile', holdF: (q, x, y) => notebook(q, x + 10, y - 20, .12, false), light: 1 });
      p.restore();
    } else if (shot === 'mirror' || shot === 'mirror2') {
      const k = shot === 'mirror2' ? ageK(gt) : ageK(gt) * clamp((gt - CUE.wrinkle + .6) * 1.2);
      p.save(); cam2(p, 960, 540, push(st, 1, 1.1, 3)); p.fillStyle = '#0E1124'; p.fillRect(-200, -200, 2400, 1500);
      mirrorFrame(p, 560, 90, 800, 900, q => bust(q, 960, 560, 230, { t: gt, e: shot === 'mirror2' ? 'sad' : 'wide', mouth: 'o', hair: ageHair(k), light: 1 }));
      p.restore();
      if (shot === 'mirror2') blurred(p, 10, q => bust(q, 260, 780, 260, { t: gt, look: 1, light: -1 }));
    } else if (shot === 'flip') {
      p.fillStyle = '#0A0B12'; p.fillRect(0, 0, SW, SH); glow(p, 960, 540, 600, 'rgba(255,225,170,A)', .2);
      const k = eo(clamp(st / .8)); notebook(p, 960, 560, .75 + k * .15, false);
      hand(p, 1270, 600, 1.0, Math.PI, { open: false });
    } else {
      p.save(); cam2(p, 1120, 470, push(st, 1.5, 1.75, 4)); p.fillStyle = '#0A0B12'; p.fillRect(-200, -200, 2400, 1500); glow(p, 960, 540, 700, 'rgba(255,225,170,A)', .22);
      notebook(p, 960, 560, 1.15, true, 'back', (st - .3) * 1.5);
      p.restore();
    }
  });
};
SC.papy = (c, lt, gt) => {
  const heal = gt > CUE.papy;
  const [shot, st] = shots(gt, [[0, 'corridor'], [at(10, .35), 'bed'], [at(10, .7), 'face'], [L(11), 'hands'], [at(11, .45), 'me'], [L(12), 'heal'], [at(12, .55), 'laugh'], [at(12, .8), 'old']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'corridor') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.1, 1.2, 3)); hallDay(p, gt); p.fillStyle = 'rgba(30,60,60,.35)'; p.fillRect(-400, -200, 2800, 1400);
      const hx = kf(st, [[0, 400], [3, 1200]]); shadow(p, hx, 832, 80);
      rig(p, { x: hx, y: 835, s: .6, f: 1, t: gt, pose: 'walk', walk: gt * 5, e: 'sad', lookY: .6, light: 1, hair: ageHair(ageK(gt)) });
      p.restore();
    } else if (shot === 'bed' || shot === 'heal') {
      p.save(); cam2(p, 820 + dx, 560 + dy, push(st, 1.2, 1.3, 3)); hospital(p, gt, heal);
      const up = heal ? eo(clamp((gt - CUE.papy) / 2.5)) : 0;
      rig(p, { x: 470, y: 760, s: .56, f: 1, t: gt, pose: 'sit', seat: 196, col: PAPY, col2: PAPY2, hair: papyHair, e: heal ? 'happy' : 'closed', blink: false, mouth: heal ? 'smile' : 'flat', lean: lerp(-.28, 0, up), tilt: lerp(-.25, 0, up), armF: heal ? [kf(gt - CUE.papy, [[0, .3], [1.5, 2.4]]), .3] : [.3, .1], seed: 8, light: 1 });
      rr(p, 280, 640, 960, 120, 18); fs(p, '#C5CDD8', 0); p.fillStyle = 'rgba(0,0,0,.08)'; p.fillRect(280, 640, 960, 16);
      rig(p, { x: 1350, y: 835, s: .6, f: -1, t: gt, e: 'sad', armF: [1.4, .2], hair: ageHair(ageK(gt)), light: -1 });
      p.restore();
    } else if (shot === 'face') {
      p.save(); cam2(p, 960, 540, push(st, 1, 1.08, 2)); hospital(p, gt, false); p.restore();
      blurred(p, 6, q => { q.fillStyle = 'rgba(0,0,0,.3)'; q.fillRect(0, 0, SW, SH); });
      bust(p, 960, 640, 200, { t: gt, col: PAPY, col2: PAPY2, hair: papyHair, e: 'closed', blink: false, mouth: 'flat', seed: 8 });
    } else if (shot === 'hands') {
      p.fillStyle = grad(p, 0, 1080, ['#2E3B44', '#1F2A30']); p.fillRect(0, 0, SW, SH); glow(p, 960, 520, 520, 'rgba(220,235,255,A)', .14);
      rr(p, 0, 640, SW, 440, 0); fs(p, '#D9DEE6', 0);
      hand(p, 1250, 600, 1.2, Math.PI + .05, { sleeve: '#E8ECF2', cuff: '#C9CFD8' });
      hand(p, kf(st, [[0, 200], [1, 760]]), 610, 1.2, -.03, {});
    } else if (shot === 'me') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); hospital(p, gt, false); p.restore();
      blurred(p, 8, q => { q.fillStyle = 'rgba(10,10,20,.35)'; q.fillRect(0, 0, SW, SH); });
      bust(p, 980, 620, 220, { t: gt, e: 'sad', talk: talking(gt, at(11, .45), E(11)), look: -1, hair: ageHair(ageK(gt)), light: 1 });
    } else if (shot === 'laugh') {
      p.save(); cam2(p, 960, 520, push(st, 1, 1.06, 2)); hospital(p, gt, true);
      bust(p, 960, 640, 220, { t: gt, col: PAPY, col2: PAPY2, hair: papyHair, e: 'happy', mouth: 'smile', talk: Math.sin(gt * 9) > 0, seed: 8, light: -1 });
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.12, 3)); p.fillStyle = '#10161C'; p.fillRect(-200, -200, 2400, 1500); cone(p, 960, -80, 220, 1100, 1200, 'rgba(220,235,255,A)', .2);
      bust(p, 960, 600, 230, { t: gt, e: 'wide', mouth: 'o', hair: ageHair(ageK(gt)), light: -1 });
      p.restore();
    }
  });
};
SC.fin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'page'], [at(13, .7), 'room'], [L(14), 'mirror'], [L(15), 'young'], [L(16), 'smile']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'page') {
      p.save(); cam2(p, 1120, 470, push(st, 1.45, 1.65, 4)); p.fillStyle = '#0A0B12'; p.fillRect(-200, -200, 2400, 1500); glow(p, 960, 540, 700, 'rgba(255,225,170,A)', .22);
      notebook(p, 960, 560, 1.15, true, 'last', (st - .2) * 1.5);
      p.restore();
    } else if (shot === 'room') {
      p.save(); cam2(p, 900 + dx, 560 + dy, push(st, 1.15, 1.22, 2)); bedroomNight(p, gt, { clock: '03:12' });
      rig(p, { x: 700, y: 835, s: .6, f: 1, t: gt, e: 'sad', lookY: .4, hair: ageHair(ageK(gt)), light: 1 });
      p.restore();
    } else {
      const k = ageK(gt), young = shot !== 'mirror';
      p.save(); cam2(p, 960, 540, push(st, 1, 1.1, 3)); p.fillStyle = '#0E1124'; p.fillRect(-200, -200, 2400, 1500);
      if (gt > CUE.young && gt < CUE.young + 1.4) glow(p, 960, 540, 800, 'rgba(255,230,160,A)', .5 * (1 - (gt - CUE.young) / 1.4));
      mirrorFrame(p, 560, 90, 800, 900, q => bust(q, 960, 560, 230, { t: gt, e: young && gt > CUE.young ? 'happy' : 'sad', mouth: young && gt > CUE.young ? 'smile' : undefined,
        talk: talking(gt, at(14, .3), E(14)), hair: ageHair(k), light: 1 }));
      p.restore();
      if (shot === 'mirror') blurred(p, 10, q => bust(q, 260, 780, 260, { t: gt, look: 1, light: -1, hair: ageHair(k) }));
    }
  });
  finCard(c, gt, CUE.endcard, 'Et toi, à qui tu dois des excuses ?');
};
