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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden text-center text-white"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
              {/* AI Avatar */}
              <motion.div 
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-1 shadow-[0_0_20px_rgba(168,85,247,0.4)] mb-4"
                animate={step === 0 ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                  <img src="https://api.dicebear.com/9.x/bottts/svg?seed=Mentor" alt="AI Mentor" className="w-20 h-20" />
                </div>
              </motion.div>

              {step === 0 ? (
                <div className="py-8">
                  <h3 className="text-xl font-bold mb-2">מנתח את האימון שלך...</h3>
                  <div className="flex justify-center gap-2 mt-4">
                    <motion.div className="w-2 h-2 rounded-full bg-purple-500" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, delay: 0 }} />
                    <motion.div className="w-2 h-2 rounded-full bg-purple-500" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-2 h-2 rounded-full bg-purple-500" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, delay: 0.4 }} />
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full"
                >
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
                    עבודה מצוינת!
                  </h3>
                  <p className="text-zinc-300 text-sm mb-6">
                    הנה הסיכום של ההישג שלך היום:
                  </p>

                  <div className="bg-zinc-800/50 rounded-2xl p-4 mb-6 space-y-3 text-sm">
                    {breakdown.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-zinc-400">{item.label}</span>
                        <span className="font-mono text-purple-400 font-bold">+{item.amount} XP</span>
                      </div>
                    ))}
                    <div className="h-px bg-zinc-700 my-2"></div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>סה"כ</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                        +{awardedXp} XP
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors shadow-lg active:scale-95"
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
