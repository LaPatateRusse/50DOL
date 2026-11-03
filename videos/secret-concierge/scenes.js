// Le secret du concierge — format « Le secret de… » n°3, style cinéma (cinema.js + cinema-rig.js). Histoire originale.
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const JAN = '#3A6EA5', JAN2 = '#2E5A8A', MATE1 = '#E05B8B', MATE2 = '#5BBF7A', MATE3 = '#9B6BD6';

// cheveux gris sur les côtés (crâne dégarni) + moustache
const janHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, 0, r * 1.06, Math.PI * 1.0, Math.PI * 2.0); c.quadraticCurveTo(r * .3, -r * .55, -r * .2, -r * .5); c.quadraticCurveTo(-r * .8, -r * .38, -r * 1.06, 0); c.closePath(); c.fillStyle = '#B8BCC6'; c.fill();
  rr(c, r * .02, r * .3, r * .5, r * .13, r * .06); fs(c, '#B8BCC6', 0); c.restore(); };
const capHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .1, r * 1.03, Math.PI * 1.02, Math.PI * 1.98); c.closePath(); fs(c, '#D83A3A', 0);
  rr(c, r * .2, -r * .45, r * 1.05, r * .2, r * .1); fs(c, '#B02828', 0); c.restore(); };
const ponyHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); c.fillStyle = '#E8B040';
  c.beginPath(); c.arc(0, 0, r * 1.06, Math.PI * 1.0, Math.PI * 2.0); c.quadraticCurveTo(r * .3, -r * .62, -r * .2, -r * .58); c.quadraticCurveTo(-r * .8, -r * .45, -r * 1.06, 0); c.closePath(); c.fill();
  c.beginPath(); c.ellipse(-r * 1.15, r * .1, r * .25, r * .5, .3, 0, Math.PI * 2); c.fill(); c.restore(); };
const mop = (q, x, y) => { line(q, [[x - 10, y - 90], [x + 40, y + 250]], 10, '#8A6A3A', null); rr(q, x - 10, y + 236, 110, 30, 10); fs(q, '#D8D2C0', 0); };
const holdBook = (q, x, y) => { rr(q, x - 10, y - 50, 70, 90, 6); fs(q, '#E05B4B', 0); rr(q, x - 4, y - 44, 58, 78, 4); fs(q, null, 3, '#FFFFFF'); };

