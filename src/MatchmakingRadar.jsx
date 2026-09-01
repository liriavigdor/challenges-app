import React, { useState, useEffect } from 'react';
import { TargetIcon, CloseIcon, SwordsIcon } from './icons';

export default function MatchmakingRadar({ onMatchFound, onCancel }) {
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScanning(false);
      setTimeout(() => {
        onMatchFound();
      }, 1500); 
    }, 3000);

    return () => clearTimeout(timer);
  }, [onMatchFound]);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff'
    }}>
      <button 
        onClick={onCancel}
        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.5rem' }}
      >
        <CloseIcon size={24} />
      </button>

      {scanning ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '240px', height: '240px', margin: '0 auto 2rem' }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              border: '2px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '50%',
              animation: 'radarPulse 2s infinite'
            }}></div>
            <div style={{
              position: 'absolute', top: '30px', left: '30px', right: '30px', bottom: '30px',
              border: '2px solid rgba(16, 185, 129, 0.5)',
              borderRadius: '50%',
              animation: 'radarPulse 2s infinite 0.5s'
            }}></div>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: '50%', height: '2px',
              background: 'linear-gradient(90deg, rgba(16,185,129,1) 0%, rgba(16,185,129,0) 100%)',
              transformOrigin: 'left center',
              animation: 'radarSpin 2s linear infinite'
            }}></div>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#10b981'
            }}>
              <TargetIcon size={40} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>מחפש משחק חוץ...</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>סורק את הזירה הגלובלית לאתגר פתוח</p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', animation: 'radarFadeIn 0.5s ease-out' }}>
          <div style={{
            width: '140px', height: '140px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            boxShadow: '0 0 40px rgba(16, 185, 129, 0.6)'
          }}>
            <SwordsIcon size={64} color="#fff" />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#10b981', marginBottom: '1rem', textShadow: '0 2px 10px rgba(16, 185, 129, 0.3)' }}>
            משחק נמצא!
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#e2e8f0' }}>מכין את הזירה...</p>
        </div>
      )}

      <style>{`
        @keyframes radarPulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
        @keyframes radarSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes radarFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
