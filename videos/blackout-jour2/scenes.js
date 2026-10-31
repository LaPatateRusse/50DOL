// Blackout général — Jour 2 : scènes, HUD et réglages de l'épisode (moteur : ../engine/engine.js).
const EP = {
  vignette: { frigo: .18, message: 0 },
  hideSubs: gt => gt > CUE.jour3 - .1,
};
const SC = {};
const chunkAt = (li, k) => LINES[li].chunks[Math.min(k, LINES[li].chunks.length - 1)].start;

// ---------- éléments propres à l'épisode ----------
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

// ---------- SCÈNES ----------
SC.porte = (c, lt, gt) => {
  const knocks = [CUE.knock_a, CUE.knock_b];
  let shake = 0;
  knocks.forEach(k => [0, .32, .64].forEach(d => { const q = gt - k - d; if (q > 0 && q < .15) shake += Math.sin(q * 120) * (1 - q / .15) * 10; }));
  const close = gt >= LINES[1].start - .1;
  const zk = close ? eio(pr(gt, LINES[1].start - .1, LINES[1].start + .4)) : 0;
  c.save(); cam(c, lerp(460, 820, zk), lerp(950 + 0, 760, zk), lerp(1.0 + lt * .02, 1.9, zk), shake * .001);
  nightRoom(c);
  // porte d'entrée + lumière du couloir sous la porte
  c.save(); c.translate(shake, 0);
  rr(c, 160, 560, 360, 780, 6); fs(c, '#5C4330', 7);
  rr(c, 205, 610, 270, 300, 6); fs(c, '#6A4E38', 5); rr(c, 205, 960, 270, 330, 6); fs(c, '#6A4E38', 5);
  circ(c, 470, 960, 15); fs(c, '#C9A227', 5);
  c.restore();
  const under = .75 + Math.sin(gt * 9) * .1 + Math.sin(gt * 23) * .05;
  c.fillStyle = `rgba(255,230,170,${under})`; c.fillRect(165, 1334, 350, 10);
  glow(c, 340, 1345, 260, 'rgba(255,220,150,A)', .35 * under);
  // ombres de pieds qui bougent derrière la porte
  [0, 1].forEach(k => { const x = 280 + k * 90 + Math.sin(gt * 1.3 + k) * 18; c.fillStyle = 'rgba(10,8,6,.9)'; c.fillRect(x, 1334, 48, 10); });
  // petite table + bougie (toujours allumée depuis la veille)
  rr(c, 760, 1110, 240, 22, 5); fs(c, '#6B4A30', 6); rr(c, 860, 1132, 26, 190, 4); fs(c, '#5C4330', 6);
  candle(c, 880, 1110, 1, 1, gt);
  drawMax(c, { x: 730, y: 1330, s: .82, f: -1, t: gt, mouthO: gt > CUE.knock_a + .2, front: [.35, .3], back: [.2, .2], shiver: close ? 1 : 0 });
  c.fillStyle = 'rgba(10,18,50,.28)'; c.fillRect(-300, -300, 1700, 2600);
  c.restore();
};

SC.titre = (c, lt, gt) => {
  c.save(); cam(c, 540, 960, lerp(1.0, 1.06, pr(lt, 0, 4)));
  exteriorNight(c, gt, 0);
  snow(c, gt, 110, .85);
  c.restore();
  const s1 = pop(lt, .1), s2 = pop(lt, .3, .45), s3 = pop(lt, .55);
  c.save(); c.translate(540, 300); c.scale(s1, s1);
  rr(c, -300, -58, 600, 116, 6); fs(c, '#E53935', 0); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(-300, 50, 600, 8);
  text(c, 'BLACKOUT GÉNÉRAL', 0, 4, '700 78px Oswald', '#fff'); c.restore();
  c.save(); c.translate(540, 500); c.scale(s2, s2);
  text(c, 'JOUR 2', 6, 10, '700 250px Oswald', '#8C93A3'); text(c, 'JOUR 2', 0, 0, '700 250px Oswald', '#EEF0F4'); c.restore();
  c.save(); c.translate(540, 680); c.scale(s3, s3);
  rr(c, -125, -40, 250, 80, 40); fs(c, '#34373F', 5, '#22252b');
  text(c, '03 H 12', 0, 3, '800 44px Montserrat', '#F5C518', 'center', 0, OL, '4px'); c.restore();
  badge(c, 540, 860, pop(gt, chunkAt(2, 1)), 'NE PAS OUVRIR');
  badge(c, 540, 960, pop(gt, chunkAt(2, 3)), 'NE PAS RÉPONDRE');
};

