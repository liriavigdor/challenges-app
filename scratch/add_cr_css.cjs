const fs = require('fs');
const cssFile = 'src/index.css';
let css = fs.readFileSync(cssFile, 'utf8');

const newCss = `

/* --- Clash Royale Style Arena Layout --- */

.glass-arena-fullscreen {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* No scrolling in the arena itself */
}

/* Make sure avatar wrapper occupies central space */
.glass-avatar-arena-cr {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

/* Floating side buttons (Missions & Mystery) */
.cr-floating-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.6);
  border: 1.5px solid rgba(0, 229, 255, 0.4);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 15px rgba(0, 229, 255, 0.1);
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.cr-floating-btn:hover {
  transform: translateY(-50%) scale(1.1);
  border-color: rgba(0, 229, 255, 0.8);
  box-shadow: 0 8px 32px rgba(0, 229, 255, 0.3), inset 0 0 25px rgba(0, 229, 255, 0.3);
}
.cr-floating-btn:active {
  transform: translateY(-50%) scale(0.95);
}
.cr-floating-btn-left {
  left: 20px;
}
.cr-floating-btn-right {
  right: 20px;
}
.cr-btn-icon {
  font-size: 1.8rem;
  margin-bottom: 2px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
}
.cr-btn-label {
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  text-align: center;
  line-height: 1;
}

/* Bottom Actions container for HOME & AWAY */
.cr-bottom-actions {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 2rem;
  z-index: 15;
}

/* We hide the old scrollable active challenges panel in CR view */
.cr-hidden {
  display: none !important;
}
`;

if (!css.includes('.cr-floating-btn')) {
  fs.writeFileSync(cssFile, css + newCss);
  console.log('CSS added successfully');
} else {
  console.log('CSS already exists');
}
