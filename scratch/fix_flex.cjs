const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'GitHub', 'challenges-app', 'src', 'index.css');

const fixFlexCss = `
/* =======================================================
   FIX FOR MISSING FLEX LAYOUTS IN ARENA MODALS
   ======================================================= */

.arena-modal-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  width: 100% !important;
}

.arena-modal-title {
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  margin: 0 !important;
}

.arena-modal-close {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  cursor: pointer !important;
}

.arena-mission-card {
  display: flex !important;
  align-items: center !important;
  gap: 1rem !important;
  padding: 1.2rem !important;
  margin-bottom: 0.8rem !important;
}

.arena-mission-icon-wrap {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  flex-shrink: 0 !important;
  width: 44px !important;
  height: 44px !important;
  background: rgba(255, 255, 255, 0.05) !important;
  border-radius: 50% !important;
}

.arena-mission-info {
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
}

.arena-challenge-row, .arena-discover-card {
  display: flex !important;
  align-items: center !important;
  gap: 1rem !important;
  padding: 1rem !important;
}

/* Fix XP chip and button alignments inside mission card */
.arena-xp-chip {
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.3rem !important;
  padding: 0.3rem 0.6rem !important;
  background: rgba(251, 191, 36, 0.15) !important;
  color: #fbbf24 !important;
  border-radius: 99px !important;
  font-weight: 700 !important;
  font-size: 0.75rem !important;
}

.arena-cta-btn {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  padding: 0.5rem 1rem !important;
  font-size: 0.9rem !important;
}
`;

fs.appendFileSync(cssPath, fixFlexCss, 'utf8');
console.log('Appended flex layout fixes to index.css');
