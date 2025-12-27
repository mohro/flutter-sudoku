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
                col % 3 === 2 && col !== 8 && "border-r border-cell-border",
                row % 3 === 2 && row !== 8 && "border-b border-cell-border",

                // Interaction States
                isSelected && "bg-cell-selected shadow-inner ring-2 ring-accent z-10",
                isRelated && !isHighlightedValue && "bg-cell-related",
                !isSelected && !isRelated && !isHighlightedValue && "hover:bg-cell-hover",

                // Validation Error
                !isValid && validateMode && "bg-red-500/50 text-white animate-pulse",

                // Digit Highlight (Values)
                isHighlightedValue && "bg-highlight-bg ring-1 ring-highlight-digit/50 text-txt-primary"
            )}
            onClick={() => selectCell(row, col)}
        >
            {value ? (
                <span className={clsx(
                    initial ? "font-bold text-txt-primary scale-100" : "font-medium text-txt-board scale-100",
                    isHighlightedValue && "text-txt-primary scale-110 font-bold drop-shadow-md"
                )}>
                    {value}
                </span>
            ) : (
                <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5 pointer-events-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <div key={n} className="flex items-center justify-center h-full w-full">
                            {notes.includes(n) ? (
                                <span className={clsx(
                                    "text-[9px] sm:text-[12px] font-bold leading-none transition-all duration-150",
                                    highlightedDigit === n ? "text-highlight-digit scale-125 drop-shadow-sm" : "text-txt-secondary opacity-80"
                                )}>
                                    {n}
                                </span>
                            ) : (
                                <div className="invisible text-[9px] sm:text-[12px]">0</div> // Placeholder to keep grid stable
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
