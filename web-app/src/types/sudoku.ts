export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface CellData {
    row: number;
    col: number;
    value: number | null;     // The current value (user or initial)
    initial: boolean;         // Is this a pre-filled cell?
    notes: number[];          // Pencil marks
    isValid: boolean;         // For real-time validation
}

export interface BoardState {
    cells: CellData[][];
    difficulty: Difficulty;
    status: 'playing' | 'won' | 'paused';
    timer: number;
    selectedCell: { row: number, col: number } | null;
    history: CellData[][][]; // Simple history stack
    solution: string | null;  // We might store the solution string for validation
}
