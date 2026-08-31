const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const observerTargetRegex = /const observer = new IntersectionObserver\(\(entries\) => \{[\s\S]*?\}, \{ threshold: 0\.5 \}\);/g;

const newObserver = `const observer = new IntersectionObserver((entries) => {
      clearTimeout(window.feedAudioDebounce);
      window.feedAudioDebounce = setTimeout(() => {
        const cards = Array.from(document.querySelectorAll('.reel-card'));
        let closestCard = null;
        let minDistance = Infinity;
        const centerY = window.innerHeight / 2;
        
        cards.forEach(card => {
          const rect = card.getBoundingClientRect();
          // Only consider cards that are somewhat visible
          if (rect.height > 0) {
            const cardCenter = rect.top + rect.height / 2;
            const dist = Math.abs(centerY - cardCenter);
            if (dist < minDistance) {
              minDistance = dist;
              closestCard = card;
            }
          }
        });
        
        if (!closestCard) {
          if (window.currentFeedAudio) window.currentFeedAudio.pause();
          return;
        }
        
        const soundtrackName = closestCard.getAttribute('data-soundtrack');
        
        if (!soundtrackName || window.isFeedMuted) {
          if (window.currentFeedAudio && !window.currentFeedAudio.paused) {
             window.currentFeedAudio.pause();
          }
          return;
        }
        
        const audioSrc = soundtrackUrls[soundtrackName] || soundtrackName;
        
        if (window.currentFeedAudio && window.currentFeedAudio.src === audioSrc && !window.currentFeedAudio.paused) {
          return;
        }
        
        if (window.currentFeedAudio) {
          window.currentFeedAudio.pause();
          window.currentFeedAudio.src = "";
        }
        
        window.currentFeedAudio = new Audio(audioSrc);
        window.currentFeedAudio.loop = true;
        window.currentFeedAudio.play().catch(e => console.log('Audio play blocked:', e));
      }, 150);
    }, { threshold: [0.1, 0.5, 0.9] });`;

code = code.replace(observerTargetRegex, newObserver);
fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Geometry-based observer logic injected');
