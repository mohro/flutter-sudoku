# Zen Sudoku - Codebase Walkthrough

This document explains the technical implementation of the application. It is designed to help you understand how the pieces fit together.

## 1. High Map: Architecture
The app follows a standard **React + Vite** structure with **Zustand** for state management.

```
src/
├── components/
│   ├── board/       # The Grid and Cells
│   ├── game/        # Controls, Modals
│   └── layout/      # Main UI Wrapper
├── store/           # Game Logic (Zustand)
├── types/           # TS Interfaces
└── utils/           # Helper logic (Generators)
```

## 2. The Brain: `gameStore.ts`
The entire game state lives in `useGameStore`. It's a "Global Single Source of Truth".

- **State**: Holds `cells` (81 items), `timer`, `status` (playing/won), and `history` (for Undo).
- **Actions**:
    - `startGame(difficulty)`: Generates a puzzle string using `sudoku-gen`, parses it into `CellData` objects, and sets up the board.
    - `setCellValue(value)`: The core modification logic. It handles:
        - **History**: Pushes current state to `history` stack before changing.
        - **Immutable Update**: Creates a deep copy of the `cells` grid.
        - **Notes vs Value**: Checks `isNoteMode` to decide whether to write a big number or a small pencil mark.
        - **Validation**: If `validateMode` is on, immediately checks if the value matches the `solution`.
        - **Win Check**: After every move, checks if the board is full and matches the solution string.

## 3. The View: `Board.tsx`
This component does two things: **Renders the Grid** and **Listens for Inputs**.

- **Rendering**: It maps the 9x9 `cells` array into 81 `<Cell />` components. It handles the "Glassmorphism" container styling.
- **Input Handling**: The `useEffect` that listens to `window.addEventListener('keydown')` is here.
    - **Navigation**: Maps Arrow keys and VIM keys (`h,j,k,l`) to the `moveSelection` action.
    - **Command Buffer**: This is the "magic" behind the `g` (GoTo) and `b` (Box) commands.
        - When you press `g`, `cmdMode` state switches to `'goto'`.
        - The next two number keys are captured into `cmdBuffer`.
        - Once buffer has 2 digits, it executes `selectCell(row, col)`.

## 4. The Atom: `Cell.tsx`
A "dumb" component that purely renders data based on props.
- **Styling**: Uses `clsx` to conditionally apply Tailwind classes.
    - *Selected*: Blue border/glow.
    - *Related*: (Same row/col/value) Subtle highlight.
    - *Error*: Red background (if `isValid` is false).
    - *Initial*: Bold/White (cannot be edited).

## 5. visual-polish: Tailwind
We use `index.css` only for global resets. Everything else is utility classes.
- **Dark Mode**: We use Slate-900/800 backgrounds.
- **Glassmorphism**: `bg-slate-800/40 backdrop-blur-sm border-white/10`. This creates the modern "frosted glass" look.
