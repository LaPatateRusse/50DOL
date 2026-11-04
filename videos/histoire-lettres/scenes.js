// Les lettres du futur — histoire originale complète (14:30 du 05/11), style cinéma (cinema.js + cinema-rig.js).
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const NOE = '#5A6478', NOE2 = '#4A5468';

const kidHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .05, r * 1.04, Math.PI * 1.05, Math.PI * 1.95); c.quadraticCurveTo(r * .5, -r * .7, 0, -r * .62); c.quadraticCurveTo(-r * .6, -r * .72, -r * 1.0, -r * .3); c.closePath(); fs(c, '#4A2E1E', 0); c.restore(); };
const noeHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); c.fillStyle = '#B8862A';
  for (let i = 0; i < 8; i++) { const a = Math.PI * (1.0 + i * .143); circ(c, Math.cos(a) * r * .92, Math.sin(a) * r * .92, r * .26); c.fill(); } c.restore(); };

// ---------- accessoires ----------
function letter(p, x, y, s, lines, o = {}) {
  p.save(); p.translate(x, y); p.rotate(o.rot || -.03); p.scale(s, s);
  p.shadowColor = 'rgba(0,0,0,.45)'; p.shadowBlur = 30; rr(p, -380, -250, 760, 500, 8); fs(p, '#FBF6EA', 0); p.shadowBlur = 0;
  for (let i = 0; i < 7; i++) line(p, [[-340, -160 + i * 64], [340, -160 + i * 64]], 2, 'rgba(90,120,180,.35)', null);
  const k = o.k ?? 1;
  lines.forEach((l, i) => { const a = clamp(k * lines.length - i); if (a <= 0) return; p.globalAlpha = a;
    text(p, l[0], -330, -170 + i * 58, `italic 700 ${l[2] || 40}px Montserrat`, l[1] || '#2A3A6A', 'left'); });
  p.globalAlpha = 1; p.restore();
}
function mailbox(p, x, y, s, open = 0) {
  p.save(); p.translate(x, y); p.scale(s, s);
  rr(p, -160, -120, 320, 240, 10); fs(p, '#7A6A4A', 0); rr(p, -120, -60, 240, 24, 8); fs(p, '#1A1A20', 0);
  rr(p, -60, 20, 120, 50, 6); fs(p, '#E8E0C8', 0); text(p, '6e', 0, 47, '800 30px Montserrat', '#5A4A30');
  if (open) { p.save(); p.translate(0, -48 - open * 60); rr(p, -90, -40, 180, 80, 4); fs(p, '#FBF6EA', 0); p.restore(); }
  p.restore();
}
const umbrella = (q, x, y) => { line(q, [[x, y], [x, y - 330]], 10, '#3A3A48', null); q.beginPath(); q.arc(x, y - 320, 210, Math.PI, 0); q.closePath(); fs(q, '#E05B4B', 0); };

