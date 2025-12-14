import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Ticket, Wallet, CheckCircle2, Gift, Sparkles, BookOpen, MonitorPlay, Crown } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Bienvenue sur Bénin Luck",
      desc: "La plateforme de loterie prestige qui transforme votre chance en connaissances et en succès.",
      icon: <Crown size={48} className="text-yellow-400" />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Participez pour tenter de gagner des lots d'une valeur inestimable tout en soutenant l'innovation.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-brand-50 dark:bg-brand-900/20 p-3 rounded-xl border border-brand-100 dark:border-brand-800">
                <div className="font-bold text-brand-600 dark:text-brand-400 text-lg">Sécurisé</div>
                <div className="text-xs text-slate-500">Paiement Mobile Money</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-100 dark:border-purple-800">
                <div className="font-bold text-purple-600 dark:text-purple-400 text-lg">Transparent</div>
                <div className="text-xs text-slate-500">Tirage vérifiable</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Étape 1 : Choisissez",
      desc: "Sélectionnez un ticket disponible sur la grille officielle.",
      icon: <Ticket size={48} className="text-brand-500" />,
      content: (
        <div className="space-y-4">
           <div className="flex justify-center gap-4 my-6">
              <div className="w-16 h-20 bg-gradient-to-br from-[#0f2e22] to-[#022c22] rounded-lg border border-emerald-500/50 shadow-lg flex items-center justify-center relative">
                 <span className="text-white font-bold text-xl">07</span>
                 <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                 <div className="absolute -bottom-6 text-[10px] font-bold text-emerald-600 uppercase">Libre</div>
              </div>
              <div className="w-16 h-20 bg-slate-200 dark:bg-[#111] rounded-lg border border-slate-300 dark:border-white/10 opacity-50 flex items-center justify-center grayscale relative">
                 <span className="text-slate-500 font-bold text-xl">12</span>
                 <div className="absolute -bottom-6 text-[10px] font-bold text-slate-400 uppercase">Vendu</div>
              </div>
           </div>
           <p className="text-sm text-center text-slate-500">
             Les tickets verts sont libres. Cliquez dessus pour réserver votre place.
           </p>
        </div>
      )
    },
    {
      title: "Étape 2 : Payez",
      desc: "Effectuez le transfert via MTN ou Celtiis Money.",
      icon: <Wallet size={48} className="text-blue-500" />,
      content: (
        <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/10 space-y-3">
           <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
             1. Copiez le numéro affiché.
           </p>
           <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
             2. Envoyez le montant exact (100 FCFA).
           </p>
           <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 text-xs text-yellow-800 dark:text-yellow-200 flex gap-2">
             <span className="font-bold">IMPORTANT :</span>
             Copiez l'ID de la transaction (ex: 18493020) depuis le SMS de confirmation.
           </div>
        </div>
      )
    },
    {
      title: "Étape 3 : Validez",
      desc: "Confirmez votre achat pour entrer dans la course.",
      icon: <CheckCircle2 size={48} className="text-emerald-500" />,
      content: (
        <div className="space-y-3">
           <div className="bg-white dark:bg-black p-4 rounded-xl shadow-sm border border-slate-200 dark:border-white/10 text-left">
              <div className="h-2 w-1/3 bg-slate-200 dark:bg-white/20 rounded mb-3"></div>
              <div className="h-8 w-full bg-slate-100 dark:bg-white/5 rounded border border-slate-200 dark:border-white/10 flex items-center px-3 text-xs text-slate-400 font-mono mb-2">
                 ID: 284920384
              </div>
              <div className="h-8 w-full bg-brand-500 rounded flex items-center justify-center text-white text-xs font-bold">
                 Valider ma participation
              </div>
           </div>
           <p className="text-xs text-center text-slate-500">
             Une fois validé, votre ticket passe en statut "En Attente" jusqu'à vérification par l'admin.
           </p>
        </div>
      )
    },
    {
      title: "Les Récompenses",
      desc: "Ce que vous pouvez gagner en participant.",
      icon: <Gift size={48} className="text-pink-500" />,
      content: (
        <div className="space-y-3">
           <div className="flex items-center gap-3 p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><MonitorPlay size={20} /></div>
              <div className="text-left">
                 <div className="font-bold text-sm text-slate-900 dark:text-white">Formations Complètes</div>
                 <div className="text-xs text-slate-500">Marketing, Dev, Crypto...</div>
              </div>
           </div>
           <div className="flex items-center gap-3 p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
              <div className="bg-orange-100 text-orange-600 p-2 rounded-lg"><BookOpen size={20} /></div>
              <div className="text-left">
                 <div className="font-bold text-sm text-slate-900 dark:text-white">Packs Ebooks Premium</div>
                 <div className="text-xs text-slate-500">Business & Mindset</div>
              </div>
           </div>
           <div className="flex items-center gap-3 p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg"><Sparkles size={20} /></div>
              <div className="text-left">
                 <div className="font-bold text-sm text-slate-900 dark:text-white">Abonnements & Outils</div>
                 <div className="text-xs text-slate-500">Canva Pro, Netflix, Spotify...</div>
              </div>
           </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onClose();
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
       <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-[#0a0a0a] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/10 animate-in zoom-in-95 duration-300 flex flex-col min-h-[500px]">
        
        {/* Progress Bar */}
        <div className="flex gap-1 p-2">
            {steps.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-brand-500' : 'bg-slate-200 dark:bg-white/10'}`}></div>
            ))}
        </div>

        {/* Skip Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
        >
            Passer
        </button>

        {/* Header Image/Icon Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl"></div>
             <div className="relative z-10 mb-6 transform transition-all duration-500 hover:scale-110">
                {steps[step].icon}
             </div>
             <h2 className="relative z-10 text-2xl font-serif font-black text-slate-900 dark:text-white mb-2">
                {steps[step].title}
             </h2>
             <p className="relative z-10 text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
                {steps[step].desc}
             </p>
        </div>

        {/* Content Body */}
        <div className="px-8 pb-4">
            {steps[step].content}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 mt-auto flex justify-between items-center border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/20">
            <button 
                onClick={handlePrev} 
                disabled={step === 0}
                className={`p-3 rounded-full transition-colors ${step === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'}`}
            >
                <ChevronLeft size={24} />
            </button>

            <div className="flex gap-1.5">
                {steps.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-brand-500' : 'bg-slate-300 dark:bg-white/20'}`}></div>
                ))}
            </div>

            <button 
                onClick={handleNext}
                className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all"
            >
                {step === steps.length - 1 ? 'C\'est parti !' : 'Suivant'}
                {step < steps.length - 1 && <ChevronRight size={16} />}
            </button>
        </div>
      </div>
    </div>
  );
};
