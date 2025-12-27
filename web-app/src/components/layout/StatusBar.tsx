import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Pencil, Eraser, RotateCcw, CheckCircle2, Clock } from 'lucide-react';
import { clsx } from 'clsx';

export const StatusBar: React.FC = () => {
    const isNoteMode = useGameStore(state => state.isNoteMode);
    const toggleNoteMode = useGameStore(state => state.toggleNoteMode);
    const undo = useGameStore(state => state.undo);
    const setCellValue = useGameStore(state => state.setCellValue);
    const timer = useGameStore(state => state.timer);
    const validateMode = useGameStore(state => state.validateMode);
    const toggleValidation = useGameStore(state => state.toggleValidation);
    const theme = useGameStore(state => state.theme);
    const setTheme = useGameStore(state => state.setTheme);
    const history = useGameStore(state => state.history);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const StatusButton = ({
        onClick,
        active,
        icon: Icon,
        label,
        disabled = false,
        activeColor = 'text-accent border-accent'
    }: any) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 text-xs font-medium",
                disabled ? "opacity-30 cursor-not-allowed border-transparent" :
                    active
                        ? `bg-secondary/80 ${activeColor}`
                        : "bg-transparent border-slate-700/50 text-txt-secondary hover:border-slate-500"
            )}
        >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    return (
        <div className="w-full max-w-2xl px-4 py-3 bg-secondary/30 backdrop-blur-md rounded-2xl border border-slate-700/50 flex flex-wrap items-center justify-between gap-4 shadow-xl mb-6">
            {/* Left: Toggles & Actions */}
            <div className="flex items-center gap-2">
                <StatusButton
                    onClick={toggleNoteMode}
                    active={isNoteMode}
                    icon={Pencil}
                    label="Notes"
                />
                <StatusButton
                    onClick={toggleValidation}
                    active={validateMode}
                    icon={CheckCircle2}
                    label="Check"
                    activeColor="text-green-400 border-green-500/50"
                />
                <div className="h-4 w-[1px] bg-slate-700/50 mx-1" />
                <button
                    onClick={() => setCellValue(null)}
                    className="p-1.5 text-txt-secondary hover:text-accent transition-colors rounded-lg hover:bg-secondary/50"
                    title="Erase"
                >
                    <Eraser size={16} />
                </button>
                <button
                    onClick={undo}
                    disabled={history.length === 0}
                    className="p-1.5 text-txt-secondary hover:text-accent disabled:opacity-30 transition-colors rounded-lg hover:bg-secondary/50"
                    title="Undo"
                >
                    <RotateCcw size={16} />
                </button>
            </div>

            {/* Middle/Center: Timer */}
            <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/50 rounded-full border border-slate-700/30">
                <Clock size={14} className="text-accent" />
                <span className="text-sm font-mono font-bold text-txt-board min-w-[45px] text-center">
                    {formatTime(timer)}
                </span>
            </div>

            {/* Right: Theme & Settings */}
            <div className="flex items-center gap-2">
                <div className="flex bg-primary/30 p-1 rounded-full border border-slate-700/30">
                    {(['midnight', 'forest', 'retro'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTheme(t)}
                            className={clsx(
                                "w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center",
                                theme === t ? "bg-accent scale-110 shadow-lg" : "hover:scale-105 opacity-50 hover:opacity-100"
                            )}
                            title={t.charAt(0).toUpperCase() + t.slice(1)}
                        >
                            <div className={clsx(
                                "w-3 h-3 rounded-full",
                                t === 'midnight' ? "bg-blue-900" : t === 'forest' ? "bg-emerald-900" : "bg-orange-200"
                            )} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
