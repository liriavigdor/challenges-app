const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const target1 = `                      {/* Comments Sheet Trigger */}
                      <div className="reel-action-btn-wrapper" onClick={() => setCommentSheetPostId(post.id)}>
                        <div className="reel-action-circle">
                          <CommentIcon size={24} />
                        </div>
                        <span className="reel-action-text">{post.comments ? post.comments.length : 0}</span>
                      </div>`;
                      
const replace1 = `                      {/* Comments Sheet Trigger */}
                      <div className="reel-action-btn-wrapper" onClick={() => setCommentSheetPostId(post.id)}>
                        <div className="reel-action-circle">
                          <CommentIcon size={24} />
                        </div>
                        <span className="reel-action-text">{post.comments ? post.comments.length : 0}</span>
                      </div>

                      {/* Mute/Unmute Button */}
                      <div className="reel-action-btn-wrapper" onClick={() => toggleMute()}>
                        <div className="reel-action-circle" style={{ background: "rgba(0,0,0,0.5)", borderRadius: "50%" }}>
                          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                        </div>
                        <span className="reel-action-text">{isMuted ? 'השתק' : 'סאונד'}</span>
                      </div>`;

const target2 = `                    {/* Comments Sheet Trigger */}
                    <div className="reel-action-btn-wrapper" onClick={() => setCommentSheetPostId(post.id)}>
                      <div className="reel-action-circle">
                        <CommentIcon size={24} />
                      </div>
                      <span className="reel-action-text">{post.comments ? post.comments.length : 0}</span>
                    </div>`;

const replace2 = `                    {/* Comments Sheet Trigger */}
                    <div className="reel-action-btn-wrapper" onClick={() => setCommentSheetPostId(post.id)}>
                      <div className="reel-action-circle">
                        <CommentIcon size={24} />
                      </div>
                      <span className="reel-action-text">{post.comments ? post.comments.length : 0}</span>
                    </div>

                    {/* Mute/Unmute Button */}
                    <div className="reel-action-btn-wrapper" onClick={() => toggleMute()}>
                      <div className="reel-action-circle" style={{ background: "rgba(0,0,0,0.5)", borderRadius: "50%" }}>
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                      </div>
                      <span className="reel-action-text">{isMuted ? 'השתק' : 'סאונד'}</span>
                    </div>`;

code = code.split(target1).join(replace1);
code = code.split(target2).join(replace2);

if (!code.includes('VolumeX')) {
  code = code.replace(`import { Heart, MessageCircle, Share2, MapPin, Award, User, Target, Crown, Flame, ChevronRight, CheckCircle, Video, Image as ImageIcon, Send, Music, Filter, Map as MapIcon, Layers, PlayCircle, Lock, MessageSquare } from 'lucide-react';`, 
  `import { Heart, MessageCircle, Share2, MapPin, Award, User, Target, Crown, Flame, ChevronRight, CheckCircle, Video, Image as ImageIcon, Send, Music, Filter, Map as MapIcon, Layers, PlayCircle, Lock, MessageSquare, Volume2, VolumeX } from 'lucide-react';`);
}

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('Mute buttons added!');
