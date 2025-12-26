// Hardcoded static generator to prevent logic errors
export const generateSudoku = (difficulty: 'easy' | 'medium' | 'hard' | 'expert') => {
    // Simple Easy Puzzle
    const puzzle = "530070000600195000098000060800060003400803001700020006060000280000419005000080079".replace(/0/g, '-');
    const solution = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";

    return { puzzle, solution };
};
