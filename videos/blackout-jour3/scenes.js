// Blackout général — Jour 3 : scènes, HUD et réglages de l'épisode (moteur : ../engine/).
const EP = {
  vignette: { kobe: .18, viande: .18, mot: 0 },
  hideSubs: gt => gt > CUE.jour4 - .1,
};
const SC = {};

// ---------- éléments propres à l'épisode ----------
function entryDoor(c, x, y, shake = 0) { // porte d'entrée vue de l'intérieur
  c.save(); c.translate(shake, 0);
  rr(c, x, y, 360, 780, 6); fs(c, '#5C4330', 7);
  rr(c, x + 45, y + 50, 270, 300, 6); fs(c, '#6A4E38', 5); rr(c, x + 45, y + 400, 270, 330, 6); fs(c, '#6A4E38', 5);
  circ(c, x + 310, y + 400, 15); fs(c, '#C9A227', 5);
  circ(c, x + 180, y + 160, 12); fs(c, '#1d1d22', 4); // judas
  c.restore();
}
function jerrycan(c, x, y, s) {
  if (!s) return;
  c.save(); c.translate(x, y); c.scale(s, s);
  rr(c, -55, -130, 110, 130, 14); fs(c, '#2F72C0', 6);
  rr(c, -25, -160, 50, 34, 8); fs(c, '#2F72C0', 6);
  c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(-40, -80, 80, 8);
  text(c, '10 L', 0, -45, '700 34px Oswald', '#fff');
  c.restore();
}
function person(c, x, y, s, col, f = 1) { // personnage simple (voisin, enfant)
  c.save(); c.translate(x, y); c.scale(s * f, s);
  line(c, [[0, -230], [-12, 0]], 30, '#4A4F5E', OL, 6); line(c, [[8, -230], [24, 0]], 30, '#4A4F5E', OL, 6);
  rr(c, -55, -470, 110, 250, 40); fs(c, col, 6);
  line(c, [[30, -440], [60, -300]], 26, col, OL, 6);
  circ(c, 10, -540, 80); fs(c, '#E9C9A4', 6);
  c.beginPath(); c.arc(10, -555, 82, Math.PI * 1.05, Math.PI * 1.95); fs(c, '#4B3527', 6);
  circ(c, 40, -535, 6); fs(c, OL, 0); line(c, [[24, -560], [50, -556]], 5, OL, null);
  c.restore();
}
function paper(c) {
  c.fillStyle = '#F1EADB'; c.fillRect(-100, -100, 1300, 2200);
  for (let x = -100; x < 1300; x += 54) { c.fillStyle = x % 270 ? '#E5DCC8' : '#DCD1BA'; c.fillRect(x, -100, 3, 2200); }
  for (let y = -100; y < 2100; y += 54) { c.fillStyle = y % 270 ? '#E5DCC8' : '#DCD1BA'; c.fillRect(-100, y, 1300, 3); }
}
function dayRoom(c) { nightRoom(c, '#6E7584', '#454A55'); }
function radioBox(c, x, y, on, gt, t0) {
  line(c, [[x + 200, y + 10], [x + 320, y - 210]], 6, '#9AA3AE', OL, 4);
  rr(c, x, y, 330, 200, 22); fs(c, '#8B5E3C', 7);
  rr(c, x + 25, y + 25, 150, 150, 14); fs(c, '#3A2A20', 5);
  for (let r = 0; r < 5; r++) for (let k = 0; k < 5; k++) { circ(c, x + 45 + k * 28, y + 45 + r * 28, 6); fs(c, '#1d1510', 0); }
  rr(c, x + 195, y + 35, 115, 50, 8); fs(c, on ? '#F5C518' : '#5A4A30', 5);
  circ(c, x + 230, y + 140, 22); fs(c, '#C9A227', 5); circ(c, x + 285, y + 140, 22); fs(c, '#C9A227', 5);
  if (on) for (let k = 0; k < 3; k++) { const q = ((gt - t0) * 1.2 + k / 3) % 1; c.globalAlpha = 1 - q; c.beginPath(); c.arc(x + 100, y + 100, 140 + q * 180, -1.1, -.3); c.lineWidth = 8; c.strokeStyle = '#F5C518'; c.stroke(); }
  c.globalAlpha = 1;
}