SC.bougie = (c, lt, gt) => {
  const flash = chunkAt(4, 1) - .05;
  if (gt >= flash) { // flashback : la seule fenêtre allumée hier soir
    const k = pr(gt, flash, flash + 3.5);
    c.save(); cam(c, 540, lerp(820, 900, k), lerp(1.25, 1.1, k));
    exteriorNight(c, gt, 1);
    snow(c, gt, 80, .7, .8, 400);
    c.setLineDash([22, 16]); circ(c, 520, 650, 120 + Math.sin(gt * 5) * 6); c.lineWidth = 8; c.strokeStyle = '#E53935'; c.stroke(); c.setLineDash([]);
    c.restore();
    c.save(); c.filter = 'sepia(.35) saturate(.8)'; c.drawImage(c.canvas, 0, 0); c.restore();
    badge(c, 540, 300, pop(gt, flash + .1), 'HIER SOIR', '#34373F', 300);
    return;
  }
  const blow = CUE.blow;
  const lit = gt < blow ? 1 : 0;
  c.save(); cam(c, 660, 1000, 1.1 + lt * .02);
  nightRoom(c, '#4A4F5E', '#2A2D36');
  window4(c, 90, 330, 380, 520, '#4B3A2E');
  c.fillStyle = grad(c, 330, 850, ['#0E1424', '#26304A']); c.fillRect(90, 330, 380, 520);
  snow(c, gt, 30, .8, .6, 200);
  windowEnd(c, 90, 330, 380, 520, '#4B3A2E');
  rr(c, 300, 1110, 520, 24, 6); fs(c, '#6B4A30', 6); rr(c, 340, 1134, 24, 190, 4); fs(c, '#5C4330', 6); rr(c, 760, 1134, 24, 190, 4); fs(c, '#5C4330', 6);
  candle(c, 560, 1110, 1.1, lit, gt, blow);
  rr(c, 900, 1110, 216, 24, 6); fs(c, '#6B4A30', 6); rr(c, 1080, 830, 24, 490, 6); fs(c, '#6B4A30', 6);
  drawMax(c, { x: 1010, y: 1318, s: .86, f: -1, sit: 1, t: gt, lean: gt > blow - .4 && gt < blow + .4 ? -.25 : -.05, mouthO: Math.abs(gt - blow) < .4, front: [1.45, .15], back: [1.3, .2] });
  // ce que Max possède
  [['💧', 'EAU', 0], ['🥫', 'NOURRITURE', 1], ['🔥', 'CHAUFFAGE', 2]].forEach(([ic, lab, i]) => {
    const s = pop(gt, LINES[3].start + .9 + i * .35); if (!s || gt > blow + .2) return;
    c.save(); c.translate(400 + i * 290, 420); c.scale(s, s);
    rr(c, -125, -55, 250, 110, 20); fs(c, '#fff', 6);
    text(c, lab, 0, 4, '700 42px Oswald', '#1d1d22');
    c.restore();
  });
  c.fillStyle = lit ? 'rgba(10,18,50,.15)' : `rgba(6,10,30,${.55 * pr(gt, blow, blow + .3)})`; c.fillRect(-300, -300, 1700, 2600);
  c.restore();
};

