
import { GoogleGenAI, Type } from "@google/genai";
import type { AudioSettings } from "../types";

// Use Vite's import.meta.env for environment variables in the browser build
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || import.meta.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        pitch: { 
            type: Type.NUMBER, 
            description: "Pitch multiplier. Range: 0.5 to 2.0. 1.0 is original pitch." 
        },
        tempo: { 
            type: Type.NUMBER, 
            description: "Tempo multiplier. Range: 0.5 to 2.0. 1.0 is original tempo." 
        },
        bass: { 
            type: Type.NUMBER, 
            description: "Bass gain in dB. Range: -20 to 20. 0 is no change." 
        },
        mid: { 
            type: Type.NUMBER, 
            description: "Mid-range gain in dB. Range: -20 to 20. 0 is no change." 
        },
        treble: { 
            type: Type.NUMBER, 
            description: "Treble gain in dB. Range: -20 to 20. 0 is no change." 
        },
    },
    required: ["pitch", "tempo", "bass", "mid", "treble"],
};


export async function getAudioSuggestions(prompt: string): Promise<AudioSettings | null> {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following user request and provide optimal audio settings. The user wants the audio to sound like: "${prompt}". Provide settings for pitch, tempo, bass, mid, and treble within their allowed ranges.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const suggestedSettings = JSON.parse(jsonText);
        
        // Basic validation
        if (
            typeof suggestedSettings.pitch === 'number' &&
            typeof suggestedSettings.tempo === 'number' &&
            typeof suggestedSettings.bass === 'number' &&
            typeof suggestedSettings.mid === 'number' &&
            typeof suggestedSettings.treble === 'number'
        ) {
            return suggestedSettings as AudioSettings;
        }

        console.error("Invalid JSON structure from Gemini", suggestedSettings);
        return null;

    } catch(error) {
        console.error("Error calling Gemini API:", error);
        return null;
    }
}
