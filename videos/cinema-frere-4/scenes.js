// Le secret de mon frère — Partie 4, FIN (kits : cinema.js, cinema-rig.js, MK, FK). Bras : coude entre 0 et 1,2.
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const LEO = { col: FK.LEO, col2: FK.LEO2, pants: '#1E2029', hair: FK.leoHair, seed: 4 };
const MAMAN = { col: FK.MAMAN, col2: FK.MAMAN2, pants: '#3A3040', hair: FK.mamanHair, seed: 2 };
const COACH = { col: FK.COACH, col2: FK.COACH2, pants: '#1E2029', hair: FK.coachHair, seed: 7 };
const ME = { seed: 1 };

function hud(c, gt) {
  const goal = gt > CUE.goal, env = gt > CUE.env;
  cinemaHud(c, gt, { part: 'Partie 4', off: gt > CUE.endcard, day: 5, dayAt: -9,
    val: goal ? 'BUT !' : env ? '4 400 €' : '260 €', bump: goal ? CUE.goal : env ? CUE.env : undefined, sub: goal ? '1' : '0', subIcon: FK.ballIcon });
}
const stands = (p, gt) => { FK.stadium(p, gt, { day: true }); };
const ball = (p, x, y, r, rot = 0) => { p.save(); p.translate(x, y); p.rotate(rot); circ(p, 0, 0, r); fs(p, '#FFFFFF', 0); p.beginPath(); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 - Math.PI / 2; p.lineTo(Math.cos(a) * r * .4, Math.sin(a) * r * .4); } p.closePath(); fs(p, '#1A1A20', 0); p.restore(); };
function goalFrame(p, x, y) {
  p.strokeStyle = 'rgba(255,255,255,.35)'; p.lineWidth = 2; for (let i = 0; i < 10; i++) { p.beginPath(); p.moveTo(x - 260 + i * 28, y - 260); p.lineTo(x - 260 + i * 28, y); p.stroke(); }
  for (let j = 0; j < 9; j++) { p.beginPath(); p.moveTo(x - 260, y - 260 + j * 29); p.lineTo(x, y - 260 + j * 29); p.stroke(); }
  line(p, [[x - 260, y], [x - 260, y - 270], [x + 10, y - 270], [x + 10, y]], 16, '#F4F4F6', null);
}
const sitStand = (p, x, o) => rig(p, Object.assign({ x, y: 610, s: .5, t: o.t, pose: 'sit', seat: 0 }, o));

