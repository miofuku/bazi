import React from 'react';

interface ContextualLockProps {
    title?: string;
    message: string;
    buttonText?: string;
    isBlurred?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export const ContextualLock: React.FC<ContextualLockProps> = ({
    title = "Encrypted Data Layer",
    message,
    buttonText = "Decrypt Protocol",
    isBlurred = true,
    className = "",
    children
}) => {
    return (
        <div className={`relative ${className}`}>
            {/* The Content to be Locked (Blurred) */}
            <div className={`transition-all duration-700 ${isBlurred ? 'blur-md opacity-40 pointer-events-none select-none grayscale' : ''}`}>
                {children}
            </div>

            {/* The Lock Overlay */}
            {isBlurred && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-midnight/30">
                    <div className="bg-midnight/90 backdrop-blur-xl border border-white/10 p-8 rounded-sm shadow-2xl max-w-md transform transition-all hover:scale-[1.02] duration-500 group">

                        {/* Minimalist Lock Icon */}
                        <div className="w-12 h-12 mx-auto bg-gold/10 text-gold rounded-full flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-midnight transition-colors duration-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>

                        <h3 className="text-xl font-serif text-slate-100 mb-3 tracking-wide">{title}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed mb-6 font-mono">
                            {message}
                        </p>

                        <button className="w-full py-3 px-6 bg-transparent border border-gold text-gold hover:bg-gold hover:text-midnight text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300">
                            {buttonText}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
