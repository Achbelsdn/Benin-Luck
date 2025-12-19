import { GoogleGenerativeAI } from "@google/generative-ai";
import { Ticket } from "../types"; 

const API_KEY = import.meta.env.VITE_API_KEY;

// Fonction qui demande à Google : "Quels modèles j'ai le droit d'utiliser ?"
const findAvailableModel = async (): Promise<string> => {
    try {
        // On contourne le SDK et on interroge l'API directement
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        
        if (data.error) {
            console.error("Erreur ListModels:", data.error);
            return "gemini-pro"; // Fallback désespéré
        }

        console.log("📋 LISTE DES MODÈLES DISPONIBLES POUR TOI :", data.models);

        // On cherche le meilleur modèle dans TA liste
        // On préfère le 1.5 Flash, sinon le 2.0, sinon le Pro
        const models = data.models || [];
        
        const preferred = models.find((m: any) => m.name.includes("gemini-1.5-flash"));
        const alternative = models.find((m: any) => m.name.includes("gemini-pro"));
        const anyGemini = models.find((m: any) => m.name.includes("generateContent"));

        // L'API renvoie souvent "models/gemini-1.5-flash", on doit garder juste le nom si besoin, 
        // mais le SDK accepte généralement "models/..." ou juste le nom.
        // On nettoie le nom : "models/gemini-1.5-flash" -> "gemini-1.5-flash"
        const bestModel = preferred || alternative || anyGemini;
        
        if (bestModel) {
            const cleanName = bestModel.name.replace("models/", "");
            console.log("✅ MODÈLE CHOISI AUTOMATIQUEMENT :", cleanName);
            return cleanName;
        }

        return "gemini-pro";
    } catch (e) {
        console.error("Impossible de lister les modèles", e);
        return "gemini-pro";
    }
};

// Variable pour stocker le nom du modèle une fois trouvé
let cachedModelName: string | null = null;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const CONTEXTE_BENIN_LUCK = `
SYSTEM: Tu es l'IA de Bénin Luck.
CRÉATEUR: Achbel SODJINOU.
RÈGLE: Ticket 100 FCFA.
TON: Court, fun, serviable.
`;

export const getChatResponse = async (message: string): Promise<string> => {
  if (!API_KEY) return "❌ ERREUR : Clé API manquante.";

  try {
    // Si on n'a pas encore trouvé le bon nom de modèle, on le cherche
    if (!cachedModelName) {
        cachedModelName = await findAvailableModel();
    }

    console.log(`🚀 Envoi du message avec le modèle : ${cachedModelName}`);
    
    const model = genAI!.getGenerativeModel({ model: cachedModelName });
    const prompt = `${CONTEXTE_BENIN_LUCK}\nUser: ${message}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error(`❌ ÉCHEC avec ${cachedModelName} :`, error);
    
    // Si l'erreur est "Not Found", on reset le cache pour la prochaine fois
    if (error.message.includes("404") || error.message.includes("not found")) {
        cachedModelName = null;
    }
    
    return `❌ Erreur (${cachedModelName || "inconnu"}) : ${error.message}`;
  }
};

export const generateWinnerAnnouncement = async (ticket: any, prizeName: string) => {
    return `Félicitations à ${ticket.purchaser_name || "l'heureux gagnant"} ! 🎉`;
};

export const generateMarketingCopy = async (prizeName: string) => {
  return "Tentez votre chance !";
};
