import React from 'react';
import { clsx } from 'clsx';
import { useGameStore } from '../../store/gameStore';
import type { CellData } from '../../types/sudoku';

interface CellProps {
    data: CellData;
}

export const Cell: React.FC<CellProps> = ({ data }) => {
    const { row, col, value, initial, notes, isValid } = data;
    const selectedCell = useGameStore(state => state.selectedCell);
    const selectCell = useGameStore(state => state.selectCell);
    const validateMode = useGameStore(state => state.validateMode);
    const highlightedDigit = useGameStore(state => state.highlightedDigit);

    const isSelected = selectedCell?.row === row && selectedCell?.col === col;

    // Highlight logic
    const isRelated = !isSelected && selectedCell && (selectedCell.row === row || selectedCell.col === col || (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) && Math.floor(selectedCell.col / 3) === Math.floor(col / 3)));

    // Highlight Logic
    const isHighlightedValue = highlightedDigit !== null && value === highlightedDigit;

    return (
        <div
            className={clsx(
                "w-full h-full flex items-center justify-center text-xl sm:text-2xl cursor-pointer transition-all duration-200 select-none relative",
                // Base Borders
                col % 3 === 2 && col !== 8 && "border-r border-slate-500/50",
                row % 3 === 2 && row !== 8 && "border-b border-slate-500/50",

                // Interaction States
                isSelected && "bg-blue-500/40 shadow-inner ring-2 ring-blue-400 z-10",
                isRelated && !isHighlightedValue && "bg-blue-500/10",
                !isSelected && !isRelated && !isHighlightedValue && "hover:bg-white/5",

                // Validation Error
                !isValid && validateMode && "bg-red-500/50 text-white animate-pulse",

                // Digit Highlight (Values)
                isHighlightedValue && "bg-yellow-500/40 ring-1 ring-yellow-400/50 text-yellow-100"
            )}
            onClick={() => selectCell(row, col)}
        >
            {value ? (
                <span className={clsx(
                    initial ? "font-bold text-white scale-100" : "font-medium text-blue-200 scale-100",
                    isHighlightedValue && "text-white scale-110 font-bold drop-shadow-md"
                )}>
                    {value}
                </span>
            ) : (
                <div className="grid grid-cols-3 gap-[1px] w-full h-full p-0.5 pointer-events-none opacity-80">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <div key={n} className="flex items-center justify-center">
                            {notes.includes(n) && (
                                <span className={clsx(
                                    "text-[8px] sm:text-[10px] leading-none",
                                    highlightedDigit === n ? "text-yellow-400 font-bold scale-125 bg-yellow-900/40 rounded px-0.5" : "text-slate-400"
                                )}>
                                    {n}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
