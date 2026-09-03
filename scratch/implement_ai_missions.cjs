const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../src/App.jsx');
let appCode = fs.readFileSync(appPath, 'utf8');

// 1. Inject State
const stateInjection = `
  // --- AI DAILY MISSIONS STATE ---
  const [isMachineMissionsOpen, setIsMachineMissionsOpen] = useState(false);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [proofStage, setProofStage] = useState('idle'); // idle, scanning, success
  const [activeProofMissionId, setActiveProofMissionId] = useState(null);
  const [activeProofElement, setActiveProofElement] = useState(null);
  
  const [machineMissions, setMachineMissions] = useState(() => {
    const saved = localStorage.getItem('challenges_machine_missions');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.cooldownEnd && (Date.now() > parsed.cooldownEnd)) {
        return {
          missions: [
            { id: 'm1', title: 'ריצת 3 ק"מ', xpReward: 150, completed: false, icon: '🏃' },
            { id: 'm2', title: '30 שכיבות סמיכה', xpReward: 100, completed: false, icon: '💪' },
            { id: 'm3', title: 'רכיבה 15 ק"מ', xpReward: 200, completed: false, icon: '🚴' }
          ],
          cooldownEnd: null
        };
      }
      return parsed;
    }
    return {
      missions: [
        { id: 'm1', title: 'ריצת 3 ק"מ', xpReward: 150, completed: false, icon: '🏃' },
        { id: 'm2', title: '30 שכיבות סמיכה', xpReward: 100, completed: false, icon: '💪' },
        { id: 'm3', title: 'רכיבה 15 ק"מ', xpReward: 200, completed: false, icon: '🚴' }
      ],
      cooldownEnd: null
    };
  });

  useEffect(() => {
    localStorage.setItem('challenges_machine_missions', JSON.stringify(machineMissions));
  }, [machineMissions]);

  const [cooldownTimeLeft, setCooldownTimeLeft] = useState('');
  useEffect(() => {
    if (!machineMissions.cooldownEnd) {
      setCooldownTimeLeft('');
      return;
    }
    const interval = setInterval(() => {
      const diff = machineMissions.cooldownEnd - Date.now();
      if (diff <= 0) {
        setCooldownTimeLeft('');
        setMachineMissions(prev => ({
          ...prev,
          cooldownEnd: null,
          missions: prev.missions.map(m => ({ ...m, completed: false }))
        }));
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setCooldownTimeLeft(\`\${String(h).padStart(2,'0')}:\${String(m).padStart(2,'0')}:\${String(s).padStart(2,'0')}\`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [machineMissions.cooldownEnd]);
`;

if (!appCode.includes('isMachineMissionsOpen')) {
    appCode = appCode.replace(
        `const [stories, setStories] = useState(() => {
    const saved = localStorage.getItem('challenges_stories');
    return saved ? JSON.parse(saved) : initialStories;
  });`,
        `const [stories, setStories] = useState(() => {
    const saved = localStorage.getItem('challenges_stories');
    return saved ? JSON.parse(saved) : initialStories;
  });\n${stateInjection}`
    );
}

// 2. Replace the Missions FAB button
const fabRegex = /<button[\s\S]*?className="cr-floating-btn cr-floating-btn-left"[\s\S]*?onClick=\{\(\) => setIsMyChallengesModalOpen\(true\)\}[\s\S]*?>[\s\S]*?<\/button>/;
const newFab = `<button 
                    className="cr-floating-btn cr-floating-btn-left" 
                    onClick={() => setIsMachineMissionsOpen(true)}
                  >
                    <span className="cr-btn-icon">🤖</span>
                    <span className="cr-btn-label">AI Missions</span>
                  </button>`;
if (appCode.match(fabRegex)) {
    appCode = appCode.replace(fabRegex, newFab);
}

