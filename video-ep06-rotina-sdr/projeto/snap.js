const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('PAGEERR', e.message)); p.on('console', m => { if (m.type()==='error') console.log('CONSOLE', m.text()) });
  await p.goto('file://' + __dirname + '/engine/index.html'); await p.evaluate(() => window.ready);
  for (const t of process.argv.slice(2).map(Number)) { await p.evaluate(t => render(t), t); await p.screenshot({ path: `test/t_${String(t).padStart(6,'0')}.jpg`, type: 'jpeg', quality: 85 }); }
  await b.close();
})();
