import React, { useState, useEffect } from 'react';
import { SwordsIcon } from './icons';

export default function AIRefereeCourt({ match, challenger, opponent, onClose, onVerdict }) {
  const [stage, setStage] = useState('scanning'); // scanning, calculating, writing, verdict
  const [dots, setDots] = useState('');

  // Loading text animations
  useEffect(() => {
    if (stage === 'verdict') return;
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, [stage]);

  // Simulation lifecycle
  useEffect(() => {
    const t1 = setTimeout(() => setStage('calculating'), 2000);
    const t2 = setTimeout(() => setStage('writing'), 4000);
    const t3 = setTimeout(() => {
      setStage('verdict');
    }, 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const getStageText = () => {
    switch (stage) {
      case 'scanning':
        return `שופט ה-AI סורק את קובצי ה-GPS והדופק של ${challenger?.name} ו-${opponent?.name}${dots}`;
      case 'calculating':
        return `מחשב את מהירות השיא ומשווה את גרף המאמץ לחוקי הפיזיקה${dots}`;
      case 'writing':
        return `השופט בוחן את נתוני הדופק, משווה תוצאות נגד היריב ומחשב מי יזכה ב-XP${dots}`;
      default:
        return '';
    }
  };

  // Determine winner and generate verdict text (simulated AI logic)
  const calculateResult = () => {
    const isChallengerCheating = match.challengerProof?.maxSpeed && parseFloat(match.challengerProof.maxSpeed) > 30 && match.challengerProof?.avgHeartRate < 100;
    const isOpponentCheating = match.opponentProof?.maxSpeed && parseFloat(match.opponentProof.maxSpeed) > 30 && match.opponentProof?.avgHeartRate < 100;

    let verdictText = "";
    let winnerId = null;
    let isCheatingDetected = false;

    if (isChallengerCheating && isOpponentCheating) {
      isCheatingDetected = true;
      winnerId = 'draw';
      verdictText = `על סמך ניתוח ה-AI: שני המתמודדים הציגו רמת ביצוע קרובה להפליא ונתוני דופק זהים כמעט לחלוטין. אין באפשרותי לקבוע מנצח מובהק. תיקו!`;
    } else if (isChallengerCheating) {
      isCheatingDetected = true;
      winnerId = opponent.id;
      verdictText = `❌ שופט ה-AI קבע: רמאות זוהתה אצל ${challenger.name}! נרשמה מהירות שיא של ${match.challengerProof.maxSpeed} עם דופק מנוחה של ${match.challengerProof.avgHeartRate} פעימות בלבד. הניצחון מוענק ל-${opponent.name}!`;
    } else if (isOpponentCheating) {
      isCheatingDetected = true;
      winnerId = challenger.id;
      verdictText = `❌ שופט ה-AI קבע: רמאות זוהתה אצל ${opponent.name}! נרשמה מהירות שיא של ${match.opponentProof.maxSpeed} עם דופק מנוחה של ${match.opponentProof.avgHeartRate} פעימות בלבד. הניצחון מוענק ל-${challenger.name}!`;
    } else {
      // Normal comparison
      if (match.challengeId === 'run_5k') {
        const t1 = match.challengerProof.duration;
        const t2 = match.opponentProof.duration;
        if (t1 < t2) {
          winnerId = challenger.id;
          verdictText = `⚖️ שופט ה-AI אישר את נתוני שני הרצים. ${challenger.name} השלים את הריצה בזמן מהיר יותר של ${t1} (לעומת ${t2} של ${opponent.name}) ומוכרז כמנצח הדו-קרב!`;
        } else {
          winnerId = opponent.id;
          verdictText = `⚖️ שופט ה-AI אישר את נתוני שני הרצים. ${opponent.name} השלים את הריצה בזמן מהיר יותר של ${t2} (לעומת ${t1} של ${challenger.name}) ומוכרז כמנצח הדו-קרב!`;
        }
      } else {
        // Fallback or other challenge type
        winnerId = challenger.id;
        verdictText = `⚖️ שופט ה-AI בחן את מדדי הדופק ומשך הפעילות. הנתונים תקינים, ונקבע כי ${challenger.name} ניצח בדו-קרב זה!`;
      }
    }

    return { winnerId, verdictText, isCheatingDetected };
  };

  const { winnerId, verdictText, isCheatingDetected } = calculateResult();

  return (
    <div className="referee-court-overlay">
      <div className="referee-court-box">
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1e1b4b, #311042)', 
          padding: '1.25rem', 
          color: '#fff', 
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>⚖️</span>
          <div>
            <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.2rem' }}>בית הדין של שופט ה-AI</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>ניתוח ואכיפת הגינות ספורטיבית בזמן אמת</p>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {stage !== 'verdict' ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div className="referee-scanner">
                <div className="referee-radar-circle"></div>
                <div className="referee-radar-circle-2"></div>
                <span className="referee-radar-icon">🤖</span>
              </div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                מנתח את נתוני הקרב...
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', minHeight: '40px', padding: '0 1rem' }}>
                {getStageText()}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '3rem' }}>{isCheatingDetected ? '🚨' : '🏆'}</span>
                <h4 style={{ margin: '0.5rem 0 0.25rem 0', fontWeight: 'bold', fontSize: '1.15rem', color: isCheatingDetected ? '#ef4444' : '#10b981' }}>
                  {isCheatingDetected ? 'זוהתה פעילות חשודה כרמאות!' : 'פסק הדין מוכן!'}
                </h4>
              </div>

              {/* Side-by-side stats summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                {/* Challenger Stats */}
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                    <img src={challenger?.avatar} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {challenger?.name}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', color: 'var(--text-secondary)' }}>
                    <span>⏱️ זמן: {match.challengerProof?.duration || '---'}</span>
                    <span>💓 דופק: {match.challengerProof?.avgHeartRate ? `${match.challengerProof.avgHeartRate} BPM` : '---'}</span>
                    <span>📱 מכשיר: {match.challengerProof?.device || '---'}</span>
                  </div>
                </div>

                {/* Opponent Stats */}
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                    <img src={opponent?.avatar} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {opponent?.name}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', color: 'var(--text-secondary)' }}>
                    <span>⏱️ זמן: {match.opponentProof?.duration || '---'}</span>
                    <span>💓 דופק: {match.opponentProof?.avgHeartRate ? `${match.opponentProof.avgHeartRate} BPM` : '---'}</span>
                    <span>📱 מכשיר: {match.opponentProof?.device || '---'}</span>
                  </div>
                </div>
              </div>

              {/* Verdict Verdict Text */}
              <div className={`verdict-box ${isCheatingDetected ? 'verdict-cheater' : 'verdict-clean'}`}>
                <strong style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: isCheatingDetected ? '#ef4444' : '#10b981' }}>
                  📝 ניתוח השופט:
                </strong>
                <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>
                  {verdictText}
                </p>
              </div>

              {/* Trophy Stakes Award */}
              {winnerId && winnerId !== 'draw' && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem', 
                  background: 'rgba(251, 191, 36, 0.08)', 
                  border: '1px dashed #fbbf24', 
                  padding: '0.6rem', 
                  borderRadius: '12px',
                  marginTop: '0.25rem'
                }}>
                  <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 900, color: '#fbbf24', textShadow: '0 2px 8px rgba(251,191,36,0.3)' }}>
                    {winnerId === challenger?.id ? challenger?.name : opponent?.name} זוכה ב-{winnerId === opponent?.id && match.type === 'away' ? '40' : '15'} נקודות XP!
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  onClick={() => {
                    onVerdict(match.id, winnerId, verdictText);
                  }}
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '0.65rem' }}
                >
                  אישור והחלת פסק הדין ⚖️
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
