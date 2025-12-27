import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from '../../store/gameStore';

// Mock sudoku-gen
vi.mock('sudoku-gen', () => ({
    getSudoku: vi.fn(() => ({
        puzzle: '123456789'.repeat(9).replace(/1/g, '-'), // 9 empty cells
        solution: '123456789'.repeat(9)
    }))
}));

describe('gameStore', () => {
    beforeEach(() => {
        // Reset store state before each test if possible
        // Zustand stores usually need a manual reset or a fresh instance
    });

    it('initializes with default values', () => {
        const state = useGameStore.getState();
        expect(state.status).toBe('playing');
        expect(state.difficulty).toBe('easy');
        expect(state.isNoteMode).toBe(false);
    });

    it('selects a cell correctly', () => {
        const { selectCell } = useGameStore.getState();
        selectCell(2, 3);
        expect(useGameStore.getState().selectedCell).toEqual({ row: 2, col: 3 });
    });

    it('toggles note mode', () => {
        const { toggleNoteMode } = useGameStore.getState();
        const initialMode = useGameStore.getState().isNoteMode;
        toggleNoteMode();
        expect(useGameStore.getState().isNoteMode).toBe(!initialMode);
    });

    it('sets a cell value', () => {
        const { startGame, selectCell, setCellValue } = useGameStore.getState();
        startGame('easy'); // Initialize board
        selectCell(0, 0);

        // Check if cell is editable (not initial)
        const cell = useGameStore.getState().cells[0][0];
        if (!cell.initial) {
            setCellValue(5);
            expect(useGameStore.getState().cells[0][0].value).toBe(5);
        }
    });

    it('undoes the last value change', () => {
        const { startGame, selectCell, setCellValue, undo } = useGameStore.getState();
        startGame('easy');
        selectCell(0, 0);

        const cell = useGameStore.getState().cells[0][0];
        if (cell.initial) return;

        setCellValue(5);
        expect(useGameStore.getState().cells[0][0].value).toBe(5);

        undo();
        expect(useGameStore.getState().cells[0][0].value).toBe(null);
    });

    it('validates a cell value when validateMode is on', () => {
        const { startGame, selectCell, setCellValue, toggleValidation } = useGameStore.getState();
        startGame('easy');
        toggleValidation(); // Turn on validation

        selectCell(0, 0);
        const cell = useGameStore.getState().cells[0][0];
        if (cell.initial) return;

        // Set incorrect value
        const solVal = parseInt(useGameStore.getState().solution![0]);
        const wrongVal = solVal === 9 ? 1 : solVal + 1;

        setCellValue(wrongVal);
        expect(useGameStore.getState().cells[0][0].isValid).toBe(false);

        // Set correct value
        setCellValue(solVal);
        expect(useGameStore.getState().cells[0][0].isValid).toBe(true);
    });
});
