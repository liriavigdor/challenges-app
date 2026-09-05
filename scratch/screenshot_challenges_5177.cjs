const puppeteer = require('puppeteer');
const path = require('path');

const artifactDir = 'C:\\Users\\Chen\\.gemini\\antigravity-ide\\brain\\1361d2b5-cf31-43c8-8a1b-80d7f09a4759';
const BASE_URL = 'http://localhost:5177/challenges-app/';

(async () => {
  console.log('🎬 The Photographer: launching Puppeteer...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 }); // iPhone 14 Pro

  console.log(`📡 Navigating to ${BASE_URL}...`);
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  // Helper: click bottom-nav tab by index
  const clickBottomTab = async (idx) => {
    await page.evaluate((i) => {
      const tabs = document.querySelectorAll('.tab-btn');
      if (tabs[i]) tabs[i].click();
    }, idx);
    await new Promise(r => setTimeout(r, 1500));
  };

  // Helper: click inner tab by label text
  const clickInnerTab = async (labelText) => {
    await page.evaluate((text) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.trim().includes(text));
      if (btn) btn.click();
    }, labelText);
    await new Promise(r => setTimeout(r, 1000));
  };

  // 1. Click Challenges bottom tab (index 2)
  console.log('📸 Navigating to Challenges tab...');
  await clickBottomTab(2);
  await new Promise(r => setTimeout(r, 1500));

  // 2. Screenshot: אתגרים inner tab (default)
  console.log('📸 Capturing אתגרים inner tab...');
  await clickInnerTab('אתגרים');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(artifactDir, 'challenges_my_challenges.png'), fullPage: false });
  console.log('✅ challenges_my_challenges.png saved');

  // Scroll to see more
  await page.evaluate(() => window.scrollBy(0, 400));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(artifactDir, 'challenges_my_challenges_scroll.png'), fullPage: false });

  // 3. Screenshot: אימונים inner tab (Training Ground — main refactored tab)
  console.log('📸 Capturing אימונים inner tab...');
  await clickInnerTab('אימונים');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'challenges_training_ground_top.png'), fullPage: false });
  console.log('✅ challenges_training_ground_top.png saved');

  // Scroll down to see Master Challenge
  await page.evaluate(() => {
    const scrollable = document.querySelector('.overflow-y-auto') || document.querySelector('.flex-1');
    if (scrollable) scrollable.scrollTop = 600;
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(artifactDir, 'challenges_training_ground_master.png'), fullPage: false });
  console.log('✅ challenges_training_ground_master.png saved');

  // 4. Screenshot: אקספלור inner tab
  console.log('📸 Capturing אקספלור inner tab...');
  await clickInnerTab('אקספלור');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'challenges_explore.png'), fullPage: false });
  console.log('✅ challenges_explore.png saved');

  await browser.close();
  console.log('🎬 The Photographer: all done!');
})().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
