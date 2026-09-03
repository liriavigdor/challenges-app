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

## 4. Polish Verification Protocol
Before marking any UI task as complete, you MUST verify:
- **Contrast**: Check contrast levels for readability.
- **Consistency**: Ensure consistent rounded corners (`rounded-xl` or predefined tokens) across all cards/modals.
- **Micro-Interactions**: Verify all interactive elements have transition duration (e.g., `duration-200`) and appropriate hover/active states.
