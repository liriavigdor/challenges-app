const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser for Evidence Modal capture...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  console.log("Navigating to app...");
  await page.goto('http://localhost:5173/challenges-app/', { waitUntil: 'networkidle0', timeout: 30000 });

  // Navigate to Challenges Tab
  console.log("Switching to challenges tab...");
  const navButtons = await page.$$('.tab-btn');
  if (navButtons.length >= 3) {
    await navButtons[2].click();
    await new Promise(r => setTimeout(r, 1000));
  }

  // Navigate to Training Ground
  console.log("Switching to Training Ground...");
  const tabs = await page.$$('button');
  for (let tab of tabs) {
    const text = await page.evaluate(el => el.textContent, tab);
    if (text.includes('אימונים')) {
      await tab.click();
      await new Promise(r => setTimeout(r, 1500));
      break;
    }
  }

  // Click on the first daily quest to open modal
  console.log("Opening Evidence Modal...");
  const quests = await page.$$('h4 + div > div'); // Select the daily quests
  if (quests.length > 0) {
    await quests[0].click();
    await new Promise(r => setTimeout(r, 1000)); // wait for modal animation
    
    await page.screenshot({ path: 'C:/Users/Chen/.gemini/antigravity-ide/brain/d73c2e3f-844b-45c6-a0bb-dd2a824a7283/evidence_modal_idle.png' });
    console.log("Captured Idle Modal.");
    
    // Click to start scanning
    console.log("Starting scan...");
    const uploadArea = await page.$('.border-dashed');
    if (uploadArea) {
      await uploadArea.click();
      await new Promise(r => setTimeout(r, 1000)); // wait for scanning state
      await page.screenshot({ path: 'C:/Users/Chen/.gemini/antigravity-ide/brain/d73c2e3f-844b-45c6-a0bb-dd2a824a7283/evidence_modal_scanning.png' });
      console.log("Captured Scanning Modal.");
      
      await new Promise(r => setTimeout(r, 2000)); // wait for success state
      await page.screenshot({ path: 'C:/Users/Chen/.gemini/antigravity-ide/brain/d73c2e3f-844b-45c6-a0bb-dd2a824a7283/evidence_modal_success.png' });
      console.log("Captured Success Modal.");
    }
  }

  await browser.close();
  console.log("SUCCESS_CAPTURED");
})();
