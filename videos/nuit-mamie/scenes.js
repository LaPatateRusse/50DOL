// Ne réponds pas — Partie 1 (série horreur « Les règles de la nuit ») : scènes, HUD, réglages.
const EP = {
  subs: { font: '900 82px Montserrat', y: 360, stroke: 0, space: 24, red: '#FF4B4B' },
  vignette: { message: .5, message2: .5, fin: .7 },
  hideSubs: gt => gt > CUE.partie2 - .1,
};
const SC = {};
// ---------- SCÈNES ----------
SC.chambre = (c, lt, gt) => {
  const b = CUE.buzz1, glowOn = gt > b;
  c.save(); cam(c, 560, 1000, 1.0 + lt * .012);
  bedroom(c, gt);
  const hand = kid(c, { x: 420, y: 1300, s: .78, f: 1, sit: 1, t: gt, eyes: gt > b ? .3 : 0, look: 1, front: [1.9, .9], back: [.6, .3] });
  // téléphone dans la main
  c.save(); c.translate(420 + hand[0] * .78, 1300 - 250 * .78 + hand[1] * .78);
  const sh = gt > b && gt < b + .9 ? Math.sin(gt * 110) * 5 : 0;
  c.rotate(.4); rr(c, -30 + sh, -55, 60, 100, 12); fs(c, '#F2F4FF', 0); rr(c, -22 + sh, -45, 44, 80, 8); fs(c, glowOn ? '#8FB4FF' : '#2A3050', 0);
  c.restore();
  if (glowOn) glow(c, 520, 900, 300, 'rgba(140,180,255,A)', .25);
  c.restore();
  dust(c, gt);
};
SC.message = (c, lt, gt) => {
  phoneUI(c, gt, 'Mamie', "chambre d'à côté", [["Si tu m'entends t'appeler depuis le jardin…", CUE.msg1], ['surtout, ne réponds pas.', chunkAt(2, 3)]]);
};
SC.lit = (c, lt, gt) => {
  const nm = CUE.name, scared = pr(gt, nm, nm + .4);
  c.save(); cam(c, lerp(560, 640, scared), lerp(980, 900, scared), lerp(1.15, 1.45, eio(scared)));
  bedroom(c, gt);
  kid(c, { x: 420, y: 1300, s: .78, f: 1, sit: 1, t: gt, eyes: scared, look: scared * 2, shake: scared > .5, front: [lerp(1.9, 1.2, scared), .9], back: [.6, .3] });
  if (gt > nm - .3) for (let k = 0; k < 3; k++) { const q = ((gt - nm) * .8 + k / 3) % 1; c.globalAlpha = (1 - q) * .8; c.beginPath(); c.arc(770, 780, 60 + q * 160, Math.PI * .6, Math.PI * 1.3); c.lineWidth = 7; c.strokeStyle = '#FF4B4B'; c.stroke(); }
  c.globalAlpha = 1;
  c.restore();
  dust(c, gt, 40, 7);
};
SC.voix = (c, lt, gt) => {
  const tap = CUE.tap;
  c.save(); cam(c, 540, lerp(900, 980, pr(lt, 0, 6)), 1.05 + lt * .02);
  nightGarden(c, -300, -300, 1700, 1800, gt);
  // façade de la maison avec la fenêtre de ta chambre
  rr(c, 160, 300, 760, 1300, 4); fs(c, '#232A4E', 0);
  for (let y = 330; y < 1600; y += 60) { c.fillStyle = 'rgba(255,255,255,.03)'; c.fillRect(160, y, 760, 4); }
  const sh = gt > tap && gt < tap + 1 ? Math.sin(gt * 90) * 4 : 0;
  rr(c, 340 + sh, 520, 400, 460, 6); fs(c, '#151A33', 12, '#D6DCF0');
  glow(c, 540, 750, 220, 'rgba(140,180,255,A)', .18);
  c.fillStyle = '#D6DCF0'; c.fillRect(535 + sh, 520, 10, 460);
  // longs doigts gris qui apparaissent sous la fenêtre
  const f = eo(pr(gt, tap - 1.2, tap - .2));
  if (f > 0) for (let d = 0; d < 4; d++) { const x = 400 + d * 34; line(c, [[x, 1120], [x + 4, 1120 - 150 * f], [x + 14, 990 - 30 * f]], 12, '#BFC3CE', null); }
  c.fillStyle = '#121734'; c.fillRect(-300, 1350, 1700, 900);
  c.restore();
  dust(c, gt, 30, 21);
};
SC.fenetre = (c, lt, gt) => {
  const rv = CUE.reveal, up = eo(pr(gt, rv, rv + 1.2));
  c.save(); cam(c, lerp(560, 640, up), lerp(1000, 880, up), lerp(1.0, 1.15, up));
  c.fillStyle = NAVY; c.fillRect(-300, -300, 1700, 2600);
  rr(c, 140, 300, 120, 1100, 10); fs(c, '#2E3670', 0);
  const WX = 330, WY = 380, WW = 760, WH = 760;
  c.save(); rr(c, WX, WY, WW, WH, 4); c.clip();
  nightGarden(c, WX, WY, WW, WH, gt);
  // corde à linge
  line(c, [[WX, WY + 420], [WX + WW, WY + 400]], 3, '#9AA0B8', null);
  // créature : cachée derrière le linge puis se redresse
  copieur(c, WX + 220, WY + 760 + lerp(160, 0, up), lerp(.5, .78, up), { t: gt, turn: 0 });
  rr(c, WX + 110, WY + 418, 150, 170, 8); fs(c, '#C63A3A', 0); for (let k = 0; k < 4; k++) { c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(WX + 110 + k * 38, WY + 418, 10, 170); c.fillRect(WX + 110, WY + 450 + k * 36, 150, 8); }
  rr(c, WX + 300, WY + 412, 40, 120, 8); fs(c, '#EDEFF5', 0); rr(c, WX + 345, WY + 412, 40, 120, 8); fs(c, '#EDEFF5', 0);
  rr(c, WX + 500, WY + 405, 110, 220, 8); fs(c, '#4A6AA8', 0);
  c.restore();
  rr(c, WX, WY, WW, WH, 4); fs(c, null, 16, '#D6DCF0'); c.fillStyle = '#D6DCF0'; c.fillRect(WX + WW / 2 - 6, WY, 12, WH); c.fillRect(WX, WY + WH / 2 - 6, WW, 12);
  c.fillStyle = '#2A3060'; c.fillRect(WX - 30, WY + WH, WW + 60, 30);
  c.fillStyle = '#141830'; c.fillRect(-300, 1500, 1700, 900);
  kid(c, { x: 230, y: 1520, s: .82, f: 1, t: gt, eyes: up, walk: gt < LINES[7].end ? gt * 5 : undefined, front: [up > .5 ? 2.4 : 1.2, .5], back: [.4, .2] });
  c.restore();
  dust(c, gt, 40, 33);
};
SC.creature = (c, lt, gt) => {
  const turn = eio(pr(gt, CUE.turn, CUE.turn + 1.6));
  c.save(); cam(c, 560, 540, 1.2 + lt * .05);
  nightGarden(c, -300, -300, 1700, 2200, gt);
  copieur(c, 520, 1500, 1.15, { t: gt, turn });
  c.restore();
  dust(c, gt, 30, 41);
};
SC.message2 = (c, lt, gt) => {
  phoneUI(c, gt, 'Mamie', "chambre d'à côté", [["Si tu m'entends t'appeler depuis le jardin…", -1], ['surtout, ne réponds pas.', -1], ["Ce n'est pas moi.", CUE.msg2], ['Ne fais aucun bruit.', chunkAt(11, 1) + .3], ['Il copie les voix.', chunkAt(11, 2) + .4]], CUE.buzz2);
};
SC.fin = (c, lt, gt) => {
  const cr = CUE.creak, open = eo(pr(gt, cr - .3, cr + 1.5));
  c.save(); cam(c, 540, lerp(950, 1150, pr(lt, 0, 6)), 1.05 + lt * .03);
  c.fillStyle = '#151933'; c.fillRect(-300, -300, 1700, 2600);
  // escalier qui descend vers la porte d'entrée
  for (let k = 0; k < 9; k++) { const y = 900 + k * 90, w = 700 - k * 40; rr(c, 540 - w / 2, y, w, 90, 2); fs(c, k % 2 ? '#20264A' : '#252C55', 0); }
  rr(c, 400, 560, 280, 330, 4); fs(c, '#0B0E1E', 0);
  // porte d'entrée qui s'ouvre : lumière de lune et ombre immense
  c.save(); c.globalCompositeOperation = 'lighter';
  c.fillStyle = `rgba(160,180,255,${.25 * open})`; c.fillRect(400, 560, 280 * open, 330); c.restore();
  if (open > .2) { c.save(); c.globalAlpha = open; c.fillStyle = '#05060D';
    c.beginPath(); c.moveTo(430, 890); c.lineTo(470, 1700); c.lineTo(600, 1700); c.lineTo(470, 890); c.closePath(); c.fill(); c.restore(); }
  rr(c, 400 + 280 * open, 560, 280 * (1 - open) + 4, 330, 2); fs(c, '#3A2E3A', 0);
  kid(c, { x: 300, y: 1750, s: 1.0, f: 1, t: gt, eyes: 1, shake: true, front: [.3, .2], back: [.2, .2] });
  c.restore();
  dust(c, gt, 30, 55);
  vignette(c, .6);
  const k = pr(gt, CUE.partie2 - .1, CUE.partie2 + .15);
  if (k > 0) {
    c.fillStyle = `rgba(6,7,12,${k})`; c.fillRect(0, 0, W, H);
    const s1 = pop(gt, CUE.partie2 + .1), s2 = pop(gt, CUE.partie2 + .35, .45), s3 = pop(gt, CUE.partie2 + .9);
    if (s1) { c.save(); c.translate(540, 700); c.scale(s1, s1); text(c, 'NE RÉPONDS PAS', 0, 0, '900 84px Montserrat', '#FF4B4B'); c.restore(); }
    if (s2) { c.save(); c.translate(540, 880); c.scale(s2, s2); text(c, 'PARTIE 2', 0, 0, '900 170px Montserrat', '#F2F4FF'); c.restore(); }
    if (s3) { c.save(); c.globalAlpha = clamp(s3); text(c, 'TU AURAIS RÉPONDU ?', 540, 1080, '800 48px Montserrat', '#C9D4FF', 'center', 0, OL, '4px'); text(c, 'OUI  /  NON', 540, 1160, '900 64px Montserrat', '#FF4B4B'); c.restore(); }
  }
};

// ---------- HUD : lieu + horodatage ----------
const PLACES = { chambre: 'TA CHAMBRE', message: 'TA CHAMBRE', lit: 'TA CHAMBRE', voix: 'JARDIN', fenetre: 'TA CHAMBRE', creature: 'JARDIN', message2: 'TA CHAMBRE', fin: 'ESCALIER' };
function hud(c, gt, sid) {
  if (gt > CUE.partie2 - .1) return;
  horrorHud(c, gt, PLACES[sid]);
}
