import React from 'react';
import { clsx } from 'clsx';
import { useGameStore } from '../../store/gameStore';
import type { CellData } from '../../types/sudoku';

interface CellProps {
    data: CellData;
}

export const Cell: React.FC<CellProps> = ({ data }) => {
    const { row, col, value, initial, notes } = data;
    const { selectedCell, selectCell: setSelected, cells } = useGameStore();

    const isSelected = selectedCell?.row === row && selectedCell?.col === col;

    // Highlight logic
    const isRelated = selectedCell && (selectedCell.row === row || selectedCell.col === col ||
        (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) && Math.floor(selectedCell.col / 3) === Math.floor(col / 3)));

    const isNumberMatch = selectedCell && cells[selectedCell.row][selectedCell.col].value === value && value !== null;

    // Border logic for 3x3 grids
    const borderRight = (col + 1) % 3 === 0 && col !== 8 ? 'border-r-2 border-r-slate-500/50' : 'border-r border-r-slate-700/50';
    const borderBottom = (row + 1) % 3 === 0 && row !== 8 ? 'border-b-2 border-b-slate-500/50' : 'border-b border-b-slate-700/50';

    return (
        <div
            onClick={() => setSelected(row, col)}
            className={clsx(
                "relative flex items-center justify-center text-2xl font-medium cursor-pointer transition-all duration-75 select-none h-12 sm:h-14 w-12 sm:w-14",
                borderRight,
                borderBottom,
                // Background colors
                isSelected ? "bg-blue-600/90 text-white shadow-lg z-10 scale-105 rounded-md" :
                    isNumberMatch ? "bg-blue-900/60 text-blue-100" :
                        isRelated ? "bg-slate-800/80" :
                            "bg-slate-800/30 hover:bg-slate-800/50",
                // Text colors
                initial ? "text-slate-100 font-bold" : "text-blue-300",
                // Error state (future)
                !data.isValid && "text-red-400 bg-red-900/20"
            )}
        >
            {value ? (
                <span>{value}</span>
            ) : (
                <div className="grid grid-cols-3 gap-0.5 p-0.5 w-full h-full pointer-events-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <div key={n} className="flex items-center justify-center">
                            {notes.includes(n) && (
                                <span className="text-[8px] leading-none text-slate-400 font-normal">{n}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
