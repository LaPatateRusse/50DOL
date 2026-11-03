// Cent euros le mensonge — Partie 5, FIN (kits : cinema.js, cinema-rig.js, mensonge-kit.js → MK).
const EP = { cinema: true, hideSubs: () => true };
const SC = {};
const L = i => LINES[i].start, E = i => LINES[i].end, D = i => E(i) - L(i);
const at = (i, k) => L(i) + D(i) * k;
const { MOM, MOM2, COAT, COAT2, MAMIE, MAMIE2, POTE, POTE2 } = MK;
const PAPY = { col: COAT, col2: COAT2, pants: '#24262E', hair: MK.papyHair, seed: 3 };
const oldHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); c.beginPath(); c.arc(0, 0, r * 1.05, Math.PI * .85, Math.PI * 1.35); c.lineWidth = r * .26; c.strokeStyle = '#E8E8EE'; c.stroke();
  c.beginPath(); c.arc(0, 0, r * 1.05, Math.PI * 1.65, Math.PI * 1.95); c.stroke(); c.fillStyle = '#E8E8EE'; c.beginPath(); c.ellipse(r * .1, r * .3, r * .3, r * .1, 0, 0, Math.PI * 2); c.fill(); c.restore(); };
const OLD = { col: '#8A7A6A', col2: '#6E604F', pants: '#3A3530', hair: oldHair, seed: 9 };
// opacité du héros : fantôme jusqu'à l'aveu, puis revient pendant qu'il parle
const vis = gt => gt < L(4) ? .35 + Math.sin(gt * 11) * .05 : gt < CUE.hug ? lerp(.35, .85, pr(gt, L(4), E(5))) : 1;

function hud(c, gt) {
  const fixed = gt > CUE.three;
  const h = gt < CUE.break ? '2' : gt < CUE.h1 ? '0' : gt < CUE.h2 ? '1' : gt < CUE.h3 ? '2' : '3';
  cinemaHud(c, gt, { part: 'Partie 5 — FIN', off: gt > CUE.endcard, day: gt < L(13) ? 5 : 6, dayAt: L(13), val: fixed ? '3 €' : '−97 €', neg: !fixed, bump: fixed ? CUE.three : undefined,
    sub: h, subIcon: heartIcon, hit: gt > CUE.h1 - .1 && gt < CUE.h3 + 2 ? [CUE.h1, CUE.h2, CUE.h3].filter(x => x <= gt).pop() : undefined });
}
const rain = (p, gt, a = .3) => { p.save(); p.globalAlpha = a; for (let i = 0; i < 90; i++) { const x = (i * 197) % 2300 - 200, y = ((i * 263 + gt * 1500) % 1300) - 150; line(p, [[x, y], [x - 8, y + 36]], 3, '#C9D6F0', null); } p.restore(); };
function nightBg(p, gt) { p.fillStyle = grad(p, 0, 1080, ['#0B1024', '#1A2140']); p.fillRect(-200, -200, 2400, 1500); cone(p, 960, -80, 200, 1100, 1200, 'rgba(255,230,170,A)', .18); rain(p, gt); }
function warmBg(p) { p.fillStyle = '#2A1A14'; p.fillRect(-200, -200, 2400, 1500); glow(p, 960, 400, 900, 'rgba(255,200,130,A)', .45); }
function morningStreet(p, gt) {
  p.fillStyle = grad(p, 0, 820, ['#F7C59F', '#F9E2C8', '#CFE3F0']); p.fillRect(-400, -200, 2800, 1100);
  glow(p, 1500, 520, 500, 'rgba(255,220,160,A)', .7); circ(p, 1500, 560, 90); fs(p, '#FFE7B0', 0);
  for (let i = 0; i < 9; i++) { const bx = -200 + i * 270, bh = 300 + rnd(i + 3) * 260; p.fillStyle = 'rgba(120,110,140,.55)'; p.fillRect(bx, 820 - bh, 240, bh); }
  p.fillStyle = '#7A7686'; p.fillRect(-400, 820, 2800, 300); p.fillStyle = '#9A96A6'; p.fillRect(-400, 800, 2800, 40);
  busShelter(p, 1240, 830); rr(p, 1290, 700, 300, 22, 8); fs(p, '#4A5068', 0);
}
function bigBus(p, x, gt, doors) {
  rr(p, x, 300, 1500, 520, 40); fs(p, '#F2A31B', 0); p.fillStyle = 'rgba(0,0,0,.12)'; p.fillRect(x, 700, 1500, 40);
  p.fillStyle = 'rgba(200,230,255,.9)'; for (let i = 0; i < 6; i++) p.fillRect(x + 260 + i * 200, 360, 160, 170);
  rr(p, x + 40, 360, 160, 400, 10); fs(p, '#2A3040', 0); p.fillStyle = 'rgba(200,230,255,.8)'; p.fillRect(x + 50 + doors * 70, 370, 70 - doors * 60, 380); p.fillRect(x + 120, 370, 70 - doors * 60, 380);
  rr(p, x + 30, 310, 300, 40, 8); fs(p, '#111', 0); text(p, 'N12', x + 180, 331, '800 30px Montserrat', '#FFB020');
  circ(p, x + 300, 830, 70); fs(p, '#15151C', 0); circ(p, x + 1200, 830, 70); fs(p, '#15151C', 0);
  glow(p, x + 10, 700, 120, 'rgba(255,250,220,A)', .7);
}

