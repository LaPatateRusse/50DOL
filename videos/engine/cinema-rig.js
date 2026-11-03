// Format cinéma, niveau 2 : personnages articulés ombrés (liseré de lumière, clignements, bouche qui parle),
// post-traitement (halo lumineux, grain), flou de profondeur, découpage en plans. Voir docs/style-cinema.md.

// ---------- outils d'animation ----------
// kf(t, [[t0, v0], [t1, v1], …]) : interpolation lissée entre images clés (nombres ou tableaux de nombres)
function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) {
    const [a, va] = keys[i - 1], [b, vb] = keys[i], k = eio((t - a) / (b - a));
    return Array.isArray(va) ? va.map((v, j) => lerp(v, vb[j], k)) : lerp(va, vb, k);
  }
  return keys[keys.length - 1][1];
}
// shots(gt, [[début, fn], …]) → [fn du plan en cours, temps local du plan]
function shots(gt, list) { let k = 0; list.forEach((s, i) => { if (gt >= s[0]) k = i; }); return [list[k][1], gt - list[k][0]]; }
const talking = (gt, a, b) => gt > a && gt < b;
// petite caméra à l'épaule
const hand2 = (t, a = 1) => [Math.sin(t * .9) * 6 * a + Math.sin(t * 2.3) * 2 * a, Math.cos(t * .7) * 4 * a];

// ---------- post-traitement ----------
const _tmp = document.createElement('canvas'); _tmp.width = 540; _tmp.height = 304;
const _grain = document.createElement('canvas'); _grain.width = _grain.height = 256;
(() => { const g = _grain.getContext('2d'), d = g.createImageData(256, 256); for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (Math.random() - .5) * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); })();
// À appeler après stage() : halo autour des zones claires + grain de film sur la bande.
function post(c, t, o = {}) {
  const h = SH * SK;
  const tx = _tmp.getContext('2d'); tx.clearRect(0, 0, 540, 304);
  tx.filter = 'brightness(.75) contrast(2.2)'; tx.drawImage(c.canvas, 0, BY, W, h, 0, 0, 540, 304); tx.filter = 'none';
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalCompositeOperation = 'screen'; c.globalAlpha = o.bloom ?? .45; c.filter = 'blur(14px)';
  c.drawImage(_tmp, 0, BY, W, h);
  c.filter = 'none'; c.globalCompositeOperation = 'overlay'; c.globalAlpha = o.grain ?? .07;
  c.beginPath(); c.rect(0, BY, W, h); c.clip();
  const ox = Math.floor(rnd(Math.floor(t * 24)) * 256), oy = Math.floor(rnd(Math.floor(t * 24) + 7) * 256);
  for (let x = -ox; x < W; x += 256) for (let y = BY - oy; y < BY + h; y += 256) c.drawImage(_grain, x, y);
  c.restore();
}
// Plan complet : stage + post. o.t obligatoire (temps global).
function film(c, gt, draw, o = {}) { stage(c, draw, o); post(c, gt, o); }

// Calque flou (profondeur de champ) : draw(q) dans le repère 1920 × 1080, puis flou de px pixels.
const _dof = document.createElement('canvas'); _dof.width = 960; _dof.height = 540;
function blurred(c, px, draw) {
  const q = _dof.getContext('2d'); q.setTransform(1, 0, 0, 1, 0, 0); q.clearRect(0, 0, 960, 540); q.scale(.5, .5);
  q.save(); draw(q); q.restore();
  c.save(); c.filter = `blur(${px}px)`; c.drawImage(_dof, 0, 0, SW, SH); c.restore();
}