SC.flash = (c, lt, gt) => film(c, gt, p => {
  p.save(); cam2(p, 960, 560, push(lt, 1, 1.1, 2.5)); p.fillStyle = grad(p, 0, 1080, ['#7FB2E8', '#CFE3F5']); p.fillRect(-200, -200, 2400, 1500);
  bust(p, 960, 600, 220, Object.assign({ t: gt, e: 'sad', mouth: 'smile', light: 1, rim: 'rgba(255,245,220,.95)' }, MAMAN)); MK.tear(p, 1030, 610, gt, .6);
  p.restore();
});
SC.tribune = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wide'], [at(1, .5), 'hands'], [L(2), 'mom']]);
  film(c, gt, p => {
    if (shot === 'wide') { p.save(); cam2(p, 960, 520, push(st, 1.6, 1.75, 3)); stands(p, gt);
      sitStand(p, 1060, Object.assign({ f: -1, t: gt, e: 'sad', look: -1 }, MAMAN)); sitStand(p, 860, Object.assign({ f: 1, t: gt, e: 'sad', lookY: .7, armF: [.75, .85], armB: [.75, .85] }, LEO)); p.restore(); }
    else if (shot === 'hands') { p.fillStyle = '#1E1A2C'; p.fillRect(0, 0, SW, SH); glow(p, 960, 540, 600, 'rgba(255,220,170,A)', .25);
      p.save(); cam2(p, 960, 540, push(st, 1, 1.12, 3));
      hand(p, 700, 560, 2.0, 0, { sleeve: FK.LEO, cuff: FK.LEO2, open: true }); for (let i = 0; i < 4; i++) line(p, [[790 + i * 50, 500], [830 + i * 50, 620]], 7, 'rgba(255,140,120,.8)', null);
      hand(p, 1260, 640, 1.8, Math.PI, { sleeve: FK.MAMAN, cuff: FK.MAMAN2 }); p.restore(); }
    else { p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); p.fillStyle = grad(p, 0, 1080, ['#7FB2E8', '#CFE3F5']); p.fillRect(-200, -200, 2400, 1500);
      bust(p, 960, 600, 220, Object.assign({ t: gt, e: 'sad', talk: talking(gt, L(2) + .2, E(2)), light: 1 }, MAMAN)); p.restore(); }
  });
};
SC.enveloppe = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'env'], [at(3, .55), 'mom'], [L(4), 'mom2'], [L(5), 'leo'], [at(5, .5), 'me']]);
  film(c, gt, p => {
    if (shot === 'env') { p.fillStyle = '#1E1A2C'; p.fillRect(0, 0, SW, SH); glow(p, 960, 540, 600, 'rgba(255,220,170,A)', .25);
      p.save(); cam2(p, 960, 560, push(st, 1, 1.12, 3)); FK.envelope(p, 960, 600, 1.6, clamp((gt - CUE.env) / .8)); p.restore(); }
    else if (shot === 'mom' || shot === 'mom2') { p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); p.fillStyle = grad(p, 0, 1080, ['#7FB2E8', '#CFE3F5']); p.fillRect(-200, -200, 2400, 1500);
      bust(p, 960, 600, 220, Object.assign({ t: gt, e: shot === 'mom2' ? 'n' : 'sad', mouth: shot === 'mom2' ? 'smile' : undefined, talk: true, light: 1 }, MAMAN)); p.restore(); }
    else if (shot === 'leo') { p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); p.fillStyle = grad(p, 0, 1080, ['#7FB2E8', '#CFE3F5']); p.fillRect(-200, -200, 2400, 1500);
      bust(p, 960, 600, 220, Object.assign({ t: gt, e: 'sad', mouth: 'smile', light: 1 }, LEO)); MK.tear(p, 1040, 610, gt, L(5) + .3); p.restore(); }
    else { p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); p.fillStyle = grad(p, 0, 1080, ['#7FB2E8', '#CFE3F5']); p.fillRect(-200, -200, 2400, 1500);
      bust(p, 960, 600, 230, Object.assign({ t: gt, e: 'happy', mouth: 'smile', light: 1 }, ME)); MK.tear(p, 1030, 610, gt, at(5, .6)); p.restore(); }
  });
};
SC.go = (c, lt, gt) => film(c, gt, p => {
  const k = clamp(lt / 3);
  p.save(); cam2(p, lerp(900, 1100, k), 560, 1.35); stands(p, gt);
  rig(p, Object.assign({ x: 820, y: 905, s: .55, f: 1, t: gt, e: 'happy', mouth: 'smile', armF: [1.5, .1], holdF: (q, hx, hy) => FK.mop(q, hx - 10, hy - 40, .9) }, MAMAN));
  rig(p, Object.assign({ x: lerp(980, 1500, k), y: 905, s: .55, f: 1, t: gt, pose: k > .1 ? 'run' : 'stand', walk: gt * 12, e: 'happy' }, LEO));
  p.restore();
});
SC.match = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'run'], [CUE.kick - .2, 'shot'], [CUE.goal - .3, 'net']]);
  film(c, gt, p => {
    if (shot === 'run') { p.save(); cam2(p, kf(st, [[0, 700], [4, 1300]]), 700, 1.3); stands(p, gt);
      const x = kf(st, [[0, 500], [4, 1300]]); rig(p, Object.assign({ x, y: 905, s: .55, f: 1, t: gt, pose: 'run', walk: gt * 12, e: 'n', look: 1 }, LEO)); ball(p, x + 70, 890, 18, gt * 8);
      text(p, '78\'', 1700, 180, '900 60px "Roboto Mono"', '#FFFFFF'); p.restore(); }
    else if (shot === 'shot') { p.save(); cam2(p, 1300, 700, push(st, 1.4, 1.6, 2)); stands(p, gt); goalFrame(p, 1700, 905);
      const k = clamp((gt - CUE.kick) / 1.1); rig(p, Object.assign({ x: 1100, y: 905, s: .55, f: 1, t: gt, e: 'wide', look: 1 }, LEO));
      ball(p, lerp(1170, 1450, k), lerp(890, 650, Math.sin(k * Math.PI / 2)), 18, gt * 14); p.restore(); }
    else { p.save(); cam2(p, 1600, 760, push(st, 1.8, 2.0, 2)); stands(p, gt); goalFrame(p, 1700, 905);
      const k = clamp((gt - CUE.goal + .3) / .5); ball(p, lerp(1450, 1560, k), lerp(650, 760, k), 18, gt * 14);
      if (gt > CUE.goal) { const s = pop(gt, CUE.goal); p.save(); p.translate(1500, 560); p.scale(s, s); text(p, 'BUT !', 0, 0, '900 120px Montserrat', '#F5B82E', 'center', 14, '#0B0C12'); p.restore(); }
      p.restore(); }
  });
};
SC.joie = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'mom'], [at(9, .45), 'coach'], [CUE.sign - .2, 'leo']]);
  film(c, gt, p => {
    p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 2)); p.fillStyle = grad(p, 0, 1080, ['#7FB2E8', '#CFE3F5']); p.fillRect(-200, -200, 2400, 1500);
    if (shot === 'mom') bust(p, 960, 600, 220, Object.assign({ t: gt, e: 'happy', talk: true, light: 1, tilt: Math.sin(gt * 6) * .05 }, MAMAN));
    else if (shot === 'coach') bust(p, 960, 600, 220, Object.assign({ t: gt, e: 'n', mouth: 'smile', talk: talking(gt, at(9, .6), E(9)), light: 1 }, COACH));
    else bust(p, 960, 600, 220, Object.assign({ t: gt, e: 'happy', mouth: 'smile', light: 1 }, LEO));
    p.restore();
  });
};
SC.frigo = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'kitchen'], [at(10, .45), 'article'], [L(11), 'family']]);
  film(c, gt, p => {
    if (shot === 'kitchen') { p.save(); cam2(p, 1300, 560, push(st, 1.1, 1.25, 3)); FK.kitchenDay(p, gt, { newArticle: true, clips: 5 }); p.restore(); }
    else if (shot === 'article') { p.save(); cam2(p, 1560, 650, push(st, 2.6, 3.0, 3)); FK.kitchenDay(p, gt, { newArticle: true, clips: 5 }); p.restore(); }
    else { p.save(); cam2(p, 960, 600, push(st, 1.15, 1.25, 4)); FK.kitchenDay(p, gt, { newArticle: true, clips: 5 });
      rig(p, Object.assign({ x: 700, y: 905, s: .58, f: 1, t: gt, e: 'happy', mouth: 'smile', look: 1 }, MAMAN));
      rig(p, Object.assign({ x: 900, y: 905, s: .58, f: 1, t: gt, e: 'happy', mouth: 'smile', look: 1 }, LEO));
      rig(p, Object.assign({ x: 1080, y: 905, s: .5, f: -1, t: gt, e: 'happy', mouth: 'smile', look: -1 }, ME)); p.restore(); }
  });
  const k = pr(gt, CUE.endcard, CUE.endcard + .2); if (k <= 0) return;
  stage(c, p => {
    p.fillStyle = `rgba(5,6,10,${k})`; p.fillRect(0, 0, SW, SH);
    const b = pop(gt, CUE.endcard + .15, .45), qq = clamp((gt - CUE.endcard - .8) * 3);
    if (b) { p.save(); p.translate(SW / 2, 430); p.scale(b, b); text(p, 'FIN', 0, 0, '900 190px Montserrat', '#F5B82E'); p.restore(); }
    if (qq > 0) { p.globalAlpha = qq; text(p, 'Qui garde un secret pour te protéger ?', SW / 2, 700, '800 54px Montserrat', '#FFFFFF'); text(p, 'Dis-le en commentaire', SW / 2, 790, '700 38px Montserrat', '#9AA2BC'); }
  }, { vig: .3 });
};
