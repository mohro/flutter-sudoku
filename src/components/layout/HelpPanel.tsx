import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { X, Keyboard, MousePointer2, Palette, Clock, CheckCircle2, Pencil } from 'lucide-react';

export const HelpPanel: React.FC = () => {
    const isHelpOpen = useGameStore(state => state.isHelpOpen);
    const toggleHelp = useGameStore(state => state.toggleHelp);

    if (!isHelpOpen) return null;

    const ShortcutRow = ({ keys, label, icon: Icon }: { keys: string[], label: string, icon?: any }) => (
        <div className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0 group">
            <div className="flex items-center gap-3">
                {Icon && <Icon size={16} className="text-accent group-hover:scale-110 transition-transform" />}
                <span className="text-sm text-txt-primary font-medium">{label}</span>
            </div>
            <div className="flex gap-1.5">
                {keys.map(k => (
                    <kbd key={k} className="px-2 py-1 bg-secondary/80 border border-slate-600 rounded text-[10px] font-mono font-bold text-accent shadow-sm uppercase tracking-wider">
                        {k}
                    </kbd>
                ))}
            </div>
        </div>
    );

    const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="space-y-1">
            <h3 className="text-xs font-bold text-txt-secondary uppercase tracking-[0.2em] mb-3 mt-4 first:mt-0">{title}</h3>
            <div className="bg-primary/20 rounded-xl p-3 border border-slate-700/30">
                {children}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="w-full max-w-lg bg-secondary/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 bg-accent/10 border-b border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent rounded-xl shadow-lg shadow-accent/20">
                            <Keyboard size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-txt-primary tracking-tight">Controls & Shortcuts</h2>
                            <p className="text-xs text-txt-secondary font-medium">Master the Zen of Sudoku</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleHelp}
                        className="p-2 hover:bg-slate-700/50 rounded-full text-txt-secondary hover:text-txt-primary transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6">
                    <Section title="Movement & Input">
                        <ShortcutRow keys={['Arrows', 'HJKL']} label="Navigate Grid" icon={MousePointer2} />
                        <ShortcutRow keys={['1-9']} label="Input Digit" />
                        <ShortcutRow keys={['Backspace', 'Del', 'C']} label="Clear Cell" />
                    </Section>

                    <Section title="Game Actions">
                        <ShortcutRow keys={['N']} label="Toggle Note mode" icon={Pencil} />
                        <ShortcutRow keys={['U', 'Z', 'Ctrl+Z']} label="Undo Last Move" />
                        <ShortcutRow keys={['V']} label="Check Progress" icon={CheckCircle2} />
                        <ShortcutRow keys={['P']} label="Pause / Resume" icon={Clock} />
                    </Section>

                    <Section title="Advanced Play">
                        <ShortcutRow keys={['G']} label="GOTO Cell (Row+Col)" />
                        <ShortcutRow keys={['B']} label="GOTO Box (1-9)" />
                        <ShortcutRow keys={['F']} label="Find Digit (Highlight)" />
                        <ShortcutRow keys={['X']} label="Clear Highlight" />
                    </Section>

                    <Section title="Interface">
                        <ShortcutRow keys={['T']} label="Cycle Themes" icon={Palette} />
                        <ShortcutRow keys={['Shift+G']} label="Toggle Guides" />
                        <ShortcutRow keys={['?']} label="Help Menu" />
                    </Section>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-primary/20 border-t border-slate-700/50 flex justify-center">
                    <button
                        onClick={toggleHelp}
                        className="px-8 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl font-bold transition-all shadow-lg shadow-accent/20 hover:scale-105 active:scale-95"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};
