// Ne réponds pas — Partie 2 (accessoires : ../engine/horreur.js).
const EP = {
  subs: { font: '900 82px Montserrat', y: 360, stroke: 0, space: 24, red: '#FF4B4B' },
  vignette: { sms: .5, fin: .6 },
  hideSubs: gt => gt > CUE.partie3 - .1,
};
const SC = {};

function stairsDown(c, gt, open) {
  c.fillStyle = '#151933'; c.fillRect(-300, -300, 1700, 2600);
  rr(c, 400, 560, 280, 330, 4); fs(c, '#0B0E1E', 0);
  c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(160,180,255,${.25 * open})`; c.fillRect(400, 560, 280 * open, 330); c.restore();
  rr(c, 400 + 280 * open, 560, 280 * (1 - open) + 4, 330, 2); fs(c, '#3A2E3A', 0);
  for (let k = 0; k < 9; k++) { const y = 900 + k * 90, w = 700 - k * 40; rr(c, 540 - w / 2, y, w, 90, 2); fs(c, k % 2 ? '#20264A' : '#252C55', 0); }
  // rampe
  line(c, [[880, 880], [1000, 1700]], 14, '#2E3566', null);
  for (let k = 0; k < 8; k++) line(c, [[890 + k * 15, 900 + k * 100], [890 + k * 15, 980 + k * 100]], 8, '#2E3566', null);
}

SC.escalier = (c, lt, gt) => {
  const hd = eo(pr(gt, CUE.head, CUE.head + 1.2));
  c.save(); cam(c, 540, lerp(1000, 900, pr(lt, 0, 8)), 1.05 + lt * .03);
  stairsDown(c, gt, 1);
  // ombre qui monte marche par marche
  const st = Math.floor(clamp((gt - CUE.step) / .9, 0, 5));
  c.save(); c.globalAlpha = .9; c.fillStyle = '#05060D';
  c.beginPath(); c.moveTo(470, 890); c.lineTo(450 - st * 10, 1700 - st * 80); c.lineTo(620 - st * 10, 1700 - st * 80); c.lineTo(520, 890); c.closePath(); c.fill(); c.restore();
  // tête qui apparaît en bas des marches
  if (hd > 0) { c.save(); c.beginPath(); c.rect(300, 600, 500, 300 + 0); c.clip(); copieur(c, 540, 1600 - hd * 260, .62, { t: gt, turn: 1 }); c.restore(); }
  c.restore();
  dust(c, gt, 30, 3);
};
SC.couloir = (c, lt, gt) => {
  c.save(); cam(c, 540, 980, 1.0 + lt * .03);
  c.fillStyle = '#141833'; c.fillRect(-300, -300, 1700, 2600);
  // couloir en perspective
  c.fillStyle = '#1C2245'; c.beginPath(); c.moveTo(0, 300); c.lineTo(420, 760); c.lineTo(420, 1160); c.lineTo(0, 1700); c.fill();
  c.beginPath(); c.moveTo(1080, 300); c.lineTo(660, 760); c.lineTo(660, 1160); c.lineTo(1080, 1700); c.fill();
  c.fillStyle = '#10142C'; c.fillRect(420, 760, 240, 400);
  c.fillStyle = '#232A52'; c.beginPath(); c.moveTo(0, 1700); c.lineTo(420, 1160); c.lineTo(660, 1160); c.lineTo(1080, 1700); c.fill();
  [[110, 520, 0], [920, 520, 1]].forEach(([x, y, k]) => { c.fillStyle = '#2A3060'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (k ? -110 : 110), y + 110); c.lineTo(x + (k ? -110 : 110), y + 500); c.lineTo(x, y + 640); c.fill(); });
  // ombre de « Mamie » sur le mur du fond… aux doigts trop longs
  const a = pr(lt, .3, 1.5);
  c.save(); c.globalAlpha = .85 * a; c.fillStyle = '#05060D';
  circ(c, 520, 880, 34); c.fill(); circ(c, 548, 852, 18); c.fill();
  c.beginPath(); c.moveTo(480, 910); c.quadraticCurveTo(470, 1000, 470, 1160); c.lineTo(580, 1160); c.quadraticCurveTo(580, 1000, 555, 910); c.fill();
  line(c, [[560, 930], [640, 1010], [655, 1140]], 10, '#05060D', null);
  for (let d = 0; d < 4; d++) line(c, [[655, 1140], [650 + d * 8, 1150 + 40 + Math.sin(gt * 3 + d) * 6]], 4, '#05060D', null);
  c.restore();
  c.restore();
  dust(c, gt, 30, 13);
};
SC.lit = (c, lt, gt) => { // vue depuis le sol, sous le lit
  const hd = eo(pr(gt, CUE.hide - .3, CUE.hide + .8));
  c.fillStyle = '#0D1024'; c.fillRect(0, 0, W, H);
  c.fillStyle = '#1A1F40'; c.fillRect(0, 1180, W, 740);
  c.fillStyle = '#2B3266'; c.fillRect(0, 560, W, 70); // sommier
  for (let k = 0; k < 9; k++) { c.fillStyle = '#20264E'; c.fillRect(k * 130, 630, 20, 30); }
  // fente lumineuse sous la porte au fond
  c.fillStyle = 'rgba(255,225,170,.8)'; c.fillRect(360, 1176, 360, 6); glow(c, 540, 1180, 220, 'rgba(255,220,150,A)', .2);
  c.save(); c.translate(lerp(1400, 900, hd), 1420); c.rotate(-Math.PI / 2);
  kid(c, { x: 0, y: 0, s: .6, f: 1, t: gt, eyes: .9, front: [.2, .1], back: [.1, .1] });
  c.restore();
  c.fillStyle = 'rgba(5,6,14,.55)'; c.fillRect(0, 0, W, 560);
  dust(c, gt, 20, 9);
};
SC.sms = (c, lt, gt) => {
  phoneUI(c, gt, 'Mamie', "chambre d'à côté", [
    ["Ce n'est pas moi. Ne fais aucun bruit. Il copie les voix.", -1],
    ["T'es où ?", CUE.sent, true],
    ["Dans l'armoire de ma chambre.", CUE.reply],
    ["Il ne peut entrer que si tu lui réponds.", chunkAt(6, 2)],
  ]);
};
SC.porte = (c, lt, gt) => { // gros plan sur le bas de la porte, depuis sous le lit
  const sh = eo(pr(gt, CUE.shadow, CUE.shadow + 1.2)), mine = pr(gt, CUE.mine, CUE.mine + .3);
  c.save(); cam(c, 540, 1000, lerp(1.0, 1.25, pr(lt, 0, 10)));
  c.fillStyle = '#0D1024'; c.fillRect(-300, -300, 1700, 2600);
  rr(c, 200, 300, 680, 960, 6); fs(c, '#3A2E3A', 0);
  rr(c, 250, 360, 580, 380, 6); fs(c, '#45374A', 0); rr(c, 250, 790, 580, 380, 6); fs(c, '#45374A', 0);
  c.fillStyle = 'rgba(255,225,170,.85)'; c.fillRect(200, 1262, 680, 12);
  glow(c, 540, 1270, 380, 'rgba(255,220,150,A)', .3);
  if (gt > CUE.stop) [0, 1].forEach(k => { c.fillStyle = '#05060D'; c.fillRect(380 + k * 200, 1262, 90, 12); });
  c.fillStyle = '#1A1F40'; c.fillRect(-300, 1274, 1700, 900);
  if (sh > 0) for (let d = 0; d < 4; d++) { const x = 470 + d * 42; line(c, [[x, 1268], [x - 6, 1268 + 190 * sh], [x - 20, 1300 + 210 * sh]], 12, '#BFC3CE', null); }
  c.restore();
  if (mine > 0) { c.fillStyle = `rgba(255,40,40,${.18 * (1 - pr(gt, CUE.mine + .3, CUE.mine + 1.2))})`; c.fillRect(0, 0, W, H); }
  dust(c, gt, 25, 19);
};
SC.fin = (c, lt, gt) => {
  const kit = LINES[11].start - .1;
  if (gt < kit) { // appel entrant
    const shake = Math.sin(gt * 110) * 5;
    c.fillStyle = '#0D1024'; c.fillRect(0, 0, W, H);
    c.save(); c.translate(540 + shake, 1250); c.scale(1.28, 1.28);
    rr(c, -330, -640, 660, 1320, 70); fs(c, '#0B0E18', 0);
    rr(c, -300, -610, 600, 1260, 50); fs(c, grad(c, -610, 650, ['#2A3466', '#141936']), 0);
    text(c, 'Appel entrant', 0, -430, '600 40px Montserrat', '#AEB8E6');
    circ(c, 0, -250, 110); fs(c, '#5B8BE0', 0); text(c, 'M', 0, -246, '800 110px Montserrat', '#fff');
    text(c, 'Mamie', 0, -60, '800 80px Montserrat', '#fff');
    const p = (gt * 1.5) % 1;
    [[-170, '#FF4B4B'], [170, '#34C759']].forEach(([x, col]) => { circ(c, x, 380, 70 + (x > 0 ? p * 14 : 0)); fs(c, col, 0); });
    line(c, [[-200, 380], [-140, 380]], 14, '#fff', null); line(c, [[150, 360], [190, 400]], 14, '#fff', null);
    c.restore();
    glow(c, 540, 1000, 700, 'rgba(120,160,255,A)', .12);
    [[-1], [1]].forEach(([k]) => { for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(540 + k * 430, 1560 + i * 110, 50, 44, 0, 0, Math.PI * 2); fs(c, '#0E0E14', 0); } });
  } else { // la cuisine : le téléphone de Mamie… dans une main grise
    const lk = gt - kit;
    c.save(); cam(c, 540, 1000, lerp(1.3, 1.0, eo(pr(lk, 0, 3))));
    c.fillStyle = '#121633'; c.fillRect(-300, -300, 1700, 2600);
    rr(c, 640, 300, 360, 360, 6); fs(c, null, 10, '#3A4277'); nightGarden(c, 645, 305, 350, 350, gt);
    rr(c, 100, 1100, 880, 40, 8); fs(c, '#4A3A38', 0); rr(c, 160, 1140, 30, 400, 4); fs(c, '#3A2E2C', 0); rr(c, 890, 1140, 30, 400, 4); fs(c, '#3A2E2C', 0);
    c.fillStyle = '#0B0E20'; c.fillRect(-300, 1540, 1700, 900);
    // téléphone allumé sur la table
    glow(c, 540, 1060, 260, 'rgba(120,160,255,A)', .35);
    rr(c, 490, 1010, 100, 90, 10); fs(c, '#9CC3FF', 0); text(c, 'Toi', 540, 1056, '800 26px Montserrat', '#1d2448');
    // longs doigts gris posés dessus
    const f = eo(pr(lk, 1.0, 2.0));
    for (let d = 0; d < 4; d++) line(c, [[380 + d * 30, 700 - 200 * (1 - f)], [470 + d * 22, 960], [500 + d * 22, 1030]], 12, '#BFC3CE', null);
    c.restore();
    dust(c, gt, 25, 27);
  }
  horrorEnd(c, gt, CUE.partie3, 'NE RÉPONDS PAS', 'PARTIE 3', 'TU DÉCROCHES ?');
};

const PLACES = { escalier: 'ESCALIER', couloir: 'COULOIR', lit: 'SOUS LE LIT', sms: 'SOUS LE LIT', porte: 'SOUS LE LIT', fin: 'SOUS LE LIT' };
function hud(c, gt, sid) {
  if (gt > CUE.partie3 - .1) return;
  horrorHud(c, gt, sid === 'fin' && gt >= LINES[11].start - .1 ? 'CUISINE' : PLACES[sid], '03:01:00');
}
