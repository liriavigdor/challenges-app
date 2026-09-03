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

const artifactDir = 'C:\\Users\\Chen\\.gemini\\antigravity-ide\\brain\\8a4a4e27-2de0-47e0-a16f-20669f1f604b\\';

(async () => {
  const browser = await puppeteer.launch({ executablePath });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  
  await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  
  // Click challenges tab
  await page.evaluate(() => {
    document.querySelectorAll('.tab-btn')[2].click();
  });
  await new Promise(r => setTimeout(r, 4000));

  // Click AI Missions FAB
  await page.evaluate(() => {
    document.querySelector('.cr-floating-btn-left').click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_ai_modal.png') });

  // Click Verify Button
  await page.evaluate(() => {
    document.querySelector('.ai-verify-btn').click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_proof_modal.png') });

  // Click Camera Option
  await page.evaluate(() => {
    document.querySelector('.camera-btn').click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_ai_scanning.png') });

  // Wait for Success
  await new Promise(r => setTimeout(r, 3500));
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_ai_success.png') });

  await browser.close();
  console.log('Photographer finished capturing AI Missions flow.');
})();