// main qui montre la lettre n° i (index sur la lettre, poignet en bas à droite)
function pointAt(p, bx, by, bs, i) { const tx = bx + (60 + i * 48) * bs, ty = by - 30 * bs; hand(p, tx + 59, ty + 172, .75, -1.9, { point: true, sleeve: JAN, cuff: JAN2 }); }
// livre ouvert de CP (gros plan) ; hl : nombre de lettres de « BONJOUR » éclairées
function book(c, x, y, s, hl = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  rr(c, -420, -220, 840, 440, 18); fs(c, '#C9B89A', 0);
  rr(c, -400, -205, 395, 410, 10); fs(c, '#FBF6EA', 0); rr(c, 5, -205, 395, 410, 10); fs(c, '#FBF6EA', 0);
  line(c, [[0, -205], [0, 205]], 6, '#C9B89A', null);
  text(c, 'Bb', -200, -90, '900 110px Montserrat', '#E05B4B');
  circ(c, -200, 80, 70); fs(c, '#F5B82E', 0); text(c, 'bateau', -200, 180, '700 34px Montserrat', '#5A5A6A');
  'BONJOUR'.split('').forEach((l, i) => text(c, l, 60 + i * 48, -40, '900 62px Montserrat', i < hl ? '#2E6FD8' : '#3A3A48'));
  text(c, 'la maison', 200, 60, '700 40px Montserrat', '#3A3A48'); text(c, 'le soleil', 200, 130, '700 40px Montserrat', '#3A3A48');
  c.restore();
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

// ---------- HUD ----------
function hud(c, gt) {
  const day = gt < L(1) ? undefined : gt < L(7) ? 1 : gt < L(8) ? 2 : 92;
  const read = gt > CUE.months, w = gt > CUE.word;
  cinemaHud(c, gt, { part: 'Le secret du concierge', off: gt > CUE.endcard, day, dayAt: day === 2 ? L(7) : day === 92 ? L(8) : L(1),
    val: read ? 'IL SAIT LIRE' : w ? 'MOTS LUS : 1' : 'MOTS LUS : 0', neg: !w, bump: read ? CUE.months : w ? CUE.word : undefined });
}

// ---------- décors (repère 1920 × 1080) ----------
function hallway(p, gt, dark) {
  p.fillStyle = grad(p, 0, 780, dark ? ['#2A2A40', '#20202E'] : ['#E8DCC4', '#D8CAB0']); p.fillRect(-400, -200, 2800, 1000);
  for (let i = 0; i < 5; i++) { rr(p, -100 + i * 480, 170, 300, 240, 8); fs(p, dark ? '#3A3050' : '#F2A86A', 0); if (!dark) glow(p, 50 + i * 480, 290, 220, 'rgba(255,190,120,A)', .25); rr(p, -110 + i * 480, 160, 320, 260, 8); fs(p, null, 10, dark ? '#4A4A5E' : '#9A8E78'); }
  for (let i = 0; i < 14; i++) { line(p, [[120 + i * 140, 470], [120 + i * 140, 500]], 8, dark ? '#4A4A5E' : '#7A6E58', null); circ(p, 120 + i * 140, 505, 9); fs(p, dark ? '#4A4A5E' : '#7A6E58', 0); }
  p.fillStyle = dark ? '#1A1A26' : '#B8AE98'; p.fillRect(-400, 780, 2800, 500);
  p.fillStyle = dark ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.18)'; p.fillRect(-400, 790, 2800, 30);
}
function classDoor(p, gt, lit) {
  rr(p, 1350, 330, 300, 460, 6); fs(p, '#6A4A30', 0); rr(p, 1400, 380, 200, 140, 6); fs(p, lit ? '#FFD9A0' : '#2A2A3A', 0);
  text(p, 'CE2 B', 1500, 570, '800 34px Montserrat', '#F4EEE4');
  if (lit) { glow(p, 1500, 450, 260, 'rgba(255,210,150,A)', .5); p.fillStyle = 'rgba(255,214,150,.7)'; p.fillRect(1350, 784, 300, 8); cone(p, 1500, 790, 150, 400, 300, 'rgba(255,214,150,A)', .25); }
}
function classroom(p, gt, night) {
  p.fillStyle = grad(p, 0, 780, night ? ['#3A3450', '#2C2840'] : ['#D8E4EC', '#C4D2DC']); p.fillRect(-400, -200, 2800, 1000);
  rr(p, 380, 140, 1160, 400, 10); fs(p, '#2F4A3A', 14, '#8A6A3A');
  text(p, 'b + a = ba', 700, 280, '700 64px Montserrat', 'rgba(255,255,255,.85)'); text(p, 'Bonjour !', 1180, 400, '700 64px Montserrat', 'rgba(255,255,255,.85)');
  p.fillStyle = night ? '#2A2436' : '#9A8A70'; p.fillRect(-400, 780, 2800, 500);
  if (night) glow(p, 960, 560, 700, 'rgba(255,210,150,A)', .28);
}
function deskRow(p, xs, y, lit) {
  xs.forEach(x => { rr(p, x - 130, y - 150, 260, 26, 6); fs(p, lit ? '#C99A5A' : '#B08850', 0); line(p, [[x - 110, y - 124], [x - 110, y]], 12, '#5A6478', null); line(p, [[x + 110, y - 124], [x + 110, y]], 12, '#5A6478', null); });
}
const chair = (p, x, y, h) => { rr(p, x - 60, y - h, 120, 18, 5); fs(p, '#5A8AC8', 0); line(p, [[x - 50, y - h + 18], [x - 50, y]], 10, '#5A6478', null); line(p, [[x + 50, y - h + 18], [x + 50, y]], 10, '#5A6478', null); rr(p, x - 66, y - h - 130, 16, 130, 5); fs(p, '#5A8AC8', 0); };
const jan = (p, x, y, o = {}) => rig(p, { x, y, s: o.s || .6, f: o.f || 1, t: o.t, pose: o.pose, seat: o.seat, walk: o.walk, col: JAN, col2: JAN2, pants: '#24344E', hair: janHair, e: o.e || 'n', mouth: o.mouth, talk: o.talk, lookY: o.lookY, armF: o.armF, armB: o.armB, holdF: o.holdF, seed: 5, light: o.light ?? 1 });