// ---------- décors ----------
function stairs(p, gt) {
  p.fillStyle = grad(p, 0, 780, ['#C9BCA6', '#B4A68E']); p.fillRect(-400, -200, 2800, 1100);
  for (let i = 0; i < 8; i++) { rr(p, 1200 + i * 90, 780 - i * 70, 600, 70, 2); fs(p, '#8A7A62', 0); }
  for (let i = 0; i < 6; i++) { rr(p, 200 + i * 140, 300, 110, 150, 6); fs(p, '#6A5A3A', 0); }
  rr(p, 940, 280, 200, 190, 8); fs(p, '#7A6A4A', 0); rr(p, 970, 330, 140, 18, 6); fs(p, '#1A1A20', 0); text(p, '6e', 1040, 420, '800 30px Montserrat', '#E8E0C8');
  glow(p, 900, 120, 500, 'rgba(255,230,180,A)', .35);
  p.fillStyle = '#7A6A52'; p.fillRect(-400, 780, 2800, 500);
}
function rainStreet(p, gt) {
  p.fillStyle = grad(p, 0, 700, ['#5A6A80', '#7A8A9A']); p.fillRect(-400, -200, 2800, 1000);
  for (let i = 0; i < 7; i++) { rr(p, -300 + i * 380, 160 + (i % 3) * 40, 300, 640, 6); fs(p, ['#6A7488', '#5E687C', '#727C90'][i % 3], 0); for (let j = 0; j < 4; j++) { rr(p, -260 + i * 380, 220 + (i % 3) * 40 + j * 130, 80, 80, 4); fs(p, '#9AA8BA', 0); } }
  p.fillStyle = '#4A5260'; p.fillRect(-400, 780, 2800, 500);
  for (let i = 0; i < 160; i++) { const x = (i * 137 + gt * 200) % 2600 - 300, y = (i * 211 + gt * 1400) % 1300 - 200; line(p, [[x, y], [x - 8, y + 40]], 3, 'rgba(220,230,255,.5)', null); }
}
function classroom(p, gt) {
  p.fillStyle = grad(p, 0, 780, ['#D8E4EC', '#C4D2DC']); p.fillRect(-400, -200, 2800, 1000);
  rr(p, 380, 120, 1160, 360, 10); fs(p, '#2F4A3A', 14, '#8A6A3A'); text(p, 'Dictée', 960, 260, '700 56px Montserrat', 'rgba(255,255,255,.85)');
  p.fillStyle = '#9A8A70'; p.fillRect(-400, 780, 2800, 500);
}
function chair(p, x, y) { rr(p, x - 55, y - 140, 110, 16, 5); fs(p, '#5A8AC8', 0); line(p, [[x - 45, y - 124], [x - 45, y]], 9, '#5A6478', null); line(p, [[x + 45, y - 124], [x + 45, y]], 9, '#5A6478', null); }
function desk(p, x, y) { rr(p, x - 160, y - 150, 320, 26, 6); fs(p, '#C99A5A', 0); line(p, [[x - 130, y - 124], [x - 130, y]], 12, '#5A6478', null); line(p, [[x + 130, y - 124], [x + 130, y]], 12, '#5A6478', null); }
function finCard(c, gt, t0, q) {
  const k = pr(gt, t0, t0 + .2); if (k <= 0) return;
  stage(c, p => {
    p.fillStyle = `rgba(5,6,10,${k})`; p.fillRect(0, 0, SW, SH);
    const b = pop(gt, t0 + .15, .45), qq = clamp((gt - t0 - .8) * 3);
    if (b) { p.save(); p.translate(SW / 2, 430); p.scale(b, b); text(p, 'FIN', 0, 0, '900 190px Montserrat', '#F5B82E'); p.restore(); }
    if (qq > 0) { p.globalAlpha = qq; text(p, q, SW / 2, 700, '800 54px Montserrat', '#FFFFFF'); text(p, 'Dis-le en commentaire', SW / 2, 790, '700 38px Montserrat', '#9AA2BC'); }
  }, { vig: .3 });
}

// ---------- HUD ----------
function hud(c, gt) {
  const n = gt < CUE.l1 ? 3 : gt < CUE.l2 ? 2 : gt < CUE.l3 ? 1 : 0;
  const day = gt < L(1) ? undefined : gt < L(4) ? 1 : gt < L(6) ? 2 : 3;
  cinemaHud(c, gt, { part: 'Les lettres du futur', off: gt > CUE.endcard, day, dayAt: day === 2 ? L(4) : day === 3 ? L(6) : L(1), val: 'LETTRES : ' + n, neg: n === 0, bump: [CUE.l3, CUE.l2, CUE.l1][n] });
}

const enfant = (p, x, y, o = {}) => rig(p, { x, y, s: o.s || .5, f: o.f || 1, t: o.t, pose: o.pose, seat: o.seat, walk: o.walk, hair: kidHair, e: o.e || 'n', mouth: o.mouth, look: o.look, lookY: o.lookY, armF: o.armF, armB: o.armB, holdF: o.holdF, seed: 2, light: o.light ?? 1 });
const noe = (p, x, y, o = {}) => rig(p, { x, y, s: .5, f: o.f || -1, t: o.t, pose: 'sit', seat: 140 / .5, col: NOE, col2: NOE2, hair: noeHair, e: o.e || 'n', mouth: o.mouth, look: o.look, lookY: o.lookY, armF: [.75, .85], armB: [.75, .85], seed: 9, light: o.light ?? -1 });
const me = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, hair: kidHair, seed: 2, light: 1, ...o });

