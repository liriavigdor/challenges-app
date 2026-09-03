import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIMentor({ isOpen, onClose, activityData, user, onXpAwarded }) {
  const [step, setStep] = useState(0); // 0: Calculating, 1: Result
  const [awardedXp, setAwardedXp] = useState(0);
  const [breakdown, setBreakdown] = useState([]);

  useEffect(() => {
    if (isOpen && activityData) {
      setStep(0);
      
      // AI "Thinking" phase
      const timer = setTimeout(() => {
        calculateXp();
        setStep(1);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, activityData]);

  const calculateXp = () => {
    // 1. Base Activity XP
    let totalXp = 50; 
    let xpBreakdown = [{ label: 'ביצוע פעילות', amount: 50 }];

    // 2. Streak Bonus
    if (user?.streak > 0) {
      const streakBonus = Math.min(user.streak * 5, 50); // Max 50 bonus for streak
      totalXp += streakBonus;
      xpBreakdown.push({ label: `רצף של ${user.streak} ימים`, amount: streakBonus });
    }

    // 3. AI Quest Completion
    if (user?.aiQuest && !user.aiQuest.completed && activityData.duration >= 20) {
      totalXp += user.aiQuest.xpReward;
      xpBreakdown.push({ label: 'השלמת אתגר ה-AI היומי', amount: user.aiQuest.xpReward });
    }

    setAwardedXp(totalXp);
    setBreakdown(xpBreakdown);
    
    if (onXpAwarded) {
      onXpAwarded(totalXp, activityData.duration >= 20); // pass back XP and whether quest was completed
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            style={{
              backgroundColor: '#18181b', // zinc-900
              border: '1px solid #3f3f46', // zinc-700
              borderRadius: '24px',
              padding: '1.5rem',
              width: '100%',
              maxWidth: '350px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
              color: 'white',
              direction: 'rtl'
            }}
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
          >
            {/* Ambient Background Glow */}
            <div style={{
              position: 'absolute', top: '-5rem', left: '-5rem', width: '10rem', height: '10rem',
              backgroundColor: '#a855f7', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.2, pointerEvents: 'none'
            }}></div>
            <div style={{
              position: 'absolute', bottom: '-5rem', right: '-5rem', width: '10rem', height: '10rem',
              backgroundColor: '#3b82f6', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.2, pointerEvents: 'none'
            }}></div>

            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* AI Avatar */}
              <motion.div 
                style={{
                  width: '96px', height: '96px', borderRadius: '50%',
                  background: 'linear-gradient(to top right, #a855f7, #3b82f6)',
                  padding: '4px',
                  boxShadow: '0 0 20px rgba(168,85,247,0.4)',
                  marginBottom: '1rem'
                }}
                animate={step === 0 ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%',
                  backgroundColor: '#18181b', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                }}>
                  <img src="https://api.dicebear.com/9.x/bottts/svg?seed=Mentor" alt="AI Mentor" style={{ width: '80px', height: '80px' }} />
                </div>
              </motion.div>

              {step === 0 ? (
                <div style={{ padding: '2rem 0' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>מנתח את האימון שלך...</h3>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <motion.div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a855f7' }} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, delay: 0 }} />
                    <motion.div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a855f7' }} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, delay: 0.2 }} />
                    <motion.div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a855f7' }} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, delay: 0.4 }} />
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ width: '100%' }}
                >
                  <h3 style={{
                    fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0',
                    background: 'linear-gradient(to right, #c084fc, #60a5fa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    עבודה מצוינת!
                  </h3>
                  <p style={{ color: '#d4d4d8', fontSize: '0.875rem', margin: '0 0 1.5rem 0' }}>
                    הנה הסיכום של ההישג שלך היום:
                  </p>

                  <div style={{
                    backgroundColor: 'rgba(39, 39, 42, 0.5)',
                    borderRadius: '1rem',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    fontSize: '0.875rem'
                  }}>
                    {breakdown.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ color: '#a1a1aa' }}>{item.label}</span>
                        <span style={{ fontFamily: 'monospace', color: '#c084fc', fontWeight: 'bold' }}>+{item.amount} XP</span>
                      </div>
                    ))}
                    <div style={{ height: '1px', backgroundColor: '#3f3f46', margin: '0.5rem 0' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.125rem', fontWeight: 'bold' }}>
                      <span>סה"כ</span>
                      <span style={{
                        background: 'linear-gradient(to right, #facc15, #f59e0b)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        +{awardedXp} XP
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={onClose}
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '0.75rem',
                      backgroundColor: 'white', color: 'black', fontWeight: 'bold',
                      border: 'none', cursor: 'pointer',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    המשך
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
