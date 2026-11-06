// Le répondeur — Partie 1 : nouvelle mini-série d'horreur, style cinéma (cinema.js + cinema-rig.js). Histoire originale.
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const MAMIE = '#8A5A8A', MAMIE2 = '#6E466E';

const kidHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .05, r * 1.04, Math.PI * 1.05, Math.PI * 1.95); c.quadraticCurveTo(r * .5, -r * .7, 0, -r * .62); c.quadraticCurveTo(-r * .6, -r * .72, -r * 1.0, -r * .3); c.closePath(); fs(c, '#4A2E1E', 0); c.restore(); };
const greyHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .05, r * 1.06, Math.PI * 1.0, Math.PI * 2.0); c.closePath(); fs(c, '#D8D8DE', 0);
  circ(c, -r * .2, -r * 1.05, r * .38); fs(c, '#CACAD2', 0); c.restore(); };

// ---------- décors ----------
function farmDay(p, gt) {
  p.fillStyle = grad(p, 0, 600, ['#9ED0EE', '#E6F2F8']); p.fillRect(-400, -200, 2800, 900);
  for (let i = 0; i < 8; i++) { p.beginPath(); p.ellipse(-200 + i * 380, 600, 320, 120, 0, Math.PI, 0); fs(p, i % 2 ? '#7FAA5A' : '#8FBA6A', 0); }
  p.fillStyle = '#7FAA5A'; p.fillRect(-400, 600, 2800, 700);
  rr(p, 700, 260, 620, 420, 6); fs(p, '#E8DCC4', 0);
  p.beginPath(); p.moveTo(660, 270); p.lineTo(1010, 80); p.lineTo(1360, 270); p.closePath(); fs(p, '#9A4A3A', 0);
  rr(p, 940, 470, 140, 210, 6); fs(p, '#6B4A30', 0);
  [[770, 360], [1170, 360]].forEach(([x, y]) => { rr(p, x, y, 120, 100, 4); fs(p, '#9CC3E6', 8, '#FFFFFF'); });
  rr(p, 1220, 120, 40, 100, 4); fs(p, '#7A3A2A', 0);
}
function livingDay(p, gt) {
  p.fillStyle = grad(p, 0, 780, ['#D8C4A0', '#C8B08A']); p.fillRect(-400, -200, 2800, 1100);
  for (let x = -400; x < 2400; x += 90) { p.fillStyle = 'rgba(150,110,70,.15)'; p.fillRect(x, -200, 30, 980); }
  p.fillStyle = '#7A5A40'; p.fillRect(-400, 780, 2800, 500);
  rr(p, 1400, 160, 300, 260, 6); fs(p, '#BFE3F5', 12, '#6B4A30');
  rr(p, 500, 520, 620, 30, 8); fs(p, '#6B4630', 0); line(p, [[540, 550], [540, 780]], 20, '#4A3020', null); line(p, [[1080, 550], [1080, 780]], 20, '#4A3020', null);
}
function stairsDark(p, gt, light) {
  p.fillStyle = grad(p, 0, 1080, ['#0A0B12', '#141624']); p.fillRect(-400, -200, 2800, 1400);
  for (let i = 0; i < 9; i++) { rr(p, 500 + i * 110, 160 + i * 80, 900, 80, 0); fs(p, '#1E1C26', 3, '#0A0A10'); }
  if (light) { const k = clamp(light); glow(p, 1500, 980, 600, 'rgba(255,214,140,A)', .55 * k); p.fillStyle = `rgba(255,214,140,${.5 * k})`; p.fillRect(1300, 880, 520, 300); }
  line(p, [[480, 120], [1420, 820]], 12, '#2A2430', null);
}
function phoneFixed(p, x, y, s, ring) { // vieux téléphone fixe
  const sh = ring ? Math.sin(performance.now ? 0 : 0) : 0;
  p.save(); p.translate(x, y); p.scale(s, s); if (ring) p.rotate(Math.sin(ring * 60) * .05);
  rr(p, -110, -50, 220, 100, 22); fs(p, '#7A1E1E', 0);
  rr(p, -130, -100, 260, 50, 25); fs(p, '#5A1414', 0);
  circ(p, 0, 0, 34); fs(p, '#E8DCC4', 0); circ(p, 0, 0, 12); fs(p, '#5A1414', 0);
  p.restore();
}
function machine(p, x, y, s, gt, o = {}) { // répondeur à cassette
  p.save(); p.translate(x, y); p.scale(s, s);
  rr(p, -220, -90, 440, 180, 20); fs(p, '#2A2A30', 0); rr(p, -220, -90, 440, 26, 12); fs(p, '#3A3A42', 0);
  rr(p, -190, -50, 200, 110, 10); fs(p, '#14141A', 0); circ(p, -140, 5, 26); fs(p, '#5A5A62', 0); circ(p, -40, 5, 26); fs(p, '#5A5A62', 0);
  if (o.play) for (const cx of [-140, -40]) { const a = gt * 6; line(p, [[cx + Math.cos(a) * 20, 5 + Math.sin(a) * 20], [cx - Math.cos(a) * 20, 5 - Math.sin(a) * 20]], 5, '#2A2A30', null); }
  const on = o.blink ? Math.sin(gt * 10) > 0 : false;
  circ(p, 70, -30, 16); fs(p, on ? '#FF2A2A' : '#5A1A1A', 0); if (on) glow(p, 70, -30, 70, 'rgba(255,40,40,A)', .6);
  rr(p, 110, -50, 80, 44, 6); fs(p, '#0A0A0E', 0); text(p, o.count || '0', 150, -26, '700 34px "Roboto Mono"', '#FF3B3B');
  [[70, 40, '▶'], [130, 40, '■'], [190, 40, '✕']].forEach(([bx, by, l]) => { rr(p, bx - 24, by - 18, 48, 36, 8); fs(p, o.play && l === '▶' ? '#5A8A5A' : '#4A4A52', 0); text(p, l, bx, by + 2, '700 22px Montserrat', '#E8E8EE'); });
  if (o.label) { p.save(); p.rotate(-.03); rr(p, -200, 100, 400, 60, 4); fs(p, '#E8D9A8', 0); text(p, 'NE JAMAIS ÉCOUTER APRÈS MINUIT', 0, 132, '700 20px Montserrat', '#5A3A1A'); p.restore(); }
  p.restore();
}
function wave(p, x, y, w, gt, amp) { p.save(); p.strokeStyle = '#FF5A5A'; p.lineWidth = 6; p.beginPath(); for (let i = 0; i <= 60; i++) { const xx = x - w / 2 + i * w / 60, yy = y + Math.sin(i * .9 + gt * 14) * amp * (0.4 + .6 * Math.abs(Math.sin(i * .37 + gt * 3))); i ? p.lineTo(xx, yy) : p.moveTo(xx, yy); } p.stroke(); p.restore(); }

