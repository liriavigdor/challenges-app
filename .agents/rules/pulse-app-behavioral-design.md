# Pulse App Behavioral Design Patterns

When refactoring or building the layout and data architecture for the Pulse App, you must apply the following industry-standard Behavioral Design Patterns to maximize engagement and minimize cognitive load:

## 1. The Hook Model Architecture (Card Anatomy)
- **Trigger (Top)**: Highlight time-sensitivity or streak status (e.g., "🔥 רצף 5 ימים - בסכנה" or "XP 600+").
- **Action (Bottom)**: Provide a single high-visibility Primary CTA (`+1` or `תעד עכשיו`) with zero tap friction.
- **Reward (Center)**: Large, highly visible progress metric (`42 / 100 ק"מ`) paired with an animated/glowing progress bar.

## 2. Progressive Disclosure (De-cluttering)
- **Default Card View**: Show ONLY 3 core elements: Challenge Title, Primary Progress Metric + Bar, and Primary Action Button.
- **Hidden Metadata**: Hide secondary metadata (detailed participant list, breakdown stats) inside an expandable drawer or secondary toggle to keep the main feed clean.

## 3. Gamification & Loss Aversion
- **Visual Indicators**: Structure streaks and ranks using visual indicators (Gold/Teal Badges, flame icons) rather than plain text.
- **Tabular Figures**: Emphasize tabular numeric figures (using CSS `font-feature-settings: "tnum"`) so metrics align with mathematical precision.
