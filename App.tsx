
import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  History as HistoryIcon, 
  Settings, 
  Menu,
  Activity,
  LayoutGrid,
  Share2,
  Search,
  Loader2,
  Package,
  Command,
  HelpCircle
} from 'lucide-react';
import { CampaignLab } from './views/CampaignLab';
import { AutomationHub } from './views/AutomationHub';
import { CampaignHistoryView } from './views/CampaignHistoryView';
import { BrandVoice, CampaignContent } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lab' | 'automation' | 'history' | 'settings'>('lab');
  const [brandVoices, setBrandVoices] = useState<BrandVoice[]>([]);
  const [recalledCampaign, setRecalledCampaign] = useState<CampaignContent | null>(null);
  const [prefilledPrompt, setPrefilledPrompt] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('campaign_brand_voices');
    if (saved) setBrandVoices(JSON.parse(saved));
  }, []);

  const saveBrandVoice = (voice: BrandVoice) => {
    setBrandVoices(prev => {
      const updated = [...prev, voice];
      localStorage.setItem('campaign_brand_voices', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteBrandVoice = (id: string) => {
    setBrandVoices(prev => {
      const updated = prev.filter(v => v.id !== id);
      localStorage.setItem('campaign_brand_voices', JSON.stringify(updated));
      return updated;
    });
  };

  const NavItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-2xl transition-all duration-200 group mb-2 ${
        activeTab === id 
          ? 'bg-[#efeffd] text-[#6366f1]' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon size={18} className={activeTab === id ? 'text-[#6366f1]' : 'text-slate-400 group-hover:text-slate-600'} />
      <span className="font-bold text-xs tracking-tight">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col z-50 shrink-0">
        <div className="p-8 flex items-center space-x-4 mb-8">
          <div className="w-10 h-10 bg-[#4f46e5] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
             <Package className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 leading-none">Campaign Lab</span>
        </div>

        <nav className="flex-1 px-6">
          <NavItem id="lab" label="Studio" icon={LayoutGrid} />
          <NavItem id="automation" label="Automation" icon={Zap} />
          <NavItem id="history" label="History" icon={HistoryIcon} />
        </nav>

        <div className="px-6 py-10 mt-auto">
          {/* Plan Info Card */}
          <div className="bg-[#f8fafc] p-6 rounded-[2rem] border border-slate-100 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">AGENCY PLAN</span>
              <span className="text-[10px] font-bold text-indigo-600">67%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#6366f1] h-full w-[67%]"></div>
            </div>
            <p className="text-[9px] font-bold text-slate-400 mt-3">24/50 Campaigns used</p>
          </div>
          
          <button className="flex items-center space-x-3 w-full px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all">
            <Settings size={18} />
            <span className="font-bold text-xs tracking-tight">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-auto custom-scrollbar">
          {activeTab === 'lab' && (
            <CampaignLab 
              voices={brandVoices} 
              onSaveVoice={saveBrandVoice} 
              onDeleteVoice={deleteBrandVoice}
              recalledCampaign={recalledCampaign}
              onClearRecall={() => setRecalledCampaign(null)}
              prefilledPrompt={prefilledPrompt}
              onClearPrefilled={() => setPrefilledPrompt(null)}
            />
          )}
          {activeTab === 'automation' && <AutomationHub />}
          {activeTab === 'history' && <CampaignHistoryView onRecall={(c) => { setRecalledCampaign(c); setActiveTab('lab'); }} />}
          {activeTab === 'settings' && <div className="p-8 flex items-center justify-center h-full text-slate-300 font-bold uppercase tracking-widest text-[10px]">Syncing User Profile...</div>}
        </div>
      </main>
    </div>
  );
};

export default App;
