const fs = require('fs');

// Fix index.css top-grid margin
const cssPath = 'c:/GitHub/challenges-app/src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');
const fixTopGrid = `\n/* Fix Top Grid overlapping HUD */\n.top-grid {\n  margin-top: 4.5rem !important;\n}\n`;
fs.appendFileSync(cssPath, fixTopGrid, 'utf8');
console.log('Fixed index.css top-grid');

// Fix App.jsx \n\n text
const appPath = 'c:/GitHub/challenges-app/src/App.jsx';
let appText = fs.readFileSync(appPath, 'utf8');
if (appText.includes('}\\n\\n        {/* TAB: CHATS */}')) {
  appText = appText.replace('}\\n\\n        {/* TAB: CHATS */}', '}\n\n        {/* TAB: CHATS */}');
  fs.writeFileSync(appPath, appText, 'utf8');
  console.log('Fixed \\n\\n in App.jsx');
} else {
  console.log('Could not find exact \\n\\n string in App.jsx, searching with regex...');
  const newAppText = appText.replace(/\\n\\n\s*{\/\* TAB: CHATS \*\//g, '\n        {/* TAB: CHATS */');
  fs.writeFileSync(appPath, newAppText, 'utf8');
  console.log('Replaced via regex.');
}
