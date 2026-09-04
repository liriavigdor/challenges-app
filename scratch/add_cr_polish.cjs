const fs = require('fs');
const cssFile = 'src/index.css';
let css = fs.readFileSync(cssFile, 'utf8');

const importStatement = "@import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');\n";

if (!css.includes('Lilita+One')) {
  css = importStatement + css;
}

const polishCss = `
/* --- CR Polish --- */
.cr-font {
  font-family: 'Lilita One', cursive, sans-serif;
}

.cr-text-stroke {
  font-family: 'Lilita One', cursive, sans-serif;
  letter-spacing: 1px;
}

.cr-text-stroke-sm {
  font-family: 'Lilita One', cursive, sans-serif;
}

/* XP Bar Shine */
.cr-xp-bar-inner {
  position: relative;
  overflow: hidden;
  border-radius: 999px;
  background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
  border: 1px solid #1e3a8a;
  box-shadow: inset 0 2px 4px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.4);
}
.cr-xp-bar-inner::after {
  content: '';
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
  transform: skewX(-20deg) translateX(-150%);
  animation: xpShine 3s infinite;
}
@keyframes xpShine {
  0% { transform: skewX(-20deg) translateX(-150%); }
  50%, 100% { transform: skewX(-20deg) translateX(150%); }
}

/* Floating Particles for Arena */
.cr-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}
.cr-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #ffcc00;
  border-radius: 50%;
  box-shadow: 0 0 6px #ffaa00;
  opacity: 0;
  animation: floatUp 4s linear infinite;
}
@keyframes floatUp {
  0% { transform: translateY(100vh) scale(0); opacity: 0; }
  20% { opacity: 0.8; transform: translateY(80vh) scale(1); }
  80% { opacity: 0.5; }
  100% { transform: translateY(-20vh) scale(0); opacity: 0; }
}

`;

if (!css.includes('.cr-font')) {
  fs.writeFileSync(cssFile, css + polishCss);
  console.log('Polish CSS added');
} else {
  console.log('Polish CSS already exists');
}
