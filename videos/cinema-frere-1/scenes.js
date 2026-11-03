// Le secret de mon frère — Partie 1 (kits : cinema.js, cinema-rig.js, mensonge-kit.js → MK, frere-kit.js → FK).
// Bras : coude entre 0 et 1,2 (jamais négatif).
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const LEO = { col: FK.LEO, col2: FK.LEO2, pants: '#1E2029', hair: FK.leoHair, seed: 4 };
const MAMAN = { col: FK.MAMAN, col2: FK.MAMAN2, pants: '#3A3040', hair: FK.mamanHair, seed: 2 };
const ME = { seed: 1 };
const nan = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

function sent(gt) {
  if (gt < CUE.v1) return [0];
  if (gt < CUE.roll) return [400, CUE.v1];
  const k = pr(gt, CUE.roll, CUE.roll + 2.2); return [400 * (1 + Math.round(10 * eio(k))), k < 1 ? gt - .2 : CUE.roll + 2];
}
function hud(c, gt) {
  const [v, bump] = sent(gt);
  cinemaHud(c, gt, { part: 'Partie 1', off: gt > CUE.endcard, day: 1, val: nan(v) + ' €', bump, sub: '0', subIcon: FK.ballIcon });
}
const mopper = (p, x, y, s, gt, f = 1, extra = {}) => rig(p, Object.assign({ x, y, s, f, t: gt, e: 'sad', lean: .18 + Math.sin(gt * 3) * .06, lookY: .7,
  armF: [.75 + Math.sin(gt * 3) * .15, .5], armB: [.6 + Math.sin(gt * 3) * .15, .6], holdF: (q, hx, hy) => FK.mop(q, hx - 10, hy - 40, .9) }, LEO, extra));

