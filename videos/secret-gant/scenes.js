// Le secret du gant — format « Le secret de… » (directives agent stratège), style cinéma (cinema.js + cinema-rig.js).
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const DAD = '#4A6A8A', DAD2 = '#3A5672', GLOVE = '#6B4A30', MATE1 = '#E05B8B', MATE2 = '#5BBF7A';

const dadHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, 0, r * 1.06, Math.PI * 1.0, Math.PI * 2.0); c.quadraticCurveTo(r * .3, -r * .62, -r * .2, -r * .58); c.quadraticCurveTo(-r * .8, -r * .45, -r * 1.06, 0); c.closePath(); c.fillStyle = '#2A1E16'; c.fill();
  c.restore(); };
const capHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .1, r * 1.03, Math.PI * 1.02, Math.PI * 1.98); c.closePath(); fs(c, '#D83A3A', 0);
  rr(c, r * .2, -r * .45, r * 1.05, r * .2, r * .1); fs(c, '#B02828', 0); c.restore(); };
// gant marron porté sur la main de rig() (holdF dessine par-dessus la main avant)
const gloveOn = (q, x, y) => { circ(q, x, y, 22); fs(q, GLOVE, 0); circ(q, x + 12, y - 10, 11); fs(q, GLOVE, 0); };
// main en gros plan, couleur au choix ; scars : cicatrices
function bigHand(c, x, y, s, ang, col, o = {}) {
  c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s);
  if (!o.noSleeve) { rr(c, -260, -62, 270, 124, 50); fs(c, o.sleeve || DAD, 0); }
  c.beginPath(); c.ellipse(70, 0, 80, 64, 0, 0, Math.PI * 2); fs(c, col, 0);
  [[-.3, .7], [-.05, .75], [.2, .72], [.45, .62]].forEach(([a, L]) => line(c, [[110, a * 50], [110 + Math.cos(a * .5) * 95 * L, a * 50 + Math.sin(a * .5) * 95 * L]], 30, col, null));
  line(c, [[40, -50], [90, -110]], 30, col, null);
  if (o.scars) { c.globalAlpha = o.scars; [[20, -30, 120, 10], [40, 20, 150, 30], [60, -10, 140, -40], [10, 40, 90, 55]].forEach(([a, b, x2, y2]) => line(c, [[a, b], [x2, y2]], 7, '#C9876E', null)); c.globalAlpha = 1; }
  c.restore();
}

// ---------- HUD ----------
function hud(c, gt) {
  const told = gt > CUE.baby;
  const day = gt < L(1) ? undefined : gt < L(10) ? 1 : 2;
  cinemaHud(c, gt, { part: 'Le secret du gant', off: gt > CUE.endcard, day, dayAt: day === 2 ? L(10) : L(1),
    val: told ? 'SECRET RÉVÉLÉ' : 'SECRET : ???', neg: !told, bump: told ? CUE.baby : undefined });
}

