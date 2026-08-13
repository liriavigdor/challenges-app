import React, { useState, useEffect } from 'react';
import { 
  FireIcon, 
  TrophyIcon, 
  DumbbellIcon, 
  MedalIcon, 
  UserIcon, 
  ActivityIcon, 
  PlusIcon, 
  HeartIcon, 
  CommentIcon, 
  CalendarIcon, 
  SearchIcon, 
  SunIcon, 
  MoonIcon,
  CameraIcon
} from './icons';
import { initialUsers, initialChallenges, initialFeed } from './mockData';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('feed');
  const [users, setUsers] = useState(initialUsers);
  const [challenges, setChallenges] = useState(initialChallenges);
  const [feed, setFeed] = useState(initialFeed);
  
  // Current user simulator (רועי כהן)
  const [currentUser, setCurrentUser] = useState(initialUsers[0]);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for creating a new challenge
  const [newChallengeTitle, setNewChallengeTitle] = useState('');
  const [newChallengeDesc, setNewChallengeDesc] = useState('');
  const [newChallengeCategory, setNewChallengeCategory] = useState('כוח');
  const [newChallengeDifficulty, setNewChallengeDifficulty] = useState('קל');
  const [newChallengeXp, setNewChallengeXp] = useState(200);

  // Form states for completing a challenge (Proof upload simulation)
  const [proofChallengeId, setProofChallengeId] = useState('');
  const [proofText, setProofText] = useState('');
  const [proofImage, setProofImage] = useState('');

  // Comment input state
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Join or Leave a challenge
  const toggleJoinChallenge = (challengeId) => {
    let updatedActiveChallenges;
    if (currentUser.activeChallenges.includes(challengeId)) {
      updatedActiveChallenges = currentUser.activeChallenges.filter(id => id !== challengeId);
    } else {
      updatedActiveChallenges = [...currentUser.activeChallenges, challengeId];
    }
    
    const updatedUser = { ...currentUser, activeChallenges: updatedActiveChallenges };
    setCurrentUser(updatedUser);
    
    // Update in users list
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  // Like a post on the feed
  const handleLikePost = (postId) => {
    setFeed(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
          hasLiked: !post.hasLiked
        };
      }
      return post;
    }));
  };

  // Clap/Fire a post
  const handleClapPost = (postId) => {
    setFeed(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          claps: post.hasClapped ? post.claps - 1 : post.claps + 1,
          hasClapped: !post.hasClapped
        };
      }
      return post;
    }));
  };

  // Post a comment
  const handleAddComment = (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    setFeed(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `c_${Date.now()}`,
              userName: currentUser.name,
              text: text
            }
          ]
        };
      }
      return post;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Create a new Challenge
  const handleCreateChallenge = (e) => {
    e.preventDefault();
    if (!newChallengeTitle.trim()) return;

    const newChallenge = {
      id: `challenge_${Date.now()}`,
      title: newChallengeTitle,
      description: newChallengeDesc,
      category: newChallengeCategory,
      difficulty: newChallengeDifficulty,
      xpReward: Number(newChallengeXp),
      participantsCount: 1,
      duration: "חד פעמי",
      creator: currentUser.name,
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    };

    setChallenges(prev => [newChallenge, ...prev]);
    
    // Automatically join the newly created challenge
    const updatedUser = {
      ...currentUser,
      activeChallenges: [...currentUser.activeChallenges, newChallenge.id]
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    // Reset inputs & Go to Challenges Tab
    setNewChallengeTitle('');
    setNewChallengeDesc('');
    setActiveTab('challenges');
  };

  // Submit proof and complete a challenge
  const handleCompleteChallenge = (e) => {
    e.preventDefault();
    if (!proofChallengeId) return;

    const challenge = challenges.find(c => c.id === proofChallengeId);
    if (!challenge) return;

    // Create a new Feed post
    const newFeedItem = {
      id: `feed_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      challengeTitle: challenge.title,
      achievementDetail: proofText || `השלמתי את האתגר "${challenge.title}" בהצלחה! 💪`,
      proofImage: proofImage || "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80",
      likes: 1,
      claps: 1,
      hasLiked: true,
      hasClapped: true,
      timestamp: "כרגע",
      comments: []
    };

    setFeed(prev => [newFeedItem, ...prev]);

    // Reward XP and update user state
    const updatedXp = currentUser.xp + challenge.xpReward;
    const updatedCompletedCount = currentUser.completedChallengesCount + 1;
    const updatedActiveChallenges = currentUser.activeChallenges.filter(id => id !== challenge.id);
    
    const updatedUser = {
      ...currentUser,
      xp: updatedXp,
      completedChallengesCount: updatedCompletedCount,
      activeChallenges: updatedActiveChallenges
    };

    setCurrentUser(updatedUser);
    
    // Update users list and sort by rank
    setUsers(prev => {
      const unsorted = prev.map(u => u.id === currentUser.id ? updatedUser : u);
      return unsorted.sort((a, b) => b.xp - a.xp).map((u, index) => ({ ...u, rank: index + 1 }));
    });

    // Reset proof form
    setProofChallengeId('');
    setProofText('');
    setProofImage('');
    setActiveTab('feed');
  };

  // Filter categories helper
  const categories = ['הכל', 'כוח', 'אירובי', 'ליבה', 'שטח'];
  const filteredChallenges = challenges.filter(c => {
    const matchesCategory = selectedCategory === 'הכל' || c.category === selectedCategory;
    const matchesSearch = c.title.includes(searchQuery) || c.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="app-header">
        <div className="logo-container">
          <ActivityIcon className="logo-icon" size={28} style={{ color: 'var(--accent)' }} />
          <span className="logo-text">Pulse</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={toggleTheme} className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
            {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
          </button>
          
          <div className="user-info" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
            <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar" style={{ width: 34, height: 34 }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{currentUser.name}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>XP {currentUser.xp}</span>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT AREA */}
      <main style={{ flex: 1, padding: '1rem 1.5rem', overflowY: 'auto' }}>
        
        {/* TAB 1: FEED */}
        {activeTab === 'feed' && (
          <div>
            <h2 style={{ marginBottom: '1rem', fontWeight: 800 }}>פיד הישגים חברתי</h2>
            {feed.map(post => (
              <div key={post.id} className="glass-card feed-post">
                <div className="post-header">
                  <div className="user-info">
                    <img src={post.userAvatar} alt={post.userName} className="user-avatar" />
                    <div className="post-meta">
                      <h4>{post.userName}</h4>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                  <span className="challenge-badge-pill">{post.challengeTitle}</span>
                </div>
                
                <p className="post-content">{post.achievementDetail}</p>
                
                {post.proofImage && (
                  <img src={post.proofImage} alt="הוכחת הישג" className="post-image" />
                )}
                
                <div className="post-actions">
                  <button 
                    onClick={() => handleLikePost(post.id)} 
                    className={`action-btn ${post.hasLiked ? 'active like' : ''}`}
                  >
                    <HeartIcon size={18} fill={post.hasLiked ? "currentColor" : "none"} />
                    <span>{post.likes}</span>
                  </button>
                  
                  <button 
                    onClick={() => handleClapPost(post.id)} 
                    className={`action-btn ${post.hasClapped ? 'active clap' : ''}`}
                  >
                    <FireIcon size={18} fill={post.hasClapped ? "currentColor" : "none"} />
                    <span>{post.claps} מחיאות כפיים</span>
                  </button>
                </div>

                {/* Comments */}
                <div className="comments-section">
                  {post.comments.map(c => (
                    <div key={c.id} className="comment-item">
                      <span className="comment-user">{c.userName}:</span>
                      <span>{c.text}</span>
                    </div>
                  ))}
                  
                  <div className="comment-input-container">
                    <input 
                      type="text" 
                      className="comment-input" 
                      placeholder="כתבו תגובה עשירה..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    />
                    <button 
                      onClick={() => handleAddComment(post.id)}
                      className="btn btn-primary" 
                      style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                    >
                      שלח
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: CHALLENGES */}
        {activeTab === 'challenges' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontWeight: 800 }}>אתגרים פתוחים</h2>
              <button onClick={() => setActiveTab('create')} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <PlusIcon size={18} /> יוזמה חדשה
              </button>
            </div>

            {/* Filters */}
            <div className="category-filter">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="חפשו אתגר ספציפי..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            <div className="challenges-grid">
              {filteredChallenges.map(c => {
                const isJoined = currentUser.activeChallenges.includes(c.id);
                return (
                  <div key={c.id} className="glass-card challenge-card">
                    {c.image && <img src={c.image} alt={c.title} className="challenge-img" />}
                    <div className="challenge-info-row">
                      <span className={`difficulty-tag difficulty-${c.difficulty}`}>{c.difficulty}</span>
                      <span>⚡ {c.xpReward} XP</span>
                      <span>👥 {c.participantsCount} משתתפים</span>
                    </div>
                    
                    <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>{c.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{c.description}</p>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => toggleJoinChallenge(c.id)} 
                        className={`btn ${isJoined ? 'btn-secondary' : 'btn-primary'}`} 
                        style={{ flex: 1 }}
                      >
                        {isJoined ? 'עזוב אתגר' : 'הצטרף לאתגר'}
                      </button>
                      
                      {isJoined && (
                        <button 
                          onClick={() => {
                            setProofChallengeId(c.id);
                            setActiveTab('complete-challenge');
                          }} 
                          className="btn btn-primary" 
                          style={{ background: 'var(--success)' }}
                        >
                          העלה הוכחה 📷
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CREATE CHALLENGE */}
        {activeTab === 'create' && (
          <div className="glass-card">
            <h2 style={{ marginBottom: '1.25rem', fontWeight: 800 }}>יצירת אתגר חברתי חדש</h2>
            <form onSubmit={handleCreateChallenge}>
              <div className="form-group">
                <label className="form-label">שם האתגר</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="לדוגמה: ריצת 5 קילומטר זריחה" 
                  value={newChallengeTitle}
                  onChange={(e) => setNewChallengeTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">תיאור האתגר ומטרות</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  placeholder="הסבירו מה צריך לעשות ואיך לתעד..." 
                  value={newChallengeDesc}
                  onChange={(e) => setNewChallengeDesc(e.target.value)}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">קטגוריה</label>
                  <select 
                    className="form-control"
                    value={newChallengeCategory}
                    onChange={(e) => setNewChallengeCategory(e.target.value)}
                  >
                    <option value="כוח">כוח</option>
                    <option value="אירובי">אירובי</option>
                    <option value="ליבה">ליבה</option>
                    <option value="שטח">שטח</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">רמת קושי</label>
                  <select 
                    className="form-control"
                    value={newChallengeDifficulty}
                    onChange={(e) => setNewChallengeDifficulty(e.target.value)}
                  >
                    <option value="קל">קל</option>
                    <option value="בינוני">בינוני</option>
                    <option value="קשה">קשה</option>
                    <option value="קשה מאוד">קשה מאוד</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">נקודות XP כפרס</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={newChallengeXp}
                  onChange={(e) => setNewChallengeXp(e.target.value)}
                  min="50"
                  max="1000"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                פרסם אתגר לכולם 🚀
              </button>
            </form>
          </div>
        )}

        {/* TAB: COMPLETE CHALLENGE (UPLOAD PROOF) */}
        {activeTab === 'complete-challenge' && (
          <div className="glass-card">
            <h2 style={{ marginBottom: '1.25rem', fontWeight: 800 }}>תיעוד והעלאת הוכחה</h2>
            <form onSubmit={handleCompleteChallenge}>
              <div className="form-group">
                <label className="form-label">איזה אתגר השלמת?</label>
                <select 
                  className="form-control"
                  value={proofChallengeId}
                  onChange={(e) => setProofChallengeId(e.target.value)}
                  required
                >
                  <option value="">בחר אתגר...</option>
                  {challenges.filter(c => currentUser.activeChallenges.includes(c.id)).map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">ספר לחברים איך היה (תיעוד)</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  placeholder="איך היה? מה הזמן שלכם? טיפ למשתתפים הבאים..." 
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">תמונת הוכחה (קישור לתמונה/צילום מסך)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="url" 
                    className="form-control" 
                    placeholder="הדבק קישור לתמונה (או השאר ריק לתמונת ברירת מחדל)" 
                    value={proofImage}
                    onChange={(e) => setProofImage(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.75rem' }}>
                    <CameraIcon size={20} />
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', background: 'var(--success)' }}>
                אשר ופרסם בפיד 🏆
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div>
            <h2 style={{ fontWeight: 800 }}>טבלת האלופים</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>הציונים הגבוהים ביותר המבוססים על השלמת אתגרים וצבירת XP.</p>
            
            <div className="leaderboard-list">
              {users.map((user, index) => (
                <div 
                  key={user.id} 
                  className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}
                >
                  <div className="leaderboard-user">
                    <span className={`rank-badge rank-${index + 1}`}>{index + 1}</span>
                    <img src={user.avatar} alt={user.name} className="user-avatar" style={{ border: 'none' }} />
                    <div>
                      <h4 style={{ fontWeight: 700 }}>{user.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.completedChallengesCount} אתגרים שהושלמו</p>
                    </div>
                  </div>
                  
                  <span className="xp-badge">{user.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE */}
        {activeTab === 'profile' && (
          <div>
            <div className="profile-hero">
              <img src={currentUser.avatar} alt={currentUser.name} className="profile-avatar" />
              <h2 style={{ fontWeight: 800 }}>{currentUser.name}</h2>
              <span style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 'bold' }}>דרגה: אלטילט על 🏅</span>
              
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-val">{currentUser.xp}</span>
                  <span className="stat-lbl">XP סה״כ</span>
                </div>
                <div className="stat-item" style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', padding: '0 1.5rem' }}>
                  <span className="stat-val">{currentUser.completedChallengesCount}</span>
                  <span className="stat-lbl">אתגרים שהושלמו</span>
                </div>
                <div className="stat-item">
                  <span className="stat-val">{currentUser.activeChallenges.length}</span>
                  <span className="stat-lbl">אתגרים פעילים</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>תגים והישגים שקיבלת</h3>
              <div className="badges-grid">
                {currentUser.badges.map(b => (
                  <span key={b} className="badge-tag">{b}</span>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>האתגרים הפעילים שלך</h3>
              {currentUser.activeChallenges.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>אין לך אתגרים פעילים כרגע. לך ללשונית אתגרים והצטרף לאחד!</p>
              ) : (
                <div className="challenges-grid">
                  {challenges.filter(c => currentUser.activeChallenges.includes(c.id)).map(c => (
                    <div key={c.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontWeight: 700 }}>{c.title}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>פרס: {c.xpReward} XP</span>
                      </div>
                      <button 
                        onClick={() => {
                          setProofChallengeId(c.id);
                          setActiveTab('complete-challenge');
                        }} 
                        className="btn btn-primary" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'var(--success)' }}
                      >
                        שלח הוכחה 📷
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* TAB NAVIGATION BAR */}
      <nav className="tab-navigation">
        <button className={`tab-btn ${activeTab === 'feed' ? 'active' : ''}`} onClick={() => setActiveTab('feed')}>
          <ActivityIcon size={20} />
          <span>פיד</span>
        </button>
        
        <button className={`tab-btn ${activeTab === 'challenges' ? 'active' : ''}`} onClick={() => setActiveTab('challenges')}>
          <DumbbellIcon size={20} />
          <span>אתגרים</span>
        </button>

        <button className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>
          <PlusIcon size={20} />
          <span>יצירה</span>
        </button>
        
        <button className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}>
          <TrophyIcon size={20} />
          <span>מובילים</span>
        </button>
        
        <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <UserIcon size={20} />
          <span>פרופיל</span>
        </button>
      </nav>
    </div>
  );
}
