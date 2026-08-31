const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const targetTag = `<div className="reel-soundtrack-tag" style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>`;
const replacementTag = `<div className="reel-soundtrack-tag" style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: 'var(--accent)', cursor: 'pointer', zIndex: 10, position: 'relative' }} onClick={(e) => { e.stopPropagation(); if (window.toggleFeedAudio) window.toggleFeedAudio(post.soundtrack); }}>`;

code = code.split(targetTag).join(replacementTag);

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Made soundtrack tag clickable.');
