// La station-service — horreur complète en 1 partie, style cinéma (cinema.js + cinema-rig.js). Histoire originale.
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const DAD = '#4A5A6E', DAD2 = '#3A4858', UNI = '#B0303A', PALE = '#E8E2D8';
const flick = gt => (Math.floor(gt * 9) % 13 === 0 || Math.floor(gt * 7) % 17 === 0) ? .35 : 1;

const dadHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, 0, r * 1.06, Math.PI * 1.0, Math.PI * 2.0); c.quadraticCurveTo(r * .3, -r * .62, -r * .2, -r * .58); c.quadraticCurveTo(-r * .8, -r * .45, -r * 1.06, 0); c.closePath(); c.fillStyle = '#2A1E16'; c.fill(); c.restore(); };

// la caissière : uniforme rouge, visage pâle, yeux noirs, sourire trop large ; neck = longueur du cou en plus
function cashier(c, x, y, s, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  rr(c, -80, -330, 160, 330, 40); fs(c, UNI, 0); rr(c, -20, -300, 40, 26, 6); fs(c, '#F2F2F2', 0);
  const n = o.neck || 0, hy = -400 - n;
  line(c, [[0, -330], [Math.sin((o.t || 0) * .8) * n * .08, -330 - n * .5], [0, hy + 60]], 34, PALE, null);
  c.beginPath(); c.ellipse(0, hy, 86, 104, Math.sin((o.t || 0) * .7) * .05 * (n > 0), 0, Math.PI * 2); fs(c, PALE, 0);
  rr(c, -92, hy - 116, 184, 70, [40, 40, 10, 10]); fs(c, '#2A1A14', 0); // cheveux
  [-30, 30].forEach(ex => { c.beginPath(); c.ellipse(ex, hy - 10, 15, 21, 0, 0, Math.PI * 2); fs(c, '#0A0A0E', 0); circ(c, ex + 4, hy - 16, 3); fs(c, 'rgba(255,255,255,.5)', 0); });
  const sm = o.smile ?? 0;
  if (sm > 0) { c.beginPath(); c.arc(0, hy + 18, 30 + sm * 28, .15, Math.PI - .15); c.lineWidth = 7; c.strokeStyle = '#0A0A0E'; c.stroke();
    if (sm > .6) for (let i = -4; i <= 4; i++) line(c, [[i * 10, hy + 46 + Math.abs(i) * -2], [i * 10, hy + 58 - Math.abs(i) * 3]], 3, '#0A0A0E', null); }
  else { line(c, [[-20, hy + 46], [20, hy + 46]], 6, '#0A0A0E', null); }
  c.restore();
}
function car(c, x, y, s, f = 1) {
  c.save(); c.translate(x, y); c.scale(s * f, s);
  rr(c, -300, -150, 600, 110, 40); fs(c, '#3A4A6A', 0); rr(c, -170, -250, 320, 120, [60, 60, 0, 0]); fs(c, '#33415E', 0);
  rr(c, -150, -235, 130, 90, 14); fs(c, '#18202E', 0); rr(c, 0, -235, 130, 90, 14); fs(c, '#18202E', 0);
  [-180, 180].forEach(wx => { circ(c, wx, -40, 52); fs(c, '#0E0E14', 0); circ(c, wx, -40, 22); fs(c, '#5A6478', 0); });
  rr(c, 270, -130, 34, 26, 6); fs(c, '#FFE9A8', 0); c.restore();
}
function stationOut(p, gt) {
  p.fillStyle = grad(p, 0, 900, ['#05060C', '#0E1220']); p.fillRect(-400, -200, 2800, 1400);
  for (let i = 0; i < 60; i++) { circ(p, (i * 397) % 2400 - 300, (i * 211) % 420, 1.6); fs(p, 'rgba(255,255,255,.5)', 0); }
  p.fillStyle = '#16181F'; p.fillRect(-400, 800, 2800, 400);
  rr(p, 1100, 380, 700, 420, 6); fs(p, '#2A2E38', 0); rr(p, 1150, 460, 600, 300, 4); fs(p, `rgba(190,255,220,${.55 * flick(gt)})`, 0);
  glow(p, 1450, 600, 420, 'rgba(170,255,210,A)', .25 * flick(gt));
  rr(p, 100, 260, 900, 60, 8); fs(p, '#C9CED8', 0); text(p, 'STATION 24/24', 550, 292, '900 40px Montserrat', '#B0303A');
  [250, 850].forEach(x => { p.fillStyle = '#9AA0AE'; p.fillRect(x - 14, 320, 28, 480); });
  cone(p, 550, 320, 500, 480, 700, 'rgba(255,240,200,A)', .22);
  rr(p, 500, 600, 100, 200, 10); fs(p, '#B0303A', 0); rr(p, 515, 620, 70, 50, 6); fs(p, '#0E1220', 0);
}
function shop(p, gt) {
  const fk = flick(gt);
  p.fillStyle = grad(p, 0, 780, ['#C8D8CC', '#A8B8AC']); p.fillRect(-400, -200, 2800, 1000);
  p.fillStyle = `rgba(0,0,0,${.45 - .3 * fk})`; p.fillRect(-400, -200, 2800, 1400);
  for (let r = 0; r < 3; r++) { rr(p, -100, 300 + r * 150, 900, 18, 4); fs(p, '#7A8A80', 0); for (let i = 0; i < 14; i++) { rr(p, -80 + i * 62, 240 + r * 150, 46, 60, 6); fs(p, ['#E05B4B', '#5B8BE0', '#F2C230', '#5BBF7A'][(i + r) % 4], 0); } }
  rr(p, 1000, 220, 500, 560, 8); fs(p, '#DDEFF5', 8, '#7A8A90'); glow(p, 1250, 480, 300, 'rgba(220,250,255,A)', .3 * fk);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { rr(p, 1040 + i * 115, 260 + j * 170, 70, 130, 12); fs(p, '#9AD4F0', 0); }
  p.fillStyle = '#6A6E66'; p.fillRect(-400, 780, 2800, 500);
  rr(p, 560, 40, 600, 24, 10); fs(p, `rgba(230,255,240,${fk})`, 0); if (fk > .5) glow(p, 860, 60, 500, 'rgba(220,255,235,A)', .35);
}
function counter(p) { rr(p, 1300, 560, 700, 240, 10); fs(p, '#5A4A3A', 0); rr(p, 1290, 540, 720, 30, 8); fs(p, '#3A2E24', 0); rr(p, 1450, 470, 160, 80, 8); fs(p, '#2A2A30', 0); }
function finCard(c, gt, at, q) {
  const k = pr(gt, at, at + .2); if (k <= 0) return;
  stage(c, p => {
    p.fillStyle = `rgba(5,6,10,${k})`; p.fillRect(0, 0, SW, SH);
    const b = pop(gt, at + .15, .45), qq = clamp((gt - at - .8) * 3);
    if (b) { p.save(); p.translate(SW / 2, 400); p.scale(b, b); text(p, 'FIN', 0, 0, '900 190px Montserrat', '#FF4B4B'); p.restore(); }
    if (qq > 0) { p.globalAlpha = qq; text(p, q, SW / 2, 680, '800 58px Montserrat', '#FFFFFF'); text(p, 'OUI  /  NON', SW / 2, 790, '900 70px Montserrat', '#FF4B4B'); }
  }, { vig: .3 });
}