// ---------- scènes ----------
SC.flash = (c, lt, gt) => {
  film(c, gt, p => {
    p.fillStyle = grad(p, 0, 1080, ['#2A2420', '#0E0C0A']); p.fillRect(0, 0, SW, SH); glow(p, 960, 520, 650, 'rgba(255,220,170,A)', .3);
    p.save(); cam2(p, 960, 540, push(lt, 1.0, 1.2, 3));
    letter(p, 960, 540, 1.5, [['Salut,'], ['C\'est toi.'], ['Dans dix ans.'], [''], ['— Toi, 24 ans', '#7A3A3A']], { k: clamp(lt / 2) });
    p.restore();
  });
};
SC.immeuble = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'stairs'], [at(1, .55), 'box'], [L(2), 'slip'], [CUE.reply - .4, 'reply'], [at(2, .85), 'face']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'stairs') {
      p.save(); cam2(p, 900 + dx, 560 + dy, push(st, 1.05, 1.15, 3)); stairs(p, gt);
      enfant(p, lerp(400, 760, clamp(st / 3)), 835, { t: gt, pose: st < 3 ? 'walk' : 'stand', walk: gt * 7, look: 1, lookY: -.3 });
      p.restore();
    } else if (shot === 'box' || shot === 'slip') {
      p.save(); cam2(p, 960, 560, 1.1); stairs(p, gt); p.restore(); p.fillStyle = 'rgba(0,0,0,.35)'; p.fillRect(0, 0, SW, SH);
      const k = shot === 'slip' ? clamp((gt - CUE.slip + .6) / .8) : 0;
      mailbox(p, 960, 600, 2);
      if (shot === 'slip' && k < 1) { p.save(); p.translate(960, lerp(280, 470, k)); rr(p, -150, -60, 300, 120, 4); fs(p, '#FFF6A8', 0); text(p, 'Qui est là ?', 0, 8, 'italic 700 40px Montserrat', '#3A3A48'); p.restore(); hand(p, 1100, lerp(330, 520, k), .7, -2.4, {}); }
    } else if (shot === 'reply') {
      p.save(); cam2(p, 960, 560, 1.1); stairs(p, gt); p.restore(); p.fillStyle = 'rgba(0,0,0,.45)'; p.fillRect(0, 0, SW, SH);
      letter(p, 960, 540, 1.4, [['Bonjour,'], ['C\'est toi.'], ['Dans dix ans.'], [''], ['— Toi, 24 ans', '#7A3A3A']], { k: clamp(st / 1.5) });
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); stairs(p, gt); p.restore();
      me(p, 960, 640, 230, gt, { e: 'wide', mouth: 'o' });
    }
  });
};
SC.lettre = (c, lt, gt) => {
  film(c, gt, p => {
    p.fillStyle = grad(p, 0, 1080, ['#2A2420', '#0E0C0A']); p.fillRect(0, 0, SW, SH); glow(p, 960, 520, 650, 'rgba(255,220,170,A)', .3);
    p.save(); cam2(p, 960, 540, push(lt, 1.0, 1.15, 3));
    letter(p, 960, 540, 1.5, [['Je n\'ai droit qu\'à'], ['trois lettres.'], [''], ['Alors écoute bien.', '#7A3A3A', 46]], { k: clamp(lt / 1.6) });
    p.restore();
  });
};
SC.pluie = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'l1'], [at(4, .45), 'street'], [CUE.rain + .4, 'me']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'l1') {
      p.fillStyle = '#14100E'; p.fillRect(0, 0, SW, SH);
      p.save(); cam2(p, 960, 540, push(st, 1, 1.1, 2)); letter(p, 960, 540, 1.5, [['1.'], ['Demain,'], ['prends ton parapluie.', '#2A3A6A', 46]], { k: clamp(st / 1.2), rot: .03 }); p.restore();
    } else if (shot === 'street') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.05, 1.15, 3)); rainStreet(p, gt);
      [[500, '#E05B8B'], [1400, '#5BBF7A'], [1600, '#F2A31B']].forEach(([x, col], i) => rig(p, { x, y: 835, s: .5, f: i ? -1 : 1, t: gt, col, col2: col, e: 'sad', mouth: 'frown', armF: [2.6, 1.1], armB: [2.6, 1.1], seed: 5 + i, light: 1 }));
      enfant(p, 960, 835, { t: gt, e: 'happy', mouth: 'smile', armF: [1.5, .9], holdF: umbrella });
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); rainStreet(p, gt); p.restore();
      me(p, 960, 680, 220, gt, { e: 'happy', mouth: 'smile' });
      p.save(); p.beginPath(); p.arc(960, 470, 520, Math.PI, 0); p.closePath(); fs(p, '#E05B4B', 0); p.restore();
    }
  });
};
SC.classe = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'l2'], [at(5, .62), 'noe'], [L(6), 'sit'], [CUE.smile - .3, 'smile']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'l2') {
      p.fillStyle = '#14100E'; p.fillRect(0, 0, SW, SH);
      p.save(); cam2(p, 960, 540, push(st, 1, 1.1, 2)); letter(p, 960, 540, 1.5, [['2.'], ['Arrête de te moquer'], ['de Noé.'], ['Il n\'a plus personne,'], ['à part toi.', '#7A3A3A']], { k: clamp(st / 2) }); p.restore();
    } else if (shot === 'noe') {
      p.save(); cam2(p, 1300 + dx, 600 + dy, push(st, 1.2, 1.35, 3)); classroom(p, gt);
      chair(p, 1400, 835); desk(p, 1300, 835); noe(p, 1400, 835, { t: gt, f: -1, e: 'sad', lookY: .5 });
      p.restore();
    } else if (shot === 'sit') {
      p.save(); cam2(p, 1250 + dx, 600 + dy, push(st, 1.1, 1.2, 3)); classroom(p, gt);
      chair(p, 1400, 835); chair(p, 1100, 835); desk(p, 1250, 835); noe(p, 1400, 835, { t: gt, f: -1, e: 'wide', look: -1 });
      rig(p, { x: lerp(800, 1100, clamp(st / 1.5)), y: 835, s: .5, f: 1, t: gt, pose: st < 1.5 ? 'walk' : 'sit', seat: 140 / .5, walk: gt * 7, hair: kidHair, e: 'happy', mouth: 'smile', look: 1, armF: st < 1.5 ? undefined : [.75, .85], armB: st < 1.5 ? undefined : [.75, .85], seed: 2, light: 1 });
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); classroom(p, gt); p.restore();
      const on = gt > CUE.smile; if (on) glow(p, 960, 560, 500, 'rgba(255,220,160,A)', .3);
      bust(p, 960, 640, 230, { t: gt, col: NOE, col2: NOE2, hair: noeHair, e: on ? 'happy' : 'n', mouth: on ? 'smile' : undefined, seed: 9, light: 1 });
    }
  });
};
SC.fin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'l3'], [CUE.noe - .3, 'noe'], [L(9), 'duo']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'l3' || shot === 'noe') {
      p.fillStyle = '#14100E'; p.fillRect(0, 0, SW, SH); glow(p, 960, 520, 650, 'rgba(255,220,170,A)', .25);
      p.save(); cam2(p, 960, shot === 'noe' ? 590 : 540, push(gt - L(7), 1.0, 1.1, 6));
      letter(p, 960, 540, 1.5, [['3.'], ['Merci. Noé est devenu'], ['mon meilleur ami.'], ['Samedi, il est mon témoin.'], [''], ['Merci de t\'être assis', '#2E7A4A'], ['à côté de moi. Noé', '#2E7A4A']], { k: shot === 'noe' ? .72 + clamp((gt - CUE.noe) / 1.5) * .28 : clamp(st / 2.4) * .72 });
      p.restore();
    } else {
      p.save(); cam2(p, 1150 + dx, 600 + dy, push(st, 1.1, 1.2, 3)); classroom(p, gt);
      chair(p, 1400, 835); chair(p, 1100, 835); desk(p, 1250, 835); noe(p, 1400, 835, { t: gt, f: -1, e: 'happy', mouth: 'smile', look: -1 });
      rig(p, { x: 1100, y: 835, s: .5, f: 1, t: gt, pose: 'sit', seat: 140 / .5, hair: kidHair, e: 'happy', mouth: 'smile', look: 1, armF: [.75, .85], armB: [.75, .85], seed: 2, light: 1 });
      p.restore();
    }
  });
  finCard(c, gt, CUE.endcard, 'Tu écrirais quoi à ton toi du futur ?');
};
