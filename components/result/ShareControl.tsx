import React, { useRef, useState } from 'react';
import { XiangfaReading } from '../../content/xiangfa';
import { Atmosphere } from '../../content/xiangfa/atmosphere';
import { NatureArt } from '../illustrations/NatureArt';
import { buildShareCard } from '../../utils/shareCard';

// The floating "Share" pill, top-right of the reading — one action:
// native share sheet (card + link) where available, otherwise
// download the card AND copy the link in one click.

export const ShareControl: React.FC<{ reading: XiangfaReading; atmo: Atmosphere }> = ({ reading, atmo }) => {
  const medallionRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null); // transient feedback

  const flash = (text: string) => {
    setLabel(text);
    window.setTimeout(() => setLabel(null), 2500);
  };

  const handleShare = async () => {
    try {
      const svg = medallionRef.current?.querySelector('svg');
      if (!svg) throw new Error('medallion not found');
      const blob = await buildShareCard({
        medallion: svg,
        natureName: reading.stem.archetypeName,
        imageTitle: reading.stem.imageTitle,
        thrivingLine: reading.stem.thrivingLine,
        atmo,
      });
      const file = new File([blob], 'rootwise-nature.png', { type: 'image/png' });
      const shareData = {
        files: [file],
        title: 'Rootwise',
        text: `I am ${reading.stem.archetypeName} — find the living thing you are.`,
        url: window.location.href,
      };
      if (navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(a.href);
        await navigator.clipboard.writeText(window.location.href).catch(() => {});
        flash('Card saved · link copied');
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') flash('Sharing didn’t work');
    }
  };

  return (
    <>
      {/* Offscreen medallion the card builder rasterizes — same art as the page */}
      <div ref={medallionRef} className="hidden" aria-hidden="true">
        <NatureArt id={reading.stem.symbol} accent={atmo.accent} />
      </div>
      <button
        onClick={handleShare}
        className="fixed top-6 right-6 z-50 flex min-h-[44px] items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-ink/70 backdrop-blur-md transition-colors hover:text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
        </svg>
        <span aria-live="polite">{label ?? 'Share'}</span>
      </button>
    </>
  );
};
