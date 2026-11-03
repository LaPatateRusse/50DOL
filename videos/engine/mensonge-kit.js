// Kit de la mini-série « Cent euros le mensonge » (personnages, coiffures, décors). Tout est rangé dans MK.
const MK = (() => {
  const POTE = '#3D7BD8', POTE2 = '#2C5FAE';
const MOM = '#B5446E', MOM2 = '#93365A', MOMHAIR = '#4A2E22', COAT = '#6E717D', COAT2 = '#55585F';
const MAMIE = '#7A6AA8', MAMIE2 = '#5E5088';

// ---------- coiffures ----------
const momHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); c.fillStyle = MOMHAIR;
  circ(c, -r * .62, -r * .9, r * .38); c.fill(); c.beginPath(); c.arc(0, 0, r * 1.07, Math.PI * 1.0, Math.PI * 1.95); c.quadraticCurveTo(r * .3, -r * .6, -r * .1, -r * .55); c.quadraticCurveTo(-r * .7, -r * .45, -r * 1.07, 0); c.fill(); c.restore(); };
const hatHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  rr(c, -r * 1.45, -r * .86, r * 2.9, r * .26, r * .13); fs(c, '#1B1C22', 0);
  rr(c, -r * .92, -r * 1.85, r * 1.84, r * 1.05, [r * .35, r * .35, 6, 6]); fs(c, '#1B1C22', 0);
  c.fillStyle = '#7A2A2A'; c.fillRect(-r * .92, -r * 1.02, r * 1.84, r * .18); c.restore(); };
const mamieHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.fillStyle = '#ECECF2'; circ(c, -r * .3, -r * 1.0, r * .42); c.fill();
  c.beginPath(); c.arc(0, 0, r * 1.08, Math.PI * .95, Math.PI * 2.0); c.quadraticCurveTo(r * .4, -r * .5, 0, -r * .5); c.quadraticCurveTo(-r * .6, -r * .45, -r * 1.08, r * .1); c.fill();
  c.strokeStyle = 'rgba(180,180,200,.6)'; c.lineWidth = r * .03; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(-r * .3, -r * 1.0, r * (.12 + i * .08), 0, 5); c.stroke(); }
  c.lineWidth = r * .045; c.strokeStyle = '#D9B34A'; circ(c, r * .02, -r * .05, r * .19); c.stroke(); circ(c, r * .5, -r * .05, r * .19); c.stroke(); c.beginPath(); c.moveTo(r * .2, -r * .05); c.lineTo(r * .32, -r * .05); c.stroke();
  c.restore(); };
const papyHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); c.beginPath(); c.arc(0, -r * .05, r * 1.06, Math.PI * 1.05, Math.PI * 1.9); c.quadraticCurveTo(r * .2, -r * .7, -r * .9, -r * .2); c.fillStyle = '#3A2A1E'; c.fill(); c.restore(); };
const tear = (p, x, y, gt, a) => { if (gt < a) return; const k = ((gt - a) * .5) % 1; p.save(); p.globalAlpha = 1 - k; p.beginPath(); p.ellipse(x, y + k * 120, 10, 16, 0, 0, Math.PI * 2); p.fillStyle = '#7FC8FF'; p.fill(); p.restore(); };