// ---------- SCÈNES ----------
SC.porte = (c, lt, gt) => {
  let shake = 0;
  [0, .32, .64].forEach(d => { const q = gt - CUE.knock - d; if (q > 0 && q < .15) shake += Math.sin(q * 120) * (1 - q / .15) * 10; });
  c.save(); cam(c, 440, 950, 1.05 + lt * .04, shake * .001);
  dayRoom(c);
  entryDoor(c, 160, 560, shake);
  c.fillStyle = 'rgba(10,8,6,.85)'; c.fillRect(260 + Math.sin(gt) * 10, 1334, 120, 10);
  // la voix traverse la porte
  for (let k = 0; k < 3; k++) { const q = ((lt * .9) + k / 3) % 1; c.globalAlpha = (1 - q) * .8; c.beginPath(); c.arc(520, 820, 40 + q * 160, -.7, .7); c.lineWidth = 7; c.strokeStyle = '#F5C518'; c.stroke(); }
  c.globalAlpha = 1;
  drawMax(c, { x: 760, y: 1330, s: .84, f: -1, t: gt, shiver: 1, front: [.4, .3], back: [.2, .2] });
  c.fillStyle = 'rgba(10,18,50,.25)'; c.fillRect(-300, -300, 1700, 2600);
  c.restore();
};

SC.tuyaux = (c, lt, gt) => {
  const pw = CUE.pipes;
  c.save(); cam(c, 560, lerp(900, 980, pr(lt, 0, 5)), 1.0 + lt * .015);
  c.fillStyle = '#1E2433'; c.fillRect(-300, -300, 1700, 2600);
  // deux étages en coupe
  [[300, '6E — MAX', '#3A4256'], [900, '5E — VOISIN', '#343B4D']].forEach(([y, lab, col]) => {
    rr(c, 80, y, 920, 560, 6); fs(c, col, 6, '#0F121A');
    c.fillStyle = '#A9A399'; c.fillRect(60, y + 560, 960, 22);
    badge(c, 260, y + 60, 1, lab, '#34373F', 300);
  });
  // conduite
  line(c, [[860, 250], [860, 1500]], 30, '#B98A5A', OL, 8);
  // baignoire chez Max
  rr(c, 380, 640, 400, 180, [8, 8, 40, 40]); fs(c, '#F7F7F5', 6);
  c.fillStyle = '#4A90D9'; c.fillRect(400, 680, 360, 100);
  line(c, [[780, 690], [860, 690]], 16, '#B98A5A', OL, 6);
  // ondes sonores qui descendent le long du tuyau
  if (gt > pw - .5) for (let k = 0; k < 5; k++) {
    const q = ((gt - pw) * .7 + k / 5) % 1, y = lerp(700, 1250, q);
    c.globalAlpha = 1 - q * .5; c.beginPath(); c.arc(860, y, 50, .3, Math.PI - .3); c.lineWidth = 7; c.strokeStyle = '#F5C518'; c.stroke();
  }
  c.globalAlpha = 1;
  drawMax(c, { x: 300, y: 860, s: .5, f: 1, t: gt, lean: .3, front: [1.5, -.1], back: [1.3, -.1] });
  person(c, 720, 1460, .62, '#6B7A8F', 1);
  c.save(); c.translate(790, 1100); circ(c, 0, 0, 34); fs(c, '#F5C518', 5); text(c, '!', 0, 2, '700 46px Oswald', '#1d1d22'); c.restore();
  c.restore();
};

