
import React, { useState } from 'react';
import { Search, Globe, TrendingUp, AlertCircle, Loader2, CheckCircle2, FileText, Share2, Zap, ExternalLink } from 'lucide-react';
import { GeminiService } from '../services/geminiService';

const gemini = new GeminiService();

interface Props {
  onApply?: (intel: string) => void;
}

export const CompetitorAnalysis: React.FC<Props> = ({ onApply }) => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [isApplying, setIsApplying] = useState(false);

  const handleAnalyze = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    setReport(null);
    setLinks([]);
    try {
      const data = await gemini.analyzeCompetitor(url);
      setReport(data.text || "No intelligence synthesized.");
      setLinks(data.links || []);
    } catch (error) {
      console.error(error);
      alert('Intel fetch failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sendToStudio = () => {
    if (!report) return;
    setIsApplying(true);
    setTimeout(() => {
      if (onApply) {
        onApply(report);
      }
      setIsApplying(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Intel Lab</h2>
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Uncover competitor blueprints for strategic synthesis.</p>
      </div>

      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-premium overflow-hidden relative group">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mb-8 border border-teal-100 shadow-sm transition-transform group-hover:scale-110 duration-500">
            <Globe size={40} />
          </div>
          <h3 className="text-2xl font-black mb-8 text-slate-900 tracking-tight uppercase">Audit Destination</h3>
          <div className="w-full flex space-x-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Competitor URL or Narrative handle..."
              className="flex-1 p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:bg-white text-lg transition-all shadow-inner font-bold text-slate-700 outline-none"
            />
            <button
              onClick={handleAnalyze}
              disabled={!url || isAnalyzing}
              className="bg-teal-600 text-white px-10 py-5 rounded-2xl font-black flex items-center space-x-3 hover:bg-black transition-all disabled:opacity-50 shadow-xl shadow-teal-100 uppercase tracking-widest text-xs active:scale-95"
            >
              {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              <span>{isAnalyzing ? 'Auditing...' : 'Fetch Intel'}</span>
            </button>
          </div>
        </div>
      </div>

      {report && (
        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-premium animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex justify-between items-start mb-10 pb-6 border-b border-slate-50">
            <div className="flex items-center space-x-3 text-teal-600">
              <div className="p-3 bg-teal-50 rounded-2xl"><FileText size={28} /></div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Audit Report</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Aura Intelligence Complete.</p>
              </div>
            </div>
            <button 
              onClick={sendToStudio}
              disabled={isApplying}
              className="flex items-center space-x-2 bg-teal-600 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-80"
            >
              {isApplying ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
              <span>{isApplying ? 'Applying...' : 'Apply to Studio'}</span>
            </button>
          </div>
          <div className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap mb-10">
            {report}
          </div>
          
          {/* List source URLs from grounding chunks as per guidelines */}
          {links.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-50">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Evidence Verification</h4>
              <div className="flex flex-wrap gap-3">
                {links.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.uri} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center space-x-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-[10px] font-black text-teal-600 uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
                  >
                    <ExternalLink size={12} />
                    <span>{link.title || `Intel Source ${idx + 1}`}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
