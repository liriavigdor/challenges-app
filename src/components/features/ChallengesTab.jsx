import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Dumbbell, Map as MapIconComponent, Gift, Flame, Target, Users, Bell, Menu } from 'lucide-react';
import AvatarPodium from '../../AvatarPodium';
import { Button } from '@/components/ui/button';

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
  const [showModernXp, setShowModernXp] = useState(false);

  const handleMysteryBox = (e) => {
    setShowModernXp(true);
    setTimeout(() => setShowModernXp(false), 2000);
  };

  if (challengesViewMode === 'map') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full gap-4 p-4 z-50 pointer-events-none"
      >
        <div className="flex items-center justify-between pointer-events-auto">
          <Button 
            variant="outline" 
            className="rounded-full bg-background/50 backdrop-blur"
            onClick={() => setChallengesViewMode('challenges')}
          >
            &larr; חזרה לזירה
          </Button>
          <h2 className="text-xl font-bold tracking-tight text-foreground bg-background/50 backdrop-blur px-3 py-1 rounded-full">מפת האתגרים</h2>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative flex flex-col h-full w-full overflow-hidden bg-slate-950 cr-font cr-spring-modal"
      dir="ltr"
    >
      {/* Background pattern */}
      <motion.div 
        animate={{ opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" 
      />

      {/* ZONE 1: THE DENSE HEADER (Zero Dead Space) */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        className="relative z-20 flex flex-col pt-8 pb-4 w-full pointer-events-none cr-top-header"
      >
        <div className="flex justify-between items-start w-full px-2 pointer-events-auto">
          
          {/* Left Column: Player Banner & Fused XP */}
          <div className="flex flex-col gap-1 w-[45%]">
            
            {/* Player Banner */}
            <div 
              className="bg-slate-800 border-2 border-slate-600 rounded-lg p-1 shadow-lg flex items-center relative overflow-hidden h-14 cursor-pointer hover:border-slate-400 transition-colors"
              onClick={() => {}}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-slate-900 z-0"></div>
              <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix" className="w-12 h-12 z-10 bg-slate-700 rounded-md border border-slate-500" />
              <div className="flex flex-col z-10 ml-2">
                <span className="text-white font-black text-xs cr-text-stroke-sm uppercase leading-tight">{currentUser?.username || 'ATHLETE'}</span>
                <div className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-green-400 filter drop-shadow-[0_0_4px_#4ade80]" />
                  <span className="text-[10px] font-black cr-text-stroke leading-tight text-white">{currentUser?.stats?.streakDays || 12}</span>
                </div>
              </div>
            </div>
            
            {/* Fused Level Shield + XP Bar */}
            <div className="flex items-center -mt-2 z-20">
              <div className="cr-level-shield transform scale-90 origin-left z-20">
                <span className="text-white font-black text-lg drop-shadow-md">{currentRank?.name?.charAt(0) || '1'}</span>
              </div>
              <div className="cr-xp-container -ml-4 flex-1 h-5 transform scale-[0.85] origin-left border-l-0 rounded-l-none z-10 bg-slate-900 border-slate-600">
                <div className="cr-segmented-bar h-2.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`cr-segment ${(progressPercentage || 0) > (i * 20) ? 'filled' : ''}`}></div>
                  ))}
                </div>
                <span className="absolute right-2 text-[8px] font-bold text-white drop-shadow-md">
                  {currentUser?.xp?.toLocaleString()} / {nextRank ? nextRank.xpRequired.toLocaleString() : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Menus, Currencies, Pass */}
          <div className="flex flex-col gap-1.5 items-end w-[50%]">
            
            {/* Top Menu Icons */}
            <div className="flex gap-1.5">
              <div className="cr-menu-btn"><Users className="w-4 h-4 text-white" /></div>
              <div className="cr-menu-btn relative">
                <Bell className="w-4 h-4 text-white" />
                <div className="absolute -top-1 -right-1 bg-red-500 text-[8px] font-bold text-white rounded-full w-3.5 h-3.5 flex items-center justify-center border border-slate-900 shadow-md">1</div>
              </div>
              <div className="cr-menu-btn"><Menu className="w-4 h-4 text-white" /></div>
            </div>

            {/* Currencies (Stacked Tightly) */}
            <div className="flex flex-col gap-1 w-full items-end mt-1">
              <div className="cr-currency-pill transform scale-90 origin-right w-full max-w-[130px]">
                <div className="cr-coin-3d z-10"></div>
                <span className="text-white font-black text-xs ml-1 mr-1 flex-1 text-center drop-shadow-md">12.4K</span>
                <div className="cr-plus-btn" onClick={handleMysteryBox}>+</div>
              </div>
              
              <div className="cr-currency-pill transform scale-90 origin-right w-full max-w-[130px]">
                <div className="cr-gem-3d z-10"></div>
                <span className="text-white font-black text-xs ml-1 mr-1 flex-1 text-center drop-shadow-md">250</span>
                <div className="cr-plus-btn" onClick={handleMysteryBox}>+</div>
              </div>
            </div>

            {/* Pro Pass Badge */}
            <div className="cr-pass-banner mt-0.5 transform scale-90 origin-right cursor-pointer">
              <span className="text-[7px] text-yellow-900 font-bold uppercase mb-0.5 tracking-widest">Pro Pass</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-yellow-600 rounded-sm border border-yellow-800 flex items-center justify-center shadow-inner">
                  <span className="text-[9px] text-white font-black">48</span>
                </div>
                <span className="text-[10px] font-black text-white cr-text-stroke-sm">10/15</span>
              </div>
            </div>

          </div>

        </div>
      </motion.div>

      {/* ZONE 2: CENTRAL ARENA (Orbit Layout) */}
      <div className="relative flex-1 flex items-center justify-center w-full z-0 mt-[-20px]">
        {/* Spotlight Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
        
        {/* Avatar */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
          className="relative z-10 w-full flex items-center justify-center pointer-events-none"
        >
          <div className="transform scale-90">
            <AvatarPodium avatarConfig={currentUser?.avatarConfig} userXp={currentUser?.xp} />
          </div>
        </motion.div>

        {/* Orbiting Side Buttons (Tight Frame) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-between w-[340px] pointer-events-none z-20">
          {/* Left Orbit */}
          <div className="flex flex-col gap-6 pointer-events-auto">
            <motion.div
              initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', delay: 0.3 }}
              className="cr-btn-circle-master"
              onClick={() => setChallengesViewMode('map')}
            >
              <div className="cr-flare"></div>
              <MapIconComponent className="w-6 h-6 filter drop-shadow-md z-10 relative text-white" />
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', delay: 0.4 }}
              className="cr-btn-circle-master"
              onClick={handleMysteryBox}
            >
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#0F172A] z-20 shadow-md">!</div>
              <div className="cr-flare"></div>
              <Gift className="w-6 h-6 filter drop-shadow-md z-10 relative text-white" />
            </motion.div>
          </div>

          {/* Right Orbit */}
          <div className="flex flex-col gap-6 pointer-events-auto">
            <motion.div
              initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', delay: 0.3 }}
              className="cr-btn-circle-master"
              onClick={() => setIsMachineMissionsOpen(true)}
            >
              <div className="absolute -top-1 -right-1 bg-[#FFC700] text-black text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#0F172A] z-20 shadow-md">3</div>
              <div className="cr-flare"></div>
              <Target className="w-6 h-6 filter drop-shadow-md z-10 relative text-white" />
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', delay: 0.4 }}
              className="cr-btn-circle-master"
              onClick={() => setIsHomeModeModalOpen(true)}
            >
              <div className="cr-flare"></div>
              <Dumbbell className="w-6 h-6 filter drop-shadow-md z-10 relative text-white" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ZONE 3: CONTROL DECK (Bottom Panel) */}
      <motion.div 
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.4, delay: 0.5 }}
        className="relative z-20 flex flex-col items-center gap-5 pt-8 pb-8 px-4 w-full bg-slate-900/80 backdrop-blur-xl rounded-t-[40px] border-t border-slate-700/50 shadow-[0_-15px_30px_rgba(0,0,0,0.6)]"
      >
        {/* Athletic Daily Challenge Rings */}
        <div className="flex justify-center gap-6 w-full">
          
          {/* Active / Completed Goal */}
          <div className="cr-daily-badge active">
            <div className="cr-flare"></div>
            <div className="cr-daily-progress-ring"></div>
            <Flame className="w-7 h-7 text-white filter drop-shadow-md z-10" />
            <span className="cr-daily-badge-label text-[#34D399]">CARDIO</span>
          </div>

          {/* Incomplete Goal 1 */}
          <div className="cr-daily-badge">
            <Dumbbell className="w-7 h-7 text-slate-500 filter drop-shadow-md z-10" />
            <span className="cr-daily-badge-label text-slate-300">STRENGTH</span>
          </div>

          {/* Incomplete Goal 2 */}
          <div className="cr-daily-badge">
            <Target className="w-7 h-7 text-slate-500 filter drop-shadow-md z-10" />
            <span className="cr-daily-badge-label text-slate-300">NUTRITION</span>
          </div>
          
        </div>

        {/* Main Battle CTA Button */}
        <div className="relative pointer-events-auto mt-2 w-full px-4">
          <button 
            className="cr-btn-master cr-btn-battle-master group w-full"
            onClick={() => setIsRadarOpen(true)}
          >
            <div className="cr-flare"></div>
            <span className="cr-text-master text-4xl mb-1">BATTLE</span>
            <div className="flex items-center gap-2 z-10 relative">
              <Swords className="w-5 h-5 text-white filter drop-shadow-md" />
              <span className="text-[10px] font-bold cr-text-stroke-sm tracking-widest uppercase text-white">Let's Go!</span>
            </div>
          </button>
        </div>
      </motion.div>

      {/* MODERN XP TOAST */}
      <AnimatePresence>
        {showModernXp && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF8C00] text-white font-black text-3xl px-8 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 pointer-events-none border-4 border-[#FFC700] cr-text-stroke"
          >
            +50 XP
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
