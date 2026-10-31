// Moteur commun des vidéos « survie » : utilitaires, Max, décors, HUD, sous-titres, rendu image par image.
// Chaque épisode fournit scenes.js qui définit SC (scènes), hud(c, gt, sceneId) et EP (réglages).
const W = 1080, H = 1920, OL = '#1c1c22';
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const buf = document.createElement('canvas'); buf.width = W; buf.height = H;
const bx = buf.getContext('2d');
let TL, CUE, LINES;

// ---------- utilitaires ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const pr = (t, a, b) => clamp((t - a) / (b - a));
const eo = t => 1 - Math.pow(1 - t, 3);
const eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const back = t => { const c1 = 2.2, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const pop = (t, at, d = .35) => { const k = pr(t, at, at + d); return k <= 0 ? 0 : back(k); };
const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
function fs(c, fill, lw = 6, stroke = OL) {
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (lw) { c.lineWidth = lw; c.strokeStyle = stroke; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(); }
}
function circ(c, x, y, r) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); }
function line(c, pts, w, color, outline = OL, ow = 8) {
  c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
  if (outline) { c.lineWidth = w + ow; c.strokeStyle = outline; c.stroke(); }
  c.lineWidth = w; c.strokeStyle = color; c.stroke();
}
function grad(c, y0, y1, stops) {
  const g = c.createLinearGradient(0, y0, 0, y1);
  stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g;
}
function glow(c, x, y, r, color, a) {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color.replace('A', a)); g.addColorStop(1, color.replace('A', 0));
  c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
}
function cam(c, cx, cy, z, rot = 0) { c.translate(W / 2, H / 2); c.rotate(rot); c.scale(z, z); c.translate(-cx, -cy); }
function text(c, s, x, y, font, color, align = 'center', stroke = 0, sc = OL, ls = '0px') {
  c.font = font; c.textAlign = align; c.textBaseline = 'middle'; c.letterSpacing = ls;
  if (stroke) { c.lineWidth = stroke; c.strokeStyle = sc; c.lineJoin = 'round'; c.strokeText(s, x, y); }
  c.fillStyle = color; c.fillText(s, x, y); c.letterSpacing = '0px';
}
function snow(c, t, n, a = .9, speed = 1, seed = 0) {
  c.fillStyle = `rgba(255,255,255,${a})`;
  for (let i = 0; i < n; i++) {
    const r = 2 + rnd(i + seed + 3) * 4.5;
    const y = ((rnd(i + seed + 99) * (H + 200) + t * (70 + rnd(i + seed + 7) * 90) * speed) % (H + 200)) - 100;
    const x = rnd(i + seed) * (W + 300) - 150 + Math.sin(t * .9 + i) * 28;
    circ(c, x, y, r); c.fill();
  }
}
function lineAt(gt) { // index de la phrase en cours (ou la dernière commencée)
  let k = -1; LINES.forEach((l, i) => { if (gt >= l.start - .15) k = i; }); return k;
}

