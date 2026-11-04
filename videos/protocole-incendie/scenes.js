// Protocole de survie — L'incendie (19:15 du 06/11), style cinéma (cinema.js + cinema-rig.js). Consignes officielles.
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;

const kidHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .05, r * 1.04, Math.PI * 1.05, Math.PI * 1.95); c.quadraticCurveTo(r * .5, -r * .7, 0, -r * .62); c.quadraticCurveTo(-r * .6, -r * .72, -r * 1.0, -r * .3); c.closePath(); fs(c, '#4A2E1E', 0); c.restore(); };

// ---------- décors ----------
function smoke(p, gt, y0, a = .5) {
  for (let i = 0; i < 14; i++) { const x = ((i * 233 + gt * 50) % 2800) - 400, y = y0 + (i % 4) * 60 + Math.sin(gt + i) * 20;
    p.beginPath(); p.ellipse(x, y, 300, 110, 0, 0, Math.PI * 2); fs(p, `rgba(60,58,62,${a})`, 0); }
  p.fillStyle = `rgba(40,38,42,${a * .7})`; p.fillRect(-400, -200, 2800, y0 + 200);
}
function flat(p, gt, o = {}) {
  p.fillStyle = grad(p, 0, 780, ['#2A2430', '#3A3040']); p.fillRect(-400, -200, 2800, 1100);
  rr(p, 1500, 160, 360, 420, 6); fs(p, '#0C1028', 12, '#4A4058');
  p.fillStyle = '#1E1A22'; p.fillRect(-400, 780, 2800, 500);
  rr(p, 300, 240, 260, 540, 6); fs(p, '#5A3E2A', 0); circ(p, 520, 520, 12); fs(p, '#C9A24A', 0);
  if (o.fire) { glow(p, 1000, 600, 500, 'rgba(255,120,40,A)', .5 + .15 * Math.sin(gt * 9));
    for (let i = 0; i < 5; i++) { const h = 160 + Math.sin(gt * 7 + i) * 40; p.beginPath(); p.moveTo(860 + i * 60, 780); p.quadraticCurveTo(880 + i * 60, 780 - h, 900 + i * 60, 780 - h * 1.2); p.quadraticCurveTo(920 + i * 60, 780 - h, 940 + i * 60, 780); fs(p, i % 2 ? '#FF7A2A' : '#FFC23A', 0); } }
}
function hallway(p, gt, o = {}) {
  p.fillStyle = grad(p, 0, 780, ['#6A6458', '#5A5448']); p.fillRect(-400, -200, 2800, 1100);
  p.fillStyle = '#3A362E'; p.fillRect(-400, 780, 2800, 500);
  rr(p, 1200, 220, 300, 560, 6); fs(p, '#8A8E96', 0); line(p, [[1350, 220], [1350, 780]], 6, '#5A5E66', null); rr(p, 1530, 420, 50, 80, 8); fs(p, '#3A3E46', 0);
  text(p, 'ASCENSEUR', 1350, 190, '800 32px Montserrat', '#F4EEE4');
  for (let i = 0; i < 6; i++) { rr(p, -100 + i * 120, 780 - i * 70, 300, 70, 2); fs(p, '#4A453C', 0); }
  if (o.smoke) smoke(p, gt, o.smoke, .6);
}
function building(p, gt) {
  p.fillStyle = grad(p, 0, 780, ['#0C1028', '#1A2040']); p.fillRect(-400, -200, 2800, 1100);
  rr(p, 600, 40, 760, 780, 6); fs(p, '#4A4458', 0);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) { const lit = i === 1 && j === 1; rr(p, 660 + i * 240, 100 + j * 170, 160, 120, 4); fs(p, j === 3 && i === 2 ? '#FF7A2A' : lit ? '#F7C88A' : '#1A1A28', 0); }
  glow(p, 1220, 610, 220, 'rgba(255,120,40,A)', .5); smoke(p, gt, -100, .25);
  p.fillStyle = '#14141C'; p.fillRect(-400, 820, 2800, 500);
  rr(p, 100, 680, 520, 150, 16); fs(p, '#D83A3A', 0); [200, 520].forEach(x => { circ(p, x, 830, 40); fs(p, '#0A0A0E', 0); });
  glow(p, 360, 660, 120, `rgba(80,140,255,A)`, .6 * (Math.sin(gt * 10) > 0));
}
function ruleTag(p, gt, n, title, t0) {
  const s = pop(gt, t0); if (!s) return;
  p.save(); p.translate(330, 190); p.scale(s, s);
  circ(p, -150, 0, 70); fs(p, '#F5B82E', 0); text(p, String(n), -150, 6, '900 84px Montserrat', '#1A1A20');
  p.font = '900 44px Montserrat'; const w = p.measureText(title).width + 60;
  rr(p, -66, -50, w, 100, 20); fs(p, 'rgba(10,12,20,.82)', 0); text(p, title, -36, 6, '900 44px Montserrat', '#FFFFFF', 'left');
  p.restore();
}
const RULES = [[1, 'SORS ET FERME LA PORTE'], [2, 'JAMAIS L\'ASCENSEUR'], [3, 'BAISSE-TOI'], [4, '18 OU 112'], [5, 'ESCALIER ENFUMÉ : RESTE']];
function tags(p, gt) {
  const cs = [CUE.r1, CUE.r2, CUE.r3, CUE.r4, CUE.r5]; let k = -1; cs.forEach((t, i) => { if (gt >= t) k = i; });
  if (k >= 0 && gt < L(8)) ruleTag(p, gt, RULES[k][0], RULES[k][1], cs[k]);
}
function hud(c, gt) {
  const r = gt < CUE.r1 ? 0 : gt < CUE.r2 ? 1 : gt < CUE.r3 ? 2 : gt < CUE.r4 ? 3 : gt < CUE.r5 ? 4 : 5;
  cinemaHud(c, gt, { part: 'Protocole de survie', off: gt > CUE.endcard, val: r ? 'RÈGLE ' + r + ' / 5' : 'L\'INCENDIE', neg: r === 5, bump: [CUE.r1, CUE.r2, CUE.r3, CUE.r4, CUE.r5][r - 1] });
}
const enfant = (p, x, y, o = {}) => rig(p, { x, y, s: o.s || .5, f: o.f || 1, t: o.t, pose: o.pose, walk: o.walk, hair: kidHair, e: o.e || 'n', mouth: o.mouth, look: o.look, lookY: o.lookY, armF: o.armF, armB: o.armB, holdF: o.holdF, lean: o.lean, seed: 2, light: o.light ?? 1 });
const me = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, hair: kidHair, seed: 2, light: 1, ...o });

