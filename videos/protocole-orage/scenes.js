// Protocole de survie — L'orage (19:15 du 07/11), style cinéma (cinema.js + cinema-rig.js). Consignes officielles.
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;

const kidHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .05, r * 1.04, Math.PI * 1.05, Math.PI * 1.95); c.quadraticCurveTo(r * .5, -r * .7, 0, -r * .62); c.quadraticCurveTo(-r * .6, -r * .72, -r * 1.0, -r * .3); c.closePath(); fs(c, '#4A2E1E', 0); c.restore(); };

const spikyHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); const t = performance.now ? 0 : 0;
  c.beginPath(); c.arc(0, -r * .05, r * 1.0, Math.PI * 1.05, Math.PI * 1.95); c.closePath(); fs(c, '#4A2E1E', 0);
  for (let i = 0; i < 9; i++) { const a = Math.PI * (1.1 + i * .1); c.beginPath(); c.moveTo(Math.cos(a - .06) * r * .95, Math.sin(a - .06) * r * .95); c.lineTo(Math.cos(a) * r * 1.75, Math.sin(a) * r * 1.75); c.lineTo(Math.cos(a + .06) * r * .95, Math.sin(a + .06) * r * .95); c.closePath(); fs(c, '#4A2E1E', 0); }
  c.restore(); };

// ---------- décors ----------
function sky(p, gt, flashAt) {
  const f = flashAt !== undefined ? Math.max(0, 1 - Math.abs(gt - flashAt) * 4) : 0;
  p.fillStyle = grad(p, 0, 780, ['#1A1E2A', '#3A4050']); p.fillRect(-400, -200, 2800, 1100);
  for (let i = 0; i < 9; i++) { p.beginPath(); p.ellipse(((i * 300 + gt * 20) % 2800) - 400, 40 + (i % 3) * 60, 360, 120, 0, 0, Math.PI * 2); fs(p, ['#2A2E3A', '#343846', '#22262F'][i % 3], 0); }
  if (f > 0) { p.fillStyle = `rgba(230,235,255,${f * .6})`; p.fillRect(-400, -200, 2800, 1400); }
}
function bolt(p, x, y0, y1, gt, seed = 1) {
  p.save(); p.strokeStyle = '#FFFFFF'; p.lineWidth = 14; p.shadowColor = '#AFC8FF'; p.shadowBlur = 40; p.beginPath(); p.moveTo(x, y0);
  let cx = x; for (let y = y0; y < y1; y += 70) { cx += ((Math.sin(y * .13 + seed) * 997) % 1) * 90; p.lineTo(cx, y); } p.lineTo(cx, y1); p.stroke(); p.restore();
}
function field(p, gt, o = {}) {
  sky(p, gt, o.flash);
  p.fillStyle = '#4A6A3A'; p.fillRect(-400, 760, 2800, 500);
  if (o.hill) { p.beginPath(); p.moveTo(1100, 780); p.quadraticCurveTo(1500, 300, 1900, 780); fs(p, '#3E5E30', 0); }
  if (o.lake) { p.beginPath(); p.ellipse(500, 860, 520, 70, 0, 0, Math.PI * 2); fs(p, '#4A6E8A', 0); }
  if (o.tree) { rr(p, o.tree - 30, 420, 60, 360, 10); fs(p, '#3A2A1E', 0); circ(p, o.tree, 380, 190); fs(p, '#2E4A2A', 0); }
  for (let i = 0; i < 30; i++) line(p, [[(i * 97 + gt * 900) % 2600 - 400, (i * 211 + gt * 1800) % 1100 - 100], [(i * 97 + gt * 900) % 2600 - 420, (i * 211 + gt * 1800) % 1100 - 40]], 3, 'rgba(200,210,230,.5)', null);
}
function car(p, x, y, s) {
  p.save(); p.translate(x, y); p.scale(s, s);
  rr(p, -260, -110, 520, 130, 34); fs(p, '#3A6EA5', 0);
  p.beginPath(); p.moveTo(-150, -110); p.lineTo(-90, -200); p.lineTo(120, -200); p.lineTo(180, -110); p.closePath(); fs(p, '#3A6EA5', 0);
  p.beginPath(); p.moveTo(-130, -115); p.lineTo(-82, -185); p.lineTo(110, -185); p.lineTo(160, -115); p.closePath(); fs(p, '#9CC3E6', 0);
  [-150, 160].forEach(dx => { circ(p, dx, 20, 56); fs(p, '#1d1d22', 0); circ(p, dx, 20, 22); fs(p, '#AEB6C0', 0); });
  p.restore();
}
function ruleTag(p, gt, n, title, t0) {
  const s = pop(gt, t0); if (!s) return;
  p.save(); p.translate(330, 190); p.scale(s, s);
  circ(p, -150, 0, 70); fs(p, '#F5B82E', 0); text(p, String(n), -150, 6, '900 84px Montserrat', '#1A1A20');
  p.font = '900 44px Montserrat'; const w = p.measureText(title).width + 60;
  rr(p, -66, -50, w, 100, 20); fs(p, 'rgba(10,12,20,.82)', 0); text(p, title, -36, 6, '900 44px Montserrat', '#FFFFFF', 'left');
  p.restore();
}
const RULES = [[1, 'COMPTE LES SECONDES'], [2, 'JAMAIS SOUS UN ARBRE'], [3, 'LOIN DE L\'EAU ET DES SOMMETS'], [4, 'BÂTIMENT OU VOITURE'], [5, 'CHEVEUX DRESSÉS : ACCROUPIS-TOI']];
function tags(p, gt) {
  const cs = [CUE.r1, CUE.r2, CUE.r3, CUE.r4, CUE.r5]; let k = -1; cs.forEach((t, i) => { if (gt >= t) k = i; });
  if (k >= 0 && gt < L(9)) ruleTag(p, gt, RULES[k][0], RULES[k][1], cs[k]);
}
function hud(c, gt) {
  const r = gt < CUE.r1 ? 0 : gt < CUE.r2 ? 1 : gt < CUE.r3 ? 2 : gt < CUE.r4 ? 3 : gt < CUE.r5 ? 4 : 5;
  cinemaHud(c, gt, { part: 'Protocole de survie', off: gt > CUE.endcard, val: r ? 'RÈGLE ' + r + ' / 5' : 'L\'ORAGE', neg: r === 5, bump: [CUE.r1, CUE.r2, CUE.r3, CUE.r4, CUE.r5][r - 1] });
}
const enfant = (p, x, y, o = {}) => rig(p, { x, y, s: o.s || .5, f: o.f || 1, t: o.t, pose: o.pose, walk: o.walk, hair: o.hair || kidHair, e: o.e || 'n', mouth: o.mouth, look: o.look, lookY: o.lookY, armF: o.armF, armB: o.armB, holdF: o.holdF, lean: o.lean, seed: 2, light: o.light ?? 1 });
const me = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, hair: kidHair, seed: 2, light: 1, ...o });

