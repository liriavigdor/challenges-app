const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/features/ChallengesTab.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Replace MatchupFeedCard
const matchupRegex = /const MatchupFeedCard = \(\{ challenger[\s\S]*?\}\);\n\};/m;
const newMatchupFeedCard = `const MatchupFeedCard = ({ challenger, opponent, title, subtitle, challengeScore, opponentScore, maxScore }) => {
  const [hasJoined, setHasJoined] = useState(false);
  const challengerPercent = Math.min(100, (challengeScore / maxScore) * 100);
  const opponentPercent = Math.min(100, (opponentScore / maxScore) * 100);

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-[#131927]/60 backdrop-blur-xl rounded-2xl p-5 relative overflow-hidden group/card"
      style={{ 
        border: '1px solid rgba(255, 255, 255, 0.08)', 
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Subtle depth glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#00F2FE]/[0.05] rounded-full blur-3xl pointer-events-none" />
      
      {/* Matchup Header */}
      <div className="text-center mb-6 relative z-10">
        <h4 className="text-white font-extrabold tracking-tight text-lg leading-tight">{title}</h4>
        <p className="text-[#9CA3AF] text-xs font-normal mt-1">{subtitle}</p>
      </div>

      {/* Avatars & Versus */}
      <div className="flex items-center justify-between mb-8 relative z-10 px-2">
        {/* Challenger */}
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="relative">
             <img src={challenger.avatar} alt={challenger.name} className="w-14 h-14 rounded-full border-[3px] border-[#00F2FE] bg-[#1E2638] object-cover shadow-[0_0_15px_rgba(0,242,254,0.3)]" />
             <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#131927] rounded-full"></div>
          </div>
          <span className="text-xs font-bold text-white tracking-wide truncate">{challenger.name}</span>
        </div>
        
        {/* VS Badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+12px)] z-20">
          <div className="bg-gradient-to-br from-[#00F2FE] to-[#4FACFE] p-[1px] rounded-xl shadow-[0_0_20px_rgba(0,242,254,0.4)]">
            <div className="bg-[#090D16] px-4 py-1.5 rounded-xl flex items-center gap-1.5">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FE] to-[#4FACFE] font-black text-sm italic tracking-widest">VS</span>
            </div>
          </div>
        </div>

        {/* Opponent */}
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="relative">
             <img src={opponent.avatar} alt={opponent.name} className="w-14 h-14 rounded-full border-[3px] border-white/20 bg-[#1E2638] object-cover shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
             <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-slate-500 border-2 border-[#131927] rounded-full"></div>
          </div>
          <span className="text-xs font-bold text-white tracking-wide truncate">{opponent.name}</span>
        </div>
      </div>

      {/* Score / Progress Comparison */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-3">
          <div className="bg-[#00F2FE]/10 px-3 py-1 rounded-lg border border-[#00F2FE]/20 flex items-center gap-1.5 shadow-inner">
            <span className="font-mono text-[#00F2FE] font-black text-sm">{challengeScore}</span>
          </div>
          <span className="text-[#9CA3AF] text-[11px] font-medium tracking-wider uppercase">מתוך {maxScore}</span>
          <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 shadow-inner">
            <span className="font-mono text-slate-300 font-black text-sm">{opponentScore}</span>
          </div>
        </div>
        
        {/* Dual Progress Bar */}
        <div className="relative w-full h-3.5 bg-[#090D16] rounded-full overflow-hidden mb-6 border border-white/5 shadow-inner p-[2px]">
           <div className="absolute top-[2px] right-[2px] h-[calc(100%-4px)] bg-gradient-to-l from-[#00F2FE] to-[#4FACFE] rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(0,242,254,0.6)] animate-pulse" style={{ width: \`\${challengerPercent}%\` }} />
           <div className="absolute top-[2px] left-[2px] h-[calc(100%-4px)] bg-slate-600 rounded-full transition-all duration-1000 ease-out" style={{ width: \`\${opponentPercent}%\` }} />
        </div>

        {/* Call to Action */}
        <motion.button 
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setHasJoined(!hasJoined)}
          className={\`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-lg \${
            hasJoined 
              ? 'bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40' 
              : 'bg-gradient-to-r from-[#00F2FE] to-[#4FACFE] text-[#090D16] hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] border border-transparent'
          }\`}
          style={{ transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }}
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
        </motion.button>
      </div>
    </motion.div>
  );
};`;
content = content.replace(matchupRegex, newMatchupFeedCard);

