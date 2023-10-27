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
            .changeLocation(row: widget.row, col: widget.col);

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
