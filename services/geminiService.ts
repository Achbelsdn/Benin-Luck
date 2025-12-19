import { GoogleGenerativeAI } from "@google/generative-ai";
import { Ticket } from "../types"; // Assure-toi que ce fichier existe, sinon retire cette ligne

// --- 1. RÉCUPÉRATION DE LA CLÉ ---
const API_KEY = import.meta.env.VITE_API_KEY;

// --- 2. CONFIGURATION DE L'IA ---
// On initialise l'IA directement.
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const getChatResponse = async (message: string): Promise<string> => {
  // DIAGNOSTIC : Si ça s'affiche dans le chat, c'est que la clé n'est pas chargée.
  if (!API_KEY) {
    console.error("ERREUR FATALE: Aucune clé API trouvée (VITE_API_KEY est vide).");
    return "❌ ERREUR CONFIG : La clé API 'VITE_API_KEY' est introuvable dans le fichier .env ou sur Vercel.";
  }

  try {
    // On appelle vraiment Google ici
    const model = genAI!.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Tu es l'assistant de Bénin Luck. Tu es cool, serviable et tu parles français. Tes réponses sont courtes."
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    // Si Google renvoie une erreur, on l'affiche directement dans le chat pour comprendre
    console.error("ERREUR GOOGLE:", error);
    return `❌ ERREUR GOOGLE : ${error.message || "Erreur inconnue"}`;
  }
};

// --- Fonctions annexes (ne bloquent pas le chat) ---
export const generateWinnerAnnouncement = async (ticket: any, prizeName: string) => {
    return `Bravo à ${ticket.purchaser_name || "l'utilisateur"} pour ce lot !`;
};

export const generateMarketingCopy = async (prizeName: string) => {
  return "Tentez votre chance !";
};
