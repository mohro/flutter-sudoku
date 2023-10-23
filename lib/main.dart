import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sudoku/board.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => SelectedCell(),
      lazy: false,
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

class SelectedCell extends ChangeNotifier {
  int row = -1;
  int col = -1;
  int box = -1;

  void changeLocation({
    required int row, required int col, required int box
  }) async {
    print(row.toString() +" :: "+ col.toString());
    this.row = row;
    this.col = col;
    this.box = box;
    notifyListeners();
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
    return LayoutBuilder(builder: (context, constraints) {
      return Scaffold(
        body: Row(
          children: [
            leftMenu(constraints),
            SudokuBoard(),
          ],
        ),
      );
    });
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
