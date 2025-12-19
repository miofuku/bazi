import React, { useState, useRef, useEffect } from 'react';
import { Gender } from '../types';

interface InputFormProps {
  onCalculate: (data: { year: number; month: number; day: number; hour: number; minute: number; gender: Gender }) => void;
}

// --- Wheel Picker Components ---

interface WheelColumnProps {
  items: (string | number)[];
  value: string | number;
  onChange: (val: string | number) => void;
  label?: string;
}

const WheelColumn: React.FC<WheelColumnProps> = ({ items, value, onChange, label }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastWheelTime = useRef(0);

  // Scroll to selected item on mount or value change
  useEffect(() => {
    if (containerRef.current) {
      const selectedIndex = items.findIndex(item => item === value);
      if (selectedIndex >= 0) {
        // Item height is 40px (h-10)
        // To center the selected item in the h-32 (128px) window,
        // the top of the item should be at (128/2 - 40/2) = 44px from the top of the visible area.
        // The scrollable area has py-[44px] padding.
        // So, scrollTop should be (selectedIndex * itemHeight) - padding_top_offset_to_center
        containerRef.current.scrollTop = (selectedIndex * 40); // This aligns the top of the item with the top of the scrollable area's content.
        // The py-[44px] padding then effectively centers it within the h-32 window.
      }
    }
  }, [value, items]); // Re-run when value changes externally

  // Non-passive wheel listener for "One Digit per Step" control
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault(); // Stop native fast scroll

      const now = Date.now();
      // Throttle to prevent high-res wheel spam
      if (now - lastWheelTime.current > 75) {
        lastWheelTime.current = now;
        const direction = e.deltaY > 0 ? 1 : -1;

        const selectedIndex = items.findIndex(item => item === value);
        const newIndex = selectedIndex + direction;

        if (newIndex >= 0 && newIndex < items.length) {
          onChange(items[newIndex]);
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [items, value, onChange]);

  const handleScroll = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only auto-snap if triggered by touch/drag (wheel is handled manually above)
    timeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const index = Math.round(scrollTop / 40);
        if (index >= 0 && index < items.length) {
          const newItem = items[index];
          if (newItem !== value) {
            onChange(newItem);
          }
        }
      }
    }, 100);
  };

  const shift = (direction: -1 | 1) => {
    const selectedIndex = items.findIndex(item => item === value);
    const newIndex = selectedIndex + direction;
    if (newIndex >= 0 && newIndex < items.length) {
      onChange(items[newIndex]);
    }
  };

  return (
    <div className="flex flex-col items-center mx-1 relative group">
      {label && <div className="text-[10px] uppercase font-bold text-ink/40 mb-1 tracking-widest">{label}</div>}

      {/* Up Button */}
      <button
        type="button"
        onClick={() => shift(-1)}
        className="w-full h-6 flex items-center justify-center text-ink/20 hover:text-seal hover:bg-seal/5 transition-colors mb-1"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6" /></svg>
      </button>

      <div className="relative h-32 w-16 md:w-20 overflow-hidden border-y border-ink/10 bg-paper-dark/30 rounded-sm">
        {/* Selection Lens */}
        <div className="absolute top-1/2 left-0 w-full h-10 -translate-y-1/2 border-y-2 border-seal/50 bg-seal/5 pointer-events-none z-10 box-border"></div>

        {/* Helper gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-paper via-transparent to-paper pointer-events-none z-20"></div>

        <div
          ref={containerRef}
          className="h-full overflow-y-auto snap-y snap-mandatory py-[44px]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
          onScroll={handleScroll}
        >
          <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
          `}</style>
          {items.map((item) => (
            <div
              key={item}
              onClick={() => onChange(item)}
              className={`h-10 flex items-center justify-center snap-center cursor-pointer transition-all duration-200 select-none ${item === value ? 'text-ink font-bold text-xl scale-110' : 'text-ink/30 text-sm'
                }`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Down Button */}
      <button
        type="button"
        onClick={() => shift(1)}
        className="w-full h-6 flex items-center justify-center text-ink/20 hover:text-seal hover:bg-seal/5 transition-colors mt-1"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
      </button>

    </div>
  );
};

