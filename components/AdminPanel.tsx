import React, { useState, useMemo, useEffect } from 'react';
import { useLottery } from '../context/LotteryContext';
import { TicketStatus, DeveloperProfile } from '../types';
import { Check, X, Trophy, RefreshCcw, Wand2, LogIn, LogOut, LayoutDashboard, Users, History, ListChecks, Search, DollarSign, Settings, RefreshCw, Save, Trash2, Plus, AlertTriangle, Phone, MessageCircle, Gift, Link as LinkIcon, Calendar, Clock } from 'lucide-react';
import { generateWinnerAnnouncement } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';

export const AdminPanel: React.FC = () => {
  const { tickets, config, confirmTicket, rejectTicket, deleteParticipant, resetLottery, drawWinner, updateConfig, winner, stats, toggleAdmin, refreshData } = useLottery();
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'validations' | 'history' | 'participants' | 'settings'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // AI & Settings
  const [announcement, setAnnouncement] = useState<string>("");
  const [loadingAI, setLoadingAI] = useState(false);
  
  // Prize Settings
  const [prizeTitle, setPrizeTitle] = useState('');
  const [prizeValue, setPrizeValue] = useState('');
  const [prizeEndDate, setPrizeEndDate] = useState('');
  const [nextPrizeStartDate, setNextPrizeStartDate] = useState('');
  
  // Dev Settings
  const [devInfo, setDevInfo] = useState('');
  const [devProfiles, setDevProfiles] = useState<DeveloperProfile[]>([]);
  const [newDev, setNewDev] = useState({ name: '', role: '', photoUrl: '', socialLink: '' });

  const [savingSettings, setSavingSettings] = useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setIsAuthenticated(!!session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setIsAuthenticated(!!session));
    return () => subscription.unsubscribe();
  }, []);

  // Sync config when loaded
  useEffect(() => {
    if (config) {
        if (config.developer_info) setDevInfo(config.developer_info);
        if (config.developer_profiles) setDevProfiles(config.developer_profiles);
        if (config.prize_title) setPrizeTitle(config.prize_title);
        if (config.prize_value) setPrizeValue(config.prize_value);
        // Format dates for input type="datetime-local" (YYYY-MM-DDThh:mm)
        if (config.prize_end_date) setPrizeEndDate(new Date(config.prize_end_date).toISOString().slice(0, 16));
        if (config.next_prize_start_date) setNextPrizeStartDate(new Date(config.next_prize_start_date).toISOString().slice(0, 16));
    }
  }, [config]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) alert(error.message);
  };

  const handleLogout = async () => {
      await supabase.auth.signOut();
      setEmail('');
      setPassword('');
  };

  const handleRefresh = () => {
      refreshData(true); 
  };

  const handleGenerateAnnouncement = async () => {
    if (!winner || !config) return;
    setLoadingAI(true);
    const text = await generateWinnerAnnouncement(winner, config.prize_title);
    setAnnouncement(text);
    setLoadingAI(false);
  };

  const handleAddDev = () => {
      if(!newDev.name || !newDev.role) {
          alert("Le nom et le rôle sont obligatoires.");
          return;
      }
      const profile: DeveloperProfile = {
          id: Date.now().toString(),
          name: newDev.name,
          role: newDev.role,
          photoUrl: newDev.photoUrl || 'https://ui-avatars.com/api/?name=' + newDev.name,
          socialLink: newDev.socialLink
      };
      setDevProfiles([...devProfiles, profile]);
      setNewDev({ name: '', role: '', photoUrl: '', socialLink: '' });
  };

  const handleRemoveDev = (id: string) => {
      setDevProfiles(devProfiles.filter(p => p.id !== id));
  };

  const handleSaveSettings = async () => {
      setSavingSettings(true);
      try {
          const success = await updateConfig({ 
              prize_title: prizeTitle,
              prize_value: prizeValue,
              developer_info: devInfo,
              developer_profiles: devProfiles,
              prize_end_date: prizeEndDate ? new Date(prizeEndDate).toISOString() : undefined,
              next_prize_start_date: nextPrizeStartDate ? new Date(nextPrizeStartDate).toISOString() : undefined
          });
          
          if (success) {
            alert("✅ Paramètres sauvegardés avec succès !");
            await refreshData();
          }
      } catch (err) {
          console.error(err);
      } finally {
          setSavingSettings(false);
      }
  };

  // Helper for WhatsApp Link
  const getWhatsAppLink = (phone: string | undefined) => {
      if (!phone) return '#';
      // Assume Benin number 229 if it starts with 01
      const cleanPhone = phone.replace(/\s/g, '');
      const fullPhone = cleanPhone.startsWith('01') ? `229${cleanPhone}` : cleanPhone;
      return `https://wa.me/${fullPhone}`;
  };

  // Derived Data
  const pendingTickets = tickets.filter(t => t.status === TicketStatus.PENDING);
  
  const allTransactions = useMemo(() => {
    return tickets.filter(t => t.status !== TicketStatus.AVAILABLE).sort((a, b) => {
        return new Date(b.purchase_date || 0).getTime() - new Date(a.purchase_date || 0).getTime();
    });
  }, [tickets]);

  const uniqueParticipants = useMemo(() => {
    const participants = new Map();
    allTransactions.forEach(t => {
        if(t.purchaser_phone && !participants.has(t.purchaser_phone)) {
            participants.set(t.purchaser_phone, {
                id: t.id, // Keep one ID for reference
                name: t.purchaser_name,
                phone: t.purchaser_phone,
                count: 1,
                lastSeen: t.purchase_date
            });
        } else if (t.purchaser_phone) {
            const p = participants.get(t.purchaser_phone);
            p.count += 1;
        }
    });
    return Array.from(participants.values());
  }, [allTransactions]);

  const filteredHistory = allTransactions.filter(t => 
    t.purchaser_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toString().includes(searchTerm)
  );

  if (!isAuthenticated) {
      return (
          <div className="flex items-center justify-center min-h-[50vh]">
            {/* Login Form (Identical to previous) */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl border border-slate-100 dark:border-white/10 max-w-md w-full overflow-hidden animate-in zoom-in-95">
                <div className="bg-slate-900 dark:bg-black p-10 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-[60px] opacity-20"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                            <LogIn size={24} className="text-brand-400" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold">Portail Royal</h2>
                        <p className="text-slate-400 text-sm mt-2">Authentification Requise</p>
                    </div>
                </div>
                <form onSubmit={handleLogin} className="p-8 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-[#0f0f0f] dark:text-white outline-none focus:border-brand-500 transition-colors" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Mot de passe</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-[#0f0f0f] dark:text-white outline-none focus:border-brand-500 transition-colors" required />
                    </div>
                    <button type="submit" disabled={authLoading} className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl transition-all flex justify-center gap-2 shadow-lg shadow-brand-500/20 mt-2">
                        {authLoading ? 'Connexion...' : 'Entrer'}
                    </button>
                    <button type="button" onClick={toggleAdmin} className="w-full text-center text-sm text-slate-400 hover:text-slate-600 mt-4">Retour au site</button>
                </form>
            </div>
          </div>
      );
  }

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/5 overflow-hidden min-h-[700px] flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-72 bg-slate-50 dark:bg-[#0f0f0f] border-r border-slate-200 dark:border-white/5 p-6 flex flex-col gap-3">
         <div className="mb-6">
            <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white tracking-tight">Admin<span className="text-brand-500">Panel</span></h2>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">Prestige Edition</p>
         </div>
         
         <div className="space-y-1">
             <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18} />} label="Vue d'ensemble" />
             <NavButton active={activeTab === 'validations'} onClick={() => setActiveTab('validations')} icon={<ListChecks size={18} />} label="Validations" badge={pendingTickets.length} />
             <NavButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History size={18} />} label="Historique" />
             <NavButton active={activeTab === 'participants'} onClick={() => setActiveTab('participants')} icon={<Users size={18} />} label="Participants" badge={uniqueParticipants.length} />
             <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={18} />} label="Paramètres" />
         </div>
         
         <div className="mt-auto pt-6 border-t border-slate-200 dark:border-white/10 space-y-3">
            <button onClick={handleRefresh} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-white/5 rounded-xl transition-colors">
                <RefreshCw size={18} /> Actualiser
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10 rounded-xl transition-colors">
                <LogOut size={18} /> Déconnexion
            </button>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-[#151515]">
        <div className="md:hidden p-4 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#0f0f0f]">
             <span className="font-bold uppercase text-slate-500 text-xs tracking-wider">{activeTab}</span>
             <button onClick={toggleAdmin} className="text-xs border px-2 py-1 rounded dark:border-slate-600 dark:text-white">Quitter</button>
        </div>

        <div className="p-8 md:p-12 flex-1 overflow-y-auto">
            
            {/* --- DASHBOARD TAB --- */}
            {activeTab === 'dashboard' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Tableau de Bord</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Aperçu en temps réel de la loterie.</p>
                        </div>
                        {/* Reset button is also available in Settings for better organization, but kept here for quick access */}
                        <button onClick={resetLottery} className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all border border-red-200 dark:border-red-900/30">
                            <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                            <span className="text-sm font-bold">Reset Système</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard label="Revenus" value={`${stats.revenue.toLocaleString()} F`} icon={<DollarSign className="text-emerald-500" />} color="emerald" />
                        <StatCard label="Tickets Vendus" value={stats.sold.toString()} icon={<Check className="text-blue-500" />} color="blue" />
                        <StatCard label="En Attente" value={stats.pending.toString()} icon={<ListChecks className="text-amber-500" />} color="amber" />
                        <StatCard label="Progression" value={`${Math.round((stats.sold / tickets.length) * 100)}%`} icon={<Trophy className="text-purple-500" />} color="purple" />
                    </div>

                    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                         <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-black dark:to-[#0a0a0a]"></div>
                         <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500 rounded-full blur-[100px] opacity-10"></div>
                         
                         <div className="relative z-10 p-10 text-center">
                            {!winner ? (
                                <div className="max-w-md mx-auto">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner">
                                        <Trophy size={40} className="text-yellow-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Le Grand Tirage</h3>
                                    <button onClick={drawWinner} disabled={stats.sold === 0} className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                                        Lancer le Tirage au Sort
                                    </button>
                                </div>
                            ) : (
                                <div className="animate-in zoom-in duration-500">
                                    <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6"><Trophy size={12} /> Gagnant Officiel</div>
                                    <h3 className="text-6xl font-display font-black text-white mb-2 tracking-tighter">#{winner.id}</h3>
                                    <p className="text-3xl text-brand-300 font-bold mb-4">{winner.purchaser_name}</p>
                                    
                                    {/* Winner Contact Section */}
                                    <div className="flex justify-center gap-4 mb-8">
                                        <a href={`tel:${winner.purchaser_phone}`} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all">
                                            <Phone size={20} />
                                            <span>{winner.purchaser_phone}</span>
                                        </a>
                                        <a href={getWhatsAppLink(winner.purchaser_phone)} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-500/20">
                                            <MessageCircle size={20} />
                                            <span>WhatsApp</span>
                                        </a>
                                    </div>

                                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-left max-w-2xl mx-auto">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-white flex items-center gap-2 text-sm"><Wand2 size={16} className="text-purple-400" /> Assistant IA</h4>
                                            <button onClick={handleGenerateAnnouncement} disabled={loadingAI} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors border border-white/5">{loadingAI ? "..." : "Rédiger"}</button>
                                        </div>
                                        <textarea readOnly className="w-full h-24 text-sm text-slate-300 bg-black/40 p-4 rounded-xl border border-white/5 resize-none focus:outline-none font-mono" value={announcement || "Cliquez pour générer..."} />
                                    </div>
                                </div>
                            )}
                         </div>
                    </div>
                </div>
            )}

            {/* --- SETTINGS TAB --- */}
            {activeTab === 'settings' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Configuration</h2>
                    
                    {/* Prize Configuration Section */}
                    <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                             <Gift size={20} className="text-brand-500" />
                             Gestion du Lot
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">Définissez le prix, la valeur et le planning.</p>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Titre du Lot</label>
                                <input
                                    type="text"
                                    value={prizeTitle}
                                    onChange={(e) => setPrizeTitle(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 dark:text-white outline-none focus:border-brand-500 transition-colors"
                                    placeholder="Ex: Formation Marketing Digital"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Valeur Estimée</label>
                                <input
                                    type="text"
                                    value={prizeValue}
                                    onChange={(e) => setPrizeValue(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 dark:text-white outline-none focus:border-brand-500 transition-colors"
                                    placeholder="Ex: 50.000 FCFA"
                                />
                            </div>
                            {/* Dates Section */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    <Clock size={16} className="text-slate-400"/> Fin du lot actuel
                                </label>
                                <input
                                    type="datetime-local"
                                    value={prizeEndDate}
                                    onChange={(e) => setPrizeEndDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 dark:text-white outline-none focus:border-brand-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    <Calendar size={16} className="text-slate-400"/> Début Prochain lot
                                </label>
                                <input
                                    type="datetime-local"
                                    value={nextPrizeStartDate}
                                    onChange={(e) => setNextPrizeStartDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 dark:text-white outline-none focus:border-brand-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Developer Profiles Section */}
                    <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm space-y-6">
                         <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Équipe Technique</h3>
                            <p className="text-sm text-slate-500">Ajoutez les profils des développeurs visibles sur le site.</p>
                         </div>
                         {/* Add Dev Form */}
                         <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-[#0f0f0f] rounded-xl border border-dashed border-slate-300 dark:border-white/10">
                            <div className="flex flex-col md:flex-row gap-3">
                                <input 
                                    type="text" placeholder="Nom complet" 
                                    className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 dark:text-white text-sm outline-none"
                                    value={newDev.name} onChange={e => setNewDev({...newDev, name: e.target.value})}
                                />
                                <input 
                                    type="text" placeholder="Rôle (ex: Lead Dev)" 
                                    className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 dark:text-white text-sm outline-none"
                                    value={newDev.role} onChange={e => setNewDev({...newDev, role: e.target.value})}
                                />
                            </div>
                            <div className="flex flex-col md:flex-row gap-3">
                                <input 
                                    type="text" placeholder="URL Photo (Optionnel)" 
                                    className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 dark:text-white text-sm outline-none"
                                    value={newDev.photoUrl} onChange={e => setNewDev({...newDev, photoUrl: e.target.value})}
                                />
                                <input 
                                    type="text" placeholder="Lien Social (URL) - Optionnel" 
                                    className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 dark:text-white text-sm outline-none"
                                    value={newDev.socialLink} onChange={e => setNewDev({...newDev, socialLink: e.target.value})}
                                />
                                <button onClick={handleAddDev} className="bg-slate-900 dark:bg-white text-white dark:text-black font-bold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 md:w-auto"><Plus size={16}/> Ajouter</button>
                            </div>
                         </div>

                         {/* Dev List */}
                         <div className="grid gap-3">
                             {devProfiles.map((dev) => (
                                 <div key={dev.id} className="flex items-center justify-between p-3 border border-slate-100 dark:border-white/5 rounded-lg">
                                     <div className="flex items-center gap-3">
                                         <img src={dev.photoUrl} alt={dev.name} className="w-10 h-10 rounded-full object-cover bg-slate-200" onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${dev.name}`)} />
                                         <div>
                                             <div className="font-bold text-sm text-slate-900 dark:text-white">{dev.name}</div>
                                             <div className="text-xs text-slate-500 flex items-center gap-2">
                                                 {dev.role}
                                                 {dev.socialLink && <LinkIcon size={12} className="text-blue-500" />}
                                             </div>
                                         </div>
                                     </div>
                                     <button onClick={() => handleRemoveDev(dev.id)} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button>
                                 </div>
                             ))}
                             {devProfiles.length === 0 && <div className="text-center text-sm text-slate-400 py-2">Aucun profil configuré.</div>}
                         </div>
                    </div>

                    <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                            Description "Développeurs" (Texte global)
                        </label>
                        <textarea 
                            value={devInfo}
                            onChange={(e) => setDevInfo(e.target.value)}
                            className="w-full h-32 p-4 rounded-xl bg-slate-50 dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-brand-500 outline-none resize-none font-mono text-sm"
                            placeholder="Entrez ici la description globale..."
                        />
                    </div>

                    <div className="flex justify-end">
                        <button 
                            onClick={handleSaveSettings}
                            disabled={savingSettings}
                            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg w-full md:w-auto justify-center"
                        >
                            <Save size={18} /> {savingSettings ? "Enregistrement..." : "Sauvegarder Tout"}
                        </button>
                    </div>

                    {/* DANGER ZONE */}
                    <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-2xl border border-red-200 dark:border-red-900/30">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">Zone de Danger</h3>
                                <p className="text-red-600/80 dark:text-red-400/70 text-sm mb-6 leading-relaxed">
                                    Cette action est irréversible. Elle supprimera <strong>tous les participants</strong>, annulera le gagnant actuel et remettra toutes les statistiques à zéro.
                                    À utiliser uniquement pour recommencer une nouvelle saison de loterie.
                                </p>
                                <button 
                                    onClick={resetLottery}
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 flex items-center gap-2"
                                >
                                    <RefreshCcw size={18} /> Réinitialiser le Système
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ... other tabs ... */}
            {/* --- VALIDATIONS TAB --- */}
            {activeTab === 'validations' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Validations ({pendingTickets.length})</h2>
                    {pendingTickets.length === 0 ? <EmptyState message="Rien à valider." /> : (
                        <div className="grid gap-3">
                            {pendingTickets.map(t => (
                                <div key={t.id} className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 p-5 rounded-2xl flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex items-start gap-5">
                                        <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl font-display">{t.id}</div>
                                        <div>
                                            <div className="font-bold text-lg text-slate-900 dark:text-white">{t.purchaser_name}</div>
                                            <div className="font-mono text-slate-500 dark:text-slate-400 text-sm mt-0.5">{t.purchaser_phone}</div>
                                            <div className="text-xs bg-slate-100 dark:bg-white/5 inline-block px-2 py-1 rounded mt-2 font-mono">{t.transaction_id}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <button onClick={() => confirmTicket(t.id)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"><Check size={18} /> Valider</button>
                                        <button onClick={() => rejectTicket(t.id)} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"><X size={18} /> Rejeter</button>
                                        {/* Added Delete Button for pending */}
                                        <button onClick={() => deleteParticipant(t.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2.5 rounded-xl border border-red-200 dark:border-red-900/30"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                 </div>
            )}

            {/* --- HISTORY TAB --- */}
            {activeTab === 'history' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Historique</h2>
                        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                    </div>
                    <div className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#1a1a1a]">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Ticket</th>
                                    <th className="px-6 py-4">Acheteur</th>
                                    <th className="px-6 py-4">Statut</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHistory.length === 0 ? <tr><td colSpan={4} className="text-center py-8 text-slate-400">Vide</td></tr> : filteredHistory.map(t => (
                                    <tr key={t.id} className="border-t border-slate-100 dark:border-white/5 group">
                                        <td className="px-6 py-4 font-bold">#{t.id}</td>
                                        <td className="px-6 py-4">
                                            <div>{t.purchaser_name}</div>
                                            <div className="text-xs text-slate-400 font-mono">{t.purchaser_phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${t.status === TicketStatus.SOLD ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => deleteParticipant(t.id)} className="text-slate-400 hover:text-red-500 transition-colors" title="Supprimer définitivement">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'participants' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Participants ({uniqueParticipants.length})</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {uniqueParticipants.map((p, idx) => (
                            <div key={idx} className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 p-4 rounded-xl flex justify-between items-center group">
                                <div><div className="font-bold text-slate-900 dark:text-white">{p.name}</div><div className="text-xs text-slate-500">{p.phone}</div></div>
                                <div className="flex items-center gap-4">
                                    <div className="font-black text-brand-600">{p.count}</div>
                                    {/* Usually we delete by ticket ID, here it's grouped. We'll use the ID of the last ticket for action or disable it */}
                                    <button onClick={() => deleteParticipant(p.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label, badge }: any) => (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${active ? 'bg-slate-900 text-white dark:bg-brand-600 shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
        <div className="flex items-center gap-3">{icon}<span className="font-bold text-sm">{label}</span></div>
        {badge !== undefined && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-white text-slate-900' : 'bg-slate-200 text-slate-600'}`}>{badge}</span>}
    </button>
);

const StatCard = ({ label, value, icon, color }: any) => {
    const colors = { emerald: 'text-emerald-500', blue: 'text-blue-500', amber: 'text-amber-500', purple: 'text-purple-500' };
    return (
        <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 p-5 rounded-2xl">
            <div className="flex justify-between items-start mb-3"><span className="text-xs font-bold uppercase opacity-70 dark:text-slate-400">{label}</span><div className={`${colors[color as keyof typeof colors]}`}>{icon}</div></div>
            <div className="text-3xl font-display font-bold text-slate-900 dark:text-white">{value}</div>
        </div>
    );
};

const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-16 bg-slate-50 dark:bg-[#1a1a1a] rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
        <div className="text-slate-400 mb-2"><Search size={24} className="mx-auto"/></div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">{message}</p>
    </div>
);