SC.titre = (c, lt, gt) => {
  c.save(); cam(c, 540, 960, lerp(1.0, 1.06, pr(lt, 0, 5)));
  exteriorNight(c, gt, 0, 1);
  snow(c, gt, 110, .85);
  c.restore();
  const s1 = pop(lt, .1), s2 = pop(lt, .3, .45), s3 = pop(lt, .55);
  c.save(); c.translate(540, 300); c.scale(s1, s1);
  rr(c, -300, -58, 600, 116, 6); fs(c, '#E53935', 0); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(-300, 50, 600, 8);
  text(c, 'BLACKOUT GÉNÉRAL', 0, 4, '700 78px Oswald', '#fff'); c.restore();
  c.save(); c.translate(540, 500); c.scale(s2, s2);
  text(c, 'JOUR 3', 6, 10, '700 250px Oswald', '#8C93A3'); text(c, 'JOUR 3', 0, 0, '700 250px Oswald', '#EEF0F4'); c.restore();
  c.save(); c.translate(540, 680); c.scale(s3, s3);
  rr(c, -125, -40, 250, 80, 40); fs(c, '#34373F', 5, '#22252b');
  text(c, '08 H 30', 0, 3, '800 44px Montserrat', '#F5C518', 'center', 0, OL, '4px'); c.restore();
  badge(c, 330, 860, pop(gt, chunkAt(2, 2)), 'OUVRIR ?', '#E53935');
  badge(c, 750, 860, pop(gt, chunkAt(2, 2) + .5), 'OU PAS ?', '#34373F');
};

SC.parler = (c, lt, gt) => {
  c.save(); cam(c, 500, 960, 1.08 + lt * .02);
  dayRoom(c);
  entryDoor(c, 140, 560);
  drawMax(c, { x: 640, y: 1330, s: .86, f: -1, t: gt, lean: -.05, front: [2.2, 1.0], back: [.3, .2] });
  c.restore();
  forbid(c, 320, 700, pop(gt, chunkAt(3, 2)));
  badge(c, 320, 860, pop(gt, chunkAt(3, 2) + .1), 'OUVRIR', '#E53935');
  const ts = pop(gt, CUE.talk);
  if (ts) {
    c.save(); c.translate(720, 520); c.scale(ts, ts);
    rr(c, -190, -70, 380, 140, 40); fs(c, '#fff', 6);
    c.beginPath(); c.moveTo(-40, 66); c.lineTo(-90, 120); c.lineTo(10, 68); fs(c, '#fff', 0);
    text(c, '« Je t\'entends. »', 0, 4, '700 44px Oswald', '#1d1d22');
    c.restore();
    badge(c, 720, 330, ts, 'PARLER = OK', '#2EAD5B');
  }
};

SC.voisin = (c, lt, gt) => {
  c.save(); cam(c, 540, 1000, 1.1 + lt * .02);
  nightRoom(c, '#596173', '#3A3F4B');
  rr(c, 160, 1100, 560, 24, 6); fs(c, '#6B4A30', 6); rr(c, 200, 1124, 24, 200, 4); fs(c, '#5C4330', 6); rr(c, 660, 1124, 24, 200, 4); fs(c, '#5C4330', 6);
  [260, 360, 460].forEach((x, i) => { // bouteilles vides
    rr(c, x, 960, 60, 140, [20, 20, 8, 8]); fs(c, '#DCE8F2', 5); rr(c, x + 15, 935, 30, 28, 6); fs(c, '#9AA3AE', 4);
  });
  person(c, 820, 1340, .78, '#6B7A8F', -1);
  const ks = pop(gt, CUE.child);
  if (ks) { c.save(); c.globalAlpha = clamp(ks); person(c, 640, 1340, .46 * ks, '#C0587A', -1); c.restore(); }
  c.fillStyle = 'rgba(10,18,50,.15)'; c.fillRect(-300, -300, 1700, 2600);
  c.restore();
  card(c, 540, 260, pop(gt, LINES[4].start + .2), "EAU CHEZ LE VOISIN", '0 L', dropIcon, '#E53935', '', 0);
};

