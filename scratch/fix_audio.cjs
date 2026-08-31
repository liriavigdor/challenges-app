const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const useEffTarget = `  useEffect(() => {
    localStorage.setItem('challenges_chats', JSON.stringify(chats));
  }, [chats]);

  // Map & location challenges states`;

const useEffReplacement = `  useEffect(() => {
    localStorage.setItem('challenges_chats', JSON.stringify(chats));
  }, [chats]);

  // Handle feed audio playback via IntersectionObserver
  useEffect(() => {
    if (activeTab !== 'home' && activeTab !== 'explore') {
      if (window.currentFeedAudio) {
        window.currentFeedAudio.pause();
      }
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const audioSrc = entry.target.getAttribute('data-soundtrack');
        if (!audioSrc) return;
        
        if (entry.isIntersecting) {
          if (!window.currentFeedAudio) window.currentFeedAudio = new Audio();
          if (window.currentFeedAudio.src !== audioSrc) {
            window.currentFeedAudio.src = audioSrc;
            window.currentFeedAudio.loop = true;
          }
          window.currentFeedAudio.play().catch(() => {});
        } else {
          if (window.currentFeedAudio && window.currentFeedAudio.src === audioSrc) {
            window.currentFeedAudio.pause();
          }
        }
      });
    }, { threshold: 0.6 });
    
    // Slight delay to ensure DOM is rendered before observing
    setTimeout(() => {
      const reels = document.querySelectorAll('.reel-card');
      reels.forEach(el => observer.observe(el));
    }, 500);
    
    return () => {
      observer.disconnect();
      if (window.currentFeedAudio) window.currentFeedAudio.pause();
    };
  }, [activeTab, feed]);

  // Map & location challenges states`;

code = code.replace(useEffTarget, useEffReplacement);

// Add data-soundtrack to all reel-card elements
code = code.replace(/className="reel-card"/g, 'className="reel-card" data-soundtrack={post.soundtrack || ""}');

const tryTarget = `    try {
      if (currentUser.isBlocked) {`;
const tryReplacement = `    try {
      if (window.previewAudioPlayer) {
        window.previewAudioPlayer.pause();
        window.previewAudioPlayer.currentTime = 0;
      }
      if (currentUser.isBlocked) {`;
code = code.replace(tryTarget, tryReplacement);

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log("Audio fixes applied successfully");
