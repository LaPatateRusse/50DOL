// Cent euros le mensonge — Partie 3 (kits : cinema.js, cinema-rig.js, mensonge-kit.js → MK).
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const { MOM, MOM2, MOMHAIR, COAT, COAT2, MAMIE, MAMIE2, POTE, POTE2 } = MK;
const nan = n => (n < 0 ? '−' : '') + String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const STR = { col: COAT, col2: COAT2, pants: '#24262E', hair: MK.hatHair, seed: 3 };

function money(gt) {
  if (gt < CUE.m1) return [2003];
  if (gt < CUE.m2) return [1903, CUE.m1];
  if (gt < CUE.m3) return [1803, CUE.m2];
  if (gt < CUE.m4) return [1703, CUE.m3];
  if (gt < CUE.neg) { const k = pr(gt, CUE.m4 + .5, CUE.neg); return [1603 - 100 * Math.round(17 * eio(k)), k > 0 && k < 1 ? gt - .2 : CUE.m4]; }
  return [-97, CUE.neg];
}
function hud(c, gt) {
  const [v, bump] = money(gt);
  cinemaHud(c, gt, { part: 'Partie 3', off: gt > CUE.endcard, day: gt < L(7) ? 3 : 4, dayAt: L(7), val: nan(v) + ' €', neg: v < 0, bump,
    sub: gt < CUE.heart ? '1' : '2', subIcon: heartIcon, hit: gt > CUE.heart - .1 ? CUE.heart : undefined });
}
const minus100 = (p, gt, cue, x, y) => { if (gt < cue - .05) return; const k = pop(gt, cue); p.save(); p.globalAlpha = clamp(2.2 - (gt - cue)); p.translate(x, y - (gt - cue) * 40); p.scale(k, k); text(p, '−100 €', 0, 0, '900 96px Montserrat', '#FF4B4B', 'center', 14, '#0B0C12'); p.restore(); };
function bills(p, x, y, s, t) { p.save(); p.translate(x, y); p.scale(s, s); for (let i = -3; i <= 3; i++) { p.save(); p.rotate(i * .14 + Math.sin(t * 2) * .02); rr(p, -40, -150, 80, 150, 6); fs(p, i % 2 ? '#6FBF73' : '#5DAA62', 0); circ(p, 0, -100, 18); fs(p, 'rgba(255,255,255,.35)', 0); p.restore(); } p.restore(); }
function puff(p, x, y, k) { if (k <= 0 || k >= 1) return; p.save(); for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, d = 40 + k * 260 * (.6 + rnd(i) * .6); p.globalAlpha = (1 - k) * .6; circ(p, x + Math.cos(a) * d, y + Math.sin(a) * d * .7 - k * 120, 30 + k * 60 * rnd(i + 3)); fs(p, '#8A8F9E', 0); } p.restore(); }
function windowMamie(p, gt) { // façade de chez Mamie, fenêtre allumée, Mamie derrière le rideau
  p.fillStyle = grad(p, 0, 1080, ['#0B1024', '#1A2140']); p.fillRect(-300, -200, 2600, 1500);
  for (let y = 0; y < 1100; y += 60) for (let x = (y / 60 % 2) * 60 - 300; x < 2300; x += 120) { rr(p, x, y, 112, 52, 4); fs(p, '#2E2228', 0); }
  rr(p, 700, 200, 520, 560, 6); fs(p, '#FFD9A0', 0); glow(p, 960, 480, 600, 'rgba(255,200,130,A)', .5);
  p.save(); rr(p, 700, 200, 520, 560, 6); p.clip(); rig(p, { x: 960, y: 1060, s: .9, f: -1, t: gt, col: MAMIE, col2: MAMIE2, pants: '#3A3348', hair: MK.mamieHair, e: 'sad', lookY: .6, armF: [2.2, -1.5], seed: 6 }); p.fillStyle = 'rgba(255,240,220,.45)'; p.fillRect(700, 200, 520, 560); p.restore();
  rr(p, 690, 190, 540, 580, 6); fs(p, null, 16, '#4A2E1E'); rr(p, 650, 150, 90, 640, 20); fs(p, '#8A2230', 0); rr(p, 1180, 150, 90, 640, 20); fs(p, '#8A2230', 0);
  p.save(); p.globalAlpha = .35; for (let i = 0; i < 90; i++) { const x = (i * 197) % 2300 - 200, y = ((i * 263 + gt * 1200) % 1300) - 150; line(p, [[x, y], [x - 8, y + 30]], 3, '#C9D6F0', null); } p.restore();
}
function bakery(p, gt) {
  p.fillStyle = grad(p, 0, 820, ['#E8C9A0', '#D9B488']); p.fillRect(-300, -200, 2600, 1100);
  for (let i = 0; i < 5; i++) { rr(p, 120 + i * 360, 200, 300, 40, 6); fs(p, '#8A5A34', 0); for (let k = 0; k < 6; k++) { p.save(); p.translate(150 + i * 360 + k * 45, 190); p.rotate(-.3); rr(p, -12, -90, 24, 110, 12); fs(p, '#D99A4E', 0); p.restore(); } }
  p.fillStyle = '#6A4428'; p.fillRect(-300, 620, 2600, 500); p.fillStyle = '#F2EAD8'; p.fillRect(-300, 600, 2600, 30);
  glow(p, 960, 100, 900, 'rgba(255,240,200,A)', .3);
}
function landing(p, gt) {
  p.fillStyle = grad(p, 0, 820, ['#6A7A6A', '#5A6A5A']); p.fillRect(-300, -200, 2600, 1100); p.fillStyle = '#3A4038'; p.fillRect(-300, 820, 2600, 400);
  rr(p, 1200, 220, 300, 600, 6); fs(p, '#5A3A28', 0); circ(p, 1460, 540, 12); fs(p, '#D9B04A', 0); rr(p, 1290, 300, 120, 40, 6); fs(p, '#C9A040', 0); lamp(p, 900, 60, 220);
}
// silhouette générique (voisin, boulangère, prof) face au héros, avec réplique « −100 »
function truthShot(p, gt, bg, who, cue) {
  p.save(); cam2(p, 960, 600, 1.3 + (gt - cue + .3) * .03);
  bg(p, gt);
  rig(p, { x: 720, y: 905, s: .62, f: 1, t: gt, e: 'sad', talk: talking(gt, cue - .2, cue + .5), armF: [.5 + Math.sin(gt * 4) * .2, -.6], seed: 1 });
  rig(p, Object.assign({ x: 1220, y: 905, s: .62, f: -1, t: gt, e: gt > cue + .4 ? 'wide' : 'n', mouth: gt > cue + .4 ? 'o' : undefined, seed: 7 }, who));
  p.restore();
  minus100(p, gt, cue, 960, 230);
}

