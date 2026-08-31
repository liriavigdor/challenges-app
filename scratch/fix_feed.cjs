const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const target = `<div className="reel-challenge-tag">
                        🏆 {post.challengeTitle}
                      </div>

                      <div className="reel-desc">`;

const replacement = `<div className="reel-challenge-tag">
                        🏆 {post.challengeTitle}
                      </div>

                      {post.soundtrack && (
                        <div className="reel-soundtrack-tag" style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                          🎵 {post.soundtrack}
                        </div>
                      )}

                      <div className="reel-desc">`;

code = code.split(target).join(replacement);
fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Replaced successfully');
