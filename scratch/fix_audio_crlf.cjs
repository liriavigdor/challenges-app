const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Normalize line endings for reliable matching
code = code.replace(/\r\n/g, '\n');

// 1. Add IntersectionObserver for feed audio playback
const effectMatch = `  useEffect(() => {
    localStorage.setItem('challenges_chats', JSON.stringify(chats));
  }, [chats]);

  // Map & location challenges states`;

const effectReplace = `  useEffect(() => {
    localStorage.setItem('challenges_chats', JSON.stringify(chats));
  }, [chats]);

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

if (code.includes(effectMatch)) {
    code = code.replace(effectMatch, effectReplace);
    console.log("Replaced useEffect");
} else {
    console.log("Could not find useEffect match");
}

// 2. Add reel-soundtrack-tag to the feed item.
// Let's use a regex that handles whitespace easily
const feedItemMatch = /<div className="reel-challenge-tag">\s*🏆 \{post\.challengeTitle\}\s*<\/div>\s*<div className="reel-desc">/g;

const feedItemReplace = `<div className="reel-challenge-tag">
                        🏆 {post.challengeTitle}
                      </div>

                      {post.soundtrack && (
                        <div className="reel-soundtrack-tag" style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                          🎵 {post.soundtrack}
                        </div>
                      )}

                      <div className="reel-desc">`;

if (feedItemMatch.test(code)) {
    code = code.replace(feedItemMatch, feedItemReplace);
    console.log("Replaced feed item rendering");
} else {
    console.log("Could not find feed item match");
}

// 3. Add data-soundtrack to reel-card
// We just add it to all <div className="reel-card"> that don't already have it
code = code.replace(/<div\s+key=\{post\.id\}\s+className="reel-card"/g, '<div \n                    key={post.id} \n                    className="reel-card"\n                    data-soundtrack={post.soundtrack || ""}');
console.log("Replaced reel-card data-soundtrack");

// 4. Stop preview audio in handleCreateChallenge
const submitMatch = `  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    if (window.isCreatingChallengeInProgress) return;
    window.isCreatingChallengeInProgress = true;
    try {
      if (currentUser.isBlocked) {`;

const submitReplace = `  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    if (window.isCreatingChallengeInProgress) return;
    window.isCreatingChallengeInProgress = true;
    try {
      if (window.previewAudioPlayer) {
        window.previewAudioPlayer.pause();
        window.previewAudioPlayer.currentTime = 0;
      }
      if (currentUser.isBlocked) {`;

if (code.includes(submitMatch)) {
    code = code.replace(submitMatch, submitReplace);
    console.log("Replaced submit match");
} else {
    console.log("Could not find submit match");
}

// Convert back to CRLF just in case (optional, but good for git diffs on windows)
code = code.replace(/\n/g, '\r\n');

fs.writeFileSync('src/App.jsx', code, 'utf8');
