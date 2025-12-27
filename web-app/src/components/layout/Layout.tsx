import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useGameStore(state => state.theme);

    useEffect(() => {
        const root = document.documentElement;
        console.log('Theme changed to:', theme);
        // Remove old theme classes
        root.classList.remove('theme-midnight', 'theme-forest', 'theme-retro');
        // Add current theme class
        root.classList.add(`theme-${theme}`);
        console.log('Applied class:', `theme-${theme}`, 'Current classes:', root.className);
    }, [theme]);

    return (
        <div className="min-h-screen bg-primary text-txt-primary flex items-center justify-center p-4 font-sans transition-colors duration-500">
            <div className="w-full max-w-4xl relative z-10">
                {children}
            </div>
            {/* Background ambient glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px]" />
            </div>
        </div>
    );
};
