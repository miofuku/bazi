import React, { useState, useRef, useEffect } from 'react';
import { Gender } from '../types';

interface InputFormProps {
  onCalculate: (data: { year: number; month: number; day: number; hour: number; minute: number; gender: Gender }) => void;
}

// Helper to get days in a month
const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

// Helper to get day of week for first day of month (0 = Sunday)
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month - 1, 1).getDay();

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

type DateView = 'year' | 'month' | 'day';

interface DatePickerProps {
  value: { year: number; month: number; day: number };
  onChange: (value: { year: number; month: number; day: number }) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<DateView>('day');
  const [viewYear, setViewYear] = useState(value.year);
  const [viewMonth, setViewMonth] = useState(value.month);
  const [yearRangeStart, setYearRangeStart] = useState(Math.floor(value.year / 12) * 12);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectYear = (year: number) => {
    setViewYear(year);
    setView('month');
  };

  const handleSelectMonth = (month: number) => {
    setViewMonth(month);
    setView('day');
  };

  const handleSelectDay = (day: number) => {
    onChange({ year: viewYear, month: viewMonth, day });
    setIsOpen(false);
    setView('day');
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const displayValue = `${value.year}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`;

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-transparent font-sans text-ink text-lg cursor-pointer py-1 flex items-center justify-between"
      >
        <span>{displayValue}</span>
        <span className="text-ink/40 text-sm">▼</span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-paper border-2 border-ink/10 shadow-2xl z-50 animate-[fadeIn_0.15s_ease-out]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-ink/10">
            <button
              type="button"
              onClick={() => {
                if (view === 'year') setYearRangeStart(yearRangeStart - 12);
                else if (view === 'month') setViewYear(viewYear - 1);
                else {
                  if (viewMonth === 1) {
                    setViewMonth(12);
                    setViewYear(viewYear - 1);
                  } else {
                    setViewMonth(viewMonth - 1);
                  }
                }
              }}
              className="w-8 h-8 flex items-center justify-center text-ink/60 hover:text-seal hover:bg-seal/10 transition-colors"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => {
                if (view === 'day') setView('month');
                else if (view === 'month') setView('year');
              }}
              className="font-title text-sm tracking-wider text-ink hover:text-seal transition-colors"
            >
              {view === 'year' && `${yearRangeStart} - ${yearRangeStart + 11}`}
              {view === 'month' && viewYear}
              {view === 'day' && `${MONTHS[viewMonth - 1]} ${viewYear}`}
            </button>
            <button
              type="button"
              onClick={() => {
                if (view === 'year') setYearRangeStart(yearRangeStart + 12);
                else if (view === 'month') setViewYear(viewYear + 1);
                else {
                  if (viewMonth === 12) {
                    setViewMonth(1);
                    setViewYear(viewYear + 1);
                  } else {
                    setViewMonth(viewMonth + 1);
                  }
                }
              }}
              className="w-8 h-8 flex items-center justify-center text-ink/60 hover:text-seal hover:bg-seal/10 transition-colors"
            >
              →
            </button>
          </div>

          {/* Year Grid */}
          {view === 'year' && (
            <div className="p-4 grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => handleSelectYear(year)}
                  className={`py-3 text-sm transition-all duration-200 border ${year === value.year
                    ? 'bg-seal text-white border-seal'
                    : 'border-transparent hover:border-ink/20 hover:bg-ink/5 text-ink'
                    }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {/* Month Grid */}
          {view === 'month' && (
            <div className="p-4 grid grid-cols-4 gap-2">
              {MONTHS.map((month, i) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => handleSelectMonth(i + 1)}
                  className={`py-3 text-sm transition-all duration-200 border ${i + 1 === value.month && viewYear === value.year
                    ? 'bg-seal text-white border-seal'
                    : 'border-transparent hover:border-ink/20 hover:bg-ink/5 text-ink'
                    }`}
                >
                  {month}
                </button>
              ))}
            </div>
          )}

          {/* Day Grid */}
          {view === 'day' && (
            <div className="p-4">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="text-center text-xs text-ink/40 font-serif italic py-1">
                    {day}
                  </div>
                ))}
              </div>
              {/* Days */}
              <div className="grid grid-cols-7 gap-1">
                {emptyDays.map((i) => (
                  <div key={`empty-${i}`} />
                ))}
                {days.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className={`w-9 h-9 flex items-center justify-center text-sm transition-all duration-200 ${day === value.day && viewMonth === value.month && viewYear === value.year
                      ? 'bg-seal text-white'
                      : 'hover:bg-ink/5 text-ink'
                      }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface TimePickerProps {
  value: { hour: number; minute: number };
  onChange: (value: { hour: number; minute: number }) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'hour' | 'minute'>('hour');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectHour = (hour: number) => {
    onChange({ ...value, hour });
    setView('minute');
  };

  const handleSelectMinute = (minute: number) => {
    onChange({ ...value, minute });
    setIsOpen(false);
    setView('hour');
  };

  const displayValue = `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`;

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-transparent font-sans text-ink text-lg cursor-pointer py-1 flex items-center justify-between"
      >
        <span>{displayValue}</span>
        <span className="text-ink/40 text-sm">▼</span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-paper border-2 border-ink/10 shadow-2xl z-50 animate-[fadeIn_0.15s_ease-out]">
          {/* Header Tabs */}
          <div className="flex border-b border-ink/10">
            <button
              type="button"
              onClick={() => setView('hour')}
              className={`flex-1 py-3 text-sm font-title tracking-wider transition-colors ${view === 'hour' ? 'text-seal border-b-2 border-seal' : 'text-ink/60 hover:text-ink'
                }`}
            >
              Hour
            </button>
            <button
              type="button"
              onClick={() => setView('minute')}
              className={`flex-1 py-3 text-sm font-title tracking-wider transition-colors ${view === 'minute' ? 'text-seal border-b-2 border-seal' : 'text-ink/60 hover:text-ink'
                }`}
            >
              Minute
            </button>
          </div>

          {/* Hour Grid */}
          {view === 'hour' && (
            <div className="p-3 grid grid-cols-6 gap-1">
              {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                <button
                  key={hour}
                  type="button"
                  onClick={() => handleSelectHour(hour)}
                  className={`py-2 text-sm transition-all duration-200 ${hour === value.hour
                    ? 'bg-seal text-white'
                    : 'hover:bg-ink/5 text-ink'
                    }`}
                >
                  {String(hour).padStart(2, '0')}
                </button>
              ))}
            </div>
          )}

          {/* Minute Grid */}
          {view === 'minute' && (
            <div className="p-3 grid grid-cols-6 gap-1">
              {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                <button
                  key={minute}
                  type="button"
                  onClick={() => handleSelectMinute(minute)}
                  className={`py-2 text-sm transition-all duration-200 ${minute === value.minute
                    ? 'bg-seal text-white'
                    : 'hover:bg-ink/5 text-ink'
                    }`}
                >
                  {String(minute).padStart(2, '0')}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const InputForm: React.FC<InputFormProps> = ({ onCalculate }) => {
  const now = new Date();
  const [dateValue, setDateValue] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate()
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
            <label className="block text-xs font-serif italic text-stone-500 mb-1">Date of Birth</label>
            <DatePicker value={dateValue} onChange={setDateValue} />
          </div>

          <div className="border-b border-ink/20 pb-1">
            <label className="block text-xs font-serif italic text-stone-500 mb-1">Time of Birth</label>
            <TimePicker value={timeValue} onChange={setTimeValue} />
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