// ---------- HUD ----------
function hud(c, gt) {
  const p = gt > CUE.price;
  cinemaHud(c, gt, { part: 'La station-service', off: gt > CUE.endcard, val: p ? 'PRIX : TON PRÉNOM' : gt > L(2) ? 'EAU : 1,50 €' : '02:00', neg: p, bump: p ? CUE.price : undefined });
}

// ---------- scènes ----------
SC.flash = (c, lt, gt) => {
  film(c, gt, p => {
    p.fillStyle = '#0A0E0C'; p.fillRect(0, 0, SW, SH); glow(p, 960, 400, 700, 'rgba(170,255,210,A)', .22 * flick(gt));
    p.save(); cam2(p, 960, 640, push(lt, 1.3, 1.6, 4)); cashier(p, 960, 1100, 1.1, { t: gt, smile: .4 + clamp(lt / 2) * .6 }); p.restore();
  });
};
SC.route = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wide'], [L(2), 'dad'], [CUE.enter - .3, 'door']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'wide') {
      p.save(); cam2(p, 900 + dx, 560 + dy, push(st, 1.1, 1.2, 5)); stationOut(p, gt);
      car(p, lerp(-300, 560, eo(clamp(st / 3))), 820, .8, 1); p.restore();
    } else if (shot === 'dad') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); stationOut(p, gt); p.restore();
      p.fillStyle = 'rgba(6,8,14,.55)'; p.fillRect(0, 0, SW, SH);
      bust(p, 1250, 660, 220, { t: gt, col: DAD, col2: DAD2, hair: dadHair, e: 'n', look: -1, talk: talking(gt, L(2), L(2) + 2.4), seed: 4, light: -1 });
      blurred(p, 8, q => bust(q, 420, 760, 250, { t: gt, look: 1, light: 1 }));
    } else {
      p.save(); cam2(p, 1450 + dx, 600 + dy, 1.5); stationOut(p, gt);
      rig(p, { x: lerp(1150, 1420, eo(clamp(st / 1.4))), y: 835, s: .5, f: 1, t: gt, pose: 'walk', walk: gt * 7, light: -1 });
      p.restore();
    }
  });
};
SC.boutique = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'in'], [CUE.note - .4, 'note']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'in') {
      p.save(); cam2(p, 900 + dx, 560 + dy, push(st, 1.1, 1.22, 4)); shop(p, gt); counter(p);
      rig(p, { x: lerp(300, 700, eo(clamp(st / 2.5))), y: 835, s: .55, f: 1, t: gt, pose: st < 2.5 ? 'walk' : 'stand', walk: gt * 7, e: 'side', look: 1, light: 1 });
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.12, 5)); shop(p, gt); p.restore();
      p.fillStyle = 'rgba(0,0,0,.45)'; p.fillRect(0, 0, SW, SH);
      p.save(); p.translate(960, 560); p.rotate(gt < L(4) ? Math.PI + .04 : Math.PI * (1 - eo(clamp((gt - L(4)) / .6))) + .04); rr(p, -380, -260, 760, 520, 6); fs(p, '#F4F0E0', 0);
      rr(p, -420, -290, 140, 50, 4); fs(p, 'rgba(230,220,160,.8)', 0); rr(p, 280, -290, 140, 50, 4); fs(p, 'rgba(230,220,160,.8)', 0);
      const k = clamp((gt - L(4)) / .8);
      p.globalAlpha = .25 + k * .75;
      ['SI LA CAISSIÈRE SOURIT,', 'NE PAIE PAS.', 'SORS À RECULONS.', 'NE LUI TOURNE', 'JAMAIS LE DOS.'].forEach((l, i) => text(p, l, 0, -170 + i * 86, '800 52px Montserrat', i > 2 ? '#B0303A' : '#2A2A3A'));
      p.restore();
      if (gt < L(4)) { p.save(); p.globalAlpha = .9; text(p, '(à l\'envers…)', SW / 2, 960, '700 34px Montserrat', '#C9CED8'); p.restore(); }
    }
  });
};
SC.caisse = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'back'], [CUE.smile - .5, 'face']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'back') {
      p.save(); cam2(p, 1200 + dx, 560 + dy, push(st, 1.2, 1.3, 4)); shop(p, gt);
      const k = clamp((gt - CUE.voice) * 4);
      if (k > 0) { p.save(); p.globalAlpha = k; cashier(p, 1650, 780, .62, { t: gt, smile: .5 }); p.restore(); }
      counter(p);
      rig(p, { x: 1000, y: 835, s: .55, f: gt > CUE.voice + .6 ? 1 : -1, t: gt, e: gt > CUE.voice ? 'wide' : 'n', look: 1, shake: gt > CUE.voice, armF: [.9, .6], light: 1, holdF: (q, x, y) => { rr(q, x - 12, y - 70, 30, 80, 8); fs(q, '#9AD4F0', 0); } });
      p.restore();
    } else {
      p.save(); cam2(p, 960, 640, push(st, 1.2, 1.45, 3)); shop(p, gt); counter(p);
      cashier(p, 960, 1100, 1.1, { t: gt, smile: 1 }); p.restore();
      if (gt > CUE.price) { p.fillStyle = `rgba(120,0,0,${.15 * Math.abs(Math.sin(gt * 4))})`; p.fillRect(0, 0, SW, SH); }
    }
  });
};
SC.recul = (c, lt, gt) => {
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, 1.4);
    p.save(); cam2(p, 1000 + dx, 520 + dy, push(lt, 1.05, 1.18, 6)); shop(p, gt);
    const nk = eo(pr(gt, CUE.neck - .4, CUE.neck + 2.5)) * 420;
    cashier(p, 1600, 780, .72, { t: gt, smile: 1, neck: nk }); counter(p);
    const k = eo(clamp((gt - CUE.back) / 4));
    rig(p, { x: lerp(1050, 380, k), y: 835, s: .55, f: 1, t: gt, pose: k > 0 && k < 1 ? 'walk' : 'stand', walk: -gt * 5, e: 'wide', look: 1, shake: true, armF: [.3, .2], armB: [.2, .2], light: 1 });
    p.restore();
  });
};
SC.voiture = (c, lt, gt) => {
  film(c, gt, p => {
    const sh = gt > CUE.slam && gt < CUE.slam + .4 ? Math.sin(gt * 80) * 8 : 0;
    p.fillStyle = grad(p, 0, 1080, ['#05060C', '#101420']); p.fillRect(0, 0, SW, SH);
    for (let i = 0; i < 8; i++) { const y = 700 + ((gt * 400 + i * 160) % 1100) - 300; if (y > 640) { rr(p, 940, y, 40, 70, 4); fs(p, 'rgba(255,255,255,.35)', 0); } } // route qui défile
    glow(p, 960, 760, 500, 'rgba(255,230,170,A)', .12);
    p.save(); p.translate(sh, 0);
    rr(p, -40, 360, 2000, 760, 40); fs(p, null, 70, '#14161E'); // cadre du pare-brise
    bust(p, 520, 640, 220, { t: gt, e: 'wide', look: 1, sweat: true, light: 1 });
    bust(p, 1400, 640, 220, { t: gt, col: DAD, col2: DAD2, hair: dadHair, e: gt > CUE.dad ? 'side' : 'n', look: -1, talk: talking(gt, CUE.dad - .3, E(8)), seed: 4, light: -1 });
    rr(p, -40, 980, 2000, 160, 0); fs(p, '#0E0F14', 0); circ(p, 1400, 1000, 120); fs(p, null, 22, '#2A2D36');
    p.restore();
  });
};
SC.fin = (c, lt, gt) => {
  film(c, gt, p => {
    p.fillStyle = '#0B0C12'; p.fillRect(0, 0, SW, SH); glow(p, 960, 540, 600, 'rgba(255,230,170,A)', .2);
    p.save(); cam2(p, 960, 540, push(lt, 1, 1.15, 6));
    const k = eo(clamp((gt - CUE.ticket) / .8));
    p.save(); p.translate(960, lerp(900, 520, k)); p.rotate(-.06);
    rr(p, -230, -340, 460, 680, 4); fs(p, '#F4F0E6', 0);
    text(p, 'STATION 24/24', 0, -270, '900 38px "Roboto Mono"', '#2A2A3A'); text(p, '02:00', 0, -210, '700 30px "Roboto Mono"', '#5A5A6A');
    line(p, [[-190, -170], [190, -170]], 3, '#9A9AA8', null);
    text(p, 'EAU ........ 0,00 €', 0, -110, '700 30px "Roboto Mono"', '#2A2A3A');
    text(p, 'MERCI DE VOTRE', 0, -10, '800 34px "Roboto Mono"', '#2A2A3A'); text(p, 'VISITE.', 0, 36, '800 34px "Roboto Mono"', '#2A2A3A');
    text(p, 'À TRÈS BIENTÔT,', 0, 120, '800 34px "Roboto Mono"', '#B0303A');
    const n = clamp((gt - CUE.ticket - 3) * 2); if (n > 0) { p.globalAlpha = n; text(p, 'TON PRÉNOM', 0, 200, '900 46px "Roboto Mono"', '#B0303A'); p.globalAlpha = 1; }
    p.restore();
    hand(p, 700, lerp(1240, 900, k), .8, -.9, {});
    p.restore();
  });
  finCard(c, gt, CUE.endcard, 'Toi, tu lui aurais tourné le dos ?');
};
