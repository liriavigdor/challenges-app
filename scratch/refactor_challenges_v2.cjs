const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/features/ChallengesTab.jsx');

const content = `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Flame, Users, Lock, CheckCircle, Swords, ArrowRight, Zap, Trophy, Medal, Star, Calendar, Clock, Activity, Map as MapIcon, Compass, Dumbbell, ChevronDown, Sparkles, TrendingUp, Moon, Plus } from 'lucide-react';

/* ── Elite Commercial Theme ──
   Background: #0B0F17
   Surface: rgba(18, 24, 38, 0.7) blur(16px)
   Borders: rgba(255, 255, 255, 0.07)
   Accent Primary (Volt): #CCFF00
   Accent Secondary (Neon Cyan): #00F2FE
*/

const MatchupFeedCard = ({ challenger, opponent, title, subtitle, challengeScore, opponentScore, maxScore }) => {
  const [hasJoined, setHasJoined] = useState(false);
  const challengerPercent = Math.min(100, (challengeScore / maxScore) * 100);
  const opponentPercent = Math.min(100, (opponentScore / maxScore) * 100);

  return (
    <motion.div 
      className="bg-[#121826]/70 backdrop-blur-2xl rounded-2xl p-5 relative overflow-hidden group/card border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.37)]"
    >
      {/* Subtle depth glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#00F2FE]/[0.03] rounded-full blur-3xl pointer-events-none" />
      
      {/* Matchup Header */}
      <div className="text-center mb-4 relative z-10 flex flex-col gap-1">
        <h4 className="text-white font-extrabold tracking-tight text-lg leading-tight">{title}</h4>
        <p className="text-[#9CA3AF] text-xs font-normal">{subtitle}</p>
      </div>

      {/* Avatars & Versus with explicit gap-4 (16px) */}
      <div className="flex items-center justify-between mb-4 relative z-10 px-2 gap-4">
        {/* Challenger */}
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="relative w-12 h-12">
             <img src={challenger.avatar} alt={challenger.name} className="w-12 h-12 rounded-full border-2 border-[#00F2FE] bg-[#1E2638] object-cover" />
             <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#CCFF00] border-2 border-[#0B0F17] rounded-full"></div>
          </div>
          <span className="text-xs font-bold text-white tracking-wide truncate">{challenger.name}</span>
        </div>
        
        {/* VS Badge */}
        <div className="flex-shrink-0 z-20 flex items-center justify-center">
          <div className="bg-gradient-to-br from-[#FF3B30] to-[#FF9500] px-3 py-1 rounded-full shadow-[0_0_12px_rgba(255,59,48,0.4)] border border-white/20 text-white font-black text-[11px] tracking-widest italic uppercase">
            VS
          </div>
        </div>

        {/* Opponent */}
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="relative w-12 h-12">
             <img src={opponent.avatar} alt={opponent.name} className="w-12 h-12 rounded-full border-2 border-slate-500 bg-[#1E2638] object-cover" />
             <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-slate-500 border-2 border-[#0B0F17] rounded-full"></div>
          </div>
          <span className="text-xs font-bold text-white tracking-wide truncate">{opponent.name}</span>
        </div>
      </div>

      {/* Score / Progress Comparison */}
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex justify-between items-center px-4 overflow-visible">
          <div className="bg-white/10 px-2 py-[3px] rounded-full border border-white/5 flex items-center shadow-inner">
            <span className="font-bold text-xs text-[#00F2FE] tabular-nums">{challengeScore}</span>
          </div>
          <span className="text-[#9CA3AF] text-[11px] font-medium tracking-wider uppercase">מתוך {maxScore}</span>
          <div className="bg-white/10 px-2 py-[3px] rounded-full border border-white/5 flex items-center shadow-inner">
            <span className="font-bold text-xs text-white tabular-nums">{opponentScore}</span>
          </div>
        </div>
        
        {/* Dual Progress Bar */}
        <div className="relative w-full h-3.5 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
           {/* Challenger Progress */}
           <div className="absolute top-0 right-0 h-full bg-[#00F2FE] rounded-full shadow-[0_0_12px_rgba(0,242,254,0.6)]" style={{ width: \`\${challengerPercent}%\` }} />
           {/* Opponent Progress */}
           <div className="absolute top-0 left-0 h-full bg-slate-500 rounded-full" style={{ width: \`\${opponentPercent}%\` }} />
        </div>

        {/* Call to Action */}
        <button 
          onClick={() => setHasJoined(!hasJoined)}
          className={\`w-full min-h-[48px] rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-lg transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-95 \${
            hasJoined 
              ? 'bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40' 
              : 'bg-gradient-to-r from-[#00F2FE]/15 to-[#4FACFE]/15 text-[#00F2FE] border border-[#00F2FE]/40 hover:bg-[#00F2FE]/25'
          }\`}
        >
          {hasJoined ? (
            <>
              <CheckCircle className="w-5 h-5 text-[#00F2FE]" />
              <span className="tracking-wide">הצטרפת לאתגר!</span>
            </>
          ) : (
            <>
              <Target className="w-5 h-5" />
              <span className="tracking-wide">הצטרף לאתגר או הזמן חבר</span>
            </>
          )}
        </button>
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

  const isGroup = type === 'group';
  
  const handleQuickUpdate = (e) => {
    e.stopPropagation();
    setLocalParticipants(prev => prev.map(p => {
      if (p.isMe) {
        return { ...p, score: Math.min(maxScore, p.score + stepIncrement) };
      }
      return p;
    }));
    setShowRewardEffect(true);
    setTimeout(() => setShowRewardEffect(false), 2000);
  };

  const sortedParticipants = [...localParticipants].sort((a, b) => b.score - a.score);
  const myParticipant = localParticipants.find(p => p.isMe) || localParticipants[0];
  const myPercent = Math.min(100, Math.round((myParticipant.score / maxScore) * 100));
  const isNearCompletion = myPercent >= 70 && myPercent < 100;
  const isCompleted = myPercent >= 100;

  const myRankIndex = sortedParticipants.findIndex(p => p.isMe || p.id === myParticipant.id);
  const rankLabel = myRankIndex === 0 ? "מקום 1 🥇" : myRankIndex === 1 ? "מקום 2 🥈" : \`מקום \${myRankIndex + 1}\`;

  return (
    <div 
      className="bg-[#121826]/70 backdrop-blur-2xl rounded-2xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] relative overflow-hidden group flex flex-col"
    >
      {/* Ambient depth glow */}
      <div className="absolute top-0 right-0 w-48 h-32 bg-[#CCFF00]/[0.02] rounded-full blur-3xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
      
      {/* Main Interactive Card Body - padding-inline-start: 20px */}
      <div className="w-full py-5 ps-5 pe-4 box-border flex flex-col gap-4">
        
        {/* Top Meta Row */}
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
            <span className="text-[10px] font-bold text-[#CCFF00] bg-[#CCFF00]/10 px-2.5 py-1 rounded-full border border-[#CCFF00]/20 truncate shrink-0">
              {category}
            </span>
            <span className="text-[10px] font-medium text-[#9CA3AF] flex items-center gap-1 shrink-0 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 tabular-nums">
              <Clock className="w-3 h-3" />
              {daysLeft}d left
            </span>
            {isNearCompletion && (
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1 animate-pulse shrink-0">
                <Sparkles className="w-3 h-3 text-amber-300" />
                קרוב לסיום!
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 shrink-0 shadow-inner">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-mono font-extrabold tracking-wide">+\${xpReward} XP</span>
          </div>
        </div>

        {/* Title & Subtitle + Type Icon */}
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="flex-1 min-w-0">
            <h4 className="font-extrabold tracking-tight text-white text-[17px] leading-tight flex items-center gap-2 truncate">
              <span className="truncate">{title}</span>
              {isCompleted && <CheckCircle className="w-4.5 h-4.5 text-[#CCFF00] shrink-0" />}
            </h4>
            <p className="text-[12px] text-[#9CA3AF] font-normal mt-1.5 leading-snug truncate">
              {subtitle}
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#CCFF00] shrink-0 shadow-inner backdrop-blur-md">
            <CardIcon className="w-5 h-5" />
          </div>
        </div>

        {/* Participants Avatar Stack & User Position */}
        <div className="flex items-center justify-between text-xs min-w-0 mt-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center -space-x-2 space-x-reverse overflow-hidden shrink-0">
              {localParticipants.slice(0, 4).map((p, idx) => (
                <img
                  key={p.id || idx}
                  src={p.avatar}
                  alt={p.name}
                  className="w-8 h-8 rounded-full border-2 border-[#121826] object-cover bg-[#1E2638] shadow-sm relative z-10"
                />
              ))}
              {localParticipants.length > 4 && (
                <div className="w-8 h-8 rounded-full border-2 border-[#121826] bg-[#1E2638] text-slate-300 text-[10px] font-bold flex items-center justify-center relative z-0">
                  +{localParticipants.length - 4}
                </div>
              )}
            </div>
            <span className="text-[11px] font-medium text-[#9CA3AF] truncate">
              {isGroup ? \`\${localParticipants.length} מתחרים\` : '1 נגד 1'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-[11px] text-white bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 shrink-0 shadow-inner">
            <span>{rankLabel}</span>
          </div>
        </div>

        {/* Rich Progress Bar */}
        <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden p-[2px] border border-white/5 relative shadow-inner mt-1">
          <motion.div 
            className="h-full rounded-full"
            style={{
              background: isCompleted 
                ? '#10B981'
                : '#CCFF00',
              boxShadow: '0 0 10px rgba(204, 255, 0, 0.4)',
            }}
            initial={{ width: 0 }}
            animate={{ width: \`\${myPercent}%\` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        {/* Quick Action Layout - Wrap +1 and Rating in flex gap-3 */}
        <div className="flex items-center justify-between mt-2 pt-1 min-w-0">
          <div className="flex flex-col min-w-0">
             <span className="text-[#9CA3AF] text-[11px] font-medium">התקדמות</span>
             <span className="text-white font-bold truncate tabular-nums">
               <strong className="text-lg tracking-tight">{myParticipant.score}</strong> 
               <span className="text-[#9CA3AF] text-xs font-medium ml-1">/ {maxScore} {unit}</span>
             </span>
          </div>
          
          <div className="flex items-center gap-3 h-[44px]">
            {!isCompleted && (
              <button 
                onClick={handleQuickUpdate}
                className="h-full min-w-[64px] rounded-xl bg-[#CCFF00] text-black font-extrabold text-sm flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(204,255,0,0.2)] active:scale-95 transition-transform shrink-0"
              >
                <span>+{stepIncrement}</span>
                <Zap className="w-4 h-4 fill-black" />
              </button>
            )}

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-full px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors font-bold text-sm cursor-pointer shrink-0 flex items-center justify-center gap-2 min-w-[44px]"
            >
              <span>{isExpanded ? 'סגור' : 'דירוג'}</span>
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.25, ease: "easeInOut" }}>
                <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Instant Reward Feedback Popup */}
        <AnimatePresence>
          {showRewardEffect && (
            <motion.div 
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="mt-2 bg-[#CCFF00]/20 border border-[#CCFF00]/40 rounded-xl p-2.5 flex items-center justify-between text-xs text-[#CCFF00] font-bold backdrop-blur-md"
            >
              <div className="flex items-center gap-2 truncate">
                <Sparkles className="w-4 h-4 animate-spin shrink-0" />
                <span className="truncate">התקדמות עודכנה! (+{stepIncrement} {unit})</span>
              </div>
              <span className="font-mono text-white text-[11px] bg-[#CCFF00]/30 px-2 py-1 rounded-md shrink-0">+\${stepIncrement * 10} XP</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Expanded Content - Accordion Leaderboard */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-white/[0.06] bg-black/20 backdrop-blur-md"
          >
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">דירוג המתחרים בלייב</span>
                <span className="text-[11px] text-[#9CA3AF] font-medium tabular-nums">יעד: {maxScore} {unit}</span>
              </div>
              
              <div className="flex flex-col gap-2">
                {sortedParticipants.map((p, index) => {
                  const pPercent = Math.min(100, Math.round((p.score / maxScore) * 100));
                  const isLeader = index === 0;
                  
                  return (
                    <div 
                      key={p.id || index} 
                      className={\`relative flex items-center gap-3 p-3 rounded-xl border transition-all \${
                        p.isMe 
                          ? 'bg-[#CCFF00]/10 border-[#CCFF00]/30 shadow-inner' 
                          : 'bg-white/[0.03] border-white/5'
                      }\`}
                    >
                      {/* Rank */}
                      <div className="w-6 text-center text-sm font-bold shrink-0">
                        {isLeader ? (
                          <span>🥇</span>
                        ) : index === 1 ? (
                          <span>🥈</span>
                        ) : index === 2 ? (
                          <span>🥉</span>
                        ) : (
                          <span className="text-[#9CA3AF] text-xs">#{index + 1}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <img 
                        src={p.avatar} 
                        alt={p.name} 
                        className="w-10 h-10 rounded-full border-[2px] border-white/10 bg-[#1E2638] object-cover shrink-0" 
                      />
                      
                      {/* Name & Progress bar */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                            <span className="truncate">{p.name}</span>
                            {p.isMe && (
                              <span className="text-[9px] bg-[#CCFF00] text-black px-1.5 py-0.5 rounded font-black shrink-0">
                                אתה
                              </span>
                            )}
                          </span>
                          <span className="text-xs font-black text-white shrink-0 tabular-nums">
                            {p.score} <span className="text-[10px] text-[#9CA3AF] font-medium">{unit}</span>
                          </span>
                        </div>
                        
                        <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className={\`h-full rounded-full transition-all duration-500 ease-out \${
                              isLeader 
                                ? 'bg-amber-400' 
                                : p.isMe 
                                  ? 'bg-[#CCFF00]' 
                                  : 'bg-slate-500'
                            }\`}
                            style={{ width: \`\${pPercent}%\` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
  const [isMysteryRevealed, setIsMysteryRevealed] = useState(false);
  const [mysteryProgress, setMysteryProgress] = useState(0);

  return (
    <div className="flex flex-col h-full w-full bg-[#0B0F17] font-sans text-white" dir="rtl">
      
      {/* ── Premium Header & Floating Pill Navigation ── */}
      <div className="sticky top-0 z-20 bg-[#0B0F17]/90 backdrop-blur-md border-b border-white/[0.06] pt-6 pb-4 px-5">
        <div className="flex justify-between items-end mb-4 min-h-[44px]">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            אתגרים
          </h2>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-white tabular-nums">{currentUser?.stats?.streakDays || 7} ימים</span>
          </div>
        </div>

        {/* Sub-Tab Pill Bar - Segment Control */}
        <div className="relative flex flex-col items-center mt-2 w-full">
          <div className="relative w-full bg-black/40 rounded-full p-1 flex items-center border border-white/[0.08]">
            {[
              { id: 'explore',          label: 'אקספלור' },
              { id: 'my_challenges',    label: 'אתגרים' },
              { id: 'training_ground',  label: 'אימונים' },
            ].map(({ id, label }) => {
              const isActive = activeInnerTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveInnerTab(id)}
                  className={\`relative flex-1 min-h-[44px] flex items-center justify-center z-10 transition-colors duration-300 rounded-full font-bold text-sm tracking-wide focus:outline-none \${
                    isActive
                      ? 'text-black'
                      : 'text-[#9CA3AF] hover:text-white'
                  }\`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-white rounded-full shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-20">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pb-20 pt-4 px-4 custom-scrollbar">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: MY CHALLENGES (אתגרים) */}
          {activeInnerTab === 'my_challenges' && (
            <motion.div 
              key="app_challenges"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <Activity className="w-5 h-5 text-white shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white tracking-wide truncate">האתגרים הפעילים שלי</h3>
                    <p className="text-[11px] text-[#9CA3AF] font-medium mt-0.5 truncate">עדכן התקדמות בלחיצה מהירה או פתח דירוג.</p>
                  </div>
                </div>
              </div>

              {/* Premium Progress Hero Card - Zeigarnik */}
              <div 
                dir="rtl" 
                className="relative overflow-hidden rounded-2xl p-5 flex items-center justify-between shadow-[0_8px_32px_rgba(204,255,0,0.15)] group" 
                style={{ backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.07)' }}
              >
                {/* Animated Gradient Mesh Background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#121826] via-[#121826] to-[#CCFF00]/10 bg-[length:200%_200%] animate-pulse z-0" />
                
                <div className="relative z-10 flex items-center gap-4 min-w-0 flex-1 flex-row">
                  <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                    {/* Custom Progress Ring */}
                    <svg className="w-full h-full -rotate-90 absolute inset-0" viewBox="0 0 36 36">
                      <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100, 100" />
                      <path className="text-[#CCFF00]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="40, 100" />
                    </svg>
                    <Flame className="w-5 h-5 text-[#CCFF00] drop-shadow-[0_0_10px_rgba(204,255,0,0.6)] absolute" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2 truncate tracking-wide">
                      קרוב לפריצת דרך! <Sparkles className="w-4 h-4 text-[#CCFF00]" />
                    </h4>
                    <p className="text-xs text-[#9CA3AF] mt-1 truncate">
                      "30 יום ללא סוכר": 12 מתוך 30 ימים
                    </p>
                  </div>
                </div>
                <div className="relative z-10 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shrink-0">
                  <span className="text-sm font-black text-[#CCFF00] tabular-nums">
                    40%
                  </span>
                </div>
              </div>

              {/* Group Challenge 1: Running */}
              <MyChallengeCard 
                title={'100 ק"מ ריצה החודש'}
                subtitle="מי יסיים ראשון את המרחק המצטבר?"
                category="ריצה וסיבולת"
                icon={TrendingUp}
                daysLeft={17}
                xpReward={600}
                unit='ק"מ'
                type="group"
                maxScore={100}
                participants={[
                  { id: 1, name: 'אתה', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix', score: 42, isMe: true },
                  { id: 2, name: 'דנה קגן', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Dana', score: 65, isMe: false },
                  { id: 3, name: 'אמיר כהן', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Amir', score: 20, isMe: false },
                  { id: 4, name: 'נועה לוי', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Noa', score: 55, isMe: false },
                ]}
              />

              {/* 1v1 Challenge: Sugar-free */}
              <MyChallengeCard 
                title="30 יום ללא סוכר ומתוקים"
                subtitle="ראש בראש: מי מחזיק מעמד רצוף בלי להישבר"
                category="תזונה ובריאות"
                icon={Swords}
                daysLeft={18}
                xpReward={500}
                unit="ימים"
                type="1v1"
                maxScore={30}
                participants={[
                  { id: 1, name: 'אתה', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix', score: 12, isMe: true },
                  { id: 2, name: 'רועי שחר', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Roi', score: 12, isMe: false },
                ]}
              />
            </motion.div>
          )}

          {/* TAB 2: EXPLORE (אקספלור) */}
          {activeInnerTab === 'explore' && (
            <motion.div 
              key="friend_challenges"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-white" />
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">זירת התחרויות</h3>
                  <p className="text-xs text-[#9CA3AF] font-medium mt-0.5">תראה מה אחרים עושים, ותזמין חברים לאותו אתגר.</p>
                </div>
              </div>

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
                subtitle="מי מרים יותר משקל באימון אחד"
                challenger={{ name: 'אנה', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Anna' }}
                opponent={{ name: 'מיכל', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Michal' }}
                challengeScore={4500}
                opponentScore={5200}
                maxScore={6000}
              />

            </motion.div>
          )}

          {/* TAB 3: TRAINING GROUND (מגרש אימונים) */}
          {activeInnerTab === 'training_ground' && (
            <motion.div 
              key="training_ground"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* Workout Logs Refactor - Metrics Grid */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-white" />
                    <h3 className="text-base font-bold text-white tracking-wide">אימון אחרון</h3>
                  </div>
                  <span className="text-xs text-[#9CA3AF] font-bold bg-white/5 px-3 py-1.5 rounded-full border border-white/10 tabular-nums">אתמול, 18:30</span>
                </div>

                <div className="bg-[#121826]/70 backdrop-blur-2xl rounded-2xl border border-white/5 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                  <div className="grid grid-cols-2 gap-3 relative z-10">
                    {/* Grid Item 1: Distance */}
                    <div className="bg-white/5 rounded-xl p-3 flex flex-col items-start gap-1">
                       <MapIcon className="w-5 h-5 text-[#00F2FE] mb-1" />
                       <span className="text-[#9CA3AF] text-xs font-bold">מרחק</span>
                       <div className="flex items-baseline gap-1 mt-1">
                         <span className="text-white font-extrabold text-xl tabular-nums">5.2 ק"מ</span>
                       </div>
                    </div>
                    
                    {/* Grid Item 2: Duration */}
                    <div className="bg-white/5 rounded-xl p-3 flex flex-col items-start gap-1">
                       <Clock className="w-5 h-5 text-[#CCFF00] mb-1" />
                       <span className="text-[#9CA3AF] text-xs font-bold">זמן</span>
                       <div className="flex items-baseline gap-1 mt-1">
                         <span className="text-white font-extrabold text-xl tabular-nums">28:45 דקות</span>
                       </div>
                    </div>
                    
                    {/* Grid Item 3: Calories */}
                    <div className="bg-white/5 rounded-xl p-3 flex flex-col items-start gap-1">
                       <Flame className="w-5 h-5 text-amber-400 mb-1" />
                       <span className="text-[#9CA3AF] text-xs font-bold">קלוריות</span>
                       <div className="flex items-baseline gap-1 mt-1">
                         <span className="text-white font-extrabold text-xl tabular-nums">320 קק"ל</span>
                       </div>
                    </div>
                    
                    {/* Grid Item 4: Pace */}
                    <div className="bg-white/5 rounded-xl p-3 flex flex-col items-start gap-1">
                       <Activity className="w-5 h-5 text-purple-400 mb-1" />
                       <span className="text-[#9CA3AF] text-xs font-bold">קצב ממוצע</span>
                       <div className="flex items-baseline gap-1 mt-1">
                         <span className="text-white font-extrabold text-xl tabular-nums">5'30" לק"מ</span>
                       </div>
                    </div>
                  </div>
                  <button className="w-full mt-4 min-h-[48px] rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    <span>הוסף אימון חדש</span>
                  </button>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully applied elite commercial redesign to ChallengesTab.jsx');
