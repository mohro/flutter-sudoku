# Zen Sudoku

A modern, keyboard-first Sudoku application built with React, Vite, and Tailwind CSS.
Features a premium aesthetic, VIM-style navigation, and robust game logic.

![Sudoku App Screenshot](public/screenshot.png)

## Features

- **Infinite Puzzles**: Generates unique puzzles with 4 difficulty levels.
- **Keyboard First**: Optimized for power users.
    - `H`/`J`/`K`/`L` for navigation.
    - `G` for coordinate jumps ("Go To").
    - `B` for box jumps.
- **Assistance Tools**:
    - **Notes Mode**: Annotate cells with pencil marks (`N`).
    - **Validation**: Check for errors in real-time or on demand (`V`).
    - **Undo**: Infinite undo history (`U`).
- **Game Logic**:
    - Real-time Timer.
    - Win detection with victory screen.
    - Difficulty selection (Easy, Medium, Hard, Expert).

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3
- **State**: Zustand
- **Icons**: Lucide React
- **Engine**: sudoku-gen

## Installation

1.  Navigate to the directory:
    ```bash
    cd web-app
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start development server:
    ```bash
    npm run dev
    ```

## Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| **Arrows** | Move Selection |
| **H / J / K / L** | Left / Down / Up / Right |
| **1 - 9** | Enter Number / Toggle Note |
| **Backspace / Del** | Clear Cell |
| **U** | Undo |
| **N** | Toggle Notes Mode |
| **V** | Toggle Validation |
| **G** | **GoTo Cell** (Follow with `Row` + `Col`) |
| **B** | **GoTo Box** (Follow with `1-9`) |
| **Esc** | Cancel Command |

---
*Created as part of the Sudoku Rewrite Project.*
