const fs = require('fs');
const cssFile = 'src/index.css';
let css = fs.readFileSync(cssFile, 'utf8');

const newCss = `

@keyframes shine {
  0% { transform: translateX(-200%); }
  50%, 100% { transform: translateX(200%); }
}

`;

if (!css.includes('@keyframes shine')) {
  fs.writeFileSync(cssFile, css + newCss);
  console.log('Shine keyframes added successfully');
}
