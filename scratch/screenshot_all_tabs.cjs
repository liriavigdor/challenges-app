const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

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

const artifactDir = 'C:\\Users\\Chen\\.gemini\\antigravity-ide\\brain\\8a4a4e27-2de0-47e0-a16f-20669f1f604b\\';

(async () => {
  try {
    console.log(`Launching browser using: ${executablePath}`);
    const browser = await puppeteer.launch({ executablePath });
    const page = await browser.newPage();
    
    // Set viewport to mobile size
    await page.setViewport({ width: 375, height: 812 });
    
    // NOTE: using port 5174 based on recent dev server logs
    console.log('Navigating to http://localhost:5174...');
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    console.log('Waiting for initial load and 3D models...');
    await new Promise(r => setTimeout(r, 6000));
    
    const tabs = [
      { index: 0, name: 'feed' },
      { index: 1, name: 'matchmaking' },
      { index: 2, name: 'challenges' },
      { index: 3, name: 'ai_mentor' },
      { index: 4, name: 'profile' }
    ];

    for (const tab of tabs) {
      console.log(`Clicking tab ${tab.name}...`);
      await page.evaluate((idx) => {
        const tabBtns = document.querySelectorAll('.tab-btn');
        if (tabBtns.length > idx) {
          tabBtns[idx].click();
        }
      }, tab.index);

      // Wait for page to render and 3D models to load
      await new Promise(r => setTimeout(r, 4000));
      
      const screenshotPath = path.join(artifactDir, `screenshot_${tab.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Screenshot saved to ${screenshotPath}`);
    }
    
    await browser.close();
    console.log('All screenshots completed.');
  } catch (error) {
    console.error('Error taking screenshots:', error);
    process.exit(1);
  }
})();
