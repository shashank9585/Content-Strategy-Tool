
import React, { useState, useEffect } from 'react';
import { History, Search, ArrowRight, Calendar, Trash2, EyeOff, Clock, Navigation, MapPin, X } from 'lucide-react';
import { CampaignHistory, CampaignContent } from '../types';

interface Props {
  onRecall?: (campaign: CampaignContent) => void;
}

export const CampaignHistoryView: React.FC<Props> = ({ onRecall }) => {
  const [history, setHistory] = useState<CampaignHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('campaign_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const filtered = history.filter(h => 
    h.prompt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-16 animate-in fade-in max-w-[1500px] mx-auto pb-40">
      <div className="flex justify-between items-start mb-20 border-b border-slate-100 pb-12">
        <div>
          <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase mb-4 leading-none">Mission<br/><span className="text-teal-600">Archive</span></h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[11px]">Access and recalibrate previous campaign architectures.</p>
        </div>
        <div className="relative w-96 group">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-teal-600 transition-colors" size={22} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-6 bg-white border border-slate-100 rounded-[2.5rem] focus:bg-white focus:border-teal-500 transition-all outline-none text-slate-700 shadow-premium font-bold uppercase text-[10px] tracking-widest placeholder:text-slate-100"
            placeholder="Search Mission Logs..."
          />
        </div>
      </div>

      <div className="bg-white rounded-[5rem] border border-slate-100 shadow-premium min-h-[650px] flex flex-col p-24 relative overflow-hidden group/archive">
        {filtered.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center scale-110">
            <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-12 shadow-inner border border-slate-100 group-hover/archive:rotate-12 transition-transform duration-700">
               <Clock className="text-slate-100" size={56} strokeWidth={1} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Vault Empty</h3>
            <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-[10px]">No historical missions registered in neural core.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
             {filtered.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => onRecall && onRecall(item.results)}
                  className="bg-slate-50 p-12 rounded-[4rem] border border-slate-100 hover:bg-white transition-all duration-700 hover:shadow-[0_50px_100px_-20px_rgba(13,148,136,0.15)] group cursor-pointer hover:scale-105 hover:border-teal-500"
                >
                   <div className="flex justify-between items-start mb-10">
                      <div className="flex items-center space-x-4">
                         <div className="p-4 bg-white rounded-2xl text-teal-600 shadow-sm border border-slate-100 group-hover:bg-teal-600 group-hover:text-white transition-all duration-500"><Calendar size={18} /></div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                   </div>
                   <h4 className="text-2xl font-black text-slate-900 mb-8 line-clamp-2 leading-tight tracking-tighter uppercase group-hover:text-teal-600 transition-colors">
                      {item.prompt}
                   </h4>
                   <div className="flex items-center text-teal-600 text-[10px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 duration-500">
                      Recalibrate Engine <ArrowRight size={18} className="ml-4"/>
                   </div>
                </div>
             ))}
          </div>
        )}
        <div className="absolute inset-0 border-[4px] border-dashed border-slate-50 m-12 rounded-[4.5rem] pointer-events-none opacity-50"></div>
      </div>
    </div>
  );
};
