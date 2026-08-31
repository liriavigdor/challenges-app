const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Replace soundhelix URLs with wikimedia URLs everywhere
code = code.replace(/https:\/\/www\.soundhelix\.com\/examples\/mp3\/SoundHelix-Song-1\.mp3/g, "https://upload.wikimedia.org/wikipedia/commons/4/4b/MacLeod%2C_Kevin_-_Harmful_or_Fatal.ogg");
code = code.replace(/https:\/\/www\.soundhelix\.com\/examples\/mp3\/SoundHelix-Song-2\.mp3/g, "https://upload.wikimedia.org/wikipedia/commons/c/c2/MacLeod%2C_Kevin_-_Cattails.ogg");
code = code.replace(/https:\/\/www\.soundhelix\.com\/examples\/mp3\/SoundHelix-Song-3\.mp3/g, "https://upload.wikimedia.org/wikipedia/commons/5/5b/MacLeod%2C_Kevin_-_Movement_Proposition.ogg");
code = code.replace(/https:\/\/www\.soundhelix\.com\/examples\/mp3\/SoundHelix-Song-4\.mp3/g, "https://upload.wikimedia.org/wikipedia/commons/a/a3/MacLeod%2C_Kevin_-_Rhinoceros.ogg");

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Fixed audio urls using regex');
