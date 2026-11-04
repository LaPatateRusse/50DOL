// Et si tu ne dormais plus pendant 11 jours ? — « Et si… ? » science, style cinéma. Cas réel (Randy Gardner, 1964).
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;

const kidHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .05, r * 1.04, Math.PI * 1.05, Math.PI * 1.95); c.quadraticCurveTo(r * .5, -r * .7, 0, -r * .62); c.quadraticCurveTo(-r * .6, -r * .72, -r * 1.0, -r * .3); c.closePath(); fs(c, '#4A2E1E', 0); c.restore(); };
const helmet = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .05, r * 1.12, Math.PI * .85, Math.PI * 2.15); c.closePath(); fs(c, '#1F4E8C', 0);
  line(c, [[0, -r * 1.15], [0, -r * .2]], r * .12, '#F5B82E', null);
  c.lineWidth = r * .08; c.strokeStyle = '#D8DCE6'; c.beginPath(); c.moveTo(-r * .5, r * .62); c.lineTo(r * .5, r * .62); c.moveTo(-r * .4, r * .82); c.lineTo(r * .4, r * .82); c.moveTo(0, r * .55); c.lineTo(0, r * .9); c.stroke(); c.restore(); };

// ---------- décors ----------
function room(p, gt, o = {}) {
  const n = o.night ?? 1;
  p.fillStyle = grad(p, 0, 780, n ? ['#1A1E36', '#232845'] : ['#DCE4EE', '#C8D2DE']); p.fillRect(-400, -200, 2800, 1100);
  rr(p, 1300, 140, 420, 340, 6); fs(p, n ? '#0C1028' : '#BFE3F7', 10, '#3A4270');
  p.fillStyle = n ? '#14172A' : '#9A8A70'; p.fillRect(-400, 780, 2800, 500);
  rr(p, 420, 560, 760, 30, 8); fs(p, '#6B4A30', 0); rr(p, 460, 590, 30, 200, 4); fs(p, '#5A3E28', 0); rr(p, 1110, 590, 30, 200, 4); fs(p, '#5A3E28', 0);
  line(p, [[540, 560], [600, 420], [680, 400]], 10, '#3A3A48', null); circ(p, 690, 400, 30); fs(p, '#F5D58A', 0);
  if (n) { glow(p, 690, 420, 360, 'rgba(255,220,150,A)', .45); cone(p, 690, 420, 60, 520, 160, 'rgba(255,220,150,A)', .25); }
  // horloge murale
  circ(p, 250, 260, 90); fs(p, '#F4EEE4', 8, '#3A3A48');
  const a = (o.clock ?? gt * .8);
  line(p, [[250, 260], [250 + Math.sin(a) * 60, 260 - Math.cos(a) * 60]], 8, '#1A1A20', null);
  line(p, [[250, 260], [250 + Math.sin(a / 12) * 40, 260 - Math.cos(a / 12) * 40]], 10, '#1A1A20', null);
}
function book(p, x, y, s, blur = 0) {
  p.save(); p.translate(x, y); p.scale(s, s);
  rr(p, -360, -200, 720, 400, 14); fs(p, '#C9B89A', 0); rr(p, -340, -185, 330, 370, 8); fs(p, '#FBF6EA', 0); rr(p, 10, -185, 330, 370, 8); fs(p, '#FBF6EA', 0);
  const rows = (x0) => { for (let i = 0; i < 8; i++) { const w = 200 + (i * 37) % 90; p.fillStyle = 'rgba(60,60,80,.75)'; p.fillRect(x0, -150 + i * 42, w, 12); } };
  if (blur) { p.globalAlpha = .45; [-14, 0, 14].forEach(d => { p.save(); p.translate(d * blur, d * .4 * blur); rows(-310); rows(40); p.restore(); }); p.globalAlpha = 1; } else { rows(-310); rows(40); }
  p.restore();
}
function board(p, gt, nums, stop) {
  p.fillStyle = '#2F4A3A'; p.fillRect(-400, -200, 2800, 1400); rr(p, 160, 120, 1600, 760, 12); fs(p, null, 18, '#8A6A3A');
  nums.forEach((n, i) => { const s = pop(gt, n[1]); if (!s) return; p.save(); p.translate(330 + i * 260, 420); p.scale(s, s);
    text(p, n[0], 0, 0, '700 120px Montserrat', 'rgba(255,255,255,.9)'); p.restore(); });
  if (stop) { const s = pop(gt, CUE.stop65 + .6); if (s) { p.save(); p.translate(1630, 250); p.scale(s, s); text(p, '?', 0, 0, '900 140px Montserrat', '#FF5A5A'); p.restore(); } }
  text(p, '100 − 7 − 7 − 7…', 960, 700, '700 70px Montserrat', 'rgba(255,255,255,.6)');
}

