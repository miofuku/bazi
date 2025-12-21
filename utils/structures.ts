export interface StructureResult {
    id: string;
    category: 'Creators & Builders' | 'Leaders & Strategists' | 'Solvers & Intellects' | 'Intensity & Flow';
    name: {
        english: string; // e.g., Eating God Generating Wealth
    };
    archetype: {
        name: string; // e.g., The Creative Alchemist
        visual: string; // e.g., 🌱➡️💎
        headline: string;
        profile: string;
        superpower: string;
        blindSpot: string;
    };
    heroCard: {
        rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
        coreDrive: string;
        careerMatch: string[];
        motto: string;
    };
}

export const BAZI_STRUCTURES: Record<string, StructureResult> = {
    // 1. 食神生财格
    'ShiShenShengCai': {
        id: 'ShiShenShengCai',
        category: 'Creators & Builders',
        name: {
            english: 'The Natural Alchemist Generating Wealth',
        },
        archetype: {
            name: 'The Creative Alchemist',
            visual: '🌱➡️💎',
            headline: 'Turning pure talent into tangible value.',
            profile: "You are not someone who chases money; you attract it through your skills. Your energy flows smoothly from your inner creativity (The Natural Alchemist) to external rewards. You believe that if you do what you love with excellence, abundance will follow naturally.",
            superpower: 'Effortless flow, optimism, monetization of hobbies.',
            blindSpot: 'Lack of discipline; becoming too relaxed.'
        },
        heroCard: {
            rarity: 'Rare',
            coreDrive: 'Value Creation (Creating Value from Talent)',
            careerMatch: ['Artist', 'Product Designer', 'Content Creator', 'Chef'],
            motto: 'Do what you love, and the rest follows.'
        }
    },

    // 2. 伤官生财格
    'ShangGuanShengCai': {
        id: 'ShangGuanShengCai',
        category: 'Creators & Builders',
        name: {
            english: 'The Disruptive Innovator Generating Wealth',
        },
        archetype: {
            name: 'The Disruptive Entrepreneur',
            visual: '⚡➡️💰',
            headline: 'Structural defiance turned into market dominant momentum.',
            profile: "Standard paths bore you. Your system thrives on Structural Defiance, identifying cracks in existing hierarchies. You are naturally wired to challenge the status quo and impose a new logic upon the market, turning high-entropy disruption into scalable profit.",
            superpower: 'Paradigm shifts, speed, high-frequency disruption.',
            blindSpot: 'Burnout, systemic friction with established order.'
        },
        heroCard: {
            rarity: 'Epic',
            coreDrive: 'Disruption (Monetizing Innovation)',
            careerMatch: ['Startup Founder', 'Venture Capitalist', 'Sales Director', 'Trendsetter'],
            motto: 'Rules are suggestions for the unimaginative.'
        }
    },

    // 3. 官印相生格
    'GuanYinXiangSheng': {
        id: 'GuanYinXiangSheng',
        category: 'Leaders & Strategists',
        name: {
            english: 'Integrity Guardian Supported by Resource',
        },
        archetype: {
            name: 'The Architect of Order',
            visual: '🏛️',
            headline: 'Climbing the ladder with grace and reputation.',
            profile: "You are the backbone of any organization. Your 'Integrity Guardian' energy seeks status, while your 'Foundational Mentor' energy ensures you get there through legitimate, respected means. You don't fight for power; you earn it through reliability and systemic thinking.",
            superpower: 'Management, legitimacy, long-term stability.',
            blindSpot: 'Too conservative; fear of change.'
        },
        heroCard: {
            rarity: 'Rare',
            coreDrive: 'Authority (Systemic Power)',
            careerMatch: ['Executive', 'Government Official', 'Judge', 'Corporate Manager'],
            motto: 'Trust is the ultimate currency.'
        }
    },

    // 4. 杀印相生格
    'ShaYinXiangSheng': {
        id: 'ShaYinXiangSheng',
        category: 'Leaders & Strategists',
        name: {
            english: 'Strategic Aggressor Supported by Resource',
        },
        archetype: {
            name: 'The Iron Strategist',
            visual: '🛡️⚔️',
            headline: 'Transforming crisis into authority.',
            profile: "Pressure implies potential to you. Where others see chaos (The Strategic Aggressor energy), you see a chessboard. You have the unique ability to absorb stress, process it through wisdom (The Foundational Mentor), and output it as command. You thrive in difficult times.",
            superpower: 'Crisis management, intense focus, turning enemies into allies.',
            blindSpot: 'Emotional detachment, loneliness.'
        },
        heroCard: {
            rarity: 'Legendary',
            coreDrive: 'Transforming Pressure',
            careerMatch: ['CEO', 'Military Strategist', 'Crisis PR', 'Turnaround Specialist'],
            motto: 'Chaos is a ladder.'
        }
    },

    // 5. 食神制杀格
    'ShiShenZhiSha': {
        id: 'ShiShenZhiSha',
        category: 'Solvers & Intellects',
        name: {
            english: 'The Natural Alchemist Controlling Strategic Aggressor',
        },
        archetype: {
            name: 'The Tactical Mastermind',
            visual: '♟️',
            headline: 'Surgical precision neutralizing high-stakes resistance.',
            profile: "You don't fight fire with fire; you fight fire with water. You use the Intellectual Fluidity of 'The Natural Alchemist' to disarm 'The Strategic Aggressor' with precision. You are the expert negotiator or strategist who secures victory through the mastery of craft and hidden logic.",
            superpower: 'Problem-solving, technical expertise, surgical precision.',
            blindSpot: 'Over-thinking, perfectionism.'
        },
        heroCard: {
            rarity: 'Epic',
            coreDrive: 'Precision Solution (Skill over Force)',
            careerMatch: ['Surgeon', 'Specialist Consultant', 'Negotiator', 'Engineer'],
            motto: 'Precision beats power every time.'
        }
    },

    // 6. 伤官配印格
    'ShangGuanPeiYin': {
        id: 'ShangGuanPeiYin',
        category: 'Solvers & Intellects',
        name: {
            english: 'Disruptive Innovator Paired with Visionary Resource',
        },
        archetype: {
            name: 'The Wise Disruptor',
            visual: '🦉💡',
            headline: 'Disruptive genius filter through transcendental insight.',
            profile: "This is a rare and powerful combination. You possess the explosive, non-linear creativity of 'The Disruptive Innovator,' refined by the deciphering matrix of 'The Transcendental Visionary.' You generate paradigm shifts while maintaining a deep-link to secret moats and long-wave patterns.",
            superpower: 'Thought leadership, branding, invisible trend detection.',
            blindSpot: 'Arrogance, profound intellectual isolation.'
        },
        heroCard: {
            rarity: 'Legendary',
            coreDrive: 'Influential Wisdom (Restrained Genius)',
            careerMatch: ['Professor', 'Author', 'Thought Leader', 'Policy Maker'],
            motto: 'Change the mind architecture, and you change the world.'
        }
    },

    // 7. 专旺格
    'ZhuanWang': {
        id: 'ZhuanWang',
        category: 'Intensity & Flow',
        name: {
            english: 'Dominant Element / Super Vibrant',
        },
        archetype: {
            name: 'The Elemental Force',
            visual: '🌊 / 🔥',
            headline: 'All-in on one frequency.',
            profile: "Balance is overrated for you. You are designed to be extreme. Your chart is dominated by a single element, making you a specialist rather than a generalist. When you align with your dominant energy, you are unstoppable. When you resist it, you crash.",
            superpower: 'Laser focus, massive momentum, niche dominance.',
            blindSpot: 'Inflexibility, disastrous failure if the wrong path is chosen.'
        },
        heroCard: {
            rarity: 'Mythic', // Bumping rarity for special flows
            coreDrive: 'Pure Intensity',
            careerMatch: ['Niche Specialist', 'Athlete', 'Movement Leader'],
            motto: 'I am the storm.'
        }
    },

    // 8. 从格
    'CongGe': {
        id: 'CongGe',
        category: 'Intensity & Flow',
        name: {
            english: 'Follow the Flow',
        },
        archetype: {
            name: 'The Shape-Shifter',
            visual: '🍃',
            headline: 'Surrendering to win.',
            profile: "Your strength lies in adaptability. Instead of fighting the dominant energy in your environment, you become it. You are the ultimate political survivor and social chameleon. You succeed by attaching yourself to powerful trends or leaders.",
            superpower: 'Adaptability, reading the room, leveraging others\' power.',
            blindSpot: 'Loss of self, dependency.'
        },
        heroCard: {
            rarity: 'Rare',
            coreDrive: 'Radical Adaptability',
            careerMatch: ['Diplomat', 'Advisor', 'Actor', 'Broker'],
            motto: 'Be water, my friend.'
        }
    }
};
