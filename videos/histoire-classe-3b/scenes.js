// Le Groupe « Classe 3B » — histoire complète (kits : props.js, horreur.js → hero/kid, quotidien.js).
const EP = { hideSubs: gt => gt > CUE.endcard - .1, subs: { font: '700 84px Oswald', y: 250, stroke: 14, space: 22 } };
const SC = {};
const L = i => LINES[i].start;
const UNK = '+33 6 ?? ?? ?? ??';

SC.chat1 = (c, lt, gt) => {
  groupChat(c, gt, 'Classe 3B', [
    ['Système', `${UNK} a rejoint le groupe`, .6, '#7A8A99'],
    [UNK, 'Demain, le prof de maths sera absent.', CUE.m1, '#C0392B'],
    ['Inès', 'mdr t ki ??', CUE.m2, '#2E7BC4'],
    ['Léo', 'trop drôle le mec 😂', CUE.m2 + 1.2, '#1F8A70'],
  ]);
};
SC.classe = (c, lt, gt) => {
  c.save(); cam(c, 540, 880, 1.0 + lt * .01);
  classroom(c, gt, 'PROF ABSENT');
  [[240, '#5B8BE0', '#3A2A1A'], [540, '#E05B8B', '#C98A3A'], [840, '#5BBF7A', null]].forEach(([x, h, hair], i) => {
    desk(c, x, 1180); mate(c, x, 1330, .68, h, hair, i === 2 ? -1 : 1, { eyes: gt > L(4) ? .8 : .2 });
  });
  const buzz = gt > CUE.buzz && gt < CUE.buzz + .8;
  hero(c, { x: 680, y: 1420, s: .78, f: -1, t: gt, eyes: gt > CUE.buzz ? .9 : .3, front: [2.4, .3], shake: buzz });
  if (gt > CUE.buzz) { const p = pop(gt, CUE.buzz); rr(c, 560, 1080, 70 * p, 120 * p, 12); fs(c, '#BFE3F7', 5); }
  c.restore();
};
SC.chat2 = (c, lt, gt) => {
  groupChat(c, gt, 'Classe 3B', [
    [UNK, 'À midi, Léo va tomber à la cantine.', CUE.m3, '#C0392B'],
    ['Léo', '??? arrête', CUE.fall, '#1F8A70'],
    [UNK, 'Hugo a triché au contrôle. Sarah sort avec Nathan.', CUE.m4, '#C0392B'],
    ['Sarah', 'QUI T AS DIT ÇA', CUE.m5, '#8E44AD'],
    ['Hugo', 'c toi Inès avoue', CUE.m5 + 1, '#D35400'],
  ]);
};
SC.contact = (c, lt, gt) => {
  c.fillStyle = '#DDE6EE'; c.fillRect(0, 0, W, H);
  c.save(); c.translate(540, 1250); c.scale(1.28, 1.28);
  rr(c, -330, -640, 660, 1320, 70); fs(c, '#1d1d22', 0);
  rr(c, -300, -610, 600, 1260, 50); fs(c, '#F7F7FA', 0);
  text(c, 'Nouveau contact', 0, -520, '800 40px Montserrat', '#1d1d22');
  circ(c, 0, -360, 90); fs(c, '#C9CED8', 0); text(c, '?', 0, -352, '800 90px Montserrat', '#fff');
  rr(c, -250, -220, 500, 80, 16); fs(c, '#ECEEF3', 0); text(c, UNK, 0, -178, '700 36px Montserrat', '#1d1d22');
  rr(c, -250, -110, 500, 80, 16); fs(c, '#ECEEF3', 0);
  const typed = 'Le mystère'.slice(0, Math.max(0, Math.floor((gt - L(8) - .5) * 6)));
  text(c, typed || 'Nom', 0, -68, '700 36px Montserrat', typed ? '#1d1d22' : '#A0A6B2');
  const ps = pop(gt, CUE.save);
  rr(c, -150, 20, 300, 80, 40); fs(c, gt > CUE.save ? '#1F8A70' : '#2E7BC4', 0); text(c, 'Enregistrer', 0, 62, '800 34px Montserrat', '#fff');
  if (ps) {
    c.save(); c.translate(0, 300); c.scale(ps, ps);
    rr(c, -270, -150, 540, 300, 26); fs(c, '#fff', 6, '#E53935');
    text(c, 'Ce contact existe déjà', 0, -80, '800 34px Montserrat', '#1d1d22');
    if (gt > CUE.moi - .3) { const m = pop(gt, CUE.moi - .3); c.save(); c.scale(m, m); text(c, 'MOI', 0, 40, '700 130px Oswald', '#E53935'); c.restore(); }
    c.restore();
  }
  c.restore();
};
SC.nuit = (c, lt, gt) => {
  const cam2 = gt > L(11);            // relecture de la vidéo (vision nocturne)
  c.save(); cam(c, 540, 1050, 1.08);
  bedroom(c, gt);
  if (gt < CUE.rise) {               // allongé dans le lit
    c.save(); c.translate(600, 1090); c.rotate(-Math.PI / 2); hero(c, { x: 0, y: 0, s: .62, f: 1, t: gt, eyes: 0 }); c.restore();
    rr(c, 300, 1040, 560, 60, 20); fs(c, '#4A56A8', 0);
  } else {
    const p = pr(gt, CUE.rise, CUE.rise + 1.2);
    hero(c, { x: lerp(480, 640, p), y: 1420, s: .8, f: -1, t: gt, eyes: 1, front: [2.2, .5] });
    if (gt > CUE.write) { glow(c, 560, 1080, 140, 'rgba(160,220,255,A)', .5); rr(c, 530, 1040, 60, 100, 10); fs(c, '#BFE3F7', 4); }
  }
  c.restore();
  if (cam2) {
    c.save(); c.globalCompositeOperation = 'saturation'; c.fillStyle = 'rgba(120,120,120,.95)'; c.fillRect(0, 0, W, H); c.restore();
    c.fillStyle = 'rgba(40,200,90,.14)'; c.fillRect(0, 0, W, H);
    c.save(); c.translate(0, 1500); horrorHud(c, gt - L(11), 'REC · CHAMBRE', '03:01:57'); c.restore();
  }
};
SC.fin = (c, lt, gt) => {
  groupChat(c, gt, 'Classe 3B', [
    ['Toi', 'Demain, quelqu\'un va quitter la classe.', CUE.last, '#F28C28'],
    ['Inès', 'attends… c TOI ?', CUE.last + 1.6, '#2E7BC4'],
  ]);
  endAsk(c, gt, CUE.endcard, 'CLASSE 3B', 'TU SERAIS ALLÉ EN COURS ?');
};
function hud() {}
