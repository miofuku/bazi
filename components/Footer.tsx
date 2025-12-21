import React, { useState } from 'react';

export const Footer: React.FC = () => {
    const [email, setEmail] = useState('');

    return (
        <footer className="border-t border-white/5 py-24 bg-midnight relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gold/5 blur-[120px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                {/* Logo */}
                <div className="w-16 h-16 border border-gold/30 text-gold flex items-center justify-center mb-12 hover:bg-gold hover:text-midnight transition-all duration-700 cursor-default group">
                    <span className="font-serif text-3xl font-bold">C</span>
                </div>

                {/* Slogan */}
                <h3 className="text-2xl font-serif text-slate-100 mb-2 tracking-tight">CHRONOSOPHY</h3>
                <p className="text-[10px] uppercase tracking-[0.6em] text-gold/60 mb-16 font-bold">The Wisdom of Temporal Synergy.</p>

                {/* Links / Credits */}
                <div className="flex flex-col items-center w-full mb-24">
                    <div className="w-full h-px bg-white/5 mb-16 max-w-2xl"></div>
                    <div className="text-center">
                        <h4 className="text-[10px] uppercase tracking-widest text-gold mb-6 font-bold">Legal & System Protocols</h4>
                        <ul className="flex justify-center gap-12 text-xs text-slate-500">
                            <li className="hover:text-gold cursor-pointer transition-colors uppercase tracking-widest">Privacy Partition</li>
                            <li className="hover:text-gold cursor-pointer transition-colors uppercase tracking-widest">System Protocols</li>
                            <li className="hover:text-gold cursor-pointer transition-colors uppercase tracking-widest">Terms of Service</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between w-full pt-12 border-t border-white/5 items-center gap-6">
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest leading-loose">
                        &copy; {new Date().getFullYear()} CHRONOSOPHY. Decoded by <span className="text-gold/40 italic font-bold">Deep Intelligence</span>.
                    </p>
                    <div className="flex gap-8">
                        {['X', 'LinkedIn', 'Discord'].map((social) => (
                            <span key={social} className="text-[10px] text-slate-600 uppercase tracking-widest hover:text-gold cursor-pointer transition-colors font-bold">
                                {social}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};
