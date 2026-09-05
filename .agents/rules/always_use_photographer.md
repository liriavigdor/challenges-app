---
name: always-use-photographer
description: MANDATORY RULE - Always use 'The Photographer' (local Puppeteer script) to capture screenshots after UI changes. NEVER use browser_subagent.
---

# Always Use The Photographer (No Browser Subagent)

## MANDATORY DIRECTIVE
1. **NEVER use `browser_subagent`**: It is strictly forbidden.
2. **ALWAYS use `the-photographer`**: After ANY visual or UI modification, you MUST run local Puppeteer screenshot scripts via `run_command` (e.g. `node scratch/screenshot.cjs` or `node scratch/screenshot_all_tabs.cjs`).
3. **Inspect the Visual Evidence**: Inspect the captured screenshot using `view_file` before delivering any UI work to the user.
