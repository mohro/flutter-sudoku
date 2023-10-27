import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:sudoku/main.dart';
import 'package:sudoku/sudoku.dart';
import 'package:sudoku/utils.dart';

mixin Box {
  int index(int value) {
    int result = -1;
    if (value >= 0 && value <= 2) {
      result = 0;
    } else if (value >= 3 && value <= 5) {
      result = 1;
    } else if (value >= 6 && value <= 8) {
      result = 2;
    }

    return result;
  }

  int box(int row, int col) {
    int rowMultiplier = index(row);
    int colAddition = index(col);

    if (rowMultiplier < 0 || colAddition < 0) {
      return -1;
    }

    return 3 * rowMultiplier + colAddition;
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

  bool highlightBackground(BuildContext context) {
    SelectedCell selection = context.watch<SelectedCell>();
    return selection.row == widget.row ||
        selection.col == widget.col ||
        selection.box == widget.box;
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        context
            .read<SelectedCell>()
            .changeLocation(row: widget.row, col: widget.col, box: widget.box);

        widget.focusNode.requestFocus();
      },
      child: ColoredBox(
        color:
            highlightBackground(context) ? highlightedBackground : defaultColor,
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

  @override
  void initState() {
    super.initState();
    value = widget.value;
    defaultTextStyle = value == '' ? editableTextStyle : clueTextStyle;
  }

  @override
  Widget build(BuildContext context) {
    return Focus(
      focusNode: widget.focusNode,
      onFocusChange: (focused) => {
        if (focused) {context.read<SelectedCell>().changeValue(value)}
      },
      onKey: (node, event) => handleKeyEvent(event, context),
      child: Container(
        alignment: Alignment.center,
        child:
            Text(value, textAlign: TextAlign.center, style: textStyle(context)),
      ),
    );
  }

  KeyEventResult handleKeyEvent(RawKeyEvent event, BuildContext context) {
    if (widget.ignoreEdits) {
      return KeyEventResult.ignored;
    }

    if (isDigitKeyEvent(event)) {
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
}
