import React from 'react';

const ServiceCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; price: string }> = ({ title, desc, icon, price }) => (
  <div className="relative bg-white p-8 border-t-4 border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-seal transition-all duration-500 cursor-pointer group">
    
    <div className="flex flex-col h-full items-center text-center">
        <div className="text-ink opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all mb-4">
            {icon}
        </div>
        
        <h4 className="font-title text-lg font-bold text-ink mb-2">{title}</h4>
        <div className="w-8 h-px bg-seal mb-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <p className="text-stone-500 font-serif text-sm leading-relaxed mb-6 flex-grow italic">
            {desc}
        </p>
        
        <div className="px-4 py-1 border border-ink/20 text-xs font-bold uppercase tracking-widest group-hover:bg-ink group-hover:text-white transition-colors">
            Unlock {price}
        </div>
    </div>
  </div>
);

export const PremiumServices: React.FC = () => {
  return (
    <div className="mt-24 mb-12">
      <div className="flex flex-col items-center mb-12 text-center">
        <span className="text-seal text-2xl font-sc mb-2">详解</span>
        <h2 className="text-3xl font-title text-ink mb-4 tracking-wide">Destiny Insights</h2>
        <div className="w-24 h-1 bg-double border-t border-b border-ink/20 mb-4"></div>
        <p className="text-stone-500 font-serif text-lg italic max-w-2xl">
          Unlock the deeper meanings of your chart with specialized analysis.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <ServiceCard 
            title="Wealth & Prosper" 
            desc="Golden opportunities and career pathways aligned with your element." 
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                 <circle cx="12" cy="12" r="9" />
                 <path d="M12 16v-8" />
                 <path d="M14.8 14A2.8 2.8 0 0 0 12 12" />
                 <path d="M14.8 10A2.8 2.8 0 0 0 12 8" />
                 <path d="M9.2 14A2.8 2.8 0 0 1 12 12" />
                 <path d="M9.2 10A2.8 2.8 0 0 1 12 8" />
              </svg>
            }
            price="$29"
        />
        <ServiceCard 
            title="Marriage & Union" 
            desc="Dynamics of the heart and timing for significant unions." 
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            }
            price="$29"
        />
        <ServiceCard 
            title="Annual Flow" 
            desc="Navigating the currents of the upcoming lunar year." 
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                 <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                 <line x1="16" y1="2" x2="16" y2="6" />
                 <line x1="8" y1="2" x2="8" y2="6" />
                 <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
            price="$19"
        />
      </div>
    </div>
  );
};