SC.palier = (c, lt, gt) => {
  const pc = CUE.place_can;
  const crouch = eio(pr(gt, pc - .8, pc - .2)) * (1 - eio(pr(gt, pc + .4, pc + 1)));
  c.save(); cam(c, 520, 1000, 1.08 + lt * .012);
  c.fillStyle = '#8A8478'; c.fillRect(-300, -300, 1700, 1700);
  c.fillStyle = '#6F6A60'; c.fillRect(-300, 1330, 1700, 900);
  // escalier qui descend à gauche
  for (let k = 0; k < 7; k++) { rr(c, -80 + k * 40, 1000 + k * 50, 300, 50, 2); fs(c, '#9C968A', 4, '#4A463F'); }
  line(c, [[-60, 880], [260, 1230]], 10, '#3A3630', null);
  // porte de Max (côté palier)
  rr(c, 560, 560, 340, 770, 6); fs(c, '#4E3A2A', 7);
  text(c, '6B', 730, 640, '700 44px Oswald', '#D9C49A');
  rr(c, 520, 1300, 420, 34, 8); fs(c, '#7A3B32', 5); // paillasson
  jerrycan(c, 730, 1300, gt > pc ? 1 : 0);
  if (gt < pc + .6) drawMax(c, { x: 470, y: 1335, s: .86, f: 1, t: gt, lean: .55 * crouch, front: [lerp(.3, 1.2, crouch), .2], back: [.2, .2] });
  else { c.save(); c.globalAlpha = 1 - pr(gt, pc + .6, pc + 1); drawMax(c, { x: 640, y: 1335, s: .86, f: -1, t: gt, walk: gt * 9 }); c.restore(); }
  c.restore();
  badge(c, 540, 440, pop(gt, CUE.chk1), '✓ PORTE FERMÉE', '#2EAD5B');
  badge(c, 540, 540, pop(gt, CUE.chk2), '✓ RIEN DIT', '#2EAD5B');
};

SC.kobe = (c, lt, gt) => {
  c.save(); cam(c, 540, 900, lerp(1.0, 1.05, pr(lt, 0, 7)));
  paper(c);
  const hs = pop(lt, .1);
  c.save(); c.translate(540, 230); c.scale(hs, hs);
  text(c, 'SÉISME DE KOBE', 0, 0, '700 96px Oswald', '#2A2A2A');
  text(c, 'JAPON · 1995', 0, 80, '800 32px Montserrat', '#2A2A2A', 'center', 0, OL, '4px');
  c.restore();
  const t0 = chunkAt(8, 3);
  for (let i = 0; i < 10; i++) {
    const s = pop(gt, t0 + i * .12); if (!s) continue;
    const helped = i < 8, x = 170 + (i % 5) * 185, y = 470 + Math.floor(i / 5) * 230;
    const col = gt > CUE.neighbors && helped ? '#2EAD5B' : '#9AA0AA';
    c.save(); c.translate(x, y); c.scale(s, s);
    circ(c, 0, -60, 38); fs(c, col, 6); rr(c, -50, -14, 100, 120, [40, 40, 10, 10]); fs(c, col, 6);
    c.restore();
  }
  const ls = pop(gt, CUE.neighbors);
  if (ls) {
    c.save(); c.translate(540, 895); c.scale(ls, ls);
    rr(c, -400, -48, 800, 96, 18); fs(c, '#2EAD5B', 6);
    text(c, 'LA PLUPART : PAR LEURS VOISINS', 0, 4, '700 50px Oswald', '#fff');
    c.restore();
  }
  c.restore();
};

