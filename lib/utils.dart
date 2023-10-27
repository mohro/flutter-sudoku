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