export const InputForm: React.FC<InputFormProps> = ({ onCalculate }) => {
  const now = new Date();

  // Data Generation
  const years = Array.from({ length: 150 }, (_, i) => 1900 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i); // Usually just every 15 mins is enough? User might want precise. Let's do all.

  const [dateValue, setDateValue] = useState({
    year: 1990,
    month: 6,
    day: 15
  });
  const [timeValue, setTimeValue] = useState({ hour: 12, minute: 0 });
  const [gender, setGender] = useState<Gender>(Gender.MALE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate({
      year: dateValue.year,
      month: dateValue.month,
      day: dateValue.day,
      hour: timeValue.hour,
      minute: timeValue.minute,
      gender
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg bg-paper border-2 border-ink/10 p-8 relative shadow-2xl">

      <div className="text-center mb-8 border-b border-ink/10 pb-4">
        <h3 className="font-title text-lg tracking-widest text-ink">Systemic Parameterization</h3>
        <p className="text-[10px] font-sans text-ink/40 uppercase tracking-[0.3em] mt-2">Calibrate Initial Conditions</p>
      </div>

      <div className="space-y-8 relative z-10">

        {/* Date Wheels */}
        <div className="flex justify-center gap-2">
          <WheelColumn items={years} value={dateValue.year} onChange={(v) => setDateValue({ ...dateValue, year: Number(v) })} label="Year" />
          <div className="h-40 flex items-center text-ink/20 pb-4 text-2xl">/</div>
          <WheelColumn items={months} value={dateValue.month} onChange={(v) => setDateValue({ ...dateValue, month: Number(v) })} label="Month" />
          <div className="h-40 flex items-center text-ink/20 pb-4 text-2xl">/</div>
          <WheelColumn items={days} value={dateValue.day} onChange={(v) => setDateValue({ ...dateValue, day: Number(v) })} label="Day" />
        </div>

        {/* Time Wheels */}
        <div className="flex justify-center gap-2">
          <WheelColumn items={hours} value={timeValue.hour} onChange={(v) => setTimeValue({ ...timeValue, hour: Number(v) })} label="Hour" />
          <div className="h-40 flex items-center text-ink/20 pb-4 text-2xl">:</div>
          <WheelColumn items={minutes} value={timeValue.minute} onChange={(v) => setTimeValue({ ...timeValue, minute: Number(v) })} label="Minute" />
        </div>

        {/* Gender Toggle */}
        <div>
          <label className="block text-xs font-serif italic text-stone-500 mb-3 text-center">Baseline Polarity</label>
          <div className="flex justify-center gap-6">
            <button
              type="button"
              onClick={() => setGender(Gender.MALE)}
              className={`w-24 py-2 border font-bold text-sm transition-all duration-300 ${gender === Gender.MALE ? 'border-ink bg-ink text-paper shadow-md' : 'border-stone-300 text-stone-400 hover:border-ink hover:text-ink'}`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setGender(Gender.FEMALE)}
              className={`w-24 py-2 border font-bold text-sm transition-all duration-300 ${gender === Gender.FEMALE ? 'border-seal bg-seal text-white shadow-md' : 'border-stone-300 text-stone-400 hover:border-seal hover:text-seal'}`}
            >
              Female
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-ink hover:bg-stone-800 text-paper font-title font-bold py-4 border border-ink shadow-lg hover:shadow-xl transition-all duration-300 tracking-[0.2em] uppercase group relative overflow-hidden"
        >
          <span className="relative z-10 group-hover:tracking-[0.4em] transition-all duration-500">Generate System Audit</span>
          <div className="absolute inset-0 bg-seal/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>
    </form>
  );
};