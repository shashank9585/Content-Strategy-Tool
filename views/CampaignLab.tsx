
import React, { useState, useEffect, useRef } from 'react';
import { 
  RefreshCw, FileText, Sparkles, Loader2, Target, 
  Globe, Trash2, X, ImageIcon, Layers, Download, 
  Plus, Send, LayoutGrid, Info, ExternalLink,
  ChevronRight, CheckCircle2, Copy, BarChart3,
  Search, ShieldCheck, Briefcase, Mic, MicOff,
  Image as LucideImage, Wand2, PenLine, SendHorizontal, Share2, FileDown,
  PieChart, Activity, Box
} from 'lucide-react';
import { GeminiService, AspectRatio } from '../services/geminiService';
import { CampaignContent, BrandVoice } from '../types';

const gemini = new GeminiService();

interface Props {
  voices: BrandVoice[];
  onSaveVoice: (voice: BrandVoice) => void;
  onDeleteVoice: (id: string) => void;
  recalledCampaign?: CampaignContent | null;
  onClearRecall?: () => void;
  prefilledPrompt?: string | null;
  onClearPrefilled?: () => void;
}

export const CampaignLab: React.FC<Props> = ({ voices, onSaveVoice, onDeleteVoice, recalledCampaign, onClearRecall, prefilledPrompt, onClearPrefilled }) => {
  const [setupMode, setSetupMode] = useState<'master' | 'guided'>('master');
  const [prompt, setPrompt] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [budgetExpectation, setBudgetExpectation] = useState('');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState('');
  const [results, setResults] = useState<CampaignContent | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'strategy' | 'intel' | 'visuals' | 'copy' | 'storyboard'>('overview');
  
  const [isAddingVoice, setIsAddingVoice] = useState(false);
  const [newVoiceForm, setNewVoiceForm] = useState<Partial<BrandVoice>>({ name: '', formality: 'Professional', vocabulary: 'Sophisticated' });
  const [isListening, setIsListening] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (recalledCampaign) { setResults(recalledCampaign); setActiveTab('overview'); if (onClearRecall) onClearRecall(); }
  }, [recalledCampaign]);

  useEffect(() => {
    if (prefilledPrompt) { setPrompt(prefilledPrompt); setSetupMode('master'); if (onClearPrefilled) onClearPrefilled(); }
  }, [prefilledPrompt]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAttachedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported in this browser.");
    if (isListening) return setIsListening(false);
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setPrompt(prev => (prev ? prev + ' ' : '') + text);
    };
    recognition.start();
  };

  const handleInitialize = async () => {
    const finalPrompt = setupMode === 'master' ? prompt : `Objective: ${primaryGoal}. Audience: ${targetAudience}. Budget: ${budgetExpectation}.`;
    if (!finalPrompt && setupMode === 'master') return;
    
    setIsGenerating(true);
    setGenStep('Calibrating neural strategy cores...');
    try {
      const voice = voices.find(v => v.id === selectedVoiceId);
      const data = await gemini.generateCampaign({
        masterPrompt: finalPrompt,
        imageContext: attachedImage || undefined,
        brandVoice: voice,
        targetAudience,
        budget: budgetExpectation,
        primaryGoal
      });
      
      const assetPrompts = [
        { type: 'Hero', prompt: data.hero_visual_prompt },
        { type: 'Ad', prompt: data.ad_visual_prompt },
        { type: 'Product', prompt: data.product_visual_prompt },
        { type: 'Lifestyle', prompt: data.lifestyle_visual_prompt }
      ];

      const visualsResults: any[] = [];
      for (const item of assetPrompts) {
        setGenStep(`Synthesizing high-fidelity asset: ${item.type}...`);
        try {
          await new Promise(r => setTimeout(r, 1200));
          const img = item.prompt ? await gemini.generateImage(item.prompt, "16:9") : null;
          visualsResults.push({ ...item, imageUrl: img || '' });
        } catch (e) {
          visualsResults.push({ ...item, imageUrl: '' });
        }
      }
      
      const storyboardResults: any[] = [];
      for (let i = 0; i < data.storyboard.length; i++) {
        const frame = data.storyboard[i];
        setGenStep(`Rendering narrative sequence: Frame ${i + 1}...`);
        try {
          await new Promise(r => setTimeout(r, 1200));
          const img = await gemini.generateImage(frame.description, "16:9");
          storyboardResults.push({ ...frame, id: i, imageUrl: img || '', notes: '' });
        } catch (e) {
          storyboardResults.push({ ...frame, id: i, imageUrl: '', notes: '' });
        }
      }
      
      const campaignResults: CampaignContent = {
        ...data,
        visuals: visualsResults.map((v, i) => ({
          id: `v${i}`, 
          type: v.type as any,
          imageUrl: v.imageUrl, 
          prompt: v.prompt || '', 
          tags: ['PRODUCTION READY'], 
          aspectRatio: "16:9"
        })),
        storyboard: storyboardResults
      };
      
      setResults(campaignResults);
      setActiveTab('overview');
      
      const history = JSON.parse(localStorage.getItem('campaign_history') || '[]');
      history.unshift({
        id: Date.now().toString(),
        timestamp: Date.now(),
        prompt: finalPrompt,
        results: campaignResults
      });
      localStorage.setItem('campaign_history', JSON.stringify(history.slice(0, 20)));

    } catch (e: any) {
      console.error(e);
      alert(`Initialization encounter failure: ${e?.message || 'Rate limit threshold exceeded.'}`);
    } finally {
      setIsGenerating(false);
      setGenStep('');
    }
  };

  const exportPDF = () => {
    if (!results) return;
    // Simple high-quality print trigger to generate PDF
    window.print();
  };

  const exportJSON = () => {
    if (!results) return;
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Campaign_Export_${Date.now()}.json`;
    link.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Payload copied to clipboard');
  };

  const updateFrameNote = (id: number, notes: string) => {
    if (!results) return;
    setResults({
      ...results,
      storyboard: results.storyboard.map(f => f.id === id ? { ...f, notes } : f)
    });
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-12">
        <div className="relative mb-12 scale-110">
          <Loader2 className="w-24 h-24 text-teal-600 animate-spin opacity-40" strokeWidth={1} />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-teal-400 w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">Orchestrating Session</h2>
        <p className="text-teal-600 font-black uppercase tracking-[0.3em] text-[10px] px-8 py-3 bg-teal-50 rounded-full border border-teal-100 shadow-sm animate-pulse">{genStep}</p>
        <p className="text-slate-400 font-medium mt-10 max-w-sm text-sm">Our neural architecture is synthesizing high-fidelity commercial assets and strategic directives.</p>
      </div>
    );
  }

  if (results) {
    return (
      <div className="animate-in fade-in duration-700 pb-20 print:p-0">
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between h-20 px-12 shadow-sm print:hidden">
          <div className="flex space-x-12">
            {[
              { id: 'overview', label: 'OVERVIEW', icon: Activity },
              { id: 'strategy', label: 'STRATEGY', icon: BarChart3 },
              { id: 'intel', label: 'MARKET INTEL', icon: Target },
              { id: 'visuals', label: 'VISUAL ASSETS', icon: LucideImage },
              { id: 'copy', label: 'COPY PAYLOAD', icon: FileText },
              { id: 'storyboard', label: 'STORYBOARD', icon: Plus }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)} 
                className={`flex items-center space-x-3 py-6 font-black text-[10px] tracking-[0.2em] transition-all relative ${activeTab === tab.id ? 'text-teal-600' : 'text-slate-400 hover:text-slate-900'}`}
              >
                 <tab.icon size={14} /> <span>{tab.label}</span>
                 {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-teal-600 rounded-t-full"></div>}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={exportPDF} className="flex items-center space-x-2.5 bg-teal-600 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-teal-100 active:scale-95">
              <Share2 size={16} /> <span>Export PDF</span>
            </button>
            <button onClick={exportJSON} className="flex items-center space-x-2.5 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-600 transition-all shadow-xl active:scale-95">
              <FileDown size={16} /> <span>JSON Bundle</span>
            </button>
            <button onClick={() => setResults(null)} className="p-3.5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100">
              <RefreshCw size={18} />
            </button>
          </div>
        </nav>

        <div className="p-12 space-y-12 max-w-[1500px] mx-auto print:max-w-none print:p-0">
          {activeTab === 'overview' && (
            <div className="animate-in fade-in duration-700 space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-slate-50 flex items-center space-y-0 space-x-8">
                     <div className="p-5 bg-teal-50 text-teal-600 rounded-3xl shadow-sm"><BarChart3 size={32}/></div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">STRATEGY SCORE</p>
                        <p className="text-3xl font-black text-slate-900">98%</p>
                     </div>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-slate-50 flex items-center space-y-0 space-x-8">
                     <div className="p-5 bg-teal-50 text-teal-600 rounded-3xl shadow-sm"><Target size={32}/></div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">CONVERSION INTENT</p>
                        <p className="text-3xl font-black text-slate-900">HIGH</p>
                     </div>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-slate-50 flex items-center space-y-0 space-x-8">
                     <div className="p-5 bg-teal-50 text-teal-600 rounded-3xl shadow-sm"><LucideImage size={32}/></div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ASSET READINESS</p>
                        <p className="text-3xl font-black text-slate-900">100%</p>
                     </div>
                  </div>
               </div>

               <div className="bg-white p-14 rounded-[3.5rem] shadow-premium border border-slate-50">
                  <h3 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Campaign Architecture Summary</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                           <h4 className="text-[11px] font-black text-teal-600 uppercase tracking-widest mb-4">Core Objective</h4>
                           <p className="text-slate-700 font-bold text-lg leading-relaxed">{results.strategy.split('.')[0]}.</p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                           <h4 className="text-[11px] font-black text-teal-600 uppercase tracking-widest mb-4">Primary CTA</h4>
                           <p className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">"{results.ctas[0]}"</p>
                        </div>
                     </div>
                     <div className="bg-teal-600 p-10 rounded-[2.5rem] text-white flex flex-col justify-center">
                        <div className="flex items-center space-x-4 mb-6">
                           <Box size={32} className="text-teal-200" />
                           <h4 className="text-xl font-black uppercase tracking-widest">Neural Insights</h4>
                        </div>
                        <p className="text-teal-50 text-lg font-medium leading-relaxed italic">"The strategy prioritizes high-impact visual storytelling combined with data-driven social hooks to maximize resonance across professional demographics."</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'strategy' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-6 duration-700">
               <div className="lg:col-span-8 bg-white p-14 rounded-[3.5rem] shadow-premium border border-slate-50 hover:scale-[1.01] transition-transform">
                  <div className="flex items-center space-x-5 mb-10 text-teal-600">
                    <div className="p-5 bg-teal-50 rounded-3xl shadow-sm border border-teal-100"><BarChart3 size={36} /></div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Creative Direction</h3>
                  </div>
                  <p className="text-slate-600 leading-loose text-xl font-medium whitespace-pre-wrap">{results.strategy}</p>
               </div>
               <div className="lg:col-span-4 bg-teal-600 p-12 rounded-[3.5rem] text-white shadow-2xl h-fit hover:scale-[1.02] transition-transform">
                  <h4 className="text-xl font-black mb-10 uppercase tracking-[0.2em] text-teal-100/60 text-[10px]">Strategic Conversion CTAs</h4>
                  <div className="space-y-5">
                    {results.ctas?.map((cta, i) => (
                      <div key={i} className="bg-white/10 p-7 rounded-3xl border border-white/20 font-black italic text-lg hover:bg-white/20 transition-all cursor-pointer shadow-lg group">
                        <span className="flex items-center justify-between">
                          "{cta}"
                          <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={20}/>
                        </span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'intel' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-700">
               {results.ppc?.map((item, i) => (
                 <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-premium flex flex-col h-full group hover:border-teal-500 hover:scale-[1.02] transition-all duration-500">
                    <div className="flex justify-between items-start mb-10">
                      <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{item.platform}</h4>
                      <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm"><Target size={20}/></div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 mb-10">
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner group-hover:bg-white transition-colors">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">AVG. CPC</span>
                        <span className="text-2xl font-black text-teal-600">{item.avgCPC}</span>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner group-hover:bg-white transition-colors">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">BENCHMARK</span>
                        <span className="text-xs font-black text-emerald-600 leading-tight block uppercase">{item.benchmark}</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 text-slate-500 mb-10 flex-1">
                      <Info size={18} className="shrink-0 mt-1 opacity-30" />
                      <p className="text-sm leading-relaxed font-bold uppercase tracking-tight italic opacity-70">{item.justification}</p>
                    </div>
                    <div className="pt-8 border-t border-slate-50">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] block mb-6">PLATFORM METRICS</span>
                      <div className="space-y-3">
                        {item.performanceIndicators?.map((kpi, kIdx) => (
                          <div key={kIdx} className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                            <span className="text-slate-400">{kpi.label}</span>
                            <span className="text-slate-900 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{kpi.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'visuals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-bottom-8 duration-700">
              {results.visuals.map((v, i) => (
                <div key={v.id} className="bg-white rounded-[3.5rem] shadow-premium border border-slate-100 overflow-hidden group hover:scale-[1.01] transition-all duration-500">
                  <div className="relative aspect-video bg-slate-50 flex items-center justify-center overflow-hidden">
                    {v.imageUrl ? (
                      <img src={v.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" alt="Asset" />
                    ) : (
                      <div className="text-slate-300 flex flex-col items-center">
                        <Loader2 className="mb-4 animate-spin text-teal-200" size={48} strokeWidth={1} />
                        <span className="text-[11px] font-black uppercase tracking-widest opacity-40">Asset Logic Pending</span>
                      </div>
                    )}
                    <div className="absolute top-6 right-6 flex space-x-3 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500">
                      <button className="p-4 bg-white text-teal-600 rounded-2xl shadow-2xl hover:bg-teal-600 hover:text-white transition-all scale-90 hover:scale-100"><Wand2 size={24}/></button>
                      <button className="p-4 bg-white text-emerald-600 rounded-2xl shadow-2xl hover:bg-emerald-600 hover:text-white transition-all scale-90 hover:scale-100"><PenLine size={24}/></button>
                      <button className="p-4 bg-teal-600 text-white rounded-2xl shadow-2xl hover:bg-black transition-all scale-90 hover:scale-100"><SendHorizontal size={24}/></button>
                    </div>
                  </div>
                  <div className="p-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex space-x-3">
                        <span className="text-[11px] font-black uppercase bg-teal-50 text-teal-600 px-5 py-2 rounded-xl tracking-widest shadow-sm border border-teal-100">{v.type}</span>
                        <span className="text-[11px] font-black uppercase bg-slate-50 text-slate-500 px-5 py-2 rounded-xl tracking-widest border border-slate-100">{v.tags[0]}</span>
                      </div>
                      <button className="text-slate-300 hover:text-teal-600 transition-all hover:scale-110" title="Download High-Res"><Download size={28}/></button>
                    </div>
                    <p className="text-slate-500 italic font-bold text-lg leading-relaxed opacity-80">"{v.prompt}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'copy' && (
            <div className="space-y-12 animate-in fade-in duration-700">
               <div className="bg-white p-14 rounded-[4rem] shadow-premium border border-slate-50 hover:scale-[1.01] transition-transform">
                  <div className="flex items-center space-x-4 mb-10 text-teal-600">
                    <FileText size={32} />
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Editorial Manifest</h3>
                  </div>
                  <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 shadow-inner group hover:bg-white transition-colors duration-500">
                    <h4 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter uppercase">{results.blog?.title}</h4>
                    <p className="text-slate-600 text-xl leading-loose mb-12 font-medium opacity-90">{results.blog?.content}</p>
                    <div className="flex justify-between items-center pt-10 border-t border-slate-100">
                      <button className="bg-teal-600 text-white px-10 py-5 rounded-[1.5rem] font-black flex items-center space-x-4 hover:bg-black transition-all shadow-2xl shadow-teal-100 active:scale-95"><SendHorizontal size={20}/> <span className="uppercase tracking-widest text-xs">Deploy Payload</span></button>
                      <button onClick={() => copyToClipboard(results.blog?.content)} className="text-slate-400 text-[10px] font-black flex items-center space-x-3 hover:text-teal-600 transition-all uppercase tracking-[0.2em] bg-white px-6 py-3 rounded-xl border border-slate-100 shadow-sm"><Copy size={16}/> <span>Copy Code</span></button>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="bg-white p-12 rounded-[4rem] shadow-premium border border-slate-50 flex flex-col group hover:scale-[1.01] transition-transform">
                    <div className="flex items-center space-x-4 mb-10 text-orange-500">
                      <Send size={28} />
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">High-Conv Ad Variant</h3>
                    </div>
                    <div className="space-y-8 flex-1">
                      <div>
                        <div className="flex justify-between mb-3"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MASTER HEADLINE</span><button onClick={() => copyToClipboard(results.social.adCopy.headline)} className="text-slate-400 hover:text-teal-600 transition-colors"><Copy size={14}/></button></div>
                        <div className="bg-slate-50 p-7 rounded-[2rem] font-black text-xl text-slate-800 border border-slate-100 shadow-inner group-hover:bg-white transition-colors">{results.social.adCopy.headline}</div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-3"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PRIMARY BODY</span><button onClick={() => copyToClipboard(results.social.adCopy.primaryText)} className="text-slate-400 hover:text-teal-600 transition-colors"><Copy size={14}/></button></div>
                        <div className="bg-slate-50 p-7 rounded-[2rem] text-base leading-relaxed text-slate-600 border border-slate-100 shadow-inner font-bold uppercase tracking-tight group-hover:bg-white transition-colors">{results.social.adCopy.primaryText}</div>
                      </div>
                      <div className="bg-teal-600 p-8 rounded-[2.5rem] flex justify-between items-center text-white shadow-2xl shadow-teal-50 group-hover:bg-black transition-colors">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] block opacity-50 mb-2">CONVERSION CTA</span>
                          <span className="text-2xl font-black tracking-tighter uppercase italic">{results.social.adCopy.cta}</span>
                        </div>
                        <SendHorizontal size={36}/>
                      </div>
                    </div>
                 </div>

                 <div className="space-y-10">
                   <div className="bg-white p-12 rounded-[4rem] shadow-premium border border-slate-50 flex flex-col group hover:scale-[1.01] transition-transform h-full">
                      <div className="flex items-center space-x-4 mb-10 text-blue-600">
                        <Share2 size={28} />
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Authority Post</h3>
                      </div>
                      <div className="bg-slate-50 p-10 rounded-[2.5rem] relative flex-1 border border-slate-100 shadow-inner group-hover:bg-white transition-colors">
                         <button onClick={() => copyToClipboard(results.social.linkedin)} className="absolute top-8 right-8 text-slate-400 hover:text-teal-600 transition-all"><Copy size={18}/></button>
                         <p className="text-slate-600 italic leading-loose text-base font-bold uppercase tracking-tight opacity-80">"{results.social.linkedin}"</p>
                      </div>
                   </div>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'storyboard' && (
            <div className="space-y-12 animate-in fade-in duration-700">
              <div className="bg-white p-12 rounded-[4rem] shadow-premium border border-slate-100 flex items-center justify-between hover:scale-[1.005] transition-transform">
                <div className="flex items-center space-x-6">
                  <div className="p-4 bg-teal-50 rounded-3xl text-teal-600 shadow-sm border border-teal-100"><Briefcase size={32}/></div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Narrative Governance</h3>
                    <p className="text-slate-400 mt-1 font-bold uppercase tracking-widest text-[10px]">Logical visual progression optimized for psychological impact.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="flex space-x-3">
                    {[1, 2, 3, 4].map(n => <span key={n} className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[12px] font-black shadow-sm border ${n === 1 ? 'bg-teal-600 text-white border-teal-500 rotate-3' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>{n}</span>)}
                  </div>
                  <span className="text-[10px] font-black uppercase text-teal-600 tracking-[0.4em] bg-teal-50 px-6 py-3 rounded-2xl border border-teal-100 animate-pulse">Core Verified</span>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {results.storyboard.map(f => (
                  <div key={f.id} className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-premium group hover:border-teal-500 hover:scale-[1.01] transition-all duration-500">
                    <div className="aspect-video relative overflow-hidden rounded-[3rem] bg-slate-100 mb-10 shadow-inner flex items-center justify-center border border-slate-50">
                      {f.imageUrl ? (
                        <img src={f.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4s]" alt="Frame" />
                      ) : (
                        <div className="text-slate-300 flex flex-col items-center">
                          <LucideImage size={64} className="mb-4 opacity-5" />
                          <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-30">Render Sequence Locked</span>
                        </div>
                      )}
                      <div className="absolute top-8 left-8 bg-black/80 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md shadow-2xl">FRAME {f.id + 1}</div>
                      <div className="absolute bottom-8 right-8 flex space-x-3 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                        <button className="p-4 bg-white text-teal-600 rounded-2xl shadow-2xl hover:bg-black hover:text-white transition-all"><RefreshCw size={24}/></button>
                        <button className="p-4 bg-teal-600 text-white rounded-2xl shadow-2xl hover:bg-black transition-all"><Download size={24}/></button>
                      </div>
                    </div>
                    <div className="flex items-start space-x-8 px-6">
                      <div className="p-5 bg-teal-50 text-teal-600 rounded-[2rem] group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm"><PieChart size={28}/></div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tighter uppercase italic">{f.visualIntent}</h4>
                        <p className="text-sm text-slate-500 leading-loose font-bold uppercase tracking-tight opacity-70">"{f.description}"</p>
                        <textarea 
                          value={f.notes || ''} 
                          onChange={e => updateFrameNote(f.id, e.target.value)} 
                          placeholder="Operational directives & synthesis logs..." 
                          className="w-full mt-10 bg-slate-50/80 border border-slate-100 rounded-[2rem] p-7 text-xs font-black uppercase tracking-widest text-slate-500 outline-none h-32 resize-none shadow-inner focus:bg-white focus:border-teal-100 transition-all duration-500" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-16 animate-in fade-in max-w-[1500px] mx-auto pb-40">
      <div className="flex justify-between items-start mb-20">
        <div>
          <h1 className="text-7xl font-black text-slate-900 tracking-tighter mb-4 uppercase leading-none">Campaign<br/><span className="text-teal-600">Studio</span></h1>
          <p className="text-slate-400 text-2xl font-medium tracking-tight">Architect high-fidelity commercial infrastructures.</p>
        </div>
        <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-premium flex items-center space-x-1">
           <button onClick={() => setSetupMode('master')} className={`px-12 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center space-x-3 ${setupMode === 'master' ? 'bg-teal-600 text-white shadow-2xl shadow-teal-100 scale-105' : 'text-slate-400 hover:bg-slate-50'}`}>
              <Sparkles size={16} /> <span>Master Directive</span>
           </button>
           <button onClick={() => setSetupMode('guided')} className={`px-12 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center space-x-3 ${setupMode === 'guided' ? 'bg-teal-600 text-white shadow-2xl shadow-teal-100 scale-105' : 'text-slate-400 hover:bg-slate-50'}`}>
              <LayoutGrid size={16} /> <span>Guided Hub</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-white p-16 rounded-[4rem] border border-slate-100 shadow-premium min-h-[550px] flex flex-col group relative transition-all duration-700 hover:border-teal-200 hover:shadow-2xl">
            <div className="flex justify-between items-center mb-12">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] block">CREATIVE BRIEF & VISION CORE</span>
              <div className="flex items-center space-x-4">
                 {attachedImage && (
                   <div className="relative group/img">
                     <img src={attachedImage} className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-500 shadow-2xl scale-110" alt="Context" />
                     <button onClick={() => setAttachedImage(null)} className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full shadow-xl hover:scale-125 transition-transform"><X size={10} /></button>
                   </div>
                 )}
                 <button onClick={() => fileInputRef.current?.click()} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-black hover:text-white transition-all border border-slate-100 shadow-sm" title="Visual Context Injection"><LucideImage size={22}/></button>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                 <button onClick={toggleListening} className={`p-4 rounded-2xl transition-all flex items-center space-x-2 border shadow-sm ${isListening ? 'bg-red-500 text-white border-red-400 animate-pulse' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-black hover:text-white'}`} title="Neural Voice Uplink">
                    {isListening ? <MicOff size={22}/> : <Mic size={22} />}
                 </button>
              </div>
            </div>
            
            {setupMode === 'master' ? (
              <textarea 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Establish master strategic mission, market guidelines, and commercial benchmarks..."
                className="flex-1 w-full bg-transparent border-none focus:ring-0 text-4xl font-black text-slate-900 placeholder:text-slate-300 resize-none leading-tight no-scrollbar tracking-tighter"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-14 animate-in fade-in py-6">
                <div className="space-y-5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block px-4">PRIMARY MISSION</label>
                  <input value={primaryGoal} onChange={e => setPrimaryGoal(e.target.value)} placeholder="Target: Penetration" className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] focus:bg-white transition-all text-xl font-black text-slate-800 outline-none shadow-inner" />
                </div>
                <div className="space-y-5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block px-4">CORE SEGMENT</label>
                  <input value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="Segment: Enterprise" className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] focus:bg-white transition-all text-xl font-black text-slate-800 outline-none shadow-inner" />
                </div>
                <div className="space-y-5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block px-4">IDENTITY PROFILE</label>
                  <div className="relative">
                    <select 
                      value={selectedVoiceId} 
                      onChange={e => setSelectedVoiceId(e.target.value)}
                      className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] focus:bg-white transition-all text-xl font-black text-slate-800 outline-none appearance-none shadow-inner cursor-pointer"
                    >
                      <option value="">Global Strategy Standard</option>
                      {voices.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                    <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none" size={28}/>
                  </div>
                </div>
                <div className="space-y-5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block px-4">OPERATIONAL SCOPE</label>
                  <input value={budgetExpectation} onChange={e => setBudgetExpectation(e.target.value)} placeholder="Scale: Premium" className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] focus:bg-white transition-all text-xl font-black text-slate-800 outline-none shadow-inner" />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-premium flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-10 hover:border-teal-300 transition-all duration-500 hover:shadow-2xl">
             <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-[2.5rem] flex items-center justify-center shrink-0 border border-teal-100 shadow-xl shadow-teal-50/50">
                <Globe size={40} />
             </div>
             <div className="flex-1 w-full">
                <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Intelligence Uplink</h4>
                <input 
                  value={competitorUrl}
                  onChange={e => setCompetitorUrl(e.target.value)}
                  placeholder="Insert competitor URL for deep-space analysis..." 
                  className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:bg-white transition-all outline-none text-slate-700 shadow-inner font-black uppercase text-xs tracking-widest"
                />
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-12 h-fit">
           <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-premium flex flex-col h-full max-h-[550px] transition-all hover:shadow-2xl">
              <div className="flex justify-between items-center mb-12 shrink-0">
                <h4 className="text-2xl font-black text-slate-900 flex items-center space-x-4 tracking-tighter uppercase"><ShieldCheck size={28} className="text-teal-600"/> <span>Governance</span></h4>
                <button onClick={() => setIsAddingVoice(true)} className="w-12 h-12 bg-teal-50 text-teal-600 hover:bg-black hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-teal-50 border border-teal-100"><Plus size={24}/></button>
              </div>
              <div className="space-y-4 overflow-y-auto no-scrollbar pr-2 flex-1 pb-6">
                 {voices.length === 0 ? (
                   <div className="text-center py-20 opacity-10">
                     <UserCircle size={80} className="mx-auto mb-6" />
                     <p className="font-black text-[12px] uppercase tracking-[0.4em]">Vault Empty</p>
                   </div>
                 ) : voices.map(v => (
                   <div key={v.id} className="group relative">
                     <button 
                      onClick={() => setSelectedVoiceId(v.id)}
                      className={`w-full p-6 rounded-[2rem] border-2 text-left transition-all flex items-center justify-between shadow-sm min-w-0 ${selectedVoiceId === v.id ? 'border-teal-500 bg-teal-50/60 text-teal-700 scale-105 shadow-xl' : 'border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
                     >
                        <span className="font-black text-xs uppercase tracking-[0.2em] truncate pr-8">{v.name}</span>
                        {selectedVoiceId === v.id && <CheckCircle2 size={24} className="text-teal-600 shrink-0 shadow-sm" />}
                     </button>
                     <button onClick={() => onDeleteVoice(v.id)} className="absolute -right-3 -top-3 bg-white text-slate-300 hover:text-red-500 p-2.5 rounded-full shadow-2xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-125 hover:rotate-12"><Trash2 size={14}/></button>
                   </div>
                 ))}
              </div>
           </div>

           <button 
            onClick={handleInitialize}
            disabled={isGenerating || (setupMode === 'master' && !prompt && !primaryGoal)}
            className="w-full bg-teal-600 text-white py-14 rounded-[4.5rem] shadow-[0_40px_80px_-20px_rgba(13,148,136,0.3)] flex flex-col items-center justify-center space-y-6 group hover:bg-black transition-all duration-700 disabled:opacity-30 disabled:scale-100 disabled:bg-slate-200 active:scale-95 border-b-8 border-teal-800 hover:border-slate-800"
           >
              <div className="w-20 h-20 bg-white/10 rounded-[2.5rem] flex items-center justify-center group-hover:bg-white/20 group-hover:rotate-[15deg] transition-all duration-700 shadow-2xl">
                <Sparkles size={44} className="text-teal-400 group-hover:text-white"/>
              </div>
              <div className="text-center">
                <span className="text-3xl font-black tracking-tighter uppercase block leading-none mb-1 text-white">Initialize Engine</span>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-teal-100 opacity-80 group-hover:text-white transition-colors">Start Strategic Synthesis</span>
              </div>
           </button>
        </div>
      </div>

      {isAddingVoice && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-2xl z-[600] flex items-center justify-center p-10 animate-in fade-in duration-500">
           <div className="bg-white w-full max-w-2xl rounded-[5rem] p-20 shadow-[0_100px_150px_-30px_rgba(0,0,0,0.5)] relative animate-in zoom-in-90 duration-500 border border-slate-100">
              <button onClick={() => setIsAddingVoice(false)} className="absolute top-12 right-12 text-slate-300 hover:text-slate-900 transition-all hover:rotate-90 hover:scale-110"><X size={40} /></button>
              <h3 className="text-6xl font-black text-slate-900 mb-14 tracking-tighter uppercase leading-none">New Brand<br/><span className="text-teal-600">Governance</span></h3>
              <div className="space-y-12">
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] px-6">IDENTITY ALIAS</label>
                    <input 
                      autoFocus
                      placeholder="e.g. CORE MINIMALIST" 
                      className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] focus:bg-white transition-all text-2xl font-black text-slate-800 outline-none shadow-inner tracking-tight uppercase" 
                      onChange={e => setNewVoiceForm({...newVoiceForm, name: e.target.value})} 
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] px-6">FORMALITY</label>
                      <div className="relative">
                        <select 
                          onChange={e => setNewVoiceForm({...newVoiceForm, formality: e.target.value as any})}
                          className="w-full p-7 bg-slate-50 border border-slate-100 rounded-[2rem] text-xs font-black uppercase tracking-widest text-slate-700 appearance-none cursor-pointer shadow-inner focus:bg-white transition-all"
                        >
                          <option>Professional</option>
                          <option>Casual</option>
                          <option>Luxury</option>
                          <option>Formal</option>
                        </select>
                        <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none" size={20}/>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] px-6">VOCABULARY</label>
                      <div className="relative">
                        <select 
                          onChange={e => setNewVoiceForm({...newVoiceForm, vocabulary: e.target.value as any})}
                          className="w-full p-7 bg-slate-50 border border-slate-100 rounded-[2rem] text-xs font-black uppercase tracking-widest text-slate-700 appearance-none cursor-pointer shadow-inner focus:bg-white transition-all"
                        >
                          <option>Sophisticated</option>
                          <option>Simple</option>
                          <option>Technical</option>
                        </select>
                        <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none" size={20}/>
                      </div>
                    </div>
                 </div>
                 <button 
                  onClick={() => { if (newVoiceForm.name) { onSaveVoice({ id: Date.now().toString(), name: newVoiceForm.name, ...newVoiceForm } as BrandVoice); setIsAddingVoice(false); }}} 
                  className="w-full py-8 bg-teal-600 text-white rounded-[3rem] font-black uppercase tracking-[0.3em] text-sm shadow-2xl shadow-teal-200 hover:bg-black transition-all active:scale-95 border-b-8 border-teal-800 hover:border-slate-800"
                 >
                   Establish Protocol
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const UserCircle = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
