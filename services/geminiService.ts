import { GoogleGenerativeAI } from "@google/generative-ai";
import { Ticket } from "../types"; 

const API_KEY = import.meta.env.VITE_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// LISTE DE PRIORITÉ BASÉE SUR TA DEMANDE
// On tente d'abord le 2.5 Flash, puis le Lite si besoin.
const PRIORITY_MODELS = [
  "gemini-2.5-flash",       // Ton choix n°1
  "gemini-2.5-flash-lite",  // Ton choix n°2
  "gemini-1.5-flash"        // Sécurité : Le standard fiable (si les 2.5 sont en maintenance)
];

const CONTEXTE_BENIN_LUCK = `
INSTRUCTION: Tu es l'IA de Bénin Luck.
CRÉATEUR: Achbel SODJINOU.
RÈGLE: Ticket 100 FCFA.
TON: Court, fun, serviable.
`;

export const getChatResponse = async (message: string): Promise<string> => {
  if (!API_KEY) return "❌ ERREUR : Clé API manquante dans Vercel.";

  // On boucle sur tes modèles
  for (const modelName of PRIORITY_MODELS) {
    try {
      // console.log(`🚀 Tentative avec le modèle : ${modelName}`);
      
      const model = genAI!.getGenerativeModel({ model: modelName });
      const prompt = `${CONTEXTE_BENIN_LUCK}\nUser: ${message}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();

    } catch (error: any) {
      console.warn(`⚠️ Échec sur ${modelName}:`, error.message);

      // Gestion spécifique des quotas (429)
      if (error.message.includes("429") || error.message.includes("Quota")) {
         // Si le 2.5 est plein, on passe immédiatement au suivant (Lite)
         continue; 
      }
      
      // Si c'est le dernier modèle et qu'il plante aussi
      if (modelName === PRIORITY_MODELS[PRIORITY_MODELS.length - 1]) {
        return "⏳ Mes serveurs sont en pause café (Surcharge Google). Réessayez dans 1 minute !";
      }
    }
  }

  return "❌ Erreur technique inconnue.";
};

export const generateWinnerAnnouncement = async (ticket: any, prizeName: string) => {
    return `Félicitations à ${ticket.purchaser_name || "l'heureux gagnant"} ! 🎉`;
};

export const generateMarketingCopy = async (prizeName: string) => {
  return "Tentez votre chance !";
};