// ---------- décors (repère 1920 × 1080) ----------
function schoolDay(p, gt) {
  p.fillStyle = grad(p, 0, 700, ['#8FB8E0', '#D8E8F4']); p.fillRect(-400, -200, 2800, 1000);
  rr(p, 900, 220, 1100, 560, 6); fs(p, '#D9C49A', 0); rr(p, 880, 190, 1140, 50, 6); fs(p, '#B05A3A', 0);
  for (let i = 0; i < 6; i++) for (let r = 0; r < 2; r++) { rr(p, 950 + i * 170, 290 + r * 200, 110, 130, 6); fs(p, '#9FC7E8', 0); }
  text(p, 'ÉCOLE', 1450, 262, '800 40px Montserrat', '#FFFFFF');
  p.fillStyle = '#8A8F9C'; p.fillRect(-400, 780, 2800, 60); p.fillStyle = '#6A707C'; p.fillRect(-400, 840, 2800, 400);
  for (let x = -300; x < 2300; x += 50) line(p, [[x, 640], [x, 790]], 6, '#3A3F4A', null);
  line(p, [[-300, 660], [2300, 660]], 8, '#3A3F4A', null);
  cone(p, 1700, -100, 200, 900, 1000, 'rgba(255,250,220,A)', .18);
}
function carInside(p, gt) {
  p.fillStyle = grad(p, 0, 1080, ['#2A3A50', '#1A2232']); p.fillRect(-200, -200, 2400, 1500);
  const off = (gt * 300) % 400; for (let i = 0; i < 8; i++) { rr(p, -200 + i * 400 - off, 300, 220, 260, 6); fs(p, '#3A4E6A', 0); }
  p.fillStyle = 'rgba(255,240,200,.12)'; p.fillRect(-200, 120, 2400, 520);
  p.fillStyle = '#141A26'; p.fillRect(-200, 640, 2400, 600); rr(p, -200, 80, 2400, 60, 0); fs(p, '#141A26', 0);
  rr(p, 1240, 520, 260, 260, 130); fs(p, null, 22, '#0E1218'); // volant
}
function attic(p, gt) {
  p.fillStyle = '#1A1418'; p.fillRect(-200, -200, 2400, 1500);
  p.beginPath(); p.moveTo(-200, 600); p.lineTo(960, -100); p.lineTo(2200, 600); p.lineTo(2200, -200); p.lineTo(-200, -200); p.closePath(); fs(p, '#0E0A0E', 0);
  for (let i = 0; i < 6; i++) { line(p, [[-100 + i * 380, 640], [960, -40]], 10, '#2A2026', null); }
  [[300, 760, 300, 200, '#5A4030'], [700, 820, 240, 160, '#4A3428'], [1400, 780, 340, 220, '#5A4030']].forEach(([x, y, w, h, col]) => { rr(p, x, y - h, w, h, 6); fs(p, col, 0); line(p, [[x, y - h / 2], [x + w, y - h / 2]], 5, 'rgba(0,0,0,.3)', null); });
  p.fillStyle = '#2A2024'; p.fillRect(-200, 820, 2400, 400);
  line(p, [[1100, -100], [1100, 220]], 4, '#3A3036', null); circ(p, 1100, 240, 26); fs(p, '#FFE6A0', 0);
  cone(p, 1100, 250, 60, 900, 700, 'rgba(255,220,150,A)', .3); glow(p, 1100, 240, 200, 'rgba(255,220,150,A)', .6);
}
function newspaper(p, gt, k, reveal) {
  p.save(); p.translate(960, 560); p.rotate(-.04);
  rr(p, -560, -420, 1120, 840, 6); fs(p, '#E8DFC4', 0); p.fillStyle = 'rgba(120,90,40,.15)'; p.fillRect(-560, -420, 1120, 840);
  text(p, 'LE COURRIER DU MATIN', 0, -350, '900 54px Montserrat', '#2A2420');
  line(p, [[-520, -310], [520, -310]], 4, '#2A2420', null);
  p.save(); p.globalAlpha = clamp(k); text(p, 'UN PÈRE SAUVE SON BÉBÉ', 0, -240, '900 62px Oswald', '#2A2420'); text(p, 'DU FEU, À MAINS NUES', 0, -170, '900 62px Oswald', '#2A2420'); p.restore();
  rr(p, -480, -110, 600, 420, 4); fs(p, '#3A3430', 0);
  // maison en flammes (photo sépia)
  rr(p, -380, 60, 400, 220, 2); fs(p, '#5A5048', 0); p.beginPath(); p.moveTo(-410, 70); p.lineTo(-180, -60); p.lineTo(50, 70); p.closePath(); fs(p, '#4A403A', 0);
  rr(p, -330, 130, 80, 80, 2); fs(p, '#E8C080', 0); rr(p, -140, 130, 80, 80, 2); fs(p, '#E8C080', 0);
  for (let i = 0; i < 7; i++) { const fx = -380 + i * 60, fh = 90 + Math.sin(gt * 6 + i) * 25; p.beginPath(); p.moveTo(fx, 70); p.quadraticCurveTo(fx + 30, 70 - fh, fx + 60, 70); fs(p, 'rgba(240,190,110,.85)', 0); }
  if (reveal) { p.beginPath(); p.arc(-180, 170, 190, 0, Math.PI * 2); p.lineWidth = 10; p.strokeStyle = 'rgba(229,57,53,' + clamp(reveal) + ')'; p.stroke(); }
  for (let i = 0; i < 9; i++) { p.fillStyle = 'rgba(42,36,32,.55)'; p.fillRect(170, -100 + i * 44, 330 - (i % 3) * 40, 10); }
  p.restore();
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
SC.flash = (c, lt, gt) => {
  film(c, gt, p => {
    p.fillStyle = grad(p, 0, 1080, ['#1A1418', '#0A080C']); p.fillRect(0, 0, SW, SH);
    glow(p, 960, 540, 600, 'rgba(255,220,150,A)', .25);
    p.save(); cam2(p, 960, 540, push(lt, 1.1, 1.3, 3));
    const off = eo(clamp((gt - CUE.glove) / 1.6)) * .45;
    bigHand(p, 1100, 600, 1.6, Math.PI + .15, '#121218', {});
    p.save(); p.translate(1100, 600); p.rotate(Math.PI + .15); p.translate(off * 140, 0); p.rotate(-(Math.PI + .15)); p.translate(-1100, -600);
    bigHand(p, 1100, 600, 1.64, Math.PI + .15, GLOVE, { noSleeve: true }); p.restore();
    p.restore();
  });
};
SC.ecole = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'gate'], [at(1, .45), 'glove'], [at(1, .75), 'wide'], [L(2), 'kids'], [at(2, .55), 'me']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'gate' || shot === 'wide') {
      p.save(); cam2(p, 900 + dx, 560 + dy, push(st, 1.15, 1.22, 3)); schoolDay(p, gt);
      rig(p, { x: shot === 'gate' ? lerp(1500, 1000, eo(clamp(st / 2))) : 1000, y: 835, s: .66, f: -1, t: gt, pose: shot === 'gate' && st < 2 ? 'walk' : 'stand', walk: gt * 6, col: DAD, col2: DAD2, hair: dadHair, e: 'happy', mouth: 'smile', holdF: gloveOn, seed: 4, light: -1 });
      rig(p, { x: 700, y: 835, s: .55, f: 1, t: gt, e: 'n', light: 1 });
      p.restore();
    } else if (shot === 'glove') {
      p.save(); cam2(p, 960, 540, push(st, 1, 1.1, 2)); schoolDay(p, gt); p.restore();
      blurred(p, 6, q => { q.fillStyle = 'rgba(0,0,0,.25)'; q.fillRect(0, 0, SW, SH); });
      bigHand(p, 1050, 620, 1.3, Math.PI + .2, GLOVE, {});
      p.save(); text(p, '28 °C', 320, 880, '900 90px Montserrat', '#FFB347'); p.restore();
    } else if (shot === 'kids') {
      p.save(); cam2(p, 960 + dx, 560 + dy, 1.4); schoolDay(p, gt);
      [[700, MATE1, null], [900, MATE2, capHair], [1120, '#5B8BE0', null]].forEach(([x, col, hair], i) => rig(p, { x, y: 835, s: .56, f: i === 2 ? -1 : 1, t: gt, col, col2: col, hair, e: gt > CUE.laugh ? 'happy' : 'side', mouth: gt > CUE.laugh ? 'smile' : undefined, talk: gt > CUE.laugh && i === 1, armF: i === 1 && gt > CUE.laugh ? [1.4, .1] : undefined, seed: 6 + i, light: 1 }));
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); schoolDay(p, gt); p.restore();
      blurred(p, 8, q => { q.fillStyle = 'rgba(0,0,0,.2)'; q.fillRect(0, 0, SW, SH); });
      bust(p, 960, 620, 230, { t: gt, e: 'sad', lookY: .6, light: 1 });
    }
  });
};
SC.voiture = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'me'], [at(3, .55), 'dad'], [L(4), 'road'], [at(4, .5), 'dad2']]);
  film(c, gt, p => {
    p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); carInside(p, gt); p.restore();
    if (shot === 'me') bust(p, 760, 640, 220, { t: gt, e: 'angry', talk: talking(gt, at(3, .35), E(3)), look: 1, light: 1, rim: 'rgba(255,240,200,.8)' });
    else if (shot === 'dad' || shot === 'dad2') bust(p, 1100, 640, 230, { t: gt, col: DAD, col2: DAD2, hair: dadHair, e: 'sad', look: shot === 'dad' ? -1 : 0, lookY: shot === 'dad2' ? -.2 : 0, light: -1, seed: 4, rim: 'rgba(255,240,200,.8)' });
    else { p.fillStyle = 'rgba(0,0,0,.25)'; p.fillRect(0, 0, SW, SH); bigHand(p, 1300, 560, 1.0, Math.PI + .9, GLOVE, {}); }
  });
};
SC.grenier = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wide'], [at(5, .55), 'search'], [at(5, .8), 'find']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'wide' || shot === 'search') {
      p.save(); cam2(p, 960 + dx, 600 + dy, shot === 'wide' ? push(st, 1.1, 1.18, 3) : 1.5); attic(p, gt);
      rig(p, { x: 1050, y: 840, s: .58, f: 1, t: gt, pose: shot === 'search' ? 'kneel' : 'walk', walk: gt * 5, e: 'n', armF: shot === 'search' ? [1.5, .3] : undefined, light: -1, rim: 'rgba(255,220,150,.9)' });
      p.restore();
    } else {
      p.save(); cam2(p, 960, 540, push(st, 1.2, 1.35, 2)); p.fillStyle = '#1A1418'; p.fillRect(-200, -200, 2400, 1500); glow(p, 960, 500, 600, 'rgba(255,220,150,A)', .3);
      newspaper(p, gt, 0, 0); p.restore();
    }
  });
};
SC.journal = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'paper'], [at(6, .55), 'face'], [L(7), 'photo'], [at(7, .55), 'face2']]);
  film(c, gt, p => {
    if (shot === 'paper' || shot === 'photo') {
      p.save(); cam2(p, shot === 'photo' ? 800 : 960, shot === 'photo' ? 720 : 400, shot === 'photo' ? push(st, 1.4, 1.6, 3) : push(st, 1.2, 1.3, 3));
      p.fillStyle = '#1A1418'; p.fillRect(-200, -200, 2400, 1500); glow(p, 960, 500, 600, 'rgba(255,220,150,A)', .3);
      newspaper(p, gt, clamp((gt - CUE.headline + .3) * 2), shot === 'photo' ? clamp((gt - CUE.baby) * 2) : 0); p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); attic(p, gt); p.restore();
      blurred(p, 8, q => { q.fillStyle = 'rgba(0,0,0,.3)'; q.fillRect(0, 0, SW, SH); });
      bust(p, 960, 640, 230, { t: gt, e: shot === 'face2' ? 'wide' : 'worried', mouth: shot === 'face2' ? 'o' : undefined, lookY: .4, light: -1, rim: 'rgba(255,220,150,.9)' });
    }
  });
};
SC.cuisine = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wide'], [at(8, .45), 'hand'], [at(8, .82), 'dad']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'wide') {
      p.save(); cam2(p, 700 + dx, 560 + dy, push(st, 1.15, 1.22, 3)); kitchenNight(p, gt, { day: false });
      rig(p, { x: 420, y: 835, s: .64, f: -1, t: gt, col: DAD, col2: DAD2, hair: dadHair, e: 'n', lookY: .5, armF: [1.2, .5], armB: [1.0, .6], seed: 4, light: 1 });
      rig(p, { x: 1100, y: 835, s: .58, f: -1, t: gt, e: 'worried', light: -1 });
      p.restore();
    } else if (shot === 'hand') {
      p.save(); cam2(p, 960, 540, push(st, 1, 1.1, 3)); kitchenNight(p, gt, { day: false }); p.restore();
      p.fillStyle = 'rgba(0,0,0,.35)'; p.fillRect(0, 0, SW, SH);
      bigHand(p, 1150, 620, 1.4, Math.PI + .15, '#121218', { scars: clamp((gt - CUE.scar + .5) * 2) });
      for (let i = 0; i < 6; i++) { circ(p, 820 + rnd(i) * 300, 700 + ((gt * 80 + i * 40) % 160), 8); fs(p, 'rgba(200,220,255,.6)', 0); }
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.06, 2)); kitchenNight(p, gt, { day: false });
      bust(p, 960, 640, 230, { t: gt, col: DAD, col2: DAD2, hair: dadHair, e: 'sad', mouth: 'smile', talk: talking(gt, at(9, .4), E(9)), look: -1, seed: 4, light: 1 });
      p.restore();
    }
  });
};
SC.fin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'gate'], [at(10, .55), 'hands'], [L(11), 'wide']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'gate' || shot === 'wide') {
      p.save(); cam2(p, 900 + dx, 560 + dy, shot === 'wide' ? push(st, 1.2, 1.1, 3) : push(st, 1.15, 1.22, 3)); schoolDay(p, gt);
      [[350, MATE1], [500, MATE2]].forEach(([x, col], i) => rig(p, { x, y: 835, s: .5, f: 1, t: gt, col, col2: col, e: 'wide', mouth: 'o', seed: 6 + i, light: 1 }));
      rig(p, { x: 1060, y: 835, s: .66, f: -1, t: gt, col: DAD, col2: DAD2, hair: dadHair, e: 'happy', mouth: 'smile', armB: gt > CUE.hand - .5 ? [.7, 0] : undefined, seed: 4, light: -1 });
      rig(p, { x: 870, y: 835, s: .55, f: 1, t: gt, e: 'happy', mouth: 'smile', armF: gt > CUE.hand - .5 ? [.85, 0] : undefined, light: 1 });
      p.restore();
    } else {
      p.save(); cam2(p, 960, 540, push(st, 1, 1.1, 2)); schoolDay(p, gt); p.restore();
      blurred(p, 8, q => { q.fillStyle = 'rgba(0,0,0,.2)'; q.fillRect(0, 0, SW, SH); });
      bigHand(p, 1260, 600, 1.2, Math.PI, '#121218', { scars: 1, sleeve: DAD });
      hand(p, kf(st, [[0, 380], [1, 640]]), 610, 1.1, 0, {});
    }
  });
  finCard(c, gt, CUE.endcard, 'Et toi… tu l\'aurais deviné ?');
};
