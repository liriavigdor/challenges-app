import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Swords, Dumbbell, Map as MapIconComponent, Gift, Flame, Target } from 'lucide-react';
import AvatarPodium from '../../AvatarPodium';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
// import { MapIcon, TargetIcon } from '../../icons';

// Keeping the old animation as an option per user request
const launchXpOrbs = (sourceEl, xpAmount, onComplete) => {
  const targetTrack = document.getElementById('challenges-xp-track');
  const targetFill = document.getElementById('challenges-xp-fill');
  if (!targetTrack || !sourceEl) {
    onComplete?.();
    return;
  }
  const sourceRect = sourceEl.getBoundingClientRect();
  const targetRect = targetTrack.getBoundingClientRect();
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;
  
  const pop = document.createElement('div');
  pop.className = 'xp-score-pop';
  pop.textContent = `+${xpAmount} XP`;
  pop.style.left = (sourceRect.left + sourceRect.width / 2 - 28) + 'px';
  pop.style.top = (sourceRect.top + sourceRect.height / 2 - 12) + 'px';
  document.body.appendChild(pop);
  pop.addEventListener('animationend', () => pop.remove());
  
  const orbCount = Math.min(3 + Math.ceil(xpAmount / 20), 7);
  let arrivedCount = 0;
  
  for (let i = 0; i < orbCount; i++) {
    setTimeout(() => {
      const orb = document.createElement('div');
      orb.className = 'xp-orb-fly';
      orb.textContent = '⚡';
      const jitterX = (Math.random() - 0.5) * 32;
      const jitterY = (Math.random() - 0.5) * 20;
      const startX = sourceRect.left + sourceRect.width / 2 + jitterX;
      const startY = sourceRect.top + sourceRect.height / 2 + jitterY;
      orb.style.cssText = [
        `left:${startX - 13}px`,
        `top:${startY - 13}px`,
        'transform:scale(0.5)',
        'opacity:1',
        'transition:none',
      ].join(';');
      document.body.appendChild(orb);
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          orb.style.transition = 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1)';
          orb.style.transform = 'scale(1.2)';
          setTimeout(() => {
            const dx = targetX - startX;
            const dy = targetY - startY;
            const delay = i * 55;
            orb.style.transition = [
              `transform 0.55s cubic-bezier(0.55,0,0.45,1) ${delay}ms`,
              `opacity   0.15s ease ${0.5 + delay / 1000}s`,
            ].join(',');
            orb.style.transform = `translate(${dx}px,${dy}px) scale(0.25)`;
            orb.style.opacity = '0';
            setTimeout(() => {
              orb.remove();
              arrivedCount++;
              if (arrivedCount === orbCount) {
                targetTrack.classList.add('xp-received');
                setTimeout(() => targetTrack.classList.remove('xp-received'), 700);
                if (targetFill) {
                  targetFill.classList.add('xp-fill-bump');
                  setTimeout(() => targetFill.classList.remove('xp-fill-bump'), 500);
                }
                onComplete?.();
              }
            }, 700 + delay);
          }, 200);
        });
      });
    }, i * 60);
  }
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
  const [showModernXp, setShowModernXp] = useState(false);

  const handleMysteryBox = (e) => {
    // Retained the old orb animation
    launchXpOrbs(e.currentTarget, 50, () => {});
    
    // Modern Framer-motion alternative trigger (can replace later)
    setShowModernXp(true);
    setTimeout(() => setShowModernXp(false), 2000);
  };

  // When map is active, we render nothing here and let App.jsx render MapRender,
  // OR we could have a placeholder. Since App.jsx originally handles map when viewMode === 'map',
  // we just return null or a back button if we want to handle it here.
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col h-full w-full overflow-hidden bg-slate-900 cr-font"
    >
      {/* Background pattern similar to CR Arena with slow pulse */}
      <motion.div 
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" 
      />

      {/* Floating Particles */}
      <div className="cr-particles">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="cr-particle" 
            style={{ 
              left: `${Math.random() * 100}%`, 
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 3}s`
            }} 
          />
        ))}
      </div>

      {/* TOP HEADER (Resources Style) */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        className="relative z-10 flex items-center justify-between p-4 pt-6 w-full pointer-events-none"
      >
        {/* Left: Player Level / Rank & XP */}
        <div className="cr-top-bar-item pointer-events-auto flex items-center h-10 w-48 p-0 pr-3 relative">
          <div className="cr-top-bar-icon-wrapper absolute -left-2 z-10 w-12 h-12">
            <span className="text-xl font-black cr-text-stroke">
              {currentRank?.name?.charAt(0) || '1'}
            </span>
          </div>
          {/* XP Bar Background */}
          <div className="ml-8 w-full h-5 bg-gray-900 rounded-full border border-gray-700 p-0.5 overflow-hidden">
            {/* XP Bar Fill */}
            <div 
              className="cr-xp-bar-inner h-full rounded-full" 
              style={{ width: `${Math.max(10, progressPercentage || 0)}%` }}
            ></div>
          </div>
          {/* XP Text overlay */}
          <div className="absolute inset-0 flex items-center justify-center ml-8 z-10 pointer-events-none">
            <span className="text-[10px] font-black cr-text-stroke-sm text-white drop-shadow-md">
              {currentUser?.xp?.toLocaleString()} / {nextRank ? nextRank.xpRequired.toLocaleString() : '—'}
            </span>
          </div>
        </div>

        {/* Right: Resources (Day Streak) */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="cr-top-bar-item pointer-events-auto bg-green-900/40 border-green-800"
        >
          <div className="flex flex-col items-end mr-2">
            <span className="text-sm font-black cr-text-stroke leading-tight text-green-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              {currentUser?.stats?.streakDays || 12}
            </span>
            <span className="text-[10px] leading-tight text-gray-300 font-bold uppercase tracking-wider">Streak</span>
          </div>
          <div className="cr-top-bar-icon-wrapper bg-gradient-to-b from-green-400 to-green-600 border-green-800 shadow-green-900">
            <Flame className="w-5 h-5 text-white" />
          </div>
        </motion.div>
      </motion.div>

      {/* THE ARENA (Center Focus) */}
      <div className="relative flex-1 flex items-center justify-center w-full z-0">
        {/* Spotlight Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
          className="relative z-10 w-full h-[60vh] max-h-[500px] flex items-center justify-center pointer-events-none"
        >
          <AvatarPodium avatarConfig={currentUser?.avatarConfig} userXp={currentUser?.xp} />
        </motion.div>
      </div>

      {/* FLOATING SIDE BUTTONS (Events, Shop, etc. style) */}
      
      {/* Top Left: Map */}
      <motion.button
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
        className="cr-btn-side cr-btn-side-left cr-btn-purple"
        style={{ top: '15%' }}
        onClick={() => setChallengesViewMode('map')}
      >
        <MapIconComponent className="w-7 h-7 mb-1 filter drop-shadow-md" />
        <span className="text-[9px] font-bold cr-text-stroke-sm uppercase">מפה</span>
      </motion.button>

      {/* Middle Left: Mystery Box */}
      <motion.button
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.4 }}
        className="cr-btn-side cr-btn-side-left cr-btn-green"
        style={{ top: '35%' }}
        onClick={handleMysteryBox}
      >
        <Gift className="w-7 h-7 mb-1 filter drop-shadow-md" />
        <span className="text-[9px] font-bold cr-text-stroke-sm uppercase">הפתעה</span>
      </motion.button>

      {/* Top Right: AI Missions */}
      <motion.button
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
        className="cr-btn-side cr-btn-side-right"
        style={{ top: '15%' }}
        onClick={() => setIsMachineMissionsOpen(true)}
      >
        <Bot className="w-7 h-7 mb-1 filter drop-shadow-md" />
        <span className="text-[9px] font-bold cr-text-stroke-sm uppercase">משימות</span>
      </motion.button>

      {/* Middle Right: Training */}
      <motion.button
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.4 }}
        className="cr-btn-side cr-btn-side-right"
        style={{ top: '35%' }}
        onClick={() => setIsHomeModeModalOpen(true)}
      >
        <Dumbbell className="w-7 h-7 mb-1 filter drop-shadow-md" />
        <span className="text-[9px] font-bold cr-text-stroke-sm uppercase">אימון</span>
      </motion.button>


      {/* MAIN BATTLE BUTTON (Bottom Center) */}
      <motion.div 
        initial={{ y: 150, scale: 0.8 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: 'spring', bounce: 0.6, delay: 0.5 }}
        className="absolute bottom-10 left-0 right-0 flex justify-center z-20 pointer-events-none"
      >
        <div className="relative pointer-events-auto">
          {/* Continuous pulse glow behind the button */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-4 bg-yellow-500 rounded-full blur-xl z-[-1]"
          />
          <button 
            className="cr-btn-battle group overflow-hidden"
            onClick={() => setIsRadarOpen(true)}
          >
            {/* Subtle shine animation on the button via CSS class defined in index.css */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent cr-shine-anim" />
            
            <span className="text-3xl font-black cr-text-stroke tracking-wider mb-1 z-10 relative">BATTLE</span>
            <div className="flex items-center gap-1 z-10 relative">
              <Swords className="w-4 h-4 text-white filter drop-shadow-sm" />
              <span className="text-xs font-bold cr-text-stroke-sm">התחל קרב</span>
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
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white font-black text-2xl px-6 py-2 rounded-full shadow-2xl z-50 pointer-events-none border-4 border-amber-300 cr-text-stroke"
          >
            +50 XP
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
