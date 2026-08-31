const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `    const observer = new IntersectionObserver((entries) => {`;
const replaceStr = `    window.toggleFeedAudio = (soundtrackName) => {
      const audioSrc = soundtrackUrls[soundtrackName] || soundtrackName;
      if (!window.currentFeedAudio) window.currentFeedAudio = new Audio();
      if (window.currentFeedAudio.src === audioSrc && !window.currentFeedAudio.paused) {
        window.currentFeedAudio.pause();
      } else {
        window.currentFeedAudio.src = audioSrc;
        window.currentFeedAudio.loop = true;
        window.currentFeedAudio.play().catch(e => alert("אנא אשר ניגון בדפדפן (לחץ שוב)"));
      }
    };

    const observer = new IntersectionObserver((entries) => {`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replaceStr);
}

const thresholdTarget = `{ threshold: 0.6 }`;
const thresholdReplace = `{ threshold: 0.3 }`;
code = code.replace(thresholdTarget, thresholdReplace);

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('toggle function injected');
