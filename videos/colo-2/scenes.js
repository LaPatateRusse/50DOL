// La colo — Partie 2 : mini-série d'horreur, style cinéma (cinema.js + cinema-rig.js). Histoire originale.
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const SAMI = '#3FA36B', SAMI2 = '#318A58', DIR = '#3A6EA5', DIR2 = '#2E5A8A';

const kidHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .05, r * 1.04, Math.PI * 1.05, Math.PI * 1.95); c.quadraticCurveTo(r * .5, -r * .7, 0, -r * .62); c.quadraticCurveTo(-r * .6, -r * .72, -r * 1.0, -r * .3); c.closePath(); fs(c, '#4A2E1E', 0); c.restore(); };
const curlHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); c.fillStyle = '#1A1210';
  for (let i = 0; i < 7; i++) { const a = Math.PI * (1.05 + i * .15); circ(c, Math.cos(a) * r * .9, Math.sin(a) * r * .9, r * .28); c.fill(); } c.restore(); };
const capHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .1, r * 1.03, Math.PI * 1.02, Math.PI * 1.98); c.closePath(); fs(c, '#D8A23A', 0);
  rr(c, r * .2, -r * .45, r * 1.05, r * .2, r * .1); fs(c, '#B8862A', 0); c.restore(); };

// ---------- décors ----------
function dorm(p, gt, night) {
  p.fillStyle = grad(p, 0, 780, night ? ['#0C0E18', '#12141F'] : ['#C9A27A', '#B48C64']); p.fillRect(-400, -200, 2800, 1100);
  for (let i = 0; i < 20; i++) line(p, [[-400, 40 + i * 40], [2400, 40 + i * 40]], 3, night ? 'rgba(0,0,0,.35)' : 'rgba(90,60,30,.25)', null);
  rr(p, 1640, 160, 260, 220, 6); fs(p, night ? '#1A2440' : '#CDE8F5', 10, night ? '#2A2030' : '#6B4A30'); if (night) glow(p, 1770, 270, 200, 'rgba(160,190,255,A)', .25);
  p.fillStyle = night ? '#0A0B12' : '#7A5A3E'; p.fillRect(-400, 780, 2800, 500);
}
function bunk(p, x, night, heads = [], gt = 0) {
  const wood = night ? '#2A2028' : '#7A5638';
  [x - 230, x + 230].forEach(px => { rr(p, px - 14, 180, 28, 610, 6); fs(p, wood, 0); });
  [470, 730].forEach((y, k) => {
    rr(p, x - 230, y, 460, 40, 8); fs(p, wood, 0); rr(p, x - 216, y - 40, 432, 44, 14); fs(p, night ? '#2A3050' : '#5B8BE0', 0);
    rr(p, x - 210, y - 64, 120, 40, 16); fs(p, night ? '#3A3E52' : '#F4EEE4', 0);
    const h = heads[k]; if (h) head(p, x - 150, y - 70, 34, gt, h);
  });
}
function head(p, x, y, r, gt, o = {}) {
  circ(p, x, y, r); fs(p, SKIN, 0); (o.hair || kidHair)(p, r, [x, y]);
  eyes(p, x + r * .2, y, r, { t: gt, e: o.e || 'closed', blink: false, look: o.look, seed: o.seed || 0 });
}
function lake(p, gt) {
  p.fillStyle = grad(p, 0, 600, ['#8EC8EA', '#D2ECF6']); p.fillRect(-400, -200, 2800, 900);
  for (let i = 0; i < 12; i++) { const x = -300 + i * 210; p.beginPath(); p.moveTo(x, 300 - (i % 3) * 40); p.lineTo(x - 90, 560); p.lineTo(x + 90, 560); p.closePath(); fs(p, i % 2 ? '#3E7A4A' : '#4E8A5A', 0); }
  p.fillStyle = '#4E9AC8'; p.fillRect(-400, 560, 2800, 140);
  for (let i = 0; i < 6; i++) line(p, [[-200 + i * 380 + Math.sin(gt + i) * 20, 600 + (i % 3) * 30], [-80 + i * 380 + Math.sin(gt + i) * 20, 600 + (i % 3) * 30]], 5, 'rgba(255,255,255,.55)', null);
  p.fillStyle = '#7FB25E'; p.fillRect(-400, 700, 2800, 600);
  rr(p, 1150, 360, 620, 420, 6); fs(p, '#8A5A3A', 0); p.beginPath(); p.moveTo(1110, 380); p.lineTo(1460, 200); p.lineTo(1810, 380); p.closePath(); fs(p, '#5A3A2A', 0);
  rr(p, 1400, 560, 130, 220, 6); fs(p, '#5A3A24', 0); rr(p, 1220, 470, 120, 100, 6); fs(p, '#CDE8F5', 6, '#5A3A24');
  text(p, 'CHALET 7', 1460, 430, '800 34px Montserrat', '#F4EEE4');
}
function doorNote(p, gt) {
  p.fillStyle = '#6B4A30'; p.fillRect(-400, -200, 2800, 1400);
  for (let i = 0; i < 12; i++) line(p, [[-300 + i * 200, -200], [-300 + i * 200, 1300]], 6, 'rgba(0,0,0,.25)', null);
  p.save(); p.translate(960, 540); p.rotate(-.03);
  rr(p, -460, -260, 920, 520, 6); fs(p, '#F6F0DC', 0); rr(p, -60, -280, 120, 40, 4); fs(p, 'rgba(220,220,200,.8)', 0);
  text(p, 'À MINUIT,', 0, -130, 'italic 800 64px Montserrat', '#2A2A38');
  text(p, 'SI QUELQU\'UN FAIT L\'APPEL…', 0, -20, 'italic 800 46px Montserrat', '#2A2A38');
  text(p, 'NE RÉPONDS PAS.', 0, 110, 'italic 900 72px Montserrat', '#C0303A');
  p.restore();
}
function torchCone(p, gt, x, y, tx, ty, a = .35) {
  const ang = Math.atan2(ty - y, tx - x), len = Math.hypot(tx - x, ty - y);
  p.save(); p.translate(x, y); p.rotate(ang - Math.PI / 2);
  const g = p.createLinearGradient(0, 0, 0, len); g.addColorStop(0, `rgba(255,240,200,${a})`); g.addColorStop(1, 'rgba(255,240,200,0)');
  p.beginPath(); p.moveTo(-14, 0); p.lineTo(14, 0); p.lineTo(170, len); p.lineTo(-170, len); p.closePath(); p.fillStyle = g; p.fill(); p.restore();
  glow(p, tx, ty, 200, 'rgba(255,240,200,A)', a * .8);
}
function bed13(p, x, y, s, gt, o = {}) {
  p.save(); p.translate(x, y); p.scale(s, s);
  rr(p, -300, -40, 600, 60, 10); fs(p, '#2A2028', 0); rr(p, -300, -120, 30, 160, 6); fs(p, '#2A2028', 0);
  rr(p, -270, -110, 140, 50, 18); fs(p, '#3A3E52', 0);
  const br = 1 + Math.sin(gt * 1.6) * .05;
  p.beginPath(); p.moveTo(-280, -50); p.quadraticCurveTo(-200, -60 - 90 * br, -40, -60 - 70 * br); p.quadraticCurveTo(140, -60 - 80 * br, 280, -50); p.closePath(); fs(p, '#4A3A5A', 0);
  if (o.hand) { circ(p, -150, -78, 22); fs(p, '#ECEAE4', 0); for (let i = 0; i < 4; i++) line(p, [[-150 + i * 9 - 12, -70], [-160 + i * 10 - 12, -36]], 7, '#ECEAE4', null); }
  p.restore();
}


