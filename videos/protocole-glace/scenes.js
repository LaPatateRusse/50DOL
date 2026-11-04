// Protocole de survie — La glace (19:15 du 05/11), style cinéma (cinema.js + cinema-rig.js). Conseils vérifiés.
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const FR = '#5B8BE0', FR2 = '#4A74C0';

const beanie = (col, col2) => (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .1, r * 1.05, Math.PI * 1.0, Math.PI * 2.0); c.closePath(); fs(c, col, 0); rr(c, -r * 1.06, -r * .2, r * 2.12, r * .24, r * .1); fs(c, col2, 0); circ(c, 0, -r * 1.12, r * .18); fs(c, col2, 0); c.restore(); };
const myHat = beanie('#C0392B', '#A02E22'), frHat = beanie('#2E9A6A', '#237A52');

// ---------- décors ----------
function lake(p, gt, o = {}) {
  p.fillStyle = grad(p, 0, 520, ['#AFC4D8', '#DCE6EE']); p.fillRect(-400, -200, 2800, 800);
  for (let i = 0; i < 26; i++) { const x = -300 + i * 110; p.beginPath(); p.moveTo(x, 300 + (i * 37) % 80); p.lineTo(x - 50, 520); p.lineTo(x + 50, 520); p.closePath(); fs(p, i % 2 ? '#4E6A5A' : '#5E7A6A', 0); }
  p.fillStyle = grad(p, 520, 1300, ['#E4EEF6', '#C8DAEA']); p.fillRect(-400, 520, 2800, 800);
  for (let i = 0; i < 14; i++) line(p, [[-300 + i * 230, 560 + (i * 53) % 400], [-100 + i * 230, 580 + (i * 53) % 400]], 4, 'rgba(255,255,255,.7)', null);
  for (let i = 0; i < 40; i++) { circ(p, (i * 233 + gt * 30) % 2400 - 300, ((i * 157) + gt * 60) % 1100 - 100, 3); fs(p, 'rgba(255,255,255,.8)', 0); }
}
function hole(p, x, y, w, h) {
  p.beginPath(); for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, k = 1 + ((i * 7) % 5) * .05; p.lineTo(x + Math.cos(a) * w * k, y + Math.sin(a) * h * k); } p.closePath(); fs(p, '#1E3A5A', 6, '#FFFFFF');
  p.beginPath(); p.ellipse(x, y + h * .2, w * .8, h * .5, 0, 0, Math.PI * 2); fs(p, 'rgba(60,100,140,.5)', 0);
}
function cracks(p, x, y, k) {
  [[1, -.3], [-1, -.1], [.6, .5], [-.5, .6], [.1, -.9]].forEach(([dx, dy], i) => {
    const pts = [[x, y]]; let cx = x, cy = y; const n = Math.floor(1 + k * 5);
    for (let j = 0; j < n; j++) { cx += dx * 60 + ((i + j) % 3 - 1) * 20; cy += dy * 40 + ((i * j) % 3 - 1) * 12; pts.push([cx, cy]); }
    line(p, pts, 5, '#5A7A9A', null);
  });
}
// buste dans l'eau : personnage coupé au niveau de l'eau
function inWater(p, x, y, r, gt, o) {
  p.save(); p.beginPath(); p.rect(x - r * 4, y - r * 3, r * 8, r * 3 + r * 1.5); p.clip();
  bust(p, x, y + Math.sin(gt * 2) * 6, r, o); p.restore();
  p.beginPath(); p.ellipse(x, y + r * 1.5, r * 2.6, r * .35, 0, 0, Math.PI * 2); fs(p, 'rgba(30,58,90,.9)', 0);
  for (let i = 0; i < 3; i++) { const k = (gt * .7 + i / 3) % 1; p.beginPath(); p.ellipse(x, y + r * 1.5, r * (1.2 + k * 1.6), r * (.15 + k * .2), 0, 0, Math.PI * 2); fs(p, null, 4, `rgba(255,255,255,${.5 * (1 - k)})`); }
}
// personnage allongé à plat ventre (tourné de 90°)
function lying(p, x, y, s, gt, o = {}) {
  p.save(); p.translate(x, y); p.rotate((o.f || 1) * Math.PI / 2 + (o.roll || 0));
  rig(p, { x: 0, y: 0, s, f: 1, t: gt, pose: o.kick ? 'walk' : 'stand', walk: gt * 10, hair: o.hair || myHat, col: o.col, col2: o.col2, e: o.e || 'n', armF: o.armF || [2.9, 0], armB: o.armB || [2.7, 0], holdF: o.holdF, seed: 2, light: 1 });
  p.restore();
}
function ruleTag(p, gt, n, title, t0) {
  const s = pop(gt, t0); if (!s) return;
  p.save(); p.translate(330, 190); p.scale(s, s);
  circ(p, -150, 0, 70); fs(p, '#F5B82E', 0); text(p, String(n), -150, 6, '900 84px Montserrat', '#1A1A20');
  p.font = '900 44px Montserrat'; const w = p.measureText(title).width + 60;
  rr(p, -66, -50, w, 100, 20); fs(p, 'rgba(10,12,20,.82)', 0); text(p, title, -36, 6, '900 44px Montserrat', '#FFFFFF', 'left');
  p.restore();
}
const RULES = [[1, '1re MINUTE : RESPIRE'], [2, '10 MINUTES POUR SORTIR'], [3, 'REPARS PAR OÙ TU ES VENU'], [4, 'À PLAT, PUIS ROULE'], [5, 'NE COURS PAS VERS LE TROU']];
function tags(p, gt) {
  const cs = [CUE.r1, CUE.r2, CUE.r3, CUE.r4, CUE.r5]; let k = -1; cs.forEach((t, i) => { if (gt >= t) k = i; });
  if (k >= 0 && gt < L(9)) ruleTag(p, gt, RULES[k][0], RULES[k][1], cs[k]);
}

