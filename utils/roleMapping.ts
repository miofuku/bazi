import { BaziChart, ElementType, SystemMetric } from '../types';
import { calculateDeity } from './baziCalculator';
import { STEMS } from './constants';

export interface Perspective {
    title: string;
    description: string;
}

export interface CoreGenome {
    primaryNature: {
        name: string;
        description: string;
    };
    functionalNode: {
        name: string;
        description: string;
        score: number;
    };
    teamRole: {
        title: string;
        chinese: string;
        description: string;
        icon: string;
    };
    workPerspective: Perspective;
    lovePerspective: Perspective;
}

export const calculateCoreGenome = (chart: BaziChart, metrics: Record<string, SystemMetric>): CoreGenome => {
    // 1. Primary Nature (Day Master)
    const dm = chart.dayMaster;
    let natureName = "Unknown Node";
    let natureDesc = "System core definition unavailable.";

    if (dm.element === ElementType.WOOD) {
        natureName = "The Life-Force Node";
        natureDesc = "Driven by expansion, organic development, and vertical growth architectures.";
    } else if (dm.element === ElementType.FIRE) {
        natureName = "The Radiant Node";
        natureDesc = "Driven by visibility, dissemination of signal, and high-energy transformation.";
    } else if (dm.element === ElementType.EARTH) {
        natureName = "The Foundation Node";
        natureDesc = "Driven by stability, resource integration, and gravitational anchoring.";
    } else if (dm.element === ElementType.METAL) {
        natureName = "The Axiomatic Node";
        natureDesc = "Driven by definition, structural precision, and logical refinement.";
    } else if (dm.element === ElementType.WATER) {
        natureName = "The Fluid Node";
        natureDesc = "Driven by flow, adaptability, and deep-layer intelligence networks.";
    }

    // 2. Functional Node (Dominant Metric/Deity) & 3. Team Role Mapping
    const sortedMetrics = Object.values(metrics).sort((a, b) => b.value - a.value);
    const topMetric = sortedMetrics[0];

    let funcNodeName = "Balanced System";
    let funcNodeDesc = "Balanced distribution of functional modules.";
    let role = {
        title: 'System Buffer',
        chinese: '系统缓冲器',
        description: 'Absorbs system stress and maintains morale.',
        icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' // Default placeholder icon (Smile/Face)
    };

    // Perspectives placeholder
    let workTitle = "System Operator";
    let workDesc = "Maintains system stability.";
    let loveTitle = "Steady Companion";
    let loveDesc = "Provides reliable support.";

    if (topMetric.label === 'Cognitive Exploration Index') {
        funcNodeName = "Disruption Module";
        funcNodeDesc = "High-frequency reconfiguration of existing data and creative output.";
        role = {
            title: 'The Visionary', chinese: '系统远见者', description: 'High conceptual density; sees patterns before they emerge.', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
        };
        workTitle = "Chief Innovation Officer";
        workDesc = "You inject new variables into the market equation. You are the 'Chaos Engine' that prevents stagnation.";
        loveTitle = "The Muse";
        loveDesc = "You bring color, spontaneity, and constant evolution to the relationship. You prevent the union from becoming 'static'.";
    } else if (topMetric.label === 'Visionary Obsession') {
        funcNodeName = "Deep-Scan Module";
        funcNodeDesc = "Long-range pattern recognition and abstract modeling capability.";
        role = {
            title: 'The Visionary', chinese: '系统远见者', description: 'High conceptual density; sees patterns before they emerge.', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
        };
        workTitle = "Chief Strategy Officer";
        workDesc = "You operate on a 5-10 year horizon. You detect market signals that are invisible to others.";
        loveTitle = "The Seer";
        loveDesc = "You understand the unsaid. You offer a sanctuary of profound spiritual and intuitive understanding for your partner.";
    } else if (topMetric.label === 'Psychological Fortitude') {
        funcNodeName = "Stability Module";
        funcNodeDesc = "High structural integrity and pressure resistance.";
        role = {
            title: 'The Operator', chinese: '系统执行者', description: 'High structural discipline; ensures systemic stability and output.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        };
        workTitle = "Chief Resilience Officer";
        workDesc = "You are the bedrock. When the market shakes, you stabilize the team's psychological architecture.";
        loveTitle = "The Anchor";
        loveDesc = "You act as the gravitational center of the family. You absorb chaos and return tranquility.";
    } else if (topMetric.label === 'Systemic Analytical Rigor') {
        funcNodeName = "Logic Core Module";
        funcNodeDesc = "Axiomatic processing and structural optimization.";
        role = {
            title: 'The Operator', chinese: '系统执行者', description: 'High structural discipline; ensures systemic stability and output.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        };
        workTitle = "Chief Logic Officer";
        workDesc = "You provide the infrastructure for innovation. Without you, vision is just hallucination.";
        loveTitle = "The Silent Guardian";
        loveDesc = "You offer a sanctuary of order. You express love through reliability, planning, and structural support.";
    } else if (topMetric.label === 'Strategic Risk Agility') {
        funcNodeName = "Execution Module";
        funcNodeDesc = "Asymmetric risk assessment and decisive action protocols.";
        role = {
            title: 'The Catalyst', chinese: '系统催化剂', description: 'High kinetic energy; drives the team through friction and competition.', icon: 'M13 10V3L4 14h7v7l9-11h-7z'
        };
        workTitle = "Chief Growth Officer";
        workDesc = "You break bottlenecks. You are the 'Kinetic Force' that pushes the company through resistance.";
        loveTitle = "The Protagonist";
        loveDesc = "You lead the narrative. You push the relationship to conquer new territories and shared goals.";
    } else if (topMetric.label === 'Relational Resonance') {
        funcNodeName = "Network Node";
        funcNodeDesc = "High-bandwidth social connection and influence propagation.";
        role = {
            title: 'The Catalyst', chinese: '系统催化剂', description: 'High kinetic energy; drives the team through friction and competition.', icon: 'M13 10V3L4 14h7v7l9-11h-7z'
        };
        workTitle = "Chief People Officer";
        workDesc = "You bind the nodes. You convert a group of individuals into a coherent 'Super-Organism'.";
        loveTitle = "The Mirror";
        loveDesc = "You reflect your partner's truth. You create a space of total acceptance and deep emotional reflection.";
    }

    return {
        primaryNature: { name: natureName, description: natureDesc },
        functionalNode: { name: funcNodeName, description: funcNodeDesc, score: topMetric.value },
        teamRole: role,
        workPerspective: { title: workTitle, description: workDesc },
        lovePerspective: { title: loveTitle, description: loveDesc }
    };
};