// 3. Inject Modals
const modalsInjection = `
                {/* ════════════ AI MACHINE MISSIONS MODAL ════════════ */}
                {isMachineMissionsOpen && (
                  <div className="arena-modal-overlay" onClick={() => setIsMachineMissionsOpen(false)}>
                    <div className="arena-modal-panel ai-missions-panel" onClick={e => e.stopPropagation()}>
                      <div className="arena-modal-drag-handle" />
                      <div className="arena-modal-header">
                        <h3 className="arena-modal-title" style={{ color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{fontSize: '1.5rem'}}>🤖</span> אתגרי מכונה יומיים
                        </h3>
                        <button className="arena-modal-close" onClick={() => setIsMachineMissionsOpen(false)}>✕</button>
                      </div>

                      {cooldownTimeLeft ? (
                        <div className="ai-cooldown-banner">
                          <span>⏳ המשימות הבאות יפתחו בעוד:</span>
                          <strong style={{marginLeft: '0.5rem', color: '#ff4d4d'}}>{cooldownTimeLeft}</strong>
                        </div>
                      ) : (
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                          הוכח למכונה שאתה מסוגל ובצע את האתגרים הבאים כדי להרוויח XP.
                        </p>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {machineMissions.missions.map(mission => (
                          <div key={mission.id} className={\`ai-mission-card \${mission.completed ? 'completed' : ''}\`}>
                            <div className="ai-mission-icon">{mission.icon}</div>
                            <div className="ai-mission-info">
                              <h4>{mission.title}</h4>
                              <span className="ai-mission-xp">+{mission.xpReward} XP</span>
                            </div>
                            {!mission.completed ? (
                              <button 
                                className="ai-verify-btn"
                                onClick={(e) => {
                                  setActiveProofElement(e.currentTarget);
                                  setActiveProofMissionId(mission.id);
                                  setIsProofModalOpen(true);
                                }}
                                disabled={!!cooldownTimeLeft}
                                style={{ opacity: cooldownTimeLeft ? 0.5 : 1 }}
                              >
                                הוכח ביצוע
                              </button>
                            ) : (
                              <div className="ai-mission-done">✅ הושלם</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ════════════ AI PROOF / CAMERA MODAL ════════════ */}
                {isProofModalOpen && (
                  <div className="arena-modal-overlay" style={{ zIndex: 9999 }} onClick={() => {
                    if (proofStage === 'idle') setIsProofModalOpen(false);
                  }}>
                    <div className="arena-modal-panel ai-proof-panel" onClick={e => e.stopPropagation()}>
                      <div className="arena-modal-header" style={{ borderBottom: 'none' }}>
                        <h3 className="arena-modal-title" style={{ fontSize: '1.2rem' }}>אימות ביצוע מול ה-AI</h3>
                        {proofStage === 'idle' && <button className="arena-modal-close" onClick={() => setIsProofModalOpen(false)}>✕</button>}
                      </div>

                      {proofStage === 'idle' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
                            בחר דרך להוכיח למכונה שהשלמת את המשימה:
                          </p>
                          <button className="proof-option-btn camera-btn" onClick={() => setProofStage('scanning')}>
                            <span>📷</span> פתח מצלמה לאימות תנועה
                          </button>
                          <button className="proof-option-btn strava-btn" onClick={() => setProofStage('scanning')}>
                            <span>🧡</span> העלה הוכחה מ-Strava
                          </button>
                        </div>
                      )}

                      {proofStage === 'scanning' && (() => {
                        // Simulate scanning delay
                        setTimeout(() => setProofStage('success'), 3500);
                        return (
                          <div className="ai-scanner-container">
                            <div className="ai-scanner-radar"></div>
                            <h4 style={{ color: 'var(--cyan)' }}>ה-AI סורק את ההוכחה...</h4>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>מאמת נתוני פעילות מול המשימה</p>
                          </div>
                        );
                      })()}

                      {proofStage === 'success' && (() => {
                        // Handle success
                        setTimeout(() => {
                          setIsProofModalOpen(false);
                          setProofStage('idle');
                          const mission = machineMissions.missions.find(m => m.id === activeProofMissionId);
                          
                          // Launch Orbs
                          launchXpOrbs(activeProofElement || document.body, mission.xpReward, () => {
                            setMachineMissions(prev => {
                              const newMissions = prev.missions.map(m => m.id === mission.id ? { ...m, completed: true } : m);
                              const allCompleted = newMissions.every(m => m.completed);
                              return {
                                ...prev,
                                missions: newMissions,
                                cooldownEnd: allCompleted ? Date.now() + (24 * 60 * 60 * 1000) : prev.cooldownEnd
                              };
                            });
                            // Add actual XP
                            handleCompleteChallenge(mission.xpReward); 
                          });
                        }, 1500);

                        return (
                          <div className="ai-scanner-container success">
                            <div className="ai-success-icon">✅</div>
                            <h4 style={{ color: '#10b981' }}>ההוכחה אושרה!</h4>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>מקצה נקודות XP...</p>
                          </div>
                        );
                      })()}

                    </div>
                  </div>
                )}
`;

