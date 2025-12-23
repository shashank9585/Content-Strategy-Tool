
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
    <div className="p-16 animate-in fade-in max-w-[1500px] mx-auto pb-40">
      <div className="flex justify-between items-start mb-20">
        <div>
          <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase mb-4 flex items-center space-x-8">
            <Zap size={56} className="text-teal-600 fill-teal-600 rotate-12"/> <span>Automation<br/><span className="text-teal-600">Hub</span></span>
          </h2>
          <p className="text-slate-400 font-medium text-2xl tracking-tight">Connect and manage your professional distribution channels.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="bg-teal-600 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center space-x-4 hover:bg-black transition-all shadow-2xl shadow-teal-100 active:scale-95 border-b-4 border-teal-800 hover:border-black">
          <Plus size={24} />
          <span>Add Connection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
        <div className="lg:col-span-8 space-y-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-premium flex flex-col items-center text-center relative group hover:border-teal-500 hover:scale-[1.03] transition-all duration-700">
                <div className="absolute top-10 right-10">
                  <MoreVertical size={24} className="text-slate-200 cursor-pointer hover:text-slate-500 transition-colors" />
                </div>
                <div className="w-24 h-24 bg-teal-600 text-white rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-teal-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Linkedin size={48} />
                </div>
                <h4 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">LinkedIn</h4>
                <p className="text-slate-400 text-sm mb-12 font-black uppercase tracking-[0.2em] opacity-60">Primary Account node</p>
                <div className="w-full bg-teal-50 py-6 rounded-3xl border border-teal-100 flex items-center justify-center space-x-4 text-teal-700 font-black text-xs uppercase tracking-[0.3em] shadow-sm">
                  <CheckCircle2 size={20} className="text-teal-600 animate-pulse"/> <span>Authenticated</span>
                </div>
             </div>

             <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-premium flex flex-col items-center text-center relative group hover:border-teal-500 hover:scale-[1.03] transition-all duration-700">
                <div className="absolute top-10 right-10">
                  <MoreVertical size={24} className="text-slate-200 cursor-pointer hover:text-slate-500 transition-colors" />
                </div>
                <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-[2.5rem] border border-slate-100 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                  <CloudSync size={48} />
                </div>
                <h4 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Webhook</h4>
                <p className="text-slate-400 text-sm mb-12 font-black uppercase tracking-[0.2em] opacity-60">Custom Payload Relay</p>
                <button className="w-full bg-teal-600 py-6 rounded-3xl flex items-center justify-center space-x-4 text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all shadow-2xl shadow-teal-50 border-b-4 border-teal-800 hover:border-black">
                  <RefreshCw size={20}/> <span>Establish Sync</span>
                </button>
             </div>
          </div>

          <div className="bg-white p-16 rounded-[4.5rem] border border-slate-100 shadow-premium min-h-[550px] flex flex-col hover:shadow-2xl transition-all duration-700">
            <div className="flex items-center justify-between mb-20 shrink-0">
              <div className="flex items-center space-x-6">
                <div className="p-5 bg-slate-50 rounded-[2rem] text-slate-400 border border-slate-100"><Activity size={32}/></div>
                <h4 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Activity Logs</h4>
              </div>
              <button className="text-[11px] font-black uppercase text-teal-600 tracking-[0.4em] bg-teal-50 px-8 py-4 rounded-2xl border border-teal-100 hover:bg-teal-600 hover:text-white transition-all shadow-sm">REFRESH PROTOCOLS</button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-10 py-10 grayscale">
              <Zap size={100} className="text-slate-400 mb-10" strokeWidth={1}/>
              <p className="text-3xl font-black text-slate-400 uppercase tracking-[0.3em]">No Transmission Detected.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-12 h-fit">
          <div className="bg-slate-900 text-white p-14 rounded-[4rem] shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-700">
            <div className="relative z-10">
              <h3 className="text-4xl font-black mb-10 tracking-tighter uppercase leading-none text-teal-400">Network<br/><span className="text-white">Integrity</span></h3>
              <p className="text-slate-400 leading-loose mb-16 text-xl font-medium opacity-80 italic">Monitor active relay endpoints and social tokens for mission-critical distribution stability.</p>
              
              <div className="space-y-12 pt-12 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">API UPLINK</span>
                  <span className="flex items-center text-emerald-400 font-black text-xs uppercase tracking-[0.2em] bg-emerald-500/10 px-5 py-2 rounded-xl border border-emerald-500/20">
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full mr-4 shadow-[0_0_20px_emerald] animate-pulse"></div>
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">AVG. LATENCY</span>
                  <span className="text-teal-400 font-black text-3xl tracking-tighter">420ms</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-teal-600/10 rounded-full blur-[120px] group-hover:bg-teal-600/20 transition-all duration-1000"></div>
          </div>
          
          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-premium group hover:border-teal-300 transition-all">
             <div className="flex items-center space-x-5 mb-10 text-teal-600">
                <div className="p-4 bg-teal-50 rounded-[1.5rem] group-hover:bg-teal-600 group-hover:text-white transition-all duration-500"><Shield size={28} /></div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Security<br/>Vault</h4>
             </div>
             <p className="text-slate-400 text-base font-bold uppercase tracking-tight leading-relaxed mb-10 opacity-70 italic">End-to-end credential encryption using 2048-bit RSA protocols.</p>
             <button className="w-full py-5 bg-slate-50 text-slate-500 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all flex items-center justify-center space-x-3 border border-slate-100 shadow-sm">
                <Lock size={16}/> <span>Audit Credentials</span>
             </button>
          </div>
        </div>
      </div>

      {isAdding && (
         <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-2xl z-[600] flex items-center justify-center p-12 animate-in fade-in duration-500">
            <div className="bg-white w-full max-w-2xl rounded-[5rem] p-20 shadow-[0_120px_200px_-40px_rgba(0,0,0,0.6)] relative animate-in zoom-in-95 duration-500 border border-slate-100">
               <button onClick={() => setIsAdding(false)} className="absolute top-14 right-14 text-slate-200 hover:text-slate-900 transition-all hover:rotate-90 hover:scale-125"><X size={44} /></button>
               <h3 className="text-6xl font-black text-slate-900 mb-14 tracking-tighter uppercase leading-none">Establish<br/><span className="text-teal-600">Destination</span></h3>
               <div className="space-y-14">
                  <div className="space-y-5">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] px-8">PLATFORM ECOSYSTEM</label>
                     <div className="relative">
                        <select className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs text-slate-700 outline-none appearance-none cursor-pointer shadow-inner focus:bg-white transition-all">
                           <option>LinkedIn (Corporate)</option>
                           <option>Instagram (Business)</option>
                           <option>Meta (FB/IG Node)</option>
                           <option>Webhook Relay</option>
                           <option>Custom REST API</option>
                        </select>
                        <ChevronDown className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={24}/>
                     </div>
                  </div>
                  <div className="space-y-5">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] px-8">INTERNAL IDENTIFIER</label>
                     <input placeholder="e.g. HIGH-VOLUME PIPELINE A" className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] font-black uppercase tracking-widest text-sm text-slate-700 outline-none shadow-inner focus:bg-white transition-all" />
                  </div>
                  <button className="w-full py-9 bg-teal-600 text-white rounded-[3rem] font-black uppercase tracking-[0.4em] text-sm shadow-[0_30px_60px_-15px_rgba(13,148,136,0.5)] hover:bg-black transition-all active:scale-95 border-b-8 border-teal-800 hover:border-black">Connect Endpoint</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