SC.viande = (c, lt, gt) => {
  c.save(); cam(c, 540, 900, lerp(1.0, 1.05, pr(lt, 0, 11)));
  paper(c);
  const hs = pop(lt, .1);
  c.save(); c.translate(540, 220); c.scale(hs, hs);
  text(c, 'CONGÉLATEUR EN PANNE', 0, 0, '700 92px Oswald', '#2A2A2A');
  c.restore();
  // steak
  const ss = pop(lt, .3);
  if (ss) {
    c.save(); c.translate(330, 500); c.scale(ss, ss);
    c.beginPath(); c.ellipse(0, 0, 170, 120, -.2, 0, Math.PI * 2); fs(c, '#C2505A', 7);
    c.beginPath(); c.ellipse(-20, -10, 120, 80, -.2, 0, Math.PI * 2); fs(c, '#D86A72', 0);
    c.beginPath(); c.ellipse(70, 30, 40, 30, 0, 0, Math.PI * 2); fs(c, '#F2E3D0', 5);
    c.restore();
  }
  // thermomètre + horloge
  const th = pop(gt, CUE.thermo);
  if (th) {
    const k = eo(pr(gt, CUE.thermo, CUE.thermo + 1.5));
    c.save(); c.translate(760, 480); c.scale(th, th);
    rr(c, -26, -170, 52, 260, 26); fs(c, '#fff', 6); circ(c, 0, 110, 46); fs(c, lerp(0, 1, k) > .5 ? '#E53935' : '#3B82D6', 6);
    rr(c, -12, lerp(40, -150, k), 24, lerp(70, 260, k), 10); fs(c, k > .5 ? '#E53935' : '#3B82D6', 0);
    c.restore();
    text(c, k > .5 ? '+ DE 2 H AU CHAUD' : '', 640, 700, '700 50px Oswald', '#E53935');
  }
  const ts = pop(gt, CUE.trash);
  if (ts) {
    c.save(); c.translate(540, 830); c.scale(ts, ts);
    rr(c, -340, -50, 680, 100, 18); fs(c, '#E53935', 6);
    text(c, 'DANS LE DOUTE → POUBELLE', 0, 4, '700 56px Oswald', '#fff');
    c.restore();
  }
  c.restore();
};

SC.conserves = (c, lt, gt) => {
  const op = CUE.can_open;
  c.save(); cam(c, 600, 1000, 1.12 + lt * .02);
  dayRoom(c);
  window4(c, 90, 330, 380, 500, '#4B3A2E');
  c.fillStyle = grad(c, 330, 830, ['#8E98AE', '#C9CED8']); c.fillRect(90, 330, 380, 500);
  snow(c, gt, 30, .8, .6, 800);
  windowEnd(c, 90, 330, 380, 500, '#4B3A2E');
  rr(c, 380, 1110, 520, 24, 6); fs(c, '#6B4A30', 6); rr(c, 420, 1134, 24, 190, 4); fs(c, '#5C4330', 6); rr(c, 840, 1134, 24, 190, 4); fs(c, '#5C4330', 6);
  [[480, 0], [560, 1], [700, 2]].forEach(([x, i]) => { // conserves
    rr(c, x, 1010, 70, 100, 8); fs(c, ['#C0392B', '#2E86C1', '#D4AC0D'][i], 5);
    c.fillStyle = '#E8E8E8'; c.fillRect(x, 1040, 70, 36);
  });
  if (gt > op) { c.beginPath(); c.ellipse(735, 1010, 35, 8, 0, 0, Math.PI * 2); fs(c, '#AEB6C0', 4); }
  rr(c, 900, 1110, 216, 24, 6); fs(c, '#6B4A30', 6); rr(c, 1080, 830, 24, 490, 6); fs(c, '#6B4A30', 6);
  drawMax(c, { x: 1010, y: 1318, s: .86, f: -1, sit: 1, t: gt, front: [Math.sin(gt * 5) > 0 ? 2.4 : 2.1, 1.4], back: [1.3, .2] });
  c.restore();
  badge(c, 540, 330, pop(gt, chunkAt(11, 2)), 'SE MANGE FROID', '#2EAD5B');
};

