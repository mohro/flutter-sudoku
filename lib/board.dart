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
  SelectedCell selectedCell = SelectedCell();
  var selectedIndex = 0;

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
    _actions = <Type, Action<Intent>>{
      NavigateIntent: NavigateAction(selectedCell),
    };
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
        providers: [
          ChangeNotifierProvider(
              create: (context) => Sudoku.newGame(Difficulty.easy)),
          ChangeNotifierProvider(create: (context) => selectedCell)
        ],
        builder: (context, child) {
          return Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ButtonBar(
                // spacing: 8,
                // overflowAlignment: OverflowBarAlignment.center,
                alignment: MainAxisAlignment.start,
                children: <Widget>[
                  IconButton(
                      onPressed: () {
                        setState(() {
                          context.read<SelectedCell>().autoPopulateHints();
                        });
                      },
                      icon: Icon(Icons.note_add)),
                  IconButton(onPressed: () {}, icon: Icon(Icons.highlight)),
                ],
              ),
              FocusableActionDetector(
                shortcuts: _shortcutMap,
                actions: _actions,
                child: LayoutBuilder(
                  builder: (_, constraints) {
                    double size = min(constraints.maxWidth / widget.cols,
                        constraints.maxHeight / widget.rows);
                    final boxSize = Size(size, size);

                    return Focus(
                      autofocus: true,
                      onKey: (node, event) => handleKeyEvent(event, context),
                      child: Column(
                        children: [
                          for (int row = 0; row < widget.rows; row++)
                            Row(
                              children: generateRow(widget.cols, boxSize, row),
                            )
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        });
  }

  List<Widget> generateRow(int cols, Size boxSize, int row) {
    return [
      for (int col = 0; col < cols; col++)
        ColoredCell(
          boxSize: boxSize,
          box: calculateBox(row, col),
          row: row,
          col: col,
        )
    ];
  }

  KeyEventResult handleKeyEvent(RawKeyEvent event, BuildContext context) {
    if (ignoreEvent(context)) {
      return KeyEventResult.ignored;
    }

    String value = '';

    if (event.isControlPressed && isDigitKeyEvent(event)) {
      handleHintEvent(event);
    } else if (isDigitKeyEvent(event)) {
      setState(() {
        value = event.character.toString();
        context
            .read<Sudoku>()
            .solve(selectedCell.row, selectedCell.col, int.parse(value));
        context.read<SelectedCell>().changeValue(value);
      });
    } else if (isDeleteKeyEvent(event)) {
      setState(() {
        value = '';
        context.read<Sudoku>().solve(selectedCell.row, selectedCell.col, 0);
        context.read<SelectedCell>().changeValue(value);
      });
    }

    return KeyEventResult.ignored;
  }

  bool ignoreEvent(BuildContext context) {
    return !context.read<Sudoku>().editable(selectedCell.row, selectedCell.col);
  }

  bool isDigitKeyEvent(RawKeyEvent event) {
    return digitsOnly.hasMatch(event.character.toString());
  }

  bool isDeleteKeyEvent(RawKeyEvent event) {
    return event.logicalKey == LogicalKeyboardKey.backspace ||
        event.logicalKey == LogicalKeyboardKey.delete;
  }

  void handleHintEvent(RawKeyEvent event) async {
    int value = int.parse(event.character.toString());
    // String newValue = hints[value - 1] == '' ? value.toString() : '';
    setState(() {
      // hints[value - 1] = newValue;
    });
  }
}

class SudokuTopBar extends StatelessWidget {
  const SudokuTopBar({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return ButtonBar(
      // spacing: 8,
      // overflowAlignment: OverflowBarAlignment.center,
      alignment: MainAxisAlignment.start,
      children: <Widget>[
        IconButton(onPressed: () {}, icon: Icon(Icons.note_add)),
        IconButton(onPressed: () {}, icon: Icon(Icons.highlight)),
      ],
    );
  }
}

class NavigateIntent extends Intent {
  const NavigateIntent(this.row, this.col);

  final int row, col;
}

class NavigateAction extends Action<NavigateIntent> {
  NavigateAction(this.model);

  final SelectedCell model;

  @override
  void invoke(covariant NavigateIntent intent) {
    model.shift(intent.row, intent.col);
  }
}
