import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Cell } from './Cell';
import { clsx } from 'clsx';
import { Play, Pause } from 'lucide-react';

export const Board: React.FC = () => {
    const cells = useGameStore(state => state.cells);
    const moveSelection = useGameStore(state => state.moveSelection);
    const setCellValue = useGameStore(state => state.setCellValue);
    const startGame = useGameStore(state => state.startGame);
    const undo = useGameStore(state => state.undo);
    const toggleNoteMode = useGameStore(state => state.toggleNoteMode);
    const toggleValidation = useGameStore(state => state.toggleValidation);
    const toggleGuides = useGameStore(state => state.toggleGuides);
    const showGuides = useGameStore(state => state.showGuides);
    // const difficulty = useGameStore(state => state.difficulty); // For quick restart if needed
    const selectCell = useGameStore(state => state.selectCell);
    const setHighlightedDigit = useGameStore(state => state.setHighlightedDigit);
    const theme = useGameStore(state => state.theme);
    const setTheme = useGameStore(state => state.setTheme);
    const status = useGameStore(state => state.status);
    const togglePause = useGameStore(state => state.togglePause);
    const isHelpOpen = useGameStore(state => state.isHelpOpen);
    const toggleHelp = useGameStore(state => state.toggleHelp);

    const initialized = useRef(false);

    // Command Mode State
    const [cmdMode, setCmdMode] = React.useState<'none' | 'goto' | 'box' | 'find'>('none');
    const [cmdBuffer, setCmdBuffer] = React.useState('');

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
            // Global Cancel
            if (e.key === 'Escape') {
                if (cmdMode !== 'none') {
                    setCmdMode('none');
                    setCmdBuffer('');
                    return;
                }
                if (isHelpOpen) {
                    toggleHelp();
                    return;
                }
                togglePause();
                return;
            }

            // Command Mode Handling
            if (cmdMode === 'find') {
                const num = parseInt(e.key);
                if (!isNaN(num) && num >= 1 && num <= 9) {
                    setHighlightedDigit(num);
                    setCmdMode('none');
                    setCmdBuffer('');
                }
                return;
            }

            if (cmdMode === 'goto') {
                const num = parseInt(e.key);
                if (!isNaN(num) && num >= 1 && num <= 9) {
                    const newBuf = cmdBuffer + e.key;
                    if (newBuf.length === 2) {
                        // Execute Jump: Row -> Col (1-indexed to 0-indexed)
                        const r = parseInt(newBuf[0]) - 1;
                        const c = parseInt(newBuf[1]) - 1;
                        selectCell(r, c);
                        setCmdMode('none');
                        setCmdBuffer('');
                    } else {
                        setCmdBuffer(newBuf);
                    }
                }
                return;
            }

            if (cmdMode === 'box') {
                const num = parseInt(e.key);
                if (!isNaN(num) && num >= 1 && num <= 9) {
                    // Map 1-9 to box coordinates
                    // 1 2 3
                    // 4 5 6
                    // 7 8 9
                    const boxIdx = num - 1;
                    const r = Math.floor(boxIdx / 3) * 3;
                    const c = (boxIdx % 3) * 3;
                    selectCell(r, c);
                    setCmdMode('none');
                    setCmdBuffer('');
                }
                return;
            }

            // Normal Navigation
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

                // Advanced Nav Triggers
                case 'g':
                    setCmdMode('goto');
                    setCmdBuffer('');
                    break;
                case 'b':
                    setCmdMode('box');
                    setCmdBuffer('');
                    break;
                case 'f':
                    setCmdMode('find');
                    setCmdBuffer('');
                    break;

                // Actions
                case 'u':
                case 'z':
                    if (e.key === 'z' && !e.ctrlKey && !e.metaKey) {
                        // Just regular 'z', though most expect Ctrl+Z
                        undo();
                    } else if (e.key === 'u') {
                        undo();
                    } else {
                        // Ctrl/Meta + Z
                        undo();
                    }
                    break;
                case 'n':
                    toggleNoteMode();
                    break;
                case 'v':
                    toggleValidation();
                    break;
                case 'G': // Shift+g
                    toggleGuides();
                    break;
                case 't':
                case 'T':
                    const themes = ['midnight', 'forest', 'retro', 'sand', 'arctic', 'neon'] as const;
                    const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
                    setTheme(nextTheme);
                    break;

                case 'p':
                case 'P':
                    togglePause();
                    break;
                case '?':
                    toggleHelp();
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
                    else if (e.key === 'c') {
                        // Alternate clear key for VIM users?
                        setCellValue(null);
                    }
                    else if (e.key === 'x') {
                        // Clear highlight
                        setHighlightedDigit(null);
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [moveSelection, setCellValue, cmdMode, cmdBuffer, selectCell, undo, toggleNoteMode, toggleValidation, toggleGuides, setHighlightedDigit, theme, setTheme, status, togglePause, toggleHelp, isHelpOpen]);

    console.log("Rendering Board, cells:", cells);

    if (!cells) {
        return <div className="text-red-500">Error: Cells undefined</div>;
    }

    if (cells.length === 0) {
        return <div className="text-white text-xl animate-pulse">Generating Puzzle...</div>;
    }

    return (
        <div className="flex flex-col items-center relative">
            {/* Command HUD */}
            {cmdMode !== 'none' && (
                <div className="absolute -top-12 bg-slate-900/90 text-blue-400 px-4 py-2 rounded-lg border border-blue-500/30 shadow-xl font-mono animate-in fade-in slide-in-from-bottom-2">
                    <span className="text-slate-400 mr-2">
                        {cmdMode === 'goto' && 'GOTO CELL'}
                        {cmdMode === 'box' && 'GOTO BOX'}
                        {cmdMode === 'find' && 'FIND VALUE'}
                    </span>
                    <span className="font-bold text-xl">{cmdBuffer}<span className="animate-pulse">_</span></span>
                </div>
            )}

            <div className="flex justify-center w-full px-2">
                <div className="inline-grid bg-secondary/40 p-4 rounded-xl shadow-2xl backdrop-blur-sm border border-cell-border"
                    style={{
                        gridTemplateColumns: '32px minmax(300px, 600px)',
                        gridTemplateRows: 'minmax(300px, 600px) 32px',
                        gap: '4px'
                    }}>

                    {/* Left Guide */}
                    <div className={clsx("grid grid-rows-9 h-full w-full select-none transition-opacity duration-300", showGuides ? "opacity-100" : "opacity-0 pointer-events-none")}>
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-end text-sm text-txt-secondary font-mono font-bold pr-2">
                                {i + 1}
                            </div>
                        ))}
                    </div>

                    {/* The Board */}
                    <div className="aspect-square w-full h-full">
                        <div className="grid grid-cols-9 grid-rows-9 w-full h-full border-2 border-cell-border rounded-lg overflow-hidden bg-board shadow-xl relative">
                            {cells.map((row, rIndex) => (
                                row.map((cell, cIndex) => (
                                    <Cell key={`${rIndex}-${cIndex}`} data={cell} />
                                ))
                            ))}

                            {/* Pause Overlay */}
                            {status === 'paused' && (
                                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-primary/40 backdrop-blur-xl animate-in fade-in duration-300">
                                    <div className="bg-secondary/80 p-6 rounded-3xl border border-slate-700/50 shadow-2xl flex flex-col items-center gap-4 scale-110">
                                        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/20 animate-pulse">
                                            <Pause size={32} className="text-white fill-current" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-2xl font-bold text-txt-primary tracking-tight">Game Paused</h3>
                                            <p className="text-sm text-txt-secondary font-medium">Take a breath...</p>
                                        </div>
                                        <button
                                            onClick={togglePause}
                                            className="mt-2 px-8 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl font-bold transition-all shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 flex items-center gap-2"
                                        >
                                            <Play size={16} fill="currentColor" /> Resume
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Corner */}
                    <div className={clsx("text-txt-secondary font-mono text-xs flex items-start justify-end p-2 select-none opacity-50 transition-opacity duration-300", showGuides ? "opacity-30" : "opacity-0")}>#</div>

                    {/* Bottom Guide */}
                    <div className={clsx("grid grid-cols-9 w-full h-full select-none transition-opacity duration-300", showGuides ? "opacity-100" : "opacity-0 pointer-events-none")}>
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="flex items-start justify-center text-sm text-txt-secondary font-mono font-bold pt-1">
                                {i + 1}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