SC.rue = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wide'], [L(1), 'him'], [at(1, .7), 'me']]);
  film(c, gt, p => {
    if (shot === 'wide') {
      const hx = kf(st, [[0, -200], [2.4, 640]]);
      p.save(); cam2(p, 950, 600, push(st, 1.25, 1.35, 4));
      MK.street(p, gt);
      rig(p, Object.assign({ x: 1200, y: 835, s: .6, f: -1, t: gt, e: 'happy', mouth: 'smile', light: 1 }, STR));
      rig(p, { x: hx, y: 835, s: .6, f: 1, t: gt, pose: st < 2.4 ? 'walk' : 'stand', walk: gt * 7, e: 'n', seed: 1, light: 1 });
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 4));
      p.fillStyle = grad(p, 0, 1080, ['#0B1024', '#1A2140']); p.fillRect(-200, -200, 2400, 1500);
      cone(p, 960, -80, 200, 1100, 1200, 'rgba(255,230,170,A)', .2);
      if (shot === 'him') bust(p, 960, 600, 210, { t: gt, col: COAT, col2: COAT2, hair: MK.hatHair, e: 'happy', mouth: 'smile', talk: talking(gt, L(1) + .1, E(1)), light: 1, rim: 'rgba(255,230,180,.7)', seed: 3 });
      else bust(p, 960, 600, 220, { t: gt, e: 'angry', mouth: 'flat', light: 1, rim: 'rgba(255,230,180,.8)', seed: 1 });
      p.save(); p.globalAlpha = .3; for (let i = 0; i < 90; i++) { const x = (i * 197) % 2300 - 200, y = ((i * 263 + gt * 1500) % 1300) - 150; line(p, [[x, y], [x - 8, y + 36]], 3, '#C9D6F0', null); } p.restore();
      p.restore();
    }
  });
};
SC.offre = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'mid'], [at(2, .4), 'cash'], [L(3), 'him']]);
  film(c, gt, p => {
    if (shot === 'mid') {
      p.save(); cam2(p, 1000, 480, 1.6);
      MK.street(p, gt);
      rig(p, Object.assign({ x: 1000, y: 835, s: .6, f: -1, t: gt, e: 'n', armF: kf(st, [[0, [.2, .1]], [.8, [1.9, -.3]]]), light: 1, holdF: (q, x, y) => { if (st > .6) bills(q, x, y + 10, .55, gt); } }, STR));
      p.restore();
    } else if (shot === 'cash') {
      p.fillStyle = '#0A0C16'; p.fillRect(0, 0, SW, SH); glow(p, 960, 500, 700, 'rgba(120,230,140,A)', .18);
      p.save(); cam2(p, 960, 540, push(st, 1, 1.15, 3)); bills(p, 960, 720, 2.6, gt); hand(p, 620, 1080, 2, -1.1, { sleeve: COAT }); p.restore();
      text(p, '100 000 €', 960, 160, '900 110px Montserrat', '#3DDC84', 'center', 14, '#0B0C12');
    } else {
      blurred(p, 10, q => { bust(q, 1650, 640, 260, { t: gt, look: -1, light: 1 }); });
      p.save(); cam2(p, 820, 560, push(st, 1, 1.08, 3));
      bust(p, 800, 600, 200, { t: gt, col: COAT, col2: COAT2, hair: MK.hatHair, e: 'side', mouth: 'smile', talk: talking(gt, L(3), E(3)), light: 1, rim: 'rgba(255,230,180,.7)', seed: 3 });
      p.restore();
    }
  }, { vig: .7 });
};
SC.refus = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'window'], [L(5), 'no'], [L(6), 'him']]);
  film(c, gt, p => {
    if (shot === 'window') { p.save(); cam2(p, 960, kf(st, [[0, 700], [2.5, 460]]), push(st, 1.05, 1.25, 3)); windowMamie(p, gt); p.restore(); }
    else if (shot === 'no') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.15, 2));
      p.fillStyle = grad(p, 0, 1080, ['#0B1024', '#1A2140']); p.fillRect(-200, -200, 2400, 1500); glow(p, 960, 300, 600, 'rgba(255,200,130,A)', .2);
      bust(p, 960, 600, 230, { t: gt, e: 'angry', mouth: 'flat', talk: talking(gt, CUE.no - .2, CUE.no + .5), light: -1, rim: 'rgba(255,215,150,.9)', seed: 1 });
      p.restore();
    } else {
      const k = pr(gt, CUE.vanish, CUE.vanish + 1.2);
      p.save(); cam2(p, 1150, 520, 1.55);
      MK.street(p, gt);
      p.save(); p.globalAlpha = 1 - clamp(k * 2.5); rig(p, Object.assign({ x: 1200, y: 835, s: .6, f: -1, t: gt, e: 'happy', mouth: 'smile', talk: talking(gt, L(6) + .6, CUE.vanish - .2), tilt: .1, light: 1 }, STR)); p.restore();
      puff(p, 1200, 600, k);
      p.restore();
    }
  });
};
SC.verites = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'walk'], [L(8), 'two'], [L(9), 'pote'], [L(10), 'me']]);
  film(c, gt, p => {
    if (shot === 'walk') {
      p.save(); cam2(p, kf(st, [[0, 700], [3, 1100]]), 630, 1.3);
      hallDay(p, gt);
      rig(p, { x: kf(st, [[0, 300], [3, 1300]]), y: 905, s: .6, f: 1, t: gt, pose: 'walk', walk: gt * 7, e: 'angry', mouth: 'flat', seed: 1 });
      p.restore();
    } else if (shot === 'two') truthShot(p, gt, hallDay, { col: POTE, col2: POTE2, hair: MK.capHair, e: gt > CUE.m1 ? 'angry' : 'n', seed: 5 }, CUE.m1);
    else if (shot === 'pote') {
      blurred(p, 8, q => hallDay(q, gt));
      p.save(); cam2(p, 960, 540, push(st, 1, 1.08, 3));
      const know = gt > CUE.heart - .6;
      bust(p, 960, 560, 220, { t: gt, col: POTE, col2: POTE2, hair: MK.capHair, e: know ? 'wide' : 'angry', mouth: know ? 'smile' : 'frown', talk: talking(gt, at(9, .45), E(9)), tilt: know ? -.1 : .06, light: 1, seed: 5 });
      p.restore();
    } else {
      blurred(p, 8, q => hallDay(q, gt));
      bust(p, 960, 560, 230, { t: gt, e: 'happy', mouth: 'smile', light: -1, seed: 1 });
      MK.tear(p, 1040, 590, gt, L(10) + .8);
    }
  });
};
SC.montage = (c, lt, gt) => {
  const [shot] = shots(gt, [[0, 'prof'], [CUE.m3 - .3, 'voisin'], [CUE.m4 - .3, 'boul']]);
  film(c, gt, p => {
    if (shot === 'prof') truthShot(p, gt, hallDay, { col: '#7A5A44', col2: '#5E4433', pants: '#2E3446', hair: MK.profHair, seed: 4 }, CUE.m2);
    else if (shot === 'voisin') truthShot(p, gt, landing, { col: '#4A7A5A', col2: '#3A6248', hair: (q, r, hc) => { q.save(); q.translate(hc[0], hc[1]); q.beginPath(); q.arc(0, 0, r * 1.04, Math.PI * .85, Math.PI * 1.4); q.lineWidth = r * .25; q.strokeStyle = '#C8C8D0'; q.stroke(); q.restore(); } }, CUE.m3);
    else truthShot(p, gt, bakery, { col: '#F2F2F2', col2: '#D8D8DE', pants: '#3A3A44', hair: (q, r, hc) => { q.save(); q.translate(hc[0], hc[1]); q.fillStyle = '#C9772E'; circ(q, -r * .6, -r * .7, r * .4); q.fill(); q.beginPath(); q.arc(0, 0, r * 1.06, Math.PI, Math.PI * 1.95); q.fill(); q.restore(); } }, CUE.m4);
  });
};
SC.chute = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'phone'], [L(13), 'look'], [L(14), 'hand']]);
  film(c, gt, p => {
    if (shot === 'phone') {
      p.fillStyle = '#0A0C14'; p.fillRect(0, 0, SW, SH); glow(p, 960, 540, 700, 'rgba(255,60,60,A)', .15);
      phoneHeld(p, 960, 560, 1.05, -.04, scrBank('−97,00 €', 'Solde à découvert', (q, w) => notifBanner(q, w, pr(gt, CUE.neg, CUE.neg + .4), 'Alerte|découvert', 'Votre compte est à découvert', '#E5484D')));
    } else if (shot === 'look') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 3));
      p.fillStyle = grad(p, 0, 1080, ['#151A33', '#0E1124']); p.fillRect(-200, -200, 2400, 1500);
      bust(p, 960, 560, 230, { t: gt, e: 'n', lookY: 1, light: -1, seed: 1 });
      p.restore();
    } else {
      p.fillStyle = '#D8D8DE'; p.fillRect(0, 0, SW, SH);
      for (let x = -200; x < SW + 200; x += 180) for (let y = -200; y < SH + 200; y += 180) { p.strokeStyle = '#A8A8B4'; p.lineWidth = 6; p.strokeRect(x + st * 6, y, 180, 180); }
      p.save(); p.globalAlpha = .75 - pr(gt, L(14), L(14) + 1.6) * .5 + Math.sin(gt * 30) * .05; hand(p, 500, 900, 2.6, -.5, { open: true }); p.restore();
      p.fillStyle = 'rgba(20,24,40,.35)'; p.fillRect(0, 0, SW, SH);
    }
  }, { vig: .7 });
};
SC.fin = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 960, 560, push(lt, 1, 1.18, 6));
    p.fillStyle = grad(p, 0, 1080, ['#0E1124', '#05060C']); p.fillRect(-200, -200, 2400, 1500);
    cone(p, 960, -60, 300, 1200, 1200, 'rgba(200,215,255,A)', .12);
    p.save(); p.globalAlpha = .55 + Math.sin(gt * 11) * .12 * (Math.sin(gt * 1.7) > .5 ? 1 : 0); bust(p, 960, 600, 230, { t: gt, e: 'worried', mouth: 'o', sweat: true, light: -1, seed: 1 }); p.restore();
    for (let i = 0; i < 40; i++) { const k = ((gt * .25 + rnd(i)) % 1); circ(p, 700 + rnd(i + 5) * 520, 900 - k * 700, 4 + rnd(i) * 6); fs(p, `rgba(255,200,90,${(1 - k) * .7})`, 0); }
    p.restore();
  });
  cinemaEnd(c, gt, CUE.endcard, 'PARTIE 4', 'Tu sais laquelle ?');
};
