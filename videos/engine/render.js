// Rendu d'un épisode : node render.js <dossier_episode> <dossier_build> [--stills t1,t2,...] [--check]
// Lance Chromium headless, dessine chaque image via render.html + scenes.js et l'envoie à ffmpeg.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const EPDIR = path.resolve(process.argv[2]);
const BUILD = path.resolve(process.argv[3]);
const flag = name => process.argv.indexOf(name);
const TL = JSON.parse(fs.readFileSync(path.join(BUILD, 'timeline.json'), 'utf8'));
const FPS = TL.fps, TOTAL = Math.ceil(TL.duration * FPS), WORKERS = 4;
const PAGE = 'file://' + path.join(__dirname, 'render.html') + '?ep=' + encodeURIComponent(EPDIR);

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => { console.error('page error:', e.message); process.exit(1); });
  await page.goto(PAGE);
  await page.waitForFunction(() => window.EP_READY || window.EP_ERROR);
  const err = await page.evaluate(() => window.EP_ERROR);
  if (err) { console.error(err); process.exit(1); }
  await page.evaluate(async tl => { await document.fonts.load('700 50px Oswald'); await document.fonts.load('800 50px Montserrat'); await document.fonts.ready; window.setup(tl); }, TL);
  return page;
}
const grab = (page, t) => page.evaluate(t => { window.renderFrame(t); return document.getElementById('c').toDataURL('image/jpeg', 0.93); }, t);

function ffmpegSeg(out) {
  return spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
}

(async () => {
  const browser = await chromium.launch();
  if (flag('--check') > 0) { // dessine toutes les images sans les encoder, pour attraper les erreurs
    const page = await openPage(browser);
    const r = await page.evaluate(n => { for (let f = 0; f < n; f++) { try { renderFrame(f / 30); } catch (e) { return `${(f / 30).toFixed(2)} s : ${e.stack.split('\n').slice(0, 3).join(' | ')}`; } } return 'ok'; }, TOTAL);
    console.log(r); await browser.close(); process.exit(r === 'ok' ? 0 : 1);
  }
  if (flag('--stills') > 0) {
    const page = await openPage(browser);
    const dir = path.join(BUILD, 'stills'); fs.mkdirSync(dir, { recursive: true });
    for (const t of process.argv[flag('--stills') + 1].split(',').map(Number)) {
      const b64 = (await grab(page, t)).split(',')[1];
      fs.writeFileSync(path.join(dir, `t${t.toFixed(2).padStart(6, '0')}.jpg`), Buffer.from(b64, 'base64'));
    }
    await browser.close(); return;
  }
  const per = Math.ceil(TOTAL / WORKERS), t0 = Date.now();
  let done = 0;
  await Promise.all(Array.from({ length: WORKERS }, async (_, w) => {
    const page = await openPage(browser);
    const ff = ffmpegSeg(path.join(BUILD, `seg${w}.mp4`));
    const closed = new Promise(r => ff.on('close', r));
    for (let f = w * per; f < Math.min(TOTAL, (w + 1) * per); f++) {
      const b64 = (await grab(page, f / FPS)).split(',')[1];
      if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
      if (++done % 300 === 0) console.log(`${done}/${TOTAL} images (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
    }
    ff.stdin.end(); await closed;
  }));
  await browser.close();
  fs.writeFileSync(path.join(BUILD, 'segs.txt'), Array.from({ length: WORKERS }, (_, w) => `file 'seg${w}.mp4'`).join('\n'));
  console.log('rendu terminé');
})();