if (!appCode.includes('AI MACHINE MISSIONS MODAL')) {
    // Insert just before DAILY MISSIONS MODAL
    appCode = appCode.replace(
        `{/* ════════════ DAILY MISSIONS MODAL ════════════ */}`,
        `${modalsInjection}\n\n                {/* ════════════ DAILY MISSIONS MODAL ════════════ */}`
    );
}

fs.writeFileSync(appPath, appCode);
console.log('App.jsx updated with AI Missions functionality.');

// 4. Update CSS
const cssPath = path.join(__dirname, '../src/index.css');
let cssCode = fs.readFileSync(cssPath, 'utf8');

const cssInjection = `
/* --- AI MISSIONS CSS --- */
.ai-missions-panel {
  max-width: 400px;
}

.ai-cooldown-banner {
  background: rgba(255, 77, 77, 0.1);
  border: 1px solid rgba(255, 77, 77, 0.3);
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.ai-mission-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1rem;
  border-radius: 12px;
  gap: 1rem;
  transition: all 0.3s ease;
}
.ai-mission-card.completed {
  background: rgba(16, 185, 129, 0.05);
  border-color: rgba(16, 185, 129, 0.2);
}

.ai-mission-icon {
  font-size: 1.8rem;
  background: rgba(255,255,255,0.05);
  width: 48px; height: 48px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 12px;
}
.ai-mission-info {
  flex: 1;
}
.ai-mission-info h4 {
  margin: 0 0 0.2rem 0;
  color: #fff;
  font-size: 1rem;
}
.ai-mission-xp {
  color: var(--neon-pink);
  font-size: 0.85rem;
  font-weight: bold;
}

.ai-verify-btn {
  background: linear-gradient(135deg, var(--cyan), #0077ff);
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 229, 255, 0.3);
  transition: transform 0.2s;
}
.ai-verify-btn:active {
  transform: scale(0.95);
}

.ai-mission-done {
  color: #10b981;
  font-weight: bold;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
}

.proof-option-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}
.proof-option-btn:hover {
  background: rgba(255,255,255,0.1);
}
.proof-option-btn.camera-btn:hover { border-color: var(--cyan); }
.proof-option-btn.strava-btn:hover { border-color: #fc4c02; }
.proof-option-btn span {
  font-size: 1.5rem;
}

.ai-scanner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  text-align: center;
}
.ai-scanner-radar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px dashed var(--cyan);
  animation: radar-spin 3s linear infinite;
  margin-bottom: 1rem;
  box-shadow: 0 0 20px rgba(0,229,255,0.2);
}
@keyframes radar-spin {
  100% { transform: rotate(360deg); }
}

.ai-success-icon {
  font-size: 4rem;
  animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  margin-bottom: 1rem;
}
@keyframes pop-in {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
`;

if (!cssCode.includes('ai-missions-panel')) {
    cssCode += '\n' + cssInjection;
    fs.writeFileSync(cssPath, cssCode);
    console.log('index.css updated with AI Missions styles.');
}
`;
