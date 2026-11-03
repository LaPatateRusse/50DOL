// Cent euros le mensonge — Partie 1 (format cinéma : docs/style-cinema.md, kits engine/cinema.js + cinema-rig.js).
// Chaque scène est découpée en plans de 1 à 3 s ; personnages articulés (rig / bust), post-traitement film().
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k; // instant à la fraction k de la phrase i
const MOM = '#B5446E', MOM2 = '#93365A', MOMHAIR = '#4A2E22', POTE = '#3D7BD8', POTE2 = '#2C5FAE', COAT = '#6E717D', COAT2 = '#55585F';
const nan = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// ---------- coiffures / chapeaux (repère de la tête : centre hc, rayon r, +x = regard) ----------
const momHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); c.fillStyle = MOMHAIR;
  circ(c, -r * .62, -r * .9, r * .38); c.fill(); c.beginPath(); c.arc(0, 0, r * 1.07, Math.PI * 1.0, Math.PI * 1.95); c.quadraticCurveTo(r * .3, -r * .6, -r * .1, -r * .55); c.quadraticCurveTo(-r * .7, -r * .45, -r * 1.07, 0); c.fill(); c.restore(); };
const hatHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  rr(c, -r * 1.45, -r * .86, r * 2.9, r * .26, r * .13); fs(c, '#1B1C22', 0);
  rr(c, -r * .92, -r * 1.85, r * 1.84, r * 1.05, [r * .35, r * .35, 6, 6]); fs(c, '#1B1C22', 0);
  c.fillStyle = '#7A2A2A'; c.fillRect(-r * .92, -r * 1.02, r * 1.84, r * .18);
  c.beginPath(); c.moveTo(-r * .92, -r * 1.8); c.lineTo(-r * .5, -r * 1.85); c.lineTo(-r * .6, -r * .9); c.lineTo(-r * .92, -r * .9); c.fillStyle = 'rgba(255,230,180,.12)'; c.fill(); c.restore(); };
const capHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .1, r * 1.03, Math.PI * 1.02, Math.PI * 1.98); c.closePath(); fs(c, '#D83A3A', 0);
  rr(c, r * .2, -r * .45, r * 1.05, r * .2, r * .1); fs(c, '#B02828', 0); circ(c, 0, -r * 1.1, r * .08); fs(c, '#B02828', 0); c.restore(); };
const profHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, 0, r * 1.04, Math.PI * .85, Math.PI * 1.35); c.lineWidth = r * .22; c.strokeStyle = '#B8BCC6'; c.stroke();
  c.lineWidth = r * .05; c.strokeStyle = '#E8C46A'; [r * .0, r * .5].forEach(x => { circ(c, x, -r * .05, r * .2); c.stroke(); }); c.restore(); };

// ---------- compteurs du HUD ----------
function money(gt) {
  if (gt < CUE.m1) return [3, undefined];
  if (gt < CUE.m2) return [103, CUE.m1];
  if (gt < CUE.m3) return [203, CUE.m2];
  if (gt < CUE.roll) return [303, CUE.m3];
  if (gt < CUE.m4) { const k = pr(gt, CUE.roll, CUE.roll + 3.4); return [303 + 100 * Math.round(16 * eio(k)), k < 1 ? gt - .2 : CUE.roll + 3.2]; }
  return [2003, CUE.m4];
}
function hud(c, gt, id) {
  const [v, bump] = money(gt);
  const hearts = gt < CUE.heart1 ? 3 : gt < CUE.heart2 ? 2 : 1;
  const hit = gt < CUE.heart2 ? CUE.heart1 : CUE.heart2;
  cinemaHud(c, gt, { part: 'Partie 1', off: gt > CUE.endcard, day: gt < L(8) ? 0 : gt < CUE.day2 ? 1 : 2, dayAt: gt < CUE.day2 ? L(8) : CUE.day2,
    val: nan(v) + ' €', bump, sub: String(hearts), subIcon: heartIcon, hit });
}
const plus100 = (p, gt, cue, x, y) => { if (gt < cue - .05) return; const k = pop(gt, cue), up = (gt - cue) * 40; p.save(); p.globalAlpha = clamp(2.2 - (gt - cue)); p.translate(x, y - up); p.scale(k, k); text(p, '+100 €', 0, 0, '900 96px Montserrat', '#3DDC84', 'center', 14, '#0B0C12'); p.restore(); };