// 2. Replace MyChallengeCard
const myChallengeRegex = /const MyChallengeCard = \(\{[\s\S]*?\}\);\n\};/m;
const newMyChallengeCard = `const MyChallengeCard = ({ 
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
    <motion.div 
      layout
      className="bg-[#131927]/60 backdrop-blur-xl rounded-2xl relative overflow-hidden group w-full flex flex-col"
      style={{ 
        border: '1px solid rgba(255, 255, 255, 0.08)', 
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Ambient depth glow */}
      <div className="absolute top-0 right-0 w-48 h-32 bg-[#00F2FE]/[0.03] rounded-full blur-3xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
      
      {/* Main Interactive Card Body */}
      <div className="w-full py-5 px-4 sm:px-5 box-border flex flex-col gap-4">
        
        {/* Top Meta Row - Fixed padding-inline and flex layout */}
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
            <span className="text-[10px] font-bold text-[#00F2FE] bg-[#00F2FE]/10 px-2.5 py-1 rounded-md border border-[#00F2FE]/20 truncate shrink-0">
              {category}
            </span>
            <span className="text-[10px] font-medium text-[#9CA3AF] flex items-center gap-1 shrink-0 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
              <Clock className="w-3 h-3" />
              {daysLeft}d left
            </span>
            {isNearCompletion && (
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-md border border-amber-500/30 flex items-center gap-1 animate-pulse shrink-0">
                <Sparkles className="w-3 h-3 text-amber-300" />
                קרוב לסיום!
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20 shrink-0 shadow-inner">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-mono font-extrabold tracking-wide">+\${xpReward} XP</span>
          </div>
        </div>

        {/* Title & Subtitle + Type Icon */}
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="flex-1 min-w-0">
            <h4 className="font-extrabold tracking-tight text-white text-[17px] leading-tight flex items-center gap-2 truncate">
              <span className="truncate">{title}</span>
              {isCompleted && <CheckCircle className="w-4.5 h-4.5 text-[#00F2FE] shrink-0" />}
            </h4>
            <p className="text-[12px] text-[#9CA3AF] font-normal mt-1.5 leading-snug truncate">
              {subtitle}
            </p>
          </div>

          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F2FE] shrink-0 shadow-inner backdrop-blur-md">
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
                  className="w-7 h-7 rounded-full border-2 border-[#131927] object-cover bg-[#1E2638] shadow-sm relative z-10"
                />
              ))}
              {localParticipants.length > 4 && (
                <div className="w-7 h-7 rounded-full border-2 border-[#131927] bg-[#1E2638] text-slate-300 text-[9px] font-bold flex items-center justify-center relative z-0">
                  +{localParticipants.length - 4}
                </div>
              )}
            </div>
            <span className="text-[11px] font-medium text-[#9CA3AF] truncate">
              {isGroup ? \`\${localParticipants.length} מתחרים\` : '1 נגד 1'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-[11px] text-white bg-white/[0.06] px-3 py-1.5 rounded-lg border border-white/10 shrink-0 shadow-inner">
            <span>{rankLabel}</span>
          </div>
        </div>

        {/* Rich Progress Bar */}
        <div className="w-full bg-[#090D16] h-2.5 rounded-full overflow-hidden p-[2px] border border-white/5 relative shadow-inner mt-1">
          <motion.div 
            className="h-full rounded-full"
            style={{
              background: isCompleted 
                ? 'linear-gradient(90deg, #00F2FE 0%, #4FACFE 100%)'
                : 'linear-gradient(90deg, #0088CC 0%, #00F2FE 70%, #4FACFE 100%)',
              boxShadow: '0 0 10px rgba(0, 242, 254, 0.4)',
            }}
            initial={{ width: 0 }}
            animate={{ width: \`\${myPercent}%\` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        {/* Quick Action Layout - Unified Segment Group */}
        <div className="flex items-center justify-between mt-2 pt-1 min-w-0">
          <div className="flex flex-col min-w-0">
             <span className="text-[#9CA3AF] text-[11px] font-medium">התקדמות</span>
             <span className="text-white font-bold truncate">
               <strong className="font-mono text-lg tracking-tight">{myParticipant.score}</strong> 
               <span className="text-[#9CA3AF] text-xs font-medium ml-1">/ {maxScore} {unit}</span>
             </span>
          </div>
          
          <div className="flex items-center gap-3 h-[44px]">
            {!isCompleted && (
              <motion.button 
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleQuickUpdate}
                className="h-full px-5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#4FACFE] text-[#090D16] font-black text-sm flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_15px_rgba(0,242,254,0.3)] active:scale-95 cursor-pointer shrink-0"
              >
                <span>+{stepIncrement}</span>
                <Zap className="w-4 h-4 fill-[#090D16]" />
              </motion.button>
            )}

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-full px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 transition-all font-bold text-sm cursor-pointer shrink-0 flex items-center justify-center gap-2"
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
              className="mt-2 bg-[#00F2FE]/20 border border-[#00F2FE]/40 rounded-xl p-2.5 flex items-center justify-between text-xs text-[#00F2FE] font-bold shadow-[0_4px_20px_rgba(0,242,254,0.2)] backdrop-blur-md"
            >
              <div className="flex items-center gap-2 truncate">
                <Sparkles className="w-4 h-4 animate-spin shrink-0" />
                <span className="truncate">התקדמות עודכנה! (+{stepIncrement} {unit})</span>
              </div>
              <span className="font-mono text-white text-[11px] bg-[#00F2FE]/30 px-2 py-1 rounded-md shrink-0">+\${stepIncrement * 10} XP</span>
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
                <span className="text-[11px] text-[#9CA3AF] font-medium">יעד: {maxScore} {unit}</span>
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
                          ? 'bg-[#00F2FE]/10 border-[#00F2FE]/30 shadow-inner' 
                          : 'bg-white/[0.03] border-white/5'
                      }\`}
                    >
                      {/* Rank */}
                      <div className="w-5 text-center text-sm font-bold shrink-0">
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
                              <span className="text-[9px] bg-gradient-to-r from-[#00F2FE] to-[#4FACFE] text-[#090D16] px-1.5 py-0.5 rounded font-black shrink-0">
                                אתה
                              </span>
                            )}
                          </span>
                          <span className="font-mono text-xs font-black text-white shrink-0">
                            {p.score} <span className="text-[10px] text-[#9CA3AF] font-medium">{unit}</span>
                          </span>
                        </div>
                        
                        <div className="w-full bg-[#090D16] h-2 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className={\`h-full rounded-full transition-all duration-500 ease-out \${
                              isLeader 
                                ? 'bg-gradient-to-r from-amber-400 to-yellow-300' 
                                : p.isMe 
                                  ? 'bg-gradient-to-r from-[#00F2FE] to-[#4FACFE]' 
                                  : 'bg-slate-600'
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
    </motion.div>
  );
};`;
content = content.replace(myChallengeRegex, newMyChallengeCard);