// ---------- Max ----------
// o : x,y (pieds), s (échelle), f (1 = regarde à droite), lean, front/back arm [épaule, coude],
//     walk (phase), sit, shiver, t
function drawMax(c, o) {
  const t = o.t || 0;
  c.save();
  c.translate(o.x + (o.shiver ? Math.sin(t * 55) * 3 : 0), o.y);
  c.scale(o.s * o.f, o.s);
  const NAVY = '#3B4A6B', BLACK = '#26262c', SHOE = '#6b3f24';
  // jambes
  const hip = [0, -250];
  let legs;
  if (o.sit) legs = [[[0, -250], [115, -250], [118, -8]], [[-12, -250], [100, -250], [100, -8]]];
  else {
    const sw = o.walk !== undefined ? Math.sin(o.walk) * .38 : 0;
    legs = [-sw, sw].map((a, i) => [[i * -8, -250], [i * -8 + Math.sin(a) * 250, -250 + Math.cos(a) * 248]]);
  }
  legs.slice().reverse().forEach(L => {
    const f = L[L.length - 1];
    rr(c, f[0] - 22, f[1] - 14, 66, 26, 12); fs(c, SHOE, 6);
    line(c, L, 30, NAVY);
  });
  // haut du corps
  c.translate(hip[0], hip[1]); c.rotate(o.lean || 0);
  const arm = (a, col) => {
    const sh = [12, -195], L1 = 105, L2 = 100;
    const el = [sh[0] + Math.sin(a[0]) * L1, sh[1] + Math.cos(a[0]) * L1];
    const ha = [el[0] + Math.sin(a[0] + a[1]) * L2, el[1] + Math.cos(a[0] + a[1]) * L2];
    line(c, [sh, el, ha], 28, col);
    circ(c, ha[0], ha[1], 17); fs(c, col, 5);
  };
  // sac à dos
  rr(c, -112, -220, 78, 175, 24); fs(c, '#7d7444', 6);
  rr(c, -112, -220, 78, 60, [24, 24, 8, 8]); fs(c, '#6a6239', 5);
  arm(o.back || [.25, .15], '#1f1f25');
  rr(c, -55, -232, 112, 248, 42); fs(c, BLACK, 6);
  line(c, [[22, -226], [30, -150], [26, -60]], 12, '#6a6239', OL, 5);
  circ(c, 28, -140, 6); fs(c, '#9aa0a8', 3);
  // tête
  const hy = -335;
  c.beginPath(); c.moveTo(-28, hy - 78); c.lineTo(-72, hy - 128); c.lineTo(-84, hy - 40); c.closePath(); fs(c, BLACK, 6);
  circ(c, 12, hy, 94); fs(c, BLACK, 6);
  circ(c, 40, hy + 8, 66); fs(c, '#F4D9B8', 5);
  c.globalAlpha = .75; circ(c, 14, hy + 30, 19); fs(c, '#E8A598', 0); c.globalAlpha = 1;
  line(c, [[34, hy - 22], [60, hy - 10]], 7, OL, null);
  line(c, [[98, hy - 22], [74, hy - 10]], 7, OL, null);
  circ(c, 55, hy + 4, 6.5); fs(c, OL, 0); circ(c, 84, hy + 4, 6.5); fs(c, OL, 0);
  if (o.mouthO) { circ(c, 72, hy + 36, 7); fs(c, OL, 0); }
  else line(c, [[60, hy + 36], [84, hy + 34]], 5, OL, null);
  arm(o.front || [.15, .1], BLACK);
  c.restore();
}

// silhouette sombre (passants / pillards)
function figure(c, x, y, s, col, ph = 0, f = 1) {
  c.save(); c.translate(x, y); c.scale(s * f, s);
  const sw = Math.sin(ph) * .35;
  [sw, -sw].forEach(a => line(c, [[0, -230], [Math.sin(a) * 230, -230 + Math.cos(a) * 228]], 34, col, null));
  rr(c, -50, -440, 100, 230, 40); fs(c, col, 0);
  line(c, [[10, -410], [30 + Math.sin(-sw) * 60, -250]], 30, col, null);
  circ(c, 10, -500, 72); fs(c, col, 0);
  c.restore();
}

