# Math Master Game Specification

## Overview

Math Master is a mobile-first, browser-based educational game for children (ages 6-12) to practice arithmetic (addition, subtraction, multiplication, division). The game is fully client-side, uses Bootstrap for layout, and stores progress in localStorage.

## Design References

**All UI/UX design and layout MUST strictly follow the provided design screenshots:**
- Home: `home.png`
- Levels: `levels.png`
- Settings: `settings.png`
- Header Menu: `header_menu.png`

AI coding agents MUST refer to these files for all visual and interaction details.

## Tabs & Layout

### Home Tab

- Persistent header: icons for Home, Levels, Settings (top), text labels (bottom)
- Row 2: displays current score and level
- Row 3: shows current math question and answer input
- Persistent footer: with "Made with ❤️ by Devnodes.in"
- **Refer to `home.png` for layout and UI details.**

### Settings Tab

- Name input box
- Current level and score display
- "Reset" button (btn-danger) to clear localStorage
- **Refer to `settings.png` for layout and UI details.**

### Levels Tab

- List of levels; selecting a level auto-generates math questions
- Player can switch levels at any time
- Last played level is loaded from localStorage on next visit; new users start at level 1
- **Refer to `levels.png` for layout and UI details.**

#### Level Types

- Addition: 1 digit × 2 numbers
- Addition: 2 digit × 2 numbers
- Addition: 2 digit × 3-4 numbers
- Addition: 3-4 digit × 2 numbers
- Addition: 3-4 digit × 3-4 numbers
- Subtraction: 1 digit × 2 numbers
- Subtraction: 2 digit × 2 numbers
- Subtraction: 2 digit × 2 numbers (borrowing)
- Subtraction: 3-4 digit × 2 numbers
- Subtraction: 3-4 digit × 2 numbers (borrowing)
- Multiplication: 1 digit × 1 digit
- Multiplication: 2 digit × 1 digit
- Multiplication: 2 digit × 2 digit
- Multiplication: 3-4 digit × 1 digit
- Division: 1 digit ÷ 1 digit
- Division: 2 digit ÷ 1 digit
- Division: 2 digit ÷ 2 digit

## Game Rules & Requirements

- Generates random math problems using addition (+), subtraction (−), multiplication (×), division (÷)
- Division problems always have whole number answers (no decimals/remainders)
- User can switch levels freely
- Text input field for answers; only accepts numbers (0-9)
- "Submit" button and Enter key both validate answers
- Immediate visual feedback within 200ms of answer submission
- Correct answers show encouraging messages: "Wow!", "Super!", "Excellent!", "Great!", etc.
- Incorrect answers show positive messages: "Nice try!", "Try again!", etc. (no discouragement)
- Progress, score, and last level are saved in localStorage
- **All question sums MUST be presented in a schoolbook style similar to standard textbooks:**
  - Row 1: `{ 12 }`
  - Row 2: `{+ 5}`
  - -----------
  - Text box for answer
  - -----------
  - Submit button
- **All UI/UX elements MUST match the design screenshots referenced above.**

## Technical Constraints

- Fully mobile-first, responsive design (320px+)
- Uses Bootstrap 5.3 for layout and icons
- No external libraries, frameworks, or build tools
- No backend/server code; works offline after first load
- All custom styles in `main.css`; all scripts in `scripts.js`
- No inline styles or scripts
- Accessible: large fonts, touch-friendly buttons, keyboard navigation

## Data & Persistence

- All progress and settings stored in localStorage
- Reset button clears all saved data

## Extensibility

- Level and question generation logic is modular for easy future expansion