SC.radio = (c, lt, gt) => {
  if (gt >= CUE.map - .2) { // carte : trajet jusqu'au gymnase
    const k = eo(pr(gt, CUE.map, CUE.map + 1.4));
    c.save(); cam(c, 540, 980, lerp(1.1, 1.0, pr(gt, CUE.map - .2, CUE.map + 2)));
    c.fillStyle = '#14171B'; c.fillRect(-300, -300, 1700, 2600);
    c.save(); c.translate(540, 960); c.rotate(.2);
    for (let i = -12; i <= 12; i++) { c.fillStyle = '#2B3038'; c.fillRect(i * 150 - 9, -1600, 18, 3200); c.fillRect(-1600, i * 150 - 9, 3200, 18); }
    c.restore();
    const A = [300, 1300], B = [780, 560];
    c.setLineDash([24, 18]); c.lineDashOffset = -gt * 60;
    c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(lerp(A[0], 300, k), lerp(A[1], 800, k)); if (k > .5) c.lineTo(lerp(300, B[0], (k - .5) * 2), lerp(800, B[1], (k - .5) * 2));
    c.lineWidth = 10; c.strokeStyle = '#fff'; c.stroke(); c.setLineDash([]);
    circ(c, A[0], A[1], 20); fs(c, '#2EAD5B', 6, '#fff');
    badge(c, A[0], A[1] + 80, 1, 'IMMEUBLE DE MAX', '#2EAD5B');
    const ps = pop(gt, CUE.map + .8);
    if (ps) { circ(c, B[0], B[1], 22 * ps); fs(c, '#3B82D6', 6, '#fff'); badge(c, B[0], B[1] - 90, ps, 'GYMNASE — 2 KM', '#3B82D6'); }
    c.restore();
    return;
  }
  c.save(); cam(c, 620, 1000, lerp(1.05, 1.18, pr(lt, 0, 4)));
  dayRoom(c);
  rr(c, 200, 1110, 760, 24, 6); fs(c, '#6B4A30', 6); rr(c, 250, 1134, 24, 190, 4); fs(c, '#5C4330', 6); rr(c, 880, 1134, 24, 190, 4); fs(c, '#5C4330', 6);
  radioBox(c, 560, 910, gt > CUE.radio_on, gt, CUE.radio_on);
  drawMax(c, { x: 360, y: 1330, s: .86, f: 1, t: gt, front: [1.3, .5], back: [1.1, .4] });
  c.restore();
  badge(c, 540, 420, pop(gt, chunkAt(12, 1)), "DISTRIBUTION D'EAU", '#3B82D6');
};

SC.sortie = (c, lt, gt) => {
  const zk = eio(pr(lt, 1.2, 3.5));
  c.save(); cam(c, lerp(560, 640, zk), lerp(1000, 760, zk), lerp(1.05, 1.7, zk));
  dayRoom(c);
  entryDoor(c, 160, 560);
  drawMax(c, { x: 660, y: 1330, s: .86, f: -1, t: gt, front: [.6, .4], back: [.3, .2] });
  headlamp(c, 660, 1330, .86, -1, false, gt);
  c.fillStyle = `rgba(10,18,50,${.15 + .25 * zk})`; c.fillRect(-300, -300, 1700, 2600);
  c.restore();
  vignette(c, .3 + .4 * zk);
};

SC.palier2 = (c, lt, gt) => {
  const op = eo(pr(gt, CUE.door_open, CUE.door_open + .9));
  c.save(); cam(c, 540, lerp(980, 1150, eio(pr(gt, CUE.can_gone - .3, CUE.can_gone + .6))), lerp(1.0, 1.3, eio(pr(gt, CUE.can_gone - .3, CUE.can_gone + .6))));
  dayRoom(c);
  // encadrement + palier visible quand la porte s'ouvre
  rr(c, 300, 520, 480, 830, 4); fs(c, '#3E3A34', 8);
  c.save(); rr(c, 310, 530, 460, 810, 2); c.clip();
  c.fillStyle = '#5E5A52'; c.fillRect(310, 530, 460, 810);
  c.fillStyle = '#4A463F'; c.fillRect(310, 1180, 460, 160);
  rr(c, 340, 1290, 400, 34, 8); fs(c, '#7A3B32', 5);
  if (gt > CUE.can_gone) { // emplacement vide du bidon
    c.setLineDash([12, 10]); rr(c, 485, 1160, 110, 130, 14); c.lineWidth = 5; c.strokeStyle = 'rgba(255,255,255,.6)'; c.stroke(); c.setLineDash([]);
    text(c, '?', 540, 1225, '700 80px Oswald', '#F5C518', 'center', 8);
  }
  const ns = pop(gt, CUE.note);
  if (ns) { c.save(); c.translate(640, 1300); c.rotate(-.15); c.scale(ns, ns); rr(c, -50, -30, 100, 60, 4); fs(c, '#FFF8E1', 4); line(c, [[-30, -8], [30, -8]], 3, '#5A6B8C', null); line(c, [[-30, 8], [20, 8]], 3, '#5A6B8C', null); c.restore(); }
  c.restore();
  // la porte pivote (vue de face, sa largeur diminue)
  const w = 460 * (1 - op * .85);
  rr(c, 310, 530, w, 810, 4); fs(c, '#5C4330', 7);
  if (w > 120) { circ(c, 310 + w - 40, 940, 15); fs(c, '#C9A227', 5); }
  c.restore();
};

