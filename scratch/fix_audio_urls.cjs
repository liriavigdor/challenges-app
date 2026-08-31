const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const targetObj = `    const soundtrackUrls = {
      "Energetic Workout": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      "Chill Vibes": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      "Epic Motivation": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      "Running Tempo 160bpm": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    };`;

const replaceObj = `    const soundtrackUrls = {
      "Energetic Workout": "https://upload.wikimedia.org/wikipedia/commons/4/4b/MacLeod%2C_Kevin_-_Harmful_or_Fatal.ogg",
      "Chill Vibes": "https://upload.wikimedia.org/wikipedia/commons/c/c2/MacLeod%2C_Kevin_-_Cattails.ogg",
      "Epic Motivation": "https://upload.wikimedia.org/wikipedia/commons/5/5b/MacLeod%2C_Kevin_-_Movement_Proposition.ogg",
      "Running Tempo 160bpm": "https://upload.wikimedia.org/wikipedia/commons/a/a3/MacLeod%2C_Kevin_-_Rhinoceros.ogg"
    };`;

code = code.replace(targetObj, replaceObj);

const modalUploadTarget = `                            { id: "workout", name: "Energetic Workout", artist: "Pulse Music", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
                            { id: "chill", name: "Chill Vibes", artist: "Lofi Beats", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
                            { id: "epic", name: "Epic Motivation", artist: "Cinematic", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
                            { id: "run", name: "Running Tempo 160bpm", artist: "Pulse Fitness", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" }`;

const modalUploadReplace = `                            { id: "workout", name: "Energetic Workout", artist: "Pulse Music", previewUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/MacLeod%2C_Kevin_-_Harmful_or_Fatal.ogg" },
                            { id: "chill", name: "Chill Vibes", artist: "Lofi Beats", previewUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c2/MacLeod%2C_Kevin_-_Cattails.ogg" },
                            { id: "epic", name: "Epic Motivation", artist: "Cinematic", previewUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5b/MacLeod%2C_Kevin_-_Movement_Proposition.ogg" },
                            { id: "run", name: "Running Tempo 160bpm", artist: "Pulse Fitness", previewUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a3/MacLeod%2C_Kevin_-_Rhinoceros.ogg" }`;

code = code.replace(modalUploadTarget, modalUploadReplace);

const playCatchTarget = `window.currentFeedAudio.play().catch(e => alert("אנא אשר ניגון בדפדפן (לחץ שוב)"));`;
const playCatchReplace = `window.currentFeedAudio.play().catch(e => alert("שגיאת נגינה: " + e.message + "\\nנסה שוב."));`;
code = code.split(playCatchTarget).join(playCatchReplace);

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Fixed audio urls and errors');
