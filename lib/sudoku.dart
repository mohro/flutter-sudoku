import 'package:flutter/material.dart';
import 'package:tunning_sudoku/tunning_sudoku.dart';

class Sudoku extends ChangeNotifier {
  late SynchroSudoku reference;
  Sudoku(SynchroSudoku sudoku) {
    reference = sudoku;
  }

  static Sudoku newGame(Difficulty difficulty) {
    SynchroSudoku s =
        SudokuGenerator().getFromDifficulty(difficulty: difficulty.difficulty);
    s.board = s.clues.copy();
    return Sudoku(s);
  }

  int clue(int row, int col) {
    int result = reference.board.getCell(row, col);
    return result;
  }

  bool editable(int row, int col) {
    return reference.clues.getCell(row, col) == 0;
  }

  void solve(int row, int col, int value) {
    reference.board.setCell(row, col, value);
  }

  bool isValid(int row, int col, int value) {
    return reference.board.isValid(n: value, r: row, c: col);
  }
}

enum Difficulty {
  easy(sudokuDifficulty: SudokuDifficulty.easy),
  hard(sudokuDifficulty: SudokuDifficulty.hard),
  expert(sudokuDifficulty: SudokuDifficulty.expert),
  ;

  const Difficulty({
    required this.sudokuDifficulty,
  });

  final SudokuDifficulty sudokuDifficulty;

  SudokuDifficulty get difficulty => sudokuDifficulty;
}