// ---------- scènes ----------
SC.flash = (c, lt, gt) => {
  film(c, gt, p => { p.save(); cam2(p, 960, 500, push(lt, 1.0, 1.15, 3)); building(p, gt); p.restore(); });
};
SC.intro = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wake'], [at(1, .5), 'face']]);
  film(c, gt, p => {
    if (shot === 'wake') { p.save(); cam2(p, 960, 560, push(st, 1.05, 1.15, 3)); flat(p, gt); smoke(p, gt, -50, .3); p.restore(); me(p, 960, 680, 220, gt, { e: 'wide', mouth: 'o', rim: 'rgba(255,140,60,.9)' }); }
    else { p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); flat(p, gt); smoke(p, gt, -50, .3); p.restore(); me(p, 960, 640, 230, gt, { e: 'worried', sweat: true, rim: 'rgba(255,140,60,.9)' }); }
  });
};
SC.chez = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'fire'], [at(2, .4), 'run'], [CUE.door - .3, 'door']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'fire' || shot === 'run') {
      p.save(); cam2(p, 860 + dx, 560 + dy, push(st, 1.05, 1.15, 3)); flat(p, gt, { fire: true }); smoke(p, gt, -80, .35);
      enfant(p, shot === 'run' ? lerp(700, 420, clamp(st / 1.5)) : 650, 835, { t: gt, pose: shot === 'run' ? 'run' : 'stand', walk: gt * 9, f: -1, e: 'wide', look: shot === 'run' ? -1 : 1 });
      p.restore();
    } else {
      p.save(); cam2(p, 760 + dx, 560 + dy, push(st, 1.1, 1.2, 3)); hallway(p, gt);
      const k = clamp((gt - CUE.door) / .6); rr(p, 400, 240, 260 * (1 - k * .9) + 26, 540, 6); fs(p, '#5A3E2A', 0);
      glow(p, 500, 500, 260 * (1 - k), 'rgba(255,120,40,A)', .5);
      enfant(p, 760, 835, { t: gt, f: -1, e: 'n', look: -1, armF: [1.5, 0] });
      p.restore();
    }
    tags(p, gt);
  });
};
SC.couloir = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'lift'], [at(3, .55), 'cross'], [L(4), 'crawl'], [at(4, .55), 'low']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'lift' || shot === 'cross') {
      p.save(); cam2(p, 1200 + dx, 500 + dy, push(st, 1.1, 1.2, 3)); hallway(p, gt, { smoke: 120 });
      if (shot === 'cross') { const s = pop(gt, at(3, .55)); p.save(); p.translate(1350, 500); p.scale(s, s); p.lineWidth = 40; p.strokeStyle = '#E53935'; p.beginPath(); p.arc(0, 0, 220, 0, Math.PI * 2); p.moveTo(-155, -155); p.lineTo(155, 155); p.stroke(); p.restore(); }
      p.restore();
    } else if (shot === 'crawl') {
      p.save(); cam2(p, 960 + dx, 640 + dy, push(st, 1.1, 1.2, 3)); hallway(p, gt, { smoke: 380 });
      p.save(); p.translate(lerp(700, 1000, clamp(st / 3)), 800); p.rotate(-Math.PI / 2 + .25); rig(p, { x: 0, y: 0, s: .45, f: 1, t: gt, pose: 'walk', walk: gt * 6, hair: kidHair, e: 'n', armF: [2.4, .3], armB: [2.2, .3], seed: 2, light: 1 }); p.restore();
      p.restore();
    } else {
      p.save(); cam2(p, 960, 540, 1.05); hallway(p, gt); p.restore();
      p.fillStyle = 'rgba(40,38,42,.9)'; p.fillRect(0, 0, SW, 620); p.fillStyle = 'rgba(40,38,42,.35)'; p.fillRect(0, 620, SW, 460);
      text(p, 'FUMÉE TOXIQUE', 960, 330, '900 72px Montserrat', '#FF5A5A');
      line(p, [[200, 640], [1720, 640]], 6, '#F5B82E', null); text(p, 'AIR RESPIRABLE', 960, 850, '900 64px Montserrat', '#2EBD6B');
    }
    tags(p, gt);
  });
};
SC.appel = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 960, 500, 1.05); building(p, gt); p.restore(); p.fillStyle = 'rgba(0,0,0,.45)'; p.fillRect(0, 0, SW, SH);
    phoneBig(p, 960, 560, 1.15, -.03, scrCall(lt < D(5) * .5 ? '18' : '112', 'Adresse · étage · combien ?', '#E53935'), { edge: '#5B6E8A' });
    tags(p, gt);
  });
};
SC.reste = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'door'], [CUE.smoke - .4, 'stairs'], [L(7), 'back'], [CUE.towel - .2, 'towel'], [CUE.window - .3, 'window'], [at(7, .82), 'outside']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'door') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); flat(p, gt); p.restore();
      me(p, 960, 640, 230, gt, { e: 'worried', look: -1 });
    } else if (shot === 'stairs') {
      p.save(); cam2(p, 600 + dx, 600 + dy, push(st, 1.1, 1.25, 3)); hallway(p, gt, { smoke: 700 }); p.restore();
      text(p, 'NE SORS PAS', 960, 900, '900 80px Montserrat', '#FF3B30');
    } else if (shot === 'back' || shot === 'towel') {
      p.save(); cam2(p, 500 + dx, 640 + dy, push(st, 1.15, 1.3, 3)); flat(p, gt);
      if (shot === 'towel') { const k = clamp((gt - CUE.towel) / .8); rr(p, 290, 760 - k * 10, 280, 30 + k * 10, 10); fs(p, '#5A9AD8', 0); }
      enfant(p, 680, 835, { t: gt, pose: shot === 'towel' ? 'kneel' : 'stand', f: -1, e: 'n', look: -1, lookY: .4, armF: [1.0, .6] });
      p.restore();
    } else if (shot === 'window') {
      p.save(); cam2(p, 1680 + dx, 380 + dy, push(st, 1.3, 1.45, 3)); flat(p, gt);
      enfant(p, 1680, 760, { t: gt, f: 1, e: 'wide', armF: [2.9 + Math.sin(gt * 8) * .25, 0], armB: [2.7, 0] });
      p.restore();
    } else {
      p.save(); cam2(p, 960 + dx, 500 + dy, push(st, 1.0, 1.1, 3)); building(p, gt);
      rr(p, 920, 270, 120, 80, 4); fs(p, '#F7C88A', 0); circ(p, 980, 300, 18); fs(p, SKIN, 0); line(p, [[995, 310], [1025, 270 + Math.sin(gt * 8) * 8]], 8, HOOD, null);
      p.restore();
      text(p, 'LA FUMÉE TUE PLUS QUE LES FLAMMES', 960, 960, '900 50px Montserrat', '#FFFFFF');
    }
    tags(p, gt);
  });
};
SC.fin = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 960, 500, push(lt, 1, 1.08, 3)); building(p, gt); p.restore();
    p.fillStyle = 'rgba(10,12,20,.6)'; p.fillRect(0, 0, SW, SH);
    const s = pop(gt, L(8) + .1);
    if (s) { p.save(); p.translate(960, 420); p.scale(s, s); rr(p, -420, -80, 840, 160, 30); fs(p, '#F5B82E', 0); text(p, 'ENREGISTRE-LA', 0, 8, '900 70px Montserrat', '#1A1A20'); p.restore(); }
    const q = clamp((gt - L(8) - 1.2) * 2);
    if (q > 0) { p.globalAlpha = q; text(p, 'Tu connaissais la règle 5 ?', 960, 660, '800 60px Montserrat', '#FFFFFF'); text(p, 'Dis-le en commentaire', 960, 750, '700 40px Montserrat', '#9AA2BC'); p.globalAlpha = 1; }
  });
};
