
import React, { useState, useEffect, useRef } from 'react';
import { 
  RefreshCw, FileText, Sparkles, Loader2, Target, 
  Globe, Trash2, X, ImageIcon, Layers, Download, 
  Plus, Send, LayoutGrid, Info, ExternalLink,
  ChevronRight, CheckCircle2, Copy, BarChart3,
  Search, ShieldCheck, Briefcase, Mic, MicOff,
  Image as LucideImage, Wand2, PenLine, SendHorizontal
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
  const [activeTab, setActiveTab] = useState<'strategy' | 'intel' | 'visuals' | 'copy' | 'storyboard'>('strategy');
  
  const [isAddingVoice, setIsAddingVoice] = useState(false);
  const [newVoiceForm, setNewVoiceForm] = useState<Partial<BrandVoice>>({ name: '', formality: 'Professional', vocabulary: 'Sophisticated' });
  const [isListening, setIsListening] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (recalledCampaign) { setResults(recalledCampaign); setActiveTab('strategy'); if (onClearRecall) onClearRecall(); }
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
    setGenStep('Synthesizing strategic directives...');
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
      
      // SEQUENTIAL IMAGE GENERATION: Processes images one by one with a delay to respect rate limits
      const assetPrompts = [
        { type: 'Hero', prompt: data.hero_visual_prompt },
        { type: 'Ad', prompt: data.ad_visual_prompt },
        { type: 'Product', prompt: data.product_visual_prompt },
        { type: 'Lifestyle', prompt: data.lifestyle_visual_prompt }
      ];

      const visualsResults: any[] = [];
      for (const item of assetPrompts) {
        setGenStep(`Rendering visual asset: ${item.type}...`);
        try {
          // Add a small 1s delay between image requests to prevent hitting concurrent limits
          await new Promise(r => setTimeout(r, 1500));
          const img = item.prompt ? await gemini.generateImage(item.prompt, "16:9") : null;
          visualsResults.push({ ...item, imageUrl: img || '' });
        } catch (e) {
          console.error(`Failed to generate image for ${item.type}:`, e);
          visualsResults.push({ ...item, imageUrl: '' });
        }
      }
      
      const storyboardResults: any[] = [];
      for (let i = 0; i < data.storyboard.length; i++) {
        const frame = data.storyboard[i];
        setGenStep(`Sequencing storyboard frame ${i + 1}...`);
        try {
          await new Promise(r => setTimeout(r, 1500));
          const img = await gemini.generateImage(frame.description, "16:9");
          storyboardResults.push({ ...frame, id: i, imageUrl: img || '', notes: '' });
        } catch (e) {
          console.error(`Failed to generate storyboard frame ${i}:`, e);
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
          tags: ['CAMPAIGN LAUNCH'], 
          aspectRatio: "16:9"
        })),
        storyboard: storyboardResults
      };
      
      setResults(campaignResults);
      setActiveTab('strategy');
      
      // Persist to local archive
      const history = JSON.parse(localStorage.getItem('campaign_history') || '[]');
      history.unshift({
        id: Date.now().toString(),
        timestamp: Date.now(),
        prompt: finalPrompt,
        results: campaignResults
      });
      localStorage.setItem('campaign_history', JSON.stringify(history.slice(0, 20)));

    } catch (e: any) {
      console.error("Critical Synthesis failure:", e);
      alert(`Synthesis error: ${e?.message || 'The engine encountered a rate limit. Please try again in 1 minute.'}`);
    } finally {
      setIsGenerating(false);
      setGenStep('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-12 animate-pulse">
        <div className="relative mb-12">
          <Loader2 className="w-20 h-20 text-[#6366f1] animate-spin opacity-50" strokeWidth={1.5} />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400 w-10 h-10" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">Orchestrating Core</h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs px-6 py-2 bg-slate-50 rounded-full border border-slate-100 shadow-sm">{genStep}</p>
        <p className="text-slate-300 font-medium mt-8 max-w-sm text-sm">Please wait while the engine architect high-fidelity visuals. This can take up to 60 seconds.</p>
      </div>
    );
  }

  if (results) {
    return (
      <div className="animate-in fade-in duration-500 pb-20">
        <nav className="sticky top-0 z-40 bg-white border-b border-slate-100 flex items-center justify-center h-16 shadow-sm px-8">
          <div className="flex space-x-12">
            {[
              { id: 'strategy', label: 'STRATEGY', icon: BarChart3 },
              { id: 'intel', label: 'PPC INTEL', icon: Target },
              { id: 'visuals', label: 'VISUALS', icon: LucideImage },
              { id: 'copy', label: 'COPY', icon: FileText },
              { id: 'storyboard', label: 'STORYBOARD', icon: Plus }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)} 
                className={`flex items-center space-x-2.5 py-5 font-bold text-[11px] tracking-[0.15em] transition-all relative ${activeTab === tab.id ? 'text-[#6366f1]' : 'text-slate-400 hover:text-slate-900'}`}
              >
                 <tab.icon size={14} /> <span>{tab.label}</span>
                 {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#6366f1] rounded-full"></div>}
              </button>
            ))}
          </div>
          <button onClick={() => setResults(null)} className="absolute right-8 flex items-center space-x-2 text-slate-300 font-bold text-[9px] uppercase tracking-widest hover:text-red-500 transition-all bg-slate-50 px-4 py-2 rounded-xl">
            <RefreshCw size={12} /> <span>RESTART SESSION</span>
          </button>
        </nav>

        <div className="p-10 space-y-12 max-w-[1400px] mx-auto">
          {activeTab === 'strategy' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4">
               <div className="lg:col-span-8 bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-50">
                  <div className="flex items-center space-x-4 mb-8 text-[#6366f1]">
                    <div className="p-4 bg-indigo-50 rounded-2xl"><BarChart3 size={32} /></div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Creative Direction</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-wrap">{results.strategy}</p>
               </div>
               <div className="lg:col-span-4 bg-[#6366f1] p-10 rounded-[2.5rem] text-white shadow-xl h-fit">
                  <h4 className="text-xl font-bold mb-8 uppercase tracking-widest text-[10px] opacity-60">Strategic Directives</h4>
                  <div className="space-y-4">
                    {results.ctas?.map((cta, i) => (
                      <div key={i} className="bg-white/10 p-6 rounded-2xl border border-white/20 font-bold italic text-base hover:bg-white/20 transition-all cursor-pointer shadow-sm">
                        "{cta}"
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'intel' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
               {results.ppc?.map((item, i) => (
                 <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full group hover:border-[#6366f1] transition-all">
                    <div className="flex justify-between items-start mb-8">
                      <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{item.platform}</h4>
                      <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-full group-hover:bg-[#6366f1] group-hover:text-white transition-colors"><Target size={16}/></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">AVG. CPC</span>
                        <span className="text-lg font-black text-indigo-600">{item.avgCPC}</span>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">BENCHMARK</span>
                        <span className="text-[11px] font-black text-emerald-600 leading-tight block">{item.benchmark}</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 text-slate-500 mb-8 flex-1">
                      <Info size={16} className="shrink-0 mt-1 opacity-40" />
                      <p className="text-xs leading-relaxed font-medium">{item.justification}</p>
                    </div>
                    <div className="pt-6 border-t border-slate-50">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-4">PLATFORM METRICS</span>
                      <div className="space-y-2">
                        {item.performanceIndicators?.map((kpi, kIdx) => (
                          <div key={kIdx} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-slate-400">{kpi.label}</span>
                            <span className="text-slate-900">{kpi.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'visuals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
              {results.visuals.map((v, i) => (
                <div key={v.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden group">
                  <div className="relative aspect-video bg-slate-50 flex items-center justify-center overflow-hidden">
                    {v.imageUrl ? (
                      <img src={v.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Asset" />
                    ) : (
                      <div className="text-slate-300 flex flex-col items-center">
                        <Loader2 className="mb-2 animate-spin" size={32} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Asset Unavailable</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      <button className="p-3 bg-white text-indigo-600 rounded-xl shadow-lg hover:bg-indigo-600 hover:text-white transition-all"><Wand2 size={20}/></button>
                      <button className="p-3 bg-white text-emerald-600 rounded-xl shadow-lg hover:bg-emerald-600 hover:text-white transition-all"><PenLine size={20}/></button>
                      <button className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-black transition-all"><SendHorizontal size={20}/></button>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-2">
                        <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-lg tracking-widest">{v.type}</span>
                        <span className="text-[10px] font-black uppercase bg-slate-50 text-slate-500 px-4 py-1.5 rounded-lg tracking-widest">PRODUCTION GRADE</span>
                      </div>
                      <button className="text-slate-300 hover:text-indigo-600 transition-colors" title="Download Asset"><Download size={24}/></button>
                    </div>
                    <p className="text-slate-600 italic font-medium leading-relaxed">"{v.prompt}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'copy' && (
            <div className="space-y-10 animate-in fade-in">
               <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50">
                  <div className="flex items-center space-x-3 mb-8 text-indigo-600">
                    <FileText size={24} />
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Editorial Repository</h3>
                  </div>
                  <div className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 shadow-inner">
                    <h4 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">{results.blog?.title}</h4>
                    <p className="text-slate-600 text-base leading-relaxed mb-8 font-medium">{results.blog?.content}</p>
                    <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                      <button className="bg-[#6366f1] text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 hover:bg-black transition-all shadow-lg active:scale-95"><SendHorizontal size={18}/> <span className="uppercase tracking-widest text-xs">Deploy Payload</span></button>
                      <button onClick={() => copyToClipboard(results.blog?.content)} className="text-slate-400 text-xs font-bold flex items-center space-x-2 hover:text-indigo-600 transition-colors uppercase tracking-widest"><Copy size={14}/> <span>Copy Directive</span></button>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50">
                    <div className="flex items-center space-x-3 mb-8 text-orange-500">
                      <Send size={24} />
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Commercial Ad Copy</h3>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HEADLINE</span><button onClick={() => copyToClipboard(results.social.adCopy.headline)} className="text-slate-400 hover:text-indigo-600"><Copy size={12}/></button></div>
                        <div className="bg-slate-50 p-5 rounded-2xl font-bold text-slate-700 border border-slate-100 shadow-inner">{results.social.adCopy.headline}</div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PRIMARY BODY</span><button onClick={() => copyToClipboard(results.social.adCopy.primaryText)} className="text-slate-400 hover:text-indigo-600"><Copy size={12}/></button></div>
                        <div className="bg-slate-50 p-5 rounded-2xl text-sm leading-relaxed text-slate-600 border border-slate-100 shadow-inner font-medium">{results.social.adCopy.primaryText}</div>
                      </div>
                      <div className="bg-[#6366f1] p-6 rounded-[2rem] flex justify-between items-center text-white shadow-xl">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-widest block opacity-70 mb-1">CONVERSION CTA</span>
                          <span className="text-xl font-black">{results.social.adCopy.cta}</span>
                        </div>
                        <SendHorizontal size={28}/>
                      </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                   <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 flex flex-col h-full">
                      <div className="flex items-center space-x-3 mb-8 text-blue-600">
                        <PenLine size={24} />
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Corporate Identity Post</h3>
                      </div>
                      <div className="bg-slate-50 p-8 rounded-[2.5rem] relative flex-1 border border-slate-100 shadow-inner">
                         <button onClick={() => copyToClipboard(results.social.linkedin)} className="absolute top-6 right-6 text-slate-400 hover:text-indigo-600 transition-colors"><Copy size={16}/></button>
                         <p className="text-slate-600 italic leading-relaxed text-sm whitespace-pre-wrap font-medium">"{results.social.linkedin}"</p>
                      </div>
                   </div>
                   <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50">
                      <div className="flex items-center space-x-3 mb-8 text-emerald-500">
                        <ShieldCheck size={24} />
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Social Engagement Hooks</h3>
                      </div>
                      <div className="space-y-4">
                        {results.social.socialHooks.map((hook, i) => (
                          <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex justify-between items-center group shadow-sm hover:border-indigo-100 transition-all">
                            <p className="text-xs text-slate-600 italic font-bold flex-1 pr-6 line-clamp-2">"{hook}"</p>
                            <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                              <SendHorizontal size={16} className="text-indigo-600 cursor-pointer hover:scale-110 transition-transform" />
                              <Copy size={16} className="text-slate-400 cursor-pointer hover:text-indigo-600 hover:scale-110 transition-transform" onClick={() => copyToClipboard(hook)} />
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'storyboard' && (
            <div className="space-y-10 animate-in fade-in">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Narrative Architecture</h3>
                  <p className="text-slate-500 mt-1 font-medium">Visual sequence optimized for high-conversion storytelling.</p>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4].map(n => <span key={n} className={`w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black ${n === 1 ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>{n}</span>)}
                  </div>
                  <span className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em] bg-indigo-50 px-4 py-2 rounded-lg">Sequence Verified</span>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {results.storyboard.map(f => (
                  <div key={f.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm group hover:border-[#6366f1] transition-all">
                    <div className="aspect-video relative overflow-hidden rounded-[2.5rem] bg-slate-100 mb-8 shadow-inner flex items-center justify-center">
                      {f.imageUrl ? (
                        <img src={f.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" alt="Frame" />
                      ) : (
                        <div className="text-slate-300 flex flex-col items-center">
                          <LucideImage size={48} className="mb-2 opacity-10" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Frame Render Pending</span>
                        </div>
                      )}
                      <div className="absolute top-6 left-6 bg-black/80 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">FRAME {f.id + 1}</div>
                      <div className="absolute bottom-6 right-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-3 bg-white text-indigo-600 rounded-xl shadow-xl hover:bg-black hover:text-white transition-all"><RefreshCw size={20}/></button>
                        <button className="p-3 bg-indigo-600 text-white rounded-xl shadow-xl hover:bg-black transition-all"><Download size={20}/></button>
                      </div>
                    </div>
                    <div className="flex items-start space-x-6 px-4">
                      <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-[#6366f1] group-hover:text-white transition-colors"><Briefcase size={24}/></div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-slate-900 mb-2 tracking-tight uppercase italic">{f.visualIntent}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.description}</p>
                        <textarea 
                          value={f.notes || ''} 
                          onChange={e => updateFrameNote(f.id, e.target.value)} 
                          placeholder="Operational directives..." 
                          className="w-full mt-6 bg-slate-50/50 border border-slate-100 rounded-2xl p-5 text-xs font-medium text-slate-600 outline-none h-24 resize-none shadow-inner focus:bg-white transition-all" 
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
    <div className="p-12 animate-in fade-in max-w-[1400px] mx-auto pb-40">
      <div className="flex justify-between items-start mb-16">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-3 uppercase">Campaign Studio</h1>
          <p className="text-slate-400 text-xl font-medium tracking-tight">Architect high-fidelity marketing infrastructures.</p>
        </div>
        <div className="bg-white p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center">
           <button onClick={() => setSetupMode('master')} className={`px-10 py-3.5 rounded-[1.2rem] text-xs font-black uppercase tracking-widest transition-all flex items-center space-x-3 ${setupMode === 'master' ? 'bg-[#4f46e5] text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}>
              <Sparkles size={16} /> <span>Master Directive</span>
           </button>
           <button onClick={() => setSetupMode('guided')} className={`px-10 py-3.5 rounded-[1.2rem] text-xs font-black uppercase tracking-widest transition-all flex items-center space-x-3 ${setupMode === 'guided' ? 'bg-[#4f46e5] text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}>
              <LayoutGrid size={16} /> <span>Guided Hub</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white p-14 rounded-[3.5rem] border border-slate-100 shadow-premium min-h-[480px] flex flex-col group relative transition-all hover:border-indigo-100">
            <div className="flex justify-between items-center mb-10">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] block">CREATIVE BRIEF & MISSION</span>
              <div className="flex items-center space-x-3">
                 {attachedImage && (
                   <div className="relative group/img">
                     <img src={attachedImage} className="w-10 h-10 rounded-lg object-cover border-2 border-[#6366f1] shadow-lg" alt="Context" />
                     <button onClick={() => setAttachedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-sm hover:scale-110 transition-transform"><X size={8} /></button>
                   </div>
                 )}
                 <button onClick={() => fileInputRef.current?.click()} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-black hover:text-white transition-all border border-slate-100" title="Attach Visual Context"><LucideImage size={20}/></button>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                 <button onClick={toggleListening} className={`p-2.5 rounded-xl transition-all flex items-center space-x-2 border ${isListening ? 'bg-red-500 text-white border-red-400 animate-pulse' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-black hover:text-white'}`} title="Voice Command Synthesis">
                    {isListening ? <MicOff size={20}/> : <Mic size={20} />}
                 </button>
              </div>
            </div>
            
            {setupMode === 'master' ? (
              <textarea 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Establish master strategic mission, target demographics, and commercial guidelines..."
                className="flex-1 w-full bg-transparent border-none focus:ring-0 text-3xl font-black text-slate-900 placeholder:text-slate-100 resize-none leading-tight no-scrollbar"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 animate-in fade-in py-4">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block px-2">PRIMARY MISSION</label>
                  <input value={primaryGoal} onChange={e => setPrimaryGoal(e.target.value)} placeholder="e.g. Sales Conversion" className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white transition-all text-xl font-bold text-slate-700 outline-none shadow-inner" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block px-2">CORE AUDIENCE</label>
                  <input value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="e.g. CMOs at SaaS companies" className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white transition-all text-xl font-bold text-slate-700 outline-none shadow-inner" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block px-2">IDENTITY PROFILE</label>
                  <div className="relative">
                    <select 
                      value={selectedVoiceId} 
                      onChange={e => setSelectedVoiceId(e.target.value)}
                      className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white transition-all text-xl font-bold text-slate-700 outline-none appearance-none shadow-inner cursor-pointer"
                    >
                      <option value="">Standard Strategic Identity</option>
                      {voices.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none" size={24}/>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block px-2">BUDGETARY SCOPE</label>
                  <input value={budgetExpectation} onChange={e => setBudgetExpectation(e.target.value)} placeholder="e.g. $5k - $20k" className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white transition-all text-xl font-bold text-slate-700 outline-none shadow-inner" />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-premium flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 hover:border-indigo-100 transition-colors">
             <div className="w-16 h-16 bg-indigo-50 text-[#6366f1] rounded-3xl flex items-center justify-center shrink-0 border border-indigo-100 shadow-sm">
                <Globe size={32} />
             </div>
             <div className="flex-1 w-full">
                <h4 className="text-xl font-bold text-slate-900 mb-1 tracking-tight uppercase">Intelligence Feed</h4>
                <input 
                  value={competitorUrl}
                  onChange={e => setCompetitorUrl(e.target.value)}
                  placeholder="Competitor URL for deep analysis (e.g. brand.com)" 
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white transition-all outline-none text-slate-700 shadow-inner font-medium text-base"
                />
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10 h-fit">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-premium flex flex-col h-full max-h-[480px]">
              <div className="flex justify-between items-center mb-10 shrink-0">
                <h4 className="text-xl font-bold text-slate-900 flex items-center space-x-3 tracking-tight uppercase"><ShieldCheck size={24} className="text-[#6366f1]"/> <span>Identity Vault</span></h4>
                <button onClick={() => setIsAddingVoice(true)} className="w-10 h-10 bg-indigo-50 text-[#6366f1] hover:bg-black hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm border border-indigo-100"><Plus size={20}/></button>
              </div>
              <div className="space-y-3 overflow-y-auto no-scrollbar pr-2 flex-1 pb-4">
                 {voices.length === 0 ? (
                   <div className="text-center py-16 opacity-10">
                     <UserCircle size={64} className="mx-auto mb-4" />
                     <p className="font-black text-[10px] uppercase tracking-widest">No Identities Stored</p>
                   </div>
                 ) : voices.map(v => (
                   <div key={v.id} className="group relative">
                     <button 
                      onClick={() => setSelectedVoiceId(v.id)}
                      className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between shadow-sm min-w-0 ${selectedVoiceId === v.id ? 'border-[#6366f1] bg-indigo-50/40 text-[#6366f1]' : 'border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
                     >
                        <span className="font-black text-xs uppercase tracking-widest truncate pr-6">{v.name}</span>
                        {selectedVoiceId === v.id && <CheckCircle2 size={20} className="text-[#6366f1] shrink-0" />}
                     </button>
                     <button onClick={() => onDeleteVoice(v.id)} className="absolute -right-2 -top-2 bg-white text-slate-300 hover:text-red-500 p-1.5 rounded-full shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"><Trash2 size={12}/></button>
                   </div>
                 ))}
              </div>
           </div>

           <button 
            onClick={handleInitialize}
            disabled={isGenerating || (setupMode === 'master' && !prompt && !primaryGoal)}
            className="w-full bg-[#0f172a] text-white py-12 rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.4)] flex flex-col items-center justify-center space-y-5 group hover:bg-[#1e293b] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 disabled:bg-slate-300 active:scale-95"
           >
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center group-hover:bg-white/10 group-hover:rotate-12 transition-all duration-500">
                <Sparkles size={36} className="text-white"/>
              </div>
              <span className="text-2xl font-black tracking-tight uppercase">Initialize Engine</span>
           </button>
        </div>
      </div>

      {isAddingVoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[600] flex items-center justify-center p-8 animate-in fade-in">
           <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-16 shadow-2xl relative animate-in zoom-in-95 duration-300">
              <button onClick={() => setIsAddingVoice(false)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-900 transition-all hover:rotate-90"><X size={32} /></button>
              <h3 className="text-4xl font-black text-slate-900 mb-10 tracking-tighter uppercase">New Brand Identity</h3>
              <div className="space-y-10">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">IDENTITY NAME</label>
                    <input 
                      autoFocus
                      placeholder="e.g. Modern Minimalist" 
                      className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white transition-all text-xl font-bold text-slate-700 outline-none shadow-inner" 
                      onChange={e => setNewVoiceForm({...newVoiceForm, name: e.target.value})} 
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">FORMALITY</label>
                      <div className="relative">
                        <select 
                          onChange={e => setNewVoiceForm({...newVoiceForm, formality: e.target.value as any})}
                          className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 appearance-none cursor-pointer"
                        >
                          <option>Professional</option>
                          <option>Casual</option>
                          <option>Luxury</option>
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none" size={16}/>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">VOCABULARY</label>
                      <div className="relative">
                        <select 
                          onChange={e => setNewVoiceForm({...newVoiceForm, vocabulary: e.target.value as any})}
                          className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 appearance-none cursor-pointer"
                        >
                          <option>Sophisticated</option>
                          <option>Simple</option>
                          <option>Technical</option>
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none" size={16}/>
                      </div>
                    </div>
                 </div>
                 <button 
                  onClick={() => { if (newVoiceForm.name) { onSaveVoice({ id: Date.now().toString(), name: newVoiceForm.name, ...newVoiceForm } as BrandVoice); setIsAddingVoice(false); }}} 
                  className="w-full py-7 bg-[#6366f1] text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-indigo-100 hover:bg-black transition-all active:scale-95"
                 >
                   Sync Identity Profile
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
