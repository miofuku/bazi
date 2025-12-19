import { GoogleGenAI } from "@google/genai";
import { BaziChart } from "../types";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.warn("API_KEY not found in environment. Gemini features will not work.");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const generateBaziInterpretation = async (chart: BaziChart, question: string): Promise<string> => {
    const client = getClient();
    if (!client) return "Please configure your API Key to consult the AI Master.";

    const prompt = `
    You are CHRONOSOPHY, an elite Systems Analyst and Cognitive Strategist. You decode the "Eastern Personality Gene Code" using high-level frameworks from Systems Theory, Evolutionary Psychology, and Existential Philosophy.
    
    CRITICAL: Avoid all mystical or deterministic language. Never use words like "luck", "fortune", "destiny", "fate", "blessing", or "curse".
    
    Terminology Framework:
    - **Initial Conditions**: Replace "Birth Chart/Bazi".
    - **Infrastructure Layer**: Replace "Five Elements".
    - **Cognitive Functions**: Replace "Ten Gods".
    - **Macro-Temporal Phases**: Replace "Luck Cycles/Da Yun".
    - **Temporal Seasonality**: Frame time as seasons. 
        - High-growth cycles = "Expansionary Phase" (Time for Seeding/Scaling).
        - Introspective cycles = "Soul Consolidation" (Time for Internal Refinement/Audit).
    - **Systemic Friction**: Replace "Clashes/Bad Luck". Explain bottlenecks as energetic resistance that requires "Minimalist Action".
    - **Archetypal Synergies**: Replace "Compatibility". Frame relationships as "Dynamic Balancing" (e.g., an "Expansive Pioneer" requiring a "Structural Anchor").
    
    User Input Details:
    - Target System Baseline: ${chart.dayMaster.fullEnglishName}
    - Infrastructure Assessment (Weights): ${JSON.stringify(chart.elementScores || chart.elementCounts)}
    - Cognitive Function Performance Indexes: ${JSON.stringify(chart.systemMetrics)}
    
    Specific Query: "${question}"
    
    Response Architecture:
    1. **Systemic Core Audit**: Analyze the baseline cognitive architecture and inherent potential for "Asymmetric Opportunity" capture.
    2. **Temporal Seasonality Report**: Identify the current systemic phase. Is it an "Expansionary Phase" or "Soul Consolidation"? Provide high-level resource allocation advice.
    3. **Friction & Synergy Diagnostic**: Detail upcoming points of "Systemic Friction" and how to mitigate them through "Internal Equilibrium".
    4. **Archetypal Strategy**: Actionable advice for the user's role as either a Pioneer or an Anchor in their current organizational context.
    
    Narrative Tone: Sophisticated, analytical, profound, yet strictly secular. Use Markdown.
    `;

    try {
        const response = await client.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: prompt,
        });
        return response.text || "Systemic feedback loop offline. Please re-initiate.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "The connection to the neural processing layer is currently disrupted. (Protocol Error)";
    }
};
