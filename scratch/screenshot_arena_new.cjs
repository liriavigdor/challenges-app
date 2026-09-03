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
    console.log(`Launching browser using: ${executablePath}`);
    const browser = await puppeteer.launch({ executablePath });
    const page = await browser.newPage();
    
    // Set viewport to a typical mobile size for the app
    await page.setViewport({ width: 375, height: 812 });
    
    console.log('Navigating to http://localhost:5175...');
    await page.goto('http://localhost:5175', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    console.log('Waiting for initial load...');
    await new Promise(r => setTimeout(r, 2000));

    console.log('Clicking the Challenges tab...');
    await page.evaluate(() => {
      const tabBtns = document.querySelectorAll('.tab-btn');
      if (tabBtns.length >= 3) {
        tabBtns[2].click();
      }
    });

    console.log('Waiting for 3D model and tab transition...');
    await new Promise(r => setTimeout(r, 4000));
    
    const screenshotPath = 'C:\\Users\\Chen\\.gemini\\antigravity-ide\\brain\\062c7f81-0092-4dc3-947e-4d94bc5eb5c1\\arena_ui.png';
    console.log('Taking screenshot...');
    await page.screenshot({ path: screenshotPath });
    
    await browser.close();
    console.log(`Screenshot saved to ${screenshotPath}`);
  } catch (error) {
    console.error('Error taking screenshot:', error);
    process.exit(1);
  }
})();
