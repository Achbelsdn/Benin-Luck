import { GoogleGenerativeAI } from "@google/generative-ai";
import { Ticket } from "../types"; 

// --- 1. CLÉ API ---
const API_KEY = import.meta.env.VITE_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// --- 2. CONTEXTE (L'intelligence du bot) ---
// On injecte ça directement dans le message pour être sûr que l'IA comprenne qui elle est.
const CONTEXTE_BENIN_LUCK = `
INSTRUCTION : Tu es l'assistant de "Bénin Luck".
Créateur : Achbel SODJINOU (Expert sécu).
Règle : Ticket à 100 FCFA.
Ton : Sympa, tutoiement respectueux, réponses courtes (max 2 phrases).
Si on te demande si tu es une IA, dis oui, propulsée par Google Gemini.
Question utilisateur : 
`;

export const getChatResponse = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "❌ ERREUR : Clé API manquante dans Vercel.";
  }

  try {
    // CORRECTION MAJEURE ICI : On utilise TON modèle disponible
    // D'après ta liste, "gemini-2.0-flash" est le meilleur choix.
    const model = genAI!.getGenerativeModel({ model: "gemini-2.0-flash" });

    // On combine le contexte et le message de l'utilisateur
    const promptComplet = CONTEXTE_BENIN_LUCK + message;

    const result = await model.generateContent(promptComplet);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("ERREUR:", error);

    // Si le 2.0 échoue, on tente le 2.0 Flash-Lite (aussi dans ta liste)
    if (error.message.includes("404") || error.message.includes("not found")) {
        try {
            const fallback = genAI!.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
            const res = await fallback.generateContent(CONTEXTE_BENIN_LUCK + message);
            return (await res.response).text();
        } catch (e) {
            return "❌ Erreur de modèle. Vérifiez que l'API Key a accès à Gemini 2.0.";
        }
    }
    
    return `❌ ERREUR GOOGLE : ${error.message}`;
  }
};

export const generateWinnerAnnouncement = async (ticket: any, prizeName: string) => {
    return `Félicitations à ${ticket.purchaser_name} qui gagne ${prizeName} ! 🎉`;
};

export const generateMarketingCopy = async (prizeName: string) => {
  return "Tentez votre chance maintenant !";
};
