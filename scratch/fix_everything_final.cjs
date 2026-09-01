const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/\r\n/g, '\n');

const observerTargetRegex = /const observer = new IntersectionObserver\(\(entries\) => \{[\s\S]*?\}, \{ threshold: [0-9.]+ \}\);/g;

const replacement = `    // Add visual debugger
    if (!document.getElementById('audio-debugger')) {
      const debugDiv = document.createElement('div');
      debugDiv.id = 'audio-debugger';
      debugDiv.style.position = 'fixed';
      debugDiv.style.top = '10px';
      debugDiv.style.left = '10px';
      debugDiv.style.zIndex = '999999';
      debugDiv.style.background = 'rgba(0,0,0,0.8)';
      debugDiv.style.color = 'lime';
      debugDiv.style.padding = '10px';
      debugDiv.style.fontFamily = 'monospace';
      debugDiv.style.fontSize = '12px';
      debugDiv.style.pointerEvents = 'none';
      document.body.appendChild(debugDiv);
    }
    
    // Add aggressive scroll listener to container instead of intersection observer!
    setTimeout(() => {
      document.querySelectorAll('.reels-feed-container').forEach(container => {
        container.addEventListener('scroll', () => {
          clearTimeout(window.feedAudioDebounce);
          window.feedAudioDebounce = setTimeout(() => {
            const cards = Array.from(document.querySelectorAll('.reel-card'));
            let closestCard = null;
            let minDistance = Infinity;
            const centerY = window.innerHeight / 2;
            
            cards.forEach(card => {
              const rect = card.getBoundingClientRect();
              if (rect.height > 0) {
                const cardCenter = rect.top + rect.height / 2;
                const dist = Math.abs(centerY - cardCenter);
                if (dist < minDistance) {
                  minDistance = dist;
                  closestCard = card;
                }
              }
            });
            
            if (!closestCard) return;
            
            const soundtrackName = closestCard.getAttribute('data-soundtrack');
            const debugText = 'Closest: ' + soundtrackName + ' | Muted: ' + window.isFeedMuted;
            document.getElementById('audio-debugger').innerText = debugText;
            
            if (!soundtrackName || soundtrackName === 'undefined' || soundtrackName === 'null' || window.isFeedMuted) {
              if (window.currentFeedAudio && !window.currentFeedAudio.paused) {
                 window.currentFeedAudio.pause();
              }
              return;
            }
            
            const sUrls = {
              "Energetic Workout": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
              "Chill Vibes": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
              "Epic Motivation": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
              "Running Tempo 160bpm": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
            };
            const audioSrc = sUrls[soundtrackName] || soundtrackName;
            
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
          }, 100);
        });
      });
    }, 1000);

    const observer = new IntersectionObserver((entries) => {
      // Dummy observer just to avoid crashing if referenced
    }, { threshold: 0.5 });`;

if (observerTargetRegex.test(code)) {
  code = code.replace(observerTargetRegex, replacement);
  fs.writeFileSync('src/App.jsx', code, 'utf8');
  console.log('Geometry observer and debugger successfully injected');
} else {
  console.log('FAILED TO MATCH OBSERVER REGEX');
}