// ---------- décors réutilisables ----------
function buildings(seed, x0, x1, base, hMin, hMax) {
  const out = []; let x = x0, i = 0;
  while (x < x1) {
    const w = 120 + rnd(seed + i) * 130, h = hMin + rnd(seed + i + 50) * (hMax - hMin);
    out.push({ x, w, h, y: base - h, i }); x += w + 6 + rnd(seed + i + 9) * 20; i++;
  }
  return out;
}
function skyline(c, list, body, win, lit) { // lit(bi, wi, wx, wy) -> 0..1
  list.forEach(b => {
    c.fillStyle = body; c.fillRect(b.x, b.y, b.w, b.h + 400);
    rr(c, b.x - 4, b.y - 8, b.w + 8, 14, 3); fs(c, body, 0);
    const cols = Math.max(2, Math.floor(b.w / 46)), rows = Math.floor(b.h / 70);
    const gw = b.w / cols;
    for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
      const wx = b.x + k * gw + gw * .28, wy = b.y + 30 + r * 70;
      const l = lit ? lit(b.i, r * cols + k, wx, wy) : 0;
      c.fillStyle = win; c.fillRect(wx, wy, gw * .44, 36);
      if (l > 0) { c.globalAlpha = l; c.fillStyle = '#F7CF6A'; c.fillRect(wx, wy, gw * .44, 36); c.globalAlpha = 1; }
    }
  });
}
const FAR = buildings(11, -200, 1300, 1500, 300, 760);
const NEAR = buildings(37, -150, 1250, 1560, 180, 520);
const MAP_LIGHTS = Array.from({ length: 700 }, (_, i) => [rnd(i * 3 + 1) * 1500 - 210, rnd(i * 3 + 2) * 2400 - 240, rnd(i * 3 + 5)]);

