// Le secret de mon frère — Partie 2 (kits : cinema.js, cinema-rig.js, MK, FK). Bras : coude entre 0 et 1,2.
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const LEO = { col: FK.LEO, col2: FK.LEO2, pants: '#1E2029', hair: FK.leoHair, seed: 4 };
const MAMAN = { col: FK.MAMAN, col2: FK.MAMAN2, pants: '#3A3040', hair: FK.mamanHair, seed: 2 };
const ME = { seed: 1 };

function hud(c, gt) {
  const debt = gt > CUE.letter;
  cinemaHud(c, gt, { part: 'Partie 2', off: gt > CUE.endcard, day: gt < L(8) ? 2 : 3, dayAt: L(8), val: debt ? '−13 600 €' : '4 400 €', neg: debt, bump: debt ? CUE.letter : undefined, sub: '0', subIcon: FK.ballIcon });
}
const nightKitchen = p => FK.kitchenDay(p, 0, { night: true });
const clock = (p, x, y, s, label) => { p.save(); p.translate(x, y); p.scale(s, s); rr(p, -110, -45, 220, 90, 10); fs(p, '#0A0A0E', 0); text(p, label, 0, 2, '700 56px "Roboto Mono"', '#FF3B3B'); glow(p, 0, 0, 160, 'rgba(255,60,60,A)', .2); p.restore(); };

