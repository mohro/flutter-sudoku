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
    required this.sudoku,
    required this.row,
    required this.col,
    required this.box,
  });

  final Size boxSize;
  final Sudoku sudoku;
  final int row, col, box;

  bool highlighBackground(BuildContext context) {
    return context.watch<SelectedCell>().row == row ||
        context.watch<SelectedCell>().col == col ||
        context.watch<SelectedCell>().box == box;
  }

  @override
  Widget build(BuildContext context) {
    bool highlightBackground = highlighBackground(context);
    return Focus(
      child: ColoredBox(
        color: highlightBackground ? Colors.red : Colors.green,
        child: SizedBox(
          width: boxSize.width,
          height: boxSize.height,
          child: Cell(sudoku: sudoku, row: row, col: col),
        ),
      ),
      onFocusChange: (focused) {
        if (focused) {
          context
              .read<SelectedCell>()
              .changeLocation(row: row, col: col, box: box);
        }
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

        print("$oldValue::$newValue");
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