function office(p, gt) {
  p.fillStyle = grad(p, 0, 780, ['#C9A27A', '#B48C64']); p.fillRect(-400, -200, 2800, 1100);
  for (let i = 0; i < 20; i++) line(p, [[-400, 40 + i * 40], [2400, 40 + i * 40]], 3, 'rgba(90,60,30,.25)', null);
  p.fillStyle = '#7A5A3E'; p.fillRect(-400, 780, 2800, 500);
  rr(p, 500, 560, 900, 30, 8); fs(p, '#5A3E28', 0); rr(p, 540, 590, 30, 200, 4); fs(p, '#4A3220', 0); rr(p, 1330, 590, 30, 200, 4); fs(p, '#4A3220', 0);
  rr(p, 1200, 160, 420, 300, 6); fs(p, '#3A2A1A', 0); rr(p, 1220, 180, 380, 260, 4); fs(p, '#D8CCAA', 0);
}
function groupPhoto(p, x, y, s, gt, blurK = 0) { // photo de groupe 1994
  p.save(); p.translate(x, y); p.scale(s, s);
  rr(p, -380, -250, 760, 500, 8); fs(p, '#F2EAD6', 0); rr(p, -350, -220, 700, 400, 4); fs(p, '#B8A27A', 0);
  rr(p, -340, -210, 680, 220, 2); fs(p, '#A8C4B0', 0); rr(p, -120, -170, 240, 170, 4); fs(p, '#8A5A3A', 0); text(p, 'CHALET 7', 0, -140, '800 24px Montserrat', '#F4EEE4');
  for (let i = 0; i < 13; i++) { const cx = -300 + i * 50, cy = 60 + (i % 2) * 40; const last = i === 12;
    rr(p, cx - 18, cy, 36, 70, 12); fs(p, last ? '#F2A31B' : ['#8A9AAA', '#AA8A7A', '#7A9A8A'][i % 3], 0);
    if (last && blurK > 0) { p.save(); p.filter = `blur(${4 + blurK * 4}px)`; circ(p, cx, cy - 16, 22); fs(p, '#3A3A40', 0); p.restore(); }
    else { circ(p, cx, cy - 16, 20); fs(p, '#2A2420', 0); } }
  text(p, 'Été 1994', 0, 225, 'italic 700 30px Montserrat', '#5A4A38');
  p.restore();
}
function rollList(p, x, y, s, gt, k) {
  p.save(); p.translate(x, y); p.rotate(-.03); p.scale(s, s);
  rr(p, -300, -360, 600, 720, 8); fs(p, '#FBF6EA', 0); text(p, 'CHALET 7 — APPEL', 0, -310, '800 34px Montserrat', '#2A2A38');
  const names = ['Sami', 'Inès', 'Lucas', 'Maya', 'Noah', 'Léa', 'Adam', 'Jade', 'Tom', 'Lina', 'Yanis', 'Toi'];
  names.forEach((n, i) => text(p, (i + 1) + '. ' + n, -240, -250 + i * 44, '600 28px Montserrat', '#3A3A48', 'left'));
  if (k > 0) { p.globalAlpha = k; text(p, '13. TOI', -240, -250 + 12 * 44 + 6, 'italic 900 36px Montserrat', '#C0303A', 'left'); p.globalAlpha = 1; }
  p.restore();
}
function hud(c, gt) {
  const night = gt < L(4) || gt >= L(7);
  cinemaHud(c, gt, { part: 'La colo — Partie 2', off: gt > CUE.endcard, day: gt < L(1) ? undefined : gt < L(4) ? 1 : 2, dayAt: gt < L(4) ? L(1) : L(4),
    val: gt >= CUE.red && gt < L(7) ? 'INSCRITS : 13' : night ? 'APPEL : 13' : 'LITS : 12', neg: gt >= CUE.red || night, bump: gt >= CUE.red && gt < L(7) ? CUE.red : undefined });
}
const me = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, hair: kidHair, seed: 2, light: 1, rim: 'rgba(160,190,255,.9)', ...o });
const sami = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, col: SAMI, col2: SAMI2, hair: curlHair, seed: 4, light: -1, rim: 'rgba(255,226,170,.9)', ...o });

