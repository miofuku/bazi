import { PrismLens } from './lensTranslations';

export interface ArchetypeNarrative {
    name: string;
    keywords: string[];
    lensContent: {
        [key in Exclude<PrismLens, 'temporal'>]: {
            title: string;
            english: string;
        };
    };
    intensityAdvice: {
        high: {
            modifiers: string[];
            warning: string;
        };
        low: {
            modifiers: string[];
            advice: string;
        };
        compromised: {
            diagnosis: string;
            protocol: string;
        };
    };
}

export const ARCHETYPE_NARRATIVES: Record<string, ArchetypeNarrative> = {
    'Eating God': {
        name: 'The Natural Alchemist',
        keywords: ['Intellectual Fluidity', 'Refinement', 'Aesthetic Output'],
        lensContent: {
            genesis: {
                title: 'The Architecture of Creative Flow',
                english: "Your core system is wired for Intellectual Fluidity. You do not just process data; you refine it into something elegant. Unlike disruptive forces, your power lies in 'Organic Evolution'—the ability to grow and create without depleting your internal reserves. You are a source of 'Original Light,' seeking joy in the mastery of craft and the decoding of complexity."
            },
            synergy: {
                title: 'The R&D and Innovation Engine',
                english: "In a professional ecosystem, you act as the Strategic Refiner. You are the guardian of quality and user experience. While others may focus on aggressive expansion, your system ensures 'Sustainable Growth' through continuous product alchemy. You excel in R&D, long-term strategy, and any role requiring deep, qualitative insight that prevents systemic burnout."
            },
            resonance: {
                title: 'The Harmonic Nourisher',
                english: "In the realm of intimacy, you provide Emotional Generosity. Your resonance is gentle yet profound, offering your partner a sanctuary of shared aesthetics and intellectual support. You prioritize 'Atmospheric Equilibrium,' seeking a partner who values deep conversation and the art of living. Your presence acts as a natural lubricant to your partner's systemic friction."
            }
        },
        intensityAdvice: {
            high: {
                modifiers: ['Prolific', 'Gourmet of Ideas'],
                warning: "Beware of delaying output by being over-obsessed with perfection."
            },
            low: {
                modifiers: ['Hidden Catalyst', 'Latent Creativity'],
                advice: "Activation of the expression module through deliberate practice is recommended."
            },
            compromised: {
                diagnosis: "Internal Blockage, Logic Suppression",
                protocol: "Current system has 'expression suppression'. Forced circulation of energy via 'structured writing' is suggested."
            }
        }
    },
    'Hurting Officer': {
        name: 'The Disruptive Innovator',
        keywords: ['Paradigm Shift', 'Unconventional Brilliance', 'High Entropy'],
        lensContent: {
            genesis: {
                title: 'The Architecture of Creative Defiance',
                english: "Your system thrives on Structural Defiance. You are naturally wired to identify the cracks in existing hierarchies and exploit them through radical expression. Your intelligence is not linear; it is explosive, designed to challenge the status quo and impose a new, more vibrant logic upon the world."
            },
            synergy: {
                title: 'The Provocateur of Innovation',
                english: "In a team, you are the Chief Visionary Provocateur. You excel at 'Zero-to-One' phases where the old rules must be burned to create space for the new. Your role is to prevent systemic stagnation, ensuring that the organization remains at the bleeding edge of innovation."
            },
            resonance: {
                title: 'The Laboratory of Evolution',
                english: "Intimacy with you is an Intellectual Adventure. You seek a partner who can match your intensity and navigate the high-frequency turbulence of your mind. You are drawn to 'Complexity' and require a relationship that acts as a laboratory for mutual evolution, rather than a static sanctuary."
            }
        },
        intensityAdvice: {
            high: {
                modifiers: ['Explosive', 'Iconoclastic'],
                warning: "Beware of disordered growth caused by disruption for the sake of disruption."
            },
            low: {
                modifiers: ['Measured Rebel', 'Latent Brilliance'],
                advice: "Deep breakthroughs in specific areas are recommended, rather than across-the-board firing."
            },
            compromised: {
                diagnosis: "Social Resistance, Signal Suppression",
                protocol: "The current system has 'expression misalignment'. Releasing suppressed innovative energy through 'non-traditional channels' is recommended."
            }
        }
    },
    'Seven Killings': {
        name: 'The Strategic Aggressor',
        keywords: ['Crisis Mastery', 'Decisive Authority', 'Kinetic Energy'],
        lensContent: {
            genesis: {
                title: 'High-Pressure Engine',
                english: "Your system is a High-Pressure Engine designed for survival and conquest. You possess an innate 'Crisis Instinct,' allowing you to remain hyper-focused when external environments collapse. Your core logic is built on the mastery of power and the relentless pursuit of strategic objectives under duress."
            },
            synergy: {
                title: 'The Wartime CEO',
                english: "You are the Wartime CEO. In high-stakes environments, your ability to execute 'Surgical Decisions' makes you an indispensable asset. You don't just manage teams; you lead 'Campaigns.' Your presence ensures that the organization maintains its momentum against all external resistance."
            },
            resonance: {
                title: 'The Protective Alliance',
                english: "Intimacy is a Protective Alliance. You express love through 'Shielding'—creating a secure perimeter for your partner against the world's turbulence. While your intensity can be overwhelming, it provides a foundation of absolute loyalty and raw power."
            }
        },
        intensityAdvice: {
            high: {
                modifiers: ['Implacable', 'Supreme Commando'],
                warning: "Beware of persistent defensive fatigue caused by hyper-vigilance."
            },
            low: {
                modifiers: ['Reserved Force', 'Reactive Guard'],
                advice: "Proactive display of edge at key decision points is recommended, rather than passively waiting for crises."
            },
            compromised: {
                diagnosis: "Paralytic Fear, Over-Control",
                protocol: "System in 'energy friction'. Re-anchoring a sense of control through 'extreme physical training' or 'high-stakes game simulation' is suggested."
            }
        }
    },
    'Indirect Resource': {
        name: 'The Transcendental Visionary',
        keywords: ['Non-linear Insight', 'Hidden Logic', 'Systemic Seclusion'],
        lensContent: {
            genesis: {
                title: 'The Deciphering Matrix',
                english: "You possess a Deciphering Matrix that operates beyond the visible spectrum. Your mind is attracted to 'Hidden Patterns' and 'Esoteric Logic' that others overlook. You are a 'Deep-Link' thinker, processing reality through a filter of profound intuition and intellectual isolation."
            },
            synergy: {
                title: 'Guardian of the Secret Moat',
                english: "In the professional sphere, you are the Guardian of the Secret Moat. You excel at identifying future risks and 'Invisible Trends' before they manifest in data. Your value lies in 'Unconventional R&D' and strategic forecasting, providing an intellectual defense competitors cannot replicate."
            },
            resonance: {
                title: 'Soul-Level Synchronization',
                english: "Your resonance is Soul-Level Synchronization. You seek a partner who can exist within your 'Quiet Space' and understand the unspoken frequencies of your thoughts. You value 'Intellectual Solitude' shared with another, creating a bond based on a private, sacred language."
            }
        },
        intensityAdvice: {
            high: {
                modifiers: ['Mystic Strategist', 'Pattern Master'],
                warning: "Beware of isolation caused by pure thought experiments detached from reality."
            },
            low: {
                modifiers: ['Intuitive Observer', 'Quiet Decoder'],
                advice: "Anchoring intuition in observable facts by consciously creating data benchmarks is recommended."
            },
            compromised: {
                diagnosis: "Mental Fog, Social Alienation",
                protocol: "Detected 'system redundancy interference'. Clearing external signals via 'minimalist physical living' to re-activate deep links is suggested."
            }
        }
    }
};