// ---------- ombrage ----------
// Forme avec liseré de lumière (côté lx : -1 gauche, 1 droite) et dégradé d'ombre.
function shaded(c, path, base, L, box) {
  c.save(); path(c); c.clip();
  c.fillStyle = L.rim; c.fillRect(box[0] - 50, box[1] - 50, box[2] - box[0] + 100, box[3] - box[1] + 100);
  c.translate(-L.lx * L.rw, L.rw * .35); path(c); c.fillStyle = base; c.fill();
  c.setTransform(c.getTransform());
  const g = c.createLinearGradient(box[0], 0, box[2], 0);
  const sh = 'rgba(0,0,0,.32)', cl = 'rgba(0,0,0,0)';
  g.addColorStop(0, L.lx < 0 ? cl : sh); g.addColorStop(1, L.lx < 0 ? sh : cl);
  c.fillStyle = g; c.fillRect(box[0] - 60, box[1] - 60, box[2] - box[0] + 120, box[3] - box[1] + 120);
  c.restore();
}
function limb(c, pts, w, col, L) {
  line(c, pts, w, L.rim, null);
  c.save(); c.translate(-L.lx * L.rw * .8, L.rw * .3); line(c, pts, w, col, null); c.restore();
}

// ---------- yeux et bouche (communs au plan large et au gros plan) ----------
// o : e ('n','wide','happy','sad','angry','side','worried','closed'), look (-1..1), lookY, t, seed, blink (false pour couper),
//     mouth ('o','smile','frown','grit','talk','flat'), talk (bool), brows (décalage)
function eyes(c, cx, cy, r, o = {}) {
  const t = o.t || 0, seed = o.seed || 0;
  const blink = o.blink !== false && ((t * .9 + seed * 1.7) % 3.4) < .12;
  const e = blink && o.e !== 'happy' ? 'closed' : (o.e || 'n');
  const lx = (o.look || 0) * r * .1, ly = (o.lookY || 0) * r * .08, ey = cy - r * .05, ex = r * .25;
  c.save(); c.lineCap = 'round'; c.strokeStyle = '#fff'; c.fillStyle = '#fff';
  const brow = (k, a, dy = 0) => { c.lineWidth = r * .07; c.beginPath(); c.moveTo(cx + k * ex - r * .16 + lx, ey - r * .33 + dy - k * a * r); c.lineTo(cx + k * ex + r * .16 + lx, ey - r * .33 + dy + k * a * r); c.stroke(); };
  [-1, 1].forEach(k => {
    const x = cx + k * ex + lx, y = ey + ly;
    if (e === 'happy') { c.lineWidth = r * .08; c.beginPath(); c.arc(x, y + r * .06, r * .13, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); return; }
    if (e === 'closed') { c.lineWidth = r * .06; c.beginPath(); c.moveTo(x - r * .12, y + r * .02); c.lineTo(x + r * .12, y + r * .02); c.stroke(); return; }
    const ww = { wide: .17, side: .12, worried: .13 }[e] || .12, hh = { wide: .23, side: .1, worried: .18 }[e] || .17;
    c.beginPath(); c.ellipse(x, y, r * ww, r * hh, 0, 0, Math.PI * 2); c.fill();
    if (e === 'wide' || e === 'side' || e === 'worried') { c.fillStyle = SKIN; circ(c, x + (e === 'side' ? r * .06 : lx * .3), y + r * .02, r * .05); c.fill(); c.fillStyle = '#fff'; }
    if (e === 'sad' || e === 'worried') brow(k, .13, -r * .02 + (o.brows || 0));
    if (e === 'angry') brow(k, -.15, r * .05);
    if (e === 'wide') brow(k, 0, -r * .1);
  });
  c.lineWidth = r * .06; const mx = cx + lx * .8, my = cy + r * .38;
  const m = o.talk ? 'talk' : o.mouth;
  if (m === 'talk') { const op = clamp(.45 + .35 * Math.sin(t * 17) + .2 * Math.sin(t * 29)); c.beginPath(); c.ellipse(mx, my, r * (.1 - op * .03), r * (.025 + op * .09), 0, 0, Math.PI * 2); c.fill(); }
  if (m === 'o') { c.beginPath(); c.ellipse(mx, my, r * .07, r * .1, 0, 0, Math.PI * 2); c.stroke(); }
  if (m === 'smile') { c.beginPath(); c.arc(mx, my - r * .18, r * .2, .35, Math.PI - .35); c.stroke(); }
  if (m === 'frown') { c.beginPath(); c.arc(mx, my + r * .1, r * .15, Math.PI + .5, -.5); c.stroke(); }
  if (m === 'flat') { c.beginPath(); c.moveTo(mx - r * .1, my); c.lineTo(mx + r * .1, my); c.stroke(); }
  if (m === 'grit') { rr(c, mx - r * .22, my - r * .08, r * .44, r * .15, r * .04); c.fill(); c.lineWidth = r * .025; c.strokeStyle = SKIN; c.beginPath(); for (let i = -2; i <= 2; i++) { c.moveTo(mx + i * r * .08, my - r * .08); c.lineTo(mx + i * r * .08, my + r * .07); } c.stroke(); }
  if (o.sweat) { const sy = ((t * .6) % 1) * r * .25; c.beginPath(); c.moveTo(cx - r * .62, cy - r * .5 + sy); c.quadraticCurveTo(cx - r * .48, cy - r * .3 + sy, cx - r * .56, cy - r * .22 + sy); c.quadraticCurveTo(cx - r * .7, cy - r * .26 + sy, cx - r * .62, cy - r * .5 + sy); c.fillStyle = '#5FB4FF'; c.fill(); }
  c.restore();
}

