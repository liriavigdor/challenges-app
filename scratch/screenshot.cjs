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
    
    console.log('Navigating to http://localhost:5173...');
    // We will just wait until domcontentloaded to avoid hanging on external resources
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait an extra 5 seconds for the 3D model to load
    console.log('Waiting for 3D model...');
    await new Promise(r => setTimeout(r, 5000));
    
    const screenshotPath = 'c:\\GitHub\\challenges-app\\screenshot.png';
    console.log('Taking screenshot...');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    await browser.close();
    console.log(`Screenshot saved to ${screenshotPath}`);
  } catch (error) {
    console.error('Error taking screenshot:', error);
    process.exit(1);
  }
})();