SC.frontale = (c, lt, gt) => {
  const on = gt > CUE.headlamp, cur = eo(pr(gt, CUE.curtains, CUE.curtains + .6));
  c.save(); cam(c, 540, 980, 1.08 + lt * .015);
  nightRoom(c, '#353B4B', '#20242D');
  window4(c, 520, 360, 400, 540, '#4B3A2E');
  c.fillStyle = grad(c, 360, 900, ['#0E1424', '#26304A']); c.fillRect(520, 360, 400, 540);
  snow(c, gt, 30, .8, .6, 500);
  windowEnd(c, 520, 360, 400, 540, '#4B3A2E');
  line(c, [[440, 300], [1000, 300]], 12, '#6B4A30', OL, 6);
  [[0, 1], [1, -1]].forEach(([k, d]) => { // rideaux qui se ferment
    const w = lerp(90, 270, cur), x = k ? 1000 - w : 440;
    rr(c, x, 300, w, 640, 8); fs(c, '#2F4F6F', 6);
    for (let i = 1; i < 4; i++) { c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(x + w * i / 4, 306, 8, 628); }
  });
  drawMax(c, { x: 300, y: 1330, s: .88, f: 1, t: gt, front: [on && gt < CUE.headlamp + .5 ? 2.6 : .4, .3], back: [.25, .2] });
  headlamp(c, 300, 1330, .88, 1, on, gt);
  c.fillStyle = on ? 'rgba(6,10,30,.45)' : 'rgba(6,10,30,.7)'; c.fillRect(-300, -300, 1700, 2600);
  c.restore();
  if (on) { c.save(); c.globalCompositeOperation = 'lighter'; glow(c, 760, 900, 360, 'rgba(200,215,255,A)', .18); c.restore(); }
  forbid(c, 720, 640, pop(gt, chunkAt(5, 4)));
  badge(c, 540, 300, pop(gt, CUE.headlamp), 'LAMPE FRONTALE', '#2EAD5B');
};

SC.aube = (c, lt, gt) => {
  c.save(); cam(c, 540, lerp(1050, 980, pr(lt, 0, 3)), 1.15);
  exteriorNight(c, gt, 0, 1);
  // traces de pas qui partent de l'immeuble
  for (let i = 0; i < 16; i++) { const x = 560 + i * 34 + (i % 2) * 10, y = 1700 - i * 14; c.fillStyle = 'rgba(90,100,120,.55)'; c.beginPath(); c.ellipse(x, y, 10, 5, .3, 0, Math.PI * 2); c.fill(); }
  figure(c, lerp(1060, 1180, pr(lt, 0, 3)), 1520, .32, '#1A1E28', gt * 5, 1);
  figure(c, lerp(980, 1110, pr(lt, 0, 3)), 1515, .3, '#1A1E28', gt * 5 + 1, 1);
  snow(c, gt, 60, .8, .5, 700);
  c.restore();
};

SC.batterie = (c, lt, gt) => {
  c.fillStyle = grad(c, 0, H, ['#22262E', '#2C3038', '#181A1F']); c.fillRect(0, 0, W, H);
  const rise = eo(pr(lt, 0, .45));
  const air = eo(pr(gt, CUE.airplane, CUE.airplane + .25)), dim = eo(pr(gt, CUE.dim, CUE.dim + .8));
  c.save(); cam(c, 540, 900, lerp(1.0, 1.06, pr(lt, 0, 8)), Math.sin(gt * 1.2) * .008);
  c.translate(0, (1 - rise) * 900);
  line(c, [[260, 2100], [470, 1300], [560, 1060]], 120, '#26262c', OL, 10);
  phone(c, 585, 740, -.08, 1, (p, w, h) => {
    p.fillStyle = '#1B1E24'; p.fillRect(0, 0, w, h);
    text(p, '34 %', w / 2, 120, '700 110px Oswald', '#fff');
    rr(p, w / 2 - 80, 190, 160, 64, 12); fs(p, null, 6, '#fff'); rr(p, w / 2 + 82, 210, 12, 24, 4); fs(p, '#fff', 0);
    rr(p, w / 2 - 72, 198, 150 * .34, 48, 8); fs(p, '#F5C518', 0);
    text(p, 'Mode avion', 40, 340, '700 34px Montserrat', '#fff', 'left'); toggle(p, w - 140, 313, air);
    text(p, 'Luminosité', 40, 450, '700 34px Montserrat', '#fff', 'left');
    rr(p, 40, 490, w - 80, 16, 8); fs(p, '#4A4F58', 0); rr(p, 40, 490, (w - 80) * lerp(.85, .08, dim), 16, 8); fs(p, '#fff', 0);
    circ(p, 40 + (w - 80) * lerp(.85, .08, dim), 498, 22); fs(p, '#fff', 0);
    if (air > .5) text(p, '✈', w - 60, 50, '700 40px Montserrat', '#F5C518');
    p.fillStyle = `rgba(0,0,0,${.45 * dim})`; p.fillRect(0, 0, w, h);
  });
  circ(c, 520, 1010, 70); fs(c, '#26262c', 8);
  c.restore();
  const as = pop(gt, CUE.autonomy);
  if (as) {
    const k = pr(gt, CUE.autonomy, CUE.autonomy + .5);
    card(c, 540, 1300, as * .9, 'AUTONOMIE', k < .5 ? '8 H' : '3 JOURS', (p, x, y) => { rr(p, x - 34, y - 50, 68, 100, 12); fs(p, '#7DD36A', 6); rr(p, x - 14, y - 64, 28, 16, 4); fs(p, '#7DD36A', 5); }, '#1d1d22', '', 0);
  }
};

