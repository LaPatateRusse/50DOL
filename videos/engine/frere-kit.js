// Kit de la mini-série « Le secret de mon frère.. » (personnages, décors, accessoires). Tout est rangé dans FK.
// Règle des bras (docs/production.md) : armF/armB = [épaule, coude], coude entre 0 et 1,2, jamais négatif.
const FK = (() => {
  const LEO = '#2E9E6A', LEO2 = '#24815A', MAMAN = '#C76B3A', MAMAN2 = '#A65A30', COACH = '#2A3A6A', COACH2 = '#1E2C52';
  const leoHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); c.fillStyle = '#16120E';
    c.beginPath(); c.arc(0, -r * .05, r * 1.05, Math.PI * 1.0, Math.PI * 2.0); c.lineTo(r * 1.0, -r * .35); c.quadraticCurveTo(0, -r * .62, -r * 1.0, -r * .3); c.closePath(); c.fill();
    rr(c, -r * .98, -r * .62, r * 1.96, r * .13, r * .065); fs(c, '#F2F2F2', 0); c.restore(); }; // bandeau blanc
  const mamanHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); c.fillStyle = '#1A1410';
    circ(c, -r * .62, -r * .9, r * .4); c.fill(); c.beginPath(); c.arc(0, 0, r * 1.07, Math.PI * 1.0, Math.PI * 1.95); c.quadraticCurveTo(r * .3, -r * .6, -r * .1, -r * .55); c.quadraticCurveTo(-r * .7, -r * .45, -r * 1.07, 0); c.fill();
    c.fillStyle = '#E8B04A'; circ(c, -r * .62, -r * .9, r * .1); c.fill(); c.restore(); };
  const coachHair = (c, r, hc = [0, 0]) => { c.save(); c.translate(hc[0], hc[1]); c.beginPath(); c.arc(0, -r * .1, r * 1.03, Math.PI * 1.02, Math.PI * 1.98); c.closePath(); fs(c, '#1E2C52', 0);
    rr(c, r * .2, -r * .45, r * 1.0, r * .18, r * .09); fs(c, '#16203E', 0); c.restore(); };
  const ballIcon = (c, x, y, red) => { c.save(); c.translate(x, y); circ(c, 0, 0, 15); fs(c, red ? '#FF3B30' : '#FFFFFF', 0); c.fillStyle = '#15151C';
    c.beginPath(); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; c.lineTo(Math.cos(a) * 6, Math.sin(a) * 6); } c.closePath(); c.fill(); c.restore(); };

  // ---------- accessoires ----------
  function mop(c, x, y, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); line(c, [[0, -60], [0, 340]], 10, '#C9A27A', null); rr(c, -50, 330, 100, 50, 14); fs(c, '#D8DCE6', 0); for (let i = -4; i <= 4; i++) line(c, [[i * 11, 370], [i * 12, 420]], 7, '#D8DCE6', null); c.restore(); }
  function bucket(c, x, y, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); c.beginPath(); c.moveTo(-70, -110); c.lineTo(70, -110); c.lineTo(55, 0); c.lineTo(-55, 0); c.closePath(); fs(c, '#3A7BD8', 0); c.beginPath(); c.ellipse(0, -110, 70, 16, 0, 0, Math.PI * 2); fs(c, '#6FA8F0', 0); c.beginPath(); c.arc(0, -110, 70, Math.PI, 0); c.lineWidth = 5; c.strokeStyle = '#2A2F40'; c.stroke(); c.restore(); }
  function boots(c, x, y, s, gt) { c.save(); c.translate(x, y); c.scale(s, s);
    rr(c, -330, -40, 660, 220, 14); fs(c, '#E8E2D4', 0); rr(c, -330, -70, 660, 50, 10); fs(c, '#D8D0BE', 0); text(c, 'NEUF', 230, 120, '900 40px Montserrat', '#C83A4A');
    [-150, 130].forEach((bx, i) => { c.save(); c.translate(bx, 40); c.scale(i ? -1 : 1, 1); rr(c, -120, -60, 240, 90, [60, 30, 30, 20]); fs(c, '#F5B82E', 0); c.beginPath(); c.ellipse(-50, -52, 60, 16, 0, 0, Math.PI * 2); fs(c, '#2A1A10', 0); line(c, [[-10, -20], [60, -40], [100, -10]], 10, '#FFFFFF', null); rr(c, -120, 10, 240, 26, 10); fs(c, '#15151C', 0); for (let k = 0; k < 5; k++) { rr(c, -100 + k * 45, 34, 18, 18, 4); fs(c, '#15151C', 0); } c.restore(); });
    glow(c, 0, 20, 300, 'rgba(255,255,255,A)', .15 + Math.sin(gt * 3) * .05); c.restore(); }
  function jar(c, x, y, s, n) { c.save(); c.translate(x, y); c.scale(s, s);
    rr(c, -120, -260, 240, 270, 40); fs(c, 'rgba(200,230,255,.28)', 0); rr(c, -100, -300, 200, 50, 10); fs(c, '#C9A040', 0);
    for (let i = 0; i < n; i++) { c.save(); c.translate(-60 + (i % 4) * 40, -30 - Math.floor(i / 4) * 34); c.rotate((i % 3 - 1) * .3); rr(c, -40, -14, 80, 28, 4); fs(c, i % 2 ? '#6FBF73' : '#5DAA62', 0); c.restore(); }
    rr(c, -120, -260, 240, 270, 40); fs(c, null, 6, 'rgba(255,255,255,.6)'); c.restore(); }
  function envelope(c, x, y, s, open) { c.save(); c.translate(x, y); c.scale(s, s);
    if (open > 0) for (let i = 0; i < 5; i++) { rr(c, -150 + i * 8, -110 - open * (60 + i * 18), 300, 120, 6); fs(c, i % 2 ? '#6FBF73' : '#5DAA62', 0); }
    rr(c, -200, -120, 400, 240, 10); fs(c, '#E8DCC0', 0); c.beginPath(); c.moveTo(-200, -120); c.lineTo(0, 10); c.lineTo(200, -120); c.lineWidth = 6; c.strokeStyle = '#C9B48E'; c.stroke();
    text(c, 'Pour Léo', 0, 70, 'italic 600 40px Montserrat', '#5A4A3A'); c.restore(); }
  function bankLetter(c, x, y, s, k) { c.save(); c.translate(x, y); c.scale(s, s);
    rr(c, -300, -380, 600, 760, 6); fs(c, '#F4F1EA', 0); rr(c, -260, -340, 120, 50, 6); fs(c, '#2E5BA8', 0); text(c, 'BANQUE', -200, -315, '800 22px Montserrat', '#fff');
    ['Madame,', 'Nous vous rappelons', 'le solde de votre prêt', 'professionnel :'].forEach((l, i) => text(c, l, -250, -220 + i * 50, '600 30px Montserrat', '#3A3D48', 'left'));
    text(c, 'Reste à payer', 0, 90, '700 32px Montserrat', '#3A3D48'); text(c, '13 600,00 €', 0, 160, '900 70px Montserrat', '#C83A4A');
    if (k > 0) { c.save(); c.globalAlpha = clamp(k); c.lineWidth = 8; c.strokeStyle = '#C83A4A'; rr(c, -230, 110, 460, 100, 12); c.stroke(); c.restore(); } c.restore(); }
  function article(c, x, y, w, h, title, photo, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); rr(c, -w / 2, -h / 2, w, h, 3); fs(c, '#F2EEE4', 0);
    text(c, title, 0, -h / 2 + 26, '900 20px Montserrat', '#22232A'); if (photo) { c.fillStyle = '#8A9AB0'; c.fillRect(-w / 2 + 14, -h / 2 + 44, w - 28, h * .5); bust(c, 0, -h / 2 + 44 + h * .3, h * .13, { t: 0, col: LEO, col2: LEO2, hair: leoHair, e: 'happy', mouth: 'smile', blink: false }); }
    c.fillStyle = 'rgba(60,60,70,.35)'; for (let i = 0; i < 4; i++) c.fillRect(-w / 2 + 14, h * .14 + i * 14, w - 28 - (i % 2) * 30, 6); c.restore(); }

  // ---------- décors (repère 1920 × 1080) ----------
  function stadium(p, gt, o = {}) {
    const day = o.day;
    p.fillStyle = day ? grad(p, 0, 700, ['#7FB2E8', '#CFE3F5']) : grad(p, 0, 700, ['#04060F', '#0E1430']); p.fillRect(-400, -300, 2800, 1100);
    // tribunes
    for (let r = 0; r < 9; r++) { const y = 180 + r * 52; p.fillStyle = r % 2 ? (day ? '#3A6FC0' : '#1E2C55') : (day ? '#4A80D0' : '#243566'); p.fillRect(-400, y, 2800, 46);
      if (o.crowd) for (let i = 0; i < 70; i++) { if (rnd(i * 13 + r) < .35) continue; const x = -380 + i * 42 + (r % 2) * 20, b = Math.sin(gt * 6 + i + r) * (o.cheer ? 6 : 1); circ(p, x, y + 10 + b, 12); fs(p, ['#E85D75', '#F5B82E', '#FFFFFF', '#2E9E6A', '#15151C'][(i + r) % 5], 0); } }
    p.fillStyle = '#0B0F1E'; p.fillRect(-400, 640, 2800, 30);
    // pelouse
    p.fillStyle = day ? '#3E9E4E' : '#1E5A30'; p.fillRect(-400, 670, 2800, 600);
    for (let i = 0; i < 12; i++) { p.fillStyle = 'rgba(255,255,255,.05)'; p.fillRect(-400 + i * 240, 670, 120, 600); }
    p.strokeStyle = 'rgba(255,255,255,.75)'; p.lineWidth = 6; p.beginPath(); p.moveTo(-400, 760); p.lineTo(2400, 760); p.stroke(); p.beginPath(); p.ellipse(960, 900, 260, 80, 0, 0, Math.PI * 2); p.stroke(); p.beginPath(); p.moveTo(960, 760); p.lineTo(960, 1100); p.stroke();
    // projecteurs
    [[120, 60], [1800, 60]].forEach(([x, y]) => { line(p, [[x, y + 40], [x, 640]], 14, '#2A2F40', null); rr(p, x - 90, y - 40, 180, 90, 8); fs(p, '#3A4054', 0);
      for (let k = 0; k < 6; k++) { circ(p, x - 60 + (k % 3) * 60, y - 15 + Math.floor(k / 3) * 40, 14); fs(p, '#FFFBE8', 0); }
      if (!day) { glow(p, x, y, 300, 'rgba(255,250,225,A)', .55); cone(p, x, y + 30, 120, 1400, 900, 'rgba(230,240,255,A)', .12); } });
    if (!day) { p.fillStyle = 'rgba(200,220,255,.06)'; p.fillRect(-400, -300, 2800, 1500); }
    text(p, o.club || 'FC LES TOURS', 960, 120, '900 54px Montserrat', day ? '#FFFFFF' : 'rgba(255,255,255,.75)');
  }
  function shared(p, gt, o = {}) { // chambre des deux frères, le soir
    MK.bedroomDay(p, gt);
    rr(p, 1160, 640, 520, 120, 18); fs(p, '#2E7D5B', 0); rr(p, 1170, 600, 170, 70, 30); fs(p, '#D8DCEC', 0);
    [[260, 220, '#F5B82E', '⚽'], [460, 200, '#2E9E6A', '10']].forEach(([x, y, cl, t]) => { rr(p, x, y, 150, 210, 4); fs(p, cl, 0); text(p, t, x + 75, y + 105, '900 70px Montserrat', '#FFFFFF'); });
    if (o.closet) { rr(p, 1700, 150, 260, 680, 6); fs(p, '#4A3328', 0); line(p, [[1830, 160], [1830, 820]], 6, '#3A2618', null); }
  }
  function kitchenDay(p, gt, o = {}) {
    MK.kitchen(p, gt, !o.night);
    rr(p, 1420, 260, 280, 560, 20); fs(p, '#E8ECF2', 0); line(p, [[1440, 470], [1680, 470]], 6, '#C9CED8', null); rr(p, 1440, 330, 16, 90, 8); fs(p, '#A8AEB8', 0);
    for (let i = 0; i < (o.clips ?? 5); i++) article(p, 1500 + (i % 2) * 110, 320 + Math.floor(i / 2) * 120, 96, 110, 'LÉO', i === 0, (i % 3 - 1) * .08);
    if (o.newArticle) article(p, 1560, 650, 190, 230, 'LÉO SIGNE !', true, -.05);
  }
  function busNight(p, gt) { MK.trainIn(p, gt); p.fillStyle = 'rgba(255,180,60,.06)'; p.fillRect(-400, -300, 2800, 1500); }
  function bakeryClosed(p, gt) {
    p.fillStyle = grad(p, 0, 1080, ['#0B1024', '#1A2140']); p.fillRect(-400, -300, 2800, 1500);
    rr(p, 360, 160, 1200, 640, 10); fs(p, '#4A2E1E', 0); rr(p, 420, 300, 1080, 440, 6); fs(p, '#151A2A', 0);
    rr(p, 360, 120, 1200, 120, 8); fs(p, '#C76B3A', 0); text(p, 'BOULANGERIE ROSE', 960, 180, '900 64px Montserrat', '#FFF3E0');
    p.save(); p.translate(960, 520); p.rotate(-.08); rr(p, -220, -70, 440, 140, 10); fs(p, '#F4F1EA', 0); text(p, 'FERMÉ', 0, 4, '900 80px Montserrat', '#C83A4A'); p.restore();
    p.fillStyle = '#1A1A22'; p.fillRect(-400, 820, 2800, 400);
    p.save(); p.globalAlpha = .3; for (let i = 0; i < 90; i++) { const x = (i * 197) % 2300 - 200, y = ((i * 263 + gt * 1500) % 1300) - 150; line(p, [[x, y], [x - 8, y + 36]], 3, '#C9D6F0', null); } p.restore();
  }

  return { LEO, LEO2, MAMAN, MAMAN2, COACH, COACH2, leoHair, mamanHair, coachHair, ballIcon, mop, bucket, boots, jar, envelope, bankLetter, article, stadium, shared, kitchenDay, busNight, bakeryClosed };
})();
