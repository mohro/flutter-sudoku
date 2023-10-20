import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sudoku/main.dart';

class Cell extends StatelessWidget {
  const Cell({
    super.key,
    required this.appState,
    required this.row,
    required this.col,
  });

  final MyAppState appState;
  final int row;
  final int col;

  @override
  Widget build(BuildContext context) {
    int num = appState.sudoku.clues.getCell(row, col);
    if (num == 0) {
      return Container(
        alignment: Alignment.center,
        child: TextField(
          keyboardType: TextInputType.numberWithOptions(signed: false, decimal: false),
          textAlign: TextAlign.center,
          textAlignVertical: TextAlignVertical.center,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 40, color: Colors.black87),
          showCursor: false,
          decoration: InputDecoration(
            border: InputBorder.none,
  
          ),
          inputFormatters: <TextInputFormatter>[
            FilteringTextInputFormatter.allow(RegExp('[1-9]')),
            TextInputFormatter.withFunction(
                (TextEditingValue oldValue, TextEditingValue newValue) {
                  if (newValue.text.length <= 1) {
                    return newValue;
                  }

                  var last = newValue.text.characters.last;
                  return TextEditingValue(text: last, selection: TextSelection.collapsed(offset: 1));
                },
              ),
            LengthLimitingTextInputFormatter(1),
            ],
            ),
      );
    }

    return Container(
      alignment: Alignment.center,
      child: Text("${appState.sudoku.clues.getCell(row, col)}",
      textAlign: TextAlign.center, 
      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 40, color: Colors.black54),
      ),
    );
  }
}




