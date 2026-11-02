// Accessoires et décors partagés entre épisodes (chargés après engine.js, avant scenes.js).
const chunkAt = (li, k) => LINES[li].chunks[Math.min(k, LINES[li].chunks.length - 1)].start;

// ---------- accessoires ----------
function headlamp(c, x, y, s, f, on, gt) {
  const hx = x + f * s * 52, hy = y - s * 628;
  if (on) {
    c.save(); c.globalCompositeOperation = 'lighter';
    const g = c.createLinearGradient(hx, hy, hx + f * 700 * s, hy + 120 * s);
    g.addColorStop(0, 'rgba(230,240,255,.45)'); g.addColorStop(1, 'rgba(230,240,255,0)');
    c.fillStyle = g; c.beginPath(); c.moveTo(hx, hy); c.lineTo(hx + f * 760 * s, hy - 160 * s); c.lineTo(hx + f * 760 * s, hy + 330 * s); c.closePath(); c.fill();
    c.restore();
  }
  line(c, [[x - f * s * 70, y - s * 640], [hx, hy]], 10 * s, '#3a3a40', null);
  rr(c, hx - 20 * s, hy - 16 * s, 40 * s, 32 * s, 8 * s); fs(c, '#4A4F58', 4 * s);
  circ(c, hx + f * 12 * s, hy, 9 * s); fs(c, on ? '#F4F8FF' : '#8A9099', 0);
}
function candle(c, x, y, s, lit, gt, blowAt) {
  rr(c, x - 22 * s, y - 100 * s, 44 * s, 100 * s, 6 * s); fs(c, '#EFE6D2', 5 * s);
  line(c, [[x, y - 100 * s], [x, y - 114 * s]], 4 * s, '#222', null);
  if (lit > 0) {
    glow(c, x, y - 140 * s, 800 * s * lit, 'rgba(255,170,70,A)', .42 * lit);
    const fl = Math.sin(gt * 20) * 4 * s;
    c.beginPath(); c.moveTo(x, y - 110 * s); c.quadraticCurveTo(x - 24 * s, y - 140 * s, x + fl, y - 182 * s * lit); c.quadraticCurveTo(x + 24 * s, y - 140 * s, x, y - 110 * s); fs(c, '#FFC44D', 0);
    c.beginPath(); c.moveTo(x, y - 112 * s); c.quadraticCurveTo(x - 10 * s, y - 132 * s, x + fl * .5, y - 152 * s * lit); c.quadraticCurveTo(x + 10 * s, y - 132 * s, x, y - 112 * s); fs(c, '#FFF1B8', 0);
  } else if (blowAt !== undefined && gt > blowAt) { // filet de fumée après le souffle
    const a = 1 - pr(gt, blowAt, blowAt + 2.5);
    c.beginPath();
    for (let k = 0; k < 40; k++) { const yy = y - 114 * s - k * 6 * s; const xx = x + Math.sin(k * .3 - gt * 3) * k * .8 * s; k ? c.lineTo(xx, yy) : c.moveTo(xx, yy); }
    c.lineWidth = 5 * s; c.strokeStyle = `rgba(200,205,215,${.6 * a})`; c.stroke();
  }
}
function phone(c, cx, cy, rot, sc, screen) { // téléphone tenu en main, écran dessiné par screen(c, w, h)
  c.save(); c.translate(cx, cy); c.rotate(rot); c.scale(sc, sc);
  rr(c, -205, -390, 410, 780, 62); fs(c, '#141416', 8);
  c.save(); rr(c, -186, -370, 372, 740, 48); c.clip(); c.translate(-186, -370); screen(c, 372, 740); c.restore();
  rr(c, -60, 345, 120, 8, 4); fs(c, 'rgba(255,255,255,.7)', 0);
  c.restore();
}
function toggle(c, x, y, on) {
  rr(c, x, y, 96, 54, 27); fs(c, on > .5 ? '#34C759' : '#5A5F68', 0);
  circ(c, x + 27 + on * 42, y + 27, 22); fs(c, '#fff', 0);
}
function bubble(c, x, y, w, txt, s) {
  if (!s) return;
  c.save(); c.translate(x, y); c.scale(s, s);
  rr(c, 0, -46, w, 92, 30); fs(c, '#3A3D45', 0);
  text(c, txt, 30, 2, '600 34px Montserrat', '#fff', 'left');
  c.restore();
}
function nightRoom(c, wall = '#3E4658', floor = '#262B36') {
  c.fillStyle = wall; c.fillRect(-300, -300, 1700, 1700);
  c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(-300, 1180, 1700, 140);
  c.fillStyle = floor; c.fillRect(-300, 1320, 1700, 900);
}
function tiles(c, col = '#ECEAE6', joint = '#D3D0CA') {
  c.fillStyle = col; c.fillRect(-300, -300, 1700, 1700);
  c.strokeStyle = joint; c.lineWidth = 4;
  for (let r = 0; r < 26; r++) {
    const y = -300 + r * 66; c.beginPath(); c.moveTo(-300, y); c.lineTo(1400, y); c.stroke();
    for (let x = -300 + (r % 2) * 70; x < 1400; x += 140) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 66); c.stroke(); }
  }
}
function forbid(c, x, y, s) {
  if (!s) return;
  c.save(); c.translate(x, y); c.scale(s, s);
  circ(c, 0, 0, 70); c.lineWidth = 18; c.strokeStyle = '#E53935'; c.stroke();
  line(c, [[-48, -48], [48, 48]], 18, '#E53935', null);
  c.restore();
}
function badge(c, x, y, s, label, col = '#E53935', w = 0) {
  if (!s) return;
  c.font = '700 46px Oswald'; const tw = w || c.measureText(label).width + 70;
  c.save(); c.translate(x, y); c.scale(s, s);
  rr(c, -tw / 2, -40, tw, 80, 40); fs(c, col, 5, '#fff');
  text(c, label, 0, 3, '700 46px Oswald', '#fff');
  c.restore();
}
function exteriorNight(c, gt, litWin, dawn = 0) {
  c.fillStyle = grad(c, -200, 1500, dawn ? ['#3A4766', '#8E7E95', '#E3A47E'] : ['#0B1020', '#2A3552']); c.fillRect(-300, -300, 1700, 2600);
  if (!dawn) { circ(c, 860, 260, 60); fs(c, '#DDE3EE', 0); glow(c, 860, 260, 260, 'rgba(200,215,240,A)', .25); }
  skyline(c, FAR, dawn ? '#5A6280' : '#28324A', dawn ? '#4E5672' : '#222B40');
  skyline(c, NEAR, dawn ? '#3C4460' : '#1A2133', dawn ? '#343C55' : '#161C2B');
  rr(c, 420, 450, 260, 1250, 4); fs(c, dawn ? '#454E6A' : '#222A3E', 5, '#0A0D14');
  for (let r = 0; r < 13; r++) for (let k = 0; k < 3; k++) { c.fillStyle = dawn ? '#353D56' : '#161C2A'; c.fillRect(450 + k * 80, 490 + r * 78, 46, 40); }
  if (litWin) { glow(c, 520, 650, 420, 'rgba(255,170,70,A)', .55 * litWin); c.globalAlpha = litWin; c.fillStyle = '#FFB347'; c.fillRect(497, 630, 46, 40); c.globalAlpha = 1; }
  c.fillStyle = dawn ? '#C9CED8' : '#3A4256'; c.fillRect(-300, 1500, 1700, 800);
}

