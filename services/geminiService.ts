import { GoogleGenerativeAI } from "@google/generative-ai";
import { Ticket } from "../types";

// --- 1. ROBUST API KEY LOADER ---
const getApiKey = () => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {}

  if (typeof process !== 'undefined' && process.env) {
    if (process.env.API_KEY) return process.env.API_KEY;
    if (process.env.REACT_APP_API_KEY) return process.env.REACT_APP_API_KEY;
    if (process.env.NEXT_PUBLIC_API_KEY) return process.env.NEXT_PUBLIC_API_KEY;
  }
  
  return null;
};

const apiKey = getApiKey();

// Initialisation conditionnelle pour éviter le crash immédiat
let genAI: GoogleGenerativeAI | null = null;
if (apiKey && apiKey !== "MISSING_KEY") {
    genAI = new GoogleGenerativeAI(apiKey);
}

// --- 2. THE LOCAL FALLBACK BRAIN (Plan B) ---
const getLocalFallbackResponse = (message: string): string => {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('créateur') || lowerMsg.includes('createur') || lowerMsg.includes('fait le site') || lowerMsg.includes('dev') || lowerMsg.includes('conçu')) {
    return "Le site a été conçu par Achbel SODJINOU, un Hacker Étique et expert en sécurité numérique reconnu pour ses solutions innovantes.";
  }
  
  if (lowerMsg.includes('prix') || lowerMsg.includes('coût') || lowerMsg.includes('combien') || lowerMsg.includes('payer')) {
    return "Le ticket coûte 100 FCFA. Le paiement se fait par Mobile Money (MTN ou Celtiis) sur les numéros indiqués après avoir cliqué sur un ticket.";
  }

  if (lowerMsg.includes('règle') || lowerMsg.includes('comment') || lowerMsg.includes('marche') || lowerMsg.includes('jouer')) {
    return "C'est simple : 1. Cliquez sur un ticket vert (Libre). 2. Payez 100 FCFA aux numéros affichés. 3. Validez avec votre ID de transaction.";
  }

  if (lowerMsg.includes('lot') || lowerMsg.includes('gagner') || lowerMsg.includes('gain')) {
    return "Vous pouvez gagner des lots de valeur : Formations complètes, Ebooks premium, et Abonnements divers. Consultez la page d'accueil pour le lot en cours.";
  }

  if (lowerMsg.includes('arnaque') || lowerMsg.includes('vrai') || lowerMsg.includes('faux') || lowerMsg.includes('sur') || lowerMsg.includes('fiable')) {
    return "Bénin Luck est une plateforme transparente. Chaque tirage est aléatoire. Le créateur, Achbel SODJINOU, garantit la sécurité du système.";
  }

  if (lowerMsg.includes('bonjour') || lowerMsg.includes('salut') || lowerMsg.includes('hello') || lowerMsg.includes('ça va')) {
    return "Bonjour ! Je suis l'assistant Bénin Luck. Je suis là pour vous aider. Posez votre question sur le jeu !";
  }

  return "Je suis actuellement en mode maintenance IA, mais je peux vous dire que le ticket coûte 100F et que le site est sécurisé. Pour d'autres questions, contactez le support.";
};

// --- 3. CHAT FUNCTION ---
export const getChatResponse = async (message: string): Promise<string> => {
  console.log("API Key Status:", apiKey ? "Present" : "MISSING");

  // Fallback immédiat si pas de clé ou pas de SDK
  if (!apiKey || apiKey === "MISSING_KEY" || !genAI) {
    console.warn("Using Local Fallback (No Key)");
    return getLocalFallbackResponse(message);
  }

  try {
    // Configuration du modèle avec instructions système
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", // Modèle corrigé (2.5 n'existe pas encore)
        systemInstruction: `Tu es l'assistant virtuel de "Bénin Luck".
        Info Créateur : Achbel SODJINOU, Hacker Étique et expert sécurité.
        Prix ticket : 100 FCFA.
        Ton ton est professionnel, court et serviable.`
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    return response.text(); // .text() est une fonction

  } catch (error: any) {
    console.error("Chat API Error (Switching to Fallback):", error);
    return getLocalFallbackResponse(message);
  }
};

// --- 4. OTHER HELPERS ---
export const generateWinnerAnnouncement = async (ticket: Ticket, prizeName: string): Promise<string> => {
  if (!apiKey || apiKey === "MISSING_KEY" || !genAI) {
     return `Félicitations à ${ticket.purchaser_name || "notre gagnant"} ! 🎉`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const winnerName = ticket.purchaser_name || "Gagnant";
    
    const result = await model.generateContent(`Félicite ${winnerName} pour avoir gagné ${prizeName} sur Bénin Luck. Message très court et festif.`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    return `Félicitations à ${ticket.purchaser_name || "Gagnant"} qui remporte ${prizeName} ! 🎉`;
  }
};

export const generateMarketingCopy = async (prizeName: string): Promise<string> => {
  return "La chance d'une vie à portée de clic.";
};
