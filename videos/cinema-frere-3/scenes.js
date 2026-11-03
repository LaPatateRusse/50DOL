// Le secret de mon frère — Partie 3 (kits : cinema.js, cinema-rig.js, MK, FK). Bras : coude entre 0 et 1,2.
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const LEO = { col: FK.LEO, col2: FK.LEO2, pants: '#1E2029', hair: FK.leoHair, seed: 4 };
const MAMAN = { col: FK.MAMAN, col2: FK.MAMAN2, pants: '#3A3040', hair: FK.mamanHair, seed: 2 };
const ME = { seed: 1 };
const VOISINE = { col: '#7A6AA8', col2: '#5E5088', pants: '#3A3348', hair: (c, r, hc) => { c.save(); c.translate(hc[0], hc[1]); c.beginPath(); c.arc(0, -r * .1, r * 1.08, Math.PI * .95, Math.PI * 2.05); c.lineWidth = r * .32; c.strokeStyle = '#D8D8E0'; c.stroke(); c.restore(); }, seed: 6 };

function jarVal(gt) { return gt < CUE.c1 ? [0] : gt < CUE.c2 ? [180, CUE.c1] : gt < CUE.c3 ? [220, CUE.c2] : [260, CUE.c3]; }
function hud(c, gt) {
  const [v, bump] = jarVal(gt);
  cinemaHud(c, gt, { part: 'Partie 3', off: gt > CUE.endcard, day: gt < L(6) ? 3 : gt < L(8) ? 4 : 5, dayAt: gt < L(8) ? L(6) : L(8), val: v + ' €', bump, sub: '0', subIcon: FK.ballIcon });
}
const stands = (p, gt) => { FK.stadium(p, gt, { day: true }); };
const mopper = (p, x, y, s, gt, f = 1) => rig(p, Object.assign({ x, y, s, f, t: gt, e: 'sad', lean: .15 + Math.sin(gt * 3) * .05, lookY: .7,
  armF: [.75 + Math.sin(gt * 3) * .15, .5], armB: [.6 + Math.sin(gt * 3) * .15, .6], holdF: (q, hx, hy) => FK.mop(q, hx - 10, hy - 40, .9) }, LEO));
const plus = (p, gt, cue, txt, x, y) => { if (gt < cue - .05) return; const k = pop(gt, cue); p.save(); p.globalAlpha = clamp(2.2 - (gt - cue)); p.translate(x, y - (gt - cue) * 40); p.scale(k, k); text(p, txt, 0, 0, '900 90px Montserrat', '#3DDC84', 'center', 14, '#0B0C12'); p.restore(); };
function bakeryIn(p) { p.fillStyle = grad(p, 0, 820, ['#E8C9A0', '#D9B488']); p.fillRect(-300, -200, 2600, 1100);
  for (let i = 0; i < 5; i++) { rr(p, 120 + i * 360, 200, 300, 40, 6); fs(p, '#8A5A34', 0); for (let k = 0; k < 6; k++) { p.save(); p.translate(150 + i * 360 + k * 45, 190); p.rotate(-.3); rr(p, -12, -90, 24, 110, 12); fs(p, '#D99A4E', 0); p.restore(); } }
  p.fillStyle = '#6A4428'; p.fillRect(-300, 620, 2600, 500); p.fillStyle = '#F2EAD8'; p.fillRect(-300, 600, 2600, 30); glow(p, 960, 100, 900, 'rgba(255,240,200,A)', .3); }
function landing(p) { p.fillStyle = grad(p, 0, 820, ['#6A7A6A', '#5A6A5A']); p.fillRect(-300, -200, 2600, 1100); p.fillStyle = '#3A4038'; p.fillRect(-300, 820, 2600, 400);
  rr(p, 1200, 220, 300, 600, 6); fs(p, '#5A3A28', 0); circ(p, 1460, 540, 12); fs(p, '#D9B04A', 0); lamp(p, 900, 60, 220); }

