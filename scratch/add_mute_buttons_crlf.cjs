const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Normalize line endings
code = code.replace(/\r\n/g, '\n');

const targetStr = `                      {/* Comments Sheet Trigger */}
                      <div className="reel-action-btn-wrapper" onClick={() => setCommentSheetPostId(post.id)}>
                        <div className="reel-action-circle">
                          <CommentIcon size={24} />
                        </div>
                        <span className="reel-action-text">{post.comments ? post.comments.length : 0}</span>
                      </div>`;

const targetStrExplore = `                    {/* Comments Sheet Trigger */}
                    <div className="reel-action-btn-wrapper" onClick={() => setCommentSheetPostId(post.id)}>
                      <div className="reel-action-circle">
                        <CommentIcon size={24} />
                      </div>
                      <span className="reel-action-text">{post.comments ? post.comments.length : 0}</span>
                    </div>`;

const replacement = `                      {/* Comments Sheet Trigger */}
                      <div className="reel-action-btn-wrapper" onClick={() => setCommentSheetPostId(post.id)}>
                        <div className="reel-action-circle">
                          <CommentIcon size={24} />
                        </div>
                        <span className="reel-action-text">{post.comments ? post.comments.length : 0}</span>
                      </div>

                      {/* Mute/Unmute Button */}
                      <div className="reel-action-btn-wrapper" onClick={(e) => { e.stopPropagation(); toggleMute(); }}>
                        <div className="reel-action-circle" style={{ background: "rgba(0,0,0,0.5)", borderRadius: "50%" }}>
                          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                        </div>
                        <span className="reel-action-text">{isMuted ? 'השתק' : 'סאונד'}</span>
                      </div>`;

const replacementExplore = `                    {/* Comments Sheet Trigger */}
                    <div className="reel-action-btn-wrapper" onClick={() => setCommentSheetPostId(post.id)}>
                      <div className="reel-action-circle">
                        <CommentIcon size={24} />
                      </div>
                      <span className="reel-action-text">{post.comments ? post.comments.length : 0}</span>
                    </div>

                    {/* Mute/Unmute Button */}
                    <div className="reel-action-btn-wrapper" onClick={(e) => { e.stopPropagation(); toggleMute(); }}>
                      <div className="reel-action-circle" style={{ background: "rgba(0,0,0,0.5)", borderRadius: "50%" }}>
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                      </div>
                      <span className="reel-action-text">{isMuted ? 'השתק' : 'סאונד'}</span>
                    </div>`;

let modified = false;
if (code.includes(targetStr)) {
  code = code.split(targetStr).join(replacement);
  modified = true;
}
if (code.includes(targetStrExplore)) {
  code = code.split(targetStrExplore).join(replacementExplore);
  modified = true;
}

if (modified) {
  fs.writeFileSync('src/App.jsx', code, 'utf8');
  console.log('Mute buttons added successfully');
} else {
  console.log('Target string not found');
}