// ---------- scènes ----------
SC.flash = (c, lt, gt) => {
  film(c, gt, p => { p.save(); cam2(p, 960, 500, push(lt, 1.0, 1.15, 3)); field(p, gt, { flash: L(0) + 1.2, tree: 1400 }); if (Math.abs(gt - L(0) - 1.2) < .25) bolt(p, 1500, -200, 760, gt, 3); enfant(p, 700, 835, { t: gt, e: 'wide', look: 1, lookY: -.6 }); p.restore(); });
};
SC.intro = (c, lt, gt) => {
  film(c, gt, p => { p.save(); cam2(p, 960, 560, push(lt, 1, 1.08, 2)); field(p, gt, { flash: L(1) + 2.5 }); p.restore(); me(p, 960, 650, 230, gt, { e: 'worried', sweat: true, rim: 'rgba(200,215,255,.9)' }); });
};
SC.compte = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'sky'], [CUE.km - .3, 'km'], [CUE.thirty - .3, 'thirty']]);
  film(c, gt, p => {
    if (shot === 'sky') {
      const fl = L(2) + 1.6; p.save(); cam2(p, 960, 500, push(st, 1, 1.1, 3)); field(p, gt, { flash: fl }); if (Math.abs(gt - fl) < .25) bolt(p, 1300, -200, 760, gt, 5); p.restore();
      const n = Math.max(0, Math.min(3, Math.floor((gt - fl) / .9) + 1)); if (gt > fl) text(p, n + ' s', 960, 540, '900 220px Montserrat', '#FFFFFF');
    } else if (shot === 'km') {
      p.save(); cam2(p, 960, 540, 1.0); paper(p); p.restore();
      text(p, '3 s', 560, 520, '900 200px Montserrat', '#3A3A48'); text(p, '=', 960, 520, '900 160px Montserrat', '#3A3A48'); text(p, '1 km', 1380, 520, '900 200px Montserrat', '#1F6FB2');
      text(p, 'ENVIRON', 960, 760, '800 50px Montserrat', '#6A6A78');
    } else {
      p.save(); cam2(p, 960, 500, push(st, 1, 1.1, 3)); field(p, gt, { flash: CUE.thirty + 2 }); p.restore();
      const s = pop(gt, CUE.thirty); if (s) { p.save(); p.translate(960, 420); p.scale(s, s); text(p, '< 30 s', 0, 0, '900 230px Montserrat', '#FF3B30'); p.restore(); }
      const q = pop(gt, at(3, .65)); if (q) { p.save(); p.translate(960, 760); p.scale(q, q); rr(p, -380, -70, 760, 140, 30); fs(p, '#2EBD6B', 0); text(p, 'ABRITE-TOI', 0, 10, '900 70px Montserrat', '#FFFFFF'); p.restore(); }
    }
    tags(p, gt);
  });
};
SC.arbre = (c, lt, gt) => {
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    p.save(); cam2(p, 1100 + dx, 520 + dy, push(lt, 1.05, 1.2, 4)); field(p, gt, { tree: 1200, flash: CUE.strike });
    if (Math.abs(gt - CUE.strike) < .3) bolt(p, 1200, -200, 300, gt, 7);
    enfant(p, gt < at(4, .5) ? 1050 : lerp(1050, 500, clamp((gt - at(4, .5)) / 1.5)), 835, { t: gt, pose: gt < at(4, .5) ? 'stand' : 'run', walk: gt * 9, f: -1, e: 'wide', look: -1 });
    p.restore();
    const s = pop(gt, at(4, .3)); if (s) { p.save(); p.translate(1200, 420); p.scale(s, s); p.lineWidth = 40; p.strokeStyle = '#E53935'; p.beginPath(); p.arc(0, 0, 220, 0, Math.PI * 2); p.moveTo(-155, -155); p.lineTo(155, 155); p.stroke(); p.restore(); }
    tags(p, gt);
  });
};
SC.eau = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'lake'], [at(5, .45), 'umbrella']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'lake') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.0, 1.1, 3)); field(p, gt, { lake: true, hill: true }); p.restore();
      [[500, 640, 'EAU'], [1500, 400, 'SOMMET']].forEach(([x, y, l], i) => { const s = pop(gt, L(5) + 1.2 + i * .6); if (!s) return; p.save(); p.translate(x, y); p.scale(s, s); rr(p, -150, -50, 300, 100, 20); fs(p, 'rgba(10,12,20,.8)', 0); text(p, l, 0, 8, '900 50px Montserrat', '#FF5A5A'); p.restore(); });
    } else {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.1, 1.2, 3)); field(p, gt, {});
      enfant(p, 900, 835, { t: gt, e: 'n', armF: [2.6, 0], holdF: (q, x, y) => { line(q, [[x, y], [x, y - 220]], 8, '#2A2A30', null); q.beginPath(); q.arc(x, y - 220, 130, Math.PI, 0); fs(q, '#E53935', 0); } });
      p.restore();
      const s = pop(gt, at(5, .6)); if (s) { p.save(); p.translate(1400, 400); p.scale(s, s); rr(p, -230, -60, 460, 120, 26); fs(p, 'rgba(10,12,20,.82)', 0); text(p, 'RANGE-LE', 0, 10, '900 60px Montserrat', '#F5B82E'); p.restore(); }
    }
    tags(p, gt);
  });
};
SC.voiture = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 960, 560, push(lt, 1.0, 1.12, 4)); field(p, gt, { flash: CUE.bolt });
    car(p, 960, 780, 1.1);
    p.save(); p.translate(960 + 30, 780 - 150); circ(p, 0, 0, 34); fs(p, SKIN, 0); kidHair(p, 34, [0, 0]); eyes(p, 4, 0, 34, { t: gt, e: gt > CUE.bolt ? 'wide' : 'n' }); p.restore();
    if (Math.abs(gt - CUE.bolt) < .3) bolt(p, 1000, -200, 560, gt, 9);
    if (gt > CUE.bolt && gt < CUE.bolt + 1.5) { const k = (gt - CUE.bolt) / 1.5; p.save(); p.strokeStyle = `rgba(255,240,120,${1 - k})`; p.lineWidth = 10; p.setLineDash([30, 20]); p.lineDashOffset = -gt * 300; p.beginPath(); p.moveTo(980, 560); p.lineTo(1170, 680); p.lineTo(1240, 780); p.lineTo(1300, 830); p.stroke(); p.restore(); }
    p.restore();
    const s = pop(gt, at(6, .2)); if (s) { p.save(); p.translate(560, 300); p.scale(s, s); rr(p, -260, -60, 520, 120, 26); fs(p, '#2EBD6B', 0); text(p, '🏠  OU  🚗', 0, 12, '900 64px Montserrat', '#FFFFFF'); p.restore(); }
    tags(p, gt);
  });
};
SC.cheveux = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'face'], [CUE.crouch - .3, 'crouch'], [CUE.nolie - .3, 'nolie']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'face') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); field(p, gt, {}); p.restore();
      me(p, 960, 650, 230, gt, { e: 'wide', mouth: 'o', hair: gt > CUE.hair ? spikyHair : kidHair, rim: 'rgba(200,215,255,.9)' });
      if (gt > CUE.hair) for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28 + gt * 3; line(p, [[960 + Math.cos(a) * 330, 330 + Math.sin(a) * 120], [960 + Math.cos(a) * 360, 330 + Math.sin(a) * 140]], 6, '#FFF27A', null); }
    } else if (shot === 'crouch') {
      p.save(); cam2(p, 960 + dx, 600 + dy, push(st, 1.15, 1.3, 3)); field(p, gt, {});
      p.restore();
      p.save(); p.translate(800, 830); // accroupi, vu de face : pieds joints, mains sur les oreilles, tête baissée
      line(p, [[-20, 0], [-90, -110], [-20, -170]], 34, '#2A3550', null); line(p, [[20, 0], [90, -110], [20, -170]], 34, '#2A3550', null);
      rr(p, -60, -330, 120, 180, 40); fs(p, HOOD, 0);
      circ(p, 0, -360, 62); fs(p, SKIN, 0); kidHair(p, 62, [0, -372]);
      line(p, [[-55, -300], [-100, -250], [-66, -362]], 26, HOOD, null); line(p, [[55, -300], [100, -250], [66, -362]], 26, HOOD, null);
      circ(p, -66, -362, 18); fs(p, SKIN, 0); circ(p, 66, -362, 18); fs(p, SKIN, 0);
      rr(p, -60, -8, 50, 20, 8); fs(p, '#1A1A20', 0); rr(p, 10, -8, 50, 20, 8); fs(p, '#1A1A20', 0);
      p.restore();
      ['PIEDS JOINTS', 'MAINS SUR LES OREILLES', 'TÊTE BAISSÉE'].forEach((l, i) => { const s = pop(gt, CUE.crouch + .4 + i * .8); if (!s) return; p.save(); p.translate(1500, 380 + i * 130); p.scale(s, s); rr(p, -300, -50, 600, 100, 22); fs(p, 'rgba(10,12,20,.82)', 0); text(p, l, 0, 8, '900 40px Montserrat', '#FFFFFF'); p.restore(); });
    } else {
      p.save(); cam2(p, 960, 600, push(st, 1.05, 1.15, 3)); field(p, gt, {});
      p.save(); p.translate(960, 790); p.rotate(-Math.PI / 2); enfant(p, 0, 0, { t: gt, e: 'n' }); p.restore(); p.restore();
      const s = pop(gt, CUE.nolie); if (s) { p.save(); p.translate(960, 600); p.scale(s, s); p.lineWidth = 40; p.strokeStyle = '#E53935'; p.beginPath(); p.arc(0, 0, 240, 0, Math.PI * 2); p.moveTo(-170, -170); p.lineTo(170, 170); p.stroke(); p.restore(); }
      text(p, 'NE T\'ALLONGE PAS', 960, 330, '900 70px Montserrat', '#FF3B30');
    }
    tags(p, gt);
  });
};
SC.fin = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 960, 500, push(lt, 1, 1.08, 3)); field(p, gt, { flash: L(9) + 2 }); p.restore();
    p.fillStyle = 'rgba(10,12,20,.6)'; p.fillRect(0, 0, SW, SH);
    const s = pop(gt, L(9) + .1);
    if (s) { p.save(); p.translate(960, 420); p.scale(s, s); rr(p, -420, -80, 840, 160, 30); fs(p, '#F5B82E', 0); text(p, 'ENREGISTRE-LA', 0, 8, '900 70px Montserrat', '#1A1A20'); p.restore(); }
    const q = clamp((gt - L(9) - 1.2) * 2);
    if (q > 0) { p.globalAlpha = q; text(p, 'Tu connaissais la règle 5 ?', 960, 660, '800 60px Montserrat', '#FFFFFF'); text(p, 'Dis-le en commentaire', 960, 750, '700 40px Montserrat', '#9AA2BC'); p.globalAlpha = 1; }
  });
};
function paper(p) {
  p.fillStyle = '#F1EADB'; p.fillRect(-400, -200, 2800, 1400);
  for (let x = -400; x < 2400; x += 60) { p.fillStyle = '#E5DCC8'; p.fillRect(x, -200, 3, 1400); }
  for (let y = -200; y < 1200; y += 60) { p.fillStyle = '#E5DCC8'; p.fillRect(-400, y, 2800, 3); }
}
