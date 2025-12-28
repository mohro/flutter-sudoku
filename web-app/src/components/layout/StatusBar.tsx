import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Pencil, RotateCcw, CheckCircle2, Clock, Play, Pause, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

export const StatusBar: React.FC = () => {
    const isNoteMode = useGameStore(state => state.isNoteMode);
    const toggleNoteMode = useGameStore(state => state.toggleNoteMode);
    const undo = useGameStore(state => state.undo);
    const timer = useGameStore(state => state.timer);
    const validateMode = useGameStore(state => state.validateMode);
    const toggleValidation = useGameStore(state => state.toggleValidation);
    const theme = useGameStore(state => state.theme);
    const history = useGameStore(state => state.history);
    const status = useGameStore(state => state.status);
    const togglePause = useGameStore(state => state.togglePause);
    const toggleHelp = useGameStore(state => state.toggleHelp);

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
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 text-sm font-medium",
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
        <div className="w-full max-w-3xl px-4 py-3 bg-secondary/30 backdrop-blur-md rounded-2xl border border-slate-700/50 flex flex-wrap items-center justify-between gap-4 shadow-xl mb-6">
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
                    onClick={undo}
                    disabled={history.length === 0}
                    className="p-1.5 text-txt-secondary hover:text-accent disabled:opacity-30 transition-colors rounded-lg hover:bg-secondary/50"
                    title="Undo"
                >
                    <RotateCcw size={18} />
                </button>
            </div>

            {/* Middle/Center: Timer & Pause */}
            <div className="flex items-center gap-3 px-4 py-2 bg-primary/50 rounded-full border border-slate-700/30">
                <button
                    onClick={togglePause}
                    className="p-1 hover:bg-secondary/50 rounded-full text-accent transition-colors"
                    title={status === 'paused' ? 'Resume' : 'Pause'}
                >
                    {status === 'paused' ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
                </button>
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-txt-secondary opacity-50" />
                    <span className="text-xl font-mono font-bold text-txt-board min-w-[60px] text-center tracking-wider">
                        {formatTime(timer)}
                    </span>
                </div>
            </div>

            {/* Right: Theme & Help */}
            <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-primary/30 rounded-full border border-slate-700/30">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-txt-secondary">
                        Theme: <span className="text-accent">{theme}</span>
                    </span>
                </div>
                <button
                    onClick={toggleHelp}
                    className="p-2 text-txt-secondary hover:text-accent hover:bg-secondary/50 rounded-full transition-all"
                    title="Help & Shortcuts"
                >
                    <HelpCircle size={20} />
                </button>
            </div>
        </div>
    );
};