function hud(c, gt) {
  let val = '23:58', neg = false, bump;
  if (gt < L(1)) { val = 'MESSAGE : 00:12'; neg = true; }
  else if (gt < L(4)) val = 'CHEZ MAMIE';
  else if (gt < CUE.time) val = '00:1' + Math.min(2, Math.floor(clamp((gt - L(4)) / (CUE.time - L(4))) * 3));
  else { val = '1 MESSAGE'; neg = true; bump = CUE.time; }
  cinemaHud(c, gt, { part: 'Le répondeur', off: gt > CUE.endcard, val, neg, bump });
}
const me = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, hair: kidHair, seed: 2, light: 1, rim: 'rgba(255,226,170,.9)', ...o });
const mamie = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, col: MAMIE, col2: MAMIE2, hair: greyHair, seed: 6, light: -1, rim: 'rgba(255,226,170,.9)', ...o });

// ---------- scènes ----------
SC.flash = (c, lt, gt) => {
  film(c, gt, p => {
    p.fillStyle = '#07080C'; p.fillRect(0, 0, SW, SH);
    p.save(); cam2(p, 960, 540, push(lt, 1.6, 1.9, 4)); machine(p, 960, 560, 1.6, gt, { blink: true, play: true, count: '1' }); p.restore();
    wave(p, 960, 900, 900, gt, 50);
  });
};
SC.maison = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'farm'], [at(1, .55), 'table'], [CUE.label - .4, 'label'], [L(3), 'mamie']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt);
    if (shot === 'farm') { p.save(); cam2(p, 1010 + dx, 400 + dy, push(st, 1.0, 1.1, 3)); farmDay(p, gt); p.restore(); }
    else if (shot === 'table') { p.save(); cam2(p, 810 + dx, 500 + dy, push(st, 1.2, 1.35, 3)); livingDay(p, gt); phoneFixed(p, 640, 470, .9); machine(p, 920, 450, .7, gt, {}); p.restore(); }
    else if (shot === 'label') { p.save(); cam2(p, 960, 620, push(st, 1.9, 2.1, 3)); livingDay(p, gt); machine(p, 960, 520, 1.0, gt, { label: true }); p.restore(); }
    else { p.save(); cam2(p, 960, 560, push(st, 1, 1.06, 2)); livingDay(p, gt); p.restore(); mamie(p, 960, 640, 230, gt, { e: 'happy', mouth: 'smile', talk: talking(gt, L(3), E(3)) }); }
  });
};
SC.nuit = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'bed'], [CUE.ring1 - .2, 'phone'], [CUE.click - .2, 'machine'], [L(5), 'blink']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, .6);
    if (shot === 'bed') { p.save(); cam2(p, 760 + dx, 560 + dy, push(st, 1.1, 1.2, 3)); bedroomNight(p, gt, { clock: '00:11' }); p.restore(); }
    else if (shot === 'phone') { p.save(); cam2(p, 800, 500, push(st, 1.4, 1.6, 3)); livingDay(p, gt); p.fillStyle = 'rgba(5,8,20,.75)'; p.fillRect(-400, -200, 2800, 1400); const r = (gt > CUE.ring1 && gt < CUE.ring1 + .6) || (gt > CUE.ring2 && gt < CUE.ring2 + .6); phoneFixed(p, 640, 470, .9, r ? gt : 0); machine(p, 920, 450, .7, gt, {}); if (r) glow(p, 640, 470, 200, 'rgba(255,240,200,A)', .2); p.restore(); }
    else if (shot === 'machine') { p.save(); cam2(p, 920, 470, push(st, 1.8, 2.0, 3)); livingDay(p, gt); p.fillStyle = 'rgba(5,8,20,.75)'; p.fillRect(-400, -200, 2800, 1400); machine(p, 920, 450, .7, gt, { play: true }); p.restore(); }
    else { p.save(); cam2(p, 960, 540, push(st, 1.4, 1.6, 4)); p.fillStyle = '#07080C'; p.fillRect(-400, -200, 2800, 1400); machine(p, 960, 540, 1.2, gt, { blink: gt > CUE.blink, count: gt > CUE.blink ? '1' : '0' }); p.restore();
      const s = pop(gt, CUE.time); if (s) { p.save(); p.translate(960, 900); p.scale(s, s); text(p, 'REÇU À 00:12', 0, 0, '900 70px Montserrat', '#FF3B30'); p.restore(); } }
  });
};
SC.message = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'play'], [at(6, .55), 'face'], [CUE.warn - .1, 'warn']]);
  film(c, gt, p => {
    if (shot === 'play') { p.fillStyle = '#07080C'; p.fillRect(0, 0, SW, SH); p.save(); cam2(p, 960, 540, push(st, 1.3, 1.5, 3)); machine(p, 960, 500, 1.2, gt, { blink: true, play: gt > CUE.play, count: '1' }); p.restore(); if (gt > CUE.play) wave(p, 960, 880, 900, gt, gt > CUE.voice ? 60 : 15); }
    else if (shot === 'face') { p.save(); cam2(p, 960, 560, push(st, 1, 1.06, 2)); bedroomNight(p, gt, { clock: '00:14' }); p.restore(); p.fillStyle = 'rgba(0,0,10,.35)'; p.fillRect(0, 0, SW, SH); me(p, 960, 640, 230, gt, { e: 'wide', mouth: 'o' }); }
    else { p.fillStyle = '#07080C'; p.fillRect(0, 0, SW, SH); wave(p, 960, 760, 1300, gt, 80);
      const s = pop(gt, CUE.warn); if (s) { p.save(); p.translate(960, 360); p.scale(s, s); text(p, '« CE N\'EST PAS MAMIE. »', 0, 0, '900 78px Montserrat', '#FF3B30'); p.restore(); } }
  });
};
SC.fin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'stairs'], [CUE.call - .2, 'me'], [L(9), 'stairs2']]);
  film(c, gt, p => {
    if (shot === 'stairs' || shot === 'stairs2') { p.save(); cam2(p, 1100, 600, push(st, 1.1, 1.25, 4)); stairsDark(p, gt, (gt - CUE.light) * 3); p.restore();
      if (gt > CUE.light + .8) { p.save(); p.globalAlpha = .9; p.fillStyle = '#0A0A10'; p.beginPath(); p.ellipse(1520, 880, 40, 140, 0, 0, Math.PI * 2); p.fill(); circ(p, 1520, 720, 42); p.fill(); p.restore(); } }
    else { p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2.5)); stairsDark(p, gt, 1); p.restore(); p.fillStyle = 'rgba(0,0,10,.3)'; p.fillRect(0, 0, SW, SH); me(p, 960, 640, 230, gt, { e: 'worried', look: 1, lookY: .4 }); }
  });
  cinemaEnd(c, gt, CUE.endcard, 'PARTIE 2', 'Tu descends ? OUI / NON');
};
