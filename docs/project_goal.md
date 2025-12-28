# Project Goal

**To build the most aesthetically pleasing, responsive, and feature-rich Sudoku Web Application.**

## Vision
The goal is to move away from the "legacy" desktop-style application to a modern, accessible web experience that feels premium and fluid.

## Targeted Features

### 1. Core Gameplay
- **Infinite Puzzles**: robust generation ensuring unique solutions.
- **Difficulty Levels**: Four distinct tiers:
    - **Easy**: For beginners.
    - **Medium**: Some logic required.
    - **Hard**: Complex patterns.
    - **Expert**: For master solvers.
- **Game State**:
    - **Timer**: Track solve time (with Pause/Resume).
    - **Mistake Counter**: Track errors (optional "Game Over" after 3 mistakes).
- **Victory State**: Rewarding animation and stats summary upon completion.

### 2. Controls & Input
- **Keyboard First**: Optimized for rapid entry.
    - Arrow keys / WASD for navigation.
    - Number keys for entry.
    - Backspace/Delete to clear.
    - Shortcuts (Ctrl+Z for Undo).
- **Mouse & Touch**: Full tap interactions for mobile/tablet users.
- **Undo/Redo**: Infinite history stack to step back through moves.
- **Notes Mode (Pencil)**:
    - Toggleable mode to annotate possible numbers in a cell.
    - Smart Note Updates: Option to auto-remove notes when conflicting number is placed.

### 3. Smart Assistance
- **Hints**:
    - **Smart Hint**: Fills the next logical cell and explains *why* (if possible) or just fills a random cell.
- **Highlighting System**:
    - **Selection**: Clear indication of active cell.
    - **Relations**: Subtle highlighting of the current Row, Column, and 3x3 Box.
    - **Number Matching**: When a number (e.g., '5') is selected, highlight all other '5's on the board.
- **Validation**:
    - **Real-time Error**: Highlight invalid moves immediately in red (Toggleable).

### 4. Aesthetics & Polish (The "Wow" Factor)
- **Theme System**:
    - **Dark Mode** (Default): Deep slate/blue, glass effects, glowing accents.
    - **Light Mode**: Clean, high-contrast paper style.
- **Responsive Design**:
    - Layout adapts seamlessly from Desktop (Landscape) to Mobile (Portrait).
- **Animations**:
    - Smooth transitions for number placement.
    - Ripple effects on interaction.
    - Victory confetti/fireworks.

### 5. Technical Requirements
- **Persistence**: Auto-save progress to LocalStorage so users never lose a game.
- **Performance**: Instant load times (Vite) and 60fps animations.
