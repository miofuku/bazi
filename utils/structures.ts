export interface StructureResult {
    id: string;
    category: 'Creators & Builders' | 'Leaders & Strategists' | 'Solvers & Intellects' | 'Intensity & Flow';
    name: {
        chinese: string;
        english: string; // e.g., Eating God Generating Wealth
        pinyin?: string;
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
            chinese: '食神生财格',
            english: 'Eating God Generating Wealth',
        },
        archetype: {
            name: 'The Creative Alchemist',
            visual: '🌱➡️💎',
            headline: 'Turning pure talent into tangible value.',
            profile: "You are not someone who chases money; you attract it through your skills. Your energy flows smoothly from your inner creativity (The Artist) to external rewards. You believe that if you do what you love with excellence, abundance will follow naturally.",
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
            chinese: '伤官生财格',
            english: 'Hurting Officer Generating Wealth',
        },
        archetype: {
            name: 'The Disruptive Entrepreneur',
            visual: '⚡➡️💰',
            headline: 'Breaking rules to build empires.',
            profile: "Standard paths bore you. You see market gaps that others miss. Your 'Innovator' energy pushes you to challenge the status quo, and your 'Entrepreneur' energy turns those disruptions into profit. You are the classic startup founder or risk-taker.",
            superpower: 'Speed, persuasion, high risk/high reward.',
            blindSpot: 'Burnout, offending authorities.'
        },
        heroCard: {
            rarity: 'Epic',
            coreDrive: 'Disruption (Monetizing Innovation)',
            careerMatch: ['Startup Founder', 'Venture Capitalist', 'Sales Director', 'Trendsetter'],
            motto: 'Rules are suggestions.'
        }
    },

    // 3. 官印相生格
    'GuanYinXiangSheng': {
        id: 'GuanYinXiangSheng',
        category: 'Leaders & Strategists',
        name: {
            chinese: '官印相生格',
            english: 'Officer Supported by Resource',
        },
        archetype: {
            name: 'The Architect of Order',
            visual: '🏛️',
            headline: 'Climbing the ladder with grace and reputation.',
            profile: "You are the backbone of any organization. Your 'Diplomat' energy seeks status, while your 'Guardian' energy ensures you get there through legitimate, respected means. You don't fight for power; you earn it through reliability and systemic thinking.",
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
            chinese: '杀印相生格',
            english: 'Seven Killings Supported by Resource',
        },
        archetype: {
            name: 'The Iron Strategist',
            visual: '🛡️⚔️',
            headline: 'Transforming crisis into authority.',
            profile: "Pressure implies potential to you. Where others see chaos (The Warrior energy), you see a chessboard. You have the unique ability to absorb stress, process it through wisdom (The Guardian/Philosopher), and output it as command. You thrive in difficult times.",
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
            chinese: '食神制杀格',
            english: 'Eating God Controlling Seven Killings',
        },
        archetype: {
            name: 'The Tactical Mastermind',
            visual: '♟️',
            headline: 'Soft power conquering hard obstacles.',
            profile: "You don't fight fire with fire; you fight fire with water. You use your intelligence and specific skills (The Artist) to solve aggressive problems (The Warrior) with precision. You are the expert consultant, the surgeon, or the negotiator who disarms opponents with logic.",
            superpower: 'Problem-solving, technical expertise, precision.',
            blindSpot: 'Over-thinking, perfectionism.'
        },
        heroCard: {
            rarity: 'Epic',
            coreDrive: 'Precision Solution (Skill over Force)',
            careerMatch: ['Surgeon', 'Specialist Consultant', 'Negotiator', 'Engineer'],
            motto: 'Precision beats power.'
        }
    },

    // 6. 伤官配印格
    'ShangGuanPeiYin': {
        id: 'ShangGuanPeiYin',
        category: 'Solvers & Intellects',
        name: {
            chinese: '伤官配印格',
            english: 'Hurting Officer Paired with Resource',
        },
        archetype: {
            name: 'The Wise Disruptor',
            visual: '🦉💡',
            headline: 'Genius with a filter.',
            profile: "This is a rare and powerful combination. You have the wild, rebellious creativity of 'The Innovator,' but it is kept in check by the deep knowledge of 'The Guardian/Philosopher.' You are the professor who revolutionizes the field, or the writer who changes culture.",
            superpower: 'Thought leadership, branding, high reputation.',
            blindSpot: 'Arrogance, feeling misunderstood.'
        },
        heroCard: {
            rarity: 'Legendary',
            coreDrive: 'Influential Wisdom (Restrained Genius)',
            careerMatch: ['Professor', 'Author', 'Thought Leader', 'Policy Maker'],
            motto: 'Change the mind, change the world.'
        }
    },

    // 7. 专旺格
    'ZhuanWang': {
        id: 'ZhuanWang',
        category: 'Intensity & Flow',
        name: {
            chinese: '专旺格',
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
            chinese: '从格',
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
