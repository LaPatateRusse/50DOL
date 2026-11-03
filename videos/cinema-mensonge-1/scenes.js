// Cent euros le mensonge — Partie 1 (format cinéma : docs/style-cinema.md, kit engine/cinema.js).
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start;
const MOM = '#B5446E', MOMHAIR = '#4A2E22', POTE = '#3D7BD8';
const momHair = (c, r) => { c.fillStyle = MOMHAIR; circ(c, -r * .5, -r * .95, r * .36); c.fill(); c.beginPath(); c.arc(0, 0, r * 1.06, Math.PI * 1.02, Math.PI * 1.98); c.quadraticCurveTo(r * .3, -r * .62, -r * .2, -r * .55); c.quadraticCurveTo(-r * .7, -r * .5, -r * 1.06, -r * .05); c.fill(); };
const nan = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// ---------- compteurs du HUD ----------
function money(gt) {
  if (gt < CUE.m1) return [3, undefined];
  if (gt < CUE.m2) return [103, CUE.m1];
  if (gt < CUE.m3) return [203, CUE.m2];
  if (gt < CUE.roll) return [303, CUE.m3];
  if (gt < CUE.m4) { const k = pr(gt, CUE.roll, CUE.roll + 2.4); return [303 + 100 * Math.round(16 * eio(k)), k < 1 ? gt - .2 : CUE.roll + 2.2]; }
  return [2003, CUE.m4];
}
function hud(c, gt, id) {
  const [v, bump] = money(gt);
  const hearts = gt < CUE.heart1 ? 3 : gt < CUE.heart2 ? 2 : 1;
  const hit = gt < CUE.heart2 ? CUE.heart1 : CUE.heart2;
  cinemaHud(c, gt, { part: 'Partie 1', off: gt > CUE.endcard, day: gt < L(8) ? 0 : gt < CUE.day2 ? 1 : 2, dayAt: gt < CUE.day2 ? L(8) : CUE.day2,
    val: nan(v) + ' €', bump, sub: String(hearts), subIcon: heartIcon, hit });
}

