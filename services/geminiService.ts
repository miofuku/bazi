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
    You are a wise and compassionate BaZi (Four Pillars of Destiny) master. 
    Analyze the following chart for a user and answer their specific question: "${question}".
    
    Chart Details:
    - Day Master: ${chart.dayMaster.polarity} ${chart.dayMaster.element}
    - Year: ${chart.yearPillar.stem.chinese}${chart.yearPillar.branch.chinese} (${chart.yearPillar.stem.element}/${chart.yearPillar.branch.element})
    - Month: ${chart.monthPillar.stem.chinese}${chart.monthPillar.branch.chinese} (${chart.monthPillar.stem.element}/${chart.monthPillar.branch.element})
    - Day: ${chart.dayPillar.stem.chinese}${chart.dayPillar.branch.chinese} (${chart.dayPillar.stem.element}/${chart.dayPillar.branch.element})
    - Hour: ${chart.hourPillar.stem.chinese}${chart.hourPillar.branch.chinese} (${chart.hourPillar.stem.element}/${chart.hourPillar.branch.element})
    
    Element Counts: 
    ${JSON.stringify(chart.elementCounts)}

    Provide a brief, mystical yet practical interpretation in English. Use Markdown formatting.
    Focus on the interaction of elements.
    `;

    try {
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "The stars are clouded. Please try again.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "The connection to the celestial realm is currently disrupted. (API Error)";
    }
};
