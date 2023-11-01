import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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

  void changeValue(String value) {
    this.value = value;
    notifyListeners();
  }

  bool move(int rowInc, int colInc) {
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

  void autoPopulateHints() {

    autoPopulate = true;
    Timer(const Duration(seconds: 1), () => autoPopulate = false);
    print(autoPopulate);
  }
}

class ColoredCell extends StatefulWidget {
  const ColoredCell({
    super.key,
    required this.boxSize,
    required this.row,
    required this.col,
    required this.box,
    required this.focusNode,
  });

  final Size boxSize;
  final int row, col, box;
  final FocusNode focusNode;

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
    if (!context.read<Sudoku>().editable(row, col)) {
      return defaultColor;
    }

    SelectedCell selection = context.watch<SelectedCell>();

    if (selection.row == widget.row && selection.col == widget.col) {
      return selectedCellColor;
    } else if (selection.row == widget.row ||
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

        widget.focusNode.requestFocus();
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
              focusNode: widget.focusNode),
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
    required this.focusNode,
  });

  final int row, col, box;
  final FocusNode focusNode;

  @override
  Widget build(BuildContext context) {
    if (context.watch<Sudoku>().editable(row, col)) {
      return TextCell(
          row: row, col: col, box: box, value: '', focusNode: focusNode);
    }

    String value = context.watch<Sudoku>().clue(row, col).toString();
    return TextCell(
        row: row,
        col: col,
        box: box,
        value: value,
        focusNode: focusNode,
        ignoreEdits: true);
  }
}

class TextCell extends StatefulWidget {
  TextCell(
      {super.key,
      required this.row,
      required this.col,
      required this.box,
      required this.value,
      required this.focusNode,
      this.ignoreEdits = false});

  final FocusNode? focusNode;
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
    if (value == '' && context.watch<SelectedCell>().autoPopulate) {
      populateHints(context, hints);
    }
    Widget child = value != ''
        ? Text(value, textAlign: TextAlign.center, style: textStyle(context))
        : HintsWidget(hints);

    return Focus(
      focusNode: widget.focusNode,
      onFocusChange: (focused) => {
        if (focused) {context.read<SelectedCell>().changeValue(value)}
      },
      onKey: (node, event) => handleKeyEvent(event, context),
      child: Container(
        alignment: Alignment.center,
        child: child,
      ),
    );
  }

  KeyEventResult handleKeyEvent(RawKeyEvent event, BuildContext context) {
    if (widget.ignoreEdits) {
      return KeyEventResult.ignored;
    }

    if (event.isControlPressed && isDigitKeyEvent(event)) {
      handleHintEvent(event);
    } else if (isDigitKeyEvent(event)) {
      setState(() {
        value = event.character.toString();
        context.read<Sudoku>().solve(widget.row, widget.col, int.parse(value));
        context.read<SelectedCell>().changeValue(value);
      });

      return KeyEventResult.handled;
    } else if (isDeleteKeyEvent(event)) {
      setState(() {
        value = '';
        context.read<Sudoku>().solve(widget.row, widget.col, 0);
        context.read<SelectedCell>().changeValue(value);
      });
      return KeyEventResult.handled;
    }

    return KeyEventResult.ignored;
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

    String selectedValue = selection.value;
    if (selectedValue == value) {
      return highlightTextStyle;
    }

    return defaultTextStyle;
  }

  bool isDigitKeyEvent(RawKeyEvent event) {
    return digitsOnly.hasMatch(event.character.toString());
  }

  bool isDeleteKeyEvent(RawKeyEvent event) {
    return event.logicalKey == LogicalKeyboardKey.backspace ||
        event.logicalKey == LogicalKeyboardKey.delete;
  }

  void handleHintEvent(RawKeyEvent event) {
    int value = int.parse(event.character.toString());
    String newValue = hints[value - 1] == '' ? value.toString() : '';
    setState(() {
      hints[value - 1] = newValue;
    });
  }
  
  void populateHints(BuildContext context, List<String> hints) async {
    for (var i = 1; i <= 9; i++) {
      // bool result = context.watch<Sudoku>().isValid(widget.row, widget.col, i);
      // print('${widget.row} :: ${widget.col} :: $i :: $result');
      if (context.watch<Sudoku>().isAllowed(widget.row, widget.col, i)) {
        hints[i-1] = i.toString();
      }
    }
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
