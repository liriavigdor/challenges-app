const fs = require('fs');
const text = fs.readFileSync('c:\\GitHub\\challenges-app\\src\\App.jsx', 'utf8');
const lines = text.split('\n');
lines.forEach((line, i) => {
  if (line.toLowerCase().includes('head2head') || line.toLowerCase().includes('מגרש ביתי')) {
    console.log(`${i + 1}: ${line.trim()}`);
  }
});