// ---------- scènes ----------
SC.flash = (c, lt, gt) => {
  film(c, gt, p => {
    p.fillStyle = grad(p, 0, 1080, ['#2A2420', '#0E0C0A']); p.fillRect(0, 0, SW, SH); glow(p, 960, 520, 650, 'rgba(255,220,170,A)', .3);
    p.save(); cam2(p, 960, 560, push(lt, 1.05, 1.25, 3));
    book(p, 960, 600, 1.5, Math.floor(clamp(lt / 2.6) * 7));
    pointAt(p, 960, 600, 1.5, Math.min(6, clamp(lt / 2.6) * 7));
    p.restore();
  });
};
SC.couloir = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'mop'], [L(2), 'kids'], [L(3), 'back'], [CUE.light - .6, 'door']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'mop') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.1, 1.2, 4)); hallway(p, gt, false);
      [[1500, MATE1, null], [1720, MATE2, capHair], [1900, MATE3, ponyHair]].forEach(([x, col, hair], i) =>
        rig(p, { x: x + st * 90, y: 835, s: .45, f: 1, t: gt, pose: 'walk', walk: gt * 7 + i, col, col2: col, hair, e: 'happy', seed: 7 + i, light: -1 }));
      const sw = Math.sin(gt * 2.4) * .25;
      jan(p, 760, 835, { t: gt, f: 1, lookY: .4, armF: [.6 + sw, .3], armB: [.5 + sw, .4], holdF: mop, light: 1 });
      p.restore();
    } else if (shot === 'kids') {
      p.save(); cam2(p, 1000 + dx, 560 + dy, 1.35); hallway(p, gt, false);
      [[760, MATE1, null, 1], [980, MATE2, capHair, 1], [1200, MATE3, ponyHair, -1]].forEach(([x, col, hair, f], i) =>
        rig(p, { x, y: 835, s: .5, f, t: gt, col, col2: col, hair, e: 'side', look: f, talk: talking(gt, L(2) + i * .9, L(2) + i * .9 + 1.2), seed: 7 + i, light: 1 }));
      p.restore();
    } else {
      const dark = true;
      p.save(); cam2(p, (shot === 'door' ? 1350 : 1000) + dx, 600 + dy, shot === 'door' ? 1.3 : 1.12); hallway(p, gt, dark);
      classDoor(p, gt, gt > CUE.light);
      rig(p, { x: lerp(500, 1150, eo(clamp((gt - L(3)) / 3))), y: 835, s: .5, f: 1, t: gt, pose: gt < L(3) + 3 ? 'walk' : 'stand', walk: gt * 7, e: gt > CUE.light ? 'wide' : 'n', look: 1, light: 1 });
      p.restore();
    }
  });
};
SC.classe = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'door'], [at(4, .6), 'finger'], [L(5), 'smile'], [L(6), 'see'], [at(6, .3), 'confess']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'door' || shot === 'see') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.05, 1.15, 4)); classroom(p, gt, true);
      chair(p, 1020, 835, 140); deskRow(p, [500, 1440], 835, false);
      jan(p, 1020, 835, { t: gt, pose: 'sit', seat: 140 / .6, f: -1, lookY: shot === 'see' ? 0 : .5, e: shot === 'see' ? 'wide' : 'n', armF: [1.25, .45], armB: [1.2, .5], light: -1 });
      deskRow(p, [930], 835, true); rr(p, 860, 670, 120, 16, 4); fs(p, '#FBF6EA', 0);
      p.restore();
      // encadrement de la porte entrouverte (on regarde par l'entrebâillement)
      p.fillStyle = '#0E0C14'; p.fillRect(0, 0, 420, SH); p.fillRect(1500, 0, 420, SH);
      if (shot === 'see') blurred(p, 8, q => bust(q, 260, 700, 230, { t: gt, e: 'wide', look: 1, light: 1 }));
    } else if (shot === 'finger') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 2)); classroom(p, gt, true); p.restore();
      p.fillStyle = 'rgba(0,0,0,.25)'; p.fillRect(0, 0, SW, SH);
      book(p, 960, 600, 1.5, Math.floor(clamp(st / 2) * 3));
      pointAt(p, 960, 600, 1.5, Math.min(2.5, clamp(st / 2) * 3));
    } else if (shot === 'smile') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); classroom(p, gt, true);
      const on = gt > CUE.word + .8; if (on) glow(p, 960, 560, 500, 'rgba(255,220,160,A)', .3);
      bust(p, 960, 640, 230, { t: gt, col: JAN, col2: JAN2, hair: janHair, e: on ? 'happy' : 'n', mouth: on ? 'smile' : undefined, talk: talking(gt, CUE.word - .2, CUE.word + 1.4), lookY: on ? 0 : .5, seed: 5, light: 1 });
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); classroom(p, gt, true);
      bust(p, 960, 640, 230, { t: gt, col: JAN, col2: JAN2, hair: janHair, e: 'sad', talk: talking(gt, at(6, .35), E(6)), lookY: .2, seed: 5, light: 1 });
      p.restore();
    }
  });
};
SC.fin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'cart'], [L(8), 'read']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'cart') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.05, 1.18, 4)); hallway(p, gt, false);
      rr(p, 760, 600, 420, 30, 8); fs(p, '#5A6478', 0); rr(p, 790, 630, 360, 150, 10); fs(p, '#F2C230', 0); [800, 1140].forEach(x => { circ(p, x, 800, 26); fs(p, '#1A1A22', 0); });
      line(p, [[1170, 600], [1240, 420]], 12, '#5A6478', null);
      const k = eo(clamp(st / 1.4));
      p.save(); p.translate(lerp(600, 880, k), lerp(420, 560, k)); p.rotate(lerp(-.4, -.08, k)); rr(p, -10, -60, 150, 110, 8); fs(p, '#E05B4B', 0); rr(p, 0, -50, 130, 90, 6); fs(p, null, 4, '#FFFFFF'); text(p, 'LECTURE', 65, -6, '800 22px Montserrat', '#FFFFFF'); p.restore();
      if (gt > CUE.note - .8) { const n = pop(gt, CUE.note - .8, .4); p.save(); p.translate(1020, 545); p.scale(n, n); p.rotate(.06); rr(p, -110, -50, 220, 100, 4); fs(p, '#FFF6A8', 0); text(p, 'Je peux vous', 0, -14, '700 24px Montserrat', '#3A3A48'); text(p, 'aider, tous les soirs', 0, 18, '700 22px Montserrat', '#3A3A48'); p.restore(); }
      if (st < 1.4) hand(p, lerp(400, 680, k), lerp(380, 520, k), .8, .5, {});
      p.restore();
    } else {
      p.save(); cam2(p, 960 + dx, 560 + dy, gt > L(9) ? push(gt - L(9), 1.25, 1.12, 3) : push(st, 1.12, 1.25, 3)); classroom(p, gt, true);
      chair(p, 860, 835, 140); chair(p, 1120, 835, 120);
      jan(p, 860, 835, { t: gt, pose: 'sit', seat: 140 / .6, f: 1, e: 'happy', mouth: 'smile', talk: talking(gt, L(8), E(8) + 1.5), lookY: .4, armF: [1.3, .5], armB: [1.2, .5], holdF: holdBook, light: 1 });
      rig(p, { x: 1120, y: 835, s: .5, f: -1, t: gt, pose: 'sit', seat: 120 / .5, e: 'happy', mouth: 'smile', armF: [.75, .85], armB: [.75, .85], light: -1 });
      p.restore();
    }
  });
  finCard(c, gt, CUE.endcard, 'Et toi… tu l\'aurais aidé ?');
};