// ---------- décors ----------
function salon(p, gt, o = {}) {
  wallpaper(p, -300, -200, 2600, 1040, '#B89878', 'rgba(170,80,90,.28)');
  p.fillStyle = '#3E281E'; p.fillRect(-300, 820, 2600, 400); p.fillStyle = 'rgba(0,0,0,.25)'; p.fillRect(-300, 820, 2600, 14);
  p.beginPath(); p.ellipse(900, 900, 620, 60, 0, 0, Math.PI * 2); p.fillStyle = '#7A2430'; p.fill();
  // fenêtre + rideaux
  rr(p, 1560, 160, 300, 380, 4); fs(p, '#0E1430', 0); glow(p, 1700, 260, 120, 'rgba(200,215,255,A)', .35);
  if (o.lamp) { line(p, [[1660, 540], [1660, 360], [1700, 345]], 6, '#2A2F44', null); circ(p, 1705, 345, 9); fs(p, '#FFF3D6', 0); cone(p, 1705, 350, 20, 140, 190, 'rgba(255,230,170,A)', .35); if (o.who) { p.fillStyle = '#05060A'; rr(p, 1688, 470, 30, 70, 10); p.fill(); circ(p, 1703, 455, 14); p.fill(); p.fillRect(1683, 438, 40, 6); rr(p, 1693, 420, 20, 20, 3); p.fill(); circ(p, 1700, 455, 2.4); fs(p, '#FFE9A0', 0); circ(p, 1708, 455, 2.4); fs(p, '#FFE9A0', 0); } }
  rr(p, 1550, 150, 320, 400, 4); fs(p, null, 14, '#5A3E2A');
  rr(p, 1500, 120, 70, 520, 20); fs(p, '#8A2230', 0); rr(p, 1850, 120, 70, 520, 20); fs(p, '#8A2230', 0);
  // horloge à balancier
  const cx = 1330; rr(p, cx - 80, 180, 160, 520, 14); fs(p, '#5A3A22', 0); circ(p, cx, 280, 62); fs(p, '#F2EAD8', 0);
  const hh = (gt / 60) * Math.PI * 2, mm = gt * .8; line(p, [[cx, 280], [cx + Math.sin(hh + 5.7) * 30, 280 - Math.cos(hh + 5.7) * 30]], 6, '#222', null); line(p, [[cx, 280], [cx + Math.sin(mm) * 46, 280 - Math.cos(mm) * 46]], 4, '#222', null);
  rr(p, cx - 50, 380, 100, 280, 8); fs(p, '#2A1A10', 0); const sw = Math.sin(gt * 3.1) * .35; line(p, [[cx, 390], [cx + Math.sin(sw) * 220, 390 + Math.cos(sw) * 220]], 4, '#C9A040', null); circ(p, cx + Math.sin(sw) * 220, 390 + Math.cos(sw) * 220, 22); fs(p, '#D9B04A', 0);
  // lampe + guéridon + fleurs
  rr(p, 160, 560, 200, 20, 6); fs(p, '#5A3A22', 0); line(p, [[260, 580], [260, 820]], 12, '#4A2E1E', null);
  line(p, [[220, 560], [220, 440]], 6, '#2A1A10', null); p.beginPath(); p.moveTo(160, 440); p.lineTo(280, 440); p.lineTo(250, 360); p.lineTo(190, 360); p.closePath(); fs(p, '#E8C88A', 0); glow(p, 220, 420, 300, 'rgba(255,210,140,A)', .55);
  rr(p, 300, 500, 40, 60, 10); fs(p, '#6A8AB8', 0); [[-20, 470], [0, 455], [22, 468]].forEach(([dx, dy]) => { circ(p, 320 + dx, dy, 14); fs(p, '#E85D75', 0); circ(p, 320 + dx, dy, 5); fs(p, '#F5D58A', 0); });
  // télé + meuble
  rr(p, 1000, 560, 320, 260, 8); fs(p, '#4A2E1E', 0); rr(p, 1040, 430, 200, 140, 16); fs(p, '#1A1A20', 0); rr(p, 1060, 450, 160, 100, 10); fs(p, '#2A3038', 0);
  glow(p, 900, 300, 900, 'rgba(255,190,120,A)', .12);
}
function armchair(p, x, y, front) {
  if (!front) { rr(p, x - 150, y - 520, 300, 420, [120, 120, 20, 20]); fs(p, '#8E2433', 0); p.fillStyle = 'rgba(0,0,0,.2)'; p.fillRect(x - 150, y - 140, 300, 40); rr(p, x - 160, y - 160, 320, 120, 20); fs(p, '#A02A3A', 0); return; }
  rr(p, x - 190, y - 250, 70, 220, 30); fs(p, '#9A2838', 0); rr(p, x + 120, y - 250, 70, 220, 30); fs(p, '#7E2030', 0); rr(p, x - 180, y - 40, 360, 40, 10); fs(p, '#6A1A26', 0);
}
function bedroomDay(p, gt) { // chambre (le soir, lumière de lampe)
  p.fillStyle = grad(p, 0, 820, ['#2A2440', '#3A3050']); p.fillRect(-300, -200, 2600, 1040);
  p.fillStyle = '#1E1A2C'; p.fillRect(-300, 820, 2600, 400);
  rr(p, 1300, 160, 380, 320, 4); fs(p, '#0C1028', 0); rr(p, 1290, 150, 400, 340, 4); fs(p, null, 12, '#4A4270');
  rr(p, 200, 640, 700, 120, 18); fs(p, '#2B3A7A', 0); rr(p, 210, 600, 200, 70, 30); fs(p, '#D8DCEC', 0);
  [[1050, 300, '#E85D75'], [1130, 320, '#F5B82E']].forEach(([x, y, cl]) => { rr(p, x, y, 60, 80, 4); fs(p, cl, 0); });
  glow(p, 600, 300, 700, 'rgba(255,200,140,A)', .18);
}
function trainIn(p, gt) {
  p.fillStyle = '#1A2238'; p.fillRect(-300, -200, 2600, 1500);
  for (let i = 0; i < 3; i++) {
    const wx = 120 + i * 620; rr(p, wx, 170, 480, 330, 40); p.save(); p.clip();
    p.fillStyle = '#070A18'; p.fillRect(wx, 170, 480, 330);
    for (let k = 0; k < 14; k++) { const x = wx + ((k * 173 - gt * 900) % 900 + 900) % 900 - 200; circ(p, x, 380 + rnd(k) * 80, 4 + rnd(k + 3) * 5); fs(p, 'rgba(255,214,140,.85)', 0); }
    p.fillStyle = 'rgba(30,40,70,.9)'; for (let k = 0; k < 4; k++) { const x = wx + ((k * 400 - gt * 1800) % 1600 + 1600) % 1600 - 400; p.fillRect(x, 170, 30, 330); }
    p.restore(); rr(p, wx, 170, 480, 330, 40); fs(p, null, 10, '#3A4870');
  }
  p.fillStyle = '#26304C'; p.fillRect(-300, 560, 2600, 40);
  for (let i = 0; i < 4; i++) { rr(p, 60 + i * 520, 520, 360, 300, 30); fs(p, '#2E5BA8', 0); p.fillStyle = 'rgba(0,0,0,.2)'; p.fillRect(60 + i * 520, 760, 360, 60); }
  p.fillStyle = '#121828'; p.fillRect(-300, 880, 2600, 400);
  [400, 1000, 1600].forEach(x => lamp(p, x, 40, 260));
}
function trainOut(p, gt, o = {}) {
  p.fillStyle = grad(p, 0, 900, ['#05081A', '#151B3A']); p.fillRect(-300, -200, 2600, 1500);
  glow(p, 1500, 200, 160, 'rgba(220,230,255,A)', .6); circ(p, 1500, 200, 46); fs(p, '#EEF2FF', 0);
  for (let i = 0; i < 8; i++) { const x = ((i * 300 - gt * 60) % 2400 + 2400) % 2400 - 300; p.beginPath(); p.moveTo(x, 760); p.lineTo(x + 180, 520 - rnd(i) * 120); p.lineTo(x + 360, 760); p.fillStyle = '#0B1026'; p.fill(); }
  p.fillStyle = '#080A14'; p.fillRect(-300, 760, 2600, 400);
  const tx = -2400 + ((gt - (o.t0 || 0)) * 700);
  for (let w = 0; w < 5; w++) { const x = tx + w * 620; rr(p, x, 560, 600, 190, 26); fs(p, '#26324E', 0); p.fillStyle = 'rgba(255,220,150,.9)'; for (let k = 0; k < 4; k++) p.fillRect(x + 40 + k * 140, 600, 100, 60); glow(p, x + 300, 630, 300, 'rgba(255,210,140,A)', .2); }
  glow(p, tx + 3100, 650, 260, 'rgba(255,250,220,A)', .8);
  p.fillStyle = '#2A2E3A'; p.fillRect(-300, 752, 2600, 10);
}
function houseNight(p, gt, open) {
  p.fillStyle = grad(p, 0, 900, ['#0B1024', '#1A2140']); p.fillRect(-300, -200, 2600, 1500);
  for (let y = 0; y < 820; y += 60) for (let x = (y / 60 % 2) * 60 - 300; x < 2300; x += 120) { rr(p, x, y, 112, 52, 4); fs(p, '#3A2A30', 0); }
  p.fillStyle = 'rgba(0,0,0,.35)'; p.fillRect(-300, -200, 2600, 1100);
  rr(p, 760, 200, 400, 640, 6); fs(p, '#4A2E1E', 0);
  rr(p, 790, 230, 340, 610, 4); fs(p, '#FFD9A0', 0); glow(p, 960, 540, 600, 'rgba(255,200,130,A)', .5 * open);
  p.save(); p.translate(790, 230); p.scale(1 - open * .82, 1); rr(p, 0, 0, 340, 610, 4); fs(p, '#6A3A24', 0); rr(p, 40, 40, 260, 230, 6); fs(p, '#5A2E1C', 0); rr(p, 40, 320, 260, 250, 6); fs(p, '#5A2E1C', 0); circ(p, 300, 330, 14); fs(p, '#D9B04A', 0); p.restore();
  glow(p, 1240, 240, 200, 'rgba(255,220,150,A)', .7); circ(p, 1240, 240, 26); fs(p, '#FFF0C8', 0);
  p.fillStyle = '#1A1A22'; p.fillRect(-300, 840, 2600, 400); rr(p, 700, 820, 520, 30, 6); fs(p, '#5A5A66', 0);
  if (open > .3) { p.save(); p.globalAlpha = open * .5; p.beginPath(); p.moveTo(790, 840); p.lineTo(1130, 840); p.lineTo(1500, 1100); p.lineTo(500, 1100); p.closePath(); p.fillStyle = 'rgba(255,210,150,.6)'; p.fill(); p.restore(); }
  p.save(); p.globalAlpha = .3; for (let i = 0; i < 90; i++) { const x = (i * 197) % 2300 - 200, y = ((i * 263 + gt * 1200) % 1300) - 150; line(p, [[x, y], [x - 8, y + 30]], 3, '#C9D6F0', null); } p.restore();
}
function photo(p, x, y, s, rot, gt, back) {
  p.save(); p.translate(x, y); p.rotate(rot); p.scale(s, s);
  rr(p, -260, -320, 520, 640, 8); fs(p, '#EEE6D2', 0); p.shadowColor = 'rgba(0,0,0,.4)';
  if (back) {
    p.fillStyle = 'rgba(120,90,60,.15)'; p.fillRect(-260, -320, 520, 640);
    ['Pour briser le pacte,', 'il faut dire', 'la vérité qui coûte', 'le plus.'].forEach((l, i) => { const k = clamp((back - i * .22) / .22); if (k <= 0) return; p.save(); p.beginPath(); p.rect(-240, -140 + i * 90 - 50, 480 * k, 100); p.clip(); text(p, l, 0, -140 + i * 90, 'italic 600 48px Montserrat', '#2A3A6A'); p.restore(); });
    text(p, '— A.', 150, 250, 'italic 600 40px Montserrat', '#2A3A6A');
  } else {
    rr(p, -225, -285, 450, 470, 4); p.save(); p.clip();
    p.filter = 'sepia(.85) contrast(.9)';
    p.fillStyle = '#8A9AB0'; p.fillRect(-225, -285, 450, 470); p.fillStyle = '#5A5A50'; p.fillRect(-225, 100, 450, 100);
    rig(p, { x: 0, y: 160, s: .55, f: 1, t: 0, col: '#6A5A4A', col2: '#54463A', pants: '#2A2A2A', hair: papyHair, e: 'happy', mouth: 'smile', armF: [2.1, -.6], blink: false, holdF: (q, hx, hy) => coin(q, hx + 6, hy - 30, 20, 1.1) });
    p.filter = 'none'; p.restore();
    text(p, 'Été 1976', 0, 250, 'italic 600 40px Montserrat', '#5A4A3A');
  }
  p.restore();
}

const capHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, -r * .1, r * 1.03, Math.PI * 1.02, Math.PI * 1.98); c.closePath(); fs(c, '#D83A3A', 0);
  rr(c, r * .2, -r * .45, r * 1.05, r * .2, r * .1); fs(c, '#B02828', 0); circ(c, 0, -r * 1.1, r * .08); fs(c, '#B02828', 0); c.restore(); };
const profHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]);
  c.beginPath(); c.arc(0, 0, r * 1.04, Math.PI * .85, Math.PI * 1.35); c.lineWidth = r * .22; c.strokeStyle = '#B8BCC6'; c.stroke();
  c.lineWidth = r * .05; c.strokeStyle = '#E8C46A'; [r * .0, r * .5].forEach(x => { circ(c, x, -r * .05, r * .2); c.stroke(); }); c.restore(); };

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


  return { POTE, POTE2, MOM2, MOMHAIR, COAT, COAT2, MAMIE2, MAMIE, MOM, armchair, bedroomDay, capHair, hatHair, houseNight, kitchen, mamieHair, momHair, papyHair, photo, plus100, profHair, salon, street, tear, trainIn, trainOut };
})();
