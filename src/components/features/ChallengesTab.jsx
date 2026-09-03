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
      className="relative flex flex-col h-full w-full overflow-hidden bg-background"
    >
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* TOP HEADER */}
      <div className="relative z-10 flex flex-col gap-4 p-6 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-foreground">Challenges</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="rounded-full px-3 font-semibold text-primary/80 bg-primary/10 border-primary/20">
                <Flame className="w-4 h-4 mr-1 text-orange-500 fill-orange-500" />
                Day Streak 12
              </Badge>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <Card className="p-4 rounded-2xl border-border bg-card/60 backdrop-blur-md shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold flex items-center gap-2">
              <span className="text-xl">🎖</span> {currentRank?.name || 'Rank'}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {currentUser?.xp?.toLocaleString()} / {nextRank ? nextRank.xpRequired.toLocaleString() : '—'} XP
            </span>
          </div>
          <div id="challenges-xp-track" className="relative w-full h-3 rounded-full overflow-hidden bg-secondary">
            <Progress 
              id="challenges-xp-fill"
              value={progressPercentage || 0} 
              className="h-full bg-primary"
            />
          </div>
        </Card>
      </div>

      {/* AVATAR ARENA */}
      <div className="relative flex-1 flex flex-col items-center justify-center w-full min-h-[40vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-0 pointer-events-none" />
        
        {/* Podium Area */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="relative z-10 w-full h-full max-h-[300px] flex items-center justify-center pointer-events-none"
        >
          <AvatarPodium avatarConfig={currentUser?.avatarConfig} userXp={currentUser?.xp} />
        </motion.div>

        {/* BOTTOM ACTION BAR */}
        <div className="absolute bottom-6 left-0 right-0 px-6 z-20 flex items-end justify-center gap-4">
          
          {/* AI Missions */}
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              className="flex flex-col h-16 w-20 rounded-2xl border-border bg-card/80 backdrop-blur gap-1 shadow-sm hover:border-primary/50 hover:bg-primary/5"
              onClick={() => setIsMachineMissionsOpen(true)}
            >
              <Bot className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold text-foreground">משימות</span>
            </Button>
          </motion.div>

          {/* BATTLE BUTTON (Primary) */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative group">
            {/* Pulse effect */}
            <div className="absolute inset-0 rounded-3xl bg-primary/30 animate-ping group-hover:bg-primary/50" style={{ animationDuration: '2s' }} />
            
            <Button 
              size="lg"
              className="relative flex flex-col h-20 w-24 rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 gap-1 border border-primary-foreground/10 overflow-hidden"
              onClick={() => setIsRadarOpen(true)}
            >
              <Swords className="w-7 h-7 mb-1" />
              <span className="text-sm font-black tracking-widest z-10">BATTLE</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </Button>
          </motion.div>

          {/* TRAINING */}
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              className="flex flex-col h-16 w-20 rounded-2xl border-border bg-card/80 backdrop-blur gap-1 shadow-sm hover:border-primary/50 hover:bg-primary/5"
              onClick={() => setIsHomeModeModalOpen(true)}
            >
              <Dumbbell className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold text-foreground">אימון</span>
            </Button>
          </motion.div>

          {/* MYSTERY BOX */}
          <motion.button 
            whileHover={{ y: -5, rotate: [0, -10, 10, -10, 10, 0] }} 
            whileTap={{ scale: 0.9 }}
            className="absolute -top-12 right-12 w-12 h-12 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-xl shadow-lg flex items-center justify-center border-2 border-amber-200 cursor-pointer"
            onClick={handleMysteryBox}
          >
            <Gift className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Map FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-8 left-6 w-12 h-12 rounded-full bg-card/80 backdrop-blur border border-border shadow-md flex items-center justify-center text-foreground z-20 hover:text-primary hover:border-primary/50 transition-colors"
        onClick={() => setChallengesViewMode('map')}
      >
        <MapIconComponent className="w-5 h-5" />
      </motion.button>

      {/* MODERN XP TOAST */}
      <AnimatePresence>
        {showModernXp && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white font-black text-2xl px-6 py-2 rounded-full shadow-2xl z-50 pointer-events-none border-4 border-amber-300"
          >
            +50 XP
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
