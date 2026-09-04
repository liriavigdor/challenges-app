const fs = require('fs');
const cssFile = 'src/index.css';
let css = fs.readFileSync(cssFile, 'utf8');

const newCss = `

/* --- Clash Royale Tactile UI --- */

/* Text styling */
.cr-text-stroke {
  color: white;
  text-shadow: 
    -1.5px -1.5px 0 #000,
    1.5px -1.5px 0 #000,
    -1.5px 1.5px 0 #000,
    1.5px 1.5px 0 #000,
    0px 3px 0 #000;
  font-weight: 900;
  letter-spacing: 0.5px;
}

.cr-text-stroke-sm {
  color: white;
  text-shadow: 
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000,
    0px 2px 0 #000;
  font-weight: 800;
}

/* Golden Battle Button (Massive Action) */
.cr-btn-battle {
  position: relative;
  background: linear-gradient(180deg, #ffd93a 0%, #f6a100 100%);
  border: 3px solid #3c1e02;
  border-radius: 12px;
  box-shadow: 
    0 8px 0 0 #d97800,
    0 12px 10px rgba(0,0,0,0.4),
    inset 0 4px 6px rgba(255, 255, 255, 0.6);
  color: white;
  cursor: pointer;
  transition: all 0.1s ease;
  overflow: hidden;
  padding: 12px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.cr-btn-battle::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 30%;
  background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
  border-radius: 8px 8px 0 0;
}
.cr-btn-battle:active {
  transform: translateY(8px);
  box-shadow: 
    0 0 0 0 #d97800,
    0 4px 6px rgba(0,0,0,0.4),
    inset 0 4px 6px rgba(255, 255, 255, 0.6);
}

/* Floating Side Buttons (Secondary Actions) */
.cr-btn-side {
  position: absolute;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(180deg, #4da9ff 0%, #1e6ed1 100%);
  border: 2px solid #0b2d56;
  box-shadow: 
    0 6px 0 0 #154e99,
    0 8px 8px rgba(0,0,0,0.3),
    inset 0 3px 5px rgba(255,255,255,0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  transition: all 0.1s ease;
  z-index: 20;
}
.cr-btn-side:active {
  transform: translateY(6px);
  box-shadow: 
    0 0 0 0 #154e99,
    0 2px 4px rgba(0,0,0,0.3),
    inset 0 3px 5px rgba(255,255,255,0.5);
}

.cr-btn-side-left {
  left: 16px;
}
.cr-btn-side-right {
  right: 16px;
}

/* Variations for side buttons */
.cr-btn-green {
  background: linear-gradient(180deg, #74eb34 0%, #3ca608 100%);
  box-shadow: 
    0 6px 0 0 #287304,
    0 8px 8px rgba(0,0,0,0.3),
    inset 0 3px 5px rgba(255,255,255,0.5);
}
.cr-btn-green:active {
  box-shadow: 
    0 0 0 0 #287304,
    0 2px 4px rgba(0,0,0,0.3),
    inset 0 3px 5px rgba(255,255,255,0.5);
}

.cr-btn-purple {
  background: linear-gradient(180deg, #cc4dff 0%, #7c1ed1 100%);
  box-shadow: 
    0 6px 0 0 #571599,
    0 8px 8px rgba(0,0,0,0.3),
    inset 0 3px 5px rgba(255,255,255,0.5);
}
.cr-btn-purple:active {
  box-shadow: 
    0 0 0 0 #571599,
    0 2px 4px rgba(0,0,0,0.3),
    inset 0 3px 5px rgba(255,255,255,0.5);
}


/* Top Bar Resource Styling */
.cr-top-bar-item {
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid #2a2e3d;
  border-radius: 999px;
  display: flex;
  align-items: center;
  padding: 4px 12px 4px 4px;
  color: white;
  font-weight: bold;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
}
.cr-top-bar-icon-wrapper {
  background: linear-gradient(180deg, #4da9ff 0%, #1e6ed1 100%);
  border: 2px solid #0b2d56;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

`;

if (!css.includes('.cr-btn-battle')) {
  fs.writeFileSync(cssFile, css + newCss);
  console.log('Tactile CSS added successfully');
} else {
  console.log('Tactile CSS already exists');
}