SC.radio = (c, lt, gt) => {
  const on = gt > CUE.radio_on;
  c.save(); cam(c, on ? 620 : 560, on ? 1000 : 1020, lerp(1.05, 1.18, pr(lt, 0, 5)));
  nightRoom(c, '#4A4F5E', '#2A2D36');
  rr(c, 200, 1110, 760, 24, 6); fs(c, '#6B4A30', 6); rr(c, 250, 1134, 24, 190, 4); fs(c, '#5C4330', 6); rr(c, 880, 1134, 24, 190, 4); fs(c, '#5C4330', 6);
  // radio à piles
  line(c, [[760, 920], [880, 700]], 6, '#9AA3AE', OL, 4); circ(c, 880, 700, 8); fs(c, '#9AA3AE', 3);
  rr(c, 560, 910, 330, 200, 22); fs(c, '#8B5E3C', 7);
  rr(c, 585, 935, 150, 150, 14); fs(c, '#3A2A20', 5);
  for (let r = 0; r < 5; r++) for (let k = 0; k < 5; k++) { circ(c, 605 + k * 28, 955 + r * 28, 6); fs(c, '#1d1510', 0); }
  rr(c, 755, 945, 115, 50, 8); fs(c, on ? '#F5C518' : '#5A4A30', 5);
  c.fillStyle = '#C0392B'; c.fillRect(755 + 30 + Math.sin(gt) * 10, 948, 4, 44);
  circ(c, 790, 1050, 22); fs(c, '#C9A227', 5); circ(c, 845, 1050, 22); fs(c, '#C9A227', 5);
  if (on) for (let k = 0; k < 3; k++) { const q = ((gt - CUE.radio_on) * 1.2 + k / 3) % 1; c.globalAlpha = 1 - q; c.beginPath(); c.arc(660, 1010, 140 + q * 180, -1.1, -.3); c.lineWidth = 8; c.strokeStyle = '#F5C518'; c.stroke(); }
  c.globalAlpha = 1;
  drawMax(c, { x: 360, y: 1330, s: .86, f: 1, t: gt, front: [1.3, .5], back: [1.1, .4] });
  headlamp(c, 360, 1330, .86, 1, true, gt);
  c.fillStyle = 'rgba(6,10,30,.35)'; c.fillRect(-300, -300, 1700, 2600);
  c.restore();
  badge(c, 540, 420, pop(gt, CUE.radio_on + .2), 'RADIO À PILES', '#2EAD5B');
};

