import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, Loader2 } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Bonjour ! Je suis l'assistant Bénin Luck. Une question sur le jeu ou les lots ?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // Artificial delay for realism if API is too fast, usually not needed but feels better
    try {
      const responseText = await getChatResponse(userMsg);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Une erreur est survenue, veuillez réessayer." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
          isOpen 
            ? 'bg-slate-800 text-white rotate-90' 
            : 'bg-gradient-to-r from-brand-600 to-emerald-500 text-white animate-bounce-slow'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} className="fill-current" />}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white dark:bg-[#0f0f0f] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
        }`}
        style={{ maxHeight: 'calc(100vh - 120px)', height: '500px' }}
      >
        {/* Header */}
        <div className="bg-slate-900 p-4 flex items-center gap-3 border-b border-white/5 relative overflow-hidden">
             <div className="absolute inset-0 bg-brand-500/10 blur-xl"></div>
             <div className="relative z-10 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                <Bot className="text-brand-400" size={20} />
             </div>
             <div className="relative z-10">
                 <h3 className="text-white font-bold text-sm">Assistant Prestige</h3>
                 <div className="flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                     <span className="text-slate-400 text-xs">En ligne</span>
                 </div>
             </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-[#0a0a0a]">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                        className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-brand-600 text-white rounded-br-sm' 
                            : 'bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-white/5 rounded-bl-sm'
                        }`}
                    >
                        {msg.text}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-white dark:bg-white/10 p-3 rounded-2xl rounded-bl-sm border border-slate-100 dark:border-white/5">
                        <Loader2 size={16} className="animate-spin text-slate-400" />
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-[#0f0f0f] border-t border-slate-100 dark:border-white/5 flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 bg-slate-100 dark:bg-black/20 text-slate-900 dark:text-white text-sm px-4 py-3 rounded-xl border-none outline-none focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-400"
            />
            <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="bg-brand-600 hover:bg-brand-500 disabled:bg-slate-300 dark:disabled:bg-white/10 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors shadow-lg shadow-brand-500/20"
            >
                <Send size={18} />
            </button>
        </form>
      </div>
    </>
  );
};