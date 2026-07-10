import React, { useState } from 'react';
import { RelationLens } from '../../utils/CompatibilityAnalyzer';
import { PRICE_LABEL, checkoutUrl, unlockWithLicense } from '../../services/entitlementService';

// The paired report's gate: what the full pairing holds, one honest price,
// and a restore path for buyers (the license key from their receipt email).

const CONTENTS: Record<RelationLens, string[]> = {
  partner: [
    'Where each of you is strong — the role radar',
    'What you bring each other, in both directions',
    'Who covers what, and the rivalry for the lead',
    'Shared weather for the next 45 days',
  ],
  marriage: [
    'Where each of you is strong — the role radar',
    'What you bring each other, in both directions',
    'What each of your innermost seats holds for the other',
    'Shared weather for the next 45 days',
  ],
};

export const UnlockPanel: React.FC<{ lens: RelationLens; onUnlocked: () => void }> = ({ lens, onUnlocked }) => {
  const [key, setKey] = useState('');
  const [state, setState] = useState<'idle' | 'checking'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [showRestore, setShowRestore] = useState(false);

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) { setError('Paste the key from your receipt email.'); return; }
    setError(null);
    setState('checking');
    const ok = await unlockWithLicense(key).catch(() => false);
    setState('idle');
    if (ok) onUnlocked();
    else setError('That key didn’t check out — make sure it matches your receipt email.');
  };

  return (
    <div className="mt-6 rounded-2xl bg-white/55 p-8 ring-1 ring-ink/5 shadow-lift text-center">
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-sage-deep">The full pairing</p>
      <h3 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">The rest of how you fit</h3>

      <ul className="mx-auto mt-5 flex max-w-md flex-col gap-2 text-left">
        {CONTENTS[lens].map((line) => (
          <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-ink/75">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />{line}
          </li>
        ))}
      </ul>

      <a
        href={checkoutUrl}
        target="_blank"
        rel="noopener"
        className="mt-7 inline-flex min-h-[44px] items-center rounded-full bg-sage px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-sage-deep"
      >
        Unlock the full pairing · {PRICE_LABEL}
      </a>
      <p className="mt-3 text-xs leading-relaxed text-stone">
        Pay once, keep it. Your key arrives by email — paste it here on any device.
      </p>

      {showRestore ? (
        <form onSubmit={handleRestore} noValidate className="mx-auto mt-5 flex max-w-md flex-col gap-2">
          <label htmlFor="license-key" className="text-left text-xs font-semibold uppercase tracking-widest text-stone">
            Your key
          </label>
          <div className="flex gap-2">
            <input
              id="license-key"
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="min-h-[44px] w-full rounded-full border border-ink/15 bg-white/70 px-5 text-sm text-ink focus:border-sage focus:outline-none"
            />
            <button
              type="submit"
              disabled={state === 'checking'}
              className="min-h-[44px] shrink-0 rounded-full bg-sage px-6 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-sage-deep disabled:opacity-50"
            >
              {state === 'checking' ? 'Checking…' : 'Unlock'}
            </button>
          </div>
          {error && <p role="alert" className="text-left text-xs text-fire">{error}</p>}
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowRestore(true)}
          className="mt-4 min-h-[44px] text-xs font-medium text-stone underline decoration-stone/40 underline-offset-4 transition-colors hover:text-sage-deep"
        >
          Already have a key?
        </button>
      )}
    </div>
  );
};
