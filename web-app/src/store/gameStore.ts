import { create } from 'zustand';
import { getSudoku } from 'sudoku-gen';
import type { BoardState, Difficulty, CellData } from '../types/sudoku';

interface GameStore extends BoardState {
    // Actions
    startGame: (difficulty: Difficulty) => void;
    selectCell: (row: number, col: number) => void;
    setCellValue: (value: number | null, isNoteMode: boolean) => void;
    moveSelection: (rowDelta: number, colDelta: number) => void;
    undo: () => void;
    toggleNote: (value: number) => void;
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

    startGame: (difficulty) => {
        const { puzzle, solution } = getSudoku(difficulty);
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

    setCellValue: (value, isNoteMode) => {
        const { selectedCell, cells, status } = get();
        if (!selectedCell || status !== 'playing') return;

        const { row, col } = selectedCell;
        const cell = cells[row][col];

        if (cell.initial) return; // Cannot edit initial cells

        // Deep copy for immutability
        const newCells = cells.map(r => r.map(c => ({ ...c })));
        const target = newCells[row][col];

        if (isNoteMode && value !== null) {
            // Toggle note
            if (target.notes.includes(value)) {
                target.notes = target.notes.filter(n => n !== value);
            } else {
                target.notes = [...target.notes, value].sort();
            }
        } else {
            // Set Value
            // If same value, clear it (toggle off)
            target.value = target.value === value ? null : value;
            target.notes = []; // Clear notes if value set
        }

        set({ cells: newCells });
        // TODO: Add validation check here or history push
    },

    undo: () => {
        // Implementation needed later
    },

    toggleNote: (val) => {
        // implementation via setCellValue wrapper usually
    }
}));
