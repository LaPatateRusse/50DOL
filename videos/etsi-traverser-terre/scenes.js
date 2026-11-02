// Et si… tu traversais la Terre ? (format « Et si… ? », style Max ; moteur ../engine/).
const EP = { vignette: { kola: .18, temps: .18 }, hideSubs: gt => gt > CUE.endcard - .1 };
const SC = {};

// ---------- décors ----------
function space(c, t) {
  c.fillStyle = grad(c, -300, 2200, ['#0B1026', '#1A2147', '#0B1026']); c.fillRect(-300, -300, 1700, 2600);
  for (let i = 0; i < 120; i++) { c.globalAlpha = .4 + .6 * Math.abs(Math.sin(t * .8 + i)); circ(c, rnd(i) * 1500 - 200, rnd(i + 40) * 2400 - 200, 1.5 + rnd(i + 9) * 2.5); fs(c, '#fff', 0); }
  c.globalAlpha = 1;
}
// Terre en coupe : croûte, manteau, noyau externe, graine ; tunnel vertical.
function earthCut(c, x, y, r, opts = {}) {
  c.save(); c.translate(x, y);
  circ(c, 0, 0, r); fs(c, '#2E7BC4', 8);
  // continents simplifiés
  c.save(); circ(c, 0, 0, r); c.clip();
  [[-.5, -.55, .45, .25], [.35, -.2, .35, .3], [-.2, .5, .3, .2], [.5, .55, .25, .15]].forEach(([a, b, w, h]) => { c.beginPath(); c.ellipse(a * r, b * r, w * r, h * r, .4, 0, Math.PI * 2); fs(c, '#4CAF6A', 0); });
  // demi-coupe : on retire la moitié droite pour voir l'intérieur
  if (opts.cut) {
    c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r + 2, -Math.PI / 2, Math.PI / 2); c.closePath(); c.fillStyle = '#0B1026'; c.fill();
    [[1, '#8B5A3C'], [.97, '#E8742A'], [.55, '#F5A623'], [.2, '#FFE066']].forEach(([k, col]) => { c.beginPath(); c.moveTo(0, -k * r); c.arc(0, 0, k * r, -Math.PI / 2, Math.PI / 2); c.closePath(); fs(c, col, 0); });
  }
  c.restore();
  circ(c, 0, 0, r); fs(c, null, 8);
  if (opts.tunnel) { c.fillStyle = '#0A0D1C'; c.fillRect(-14, -r, 28, 2 * r); c.setLineDash([16, 12]); line(c, [[0, -r], [0, r]], 4, 'rgba(255,255,255,.6)', null); c.setLineDash([]); }
  c.restore();
}
function paper(c) {
  c.fillStyle = '#F1EADB'; c.fillRect(-100, -100, 1300, 2200);
  for (let x = -100; x < 1300; x += 54) { c.fillStyle = x % 270 ? '#E5DCC8' : '#DCD1BA'; c.fillRect(x, -100, 3, 2200); }
  for (let y = -100; y < 2100; y += 54) { c.fillStyle = y % 270 ? '#E5DCC8' : '#DCD1BA'; c.fillRect(-100, y, 1300, 3); }
}
// Max qui tombe, tête en bas ou non, bras levés.
function fallingMax(c, x, y, s, t, flip = 0) {
  c.save(); c.translate(x, y); c.rotate(flip * Math.PI + Math.sin(t * 3) * .08);
  drawMax(c, { x: 0, y: 300 * s, s, f: 1, t, front: [3.0, .2], back: [2.8, .2], mouthO: true });
  c.restore();
}
function speedLines(c, t, n = 30) {
  for (let i = 0; i < n; i++) { const x = rnd(i) * W, y = ((rnd(i + 7) * H) - t * 2600) % H; c.globalAlpha = .5; line(c, [[x, y < 0 ? y + H : y], [x, (y < 0 ? y + H : y) + 140]], 4, '#fff', null); }
  c.globalAlpha = 1;
}

