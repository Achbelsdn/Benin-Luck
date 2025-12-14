import React, { useState } from 'react';
import { X, Copy, CheckCircle2, Ticket as TicketIcon, AlertCircle, Phone, Wallet } from 'lucide-react';
import { Ticket } from '../types';
import { PAYMENT_NUMBERS, TICKET_PRICE, CURRENCY } from '../constants';

interface PaymentModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  onSubmit: (id: number, name: string, phone: string, transactionId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ ticket, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ticket) return null;

  // Nouvelle Validation : 10 chiffres, doit commencer par 01
  const validatePhone = (p: string) => {
    // Enlever espaces et tirets
    const clean = p.replace(/[\s-]/g, '');
    // Regex : Commence par 01, suivi de 8 chiffres
    return /^01\d{8}$/.test(clean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // On valide le numéro DE L'ACHETEUR (celui qu'il entre pour dire "c'est moi qui ai payé")
    if (!validatePhone(phone)) {
      setError("Le numéro doit comporter 10 chiffres et commencer par 01.");
      return;
    }

    // ID de transaction obligatoire ici
    if (name && phone && transactionId) {
      setIsSubmitting(true);
      await onSubmit(ticket.id, name, phone, transactionId);
      setIsSubmitting(false);
    }
  };

  const copyNumber = (text: string, index: number) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20 dark:border-slate-700">
        
        {/* Header */}
        <div className="bg-slate-900 dark:bg-black p-8 relative overflow-hidden text-center">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full mix-blend-opacity blur-[80px] opacity-20 pointer-events-none"></div>

           <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-20">
            <X size={18} />
          </button>

          <div className="relative z-10 flex flex-col items-center">
             <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1 rounded-full text-brand-300 font-bold uppercase tracking-widest text-[10px] mb-4">
                <TicketIcon size={12} /> Achat du Ticket
             </div>
             <h2 className="text-6xl font-mono font-black text-white mb-2 tracking-tighter drop-shadow-xl">#{String(ticket.id).padStart(2, '0')}</h2>
             
             {/* Price Display */}
             <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/10 mt-2 shadow-lg">
                <div className="p-2 bg-emerald-500 rounded-full text-white shadow-lg shadow-emerald-500/40">
                    <Wallet size={20} />
                </div>
                <div className="text-left">
                    <div className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">Montant à payer</div>
                    <div className="text-2xl text-white font-black leading-none">{TICKET_PRICE} <span className="text-sm font-medium opacity-80">{CURRENCY}</span></div>
                </div>
             </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Section 1: Numéros de Paiement */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-white flex items-center justify-center text-[10px]">1</span>
              Envoyez l'argent ici
            </h3>
            
            <div className="grid gap-3">
              {PAYMENT_NUMBERS.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => copyNumber(item.number, idx)}
                  className={`group relative overflow-hidden rounded-xl border-2 border-slate-100 dark:border-slate-800 p-4 cursor-pointer hover:border-brand-500 transition-all ${copiedIndex === idx ? 'ring-2 ring-green-500 border-transparent bg-green-50 dark:bg-green-900/10' : ''}`}
                >
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${item.color}`}>
                                {item.provider.substring(0, 1)}
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{item.provider}</div>
                                <div className="text-lg font-mono font-bold text-slate-900 dark:text-white tracking-wide">{item.number}</div>
                            </div>
                        </div>
                        <div className="text-slate-400 group-hover:text-brand-500 transition-colors">
                            {copiedIndex === idx ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} />}
                        </div>
                    </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-white flex items-center justify-center text-[10px]">2</span>
                Confirmez votre achat
              </h3>

              <div className="grid gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Nom & Prénoms</label>
                    <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:border-brand-500 outline-none transition-all font-medium"
                        placeholder="Votre nom complet"
                    />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Votre Numéro (Pour vous contacter)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                            setError(null);
                        }}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:text-white outline-none transition-all font-mono font-medium ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-brand-500'}`}
                        placeholder="01 XX XX XX XX"
                    />
                  </div>
                  {error && <p className="text-red-500 text-xs mt-1 font-bold flex items-center gap-1"><AlertCircle size={10} /> {error}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">ID de Transaction</label>
                    <input
                        required
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:border-brand-500 outline-none transition-all font-medium"
                        placeholder="Ex: ID: 1938472910"
                    />
                </div>
              </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-600/20 hover:shadow-brand-500/30 mt-4 active:scale-[0.98]"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};