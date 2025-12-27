import { create } from 'zustand';
import { getSudoku } from 'sudoku-gen';
import type { BoardState, Difficulty, CellData } from '../types/sudoku';

interface GameStore extends BoardState {
    isNoteMode: boolean;
    // Actions
    startGame: (difficulty: Difficulty) => void;
    selectCell: (row: number, col: number) => void;
    setCellValue: (value: number | null, isNoteMode?: boolean) => void;
    moveSelection: (rowDelta: number, colDelta: number) => void;
    undo: () => void;
    toggleNoteMode: () => void;
    tickTimer: () => void;
    toggleValidation: () => void; // User toggle
    validateMode: boolean; // State
    toggleGuides: () => void;
    showGuides: boolean;
}

const createCell = (row: number, col: number, value: number | null, initial: boolean): CellData => ({
    row,
    col,
    value,
    initial,
    notes: [],
    isValid: true,
});

export const useGameStore = create<GameStore>((set, get) => ({
    cells: [],
    difficulty: 'easy',
    status: 'playing',
    timer: 0,
    selectedCell: null,
    history: [],
    solution: null,
    isNoteMode: false,
    validateMode: false, // Default off
    showGuides: false,

    startGame: (difficulty) => {
        let { puzzle, solution } = getSudoku(difficulty);

        // DEBUG: Make it almost solved
        if (true) {
            const solArr = solution.split('');
            // Hide 3 random cells
            for (let i = 0; i < 3; i++) {
                const idx = Math.floor(Math.random() * 81);
                solArr[idx] = '-';
            }
            puzzle = solArr.join('');
        }

        const newCells: CellData[][] = [];

        // Parse specific string format from sudoku-gen (81 chars)
        // puzzle: '-', '1-9'; solution: '1-9'
        let index = 0;
        for (let r = 0; r < 9; r++) {
            const row: CellData[] = [];
            for (let c = 0; c < 9; c++) {
                const char = puzzle[index];
                const val = char === '-' || char === '.' ? null : parseInt(char); // sudoku-gen uses '-' or '.' depending on version, usually '-'
                row.push(createCell(r, c, val, val !== null));
                index++;
            }
            newCells.push(row);
        }

        set({
            cells: newCells,
            difficulty,
            status: 'playing',
            timer: 0,
            selectedCell: { row: 0, col: 0 },
            history: [],
            solution
        });
    },

    selectCell: (row, col) => set({ selectedCell: { row, col } }),

    moveSelection: (dx, dy) => {
        const { selectedCell } = get();
        if (!selectedCell) return;

        const newRow = Math.max(0, Math.min(8, selectedCell.row + dx));
        const newCol = Math.max(0, Math.min(8, selectedCell.col + dy));
        set({ selectedCell: { row: newRow, col: newCol } });
    },

    setCellValue: (value, modeOverride) => {
        const { selectedCell, cells, status, history, isNoteMode } = get();
        if (!selectedCell || status !== 'playing') return;

        const { row, col } = selectedCell;
        const cell = cells[row][col];

        if (cell.initial) return; // Cannot edit initial cells

        // 1. Capture History (Deep Copy)
        const newHistory = [...history, cells.map(r => r.map(c => ({ ...c })))];
        if (newHistory.length > 50) newHistory.shift(); // Limit history

        // 2. Modify State
        const newCells = cells.map(r => r.map(c => ({ ...c })));
        const target = newCells[row][col];

        const effectiveMode = modeOverride !== undefined ? modeOverride : isNoteMode;

        if (effectiveMode && value !== null) {
            // Toggle note
            if (target.notes.includes(value)) {
                target.notes = target.notes.filter(n => n !== value);
            } else {
                target.notes = [...target.notes, value].sort();
            }
        } else {
            // Set Value
            target.value = target.value === value ? null : value;
            target.notes = []; // Clear notes if value set

            // Validation check
            const { validateMode, solution } = get();
            if (validateMode && solution && target.value !== null) {
                const solVal = parseInt(solution[row * 9 + col]);
                target.isValid = target.value === solVal;
            } else {
                target.isValid = true;
            }
        }

        // 3. Check Win Condition
        const isFull = newCells.every(r => r.every(c => c.value !== null));

        if (isFull) {
            // Compare with solution
            const currentString = newCells.map(r => r.map(c => c.value).join('')).join('');
            const { solution } = get();

            if (currentString === solution) {
                set({ cells: newCells, history: newHistory, status: 'won' });
                return;
            }
        }

        set({ cells: newCells, history: newHistory });
    },

    undo: () => {
        const { history } = get();
        if (history.length === 0) return;

        const previousCells = history[history.length - 1];
        const newHistory = history.slice(0, -1);

        set({ cells: previousCells, history: newHistory });
    },

    toggleNoteMode: () => set(state => ({ isNoteMode: !state.isNoteMode })),

    tickTimer: () => set(state => {
        if (state.status !== 'playing') return {};
        return { timer: state.timer + 1 };
    }),

    toggleValidation: () => set(state => {
        const newMode = !state.validateMode;
        // Re-calculate validity for all cells when toggled on
        if (newMode) {
            const { cells, solution } = state;
            if (!solution) return { validateMode: newMode };

            const newCells = cells.map((row, r) => row.map((cell, c) => {
                // Simple validation: Compare with solution
                // (There are other ways like checking conflicts, but solution match is easiest/most robust)
                const solVal = parseInt(solution[r * 9 + c]);
                const isValid = cell.value === null || cell.value === solVal;
                return { ...cell, isValid };
            }));
            return { validateMode: newMode, cells: newCells };
        } else {
            // Reset validity to true (visuals off)
            const { cells } = state;
            const newCells = cells.map(r => r.map(c => ({ ...c, isValid: true })));
            return { validateMode: newMode, cells: newCells };
        }
    }),

    showGuides: false,
    toggleGuides: () => set(state => ({ showGuides: !state.showGuides }))
}));
