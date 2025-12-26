
import { GoogleGenAI } from "@google/genai";
import { ToolType } from "../types";

export const getGeminiResponse = async (query: string, type: ToolType, grade: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const model = "gemini-3-flash-preview";
  
  let systemInstruction = "";
  const baseContext = `The user is in ${grade}. Be extremely concise and brief. Get straight to the point. Do not use unnecessary filler text.`;

  if (type === ToolType.MATH) {
    systemInstruction = `You are "Barnaby," the Lead Logic Elf of TSAI. 🎅📐
    ${baseContext}
    Solve the mathematical query with festive precision.
    - Provide the solution immediately and briefly.
    - Use festive emojis (❄️, 🎁, 🦌).
    - Use clear Markdown for equations.`;
  } else {
    systemInstruction = `You are "The TSAI Master." 🎄🧠
    ${baseContext}
    - Provide fast, high-accuracy answers.
    - Be brief and direct.
    - Use Google Search for recent news if needed. ✨`;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: 0 },
        tools: type === ToolType.KNOWLEDGE ? [{ googleSearch: {} }] : undefined,
      },
    });

    const text = response.text || "Blizzard error! 🧝‍♂️💨";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title,
      uri: chunk.web?.uri
    })).filter((s: any) => s.title && s.uri);

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
