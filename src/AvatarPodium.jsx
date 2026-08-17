import React from 'react';

export default function AvatarPodium({ avatarConfig, isCustomizable, onConfigChange }) {
  const { 
    type = 'runner', 
    shirtColor = '#3b82f6', 
    glowColor = '#00ffff' 
  } = avatarConfig || {};

  // Preset styles
  const avatarTypes = [
    { id: 'runner', label: '🏃‍♂️ רץ/ה', file: 'runner' },
    { id: 'weightlifter', label: '🏋️‍♂️ מתאמן/ת כוח', file: 'weightlifter' },
    { id: 'yoga', label: '🧘‍♂️ יוגה מאסטר', file: 'yoga' },
    { id: 'cyclist', label: '🚴‍♂️ רוכב/ת אופניים', file: 'cyclist' }
  ];

  const glowColors = [
    { value: '#ffffff', label: 'לבן מואר' },
    { value: '#00ffff', label: 'טורקיז זוהר' },
    { value: '#a855f7', label: 'סגול אגדי' },
    { value: '#ffd700', label: 'זהב מלכותי' },
    { value: '#22c55e', label: 'ירוק רעל' }
  ];

  // Map hex shirt colors to approximate CSS hue-rotate values to shift clothing color of 3D model
  const shirtColors = [
    { hex: '#3b82f6', hue: '0deg', label: 'כחול בסיס' },
    { hex: '#ef4444', hue: '140deg', label: 'אדום' },
    { hex: '#10b981', hue: '60deg', label: 'ירוק' },
    { hex: '#f59e0b', hue: '180deg', label: 'כתום' },
    { hex: '#ec4899', hue: '260deg', label: 'ורוד' },
    { hex: '#8b5cf6', hue: '220deg', label: 'סגול' }
  ];

  const currentType = avatarTypes.find(t => t.id === type) || avatarTypes[0];
  const currentColorObj = shirtColors.find(c => c.hex === shirtColor) || shirtColors[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', direction: 'rtl' }}>
      
      {/* 3D Scene */}
      <div className="podium-scene" style={{ height: '270px', overflow: 'visible' }}>
        {/* Glow Ring */}
        <div 
          className="podium-glow-ring" 
          style={{ 
            boxShadow: `0 0 35px 12px ${glowColor}`,
            background: `radial-gradient(circle, ${glowColor}66 0%, transparent 70%)`
          }}
        />

        {/* High-Fidelity 3D Clay Character */}
        <div className="avatar-figurine" style={{ bottom: '24px', display: 'flex', justifyContent: 'center' }}>
          <img 
            src={`/avatars/${currentType.file}.png`} 
            alt={currentType.label} 
            style={{ 
              width: '160px', 
              height: '210px', 
              objectFit: 'contain',
              filter: `hue-rotate(${currentColorObj.hue}) contrast(1.05) drop-shadow(0 12px 18px rgba(0,0,0,0.55))`
            }} 
          />
        </div>

        {/* White Platform Stand */}
        <div className="podium-platform" style={{ background: '#ffffff', borderColor: '#cbd5e1', width: '150px', zIndex: 1 }} />
      </div>

      {/* Customizer Panel */}
      {isCustomizable && onConfigChange && (
        <div className="glass-card" style={{ width: '100%', maxWidth: '380px', padding: '1.25rem', marginTop: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-primary)', textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            👕 מלתחת התאמה אישית 3D
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* 1. Character style */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem', fontWeight: 'bold' }}>בחר דמות 3D:</label>
              <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                {avatarTypes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => onConfigChange({ ...avatarConfig, type: t.id })}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '10px',
                      background: type === t.id ? 'var(--accent)' : 'var(--bg-tertiary)',
                      color: type === t.id ? '#000' : 'var(--text-primary)',
                      border: '1.5px solid var(--border)',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Clothes Color (dynamic hue rotation) */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem', fontWeight: 'bold' }}>צבע לבוש דינמי:</label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {shirtColors.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => onConfigChange({ ...avatarConfig, shirtColor: c.hex })}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: c.hex,
                      border: shirtColor === c.hex ? '2.5px solid #fff' : '1.5px solid rgba(0,0,0,0.3)',
                      boxShadow: shirtColor === c.hex ? `0 0 6px ${c.hex}` : 'none',
                      cursor: 'pointer',
                      transition: 'transform 0.1s'
                    }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* 3. Glow Aura Color */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem', fontWeight: 'bold' }}>צבע הילה לפודיום:</label>
              <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                {glowColors.map(g => (
                  <button
                    key={g.value}
                    onClick={() => onConfigChange({ ...avatarConfig, glowColor: g.value })}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '10px',
                      background: glowColor === g.value ? 'var(--bg-tertiary)' : 'transparent',
                      color: glowColor === g.value ? g.value : 'var(--text-secondary)',
                      border: `1.5px solid ${g.value}`,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: g.value }}></span>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
