import { GoogleGenAI } from "@google/genai";
import { Ticket } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Chat capability for the AI Assistant
export const getChatResponse = async (message: string): Promise<string> => {
  try {
    // Utilisation de gemini-2.0-flash-exp pour une meilleure compatibilité et éviter les erreurs 403 du 2.5
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: message,
      config: {
        systemInstruction: `Tu es l'assistant virtuel de "Bénin Luck", une plateforme de loterie de prestige au Bénin.
        
        Règles du jeu à expliquer si demandé :
        1. Le joueur choisit un ticket "Libre" (Vert) sur la grille.
        2. Il effectue un paiement de 100 FCFA par Mobile Money (MTN ou Celtiis) aux numéros indiqués.
        3. Il valide son ticket en entrant son nom et l'ID de transaction.

        Info Créateur (IMPORTANT : à dire uniquement si on demande qui a créé le site) :
        Le site a été conçu par Achbel SODJINOU, un Hacker Étique et expert en sécurité numérique. Il est reconnu pour créer des solutions digitales innovantes et sécurisées.
        
        Ton ton doit être : Courtois, Professionnel, et Encouruageant.
        Réponds de manière concise (max 3 phrases si possible).
        N'invente pas de faux gagnants.
        Si on te demande les lots, mentionne : Formations, Ebooks, Abonnements Premium.`,
      }
    });
    return response.text || "Je n'ai pas compris, pouvez-vous reformuler ?";
  } catch (error) {
    console.error("Chat API Error:", error);
    // Message d'erreur plus explicite pour le débogage (invisible pour l'utilisateur final si on veut, mais utile ici)
    return "Désolé, je rencontre une erreur de connexion. (Si vous êtes l'admin : Vérifiez que le domaine du site est autorisé sur la clé API Google).";
  }
};

// Only keeping the Winner Announcement logic as requested to remove the marketing text generation
export const generateWinnerAnnouncement = async (ticket: Ticket, prizeName: string): Promise<string> => {
  try {
    const winnerName = ticket.purchaser_name || "Gagnant";
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `
        Tu es l'animateur d'une loterie prestigieuse au Bénin.
        Gagnant: ${winnerName} (Ticket N°${ticket.id}).
        Lot: ${prizeName}.
        Tâche: Rédige un message WhatsApp court (max 30 mots) avec des emojis festifs. Félicite le gagnant et dis aux autres que leur tour viendra.
      `,
    });
    return response.text || "Félicitations au gagnant !";
  } catch (error) {
    console.error("Error generating announcement:", error);
    const winnerName = ticket.purchaser_name || "Gagnant";
    return `Félicitations à ${winnerName} qui remporte ${prizeName} avec le ticket N°${ticket.id} ! 🎉`;
  }
};

// Deprecated: Marketing copy is now static to allow better control and UI design
export const generateMarketingCopy = async (prizeName: string): Promise<string> => {
  return "La chance d'une vie.";
}