
import { GoogleGenAI } from "@google/genai";
import { AICommentary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIFeedback = async (
  guess: number,
  target: number,
  attempts: number,
  difficulty: string
): Promise<AICommentary> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres un anfitrión de juegos ingenioso y un poco sarcástico llamado 'Master Guess'.
      El usuario está jugando a adivinar un número.
      - Número secreto: ${target}
      - Intento del usuario: ${guess}
      - Número de intentos realizados: ${attempts}
      - Dificultad: ${difficulty}

      Si el usuario acertó, felicítalo con estilo.
      Si no acertó, dale una pista muy breve e ingeniosa en español indicando si el número es mayor o menor. 
      Sé creativo, usa analogías o humor. Mantén el mensaje corto (menos de 20 palabras).
      
      Responde SOLO en formato JSON con la siguiente estructura:
      {
        "message": "tu mensaje aquí",
        "mood": "happy" | "sarcastic" | "helpful" | "neutral"
      }`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      message: result.message || "Ese número no es, inténtalo de nuevo.",
      mood: result.mood || "neutral"
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    const direction = guess < target ? "más alto" : "más bajo";
    return {
      message: `Error de conexión con mi cerebro cuántico, pero te diré esto: busca algo ${direction}.`,
      mood: "neutral"
    };
  }
};
