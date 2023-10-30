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

  int count(List<int> list, int value) {
    return list.fold(
        0,
        (previousValue, element) =>
            element == value ? previousValue + 1 : previousValue);
  }

  bool isValidInRow(int row, int col, int value) {
    return count(reference.board.getRow(row), value) <= 1;
  }

  bool isValidInColumn(int row, int col, int value) {
    return count(reference.board.getColumn(col), value) <= 1;
  }

  bool isValidInBox(int row, int col, int value) {
    return count(reference.board.getBox(r: row, c: col), value) <= 1;
  }

  bool isValid(int row, int col, int value) {
    return isValidInBox(row, col, value) &&
        isValidInColumn(row, col, value) &&
        isValidInRow(row, col, value);
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
