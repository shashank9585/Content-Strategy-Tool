
import React from 'react';
import { Target, Users, TrendingUp, Zap, Search, ChevronRight, Activity, BarChart3, PieChart, ShieldCheck, Globe } from 'lucide-react';

interface Props {
  onNavigate: (tab: any) => void;
}

export const Overview: React.FC<Props> = ({ onNavigate }) => {
  const stats = [
    { label: 'Active Missions', value: '14', icon: Target, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Market Reach', value: '8.4M', icon: Globe, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Neural Efficiency', value: '98%', icon: ShieldCheck, color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  return (
    <div className="max-w-[1500px] mx-auto p-16 space-y-16 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-slate-100 pb-12">
        <div>
          <h2 className="text-7xl font-black text-slate-900 tracking-tighter mb-4 uppercase leading-none">Command<br/><span className="text-teal-600">Center</span></h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[11px]">Real-time operational overview of cross-channel asset governance.</p>
        </div>
        <div className="flex space-x-4">
           <div className="bg-white border border-slate-100 px-8 py-5 rounded-[2rem] shadow-premium flex items-center space-x-5">
             <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_emerald]"></div>
             <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Protocols Online</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-10 rounded-[3.5rem] shadow-premium border border-slate-50 flex items-center justify-between hover:scale-105 transition-all duration-700 hover:shadow-2xl group">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3 group-hover:text-teal-600 transition-colors">{stat.label}</p>
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
            </div>
            <div className={`p-6 rounded-[2rem] ${stat.bg} ${stat.color} shadow-sm transition-all duration-700 group-hover:bg-teal-600 group-hover:text-white group-hover:rotate-12`}>
              <stat.icon size={36} strokeWidth={2.5} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div 
          onClick={() => onNavigate('lab')}
          className="group cursor-pointer bg-slate-900 p-14 rounded-[4rem] text-white overflow-hidden relative shadow-2xl hover:bg-teal-900 transition-all duration-700 active:scale-95 border-b-[12px] border-teal-800"
        >
          <div className="relative z-10">
            <div className="w-20 h-20 bg-teal-400/20 rounded-[2rem] flex items-center justify-center mb-10 border border-white/10 group-hover:bg-teal-400/40 group-hover:scale-110 transition-all duration-500 shadow-2xl shadow-black/20">
              <Zap className="text-teal-400 fill-teal-400 group-hover:text-white group-hover:fill-white transition-colors" size={40} />
            </div>
            <h3 className="text-5xl font-black mb-6 tracking-tighter uppercase leading-tight">Initiate<br/>Synthesis</h3>
            <p className="text-teal-100/60 mb-14 max-w-sm text-xl font-medium leading-relaxed italic">Execute neural strategy orchestration and visual synthesis from core mission directives.</p>
            <div className="flex items-center text-teal-400 font-black uppercase tracking-[0.4em] text-[10px] group-hover:translate-x-6 transition-transform duration-500 bg-white/5 px-8 py-4 rounded-2xl w-fit border border-white/5">
              Enter Studio Core <ChevronRight size={20} className="ml-3" />
            </div>
          </div>
          <Zap className="absolute -right-16 -bottom-16 text-teal-800 w-80 h-80 opacity-20 rotate-12 group-hover:rotate-[30deg] transition-all duration-1000" />
        </div>

        <div 
          className="bg-white border border-slate-100 p-14 rounded-[4rem] shadow-premium flex flex-col justify-between hover:border-teal-300 transition-all duration-700 active:scale-98 relative group"
        >
          <div className="space-y-10 relative z-10">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center border border-slate-100 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all duration-500 shadow-sm">
                <Search size={32} className="text-slate-400 group-hover:text-teal-600" strokeWidth={3} />
              </div>
              <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Audit Engine</h4>
            </div>
            <p className="text-slate-500 font-medium leading-loose text-lg opacity-80 uppercase tracking-tight">Calibrate competitive footprints and market fluctuations to reinforce strategic governance.</p>
            <div className="flex items-center text-teal-600 font-black uppercase tracking-[0.3em] text-[10px] group-hover:translate-x-6 transition-all duration-500 opacity-0 group-hover:opacity-100">
               Launch Intelligence Sweep <ChevronRight size={20} className="ml-3" />
            </div>
          </div>
          <div className="flex space-x-4 mt-12">
            <button 
              onClick={(e) => { e.stopPropagation(); onNavigate('history'); }}
              className="flex-1 py-6 bg-slate-900 text-white font-black rounded-[2rem] text-[10px] uppercase tracking-[0.3em] hover:bg-teal-600 transition-all shadow-xl hover:shadow-teal-100"
            >
              Access History
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onNavigate('automation'); }}
              className="px-10 py-6 bg-teal-50 text-teal-600 font-black rounded-[2rem] text-[10px] uppercase tracking-[0.3em] border border-teal-100 hover:bg-teal-600 hover:text-white transition-all shadow-sm"
            >
              Relay Hub
            </button>
          </div>
          <PieChart className="absolute top-10 right-10 text-slate-50 w-40 h-40 -z-0 opacity-10 group-hover:opacity-40 transition-all duration-1000 rotate-12" />
        </div>
      </div>
    </div>
  );
};
