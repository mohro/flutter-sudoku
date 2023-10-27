import 'dart:math';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sudoku/cell.dart';
import 'package:sudoku/sudoku.dart';

class SudokuBoard extends StatefulWidget {
  final int rows = 9, cols = 9;
  @override
  State<SudokuBoard> createState() => _SudokuBoardState();
}

class _SudokuBoardState extends State<SudokuBoard> with Box {
  var focusNodes;
  @override
  void initState() {
    super.initState();
    focusNodes = List.generate(
        widget.rows,
        (row) => List.generate(
            widget.cols, (col) => FocusNode(debugLabel: "$row$col")));
  }

  @override
  void dispose() {
    focusNodes.forEach((row) => {row.forEach((node) => node.dispose())});
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => Sudoku.newGame(Difficulty.expert),
      child: Center(
        child: LayoutBuilder(
          builder: (_, constraints) {
            double size = min(constraints.maxWidth / widget.cols,
                constraints.maxHeight / widget.rows);
            final boxSize = Size(size, size);

            return Column(
              children: [
                for (int row = 0; row < widget.rows; row++)
                  Row(
                    children: generateRow(widget.cols, boxSize, row),
                  )
              ],
            );
          },
        ),
      ),
    );
  }

  List<Widget> generateRow(int cols, Size boxSize, int row) {
    return [
      for (int col = 0; col < cols; col++)
        ColoredCell(
            boxSize: boxSize,
            box: box(row, col),
            row: row,
            col: col,
            focusNode: focusNodes[row][col])
    ];
  }
}
