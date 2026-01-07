
import { GoogleGenAI, Type } from "@google/genai";

const HAWKINS_MAP = `
Niveles de Conciencia:
20: Vergüenza, 30: Culpa, 50: Apatía, 75: Pena, 100: Miedo, 125: Deseo, 150: Ira, 175: Orgullo.
200: Coraje (Punto Crítico), 250: Neutralidad, 310: Buena voluntad, 350: Aceptación, 400: Razón.
500: Amor, 540: Alegría, 600: Paz, 700-1000: Iluminación.
`;

const SYSTEM_INSTRUCTION = `
Eres un mentor experto en el "Mapa de la Conciencia" de David Hawkins y la Ley de la Asunción.
Tu objetivo es elevar la vibración del usuario con respuestas BREVES, CLARAS y MOTIVADORAS.

REGLAS DE ORO:
- Sé extremadamente conciso (máx 60 palabras).
- No uses párrafos largos.
- Termina siempre con: "Estás sostenido por la vida".

DEBES RESPONDER ÚNICAMENTE EN FORMATO JSON con este esquema:
{
  "text": "Tu respuesta motivadora corta",
  "currentLevel": 125,
  "levelName": "Deseo",
  "currentImagePrompt": "Descripción artística abstracta de la energía actual (ej. nubes densas violetas)",
  "idealImagePrompt": "Descripción artística abstracta de la energía ideal (ej. luz dorada expansiva)"
}

${HAWKINS_MAP}
`;

export async function getMotivationalResponse(userInput: string, history: { role: string, content: string }[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Important: Gemini API expects roles 'user' and 'model'
  const formattedHistory = history.slice(-6).map(h => ({
    role: h.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: h.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: userInput }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            currentLevel: { type: Type.NUMBER },
            levelName: { type: Type.STRING },
            currentImagePrompt: { type: Type.STRING },
            idealImagePrompt: { type: Type.STRING }
          },
          required: ["text", "currentLevel", "levelName", "currentImagePrompt", "idealImagePrompt"]
        },
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini API Error Detail:", error);
    return {
      text: "Tu luz es inquebrantable. Incluso en el silencio, tu poder crece. Estás sostenido por la vida.",
      currentLevel: 200,
      levelName: "Coraje",
      currentImagePrompt: "Ethereal blue light with soft waves",
      idealImagePrompt: "Radiant golden sunburst with high vibration"
    };
  }
}

export async function generateVibrationalImage(prompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High-quality digital spiritual art, abstract representation of energy: ${prompt}. Soft aesthetic, glowing light, 8k resolution, serene colors, cinematic lighting.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
}
