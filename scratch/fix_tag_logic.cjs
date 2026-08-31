const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `<div className="reel-soundtrack-tag" style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: 'var(--accent)', cursor: 'pointer', zIndex: 10, position: 'relative' }} onClick={(e) => { e.stopPropagation(); if (window.toggleFeedAudio) window.toggleFeedAudio(post.soundtrack); }}>
                          🎵 {post.soundtrack}
                        </div>`;

const replaceStr = `<div className="reel-soundtrack-tag" style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: 'var(--accent)', cursor: 'pointer', zIndex: 9999, position: 'relative', pointerEvents: 'auto', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '12px', display: 'inline-block' }} onClick={(e) => { e.stopPropagation(); if (window.toggleFeedAudio) window.toggleFeedAudio(post.soundtrack); }}>
                          🎵 {post.soundtrack} (לחץ לשמיעה)
                        </div>`;

code = code.split(targetStr).join(replaceStr);

// To ensure `window.toggleFeedAudio` is ALWAYS available, let's inject it globally right outside the component if possible, or just add a direct fallback:
const toggleFallbackTarget = `onClick={(e) => { e.stopPropagation(); if (window.toggleFeedAudio) window.toggleFeedAudio(post.soundtrack); }}`;
const toggleFallbackReplace = `onClick={(e) => { 
                          e.stopPropagation(); 
                          const sUrls = {
                            "Energetic Workout": "https://upload.wikimedia.org/wikipedia/commons/4/4b/MacLeod%2C_Kevin_-_Harmful_or_Fatal.ogg",
                            "Chill Vibes": "https://upload.wikimedia.org/wikipedia/commons/c/c2/MacLeod%2C_Kevin_-_Cattails.ogg",
                            "Epic Motivation": "https://upload.wikimedia.org/wikipedia/commons/5/5b/MacLeod%2C_Kevin_-_Movement_Proposition.ogg",
                            "Running Tempo 160bpm": "https://upload.wikimedia.org/wikipedia/commons/a/a3/MacLeod%2C_Kevin_-_Rhinoceros.ogg"
                          };
                          const aSrc = sUrls[post.soundtrack] || post.soundtrack;
                          if (!window.currentFeedAudio) window.currentFeedAudio = new Audio();
                          if (window.currentFeedAudio.src === aSrc && !window.currentFeedAudio.paused) {
                            window.currentFeedAudio.pause();
                          } else {
                            window.currentFeedAudio.src = aSrc;
                            window.currentFeedAudio.loop = true;
                            window.currentFeedAudio.play().catch(err => alert("שגיאת נגינה: " + err.message + "\\n\\nנסה ללחוץ שוב."));
                          }
                        }}`;

code = code.split(toggleFallbackTarget).join(toggleFallbackReplace);


fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Fixed tag styling and injected standalone play function');
