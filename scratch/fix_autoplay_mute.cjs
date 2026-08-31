const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add state variable for isMuted
const stateTarget = `const [doubleTapPostId, setDoubleTapPostId] = useState(null);`;
const stateReplace = `const [doubleTapPostId, setDoubleTapPostId] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  
  window.isFeedMuted = isMuted;
  
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    window.isFeedMuted = nextMuted;
    
    if (nextMuted) {
      if (window.currentFeedAudio) window.currentFeedAudio.pause();
    } else {
      const visibleCard = document.querySelector('.reel-card[data-visible="true"]');
      if (visibleCard) {
        const soundtrack = visibleCard.getAttribute('data-soundtrack');
        if (soundtrack) {
          const sUrls = {
            "Energetic Workout": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            "Chill Vibes": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            "Epic Motivation": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            "Running Tempo 160bpm": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
          };
          const aSrc = sUrls[soundtrack] || soundtrack;
          if (window.currentFeedAudio) {
            window.currentFeedAudio.pause();
            window.currentFeedAudio.src = "";
          }
          window.currentFeedAudio = new Audio(aSrc);
          window.currentFeedAudio.loop = true;
          window.currentFeedAudio.play().catch(e => console.log(e));
        }
      }
    }
  };`;
code = code.split(stateTarget).join(stateReplace);

// 2. Rewrite the IntersectionObserver logic
const observerTargetRegex = /const observer = new IntersectionObserver\(\(entries\) => \{[\s\S]*?\}, \{ threshold: 0\.4 \}\);/g;
const newObserverLogic = `const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const soundtrackName = entry.target.getAttribute('data-soundtrack');
        
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-visible', 'true');
          
          if (!soundtrackName || window.isFeedMuted) return;
          
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
          window.currentFeedAudio.play().catch(e => console.error('Audio play error:', e));
          
        } else {
          entry.target.setAttribute('data-visible', 'false');
          if (window.currentFeedAudio && !window.currentFeedAudio.paused) {
            window.currentFeedAudio.pause();
          }
        }
      });
    }, { threshold: 0.6 });`;

code = code.replace(observerTargetRegex, newObserverLogic);

// 3. Add the mute button inside reel-actions-column
// Looking for the share button in BOTH Home feed and Profile feed
const actionsTarget = `<div className="reel-action-btn-wrapper" onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: post.challengeTitle,
                                text: \`תראו את הביצוע שלי לאתגר "\${post.challengeTitle}"!\`,
                                url: window.location.href
                              }).catch(console.error);
                            } else {
                              alert("שיתוף אינו נתמך בדפדפן זה");
                            }
                          }}>`;

const actionsReplace = `<div className="reel-action-btn-wrapper" onClick={toggleMute}>
                            <div className="reel-action-circle" style={{ background: "rgba(0,0,0,0.5)", borderRadius: "50%" }}>
                              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                            </div>
                            <span className="reel-action-text">{isMuted ? 'השתק' : 'סאונד'}</span>
                          </div>
                          
                          <div className="reel-action-btn-wrapper" onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: post.challengeTitle,
                                text: \`תראו את הביצוע שלי לאתגר "\${post.challengeTitle}"!\`,
                                url: window.location.href
                              }).catch(console.error);
                            } else {
                              alert("שיתוף אינו נתמך בדפדפן זה");
                            }
                          }}>`;
code = code.split(actionsTarget).join(actionsReplace);

// We need to import VolumeX and Volume2 if they aren't imported
if (!code.includes('VolumeX')) {
  code = code.replace(`import { Heart, MessageCircle, Share2, MapPin, Award, User, Target, Crown, Flame, ChevronRight, CheckCircle, Video, Image as ImageIcon, Send, Music, Filter, Map as MapIcon, Layers, PlayCircle, Lock, MessageSquare } from 'lucide-react';`, 
  `import { Heart, MessageCircle, Share2, MapPin, Award, User, Target, Crown, Flame, ChevronRight, CheckCircle, Video, Image as ImageIcon, Send, Music, Filter, Map as MapIcon, Layers, PlayCircle, Lock, MessageSquare, Volume2, VolumeX } from 'lucide-react';`);
}

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Autoplay and Mute logic injected successfully.');
