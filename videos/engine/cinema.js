// Format « cinéma » (docs/style-cinema.md) : film 16:9 dans la vidéo verticale, bandes noires,
// titre « Partie N » au-dessus, HUD JOUR / compteur dans le cadre, lumière douce, gros plans.
// Les scènes se dessinent dans un repère 1920 × 1080 via stage().
const SW = 1920, SH = 1080, SK = W / SW, BY = (H - SH * SK) / 2; // bande : y 656 → 1264
const HOOD = '#F2A31B', HOOD2 = '#D98A10', SKIN = '#0E0E14', RIM = 'rgba(150,185,255,.8)';

// Dessine draw(c) dans le cadre 16:9 (repère 1920 × 1080), avec vignette et léger grain de lumière.
function stage(c, draw, o = {}) {
  c.save();
  c.beginPath(); c.rect(0, BY, W, SH * SK); c.clip();
  c.translate(0, BY); c.scale(SK, SK);
  c.fillStyle = '#0B0C12'; c.fillRect(0, 0, SW, SH);
  c.save(); draw(c); c.restore();
  const g = c.createRadialGradient(SW / 2, SH / 2, SH * .35, SW / 2, SH / 2, SH * 1.05);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${o.vig ?? .62})`);
  c.fillStyle = g; c.fillRect(0, 0, SW, SH);
  if (o.tint) { c.fillStyle = o.tint; c.fillRect(0, 0, SW, SH); }
  c.restore();
}
// Caméra dans le repère du cadre : centre (cx, cy), zoom z.
function cam2(c, cx, cy, z, rot = 0) { c.translate(SW / 2, SH / 2); c.rotate(rot); c.scale(z, z); c.translate(-cx, -cy); }
// Lent travelling avant pendant la scène (lt = temps local).
const push = (lt, a = 1, b = 1.06, d = 6) => lerp(a, b, eio(clamp(lt / d)));

// ---------- lumière ----------
function cone(c, x, y, w0, w1, h, col = 'rgba(255,236,190,A)', a = .28) {
  const g = c.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, col.replace('A', 0));
  c.beginPath(); c.moveTo(x - w0 / 2, y); c.lineTo(x + w0 / 2, y); c.lineTo(x + w1 / 2, y + h); c.lineTo(x - w1 / 2, y + h); c.closePath();
  c.fillStyle = g; c.fill();
}
function lamp(c, x, y, w = 260) { // néon de plafond
  rr(c, x - w / 2, y - 8, w, 16, 8); fs(c, '#F4F6FF', 0);
  glow(c, x, y, w * .9, 'rgba(230,240,255,A)', .35);
}
function shadow(c, x, y, w) { c.beginPath(); c.ellipse(x, y, w, w * .12, 0, 0, Math.PI * 2); c.fillStyle = 'rgba(0,0,0,.35)'; c.fill(); }

// ---------- personnages ----------
// Gros plan du héros (tête + épaules). o.e : 'n' neutre, 'wide' choqué, 'happy' yeux plissés, 'sad', 'angry', 'side' (regard en coin) ;
// o.sweat (goutte), o.mouth ('o' bouche ronde, 'smile', 'grit' dents serrées), o.look (-1..1), o.col (couleur du sweat)
function face(c, x, y, r, o = {}) {
  const col = o.col || HOOD, col2 = o.col2 || HOOD2;
  c.save(); c.translate(x, y);
  // épaules + capuche
  c.beginPath(); c.moveTo(-r * 2.1, r * 3.2); c.quadraticCurveTo(-r * 2, r * .9, -r * .2, r * .85); c.lineTo(r * .2, r * .85); c.quadraticCurveTo(r * 2, r * .9, r * 2.1, r * 3.2); c.closePath(); fs(c, col, 0);
  c.beginPath(); c.ellipse(0, r * .95, r * .95, r * .32, 0, 0, Math.PI * 2); fs(c, col2, 0);
  line(c, [[-r * .25, r * 1.05], [-r * .3, r * 1.9]], r * .05, '#FFE2A8', null); line(c, [[r * .25, r * 1.05], [r * .3, r * 1.85]], r * .05, '#FFE2A8', null);
  if (o.body) o.body(c, r);
  // tête
  circ(c, 0, 0, r); fs(c, o.skin || SKIN, 0);
  c.beginPath(); c.arc(0, 0, r - r * .03, -1.2, .7); c.lineWidth = r * .06; c.strokeStyle = o.rim || RIM; c.stroke();
  if (o.hair) o.hair(c, r);
  const lx = (o.look || 0) * r * .12, ey = -r * .05, ex = r * .26, e = o.e || 'n', W8 = '#fff';
  c.lineCap = 'round'; c.strokeStyle = W8; c.fillStyle = W8;
  const brow = (k, a, dy = 0) => { c.lineWidth = r * .07; c.beginPath(); c.moveTo(k * ex - r * .17 + lx, ey - r * .33 + dy - k * a * r); c.lineTo(k * ex + r * .17 + lx, ey - r * .33 + dy + k * a * r); c.stroke(); };
  [-1, 1].forEach(k => {
    const cx = k * ex + lx;
    if (e === 'happy') { c.lineWidth = r * .08; c.beginPath(); c.arc(cx, ey + r * .06, r * .13, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); return; }
    const ww = e === 'wide' ? .17 : e === 'side' ? .11 : .12, hh = e === 'wide' ? .23 : e === 'side' ? .09 : .17;
    c.beginPath(); c.ellipse(cx, ey, r * ww, r * hh, 0, 0, Math.PI * 2); c.fill();
    if (e === 'wide' || e === 'side') { c.fillStyle = SKIN; circ(c, cx + (e === 'side' ? k * 0 + r * .05 : 0), ey + r * .02, r * .045); c.fill(); c.fillStyle = W8; }
    if (e === 'sad') brow(k, .12, -r * .02);
    if (e === 'angry') brow(k, -.14, r * .04);
    if (e === 'wide') brow(k, 0, -r * .1);
  });
  c.lineWidth = r * .06;
  if (o.mouth === 'o') { c.beginPath(); c.ellipse(lx, r * .38, r * .07, r * .1, 0, 0, Math.PI * 2); c.stroke(); }
  if (o.mouth === 'smile') { c.beginPath(); c.arc(lx, r * .2, r * .2, .35, Math.PI - .35); c.stroke(); }
  if (o.mouth === 'grit') { rr(c, lx - r * .22, r * .3, r * .44, r * .14, r * .04); c.fill(); c.lineWidth = r * .025; c.strokeStyle = SKIN; c.beginPath(); for (let i = -2; i <= 2; i++) { c.moveTo(lx + i * r * .08, r * .3); c.lineTo(lx + i * r * .08, r * .44); } c.moveTo(lx - r * .22, r * .37); c.lineTo(lx + r * .22, r * .37); c.stroke(); }
  if (o.sweat) { c.beginPath(); c.moveTo(-r * .62, -r * .5); c.quadraticCurveTo(-r * .48, -r * .3, -r * .56, -r * .22); c.quadraticCurveTo(-r * .7, -r * .26, -r * .62, -r * .5); c.fillStyle = '#5FB4FF'; c.fill(); }
  c.restore();
}
// Main en gros plan (gant noir) : x,y = poignet, ang = direction, o.open (doigts écartés), o.point (index tendu), o.sleeve (couleur de la manche)
function hand(c, x, y, s, ang, o = {}) {
  c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s);
  rr(c, -260, -62, 270, 124, 50); fs(c, o.sleeve || HOOD, 0);
  rr(c, -30, -70, 40, 140, 16); fs(c, o.cuff || HOOD2, 0);
  c.beginPath(); c.ellipse(70, 0, 80, 64, 0, 0, Math.PI * 2); fs(c, '#121218', 0);
  const fing = o.point ? [[1, 0, 1.4], [-1, .5, .6], [-1, .9, .55], [-1, 1.25, .5]] : o.open ? [[1, -.55, 1], [1, -.15, 1.1], [1, .2, 1.05], [1, .55, .9]] : [[1, -.3, .7], [1, -.05, .75], [1, .2, .72], [1, .45, .62]];
  fing.forEach(([d, a, L]) => line(c, [[110, a * 50], [110 + d * Math.cos(a * .5) * 95 * L, a * 50 + Math.sin(a * .5) * 95 * L * d]], 30, '#121218', null));
  line(c, [[40, -50], [90, -110]], 30, '#121218', null);
  c.restore();
}

// Inconnu : long manteau gris, chapeau, visage noir, petits yeux blancs. o.smile, o.eyes (0..1), o.arm (bras tendu)
function stranger(c, x, y, s, f = 1, o = {}) {
  c.save(); c.translate(x, y); c.scale(s * f, s);
  [-1, 1].forEach(k => { line(c, [[k * 18, -200], [k * 20, -8]], 24, '#2A2C34', null); rr(c, k * 20 - 18, -20, 56, 22, 10); fs(c, '#0E0E14', 0); });
  c.beginPath(); c.moveTo(-70, -620); c.lineTo(70, -620); c.lineTo(95, -150); c.lineTo(-95, -150); c.closePath(); fs(c, '#6E717D', 0);
  c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(-4, -600, 8, 450);
  [[-14, -560], [-14, -470], [-14, -380]].forEach(([bx, by]) => { circ(c, bx + 26, by, 8); fs(c, '#3A3C44', 0); });
  line(c, [[40, -590], o.arm ? [170, -470] : [70, -360]], 30, '#5E616C', null);
  if (o.arm) { circ(c, 182, -462, 22); fs(c, '#121218', 0); }
  rr(c, -40, -650, 80, 50, 20); fs(c, '#9A9DA8', 0); // col
  circ(c, 0, -720, 82); fs(c, SKIN, 0);
  c.beginPath(); c.arc(0, -720, 79, -1.2, .7); c.lineWidth = 6; c.strokeStyle = 'rgba(200,200,215,.5)'; c.stroke();
  rr(c, -130, -800, 260, 26, 13); fs(c, '#1E1F25', 0); rr(c, -78, -900, 156, 110, [30, 30, 6, 6]); fs(c, '#1E1F25', 0); c.fillStyle = '#7A2A2A'; c.fillRect(-78, -820, 156, 16);
  const e = o.eyes ?? .5;
  [[-4, -728], [36, -728]].forEach(([ex, ey]) => { c.beginPath(); c.ellipse(ex, ey, 9 + e * 4, 5 + e * 9, 0, 0, Math.PI * 2); fs(c, '#F4F4F8', 0); });
  if (o.smile) { c.beginPath(); c.arc(16, -705, 30, .3, Math.PI - .3); c.lineWidth = 6; c.strokeStyle = '#F4F4F8'; c.stroke(); }
  c.restore();
}
// Personnage secondaire en pied (même famille que le héros). o : hair (couleur), long (cheveux longs), bun (chignon), smile, eyes, arm
function npc(c, x, y, s, f, col, o = {}) {
  mate(c, x, y, s, col, null, f, o);
  if (!o.hair && !o.cap) return;
  c.save(); c.translate(x, y); c.scale(s * f, s);
  if (o.hair) { c.beginPath(); c.arc(8, -575, 84, Math.PI * .95, Math.PI * 2.05); c.lineWidth = 30; c.strokeStyle = o.hair; c.stroke(); }
  if (o.long) { rr(c, -78, -590, 40, 170, 20); fs(c, o.hair, 0); }
  if (o.bun) { circ(c, -40, -650, 34); fs(c, o.hair, 0); }
  if (o.cap) { c.beginPath(); c.arc(8, -585, 82, Math.PI, Math.PI * 2); fs(c, o.cap, 0); rr(c, 40, -600, 110, 22, 10); fs(c, o.cap, 0); }
  c.restore();
}

// ---------- décors (repère 1920 × 1080) ----------
function streetNight(c, t, o = {}) {
  c.fillStyle = grad(c, 0, 900, ['#0B1024', '#1A2140', '#232A4A']); c.fillRect(-400, -200, 2800, 1500);
  for (let i = 0; i < 9; i++) {
    const bx = -200 + i * 270, bh = 380 + rnd(i + 3) * 300;
    c.fillStyle = '#121735'; c.fillRect(bx, 820 - bh, 240, bh);
    for (let r = 0; r < 8; r++) for (let k = 0; k < 4; k++) if (rnd(i * 31 + r * 7 + k) > .82 && 820 - bh + 40 + r * 70 < 780) { c.fillStyle = 'rgba(255,214,140,.75)'; c.fillRect(bx + 30 + k * 52, 820 - bh + 40 + r * 70, 26, 36); }
  }
  c.fillStyle = '#1B1E2C'; c.fillRect(-400, 820, 2800, 300); c.fillStyle = '#2B2F40'; c.fillRect(-400, 800, 2800, 40);
  for (let i = 0; i < 12; i++) { c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(-300 + i * 240, 960, 120, 12); }
  if (o.lampX !== undefined) {
    const lx = o.lampX;
    line(c, [[lx, 820], [lx, 200], [lx + 120, 170]], 16, '#2E3240', null);
    rr(c, lx + 90, 165, 90, 26, 10); fs(c, '#FFF3D6', 0);
    cone(c, lx + 135, 190, 80, 620, 640, 'rgba(255,230,170,A)', .3);
    glow(c, lx + 135, 180, 160, 'rgba(255,235,190,A)', .55);
  }
}
function busShelter(c, x, y) {
  c.fillStyle = 'rgba(160,200,255,.12)'; c.fillRect(x, y - 420, 380, 360);
  rr(c, x - 20, y - 440, 420, 30, 6); fs(c, '#3A4054', 0);
  line(c, [[x, y - 420], [x, y]], 12, '#3A4054', null); line(c, [[x + 380, y - 420], [x + 380, y]], 12, '#3A4054', null);
  rr(c, x + 40, y - 120, 300, 26, 8); fs(c, '#4A5068', 0);
  rr(c, x + 250, y - 380, 110, 150, 6); fs(c, '#E8F0FF', 0); text(c, 'BUS', x + 305, y - 340, '800 34px Montserrat', '#2E5BCC'); text(c, 'N12', x + 305, y - 290, '800 30px Montserrat', '#1A1A22');
}
function kitchenNight(c, t, o = {}) { // o.day : cuisine le matin
  c.fillStyle = grad(c, 0, 780, o.day ? ['#C9B49A', '#B9A285'] : ['#2A2230', '#3A2E38']); c.fillRect(-400, -200, 2800, 1100);
  c.fillStyle = o.day ? '#7A5E48' : '#231B22'; c.fillRect(-400, 780, 2800, 500);
  rr(c, 1350, 170, 340, 300, 6); fs(c, o.day ? '#9FD3F5' : '#0E1430', 0);
  if (!o.day) { c.fillStyle = 'rgba(255,214,140,.7)'; [[1390, 230], [1520, 300], [1610, 210]].forEach(([a, b]) => c.fillRect(a, b, 22, 30)); }
  else cone(c, 1520, 320, 340, 900, 700, 'rgba(255,250,220,A)', .25);
  rr(c, 1340, 160, 360, 320, 6); fs(c, null, 14, '#4A3B44'); c.fillStyle = '#4A3B44'; c.fillRect(1515, 160, 10, 320);
  c.fillStyle = '#3F3440'; c.fillRect(120, 380, 520, 400); c.fillStyle = '#4B3F4C'; c.fillRect(120, 380, 520, 30);
  rr(c, 160, 240, 440, 110, 8); fs(c, '#463A47', 0);
  line(c, [[960, -40], [960, 210]], 6, '#18141A', null);
  c.beginPath(); c.moveTo(860, 290); c.lineTo(1060, 290); c.lineTo(1010, 210); c.lineTo(910, 210); c.closePath(); fs(c, '#C9772E', 0);
  if (o.day) return;
  cone(c, 960, 290, 200, 1000, 560, 'rgba(255,200,130,A)', .33);
  glow(c, 960, 300, 260, 'rgba(255,200,130,A)', .5);
}
function table(c, x, y, w) {
  rr(c, x - w / 2, y, w, 34, 8); fs(c, '#6B4630', 0); c.fillStyle = 'rgba(255,200,130,.25)'; c.fillRect(x - w / 2, y, w, 8);
  line(c, [[x - w / 2 + 50, y + 30], [x - w / 2 + 50, y + 260]], 22, '#4A3020', null); line(c, [[x + w / 2 - 50, y + 30], [x + w / 2 - 50, y + 260]], 22, '#4A3020', null);
}
function bedroomNight(c, t, o = {}) {
  c.fillStyle = grad(c, 0, 800, ['#151A33', '#1D2342']); c.fillRect(-400, -200, 2800, 1100);
  c.fillStyle = '#12152A'; c.fillRect(-400, 800, 2800, 400);
  rr(c, 760, 120, 520, 440, 4); fs(c, '#0C1028', 0);
  glow(c, 1150, 220, 160, 'rgba(200,215,255,A)', .5);
  for (let i = 0; i < 16; i++) { c.fillStyle = i % 2 ? 'rgba(40,48,85,.9)' : 'rgba(70,80,125,.9)'; c.fillRect(760, 120 + i * 27.5, 520, 14); }
  rr(c, 750, 110, 540, 460, 4); fs(c, null, 12, '#3A4270');
  cone(c, 1020, 560, 520, 900, 360, 'rgba(170,190,255,A)', .12);
  rr(c, 260, 600, 900, 140, 20); fs(c, '#2B3A7A', 0); rr(c, 270, 560, 220, 80, 30); fs(c, '#D8DCEC', 0);
  rr(c, 220, 520, 40, 300, 8); fs(c, '#3A2A24', 0); c.fillStyle = '#1A1530'; c.fillRect(240, 740, 940, 70);
  rr(c, 1260, 610, 230, 200, 8); fs(c, '#4A3328', 0); circ(c, 1375, 710, 8); fs(c, '#C9A27A', 0);
  rr(c, 1300, 560, 150, 56, 8); fs(c, '#0A0A0E', 0); text(c, o.clock || '23:59', 1375, 590, '700 40px "Roboto Mono"', '#FF3B3B');
  glow(c, 1375, 590, 120, 'rgba(255,60,60,A)', .18);
}
function hallDay(c, t) { // couloir du lycée
  c.fillStyle = grad(c, 0, 800, ['#5C6680', '#6F7994']); c.fillRect(-400, -200, 2800, 1100);
  c.fillStyle = '#3A4054'; c.fillRect(-400, 800, 2800, 400);
  for (let i = 0; i < 14; i++) { rr(c, -100 + i * 160, 300, 150, 500, 6); fs(c, i % 3 === 1 ? '#3F6FB0' : '#4A7BC0', 0); c.fillStyle = 'rgba(0,0,0,.25)'; [0, 1, 2].forEach(k => c.fillRect(-80 + i * 160, 330 + k * 26, 60, 8)); circ(c, -100 + i * 160 + 130, 560, 8); fs(c, '#C9D2E6', 0); }
  [300, 960, 1620].forEach(x => lamp(c, x, 60, 300));
}

// ---------- téléphone en gros plan ----------
// draw(c, w, h) dessine l'écran (repère : coin haut-gauche, w × h). x,y = centre, s = échelle, rot = rotation
function phoneBig(c, x, y, s, rot, draw, o = {}) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  glow(c, 0, 0, 520, 'rgba(160,190,255,A)', .16);
  rr(c, -190, -390, 380, 780, 56); fs(c, '#16161C', 0); rr(c, -190, -390, 380, 780, 56); fs(c, null, 5, o.edge || '#C83A4A');
  rr(c, -172, -372, 344, 744, 44); c.save(); c.clip(); c.translate(-172, -372); draw(c, 344, 744); c.restore();
  rr(c, -50, -360, 100, 26, 13); fs(c, '#000', 0);
  if (o.hand !== false) { rr(c, 178, -60, 40, 130, 20); fs(c, '#121218', 0); rr(c, -218, 20, 40, 110, 20); fs(c, '#121218', 0); } // doigts sur les bords
  c.restore();
}
// Écrans prêts à l'emploi
const scrBank = (amount, label = 'Compte courant', notif) => (c, w, h) => {
  c.fillStyle = '#101218'; c.fillRect(0, 0, w, h);
  text(c, '09:41', 40, 40, '700 20px Montserrat', '#fff', 'left');
  rr(c, 24, 90, 40, 40, 10); fs(c, '#F2A31B', 0); text(c, 'Pigeon Bank', 76, 110, '800 22px Montserrat', '#fff', 'left');
  text(c, label.toUpperCase(), 30, 200, '700 15px Montserrat', '#8A90A6', 'left', 0, OL, '2px');
  c.font = '900 64px Montserrat'; const s = Math.min(1, (w - 50) / c.measureText(amount).width);
  c.save(); c.translate(28, 262); c.scale(s, s); text(c, amount, 0, 0, '900 64px Montserrat', '#fff', 'left'); c.restore();
  [0, 1, 2, 3].forEach(i => { rr(c, 24, 360 + i * 82, w - 48, 66, 14); fs(c, '#1A1D26', 0); rr(c, 40, 375 + i * 82, 36, 36, 18); fs(c, '#2A2E3A', 0); c.fillStyle = '#3A3F4E'; c.fillRect(90, 385 + i * 82, 120, 12); c.fillRect(90, 403 + i * 82, 70, 8); });
  if (notif) notif(c, w, h);
};
// Bannière de notification en haut de l'écran (k = 0..1 apparition) ; title « Titre|montant » : montant aligné à droite
function notifBanner(c, w, k, title, body, col = '#2EBD6B') {
  if (k <= 0) return;
  c.save(); c.translate(0, lerp(-140, 0, eo(clamp(k))));
  rr(c, 14, 52, w - 28, 104, 22); fs(c, 'rgba(235,238,245,.97)', 0);
  rr(c, 30, 72, 44, 44, 12); fs(c, col, 0); text(c, '€', 52, 95, '900 26px Montserrat', '#fff');
  const [t1, t2] = title.split('|');
  text(c, t1, 86, 84, '800 22px Montserrat', '#15161C', 'left'); if (t2) text(c, t2, w - 34, 120, '900 22px Montserrat', col, 'right');
  text(c, body, 86, 120, '600 18px Montserrat', '#3A3D48', 'left');
  c.restore();
}
const scrCall = (name, sub, col = '#5B8BE0') => (c, w, h) => {
  c.fillStyle = grad(c, 0, h, ['#1C2238', '#0D0F18']); c.fillRect(0, 0, w, h);
  circ(c, w / 2, 230, 74); fs(c, col, 0); text(c, name[0], w / 2, 233, '900 64px Montserrat', '#fff');
  text(c, name, w / 2, 350, '800 38px Montserrat', '#fff'); text(c, sub, w / 2, 395, '600 20px Montserrat', '#9AA6D6');
  circ(c, w / 2 - 90, 640, 40); fs(c, '#E5484D', 0); circ(c, w / 2 + 90, 640, 40); fs(c, '#2EBD6B', 0);
};
const scrMsg = (from, msgs, k = 1) => (c, w, h) => {
  c.fillStyle = '#0F1118'; c.fillRect(0, 0, w, h);
  c.fillStyle = '#171A24'; c.fillRect(0, 0, w, 130); circ(c, 60, 92, 26); fs(c, '#555B6E', 0); text(c, from, 100, 92, '800 22px Montserrat', '#fff', 'left');
  msgs.forEach((m, i) => { const a = clamp(k * msgs.length - i); if (a <= 0) return; c.save(); c.globalAlpha = a;
    c.font = '700 34px Montserrat'; const lines = m.split('\n'); const bw = Math.max(...lines.map(l => c.measureText(l).width)) + 44;
    rr(c, 20, 180 + i * 140, bw, 44 + lines.length * 40, 22); fs(c, '#262A36', 0);
    lines.forEach((l, j) => text(c, l, 42, 222 + i * 140 + j * 40, '700 34px Montserrat', '#E8EAF2', 'left')); c.restore(); });
};

// ---------- HUD ----------
// o : part (« Partie 1 »), day, val (texte du compteur), neg (rouge), sub (2e ligne), subIcon(c,x,y), bump (temps du dernier changement), hit (rouge clignotant 2e ligne)
function cinemaHud(c, gt, o) {
  if (o.part) text(c, o.part, W / 2, BY - 100, '700 64px Montserrat', '#FFFFFF');
  if (o.off) return;
  c.save(); c.translate(0, BY); c.scale(SK, SK);
  c.shadowColor = 'rgba(0,0,0,.7)'; c.shadowBlur = 10;
  if (o.day !== undefined) {
    text(c, 'JOUR', 56, 64, '800 30px Montserrat', '#FFFFFF', 'left', 0, OL, '2px');
    const d = pop(gt, o.dayAt ?? -9, .4) || 1;
    c.font = '800 30px Montserrat'; c.letterSpacing = '2px'; const jw = c.measureText('JOUR').width; c.letterSpacing = '0px';
    c.save(); c.translate(56 + jw + 18, 62); c.scale(d, d); text(c, String(o.day), 0, 0, '900 46px Montserrat', '#F5B82E', 'left'); c.restore();
  }
  if (o.val !== undefined) {
    const b = o.bump !== undefined ? pr(gt, o.bump, o.bump + .45) : 1, s = 1 + .35 * Math.sin(Math.PI * b) * (b < 1);
    c.save(); c.translate(SW - 56, 64); c.scale(s, s);
    text(c, o.val, 0, 0, '900 54px Montserrat', o.neg ? '#FF3B30' : '#F5B82E', 'right'); c.restore();
  }
  if (o.sub) {
    const hk = o.hit !== undefined && gt > o.hit && gt < o.hit + 1.6 && Math.floor((gt - o.hit) * 6) % 2 === 0;
    const sx = o.hit !== undefined && gt > o.hit && gt < o.hit + .5 ? Math.sin(gt * 70) * 6 : 0;
    text(c, o.sub, SW - 56 + sx, 130, '800 34px Montserrat', hk ? '#FF3B30' : '#FFFFFF', 'right');
    c.font = '800 34px Montserrat'; const tw = c.measureText(o.sub).width;
    if (o.subIcon) o.subIcon(c, SW - 56 - tw - 34 + sx, 128, hk);
  }
  c.restore();
}
const heartIcon = (c, x, y, red) => { c.save(); c.translate(x, y); c.scale(1.2, 1.2); c.beginPath(); c.moveTo(0, 10); c.bezierCurveTo(-22, -6, -12, -22, 0, -10); c.bezierCurveTo(12, -22, 22, -6, 0, 10); c.fillStyle = red ? '#FF3B30' : '#FF6B8A'; c.fill(); c.restore(); };

// Carton de fin dans le cadre : « À SUIVRE » + « PARTIE N » + question
function cinemaEnd(c, gt, at, next, question) {
  const k = pr(gt, at, at + .2); if (k <= 0) return;
  stage(c, p => {
    p.fillStyle = `rgba(5,6,10,${k})`; p.fillRect(0, 0, SW, SH);
    const a = pop(gt, at + .15), b = pop(gt, at + .5, .45), q = clamp((gt - at - 1) * 3);
    if (a) { p.save(); p.translate(SW / 2, 330); p.scale(a, a); text(p, 'À SUIVRE…', 0, 0, '800 60px Montserrat', '#9AA2BC', 'center', 0, OL, '8px'); p.restore(); }
    if (b) { p.save(); p.translate(SW / 2, 520); p.scale(b, b); text(p, next, 0, 0, '900 170px Montserrat', '#F5B82E'); p.restore(); }
    if (q > 0 && question) { p.globalAlpha = q; text(p, question, SW / 2, 760, '800 54px Montserrat', '#FFFFFF'); }
  }, { vig: .3 });
}
