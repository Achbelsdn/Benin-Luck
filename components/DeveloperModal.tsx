import React from 'react';
import { X, Code2, Terminal, Shield, Github, Globe, ExternalLink } from 'lucide-react';
import { DeveloperProfile } from '../types';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  info?: string;
  profiles?: DeveloperProfile[]; // Receive profiles
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose, info, profiles }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in slide-in-from-bottom-10 duration-500 flex flex-col max-h-[90vh]">
        
        {/* Abstract Header */}
        <div className="shrink-0 h-32 bg-gradient-to-r from-brand-900 to-black relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="absolute top-1/2 left-8 -translate-y-1/2 flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-500/20 rounded-2xl flex items-center justify-center border border-brand-500/30 backdrop-blur-sm shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <Code2 size={32} className="text-brand-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-serif font-bold text-white">Équipe Technique</h2>
                    <p className="text-brand-400 text-xs uppercase tracking-widest font-bold">Architectes du Système</p>
                </div>
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full">
                <X size={20} />
            </button>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 space-y-8 overflow-y-auto">
            
            {/* Profiles Section */}
            {profiles && profiles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profiles.map(profile => (
                        <div key={profile.id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img 
                                        src={profile.photoUrl} 
                                        alt={profile.name} 
                                        className="w-14 h-14 rounded-full object-cover border-2 border-brand-500/30 group-hover:border-brand-500 transition-colors"
                                        onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${profile.name}&background=10b981&color=fff`)}
                                    />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-black"></div>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-base">{profile.name}</h3>
                                    <p className="text-brand-400 text-xs uppercase tracking-wider font-bold">{profile.role}</p>
                                </div>
                            </div>
                            
                            {/* Social Link Button */}
                            {profile.socialLink && (
                                <a 
                                    href={profile.socialLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/5 hover:bg-brand-500 hover:text-white text-slate-400 rounded-lg transition-all"
                                    title="Voir le profil"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-light">
                    {info || "Les informations sur les développeurs n'ont pas encore été configurées par l'administrateur."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="bg-white/5 p-4 rounded-xl flex items-center gap-4 border border-white/5">
                    <Terminal size={24} className="text-slate-400" />
                    <div>
                        <div className="text-white font-bold text-sm">Infrastructure</div>
                        <div className="text-slate-500 text-xs">Haute Disponibilité</div>
                    </div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl flex items-center gap-4 border border-white/5">
                    <Shield size={24} className="text-slate-400" />
                    <div>
                        <div className="text-white font-bold text-sm">Sécurité</div>
                        <div className="text-slate-500 text-xs">Protection des Données</div>
                    </div>
                </div>
            </div>
            
            <div className="text-center pt-4">
                <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Bénin Luck • Engineering Division</p>
            </div>
        </div>
      </div>
    </div>
  );
};