// 3. Replace Sub-Tab Pill Bar
const pillBarRegex = /{\/\* Floating Pill Tab — Premium Gaming Style \*\/}[\s\S]*?<\/div>\s*<\/div>/;
const newPillBar = `{/* Sub-Tab Pill Bar - Segment Control */}
        <div className="relative flex flex-col items-center mt-2 w-full">
          <div className="relative w-full bg-[#131927]/80 backdrop-blur-xl rounded-full p-[4px] flex items-center border border-white/10 shadow-inner">
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
                  className={\`relative flex-1 py-2.5 flex items-center justify-center z-10 transition-colors duration-300 rounded-full font-bold text-[13px] tracking-wide focus:outline-none \${
                    isActive
                      ? 'text-[#090D16]'
                      : 'text-[#9CA3AF] hover:text-white'
                  }\`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-gradient-to-r from-slate-100 to-white rounded-full shadow-[0_2px_10px_rgba(255,255,255,0.2)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-20">{label}</span>
                </button>
              );
            })}
          </div>
        </div>`;
content = content.replace(pillBarRegex, newPillBar);

// 4. Replace Zeigarnik Banner
const zeigarnikRegex = /{\/\* Zeigarnik Near Completion Motivation Banner \*\/}[\s\S]*?<\/div>\s*<\/div>/;
const newZeigarnik = `{/* Premium Progress Hero Card */}
              <div dir="rtl" className="relative overflow-hidden rounded-2xl p-5 flex items-center justify-between shadow-[0_8px_32px_rgba(0,242,254,0.15)] group" style={{ backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                {/* Animated Gradient Mesh Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#00F2FE]/10 to-[#4FACFE]/5 z-0" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F2FE]/20 rounded-full blur-3xl animate-pulse z-0" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#4FACFE]/20 rounded-full blur-3xl animate-pulse z-0" style={{ animationDelay: '1s' }} />
                
                <div className="relative z-10 flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                    {/* Custom Progress Ring */}
                    <svg className="w-full h-full -rotate-90 absolute inset-0" viewBox="0 0 36 36">
                      <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100, 100" />
                      <path className="text-[#00F2FE]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="40, 100" />
                    </svg>
                    <Flame className="w-5 h-5 text-[#00F2FE] drop-shadow-[0_0_10px_rgba(0,242,254,0.6)] absolute" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2 truncate tracking-wide">
                      קרוב לפריצת דרך! <Sparkles className="w-4 h-4 text-amber-300" />
                    </h4>
                    <p className="text-xs text-[#9CA3AF] mt-1 truncate">
                      "30 יום ללא סוכר": 12 מתוך 30 ימים
                    </p>
                  </div>
                </div>
                <div className="relative z-10 bg-[#090D16]/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
                  <span className="text-sm font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FE] to-[#4FACFE]">
                    40%
                  </span>
                </div>
              </div>`;