SC.flash = (c, lt, gt) => film(c, gt, p => {
  p.save(); cam2(p, 960, 520, push(lt, 1.6, 1.8, 2.5)); stands(p, gt);
  rig(p, Object.assign({ x: 1060, y: 610, s: .5, f: -1, t: gt, e: 'angry', pose: 'sit', seat: 0 }, MAMAN)); mopper(p, 860, 610, .5, gt);
  p.restore();
});
SC.refus = (c, lt, gt) => film(c, gt, p => {
  blurred(p, 10, q => { cam2(q, 760, 500, 1.4); FK.shared(q, gt); });
  p.save(); cam2(p, 960, 560, push(lt, 1, 1.08, 4));
  if (gt < at(1, .3)) bust(p, 960, 600, 230, Object.assign({ t: gt, e: 'n', look: 1, light: -1 }, ME));
  else bust(p, 960, 600, 220, Object.assign({ t: gt, e: 'sad', talk: talking(gt, at(1, .4), E(1)), tilt: Math.sin(gt * 5) * .06, light: 1 }, LEO));
  p.restore();
}, { vig: .7 });
SC.plan = (c, lt, gt) => film(c, gt, p => {
  p.save(); cam2(p, 960, 560, push(lt, 1, 1.15, 4)); p.fillStyle = grad(p, 0, 1080, ['#2A2440', '#1A1630']); p.fillRect(-200, -200, 2400, 1500); glow(p, 960, 300, 600, 'rgba(255,200,140,A)', .2);
  bust(p, 960, 600, 230, Object.assign({ t: gt, e: lt > 1.5 ? 'angry' : 'n', mouth: 'flat', light: -1 }, ME));
  const k = pop(gt, L(2) + .4); if (k) { p.save(); p.translate(1500, 300); p.scale(k, k); text(p, '260 €', 0, 0, '900 110px Montserrat', '#F5B82E', 'center', 14, '#0B0C12'); p.restore(); }
  p.restore();
});
SC.vente = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'console'], [L(4), 'manga'], [L(5), 'bakery']]);
  film(c, gt, p => {
    if (shot === 'console') { p.fillStyle = '#12101C'; p.fillRect(0, 0, SW, SH); glow(p, 960, 540, 700, 'rgba(60,220,130,A)', .1);
      phoneHeld(p, 960, 560, 1.05, -.04, (q, w, h) => { q.fillStyle = '#101218'; q.fillRect(0, 0, w, h); text(q, 'Annonces', 30, 70, '800 24px Montserrat', '#fff', 'left'); rr(q, 20, 110, w - 40, 260, 16); fs(q, '#1A1D26', 0); rr(q, 60, 140, w - 120, 150, 10); fs(q, '#2A2E3A', 0); rr(q, 110, 180, w - 220, 70, 30); fs(q, '#15151C', 0);
        text(q, 'Console + 2 manettes', 40, 320, '700 20px Montserrat', '#fff', 'left'); text(q, '180 €', w - 40, 320, '900 22px Montserrat', '#3DDC84', 'right'); if (gt > CUE.c1) { q.save(); q.translate(w / 2, 220); q.rotate(-.2); rr(q, -110, -36, 220, 72, 10); fs(q, '#E5484D', 0); text(q, 'VENDU', 0, 2, '900 40px Montserrat', '#fff'); q.restore(); } });
      plus(p, gt, CUE.c1, '+180 €', 1450, 300); }
    else if (shot === 'manga') { p.save(); cam2(p, 1000, 600, push(st, 1.35, 1.42, 3)); landing(p);
      rig(p, Object.assign({ x: 820, y: 905, s: .55, f: 1, t: gt, e: 'happy', mouth: 'smile', armF: [1.3, .9], holdF: (q, x, y) => { for (let i = 0; i < 4; i++) { rr(q, x - 30, y - 30 - i * 22, 90, 20, 3); fs(q, ['#E85D75', '#4A90E2', '#F5B82E', '#3DDC84'][i], 0); } } }, ME));
      rig(p, Object.assign({ x: 1150, y: 905, s: .58, f: -1, t: gt, e: 'happy', mouth: 'smile', armF: [1.2, .3] }, VOISINE)); p.restore(); plus(p, gt, CUE.c2, '+40 €', 1000, 260); }
    else { p.save(); cam2(p, 960, 600, push(st, 1.3, 1.38, 3)); bakeryIn(p);
      rig(p, Object.assign({ x: kf(st, [[0, 600], [3, 1200]]), y: 905, s: .55, f: 1, t: gt, pose: 'walk', walk: gt * 7, e: 'happy', armF: [1.3, .8], holdF: (q, x, y) => { for (let i = 0; i < 4; i++) { q.save(); q.translate(x + 10, y - 20); q.rotate(-.9 + i * .12); rr(q, -12, -90, 24, 120, 12); fs(q, '#D99A4E', 0); q.restore(); } } }, ME));
      p.restore(); text(p, '6:00', 200, 160, '700 60px "Roboto Mono"', '#5A3A22'); plus(p, gt, CUE.c3, '+40 €', 1450, 260); }
  });
};
SC.bocal = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'jar'], [at(6, .5), 'note'], [L(7), 'read'], [at(7, .6), 'dark']]);
  film(c, gt, p => {
    if (shot === 'jar') { p.save(); cam2(p, 1420, 600, push(st, 1.6, 1.75, 3)); FK.shared(p, gt); FK.jar(p, 1420, 640, .7, 9); p.restore(); }
    else if (shot === 'note') { p.fillStyle = '#1E1A2C'; p.fillRect(0, 0, SW, SH); glow(p, 960, 500, 700, 'rgba(255,220,170,A)', .25); p.save(); cam2(p, 960, 560, push(st, 1, 1.12, 3)); p.rotate(-.03);
      rr(p, 560, 220, 800, 640, 8); fs(p, '#FFF6DC', 0); ['Ta nuit de samedi :', '260 €.', 'Va jouer.'].forEach((l, i) => text(p, l, 960, 380 + i * 130, 'italic 700 74px Montserrat', i === 2 ? '#C83A4A' : '#2A3A6A')); p.restore(); }
    else if (shot === 'read') { blurred(p, 10, q => { cam2(q, 1300, 500, 1.4); FK.shared(q, gt); }); bust(p, 960, 600, 220, Object.assign({ t: gt, e: 'sad', lookY: .7, light: 1, rim: 'rgba(255,220,170,.9)' }, LEO)); MK.tear(p, 1040, 610, gt, L(7) + .8); }
    else { const k = pr(gt, at(7, .7), at(7, .7) + .3); blurred(p, 10, q => { cam2(q, 1300, 500, 1.4); FK.shared(q, gt); }); bust(p, 960, 600, 220, Object.assign({ t: gt, e: 'closed', blink: false, light: 1 }, LEO)); p.fillStyle = `rgba(0,0,0,${k * .9})`; p.fillRect(0, 0, SW, SH); }
  }, { vig: .7 });
};
SC.samedi = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'bed'], [at(8, .55), 'bag']]);
  film(c, gt, p => {
    if (shot === 'bed') { p.save(); cam2(p, 1300, 600, push(st, 1.4, 1.5, 3)); FK.shared(p, gt); p.fillStyle = 'rgba(255,230,180,.12)'; p.fillRect(-300, -200, 2600, 1500); rr(p, 1350, 560, 150, 60, 8); fs(p, '#0A0A0E', 0); text(p, '09:00', 1425, 590, '700 40px "Roboto Mono"', '#FF3B3B'); p.restore(); }
    else { p.fillStyle = '#2A2440'; p.fillRect(0, 0, SW, SH); glow(p, 960, 500, 700, 'rgba(255,230,180,A)', .25); p.save(); cam2(p, 960, 600, push(st, 1, 1.15, 3));
      rr(p, 560, 460, 800, 360, 80); fs(p, '#15151C', 0); rr(p, 760, 400, 400, 90, 40); fs(p, null, 22, '#15151C'); text(p, 'FC LES TOURS', 960, 650, '900 64px Montserrat', '#F5B82E'); p.restore(); }
  });
};
SC.stade = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'run'], [at(9, .5), 'stands'], [CUE.mom - .3, 'mom']]);
  film(c, gt, p => {
    if (shot === 'run') { p.save(); cam2(p, kf(st, [[0, 600], [2.5, 1200]]), 640, 1.4); stands(p, gt); rig(p, Object.assign({ x: kf(st, [[0, 300], [2.5, 1300]]), y: 905, s: .55, f: 1, t: gt, pose: 'run', walk: gt * 12, e: 'wide' }, ME)); p.restore(); }
    else if (shot === 'stands') { p.save(); cam2(p, 860, 520, push(st, 1.7, 1.8, 3)); stands(p, gt); mopper(p, 860, 610, .5, gt); p.restore(); }
    else { p.save(); cam2(p, 960, 560, push(st, 1, 1.12, 4)); p.fillStyle = grad(p, 0, 1080, ['#7FB2E8', '#CFE3F5']); p.fillRect(-200, -200, 2400, 1500);
      bust(p, 960, 600, 220, Object.assign({ t: gt, e: 'angry', mouth: 'flat', blink: false, light: 1, rim: 'rgba(255,245,220,.95)', look: -.6 }, MAMAN)); p.restore(); }
  });
  cinemaEnd(c, gt, CUE.endcard, 'PARTIE 4', 'Qu\'est-ce qu\'elle va dire ?');
};
