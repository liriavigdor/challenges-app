const fs = require('fs');
const path = require('path');

const cssPath = path.join('c:', 'GitHub', 'challenges-app', 'src', 'index.css');

const fixCss = `
/* =======================================================
   FIX FOR MODAL LAYOUT AND SCREEN FITTING
   ======================================================= */

.arena-modal-overlay {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  inset: 0 !important;
  padding: 1rem !important;
}

.arena-modal-panel {
  width: 100% !important;
  max-width: 500px !important;
  max-height: 85vh !important;
  overflow-y: auto !important;
  padding: 1.5rem !important;
  margin: 0 auto !important;
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
}

/* Ensure images in modals don't overflow */
.arena-modal-panel img {
  max-width: 100% !important;
  object-fit: cover !important;
}

/* Fix Head2Head container to fit screen properly */
.creator-container {
  width: 100% !important;
  max-width: 500px !important;
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  padding: 1rem !important;
}

.creator-section-card {
  flex: 1 !important;
}
`;

fs.appendFileSync(cssPath, fixCss, 'utf8');
console.log('Appended modal and layout fixes to index.css');
