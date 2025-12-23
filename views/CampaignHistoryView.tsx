
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
    <div className="p-12 animate-in fade-in max-w-7xl mx-auto pb-40">
      <div className="flex justify-between items-start mb-16">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Archive</h2>
          <p className="text-slate-500 mt-2 text-lg">Access and refine your past campaign architectures.</p>
        </div>
        <div className="relative w-80">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:bg-white transition-all outline-none text-slate-700 shadow-sm font-medium"
            placeholder="Search campaigns..."
          />
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-premium min-h-[600px] flex flex-col p-20 relative overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-10">
               <Clock className="text-slate-200" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No History Yet</h3>
            <p className="text-slate-500 font-medium">Your brilliant campaign prompts will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {filtered.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => onRecall && onRecall(item.results)}
                  className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:bg-white transition-all hover:shadow-xl group cursor-pointer"
                >
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center space-x-3">
                         <div className="p-2 bg-white rounded-xl text-indigo-600 shadow-sm border border-slate-100"><Calendar size={14} /></div>
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                   </div>
                   <h4 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 leading-tight">
                      {item.prompt}
                   </h4>
                   <div className="flex items-center text-[#6366f1] text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                      Recall Engine <ArrowRight size={14} className="ml-2"/>
                   </div>
                </div>
             ))}
          </div>
        )}
        <div className="absolute inset-0 border-[3px] border-dashed border-slate-100 m-8 rounded-[2.5rem] pointer-events-none"></div>
      </div>
    </div>
  );
};