// ---------- décors communs ----------
function street(p, gt, o = {}) {
  streetNight(p, gt, { lampX: 1080 });
  busShelter(p, 1240, 830);
  rr(p, 1290, 700, 300, 22, 8); fs(p, '#4A5068', 0); line(p, [[1310, 720], [1310, 830]], 10, '#3A4054', null); line(p, [[1570, 720], [1570, 830]], 10, '#3A4054', null);
  if (o.rain !== false) { p.save(); p.globalAlpha = .35; for (let i = 0; i < 120; i++) { const x = (i * 197) % 2300 - 200, y = ((i * 263 + gt * 1500) % 1300) - 150; line(p, [[x, y], [x - 8, y + 36]], 3, '#C9D6F0', null); } p.restore(); }
  p.fillStyle = 'rgba(255,220,150,.08)'; p.fillRect(-400, 840, 2800, 200); // reflet du trottoir mouillé
}
function kitchen(p, gt, day) {
  kitchenNight(p, gt, { day });
  wallpaper(p, 640, -200, 640, 1000, day ? '#CDB99E' : '#3A2E38', day ? 'rgba(160,120,90,.25)' : 'rgba(120,90,110,.25)');
  frame(p, 760, 260, 180, 220, (q, x, y) => { q.fillStyle = '#7FA6D8'; q.fillRect(x - 80, y - 100, 160, 200); circ(q, x, y + 10, 40); fs(q, '#0E0E14', 0); });
  frame(p, 1000, 300, 150, 150, (q, x, y) => { q.fillStyle = '#E5B85C'; q.fillRect(x - 70, y - 70, 140, 140); });
  plant(p, 1780, 780, 1.1);
  rr(p, 120, 560, 520, 30, 6); fs(p, day ? '#E8DCC8' : '#5A4A52', 0);
  if (!day) { cone(p, 960, 290, 200, 1000, 560, 'rgba(255,200,130,A)', .28); glow(p, 960, 300, 260, 'rgba(255,200,130,A)', .5); }
}

