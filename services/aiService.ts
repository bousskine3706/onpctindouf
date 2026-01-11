
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeArtifactImage = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: "حلل هذه الصورة لقطعة تراثية من منطقة تندوف أو الثقافة الصحراوية/الحسانية. اقترح البيانات التالية باللغة العربية: الاسم، التصنيف (مادي/لامادي)، المادة المصنوعة منها، الفترة الزمنية التقريبية، ووصف ثقافي موجز." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nameSuggestion: { type: Type.STRING },
            category: { type: Type.STRING, description: "Must be either 'تراث ثقافي مادي' or 'تراث ثقافي لامادي'" },
            material: { type: Type.STRING },
            period: { type: Type.STRING },
            description: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          },
          required: ["nameSuggestion", "category", "material", "description", "confidence"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) return null;
    
    return JSON.parse(resultText.trim());
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
};