// ---------- personnage articulé ----------
// o : x,y (pieds), s, f (1 = regarde à droite), t, seed, col/col2 (sweat), pants, light (-1/1), rim (couleur du liseré)
//     pose : 'stand' | 'walk' (o.walk = phase) | 'sit' (o.seat = hauteur) | 'kneel' | 'run'
//     armF / armB : [épaule, coude] en radians (0 = bras le long du corps, + = vers l'avant) ; lean ; tilt (tête)
//     e, look, lookY, mouth, talk, sweat (cf. eyes) ; hair(c, r) ; holdF(c, x, y) : objet dans la main avant ; hood (capuche sur la tête)
function rig(c, o) {
  const s = o.s || 1, f = o.f || 1, t = o.t || 0, seed = o.seed || 0;
  const L = { lx: (o.light ?? -1) * f, rim: o.rim || 'rgba(255,226,170,.95)', rw: 6 };
  const col = o.col || HOOD, col2 = o.col2 || HOOD2, pants = o.pants || '#2A2D38';
  c.save(); c.translate(o.x, o.y); c.scale(s * f, s);
  const br = Math.sin(t * 2.2 + seed) * .012, pose = o.pose || 'stand';
  let hipY = -250, legs;
  if (pose === 'walk' || pose === 'run') {
    const w = o.walk ?? t * 8, amp = pose === 'run' ? .75 : .45;
    hipY = -250 - Math.abs(Math.cos(w)) * (pose === 'run' ? 16 : 8);
    legs = [1, -1].map(k => { const a = Math.sin(w) * amp * k, b = Math.max(0, Math.sin(w + 1.4) * k) * (pose === 'run' ? 1.2 : .7);
      const kn = [Math.sin(a) * 128, hipY + Math.cos(a) * 128]; return [[0, hipY], kn, [kn[0] + Math.sin(a - b) * 125, kn[1] + Math.cos(a - b) * 125]]; });
  } else if (pose === 'sit') {
    hipY = -(o.seat || 235); legs = [1, -1].map(k => [[k * 6, hipY], [118 + k * 6, hipY + 4], [124 + k * 8, -6]]);
  } else if (pose === 'kneel') {
    hipY = -150; legs = [[[0, hipY], [70, -20], [-60, -12]], [[-6, hipY], [40, -125], [60, -6]]];
  } else legs = [1, -1].map(k => [[k * 10, hipY], [k * 13, -125], [k * 14, -4]]);
  // jambes + chaussures
  legs.forEach((lg, i) => { const cl = i ? '#1E2029' : pants; limb(c, lg, 32, cl, L); const ft = lg[2]; rr(c, ft[0] - 18, ft[1] - 14, 58, 24, 11); fs(c, '#0B0B10', 0); });
  c.translate(0, hipY); c.rotate((o.lean || 0) + (pose === 'run' ? .18 : 0)); c.scale(1, 1 + br);
  const arm = (a, cl, front) => {
    const sh = [6, -240], el = [sh[0] + Math.sin(a[0]) * 108, sh[1] + Math.cos(a[0]) * 108];
    const ha = [el[0] + Math.sin(a[0] + a[1]) * 100, el[1] + Math.cos(a[0] + a[1]) * 100];
    limb(c, [sh, el, ha], 30, cl, L);
    circ(c, ha[0], ha[1], 19); fs(c, '#101015', 0); circ(c, ha[0] + 12, ha[1] - 10, 9); fs(c, '#101015', 0);
    if (front && o.holdF) { c.save(); o.holdF(c, ha[0], ha[1]); c.restore(); }
    return ha;
  };
  const walkArm = pose === 'walk' || pose === 'run' ? Math.sin((o.walk ?? t * 8)) * (pose === 'run' ? .9 : .4) : 0;
  arm(o.armB ? o.armB : [-walkArm + .08, pose === 'run' ? -1.2 : .15], col2, false);
  // torse (sweat)
  const torso = q => { q.beginPath(); q.roundRect(-64, -278, 128, 290, [46, 46, 26, 26]); };
  shaded(c, torso, col, L, [-64, -278, 64, 12]);
  c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(-64, -18, 128, 26);
  rr(c, -24, -95, 64, 50, 12); fs(c, 'rgba(0,0,0,.10)', 0);
  line(c, [[14, -262], [14, -10]], 4, 'rgba(0,0,0,.18)', null);
  if (o.patch) { rr(c, 26, -210, 30, 20, 4); fs(c, o.patch, 0); }
  // tête
  c.save(); c.translate(6, -282); c.rotate((o.tilt || 0) + Math.sin(t * 1.3 + seed) * .025);
  c.beginPath(); c.ellipse(0, 6, 62, 20, 0, 0, Math.PI * 2); fs(c, col2, 0); // col
  const r = 84, hc = [6, -86];
  shaded(c, q => { q.beginPath(); q.arc(hc[0], hc[1], r, 0, Math.PI * 2); }, o.skin || SKIN, { lx: L.lx, rim: o.headRim || 'rgba(170,200,255,.85)', rw: 7 }, [hc[0] - r, hc[1] - r, hc[0] + r, hc[1] + r]);
  if (o.hood) { c.beginPath(); c.arc(hc[0], hc[1], r + 14, Math.PI * .8, Math.PI * 2.2); c.lineWidth = 30; c.strokeStyle = col; c.stroke(); }
  if (o.hair) o.hair(c, r, hc);
  eyes(c, hc[0] + 22, hc[1], r, { ...o, t, seed });
  c.restore();
  arm(o.armF ? o.armF : [walkArm + .1, pose === 'run' ? -1.3 : .2], col, true);
  c.restore();
}

