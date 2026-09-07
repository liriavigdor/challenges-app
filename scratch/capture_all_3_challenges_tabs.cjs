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
      if (tabBtns.length >= 3) {
        tabBtns[2].click();
      }
    });

    await new Promise(r => setTimeout(r, 2500));
    
    const baseDir = 'C:\\Users\\Chen\\.gemini\\antigravity-ide\\brain\\fd73220f-90de-44b9-9d71-96c0e5a2c11b';
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    console.log('Switching to Explore...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('.sticky.top-0 button'));
      const exploreBtn = btns.find(b => b.textContent.includes('אקספלור'));
      if(exploreBtn) exploreBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: baseDir + '\\explore_tab.png' });

    console.log('Switching to My Challenges...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('.sticky.top-0 button'));
      const myChallengesBtn = btns.find(b => b.textContent.includes('אתגרים'));
      if(myChallengesBtn) myChallengesBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: baseDir + '\\my_challenges_tab.png' });

    console.log('Switching to Training Ground...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('.sticky.top-0 button'));
      const trainingBtn = btns.find(b => b.textContent.includes('אימונים'));
      if(trainingBtn) trainingBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: baseDir + '\\training_ground_tab.png' });

    await browser.close();
    console.log('SUCCESS_CAPTURED');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
