import { Layout } from './components/layout/Layout';
import { Board } from './components/board/Board';
import { Controls } from './components/game/Controls';
import { WinnerModal } from './components/game/WinnerModal';
import { StatusBar } from './components/layout/StatusBar';
import { HelpPanel } from './components/layout/HelpPanel';

function App() {
  return (
    <Layout>
      <WinnerModal />
      <HelpPanel />
      <div className="flex flex-col gap-6 items-center w-full">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-light tracking-[0.2em] text-txt-primary uppercase drop-shadow-md">Sudoku</h1>
          <p className="text-txt-secondary text-sm tracking-widest">ZEN MODE</p>
        </header>

        <StatusBar />

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