SC.frigo = (c, lt, gt) => {
  c.save(); cam(c, 540, 900, lerp(1.0, 1.05, pr(lt, 0, 9)));
  c.fillStyle = '#F1EADB'; c.fillRect(-100, -100, 1300, 2200);
  for (let x = -100; x < 1300; x += 54) { c.fillStyle = x % 270 ? '#E5DCC8' : '#DCD1BA'; c.fillRect(x, -100, 3, 2200); }
  for (let y = -100; y < 2100; y += 54) { c.fillStyle = y % 270 ? '#E5DCC8' : '#DCD1BA'; c.fillRect(-100, y, 1300, 3); }
  const hs = pop(lt, .1);
  c.save(); c.translate(540, 200); c.scale(hs, hs);
  text(c, 'PORTES FERMÉES', 0, 0, '700 96px Oswald', '#2A2A2A');
  text(c, 'COMBIEN DE TEMPS RESTE LE FROID ?', 0, 80, '800 30px Montserrat', '#2A2A2A', 'center', 0, OL, '2px');
  c.restore();
  [[290, 'CONGÉLATEUR', CUE.freezer, '48 H', 1, '#3B82D6'], [790, 'FRIGO', CUE.fridge, '4 H', 4 / 48, '#E53935']].forEach(([x, lab, at, val, frac, col]) => {
    const s = pop(gt, at - .9); if (!s) return;
    c.save(); c.translate(x, 570); c.scale(s, s);
    rr(c, -120, -180, 240, 360, 18); fs(c, '#fff', 7);
    c.fillStyle = OL; c.fillRect(-120, -60, 240, 6); rr(c, 80, -150, 14, 70, 6); fs(c, '#AEB6C0', 4); rr(c, 80, -40, 14, 120, 6); fs(c, '#AEB6C0', 4);
    text(c, '❄', 0, -118, '700 60px Montserrat', '#3B82D6');
    text(c, lab, 0, 222, '700 48px Oswald', '#2A2A2A');
    c.restore();
    const k = eo(pr(gt, at, at + .8));
    if (k) {
      rr(c, x - 150, 840, 300, 46, 23); fs(c, '#E2D8C3', 5);
      rr(c, x - 150, 840, Math.max(46, 300 * frac * k), 46, 23); fs(c, col, 5);
      text(c, val, x, 935, '700 84px Oswald', col, 'center', 8, '#F1EADB');
    }
  });
  c.restore();
};

SC.repas = (c, lt, gt) => {
  c.save(); cam(c, 560, 1000, 1.1 + lt * .015);
  tiles(c, '#D9DCE2', '#C3C7CF');
  c.fillStyle = '#9A8F80'; c.fillRect(-300, 1380, 1700, 900);
  // frigo-congélateur, porte du haut ouverte
  rr(c, 560, 380, 380, 1000, 20); fs(c, '#F4F5F7', 7);
  c.fillStyle = OL; c.fillRect(560, 900, 380, 7);
  rr(c, 580, 400, 340, 480, 10); fs(c, '#CED6DE', 5);
  [520, 640, 760].forEach(y => { c.fillStyle = '#AEB6C0'; c.fillRect(580, y, 340, 8); });
  rr(c, 610, 560, 70, 60, 8); fs(c, '#F5C518', 4); rr(c, 720, 670, 90, 90, 10); fs(c, '#7DD36A', 4); rr(c, 830, 690, 60, 70, 8); fs(c, '#E53935', 4);
  c.beginPath(); c.moveTo(560, 380); c.lineTo(470, 420); c.lineTo(470, 860); c.lineTo(560, 900); c.closePath(); fs(c, '#E9EBEE', 7);
  rr(c, 900, 960, 16, 160, 6); fs(c, '#AEB6C0', 4);
  drawMax(c, { x: 330, y: 1388, s: .9, f: 1, t: gt, front: [Math.sin(gt * 6) > 0 ? 2.5 : 2.2, 1.6], back: [.8, .4] });
  rr(c, 330 + 120, 1388 - 640, 40, 46, 8); fs(c, '#F5C518', 4);
  c.fillStyle = 'rgba(10,18,50,.18)'; c.fillRect(-300, -300, 1700, 2600);
  c.restore();
  const s = pop(gt, CUE.no_freezer);
  if (s) { forbid(c, 760, 1180, s); badge(c, 760, 1320, s, 'NE PAS OUVRIR'); }
};

