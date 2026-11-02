// Kit « vie quotidienne » (histoires de super-pouvoirs, mystère…) : décors clairs, camarades, prof, chat de groupe, cartons JOUR N.

const SKY = ['#9FD3F5', '#DDF0FB'];
function dayStreet(c, t, opts = {}) {
  c.fillStyle = grad(c, -300, 1300, opts.sky || SKY); c.fillRect(-300, -300, 1700, 1600);
  [[-120, 520, 300, '#F2B6A0'], [200, 420, 260, '#B8D8A8'], [470, 560, 220, '#F5D58A'], [700, 460, 280, '#A9C4E8'], [990, 540, 260, '#E8B8C8']].forEach(([x, h, w, col], i) => {
    rr(c, x, 1300 - h, w, h, 6); fs(c, col, 0);
    for (let r = 0; r < Math.floor(h / 110); r++) for (let k = 0; k < 2; k++) { rr(c, x + 40 + k * (w / 2), 1300 - h + 40 + r * 110, w / 2 - 80, 60, 6); fs(c, 'rgba(255,255,255,.55)', 0); }
  });
  c.fillStyle = '#9AA3AE'; c.fillRect(-300, 1300, 1700, 80);
  c.fillStyle = '#5C6370'; c.fillRect(-300, 1380, 1700, 900);
  c.setLineDash([60, 40]); line(c, [[-300, 1600], [1400, 1600]], 10, '#F2F2F2', null); c.setLineDash([]);
  if (opts.clouds !== false) for (let i = 0; i < 4; i++) { const x = ((i * 380 + t * 15) % 1600) - 250; [[0, 0, 60], [55, -20, 50], [100, 0, 45]].forEach(([dx, dy, r]) => { circ(c, x + dx, 220 + i * 40 + dy, r); fs(c, 'rgba(255,255,255,.9)', 0); }); }
}
function busStop(c, x, y) {
  line(c, [[x, y], [x, y - 330]], 12, '#5A6270', null);
  circ(c, x, y - 360, 46); fs(c, '#2E7BC4', 6); text(c, 'BUS', x, y - 357, '700 34px Oswald', '#fff');
}
function bus(c, x, y, doorsOpen = 0) {
  rr(c, x, y - 360, 820, 330, 30); fs(c, '#F5B82E', 7);
  for (let i = 0; i < 4; i++) { rr(c, x + 60 + i * 170, y - 320, 140, 120, 10); fs(c, '#BFE3F7', 5); }
  rr(c, x + 720, y - 320, 70 - 50 * doorsOpen, 270, 6); fs(c, '#BFE3F7', 5);
  circ(c, x + 160, y - 20, 55); fs(c, '#2A2A2A', 6); circ(c, x + 640, y - 20, 55); fs(c, '#2A2A2A', 6);
  text(c, '12', x + 60, y - 160, '700 60px Oswald', '#1d1d22', 'left');
}
// Camarade : même style que le héros, couleur de sweat et de cheveux au choix.
function mate(c, x, y, s, hoodie, hair, f = 1, o = {}) {
  c.save(); c.translate(x, y); c.scale(s * f, s);
  [-1, 1].forEach(k => { line(c, [[k * 12, -250], [k * 14 + (o.walk !== undefined ? Math.sin(o.walk) * 20 * k : 0), -6]], 26, '#7D8496', null); rr(c, k * 14 - 16, -18, 50, 22, 10); fs(c, '#15151C', 0); });
  rr(c, -58, -500, 116, 262, 34); fs(c, hoodie, 0);
  line(c, [[10, -465], [o.arm ? 80 : 30, o.arm ? -560 : -300]], 26, hoodie, null);
  circ(c, 8, -565, 78); fs(c, '#0E0E14', 0);
  if (hair) { c.beginPath(); c.arc(8, -580, 82, Math.PI * 1.05, Math.PI * 1.95); c.lineWidth = 26; c.strokeStyle = hair; c.stroke(); }
  const e = o.eyes ?? .1;
  [[22, -569], [58, -569]].forEach(([ex, ey]) => { c.beginPath(); c.ellipse(ex, ey, 11 + e * 6, 17 + e * 9, 0, 0, Math.PI * 2); fs(c, '#fff', 0); });
  if (o.smile) { c.beginPath(); c.arc(40, -535, 18, .2, Math.PI - .2); c.lineWidth = 6; c.strokeStyle = '#fff'; c.stroke(); }
  c.restore();
}
function teacher(c, x, y, s, f = 1) {
  c.save(); c.translate(x, y); c.scale(s * f, s);
  [-1, 1].forEach(k => line(c, [[k * 14, -280], [k * 16, 0]], 28, '#3B4A6B', null));
  rr(c, -66, -560, 132, 290, 30); fs(c, '#8A6E5A', 0);
  c.beginPath(); c.moveTo(0, -550); c.lineTo(-14, -470); c.lineTo(0, -400); c.lineTo(14, -470); c.closePath(); fs(c, '#C0392B', 0);
  circ(c, 8, -630, 80); fs(c, '#0E0E14', 0);
  [[24, -634], [60, -634]].forEach(([ex, ey]) => { circ(c, ex, ey, 14); fs(c, '#fff', 0); circ(c, ex, ey, 20); fs(c, null, 5, '#C9A227'); });
  c.restore();
}
function classroom(c, t, board = '') {
  c.fillStyle = '#F1E4C8'; c.fillRect(-300, -300, 1700, 1700);
  c.fillStyle = '#D9C49A'; c.fillRect(-300, 1180, 1700, 140);
  c.fillStyle = '#B07A4E'; c.fillRect(-300, 1320, 1700, 900);
  rr(c, 160, 300, 760, 420, 12); fs(c, '#2F5D4A', 10, '#8A6446');
  if (board) text(c, board, 540, 510, '700 70px Oswald', '#F2F2F2');
  rr(c, 940, 320, 120, 120, 60); fs(c, '#fff', 6); line(c, [[1000, 380], [1000, 340]], 6, OL, null); line(c, [[1000, 380], [1030, 395]], 6, OL, null);
}
function desk(c, x, y) { rr(c, x - 120, y - 20, 240, 30, 6); fs(c, '#C9A27A', 5); line(c, [[x - 100, y + 10], [x - 100, y + 140]], 10, '#7A5A3A', null); line(c, [[x + 100, y + 10], [x + 100, y + 140]], 10, '#7A5A3A', null); }
function brightRoom(c) {
  c.fillStyle = '#F5E6D3'; c.fillRect(-300, -300, 1700, 1700);
  rr(c, 600, 300, 380, 460, 8); fs(c, '#BFE3F7', 12, '#FFFFFF'); c.fillStyle = '#fff'; c.fillRect(784, 300, 12, 460);
  rr(c, 120, 330, 220, 300, 8); fs(c, '#E8A598', 0); circ(c, 230, 440, 60); fs(c, '#FFD84D', 0);
  c.fillStyle = '#C9A27A'; c.fillRect(-300, 1320, 1700, 900);
  rr(c, 140, 1080, 760, 140, 14); fs(c, '#6FA8DC', 0); rr(c, 160, 1030, 200, 70, 30); fs(c, '#FFFFFF', 0);
  c.fillStyle = '#4F7FAF'; c.fillRect(140, 1220, 760, 100);
}
// Conversation de groupe (style messagerie claire).
function groupChat(c, gt, title, msgs) {
  c.fillStyle = '#DDE6EE'; c.fillRect(0, 0, W, H);
  c.save(); c.translate(540, 1250); c.scale(1.28, 1.28);
  rr(c, -330, -640, 660, 1320, 70); fs(c, '#1d1d22', 0);
  rr(c, -300, -610, 600, 1260, 50); fs(c, '#EFE7DD', 0);
  c.fillStyle = '#1F8A70'; c.fillRect(-300, -560, 600, 150);
  circ(c, -220, -485, 40); fs(c, '#FFFFFF', 0); text(c, '3B', -220, -483, '800 30px Montserrat', '#1F8A70');
  text(c, title, -160, -505, '800 40px Montserrat', '#fff', 'left'); text(c, '28 membres', -160, -458, '600 26px Montserrat', '#CFEDE4', 'left');
  let y = -360;
  msgs.forEach(([who, txt, at, col]) => {
    if (gt < at) return;
    const s = pop(gt, at, .3);
    c.save(); c.translate(-270, y); c.scale(s, s);
    c.font = '700 34px Montserrat'; const words = txt.split(' '), L = []; let cur = '';
    words.forEach(w => { const tst = cur ? cur + ' ' + w : w; if (c.measureText(tst).width > 430) { L.push(cur); cur = w; } else cur = tst; }); L.push(cur);
    const h = 80 + L.length * 44;
    rr(c, 0, 0, 500, h, 22); fs(c, '#FFFFFF', 0);
    text(c, who, 24, 30, '800 26px Montserrat', col || '#C0392B', 'left');
    L.forEach((l, i) => text(c, l, 24, 74 + i * 44, '600 34px Montserrat', '#1d1d22', 'left'));
    c.restore();
    y += h + 26;
  });
  c.restore();
}
// Carton « JOUR N » (plein écran, en début de journée).
function dayCard(c, gt, at, label, sub) {
  const k = pr(gt, at - .05, at + .9); if (k <= 0 || k >= 1) return;
  const a = k < .2 ? k / .2 : k > .8 ? (1 - k) / .2 : 1;
  c.save(); c.globalAlpha = a; c.fillStyle = '#1F4E8C'; c.fillRect(0, 0, W, H);
  const s = pop(gt, at, .35);
  c.translate(540, 900); c.scale(s, s);
  text(c, label, 0, 0, '700 220px Oswald', '#F5C518', 'center', 14);
  if (sub) text(c, sub, 0, 150, '800 44px Montserrat', '#fff', 'center', 0, OL, '4px');
  c.restore();
}
// Effet « temps arrêté » : image bleutée et figée + icône pause.
function freezeFx(c, on, gt) {
  if (!on) return;
  c.save(); c.globalCompositeOperation = 'saturation'; c.fillStyle = 'rgba(120,120,120,.9)'; c.fillRect(0, 0, W, H); c.restore();
  c.fillStyle = 'rgba(70,120,220,.18)'; c.fillRect(0, 0, W, H);
  c.save(); c.globalAlpha = .9; rr(c, 900, 170, 40, 120, 8); fs(c, '#fff', 0); rr(c, 960, 170, 40, 120, 8); fs(c, '#fff', 0); c.restore();
}
function remote(c, x, y, s, glowOn) {
  c.save(); c.translate(x, y); c.scale(s, s);
  rr(c, -45, -110, 90, 220, 26); fs(c, '#3A3F4A', 6);
  if (glowOn) glow(c, 0, -40, 90, 'rgba(255,60,60,A)', .6);
  circ(c, 0, -40, 28); fs(c, '#E53935', 5);
  c.restore();
}
function endAsk(c, gt, at, title, ask) {
  const k = pr(gt, at - .1, at + .15); if (k <= 0) return;
  c.fillStyle = `rgba(16,24,48,${k})`; c.fillRect(0, 0, W, H);
  const s1 = pop(gt, at + .1), s2 = pop(gt, at + .4, .45);
  if (s1) { c.save(); c.translate(540, 760); c.scale(s1, s1); rr(c, -320, -60, 640, 120, 8); fs(c, '#E53935', 0); text(c, title, 0, 4, '700 76px Oswald', '#fff'); c.restore(); }
  if (s2) { c.save(); c.translate(540, 960); c.scale(s2, s2); text(c, ask, 0, 0, '700 70px Oswald', '#F5C518', 'center', 10); text(c, 'DIS-LE EN COMMENTAIRE', 0, 110, '800 40px Montserrat', '#fff'); c.restore(); }
}
