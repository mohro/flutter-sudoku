import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Play } from 'lucide-react';
import type { Difficulty } from '../../types/sudoku';

export const Controls: React.FC = () => {
    const startGame = useGameStore(state => state.startGame);
    const difficulty = useGameStore(state => state.difficulty);
    const status = useGameStore(state => state.status);
    const tickTimer = useGameStore(state => state.tickTimer);

    const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (status === 'playing') tickTimer();
        }, 1000);
        return () => clearInterval(interval);
    }, [status, tickTimer]);

    return (
        <div className="w-full max-w-md flex flex-col gap-4">
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
        </div>
    );
};
