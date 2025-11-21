import React, { useState } from 'react';
import { Gender } from '../types';

interface InputFormProps {
  onCalculate: (data: { year: number; month: number; day: number; hour: number; minute: number; gender: Gender }) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onCalculate }) => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('12:00');
  const [gender, setGender] = useState<Gender>(Gender.MALE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    onCalculate({ year, month, day, hour, minute, gender });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-paper border-2 border-ink/10 p-8 relative shadow-2xl">
      
      {/* Seal Decoration */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-seal rounded-sm text-white font-sc font-bold flex items-center justify-center text-2xl shadow-lg rotate-12 border-4 border-double border-white/20">
        命
      </div>

      <div className="text-center mb-8 border-b border-ink/10 pb-4">
         <h3 className="font-title text-lg tracking-widest text-ink">Chart Registration</h3>
      </div>
      
      <div className="space-y-8 relative z-10">
        <div className="space-y-6">
            <div className="border-b border-ink/20 pb-1">
                <label className="block text-xs font-serif italic text-stone-500 mb-1">Date of Birth (MM/DD/YYYY)</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent font-sans text-ink focus:outline-none text-lg"
                    required
                />
            </div>

            <div className="border-b border-ink/20 pb-1">
                <label className="block text-xs font-serif italic text-stone-500 mb-1">Time of Birth</label>
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-transparent font-sans text-ink focus:outline-none text-lg"
                    required
                />
            </div>
        </div>

        <div>
          <label className="block text-xs font-serif italic text-stone-500 mb-3 text-center">Gender (Yin/Yang)</label>
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
          className="w-full mt-6 bg-ink hover:bg-stone-800 text-paper font-title font-bold py-4 border border-ink shadow-lg hover:shadow-xl transition-all duration-300 tracking-[0.2em] uppercase"
        >
           Reveal Destiny
        </button>
      </div>
    </form>
  );
};