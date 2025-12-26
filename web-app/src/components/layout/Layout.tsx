import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#1a1d2d] to-black">
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