// ---------- HUD ----------
function hud(c, gt) {
  const day = gt < L(1) ? 11 : gt < L(2) ? 1 : gt < L(3) ? 2 : gt < L(4) ? 3 : gt < L(6) ? 4 : 11;
  const h = gt < L(1) ? 250 : Math.min(264, Math.round(day * 24 - 12 + clamp((gt - L(1)) / 3) * 0));
  cinemaHud(c, gt, { part: 'Et si tu ne dormais plus ?', off: gt > CUE.endcard, day: gt > CUE.sleep ? undefined : day, dayAt: [L(1), L(2), L(3), L(4), L(6)].filter(t => t <= gt).pop() ?? 0,
    val: gt > CUE.sleep ? 'SOMMEIL : 14 h' : 'ÉVEILLÉ : ' + (day === 11 ? 264 : day * 24) + ' h', neg: day >= 4 && gt < CUE.sleep, bump: gt > CUE.sleep ? CUE.sleep : undefined });
}

const me = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, hair: kidHair, seed: 2, light: 1, ...o });
const tired = (gt, k) => ({ e: k > .5 ? 'sad' : 'worried', brows: 0, sweat: k > .7 });

// ---------- scènes ----------
SC.flash = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 960, 540, push(lt, 1.0, 1.15, 3));
    board(p, gt, [['100', -9], ['93', -9], ['86', -9], ['79', -9], ['72', -9], ['65', -9]], false);
    const s = clamp((lt - 1) * 2); if (s > 0) { p.globalAlpha = s; text(p, '?', 1630, 250, '900 140px Montserrat', '#FF5A5A'); p.globalAlpha = 1; }
    p.restore();
  });
};
SC.chambre = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'desk'], [at(1, .35), 'face'], [at(1, .7), 'clock'], [L(2), 'book'], [at(2, .55), 'eyes'], [L(3), 'drop']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'desk' || shot === 'drop') {
      p.save(); cam2(p, 860 + dx, 560 + dy, push(st, 1.05, 1.15, 3)); room(p, gt);
      rr(p, 760, 640, 160, 150, 10); fs(p, '#5A6478', 0);
      const drop = shot === 'drop' && gt > CUE.drop;
      rig(p, { x: 840, y: 835, s: .55, f: 1, t: gt, pose: 'sit', seat: 190 / .55, hair: kidHair, e: shot === 'drop' ? 'sad' : 'n', mouth: shot === 'drop' ? 'frown' : undefined, lookY: .5, armF: drop ? [.4, .3] : [1.25, .45], armB: [1.2, .5], tilt: shot === 'drop' ? Math.sin(gt * 2) * .1 : 0 });
      if (drop) { const k = clamp((gt - CUE.drop) / .5); rr(p, 1000, lerp(540, 760, k * k), 60, 90, 8); fs(p, '#E05B4B', 0); } else rr(p, 960, 470, 60, 90, 8), fs(p, '#E05B4B', 0);
      p.restore();
    } else if (shot === 'face') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); room(p, gt); p.restore();
      me(p, 960, 640, 230, gt, { e: 'wide', rim: 'rgba(255,220,150,.9)' });
    } else if (shot === 'clock') {
      p.save(); cam2(p, 250, 260, push(st, 2.4, 2.8, 2)); room(p, gt, { clock: gt * 6 }); p.restore();
    } else if (shot === 'book') {
      p.save(); cam2(p, 960, 560, 1.1); room(p, gt); p.restore(); p.fillStyle = 'rgba(0,0,0,.4)'; p.fillRect(0, 0, SW, SH);
      const bk = clamp((gt - CUE.blur) / 1.2); blurred(p, 1 + bk * (8 + Math.sin(gt * 3) * 3), q => book(q, 960, 560, 1.6, 0));
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1.15, 1.3, 2)); room(p, gt); p.restore();
      blurred(p, 6, q => me(q, 960, 640, 260, gt, { e: 'sad', lookY: .3, rim: 'rgba(255,220,150,.9)' }));
    }
  });
};
SC.halluc = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'room'], [at(4, .4), 'mirror'], [CUE.helmet - .2, 'player']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, 1.5);
    if (shot === 'room') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.05, 1.2, 3), Math.sin(gt * 1.3) * .03); room(p, gt);
      // ombres qui bougent sur le mur
      for (let i = 0; i < 3; i++) { p.save(); p.globalAlpha = .35 + .2 * Math.sin(gt * 2 + i); p.translate(800 + i * 300 + Math.sin(gt + i) * 60, 350); p.scale(1 + .2 * Math.sin(gt * 1.5 + i), 1);
        p.beginPath(); p.ellipse(0, 0, 70, 160, 0, 0, Math.PI * 2); fs(p, '#05060C', 0); circ(p, 0, -190, 50); fs(p, '#05060C', 0); p.restore(); }
      p.restore();
    } else if (shot === 'mirror') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); room(p, gt); p.restore();
      p.fillStyle = 'rgba(0,0,0,.35)'; p.fillRect(0, 0, SW, SH);
      me(p, 960, 640, 230, gt, { e: 'wide', look: 1, rim: 'rgba(255,220,150,.9)' });
    } else {
      p.save(); cam2(p, 960, 560, 1.05); p.fillStyle = grad(p, 0, 1080, ['#2A6A3A', '#1E5A2E']); p.fillRect(-400, -200, 2800, 1400);
      for (let i = 0; i < 9; i++) line(p, [[-200 + i * 300, 0], [-200 + i * 300, 1100]], 8, 'rgba(255,255,255,.5)', null);
      glow(p, 960, 200, 900, 'rgba(255,255,230,A)', .3); p.restore();
      bust(p, 960, 640, 230, { t: gt, hair: helmet, col: '#1F4E8C', col2: '#173E70', e: 'happy', mouth: 'smile', seed: 2, light: 1 });
      text(p, '« JE SUIS UNE STAR DU FOOT ! »', 960, 180, '900 54px Montserrat', '#F5B82E');
    }
  });
};
SC.micro = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'class'], [at(5, .5), 'face']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'class') {
      p.save(); cam2(p, 860 + dx, 560 + dy, push(st, 1.05, 1.15, 3)); room(p, gt, { night: 0 });
      rr(p, 760, 640, 160, 150, 10); fs(p, '#5A6478', 0);
      rig(p, { x: 840, y: 835, s: .55, f: 1, t: gt, pose: 'sit', seat: 190 / .55, hair: kidHair, e: 'sad', lookY: .2, armF: [1.25, .45], armB: [1.2, .5] });
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 2)); room(p, gt, { night: 0 }); p.restore();
      me(p, 960, 640, 230, gt, { e: 'n', blink: false, lookY: 0 });
    }
    const off = [CUE.off1, CUE.off1 + 2.4, CUE.off1 + 4.2].some(t => gt > t && gt < t + .7);
    if (off) { p.fillStyle = '#000'; p.fillRect(0, 0, SW, SH); text(p, 'MICRO-SOMMEIL', SW / 2, SH / 2, '900 64px Montserrat', '#3A3A48'); }
  });
};
SC.compte = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'face'], [CUE.count - .3, 'board'], [CUE.stop65 + 1.6, 'lost']]);
  film(c, gt, p => {
    if (shot === 'face') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); room(p, gt, { night: 0 }); p.restore();
      me(p, 960, 640, 230, gt, { e: 'sad', sweat: true, lookY: .2 });
    } else if (shot === 'board') {
      p.save(); cam2(p, 960, 540, push(st, 1.0, 1.08, 4));
      const t0 = CUE.count, step = (CUE.stop65 - t0) / 5;
      board(p, gt, [['100', t0], ['93', t0 + step], ['86', t0 + step * 2], ['79', t0 + step * 3], ['72', t0 + step * 4], ['65', t0 + step * 5]], true);
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 2)); room(p, gt, { night: 0 }); p.restore();
      blurred(p, 4, q => me(q, 960, 640, 230, gt, { e: 'worried', lookY: -.2, look: Math.sin(gt * 2) }));
    }
  });
};
SC.fin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'sleep'], [CUE.guinness - .3, 'book'], [L(8), 'face']]);
  film(c, gt, p => {
    if (shot === 'sleep') {
      p.save(); cam2(p, 960, 560, push(st, 1.05, 1.15, 4)); bedroomNight(p, gt, { clock: String(Math.min(14, Math.floor(st * 3))).padStart(2, '0') + ' h' });
      rr(p, 280, 520, 230, 90, 34); fs(p, '#2B3A7A', 0);
      p.save(); p.translate(400, 545); circ(p, 0, 0, 52); fs(p, SKIN, 0); kidHair(p, 52, [0, 0]); eyes(p, 8, 0, 52, { t: gt, e: 'closed', blink: false }); p.restore();
      for (let i = 0; i < 3; i++) { const k = (gt * .5 + i / 3) % 1; p.globalAlpha = 1 - k; text(p, 'Z', 480 + k * 140, 470 - k * 200, `900 ${40 + i * 14}px Montserrat`, '#C9D4FF'); p.globalAlpha = 1; }
      p.restore();
    } else if (shot === 'book') {
      p.fillStyle = '#1A1A22'; p.fillRect(0, 0, SW, SH);
      p.save(); p.translate(960, 520); p.scale(1 + st * .03, 1 + st * .03);
      rr(p, -300, -360, 600, 720, 20); fs(p, '#C9A227', 0); rr(p, -270, -330, 540, 660, 14); fs(p, null, 6, '#7A5A10');
      text(p, 'RECORDS', 0, -120, '900 80px Montserrat', '#1A1A20'); text(p, 'DU MONDE', 0, -30, '900 60px Montserrat', '#1A1A20');
      const s = pop(gt, CUE.guinness); if (s) { p.save(); p.scale(s, s); p.rotate(-.2); rr(p, -270, 70, 540, 110, 16); fs(p, null, 10, '#E53935'); text(p, 'TROP DANGEREUX', 0, 128, '900 50px Montserrat', '#E53935'); p.restore(); }
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); room(p, gt, { night: 0 }); p.restore();
      me(p, 960, 640, 230, gt, { e: 'happy', mouth: 'smile' });
    }
  });
  const k = pr(gt, CUE.endcard, CUE.endcard + .2); if (k <= 0) return;
  stage(c, p => {
    p.fillStyle = `rgba(5,6,10,${k})`; p.fillRect(0, 0, SW, SH);
    const b = pop(gt, CUE.endcard + .15, .45), qq = clamp((gt - CUE.endcard - .8) * 3);
    if (b) { p.save(); p.translate(SW / 2, 430); p.scale(b, b); text(p, '264 h', 0, 0, '900 190px Montserrat', '#F5B82E'); p.restore(); }
    if (qq > 0) { p.globalAlpha = qq; text(p, 'Et toi, combien d\'heures sans dormir ?', SW / 2, 700, '800 54px Montserrat', '#FFFFFF'); text(p, 'Dis-le en commentaire', SW / 2, 790, '700 38px Montserrat', '#9AA2BC'); }
  }, { vig: .3 });
};
