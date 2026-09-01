const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Replace the step indicator
const stepIndicatorRegex = /\{\/\* Step indicator \*\/\}\s*<div style=\{\{ display: "flex", justifyContent: "space-around".*?direction: "rtl", padding: "0 0\.5rem" \}\}>\s*<div style=\{\{.*?\}\}>1\. תמונות 🖼️<\/div>\s*<div style=\{\{.*?\}\}>2\. פסקול 🎵<\/div>\s*<div style=\{\{.*?\}\}>3\. פרטים 📝<\/div>\s*<\/div>/s;

const newStepIndicator = `{/* Step indicator */}
                <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "1.5rem", direction: "rtl", padding: "0 0.5rem" }}>
                  <div onClick={() => setCreationStep(1)} style={{ cursor: "pointer", fontWeight: creationStep === 1 ? "bold" : "normal", color: creationStep === 1 ? "var(--accent)" : "var(--text-muted)", borderBottom: creationStep === 1 ? "2px solid var(--accent)" : "none", paddingBottom: "4px" }}>1. תמונות 🖼️</div>
                  <div onClick={() => {
                    if (newChallengeImages.length === 0) {
                      alert("אנא בחר לפחות תמונה אחת כדי להמשיך.");
                      return;
                    }
                    setCreationStep(2);
                  }} style={{ cursor: "pointer", fontWeight: creationStep === 2 ? "bold" : "normal", color: creationStep === 2 ? "var(--accent)" : "var(--text-muted)", borderBottom: creationStep === 2 ? "2px solid var(--accent)" : "none", paddingBottom: "4px" }}>2. פרטים 📝</div>
                </div>`;

code = code.replace(stepIndicatorRegex, newStepIndicator);

// 2. Remove Step 2 (Soundtrack) entirely by slicing between Step 2 and Step 3 markers
const startMarker = "{/* Step 2: Soundtrack */}";
const endMarker = "{/* Step 3: Details */}";
const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
  code = code.substring(0, startIndex) + code.substring(endIndex);
}

// 3. Rename Step 3 to Step 2
code = code.replace(/\{\/\* Step 3: Details \*\/\}\s*\{creationStep === 3 && \(/, '{/* Step 2: Details */}\n                    {creationStep === 2 && (');

// 4. Update the buttons logic at the bottom of the form
code = code.replace(/\{creationStep === 3 \? \(/g, '{creationStep === 2 ? (');
code = code.replace(/\{creationStep < 3 \? \(/g, '{creationStep < 2 ? (');

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log("Successfully removed Soundtrack step and updated logic.");
