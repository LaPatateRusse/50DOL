// La photo d'un an — histoire originale complète (créneau 16:30), style cinéma (cinema.js + cinema-rig.js).
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const PAPY = '#8A6A4A', PAPY2 = '#6E5238';

// Papy : crâne dégarni, cheveux blancs sur les côtés + moustache
const papyHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); c.fillStyle = '#E6E6EC';
  c.strokeStyle = '#D6D6DE'; c.lineCap = 'round'; c.lineWidth = r * .13;
  c.beginPath(); c.arc(0, 0, r * .97, Math.PI * .98, Math.PI * 1.28); c.stroke();
  c.beginPath(); c.arc(0, 0, r * .97, -Math.PI * .28, Math.PI * .02); c.stroke();
  rr(c, r * .02, r * .3, r * .5, r * .13, r * .06); fs(c, '#E6E6EC', 0); c.restore(); };
const kidHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .05, r * 1.04, Math.PI * 1.05, Math.PI * 1.95); c.quadraticCurveTo(r * .5, -r * .7, 0, -r * .62); c.quadraticCurveTo(-r * .6, -r * .72, -r * 1.0, -r * .3); c.closePath(); fs(c, '#4A2E1E', 0); c.restore(); };

// ---------- accessoires ----------
function camera(q, x, y, s = 1) {
  q.save(); q.translate(x, y); q.scale(s, s);
  rr(q, -80, -50, 160, 100, 14); fs(q, '#2A2A30', 0); rr(q, -80, -50, 160, 26, 10); fs(q, '#8A6A4A', 0);
  circ(q, 0, 8, 34); fs(q, '#111116', 6, '#9AA2BC'); circ(q, 0, 8, 16); fs(q, '#3A4A7A', 0); circ(q, -6, 2, 5); fs(q, 'rgba(255,255,255,.7)', 0);
  rr(q, 44, -42, 26, 14, 3); fs(q, '#F4EEE4', 0);
  q.restore();
}
function cat(q, x, y, s = 1, fat = 1, sleep = false) {
  q.save(); q.translate(x, y); q.scale(s, s); q.fillStyle = '#E08A3A';
  q.beginPath(); q.ellipse(0, -40 * fat, 70 * fat, 42 * fat, 0, 0, Math.PI * 2); q.fill();
  line(q, [[-60 * fat, -30 * fat], [-110 * fat, -20], [-120 * fat, -60]], 14, '#E08A3A', null);
  const hx = 62 * fat, hy = sleep ? -40 * fat : -80 * fat;
  circ(q, hx, hy, 34); q.fill();
  [[-1, 0], [1, 0]].forEach(([k]) => { q.beginPath(); q.moveTo(hx + k * 26, hy - 18); q.lineTo(hx + k * 20, hy - 52); q.lineTo(hx + k * 4, hy - 30); q.closePath(); q.fill(); });
  q.strokeStyle = '#3A2A1A'; q.lineWidth = 5; q.lineCap = 'round';
  [-1, 1].forEach(k => { q.beginPath(); if (sleep) q.arc(hx + k * 12, hy - 2, 7, .2, Math.PI - .2); else { q.moveTo(hx + k * 12, hy - 8); q.lineTo(hx + k * 12, hy + 2); } q.stroke(); });
  q.restore();
}
function armchair(p, x, y, s = 1) {
  p.save(); p.translate(x, y); p.scale(s, s);
  rr(p, -150, -330, 300, 250, 50); fs(p, '#B0413E', 0); rr(p, -170, -160, 340, 120, 30); fs(p, '#9A3634', 0);
  rr(p, -190, -220, 60, 190, 26); fs(p, '#C24E4A', 0); rr(p, 130, -220, 60, 190, 26); fs(p, '#C24E4A', 0);
  rr(p, -160, -40, 20, 40, 4); fs(p, '#4A3020', 0); rr(p, 140, -40, 20, 40, 4); fs(p, '#4A3020', 0);
  p.restore();
}
// petite image de photo (repère 320 × 320) : salon avec fauteuil ; o.papy, o.sil (silhouettes dans le potager)
function roomPic(q, o = {}) {
  q.fillStyle = grad(q, 0, 230, ['#E8D6B8', '#D8C2A0']); q.fillRect(0, 0, 320, 320);
  q.fillStyle = '#8A6A4A'; q.fillRect(0, 232, 320, 90);
  rr(q, 196, 40, 104, 116, 4); fs(q, '#BFE0F0', 0);
  q.fillStyle = '#6FAE5A'; q.fillRect(196, 112, 104, 44);
  for (let i = 0; i < 3; i++) { q.fillStyle = '#4E8A3E'; q.fillRect(200, 122 + i * 12, 96, 5); }
  if (o.sil) { const g = o.sil; q.globalAlpha = g; q.fillStyle = '#16161C';
    circ(q, 232, 96, 7); q.fill(); rr(q, 226, 102, 13, 26, 5); q.fill();
    circ(q, 262, 104, 5.5); q.fill(); rr(q, 257, 109, 11, 19, 4); q.fill(); q.globalAlpha = 1; }
  rr(q, 196, 40, 104, 116, 4); fs(q, null, 7, '#F6F2EA'); line(q, [[248, 40], [248, 156]], 5, '#F6F2EA', null);
  armchair(q, 100, 262, .36);
  if (o.papy) { q.save(); q.translate(100, 262); q.scale(.36, .36); circ(q, 0, -330, 70); fs(q, SKIN, 0); papyHair(q, 70, [0, -330]); rr(q, -80, -260, 160, 140, 40); fs(q, PAPY, 0); q.restore(); }
  rr(q, 10, 186, 46, 40, 4); fs(q, '#2A2A30', 0);
}
function catPic(q) {
  q.fillStyle = grad(q, 0, 320, ['#CFE0E8', '#B8CCD6']); q.fillRect(0, 0, 320, 320);
  q.fillStyle = '#9AA8B0'; q.fillRect(0, 270, 320, 50);
  rr(q, 70, 140, 180, 140, 10); fs(q, '#F4F4F6', 0); circ(q, 160, 215, 44); fs(q, '#6A7A88', 8, '#C8CED4'); rr(q, 80, 150, 160, 18, 4); fs(q, '#D8DCE2', 0);
  cat(q, 160, 140, .9, 1.6, true);
}
// photo instantanée : dev (0..1) = l'image apparaît
function polaroid(p, x, y, s, rot, pic, dev = 1, cap) {
  p.save(); p.translate(x, y); p.rotate(rot); p.scale(s, s);
  p.shadowColor = 'rgba(0,0,0,.5)'; p.shadowBlur = 30; rr(p, -180, -200, 360, 420, 8); fs(p, '#F6F2EA', 0); p.shadowBlur = 0;
  p.save(); p.beginPath(); p.rect(-160, -180, 320, 320); p.clip(); p.translate(-160, -180); pic(p);
  if (dev < 1) { p.fillStyle = `rgba(40,36,48,${1 - dev})`; p.fillRect(0, 0, 320, 320); }
  p.restore();
  if (cap) text(p, cap, 0, 180, 'italic 700 30px Montserrat', '#5A5A6A');
  p.restore();
}
const holdPhoto = (p, x, y, s) => hand(p, x - 40 * s, y + 250 * s, .7 * s, -1.75, {});