function window4(c, x, y, w, h, frame = '#6B4A30') {
  rr(c, x - 22, y - 22, w + 44, h + 44, 8); fs(c, frame, 6);
  c.save(); rr(c, x, y, w, h, 2); c.clip();
}
function windowEnd(c, x, y, w, h, frame = '#6B4A30') {
  c.restore();
  c.fillStyle = frame; c.fillRect(x + w / 2 - 9, y, 18, h); c.fillRect(x, y + h / 2 - 9, w, 18);
  rr(c, x, y, w, h, 2); fs(c, null, 6);
  rr(c, x - 40, y + h + 14, w + 80, 26, 6); fs(c, frame, 6);
}
function vignette(c, a = .55) {
  const g = c.createRadialGradient(W / 2, H * .45, H * .25, W / 2, H * .5, H * .75);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`);
  c.fillStyle = g; c.fillRect(0, 0, W, H);
}
function blurFg(c, items) { // éléments flous au premier plan (profondeur de champ)
  c.save(); c.filter = 'blur(18px)';
  items.forEach(([x, y, w, h, col, round]) => { rr(c, x, y, w, h, round ?? 20); fs(c, col, 0); });
  c.filter = 'none'; c.restore();
}


// ---------- HUD ----------
function timerPill(c, x, y, s, val, label) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.font = '700 52px Oswald'; const vw = c.measureText(val).width;
  c.font = '800 19px Montserrat'; c.letterSpacing = '2px'; const lw = c.measureText(label).width; c.letterSpacing = '0px';
  rr(c, 0, 0, 72 + vw + 18 + lw + 30, 76, 38); fs(c, '#17171A', 5, '#C9A227');
  circ(c, 40, 38, 18); c.lineWidth = 5; c.strokeStyle = '#F2E3B0'; c.stroke();
  line(c, [[40, 26], [40, 38], [49, 44]], 4, '#F2E3B0', null);
  text(c, val, 72, 40, '700 52px Oswald', '#fff', 'left');
  text(c, label, 72 + vw + 18, 40, '800 19px Montserrat', '#E8D9A8', 'left', 0, OL, '2px');
  c.restore();
}
function gaugePill(c, x, y, s, label, n, tot, col) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const w = 200 + tot * 40;
  rr(c, 0, 0, w, 70, 35); fs(c, '#17171A', 5, '#C9A227');
  text(c, label, 28, 37, '700 40px Oswald', '#fff', 'left');
  for (let i = 0; i < tot; i++) { rr(c, 196 + i * 40, 18, 32, 34, 8); fs(c, i < n ? col : '#3A3A40', 3, '#0d0d10'); }
  c.restore();
}
function card(c, cx, y, s, label, value, icon, col, badge, bs) {
  c.save(); c.translate(cx, y); c.scale(s, s);
  rr(c, -255, 8, 510, 160, 18); fs(c, 'rgba(0,0,0,.22)', 0);
  rr(c, -260, 0, 520, 160, 18); fs(c, '#FFFFFF', 7);
  text(c, label, 40, 40, '800 26px Montserrat', '#2A2A2A', 'center', 0, OL, '3px');
  icon(c, -170, 100);
  text(c, value, 40, 108, '700 104px Oswald', col);
  if (bs > 0) { c.save(); c.translate(225, 0); c.scale(bs, bs); rr(c, -54, -32, 108, 64, 22); fs(c, '#3B82D6', 0); text(c, badge, 0, 2, '700 40px Oswald', '#fff'); c.restore(); }
  c.restore();
}
const dropIcon = (c, x, y) => { c.beginPath(); c.moveTo(x, y - 58); c.bezierCurveTo(x + 50, y, x + 40, y + 40, x, y + 42); c.bezierCurveTo(x - 40, y + 40, x - 50, y, x, y - 58); fs(c, '#2F72C0', 6); };
const thermoIcon = col => (c, x, y) => { rr(c, x - 16, y - 60, 32, 90, 16); fs(c, '#fff', 6); circ(c, x, y + 36, 26); fs(c, col, 6); c.fillStyle = col; c.fillRect(x - 8, y - 30, 16, 60); };


function subtitles(c, gt) {
  let ch = null, chStart = 0;
  for (let i = 0; i < LINES.length; i++) {
    const L = LINES[i], next = LINES[i + 1];
    L.chunks.forEach((k, j) => {
      const end = j < L.chunks.length - 1 ? L.chunks[j + 1].start : Math.min(L.end + .35, next ? next.start : L.end + .6);
      if (gt >= k.start && gt < end) { ch = k; chStart = k.start; }
    });
  }
  if (!ch) return;
  c.save();
  c.font = '700 96px Oswald'; c.textBaseline = 'middle';
  const words = ch.words.map(w => ({ ...w, w: w.w.toUpperCase() }));
  const space = 26, widths = words.map(w => c.measureText(w.w).width);
  const tot = widths.reduce((a, b) => a + b, 0) + space * (words.length - 1);
  const fit = Math.min(1, 960 / tot);
  const s = (.82 + .18 * back(pr(gt, chStart, chStart + .12))) * fit;
  c.translate(540, 1120); c.scale(s, s);
  let x = -tot / 2;
  words.forEach((w, i) => {
    c.textAlign = 'left';
    c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 18; c.shadowOffsetY = 8;
    c.lineWidth = 16; c.strokeStyle = '#111'; c.lineJoin = 'round'; c.strokeText(w.w, x, 0);
    c.shadowColor = 'transparent';
    c.fillStyle = w.c === 'red' ? '#E53935' : w.c === 'yellow' ? '#F5C518' : '#FFFFFF';
    c.fillText(w.w, x, 0);
    x += widths[i] + space;
  });
  c.restore();
}

window.setup = tl => { TL = tl; CUE = tl.cues; LINES = tl.lines; };
window.renderFrame = gt => {
  const si = TL.scenes.findIndex(s => gt >= s.start && gt < s.end);
  const sc = TL.scenes[si < 0 ? TL.scenes.length - 1 : si];
  const lt = gt - sc.start;
  bx.setTransform(1, 0, 0, 1, 0, 0); bx.filter = 'none'; bx.globalAlpha = 1;
  bx.clearRect(0, 0, W, H);
  bx.save(); SC[sc.id](bx, lt, gt); bx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  // transition d'entrée : zoom + flou de mouvement
  const k = si > 0 ? eo(pr(lt, 0, .32)) : 1;
  ctx.save();
  if (k < 1) { const z = lerp(1.14, 1, k); ctx.filter = `blur(${(1 - k) * 14}px)`; ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); }
  ctx.drawImage(buf, 0, 0); ctx.restore(); ctx.filter = 'none';
  const vg = (EP.vignette || {})[sc.id]; if (vg !== 0) vignette(ctx, vg ?? .4);
  hud(ctx, gt, sc.id);
  if (!EP.hideSubs || !EP.hideSubs(gt)) subtitles(ctx, gt);
};
