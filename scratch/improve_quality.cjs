const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Remove soundtrack tags
// This regex looks for {post.soundtrack && ( ... )} blocks
const soundtrackRegex = /\{post\.soundtrack && \([\s\S]*?<div className="reel-soundtrack-tag"[\s\S]*?<\/div>\s*\)\}/g;
code = code.replace(soundtrackRegex, '');

// 2. Increase image quality for uploads
// Replace max = 800; with max = 1600;
code = code.replace(/const max = 800;/g, 'const max = 1600;');
// Replace image/jpeg, 0.7 with image/jpeg, 0.9
code = code.replace(/canvas\.toDataURL\('image\/jpeg', 0\.7\)/g, "canvas.toDataURL('image/jpeg', 0.9)");

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Image quality improved and soundtrack links removed');
