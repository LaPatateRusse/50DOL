// Le répondeur — Partie 2, style cinéma (cinema.js + cinema-rig.js). Histoire originale.
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

function doorClose(p, gt, o = {}) { // porte de chambre vue de l'intérieur, filet de lumière dessous
  p.fillStyle = grad(p, 0, 1080, ['#121630', '#1A1F3A']); p.fillRect(-400, -200, 2800, 1400);
  p.fillStyle = '#0E1122'; p.fillRect(-400, 860, 2800, 400);
  rr(p, 700, 60, 520, 800, 6); fs(p, '#3A2A24', 0); rr(p, 740, 100, 440, 340, 6); fs(p, null, 6, '#2A1E1A'); rr(p, 740, 480, 440, 340, 6); fs(p, null, 6, '#2A1E1A');
  p.save(); p.translate(1140, 470); p.rotate(o.turn || 0); rr(p, -60, -12, 80, 24, 10); fs(p, '#C9A24A', 0); p.restore(); circ(p, 1140, 470, 22); fs(p, '#C9A24A', 0);
  if (o.light !== undefined) { p.fillStyle = `rgba(255,214,140,${o.light})`; p.fillRect(700, 856, 520, 10); glow(p, 960, 870, 300, 'rgba(255,214,140,A)', .3 * o.light); }
  if (o.feet) { p.fillStyle = '#0A0A0E'; [880, 1010].forEach(x => { p.beginPath(); p.ellipse(x, 862, 50, 9, 0, 0, Math.PI * 2); p.fill(); }); }
  if (o.chair) { line(p, [[1140, 500], [1340, 860]], 22, '#6B4A30', null); line(p, [[1300, 640], [1500, 860]], 18, '#6B4A30', null); rr(p, 1240, 620, 200, 30, 8); fs(p, '#7A5638', 0); }
}
function kitchenMorning(p, gt) { kitchenNight(p, gt, { day: true }); }
function letter(p, x, y, s, gt, o = {}) {
  p.save(); p.translate(x, y); p.rotate(-.06); p.scale(s, s);
  rr(p, -220, -150, 440, 300, 6); fs(p, '#F1E6CC', 0);
  for (let i = 0; i < 6; i++) line(p, [[-180, -90 + i * 40], [180 - (i % 3) * 40, -90 + i * 40]], 4, 'rgba(60,40,30,.55)', null);
  if (o.date) text(p, 'NUIT DU 7 NOVEMBRE', 0, -120, '700 26px "Roboto Mono"', '#8A2A1A');
  text(p, '— Papy', 120, 130, 'italic 700 30px Montserrat', '#3A2A1A');
  p.restore();
}
function hud(c, gt) {
  let val = '00:20', neg = false, bump;
  if (gt < L(1)) { val = 'PIEDS NUS'; neg = true; }
  else if (gt < L(3)) val = '00:2' + Math.min(9, Math.floor(clamp((gt - L(1)) / (L(3) - L(1))) * 6));
  else if (gt < L(8)) { val = 'NE RÉPONDS PAS'; neg = true; bump = gt > CUE.rule ? CUE.rule : undefined; }
  else if (gt < CUE.date) val = '06:00';
  else { val = 'LETTRE DE PAPY'; neg = true; bump = CUE.date; }
  cinemaHud(c, gt, { part: 'Le répondeur', off: gt > CUE.endcard, val, neg, bump });
}
const me = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, hair: kidHair, seed: 2, light: 1, rim: 'rgba(255,226,170,.9)', ...o });
const mamie = (p, x, y, r, gt, o = {}) => bust(p, x, y, r, { t: gt, col: MAMIE, col2: MAMIE2, hair: greyHair, seed: 6, light: -1, rim: 'rgba(255,226,170,.9)', ...o });

