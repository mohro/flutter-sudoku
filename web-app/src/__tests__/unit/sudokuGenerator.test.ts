import { describe, it, expect } from 'vitest';
import { getSudoku } from 'sudoku-gen';

describe('sudokuGenerator (sudoku-gen library)', () => {
    it('generates a valid puzzle string of length 81', () => {
        const { puzzle, solution } = getSudoku('easy');
        expect(puzzle.length).toBe(81);
        expect(solution.length).toBe(81);
    });

    it('generates different puzzles for different difficulties', () => {
        const easy = getSudoku('easy');
        const expert = getSudoku('expert');
        expect(easy.puzzle).not.toBe(expert.puzzle);
    });

    it('solution and puzzle matches on non-empty cells', () => {
        const { puzzle, solution } = getSudoku('medium');
        for (let i = 0; i < 81; i++) {
            if (puzzle[i] !== '-' && puzzle[i] !== '.') {
                expect(puzzle[i]).toBe(solution[i]);
            }
        }
    });
});