SC.mot = (c, lt, gt) => {
  c.fillStyle = '#2B2925'; c.fillRect(0, 0, W, H);
  c.save(); cam(c, 540, 900, lerp(1.0, 1.08, pr(lt, 0, 4)), -.04);
  rr(c, 110, 280, 860, 760, 10); fs(c, '#FFF8E1', 8);
  for (let y = 380; y < 1020; y += 80) { c.fillStyle = '#C9D6EA'; c.fillRect(140, y, 800, 3); }
  const ink = '#24365E';
  const lines = [['Merci.', chunkAt(16, 0)], ['Mais fais attention…', chunkAt(16, 0) + .7], ["ils t'attendent", chunkAt(16, 1)], ['en bas.', chunkAt(16, 2)]];
  lines.forEach(([t, at], i) => {
    const a = pr(gt, at, at + .35); if (!a) return;
    c.save(); c.globalAlpha = a; c.translate(160, 420 + i * 150); c.rotate(-.02 + (i % 2) * .015);
    text(c, t, 0, 0, i === 3 ? '800 78px Montserrat' : '700 58px Montserrat', i === 3 ? '#B3261E' : ink, 'left');
    c.restore();
  });
  c.restore();
  vignette(c, .7);
  const k = pr(gt, CUE.jour4 - .1, CUE.jour4 + .15);
  if (k > 0) {
    c.fillStyle = `rgba(8,8,10,${k})`; c.fillRect(0, 0, W, H);
    const s1 = pop(gt, CUE.jour4 + .1), s2 = pop(gt, CUE.jour4 + .3, .45), s3 = pop(gt, CUE.jour4 + .9);
    if (s1) { c.save(); c.translate(540, 700); c.scale(s1, s1); rr(c, -300, -58, 600, 116, 6); fs(c, '#E53935', 0); text(c, 'BLACKOUT GÉNÉRAL', 0, 4, '700 78px Oswald', '#fff'); c.restore(); }
    if (s2) { c.save(); c.translate(540, 900); c.scale(s2, s2); text(c, 'JOUR 4', 6, 10, '700 250px Oswald', '#5A2020'); text(c, 'JOUR 4', 0, 0, '700 250px Oswald', '#EEF0F4'); c.restore(); }
    if (s3) { c.save(); c.globalAlpha = clamp(s3); text(c, 'À SUIVRE…', 540, 1110, '800 44px Montserrat', '#F5C518', 'center', 0, OL, '8px'); c.restore(); }
  }
};

// ---------- HUD ----------
function hud(c, gt, sid) {
  if (sid === 'palier') {
    const pc = CUE.place_can;
    const v = Math.round(168 - 10 * eo(pr(gt, pc, pc + .6)));
    const bs = gt > pc && gt < pc + .9 ? pop(gt, pc, .25) * (1 - pr(gt, pc + .6, pc + .9)) : 0;
    card(c, 540, 190, pop(gt, LINES[6].start), 'EAU STOCKÉE', `${v} L`, dropIcon, '#1d1d22', '-10', bs);
  }
  if (sid === 'radio' || sid === 'sortie') gaugePill(c, 24, 200, pop(gt, TL.scenes.find(s => s.id === 'radio').start + .2), 'BATTERIE', 2, 6, '#F5C518');
}
