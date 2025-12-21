import { PrismLens } from './lensTranslations';

export interface ArchetypeNarrative {
    name: string;
    keywords: string[];
    lensContent: {
        [key in Exclude<PrismLens, 'temporal'>]: {
            title: string;
            english: string;
            chinese: string;
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
        name: 'The Natural Alchemist (原生炼金术师)',
        keywords: ['Intellectual Fluidity', 'Refinement', 'Aesthetic Output'],
        lensContent: {
            genesis: {
                title: 'The Architecture of Creative Flow (创意流架构)',
                english: "Your core system is wired for Intellectual Fluidity. You do not just process data; you refine it into something elegant. Unlike disruptive forces, your power lies in 'Organic Evolution'—the ability to grow and create without depleting your internal reserves. You are a source of 'Original Light,' seeking joy in the mastery of craft and the decoding of complexity.",
                chinese: "你的底层系统架构具有极高的‘智力流动性’。你不仅是在处理信息，而是在将其精炼为优雅的产出。与破坏性的力量不同，你的核心原力在于‘有机演化’——即在不消耗自身内部储备的情况下实现增长与创造。你是‘原生灵感’的源泉，在对技艺的精通和对复杂事物的解码中获得内在的共鸣。"
            },
            synergy: {
                title: 'The R&D and Innovation Engine (研发与创新引擎)',
                english: "In a professional ecosystem, you act as the Strategic Refiner. You are the guardian of quality and user experience. While others may focus on aggressive expansion, your system ensures 'Sustainable Growth' through continuous product alchemy. You excel in R&D, long-term strategy, and any role requiring deep, qualitative insight that prevents systemic burnout.",
                chinese: "在职业生态系统中，你扮演着‘战略精炼者’的角色。你是质量与用户体验的守护神。当他人可能专注于激进的扩张时，你的系统通过持续的产品‘炼金术’来确保‘可持续增长’。你在研发、长期战略以及任何需要深度定性洞察的岗位上表现卓越，能够有效防止系统性的过度消耗。"
            },
            resonance: {
                title: 'The Harmonic Nourisher (和谐滋养者)',
                english: "In the realm of intimacy, you provide Emotional Generosity. Your resonance is gentle yet profound, offering your partner a sanctuary of shared aesthetics and intellectual support. You prioritize 'Atmospheric Equilibrium,' seeking a partner who values deep conversation and the art of living. Your presence acts as a natural lubricant to your partner's systemic friction.",
                chinese: "在亲密关系领域，你提供的是‘情感慷慨’。你的共鸣温和而深远，为伴侣提供了一个共享美学与智力支持的避港。你优先考虑‘氛围平衡’，寻找能够理解深度对话与生活艺术的伴侣。你的存在就像一种天然的润滑剂，能够化解伴侣系统中的摩擦与压力。"
            }
        },
        intensityAdvice: {
            high: {
                modifiers: ['Prolific (多产的)', 'Gourmet of Ideas (思想饕餮)'],
                warning: "警惕“过分沉溺于完美而推迟输出”。"
            },
            low: {
                modifiers: ['Hidden Catalyst (隐藏的催化剂)', 'Latent Creativity (潜在创造力)'],
                advice: "建议“通过刻意练习来激活表达模块”。"
            },
            compromised: {
                diagnosis: "Internal Blockage (内部阻塞), Logic Suppression (逻辑压制)",
                protocol: "当前系统存在‘表达抑制’，建议通过‘结构化写作’来强制疏通能量流。"
            }
        }
    },
    'Hurting Officer': {
        name: 'The Disruptive Innovator (颠覆式创新者)',
        keywords: ['Paradigm Shift', 'Unconventional Brilliance', 'High Entropy'],
        lensContent: {
            genesis: {
                title: 'The Architecture of Creative Defiance (结构性反叛)',
                english: "Your system thrives on Structural Defiance. You are naturally wired to identify the cracks in existing hierarchies and exploit them through radical expression. Your intelligence is not linear; it is explosive, designed to challenge the status quo and impose a new, more vibrant logic upon the world.",
                chinese: "你的系统靠“结构性反叛”驱动。你天生就能发现现有层级制度中的裂缝，并通过激进的表达来利用它们。你的智慧是非线性的，它具有爆发力，旨在挑战现状，并将一种全新的、更具活力的逻辑强加于世界。"
            },
            synergy: {
                title: 'The Provocateur of Innovation (首席愿景挑衅者)',
                english: "In a team, you are the Chief Visionary Provocateur. You excel at 'Zero-to-One' phases where the old rules must be burned to create space for the new. Your role is to prevent systemic stagnation, ensuring that the organization remains at the bleeding edge of innovation.",
                chinese: "在团队中，你是“首席愿景挑衅者”。你擅长“从0到1”的阶段，即必须烧毁旧规则为新事物创造空间。你的职责是防止系统性停滞，确保组织始终处于创新的最前沿。"
            },
            resonance: {
                title: 'The Laboratory of Evolution (进化实验室)',
                english: "Intimacy with you is an Intellectual Adventure. You seek a partner who can match your intensity and navigate the high-frequency turbulence of your mind. You are drawn to 'Complexity' and require a relationship that acts as a laboratory for mutual evolution, rather than a static sanctuary.",
                chinese: "与你的亲密关系是一场“智力冒险”。你寻找能够匹配你的强度、并能驾驭你思想中高频波动的伴侣。你被“复杂性”吸引，需要一种能作为彼此进化实验室的关系，而非一个停滞的避风港。"
            }
        },
        intensityAdvice: {
            high: {
                modifiers: ['Explosive (爆发性的)', 'Iconoclastic (打破偶像的)'],
                warning: "警惕“为了颠覆而颠覆导致的无序增长”。"
            },
            low: {
                modifiers: ['Measured Rebel (节制的叛逆者)', 'Latent Brilliance (潜在才华)'],
                advice: "建议“选择特定领域进行深度突破，而非全面开火”。"
            },
            compromised: {
                diagnosis: "Social Resistance (社会阻力), Signal Suppression (信号抑制)",
                protocol: "当前系统存在‘表达错位’，建议通过‘寻找非传统渠道’来释放被压制的创新能量。"
            }
        }
    },
    'Seven Killings': {
        name: 'The Strategic Aggressor (战略攻坚者)',
        keywords: ['Crisis Mastery', 'Decisive Authority', 'Kinetic Energy'],
        lensContent: {
            genesis: {
                title: 'High-Pressure Engine (高压引擎)',
                english: "Your system is a High-Pressure Engine designed for survival and conquest. You possess an innate 'Crisis Instinct,' allowing you to remain hyper-focused when external environments collapse. Your core logic is built on the mastery of power and the relentless pursuit of strategic objectives under duress.",
                chinese: "你的系统是一个为生存和征服而设计的“高压引擎”。你拥有天生的“危机本能”，使你在外部环境崩溃时保持极度专注。你的底层逻辑建立在对力量的掌控以及在压力下对战略目标的不懈追求之上。"
            },
            synergy: {
                title: 'The Wartime CEO (战时CEO)',
                english: "You are the Wartime CEO. In high-stakes environments, your ability to execute 'Surgical Decisions' makes you an indispensable asset. You don't just manage teams; you lead 'Campaigns.' Your presence ensures that the organization maintains its momentum against all external resistance.",
                chinese: "你是“战时CEO”。在生死攸关的环境中，你做出“外科手术式决策”的能力使你成为不可或缺的资产。你不只是管理团队，你是在领导“战役”。你的存在确保了组织在面对所有外部阻力时仍能保持势头。"
            },
            resonance: {
                title: 'The Protective Alliance (防御联盟)',
                english: "Intimacy is a Protective Alliance. You express love through 'Shielding'—creating a secure perimeter for your partner against the world's turbulence. While your intensity can be overwhelming, it provides a foundation of absolute loyalty and raw power.",
                chinese: "亲密关系对你而言是一种“防御联盟”。你通过“屏蔽”来表达爱——为伴侣创造一个抵御世界动荡的安全边界。虽然你的强度可能令人压力巨大，但它提供了一种绝对忠诚和原始力量的根基。"
            }
        },
        intensityAdvice: {
            high: {
                modifiers: ['Implacable (无情的)', 'Supreme Commando (顶级特种兵)'],
                warning: "警惕“过度警觉导致的持续性防御疲劳”。"
            },
            low: {
                modifiers: ['Reserved Force (内敛的力量)', 'Reactive Guard (反应型护卫)'],
                advice: "建议“在关键决策点主动显露锋芒，而非被动等待危机”。"
            },
            compromised: {
                diagnosis: "Paralytic Fear (瘫痪性恐惧), Over-Control (过度掌控)",
                protocol: "系统处于‘能量内耗’，建议通过‘体能极限训练’或‘高风险博弈模拟’来重新锚定掌控感。"
            }
        }
    },
    'Indirect Resource': {
        name: 'The Transcendental Visionary (超验远见者)',
        keywords: ['Non-linear Insight', 'Hidden Logic', 'Systemic Seclusion'],
        lensContent: {
            genesis: {
                title: 'The Deciphering Matrix (解码矩阵)',
                english: "You possess a Deciphering Matrix that operates beyond the visible spectrum. Your mind is attracted to 'Hidden Patterns' and 'Esoteric Logic' that others overlook. You are a 'Deep-Link' thinker, processing reality through a filter of profound intuition and intellectual isolation.",
                chinese: "你拥有一个运行在可见光谱之外的“解码矩阵”。你的头脑被他人忽视的“隐藏模式”和“奥义逻辑”所吸引。你是一个“深层链接”思考者，通过深刻的直觉和智力抽离的过滤网来处理现实。"
            },
            synergy: {
                title: 'Guardian of the Secret Moat (秘密护城河守护者)',
                english: "In the professional sphere, you are the Guardian of the Secret Moat. You excel at identifying future risks and 'Invisible Trends' before they manifest in data. Your value lies in 'Unconventional R&D' and strategic forecasting, providing an intellectual defense competitors cannot replicate.",
                chinese: "在职业领域，你是“秘密护城河的守护者”。你擅长在数据显现之前识别未来风险和“隐形趋势”。你的价值在于“非常规研发”和战略预测，为组织提供一层竞争对手无法复制的智力防御。"
            },
            resonance: {
                title: 'Soul-Level Synchronization (灵魂级同步)',
                english: "Your resonance is Soul-Level Synchronization. You seek a partner who can exist within your 'Quiet Space' and understand the unspoken frequencies of your thoughts. You value 'Intellectual Solitude' shared with another, creating a bond based on a private, sacred language.",
                chinese: "你的共鸣是“灵魂级的同步”。你寻找能够存在于你的“静谧空间”中并理解你思想中无声频率的伴侣。你珍视与他人共享的“智力孤独”，建立一种基于私人、神善语言的纽带，这种语言外界无法解码。"
            }
        },
        intensityAdvice: {
            high: {
                modifiers: ['Mystic Strategist (神秘战略家)', 'Pattern Master (模式大师)'],
                warning: "警惕“脱离现实的纯思维实验导致的孤立无援”。"
            },
            low: {
                modifiers: ['Intuitive Observer (直觉观察者)', 'Quiet Decoder (安静的解码者)'],
                advice: "建议“有意识地建立数据基准，将直觉锚定在可观察的事实上”。"
            },
            compromised: {
                diagnosis: "Mental Fog (心理迷雾), Social Alienation (社交隔离)",
                protocol: "检测到‘系统冗余干扰’，建议通过‘极简物理生活’来清空外部信号，重新激活深层链接。"
            }
        }
    }
};