SC.toilettes = (c, lt, gt) => {
  const pour = CUE.pour, fl = CUE.flush;
  const tilt = eio(pr(gt, pour - .4, pour)) * (1 - eio(pr(gt, fl + .3, fl + .8)));
  c.save(); cam(c, 560, 1020, 1.12 + lt * .012);
  tiles(c);
  c.fillStyle = '#BDB6AA'; c.fillRect(-300, 1380, 1700, 900);
  // baignoire (réserve) à droite
  rr(c, 900, 1060, 500, 300, [10, 10, 40, 40]); fs(c, '#F7F7F5', 7);
  c.save(); rr(c, 920, 1080, 480, 260, 30); c.clip(); c.fillStyle = '#4A90D9'; c.fillRect(920, 1150, 480, 200); c.restore();
  // toilettes
  rr(c, 520, 760, 260, 300, 18); fs(c, '#FAFAFA', 7);
  text(c, gt < fl ? 'VIDE' : '', 650, 900, '700 48px Oswald', '#E53935');
  rr(c, 470, 1060, 360, 60, 26); fs(c, '#FAFAFA', 7);
  c.beginPath(); c.moveTo(500, 1110); c.quadraticCurveTo(520, 1260, 600, 1290); c.lineTo(620, 1380); c.lineTo(740, 1380); c.lineTo(760, 1260); c.quadraticCurveTo(800, 1200, 810, 1110); c.closePath(); fs(c, '#FAFAFA', 7);
  if (gt > fl && gt < fl + 2) { // tourbillon
    for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(650, 1100, 40 + k * 22, gt * 8 + k, gt * 8 + k + 2.2); c.lineWidth = 7; c.strokeStyle = '#5FA0E0'; c.stroke(); }
  }
  // seau + jet
  const bx0 = 380, by0 = 880;
  if (tilt > .3 && gt < fl + .2) { c.fillStyle = '#5FA0E0'; c.beginPath(); c.moveTo(bx0 + 110, by0 + 20); c.quadraticCurveTo(620, 950, 640, 1090); c.lineTo(670, 1090); c.quadraticCurveTo(640, 940, bx0 + 120, by0 + 60); c.fill(); }
  c.save(); c.translate(bx0, by0); c.rotate(tilt * .9);
  c.beginPath(); c.moveTo(-60, -60); c.lineTo(60, -60); c.lineTo(46, 70); c.lineTo(-46, 70); c.closePath(); fs(c, '#AEB6C0', 6);
  c.beginPath(); c.ellipse(0, -60, 60, 12, 0, 0, Math.PI * 2); fs(c, '#4A90D9', 5);
  c.restore();
  drawMax(c, { x: 230, y: 1388, s: .9, f: 1, t: gt, lean: .15, front: [1.6 - tilt * .4, -.4], back: [1.4 - tilt * .3, -.3] });
  c.restore();
  const ok = pop(gt, fl + .4);
  if (ok) { c.save(); c.translate(820, 640); c.scale(ok, ok); circ(c, 0, 0, 60); fs(c, '#2EAD5B', 6, '#fff'); line(c, [[-24, 2], [-6, 22], [28, -20]], 12, '#fff', null); c.restore(); }
};

SC.soir = (c, lt, gt) => {
  const vib = CUE.vibrate, l16 = LINES[16].start;
  if (gt >= l16 - .1) { // gros plan : notification
    c.fillStyle = '#0B0E15'; c.fillRect(0, 0, W, H);
    c.save(); cam(c, 540, 900, lerp(1.0, 1.08, pr(gt, l16, l16 + 3)));
    glow(c, 560, 760, 700, 'rgba(120,160,255,A)', .25);
    phone(c, 560, 760, .05, 1, (p, w, h) => {
      p.fillStyle = grad(p, 0, h, ['#1E2A44', '#0E1424']); p.fillRect(0, 0, w, h);
      text(p, '21:47', w / 2, 170, '700 120px Oswald', '#fff');
      const s = pop(gt, l16 + .1);
      if (s) { p.save(); p.translate(w / 2, 330); p.scale(s, s); rr(p, -165, -60, 330, 120, 24); fs(p, 'rgba(240,242,248,.92)', 0);
        text(p, 'VOISIN — 5E ÉTAGE', -140, -24, '800 22px Montserrat', '#1d1d22', 'left'); text(p, '1 nouveau message', -140, 18, '600 24px Montserrat', '#3a3d45', 'left'); p.restore(); }
    });
    c.restore();
    return;
  }
  const shake = gt > vib && gt < vib + 1.1 ? Math.sin(gt * 140) * 5 : 0;
  c.save(); cam(c, 560, 1080, 1.12 + lt * .02);
  nightRoom(c, '#2C3242', '#1B1F28');
  rr(c, 200, 1250, 640, 90, 26); fs(c, '#6E7480', 6); rr(c, 330, 1210, 460, 80, 26); fs(c, '#4F5A7A', 6);
  drawMax(c, { x: 260, y: 1250, s: .78, f: 1, sit: 1, t: gt, front: [1.2, .3], back: [1.0, .3] });
  rr(c, 880 + shake, 1290, 120, 30, 8); fs(c, '#141416', 5);
  if (gt > vib) { glow(c, 940, 1290, 200, 'rgba(140,180,255,A)', .5); rr(c, 888 + shake, 1294, 104, 22, 5); fs(c, '#9CC3FF', 0); }
  c.fillStyle = 'rgba(6,10,30,.4)'; c.fillRect(-300, -300, 1700, 2600);
  c.restore();
};

