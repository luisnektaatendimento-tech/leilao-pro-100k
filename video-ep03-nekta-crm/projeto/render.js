// usage: node render.js <startFrame> <endFrame> <out.mp4>
const { chromium } = require('playwright'); const { spawn } = require('child_process');
const FPS=30; const [s,e,out]=[+process.argv[2],+process.argv[3],process.argv[4]];
(async () => {
  const b = await chromium.launch({args:['--disable-gpu-vsync','--disable-frame-rate-limit']});
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', er => console.error('PAGEERR', er.message));
  await p.goto('file://' + __dirname + '/engine/index.html'); await p.evaluate(() => window.ready);
  const ff = spawn('ffmpeg', ['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-r',String(FPS),out], {stdio:['pipe','inherit','inherit']});
  const t0=Date.now();
  for (let f=s; f<e; f++) {
    await p.evaluate(t => render(t), f/FPS);
    const buf = await p.screenshot({ type: 'jpeg', quality: 94 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f-s)%300===0) console.log(out, f, ((Date.now()-t0)/1000).toFixed(0)+'s');
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('DONE', out, ((Date.now()-t0)/1000).toFixed(0)+'s');
})();