SC.flash = (c, lt, gt) => film(c, gt, p => {
  blurred(p, 10, q => { cam2(q, 960, 500, 1.4); nightKitchen(q); });
  p.save(); cam2(p, 960, 560, push(lt, 1.05, 1.2, 2.5)); bust(p, 960, 600, 230, Object.assign({ t: gt, e: 'angry', talk: talking(gt, L(0), E(0)), light: 1, rim: 'rgba(255,200,140,.9)', sweat: true }, LEO)); p.restore();
}, { vig: .75 });
SC.rentree = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wait'], [at(1, .5), 'door'], [L(2), 'photo'], [at(2, .6), 'pale']]);
  film(c, gt, p => {
    if (shot === 'wait') { p.save(); cam2(p, 900, 600, push(st, 1.3, 1.38, 3)); nightKitchen(p); table(p, 900, 700, 700); clock(p, 400, 380, 1, '05:00');
      rig(p, Object.assign({ x: 900, y: 960, s: .55, f: 1, t: gt, pose: 'sit', seat: 470, e: 'sad', armF: [1.5, .2], tilt: .15 }, ME)); table(p, 900, 700, 700); p.restore(); }
    else if (shot === 'door') { p.save(); cam2(p, 1000, 560, push(st, 1.2, 1.28, 3)); MK.houseNight(p, gt, 1);
      rig(p, Object.assign({ x: kf(st, [[0, 1100], [1.6, 960]]), y: 840, s: .64, f: -1, t: gt, pose: st < 1.6 ? 'walk' : 'stand', walk: gt * 5, e: 'sad', lean: .1, lookY: .6 }, LEO)); p.restore(); }
    else if (shot === 'photo') { p.fillStyle = '#120E0C'; p.fillRect(0, 0, SW, SH); glow(p, 960, 540, 600, 'rgba(255,200,140,A)', .2);
      phoneHeld(p, 960, 560, 1.05, -.04, (q, w, h) => { q.fillStyle = '#000'; q.fillRect(0, 0, w, h); q.save(); q.translate(0, 200); q.scale(w / SW * 1.8, w / SW * 1.8); q.translate(-500, -300); FK.stadium(q, gt); FK.mop(q, 980, 520, .8); rig(q, Object.assign({ x: 960, y: 905, s: .62, f: 1, t: 0, e: 'sad', blink: false }, LEO)); q.restore(); text(q, 'Photo · hier 22:47', w / 2, 680, '600 18px Montserrat', '#9AA6D6'); }); }
    else { p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 2)); nightKitchen(p); p.restore(); blurred(p, 9, q => { cam2(q, 960, 500, 1.4); nightKitchen(q); });
      bust(p, 960, 600, 230, Object.assign({ t: gt, e: 'wide', mouth: 'o', light: 1, rim: 'rgba(255,200,140,.9)', blink: false }, LEO)); p.fillStyle = 'rgba(220,230,255,.12)'; p.fillRect(0, 0, SW, SH); }
  }, { vig: .7 });
};
SC.aveu = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'leo'], [at(3, .3), 'bakery'], [at(3, .7), 'leo2'], [L(4), 'leo3']]);
  film(c, gt, p => {
    if (shot === 'bakery') { p.save(); p.filter = 'sepia(.6)'; cam2(p, 960, 560, push(st, 1, 1.1, 3)); FK.bakeryClosed(p, gt);
      rig(p, Object.assign({ x: 1300, y: 905, s: .62, f: -1, t: gt, e: 'sad', lean: .2, armF: [2.4, 0], armB: [2.3, 0], tilt: .2 }, MAMAN)); p.filter = 'none'; p.restore(); return; }
    blurred(p, 10, q => { cam2(q, 960, 500, 1.4); nightKitchen(q); });
    p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3));
    bust(p, 960, 600, 220, Object.assign({ t: gt, e: 'sad', talk: true, lookY: shot === 'leo3' ? 0 : .5, light: 1, rim: 'rgba(255,200,140,.9)' }, LEO));
    if (shot === 'leo2') MK.tear(p, 1040, 610, gt, at(3, .7) + .5);
    p.restore();
  }, { vig: .7 });
};
SC.lettre = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'letter'], [L(6), 'sms']]);
  film(c, gt, p => {
    if (shot === 'letter') { p.fillStyle = '#1A1410'; p.fillRect(0, 0, SW, SH); glow(p, 960, 400, 800, 'rgba(255,210,160,A)', .3);
      p.save(); cam2(p, 960, kf(st, [[0, 540], [3, 620]]), kf(st, [[0, 1], [3, 1.35]])); FK.bankLetter(p, 960, 560, 1.15, pr(gt, CUE.letter, CUE.letter + .5)); hand(p, 1500, 1100, 1.8, -2.3, { sleeve: FK.LEO, open: true }); p.restore(); }
    else { p.save(); cam2(p, 1150, 560, push(st, 1.5, 1.6, 4)); FK.kitchenDay(p, gt);
      rig(p, Object.assign({ x: 1150, y: 905, s: .62, f: 1, t: gt, e: 'happy', mouth: 'smile', armF: [1.3, 1.0], tilt: .08, holdF: (q, x, y) => { rr(q, x - 10, y - 70, 50, 90, 8); fs(q, '#15151C', 0); rr(q, x - 5, y - 64, 40, 70, 4); fs(q, '#7FA6D8', 0); } }, MAMAN));
      const k = pop(gt, L(6) + 1); if (k) { p.save(); p.translate(1400, 330); p.scale(k, k); rr(p, -230, -50, 460, 100, 30); fs(p, '#fff', 0); text(p, '« Ta prime du club ! ❤ »', 0, 3, '800 30px Montserrat', '#22232A'); p.restore(); }
      p.restore(); }
  });
};
SC.promesse = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'blisters'], [at(7, .33), 'leo'], [at(7, .8), 'hands']]);
  film(c, gt, p => {
    if (shot === 'blisters') { p.fillStyle = '#1A1410'; p.fillRect(0, 0, SW, SH); glow(p, 960, 540, 600, 'rgba(255,200,140,A)', .3); p.save(); cam2(p, 960, 560, push(st, 1, 1.12, 2));
      [[700, -1.4], [1220, -1.75]].forEach(([x, a]) => hand(p, x, 1000, 2.2, a, { sleeve: FK.LEO, open: true })); [[760, 430], [820, 470], [1180, 440], [1240, 400]].forEach(([x, y]) => { circ(p, x, y, 16); fs(p, '#E8A0A0', 0); }); p.restore(); }
    else if (shot === 'leo') { blurred(p, 10, q => { cam2(q, 960, 500, 1.4); nightKitchen(q); }); bust(p, 960, 600, 230, Object.assign({ t: gt, e: 'angry', talk: talking(gt, at(7, .35), at(7, .78)), light: 1, rim: 'rgba(255,200,140,.9)' }, LEO)); }
    else { p.fillStyle = '#1A1410'; p.fillRect(0, 0, SW, SH); glow(p, 960, 540, 600, 'rgba(255,200,140,A)', .3);
      const k = eo(clamp(st / .6)); hand(p, 300 + k * 260, 560, 2.2, 0, { sleeve: FK.LEO, point: true }); hand(p, 1620 - k * 260, 560, 2.2, Math.PI, { sleeve: '#F2A31B', point: true }); }
  }, { vig: .7 });
};
SC.coach = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'ring'], [L(9), 'coach']]);
  film(c, gt, p => {
    if (shot === 'ring') { p.save(); cam2(p, 1000, 520, push(st, 1.5, 1.6, 3)); FK.kitchenDay(p, gt);
      const sh = gt > CUE.ring && gt < CUE.ring + 1.4 ? Math.sin(gt * 60) * 4 : 0; rr(p, 600 + sh, 300, 120, 180, 14); fs(p, '#E8E2D4', 0); rr(p, 590 + sh, 290, 140, 50, 20); fs(p, '#C83A4A', 0);
      rig(p, Object.assign({ x: 820, y: 905, s: .55, f: -1, t: gt, e: 'n', armF: st > 1.2 ? [2.6, .2] : [.2, .2] }, ME)); p.restore(); }
    else { p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 4)); p.fillStyle = grad(p, 0, 1080, ['#3A4A6A', '#2A3450']); p.fillRect(-200, -200, 2400, 1500);
      [[300, 200], [520, 220]].forEach(([x, y]) => { rr(p, x, y, 160, 200, 4); fs(p, '#F5B82E', 0); }); text(p, 'FC LES TOURS', 1500, 200, '900 44px Montserrat', 'rgba(255,255,255,.4)');
      bust(p, 960, 600, 220, { t: gt, col: FK.COACH, col2: FK.COACH2, hair: FK.coachHair, e: 'angry', talk: talking(gt, L(9), E(9)), light: 1, seed: 8, rim: 'rgba(220,230,255,.9)' }); p.restore(); }
  });
};
SC.fin = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 760, 600, push(lt, 1.35, 1.5, 5)); FK.shared(p, gt);
    circ(p, 1250, 600, 46); fs(p, SKIN, 0); FK.leoHair(p, 46, [1250, 600]); eyes(p, 1262, 600, 46, { e: 'closed', blink: false }); p.beginPath(); p.ellipse(1440, 650 + Math.sin(gt * 1.5) * 3, 220, 60, 0, 0, Math.PI * 2); fs(p, '#24815A', 0);
    rig(p, Object.assign({ x: 600, y: 905, s: .55, f: 1, t: gt, e: 'worried', look: 1, armF: [1.3, 1.1], holdF: (q, x, y) => { rr(q, x - 14, y - 80, 50, 110, 10); fs(q, '#E8E2D4', 0); } }, ME));
    p.restore();
  }, { vig: .7 });
  cinemaEnd(c, gt, CUE.endcard, 'PARTIE 3', 'Tu lui dis ?');
};