content = content.replace(zeigarnikRegex, newZeigarnik);

// 5. Replace Weekly Routine Goals with Workout Logs in Training Ground
const weeklyRoutineRegex = /{\/\* 2\. Weekly Routine Goals — 2-Column Grid with Glowing Progress Bars \*\/}[\s\S]*?<\/section>/;
const newWorkoutLogs = `{/* 2. Workout Logs Refactor */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#00F2FE]" />
                    <h3 className="text-sm font-bold text-white tracking-wide">אימון אחרון</h3>
                  </div>
                  <span className="text-xs text-[#9CA3AF] font-medium bg-white/5 px-2.5 py-1 rounded-md border border-white/10">אתמול, 18:30</span>
                </div>

                <div className="bg-[#131927]/60 backdrop-blur-xl rounded-2xl border border-white/10 p-5 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    {/* Grid Item 1: Distance */}
                    <div className="bg-[#090D16] rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center gap-1 shadow-inner group transition-all hover:border-[#00F2FE]/30 hover:bg-[#00F2FE]/5">
                       <MapIcon className="w-5 h-5 text-[#00F2FE] mb-1 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                       <span className="text-[#9CA3AF] text-xs font-medium">מרחק</span>
                       <div className="flex items-baseline gap-1 mt-1">
                         <span className="text-white font-black text-2xl font-mono">5.2</span>
                         <span className="text-[#9CA3AF] text-xs font-bold">ק"מ</span>
                       </div>
                    </div>
                    
                    {/* Grid Item 2: Duration */}
                    <div className="bg-[#090D16] rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center gap-1 shadow-inner group transition-all hover:border-[#4FACFE]/30 hover:bg-[#4FACFE]/5">
                       <Clock className="w-5 h-5 text-[#4FACFE] mb-1 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                       <span className="text-[#9CA3AF] text-xs font-medium">זמן</span>
                       <div className="flex items-baseline gap-1 mt-1">
                         <span className="text-white font-black text-2xl font-mono">28:45</span>
                         <span className="text-[#9CA3AF] text-xs font-bold">דקות</span>
                       </div>
                    </div>
                    
                    {/* Grid Item 3: Calories */}
                    <div className="bg-[#090D16] rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center gap-1 shadow-inner group transition-all hover:border-amber-500/30 hover:bg-amber-500/5">
                       <Flame className="w-5 h-5 text-amber-400 mb-1 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                       <span className="text-[#9CA3AF] text-xs font-medium">קלוריות</span>
                       <div className="flex items-baseline gap-1 mt-1">
                         <span className="text-white font-black text-2xl font-mono">320</span>
                         <span className="text-[#9CA3AF] text-xs font-bold">קק"ל</span>
                       </div>
                    </div>
                    
                    {/* Grid Item 4: Pace */}
                    <div className="bg-[#090D16] rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center gap-1 shadow-inner group transition-all hover:border-purple-500/30 hover:bg-purple-500/5">
                       <Activity className="w-5 h-5 text-purple-400 mb-1 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                       <span className="text-[#9CA3AF] text-xs font-medium">קצב ממוצע</span>
                       <div className="flex items-baseline gap-1 mt-1">
                         <span className="text-white font-black text-2xl font-mono">5'30"</span>
                         <span className="text-[#9CA3AF] text-xs font-bold">לק"מ</span>
                       </div>
                    </div>
                  </div>
                </div>
              </section>`;
content = content.replace(weeklyRoutineRegex, newWorkoutLogs);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully refactored ChallengesTab.jsx');
