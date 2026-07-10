import React, { useState } from 'react';
import { emailConfigured, subscribeEmail } from '../../services/emailService';
import { useAccent } from './AtmosphereContext';

// "Keep this reading" — email capture at the end of the reading. Sharing lives
// in the floating ShareControl up top; this block renders only once the
// MailerLite seam (services/emailService.ts) is configured.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const KeepYourReading: React.FC = () => {
  const { accentDeep } = useAccent();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailState, setEmailState] = useState<'idle' | 'sending' | 'sent'>('idle');

  if (!emailConfigured) return null;

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) { setEmailError('Enter a valid email address.'); return; }
    setEmailError(null);
    setEmailState('sending');
    try {
      await subscribeEmail(email, window.location.href);
      setEmailState('sent');
    } catch {
      setEmailState('idle');
      setEmailError('That didn’t go through — please try again.');
    }
  };

  return (
    <section className="rounded-2xl bg-white/55 p-6 ring-1 ring-ink/5 shadow-lift md:p-8">
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: accentDeep }}>Keep this reading</p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">Email yourself the link</h2>

      {emailState === 'sent' ? (
        <p aria-live="polite" className="mt-4 text-sm text-ink/75">
          Sent — check your inbox to confirm, and your reading link will follow.
        </p>
      ) : (
        <form onSubmit={handleEmail} noValidate className="mt-4 flex max-w-md flex-col gap-2">
          <label htmlFor="keep-email" className="text-xs font-semibold uppercase tracking-widest text-stone">
            Email
          </label>
          <div className="flex gap-2">
            <input
              id="keep-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailError(email && !EMAIL_RE.test(email) ? 'Enter a valid email address.' : null)}
              placeholder="you@example.com"
              className="min-h-[44px] w-full rounded-full border border-ink/15 bg-white/70 px-5 text-sm text-ink focus:border-sage focus:outline-none"
            />
            <button
              type="submit"
              disabled={emailState === 'sending'}
              className="min-h-[44px] shrink-0 rounded-full bg-sage px-6 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-sage-deep disabled:opacity-50"
            >
              {emailState === 'sending' ? 'Sending…' : 'Send'}
            </button>
          </div>
          {emailError && <p role="alert" className="text-xs text-fire">{emailError}</p>}
          <p className="text-[11px] leading-relaxed text-stone/70">
            Your link, plus the occasional quiet note as Rootwise grows. No noise.
          </p>
        </form>
      )}
    </section>
  );
};
