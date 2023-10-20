import 'dart:math';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sudoku/cell.dart';
import 'package:tunning_sudoku/tunning_sudoku.dart';

void main() {
  runApp(MyApp());
}


class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => MyAppState(),
      child: MaterialApp(
        title: 'Sudoku',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepOrange),
        ),
        home: MyHomePage(),
      ),
    );
  }
}

class MyAppState extends ChangeNotifier {
  late SynchroSudoku sudoku;

  MyAppState() {
    sudoku = SudokuGenerator().getFromDifficulty(difficulty: SudokuDifficulty.expert);
    print(sudoku.clues);
  }
  
}

class MyHomePage extends StatefulWidget {
  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {

  var selectedIndex = 0;

  @override
  Widget build(BuildContext context) {


    return LayoutBuilder(
      builder: (context, constraints) {
        return Scaffold(
          body: Row(
            children: [
              leftMenu(constraints),
              FW(),                
            ],
          ),
        );
      }
    );
  }

  SafeArea leftMenu(BoxConstraints constraints) {
    return SafeArea(
              child: NavigationRail(
                backgroundColor: Colors.amber,
                extended: false,

                destinations: [
                  NavigationRailDestination(
                    icon: Icon(Icons.arrow_outward),
                    label: Text('New'),

                  ),
                  NavigationRailDestination(
                    icon: Icon(Icons.note_add),
                    label: Text('Pencil'),
                  ),
                  NavigationRailDestination(
                    icon: Icon(Icons.map),
                    label: Text('Go To'),
                  ),
                ],
                selectedIndex: selectedIndex,
                onDestinationSelected: (value) {
                  setState(() {
                    selectedIndex = value;
                  });
                },
              ),
            );
  }
}

class FW extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    var appState = context.watch<MyAppState>();

    int cols = 9;
    int rows = 9;
    return  Center(
      child: LayoutBuilder(
          builder: (_, constraints) {
            double size = min(constraints.maxWidth/cols, constraints.maxHeight/rows);
            final boxSize = Size(size, size);

            return Column(
              children: [
                for (int row = 0; row < rows; row++)
                  Row(
                    children: [
                      for (int col = 0; col < cols; col++)
                        ColoredBox(
                          color: Colors.green, 
                          child: SizedBox(
                            width: boxSize.width,//if you have padding on top level, minimize it 
                            height: boxSize.height,
                            child: Cell(appState: appState, row: row, col: col),
                          
                          ),
                        )
                    ],
                  )
              ],
            );
          },
      ),
    );
  }
}
