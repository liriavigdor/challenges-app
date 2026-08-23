import React from 'react';

const BaseRankIcon = ({ children, size = 32, gradientId, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))', ...style }}
  >
    <defs>
      <linearGradient id="bronze" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#cd7f32" />
        <stop offset="50%" stopColor="#a0522d" />
        <stop offset="100%" stopColor="#8b4513" />
      </linearGradient>
      <linearGradient id="silver" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f8f9fa" />
        <stop offset="50%" stopColor="#adb5bd" />
        <stop offset="100%" stopColor="#6c757d" />
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffd700" />
        <stop offset="50%" stopColor="#daa520" />
        <stop offset="100%" stopColor="#b8860b" />
      </linearGradient>
      <linearGradient id="ruby" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff4d4d" />
        <stop offset="50%" stopColor="#cc0000" />
        <stop offset="100%" stopColor="#990000" />
      </linearGradient>
    </defs>
    {children}
  </svg>
);

const Chevron = ({ y, fillUrl }) => (
  <path d={`M 15 ${y + 20} L 50 ${y + 5} L 85 ${y + 20} L 85 ${y + 35} L 50 ${y + 20} L 15 ${y + 35} Z`} fill={`url(#${fillUrl})`} />
);

const Diamond = ({ cx, cy, r, fillUrl }) => (
  <polygon points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`} fill={`url(#${fillUrl})`} />
);

const Star = ({ cx, cy, r, fillUrl }) => (
  <polygon 
    points={`${cx},${cy - r} ${cx + r*0.3},${cy - r*0.3} ${cx + r},${cy - r*0.3} ${cx + r*0.4},${cy + r*0.2} ${cx + r*0.6},${cy + r} ${cx},${cy + r*0.5} ${cx - r*0.6},${cy + r} ${cx - r*0.4},${cy + r*0.2} ${cx - r},${cy - r*0.3} ${cx - r*0.3},${cy - r*0.3}`} 
    fill={`url(#${fillUrl})`} 
  />
);

const Bar = ({ y, fillUrl }) => (
  <rect x="20" y={y} width="60" height="10" rx="2" fill={`url(#${fillUrl})`} />
);

export const MilitaryRankIcon = ({ rankId, size = 32, className }) => {
  const getRankGraphic = () => {
    // Recruits -> Sergeant Major (Chevrons)
    if (rankId >= 0 && rankId <= 9) {
      const chevronsCount = Math.min(5, Math.ceil((rankId + 1) / 2));
      const hasBar = rankId % 2 === 0 && rankId !== 0;
      
      return (
        <BaseRankIcon size={size} style={{ className }}>
          {Array.from({ length: chevronsCount }).map((_, i) => (
            <Chevron key={i} y={70 - (i * 15)} fillUrl={rankId >= 5 ? 'gold' : 'bronze'} />
          ))}
          {hasBar && <Bar y={85} fillUrl={rankId >= 5 ? 'gold' : 'bronze'} />}
        </BaseRankIcon>
      );
    }
    
    // Warrant Officers (Diamonds)
    if (rankId >= 10 && rankId <= 14) {
      const diamondsCount = rankId - 9;
      if (diamondsCount === 5) {
        return (
          <BaseRankIcon size={size} style={{ className }}>
             <Diamond cx={50} cy={50} r={25} fillUrl="gold" />
             <Diamond cx={20} cy={50} r={10} fillUrl="gold" />
             <Diamond cx={80} cy={50} r={10} fillUrl="gold" />
          </BaseRankIcon>
        )
      }
      return (
        <BaseRankIcon size={size} style={{ className }}>
          {Array.from({ length: diamondsCount }).map((_, i) => (
            <Diamond key={i} cx={50} cy={20 + (i * 20)} r={12} fillUrl="gold" />
          ))}
        </BaseRankIcon>
      );
    }

    // Lieutenants & Captain (Stars)
    if (rankId >= 15 && rankId <= 18) {
      const starsCount = rankId - 14;
      return (
        <BaseRankIcon size={size} style={{ className }}>
          {Array.from({ length: starsCount }).map((_, i) => (
            <Star key={i} cx={50} cy={25 + (i * 20)} r={12} fillUrl="silver" />
          ))}
        </BaseRankIcon>
      );
    }

    // Major -> Colonel (Gold Stars + Bar)
    if (rankId >= 19 && rankId <= 21) {
      const starsCount = rankId - 18;
      return (
        <BaseRankIcon size={size} style={{ className }}>
          {Array.from({ length: starsCount }).map((_, i) => (
            <Star key={i} cx={50} cy={25 + (i * 20)} r={15} fillUrl="gold" />
          ))}
          <Bar y={90} fillUrl="gold" />
        </BaseRankIcon>
      );
    }

    // Generals (Stars + Wreath)
    if (rankId >= 22 && rankId <= 25) {
      const starsCount = rankId - 21;
      return (
        <BaseRankIcon size={size} style={{ className }}>
           <path d="M 20 80 Q 50 100 80 80" stroke="url(#gold)" strokeWidth="5" fill="none" />
          {Array.from({ length: starsCount }).map((_, i) => (
            <Star key={i} cx={50} cy={25 + (i * 18)} r={15} fillUrl="gold" />
          ))}
        </BaseRankIcon>
      );
    }

    // Marshals & Generalissimo
    if (rankId === 26) {
      return (
        <BaseRankIcon size={size} style={{ className }}>
          <Star cx={50} cy={50} r={40} fillUrl="gold" />
          <Star cx={50} cy={50} r={20} fillUrl="silver" />
        </BaseRankIcon>
      );
    }
    if (rankId === 27) {
      return (
        <BaseRankIcon size={size} style={{ className }}>
           <polygon points="50,10 90,50 50,90 10,50" fill="url(#ruby)" />
           <Star cx={50} cy={50} r={25} fillUrl="gold" />
        </BaseRankIcon>
      );
    }
    if (rankId === 28) {
      return (
        <BaseRankIcon size={size} style={{ className }}>
           <circle cx={50} cy={50} r={45} fill="url(#ruby)" />
           <Star cx={50} cy={50} r={30} fillUrl="gold" />
        </BaseRankIcon>
      );
    }
    if (rankId === 29) {
      return (
        <BaseRankIcon size={size} style={{ className }}>
           <polygon points="50,5 95,35 80,90 20,90 5,35" fill="url(#ruby)" />
           <Star cx={50} cy={50} r={35} fillUrl="gold" />
        </BaseRankIcon>
      );
    }

    // Fallback
    return (
       <BaseRankIcon size={size} style={{ className }}>
          <Chevron y={40} fillUrl="bronze" />
       </BaseRankIcon>
    )
  };

  return (
    <div className={`military-rank-icon ${className || ''}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {getRankGraphic()}
    </div>
  );
};
