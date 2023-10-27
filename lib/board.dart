import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:sudoku/cell.dart';
import 'package:sudoku/sudoku.dart';
import 'package:sudoku/utils.dart';

class SudokuBoard extends StatefulWidget {
  final int rows = 9, cols = 9;
  @override
  State<SudokuBoard> createState() => _SudokuBoardState();
}

class _SudokuBoardState extends State<SudokuBoard> with Box {
  late List<List<FocusNode>> focusNodes;
  SelectedCell selectedCell = SelectedCell();

  final Map<ShortcutActivator, Intent> _shortcutMap =
      const <ShortcutActivator, Intent>{
    SingleActivator(LogicalKeyboardKey.arrowDown): NavigateIntent(1, 0),
    SingleActivator(LogicalKeyboardKey.keyJ): NavigateIntent(1, 0),
    SingleActivator(LogicalKeyboardKey.arrowUp): NavigateIntent(-1, 0),
    SingleActivator(LogicalKeyboardKey.arrowLeft): NavigateIntent(0, -1),
    SingleActivator(LogicalKeyboardKey.arrowRight): NavigateIntent(0, 1),
  };

  late Map<Type, Action<Intent>> _actions;

  @override
  void initState() {
    super.initState();
    focusNodes = initFocusNodes();
    _actions = <Type, Action<Intent>>{
      NavigateIntent: NavigateAction(selectedCell, focusNodes),
    };
  }

  List<List<FocusNode>> initFocusNodes() {
    return List.generate(
        widget.rows,
        (row) => List.generate(
            widget.cols, (col) => FocusNode(debugLabel: "$row$col")));
  }

  @override
  void dispose() {
    for (var row in focusNodes) {
      for (var node in row) {
        node.dispose();
      }
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
            create: (context) => Sudoku.newGame(Difficulty.expert)),
        ChangeNotifierProvider(create: (context) => selectedCell)
      ],
      child: FocusableActionDetector(
        shortcuts: _shortcutMap,
        actions: _actions,
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
      ),
    );
  }

  List<Widget> generateRow(int cols, Size boxSize, int row) {
    return [
      for (int col = 0; col < cols; col++)
        ColoredCell(
            boxSize: boxSize,
            box: calculateBox(row, col),
            row: row,
            col: col,
            focusNode: focusNodes[row][col])
    ];
  }
}

class NavigateIntent extends Intent {
  const NavigateIntent(this.row, this.col);

  final int row, col;
}

class NavigateAction extends Action<NavigateIntent> {
  NavigateAction(this.model, this.focusNodes);

  List<List<FocusNode>> focusNodes;
  final SelectedCell model;

  @override
  void invoke(covariant NavigateIntent intent) {
    if (model.move(intent.row, intent.col)) {
      focusNodes[model.row][model.col].requestFocus();
    }
  }
}
