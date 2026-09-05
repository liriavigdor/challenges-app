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

if (!executablePath) {
  console.error('Could not find Chrome or Edge installation.');
  process.exit(1);
}

(async () => {
  try {
    const browser = await puppeteer.launch({ executablePath, headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844 });
    
    console.log('Navigating to app...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    console.log('Switching to challenges tab...');
    await page.evaluate(() => {
      const tabBtns = Array.from(document.querySelectorAll('.tab-btn'));
      // The swords icon or 3rd button is challenges
      if (tabBtns.length >= 3) {
        tabBtns[2].click();
      }
    });

    await new Promise(r => setTimeout(r, 2500));
    
    const screenshotPath = 'C:\\Users\\Chen\\.gemini\\antigravity-ide\\brain\\1294f209-2060-44d2-aebd-a245e50847fc\\current_tabs_state.png';
    await page.screenshot({ path: screenshotPath });
    
    await browser.close();
    console.log('SUCCESS_CAPTURED');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
