# Architecture & Project Structure

## Overview
This project is a **Modern Web Application** implementation of Sudoku, replacing the original Flutter prototype. It is built to be fast, responsive, and aesthetically premium.

## Tech Stack
- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Sudoku Logic**: `sudoku-gen` (Library)

## Codebase Structure (`web-app/`)

```
web-app/
├── public/              # Static assets (favicons, etc.)
├── src/
│   ├── components/      # React Components
│   │   ├── board/       # Board-specific components
│   │   │   ├── Board.tsx   # 9x9 Grid Container
│   │   │   └── Cell.tsx    # Individual Cell Logic/Rendering
│   │   └── layout/      # Layout wrappers
│   │       └── Layout.tsx  # Main app container with backgrounds
│   ├── store/           # Global State Management
│   │   └── gameStore.ts    # Zustand store (Game Logic, Actions)
│   ├── types/           # TypeScript Definitions
│   │   └── sudoku.ts       # Interfaces for Cell, Board, etc.
│   ├── App.tsx          # Main Entry Component
│   ├── main.tsx         # React DOM Root
│   └── index.css        # Global Styles & Tailwind Directives
├── tailwind.config.js   # Tailwind Configuration
└── package.json         # Dependencies & Scripts
```

## Key Components

### Game Store (`gameStore.ts`)
The brain of the application. It holds the `cells` array (81 items), current `difficulty`, selection state, and handles all logic:
- `startGame(difficulty)`: Generates a new puzzle.
- `setCellValue(val)`: Updates a cell value or toggles notes.
- `moveSelection(dx, dy)`: Handles keyboard navigation.

### Board (`Board.tsx`)
The visual representation. It connects to the store to render the 9x9 grid. It also listens for global **Keyboard Events** to trigger actions in the store.

### Cell (`Cell.tsx`)
A purely presentational component that derives its valid/invalid/highlighted state from the props and store data. It handles click interactions.
