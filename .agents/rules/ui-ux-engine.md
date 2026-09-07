---
name: ui-ux-engine
description: Use this rule to strictly enforce Production-Ready UI/UX principles, Component Locking, Context Feeding, and Tailwind/Shadcn standards on all frontend generation.
---

# Production-Ready UI/UX Engine

You are generating frontend code for a premium web application. You must strictly adhere to the following guidelines. Failure to do so will result in sub-standard code, which is unacceptable.

## 1. Core Libraries (The Stack)
When generating UI code, always import and use components/tokens from:
- **shadcn/ui**: Base primitives (`Button`, `Card`, `Dialog`, `Input`, `DropdownMenu`). 
- **lucide-react**: Clean, consistent icon set (`lucide-react`).
- **framer-motion**: Layout animations and micro-interactions.
- **clsx / tailwind-merge**: Conditional dynamic classes (`cn()` utility).

## 2. Strict Design Constraints
1. **Never reinvent defaults:** Always use predefined design tokens (e.g., `bg-background`, `text-foreground`, `border-border`, `accent-primary`).
2. **Component Locking:** Reuse existing custom components from `src/components/ui/` instead of writing raw HTML elements. Do not reinvent standard UI patterns.
3. **Responsive & Accessible:** Every layout must use flexible CSS grids/flexbox (e.g., `gap-4`, `p-6`) and include clear focus rings (`focus-visible:ring-2`).
4. **State Machine UI:** Always handle and design for 4 mandatory states: 
   - `Initial`
   - `Hover/Active`
   - `Loading (Skeletons)`
   - `Error/Empty`

## 3. Context Feeding (Crucial for avoiding Hallucinations)
To ensure you use external libraries correctly without inventing broken syntax:
1. **Reference Files**: When building a new component, **always** check `src/components/ui/examples/` for a reference component (e.g., shadcn, Aceternity). Use it as a reference for style and architecture.
2. **Library Documentation**: If using a new library, rely strictly on official documentation or types.
3. **Use Official CLI**: Always use official package installation commands (like `npx shadcn@latest add [component]`) rather than trying to write complex off-the-shelf components from scratch. Let the tools do the heavy lifting.

## 4. Extreme Pixel-Perfect QA (The Micro-to-Macro Framework)
Before marking any UI task as complete, you MUST invoke 'The Photographer' to capture screenshots and 'The Professor' to review them. You must use the **Micro-to-Macro** logical scanning method to identify aesthetic flaws:

### Step 1: The Micro Level (Inner Elements & Proportions)
- **Icons & Text inside Buttons/Badges**: Are icons perfectly centered vertically and horizontally relative to the text? Is the padding equal on both sides?
- **Typography & RTL**: Are numbers in RTL (like fractions or percentages) rendering correctly without flipping? 
- **Corners & Boundaries**: Do rounded corners (`border-radius`) clip or touch inner content? (e.g., check if a 24px corner radius cuts into a badge placed in the corner).

### Step 2: The Component Level (Cards, Rows, Containers)
- **Spacing & Gaps**: Is the gap between elements uniform? (e.g., all flex rows using `gap-3` consistently). 
- **Alignment**: Are flex items aligned securely on the same axis (`items-center`, `baseline`) without drifting up or down?
- **Overflow**: Is any content spilling out of the card bounds or triggering unwanted scrollbars?

### Step 3: The Macro Level (Page Layout & Hierarchy)
- **Visual Weight**: Is the primary Call-To-Action immediately obvious? Does the hierarchy flow naturally?
- **Breathing Room**: Is there enough whitespace (padding/margins) between distinct sections of the page?

**Action:** If ANY flaw is detected at ANY level during the scan, fix the underlying code, recapture the screenshot, and restart the Micro-to-Macro scan. Do NOT present the output until it passes perfectly.