// Gros plan buste animé : respiration, clignements, bouche qui parle, liseré. o comme eyes() + col/col2, hair(c, r, hc), light, handUp (0..1 main sur la tête)
function bust(c, x, y, r, o = {}) {
  const t = o.t || 0, col = o.col || HOOD, col2 = o.col2 || HOOD2, L = { lx: o.light ?? -1, rim: o.rim || 'rgba(255,226,170,.95)', rw: r * .05 };
  const br = Math.sin(t * 2 + (o.seed || 0)) * r * .02;
  c.save(); c.translate(x, y + br);
  const body = q => { q.beginPath(); q.moveTo(-r * 2.2, r * 3.4); q.quadraticCurveTo(-r * 2.1, r * .95, -r * .3, r * .85); q.lineTo(r * .3, r * .85); q.quadraticCurveTo(r * 2.1, r * .95, r * 2.2, r * 3.4); q.closePath(); };
  shaded(c, body, col, L, [-r * 2.2, r * .85, r * 2.2, r * 3.4]);
  c.beginPath(); c.ellipse(0, r * .95, r * .9, r * .3, 0, 0, Math.PI * 2); fs(c, col2, 0);
  line(c, [[-r * .25, r * 1.05], [-r * .3, r * 1.9]], r * .05, '#FFE2A8', null); line(c, [[r * .25, r * 1.05], [r * .3, r * 1.85]], r * .05, '#FFE2A8', null);
  c.restore();
  c.save(); c.translate(x, y); c.rotate((o.tilt || 0) + Math.sin(t * 1.2 + (o.seed || 0)) * .02);
  shaded(c, q => { q.beginPath(); q.arc(0, 0, r, 0, Math.PI * 2); }, o.skin || SKIN, { lx: L.lx, rim: o.headRim || 'rgba(170,200,255,.85)', rw: r * .06 }, [-r, -r, r, r]);
  if (o.hair) o.hair(c, r, [0, 0]);
  eyes(c, 0, 0, r, o);
  c.restore();
  if (o.handUp) { const k = o.handUp; hand(c, x - r * 1.6, y + r * 3.2 - k * r * 3.2, r / 190, -1.2 - k * .6, { sleeve: col }); }
}

