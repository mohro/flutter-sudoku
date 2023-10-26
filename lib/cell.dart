import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:sudoku/main.dart';
import 'package:sudoku/sudoku.dart';

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

class ColoredCell extends StatelessWidget {
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

  bool highlighBackground(BuildContext context) {
    return context.watch<SelectedCell>().row == row ||
        context.watch<SelectedCell>().col == col ||
        context.watch<SelectedCell>().box == box;
  }

  @override
  Widget build(BuildContext context) {
    bool highlightBackground = highlighBackground(context);

    return GestureDetector(
      onTap: () {
        print("Here");
        context
            .read<SelectedCell>()
            .changeLocation(row: row, col: col, box: box);

        focusNode.requestFocus();
      },
      child: ColoredBox(
        color: highlightBackground ? Colors.red : Colors.green,
        child: SizedBox(
          width: boxSize.width,
          height: boxSize.height,
          child: Cell(row: row, col: col, box: box, focusNode: focusNode),
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
          row: row, col: col, box: box, value: ' ', focusNode: focusNode);
    }

    String value = context.watch<Sudoku>().clue(row, col).toString();
    return TextCell(row: row, col: col, box: box, value: value, focusNode: focusNode, ignoreEdits: true);
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
  TextStyle textStyle = const TextStyle(
      fontWeight: FontWeight.bold, fontSize: 40, color: Colors.black54);

  String value = ' ';
  RegExp digitsOnly = RegExp(r'[1-9]');

  @override
  void initState() {
    super.initState();
    value = widget.value;
    textStyle = value == ' '
        ? const TextStyle(
            fontWeight: FontWeight.bold, fontSize: 40, color: Colors.amber)
        : textStyle;
  }

  @override
  Widget build(BuildContext context) {
    // print("$value...");
    return Focus(
      focusNode: widget.focusNode,
      onKey: (node, event) {
        if (widget.ignoreEdits) {
          return KeyEventResult.ignored;
        }
        
        if (digitsOnly.hasMatch(event.character.toString())) {
          setState(() {
            value = event.character.toString();
            context
                .read<Sudoku>()
                .solve(widget.row, widget.col, int.parse(value));
          });

          return KeyEventResult.handled;
        } else if (event.logicalKey == LogicalKeyboardKey.backspace ||
            event.logicalKey == LogicalKeyboardKey.delete) {
          setState(() {
            value = '';
            context.read<Sudoku>().solve(widget.row, widget.col, 0);
          });
          return KeyEventResult.handled;
        }
        return KeyEventResult.ignored;
      },
      child: Container(
        alignment: Alignment.center,
        child: Text(value, textAlign: TextAlign.center, style: textStyle),
      ),
    );
  }
}
