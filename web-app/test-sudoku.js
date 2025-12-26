import { getSudoku } from 'sudoku-gen';

try {
  console.log("Testing sudoku-gen...");
  const puzzle = getSudoku('easy');
  console.log("Success!");
  console.log("Puzzle:", puzzle.puzzle);
  console.log("Solution:", puzzle.solution);
} catch (error) {
  console.error("FAILED to run sudoku-gen:", error);
}
