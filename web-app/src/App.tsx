import { Layout } from './components/layout/Layout';
import { Board } from './components/board/Board';
import { Controls } from './components/game/Controls';
import { WinnerModal } from './components/game/WinnerModal';

function App() {
  return (
    <Layout>
      <WinnerModal />
      <div className="flex flex-col gap-6 items-center">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-light tracking-[0.2em] text-white uppercase drop-shadow-md">Sudoku</h1>
          <p className="text-slate-400 text-sm tracking-widest">ZEN MODE</p>
        </header>

        <main className="flex flex-col items-center gap-6 w-full">
          <Controls />
          <Board />
        </main>

        <div className="text-slate-500 text-xs">
          Use Arrow Keys to Navigate • Numbers to Fill • Backspace to Clear
        </div>
      </div>
    </Layout>
  );
}

export default App;