// ---------- scènes ----------
SC.arret = (c, lt, gt) => stage(c, p => {
  p.save(); cam2(p, 1150, 600, push(lt, 1.22, 1.32, 9));
  streetNight(p, gt, { lampX: 1080 });
  busShelter(p, 1240, 830);
  const sx = lerp(-200, 1020, eo(pr(gt, L(1) - .8, L(1) + 1.2)));
  shadow(p, 1420, 830, 90); shadow(p, sx, 830, 80);
  hero(p, { x: 1420, y: 835, s: .6, f: -1, t: gt, eyes: gt > CUE.lie ? .05 : .3, look: gt > L(1) ? 1 : 0, front: [.1, .1] });
  stranger(p, sx, 835, .58, 1, { eyes: .4, arm: gt > L(1) + 1.6 && gt < CUE.lie + 1 });
  p.restore();
});
SC.pacte = (c, lt, gt) => stage(c, p => {
  if (gt < CUE.bus) {
    p.save(); cam2(p, 960, 540, push(lt, 1, 1.12, 7));
    p.fillStyle = grad(p, 0, 1080, ['#0B1024', '#1A2140']); p.fillRect(-200, -200, 2400, 1500);
    glow(p, 700, 300, 500, 'rgba(255,225,160,A)', .25);
    cone(p, 980, -80, 200, 1100, 1200, 'rgba(255,230,170,A)', .18);
    stranger(p, 980, 1740, 1.65, -1, { eyes: gt > CUE.smile ? .15 : .5, smile: gt > CUE.smile });
    p.restore();
    return;
  }
  // le bus passe, l'homme a disparu
  p.save(); cam2(p, 1220, 600, 1.3);
  streetNight(p, gt, { lampX: 1080 });
  busShelter(p, 1240, 830);
  shadow(p, 1420, 830, 90);
  hero(p, { x: 1420, y: 835, s: .6, f: -1, t: gt, eyes: gt > CUE.gone ? .9 : .2, look: 1 });
  if (gt < CUE.gone) stranger(p, 1020, 835, .58, 1, { eyes: .4 });
  const bx = lerp(-1600, 2600, pr(gt, CUE.bus, CUE.gone + .2));
  p.filter = 'blur(10px)'; rr(p, bx, 380, 1500, 470, 40); fs(p, '#3A6FD8', 0);
  p.fillStyle = 'rgba(255,240,200,.9)'; for (let i = 0; i < 7; i++) p.fillRect(bx + 80 + i * 200, 440, 150, 160);
  p.filter = 'none';
  p.restore();
});
SC.notif = (c, lt, gt) => stage(c, p => {
  p.fillStyle = '#0A0C14'; p.fillRect(0, 0, SW, SH);
  for (let i = 0; i < 14; i++) glow(p, rnd(i) * SW, rnd(i + 9) * SH, 60 + rnd(i + 4) * 90, i % 3 ? 'rgba(255,200,120,A)' : 'rgba(120,160,255,A)', .2);
  const sh = gt > CUE.buzz1 && gt < CUE.buzz1 + 1.2 ? Math.sin(gt * 90) * .02 : 0;
  const amt = gt < CUE.m1 ? '3,00 €' : '103,00 €';
  phoneBig(p, 960, 560 + (1 - eo(pr(lt, 0, .6))) * 200, 1.15, -.06 + sh, scrBank(amt, 'Compte courant', (q, w) => {
    notifBanner(q, w, pr(gt, CUE.buzz1, CUE.buzz1 + .4), 'Virement reçu|+100 €', gt > L(7) ? 'Motif : Premier mensonge' : 'De : —');
  }));
});
SC.maman = (c, lt, gt) => stage(c, p => {
  p.save(); cam2(p, 975, 640, push(lt, 1.22, 1.3));
  kitchenNight(p, gt, { day: true });
  p.fillStyle = 'rgba(255,236,200,.25)'; p.fillRect(-200, -200, 2400, 1500);
  shadow(p, 700, 900, 90); shadow(p, 1250, 900, 90);
  npc(p, 700, 900, .62, 1, MOM, { hair: MOMHAIR, bun: true, eyes: .1, smile: gt < L(8) + 1.6 });
  hero(p, { x: 1250, y: 905, s: .6, f: -1, t: gt, eyes: .1, look: gt > L(8) + 2.6 ? -1 : 1 });
  p.restore();
  if (gt > CUE.m2 - .1) { const k = pop(gt, CUE.m2); p.save(); p.translate(1250, 260); p.scale(k, k); text(p, '+100 €', 0, 0, '900 90px Montserrat', '#2EBD6B', 'center', 12, '#0B0C12'); p.restore(); }
}, { vig: .45 });
SC.prof = (c, lt, gt) => stage(c, p => {
  p.save(); cam2(p, 975, 640, push(lt, 1.22, 1.3));
  hallDay(p, gt);
  shadow(p, 760, 900, 100); shadow(p, 1220, 900, 90);
  teacher(p, 760, 905, .66, 1);
  hero(p, { x: 1220, y: 905, s: .6, f: -1, t: gt, eyes: .1, look: 1, front: gt > L(9) + 2.2 ? [2.4, .3] : undefined });
  p.restore();
  if (gt > CUE.m3 - .1) { const k = pop(gt, CUE.m3); p.save(); p.translate(1220, 260); p.scale(k, k); text(p, '+100 €', 0, 0, '900 90px Montserrat', '#2EBD6B', 'center', 12, '#0B0C12'); p.restore(); }
}, { vig: .45 });
SC.riche = (c, lt, gt) => stage(c, p => {
  if (gt < L(11)) { // pluie de notifications
    p.fillStyle = '#0A0C14'; p.fillRect(0, 0, SW, SH);
    const n = Math.round(16 * eio(pr(gt, CUE.roll, CUE.roll + 2.4)));
    phoneBig(p, 960, 560, 1.15, .05, (q, w, h) => {
      scrBank(nan(303 + 100 * n) + ',00 €')(q, w, h);
      for (let i = 0; i < Math.min(n, 5); i++) notifBanner(q, w, 1, 'Virement reçu|+100 €', 'Motif : Mensonge n° ' + (n + 3 - i), '#2EBD6B'), q.translate(0, 112);
    });
    return;
  }
  p.save(); cam2(p, 960, 540, push(gt - L(11), 1, 1.15, 4));
  p.fillStyle = grad(p, 0, 1080, ['#151A33', '#1D2342']); p.fillRect(-200, -200, 2400, 1500);
  glow(p, 960, 500, 600, 'rgba(255,190,90,A)', .18);
  const worried = gt > CUE.heart1 - .3;
  face(p, 960, 560, 230, { e: worried ? 'wide' : 'happy', mouth: worried ? 'o' : 'smile', look: worried ? 1 : 0, sweat: worried });
  p.restore();
});
SC.pote = (c, lt, gt) => stage(c, p => {
  p.save(); cam2(p, 950, 640, push(lt, 1.2, 1.3, 7));
  hallDay(p, gt);
  const fx = lerp(2100, 1180, eo(pr(gt, L(12) + .4, CUE.stop)));
  shadow(p, 720, 900, 90); shadow(p, fx, 900, 90);
  hero(p, { x: 720, y: 905, s: .6, f: 1, t: gt, eyes: gt > L(13) + .8 ? .9 : .3, front: gt > L(12) + 1.4 && gt < L(13) + .6 ? [2.6, .2] : undefined });
  npc(p, fx, 900, .62, -1, POTE, { cap: '#D83A3A', eyes: .1, walk: gt < CUE.stop ? gt * 10 : undefined });
  p.restore();
  if (gt > L(13) + .2) { const k = pop(gt, L(13) + .2); p.save(); p.translate(1180, 250); p.scale(k, k); rr(p, -150, -60, 300, 120, 30); fs(p, '#fff', 0); text(p, '?', 0, 4, '900 90px Montserrat', '#1d1d22'); p.restore(); }
}, { vig: .45 });
SC.comprends = (c, lt, gt) => stage(c, p => {
  p.save(); cam2(p, 960, 540, push(lt, 1, 1.14, 8));
  p.fillStyle = grad(p, 0, 1080, ['#0E1124', '#161B36']); p.fillRect(-200, -200, 2400, 1500);
  cone(p, 960, -60, 300, 1200, 1200, 'rgba(200,215,255,A)', .14);
  face(p, 960, 600, 240, { e: gt > L(15) ? 'sad' : 'wide', sweat: true, mouth: gt > L(15) ? undefined : 'o' });
  p.restore();
  [[L(15) + 2.6, 380, MOM, 'MAMAN', momHair], [L(15) + 4.2, 1540, '#7A6AA8', 'MAMIE', (q, r) => { q.beginPath(); q.arc(0, -r * .15, r * 1.05, Math.PI * .9, Math.PI * 2.1); q.lineWidth = r * .4; q.strokeStyle = '#E8E8EE'; q.stroke(); }]].forEach(([at, x, col, name, hair]) => {
    const k = pop(gt, at); if (!k) return;
    p.save(); p.translate(x, 470); p.scale(k, k); p.rotate(x < 960 ? -.06 : .06);
    rr(p, -150, -190, 300, 380, 10); fs(p, '#F4F1EA', 0);
    rr(p, -125, -165, 250, 250, 4); p.save(); p.clip(); p.fillStyle = '#2A3050'; p.fillRect(-125, -165, 250, 250); face(p, 0, -40, 70, { col, col2: col, hair, e: 'happy', mouth: 'smile' }); p.restore();
    text(p, name, 0, 140, '800 34px Montserrat', '#22232A');
    p.restore();
  });
});
SC.diner = (c, lt, gt) => stage(c, p => {
  const close = gt > L(17);
  p.save(); cam2(p, close ? 1180 : 960, close ? 560 : 620, close ? 1.8 : push(lt, 1.2, 1.28));
  kitchenNight(p, gt);
  npc(p, 1250, 960, .62, -1, MOM, { hair: MOMHAIR, bun: true, eyes: .1, smile: true });
  hero(p, { x: 680, y: 965, s: .6, f: 1, t: gt, eyes: close ? .05 : .2 });
  table(p, 960, 690, 1100);
  rr(p, 840, 650, 120, 40, 20); fs(p, '#E8E4DA', 0); rr(p, 1000, 650, 120, 40, 20); fs(p, '#E8E4DA', 0);
  p.restore();
});
SC.ding = (c, lt, gt) => stage(c, p => {
  if (gt < CUE.stare) {
    p.fillStyle = '#1A1418'; p.fillRect(0, 0, SW, SH); glow(p, 960, 200, 700, 'rgba(255,200,130,A)', .22);
    rr(p, -100, 700, 2200, 500, 0); fs(p, '#5A3A28', 0);
    const sh = gt > CUE.buzz2 && gt < CUE.buzz2 + 1.2 ? Math.sin(gt * 90) * .02 : 0;
    phoneBig(p, 960, 560, 1.1, .08 + sh, scrBank(gt < CUE.m4 ? '1 903,00 €' : '2 003,00 €', 'Compte courant', (q, w) => notifBanner(q, w, pr(gt, CUE.buzz2, CUE.buzz2 + .4), 'Virement reçu|+100 €', 'Motif : « Oui, super. »')), { hand: false });
    return;
  }
  p.save(); cam2(p, 960, 540, push(gt - CUE.stare, 1, 1.18, 5));
  p.fillStyle = grad(p, 0, 1080, ['#2A2230', '#1A141C']); p.fillRect(-200, -200, 2400, 1500);
  glow(p, 960, 200, 600, 'rgba(255,200,130,A)', .3);
  const lost = gt > CUE.heart2 - .2;
  face(p, 960, 600, 240, { col: MOM, col2: '#93365A', hair: momHair, e: lost ? 'wide' : 'n', mouth: lost ? 'o' : undefined, rim: 'rgba(255,200,140,.7)' });
  p.restore();
});
SC.fin = (c, lt, gt) => {
  stage(c, p => {
    p.fillStyle = '#07080C'; p.fillRect(0, 0, SW, SH);
    const k = pr(gt, CUE.msg, CUE.msg + .4) + pr(gt, CUE.msg2, CUE.msg2 + .4);
    phoneBig(p, 960, 560 + (1 - eo(pr(lt, 0, .5))) * 160, 1.15, -.04, scrMsg('Numéro inconnu', ['Plus qu\'une.', 'Tu continues ?'], k / 2), { edge: '#555' });
  });
  cinemaEnd(c, gt, CUE.endcard, 'PARTIE 2', 'Tu aurais menti ?');
};
