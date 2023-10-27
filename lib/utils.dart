import 'package:flutter/material.dart';

final RegExp digitsOnly = RegExp(r'[1-9]');

// Text colors
final TextStyle clueTextStyle =
    TextStyle(fontWeight: FontWeight.bold, fontSize: 40, color: Colors.black54);
final TextStyle highlightTextStyle = TextStyle(
    fontWeight: FontWeight.bold, fontSize: 40, color: Colors.yellow.shade200);
final TextStyle editableTextStyle =
    TextStyle(fontWeight: FontWeight.bold, fontSize: 40, color: Colors.black87);
final TextStyle conflictTextStyle =
    TextStyle(fontWeight: FontWeight.bold, fontSize: 40, color: Colors.red);


// Cell Colors
const Color background = Colors.green;
final Color highlightedBackground = Colors.green.shade700;
final Color uneditableBackground = Colors.green.shade600;

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

  int calculateBox(int row, int col) {
    int rowMultiplier = index(row);
    int colAddition = index(col);

    if (rowMultiplier < 0 || colAddition < 0) {
      return -1;
    }

    return 3 * rowMultiplier + colAddition;
  }
}