// ---------- décors ----------
function attic(p, gt) {
  p.fillStyle = grad(p, 0, 800, ['#2A2028', '#3A2C2A']); p.fillRect(-400, -200, 2800, 1100);
  for (let i = -2; i < 7; i++) { line(p, [[200 + i * 300, -100], [500 + i * 300, 780]], 26, '#4A3428', null); }
  line(p, [[-300, 120], [2300, 120]], 30, '#5A4030', null);
  p.fillStyle = '#4A3428'; p.fillRect(-400, 780, 2800, 500);
  for (let i = 0; i < 12; i++) line(p, [[-300 + i * 220, 790], [-300 + i * 220, 1100]], 4, 'rgba(0,0,0,.25)', null);
  line(p, [[900, -100], [900, 140]], 4, '#1A1A1A', null); circ(p, 900, 160, 24); fs(p, '#FFE8A8', 0);
  glow(p, 900, 160, 260, 'rgba(255,220,150,A)', .55); cone(p, 900, 170, 60, 900, 640, 'rgba(255,220,150,A)', .2);
  rr(p, 1300, 620, 380, 170, 12); fs(p, '#6A4A30', 0); rr(p, 1290, 600, 400, 40, 10); fs(p, '#7A5638', 0); rr(p, 1470, 640, 40, 50, 6); fs(p, '#C9A24A', 0);
  rr(p, 300, 660, 240, 130, 8); fs(p, '#8A7458', 0); text(p, 'NOËL', 420, 730, '800 34px Montserrat', '#5A4A38');
}
function salon(p, gt, o = {}) {
  p.fillStyle = grad(p, 0, 780, ['#E8D6B8', '#D6C09C']); p.fillRect(-400, -200, 2800, 1100);
  wallpaper(p, -400, -200, 2800, 980, 'rgba(0,0,0,0)', 'rgba(150,110,70,.10)');
  p.fillStyle = '#8A6A4A'; p.fillRect(-400, 780, 2800, 500); p.fillStyle = 'rgba(255,255,255,.08)'; p.fillRect(-400, 790, 2800, 20);
  rr(p, 1180, 160, 420, 460, 6); fs(p, '#BFE0F0', 0); p.fillStyle = '#6FAE5A'; p.fillRect(1180, 460, 420, 160);
  for (let i = 0; i < 4; i++) { p.fillStyle = '#4E8A3E'; p.fillRect(1196, 482 + i * 34, 388, 12); }
  if (o.sil) { p.fillStyle = '#16161C'; circ(p, 1300, 420, 26); p.fill(); rr(p, 1278, 444, 48, 110, 16); p.fill(); circ(p, 1470, 452, 20); p.fill(); rr(p, 1452, 470, 38, 84, 14); p.fill(); }
  rr(p, 1180, 160, 420, 460, 6); fs(p, null, 18, '#F6F2EA'); line(p, [[1390, 160], [1390, 620]], 12, '#F6F2EA', null);
  frame(p, 300, 200, 220, 170, q => { circ(q, 410, 290, 40); fs(q, '#C9A27A', 0); });
  rr(p, 1700, 560, 220, 150, 10); fs(p, '#2A2A30', 0); rr(p, 1715, 575, 190, 120, 6); fs(p, o.tvOff ? '#1A1A20' : '#5A8AD8', 0); rr(p, 1780, 710, 60, 70, 4); fs(p, '#3A3A40', 0);
  if (!o.tvOff) glow(p, 1810, 630, 300, 'rgba(120,170,255,A)', .25);
}
function garden(p, gt, sunset = 0) {
  p.fillStyle = grad(p, 0, 640, sunset ? ['#F2A86A', '#F7D79A'] : ['#8EC8EA', '#D2ECF6']); p.fillRect(-400, -200, 2800, 900);
  glow(p, 1500, sunset ? 520 : 160, 300, sunset ? 'rgba(255,200,120,A)' : 'rgba(255,250,210,A)', .6);
  p.fillStyle = '#6FAE5A'; p.fillRect(-400, 600, 2800, 700);
  for (let i = 0; i < 5; i++) { p.fillStyle = '#5A3E2A'; p.fillRect(-300, 680 + i * 50, 2600, 22); for (let j = 0; j < 22; j++) { circ(p, -260 + j * 120 + (i % 2) * 60, 676 + i * 50, 14); fs(p, '#3E8A3A', 0); } }
  for (let i = 0; i < 16; i++) { rr(p, -300 + i * 160, 520, 22, 110, 4); fs(p, '#F4EEE4', 0); } line(p, [[-300, 550], [2300, 550]], 10, '#F4EEE4', null);
}
function lake(p, gt) {
  p.fillStyle = grad(p, 0, 600, ['#9ED0EE', '#E2F2F8']); p.fillRect(-400, -200, 2800, 900);
  p.fillStyle = '#4E9AC8'; p.fillRect(-400, 560, 2800, 700);
  for (let i = 0; i < 8; i++) line(p, [[-200 + i * 300 + Math.sin(gt + i) * 20, 640 + i * 40], [-80 + i * 300 + Math.sin(gt + i) * 20, 640 + i * 40]], 5, 'rgba(255,255,255,.5)', null);
  rr(p, 300, 780, 1300, 40, 6); fs(p, '#8A6A4A', 0); for (let i = 0; i < 6; i++) { rr(p, 330 + i * 240, 820, 26, 300, 4); fs(p, '#6A4A30', 0); }
  rr(p, 640, 660, 640, 26, 8); fs(p, '#6A4A30', 0);
}
function pathWalk(p, gt) {
  p.fillStyle = grad(p, 0, 640, ['#F6C27A', '#FBE3B0']); p.fillRect(-400, -200, 2800, 900);
  p.fillStyle = '#7FB25E'; p.fillRect(-400, 640, 2800, 700); p.fillStyle = '#D8C29A'; p.fillRect(-400, 780, 2800, 120);
  for (let i = 0; i < 7; i++) { const x = ((i * 380 - gt * 60) % 2800 + 2800) % 2800 - 400; rr(p, x, 360, 34, 300, 8); fs(p, '#5A3E2A', 0); circ(p, x + 17, 330, 120); fs(p, '#4E8A3E', 0); }
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
  const left = gt > CUE.click ? 1 : gt > CUE.cat ? 2 : 3;
  let day;
  if (gt >= CUE.year) day = 365; else if (gt >= CUE.day) day = Math.max(1, Math.floor(eio(clamp((gt - CUE.day) / D(6))) * 364));
  cinemaHud(c, gt, { part: 'La photo d\'un an', off: gt > CUE.endcard, day, dayAt: gt >= CUE.year ? CUE.year : CUE.day,
    val: gt < L(1) ? undefined : 'PHOTOS : ' + left, neg: left === 1, bump: left === 1 ? CUE.click : left === 2 ? CUE.cat : undefined });
}

