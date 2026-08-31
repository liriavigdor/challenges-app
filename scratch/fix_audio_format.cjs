const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Revert URLs to MP3
code = code.replace(/https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/4\/4b\/MacLeod%2C_Kevin_-_Harmful_or_Fatal\.ogg/g, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
code = code.replace(/https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/c\/c2\/MacLeod%2C_Kevin_-_Cattails\.ogg/g, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3");
code = code.replace(/https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/5\/5b\/MacLeod%2C_Kevin_-_Movement_Proposition\.ogg/g, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3");
code = code.replace(/https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/a\/a3\/MacLeod%2C_Kevin_-_Rhinoceros\.ogg/g, "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3");

// 2. Fix Preview Player (מסך 2)
const previewTarget = `                                if (!window.previewAudioPlayer) {
                                  window.previewAudioPlayer = new Audio();
                                }
                                window.previewAudioPlayer.pause();
                                if (track.previewUrl) {
                                  window.previewAudioPlayer.src = track.previewUrl;
                                  window.previewAudioPlayer.play().catch(e => console.log(e));
                                }`;
                                
const previewReplace = `                                if (window.previewAudioPlayer) {
                                  window.previewAudioPlayer.pause();
                                  window.previewAudioPlayer.src = "";
                                }
                                if (track.previewUrl) {
                                  window.previewAudioPlayer = new Audio(track.previewUrl);
                                  window.previewAudioPlayer.play().catch(e => alert("שגיאת נגינה (תצוגה מקדימה): " + e.message));
                                }`;

code = code.split(previewTarget).join(previewReplace);

// 3. Fix Feed Player (in the injected fallback)
const feedTarget = `if (!window.currentFeedAudio) window.currentFeedAudio = new Audio();
                          if (window.currentFeedAudio.src === aSrc && !window.currentFeedAudio.paused) {
                            window.currentFeedAudio.pause();
                          } else {
                            window.currentFeedAudio.src = aSrc;
                            window.currentFeedAudio.loop = true;
                            window.currentFeedAudio.play().catch(err => alert("שגיאת נגינה: " + err.message + "\\n\\nנסה ללחוץ שוב."));
                          }`;
                          
const feedReplace = `if (window.currentFeedAudio && window.currentFeedAudio.src === aSrc && !window.currentFeedAudio.paused) {
                            window.currentFeedAudio.pause();
                          } else {
                            if (window.currentFeedAudio) {
                              window.currentFeedAudio.pause();
                              window.currentFeedAudio.src = "";
                            }
                            window.currentFeedAudio = new Audio(aSrc);
                            window.currentFeedAudio.loop = true;
                            window.currentFeedAudio.play().catch(err => alert("שגיאת נגינה: " + err.message + "\\n\\nנסה ללחוץ שוב."));
                          }`;

code = code.split(feedTarget).join(feedReplace);

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Fixed audio players and reverted to MP3');
