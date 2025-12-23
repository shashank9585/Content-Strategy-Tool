
import React, { useState } from 'react';
import { 
  Zap, Activity, Plus, CheckCircle2, Globe, RefreshCw, 
  Linkedin, Instagram, X, ChevronDown, ExternalLink, Loader2,
  Key, Shield, Settings, Info, ArrowUpRight, Share2, MousePointer2,
  Lock, CloudSync, MoreVertical
} from 'lucide-react';

export const AutomationHub: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="p-12 animate-in fade-in max-w-[1400px] mx-auto pb-40">
      <div className="flex justify-between items-start mb-16">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-3 flex items-center space-x-6">
            <Zap size={48} className="text-[#6366f1] fill-[#6366f1]"/> <span>Automation Hub</span>
          </h2>
          <p className="text-slate-400 font-medium text-xl tracking-tight">Connect and manage your professional distribution channels.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="bg-[#6366f1] text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center space-x-3 hover:bg-black transition-all shadow-xl shadow-indigo-100 active:scale-95">
          <Plus size={20} />
          <span>Add Connection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-premium flex flex-col items-center text-center relative group hover:border-[#6366f1] transition-all">
                <div className="absolute top-8 right-8">
                  <MoreVertical size={20} className="text-slate-200 cursor-pointer hover:text-slate-500" />
                </div>
                <div className="w-20 h-20 bg-[#6366f1] text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform">
                  <Linkedin size={40} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tight">LinkedIn</h4>
                <p className="text-slate-400 text-sm mb-10 font-bold uppercase tracking-widest">Primary Corporate Account</p>
                <div className="w-full bg-emerald-50 py-5 rounded-2xl border border-emerald-100 flex items-center justify-center space-x-3 text-emerald-600 font-black text-xs uppercase tracking-[0.2em] shadow-sm">
                  <CheckCircle2 size={18}/> <span>Connected</span>
                </div>
             </div>

             <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-premium flex flex-col items-center text-center relative group hover:border-[#6366f1] transition-all">
                <div className="absolute top-8 right-8">
                  <MoreVertical size={20} className="text-slate-200 cursor-pointer hover:text-slate-500" />
                </div>
                <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-[2rem] border border-slate-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <CloudSync size={40} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tight">Webhook</h4>
                <p className="text-slate-400 text-sm mb-10 font-bold uppercase tracking-widest">Zapier / Make.com / Custom</p>
                <button className="w-full bg-[#6366f1] py-5 rounded-2xl flex items-center justify-center space-x-3 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-indigo-50">
                  <RefreshCw size={18}/> <span>Authenticate</span>
                </button>
             </div>
          </div>

          <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-premium min-h-[480px] flex flex-col">
            <div className="flex items-center justify-between mb-16 shrink-0">
              <div className="flex items-center space-x-5">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><Activity size={28}/></div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Dispatch Logs</h4>
              </div>
              <button className="text-[10px] font-black uppercase text-[#6366f1] tracking-[0.3em] bg-indigo-50 px-6 py-2.5 rounded-full hover:bg-[#6366f1] hover:text-white transition-all">REFRESH LOGS</button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-10 py-10">
              <Zap size={80} className="text-slate-400 mb-8" strokeWidth={1}/>
              <p className="text-2xl font-black text-slate-400 uppercase tracking-widest">No activity reported yet.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-[#0f172a] text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden h-fit">
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-8 tracking-tighter uppercase">Channel Health</h3>
              <p className="text-slate-400 leading-relaxed mb-14 text-lg font-medium">Monitor active webhooks and social authentication tokens for seamless distribution integrity.</p>
              
              <div className="space-y-10 pt-10 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">API STATUS</span>
                  <span className="flex items-center text-emerald-400 font-black text-xs uppercase tracking-widest">
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full mr-3 shadow-[0_0_15px_emerald] animate-pulse"></div>
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">AVG. DISPATCH</span>
                  <span className="text-white font-black text-2xl tracking-tighter">420ms</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#6366f1]/10 rounded-full blur-[100px]"></div>
          </div>
          
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-premium">
             <div className="flex items-center space-x-4 mb-8 text-[#6366f1]">
                <Shield size={24} />
                <h4 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Security Vault</h4>
             </div>
             <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">All credentials are encrypted using bank-level AES-256 protocols and stored within isolated secure enclaves.</p>
             <button className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center space-x-2 border border-slate-100 shadow-sm">
                <Lock size={14}/> <span>Audit Protocols</span>
             </button>
          </div>
        </div>
      </div>

      {isAdding && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[600] flex items-center justify-center p-8 animate-in fade-in">
            <div className="bg-white w-full max-w-xl rounded-[4rem] p-16 shadow-2xl relative animate-in zoom-in-95">
               <button onClick={() => setIsAdding(false)} className="absolute top-12 right-12 text-slate-300 hover:text-slate-900 transition-all hover:rotate-90"><X size={36} /></button>
               <h3 className="text-5xl font-black text-slate-900 mb-12 tracking-tighter uppercase">New Pipeline</h3>
               <div className="space-y-12">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">PLATFORM ECOSYSTEM</label>
                     <div className="relative">
                        <select className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[1.8rem] font-black uppercase tracking-widest text-xs text-slate-700 outline-none appearance-none cursor-pointer shadow-inner">
                           <option>LinkedIn</option>
                           <option>Instagram</option>
                           <option>Meta (FB/IG)</option>
                           <option>Webhook / Make</option>
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20}/>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">INTERNAL ALIAS</label>
                     <input placeholder="e.g. Corporate High-Volume Node" className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[1.8rem] font-bold text-slate-700 outline-none shadow-inner text-lg focus:bg-white transition-all" />
                  </div>
                  <button className="w-full py-8 bg-[#4f46e5] text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-indigo-100 hover:bg-black transition-all active:scale-95">Establish Destination</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
