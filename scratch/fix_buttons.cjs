const fs = require('fs');

const cssPath = 'c:/GitHub/challenges-app/src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

const fixCSS = `
/* =======================================================
   ADJUST ARENA BUTTON SIZES (-15%) & PUSH DOWN MORE
   ======================================================= */
.top-grid {
  margin-top: 6.5rem !important;
}

.arena-action-btn {
  padding: 0.75rem 0.4rem !important; /* Reduced padding */
}

.arena-btn-icon {
  font-size: 1.5rem !important; /* Reduced from 1.8rem */
  margin-bottom: 0.3rem !important;
}

.arena-btn-title {
  font-size: 0.75rem !important; /* Reduced from 0.85rem */
}

.arena-btn-subtitle {
  font-size: 0.55rem !important; /* Reduced from 0.65rem */
}
`;

fs.appendFileSync(cssPath, fixCSS, 'utf8');
console.log('Button sizes reduced and pushed down');
