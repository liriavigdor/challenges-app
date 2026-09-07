const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/features/ChallengesTab.jsx');

const content = `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Flame, Users, Lock, CheckCircle, Swords, ArrowRight, Zap, Trophy, Medal, Star, Calendar, Clock, Activity, Map as MapIcon, Compass, Dumbbell, ChevronDown, Sparkles, TrendingUp, Moon, Plus } from 'lucide-react';

/* ── Elite Commercial Theme V3 (Luxury/Oura Tier) ──
   Canvas Base: #090C10
   Glass Surfaces: rgba(22, 27, 34, 0.75) blur(20px)
   Borders: rgba(255, 255, 255, 0.08)
   Primary Accent (Warm Gold): linear-gradient(135deg, #D4AF37, #AA771C)
   Secondary Accent (Steel Teal): #38BDF8
*/

const MatchupFeedCard = ({ challenger, opponent, title, subtitle, challengeScore, opponentScore, maxScore }) => {
  const [hasJoined, setHasJoined] = useState(false);
  const challengerPercent = Math.min(100, (challengeScore / maxScore) * 100);
  const opponentPercent = Math.min(100, (opponentScore / maxScore) * 100);

  return (
    <motion.div 
      className="bg-[#161B22]/75 backdrop-blur-[20px] rounded-2xl p-5 relative overflow-hidden group/card border border-white/[0.08]"
    >
      {/* Subtle depth glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/[0.02] rounded-full blur-3xl pointer-events-none" />
      
      {/* Matchup Header */}
      <div className="text-center mb-5 relative z-10 flex flex-col gap-1">
        <h4 className="text-white font-extrabold tracking-tight text-lg leading-tight">{title}</h4>
        <p className="text-[#9CA3AF] text-xs font-normal">{subtitle}</p>
      </div>

      {/* Avatars & Versus */}
      <div className="flex items-center justify-between mb-5 relative z-10 px-2 gap-4">
        {/* Challenger */}
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="relative w-12 h-12">
             <img src={challenger.avatar} alt={challenger.name} className="w-12 h-12 rounded-full border-2 border-[#D4AF37] bg-[#1E2638] object-cover" />
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#161B22] rounded-full"></div>
          </div>
          <span className="text-xs font-bold text-white tracking-wide truncate">{challenger.name}</span>
        </div>
        
        {/* VS Badge Geometry */}
        <div className="flex-shrink-0 z-20 flex items-center justify-center">
          <div className="w-[28px] h-[28px] rounded-full bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#38BDF8]/30 text-[#38BDF8] font-extrabold flex items-center justify-center text-[10px] tracking-widest italic shadow-sm">
            VS
          </div>
        </div>

        {/* Opponent */}
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="relative w-12 h-12">
             <img src={opponent.avatar} alt={opponent.name} className="w-12 h-12 rounded-full border-2 border-slate-500 bg-[#1E2638] object-cover" />
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-slate-500 border-2 border-[#161B22] rounded-full"></div>
          </div>
          <span className="text-xs font-bold text-white tracking-wide truncate">{opponent.name}</span>
        </div>
      </div>

      {/* Score / Progress Comparison */}
      <div className="relative z-10 flex flex-col gap-3">
        {/* Progress Track & Edge Chips */}
        <div className="flex justify-between items-center px-4">
          <div className="bg-white/[0.06] border border-white/10 px-2 py-[2px] rounded-md flex items-center">
            <span className="font-bold text-xs text-[#D4AF37] tabular-nums">{challengeScore}</span>
          </div>
          <span className="text-[#9CA3AF] text-[11px] font-medium tracking-wider uppercase">מתוך {maxScore}</span>
          <div className="bg-white/[0.06] border border-white/10 px-2 py-[2px] rounded-md flex items-center">
            <span className="font-bold text-xs text-white tabular-nums">{opponentScore}</span>
          </div>
        </div>
        
        {/* Dual Progress Bar */}
        <div className="relative w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
           <div className="absolute top-0 right-0 h-full bg-gradient-to-br from-[#D4AF37] to-[#AA771C] rounded-full" style={{ width: \`\${challengerPercent}%\` }} />
           <div className="absolute top-0 left-0 h-full bg-slate-500 rounded-full" style={{ width: \`\${opponentPercent}%\` }} />
        </div>

        {/* CTA Elevation */}
        <button 
          onClick={() => setHasJoined(!hasJoined)}
          className={\`w-full mt-2 min-h-[48px] rounded-xl font-bold flex items-center justify-center gap-2.5 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] \${
            hasJoined 
              ? 'bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30' 
              : 'bg-white/5 text-[#D4AF37] border border-[#D4AF37]/40'
          }\`}
        >
          {hasJoined ? (
            <>
              <CheckCircle className="w-5 h-5 text-[#38BDF8]" />
              <span className="tracking-wide">הצטרפת לאתגר!</span>
            </>
          ) : (
            <>
              <Target className="w-5 h-5" />
              <span className="tracking-wide">הצטרף לאתגר הזה או הזמן חבר</span>
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
      className="bg-[#161B22]/75 backdrop-blur-[20px] rounded-2xl border border-white/[0.08] relative group flex flex-col"
    >
      {/* Ambient depth glow */}
      <div className="absolute top-0 right-0 w-48 h-32 bg-[#D4AF37]/[0.02] rounded-full blur-3xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
      
      {/* Absolute Fix for Left-Edge Badge Clipping */}
      <div className="w-full py-5 ps-[24px] pe-[20px] flex flex-col gap-4 overflow-visible">
        
        {/* Top Meta Row */}
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
            <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/20 truncate shrink-0">
              {category}
            </span>
            <span className="text-[10px] font-medium text-[#9CA3AF] flex items-center gap-1 shrink-0 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 tabular-nums">
              <Clock className="w-3 h-3" />
              {daysLeft}d left
            </span>
            {isNearCompletion && (
              <span className="text-[10px] font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2.5 py-1 rounded-full border border-[#38BDF8]/20 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3 text-[#38BDF8]" />
                קרוב לסיום!
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#D4AF37] bg-white/5 px-3 py-1 rounded-full border border-white/10 shrink-0">
            <Zap className="w-3 h-3 fill-[#D4AF37]" />
            <span className="font-mono font-extrabold tracking-wide tabular-nums">+\${xpReward} XP</span>
          </div>
        </div>

        {/* Title & Subtitle + Type Icon */}
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="flex-1 min-w-0">
            <h4 className="font-extrabold tracking-tight text-white text-[17px] leading-tight flex items-center gap-2 truncate">
              <span className="truncate">{title}</span>
              {isCompleted && <CheckCircle className="w-4.5 h-4.5 text-[#D4AF37] shrink-0" />}
            </h4>
            <p className="text-[12px] text-[#9CA3AF] font-normal mt-1.5 leading-snug truncate">
              {subtitle}
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37] shrink-0 shadow-inner backdrop-blur-md">
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
                  className="w-8 h-8 rounded-full border-2 border-[#161B22] object-cover bg-[#1E2638] shadow-sm relative z-10"
                />
              ))}
              {localParticipants.length > 4 && (
                <div className="w-8 h-8 rounded-full border-2 border-[#161B22] bg-[#1E2638] text-slate-300 text-[10px] font-bold flex items-center justify-center relative z-0">
                  +{localParticipants.length - 4}
                </div>
              )}
            </div>
            <span className="text-[11px] font-medium text-[#9CA3AF] truncate">
              {isGroup ? \`\${localParticipants.length} מתחרים\` : '1 נגד 1'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-[11px] text-white bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 shrink-0">
            <span>{rankLabel}</span>
          </div>
        </div>

        {/* Rich Progress Bar */}
        <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5 relative shadow-inner mt-1">
          <motion.div 
            className="h-full rounded-full"
            style={{
              background: isCompleted 
                ? 'linear-gradient(135deg, #38BDF8, #0EA5E9)'
                : 'linear-gradient(135deg, #D4AF37, #AA771C)',
            }}
            initial={{ width: 0 }}
            animate={{ width: \`\${myPercent}%\` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        {/* Button Controls & Hierarchy */}
        <div className="flex items-center justify-between mt-2 pt-1 min-w-0">
          <div className="flex flex-col min-w-0">
             <span className="text-[#9CA3AF] text-[11px] font-medium">התקדמות</span>
             <span className="text-white font-bold truncate">
               <strong className="text-lg tracking-tight tabular-nums">{myParticipant.score}</strong> 
               <span className="text-[#9CA3AF] text-xs font-medium ml-1">/ {maxScore} {unit}</span>
             </span>
          </div>
          
          <div className="flex items-center gap-[12px] h-[42px]">
            {!isCompleted && (
              <button 
                onClick={handleQuickUpdate}
                className="h-full px-4 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#AA771C] text-[#000000] font-bold text-sm flex items-center justify-center gap-1 transition-transform active:scale-95 shrink-0"
              >
                <span>+{stepIncrement}</span>
                <Zap className="w-4 h-4 fill-black" />
              </button>
            )}

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-full px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors font-bold text-sm flex items-center justify-center gap-2 min-w-[44px] shrink-0"
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
              className="mt-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl p-2.5 flex items-center justify-between text-xs text-[#D4AF37] font-bold backdrop-blur-md"
            >
              <div className="flex items-center gap-2 truncate">
                <Sparkles className="w-4 h-4 animate-spin shrink-0" />
                <span className="truncate">התקדמות עודכנה! (+{stepIncrement} {unit})</span>
              </div>
              <span className="font-mono text-white text-[11px] bg-[#D4AF37]/20 px-2 py-1 rounded-md shrink-0 tabular-nums">+\${stepIncrement * 10} XP</span>
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
                          ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 shadow-inner' 
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
                          <span className="text-[#9CA3AF] text-xs tabular-nums">#{index + 1}</span>
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
                              <span className="text-[9px] bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#000000] px-1.5 py-0.5 rounded font-black shrink-0">
                                אתה
                              </span>
                            )}
                          </span>
                          <span className="text-xs font-black text-white shrink-0 tabular-nums">
                            {p.score} <span className="text-[10px] text-[#9CA3AF] font-medium">{unit}</span>
                          </span>
                        </div>
                        
                        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className={\`h-full rounded-full transition-all duration-500 ease-out \${
                              isLeader 
                                ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA771C]' 
                                : p.isMe 
                                  ? 'bg-[#38BDF8]' 
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
    <div className="flex flex-col h-full w-full bg-[#090C10] font-sans text-white" dir="rtl">
      
      {/* ── Premium Header & Navigation Capsule Geometry ── */}
      <div className="sticky top-0 z-20 bg-[#090C10]/90 backdrop-blur-md border-b border-white/[0.08] pt-6 pb-4 px-5">
        <div className="flex justify-between items-end mb-4 min-h-[44px]">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            אתגרים
          </h2>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <Flame className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-sm font-bold text-white tabular-nums">{currentUser?.stats?.streakDays || 7} ימים</span>
          </div>
        </div>

        {/* Top Sub-Tab Segmented Capsule */}
        <div className="relative flex flex-col items-center mt-2 w-full">
          <div className="relative w-full bg-[#0F172A]/80 rounded-full p-[6px] flex items-center border border-white/[0.08]">
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
                      ? 'text-[#000000]'
                      : 'text-[#9CA3AF] hover:text-white'
                  }\`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPillV3"
                      className="absolute inset-0 bg-[#FFFFFF] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
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

              {/* Hero Banner ("קרוב לפריצת דרך!") Alignment */}
              <div 
                dir="rtl" 
                className="relative overflow-hidden rounded-2xl p-5 flex items-center justify-between group bg-[#161B22]/75 border border-white/[0.08]" 
                style={{ backdropFilter: 'blur(20px)' }}
              >
                {/* Animated Gradient Mesh Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#D4AF37]/5 to-[#D4AF37]/10 z-0" />
                
                <div className="relative z-10 flex flex-row items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                      {/* Custom Progress Ring */}
                      <svg className="w-full h-full -rotate-90 absolute inset-0" viewBox="0 0 36 36">
                        <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100, 100" />
                        <path className="text-[#D4AF37]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="40, 100" />
                      </svg>
                      <Flame className="w-5 h-5 text-[#D4AF37] absolute" />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5 tracking-wide">
                        קרוב לפריצת דרך! <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      </h4>
                      <p className="text-xs text-[#9CA3AF] mt-1 tabular-nums">
                        "30 יום ללא סוכר": 12 מתוך 30 ימים
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shrink-0">
                    <span className="text-sm font-black text-[#D4AF37] tabular-nums">
                      40%
                    </span>
                  </div>
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
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-white" />
                    <h3 className="text-base font-bold text-white tracking-wide">אימון אחרון</h3>
                  </div>
                  <span className="text-xs text-[#9CA3AF] font-bold bg-white/5 px-3 py-1.5 rounded-full border border-white/10 tabular-nums">אתמול, 18:30</span>
                </div>

                <div className="bg-[#161B22]/75 backdrop-blur-[20px] rounded-2xl border border-white/[0.08] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                  {/* Workout Metric Cards Grid */}
                  <div className="grid grid-cols-2 gap-[12px] relative z-10">
                    {/* Grid Item 1: Distance */}
                    <div className="bg-white/[0.03] rounded-xl p-[14px] flex flex-col items-start gap-1 border border-white/5">
                       <MapIcon className="w-5 h-5 text-[#38BDF8] mb-1" />
                       <span className="text-[#9CA3AF] text-xs font-bold">מרחק</span>
                       <div className="flex items-baseline gap-1.5 mt-1">
                         <span className="text-white font-bold text-[20px] tabular-nums">5.2</span>
                         <span className="text-[#9CA3AF] text-[12px]">ק"מ</span>
                       </div>
                    </div>
                    
                    {/* Grid Item 2: Duration */}
                    <div className="bg-white/[0.03] rounded-xl p-[14px] flex flex-col items-start gap-1 border border-white/5">
                       <Clock className="w-5 h-5 text-[#D4AF37] mb-1" />
                       <span className="text-[#9CA3AF] text-xs font-bold">זמן</span>
                       <div className="flex items-baseline gap-1.5 mt-1">
                         <span className="text-white font-bold text-[20px] tabular-nums">28:45</span>
                         <span className="text-[#9CA3AF] text-[12px]">דקות</span>
                       </div>
                    </div>
                    
                    {/* Grid Item 3: Calories */}
                    <div className="bg-white/[0.03] rounded-xl p-[14px] flex flex-col items-start gap-1 border border-white/5">
                       <Flame className="w-5 h-5 text-[#D4AF37] mb-1" />
                       <span className="text-[#9CA3AF] text-xs font-bold">קלוריות</span>
                       <div className="flex items-baseline gap-1.5 mt-1">
                         <span className="text-white font-bold text-[20px] tabular-nums">320</span>
                         <span className="text-[#9CA3AF] text-[12px]">קק"ל</span>
                       </div>
                    </div>
                    
                    {/* Grid Item 4: Pace */}
                    <div className="bg-white/[0.03] rounded-xl p-[14px] flex flex-col items-start gap-1 border border-white/5">
                       <Activity className="w-5 h-5 text-[#38BDF8] mb-1" />
                       <span className="text-[#9CA3AF] text-xs font-bold">קצב ממוצע</span>
                       <div className="flex items-baseline gap-1.5 mt-1">
                         <span className="text-white font-bold text-[20px] tabular-nums">5'30"</span>
                         <span className="text-[#9CA3AF] text-[12px]">לק"מ</span>
                       </div>
                    </div>
                  </div>
                  <button className="w-full mt-4 min-h-[48px] rounded-xl bg-white/5 hover:bg-white/10 text-[#D4AF37] font-bold text-sm border border-[#D4AF37]/30 transition-colors flex items-center justify-center gap-2">
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
console.log('Successfully applied Oura/Strava Dark luxury redesign to ChallengesTab.jsx');
