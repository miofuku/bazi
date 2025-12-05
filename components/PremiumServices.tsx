import React from 'react';

const ServiceCard: React.FC<{ title: string; subtitle: string; desc: string; icon: React.ReactNode; features: string[]; price: string }> = ({ title, subtitle, desc, icon, features, price }) => (
  <div className="relative bg-white/40 backdrop-blur-md border border-white/60 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group flex flex-col h-full rounded-sm">

    <div className="flex flex-col items-center text-center mb-6">
      <div className="text-ink/60 group-hover:text-seal group-hover:scale-110 transition-all duration-500 mb-5">
        {icon}
      </div>

      <h4 className="font-bold text-lg text-ink mb-1">{title}</h4>
      <span className="text-[10px] uppercase tracking-widest text-ink/40 mb-4">{subtitle}</span>

      <p className="text-ink/60 text-sm leading-relaxed italic mb-6">
        "{desc}"
      </p>

      {/* Feature List */}
      <div className="w-full text-left space-y-2 mb-8 bg-paper p-4 rounded-sm">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-seal text-[10px] mt-[3px]">●</span>
            <span className="text-xs text-ink/70 font-medium">{f}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto px-6 py-2 border border-ink/10 text-xs font-bold uppercase tracking-widest group-hover:bg-ink group-hover:text-white transition-colors w-full">
        Unlock {price}
      </div>
    </div>
  </div>
);

export const PremiumServices: React.FC = () => {
  return (
    <div className="mt-24 mb-24">
      <div className="flex flex-col items-center mb-16 text-center">
        <h2 className="text-3xl font-bold text-ink mb-3 tracking-tight">The Premium Lab</h2>
        <div className="w-16 h-1 bg-seal/20 mb-4"></div>
        <p className="text-ink/50 text-base max-w-2xl font-serif italic">
          Classic Wisdom x Modern Consulting
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        <ServiceCard
          title="The Synergy Lab"
          subtitle="Love & Compatibility"
          desc="Chemistry is not random. It's elemental."
          features={[
            "Friction & Flow Analysis",
            "The Trigger (Reformer vs Conformist)",
            "Ancient Wisdom x Modern Advice"
          ]}
          icon={
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="9" cy="12" r="7" className="opacity-80" />
              <circle cx="15" cy="12" r="7" className="opacity-80" />
            </svg>
          }
          price="$29"
        />
        <ServiceCard
          title="The Business Radar"
          subtitle="Career & Partnership"
          desc="Align your ambitions with your energy."
          features={[
            "Founder's Circle Matching",
            "Talent Gap Identification",
            "Team Radar Overlay"
          ]}
          icon={
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M12 2L2 9L5 21H19L22 9L12 2Z" />
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2V5" />
              <path d="M22 9L19 11" />
              <path d="M19 21L17 18" />
              <path d="M5 21L7 18" />
              <path d="M2 9L5 11" />
            </svg>
          }
          price="$39"
        />
        <ServiceCard
          title="Yearly Energy Forecast"
          subtitle="Annual Guidance"
          desc="Your personal energy weather forecast. Know when to sprint and when to reflect."
          features={[
            "Environmental Atmosphere",
            "Action vs Reflection Periods",
            "Strategic Timing Guide"
          ]}
          icon={
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="M4.93 4.93l1.41 1.41" />
              <path d="M17.66 17.66l1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="M6.34 17.66l-1.41 1.41" />
              <path d="M19.07 4.93l-1.41 1.41" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          }
          price="$19"
        />
      </div>
    </div>
  );
};