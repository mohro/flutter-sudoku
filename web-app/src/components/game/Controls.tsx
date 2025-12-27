import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { RotateCcw, Pencil, Eraser, Play, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import type { Difficulty } from '../../types/sudoku';

export const Controls: React.FC = () => {
    const isNoteMode = useGameStore(state => state.isNoteMode);
    const toggleNoteMode = useGameStore(state => state.toggleNoteMode);
    const undo = useGameStore(state => state.undo);
    const startGame = useGameStore(state => state.startGame);
    const difficulty = useGameStore(state => state.difficulty);
    const history = useGameStore(state => state.history);
    const setCellValue = useGameStore(state => state.setCellValue);
    const timer = useGameStore(state => state.timer);
    const tickTimer = useGameStore(state => state.tickTimer);
    const status = useGameStore(state => state.status);
    const toggleValidation = useGameStore(state => state.toggleValidation);
    const validateMode = useGameStore(state => state.validateMode);

    const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (status === 'playing') tickTimer();
        }, 1000);
        return () => clearInterval(interval);
    }, [status, tickTimer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-md flex flex-col gap-4">
            {/* Top Bar: Difficulty & New Game */}
            <div className="flex justify-between items-center bg-secondary/50 p-2 rounded-lg border border-slate-700">
                <div className="flex gap-2">
                    <select
                        value={difficulty}
                        onChange={(e) => startGame(e.target.value as Difficulty)}
                        className="bg-primary border border-slate-600 rounded px-2 py-1 text-sm text-txt-primary outline-none focus:border-accent"
                    >
                        {difficulties.map(d => (
                            <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={() => startGame(difficulty)}
                    className="flex items-center gap-1 px-3 py-1 bg-accent hover:bg-accent-hover text-white rounded text-sm transition-colors"
                >
                    <Play size={14} /> New Game
                </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-5 gap-2">
                <button
                    onClick={undo}
                    disabled={history.length === 0}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-txt-secondary"
                >
                    <RotateCcw size={20} />
                    <span className="text-xs mt-1">Undo</span>
                </button>

                <button
                    onClick={toggleNoteMode}
                    className={clsx(
                        "flex flex-col items-center justify-center p-3 rounded-lg transition-colors border",
                        isNoteMode
                            ? "bg-secondary border-accent text-accent"
                            : "bg-secondary border-transparent hover:bg-secondary/80 text-txt-secondary"
                    )}
                >
                    <Pencil size={20} />
                    <span className="text-xs mt-1">{isNoteMode ? 'On' : 'Off'}</span>
                </button>

                <button
                    onClick={() => setCellValue(null)} // Erase
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-txt-secondary"
                >
                    <Eraser size={20} />
                    <span className="text-xs mt-1">Erase</span>
                </button>

                <button
                    onClick={toggleValidation}
                    className={clsx(
                        "flex flex-col items-center justify-center p-3 rounded-lg transition-colors border",
                        validateMode
                            ? "bg-secondary border-green-500 text-green-400"
                            : "bg-secondary border-transparent hover:bg-secondary/80 text-txt-secondary"
                    )}
                >
                    <CheckCircle2 size={20} />
                    <span className="text-xs mt-1">Check</span>
                </button>

                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-secondary/40 text-txt-secondary border border-slate-700/50">
                    <span className="text-sm font-mono font-bold text-txt-board">{formatTime(timer)}</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-60">Time</span>
                </div>
            </div>

            <ThemeSelector />
        </div>
    );
};

const ThemeSelector = () => {
    const theme = useGameStore(state => state.theme);
    const setTheme = useGameStore(state => state.setTheme);

    return (
        <div className="flex justify-center gap-2 text-xs text-txt-secondary">
            {['midnight', 'forest', 'retro'].map((t) => (
                <button
                    key={t}
                    onClick={() => setTheme(t as any)}
                    className={clsx(
                        "px-2 py-1 rounded capitalize transition-colors",
                        theme === t ? "text-accent font-bold" : "hover:text-txt-primary"
                    )}
                >
                    {t}
                </button>
            ))}
        </div>
    )
}
