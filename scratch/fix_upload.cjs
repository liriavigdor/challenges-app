const fs = require('fs');

// 1. Fix dbService.js timeouts
let dbCode = fs.readFileSync('src/dbService.js', 'utf8');

const setDocRegex = /await setDoc\((.*?)\);/g;
dbCode = dbCode.replace(setDocRegex, 'await Promise.race([setDoc($1), new Promise((_, r) => setTimeout(() => r(new Error("Timeout")), 3000))]);');

fs.writeFileSync('src/dbService.js', dbCode, 'utf8');
console.log('dbService timeouts fixed');

// 2. Fix App.jsx image compression
let appCode = fs.readFileSync('src/App.jsx', 'utf8');
appCode = appCode.replace(/\r\n/g, '\n');

// Replace upload logic 1
const uploadTarget1 = `                                allowedFiles.forEach(file => {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    setNewChallengeImages(prev => {
                                      if (prev.length < 10) return [...prev, event.target.result];
                                      return prev;
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                });`;

const uploadReplace1 = `                                allowedFiles.forEach(file => {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    const img = new Image();
                                    img.onload = () => {
                                      const canvas = document.createElement('canvas');
                                      let w = img.width; let h = img.height; const max = 800;
                                      if (w > h && w > max) { h *= max/w; w = max; }
                                      else if (h > max) { w *= max/h; h = max; }
                                      canvas.width = w; canvas.height = h;
                                      const ctx = canvas.getContext('2d');
                                      ctx.drawImage(img, 0, 0, w, h);
                                      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                                      setNewChallengeImages(prev => {
                                        if (prev.length < 10) return [...prev, dataUrl];
                                        return prev;
                                      });
                                    };
                                    img.src = event.target.result;
                                  };
                                  reader.readAsDataURL(file);
                                });`;
appCode = appCode.replace(uploadTarget1, uploadReplace1);

// Replace upload logic 2
const uploadTarget2 = `                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setCapturedImage(reader.result);
                              };
                              reader.readAsDataURL(file);
                            }`;

const uploadReplace2 = `                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = (e) => {
                                const img = new Image();
                                img.onload = () => {
                                  const canvas = document.createElement('canvas');
                                  let w = img.width; let h = img.height; const max = 800;
                                  if (w > h && w > max) { h *= max/w; w = max; }
                                  else if (h > max) { w *= max/h; h = max; }
                                  canvas.width = w; canvas.height = h;
                                  const ctx = canvas.getContext('2d');
                                  ctx.drawImage(img, 0, 0, w, h);
                                  setCapturedImage(canvas.toDataURL('image/jpeg', 0.7));
                                };
                                img.src = e.target.result;
                              };
                              reader.readAsDataURL(file);
                            }`;
appCode = appCode.replace(uploadTarget2, uploadReplace2);

appCode = appCode.replace(/\n/g, '\r\n');
fs.writeFileSync('src/App.jsx', appCode, 'utf8');
console.log('App.jsx compression fixed');
