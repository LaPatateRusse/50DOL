// Cent euros le mensonge — Partie 4 (kits : cinema.js, cinema-rig.js, mensonge-kit.js → MK).
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const { MOM, MOM2, COAT, COAT2, MAMIE, MAMIE2 } = MK;
const GHOST = gt => .5 + Math.sin(gt * 9) * .06 * (Math.sin(gt * 1.3) > .6 ? 1 : 0); // opacité du héros qui s'efface
const STR = { col: COAT, col2: COAT2, pants: '#24262E', seed: 3 };
const papyOldHair = null;

function hud(c, gt) {
  cinemaHud(c, gt, { part: 'Partie 4', off: gt > CUE.endcard, day: 5, val: '−97 €', neg: true, sub: '2', subIcon: heartIcon });
}
const ghost = (p, gt, fn) => { p.save(); p.globalAlpha = GHOST(gt); fn(); p.restore(); };
function cup(p, x, y, s, gt) { p.save(); p.translate(x, y); p.scale(s, s); rr(p, -50, -70, 100, 80, 14); fs(p, '#F2EDE4', 0); line(p, [[50, -50], [72, -30], [50, -10]], 10, '#F2EDE4', null); p.beginPath(); p.ellipse(0, -66, 44, 10, 0, 0, Math.PI * 2); fs(p, '#5A3220', 0);
  p.globalAlpha = .4; for (let i = 0; i < 3; i++) line(p, [[-20 + i * 20, -90 - ((gt * 40 + i * 30) % 80)], [-14 + i * 20, -130 - ((gt * 40 + i * 30) % 80)]], 5, '#fff', null); p.restore(); }
function notebook(p, gt, lines, t0, t1) {
  p.fillStyle = '#2A1A12'; p.fillRect(0, 0, SW, SH); glow(p, 960, 400, 900, 'rgba(255,200,130,A)', .35);
  rr(p, 260, 120, 1400, 860, 20); fs(p, '#6A3A24', 0);
  rr(p, 300, 150, 650, 800, 8); fs(p, '#EFE6D0', 0); rr(p, 970, 150, 650, 800, 8); fs(p, '#F4ECD8', 0);
  p.fillStyle = 'rgba(80,110,160,.18)'; for (let y = 230; y < 930; y += 62) { p.fillRect(320, y, 610, 3); p.fillRect(990, y, 610, 3); }
  text(p, '12 mars 1977', 620, 220, 'italic 600 34px Montserrat', '#7A6A5A');
  ['Toujours ce bus.', 'Toujours ce chapeau.', 'Je ne sais plus', 'qui je suis.'].forEach((l, i) => text(p, l, 340, 300 + i * 62, 'italic 600 38px Montserrat', 'rgba(42,58,106,.55)', 'left'));
  const n = lines.length;
  lines.forEach((l, i) => { const k = clamp(((gt - t0) / (t1 - t0)) * n - i); if (k <= 0) return; p.save(); p.beginPath(); p.rect(990, 260 + i * 62 - 30, 600 * k, 60); p.clip(); text(p, l, 1010, 262 + i * 62, 'italic 600 38px Montserrat', '#2A3A6A', 'left'); p.restore(); });
}

