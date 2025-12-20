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

                {/* CTA / Newsletter */}
                <div className="w-full max-w-md mb-24">
                    <label className="block text-[10px] uppercase tracking-[0.4em] text-slate-500 mb-6 font-bold">Subscribe to your Monthly Temporal Forecast</label>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Institutional Email"
                            className="flex-1 bg-white/5 border border-white/10 px-6 py-4 rounded-sm text-sm focus:outline-none focus:border-gold/50 transition-colors text-slate-200"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button className="bg-gold hover:bg-gold-light text-midnight px-8 py-4 rounded-sm font-bold uppercase tracking-widest text-[10px] transition-all">
                            Join
                        </button>
                    </div>
                </div>

                {/* Links / Credits */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full text-left mb-24">
                    <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-gold mb-6 font-bold">System</h4>
                        <ul className="space-y-3 text-xs text-slate-500">
                            <li className="hover:text-gold cursor-pointer transition-colors">Architecture</li>
                            <li className="hover:text-gold cursor-pointer transition-colors">Methodology</li>
                            <li className="hover:text-gold cursor-pointer transition-colors">Pricing</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-gold mb-6 font-bold">Insights</h4>
                        <ul className="space-y-3 text-xs text-slate-500">
                            <li className="hover:text-gold cursor-pointer transition-colors">Macro-Cycles</li>
                            <li className="hover:text-gold cursor-pointer transition-colors">Synergy Maps</li>
                            <li className="hover:text-gold cursor-pointer transition-colors">Almanac</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-gold mb-6 font-bold">Company</h4>
                        <ul className="space-y-3 text-xs text-slate-500">
                            <li className="hover:text-gold cursor-pointer transition-colors">Philosophy</li>
                            <li className="hover:text-gold cursor-pointer transition-colors">Infrastructure</li>
                            <li className="hover:text-gold cursor-pointer transition-colors">Contact</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-gold mb-6 font-bold">Legal</h4>
                        <ul className="space-y-3 text-xs text-slate-500">
                            <li className="hover:text-gold cursor-pointer transition-colors">Privacy Partition</li>
                            <li className="hover:text-gold cursor-pointer transition-colors">System Protocols</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between w-full pt-12 border-t border-white/5 items-center gap-6">
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest leading-loose">
                        &copy; {new Date().getFullYear()} CHRONOSOPHY. Decoded by <span className="text-gold/40 italic">Deep Intelligence</span>.
                    </p>
                    <div className="flex gap-8">
                        {['Twitter', 'LinkedIn', 'Discord'].map((social) => (
                            <span key={social} className="text-[10px] text-slate-600 uppercase tracking-widest hover:text-gold cursor-pointer transition-colors">
                                {social}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};