SC.supplie = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'papy'], [L(1), 'wide']]);
  film(c, gt, p => {
    if (shot === 'papy') { p.save(); cam2(p, 960, 560, push(st, 1, 1.12, 4)); nightBg(p, gt); bust(p, 960, 600, 210, Object.assign({ t: gt, e: 'worried', talk: talking(gt, L(0), E(0)), light: 1, rim: 'rgba(255,230,180,.7)' }, PAPY)); MK.tear(p, 1040, 600, gt, L(0) + 1.5); p.restore(); }
    else {
      p.save(); cam2(p, 1000, 600, push(st, 1.3, 1.4, 5));
      MK.street(p, gt);
      rig(p, Object.assign({ x: 1150, y: 835, s: .6, f: -1, t: gt, pose: 'kneel', e: 'sad', talk: talking(gt, L(1), E(1)), armF: [1.5, -.4], light: 1 }, PAPY));
      p.save(); p.globalAlpha = vis(gt); rig(p, { x: 760, y: 835, s: .6, f: 1, t: gt, e: 'sad', seed: 1, light: 1 }); p.restore();
      p.restore();
    }
  });
};
SC.choix = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'door'], [L(3), 'me']]);
  film(c, gt, p => {
    if (shot === 'door') {
      p.save(); cam2(p, 1000, 560, push(st, 1.15, 1.25, 4));
      MK.houseNight(p, gt, 1);
      rig(p, { x: 960, y: 840, s: .6, f: 1, t: gt, col: MOM, col2: MOM2, pants: '#3A3040', hair: MK.momHair, e: 'worried', look: Math.sin(gt * 2), seed: 2, light: 1 });
      p.save(); p.globalAlpha = vis(gt); rig(p, { x: 1300, y: 900, s: .62, f: -1, t: gt, e: 'sad', seed: 1, light: -1 }); p.restore();
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.15, 4)); warmBg(p);
      p.save(); p.globalAlpha = vis(gt); bust(p, 960, 580, 230, { t: gt, e: 'sad', mouth: 'flat', tilt: kf(st, [[0, .1], [2, 0]]), light: -1, rim: 'rgba(255,210,150,.9)', seed: 1 }); p.restore();
      p.restore();
    }
  });
};
SC.aveu = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'me'], [at(4, .55), 'mom'], [at(4, .8), 'me2'], [L(5), 'love']]);
  film(c, gt, p => {
    p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 4)); warmBg(p);
    if (shot === 'mom') bust(p, 960, 580, 220, { t: gt, col: MOM, col2: MOM2, hair: MK.momHair, e: 'sad', look: .3, light: 1, rim: 'rgba(255,210,150,.9)', seed: 2 });
    else { p.save(); p.globalAlpha = vis(gt); bust(p, 960, 580, 230, { t: gt, e: 'sad', talk: true, light: -1, rim: 'rgba(255,210,150,.9)', seed: 1 }); p.restore(); MK.tear(p, 880, 600, gt, L(4) + 2); MK.tear(p, 1050, 600, gt, L(5)); }
    p.restore();
  }, { vig: .7 });
};
SC.silence = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'mom'], [at(7, .45), 'hug']]);
  film(c, gt, p => {
    if (shot === 'mom') {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.18, 5)); warmBg(p);
      bust(p, 960, 580, 220, { t: gt, col: MOM, col2: MOM2, hair: MK.momHair, e: gt > L(7) ? 'wide' : 'n', mouth: gt > L(7) ? 'o' : undefined, talk: talking(gt, L(7) + .6, L(7) + 1.4), blink: false, light: 1, rim: 'rgba(255,210,150,.9)', seed: 2 });
      MK.tear(p, 1040, 600, gt, L(7) + 1.2);
      p.restore();
    } else {
      const k = eo(pr(gt, at(7, .45), at(7, .45) + .8));
      p.save(); cam2(p, 1000, 600, push(st, 1.6, 1.75, 4));
      MK.houseNight(p, gt, 1);
      glow(p, 1000, 640, 500, 'rgba(255,210,150,A)', .3 + Math.sin(gt * 3) * .08);
      rig(p, { x: lerp(960, 1000, k), y: 840, s: .6, f: 1, t: gt, col: MOM, col2: MOM2, pants: '#3A3040', hair: MK.momHair, e: 'happy', armF: [1.6, -.2 - k * .6], armB: [1.4, -.3], tilt: .15, seed: 2, light: 1 });
      rig(p, { x: lerp(1200, 1090, k), y: 845, s: .6, f: -1, t: gt, e: 'happy', armF: [1.6, -.2 - k * .6], armB: [1.4, -.3], tilt: .15, seed: 1, light: -1 });
      p.restore();
    }
  });
};
SC.piece = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'coin'], [L(9), 'phone'], [L(10), 'hearts']]);
  film(c, gt, p => {
    if (shot === 'coin') {
      p.fillStyle = '#140C0A'; p.fillRect(0, 0, SW, SH);
      const heat = pr(gt, L(8) + .3, CUE.break), b = eo(pr(gt, CUE.break, CUE.break + .8));
      glow(p, 960, 540, 500, 'rgba(255,90,40,A)', .2 + heat * .5);
      const sh = heat > .3 && b === 0 ? Math.sin(gt * 70) * 6 * heat : 0;
      [-1, 1].forEach(k => { p.save(); p.translate(960 + sh + k * b * 240, 540 + b * 160); p.rotate(k * b * .7); p.beginPath(); p.arc(0, 0, 200, k < 0 ? Math.PI * .5 : -Math.PI * .5, k < 0 ? Math.PI * 1.5 : Math.PI * .5); p.lineTo(k * 14, -60); p.lineTo(-k * 10, 20); p.lineTo(k * 6, 80); p.closePath();
        p.fillStyle = heat > .5 ? '#FF8A3A' : '#D9A520'; p.fill(); circ(p, 0, 0, 50); p.fillStyle = '#140C0A'; p.fill(); p.restore(); });
      if (b > 0) for (let i = 0; i < 26; i++) { const a = rnd(i) * 6.28, d = b * (200 + rnd(i + 2) * 500); circ(p, 960 + Math.cos(a) * d, 540 + Math.sin(a) * d, 6 * (1 - b) + 2); fs(p, `rgba(255,200,90,${1 - b})`, 0); }
    } else if (shot === 'phone') {
      p.fillStyle = '#0A0C14'; p.fillRect(0, 0, SW, SH); glow(p, 960, 540, 700, 'rgba(60,220,130,A)', .12);
      phoneHeld(p, 960, 560, 1.05, -.04 + (gt > CUE.buzz && gt < CUE.buzz + 1 ? Math.sin(gt * 90) * .02 : 0), scrBank(gt < CUE.three ? '−97,00 €' : '3,00 €', 'Compte courant', (q, w) => notifBanner(q, w, pr(gt, CUE.buzz, CUE.buzz + .4), 'Pacte|annulé', 'Solde rétabli : 3,00 €', '#F2A31B')));
    } else {
      p.fillStyle = grad(p, 0, 1080, ['#1A1630', '#0E0C1C']); p.fillRect(0, 0, SW, SH); glow(p, 960, 540, 800, 'rgba(255,120,150,A)', .12);
      [[CUE.h1, 420, POTE, POTE2, 'TON POTE', MK.capHair], [CUE.h2, 960, MAMIE, MAMIE2, 'MAMIE', MK.mamieHair], [CUE.h3, 1500, MOM, MOM2, 'MAMAN', MK.momHair]].forEach(([a, x, col, col2, name, hair]) => {
        const k = pop(gt, a); if (!k) return;
        p.save(); p.translate(x, 520 + Math.sin(gt * 1.3 + x) * 8); p.scale(k, k); p.rotate(Math.sin(gt + x) * .03);
        rr(p, -170, -230, 340, 440, 10); fs(p, '#F4F1EA', 0);
        rr(p, -145, -205, 290, 290, 4); p.save(); p.clip(); p.fillStyle = '#2A3050'; p.fillRect(-145, -205, 290, 290); bust(p, 0, -60, 80, { t: gt, col, col2, hair, e: 'happy', mouth: 'smile' }); p.restore();
        text(p, name, 0, 150, '800 34px Montserrat', '#22232A'); heartIcon(p, 0, -250, false);
        p.restore();
      });
    }
  });
};
SC.papy = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'hat'], [at(11, .5), 'old'], [L(12), 'talk']]);
  film(c, gt, p => {
    if (shot === 'hat') {
      p.save(); cam2(p, 960, kf(st, [[0, 820], [2.5, 520]]), kf(st, [[0, 1.6], [2.5, 1.2]]));
      MK.street(p, gt, { rain: false });
      p.save(); p.translate(900, 830); p.rotate(.3); MK.hatHair(p, 90, [0, 60]); p.restore();
      rig(p, Object.assign({ x: 1150, y: 835, s: .6, f: -1, t: gt, e: 'n', light: 1 }, OLD));
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.12, 5));
      p.fillStyle = grad(p, 0, 1080, ['#1A2140', '#2A2A48']); p.fillRect(-200, -200, 2400, 1500); cone(p, 960, -80, 200, 1100, 1200, 'rgba(255,230,170,A)', .22);
      bust(p, 960, 600, 210, Object.assign({ t: gt, e: shot === 'old' ? 'wide' : 'happy', mouth: 'smile', talk: shot === 'talk' && talking(gt, L(12), E(12)), light: 1, rim: 'rgba(255,230,180,.8)' }, OLD));
      if (shot === 'talk') MK.tear(p, 1040, 600, gt, L(12) + 1.5);
      p.restore();
    }
  });
};
SC.arret = (c, lt, gt) => {
  const [shot, st] = shots(gt, [[0, 'bench'], [L(14), 'mamie']]);
  film(c, gt, p => {
    if (shot === 'bench') {
      p.save(); cam2(p, 1300, 600, push(st, 1.3, 1.4, 5));
      morningStreet(p, gt);
      rig(p, Object.assign({ x: 1360, y: 835, s: .58, f: 1, t: gt, pose: 'sit', seat: 125 / .58, e: 'happy', mouth: 'smile', armF: [.9, -.3], light: 1 }, OLD));
      rig(p, { x: 1500, y: 835, s: .56, f: -1, t: gt, pose: 'sit', seat: 125 / .56, col: MAMIE, col2: MAMIE2, pants: '#3A3348', hair: MK.mamieHair, e: 'happy', mouth: 'smile', armF: [.9, -.3], seed: 6, light: 1 });
      rig(p, { x: 1050, y: 835, s: .6, f: 1, t: gt, e: 'happy', mouth: 'smile', seed: 1, light: 1 });
      p.restore();
    } else {
      p.save(); cam2(p, 960, 560, push(st, 1, 1.1, 4));
      p.fillStyle = grad(p, 0, 1080, ['#F7C59F', '#F9E2C8']); p.fillRect(-200, -200, 2400, 1500); glow(p, 1500, 400, 600, 'rgba(255,230,170,A)', .6);
      bust(p, 960, 600, 220, { t: gt, col: MAMIE, col2: MAMIE2, hair: MK.mamieHair, e: 'happy', mouth: 'smile', talk: talking(gt, L(14), E(14)), light: 1, rim: 'rgba(255,240,200,.95)', seed: 6 });
      p.restore();
    }
  }, { vig: .4 });
};
SC.bus = (c, lt, gt) => {
  const bx = kf(gt - L(15), [[0, 2200], [1.6, 420]]), doors = pr(gt, L(15) + 1.7, L(15) + 2.2);
  film(c, gt, p => {
    p.save(); cam2(p, 1150, 600, 1.25);
    morningStreet(p, gt);
    rig(p, Object.assign({ x: 1600, y: 835, s: .58, f: -1, t: gt, e: 'happy', mouth: 'smile', armF: [2.6, -.4 + Math.sin(gt * 9) * .4], light: 1 }, OLD));
    rig(p, { x: 1740, y: 835, s: .56, f: -1, t: gt, col: MAMIE, col2: MAMIE2, pants: '#3A3348', hair: MK.mamieHair, e: 'happy', mouth: 'smile', armF: [2.6, -.4 + Math.sin(gt * 9 + 1) * .4], seed: 6, light: 1 });
    const hx = kf(gt - L(15), [[2.2, 1300], [3.6, 560]]);
    if (gt - L(15) < 3.6) rig(p, { x: hx, y: 835, s: .6, f: -1, t: gt, pose: gt - L(15) > 2.2 ? 'walk' : 'stand', walk: gt * 7, e: 'happy', mouth: 'smile', seed: 1, light: 1 });
    bigBus(p, bx, gt, doors);
    p.restore();
  }, { vig: .4 });
  cinemaEnd(c, gt, CUE.endcard, 'FIN', 'Quelle vérité tu n\'as jamais osé dire ?');
};
