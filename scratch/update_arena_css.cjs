const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'GitHub', 'challenges-app', 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

const marker = '/* Fix HUD - Brawl Stars Style */';
const index = css.indexOf(marker);

if (index !== -1) {
  const sleekCss = `/* =======================================================
   PREMIUM SLEEK DESIGN FOR ARENA (REPLACING CHILDISH HUD)
   ======================================================= */

.arena-rank-pill {
  background: rgba(20, 25, 35, 0.7) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  padding: 0.6rem 1.2rem !important;
  display: flex !important;
  align-items: center !important;
  gap: 1rem !important;
}

.arena-rank-label {
  color: #f8fafc !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  font-size: 0.85rem !important;
  text-shadow: none !important;
}

.arena-xp-text {
  color: #94a3b8 !important;
  font-weight: 600 !important;
  font-size: 0.75rem !important;
  margin-top: 4px !important;
  text-shadow: none !important;
}

.arena-rank-icon-ring {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
  width: 48px !important;
  height: 48px !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  border-radius: 50% !important;
}
.arena-rank-icon-ring svg {
  margin: 0 !important;
  display: block !important;
}

.arena-xp-bar-track {
  background: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 99px !important;
  height: 8px !important;
  margin: 6px 0 !important;
  width: 140px !important;
  overflow: hidden !important;
}

.arena-xp-bar-fill {
  background: linear-gradient(90deg, #38bdf8 0%, #818cf8 100%) !important;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.4) !important;
  border-radius: 99px !important;
  height: 100% !important;
}

/* 2x2 Grid container */
.arena-btns-grid {
  gap: 1rem !important;
  padding: 0 1.5rem 1.5rem !important;
}
.top-grid {
  margin-top: 1rem !important;
  padding-bottom: 0 !important;
}
.bottom-grid {
  margin-bottom: 2rem !important;
}

/* Action Buttons - Sleek Glassmorphism */
.arena-action-btn {
  border-radius: 20px !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  text-align: center !important;
  flex-direction: column !important;
  justify-content: center !important;
  padding: 1rem 0.5rem !important;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
  transform: none !important;
  text-shadow: none !important;
}
.arena-action-btn:before { display: none !important; }

.arena-action-btn:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
}

.arena-action-btn:active {
  transform: translateY(2px) !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3) !important;
}

.arena-btn-challenges {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(29, 78, 216, 0.25) 100%) !important;
}
.arena-btn-daily {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(217, 119, 6, 0.25) 100%) !important;
}
.arena-btn-home {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(126, 34, 206, 0.25) 100%) !important;
}
.arena-btn-away {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(185, 28, 28, 0.25) 100%) !important;
}

.arena-btn-icon {
  font-size: 1.8rem !important;
  transform: none !important;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3)) !important;
  margin-bottom: 0.5rem !important;
  transition: transform 0.3s ease !important;
}
.arena-action-btn:hover .arena-btn-icon {
  transform: scale(1.1) !important;
}

.arena-btn-label {
  align-items: center !important;
}
.arena-btn-title {
  font-size: 0.85rem !important;
  font-weight: 700 !important;
  color: #f1f5f9 !important;
  text-shadow: none !important;
}
.arena-btn-subtitle {
  font-size: 0.65rem !important;
  font-weight: 500 !important;
  color: #94a3b8 !important;
  text-shadow: none !important;
  margin-top: 0.2rem !important;
}

/* Modals - Premium Look */
.arena-modal-panel {
  background: rgba(15, 23, 42, 0.85) !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 24px 24px 0 0 !important;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5) !important;
  z-index: 10000 !important;
}
.arena-modal-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding-bottom: 1rem !important;
}
.arena-modal-title {
  text-shadow: none !important;
  font-size: 1.3rem !important;
  color: #f8fafc !important;
}
.arena-modal-close {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 50% !important;
  box-shadow: none !important;
  text-shadow: none !important;
  width: 36px !important;
  height: 36px !important;
  font-size: 1.2rem !important;
  color: #94a3b8 !important;
  transition: all 0.2s ease !important;
}
.arena-modal-close:hover {
  background: rgba(239, 68, 68, 0.1) !important;
  color: #ef4444 !important;
}

/* Modal Inner Elements */
.arena-mission-card, .arena-challenge-row, .arena-discover-card {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  background: rgba(255, 255, 255, 0.03) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
  border-radius: 16px !important;
  transition: all 0.3s ease !important;
}
.arena-mission-card:hover, .arena-challenge-row:hover, .arena-discover-card:hover {
  background: rgba(255, 255, 255, 0.06) !important;
  transform: translateY(-2px) !important;
}

.arena-cta-btn, .arena-proof-btn, .btn-primary {
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  font-weight: 600 !important;
  text-transform: none !important;
  border-radius: 12px !important;
  animation: none !important;
  transition: all 0.3s ease !important;
}
.arena-cta-btn:hover, .arena-proof-btn:hover, .btn-primary:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4) !important;
}
.arena-cta-btn:active, .arena-proof-btn:active, .btn-primary:active {
  transform: translateY(1px) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
}

/* Background Override */
.arena-lobby {
  background-image: url('/farm_bg.jpg') !important;
  background-size: cover !important;
  background-position: center bottom !important;
  position: relative;
  overflow: hidden;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
}

.arena-lobby::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.85) 100%) !important;
  z-index: 1;
  display: block !important;
  pointer-events: none;
}

.arena-avatar-stage {
  animation: float-avatar 6s ease-in-out infinite;
  flex: 1 !important;
  margin: 1rem 0 !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  align-items: center !important;
}
.arena-avatar-platform {
  background: radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 60%) !important;
  width: 140px !important;
  height: 20px !important;
  bottom: -10px !important;
  animation: shadow-pulse 6s ease-in-out infinite;
}

.arena-modal-overlay {
  z-index: 9999 !important;
  position: fixed !important;
}
`;
  
  css = css.substring(0, index) + sleekCss;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('CSS updated successfully.');
} else {
  console.log('Marker not found.');
}
