import { GoogleGenerativeAI } from "@google/generative-ai";
import { Ticket } from "../types"; 

const API_KEY = import.meta.env.VITE_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// LISTE DES MODÈLES (Ordre de priorité)
// On commence par le 2.0 Experimental (c'est souvent le nom réel du 2.0 Flash)
const MODELS_TO_TRY = [
  "gemini-2.0-flash-exp",    // Nom technique correct pour la Beta
  "gemini-2.0-flash",        // Nom alternatif
  "gemini-1.5-flash",        // Le plus stable (si le 2.0 plante)
  "gemini-1.5-pro"           // Le plus puissant
];

const CONTEXTE_BENIN_LUCK = `
SYSTEM: Tu es l'IA de Bénin Luck.
CRÉATEUR: Achbel SODJINOU.
RÈGLE: Ticket 100 FCFA.
TON: Court, fun et serviable.
`;

export const getChatResponse = async (message: string): Promise<string> => {
  if (!API_KEY) return "❌ ERREUR : Clé API 'VITE_API_KEY' manquante.";

  // Boucle de test des modèles
  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`Tentative avec le modèle : ${modelName}...`);
      
      const model = genAI!.getGenerativeModel({ model: modelName });
      // On colle le contexte au début du message (plus robuste que systemInstruction)
      const prompt = `${CONTEXTE_BENIN_LUCK}\nUser: ${message}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();

    } catch (error: any) {
      console.warn(`Échec ${modelName} :`, error.message);

      // Si c'est une erreur de réseau (AdBlock ou coupure net)
      if (error.message.includes("Failed to fetch")) {
        return "⚠️ ERREUR RÉSEAU : Votre navigateur ou un AdBlocker bloque la connexion à Google. Désactivez vos extensions et réessayez.";
      }
      // Si c'est le dernier modèle et qu'il a échoué
      if (modelName === MODELS_TO_TRY[MODELS_TO_TRY.length - 1]) {
        return `❌ L'IA ne répond pas. Code erreur : ${error.message}`;
      }
    }
  }
  return "❌ Erreur inconnue.";
};

export const generateWinnerAnnouncement = async (ticket: any, prizeName: string) => {
    return `Félicitations à ${ticket.purchaser_name || "l'heureux gagnant"} ! 🎉`;
};

export const generateMarketingCopy = async (prizeName: string) => {
  return "Tentez votre chance !";
};
