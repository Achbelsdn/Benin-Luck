import React from 'react';
import { X, Scale, ShieldCheck } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-[#0a0a0a] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-white/5 p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg text-brand-600 dark:text-brand-400">
                    <Scale size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Règlement Officiel</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Conditions de participation</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors text-slate-500">
                <X size={20} />
            </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-8 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            
            <section>
                <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base mb-2">
                    <span className="text-brand-500">01.</span> Organisation
                </h3>
                <p>
                    La loterie "Bénin Luck" est organisée dans le but de promouvoir l'accès à la connaissance et aux outils numériques. Elle est ouverte à toute personne résidant au Bénin et disposant d'un compte Mobile Money actif.
                </p>
            </section>

            <section>
                <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base mb-2">
                    <span className="text-brand-500">02.</span> Participation
                </h3>
                <ul className="list-disc pl-5 space-y-1 marker:text-brand-500">
                    <li>La participation est individuelle.</li>
                    <li>Le coût du ticket est fixé à 100 FCFA.</li>
                    <li>Chaque participant peut acheter plusieurs tickets pour augmenter ses chances.</li>
                    <li>L'achat n'est confirmé qu'après validation de l'ID de transaction par l'administration.</li>
                </ul>
            </section>

            <section>
                <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base mb-2">
                    <span className="text-brand-500">03.</span> Tirage au Sort
                </h3>
                <p>
                    Le tirage au sort est effectué de manière aléatoire via un algorithme sécurisé parmi l'ensemble des tickets vendus (statut "SOLD"). Le tirage a lieu une fois tous les tickets vendus ou à la date fixée par l'organisateur.
                </p>
            </section>

            <section>
                <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base mb-2">
                    <span className="text-brand-500">04.</span> Les Lots
                </h3>
                <p>
                    Les lots incluent des formations, des ebooks, des abonnements (Canva, Netflix, etc.) ou des outils numériques. Les lots ne sont ni échangeables ni remboursables en espèces, sauf décision contraire de l'organisateur.
                </p>
            </section>

            <section>
                <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base mb-2">
                    <span className="text-brand-500">05.</span> Réclamation
                </h3>
                <p>
                    Le gagnant est contacté via le numéro de téléphone fourni lors de l'achat. Sans réponse sous 48h, le lot pourra être remis en jeu.
                </p>
            </section>

            <div className="bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900/30 p-4 rounded-xl flex gap-3">
                <ShieldCheck className="text-brand-600 dark:text-brand-400 shrink-0" size={20} />
                <p className="text-xs text-brand-800 dark:text-brand-300 font-medium">
                    En participant à cette loterie, vous acceptez sans réserve le présent règlement. Toute fraude ou tentative de fraude entraînera l'annulation immédiate de la participation.
                </p>
            </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/20 text-center">
            <button onClick={onClose} className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
                J'ai compris
            </button>
        </div>
      </div>
    </div>
  );
};