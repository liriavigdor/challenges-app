const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'GitHub', 'challenges-app', 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// The error shows literal '\n' characters in the file
// We will replace '\\n' with actual newlines where it causes syntax errors
css = css.replace(/\\n\/\* Restored Arena CSS \*\/\\n/g, '\n/* Restored Arena CSS */\n');

// Let's also check if there are other literal \n strings causing issues
// The lightningcss error pointed exactly to \n
css = css.replace(/\\n/g, '\n'); 

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Fixed literal \\n in index.css');
