const puppeteer = require('puppeteer-core');
const fs = require('fs');

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let executablePath = null;
for (const p of chromePaths) {
  if (fs.existsSync(p)) {
    executablePath = p;
    break;
  }
}

(async () => {
  try {
    const browser = await puppeteer.launch({ 
      executablePath,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });

    const port = 5178;
    console.log(`Navigating to http://localhost:${port}/challenges-app/...`);
    await page.goto(`http://localhost:${port}/challenges-app/`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 3000));

    // Click challenges tab button
    await page.evaluate(() => {
      const tabBtns = document.querySelectorAll('.tab-btn');
      if (tabBtns && tabBtns.length >= 3) {
        tabBtns[2].click();
      }
    });

    await new Promise(r => setTimeout(r, 2000));

    const outputPath = 'C:\\Users\\Chen\\.gemini\\antigravity-ide\\brain\\e18eee58-982e-4d55-b128-662ee379cdbc\\photographer_snap.png';
    await page.screenshot({ path: outputPath });
    console.log(`DONE: ${outputPath}`);
    await browser.close();
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
})();
