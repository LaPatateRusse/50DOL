// Le GPS — horreur complète en 1 partie (19:15), style cinéma (cinema.js + cinema-rig.js). Histoire originale.
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const SIS = '#5B6FB0', SIS2 = '#4A5C96', GHOST = '#ECEAE4';

const sisHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); c.fillStyle = '#2A1A12';
  c.beginPath(); c.arc(0, 0, r * 1.07, Math.PI * .95, Math.PI * 2.05); c.quadraticCurveTo(r * .4, -r * .62, -r * .1, -r * .6); c.quadraticCurveTo(-r * .8, -r * .5, -r * 1.07, 0); c.closePath(); c.fill();
  rr(c, -r * 1.12, -r * .1, r * .32, r * 1.25, r * .16); c.fill(); c.restore(); };
const kidHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .05, r * 1.04, Math.PI * 1.05, Math.PI * 1.95); c.quadraticCurveTo(r * .5, -r * .7, 0, -r * .62); c.quadraticCurveTo(-r * .6, -r * .72, -r * 1.0, -r * .3); c.closePath(); fs(c, '#4A2E1E', 0); c.restore(); };

// ---------- accessoires ----------
// écran du GPS ; o.msg (texte du haut), o.km, o.noRoad (voiture dans le vide), o.off, o.hist
function gps(c, x, y, s, gt, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  rr(c, -230, -150, 460, 300, 26); fs(c, '#1A1A20', 0); rr(c, -205, -125, 410, 250, 12);
  if (o.off) { fs(c, '#050508', 0); c.restore(); return; }
  fs(c, o.hist ? '#E8ECF2' : '#2A3446', 0);
  if (o.hist) {
    c.fillStyle = '#3A4A6A'; c.fillRect(-205, -125, 410, 50); text(c, 'HISTORIQUE', 0, -98, '800 26px Montserrat', '#FFFFFF');
    text(c, '1 TRAJET', 0, -40, '900 34px Montserrat', '#1A1A20');
    text(c, '14/11/2016 · 23:58', 0, 10, '700 28px "Roboto Mono"', '#3A3A48');
    text(c, 'ARRÊT : BORD DE LA FORÊT', 0, 62, '800 24px Montserrat', '#C0303A');
    c.restore(); return;
  }
  c.save(); c.beginPath(); c.rect(-205, -125, 410, 250); c.clip();
  if (!o.noRoad) { line(c, [[-60, 140], [-20, -20], [140, -140]], 26, '#8A96B0', null); line(c, [[-60, 140], [-20, -20], [140, -140]], 12, '#3A8AF0', null); }
  else { for (let i = 0; i < 6; i++) { circ(c, -150 + i * 60, -60 + (i % 2) * 70, 20); fs(c, 'rgba(60,90,60,.6)', 0); } }
  c.beginPath(); c.moveTo(-20, 30); c.lineTo(-44, 80); c.lineTo(-20, 66); c.lineTo(4, 80); c.closePath(); fs(c, '#FFFFFF', 0);
  if (o.msg) { c.fillStyle = 'rgba(10,14,24,.85)'; c.fillRect(-205, -125, 410, 60); text(c, o.msg, 0, -94, '800 26px Montserrat', o.red ? '#FF5A5A' : '#FFFFFF'); }
  if (o.km) { c.fillStyle = 'rgba(10,14,24,.85)'; c.fillRect(-205, 75, 410, 50); text(c, o.km, 0, 101, '800 28px "Roboto Mono"', '#9FE0A0'); }
  c.restore();
  glow(c, 0, 0, 300, 'rgba(120,170,255,A)', .18);
  c.restore();
}
function ghost(p, x, y, s, gt, o = {}) {
  p.save(); p.translate(x, y); p.scale(s, s);
  p.beginPath(); p.moveTo(-70, -330); p.lineTo(70, -330); p.lineTo(110, 0); p.lineTo(-110, 0); p.closePath(); fs(p, GHOST, 0);
  line(p, [[50, -310], o.wave ? [150, -460 + Math.sin(gt * 5) * 20] : [90, -160]], 26, GHOST, null);
  line(p, [[-50, -310], [-90, -160]], 26, GHOST, null);
  p.beginPath(); p.ellipse(0, -400, 86, 112, 0, 0, Math.PI * 2); fs(p, '#1A1210', 0);
  rr(p, -86, -400, 172, 150, 30); fs(p, '#1A1210', 0);
  if (!o.back) { p.beginPath(); p.ellipse(0, -392, 56, 74, 0, 0, Math.PI * 2); fs(p, GHOST, 0);
    if (!o.noFace) [-20, 20].forEach(ex => { p.beginPath(); p.ellipse(ex, -398, 8, 11, 0, 0, Math.PI * 2); fs(p, '#0A0A0E', 0); }); }
  p.restore();
  glow(p, x, y - 200 * s, 260 * s, 'rgba(230,235,255,A)', .2);
}
function forest(p, gt, speed = 1) {
  p.fillStyle = grad(p, 0, 700, ['#04050A', '#0A0E18']); p.fillRect(-400, -200, 2800, 1400);
  for (let i = 0; i < 40; i++) { const x = ((i * 173 - gt * 120 * speed * (i % 3 + 1)) % 2800 + 2800) % 2800 - 400; const h = 300 + (i * 37) % 240;
    p.beginPath(); p.moveTo(x, 760 - h); p.lineTo(x - 70, 760); p.lineTo(x + 70, 760); p.closePath(); fs(p, i % 2 ? '#0E1610' : '#121C14', 0); }
  p.fillStyle = '#0C0D12'; p.fillRect(-400, 760, 2800, 500);
  p.beginPath(); p.moveTo(860, 760); p.lineTo(1060, 760); p.lineTo(1700, 1200); p.lineTo(220, 1200); p.closePath(); fs(p, '#1C1E26', 0);
  for (let i = 0; i < 6; i++) { const k = ((i / 6 + gt * .5 * speed) % 1), y = 770 + k * k * 430; line(p, [[960, y], [960, y + 10 + k * 60]], 4 + k * 14, 'rgba(240,240,220,.8)', null); }
  cone(p, 960, 1200, 900, 160, 460, 'rgba(255,245,210,A)', .16);
}
function carInside(p, gt, road = true) {
  p.fillStyle = '#05060A'; p.fillRect(-400, -200, 2800, 1400);
  p.save(); p.beginPath(); p.moveTo(160, 120); p.lineTo(1760, 120); p.lineTo(1900, 600); p.lineTo(20, 600); p.closePath(); p.clip();
  if (road) { p.save(); p.translate(960, 380); p.scale(.6, .6); p.translate(-960, -760); forest(p, gt); p.restore(); }
  p.restore();
  p.fillStyle = '#0E0F14'; p.fillRect(-400, 600, 2800, 700);
  rr(p, -100, 590, 2120, 40, 16); fs(p, '#16171E', 0);
}
function house(p, gt) {
  p.fillStyle = grad(p, 0, 760, ['#06070E', '#101626']); p.fillRect(-400, -200, 2800, 1400);
  rr(p, 600, 360, 760, 420, 6); fs(p, '#2A2E3A', 0); p.beginPath(); p.moveTo(560, 370); p.lineTo(980, 140); p.lineTo(1400, 370); p.closePath(); fs(p, '#1E2028', 0);
  rr(p, 700, 460, 160, 140, 6); fs(p, '#F2C46A', 0); glow(p, 780, 530, 220, 'rgba(255,200,120,A)', .4);
  rr(p, 920, 560, 120, 220, 6); fs(p, '#3A2A20', 0);
  p.fillStyle = '#0C0D12'; p.fillRect(-400, 780, 2800, 500);
}
function finCard(c, gt, t0, q) {
  const k = pr(gt, t0, t0 + .2); if (k <= 0) return;
  stage(c, p => {
    p.fillStyle = `rgba(5,6,10,${k})`; p.fillRect(0, 0, SW, SH);
    const b = pop(gt, t0 + .15, .45), qq = clamp((gt - t0 - .8) * 3);
    if (b) { p.save(); p.translate(SW / 2, 430); p.scale(b, b); text(p, 'FIN', 0, 0, '900 190px Montserrat', '#FF4B4B'); p.restore(); }
    if (qq > 0) { p.globalAlpha = qq; text(p, q, SW / 2, 700, '800 58px Montserrat', '#FFFFFF'); text(p, 'OUI  /  NON', SW / 2, 800, '900 56px Montserrat', '#FF4B4B'); }
  }, { vig: .3 });
}