SC.message = (c, lt, gt) => {
  c.fillStyle = '#08090C'; c.fillRect(0, 0, W, H);
  c.save(); cam(c, 540, lerp(990, 960, pr(lt, 0, 4)), lerp(1.35, 1.45, pr(lt, 0, 4)));
  glow(c, 540, 760, 700, 'rgba(229,57,53,A)', .18 + .1 * pr(lt, 0, 3));
  phone(c, 540, 760, 0, 1.05, (p, w, h) => {
    p.fillStyle = '#121418'; p.fillRect(0, 0, w, h);
    p.fillStyle = '#1C1F25'; p.fillRect(0, 0, w, 120);
    circ(p, 60, 66, 30); fs(p, '#5A5F68', 0); text(p, 'V', 60, 68, '700 30px Oswald', '#fff');
    text(p, 'Voisin — 5e', 110, 66, '700 30px Montserrat', '#fff', 'left');
    const b1 = CUE.bubble1, b2 = CUE.bubble2;
    if (gt < b1) { [0, 1, 2].forEach(k => { circ(p, 60 + k * 26, 220, 9 + Math.sin(gt * 8 + k) * 2); fs(p, '#8A9099', 0); }); }
    bubble(p, 24, 230, 324, 'Je sais que tu as', pop(gt, b1, .3));
    bubble(p, 24, 330, 220, "de l'eau.", pop(gt, b1 + .12, .3));
    if (gt > b1 + .6 && gt < b2) { [0, 1, 2].forEach(k => { circ(p, 60 + k * 26, 440, 9 + Math.sin(gt * 8 + k) * 2); fs(p, '#8A9099', 0); }); }
    bubble(p, 24, 450, 220, 'Ouvre-moi.', pop(gt, b2, .3));
  });
  c.restore();
  vignette(c, .8);
  const k = pr(gt, CUE.jour3 - .1, CUE.jour3 + .15);
  if (k > 0) {
    c.fillStyle = `rgba(8,8,10,${k})`; c.fillRect(0, 0, W, H);
    const s1 = pop(gt, CUE.jour3 + .1), s2 = pop(gt, CUE.jour3 + .3, .45), s3 = pop(gt, CUE.jour3 + .9);
    if (s1) { c.save(); c.translate(540, 700); c.scale(s1, s1); rr(c, -300, -58, 600, 116, 6); fs(c, '#E53935', 0); text(c, 'BLACKOUT GÉNÉRAL', 0, 4, '700 78px Oswald', '#fff'); c.restore(); }
    if (s2) { c.save(); c.translate(540, 900); c.scale(s2, s2); text(c, 'JOUR 3', 6, 10, '700 250px Oswald', '#5A2020'); text(c, 'JOUR 3', 0, 0, '700 250px Oswald', '#EEF0F4'); c.restore(); }
    if (s3) { c.save(); c.globalAlpha = clamp(s3); text(c, 'À SUIVRE…', 540, 1110, '800 44px Montserrat', '#F5C518', 'center', 0, OL, '8px'); c.restore(); }
  }
};

// ---------- HUD ----------
function hud(c, gt, sid) {
  if (sid === 'radio') gaugePill(c, 24, 200, pop(gt, TL.scenes.find(s => s.id === 'radio').start + .2), 'BATTERIE', 2, 6, '#F5C518');
  if (sid === 'toilettes') {
    const v = Math.round(180 - 12 * eo(pr(gt, CUE.pour, CUE.pour + .6)));
    const bs = gt > CUE.pour && gt < CUE.pour + .9 ? pop(gt, CUE.pour, .25) * (1 - pr(gt, CUE.pour + .6, CUE.pour + .9)) : 0;
    card(c, 540, 220, pop(gt, LINES[14].start - .3), 'EAU STOCKÉE', `${v} L`, dropIcon, '#1d1d22', '-12', bs);
  }
}
