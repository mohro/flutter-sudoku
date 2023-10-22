import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sudoku/sudoku.dart';

class ColoredCell extends StatefulWidget {
  ColoredCell({
    super.key,
    required this.boxSize,
    required this.sudoku,
    required this.row,
    required this.col,
  });

  final Size boxSize;
  final Sudoku sudoku;
  final int row;
  final int col;

  @override
  State<ColoredCell> createState() => _ColoredCellState();
}

class _ColoredCellState extends State<ColoredCell> {
  bool selected = false;
  @override
  Widget build(BuildContext context) {
    return Focus(
      child: ColoredBox(
        color: selected ? Colors.red : Colors.green,
        child: SizedBox(
          width: widget.boxSize.width,
          height: widget.boxSize.height,
          child: Cell(sudoku: widget.sudoku, row: widget.row, col: widget.col),
        ),
      ),
      onFocusChange: (focused) {
        setState(() {
          selected = focused;
          print(focused);
        });
      },
    );
  }
}

class Cell extends StatelessWidget {
  const Cell({
    super.key,
    required this.sudoku,
    required this.row,
    required this.col,
  });

  final Sudoku sudoku;
  final int row;
  final int col;

  @override
  Widget build(BuildContext context) {
    if (sudoku.editable(row, col)) {
      return EditableCell(sudoku: sudoku, row: row, col: col);
    }

    return NonEditableCell(sudoku: sudoku, row: row, col: col);
  }
}

class NonEditableCell extends StatelessWidget {
  const NonEditableCell({
    super.key,
    required this.sudoku,
    required this.row,
    required this.col,
  });

  final Sudoku sudoku;
  final int row;
  final int col;
  final TextStyle textStyle = const TextStyle(
      fontWeight: FontWeight.bold, fontSize: 40, color: Colors.black54);

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.center,
      child: Text("${sudoku.clue(row, col)}",
          textAlign: TextAlign.center, style: textStyle),
    );
  }
}

class EditableCell extends StatelessWidget {
  EditableCell({
    super.key,
    required this.sudoku,
    required this.row,
    required this.col,
  });

  final Sudoku sudoku;
  final int row;
  final int col;
  final List<TextInputFormatter> formatters = <TextInputFormatter>[
    FilteringTextInputFormatter.allow(RegExp('[1-9]')),
    TextInputFormatter.withFunction(
      (TextEditingValue oldValue, TextEditingValue newValue) {
        if (newValue.text.length <= 1) {
          return newValue;
        }

        var last = newValue.text.characters.last;
        return TextEditingValue(
            text: last, selection: TextSelection.collapsed(offset: 1));
      },
    ),
    LengthLimitingTextInputFormatter(1),
  ];

  final TextStyle textStyle = const TextStyle(
      fontWeight: FontWeight.bold, fontSize: 40, color: Colors.black87);
  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.center,
      child: TextField(
        textAlign: TextAlign.center,
        textAlignVertical: TextAlignVertical.center,
        style: textStyle,
        showCursor: false,
        decoration: InputDecoration(
          border: InputBorder.none,
        ),
        inputFormatters: formatters,
        onChanged: (value) {
          print(value);
          int num = int.parse(value);
          sudoku.solve(row, col, num);
          print(sudoku.isValid(row, col, num));
        },
      ),
    );
  }
}