// ---------- scènes ----------
SC.flash = (c, lt, gt) => {
  film(c, gt, p => { p.save(); cam2(p, 960, 820, push(lt, 1.8, 2.1, 4)); doorClose(p, gt, { light: .8, feet: true }); p.restore(); });
};
SC.chambre = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'face'], [CUE.lock - .3, 'lock'], [L(2), 'listen']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, .6);
    if (shot === 'face') { p.save(); cam2(p, 960, 560, push(st, 1, 1.06, 2)); bedroomNight(p, gt, { clock: '00:19' }); p.restore(); p.fillStyle = 'rgba(0,0,10,.3)'; p.fillRect(0, 0, SW, SH); me(p, 960, 640, 230, gt, { e: 'worried', look: -1 }); }
    else if (shot === 'lock') { p.save(); cam2(p, 1100 + dx, 560 + dy, push(st, 1.1, 1.25, 3)); doorClose(p, gt, { chair: gt > CUE.chair, turn: gt > CUE.lock && gt < CUE.lock + .4 ? .6 : 0 }); p.restore();
      if (gt > CUE.lock) { const s = pop(gt, CUE.lock); p.save(); p.translate(560, 300); p.scale(s, s); text(p, '🔒', 0, 0, '900 120px Montserrat', '#F5B82E'); p.restore(); } }
    else { p.save(); cam2(p, 760, 560, push(st, 1.1, 1.2, 3)); bedroomNight(p, gt, { clock: '00:20' }); p.restore(); const s = pop(gt, at(2, .3)); if (s) { p.save(); p.translate(960, 900); p.scale(s, s); rr(p, -440, -60, 880, 120, 26); fs(p, 'rgba(10,12,20,.82)', 0); text(p, '« LE CHOCOLAT VA REFROIDIR »', 0, 8, '900 46px Montserrat', '#F7C88A'); p.restore(); } }
  });
};
SC.escalier = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 1000, 600, push(lt, 1.1, 1.3, 5)); stairsDark(p, gt, .6);
    const k = clamp((gt - CUE.step1 + .3) / (CUE.step2 - CUE.step1 + 1.5)), sx = lerp(1450, 1100, k), sy = lerp(860, 600, k);
    if (gt > CUE.step1 - .3) { p.fillStyle = 'rgba(5,5,8,.9)'; p.beginPath(); p.ellipse(sx, sy - 160, 50, 170, 0, 0, Math.PI * 2); p.fill(); circ(p, sx, sy - 360, 46); p.fill(); }
    p.restore();
  });
};
SC.porte = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'handle'], [CUE.feet - .3, 'feet'], [at(5, .6), 'face']]);
  film(c, gt, p => {
    const [dx, dy] = hand2(gt, .5);
    if (shot === 'handle') { p.save(); cam2(p, 1140 + dx, 470 + dy, push(st, 2.0, 2.3, 4)); doorClose(p, gt, { chair: true, light: .6, turn: gt > CUE.handle ? Math.sin(clamp((gt - CUE.handle) / 1.2) * Math.PI) * .7 : 0 }); p.restore(); }
    else if (shot === 'feet') { p.save(); cam2(p, 960, 840, push(st, 2.0, 2.3, 4)); doorClose(p, gt, { chair: true, light: .8, feet: true }); p.restore(); }
    else { p.save(); cam2(p, 960, 560, push(st, 1, 1.06, 2)); bedroomNight(p, gt, { clock: '00:31' }); p.restore(); p.fillStyle = 'rgba(0,0,10,.35)'; p.fillRect(0, 0, SW, SH); me(p, 960, 640, 230, gt, { e: 'wide', mouth: 'o', sweat: true });
      const s = pop(gt, CUE.cold - .4); if (s) { p.save(); p.translate(960, 220); p.scale(s, s); text(p, 'MAMIE A TOUJOURS FROID', 0, 0, '900 60px Montserrat', '#FF3B30'); p.restore(); } }
  });
};
SC.repondeur = (c, lt, gt) => {
  film(c, gt, p => {
    p.fillStyle = '#07080C'; p.fillRect(0, 0, SW, SH);
    p.save(); cam2(p, 960, 520, push(lt, 1.3, 1.5, 5)); machine(p, 960, 480, 1.2, gt, { blink: true, play: gt > CUE.mach, count: '2' }); p.restore();
    if (gt > CUE.mach) wave(p, 960, 840, 1000, gt, gt > CUE.rule ? 70 : 25);
    const s = pop(gt, CUE.rule + .3); if (s) { p.save(); p.translate(960, 980); p.scale(s, s); text(p, '« NE DIS RIEN. JUSQU\'AU MATIN. »', 0, 0, '900 54px Montserrat', '#FF3B30'); p.restore(); }
  });
};
SC.matin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'door'], [at(8, .55), 'kitchen']]);
  film(c, gt, p => {
    if (shot === 'door') { p.save(); cam2(p, 960, 760, push(st, 1.5, 1.7, 3)); doorClose(p, gt, { chair: true }); p.fillStyle = `rgba(255,220,160,${.25 * clamp((gt - CUE.sun) / 1.5)})`; p.fillRect(-400, -200, 2800, 1400); p.restore(); }
    else { p.save(); cam2(p, 960, 560, push(st, 1, 1.06, 2)); kitchenMorning(p, gt); p.restore(); mamie(p, 960, 640, 230, gt, { e: 'happy', mouth: 'smile', look: 1 });
      for (let i = 0; i < 3; i++) text(p, '♪', 1260 + i * 70, 340 - ((gt * 60 + i * 40) % 120), '900 60px Montserrat', 'rgba(255,255,255,.8)'); }
  });
};
SC.fin = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'table'], [CUE.date - .3, 'letter'], [L(10), 'me']]);
  film(c, gt, p => {
    if (shot === 'table') { p.save(); cam2(p, 960, 620, push(st, 1.3, 1.45, 3)); kitchenMorning(p, gt); table(p, 960, 620, 900); if (gt > CUE.letter) letter(p, 960, 560, .7, gt); p.restore(); }
    else if (shot === 'letter') { p.save(); cam2(p, 960, 540, push(st, 1.0, 1.08, 3)); p.fillStyle = '#5A3E2A'; p.fillRect(-400, -200, 2800, 1400); letter(p, 960, 540, 1.8, gt, { date: true }); p.restore(); }
    else { p.save(); cam2(p, 960, 560, push(st, 1, 1.06, 2)); kitchenMorning(p, gt); p.restore(); me(p, 960, 640, 230, gt, { e: 'worried', lookY: .5 }); }
  });
  cinemaEnd(c, gt, CUE.endcard, 'PARTIE 3', 'Tu ouvres la lettre ? OUI / NON');
};
