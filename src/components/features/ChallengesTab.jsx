import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Flame, Users, Lock, CheckCircle, Swords, ArrowRight, Zap, Trophy, Medal, Star, Calendar, Clock, Activity, Map as MapIcon, Compass, Dumbbell, ChevronDown, Sparkles, TrendingUp, Moon, Footprints, Shield, Eye } from 'lucide-react';
import { initialFeed, initialUsers } from '../../mockData';

/* ── Modern Minimalist Neutral / Japandi Theme Palette ──
   Background: #141517 (Deep matte graphite)
   Card Surface: #1B1D20 (Matte charcoal surface)
   Card Elevated: #23262B (Subtle elevated neutral)
   Borders: rgba(255,255,255,0.07)
   Warm Accent (Wood/Linen/Warm sand): #C5B4A5, #B09E8F
   Muted Mocha: #4A443F
   Text Primary (Off-white / Bone): #F4F4F0
   Text Secondary (Muted warm gray): #9E9D97
   Text Dim: #696863
*/

const MatchupFeedCard = ({ challenger, opponent, title, subtitle, challengeScore, opponentScore, maxScore }) => {
  const [hasJoined, setHasJoined] = useState(false);
  const challengerPercent = Math.min(100, (challengeScore / maxScore) * 100);
  const opponentPercent = Math.min(100, (opponentScore / maxScore) * 100);

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-[#131927] rounded-xl border border-white/10 p-4 shadow-lg shadow-black/40 hover:border-teal-500/30 transition-all group/card relative overflow-hidden"
    >
      {/* Subtle depth glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      
      {/* Matchup Header */}
      <div className="text-center mb-5 relative z-10">
        <h4 className="text-slate-100 font-extrabold tracking-tight text-lg">{title}</h4>
        <p className="text-xs text-slate-400 font-normal mt-1 leading-relaxed">{subtitle}</p>
      </div>

      {/* Avatars & Versus */}
      <div className="flex items-center justify-between mb-5 relative px-4 z-10">
        {/* Challenger */}
        <div className="flex flex-col items-center gap-1.5 w-1/3">
          <div className="relative">
             <img src={challenger.avatar} alt={challenger.name} className="relative w-13 h-13 rounded-full border-2 border-emerald-500/40 bg-[#1E2638] object-cover shadow-sm" />
          </div>
          <span className="text-xs font-semibold text-slate-200 tracking-wide truncate max-w-full">{challenger.name}</span>
        </div>
        
        {/* VS Badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+10px)] z-20">
          <div className="bg-[#090D16] border border-white/15 text-slate-300 text-xs font-black px-3 py-1 rounded-xl flex items-center gap-1 shadow-md">
            <Swords className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-100">VS</span>
          </div>
        </div>

        {/* Opponent */}
        <div className="flex flex-col items-center gap-1.5 w-1/3">
          <div className="relative">
             <img src={opponent.avatar} alt={opponent.name} className="relative w-13 h-13 rounded-full border-2 border-white/15 bg-[#1E2638] object-cover shadow-sm" />
          </div>
          <span className="text-xs font-semibold text-slate-200 tracking-wide truncate max-w-full">{opponent.name}</span>
        </div>
      </div>

      {/* Score / Progress Comparison */}
      <div className="relative z-10">
        <div className="flex justify-between text-xs font-semibold mb-2 px-1">
          <span className="font-mono tracking-wider text-emerald-400 font-bold">{challengeScore}</span>
          <span className="text-slate-400 text-[11px] font-normal">מתוך {maxScore}</span>
          <span className="font-mono tracking-wider text-slate-300">{opponentScore}</span>
        </div>
        
        {/* Dual Progress Bar */}
        <div className="relative w-full h-2.5 bg-slate-900 rounded-full overflow-hidden mb-5 border border-white/[0.04]">
           {/* Challenger Progress (Right to Left) */}
           <div className="absolute top-0 right-0 h-full bg-gradient-to-l from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(16,185,129,0.4)]" style={{ width: `${challengerPercent}%` }} />
           {/* Opponent Progress (Left to Right) */}
           <div className="absolute top-0 left-0 h-full bg-slate-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${opponentPercent}%` }} />
        </div>

        {/* Call to Action */}
        <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={() => setHasJoined(!hasJoined)}
          className={`w-full py-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
            hasJoined 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
              : 'border-white/10 bg-white/[0.05] text-slate-200 hover:bg-white/[0.09] hover:text-white'
          }`}
        >
          {hasJoined ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>הצטרפת לתחרות הזו! 🥊</span>
            </>
          ) : (
            <>
              <Target className="w-4 h-4 text-slate-400 group-hover/card:text-white transition-colors" />
              <span>הצטרף לאתגר הזה או הזמן חבר</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

const ChallengeCard = ({ title, description, xp, progress, total, isCompleted, onClick = () => {} }) => {
  const percentage = Math.min(100, Math.round((progress / total) * 100));
  
  return (
    <div className={`relative overflow-hidden bg-[#131927]/80 backdrop-blur-xl rounded-2xl border ${isCompleted ? 'border-emerald-500/30' : 'border-white/10'} p-5 shadow-lg shadow-black/40 transition-all hover:border-white/20`}>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex-1 ml-4">
          <h4 className="font-extrabold tracking-tight text-[16px] flex items-center gap-2 text-slate-100">
            {title}
            {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          </h4>
          <p className="text-xs text-slate-400 font-normal mt-1.5 leading-relaxed">{description}</p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/20 shrink-0">
          <Zap className="w-3.5 h-3.5 fill-emerald-400/40" />
          <span className="font-mono tracking-wider font-bold text-sm">{xp} XP</span>
        </div>
      </div>

      <div className="relative z-10 mt-4">
        <div className="flex justify-between text-xs mb-2.5">
           <span className="text-slate-400 font-normal">{isCompleted ? 'הושלם!' : `${progress} מתוך ${total}`}</span>
           <span className={`${isCompleted ? 'text-emerald-400' : 'font-mono tracking-wider text-amber-400 font-bold'}`}>{percentage}%</span>
        </div>
        
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
          <div 
            className={`h-full transition-all duration-1000 ease-out rounded-full ${isCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gradient-to-r from-slate-500 to-slate-400'}`} 
            style={{ width: `${percentage}%` }}
          />
        </div>

        {!isCompleted ? (
          <button 
            onClick={onClick}
            className="w-full py-3 rounded-xl text-sm font-medium bg-white/[0.05] text-slate-200 hover:bg-white/[0.09] hover:text-white transition-all border border-white/10 active:scale-[0.98]"
          >
            עדכן התקדמות
          </button>
        ) : (
          <div className="w-full py-2.5 rounded-xl text-sm font-medium bg-emerald-500/10 text-emerald-400 text-center border border-emerald-500/30 flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4" />
            כל הכבוד! הושלם בהצלחה
          </div>
        )}
      </div>
    </div>
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
  const rankLabel = myRankIndex === 0 ? "מקום 1 🥇" : myRankIndex === 1 ? "מקום 2 🥈" : `מקום ${myRankIndex + 1}`;

  return (
    <motion.div 
      layout
      className="bg-[#131927] rounded-xl border border-white/10 shadow-lg shadow-black/40 transition-all duration-300 hover:border-white/20 hover:shadow-xl overflow-hidden relative group w-full"
    >
      {/* Ambient depth glow */}
      <div className="absolute top-0 right-0 w-48 h-32 bg-teal-500/[0.04] rounded-full blur-3xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
      
      {/* Main Interactive Card Body */}
      <div className="w-full p-5 select-none box-border">
        
        {/* Top Meta Row - Inset from rounded corners */}
        <div className="flex items-center justify-between gap-2 mb-3.5 pt-0.5 px-0.5 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0 flex-1">
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 truncate max-w-[120px]">
              {category}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3 text-slate-400" />
              {daysLeft}d left
            </span>
            {isNearCompletion && (
              <span className="text-[9px] font-bold text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-1 animate-pulse shrink-0">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                קרוב לסיום!
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 shrink-0">
            <Zap className="w-3 h-3 fill-amber-400/40 text-amber-400" />
            <span className="font-mono font-bold">+{xpReward} XP</span>
          </div>
        </div>

        {/* Title & Subtitle + Type Icon */}
        <div className="flex items-start justify-between gap-2.5 mb-3 min-w-0">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold tracking-tight text-slate-100 text-base leading-tight flex items-center gap-1.5 truncate">
              <span className="truncate">{title}</span>
              {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
            </h4>
            <p className="text-[11px] text-slate-400 font-normal mt-1 leading-snug truncate">
              {subtitle}
            </p>
          </div>

          <div className="w-9 h-9 rounded-xl bg-[#1E2638] border border-white/10 flex items-center justify-center text-teal-400 shrink-0 shadow-sm">
            <CardIcon className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Participants Avatar Stack & User Position */}
        <div className="flex items-center justify-between text-xs mb-3 pt-0.5 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="flex items-center -space-x-1.5 space-x-reverse overflow-hidden shrink-0">
              {localParticipants.slice(0, 4).map((p, idx) => (
                <img
                  key={p.id || idx}
                  src={p.avatar}
                  alt={p.name}
                  className="w-5.5 h-5.5 rounded-full border border-[#131927] object-cover bg-[#1E2638]"
                />
              ))}
              {localParticipants.length > 4 && (
                <div className="w-5.5 h-5.5 rounded-full border border-[#131927] bg-[#1E2638] text-slate-400 text-[8px] font-bold flex items-center justify-center">
                  +{localParticipants.length - 4}
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 truncate">
              {isGroup ? `${localParticipants.length} מתחרים` : '1 נגד 1'}
            </span>
          </div>

          <div className="flex items-center gap-1 font-bold text-[10px] text-slate-200 bg-white/[0.04] px-2 py-0.5 rounded border border-white/5 shrink-0">
            <span>{rankLabel}</span>
          </div>
        </div>

        {/* Rich Progress Bar */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-white/[0.05] relative shadow-inner">
          <motion.div 
            className="h-full rounded-full"
            style={{
              background: isCompleted 
                ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                : 'linear-gradient(90deg, #059669 0%, #10b981 70%, #34d399 100%)',
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.35)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${myPercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        {/* Progress Numbers & Actions */}
        <div className="flex items-center justify-between text-[11px] mt-2.5 pt-0.5 min-w-0">
          <span className="text-slate-400 font-normal truncate max-w-[170px]">
            התקדמות: <strong className="font-mono font-bold text-slate-100">{myParticipant.score}</strong> / {maxScore} {unit}
          </span>
          
          <div className="flex items-center gap-1.5 shrink-0">
            {!isCompleted && (
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={handleQuickUpdate}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
              >
                <span>+{stepIncrement}</span>
                <Zap className="w-3 h-3 fill-emerald-400" />
              </motion.button>
            )}

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 border border-white/5 transition-all text-[11px] cursor-pointer shrink-0"
            >
              <span>{isExpanded ? 'סגור' : 'דירוג'}</span>
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-3 h-3" />
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
              className="mt-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-2 flex items-center justify-between text-[11px] text-emerald-300 font-bold shadow-lg"
            >
              <div className="flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin shrink-0" />
                <span className="truncate">התקדמות עודכנה! (+{stepIncrement} {unit})</span>
              </div>
              <span className="font-mono text-emerald-200 text-[10px] bg-emerald-500/30 px-1.5 py-0.5 rounded shrink-0">+{stepIncrement * 10} XP</span>
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
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="border-t border-white/[0.06] bg-[#090D16]/90 backdrop-blur-md"
          >
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">דירוג המתחרים בלייב</span>
                <span className="text-[10px] text-slate-400 font-normal">יעד: {maxScore} {unit}</span>
              </div>
              
              <div className="flex flex-col gap-1.5">
                {sortedParticipants.map((p, index) => {
                  const pPercent = Math.min(100, Math.round((p.score / maxScore) * 100));
                  const isLeader = index === 0;
                  
                  return (
                    <div 
                      key={p.id || index} 
                      className={`relative flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                        p.isMe 
                          ? 'bg-emerald-500/10 border-emerald-500/30 shadow-sm' 
                          : 'bg-white/[0.03] border-white/[0.05]'
                      }`}
                    >
                      {/* Rank */}
                      <div className="w-4 text-center text-xs font-bold shrink-0">
                        {isLeader ? (
                          <span>🥇</span>
                        ) : index === 1 ? (
                          <span>🥈</span>
                        ) : index === 2 ? (
                          <span>🥉</span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">#{index + 1}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <img 
                        src={p.avatar} 
                        alt={p.name} 
                        className="w-8 h-8 rounded-full border border-white/[0.1] bg-[#1E2638] object-cover shrink-0" 
                      />
                      
                      {/* Name & Progress bar */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] font-medium text-slate-100 flex items-center gap-1 truncate">
                            <span className="truncate">{p.name}</span>
                            {p.isMe && (
                              <span className="text-[8px] bg-emerald-500 text-white px-1 py-0.2 rounded font-bold shrink-0">
                                אתה
                              </span>
                            )}
                          </span>
                          <span className="font-mono text-[11px] font-bold text-slate-200 shrink-0">
                            {p.score} <span className="text-[9px] text-slate-500 font-normal">{unit}</span>
                          </span>
                        </div>
                        
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ease-out ${
                              isLeader 
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                                : p.isMe 
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                                  : 'bg-slate-600'
                            }`}
                            style={{ width: `${pPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {!isCompleted && (
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={handleQuickUpdate}
                  className="mt-1 w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 transition-all duration-200 shadow-md shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>עדכן התקדמות באתגר (+{stepIncrement} {unit})</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
  const [isMysteryRevealed, setIsMysteryRevealed] = useState(false);
  const [mysteryProgress, setMysteryProgress] = useState(0);

  return (
    <div className="flex flex-col h-full w-full bg-[#090D16] font-sans text-[#F4F4F0]" dir="rtl">
      
      {/* ── Premium Header & Floating Pill Navigation ── */}
      <div className="sticky top-0 z-20 bg-[#090D16]/95 backdrop-blur-md border-b border-white/[0.06] pt-6 pb-4 px-5">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-100">
            אתגרים
          </h2>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-normal text-slate-400">{currentUser?.stats?.streakDays || 7} ימים</span>
          </div>
        </div>

        {/* Floating Pill Tab — Premium Gaming Style */}
        <div className="relative flex flex-col items-center mt-1">
          <div className="relative flex items-center w-full rounded-full p-1 bg-[#1E2638] border border-white/5">
            {[
              { id: 'explore',          label: 'אקספלור', icon: Compass },
              { id: 'my_challenges',    label: 'אתגרים',  icon: Trophy },
              { id: 'training_ground',  label: 'אימונים', icon: Dumbbell },
            ].map(({ id, label, icon: Icon }) => {
              const isActive = activeInnerTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveInnerTab(id)}
                  className={`relative flex-1 py-2 flex flex-col items-center justify-center gap-0.5 z-10 transition-all duration-300 rounded-full ${
                    isActive
                      ? 'text-white font-bold shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  style={isActive ? {
                    background: 'linear-gradient(to right, #10b981, #14b8a6)',
                  } : {}}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'scale-110' : 'opacity-70'}`} />
                  <span className={`text-[11px] tracking-wide ${isActive ? 'font-bold' : 'font-normal'}`}>
                    {label}
                  </span>
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
              className="flex flex-col gap-4"
            >
              
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <div className="flex items-center gap-2 min-w-0">
                  <Activity className="w-4.5 h-4.5 text-[#C5B4A5] shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-[#F4F4F0] tracking-wide truncate">האתגרים הפעילים שלי</h3>
                    <p className="text-[11px] text-[#9E9D97] font-light mt-0.5 truncate">עדכן התקדמות בלחיצה מהירה או פתח דירוג.</p>
                  </div>
                </div>
              </div>

              {/* Zeigarnik Near Completion Motivation Banner */}
              <div className="bg-[#131927] border border-emerald-500/30 rounded-xl p-3.5 flex items-center justify-between shadow-lg shadow-emerald-950/20 gap-2 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8.5 h-8.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Sparkles className="w-4 h-4 animate-pulse text-emerald-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1 truncate">
                      קרוב לפריצת דרך! 🔥
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      "30 יום ללא סוכר": 12 מתוך 30 ימים
                    </p>
                  </div>
                </div>
                <div className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shrink-0">
                  40%
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

              {/* Mega Group Challenge: 5AM Club */}
              <MyChallengeCard 
                title="מועדון ה-5 בבוקר"
                subtitle="לקום 20 פעמים החודש לפני 6:00 בבוקר לאימון זריחה"
                category="משמעת ואורח חיים"
                icon={Sparkles}
                daysLeft={9}
                xpReward={750}
                unit="ימים"
                type="group"
                maxScore={20}
                participants={[
                  { id: 1, name: 'אתה', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix', score: 8, isMe: true },
                  { id: 2, name: 'מיכאל ברק', avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=Micha', score: 15, isMe: false },
                  { id: 3, name: 'שירן פרי', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Shiran', score: 14, isMe: false },
                  { id: 4, name: 'אביב גל', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Aviv', score: 10, isMe: false },
                  { id: 5, name: 'גיא נווה', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Guy', score: 7, isMe: false },
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
                <Users className="w-5 h-5 text-[#C5B4A5]" />
                <div>
                  <h3 className="text-lg font-medium text-[#F4F4F0] tracking-wide">זירת התחרויות</h3>
                  <p className="text-xs text-[#9E9D97] font-light mt-0.5">תראה מה אחרים עושים, ותזמין את החברים שלך לאותו אתגר.</p>
                </div>
              </div>

              <MatchupFeedCard 
                title="הראשון ל-50 ק&quot;מ"
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

              <MatchupFeedCard 
                title="שבוע ללא סוכר"
                subtitle="מי נשבר ראשון"
                challenger={{ name: 'יואב', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Yoav' }}
                opponent={{ name: 'נדב', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Nadav' }}
                challengeScore={5}
                opponentScore={4}
                maxScore={7}
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
              className="flex flex-col gap-10"
            >
              {/* Interactive Radar/Map Hero CTA — LIVE GPS Banner */}
              <section className="mb-2">
                <button 
                  onClick={() => setChallengesViewMode('map')}
                  className="w-full bg-[#131927]/80 backdrop-blur-xl border border-teal-500/20 hover:border-teal-500/40 rounded-2xl p-4 flex items-center justify-between transition-all duration-300 group overflow-hidden relative shadow-lg shadow-black/40 active:scale-[0.99]"
                >
                  {/* Left: Arrow */}
                  <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-white/[0.08] transition-all">
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </div>

                  {/* Center: Text */}
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-sm font-bold text-teal-300 tracking-tight">מפת האתגרים</h3>
                    <p className="text-xs text-slate-400 mt-0.5">אתגרים ומסלולים בלעדיים בסביבה שלך.</p>
                  </div>

                  {/* Right: Map icon + LIVE badge */}
                  <div className="flex items-center gap-2 z-10">
                    {/* Pulsing LIVE GPS badge */}
                    <span className="animate-pulse bg-red-500/20 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-500/30">
                      LIVE GPS
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-teal-500/10 p-3 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-all">
                      <MapIcon className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              </section>

              {/* 1. HERO: Daily Mystery Challenge — Gaming Dark Card */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">DAILY SPECIAL MISSION</h3>
                  </div>
                  <span className="text-[11px] text-slate-500">מתאפסת בחצות</span>
                </div>
                
                <div className="bg-gradient-to-br from-[#1A1F30] to-[#111523] rounded-2xl border border-purple-500/30 p-5 relative overflow-hidden shadow-xl shadow-black/50 shadow-[0_0_20px_rgba(168,85,247,0.08)] transition-all">
                  {/* Purple ambient glow */}
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-600/[0.08] rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex-1 ml-4 flex gap-3.5 items-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                        mysteryProgress >= 100 
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' 
                          : 'bg-purple-900/30 text-purple-400 border-purple-500/20'
                      }`}>
                        {mysteryProgress >= 100 ? <CheckCircle className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-100 text-[17px] tracking-tight">אתגר ההפתעה היומי</h4>
                          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono text-[10px] px-2 py-0.5 rounded-md">DAILY</span>
                        </div>
                        <p className="text-xs text-slate-400 font-normal mt-1 leading-relaxed">מבחן יומי שמשתנה כל יום. גריינד מול עצמך.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-purple-900/30 text-purple-300 px-3 py-1.5 rounded-xl border border-purple-500/30 shadow-inner shrink-0">
                      <Zap className="w-3.5 h-3.5 fill-purple-400/40" />
                      <span className="text-xs font-bold tracking-wide">100 XP</span>
                    </div>
                  </div>

                  {!isMysteryRevealed ? (
                    <button 
                      onClick={() => setIsMysteryRevealed(true)}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-lg shadow-purple-600/30 border border-purple-400/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer relative z-10"
                    >
                      <Lock className="w-4 h-4 transition-transform group-hover:rotate-12" />
                      <span>לחץ לחשיפת משימת היום המסתורית</span>
                    </button>
                  ) : (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col gap-3 relative z-10 mt-1">
                      <div className="bg-[#0D1020] rounded-xl p-3.5 border border-purple-500/15 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-slate-100 text-sm mb-0.5">100 שכיבות סמיכה</h5>
                          <span className="text-[11px] text-slate-500">ניתן לפצל במהלך היום, העיקר לסיים עד חצות.</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-purple-300">{mysteryProgress}/100</span>
                      </div>
                      
                      <div>
                        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/[0.05] mb-3">
                          <div 
                            className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-purple-600 to-indigo-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                            style={{ width: `${mysteryProgress}%` }} 
                          />
                        </div>

                        {!Boolean(mysteryProgress >= 100) ? (
                          <button 
                            onClick={() => setMysteryProgress(p => Math.min(p + 25, 100))}
                            className="w-full py-2.5 rounded-xl text-xs font-bold transition-all bg-purple-600 text-white hover:bg-purple-500 active:scale-[0.98] shadow-md shadow-purple-600/25"
                          >
                            עדכן ביצוע (+25)
                          </button>
                        ) : (
                          <div className="w-full py-2.5 rounded-xl text-xs font-medium bg-purple-900/30 text-purple-300 text-center border border-purple-500/30 flex items-center justify-center gap-2">
                            <Trophy className="w-4 h-4" />
                            המשימה הושלמה! +100 XP
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </section>

              {/* 2. Weekly Routine Goals — 2-Column Grid with Glowing Progress Bars */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-slate-100 tracking-wide">יעדי שגרה שבועיים</h3>
                  </div>
                  <span className="text-[11px] text-slate-500">2 יעדים פעילים</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Card A: Strength Training */}
                  <div className="bg-[#131927]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4 flex flex-col justify-between shadow-lg shadow-black/40 hover:border-emerald-500/20 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <Dumbbell className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          +300 XP
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 leading-snug">אימון כוח שבועי</h4>
                      <p className="text-[11px] text-slate-400 font-normal mt-1 leading-relaxed">2 אימונים השבוע</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.05]">
                      <div className="flex justify-between items-center text-[10px] mb-1.5">
                        <span className="text-slate-400">התקדמות</span>
                        <span className="font-bold text-slate-200">1 / 2</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '50%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Card B: Sleep Routine */}
                  <div className="bg-[#131927]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4 flex flex-col justify-between shadow-lg shadow-black/40 hover:border-blue-500/20 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                          <Moon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                          +250 XP
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 leading-snug">שגרת שינה טובה</h4>
                      <p className="text-[11px] text-slate-400 font-normal mt-1 leading-relaxed">7.5 שעות בלילה</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.05]">
                      <div className="flex justify-between items-center text-[10px] mb-1.5">
                        <span className="text-slate-400">התקדמות</span>
                        <span className="font-bold text-slate-200">3 / 5</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: '60%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. GRAND BANNER: Master Monthly Challenge — Epic Quest */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Medal className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
                    <h3 className="text-sm font-bold text-slate-100 tracking-wide">מטרת החודש המרכזית</h3>
                  </div>
                  <span className="text-[11px] font-bold text-amber-400">פרס גדול</span>
                </div>

                <div className="bg-gradient-to-br from-[#1C1A27] via-[#151928] to-[#0F131F] rounded-2xl border border-amber-500/40 p-5 relative overflow-hidden shadow-2xl shadow-amber-500/10">
                  {/* Amber ambient glow */}
                  <div className="absolute top-0 left-0 w-44 h-44 bg-amber-500/[0.07] rounded-full blur-2xl pointer-events-none" />

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      {/* Prestige Badge */}
                      <div className="bg-amber-500/20 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5 w-fit mb-2">
                        <Trophy className="w-3 h-3" />
                        MONTHLY MASTER CHALLENGE
                      </div>
                      <h4 className="text-lg font-extrabold text-slate-100 tracking-tight">100 ק&quot;מ ריצה בחודש</h4>
                      <p className="text-xs text-slate-400 font-normal mt-1 leading-relaxed max-w-[220px]">
                        האתגר האולטימטיבי לחודש זה. כל קילומטר נחשב בדירוג הכללי!
                      </p>
                    </div>

                    {/* 1000XP Trophy */}
                    <div className="w-14 h-14 rounded-2xl bg-[#0F131F] border border-amber-500/30 flex flex-col items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
                      <Trophy className="w-6 h-6 text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                      <span className="text-[10px] font-extrabold text-amber-400 font-mono mt-0.5 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">1000 XP</span>
                    </div>
                  </div>

                  <div className="relative z-10 pt-2">
                    {/* Progress header */}
                    <div className="flex justify-between text-xs mb-2">
                      <span className="font-mono tracking-wider text-amber-400 font-bold">42%</span>
                      <span className="text-slate-400">הושלמו 42 מתוך 100 ק&quot;מ</span>
                    </div>

                    {/* Master Progress Bar with Shimmer */}
                    <div className="w-full bg-slate-900 rounded-full h-3.5 p-0.5 border border-white/5 mb-4 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 shadow-[0_0_12px_rgba(245,158,11,0.6)] relative overflow-hidden"
                        style={{ width: '42%' }}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                      </div>
                    </div>

                    {/* Primary CTA Button — Rich Amber Gradient */}
                    <button className="w-full mt-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/25 border border-amber-300/40 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.98] active:translate-y-0.5 hover:shadow-amber-500/40 hover:-translate-y-0.5">
                      <Zap className="w-4 h-4" />
                      <span>עדכן ריצה אחרונה למאסטר</span>
                    </button>
                  </div>
                </div>
              </section>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
