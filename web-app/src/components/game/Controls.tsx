import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { RotateCcw, Pencil, Eraser, Play } from 'lucide-react';
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

    const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

    return (
        <div className="w-full max-w-md flex flex-col gap-4">
            {/* Top Bar: Difficulty & New Game */}
            <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                <div className="flex gap-2">
                    <select
                        value={difficulty}
                        onChange={(e) => startGame(e.target.value as Difficulty)}
                        className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200 outline-none focus:border-blue-500"
                    >
                        {difficulties.map(d => (
                            <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={() => startGame(difficulty)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm transition-colors"
                >
                    <Play size={14} /> New Game
                </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-2">
                <button
                    onClick={undo}
                    disabled={history.length === 0}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-300"
                >
                    <RotateCcw size={20} />
                    <span className="text-xs mt-1">Undo</span>
                </button>

                <button
                    onClick={toggleNoteMode}
                    className={clsx(
                        "flex flex-col items-center justify-center p-3 rounded-lg transition-colors border",
                        isNoteMode
                            ? "bg-slate-800 border-blue-500 text-blue-400"
                            : "bg-slate-800 border-transparent hover:bg-slate-700 text-slate-300"
                    )}
                >
                    <Pencil size={20} />
                    <span className="text-xs mt-1">{isNoteMode ? 'On' : 'Off'}</span>
                </button>

                <button
                    onClick={() => setCellValue(null)} // Erase
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300"
                >
                    <Eraser size={20} />
                    <span className="text-xs mt-1">Erase</span>
                </button>

                {/* Place value button (optional for mobile, but keeping clean for now) */}
                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-800/20 text-slate-500">
                    <span className="text-xs font-mono">00:00</span>
                    <span className="text-[10px]">Timer</span>
                </div>
            </div>
        </div>
    );
};