// ---------- SCÈNES ----------
SC.titre = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.0 + lt * .03);
  space(c, gt);
  earthCut(c, 540, 1180, 430, { tunnel: pr(lt, .8, 1.4) > 0 });
  fallingMax(c, 540, 700 - 20 * Math.sin(gt * 3), .32, gt);
  c.restore();
  const s1 = pop(lt, .1), s2 = pop(lt, .35, .45);
  if (s1) { c.save(); c.translate(540, 280); c.scale(s1, s1); rr(c, -170, -56, 340, 112, 6); fs(c, '#E53935', 0); text(c, 'ET SI…', 0, 4, '700 84px Oswald', '#fff'); c.restore(); }
  if (s2) { c.save(); c.translate(540, 450); c.scale(s2, s2); text(c, 'TU TRAVERSAIS', 0, 0, '700 108px Oswald', '#EEF0F4', 'center', 12); text(c, 'LA TERRE ?', 0, 120, '700 108px Oswald', '#F5C518', 'center', 12); c.restore(); }
};
SC.saut = (c, lt, gt) => {
  const j = CUE.jump, fall = eio(pr(gt, j, j + 2.5));
  c.save(); cam(c, 540, lerp(1000, 1200, fall), 1.05);
  c.fillStyle = grad(c, -300, 1300, ['#8EC5F2', '#CFE8FA']); c.fillRect(-300, -300, 1700, 1600);
  c.fillStyle = '#5DAA4E'; c.fillRect(-300, 1300, 1700, 40);
  c.fillStyle = '#8B5A3C'; c.fillRect(-300, 1340, 1700, 1200);
  for (let i = 0; i < 40; i++) { circ(c, rnd(i) * 1500 - 200, 1400 + rnd(i + 3) * 1000, 6 + rnd(i + 5) * 10); fs(c, '#7A4E32', 0); }
  // le trou
  c.fillStyle = '#0A0D1C'; c.fillRect(440, 1300, 200, 1300);
  rr(c, 420, 1290, 240, 24, 8); fs(c, '#6B7A3A', 0);
  if (gt < j) drawMax(c, { x: 380, y: 1300, s: .7, f: 1, t: gt, lean: .2, front: [.8, .2], back: [.6, .2] });
  else fallingMax(c, 540, lerp(1050, 2000, fall), .55, gt);
  c.restore();
  const z = pop(gt, CUE.zero_g);
  if (z) { c.save(); c.translate(540, 380); c.scale(z, z); rr(c, -230, -60, 460, 120, 60); fs(c, '#3B82D6', 6, '#fff'); text(c, '0 G : APESANTEUR', 0, 4, '700 56px Oswald', '#fff'); c.restore(); }
};
SC.kola = (c, lt, gt) => {
  c.save(); cam(c, 540, 900, lerp(1.0, 1.05, pr(lt, 0, 6)));
  paper(c);
  const hs = pop(lt, .1);
  c.save(); c.translate(540, 220); c.scale(hs, hs); text(c, 'LE PLUS PROFOND JAMAIS CREUSÉ', 0, 0, '700 64px Oswald', '#2A2A2A'); c.restore();
  // la Terre (diamètre) vs le forage de Kola
  earthCut(c, 540, 760, 330, { cut: true });
  const k = pop(gt, CUE.kola);
  if (k) {
    line(c, [[540, 430], [540, 434]], 10, '#E53935', null);
    c.save(); c.translate(780, 420); c.scale(k, k); rr(c, -170, -40, 340, 80, 40); fs(c, '#E53935', 5, '#fff'); text(c, 'KOLA : 12 KM', 0, 3, '700 46px Oswald', '#fff'); c.restore();
    line(c, [[610, 420], [548, 432]], 4, '#E53935', null);
  }
  const b = eo(pr(gt, CUE.big, CUE.big + .9));
  if (b) {
    line(c, [[540, 430], [540, 430 + 660 * b]], 12, '#F5C518', OL, 5);
    const bs = pop(gt, CUE.big);
    c.save(); c.translate(540, 330); c.scale(bs, bs); rr(c, -210, -48, 420, 96, 18); fs(c, '#F5C518', 6); text(c, 'TOI : 12 742 KM', 0, 4, '700 52px Oswald', '#1d1d22'); c.restore();
  }
  c.restore();
};
SC.chaleur = (c, lt, gt) => {
  const k = eo(pr(gt, CUE.thermo, CUE.thermo + 2.2));
  c.save(); cam(c, 540, lerp(900, 1000, pr(lt, 0, 5)), 1.0);
  space(c, gt);
  earthCut(c, 540, 1000, 560, { cut: true, tunnel: true });
  glow(c, 540, 1000, 260, 'rgba(255,200,60,A)', .6 * k);
  fallingMax(c, 540, lerp(560, 920, k), .28, gt, 1);
  c.restore();
  const t = Math.round(lerp(15, 5000, k) / 10) * 10, tf = String(t).replace(/\B(?=(\d{3})+(?!\d))/g, ' '), col = t > 1000 ? '#E53935' : '#E0782F';
  card(c, 540, 220, pop(gt, CUE.thermo - .3), 'TEMPÉRATURE', `${tf} °C`, thermoIcon(col), col, '', 0);
};
SC.vitesse = (c, lt, gt) => {
  const k = eo(pr(gt, LINES[4].start, CUE.speed));
  c.fillStyle = grad(c, 0, H, ['#3A1C10', '#C2561B', '#3A1C10']); c.fillRect(0, 0, W, H);
  c.fillStyle = '#0A0D1C'; c.fillRect(360, 0, 360, H);
  speedLines(c, gt, 18 + Math.round(k * 30));
  c.save(); cam(c, 540, 1000, 1.25 + Math.sin(gt * 30) * .004 * k);
  fallingMax(c, 540, 860, .5, gt, 1);
  c.restore();
  const v = Math.round(lerp(0, 28000, k) / 100) * 100;
  card(c, 540, 200, pop(gt, LINES[4].start), 'VITESSE', `${String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} KM/H`, (p, x, y) => { circ(p, x, y, 48); fs(p, '#fff', 6); line(p, [[x, y], [x + 30 * Math.cos(-2.6 + k * 2.2), y + 30 * Math.sin(-2.6 + k * 2.2)]], 8, '#E53935', null); }, '#E53935', '', 0);
};
SC.temps = (c, lt, gt) => {
  c.save(); cam(c, 540, 900, 1.0 + lt * .02);
  paper(c);
  const k = eo(pr(gt, CUE.timer - .6, CUE.timer + 1.4));
  c.save(); c.translate(540, 560);
  circ(c, 0, 0, 260); fs(c, '#fff', 10);
  c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 240, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (40 / 60) * k); c.closePath(); fs(c, '#F5C518', 0);
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; line(c, [[Math.sin(a) * 215, -Math.cos(a) * 215], [Math.sin(a) * 240, -Math.cos(a) * 240]], 6, OL, null); }
  circ(c, 0, 0, 14); fs(c, OL, 0);
  c.restore();
  const s = pop(gt, CUE.timer);
  if (s) { c.save(); c.translate(540, 920); c.scale(s, s); text(c, '≈ 40 MIN', 0, 0, '700 120px Oswald', '#1d1d22', 'center', 0); c.restore(); }
  c.restore();
};
SC.arrivee = (c, lt, gt) => {
  const o = eo(pr(gt, CUE.out - .4, CUE.out + 1.0));
  c.save(); cam(c, 540, 1000, 1.0);
  space(c, gt);
  earthCut(c, 540, 1000, 480, { tunnel: true });
  badge(c, 700, 470, pop(lt, .1), 'FRANCE', '#34373F', 0);
  badge(c, 720, 1540, pop(gt, CUE.out), 'NOUVELLE-ZÉLANDE', '#2EAD5B', 0);
  fallingMax(c, 540, lerp(1300, 1620, o), .28, gt, o > .5 ? 0 : 1);
  c.restore();
};
SC.yoyo = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.0);
  space(c, gt);
  earthCut(c, 540, 1000, 560, { cut: true, tunnel: true });
  const y = 1000 + Math.sin(lt * 2.4) * 520;
  fallingMax(c, 540, y - 120, .26, gt, Math.cos(lt * 2.4) > 0 ? 1 : 0);
  line(c, [[640, 600], [640, 1400]], 8, '#F5C518', null);
  [[600, -1], [1400, 1]].forEach(([yy, d]) => { c.beginPath(); c.moveTo(620, yy); c.lineTo(660, yy); c.lineTo(640, yy + d * 30); c.closePath(); fs(c, '#F5C518', 0); });
  c.restore();
  const l = pop(gt, CUE.loop);
  if (l) { c.save(); c.translate(820, 1000); c.scale(l, l); circ(c, 0, 0, 90); fs(c, '#E53935', 6, '#fff'); text(c, '∞', 0, 6, '700 110px Montserrat', '#fff'); c.restore(); }
};
SC.centre = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, lerp(1.0, 1.6, eio(pr(lt, 0, 6))));
  space(c, gt);
  earthCut(c, 540, 1000, 560, { cut: true, tunnel: true });
  const amp = 520 * Math.exp(-lt * .6);
  fallingMax(c, 540, 1000 - 120 + Math.sin(lt * 3) * amp, .26, gt, 0);
  c.restore();
  const f = pop(gt, CUE.float);
  if (f) { c.save(); c.translate(540, 380); c.scale(f, f); rr(c, -300, -60, 600, 120, 60); fs(c, '#3B82D6', 6, '#fff'); text(c, 'TU FLOTTES AU CENTRE', 0, 4, '700 56px Oswald', '#fff'); c.restore(); }
};
SC.fin = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.6);
  space(c, gt);
  earthCut(c, 540, 1000, 560, { cut: true, tunnel: true });
  fallingMax(c, 540, 880 + Math.sin(gt * 2) * 10, .26, gt, 0);
  c.restore();
  const e = CUE.endcard, k = pr(gt, e - .1, e + .15);
  if (k > 0) {
    c.fillStyle = `rgba(10,12,24,${k})`; c.fillRect(0, 0, W, H);
    const s1 = pop(gt, e + .1), s2 = pop(gt, e + .4, .45);
    if (s1) { c.save(); c.translate(540, 760); c.scale(s1, s1); rr(c, -170, -56, 340, 112, 6); fs(c, '#E53935', 0); text(c, 'ET SI…', 0, 4, '700 84px Oswald', '#fff'); c.restore(); }
    if (s2) { c.save(); c.translate(540, 960); c.scale(s2, s2); text(c, 'ABONNE-TOI POUR', 0, 0, '700 76px Oswald', '#EEF0F4'); text(c, 'LA QUESTION DE DEMAIN', 0, 90, '700 76px Oswald', '#F5C518'); c.restore(); }
  }
};
function hud() {}
