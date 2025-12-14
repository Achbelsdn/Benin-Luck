import React from 'react';
import { Ticket, TicketStatus } from '../types';
import { Lock, Loader2, Sparkles, Check, Diamond } from 'lucide-react';
import { TICKET_PRICE } from '../constants';

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  const isAvailable = ticket.status === TicketStatus.AVAILABLE;
  const isPending = ticket.status === TicketStatus.PENDING;
  const isSold = ticket.status === TicketStatus.SOLD;

  // New "Crypto Token" / "VIP Card" Design Config
  const getStyles = () => {
    if (isAvailable) return {
      card: "bg-gradient-to-br from-[#0f2e22] to-[#022c22] border-emerald-500/30 shadow-[0_4px_20px_rgba(16,185,129,0.15)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:-translate-y-1 hover:border-emerald-400/50",
      textMain: "text-white",
      textSub: "text-emerald-400",
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      icon: <Sparkles size={14} className="text-yellow-300 animate-pulse" />
    };
    if (isPending) return {
      card: "bg-gradient-to-br from-[#2b1f0e] to-[#1a1205] border-amber-500/30 opacity-90",
      textMain: "text-white",
      textSub: "text-amber-400",
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      icon: <Loader2 size={14} className="text-amber-400 animate-spin" />
    };
    return { // Sold
      card: "bg-slate-200 dark:bg-[#111] border-slate-300 dark:border-white/5 opacity-50 grayscale",
      textMain: "text-slate-500 dark:text-slate-600",
      textSub: "text-slate-400 dark:text-slate-700",
      badge: "bg-slate-500/10 text-slate-500 border-slate-500/20",
      icon: <Lock size={14} className="text-slate-400" />
    };
  };

  const style = getStyles();

  return (
    <button
      onClick={() => isAvailable && onClick(ticket)}
      disabled={!isAvailable}
      className={`
        relative w-full aspect-[1/1.2] rounded-2xl border transition-all duration-300 group overflow-hidden flex flex-col
        ${isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}
        ${style.card}
      `}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>

      {/* Header */}
      <div className="relative z-10 p-3 flex justify-between items-center w-full border-b border-white/5">
        <span className={`text-[9px] font-bold uppercase tracking-widest ${style.textSub}`}>LOTERIE</span>
        <div className="opacity-80">{style.icon}</div>
      </div>

      {/* Center Number */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <span className={`text-4xl md:text-5xl font-mono font-black tracking-tighter ${style.textMain} drop-shadow-lg group-hover:scale-110 transition-transform duration-300`}>
           {String(ticket.id).padStart(2, '0')}
        </span>
      </div>

      {/* Footer */}
      <div className="relative z-10 p-3 w-full bg-black/20 backdrop-blur-sm border-t border-white/5">
        <div className="flex justify-between items-end">
            <div>
               <div className={`text-[10px] uppercase font-bold mb-1 opacity-70 ${style.textMain}`}>Prix</div>
               <div className={`text-sm font-bold ${style.textMain}`}>{isSold ? 'VENDU' : `${TICKET_PRICE} F`}</div>
            </div>
            {isAvailable && (
                <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
            )}
        </div>
      </div>

      {/* Shine Effect on Hover */}
      {isAvailable && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-[shine_1s_ease-in-out]" />
          </div>
      )}

    </button>
  );
};