// ---------- HUD ----------
const kmAt = gt => gt < L(2) ? 3 : gt > L(7) ? 0 : 3 * (1 - clamp((gt - L(2)) / (L(7) - L(2))));
const kmTxt = gt => { const k = kmAt(gt); return k >= 1 ? k.toFixed(1).replace('.', ',') + ' km' : Math.round(k * 100) * 10 + ' m'; };
function hud(c, gt) {
  const near = gt > L(4) && gt < L(7);
  cinemaHud(c, gt, { part: 'Le GPS', off: gt > CUE.endcard, val: gt < L(2) ? '00:00' : gt > L(8) ? 'TRAJETS : 1' : 'ARRIVÉE : ' + kmTxt(gt), neg: near || gt > L(8), bump: gt > L(8) ? CUE.hist : undefined });
}

const bustSis = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, col: SIS, col2: SIS2, hair: sisHair, seed: 3, light: -1, rim: 'rgba(140,180,255,.9)', ...o });
const bustKid = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, hair: kidHair, seed: 2, light: 1, rim: 'rgba(140,180,255,.9)', ...o });

// ---------- scènes ----------
SC.flash = (c, lt, gt) => {
  film(c, gt, p => {
    p.fillStyle = '#05060A'; p.fillRect(0, 0, SW, SH);
    p.save(); cam2(p, 960, 540, push(lt, 1.0, 1.25, 3));
    gps(p, 960, 540, 2.2, gt, { msg: 'NE VOUS ARRÊTEZ PAS', red: true, noRoad: true, km: '500 m' });
    p.restore();
  });
};
SC.voiture = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'two'], [at(1, .5), 'box'], [L(2), 'gps'], [at(2, .62), 'faces']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, .6);
    if (shot === 'two' || shot === 'faces') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.05, 1.12, 4)); carInside(p, gt);
      bustSis(p, 560, 560, 190, gt, { e: shot === 'faces' ? 'worried' : 'n', look: shot === 'faces' ? 1 : -.4, talk: shot === 'faces' && talking(gt, at(2, .7), E(2)) });
      bustKid(p, 1360, 600, 170, gt, { e: shot === 'faces' ? 'wide' : 'n', look: shot === 'faces' ? -1 : 0, lookY: shot === 'faces' ? .5 : 0 });
      p.restore();
      if (shot === 'faces') { p.save(); cam2(p, 960, 560, 1.08); gps(p, 960, 760, .55, gt, { msg: 'NOUVEL ITINÉRAIRE', km: kmTxt(gt) }); p.restore(); }
    } else if (shot === 'box') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.12, 3)); carInside(p, gt, false); p.restore();
      p.fillStyle = 'rgba(0,0,0,.4)'; p.fillRect(0, 0, SW, SH);
      rr(p, 520, 360, 880, 420, 20); fs(p, '#1A1B22', 0); rr(p, 560, 400, 800, 340, 10); fs(p, '#0A0A0E', 0);
      const on = gt > CUE.on;
      gps(p, 960, 580, 1.2, gt, on ? { msg: '', km: '' } : { off: true });
      if (on) glow(p, 960, 580, 500, 'rgba(120,170,255,A)', .35);
    } else {
      p.save(); cam2(p, 960 + dx, 540 + dy, push(st, 1.0, 1.15, 3)); carInside(p, gt); p.restore();
      p.fillStyle = 'rgba(0,0,0,.35)'; p.fillRect(0, 0, SW, SH);
      gps(p, 960, 560, 1.9, gt, { msg: 'NOUVEL ITINÉRAIRE', km: kmTxt(gt) });
    }
  });
};
SC.route = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'screen'], [at(3, .38), 'road'], [L(4), 'gps'], [at(4, .55), 'sis']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, .6);
    if (shot === 'screen' || shot === 'gps') {
      p.fillStyle = '#05060A'; p.fillRect(0, 0, SW, SH);
      p.save(); cam2(p, 960 + dx, 540 + dy, push(st, 1.0, 1.15, 3));
      gps(p, 960, 540, 2.1, gt, shot === 'gps' ? { msg: 'QUELQU\'UN FERA SIGNE', red: true, noRoad: true, km: kmTxt(gt) } : { noRoad: true, km: kmTxt(gt) });
      p.restore();
    } else if (shot === 'road') {
      p.save(); cam2(p, 960 + dx, 700 + dy, push(st, 1.0, 1.1, 4)); forest(p, gt, 1.2); p.restore();
    } else {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.05, 1.15, 3)); carInside(p, gt);
      bustSis(p, 760, 560, 230, gt, { e: 'worried', look: 1, lookY: .3 });
      p.restore();
    }
  });
};
SC.femme = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'road'], [CUE.sign - .2, 'ghost'], [at(5, .5), 'sis'], [L(6), 'kid'], [at(6, .35), 'mirror']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, .6);
    if (shot === 'road' || shot === 'ghost') {
      const z = shot === 'ghost' ? push(st, 1.7, 2.0, 2.5) : push(st, 1.0, 1.12, 3);
      p.save(); cam2(p, (shot === 'ghost' ? 1380 : 1000) + dx, (shot === 'ghost' ? 640 : 700) + dy, z); forest(p, gt, gt > CUE.brake ? .3 : 1);
      ghost(p, 1420, 790, .55, gt, { wave: gt > CUE.sign });
      p.restore();
    } else if (shot === 'sis') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.05, 1.12, 3)); carInside(p, gt);
      bustSis(p, 760, 560, 230, gt, { e: 'sad', look: 1, talk: talking(gt, at(5, .62), E(5)) });
      p.restore();
    } else if (shot === 'kid') {
      p.save(); cam2(p, 960 + dx * 2, 560 + dy * 2, push(st, 1.05, 1.15, 2)); carInside(p, gt);
      bustKid(p, 1100, 600, 240, gt, { e: 'wide', mouth: talking(gt, L(6), L(6) + 1.3) ? undefined : 'o', talk: talking(gt, L(6) + .2, L(6) + 1.3), look: -1 });
      p.restore();
    } else {
      p.fillStyle = '#05060A'; p.fillRect(0, 0, SW, SH);
      p.save(); cam2(p, 960 + dx, 540 + dy, push(st, 1.0, 1.2, 3));
      rr(p, 460, 300, 1000, 380, 60); fs(p, '#1A1B22', 0);
      p.save(); rr(p, 490, 330, 940, 320, 46); p.clip();
      p.fillStyle = grad(p, 330, 650, ['#06070C', '#141620']); p.fillRect(490, 330, 940, 320);
      p.beginPath(); p.moveTo(900, 470); p.lineTo(1020, 470); p.lineTo(1300, 650); p.lineTo(620, 650); p.closePath(); fs(p, '#1C1E26', 0);
      glow(p, 960, 560, 400, 'rgba(255,40,40,A)', .25);
      const turned = gt > CUE.turn;
      ghost(p, 960, 900, 1.1, gt, { back: !turned, noFace: true });
      p.restore();
      p.restore();
    }
  });
};
SC.maison = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'house'], [at(7, .55), 'gps']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, .6);
    if (shot === 'house') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.05, 1.15, 3)); house(p, gt);
      p.save(); p.translate(1300, 830); p.scale(.75, .75); rr(p, -300, -150, 600, 110, 40); fs(p, '#3A4A6A', 0); rr(p, -170, -250, 320, 120, [60, 60, 0, 0]); fs(p, '#33415E', 0);
      [-180, 180].forEach(wx => { circ(p, wx, -40, 52); fs(p, '#0E0E14', 0); }); rr(p, -330, -130, 34, 26, 6); fs(p, '#FFE9A8', 0); p.restore();
      p.restore();
    } else {
      p.fillStyle = '#05060A'; p.fillRect(0, 0, SW, SH);
      p.save(); cam2(p, 960, 540, push(st, 1.0, 1.1, 2));
      gps(p, 960, 540, 2.1, gt, gt > CUE.off ? { off: true } : { msg: 'VOUS ÊTES ARRIVÉS', km: '0 m' });
      p.restore();
    }
  });
};
SC.fin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'room'], [CUE.hist - .3, 'hist'], [at(8, .55), 'kid'], [at(8, .78), 'hist2'], [L(9), 'kid'], [at(9, .35), 'hist2']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, .6);
    if (shot === 'room') {
      p.save(); cam2(p, 960 + dx, 560 + dy, push(st, 1.05, 1.15, 3));
      p.fillStyle = grad(p, 0, 800, ['#D8D4CC', '#C4BEB2']); p.fillRect(-400, -200, 2800, 1400); p.fillStyle = '#8A7A66'; p.fillRect(-400, 780, 2800, 500);
      rr(p, 600, 600, 720, 30, 8); fs(p, '#6B4A30', 0);
      gps(p, 960, 520, .55, gt, { off: true });
      bustKid(p, 960, 900, 200, gt, { e: 'n', lookY: -.6, light: 1, rim: 'rgba(255,226,170,.9)' });
      p.restore();
    } else if (shot === 'kid') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2));
      p.fillStyle = grad(p, 0, 800, ['#D8D4CC', '#C4BEB2']); p.fillRect(-400, -200, 2800, 1400);
      bustKid(p, 960, 640, 230, gt, { e: 'sad', light: 1, rim: 'rgba(255,226,170,.9)' });
      p.restore();
    } else {
      p.fillStyle = '#0A0A0E'; p.fillRect(0, 0, SW, SH);
      p.save(); cam2(p, 960, 540, push(st, 1.0, 1.15, 3)); gps(p, 960, 540, 2.1, gt, { hist: true }); p.restore();
    }
  });
  finCard(c, gt, CUE.endcard, 'Toi, tu te serais arrêté ?');
};