SC.flash = (c, lt, gt) => film(c, gt, p => {
  p.save(); cam2(p, 1000, 640, push(lt, 1.5, 1.75, 2.5)); FK.stadium(p, gt); FK.bucket(p, 1150, 905, .9); mopper(p, 960, 905, .62, gt); p.restore();
}, { vig: .7 });
SC.intro = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'juggle'], [at(1, .55), 'face'], [L(2), 'leave']]);
  film(c, gt, p => {
    if (shot === 'juggle') {
      p.save(); cam2(p, 960, 620, push(st, 1.35, 1.45, 3)); FK.stadium(p, gt, { day: true, club: 'CITY DU QUARTIER' });
      const ph = (gt * 2.2) % 1, by = 860 - Math.sin(ph * Math.PI) * 260;
      rig(p, Object.assign({ x: 900, y: 905, s: .66, f: 1, t: gt, e: 'happy', mouth: 'smile', lookY: -.6 }, LEO));
      circ(p, 990, by, 26); fs(p, '#FFFFFF', 0); FK.ballIcon(p, 990, by, false);
      [600, 1300, 1450].forEach((x, i) => rig(p, { x, y: 905, s: .5, f: x < 900 ? 1 : -1, t: gt, col: ['#E85D75', '#4A90E2', '#F5B82E'][i], col2: ['#C04A60', '#3A70B2', '#D89A10'][i], e: 'happy', mouth: 'o', seed: 10 + i, armF: [2.6, .2] }));
      p.restore();
    } else if (shot === 'face') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.08, 3)); p.fillStyle = grad(p, 0, 1080, ['#7FB2E8', '#CFE3F5']); p.fillRect(-200, -200, 2400, 1500);
      bust(p, 960, 600, 220, Object.assign({ t: gt, e: 'happy', mouth: 'smile', light: 1, rim: 'rgba(255,245,220,.95)' }, LEO)); p.restore();
    } else {
      p.save(); cam2(p, 1000, 560, push(st, 1.15, 1.22, 4)); MK.houseNight(p, gt, 1);
      rig(p, Object.assign({ x: kf(st, [[0, 960], [2.5, 1500]]), y: 860, s: .64, f: 1, t: gt, pose: 'walk', walk: gt * 7, e: 'n', armF: [.2, .3], holdF: (q, x, y) => { rr(q, x - 20, y - 10, 150, 80, 20); fs(q, '#15151C', 0); } }, LEO));
      rig(p, Object.assign({ x: 900, y: 845, s: .55, f: 1, t: gt, e: 'happy', armF: [2.6, .2 + Math.sin(gt * 9) * .2] }, ME));
      p.restore();
    }
  });
};
SC.frigo = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wide'], [at(3, .55), 'clip']]);
  film(c, gt, p => {
    if (shot === 'wide') {
      p.save(); cam2(p, 1250, 600, push(st, 1.3, 1.38, 3)); FK.kitchenDay(p, gt);
      rig(p, Object.assign({ x: 1260, y: 905, s: .62, f: 1, t: gt, e: 'happy', mouth: 'smile', armF: [1.45, .1], tilt: .06 }, MAMAN));
      p.restore();
    } else { p.fillStyle = '#E8ECF2'; p.fillRect(0, 0, SW, SH); p.save(); cam2(p, 960, 540, push(st, 1, 1.12, 3)); FK.article(p, 960, 540, 620, 720, 'LÉO, LA PÉPITE DU QUARTIER', true, -.03); p.restore(); }
  });
};
SC.placard = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'room'], [at(4, .45), 'boots']]);
  film(c, gt, p => {
    if (shot === 'room') {
      p.save(); cam2(p, 1500, 600, push(st, 1.35, 1.45, 3)); FK.shared(p, gt, { closet: true });
      rr(p, 1700, 150, 130, 680, 6); fs(p, '#2A1A12', 0);
      rig(p, Object.assign({ x: 1640, y: 880, s: .58, f: 1, t: gt, pose: 'kneel', e: 'n', armF: [1.4, .2], lookY: .5 }, ME));
      p.restore();
    } else { p.fillStyle = '#1A140E'; p.fillRect(0, 0, SW, SH); glow(p, 960, 400, 700, 'rgba(255,220,170,A)', .3); p.save(); cam2(p, 960, 560, push(st, 1, 1.15, 3)); FK.boots(p, 960, 560, 1.6, gt); p.restore(); }
  });
};
const transfers = k => (c, w, h) => {
  c.fillStyle = '#101218'; c.fillRect(0, 0, w, h); text(c, 'Virements envoyés', 30, 70, '800 24px Montserrat', '#fff', 'left');
  const months = ['nov.', 'oct.', 'sept.', 'août', 'juil.', 'juin', 'mai', 'avr.', 'mars', 'févr.', 'janv.'];
  c.save(); c.translate(0, -k * 520);
  months.forEach((m, i) => { const y = 120 + i * 84; rr(c, 20, y, w - 40, 70, 14); fs(c, '#1A1D26', 0); circ(c, 56, y + 35, 18); fs(c, '#C76B3A', 0);
    text(c, 'Maman', 90, y + 26, '800 20px Montserrat', '#fff', 'left'); text(c, m, 90, y + 50, '600 16px Montserrat', '#8A90A6', 'left'); text(c, '−400 €', w - 36, y + 36, '900 22px Montserrat', '#FF6B6B', 'right'); });
  c.restore();
};
SC.tel = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'buzz'], [L(6), 'list']]);
  film(c, gt, p => {
    p.fillStyle = '#12101C'; p.fillRect(0, 0, SW, SH); glow(p, 960, 540, 700, 'rgba(120,160,255,A)', .14);
    if (shot === 'buzz') { const sh = gt > CUE.buzz && gt < CUE.buzz + 1.1 ? Math.sin(gt * 90) * .025 : 0;
      p.fillStyle = '#2B3A7A'; p.fillRect(0, 700, SW, 400);
      phoneBig(p, 960, 560, 1.05, .12 + sh, scrBank('12,40 €', 'Compte de Léo', (q, w) => notifBanner(q, w, pr(gt, CUE.buzz, CUE.buzz + .4), 'Virement envoyé|−400 €', 'À : Maman — « prime du club »', '#C76B3A')), { hand: false }); }
    else phoneHeld(p, 960, 560, 1.05, -.04, transfers(eio(clamp(st / D(6)))), { thumb: Math.max(0, Math.sin(st * 5)) });
  });
};
SC.suivre = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'street'], [L(8), 'bus']]);
  film(c, gt, p => {
    if (shot === 'street') {
      p.save(); cam2(p, kf(st, [[0, 700], [3, 1100]]), 600, 1.3); MK.street(p, gt);
      rig(p, Object.assign({ x: kf(st, [[0, 700], [3, 1450]]), y: 835, s: .64, f: 1, t: gt, pose: 'walk', walk: gt * 7, e: 'n' }, LEO));
      rig(p, Object.assign({ x: kf(st, [[0, 250], [3, 900]]), y: 835, s: .55, f: 1, t: gt, pose: 'walk', walk: gt * 8, lean: .15, e: 'side', look: 1 }, ME));
      p.restore();
    } else {
      p.save(); cam2(p, 900, 560, push(st, 1.5, 1.6, 3)); FK.busNight(p, gt);
      rig(p, Object.assign({ x: 700, y: 880, s: .64, f: 1, t: gt, pose: 'sit', seat: 330, e: 'sad', lookY: .4, armF: [.75, .85] }, LEO));
      rig(p, Object.assign({ x: 1260, y: 880, s: .55, f: -1, t: gt, pose: 'sit', seat: 384, e: 'side', look: 1, tilt: .1 }, ME));
      rr(p, 780, 120, 360, 60, 10); fs(p, '#15151C', 0); text(p, 'DIRECTION : STADE', 960, 151, '800 28px Montserrat', '#FFB020');
      p.restore();
    }
  });
};
SC.stade = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'wide'], [L(10), 'mop'], [at(10, .6), 'face']]);
  film(c, gt, p => {
    if (shot === 'wide') {
      const on = gt > CUE.lights; p.save(); cam2(p, 960, 500, push(st, 1, 1.1, 4)); FK.stadium(p, gt);
      if (!on) { p.fillStyle = 'rgba(0,0,0,.6)'; p.fillRect(-400, -300, 2800, 1500); } else if (gt < CUE.lights + .25) { p.fillStyle = 'rgba(255,255,255,.4)'; p.fillRect(-400, -300, 2800, 1500); }
      rig(p, Object.assign({ x: 1400, y: 905, s: .45, f: -1, t: gt, pose: 'walk', walk: gt * 6, e: 'wide', lean: .1 }, ME));
      p.restore();
    } else if (shot === 'mop') { p.save(); cam2(p, 960, 560, push(st, 1.4, 1.55, 3)); FK.stadium(p, gt); FK.bucket(p, 1160, 905, .9); mopper(p, 960, 905, .62, gt); p.restore(); }
    else { p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 3)); p.fillStyle = grad(p, 0, 1080, ['#04060F', '#0E1430']); p.fillRect(-200, -200, 2400, 1500); cone(p, 300, -100, 150, 1400, 1200, 'rgba(230,240,255,A)', .18);
      bust(p, 960, 600, 220, Object.assign({ t: gt, e: 'sad', sweat: true, lookY: .8, light: -1, rim: 'rgba(230,240,255,.9)' }, LEO)); p.restore(); }
  }, { vig: .7 });
};
SC.fin = (c, lt, gt) => {
  film(c, gt, p => {
    p.save(); cam2(p, 960, 560, push(lt, 1, 1.15, 4)); p.fillStyle = grad(p, 0, 1080, ['#04060F', '#0E1430']); p.fillRect(-200, -200, 2400, 1500); cone(p, 1700, -100, 150, 1400, 1200, 'rgba(230,240,255,A)', .16);
    rr(p, 200, -100, 260, 1300, 10); fs(p, '#2A2F40', 0);
    bust(p, 860, 600, 230, Object.assign({ t: gt, e: 'wide', mouth: 'o', light: 1, rim: 'rgba(230,240,255,.9)', look: 1 }, ME));
    MK.tear(p, 950, 620, gt, L(11) + 1.6); p.restore();
  }, { vig: .7 });
  cinemaEnd(c, gt, CUE.endcard, 'PARTIE 2', 'Tu le dis à Maman ?');
};
