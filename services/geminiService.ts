import { GoogleGenAI, Type } from "@google/genai";

// Ensure API Key is available
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface AIAnalysisResult {
  suggestedSubject: string;
  clarityScore: number;
  refinedDescription: string;
  urgencyAssessment: 'Low' | 'Medium' | 'High';
}

export const analyzeQueryDraft = async (title: string, description: string): Promise<AIAnalysisResult | null> => {
  if (!apiKey) {
    console.warn("No API Key found for Gemini");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following student query submission.
      Title: ${title}
      Description: ${description}
      
      Provide a structured analysis including a suggested academic subject or administrative category, a clarity score (1-10), a more professional/clear version of the description, and an estimated urgency level.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedSubject: { type: Type.STRING, description: "The most likely subject (e.g., Mathematics, Housing, Finance)" },
            clarityScore: { type: Type.INTEGER, description: "Score from 1 to 10 indicating how clear the query is" },
            refinedDescription: { type: Type.STRING, description: "A polished, professional version of the student's description" },
            urgencyAssessment: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
          },
          required: ["suggestedSubject", "clarityScore", "refinedDescription", "urgencyAssessment"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    return null;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
};