SC.flash = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 1250, 640, push(lt, 1.6, 1.85, 3)); dorm(p, gt, true);
    bed13(p, 1250, 760, 1, gt, {}); glow(p, 1250, 640, 380, 'rgba(160,190,255,A)', .15); p.restore();
  });
};
SC.nuit = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'me'], [at(1, .55), 'beds'], [L(2), 'lump'], [at(2, .55), 'me2'], [CUE.hold - .2, 'hold'], [CUE.voice13 - .3, 'close']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, .5);
    if (shot === 'me' || shot === 'me2' || shot === 'hold') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2.5)); dorm(p, gt, true); p.restore();
      p.fillStyle = 'rgba(0,0,10,.35)'; p.fillRect(0, 0, SW, SH);
      me(p, 960, 640, 230, gt, { e: shot === 'hold' ? 'wide' : 'closed', blink: false, mouth: shot === 'hold' ? 'flat' : undefined, sweat: shot !== 'me' });
    } else if (shot === 'beds' || shot === 'lump') {
      p.save(); cam2(p, (shot === 'lump' ? 1250 : 1000) + dx, 620 + dy, shot === 'lump' ? push(st, 1.4, 1.6, 3) : push(st, 1.1, 1.2, 3)); dorm(p, gt, true);
      rr(p, 200, 700, 560, 60, 10); fs(p, '#2A2028', 0); rr(p, 220, 640, 520, 70, 16); fs(p, '#2A3050', 0);
      head(p, 330, 620, 46, gt, { e: 'closed' });
      bed13(p, 1250, 760, 1, gt, {}); glow(p, 1250, 640, 380, 'rgba(160,190,255,A)', .15);
      p.restore();
    } else {
      p.fillStyle = '#05060A'; p.fillRect(0, 0, SW, SH);
      p.save(); cam2(p, 960, 560, push(st, 1, 1.15, 3)); me(p, 760, 640, 230, gt, { e: 'wide', look: 1, sweat: true });
      p.save(); p.globalAlpha = .9; p.beginPath(); p.ellipse(1500, 560, 200, 260, 0, 0, Math.PI * 2); fs(p, '#0A0A0E', 0); p.restore();
      glow(p, 1500, 560, 300, 'rgba(160,190,255,A)', .1); p.restore();
    }
  });
};
SC.matin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'empty'], [at(4, .4), 'sami'], [at(4, .75), 'me']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'empty') {
      p.save(); cam2(p, 1150 + dx, 620 + dy, push(st, 1.1, 1.2, 3)); dorm(p, gt, false);
      rr(p, 200, 700, 560, 60, 10); fs(p, '#7A5638', 0); rr(p, 220, 640, 520, 70, 16); fs(p, '#5B8BE0', 0);
      head(p, 330, 620, 46, gt, { e: 'wide', look: 1 });
      if (gt < CUE.gone) bed13(p, 1250, 760, 1, gt, {}); else { p.fillStyle = 'rgba(0,0,0,.12)'; p.fillRect(950, 770, 600, 18); }
      p.restore();
    } else if (shot === 'sami') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); dorm(p, gt, false); p.restore();
      sami(p, 960, 640, 230, gt, { e: 'happy', mouth: 'smile', talk: true, look: -1 });
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); dorm(p, gt, false); p.restore();
      me(p, 960, 640, 230, gt, { e: 'worried', rim: 'rgba(255,226,170,.9)' });
    }
  });
};
SC.bureau = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'room'], [at(5, .35), 'list'], [CUE.photo - .2, 'wall'], [at(6, .35), 'photo'], [CUE.blur - .2, 'zoom']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'room' || shot === 'wall') {
      p.save(); cam2(p, (shot === 'wall' ? 1400 : 960) + dx, (shot === 'wall' ? 330 : 560) + dy, shot === 'wall' ? push(st, 1.6, 1.8, 2) : push(st, 1.05, 1.15, 3)); office(p, gt);
      groupPhoto(p, 1410, 310, .5, gt, 0);
      if (shot === 'room') rig(p, { x: 760, y: 835, s: .5, f: 1, t: gt, hair: kidHair, e: 'n', look: 1, lookY: .2, seed: 2, light: 1 });
      p.restore();
    } else if (shot === 'list') {
      p.save(); cam2(p, 960, 560, 1.1); office(p, gt); p.restore(); p.fillStyle = 'rgba(0,0,0,.35)'; p.fillRect(0, 0, SW, SH);
      p.save(); cam2(p, 960, 540, push(st, 1, 1.12, 3)); rollList(p, 960, 560, 1.2, gt, clamp((gt - CUE.red + .4) / .6)); p.restore();
    } else {
      p.fillStyle = '#14100E'; p.fillRect(0, 0, SW, SH);
      const z = shot === 'zoom';
      p.save(); cam2(p, z ? lerp(960, 960 + 300 * 1.6, clamp(st / 1.5)) : 960, z ? lerp(540, 540 + 80 * 1.6, clamp(st / 1.5)) : 540, z ? lerp(1, 2.6, eio(clamp(st / 1.5))) : push(st, 1, 1.08, 2));
      groupPhoto(p, 960, 540, 1.6, gt, z ? clamp(st) : 0); p.restore();
    }
  });
};
SC.fin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'torch'], [at(7, .5), 'me'], [L(8), 'door']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, .6);
    if (shot === 'torch' || shot === 'door') {
      p.save(); cam2(p, 960 + dx, 540 + dy, push(st, 1.1, 1.25, 3)); dorm(p, gt, true);
      bunk(p, 600, true, [{}, {}], gt); bunk(p, 1300, true, [{}, { e: 'wide' }], gt);
      torchCone(p, gt, -100, 120, shot === 'door' ? 1150 : 400 + st * 200, 660, .45);
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 2)); dorm(p, gt, true); p.restore();
      p.fillStyle = 'rgba(0,0,10,.3)'; p.fillRect(0, 0, SW, SH);
      me(p, 960, 640, 230, gt, { e: 'wide', mouth: 'o', look: -1, sweat: true });
    }
  });
  cinemaEnd(c, gt, CUE.endcard, 'LA FIN', 'Tu réponds « présent » ? OUI / NON');
};