// ---------- scènes ----------
SC.arret = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'run'], [at(0, .58), 'phone'], [L(1), 'bench'], [at(1, .42), 'ots'], [L(2), 'liar']]);
  film(c, gt, p => {
    if (shot === 'run') {
      const hx = kf(st, [[0, -150], [1.9, 900]]), stop = st > 1.9;
      const [dx, dy] = hand2(gt);
      p.save(); cam2(p, lerp(700, 1000, eo(clamp(st / 2.2))) + dx, 600 + dy, 1.25);
      street(p, gt);
      const bx = 980 + st * 330; rr(p, bx, 380, 1100, 440, 36); fs(p, '#2F5FC0', 0); p.fillStyle = 'rgba(255,240,200,.85)'; for (let i = 0; i < 5; i++) p.fillRect(bx + 60 + i * 200, 440, 150, 150);
      glow(p, bx + 10, 760, 90, 'rgba(255,40,40,A)', .9);
      shadow(p, hx, 832, 80);
      rig(p, { x: hx, y: 835, s: .62, f: 1, t: gt, pose: stop ? 'stand' : 'run', walk: gt * 11, lean: stop ? .25 + Math.sin(gt * 9) * .03 : 0, armF: stop ? [.5, .3] : undefined, armB: stop ? [.4, .3] : undefined, e: stop ? 'sad' : 'wide', mouth: stop ? 'o' : undefined, light: 1 });
      p.restore();
    } else if (shot === 'phone') {
      p.fillStyle = '#0A0C14'; p.fillRect(0, 0, SW, SH);
      for (let i = 0; i < 16; i++) glow(p, rnd(i) * SW, rnd(i + 9) * SH, 60 + rnd(i + 4) * 100, i % 3 ? 'rgba(255,200,120,A)' : 'rgba(120,160,255,A)', .22);
      phoneHeld(p, 960 + Math.sin(gt) * 10, 560 + (1 - eo(clamp(st / .5))) * 160, 1.05, -.05 + Math.sin(gt * .8) * .02, scrBank('3,00 €', 'Compte courant'), { thumb: Math.max(0, Math.sin(st * 6)) });
    } else if (shot === 'bench') {
      const sx = kf(st, [[0, -300], [2.0, 980]]);
      p.save(); cam2(p, 1150 + Math.sin(gt * .6) * 8, 610, push(st, 1.3, 1.36, 3));
      street(p, gt);
      shadow(p, 1440, 832, 80); shadow(p, sx, 832, 80);
      rig(p, { x: 1440, y: 835, s: .6, f: -1, t: gt, pose: 'sit', seat: 125 / .6, armF: [.5, -.6], armB: [.4, -.5], e: st > 1.5 ? 'n' : 'sad', look: st > 1.2 ? 1 : 0, lookY: st > 1.2 ? 0 : .8, tilt: st > 1.2 ? 0 : .12, light: -1, seed: 1 });
      rig(p, { x: sx, y: 835, s: .6, f: 1, t: gt, pose: st < 2 ? 'walk' : 'stand', walk: gt * 7, col: COAT, col2: COAT2, pants: '#24262E', hair: hatHair, e: 'n', seed: 3, light: 1 });
      p.restore();
    } else if (shot === 'ots') {
      p.save(); cam2(p, 820, 520, 1.9 + st * .02);
      street(p, gt);
      rig(p, { x: 760, y: 835, s: .6, f: 1, t: gt, col: COAT, col2: COAT2, pants: '#24262E', hair: hatHair, e: 'n', talk: talking(gt, at(1, .45), E(1)), armF: kf(st, [[0, [.1, .1]], [.6, [1.3, -.25]]]), tilt: -.08, seed: 3, light: 1 });
      p.restore();
      blurred(p, 10, q => { bust(q, 1660, 640, 240, { t: gt, look: -1, light: -1 }); });
    } else {
      p.save(); cam2(p, 960, 540, push(st, 1, 1.08, 3));
      p.fillStyle = grad(p, 0, 1080, ['#0B1024', '#1A2140']); p.fillRect(-200, -200, 2400, 1500);
      glow(p, 600, 250, 500, 'rgba(255,225,160,A)', .25);
      bust(p, 960, 540, 230, { t: gt, e: 'side', look: 1, talk: talking(gt, at(2, .35), E(2) - .1), sweat: st > 1.2, light: -1, handUp: kf(st, [[0, 0], [.8, .45], [2, .45]]) });
      p.restore();
    }
  });
};
SC.pacte = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'smile'], [L(4), 'coin'], [at(4, .62), 'palm'], [L(5), 'bus']]);
  film(c, gt, p => {
    if (shot === 'smile') {
      const fl = gt % 2.7 < .08 ? .6 : 1;
      p.save(); cam2(p, 960, 560, push(st, 1, 1.15, 3));
      p.fillStyle = grad(p, 0, 1080, ['#0B1024', '#1A2140']); p.fillRect(-200, -200, 2400, 1500);
      cone(p, 980, -80, 200, 1100, 1200, 'rgba(255,230,170,A)', .2 * fl);
      bust(p, 960, 560, 210, { t: gt, col: COAT, col2: COAT2, hair: hatHair, e: st > .9 ? 'happy' : 'side', mouth: st > .5 ? 'smile' : 'flat', talk: talking(gt, L(3) + 1.1, E(3)), light: 1, rim: 'rgba(255,230,180,.6)', seed: 3 });
      p.restore();
    } else if (shot === 'coin') {
      p.save(); cam2(p, 940, 470, 1.55);
      street(p, gt);
      rig(p, { x: 900, y: 835, s: .6, f: 1, t: gt, col: COAT, col2: COAT2, pants: '#24262E', hair: hatHair, e: 'happy', mouth: 'smile', talk: talking(gt, L(4), E(4)), armF: [2.5, .5], seed: 3, light: 1,
        holdF: (q, x, y) => { q.scale(1, 1); coin(q, x + 6, y - 40, 22, gt); } });
      p.restore();
    } else if (shot === 'palm') {
      p.fillStyle = grad(p, 0, 1080, ['#141830', '#0A0C16']); p.fillRect(0, 0, SW, SH);
      glow(p, 980, 520, 500, 'rgba(255,215,140,A)', .2);
      hand(p, 640, 900, 2.2, -.55, { open: true });
      const fall = eo(clamp(st / .7)); coin(p, 980, lerp(-80, 520, fall) - Math.max(0, Math.sin(clamp((st - .7) / .4) * Math.PI)) * 40, 46, gt);
    } else {
      const [dx, dy] = hand2(gt);
      p.save(); cam2(p, 1200 + dx, 600 + dy, 1.32);
      street(p, gt);
      const gone = gt > CUE.gone;
      shadow(p, 1440, 832, 80);
      rig(p, { x: 1440, y: 835, s: .6, f: -1, t: gt, pose: gone ? 'stand' : 'sit', seat: 125 / .6, e: gone ? 'wide' : 'n', look: gone ? Math.sin(gt * 2.4) : 1, armF: [.6, -.9], seed: 1, light: -1,
        holdF: (q, x, y) => coin(q, x + 10, y - 16, 16, gt) });
      if (!gone) rig(p, { x: 980, y: 835, s: .6, f: 1, t: gt, col: COAT, col2: COAT2, pants: '#24262E', hair: hatHair, e: 'happy', seed: 3, light: 1 });
      const bx = lerp(-1700, 2600, pr(gt, CUE.bus, CUE.gone + .25));
      p.filter = 'blur(12px)'; rr(p, bx, 360, 1500, 480, 40); fs(p, '#2F5FC0', 0);
      p.fillStyle = 'rgba(255,240,200,.95)'; for (let i = 0; i < 7; i++) p.fillRect(bx + 80 + i * 200, 420, 150, 170);
      p.filter = 'none'; glow(p, bx + 1500, 760, 260, 'rgba(255,250,220,A)', .9);
      p.restore();
    }
  });
};
SC.notif = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'buzz'], [L(7), 'zoom']]);
  film(c, gt, p => {
    p.fillStyle = '#0A0C14'; p.fillRect(0, 0, SW, SH);
    for (let i = 0; i < 16; i++) glow(p, rnd(i) * SW, rnd(i + 9) * SH, 60 + rnd(i + 4) * 100, i % 3 ? 'rgba(255,200,120,A)' : 'rgba(120,160,255,A)', .22);
    const sh = gt > CUE.buzz1 && gt < CUE.buzz1 + 1.1 ? Math.sin(gt * 90) * .025 : 0;
    const scr = scrBank(gt < CUE.m1 ? '3,00 €' : '103,00 €', 'Compte courant', (q, w) => notifBanner(q, w, pr(gt, CUE.buzz1, CUE.buzz1 + .4), 'Virement reçu|+100 €', gt > L(7) + .4 ? 'Motif : Premier mensonge' : 'De : —'));
    if (shot === 'buzz') phoneHeld(p, 960, 560, 1.05, -.05 + sh, scr);
    else { p.save(); cam2(p, 960, 230, kf(st, [[0, 1.2], [1.2, 2.3]])); phoneHeld(p, 960, 560, 1.05, -.05, scr); p.restore(); }
  });
};
SC.maman = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wide'], [at(8, .5), 'liar'], [at(8, .8), 'wide2']]);
  film(c, gt, p => {
    if (shot === 'liar') {
      p.save(); cam2(p, 960, 540, push(st, 1, 1.06, 2));
      kitchen(p, gt, true);
      p.restore();
      blurred(p, 8, q => kitchen(q, gt, true));
      bust(p, 960, 560, 220, { t: gt, e: st < .7 ? 'side' : 'happy', look: 1, talk: talking(gt, at(8, .55), at(8, .72)), mouth: 'smile', light: 1, seed: 1 });
      return;
    }
    const [dx, dy] = hand2(gt, .6);
    p.save(); cam2(p, 975 + dx, 640 + dy, push(lt, 1.25, 1.32, 4));
    kitchen(p, gt, true);
    shadow(p, 640, 900, 90); shadow(p, 1260, 900, 90);
    rig(p, { x: 640, y: 905, s: .62, f: 1, t: gt, col: MOM, col2: MOM2, pants: '#3A3040', hair: momHair, e: 'n', talk: talking(gt, at(8, .18), at(8, .45)), armF: [.9 + Math.sin(gt * 3) * .1, -.8], armB: [.3, .2], tilt: .05, seed: 2,
      holdF: (q, x, y) => { rr(q, x - 4, y - 50, 44, 56, 8); fs(q, '#F2F2F2', 0); line(q, [[x + 40, y - 40], [x + 54, y - 22], [x + 40, y - 8]], 6, '#F2F2F2', null); } });
    rig(p, { x: 1260, y: 905, s: .6, f: -1, t: gt, e: shot === 'wide2' ? 'happy' : 'n', armF: shot === 'wide2' ? [2.6, -1.6] : [.2, .2], seed: 1, light: 1 });
    p.restore();
    plus100(p, gt, CUE.m2, 1260, 230);
  });
};
SC.prof = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wide'], [at(9, .55), 'thumb']]);
  film(c, gt, p => {
    if (shot === 'thumb') {
      blurred(p, 8, q => { hallDay(q, gt); });
      bust(p, 960, 560, 220, { t: gt, e: 'happy', mouth: 'smile', talk: talking(gt, at(9, .58), at(9, .78)), light: -1, seed: 1 });
      const k = eo(clamp(st / .4)); hand(p, 1340, 1150 - k * 400, 1.6, -1.2, { point: false });
      circ(p, 1430, 680 - k * 0, 0);
      plus100(p, gt, CUE.m3, 1400, 260);
      return;
    }
    const [dx, dy] = hand2(gt, .6);
    p.save(); cam2(p, 950 + dx, 630 + dy, push(lt, 1.25, 1.33, 4));
    hallDay(p, gt);
    shadow(p, 740, 900, 100); shadow(p, 1230, 900, 90);
    rig(p, { x: 740, y: 905, s: .66, f: 1, t: gt, col: '#7A5A44', col2: '#5E4433', pants: '#2E3446', hair: profHair, e: 'angry', talk: talking(gt, at(9, .05), at(9, .5)), armF: [1.1, -1.4], seed: 4,
      holdF: (q, x, y) => { rr(q, x - 30, y - 70, 70, 90, 4); fs(q, '#F4F1EA', 0); } });
    rig(p, { x: 1230, y: 905, s: .6, f: -1, t: gt, e: 'n', look: 1, seed: 1, light: 1 });
    p.restore();
  });
};
SC.riche = (c, lt, gt) => {
  const t0 = L(10), cut = D(10) / 4;
  const [shot, st] = shots(gt, [[t0, 'notifs'], [t0 + cut, 'bags'], [t0 + cut * 2, 'burger'], [t0 + cut * 3, 'notifs2'], [L(11), 'smile']]);
  film(c, gt, p => {
    if (shot === 'notifs' || shot === 'notifs2') {
      p.fillStyle = '#0A0C14'; p.fillRect(0, 0, SW, SH); glow(p, 960, 540, 700, 'rgba(60,220,130,A)', .12);
      const n = Math.round(16 * eio(pr(gt, CUE.roll, CUE.roll + 3.4)));
      phoneHeld(p, 960, 560, 1.05, shot === 'notifs' ? .05 : -.06, (q, w, h) => {
        scrBank(nan(303 + 100 * n) + ',00 €')(q, w, h);
        for (let i = 0; i < Math.min(n, 5); i++) notifBanner(q, w, 1, 'Virement reçu|+100 €', 'Motif : Mensonge n° ' + (n + 3 - i), '#2EBD6B'), q.translate(0, 112);
      });
    } else if (shot === 'bags') {
      p.save(); cam2(p, 960, 560, 1.3 + st * .05);
      p.fillStyle = grad(p, 0, 1080, ['#E9EEF5', '#C9D2E0']); p.fillRect(-200, -200, 2400, 1500);
      for (let i = 0; i < 6; i++) { rr(p, 60 + i * 320, 200, 260, 520, 10); fs(p, ['#E85D75', '#4A90E2', '#F5B82E'][i % 3], 0); p.fillStyle = 'rgba(255,255,255,.5)'; p.fillRect(80 + i * 320, 260, 220, 20); }
      p.fillStyle = '#9AA6B8'; p.fillRect(-200, 820, 2400, 400);
      rig(p, { x: lerp(500, 1300, st / cut), y: 905, s: .62, f: 1, t: gt, pose: 'walk', walk: gt * 8, e: 'happy', mouth: 'smile', seed: 1,
        holdF: (q, x, y) => { rr(q, x - 40, y, 90, 110, 8); fs(q, '#1D1D22', 0); line(q, [[x - 20, y], [x, y - 20], [x + 30, y]], 6, '#1D1D22', null); text(q, 'LUXE', x + 5, y + 55, '800 18px Montserrat', '#F5B82E'); } });
      p.restore();
    } else if (shot === 'burger') {
      p.fillStyle = grad(p, 0, 1080, ['#3A2418', '#1E120C']); p.fillRect(0, 0, SW, SH); glow(p, 960, 300, 700, 'rgba(255,190,110,A)', .3);
      bust(p, 900, 560, 220, { t: gt, e: 'happy', mouth: Math.sin(gt * 14) > 0 ? 'talk' : 'flat', light: 1, seed: 1 });
      const bx = 1180 - eo(clamp(st / .3)) * 60, by = 700;
      rr(p, bx - 120, by - 40, 240, 50, 25); fs(p, '#E0A050', 0); rr(p, bx - 125, by + 8, 250, 26, 8); fs(p, '#5A3020', 0); rr(p, bx - 120, by + 34, 240, 16, 4); fs(p, '#6CBF4A', 0); rr(p, bx - 115, by + 50, 230, 34, 16); fs(p, '#E0A050', 0);
      hand(p, bx + 80, by + 260, 1.3, -1.9, {});
    } else {
      p.save(); cam2(p, 960, 540, push(st, 1, 1.12, 4));
      p.fillStyle = grad(p, 0, 1080, ['#151A33', '#1D2342']); p.fillRect(-200, -200, 2400, 1500);
      glow(p, 960, 500, 600, 'rgba(255,190,90,A)', .18);
      const worried = gt > CUE.heart1 - .3;
      bust(p, 960, 560, 230, { t: gt, e: worried ? 'worried' : 'happy', mouth: worried ? 'o' : 'smile', look: worried ? 1 : 0, lookY: worried ? -1 : 0, sweat: worried, light: -1, seed: 1, tilt: worried ? -.06 : .04 });
      p.restore();
    }
  });
};
SC.pote = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wave'], [L(13) - .15, 'pote'], [at(13, .8), 'drop']]);
  film(c, gt, p => {
    if (shot === 'wave') {
      const fx = lerp(2100, 1200, eo(pr(gt, L(12) + .3, L(13) - .2)));
      p.save(); cam2(p, 950, 640, push(st, 1.22, 1.3, 4));
      hallDay(p, gt);
      shadow(p, 720, 900, 90); shadow(p, fx, 900, 90);
      const waving = gt > at(12, .5);
      rig(p, { x: 720, y: 905, s: .6, f: 1, t: gt, e: waving ? 'happy' : 'n', mouth: 'smile', armF: waving ? [2.9, -.5 + Math.sin(gt * 10) * .45] : [.2, .2], seed: 1, light: -1 });
      rig(p, { x: fx, y: 905, s: .62, f: -1, t: gt, pose: fx > 1210 ? 'walk' : 'stand', walk: gt * 7, col: POTE, col2: POTE2, hair: capHair, e: 'n', seed: 5, light: -1 });
      p.restore();
    } else if (shot === 'pote') {
      blurred(p, 8, q => hallDay(q, gt));
      p.save(); cam2(p, 960, 540, push(st, 1, 1.06, 2));
      bust(p, 960, 560, 220, { t: gt, col: POTE, col2: POTE2, hair: capHair, e: 'n', talk: talking(gt, L(13), E(13) - .1), tilt: kf(st, [[0, 0], [.6, .14]]), lookY: .2, light: 1, seed: 5 });
      p.restore();
    } else {
      blurred(p, 8, q => hallDay(q, gt));
      bust(p, 960, 560, 220, { t: gt, e: 'wide', mouth: 'o', light: -1, seed: 1, handUp: kf(st, [[0, .6], [.8, 0]]) });
    }
  });
};
SC.comprends = (c, lt, gt) => film(c, gt, p => {
  p.save(); cam2(p, 960, 540, push(lt, 1, 1.18, 9));
  p.fillStyle = grad(p, 0, 1080, ['#0E1124', '#161B36']); p.fillRect(-200, -200, 2400, 1500);
  cone(p, 960, -60, 300, 1200, 1200, 'rgba(200,215,255,A)', .14);
  dust(p, gt, 40);
  bust(p, 960, 600, 240, { t: gt, e: gt > L(15) ? 'sad' : 'wide', sweat: true, mouth: gt > L(15) ? 'frown' : 'o', light: -1, seed: 1, look: Math.sin(gt * .7) * .5 });
  p.restore();
  [[at(15, .55), 380, MOM, MOM2, 'MAMAN', momHair], [at(15, .8), 1540, '#7A6AA8', '#5E5088', 'MAMIE', (q, r) => { q.beginPath(); q.arc(0, -r * .15, r * 1.05, Math.PI * .9, Math.PI * 2.1); q.lineWidth = r * .4; q.strokeStyle = '#E8E8EE'; q.stroke(); }]].forEach(([a, x, col, col2, name, hair]) => {
    const k = pop(gt, a); if (!k) return;
    p.save(); p.translate(x, 470 + Math.sin(gt * 1.3 + x) * 8); p.scale(k, k); p.rotate((x < 960 ? -.06 : .06) + Math.sin(gt + x) * .02);
    rr(p, -150, -190, 300, 380, 10); fs(p, '#F4F1EA', 0);
    rr(p, -125, -165, 250, 250, 4); p.save(); p.clip(); p.fillStyle = '#2A3050'; p.fillRect(-125, -165, 250, 250); bust(p, 0, -40, 70, { t: gt, col, col2, hair, e: 'happy', mouth: 'smile', blink: false }); p.restore();
    text(p, name, 0, 140, '800 34px Montserrat', '#22232A');
    p.restore();
  });
});
SC.diner = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wide'], [at(16, .5), 'mom'], [L(17), 'me']]);
  film(c, gt, p => {
    if (shot === 'wide') {
      p.save(); cam2(p, 960, 600, push(st, 1.18, 1.26, 3));
      kitchen(p, gt, false);
      rig(p, { x: 1250, y: 960, s: .62, f: -1, t: gt, pose: 'sit', seat: 270 / .62, col: MOM, col2: MOM2, pants: '#3A3040', hair: momHair, e: 'n', armF: [1.6 + Math.max(0, Math.sin(gt * 2)) * .6, -1.6], seed: 2, light: -1 });
      rig(p, { x: 680, y: 960, s: .6, f: 1, t: gt, pose: 'sit', seat: 270 / .6, e: 'n', armF: [1.5, -1.3 + Math.sin(gt * 2.5) * .2], seed: 1, light: 1 });
      table(p, 960, 690, 1100);
      rr(p, 820, 650, 130, 40, 20); fs(p, '#E8E4DA', 0); rr(p, 980, 650, 130, 40, 20); fs(p, '#E8E4DA', 0);
      [[860, 640], [1040, 640]].forEach(([x, y]) => { p.save(); p.globalAlpha = .4; for (let i = 0; i < 3; i++) line(p, [[x + i * 16, y - 10 - ((gt * 30 + i * 20) % 60)], [x + i * 16 + 6, y - 40 - ((gt * 30 + i * 20) % 60)]], 4, '#fff', null); p.restore(); });
      p.restore();
    } else {
      blurred(p, 9, q => { cam2(q, 960, 500, 1.4); kitchen(q, gt, false); });
      if (shot === 'mom') bust(p, 960, 580, 220, { t: gt, col: MOM, col2: MOM2, hair: momHair, e: 'n', mouth: 'smile', talk: talking(gt, at(16, .55), E(16)), light: 1, rim: 'rgba(255,200,140,.8)', seed: 2 });
      else bust(p, 960, 580, 220, { t: gt, e: st > .9 ? 'happy' : 'n', mouth: 'smile', talk: talking(gt, at(17, .55), E(17)), light: -1, rim: 'rgba(255,200,140,.8)', seed: 1 });
    }
  });
};
SC.ding = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'phone'], [L(19), 'stare'], [L(20), 'who'], [at(20, .85), 'me']]);
  film(c, gt, p => {
    if (shot === 'phone') {
      p.fillStyle = '#1A1418'; p.fillRect(0, 0, SW, SH); glow(p, 960, 200, 700, 'rgba(255,200,130,A)', .22);
      p.fillStyle = '#5A3A28'; p.fillRect(0, 0, SW, SH); for (let i = 0; i < 12; i++) { p.fillStyle = 'rgba(0,0,0,.08)'; p.fillRect(0, i * 95, SW, 6); }
      glow(p, 960, 540, 800, 'rgba(255,200,130,A)', .25);
      rr(p, 1350, 380, 70, 520, 30); fs(p, '#C9CCD6', 0); // fourchette
      const sh = gt > CUE.buzz2 && gt < CUE.buzz2 + 1.1 ? Math.sin(gt * 80) * 10 : 0;
      p.save(); cam2(p, 960, 540, push(st, 1, 1.1, 3));
      phoneBig(p, 960 + sh, 560, 1.05, .1 + sh * .003, scrBank(gt < CUE.m4 ? '1 903,00 €' : '2 003,00 €', 'Compte courant', (q, w) => notifBanner(q, w, pr(gt, CUE.buzz2, CUE.buzz2 + .4), 'Virement reçu|+100 €', 'Motif : « Oui, super. »')), { hand: false });
      p.restore();
      return;
    }
    blurred(p, 9, q => { cam2(q, 960, 500, 1.4); kitchen(q, gt, false); });
    p.save(); cam2(p, 960, 560, shot === 'me' ? 1 : push(gt - L(19), 1, 1.22, 4));
    if (shot === 'me') bust(p, 960, 580, 230, { t: gt, e: 'wide', mouth: 'o', sweat: true, light: -1, rim: 'rgba(255,200,140,.8)', seed: 1, blink: false });
    else bust(p, 960, 580, 220, { t: gt, col: MOM, col2: MOM2, hair: momHair, e: shot === 'who' ? 'worried' : 'n', blink: shot !== 'stare', talk: shot === 'who' && talking(gt, L(20) + .2, E(20) - .1), tilt: shot === 'who' ? .1 : 0, light: 1, rim: 'rgba(255,200,140,.8)', seed: 2 });
    p.restore();
  }, { vig: .75 });
};
SC.fin = (c, lt, gt) => {
  film(c, gt, p => {
    p.fillStyle = '#07080C'; p.fillRect(0, 0, SW, SH);
    const k = pr(gt, CUE.msg, CUE.msg + .4) + pr(gt, CUE.msg2, CUE.msg2 + .4);
    p.save(); cam2(p, 960, 540, push(lt, 1, 1.12, 5));
    phoneHeld(p, 960, 560 + (1 - eo(pr(lt, 0, .5))) * 160, 1.05, -.04 + Math.sin(gt * 9) * (gt > CUE.msg && gt < CUE.msg + .8 ? .02 : 0), scrMsg('Numéro inconnu', ['Plus qu\'une.', 'Tu continues ?'], k / 2), { edge: '#555' });
    p.restore();
  });
  cinemaEnd(c, gt, CUE.endcard, 'PARTIE 2', 'Tu aurais menti ?');
};
