import 'dart:math';
import 'package:flutter/material.dart';
import 'package:sudoku/cell.dart';
import 'package:sudoku/sudoku.dart';

class SudokuBoard extends StatefulWidget {
  @override
  State<SudokuBoard> createState() => _SudokuBoardState();
}

class _SudokuBoardState extends State<SudokuBoard> with Box{
  late Sudoku sudoku;
  _SudokuBoardState() {
    sudoku = Sudoku.newGame(Difficulty.expert);
  }

  @override
  Widget build(BuildContext context) {
    int cols = 9;
    int rows = 9;
    return Center(
      child: LayoutBuilder(
        builder: (_, constraints) {
          double size =
              min(constraints.maxWidth / cols, constraints.maxHeight / rows);
          final boxSize = Size(size, size);

          return Column(
            children: [
              for (int row = 0; row < rows; row++)
                Row(
                  children: generateRow(cols, boxSize, row),
                )
            ],
          );
        },
      ),
    );
  }

  List<Widget> generateRow(int cols, Size boxSize, int row) {
    return [
      for (int col = 0; col < cols; col++)
        ColoredCell(boxSize: boxSize, box: box(row, col), sudoku: sudoku, row: row, col: col)
    ];
  }
}
