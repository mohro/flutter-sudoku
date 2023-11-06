import 'dart:math';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sudoku/sudoku.dart';
import 'package:sudoku/utils.dart';

class SelectedCell extends ChangeNotifier with Box {
  int row = -1;
  int col = -1;
  int box = -1;
  String value = '';
  bool autoPopulate = false;

  void changeLocation({required int row, required int col}) async {
    print("$row :: $col");
    this.row = row;
    this.col = col;
    box = calculateBox(row, col);
    notifyListeners();
  }

  bool shift(int rowInc, int colInc) {
    if (rowInc == 0 && colInc == 0) {
      return false;
    }

    if (rowInc != 0) {
      int newRow = row + rowInc;
      if (newRow >= 0 && newRow <= 8) {
        changeLocation(row: newRow, col: col);
        return true;
      }
    } else if (colInc != 0) {
      int newCol = col + colInc;
      if (newCol >= 0 && newCol <= 8) {
        changeLocation(row: row, col: newCol);
        return true;
      }
    }

    return false;
  }

  void changeValue(String value) {
    if (this.value == value) {
      return;
    }
    this.value = value;
    notifyListeners();
  }

  void changeValueInt(int value) {
    changeValue(value.toString());
  }

  void autoPopulateHints() {
    autoPopulate = true;
  }
}

class HintMatrix extends ChangeNotifier {
  Map<String, List<String>> _hints = {};

  void setHints(int row, int col, int value) {
    String key = '$row$col';
    List<String> values = _hints.putIfAbsent(key, initList);
    values[value - 1] = emptyOrValue(values, value);
    notifyListeners();
  }

  String emptyOrValue(List<String> values, int value) =>
      values[value - 1] == '' ? value.toString() : '';

  List<String> initList() => List.generate(9, (index) => '');

  List<String> getHints(int row, int col) {
    return _hints.putIfAbsent('$row$col', initList);
  }
}

class ColoredCell extends StatefulWidget {
  const ColoredCell({
    super.key,
    required this.boxSize,
    required this.row,
    required this.col,
    required this.box,
  });

  final Size boxSize;
  final int row, col, box;

  @override
  State<ColoredCell> createState() => _ColoredCellState();
}

class _ColoredCellState extends State<ColoredCell> {
  late Color defaultColor;

  @override
  void initState() {
    super.initState();
    defaultColor = context.read<Sudoku>().editable(widget.row, widget.col)
        ? background
        : uneditableBackground;
  }

  Color backgroundColor(BuildContext context, int row, int col) {
    SelectedCell selection = context.watch<SelectedCell>();
    if (selection.row == widget.row && selection.col == widget.col) {
      return selectedCellColor;
    }
    if (!context.read<Sudoku>().editable(row, col)) {
      return defaultColor;
    }

    if (selection.row == widget.row ||
        selection.col == widget.col ||
        selection.box == widget.box) {
      return highlightedBackground;
    }

    return defaultColor;
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        context
            .read<SelectedCell>()
            .changeLocation(row: widget.row, col: widget.col);
      },
      child: ColoredBox(
        color: backgroundColor(context, widget.row, widget.col),
        child: SizedBox(
          width: widget.boxSize.width,
          height: widget.boxSize.height,
          child: Cell(
            row: widget.row,
            col: widget.col,
            box: widget.box,
          ),
        ),
      ),
    );
  }
}

class Cell extends StatelessWidget {
  const Cell({
    super.key,
    required this.row,
    required this.col,
    required this.box,
  });

  final int row, col, box;

  @override
  Widget build(BuildContext context) {
    if (context.watch<Sudoku>().editable(row, col)) {
      return TextCell(row: row, col: col, box: box, value: '');
    }

    String value = context.watch<Sudoku>().clue(row, col).toString();
    return TextCell(
        row: row, col: col, box: box, value: value, ignoreEdits: true);
  }
}

class TextCell extends StatefulWidget {
  TextCell(
      {super.key,
      required this.row,
      required this.col,
      required this.box,
      required this.value,
      this.ignoreEdits = false});

  final int row, col, box;
  final String value;
  final bool ignoreEdits;

  @override
  State<TextCell> createState() => _TextCellState();
}

class _TextCellState extends State<TextCell> {
  late TextStyle defaultTextStyle;

  String value = '';
  var hints = List.generate(9, (index) => '');

  @override
  void initState() {
    super.initState();
    value = widget.value;
    defaultTextStyle = value == '' ? editableTextStyle : clueTextStyle;
  }

  @override
  Widget build(BuildContext context) {
    int upValue = context.watch<Sudoku>().clue(widget.row, widget.col);
    value = upValue > 0 ? upValue.toString() : '';
    Widget child = value != ''
        ? Text(value, textAlign: TextAlign.center, style: textStyle(context))
        : HintsWidget(
            context.watch<HintMatrix>().getHints(widget.row, widget.col));

    return Container(
      alignment: Alignment.center,
      child: child,
    );
  }

  TextStyle textStyle(BuildContext context) {
    if (value == '') {
      return defaultTextStyle;
    }
    Sudoku sudoku = context.read<Sudoku>();

    if (!sudoku.isValid(widget.row, widget.col, int.parse(value))) {
      return conflictTextStyle;
    }

    SelectedCell selection = context.watch<SelectedCell>();
    if (selection.row < 0) {
      return defaultTextStyle;
    }

    if (selection.value == value) {
      return highlightTextStyle;
    }

    return defaultTextStyle;
  }
}

class HintsWidget extends StatelessWidget {
  const HintsWidget(
    this.hints, {
    super.key,
  });

  final List<String> hints;
  @override
  Widget build(BuildContext context) {
    return Center(
      child: LayoutBuilder(
        builder: (_, constraints) {
          double size =
              min(constraints.maxWidth / 3, constraints.maxHeight / 3);
          final boxSize = Size(size, size);

          return Column(
            children: [
              for (int row = 0; row < 3; row++)
                Row(
                  children: generateRow(context, 3, boxSize, row),
                )
            ],
          );
        },
      ),
    );
  }

  List<Widget> generateRow(
      BuildContext context, int cols, Size boxSize, int row) {
    return List.generate(cols, (col) {
      String value = hints[row * 3 + col];
      TextStyle style = context.watch<SelectedCell>().value == value
          ? hintHighlightTextStyle
          : hintTextStyle;
      return SizedBox(
          width: boxSize.width,
          height: boxSize.height,
          child: Center(
              child: Text(
            value,
            style: style,
          )));
    });
  }
}
