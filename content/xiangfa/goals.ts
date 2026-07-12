import { DailyMode } from './daily';
import { WindTone } from '../../utils/tokens';

// Goal-anchored daily posture — the honest bridge across the ~55% day signal.
//
// The day already resolves to a five-mode posture (daily.ts) plus a 顺涩 wind. A
// user's short-term goal simply RE-VOICES that posture into the goal's own
// vocabulary: it is pacing advice ("how to spend today's energy toward X"), never
// an outcome forecast — so it stays honest at any forecast accuracy. Fully
// deterministic and client-side; free-text goals (LLM) are a later paid layer.

export type GoalId = 'job' | 'study' | 'relationship' | 'body' | 'creative';

export interface Goal {
  id: GoalId;
  label: string;   // chip label
  toward: string;  // completes "Toward your …"
}

export const GOALS: Goal[] = [
  { id: 'job', label: 'Job search', toward: 'job search' },
  { id: 'study', label: 'Studying', toward: 'studies' },
  { id: 'relationship', label: 'A relationship', toward: 'relationship' },
  { id: 'body', label: 'Body & health', toward: 'health' },
  { id: 'creative', label: 'Building something', toward: 'project' },
];

// Base line per (goal × mode). Posture verbs only — no outcome claims. The wind
// note below is a separate sentence, so these read cleanly on their own.
const ADVICE: Record<GoalId, Record<DailyMode, string>> = {
  job: {
    peer: 'Your day to drive it — reach out in your own field and act on the lead you’ve been circling, rather than waiting to be found.',
    output: 'A day to be seen — polish the portfolio, publish the piece, let the work do the reaching.',
    wealth: 'Hands-on for the search — follow up live leads and tend the applications already moving, not casting wide.',
    authority: 'For the disciplined parts — prep the interview, meet the deadline, work the process already in motion.',
    resource: 'Take in, don’t push — refine your materials, ask for a referral, rest the cold outreach.',
  },
  study: {
    peer: 'Study your own way — trust your method, work solo, own the ground you already know is yours.',
    output: 'Produce, don’t just absorb — write practice answers, teach it aloud, turn reading into something you’ve made.',
    wealth: 'Steady ground-covering — work the problem sets one ripe section at a time, not scattering across the syllabus.',
    authority: 'The hard drilling — timed papers, the topics you avoid, the discipline that shapes a real result.',
    resource: 'Let it settle — read, review, and let rest consolidate what you’ve learned instead of cramming more.',
  },
  relationship: {
    peer: 'Meet as equals — be among your people and bring your honest self, not the managed impression.',
    output: 'Give outward — make the gesture, say the thing you’ve been holding, express what you actually feel.',
    wealth: 'Tend it concretely — an act, not grand words: plan it, show up, follow through.',
    authority: 'It asks something today — honor a commitment, hold a boundary, meet the duty side of caring.',
    resource: 'Let yourself receive — listen more than you push, accept the care that’s offered.',
  },
  body: {
    peer: 'Your body’s ready to lead — train on your own terms, push the effort you’ve been building toward.',
    output: 'Spend the charge — move, sweat, let the built-up energy out.',
    wealth: 'Practical and compounding — the workout, the meal prep, the consistent reps that actually add up.',
    authority: 'Keep the hard commitment — the early alarm, the last set, the structure that shapes a body.',
    resource: 'A recovery day — rest, sleep, refuel; growth happens while you take in, not only while you push.',
  },
  creative: {
    peer: 'Drive it yourself — trust the instinct, act on the direction you already believe in.',
    output: 'A maker’s day — build, ship, publish; pour the energy into something that leaves your hands.',
    wealth: 'Execution — do the concrete tasks and tend the one thread actually ripening, not ten at once.',
    authority: 'The unglamorous work — the deadline, the spec, the discipline that turns an idea into a thing.',
    resource: 'Refill the well — research, learn, gather input and rest the output before the next build.',
  },
};

// 顺涩 note — one clause layered over any cell (not 75 hand-written lines).
// Headwind is REFRAMED honestly: a demanding day on this front is "prepare and
// conserve," never "a bad day for it" (climate bounds weather, no 宜忌 verdict).
const WIND_NOTE: Record<Exclude<WindTone, 'even'>, string> = {
  tailwind: 'The grain runs with you here — effort goes further today.',
  headwind: 'Into some friction today — a day to prepare and conserve on this front, not to force it.',
};

export const goalAdvice = (goal: GoalId, mode: DailyMode): string => ADVICE[goal][mode];

export const goalWindNote = (wind: WindTone): string | null =>
  wind === 'even' ? null : WIND_NOTE[wind];