const enfant = (p, x, y, o = {}) => rig(p, { x, y, s: o.s || .5, f: o.f || 1, t: o.t, pose: o.pose, seat: o.seat, walk: o.walk, hair: kidHair, e: o.e || 'n', mouth: o.mouth, talk: o.talk, look: o.look, lookY: o.lookY, armF: o.armF, armB: o.armB, holdF: o.holdF, seed: 2, light: o.light ?? 1 });
const papy = (p, x, y, o = {}) => rig(p, { x, y, s: o.s || .6, f: o.f || 1, t: o.t, pose: o.pose, seat: o.seat, walk: o.walk, col: PAPY, col2: PAPY2, pants: '#3A3A44', hair: papyHair, e: o.e || 'n', mouth: o.mouth, talk: o.talk, look: o.look, lookY: o.lookY, armF: o.armF, armB: o.armB, holdF: o.holdF, lean: o.lean, seed: 6, light: o.light ?? 1 });

// ---------- scènes ----------
SC.flash = (c, lt, gt) => {
  film(c, gt, p => {
    p.fillStyle = grad(p, 0, 1080, ['#2A2420', '#0E0C0A']); p.fillRect(0, 0, SW, SH); glow(p, 960, 520, 650, 'rgba(255,220,170,A)', .3);
    p.save(); cam2(p, 960, 540, push(lt, 1.0, 1.25, 3.5));
    polaroid(p, 960, 520, 1.5, -.04, q => roomPic(q, {}));
    holdPhoto(p, 840, 520, 1.5);
    p.restore();
  });
};
SC.grenier = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'attic'], [at(1, .45), 'cam'], [L(2), 'aim'], [CUE.cat + .5, 'catpic'], [at(2, .78), 'kidface']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'attic') {
      p.save(); cam2(p, 1200 + dx, 560 + dy, push(st, 1.1, 1.25, 4)); attic(p, gt);
      enfant(p, 1150, 835, { t: gt, pose: 'kneel', f: 1, e: st > 1.5 ? 'wide' : 'n', lookY: .5, armF: [.75, .85], armB: [.75, .85], holdF: st > 1.5 ? (q, x, y) => camera(q, x + 40, y - 30, .9) : undefined });
      p.restore();
    } else if (shot === 'cam') {
      p.save(); cam2(p, 960, 540, push(st, 1, 1.12, 3)); attic(p, gt); p.restore();
      p.fillStyle = 'rgba(0,0,0,.35)'; p.fillRect(0, 0, SW, SH);
      camera(p, 960, 540, 3.2);
      p.save(); p.translate(1080, 360); p.rotate(.12); rr(p, -240, -50, 480, 100, 6); fs(p, '#F7EBC4', 0); text(p, 'Montre dans un an', 0, 12, 'italic 800 38px Montserrat', '#5A3A2A'); p.restore();
      hand(p, 560, 760, .9, -.6, {});
    } else if (shot === 'aim') {
      p.save(); cam2(p, 960 + dx, 600 + dy, push(st, 1.15, 1.3, 3)); attic(p, gt);
      enfant(p, 760, 835, { t: gt, f: 1, e: 'n', look: 1, armF: [1.45, .1], armB: [1.35, .2], holdF: (q, x, y) => camera(q, x + 30, y - 10, .8) });
      cat(p, 1250, 830, .9, 1, false);
      if (gt > CUE.cat && gt < CUE.cat + .25) { p.fillStyle = 'rgba(255,255,255,.85)'; p.fillRect(-400, -200, 2800, 1400); }
      p.restore();
    } else if (shot === 'catpic') {
      p.save(); cam2(p, 960, 540, push(st, 1, 1.12, 3)); attic(p, gt); p.restore();
      p.fillStyle = 'rgba(0,0,0,.45)'; p.fillRect(0, 0, SW, SH);
      polaroid(p, 960, 520, 1.45, .05, catPic, clamp(st / 1.2));
      holdPhoto(p, 840, 520, 1.45);
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); attic(p, gt);
      bust(p, 960, 620, 230, { t: gt, hair: kidHair, e: 'happy', mouth: 'smile', seed: 2, light: 1 });
      p.restore();
    }
  });
};
SC.salon = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wide'], [at(3, .55), 'papy'], [L(4), 'aim'], [CUE.click + .6, 'photo'], [at(4, .72), 'compare']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'wide') {
      p.save(); cam2(p, 1000 + dx, 560 + dy, push(st, 1.05, 1.15, 4)); salon(p, gt);
      armchair(p, 900, 835, 1); papy(p, 900, 835, { t: gt, pose: 'sit', seat: 200 / .6, f: 1, e: 'n', look: 1, armF: [.75, .85], armB: [.75, .85] });
      enfant(p, lerp(200, 440, eo(clamp(st / 2.5))), 835, { t: gt, pose: st < 2.5 ? 'walk' : 'stand', walk: gt * 7, f: 1, e: 'n', holdF: (q, x, y) => camera(q, x + 20, y, .6) });
      p.restore();
    } else if (shot === 'papy') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); salon(p, gt);
      bust(p, 960, 640, 230, { t: gt, col: PAPY, col2: PAPY2, hair: papyHair, e: 'n', look: 1, seed: 6, light: 1 });
      glow(p, 1500, 600, 500, 'rgba(120,170,255,A)', .2);
      p.restore();
    } else if (shot === 'aim') {
      p.save(); cam2(p, 900 + dx, 600 + dy, push(st, 1.15, 1.25, 3)); salon(p, gt);
      armchair(p, 1050, 835, 1); papy(p, 1050, 835, { t: gt, pose: 'sit', seat: 200 / .6, f: -1, e: 'n', look: -1, armF: [.75, .85], armB: [.75, .85] });
      enfant(p, 480, 835, { t: gt, f: 1, e: 'n', look: 1, armF: [1.45, .1], armB: [1.35, .2], holdF: (q, x, y) => camera(q, x + 30, y - 10, .8) });
      if (gt > CUE.click && gt < CUE.click + .25) { p.fillStyle = 'rgba(255,255,255,.85)'; p.fillRect(-400, -200, 2800, 1400); }
      p.restore();
    } else if (shot === 'photo') {
      p.save(); cam2(p, 960, 540, 1.1); salon(p, gt); p.restore();
      p.fillStyle = 'rgba(0,0,0,.5)'; p.fillRect(0, 0, SW, SH);
      p.save(); cam2(p, 960, 540, push(st, 1, 1.18, 2.5)); polaroid(p, 960, 520, 1.45, -.04, q => roomPic(q, {}), clamp(st / 1.2)); holdPhoto(p, 840, 520, 1.45); p.restore();
    } else {
      p.save(); cam2(p, 960 + dx, 560 + dy, 1.1); salon(p, gt);
      armchair(p, 1250, 835, 1); papy(p, 1250, 835, { t: gt, pose: 'sit', seat: 200 / .6, f: -1, e: 'n', look: -1, armF: [.75, .85], armB: [.75, .85] });
      p.restore();
      bust(p, 560, 760, 230, { t: gt, hair: kidHair, e: 'wide', mouth: 'o', look: 1, seed: 2, light: 1 });
    }
  });
};
SC.nuit = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'room'], [at(5, .3), 'face'], [at(5, .62), 'photo'], [at(5, .82), 'decide']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'room') {
      p.save(); cam2(p, 900 + dx, 560 + dy, push(st, 1.05, 1.18, 4)); bedroomNight(p, gt, { clock: '03:12' });
      rr(p, 280, 520, 230, 90, 34); fs(p, '#2B3A7A', 0);
      p.save(); p.translate(400, 545); circ(p, 0, 0, 52); fs(p, SKIN, 0); kidHair(p, 52, [0, 0]); eyes(p, 8, 0, 52, { t: gt, e: 'worried', lookY: -.5, seed: 2 }); p.restore();
      p.restore();
    } else if (shot === 'face' || shot === 'decide') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); bedroomNight(p, gt, { clock: '03:12' }); p.restore();
      p.fillStyle = 'rgba(0,0,10,.35)'; p.fillRect(0, 0, SW, SH);
      const d = shot === 'decide';
      bust(p, 960, 640, 230, { t: gt, hair: kidHair, e: d ? 'n' : 'sad', mouth: d ? 'flat' : undefined, lookY: d ? 0 : .4, seed: 2, light: 1, rim: 'rgba(170,190,255,.9)' });
    } else {
      p.save(); cam2(p, 960, 540, 1.05); bedroomNight(p, gt, { clock: '03:12' }); p.restore();
      p.fillStyle = 'rgba(0,0,10,.5)'; p.fillRect(0, 0, SW, SH);
      p.save(); cam2(p, 960, 540, push(st, 1, 1.15, 2)); polaroid(p, 960, 520, 1.4, .03, q => roomPic(q, {})); holdPhoto(p, 840, 520, 1.4); p.restore();
      p.fillStyle = 'rgba(20,30,80,.25)'; p.fillRect(0, 0, SW, SH);
    }
  });
};
SC.jardin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'lever'], [at(6, .38), 'peche'], [at(6, .53), 'balade'], [at(6, .66), 'potager'], [at(6, .8), 'rire']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'lever') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.05, 1.15, 3)); salon(p, gt, { tvOff: true });
      armchair(p, 1050, 835, 1); papy(p, 1050, 835, { t: gt, pose: 'sit', seat: 200 / .6, f: -1, e: 'sad', mouth: 'frown', look: -1, armF: [1.3, .3], armB: [.75, .85] });
      enfant(p, 620, 835, { t: gt, f: 1, e: 'happy', mouth: 'smile', look: 1, armF: [1.5, .1] });
      p.restore();
    } else if (shot === 'peche') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.05, 1.12, 3)); lake(p, gt);
      const rod = (q, x, y) => { line(q, [[x, y], [x + 260, y - 300]], 8, '#3A2A1A', null); line(q, [[x + 260, y - 300], [x + 330, y + 120]], 2, 'rgba(255,255,255,.8)', null); };
      papy(p, 800, 835, { t: gt, pose: 'sit', seat: 175 / .6, f: 1, e: 'n', look: 1, armF: [1.3, .4], armB: [1.2, .5], holdF: rod });
      enfant(p, 1080, 835, { t: gt, pose: 'sit', seat: 175 / .5, f: 1, e: 'happy', mouth: 'smile', armF: [1.3, .4], armB: [1.2, .5], holdF: rod });
      p.restore();
    } else if (shot === 'balade') {
      p.save(); cam2(p, 960 + dx, 560 + dy, 1.1); pathWalk(p, gt);
      papy(p, 1000, 835, { t: gt, pose: 'walk', walk: gt * 5, f: 1, e: 'n', talk: true, look: -1 });
      enfant(p, 780, 835, { t: gt, pose: 'walk', walk: gt * 6 + 1, f: 1, e: 'happy', mouth: 'smile', look: 1 });
      p.restore();
    } else if (shot === 'potager') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.05, 1.12, 3)); garden(p, gt, 0);
      const can = (q, x, y) => { rr(q, x - 10, y - 20, 90, 70, 12); fs(q, '#3A8AD8', 0); line(q, [[x + 80, y - 10], [x + 150, y - 50]], 12, '#3A8AD8', null); };
      papy(p, 1100, 835, { t: gt, f: -1, e: 'happy', mouth: 'smile', look: -1, lean: .12, armF: [.75, .85] });
      enfant(p, 760, 835, { t: gt, f: 1, e: 'happy', mouth: 'smile', armF: [.75, .85], holdF: can });
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); garden(p, gt, 1); p.restore();
      bust(p, 960, 640, 230, { t: gt, col: PAPY, col2: PAPY2, hair: papyHair, e: 'happy', talk: talking(gt, L(6), E(6) + .3), seed: 6, light: 1 });
    }
  });
};
SC.fin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'drawer'], [at(7, .5), 'zoom'], [L(8), 'garden'], [at(8, .55), 'duo'], [L(9), 'walk']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'drawer') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.05, 1.15, 3)); bedroomNight(p, gt, { clock: '16:30' }); p.restore();
      p.fillStyle = 'rgba(0,0,10,.4)'; p.fillRect(0, 0, SW, SH);
      polaroid(p, 960, 520, 1.4, -.06, q => roomPic(q, {})); holdPhoto(p, 840, 520, 1.4);
    } else if (shot === 'zoom') {
      p.fillStyle = '#0E0C0A'; p.fillRect(0, 0, SW, SH);
      const k = eio(clamp(st / 2.2)), z = lerp(1.4, 4.2, k);
      p.save(); cam2(p, lerp(960, 960 + 88 * z, k), lerp(540, 520 - 82 * z, k), 1);
      polaroid(p, 960, 520, z, 0, q => roomPic(q, { sil: clamp((gt - CUE.sil + 1.2) / 1) }));
      p.restore();
    } else if (shot === 'garden') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.15, 1.05, 3)); garden(p, gt, 1);
      papy(p, 1060, 835, { t: gt, f: -1, e: 'happy', mouth: 'smile', look: -1 });
      enfant(p, 820, 835, { t: gt, f: 1, e: 'happy', mouth: 'smile', look: 1 });
      p.restore();
    } else if (shot === 'walk') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.05, 1.15, 4)); pathWalk(p, gt);
      papy(p, 1000, 835, { t: gt, pose: 'walk', walk: gt * 5, f: 1, e: 'happy', mouth: 'smile', look: -1 });
      enfant(p, 780, 835, { t: gt, pose: 'walk', walk: gt * 6 + 1, f: 1, e: 'happy', mouth: 'smile', look: 1 });
      p.restore();
    } else {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.05, 1.15, 4)); salon(p, gt, { tvOff: true, sil: true });
      armchair(p, 700, 835, 1);
      p.restore();
    }
  });
  finCard(c, gt, CUE.endcard, 'Toi, qui tu prendrais en photo ?');
};
