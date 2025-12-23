
import React from 'react';
import { Target, Users, TrendingUp, Zap, Search, ChevronRight, Activity, BarChart3 } from 'lucide-react';

interface Props {
  onNavigate: (tab: any) => void;
}

export const Overview: React.FC<Props> = ({ onNavigate }) => {
  const stats = [
    { label: 'Active Initiatives', value: '08', icon: Target, color: 'text-teal-600' },
    { label: 'Market Penetration', value: '14.2%', icon: BarChart3, color: 'text-teal-600' },
    { label: 'Cost Efficiency', value: '+22%', icon: TrendingUp, color: 'text-teal-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Strategic Core Hub</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Real-time operational overview of brand assets and intelligence.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-50 flex items-center justify-between hover:scale-105 transition-transform duration-500">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-4xl font-black mt-2 text-slate-900">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-2xl bg-teal-50 ${stat.color}`}>
              <stat.icon size={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div 
          onClick={() => onNavigate('lab')}
          className="group cursor-pointer bg-slate-900 p-10 rounded-[3rem] text-white overflow-hidden relative shadow-2xl hover:bg-teal-900 transition-all duration-500 active:scale-95"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-teal-400/20 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-teal-400/40 transition-colors">
              <Zap className="text-teal-400" size={32} />
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">Campaign Studio</h3>
            <p className="text-teal-100/60 mb-10 max-w-sm text-lg font-medium leading-relaxed">Execute master-level strategy synthesis and visual orchestration from core directives.</p>
            <div className="flex items-center text-teal-400 font-black uppercase tracking-widest text-xs group-hover:translate-x-3 transition-transform">
              Initiate Core Session <ChevronRight size={20} className="ml-2" />
            </div>
          </div>
          <Zap className="absolute -right-12 -bottom-12 text-teal-800 w-64 h-64 opacity-20 rotate-12" />
        </div>

        <div 
          onClick={() => onNavigate('competitor')}
          className="group cursor-pointer bg-white border border-slate-100 p-10 rounded-[3rem] shadow-premium flex flex-col justify-between hover:border-teal-200 transition-all duration-500 active:scale-95"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                <Search size={24} className="text-slate-400 group-hover:text-teal-600" />
              </div>
              <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">Intel Engine</h4>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed">Map competitor footprints and market shifts to calibrate your strategic advantage.</p>
            <div className="flex items-center text-teal-600 font-black uppercase tracking-widest text-xs group-hover:translate-x-3 transition-transform opacity-0 group-hover:opacity-100">
               Run Market Audit <ChevronRight size={20} className="ml-2" />
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onNavigate('history'); }}
            className="w-full py-4 bg-slate-50 text-slate-500 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all border border-slate-100"
          >
            Access Historical Assets
          </button>
        </div>
      </div>
    </div>
  );
};