// ---------- HUD ----------
function hud(c, gt) {
  const r = gt < CUE.r1 ? 0 : gt < CUE.r2 ? 1 : gt < CUE.r3 ? 2 : gt < CUE.r4 ? 3 : gt < CUE.r5 ? 4 : 5;
  cinemaHud(c, gt, { part: 'Protocole de survie', off: gt > CUE.endcard, val: r ? 'RÈGLE ' + r + ' / 5' : 'LA GLACE', neg: r === 5, bump: [CUE.r1, CUE.r2, CUE.r3, CUE.r4, CUE.r5][r - 1] });
}

// ---------- scènes ----------
SC.flash = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 960, 700, push(lt, 1.3, 1.6, 3)); lake(p, gt);
    cracks(p, 960, 900, clamp((gt - CUE.crack) / 1.2));
    [[880, 880], [1040, 880]].forEach(([x, y]) => { rr(p, x - 60, y - 30, 120, 50, 22); fs(p, '#1A1A22', 0); line(p, [[x, y - 30], [x, y - 330]], 46, '#2A3A5A', null); });
    p.restore();
  });
};
SC.lac = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wide'], [at(1, .5), 'face']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'wide') {
      p.save(); cam2(p, 960 + dx, 620 + dy, push(st, 1.05, 1.15, 3)); lake(p, gt);
      rig(p, { x: 900, y: 835, s: .55, f: 1, t: gt, hair: myHat, e: 'wide', lookY: .6, armF: [.6, .4], armB: [.6, .4] });
      cracks(p, 920, 850, 1);
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); lake(p, gt); p.restore();
      bust(p, 960, 640, 230, { t: gt, hair: myHat, e: 'worried', seed: 2, light: 1 });
    }
  });
};
SC.eau = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'gasp'], [at(2, .45), 'breath'], [at(2, .78), 'wide'], [CUE.r2, 'timer'], [at(3, .55), 'edge'], [CUE.hour - .2, 'hour'], [at(4, .6), 'edge2']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'gasp' || shot === 'breath') {
      p.save(); cam2(p, 960 + dx, 600 + dy, push(st, 1.1, 1.2, 3)); lake(p, gt);
      hole(p, 960, 760, 520, 150);
      inWater(p, 960, 560, 200, gt, { t: gt, hair: myHat, e: shot === 'gasp' ? 'wide' : 'closed', blink: false, mouth: shot === 'gasp' ? 'o' : undefined, talk: shot === 'gasp' && Math.sin(gt * 9) > 0, seed: 2, light: 1 });
      p.restore();
    } else if (shot === 'wide') {
      p.save(); cam2(p, 960 + dx, 620 + dy, 1.0); lake(p, gt);
      hole(p, 960, 800, 260, 80);
      inWater(p, 960, 700, 70, gt, { t: gt, hair: myHat, e: 'n', seed: 2, light: 1 });
      p.restore();
    } else if (shot === 'hour') {
      p.save(); cam2(p, 960, 560, 1.15); lake(p, gt); p.restore();
      p.fillStyle = 'rgba(10,20,40,.55)'; p.fillRect(0, 0, SW, SH);
      [['1 MIN', 'CHOC DU FROID', '#F5B82E'], ['10 MIN', 'TES BRAS', '#FF8A3A'], ['1 H', 'CONNAISSANCE', '#FF3B30']].forEach(([a, b, col], i) => {
        const s = pop(gt, CUE.hour + i * .5); if (!s) return; p.save(); p.translate(480 + i * 480, 520); p.scale(s, s);
        text(p, a, 0, -40, '900 120px Montserrat', col); text(p, b, 0, 70, '800 40px Montserrat', '#FFFFFF'); p.restore(); });
    } else if (shot === 'timer') {
      p.save(); cam2(p, 960, 560, 1.15); lake(p, gt); p.restore();
      p.fillStyle = 'rgba(10,20,40,.55)'; p.fillRect(0, 0, SW, SH);
      const left = Math.max(0, 600 - (gt - CUE.r2) * 40), m = Math.floor(left / 60), s = Math.floor(left % 60);
      text(p, `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`, 960, 520, '900 260px "Roboto Mono"', left < 420 ? '#FF3B30' : '#FFFFFF');
      text(p, 'AVANT QUE TES BRAS LÂCHENT', 960, 740, '900 54px Montserrat', '#9FD0FF');
    } else {
      p.save(); cam2(p, 960 + dx, 600 + dy, push(st, 1.1, 1.2, 3)); lake(p, gt);
      hole(p, 960, 760, 520, 150);
      inWater(p, 960, 560, 200, gt, { t: gt, hair: myHat, e: shot === 'edge2' ? 'sad' : 'worried', seed: 2, light: 1 });
      [[-1, 640], [1, 1280]].forEach(([k, x]) => hand(p, x, 720, .7, k > 0 ? -.2 : Math.PI + .2, { sleeve: HOOD, cuff: HOOD2, open: true }));
      p.restore();
    }
    tags(p, gt);
  });
};
SC.sortie = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'map'], [at(5, .6), 'back'], [CUE.r4, 'pull'], [CUE.roll - .2, 'roll']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'map') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.06, 3)); lake(p, gt); p.restore();
      p.fillStyle = 'rgba(255,255,255,.35)'; p.fillRect(0, 0, SW, SH);
      p.fillStyle = '#6A8A5A'; p.fillRect(0, 880, SW, 200); text(p, 'RIVE', 960, 980, '900 50px Montserrat', '#FFFFFF');
      for (let i = 0; i < 7; i++) { const y = 860 - i * 60, x = 960 + Math.sin(i) * 20; rr(p, x - 14 + (i % 2) * 30, y - 20, 22, 36, 10); fs(p, '#5A6A80', 0); }
      hole(p, 980, 360, 140, 60);
      const k = clamp(st / 1.2); line(p, [[1120, 380], [1250, lerp(380, 700, k)]], 16, '#2EBD6B', null);
      rr(p, 1150, 520, 640, 90, 20); fs(p, 'rgba(10,12,20,.82)', 0); text(p, 'ELLE T\'A DÉJÀ PORTÉ', 1470, 568, '900 44px Montserrat', '#2EBD6B');
    } else if (shot === 'back') {
      p.save(); cam2(p, 960 + dx, 600 + dy, push(st, 1.1, 1.2, 3)); lake(p, gt);
      hole(p, 960, 760, 520, 150);
      inWater(p, 960, 560, 200, gt, { t: gt, hair: myHat, e: 'n', look: -1, lookY: .3, seed: 2, light: 1 });
      p.restore();
    } else {
      p.save(); cam2(p, 1100 + dx, 700 + dy, push(st, 1.3, 1.4, 3)); lake(p, gt);
      hole(p, 1450, 800, 260, 70);
      const roll = shot === 'roll', x = roll ? lerp(1150, 650, clamp(st / 2.4)) : lerp(1350, 1150, clamp(st / 3));
      lying(p, x, 790, .5, gt, { f: -1, kick: !roll, roll: roll ? st * 4 : 0 });
      p.restore();
      if (roll) { rr(p, 600, 830, 720, 100, 20); fs(p, 'rgba(10,12,20,.82)', 0); text(p, 'NE TE RELÈVE PAS', 960, 882, '900 60px Montserrat', '#FF3B30'); }
    }
    tags(p, gt);
  });
};
SC.ami = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'friend'], [CUE.fall - .3, 'fall'], [L(8), 'reach'], [CUE.call - .3, 'call'], [at(8, .75), 'face']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'friend') {
      p.save(); cam2(p, 960 + dx, 620 + dy, push(st, 1.05, 1.12, 3)); lake(p, gt);
      rig(p, { x: 1250, y: 835, s: .55, f: -1, t: gt, hair: frHat, col: FR, col2: FR2, e: 'happy', mouth: 'smile', look: -1, armF: [2.6, 0] });
      rig(p, { x: 600, y: 835, s: .55, f: 1, t: gt, hair: myHat, e: 'n', look: 1 });
      p.restore();
    } else if (shot === 'fall') {
      p.save(); cam2(p, 1200 + dx * 2, 640 + dy * 2, push(st, 1.2, 1.35, 2)); lake(p, gt);
      hole(p, 1250, 820, 260, 70);
      inWater(p, 1250, 740, 90, gt, { t: gt, col: FR, col2: FR2, hair: frHat, e: 'wide', mouth: 'o', seed: 4, light: 1 });
      if (st < .4) { p.fillStyle = 'rgba(255,255,255,.6)'; p.fillRect(-400, -200, 2800, 1400); }
      p.restore();
      rr(p, 650, 830, 620, 110, 20); fs(p, 'rgba(10,12,20,.82)', 0); text(p, 'NE COURS PAS', 960, 888, '900 70px Montserrat', '#FF3B30');
    } else if (shot === 'reach') {
      p.save(); cam2(p, 1000 + dx, 640 + dy, push(st, 1.05, 1.15, 3)); lake(p, gt);
      hole(p, 1450, 820, 260, 70);
      inWater(p, 1450, 740, 90, gt, { t: gt, col: FR, col2: FR2, hair: frHat, e: 'worried', seed: 4, light: 1 });
      const stick = (q, x, y) => line(q, [[x, y - 40], [x, y + 420]], 26, '#7A5A3A', null);
      lying(p, 700, 800, .5, gt, { f: 1 }); line(p, [[1010, 790], [1370, 770]], 20, '#7A5A3A', null);
      p.restore();
    } else if (shot === 'call') {
      p.save(); cam2(p, 960, 560, 1.15); lake(p, gt); p.restore(); p.fillStyle = 'rgba(10,20,40,.45)'; p.fillRect(0, 0, SW, SH);
      phoneBig(p, 960, 560, 1.2, -.03, scrCall('112', 'Appel en cours…', '#E53935'), { edge: '#5B6E8A' });
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); lake(p, gt); p.restore();
      bust(p, 960, 640, 230, { t: gt, hair: myHat, e: 'sad', seed: 2, light: 1 });
    }
    tags(p, gt);
  });
};
SC.fin = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 960, 560, push(lt, 1, 1.08, 3)); lake(p, gt); p.restore();
    p.fillStyle = 'rgba(10,20,40,.55)'; p.fillRect(0, 0, SW, SH);
    const s = pop(gt, L(9) + .1);
    if (s) { p.save(); p.translate(960, 420); p.scale(s, s); rr(p, -420, -80, 840, 160, 30); fs(p, '#F5B82E', 0); text(p, 'ENREGISTRE-LA', 0, 8, '900 70px Montserrat', '#1A1A20'); p.restore(); }
    const q = clamp((gt - L(9) - 1.2) * 2);
    if (q > 0) { p.globalAlpha = q; text(p, 'Tu connaissais la règle 5 ?', 960, 660, '800 60px Montserrat', '#FFFFFF'); text(p, 'Dis-le en commentaire', 960, 750, '700 40px Montserrat', '#9AA2BC'); p.globalAlpha = 1; }
  });
};
