import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Flame, Users, Lock, CheckCircle, Swords, ArrowRight, Zap, Trophy, Medal, Star, Calendar, Clock, Activity, Map as MapIcon, Compass, Dumbbell, ChevronDown, Sparkles, TrendingUp, Moon, Plus, Camera, UploadCloud, ScanLine, X } from 'lucide-react';

/* ── Elite Commercial Theme V5 (Addiction/Dopamine Tier) ──
   Canvas Base: #000000 with subtle radial glows
   Glass Surfaces: rgba(255, 255, 255, 0.02) blur(30px)
   Borders: rgba(255, 255, 255, 0.05)
   Primary Accent (Hyper Gold): linear-gradient(135deg, #F5D061, #E6A213)
   Secondary Accent (Neon Teal): #06B6D4
*/

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 350, damping: 25 } }
};

const FloatingParticles = ({ active }) => {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden rounded-[24px]">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: 0,
            scale: [0, 1.5, 2],
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 1) * 150
          }}
          transition={{ duration: 1 + Math.random(), ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-[#F5D061] shadow-[0_0_10px_#F5D061]"
        />
      ))}
    </div>
  );
};

const MatchupFeedCard = ({ challenger, opponent, title, subtitle, challengeScore, opponentScore, maxScore }) => {
  const [hasJoined, setHasJoined] = useState(false);
  const challengerPercent = Math.min(100, (challengeScore / maxScore) * 100);
  const opponentPercent = Math.min(100, (opponentScore / maxScore) * 100);

  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative rounded-[24px] p-[2px] overflow-hidden group shadow-2xl transition-all duration-300"
    >
      {/* Animated Border Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-white/5 opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Card Content Surface */}
      <div className="relative bg-[#161616] rounded-[22px] p-5 h-full overflow-visible flex flex-col justify-between border border-white/5">
        
        {/* Diagonal Split Background Mesh */}
        <div className="absolute inset-0 rounded-[22px] overflow-hidden opacity-20 transition-opacity duration-700 group-hover:opacity-40">
          <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-br from-[#06B6D4]/30 via-transparent to-[#F5D061]/30 blur-[50px] animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <h4 className="text-white font-black tracking-tight text-[22px] leading-tight drop-shadow-md">{title}</h4>
          <p className="text-[#A1A1AA] text-[11px] font-bold tracking-[0.1em] uppercase mt-1.5">{subtitle}</p>
        </div>

        {/* Arena Avatars & VS */}
        <div className="flex items-center justify-center mb-10 relative z-10 h-16 w-full">
          {/* Challenger */}
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            className="relative z-10 translate-x-5"
          >
             <div className="w-[72px] h-[72px] rounded-full border-[3px] border-[#F5D061] p-0.5 bg-[#000] shadow-[0_0_25px_rgba(245,208,97,0.4)] relative group-hover:scale-105 transition-transform duration-500">
               <img src={challenger.avatar} alt={challenger.name} className="w-full h-full rounded-full object-cover bg-[#1E2638]" />
             </div>
             <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#F5D061] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
               {challenger.name}
             </div>
          </motion.div>
          
          {/* VS Badge */}
          <div className="z-20 relative px-3">
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-[2]" />
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-12 h-12 rounded-full bg-black border border-white/20 flex items-center justify-center relative shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            >
              <span className="bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent font-black text-[15px] italic tracking-widest ml-0.5 drop-shadow-sm">VS</span>
            </motion.div>
          </div>

          {/* Opponent */}
          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
            className="relative z-10 -translate-x-5"
          >
             <div className="w-[72px] h-[72px] rounded-full border-[3px] border-[#06B6D4] p-0.5 bg-[#000] shadow-[0_0_25px_rgba(6,182,212,0.4)] relative group-hover:scale-105 transition-transform duration-500">
               <img src={opponent.avatar} alt={opponent.name} className="w-full h-full rounded-full object-cover bg-[#1E2638]" />
             </div>
             <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#06B6D4] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
               {opponent.name}
             </div>
          </motion.div>
        </div>

        {/* Scores & Progress */}
        <div className="relative z-10 mt-2">
          <div className="flex justify-between items-end mb-2.5 px-1.5">
            <span className="font-black text-lg text-[#F5D061] drop-shadow-[0_0_8px_rgba(245,208,97,0.5)]">{challengeScore}</span>
            <span className="text-[#71717A] text-[10px] font-black tracking-[0.2em] uppercase">יעד: {maxScore}</span>
            <span className="font-black text-lg text-[#06B6D4] drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">{opponentScore}</span>
          </div>
          
          <div className="w-full h-[14px] bg-[#000] rounded-full overflow-hidden border border-white/10 relative shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] p-[2px]">
             {/* Challenger Bar */}
             <motion.div 
               initial={{ width: 0 }} 
               animate={{ width: `${challengerPercent}%` }} 
               transition={{ duration: 1.5, ease: "easeOut" }} 
               className="absolute top-[2px] right-[2px] bottom-[2px] bg-gradient-to-l from-[#F5D061] to-[#E6A213] rounded-full z-20 shadow-[0_0_10px_rgba(245,208,97,0.5)]" 
             />
             {/* Opponent Bar */}
             <motion.div 
               initial={{ width: 0 }} 
               animate={{ width: `${opponentPercent}%` }} 
               transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }} 
               className="absolute top-[2px] left-[2px] bottom-[2px] bg-gradient-to-r from-[#06B6D4] to-[#0284C7] rounded-full z-10 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
             />
          </div>
        </div>

        {/* Action Button */}
        <motion.button 
          whileTap={{ scale: 0.92 }}
          onClick={() => setHasJoined(!hasJoined)}
          className={`w-full mt-7 h-14 rounded-[16px] font-black text-[15px] flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden ${
            hasJoined 
              ? 'bg-white/5 text-white border border-white/10 shadow-inner' 
              : 'bg-white text-black border border-transparent hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] group/join'
          }`}
        >
          {hasJoined ? (
            <>
              <CheckCircle className="w-5 h-5 text-[#10B981]" />
              <span>הצטרפת בהצלחה</span>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[150%] group-hover/join:animate-[shimmer_1.5s_infinite] opacity-50" />
              <span className="relative z-10 tracking-wide font-extrabold">היכנס לזירה</span>
              <Swords className="w-5 h-5 relative z-10 group-hover/join:rotate-12 transition-transform" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

const MyChallengeCard = ({ 
  title, 
  subtitle, 
  category = "כושר וסיבולת", 
  icon: CardIcon = Activity,
  daysLeft = 14,
  xpReward = 450,
  participants, 
  maxScore, 
  unit = 'ק"מ',
  type,
  stepIncrement = 1
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localParticipants, setLocalParticipants] = useState(participants);
  const [showRewardEffect, setShowRewardEffect] = useState(false);
  const [triggerParticles, setTriggerParticles] = useState(false);

  const isGroup = type === 'group';
  
  const handleQuickUpdate = (e) => {
    e.stopPropagation();
    
    // Addiction Trigger: Flash & Particles
    setTriggerParticles(true);
    setTimeout(() => setTriggerParticles(false), 2000);
    
    setLocalParticipants(prev => prev.map(p => {
      if (p.isMe) {
        return { ...p, score: Math.min(maxScore, p.score + stepIncrement) };
      }
      return p;
    }));
    setShowRewardEffect(true);
    setTimeout(() => setShowRewardEffect(false), 2500);
  };

  const sortedParticipants = [...localParticipants].sort((a, b) => b.score - a.score);
  const myParticipant = localParticipants.find(p => p.isMe) || localParticipants[0];
  const myPercent = Math.min(100, Math.round((myParticipant.score / maxScore) * 100));
  const isNearCompletion = myPercent >= 70 && myPercent < 100;
  const isCompleted = myPercent >= 100;

  const myRankIndex = sortedParticipants.findIndex(p => p.isMe || p.id === myParticipant.id);
  const rankLabel = myRankIndex === 0 ? "מקום 1 🥇" : myRankIndex === 1 ? "מקום 2 🥈" : `מקום ${myRankIndex + 1}`;

  return (
    <motion.div 
      layout
      variants={itemVariants}
      transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
      onClick={() => setIsExpanded(!isExpanded)}
      className="bg-[#121212] rounded-[24px] border border-white/5 relative flex flex-col shadow-lg overflow-visible cursor-pointer hover:bg-[#151515] transition-colors duration-300"
    >
      <FloatingParticles active={triggerParticles} />
      
      {/* Deep Ambient Glow */}
      <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
      
      <div className="p-5 flex flex-col relative z-10">
        
        {/* Trigger (Top) - Time sensitivity / Hook Model */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EF4444]/10 rounded-full border border-[#EF4444]/20 shadow-sm">
             <Flame className="w-4 h-4 fill-[#EF4444] text-[#EF4444] animate-pulse" />
             <span className="text-[12px] font-black text-[#EF4444] tracking-wide" style={{ fontFeatureSettings: '"tnum"' }}>
                🔥 רצף {daysLeft} ימים נותר!
             </span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] font-black text-[#F5D061] bg-[#F5D061]/10 px-3 py-1.5 rounded-full border border-[#F5D061]/20">
            <Zap className="w-4 h-4 fill-[#F5D061]" />
            <span style={{ fontFeatureSettings: '"tnum"' }}>+{xpReward} XP</span>
          </div>
        </div>

        {/* Primary Focus: Challenge Title (Element 1) */}
        <div className="flex items-center justify-between gap-5 mb-6">
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-white text-[24px] leading-tight tracking-tight truncate flex items-center gap-2">
              {title}
              {isCompleted && <motion.div initial={{scale:0}} animate={{scale:1}}><CheckCircle className="w-6 h-6 text-[#10B981] shrink-0 drop-shadow-[0_0_8px_#10B981]" /></motion.div>}
            </h4>
          </div>
          <div className="w-12 h-12 rounded-[14px] bg-white/5 flex items-center justify-center text-white shrink-0 shadow-inner border border-white/5">
            <CardIcon className="w-6 h-6 opacity-80" />
          </div>
        </div>

        {/* Reward (Center): Progress Metric + Bar (Element 2) */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-baseline gap-2 tabular-nums" style={{ fontFeatureSettings: '"tnum"' }}>
            <span className="text-[44px] font-black text-white leading-none drop-shadow-md">{myParticipant.score}</span>
            <span className="text-[22px] font-black text-[#A1A1AA]">/ {maxScore}</span>
            <span className="text-[18px] font-bold text-[#71717A] ml-1">{unit}</span>
          </div>
          <div className="w-full bg-[#000] h-3.5 rounded-full overflow-hidden border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] p-[2px]">
            <motion.div 
              className="h-full rounded-full shadow-[0_0_10px_rgba(245,208,97,0.5)]"
              style={{
                background: isCompleted 
                  ? 'linear-gradient(90deg, #10B981, #34D399)'
                  : 'linear-gradient(90deg, #F5D061, #E6A213)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${myPercent}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            />
          </div>
        </div>

        {/* Action (Bottom): Primary CTA (Element 3) */}
        {!isCompleted && (
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickUpdate}
            className="w-full min-h-[56px] rounded-[16px] bg-gradient-to-br from-[#F5D061] to-[#E6A213] text-black font-[900] text-[18px] flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(245,208,97,0.3)] hover:shadow-[0_4px_25px_rgba(245,208,97,0.5)] transition-all relative overflow-hidden"
            dir="ltr"
          >
            <Zap className="w-5 h-5 fill-black" />
            <span className="tracking-tight" style={{ fontFeatureSettings: '"tnum"' }}>+{stepIncrement} תעד עכשיו</span>
          </motion.button>
        )}

        {/* Magnetic Dopamine Feedback */}
        <AnimatePresence>
          {showRewardEffect && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute inset-x-4 top-4 bg-gradient-to-r from-[#10B981]/95 to-[#34D399]/95 rounded-[16px] p-4 flex items-center justify-between text-black font-black backdrop-blur-xl shadow-[0_10px_40px_rgba(16,185,129,0.6)] z-50 border border-white/20"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 animate-spin text-black" />
                <span className="text-[14px] drop-shadow-sm">פעולה הושלמה!</span>
              </div>
              <span className="font-mono text-black text-[15px] bg-black/20 px-3 py-1.5 rounded-[10px] border border-black/10 shadow-inner" style={{ fontFeatureSettings: '"tnum"' }}>
                +{stepIncrement * 10} XP
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expanded Leaderboard (Progressive Disclosure Drawer) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            layout
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="border-t border-white/5 bg-black/50 overflow-hidden"
          >
            <div className="p-5 flex flex-col gap-6">
              
              {/* Hidden Metadata */}
              <div className="flex flex-col gap-3">
                <p className="text-[15px] text-[#9CA3AF] font-bold tracking-wide">
                  {subtitle}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-[8px] border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
                    <span className="text-[12px] font-black text-[#E2E8F0] tracking-wide">{category}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-[8px] border border-white/10">
                    <span className="text-[12px] font-black text-[#E2E8F0] tracking-wide">{isGroup ? `${localParticipants.length} מתחרים` : '1 נגד 1'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-[8px] border border-white/10 mr-auto">
                     <span className="text-[12px] font-black text-white">{rankLabel}</span>
                  </div>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="flex flex-col gap-3">
                {sortedParticipants.map((p, index) => {
                  const pPercent = Math.min(100, Math.round((p.score / maxScore) * 100));
                  const isLeader = index === 0;
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1, type: "spring", stiffness: 300, damping: 25 }}
                      key={p.id || index} 
                      className={`flex items-center gap-4 p-3 rounded-[16px] border ${
                        p.isMe 
                          ? 'bg-white/10 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                          : 'bg-white/[0.02] border-transparent'
                      }`}
                    >
                      <div className="w-7 text-center text-[18px] font-black flex justify-center">
                        {isLeader ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : <span className="text-[#71717A] text-[14px]">#{index + 1}</span>}
                      </div>
                      <div className="relative">
                        <img 
                          src={p.avatar} 
                          alt={p.name} 
                          className={`w-10 h-10 rounded-full border-[2px] ${isLeader ? 'border-[#F5D061] shadow-[0_0_10px_#F5D061]' : 'border-[#0A0A0A]'} bg-[#1E2638] object-cover`} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[14px] font-black text-white flex items-center gap-2 truncate">
                            {p.name}
                            {p.isMe && <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded-[6px] font-black tracking-wide shadow-sm">אתה</span>}
                          </span>
                          <span className="text-[14px] font-black text-white tabular-nums drop-shadow-sm" style={{ fontFeatureSettings: '"tnum"' }}>{p.score}</span>
                        </div>
                        <div className="w-full bg-[#000] h-2 rounded-full overflow-hidden shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${pPercent}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${isLeader ? 'bg-[#F5D061]' : p.isMe ? 'bg-white' : 'bg-[#71717A]'}`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Sub-component for individual grid quests
const QuestCard = ({ quest, type, onClick }) => {
  const isCompleted = quest.completed || quest.progress >= quest.max;
  const percent = Math.min(100, (quest.progress / quest.max) * 100);
  
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={!isCompleted ? { scale: 1.02, y: -2 } : {}}
      onClick={() => !isCompleted && onClick()}
      className={`relative rounded-[20px] p-4 ps-[16px] flex flex-col gap-3 cursor-pointer overflow-visible transition-all duration-300 border shadow-lg ${
        isCompleted 
          ? 'bg-white/5 border-white/10 opacity-70' 
          : type === 'daily'
            ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:bg-white/15'
            : type === 'weekly'
              ? 'bg-gradient-to-br from-[#06B6D4]/10 to-transparent border-[#06B6D4]/30 hover:bg-[#06B6D4]/15'
              : 'bg-gradient-to-br from-[#F5D061]/20 to-[#E6A213]/5 border-[#F5D061]/40 hover:bg-[#F5D061]/25'
      }`}
    >
      {/* Background Icon */}
      <div className="absolute -top-2 -left-2 p-3 opacity-10 text-[60px] leading-none pointer-events-none transform -rotate-12 blur-sm filter">{quest.icon}</div>
      
      <div className="flex justify-start items-start relative z-10 min-h-[36px]">
        <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center text-[18px] bg-white/[0.06] shadow-sm ${isCompleted ? 'grayscale opacity-50' : ''}`}>
          {quest.icon}
        </div>
        <div className={`absolute top-[12px] left-[12px] flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-black ${isCompleted ? 'bg-[#10B981]/20 border-[#10B981]/30 text-[#10B981]' : 'bg-black/40 border-white/20 text-white'}`}>
          {isCompleted ? <CheckCircle className="w-3 h-3" /> : <Zap className="w-3 h-3 text-[#F5D061]" />}
          <span>+{quest.xp}</span>
        </div>
      </div>
      
      <div className="relative z-10 mt-1">
        <h4 className={`font-black text-[14px] leading-tight mb-1 ${isCompleted ? 'text-[#A1A1AA] line-through' : 'text-white'}`}>{quest.title}</h4>
        
        {quest.max > 1 ? (
          <div className="mt-2.5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] text-[#A1A1AA] font-bold tracking-wider" dir="ltr">{quest.progress} / {quest.max}</span>
              <span className={`text-[10px] font-black bg-white/[0.08] px-2 py-0.5 rounded-[6px] ${type === 'weekly' ? 'text-[#06B6D4]' : 'text-[#F5D061]'}`}>{Math.round(percent)}%</span>
            </div>
            <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                className={`h-full rounded-full ${type === 'weekly' ? 'bg-gradient-to-r from-[#38BDF8] to-[#0284C7]' : 'bg-[#F5D061]'}`}
              />
            </div>
          </div>
        ) : (
          <div className="mt-2 text-[12px] font-bold text-[#9CA3AF] flex items-center gap-1.5">
            {!isCompleted && <Camera className="w-3.5 h-3.5 text-[#F97316]" />}
            {isCompleted ? 'הושלם' : 'דרוש תיעוד'}
          </div>
        )}
      </div>
    </motion.div>
  );
};


export default function ChallengesTab({
  currentUser,
  currentRank,
  nextRank,
  progressPercentage,
  challengesViewMode,
  setChallengesViewMode,
  setIsMachineMissionsOpen,
  setIsRadarOpen,
  isHomeModeModalOpen,
  setIsHomeModeModalOpen,
  setIsAIMentorOpen,
  setActiveTab
}) {
  const [activeInnerTab, setActiveInnerTab] = useState('my_challenges');
  
  // Categorized Quests State
  const [quests, setQuests] = useState({
    daily: [
      { id: 'd1', title: 'אימון כוח', xp: 150, completed: false, icon: '🏋️', progress: 0, max: 1 },
      { id: 'd2', title: '10,000 צעדים', xp: 100, completed: false, icon: '👣', progress: 0, max: 1 },
      { id: 'd3', title: 'מדיטציה', xp: 50, completed: false, icon: '🧘', progress: 0, max: 1 },
      { id: 'd4', title: 'שתיית מים', xp: 30, completed: false, icon: '💧', progress: 0, max: 1 },
    ],
    weekly: [
      { id: 'w1', title: '3 אימוני אירובי', xp: 400, completed: false, icon: '🏃', progress: 1, max: 3 },
      { id: 'w2', title: 'ללא מתוקים', xp: 300, completed: false, icon: '🚫', progress: 4, max: 7 },
    ],
    monthly: [
      { id: 'm1', title: 'אתגר המרתון (42 ק"מ מצטבר)', xp: 1500, completed: false, icon: '🏅', progress: 12, max: 42 }
    ]
  });

  const [machineBossProgress, setMachineBossProgress] = useState(45);
  
  // Evidence Verification State
  const [evidenceTask, setEvidenceTask] = useState(null); // { id, title, xp, type: 'daily'|'weekly'|'monthly' }
  const [evidenceStatus, setEvidenceStatus] = useState('idle'); // idle | scanning | success

  const openEvidenceModal = (task, type) => {
    setEvidenceTask({ ...task, type });
    setEvidenceStatus('idle');
  };

  const closeEvidenceModal = () => {
    if (evidenceStatus === 'scanning') return; // block close during scan
    setEvidenceTask(null);
    setEvidenceStatus('idle');
  };

  const simulateEvidenceUpload = () => {
    setEvidenceStatus('scanning');
    
    // Simulate AI verification delay (dopamine anticipation)
    setTimeout(() => {
      setEvidenceStatus('success');
      
      // Apply the actual rewards after success
      setQuests(prev => {
        const updatedCategory = prev[evidenceTask.type].map(q => {
          if (q.id === evidenceTask.id) {
            const newProgress = q.progress + 1;
            return { ...q, progress: newProgress, completed: newProgress >= q.max };
          }
          return q;
        });
        return { ...prev, [evidenceTask.type]: updatedCategory };
      });
      
      // Also slightly boost the daily boss as a side effect
      if (evidenceTask.type === 'daily') {
         setMachineBossProgress(prev => Math.min(100, prev + 15));
      }
      
      // Auto close after showing success
      setTimeout(() => {
        closeEvidenceModal();
      }, 1500);

    }, 2500); // 2.5s scan time
  };

  return (
    <div className="flex flex-col h-full w-full min-h-0 bg-[#000000] font-sans text-white relative overflow-hidden" dir="rtl">
      
      {/* Global Ambient Lighting - Softened */}
      <div className={`absolute top-[-20%] left-[-10%] w-[120%] h-[50%] blur-[120px] rounded-full pointer-events-none transition-colors duration-1000 ${activeInnerTab === 'training_ground' ? 'bg-[#EF4444]/5' : 'bg-[#F5D061]/5'}`} />
      <div className={`absolute bottom-[-20%] right-[-10%] w-[120%] h-[50%] blur-[120px] rounded-full pointer-events-none transition-colors duration-1000 ${activeInnerTab === 'training_ground' ? 'bg-[#F97316]/5' : 'bg-[#06B6D4]/5'}`} />

      {/* ── Spatial Header & Nav ── */}
      <div className="relative z-20 pt-8 pb-5 px-6 bg-gradient-to-b from-black via-black/90 to-transparent">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-[32px] font-black tracking-tight text-white drop-shadow-sm">
            אתגרים
          </h2>
          <div className="flex items-center gap-2 bg-[#1A1A1A]/80 backdrop-blur-xl px-4 py-2 rounded-[14px] border border-white/10 shadow-sm cursor-default hover:bg-[#222] transition-colors">
            <Flame className="w-5 h-5 text-[#F5D061] fill-[#F5D061] opacity-90" />
            <span className="text-[15px] font-black text-white tabular-nums tracking-wide">{currentUser?.stats?.streakDays || 7} רצף</span>
          </div>
        </div>

        {/* Premium Segmented Control - Softer contrast */}
        <div className="relative p-1.5 bg-[#121212]/80 backdrop-blur-[30px] rounded-[22px] flex items-center border border-white/5 shadow-sm">
          {[
            { id: 'explore',          label: 'זירה' },
            { id: 'my_challenges',    label: 'שלי' },
            { id: 'training_ground',  label: 'אימונים' },
          ].map(({ id, label }) => {
            const isActive = activeInnerTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveInnerTab(id)}
                className={`relative flex-1 h-12 flex items-center justify-center z-10 rounded-[18px] font-bold text-[15px] tracking-wide transition-colors ${
                  isActive ? 'text-white' : 'text-[#888] hover:text-[#bbb]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="spatialTab"
                    className="absolute inset-0 bg-white/10 border border-white/10 rounded-[18px] shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-20">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Dynamic Content Area ── */}
      <div className="flex-1 overflow-y-auto pb-[110px] px-5 pt-2 custom-scrollbar relative z-10">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: MY CHALLENGES */}
          {activeInnerTab === 'my_challenges' && (
            <motion.div 
              key="tab_my"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="flex flex-col gap-5"
            >
              {/* Breakthrough Banner */}
              <motion.div 
                variants={itemVariants}
                whileTap={{ scale: 0.96 }}
                className="relative overflow-hidden rounded-[24px] p-4 flex flex-row items-center justify-between bg-[#161616] border border-white/5 shadow-md cursor-pointer active:bg-[#1A1A1A] transition-colors" 
                dir="rtl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#F5D061]/10 to-transparent opacity-80" />
                
                <div className="relative z-10 flex flex-col gap-0.5">
                  <h4 className="text-[17px] font-black text-white tracking-wide flex items-center gap-2">
                    <Flame className="w-5 h-5 text-[#F5D061] fill-[#F5D061] opacity-90" />
                    קרוב לפריצת דרך!
                  </h4>
                  <p className="text-[14px] text-[#888] font-bold">
                    מטרת על: ירידה באחוזי שומן
                  </p>
                </div>
                
                <div className="relative z-10 bg-white/10 px-2.5 py-1 rounded-[8px] mr-auto">
                  <span className="font-black text-[15px] text-white">40%</span>
                </div>
              </motion.div>

              <MyChallengeCard 
                title={'100 ק"מ ריצה'}
                subtitle="מרוץ נגד השעון והחברים"
                category="ריצה"
                icon={TrendingUp}
                daysLeft={17}
                xpReward={600}
                unit='ק"מ'
                type="group"
                maxScore={100}
                stepIncrement={5}
                participants={[
                  { id: 1, name: 'אתה', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix', score: 42, isMe: true },
                  { id: 2, name: 'דנה', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Dana', score: 65, isMe: false },
                  { id: 3, name: 'אמיר', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Amir', score: 20, isMe: false },
                  { id: 4, name: 'נועה', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Noa', score: 55, isMe: false },
                ]}
              />

              <MyChallengeCard 
                title="30 יום ללא סוכר"
                subtitle="ראש בראש: מי מחזיק יותר זמן"
                category="תזונה"
                icon={Swords}
                daysLeft={18}
                xpReward={500}
                unit="ימים"
                type="1v1"
                maxScore={30}
                stepIncrement={1}
                participants={[
                  { id: 1, name: 'אתה', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix', score: 12, isMe: true },
                  { id: 2, name: 'רועי', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Roi', score: 12, isMe: false },
                ]}
              />
            </motion.div>
          )}

          {/* TAB 2: EXPLORE */}
          {activeInnerTab === 'explore' && (
            <motion.div 
              key="tab_explore"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="flex flex-col gap-5"
            >
              <MatchupFeedCard 
                title='הראשון ל-50 ק"מ'
                subtitle="תחרות ריצה שבועית"
                challenger={{ name: 'דניאל', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Daniel' }}
                opponent={{ name: 'רועי', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Roi' }}
                challengeScore={35}
                opponentScore={28}
                maxScore={50}
              />

              <MatchupFeedCard 
                title="מלך הכוח"
                subtitle="הכי הרבה משקל באימון"
                challenger={{ name: 'אנה', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Anna' }}
                opponent={{ name: 'מיכל', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Michal' }}
                challengeScore={4500}
                opponentScore={5200}
                maxScore={6000}
              />
            </motion.div>
          )}

          {/* TAB 3: TRAINING GROUND (THE FORGE) */}
          {activeInnerTab === 'training_ground' && (
            <motion.div 
              key="tab_training"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="flex flex-col gap-5 pb-4"
            >
              {/* Top Section: Daily Boss Progress */}
              <motion.div variants={itemVariants} className="flex items-center bg-black/40 backdrop-blur-[40px] rounded-[24px] border border-white/10 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] gap-4">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[20px] font-black text-white tracking-wide">הבוס היומי</h3>
                  <p className="text-[#9CA3AF] text-[12px] font-bold tracking-[0.1em] uppercase">שריפת 500 קק"ל</p>
                  <div className="mt-2 flex items-center gap-1.5 bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-[10px] w-fit border border-[#D4AF37]/20">
                    <Flame className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    <span className="text-[12px] font-black tabular-nums">{Math.round(500 * (machineBossProgress/100))} קק"ל</span>
                  </div>
                </div>
                
                {/* Compact Progress Ring */}
                <div className="relative w-24 h-24 flex items-center justify-center ms-auto">
                  <svg className="w-full h-full -rotate-90 transform drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                    <motion.circle 
                      cx="50" cy="50" r="42" 
                      fill="none" 
                      stroke="url(#bossGradient)" 
                      strokeWidth="12" 
                      strokeLinecap="round"
                      strokeDasharray="264"
                      initial={{ strokeDashoffset: 264 }}
                      animate={{ strokeDashoffset: 264 - (264 * machineBossProgress) / 100 }}
                      transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    />
                    <defs>
                      <linearGradient id="bossGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#EF4444" />
                        <stop offset="100%" stopColor="#F97316" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex items-center justify-center text-center">
                    <span className="text-[22px] font-black text-white tabular-nums tracking-tighter">
                      {machineBossProgress}%
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* The Grid / Gallery of Quests */}
              
              {/* Daily Quests (2 Column Grid) */}
              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-[16px] font-black tracking-wide text-white flex items-center gap-2">
                    <Sun className="w-4 h-4 text-[#F5D061]" /> מטלות להיום
                  </h4>
                  <span className="text-[12px] text-[#A1A1AA] bg-white/10 px-3 py-1 rounded-[10px] shadow-inner font-bold">
                    {quests.daily.filter(q => q.completed).length}/{quests.daily.length} הושלמו
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {quests.daily.map(quest => (
                    <QuestCard key={quest.id} quest={quest} type="daily" onClick={() => openEvidenceModal(quest, 'daily')} />
                  ))}
                </div>
              </section>

              {/* Weekly Quests (Full Width) */}
              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-[16px] font-black tracking-wide text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#06B6D4]" /> יעדים שבועיים
                  </h4>
                </div>
                <div className="flex flex-col gap-3">
                  {quests.weekly.map(quest => (
                    <QuestCard key={quest.id} quest={quest} type="weekly" onClick={() => openEvidenceModal(quest, 'weekly')} />
                  ))}
                </div>
              </section>

              {/* Monthly Quests (Hero Style) */}
              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-[16px] font-black tracking-wide text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#F5D061]" /> מטרות חודשיות
                  </h4>
                </div>
                <div className="flex flex-col gap-3">
                  {quests.monthly.map(quest => (
                    <QuestCard key={quest.id} quest={quest} type="monthly" onClick={() => openEvidenceModal(quest, 'monthly')} />
                  ))}
                </div>
              </section>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Evidence Verification Modal ── */}
      <AnimatePresence>
        {evidenceTask && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeEvidenceModal} />
            
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-[28px] p-6 w-full max-w-sm relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Dynamic Status Glow */}
              <div className={`absolute -top-32 -left-32 w-64 h-64 blur-[80px] rounded-full transition-colors duration-1000 pointer-events-none ${
                evidenceStatus === 'success' ? 'bg-[#10B981]/30' : 
                evidenceStatus === 'scanning' ? 'bg-[#06B6D4]/30' : 'bg-[#EF4444]/20'
              }`} />

              {/* Close Button */}
              {evidenceStatus === 'idle' && (
                <button onClick={closeEvidenceModal} className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors z-20">
                  <X className="w-5 h-5 text-[#A1A1AA]" />
                </button>
              )}

              <div className="flex flex-col items-center text-center mt-2 relative z-10">
                <h3 className="text-[20px] font-black text-white tracking-wide mb-2">{evidenceTask.title}</h3>
                <p className="text-[#A1A1AA] text-[13px] font-bold mb-6">יש להעלות תמונה או צילום מסך כהוכחה לביצוע המשימה לקבלת {evidenceTask.xp} נקודות.</p>

                {/* Upload Area / Scanning Area */}
                <div className={`w-full h-48 rounded-[20px] border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-500 relative overflow-hidden ${
                  evidenceStatus === 'success' ? 'border-[#10B981] bg-[#10B981]/10' :
                  evidenceStatus === 'scanning' ? 'border-[#06B6D4] bg-[#06B6D4]/10' :
                  'border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer'
                }`}>
                  
                  {evidenceStatus === 'idle' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full h-full justify-center" onClick={simulateEvidenceUpload}>
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
                        <UploadCloud className="w-8 h-8 text-[#A1A1AA]" />
                      </div>
                      <span className="font-bold text-[14px] text-white">לחץ להעלאת הוכחה</span>
                      <span className="text-[11px] text-[#71717A] mt-1">מצלמה או גלריה</span>
                    </motion.div>
                  )}

                  {evidenceStatus === 'scanning' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full h-full justify-center">
                      <ScanLine className="w-12 h-12 text-[#06B6D4] animate-pulse mb-4" />
                      <span className="font-black text-[15px] text-[#06B6D4] tracking-widest uppercase">מאמת הוכחה...</span>
                      
                      {/* Scanning Laser Effect */}
                      <motion.div 
                        initial={{ top: 0 }}
                        animate={{ top: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="absolute left-0 right-0 h-[2px] bg-[#06B6D4] shadow-[0_0_15px_#06B6D4] z-20"
                      />
                    </motion.div>
                  )}

                  {evidenceStatus === 'success' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center w-full h-full justify-center">
                      <div className="w-16 h-16 rounded-full bg-[#10B981] flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                        <CheckCircle className="w-8 h-8 text-black" />
                      </div>
                      <span className="font-black text-[18px] text-[#10B981] tracking-wide">הוכחה אושרה!</span>
                      <span className="text-[13px] font-bold text-white mt-1">+{evidenceTask.xp} XP</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Missing Lucide Icon
function Sun(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}
