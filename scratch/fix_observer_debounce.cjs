const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const observerRegex = /const observer = new IntersectionObserver\(\(entries\) => \{[\s\S]*?\}, \{ threshold: 0\.6 \}\);/g;

const newObserver = `const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-visible', 'true');
        } else {
          entry.target.setAttribute('data-visible', 'false');
        }
      });
      
      clearTimeout(window.feedAudioDebounce);
      window.feedAudioDebounce = setTimeout(() => {
        const visibleCards = Array.from(document.querySelectorAll('.reel-card[data-visible="true"]'));
        if (visibleCards.length === 0) {
          if (window.currentFeedAudio) window.currentFeedAudio.pause();
          return;
        }
        
        const targetCard = visibleCards[0];
        const soundtrackName = targetCard.getAttribute('data-soundtrack');
        
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
        window.currentFeedAudio.play().catch(e => console.error(e));
      }, 100);
    }, { threshold: 0.5 });`;

code = code.replace(observerRegex, newObserver);
fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Debounced observer logic injected');
