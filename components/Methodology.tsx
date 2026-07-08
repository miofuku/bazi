import React from 'react';

const cards = [
  {
    title: 'You are a living image',
    body: 'Your day of birth names one of ten natural images — a tall tree, the sun, a hearth-fire, a mountain, a field, a forged blade, a jewel, a river, gentle rain. That image is the shape of your temperament: how you grow, what you reach for, where you bend.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 21V9m0 0c0 0-5-1.5-5-5.5C7 1.8 9 1 12 4.5M12 9c0 0 5-1.5 5-5C17 1.8 15 1 12 4.5" />
    ),
  },
  {
    title: 'Born into a season',
    body: 'The month of your birth is the climate your nature first met — spring soil, summer heat, autumn cool, winter frost. The same tree thrives in warm ground and struggles in frost. Your season shapes which of your needs feel most urgent.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.5-6.5l-1.5 1.5M7 17l-1.5 1.5m0-13L7 7m9.5 9.5l1.5 1.5M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    ),
  },
  {
    title: 'Conditions to flourish',
    body: 'Every living thing needs certain things to thrive — ground to root in, water, light, room to be seen. Reading these against your makeup shows what already runs strong in you and what is worth seeking out. Self-understanding, not prediction.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 12h4l2 6 4-12 2 6h4" />
    ),
  },
];

export const Methodology: React.FC = () => (
  <div className="w-full max-w-5xl mx-auto px-4">
    <div className="text-center mb-16">
      <span className="inline-block px-3 py-1 bg-sage text-white text-[11px] uppercase tracking-[0.3em] font-semibold mb-8 rounded-full">How it works</span>
      <h3 className="text-4xl md:text-5xl font-display font-semibold text-ink mb-6 tracking-tight">Reading a life the way you read a landscape</h3>
      <p className="text-stone max-w-2xl mx-auto leading-relaxed">
        We grow the way living things grow. So instead of labels and predictions, Rootwise looks at you as a part of the natural world — the living thing you most resemble, the season it took root in, and the conditions it needs to thrive. It's less fortune-telling, more ecology and psychology: the quiet harmony between a person and nature.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((c) => (
        <div key={c.title} className="bg-white/45 ring-1 ring-ink/5 shadow-lift p-10 rounded-2xl group hover:ring-sage/30 transition-all duration-500">
          <div className="text-sage mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
            <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">{c.icon}</svg>
          </div>
          <h4 className="text-xl font-display font-semibold text-ink mb-4">{c.title}</h4>
          <p className="text-stone text-sm leading-relaxed">{c.body}</p>
        </div>
      ))}
    </div>

    <div className="mt-16 text-center">
      <div className="inline-flex items-center gap-5 px-8 py-5 bg-white/45 ring-1 ring-sage/15 rounded-2xl">
        <span className="inline-block px-4 py-1.5 bg-sage text-white text-[11px] uppercase tracking-[0.3em] font-semibold rounded-full">The aim</span>
        <span className="text-ink font-display italic text-lg">“To know your own nature, and grow in tune with it.”</span>
      </div>
    </div>
  </div>
);
