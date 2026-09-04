const fs = require('fs');
const cssFile = 'src/index.css';
let css = fs.readFileSync(cssFile, 'utf8');

const newCss = `

.cr-shine-anim {
  animation: shine 2s ease-in-out infinite;
}

`;

if (!css.includes('.cr-shine-anim')) {
  fs.writeFileSync(cssFile, css + newCss);
  console.log('cr-shine-anim added successfully');
}
