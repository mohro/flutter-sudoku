import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Cell } from './Cell';

export const Board: React.FC = () => {
    const cells = useGameStore(state => state.cells);
    const moveSelection = useGameStore(state => state.moveSelection);
    const setCellValue = useGameStore(state => state.setCellValue);
    const startGame = useGameStore(state => state.startGame);
    const undo = useGameStore(state => state.undo);
    const toggleNoteMode = useGameStore(state => state.toggleNoteMode);
    const toggleValidation = useGameStore(state => state.toggleValidation);
    // const difficulty = useGameStore(state => state.difficulty); // For quick restart if needed

    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            console.log("Initializing Game...");
            initialized.current = true;
            try {
                startGame('easy');
            } catch (e) {
                console.error("StartGame Failed:", e);
            }
        }
    }, [startGame]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent default scrolling for arrows
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }

            switch (e.key) {
                // Navigation (Arrows)
                case 'ArrowUp': moveSelection(-1, 0); break;
                case 'ArrowDown': moveSelection(1, 0); break;
                case 'ArrowLeft': moveSelection(0, -1); break;
                case 'ArrowRight': moveSelection(0, 1); break;

                // Navigation (VIM)
                case 'k': moveSelection(-1, 0); break;
                case 'j': moveSelection(1, 0); break;
                case 'h': moveSelection(0, -1); break;
                case 'l': moveSelection(0, 1); break;

                // Actions
                case 'u':
                    undo();
                    break;
                case 'n':
                    toggleNoteMode();
                    break;
                case 'v':
                    toggleValidation();
                    break;

                case 'Backspace':
                case 'Delete':
                    setCellValue(null);
                    break;
                default:
                    const num = parseInt(e.key);
                    if (num >= 1 && num <= 9) {
                        setCellValue(num);
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [moveSelection, setCellValue]);

    console.log("Rendering Board, cells:", cells);

    if (!cells) {
        return <div className="text-red-500">Error: Cells undefined</div>;
    }

    if (cells.length === 0) {
        return <div className="text-white text-xl animate-pulse">Generating Puzzle...</div>;
    }

    return (
        <div className="flex flex-col items-center">
            <div className="bg-slate-800/40 p-2 sm:p-4 rounded-xl shadow-2xl backdrop-blur-sm border border-slate-700/50">
                <div className="grid grid-cols-9 border-2 border-slate-500/50 rounded-lg overflow-hidden bg-slate-900">
                    {cells.map((row, rIndex) => (
                        row.map((cell, cIndex) => (
                            <Cell key={`${rIndex}-${cIndex}`} data={cell} />
                        ))
                    ))}
                </div>
            </div>
        </div>
    );
};