SC.reveil = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'bed'], [at(0, .55), 'hand'], [L(1), 'frames']]);
  film(c, gt, p => {
    if (shot === 'bed') {
      p.save(); cam2(p, 760, 600, push(st, 1.3, 1.38, 4));
      MK.bedroomDay(p, gt);
      ghost(p, gt, () => rig(p, { x: 640, y: 850, s: .62, f: 1, t: gt, pose: 'sit', seat: 220, e: 'worried', lookY: .6, armF: [1.7, -1.1], seed: 1, light: 1 }));
      p.restore();
    } else if (shot === 'hand') {
      blurred(p, 10, q => { cam2(q, 760, 500, 1.4); MK.bedroomDay(q, gt); });
      p.save(); p.globalAlpha = .45 + Math.sin(gt * 12) * .08; hand(p, 700, 1050, 2.4, -1.25, { open: true }); p.restore();
    } else {
      p.save(); cam2(p, kf(st, [[0, 600], [4, 1300]]), 420, 1.7);
      MK.salon(p, gt);
      [[500, 200, '#7FA6D8'], [820, 240, '#E5B85C'], [1140, 190, '#9FD3A0'], [1460, 230, '#E89AA8']].forEach(([x, y, bg], i) => frame(p, x, y, 220, 260, (q, cx, cy) => {
        q.fillStyle = bg; q.fillRect(cx - 100, cy - 120, 200, 240);
        bust(q, cx - 45, cy + 20, 32, { t: 0, col: MAMIE, col2: MAMIE2, hair: MK.mamieHair, e: 'happy', mouth: 'smile', blink: false });
        q.save(); q.globalAlpha = clamp(1 - (gt - L(1) - .5 - i * .5) * 1.5); bust(q, cx + 40, cy + 30, 30, { t: 0, e: 'happy', mouth: 'smile', blink: false }); q.restore();
        if (i === 1) text(q, '10 ans', cx, cy - 90, '800 22px Montserrat', '#fff');
      }));
      p.restore();
    }
  });
};
SC.tasse = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wide'], [at(2, .5), 'shake'], [L(3), 'mamie']]);
  film(c, gt, p => {
    if (shot === 'wide') {
      p.save(); cam2(p, 900, 600, push(st, 1.2, 1.28, 3));
      MK.salon(p, gt);
      table(p, 880, 690, 500);
      cup(p, 900, 690, 1, gt);
      rig(p, { x: 1180, y: 905, s: .58, f: -1, t: gt, col: MAMIE, col2: MAMIE2, pants: '#3A3348', hair: MK.mamieHair, e: 'sad', armF: [1.3 + Math.sin(gt * 22) * .03, -.5], seed: 6, light: 1 });
      ghost(p, gt, () => rig(p, { x: 600, y: 905, s: .58, f: 1, t: gt, pose: 'sit', seat: 260, e: 'sad', seed: 1, light: -1 }));
      p.restore();
    } else if (shot === 'shake') {
      blurred(p, 10, q => { cam2(q, 900, 500, 1.5); MK.salon(q, gt); });
      const sh = Math.sin(gt * 40) * 6;
      cup(p, 980 + sh, 700, 2.6, gt);
      hand(p, 1520 + sh, 760, 2.2, Math.PI + .25, { sleeve: MAMIE, open: true });
    } else {
      blurred(p, 10, q => { cam2(q, 900, 500, 1.5); MK.salon(q, gt); });
      p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 4));
      bust(p, 960, 600, 220, { t: gt, col: MAMIE, col2: MAMIE2, hair: MK.mamieHair, e: 'sad', talk: talking(gt, L(3), E(3)), light: 1, rim: 'rgba(255,210,150,.9)', seed: 6, lookY: .3 });
      p.restore();
    }
  });
};
SC.carnet = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'book'], [L(7), 'mamie']]);
  film(c, gt, p => {
    if (shot === 'book') {
      p.save(); cam2(p, kf(gt - L(4), [[0, 960], [4, 1300]]), kf(gt - L(4), [[0, 540], [4, 500]]), kf(gt - L(4), [[0, 1], [4, 1.5]]));
      notebook(p, gt, ['La vérité qui coûte le plus,', 'ce n\'est pas un secret.', 'C\'est ce qu\'on n\'a jamais', 'osé dire à quelqu\'un', 'qu\'on aime.', '', 'Moi, je n\'ai jamais osé', 'le dire à Jeanne.', '                    — Antoine'], L(5) + .2, E(6) - .2);
      p.restore();
    } else {
      blurred(p, 10, q => { cam2(q, 900, 500, 1.5); MK.salon(q, gt); });
      p.save(); cam2(p, 960, 560, push(st, 1, 1.15, 4));
      bust(p, 960, 600, 220, { t: gt, col: MAMIE, col2: MAMIE2, hair: MK.mamieHair, e: 'wide', light: 1, rim: 'rgba(255,210,150,.9)', seed: 6, handUp: kf(st, [[0, 0], [.8, .55]]) });
      MK.tear(p, 1040, 600, gt, L(7) + 1.2); MK.tear(p, 880, 600, gt, L(7) + 1.9);
      p.restore();
    }
  });
};
SC.depart = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'me'], [at(8, .55), 'train']]);
  film(c, gt, p => {
    if (shot === 'me') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.12, 3));
      p.fillStyle = grad(p, 0, 1080, ['#2A1A14', '#140C0A']); p.fillRect(-200, -200, 2400, 1500); glow(p, 700, 300, 600, 'rgba(255,200,130,A)', .2);
      ghost(p, gt, () => bust(p, 960, 580, 230, { t: gt, e: 'angry', mouth: 'flat', light: 1, rim: 'rgba(255,210,150,.9)', seed: 1 }));
      p.restore();
    } else { p.save(); cam2(p, 960, 560, 1.1); MK.trainOut(p, gt, { t0: at(8, .55) - 1 }); p.restore(); }
  }, { vig: .7 });
};
SC.porte = (c, lt, gt) => {
  const open = eo(pr(gt, CUE.open, CUE.open + .7));
  const [shot, st] = shots(gt, [[0, 'door'], [L(10), 'mom'], [L(11), 'me']]);
  film(c, gt, p => {
    if (shot === 'door') {
      p.save(); cam2(p, 1000, 560, push(st, 1.15, 1.25, 5));
      MK.houseNight(p, gt, open);
      if (open > .4) { p.save(); p.globalAlpha = clamp((open - .4) * 2); rig(p, { x: 960, y: 840, s: .6, f: 1, t: gt, col: MOM, col2: MOM2, pants: '#3A3040', hair: MK.momHair, e: 'n', look: Math.sin(gt * 2) * .8, seed: 2, light: 1 }); p.restore(); }
      const knock = gt > CUE.knock && gt < CUE.knock + 1.1;
      p.save(); p.globalAlpha = .4; rig(p, { x: 1350, y: 900, s: .62, f: -1, t: gt, e: 'sad', armF: knock ? [2.0, -1.0 + Math.max(0, Math.sin((gt - CUE.knock) * 19)) * .5] : [.3, .2], seed: 1, light: -1 }); p.restore();
      p.restore();
    } else if (shot === 'mom') {
      p.fillStyle = '#2A1A14'; p.fillRect(0, 0, SW, SH); glow(p, 960, 400, 900, 'rgba(255,200,130,A)', .4);
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3));
      bust(p, 960, 580, 220, { t: gt, col: MOM, col2: MOM2, hair: MK.momHair, e: 'worried', look: Math.sin(gt * 1.6), talk: talking(gt, L(10), E(10)), light: 1, rim: 'rgba(255,210,150,.9)', seed: 2 });
      p.restore();
    } else {
      p.fillStyle = '#0B1024'; p.fillRect(0, 0, SW, SH); glow(p, 960, 300, 700, 'rgba(255,200,130,A)', .25);
      p.save(); p.globalAlpha = .35 + Math.sin(gt * 13) * .1; bust(p, 960, 580, 230, { t: gt, e: 'worried', mouth: 'o', sweat: true, light: -1, seed: 1 }); p.restore();
      for (let i = 0; i < 40; i++) { const k = ((gt * .25 + rnd(i)) % 1); circ(p, 700 + rnd(i + 5) * 520, 900 - k * 700, 4 + rnd(i) * 6); fs(p, `rgba(255,200,90,${(1 - k) * .7})`, 0); }
    }
  });
};
SC.voix = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'turn'], [at(12, .45), 'wide'], [L(13), 'fear']]);
  film(c, gt, p => {
    if (shot === 'turn') {
      p.fillStyle = '#0B1024'; p.fillRect(0, 0, SW, SH); glow(p, 960, 300, 700, 'rgba(255,200,130,A)', .2);
      ghost(p, gt, () => bust(p, 960, 580, 230, { t: gt, e: 'wide', look: kf(st, [[0, 1], [.6, -1]]), tilt: kf(st, [[0, 0], [.6, -.08]]), light: -1, seed: 1 }));
    } else if (shot === 'wide') {
      p.save(); cam2(p, 1050, 560, push(st, 1.3, 1.4, 3));
      MK.street(p, gt);
      rig(p, Object.assign({ x: 1250, y: 835, s: .6, f: -1, t: gt, hair: MK.hatHair, e: 'angry', talk: talking(gt, at(12, .55), E(12)), armF: [1.4, -.3], light: 1 }, STR));
      ghost(p, gt, () => rig(p, { x: 760, y: 835, s: .6, f: 1, t: gt, e: 'wide', seed: 1, light: 1 }));
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.15, 4));
      p.fillStyle = grad(p, 0, 1080, ['#0B1024', '#1A2140']); p.fillRect(-200, -200, 2400, 1500); cone(p, 960, -80, 200, 1100, 1200, 'rgba(255,230,170,A)', .2);
      bust(p, 960, 600, 210, { t: gt, col: COAT, col2: COAT2, hair: MK.hatHair, e: 'worried', mouth: 'o', sweat: true, light: 1, rim: 'rgba(255,230,180,.7)', seed: 3 });
      p.restore();
    }
  });
};
SC.chapeau = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'grab'], [L(15), 'face'], [at(15, .62), 'compare']]);
  film(c, gt, p => {
    p.fillStyle = grad(p, 0, 1080, ['#0B1024', '#1A2140']); p.fillRect(0, 0, SW, SH); cone(p, 960, -80, 200, 1100, 1200, 'rgba(255,230,170,A)', .2);
    p.save(); p.globalAlpha = .3; for (let i = 0; i < 90; i++) { const x = (i * 197) % 2300 - 200, y = ((i * 263 + gt * 1500) % 1300) - 150; line(p, [[x, y], [x - 8, y + 36]], 3, '#C9D6F0', null); } p.restore();
    if (shot === 'grab' || shot === 'face') {
      const gone = gt > CUE.fall;
      p.save(); cam2(p, 960, 560, shot === 'face' ? push(st, 1.05, 1.3, 3) : 1);
      bust(p, 960, 600, 210, { t: gt, col: COAT, col2: COAT2, hair: gone ? MK.papyHair : undefined, e: gone ? 'sad' : 'wide', mouth: gone ? 'flat' : 'o', light: 1, rim: 'rgba(255,230,180,.7)', seed: 3 });
      const k = pr(gt, CUE.fall, CUE.fall + .9);
      p.save(); p.translate(960 + k * 380, 600 + kf(gt - CUE.fall, [[0, 0], [.3, -60], [.9, 700]])); p.rotate(k * 2.4); MK.hatHair(p, 210, [0, 0]); p.restore();
      if (gt > CUE.grab - .3 && gt < CUE.fall + .5) { const h = eo(pr(gt, CUE.grab - .3, CUE.grab + .2)); p.save(); p.globalAlpha = .5; hand(p, 400 + h * 260 + k * 380, 1100 - h * 760 + k * 300, 1.8, -1.0, { open: gt < CUE.grab }); p.restore(); }
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3));
      bust(p, 1300, 620, 190, { t: gt, col: COAT, col2: COAT2, hair: MK.papyHair, e: 'sad', light: 1, rim: 'rgba(255,230,180,.7)', seed: 3 });
      MK.photo(p, 560, 560, .95, -.06, gt, 0);
      p.restore();
    }
  });
};
SC.fin = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 960, 560, push(lt, 1, 1.2, 6));
    p.fillStyle = grad(p, 0, 1080, ['#0B1024', '#05060C']); p.fillRect(-200, -200, 2400, 1500); cone(p, 960, -80, 200, 1100, 1200, 'rgba(255,230,170,A)', .16);
    bust(p, 960, 600, 220, { t: gt, col: COAT, col2: COAT2, hair: MK.papyHair, e: 'sad', mouth: 'frown', light: 1, rim: 'rgba(255,230,180,.7)', seed: 3 });
    MK.tear(p, 1040, 600, gt, L(16) + 1);
    p.restore();
  });
  cinemaEnd(c, gt, CUE.endcard, 'PARTIE 5', 'Toi ou Papy ?');
};