// ---------- accessoires ----------
function coin(c, x, y, r, t) { // pièce dorée qui tourne
  const sx = Math.abs(Math.cos(t * 6));
  c.save(); c.translate(x, y); c.scale(Math.max(.15, sx), 1);
  circ(c, 0, 0, r); fs(c, '#D9A520', 0); circ(c, 0, 0, r * .78); fs(c, '#F5C842', 0); circ(c, 0, 0, r * .25); fs(c, '#141418', 0);
  c.restore(); glow(c, x, y, r * 3, 'rgba(255,215,120,A)', .45 * sx);
}
function wallpaper(c, x0, y0, w, h, bg, dot) {
  c.fillStyle = bg; c.fillRect(x0, y0, w, h);
  c.fillStyle = dot; for (let y = y0 + 30, j = 0; y < y0 + h; y += 90, j++) for (let x = x0 + (j % 2) * 60; x < x0 + w; x += 120) { c.beginPath(); c.ellipse(x, y, 10, 16, .6, 0, Math.PI * 2); c.fill(); c.beginPath(); c.ellipse(x + 14, y + 6, 10, 14, -.6, 0, Math.PI * 2); c.fill(); }
}
function plant(c, x, y, s = 1) {
  rr(c, x - 40 * s, y - 80 * s, 80 * s, 80 * s, 12 * s); fs(c, '#B4562E', 0);
  [[-.6, 1], [-.2, 1.2], [.25, 1.1], [.6, .9]].forEach(([a, l]) => { c.save(); c.translate(x, y - 80 * s); c.rotate(a); c.beginPath(); c.ellipse(0, -90 * s * l, 26 * s, 90 * s * l, 0, 0, Math.PI * 2); fs(c, '#2F6B4A', 0); c.restore(); });
}
function frame(c, x, y, w, h, draw) { rr(c, x, y, w, h, 4); fs(c, '#5A3E2A', 0); rr(c, x + 12, y + 12, w - 24, h - 24, 2); fs(c, '#EDE6D8', 0); if (draw) { c.save(); rr(c, x + 12, y + 12, w - 24, h - 24, 2); c.clip(); draw(c, x + w / 2, y + h / 2); c.restore(); } }
// Téléphone tenu en main (vu de face), la main et la manche sous l'écran ; thumb (0..1) pouce qui tape
function phoneHeld(c, x, y, s, rot, draw, o = {}) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  rr(c, -150, 300, 300, 400, 120); fs(c, o.sleeve || HOOD, 0); c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(-150, 300, 300, 40);
  c.beginPath(); c.ellipse(0, 330, 200, 150, 0, 0, Math.PI * 2); fs(c, '#121218', 0);
  c.restore();
  phoneBig(c, x, y, s, rot, draw, { hand: false, edge: o.edge });
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  [[-1, 120], [-1, 220], [1, 60], [1, 150], [1, 240]].forEach(([k, fy]) => { rr(c, k * 180 - 28, fy, 56, 80, 26); fs(c, '#121218', 0); });
  const th = o.thumb ?? 0; c.save(); c.translate(-120, 330); c.rotate(-.5 - th * .25); rr(c, -30, -220, 64, 230, 32); fs(c, '#121218', 0); c.restore();
  c.restore();
}
