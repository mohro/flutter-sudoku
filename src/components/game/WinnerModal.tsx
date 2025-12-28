import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Trophy, RotateCcw } from 'lucide-react';

export const WinnerModal: React.FC = () => {
    const status = useGameStore(state => state.status);
    const startGame = useGameStore(state => state.startGame);
    const difficulty = useGameStore(state => state.difficulty);

    if (status !== 'won') return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-slate-800 p-8 rounded-2xl border border-blue-500/50 shadow-2xl flex flex-col items-center gap-6 text-center transform scale-100 animate-in zoom-in-95 duration-300">
                <div className="bg-blue-500/10 p-4 rounded-full">
                    <Trophy size={48} className="text-yellow-400 drop-shadow-lg" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white tracking-wide">Puzzle Solved!</h2>
                    <p className="text-slate-400">Excellent work on the {difficulty.toUpperCase()} difficulty.</p>
                </div>

                <button
                    onClick={() => startGame(difficulty)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
                >
                    <RotateCcw size={20} />
                    Play Again
                </button>
            </div>
        </div>
    );
};
